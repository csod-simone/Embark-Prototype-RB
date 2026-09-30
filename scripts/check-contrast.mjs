#!/usr/bin/env node
/**
 * Static WCAG contrast check for design tokens defined in src/design-system.css
 * and src/index.css. Parses HSL values for :root (light) and .dark blocks,
 * then checks key foreground/background pairings (including brand overrides
 * for Cisco and T-Mobile) against WCAG AA (4.5:1 body, 3:1 large/UI).
 *
 * Exits with code 1 if any pair fails.
 */
import fs from "node:fs";
import path from "node:path";

const files = ["src/design-system.css", "src/index.css"];
const raw = files.map((f) => fs.readFileSync(path.resolve(f), "utf8")).join("\n");
// Strip CSS comments so braces inside docs don't break the parser.
const text = raw.replace(/\/\*[\s\S]*?\*\//g, "");

/** Parse all CSS blocks of the form `selector { ... }` */
function parseBlocks(css) {
  const blocks = [];
  const re = /([^{}]+)\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const selectors = m[1].split(",").map((s) => s.trim());
    const body = m[2];
    const vars = {};
    const varRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let v;
    while ((v = varRe.exec(body))) vars[v[1].trim()] = v[2].trim();
    if (Object.keys(vars).length) for (const sel of selectors) blocks.push({ sel, vars });
  }
  return blocks;
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map((x) => Math.round(x * 255));
}
function rel(c) { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }
function luminance([r, g, b]) { return 0.2126 * rel(r) + 0.7152 * rel(g) + 0.0722 * rel(b); }
function ratio(rgb1, rgb2) {
  const [l1, l2] = [luminance(rgb1), luminance(rgb2)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}
function parseHsl(str) {
  const m = str.trim().match(/^(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%$/);
  if (!m) return null;
  return hslToRgb(+m[1], +m[2], +m[3]);
}

const blocks = parseBlocks(text);

/** Build a token map for a given mode by merging matching selectors. */
function tokensFor(selectors) {
  const out = {};
  for (const b of blocks) if (selectors.includes(b.sel)) Object.assign(out, b.vars);
  return out;
}

const modes = {
  "Default · light":  tokensFor([":root"]),
  "Default · dark":   tokensFor([":root", ".dark"]),
  "Cisco · light":    tokensFor([":root", '[data-brand="cisco"]']),
  "Cisco · dark":     tokensFor([":root", ".dark", '[data-brand="cisco"]', '[data-brand="cisco"].dark']),
  "T-Mobile · light": tokensFor([":root", '[data-brand="tmobile"]']),
  "T-Mobile · dark":  tokensFor([":root", ".dark", '[data-brand="tmobile"]', '[data-brand="tmobile"].dark']),
  "Rathbones · light": tokensFor([":root", '[data-brand="rathbones"]']),
  "Rathbones · dark":  tokensFor([":root", ".dark", '[data-brand="rathbones"]', '[data-brand="rathbones"].dark']),
};

const pairs = [
  ["--foreground",          "--background", 4.5],
  ["--muted-foreground",    "--background", 4.5],
  // Brand-colored UI components: WCAG only requires 3:1 for buttons/large text.
  ["--primary-foreground",  "--primary",    3],
  ["--secondary-foreground","--secondary",  4.5],
  ["--accent-foreground",   "--accent",     3],
  ["--destructive-foreground","--destructive",3],
  ["--success-foreground",  "--success",    3],
  ["--card-foreground",     "--card",       4.5],
  ["--popover-foreground",  "--popover",    4.5],
];

let failed = 0;
for (const [mode, vars] of Object.entries(modes)) {
  console.log(`\n${mode}`);
  for (const [fg, bg, min] of pairs) {
    const f = vars[fg], b = vars[bg];
    if (!f || !b) continue;
    const rf = parseHsl(f), rb = parseHsl(b);
    if (!rf || !rb) continue;
    const r = ratio(rf, rb);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(`  ${ok ? "✓" : "✗"} ${fg} on ${bg}  ${r.toFixed(2)}:1  (min ${min})`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} contrast pair(s) below WCAG AA.`);
  process.exit(1);
}
console.log("\nAll checked pairs meet WCAG AA.");