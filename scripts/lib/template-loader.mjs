import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATE_ROOT = path.resolve(__dirname, "../../src/pages/templates");

export async function loadTemplate(templateName) {
  const fullPath = path.join(TEMPLATE_ROOT, templateName);
  return fs.readFile(fullPath, "utf8");
}

export function fillTemplate(template, values) {
  return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => {
    return key in values ? String(values[key]) : "";
  });
}

