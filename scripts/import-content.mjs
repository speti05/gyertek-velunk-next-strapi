/**
 * Imports articles / blogs / events from a content export into a target Strapi.
 *
 * Upsert by slug: an entry that already exists on the target is updated, a missing
 * one is created. Nothing is ever deleted, so event signups, contact requests,
 * newsletter signups and users on the target are untouched.
 *
 * Media referenced by the export is matched on the target by hash, then by name.
 * Anything still missing is uploaded from the local uploads directory.
 *
 * Dry run by default - pass --apply to actually write.
 *
 *   node scripts/import-content.mjs --target http://localhost:1337 --out exports/payloads
 *   node scripts/import-content.mjs --target https://api.example.com --token XXX --apply
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Reads STRAPI_IMPORT_TOKEN (and anything else) out of client/.env.local, which plain
 * node does not load on its own - only Next does. A value already present in the real
 * environment wins, so `STRAPI_IMPORT_TOKEN=... node scripts/import-content.mjs` and
 * --token both still override the file.
 */
function loadLocalEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (line.trimStart().startsWith("#")) continue;
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    const value = rawValue.trim().replace(/^(['"])(.*)\1$/, "$2");
    if (value) process.env[key] = value;
  }
}

loadLocalEnv(path.join(ROOT, "client/.env.local"));

const SYSTEM_FIELDS = ["id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale", "localizations"];
const DEFAULT_COLLECTIONS = ["articles", "blogs", "events"];

function parseArgs(argv) {
  const args = { apply: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--apply") args.apply = true;
    else if (arg.startsWith("--")) args[arg.slice(2)] = argv[++i];
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
const FILE = path.resolve(ROOT, args.file || "exports/content-export.json");
const TARGET = (args.target || "").replace(/\/$/, "");
const TOKEN = args.token || process.env.STRAPI_IMPORT_TOKEN || "";
const UPLOADS_DIR = path.resolve(ROOT, args.uploads || "server/public/uploads");
const COLLECTIONS = args.collections ? args.collections.split(",") : DEFAULT_COLLECTIONS;
const APPLY = args.apply;
const OUT_DIR = args.out ? path.resolve(ROOT, args.out) : null;

if (!TARGET) {
  console.error("Missing --target <strapi base url>");
  process.exit(1);
}
if (APPLY && !TOKEN) {
  console.error("Missing --token (or STRAPI_IMPORT_TOKEN) - required with --apply");
  process.exit(1);
}

const authHeaders = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};

async function api(pathname, init = {}) {
  const res = await fetch(`${TARGET}${pathname}`, {
    ...init,
    headers: { ...authHeaders, ...(init.headers || {}) },
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 400) };
  }
  if (!res.ok) {
    const error = new Error(`${init.method || "GET"} ${pathname} -> ${res.status} ${JSON.stringify(json).slice(0, 600)}`);
    error.status = res.status;
    throw error;
  }
  return json;
}

const isMedia = (value) =>
  !!value && typeof value === "object" && typeof value.url === "string" && typeof value.mime === "string";

const mediaCache = new Map();
const uploadedNow = [];
const missingFiles = [];
const unverifiedMedia = new Set();

async function resolveMedia(media) {
  const key = media.hash || media.name;
  if (mediaCache.has(key)) return mediaCache.get(key);

  // Prefer the content hash, fall back to the file name: Strapi assigns a fresh
  // hash on upload, so a re-run only finds a previously uploaded file by name.
  for (const [field, value] of [["hash", media.hash], ["name", media.name]]) {
    if (!value) continue;
    let found;
    try {
      found = await api(`/api/upload/files?filters[${field}][$eq]=${encodeURIComponent(value)}`);
    } catch (error) {
      // The upload plugin never lists files publicly. Without a token we can still
      // preview the create/update plan, we just cannot resolve media ids.
      if (!APPLY && (error.status === 401 || error.status === 403)) {
        unverifiedMedia.add(media.name);
        mediaCache.set(key, `UNVERIFIED:${media.name}`);
        return `UNVERIFIED:${media.name}`;
      }
      throw error;
    }
    if (Array.isArray(found) && found.length > 0) {
      mediaCache.set(key, found[0].id);
      return found[0].id;
    }
  }

  const localName = `${media.hash}${media.ext}`;
  const localPath = path.join(UPLOADS_DIR, localName);
  if (!fs.existsSync(localPath)) {
    missingFiles.push(`${media.name} (${localName})`);
    mediaCache.set(key, null);
    return null;
  }

  if (!APPLY) {
    uploadedNow.push(`${media.name} [dry-run]`);
    mediaCache.set(key, `NEW:${media.name}`);
    return `NEW:${media.name}`;
  }

  const form = new FormData();
  form.append("files", new Blob([fs.readFileSync(localPath)], { type: media.mime }), media.name);
  form.append(
    "fileInfo",
    JSON.stringify({
      name: media.name,
      alternativeText: media.alternativeText ?? null,
      caption: media.caption ?? null,
    })
  );
  const uploaded = await api("/api/upload", { method: "POST", body: form });
  const id = uploaded[0].id;
  uploadedNow.push(media.name);
  mediaCache.set(key, id);
  return id;
}

/** Rewrites an exported value into a create/update payload for the target. */
async function toPayload(value, { stripId }) {
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(await toPayload(item, { stripId }));
    return out;
  }
  if (!value || typeof value !== "object") return value;
  if (isMedia(value)) return await resolveMedia(value);

  const out = {};
  for (const [key, entryValue] of Object.entries(value)) {
    if (SYSTEM_FIELDS.includes(key)) continue;
    // Component ids belong to the source database; let the target create its own.
    if (stripId && key === "id") continue;
    out[key] = await toPayload(entryValue, { stripId: true });
  }
  return out;
}

