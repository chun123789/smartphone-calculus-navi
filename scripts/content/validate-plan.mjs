import { fileURLToPath } from "node:url";
import { loadArticlePlan } from "./import-plan.mjs";

const REQUIRED_COLUMNS = [
  "slug",
  "title",
  "section",
  "order",
  "track",
  "intent",
  "level",
  "priority",
  "vizModule",
  "prereq1",
  "prereq2",
  "next",
  "mistake",
  "published",
  "hookQuestion",
  "oneLineAnswer",
  "takeaway1",
  "takeaway2",
  "takeaway3",
  "check1",
  "check2"
];

const VALID_SECTIONS = new Set(["basics", "differentiation", "integration", "fundamental", "mistakes"]);
const VALID_TRACKS = new Set(["regular", "exam", "bridge"]);
const VALID_LEVELS = new Set(["基礎", "標準", "発展"]);
const VALID_PRIORITY = new Set(["S", "A", "B"]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function hasSufficientLength(value, min = 12) {
  return typeof value === "string" && value.trim().length >= min;
}

export async function validateArticlePlan(csvPath) {
  const rows = await loadArticlePlan(csvPath);
  assert(rows.length >= 30, `Plan requires at least 30 rows, got ${rows.length}.`);

  const slugs = new Set();
  for (const row of rows) {
    for (const column of REQUIRED_COLUMNS) {
      assert(column in row, `Missing required column "${column}".`);
      if (column !== "order" && column !== "vizModule") {
        assert(String(row[column]).trim().length > 0, `Column "${column}" must be non-empty: ${row.slug}`);
      }
    }

    assert(/^[a-z0-9-]+$/.test(row.slug), `Invalid slug format: ${row.slug}`);
    assert(!slugs.has(row.slug), `Duplicate slug in plan: ${row.slug}`);
    slugs.add(row.slug);

    assert(Number.isInteger(row.order) && row.order > 0, `Invalid order for ${row.slug}: ${row.order}`);
    assert(VALID_SECTIONS.has(row.section), `Invalid section for ${row.slug}: ${row.section}`);
    assert(VALID_TRACKS.has(row.track), `Invalid track for ${row.slug}: ${row.track}`);
    assert(VALID_LEVELS.has(row.level), `Invalid level for ${row.slug}: ${row.level}`);
    assert(VALID_PRIORITY.has(row.priority), `Invalid priority for ${row.slug}: ${row.priority}`);

    assert(hasSufficientLength(row.hookQuestion), `hookQuestion must be at least 12 chars: ${row.slug}`);
    assert(hasSufficientLength(row.oneLineAnswer), `oneLineAnswer must be at least 12 chars: ${row.slug}`);
    assert(hasSufficientLength(row.takeaway1), `takeaway1 must be at least 12 chars: ${row.slug}`);
    assert(hasSufficientLength(row.takeaway2), `takeaway2 must be at least 12 chars: ${row.slug}`);
    assert(hasSufficientLength(row.takeaway3), `takeaway3 must be at least 12 chars: ${row.slug}`);
    assert(hasSufficientLength(row.check1), `check1 must be at least 12 chars: ${row.slug}`);
    assert(hasSufficientLength(row.check2), `check2 must be at least 12 chars: ${row.slug}`);
  }

  for (const row of rows) {
    for (const linkKey of ["prereq1", "prereq2", "next", "mistake"]) {
      const target = row[linkKey];
      assert(slugs.has(target), `Missing link target "${target}" from ${row.slug}.${linkKey}`);
      assert(target !== row.slug, `Self-link is not allowed: ${row.slug}.${linkKey}`);
    }

    const reserved = new Set([row.prereq1, row.prereq2, row.next, row.mistake]);
    assert(
      reserved.size === 4,
      `Plan link fields must be unique (prereq1/prereq2/next/mistake): ${row.slug}`
    );
  }

  return rows;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rows = await validateArticlePlan();
  console.log(`Plan validation passed: ${rows.length} rows.`);
}
