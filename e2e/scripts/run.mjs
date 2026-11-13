#!/usr/bin/env node
/**
 * Runs Playwright with the given arguments, then deletes the database copy the e2e Strapi
 * wrote into. It cannot be done in globalTeardown: that runs before Playwright stops the
 * web servers, and Windows does not let a database file go while Strapi holds it open.
 *
 * `--db <name|path>` (or `--db=...`) picks the database the run starts from - see E2E_DB in
 * e2e-db.mjs. Every other argument goes to Playwright.
 */
import { spawn } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { E2E_DB_DIR } from "./e2e-db.mjs";

const cli = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../node_modules/@playwright/test/cli.js");

// Ctrl+C reaches Playwright too; wait for it to stop the servers instead of exiting first
process.on("SIGINT", () => {});

const args = process.argv.slice(2);
const dbFlag = args.findIndex((arg) => arg === "--db" || arg.startsWith("--db="));
if (dbFlag !== -1) {
  const [flag, inline] = args[dbFlag].split("=");
  const value = inline ?? args[dbFlag + 1];
  if (!value) throw new Error(`${flag} needs a value: full, no-content or a path`);
  args.splice(dbFlag, inline === undefined ? 2 : 1);
  process.env.E2E_DB = value; // inherited by Playwright and its web servers
}

const playwright = spawn(process.execPath, [cli, "test", ...args], { stdio: "inherit" });

playwright.on("exit", (code) => {
  try {
    rmSync(E2E_DB_DIR, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
    console.log("[e2e] Test database deleted");
  } catch (error) {
    console.warn(`[e2e] Could not delete ${E2E_DB_DIR} - the next run replaces it:`, error);
  }
  process.exit(code ?? 1);
});
