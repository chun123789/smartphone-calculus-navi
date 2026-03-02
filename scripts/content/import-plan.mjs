import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_CSV_PATH = path.resolve(__dirname, "../../content-plan/articles.csv");

function parseCsvLine(line) {
  const parts = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  parts.push(current.trim());
  return parts;
}

export async function loadArticlePlan(csvPath = DEFAULT_CSV_PATH) {
  const raw = await fs.readFile(csvPath, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  if (lines.length < 2) {
    throw new Error("content-plan/articles.csv is empty.");
  }

  const headers = parseCsvLine(lines[0]);
  const rows = [];
  for (let index = 1; index < lines.length; index += 1) {
    const values = parseCsvLine(lines[index]);
    if (values.length !== headers.length) {
      throw new Error(
        `Invalid CSV column count at line ${index + 1}: expected ${headers.length}, got ${values.length}.`
      );
    }
    const row = {};
    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex];
    });
    row.order = Number(row.order);
    rows.push(row);
  }
  return rows;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rows = await loadArticlePlan();
  console.log(`Loaded ${rows.length} plan rows.`);
}
