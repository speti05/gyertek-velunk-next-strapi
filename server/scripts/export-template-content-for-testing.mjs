/**
 * Exports the current articles / blogs / events into a single importable file.
 *
 * Runs inside Strapi and reads through the Document Service, which means it needs no
 * running server and no API token, and it is not affected by the hide-disabled-content
 * middleware - entries flagged as disabled end up in the export like any other.
 *
 * The output is what scripts/import-content.mjs consumes.
 *
 *   node server/scripts/export-template-content-for-testing.mjs
 *   node server/scripts/export-template-content-for-testing.mjs --out exports/my-export.json
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// The ESM build of @strapi/core has an unresolvable directory import (lodash/fp), so the
// CommonJS entry is used instead.
const { createStrapi, compileStrapi } = createRequire(import.meta.url)("@strapi/strapi");

const SERVER_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.resolve(SERVER_DIR, "..");

const COLLECTIONS = [
  { key: "articles", uid: "api::article.article" },
  { key: "blogs", uid: "api::blog.blog" },
  { key: "events", uid: "api::event.event" },
];

// Everything the front-end renders. `eventSignups` is deliberately left out: signups
// belong to the target environment, not to the content being moved.
const POPULATE = { image: true, blocks: { populate: "*" } };

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) args[argv[i].slice(2)] = argv[++i];
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const OUT = path.resolve(ROOT, args.out || "exports/content-export.json");

process.chdir(SERVER_DIR);

const app = await createStrapi(await compileStrapi()).load();

try {
  const collections = {};

  for (const { key, uid } of COLLECTIONS) {
    const published = await app.documents(uid).findMany({
      status: "published",
      populate: POPULATE,
      sort: "slug:asc",
      limit: -1,
    });
    const drafts = await app.documents(uid).findMany({
      status: "draft",
      populate: POPULATE,
      sort: "slug:asc",
      limit: -1,
    });

    // A document that was never published has no published version - carry it over as a
    // draft so nothing silently disappears from the export.
    const publishedIds = new Set(published.map((entry) => entry.documentId));
    const draftOnly = drafts.filter((entry) => !publishedIds.has(entry.documentId));

    collections[key] = { published, draftOnly };

    const disabled = [...published, ...draftOnly].filter((entry) => entry.disabled).length;
    console.log(
      `${key.padEnd(9)} published=${published.length} draftOnly=${draftOnly.length} (disabled: ${disabled})`
    );
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    source: "document-service",
    collections,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`\nwritten: ${path.relative(ROOT, OUT)} (${fs.statSync(OUT).size} bytes)`);
} finally {
  await app.destroy();
}
