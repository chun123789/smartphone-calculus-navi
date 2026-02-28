import path from "node:path";
import fs from "node:fs";
import { defineConfig } from "vite";

const siteRoot = path.resolve(__dirname, ".site");

function collectHtmlEntries(dir, acc = {}) {
  if (!fs.existsSync(dir)) {
    return acc;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlEntries(fullPath, acc);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      const relative = path.relative(siteRoot, fullPath);
      const key = relative === "index.html" ? "index" : relative.replace(/[\\/]/g, "_").replace(/\.html$/, "");
      acc[key] = fullPath;
    }
  }
  return acc;
}

export default defineConfig({
  root: siteRoot,
  publicDir: path.resolve(__dirname, "public"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: collectHtmlEntries(siteRoot)
    }
  },
  server: {
    host: true,
    port: 5173
  },
  preview: {
    host: true,
    port: 4173
  }
});
