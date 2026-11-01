// Validates the publishable site/ folder before Cloudflare Pages deploys it.
// Usage: node scripts/check-site.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SITE = new URL("../site/", import.meta.url).pathname;
// Cloudflare Pages limits: 25 MiB per file, 20,000 files per deployment.
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_FILES = 20_000;
const ROOT_FILES = new Set(["_redirects", "_headers", "404.html", "robots.txt"]);

const errors = [];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk(SITE);
if (files.length > MAX_FILES) {
  errors.push(`site/ has ${files.length} files; Cloudflare Pages allows ${MAX_FILES}.`);
}
for (const file of files) {
  const size = statSync(file).size;
  if (size > MAX_FILE_BYTES) {
    errors.push(`${relative(SITE, file)} is ${(size / 1024 / 1024).toFixed(1)} MiB; the limit is 25 MiB.`);
  }
  if (/(^|\/)\.env|\.pem$|\.key$/.test(relative(SITE, file))) {
    errors.push(`${relative(SITE, file)} looks like a secret and must not be published.`);
  }
}

const games = [];
for (const entry of readdirSync(SITE, { withFileTypes: true })) {
  if (entry.isFile()) {
    if (!ROOT_FILES.has(entry.name)) {
      errors.push(`Unexpected file at the site root: ${entry.name}. Each game lives in its own folder.`);
    }
    continue;
  }
  if (!/^[a-z0-9-]+$/.test(entry.name)) {
    errors.push(`Game folder "${entry.name}" must use lowercase letters, digits and hyphens.`);
    continue;
  }
  games.push(entry.name);
  const index = join(SITE, entry.name, "index.html");
  let html;
  try {
    html = readFileSync(index, "utf8");
  } catch {
    errors.push(`${entry.name}/ has no index.html.`);
    continue;
  }
  // A game built without its sub-path loads assets from the site root and breaks.
  const rootAsset = html.match(
    new RegExp(`(?:src|href)="/(?!/)(?!${entry.name}/)([^"]+)"`),
  );
  if (rootAsset) {
    errors.push(
      `${entry.name}/index.html loads "/${rootAsset[1]}" from the site root; rebuild it with the base path /${entry.name}.`,
    );
  }
}

for (const required of ["_redirects", "404.html"]) {
  try {
    statSync(join(SITE, required));
  } catch {
    errors.push(`site/${required} is missing.`);
  }
}

if (errors.length > 0) {
  console.error(`site/ check failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`site/ check passed: ${games.length} game(s) [${games.join(", ")}], ${files.length} files.`);
