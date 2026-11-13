#!/usr/bin/env node
/**
 * Builds the two SQLite databases the e2e tests start from, out of the local dev database
 * (server/.tmp/data.db), so they can be committed and always match the current schema:
 *
 *   e2e/fixtures/data.db             - every piece of content
 *   e2e/fixtures/data-no-content.db  - only what the site needs to come up: pages, the
 *                                      global / home page / site settings single types and
 *                                      the media library (the same cut as
 *                                      deployment/build-live-seed.py). No articles, blogs,
 *                                      events or newsletters.
 *
 * Both are stripped of personal data and credentials - the repo is public: admin and
 * end users, signups, contact requests, sessions, API / transfer tokens and the content
 * history (which can hold old copies of any of these). The media files themselves live in
 * server/public/uploads and are not part of either database.
 *
 * Run from the repo root:  yarn e2e:snapshot   (or: node scripts/build-test-dbs.mjs)
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SERVER_DIR = path.join(ROOT, "server");
const SOURCE = path.join(SERVER_DIR, process.env.SOURCE_DB ?? ".tmp/data.db");
const OUT_DIR = path.join(ROOT, "e2e/fixtures");
const FULL = path.join(OUT_DIR, "data.db");
const NO_CONTENT = path.join(OUT_DIR, "data-no-content.db");

/** Personal data and credentials: emptied in both databases */
const PRIVATE_TABLES = [
  "admin_users",
  "up_users",
  "contact_requests",
  "event_signups",
  "newsletter_signups",
  "strapi_sessions",
  "strapi_api_tokens",
  "strapi_transfer_tokens",
  "strapi_history_versions",
];

/** The content types the no-content database keeps */
const NO_CONTENT_KEEP = new Set(["api::page.page", "api::global.global", "api::home-page.home-page", "api::site-setting.site-setting"]);

const Database = createRequire(path.join(SERVER_DIR, "package.json"))("better-sqlite3");

/** @param {string} dir @returns {string[]} */
const jsonFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? jsonFiles(full) : name.endsWith(".json") ? [full] : [];
  });

/** uid -> table, for the API content types (api::article.article) and the components (blocks.heading) */
const tables = new Map();
for (const file of jsonFiles(path.join(SERVER_DIR, "src/api"))) {
  const match = file.match(/[\\/]api[\\/]([^\\/]+)[\\/]content-types[\\/]([^\\/]+)[\\/]schema\.json$/);
  if (match) tables.set(`api::${match[1]}.${match[2]}`, JSON.parse(readFileSync(file, "utf8")).collectionName);
}
const componentsDir = path.join(SERVER_DIR, "src/components");
for (const file of jsonFiles(componentsDir)) {
  const uid = path.relative(componentsDir, file).replace(/\\/g, "/").replace(/\.json$/, "").replace("/", ".");
  tables.set(uid, JSON.parse(readFileSync(file, "utf8")).collectionName);
}
const componentTables = new Map([...tables].filter(([uid]) => !uid.startsWith("api::")));

/** @param {import("better-sqlite3").Database} db */
const tableNames = (db) =>
  new Set(db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((r) => /** @type {{name: string}} */ (r).name));

/** @param {import("better-sqlite3").Database} db @param {string} table */
const clear = (db, table) => {
  if (tableNames(db).has(table)) db.prepare(`DELETE FROM "${table}"`).run();
};

/**
 * Deleting an entity cascades to its link and component-join rows (foreign keys), but
 * leaves the component rows and the media relations behind - remove those here.
 * @param {import("better-sqlite3").Database} db
 */
const removeOrphans = (db) => {
  const existing = tableNames(db);
  const joinTables = [...existing].filter((t) => t.endsWith("_cmps"));
  for (;;) {
    let removed = 0;
    for (const [uid, table] of componentTables) {
      if (!existing.has(table)) continue;
      const used = joinTables.map((j) => `SELECT cmp_id FROM "${j}" WHERE component_type = @uid`).join(" UNION ");
      removed += db.prepare(`DELETE FROM "${table}" WHERE id NOT IN (${used})`).run({ uid }).changes;
      // A deleted component takes its own nested components' join rows with it
      if (existing.has(`${table}_cmps`)) {
        removed += db.prepare(`DELETE FROM "${table}_cmps" WHERE entity_id NOT IN (SELECT id FROM "${table}")`).run().changes;
      }
    }
    if (removed === 0) break;
  }
  for (const { related_type: type } of db.prepare("SELECT DISTINCT related_type FROM files_related_mph").all()) {
    const table = tables.get(type);
    if (table && existing.has(table)) {
      db.prepare(`DELETE FROM files_related_mph WHERE related_type = ? AND related_id NOT IN (SELECT id FROM "${table}")`).run(type);
    }
  }
};

/** @param {import("better-sqlite3").Database} db */
const counts = (db) =>
  [...tables]
    .filter(([uid]) => uid.startsWith("api::"))
    .map(([uid, table]) => `${uid.split(".").pop()}=${db.prepare(`SELECT count(*) c FROM "${table}"`).get().c}`)
    .join(" ");

/** @param {string} file @param {(db: import("better-sqlite3").Database) => void} edit */
const finish = (file, edit) => {
  const db = new Database(file);
  db.pragma("foreign_keys = ON");
  db.transaction(() => edit(db))();
  db.pragma("journal_mode = DELETE");
  db.exec("VACUUM");
  console.log(`${path.relative(ROOT, file)}: ${counts(db)}`);
  db.close();
};

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

// The backup API gives a consistent copy even while the dev Strapi is running
const source = new Database(SOURCE, { readonly: true, fileMustExist: true });
await source.backup(FULL);
await source.backup(NO_CONTENT);
source.close();

const stripPrivate = (/** @type {import("better-sqlite3").Database} */ db) => {
  for (const table of PRIVATE_TABLES) clear(db, table);
  removeOrphans(db);
};

finish(FULL, stripPrivate);
finish(NO_CONTENT, (db) => {
  stripPrivate(db);
  for (const [uid, table] of tables) if (uid.startsWith("api::") && !NO_CONTENT_KEEP.has(uid)) clear(db, table);
  removeOrphans(db);
});
