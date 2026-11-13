import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

/**
 * The e2e run never touches the dev database: Strapi is started on a copy, which
 * scripts/run.mjs deletes once the run is over.
 */
export const SERVER_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../server");

/** Relative to the server root - Strapi's DATABASE_FILENAME. */
export const E2E_DB_FILENAME = ".tmp/e2e/data.db";
export const E2E_DB_FILE = path.join(SERVER_DIR, E2E_DB_FILENAME);
export const E2E_DB_DIR = path.dirname(E2E_DB_FILE);

/** The database the copy is made from: the dev one, or the seeded one in CI. */
export const SOURCE_DB_FILE = path.join(SERVER_DIR, process.env.E2E_SOURCE_DB ?? ".tmp/data.db");