async function findExisting(collection, slug) {
  const query = `filters[slug][$eq]=${encodeURIComponent(slug)}&status=draft&fields[0]=id&pagination[pageSize]=2`;
  const res = await api(`/api/${collection}?${query}`);
  return res.data?.[0]?.documentId ?? null;
}

const summary = [];

async function importEntry(collection, entry, status) {
  const data = await toPayload(entry, { stripId: false });
  const existing = await findExisting(collection, entry.slug);
  const action = existing ? "update" : "create";

  if (OUT_DIR) {
    const dir = path.join(OUT_DIR, collection);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${entry.slug}.json`), JSON.stringify({ data }, null, 2), "utf8");
  }

  if (!APPLY) {
    summary.push(`  ${action.padEnd(6)} ${collection}/${entry.slug} (status=${status})`);
    return;
  }

  const qs = `?status=${status}`;
  if (existing) {
    await api(`/api/${collection}/${existing}${qs}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
  } else {
    await api(`/api/${collection}${qs}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
  }
  summary.push(`  ${action.padEnd(6)} ${collection}/${entry.slug} (status=${status})`);
}

const exported = JSON.parse(fs.readFileSync(FILE, "utf8"));

console.log(`source file : ${FILE}`);
console.log(`exported at : ${exported.exportedAt} (from ${exported.source})`);
console.log(`target      : ${TARGET}`);
console.log(`mode        : ${APPLY ? "APPLY - writing to target" : "DRY RUN - no writes"}\n`);

if (!TOKEN) {
  console.log(
    "No token given: existence checks run as the public role, which cannot see entries\n" +
      "flagged as disabled. Such entries are reported as 'create' even when they already\n" +
      "exist on the target. Pass --token <full-access token> for an accurate plan.\n"
  );
}

for (const collection of COLLECTIONS) {
  const bucket = exported.collections[collection];
  if (!bucket) {
    console.log(`${collection}: not present in the export, skipped`);
    continue;
  }
  console.log(`${collection}:`);
  for (const entry of bucket.published) await importEntry(collection, entry, "published");
  for (const entry of bucket.draftOnly) await importEntry(collection, entry, "draft");
  console.log(summary.splice(0).join("\n"));
}

console.log(`\nmedia resolved : ${mediaCache.size}`);
if (unverifiedMedia.size) {
  console.log(
    `media unverified : ${unverifiedMedia.size} - no token given, so /api/upload/files could not be read`
  );
}
if (uploadedNow.length) console.log(`media uploaded : ${uploadedNow.length}\n  ${uploadedNow.join("\n  ")}`);
if (missingFiles.length) {
  console.log(`\nMISSING local files (references will be empty):\n  ${missingFiles.join("\n  ")}`);
  process.exitCode = 1;
}
if (!APPLY) console.log("\nNothing was written. Re-run with --apply --token <token> to perform the import.");
