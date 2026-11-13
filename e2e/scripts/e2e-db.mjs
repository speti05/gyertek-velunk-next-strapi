import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/**
 * The e2e run never touches the dev database: Strapi is started on a copy, which
 * scripts/run.mjs deletes once the run is over.
 */
const E2E_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SERVER_DIR = path.resolve(E2E_DIR, "../server");

/** Relative to the server root - Strapi's DATABASE_FILENAME. */
export const E2E_DB_FILENAME = ".tmp/e2e/data.db";
export const E2E_DB_FILE = path.join(SERVER_DIR, E2E_DB_FILENAME);
export const E2E_DB_DIR = path.dirname(E2E_DB_FILE);

/**
 * The database the copy is made from: one of the committed fixtures (e2e/fixtures, built by
 * scripts/build-test-dbs.mjs), picked with E2E_DB=full (default) or E2E_DB=no-content,
 * or any SQLite file given as a path (e.g. E2E_DB=server/.tmp/data.db, relative to the repo root).
 */
const FIXTURES = {
  full: path.join(E2E_DIR, "fixtures/data.db"),
  "no-content": path.join(E2E_DIR, "fixtures/data-no-content.db"),
};
const choice = process.env.E2E_DB ?? "full";
export const SOURCE_DB_FILE =
  choice in FIXTURES ? FIXTURES[/** @type {keyof typeof FIXTURES} */ (choice)] : path.resolve(E2E_DIR, "..", choice);
