import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const fix = process.argv[2] === "fix";
const git = (cmd) =>
  execSync(`git ${cmd}`, { encoding: "utf8" })
    .split(/\r?\n/)
    .map((s) => s.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);

const tracked = new Set(git("ls-files"));
const untracked = new Set(git("ls-files --others --exclude-standard"));
const byLower = new Map();
for (const f of [...tracked, ...untracked]) byLower.set(f.toLowerCase(), f);

const EXTS = ["", ".js", ".mjs", ".cjs", ".json", "/index.js"];
const find = (base, set) => EXTS.map((e) => base + e).find((p) => set.has(p));
const findLower = (base) =>
  EXTS.map((e) => byLower.get((base + e).toLowerCase())).find(Boolean);

const importRe = /(\bfrom\s*|\bimport\s*\(?\s*|\brequire\s*\(\s*)(["'])(\.{1,2}\/[^"']+)\2/g;
let problems = 0;
let fixedFiles = 0;

for (const file of tracked) {
  if (!/\.(js|mjs|cjs)$/.test(file) || file === "check-imports.mjs") continue;

  const dir = path.posix.dirname(file);
  const original = readFileSync(file, "utf8");

  const updated = original.replace(importRe, (match, pre, quote, spec) => {
    const base = path.posix.normalize(path.posix.join(dir, spec));

    if (find(base, tracked)) return match;

    const untrackedHit = find(base, untracked);
    if (untrackedHit) {
      problems++;
      console.log(`✗ ${file}\n    "${spec}" wali file git mein add nahi hui\n    -> git add ${untrackedHit}\n`);
      return match;
    }

    const actual = findLower(base);
    if (actual) {
      problems++;
      let rel = path.posix.relative(dir, actual);
      if (!rel.startsWith(".")) rel = "./" + rel;
      console.log(`✗ ${file}\n    import mein: ${spec}\n    git mein naam: ${rel}\n`);
      return fix ? `${pre}${quote}${rel}${quote}` : match;
    }

    problems++;
    console.log(`✗ ${file}\n    "${spec}" naam ki koi file nahi mili\n`);
    return match;
  });

  if (fix && updated !== original) {
    writeFileSync(file, updated);
    fixedFiles++;
  }
}

if (problems === 0) {
  console.log("✓ Saare imports theek hain. Ab push kar sakte hain.");
} else if (fix) {
  console.log(`${fixedFiles} file(s) theek ki gayi. Ab dobara chalayen: node check-imports.mjs`);
} else {
  console.log(`${problems} masla/masle mile. Khud theek karne ke liye: node check-imports.mjs fix`);
}