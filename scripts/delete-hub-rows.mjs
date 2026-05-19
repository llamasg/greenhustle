// One-off: delete the nine "Grow Yourself Hub" participant rows from
// data/lineup.xlsx now that they're represented as sub-items of the
// GrowYourselfHubCard featured card. Idempotent.
// Run with: `node scripts/delete-hub-rows.mjs`
import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "node:fs";

const PATH = "data/lineup.xlsx";
const REMOVE_IDS = new Set([
  "eon-renewable-energy",
  "experian-action-cafe",
  "resolve-action-cafe",
  "extinction-rebellion",
  "nottingham-climate-assembly",
  "nottingham-food-charter",
  "nottingham-energy-partnership",
  "national-numeracy",
  "nottingham-open-spaces-forum",
]);

const wb = XLSX.read(readFileSync(PATH), { type: "buffer" });
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const before = rows.length;
const kept = rows.filter((r) => !REMOVE_IDS.has(String(r.id ?? "").trim()));
const removed = before - kept.length;

if (removed === 0) {
  console.log(`No rows matched — nothing to do.`);
  process.exit(0);
}

const headerOrder = Object.keys(rows[0] ?? {});
const newSheet = XLSX.utils.json_to_sheet(kept, { header: headerOrder });
wb.Sheets[sheetName] = newSheet;
writeFileSync(PATH, XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));

console.log(`Removed ${removed} rows. Kept ${kept.length}.`);
for (const id of REMOVE_IDS) console.log(`  - ${id}`);
