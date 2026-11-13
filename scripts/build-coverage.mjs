#!/usr/bin/env node
/**
 * Joins the e2e tests and the user docs on their use case IDs (UC-XXX-00).
 *
 *   tests  - a `@UC-...` tag on a Playwright test (see e2e/support/docs.ts)
 *   docs   - the `usecases` frontmatter list of a page under docs-site/src/content/docs
 *
 * Reads the Playwright JSON report and writes docs-site/src/data/coverage.json, which the
 * <TestCoverage> component renders. Prints the use cases that have no test and the tests
 * whose use case is not documented; with --strict either one fails the run.
 *
 * Usage: node scripts/build-coverage.mjs [--strict]
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPORT = path.join(ROOT, "e2e/test-results/results.json");
const DOCS_DIR = path.join(ROOT, "docs-site/src/content/docs");
const OUTPUT = path.join(ROOT, "docs-site/src/data/coverage.json");
const REPO_URL = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}`
  : "https://github.com/speti05/gyertek-velunk-next-strapi";
const BRANCH = process.env.GITHUB_REF_NAME ?? "main";
const USE_CASE_TAG = /^@?(UC-[A-Z0-9]+-\d+)$/;

const strict = process.argv.includes("--strict");

/** Folds several statuses into the worst one. */
function worstStatus(statuses) {
  for (const status of ["failed", "flaky", "passed"]) if (statuses.includes(status)) return status;
  return "skipped";
}

/** Playwright's per-project test outcome -> what the docs show. */
const PLAYWRIGHT_STATUS = { expected: "passed", unexpected: "failed", flaky: "flaky", skipped: "skipped" };

/** Walks the nested suites of the JSON report and yields every spec with its file. */
function* walkSpecs(suites, file) {
  for (const suite of suites ?? []) {
    const suiteFile = suite.file ?? file;
    for (const spec of suite.specs ?? []) yield { spec, file: spec.file ?? suiteFile };
    yield* walkSpecs(suite.suites, suiteFile);
  }
}

function collectTests() {
  if (!existsSync(REPORT)) {
    console.warn(`No Playwright report at ${path.relative(ROOT, REPORT)} - run the e2e tests first.`);
    return { generatedAt: null, byUseCase: {} };
  }
  const report = JSON.parse(readFileSync(REPORT, "utf8"));
  const byUseCase = {};

  for (const { spec, file } of walkSpecs(report.suites)) {
    const ids = (spec.tags ?? [])
      .map((tag) => USE_CASE_TAG.exec(tag)?.[1])
      .filter(Boolean);
    const relFile = path.posix.join("e2e/tests", file.replaceAll("\\", "/"));

    for (const id of ids) {
      (byUseCase[id] ??= []).push({
        title: spec.title,
        file: relFile,
        url: `${REPO_URL}/blob/${BRANCH}/${relFile}#L${spec.line}`,
        status: worstStatus((spec.tests ?? []).map((t) => PLAYWRIGHT_STATUS[t.status])),
        projects: [...new Set((spec.tests ?? []).map((t) => t.projectName))],
      });
    }
  }
  return { generatedAt: report.stats?.startTime ?? new Date().toISOString(), byUseCase };
}

function listDocs(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return listDocs(full);
    return /\.mdx?$/.test(name) ? [full] : [];
  });
}

/** Reads the `usecases: [A, B]` (or block list) frontmatter of every docs page. */
function collectDocumentedUseCases() {
  const documented = {};
  for (const file of listDocs(DOCS_DIR)) {
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, "utf8"))?.[1] ?? "";
    const ids = frontmatter.match(/UC-[A-Z0-9]+-\d+/g) ?? [];
    for (const id of ids) (documented[id] ??= []).push(path.relative(ROOT, file).replaceAll("\\", "/"));
  }
  return documented;
}

const { generatedAt, byUseCase } = collectTests();
const documented = collectDocumentedUseCases();

const useCases = {};
for (const id of new Set([...Object.keys(byUseCase), ...Object.keys(documented)])) {
  const tests = byUseCase[id] ?? [];
  useCases[id] = {
    status: tests.length === 0 ? "untested" : worstStatus(tests.map((t) => t.status)),
    docs: documented[id] ?? [],
    tests,
  };
}

mkdirSync(path.dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify({ generatedAt, useCases }, null, 2) + "\n");
console.log(`Wrote ${path.relative(ROOT, OUTPUT)} (${Object.keys(useCases).length} use cases).`);

const untested = Object.keys(documented).filter((id) => !byUseCase[id]);
const undocumented = Object.keys(byUseCase).filter((id) => !documented[id]);
if (untested.length) console.warn(`Documented but not tested: ${untested.join(", ")}`);
if (undocumented.length) console.warn(`Tested but not documented: ${undocumented.join(", ")}`);
if (strict && (untested.length || undocumented.length)) process.exit(1);
