// One-off: delete the four flat walk rows from data/lineup.xlsx now that
// they're represented by MeanderersWalksCard / WildNGWalksCard. Reads the
// workbook, filters the matching ids out of the Lineup sheet, writes back.
// Run with: `node scripts/delete-walk-rows.mjs`
import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "node:fs";

const PATH = "data/lineup.xlsx";
const REMOVE_IDS = new Set([
  "meanderers-walk-morning",
  "meanderers-walk-afternoon",
  "wild-ng-walk-1",
  "wild-ng-walk-2",
]);

const wb = XLSX.read(readFileSync(PATH), { type: "buffer" });
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const before = rows.length;
const kept = rows.filter((r) => !REMOVE_IDS.has(String(r.id ?? "").trim()));
const removed = before - kept.length;

if (removed === 0) {
  console.log(`No rows matched ${[...REMOVE_IDS].join(", ")} — nothing to do.`);
  process.exit(0);
}

const headerOrder = Object.keys(rows[0] ?? {});
const newSheet = XLSX.utils.json_to_sheet(kept, { header: headerOrder });
wb.Sheets[sheetName] = newSheet;
writeFileSync(PATH, XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));

console.log(`Removed ${removed} rows. Kept ${kept.length}.`);
for (const id of REMOVE_IDS) console.log(`  - ${id}`);
