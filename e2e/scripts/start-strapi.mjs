#!/usr/bin/env node
/**
 * Playwright's webServer command for Strapi: copies the source database, then starts a
 * second Strapi on that copy (the port and the rest of the env come from playwright.config.ts).
 * Playwright loads its config as CommonJS, which cannot import this module - hence the
 * database env is set here rather than there.
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { E2E_DB_DIR, E2E_DB_FILE, E2E_DB_FILENAME, SERVER_DIR, SOURCE_DB_FILE } from "./e2e-db.mjs";

/** @param {string} relative */
const serverBin = (relative) => path.join(SERVER_DIR, "node_modules", relative);

// A leftover from an aborted run is replaced, never reused
rmSync(E2E_DB_DIR, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
mkdirSync(E2E_DB_DIR, { recursive: true });

// SQLite's backup API gives a consistent copy even while the dev Strapi is writing to the source
const Database = createRequire(path.join(SERVER_DIR, "package.json"))("better-sqlite3");
const source = new Database(SOURCE_DB_FILE, { readonly: true, fileMustExist: true });
await source.backup(E2E_DB_FILE);
source.close();
console.log(`[e2e] Database copied to ${path.relative(process.cwd(), E2E_DB_FILE)}`);

// `strapi start` runs the compiled dist/, which is stale when the dev Strapi is not running.
// tsc still emits on type errors, so its exit code only warrants a warning here.
const tsc = spawnSync(process.execPath, [serverBin("typescript/bin/tsc"), "-p", "tsconfig.json"], {
  cwd: SERVER_DIR,
  stdio: "inherit",
});
if (tsc.status !== 0) console.warn("[e2e] tsc reported errors - starting Strapi anyway");

const strapi = spawn(process.execPath, [serverBin("@strapi/strapi/bin/strapi.js"), "start"], {
  cwd: SERVER_DIR,
  stdio: "inherit",
  env: { ...process.env, DATABASE_CLIENT: "sqlite", DATABASE_FILENAME: E2E_DB_FILENAME },
});
strapi.on("exit", (code) => process.exit(code ?? 0));
