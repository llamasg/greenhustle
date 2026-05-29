// One-off: apply the library lineup tweaks.
//   - Set times for lego-club, nottingham-3d-model, our-words-our-world
//   - Override the display category label for our-words-our-world
//   - Remove the up-rooted row
// Idempotent. Run with: `node scripts/fix-library-lineup.mjs`
import * as XLSX from "xlsx";
import { readFileSync, writeFileSync } from "node:fs";

const PATH = "data/lineup.xlsx";

const TIME_UPDATES = {
  "lego-club": "10:00-14:00",
  "nottingham-3d-model": "10:00-13:00",
  "our-words-our-world": "11:00-15:30",
};
const LABEL_OVERRIDES = {
  "our-words-our-world": "activity",
};
const REMOVE_IDS = new Set(["up-rooted"]);

const wb = XLSX.read(readFileSync(PATH), { type: "buffer" });
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

let timeChanged = 0;
let labelChanged = 0;

const kept = rows.filter((r) => {
  const id = String(r.id ?? "").trim();
  if (REMOVE_IDS.has(id)) return false;
  if (id in TIME_UPDATES) {
    if (r.time !== TIME_UPDATES[id]) {
      r.time = TIME_UPDATES[id];
      timeChanged++;
    }
  }
  if (id in LABEL_OVERRIDES) {
    if (r.display_category_label !== LABEL_OVERRIDES[id]) {
      r.display_category_label = LABEL_OVERRIDES[id];
      labelChanged++;
    }
  }
  return true;
});

const removed = rows.length - kept.length;
const headerOrder = Object.keys(rows[0] ?? {});
// Append display_category_label if it wasn't already in the header
if (!headerOrder.includes("display_category_label")) {
  headerOrder.push("display_category_label");
}

const newSheet = XLSX.utils.json_to_sheet(kept, { header: headerOrder });
wb.Sheets[sheetName] = newSheet;
writeFileSync(PATH, XLSX.write(wb, { type: "buffer", bookType: "xlsx" }));

console.log(`Times updated: ${timeChanged}`);
console.log(`Display labels updated: ${labelChanged}`);
console.log(`Rows removed: ${removed} (${[...REMOVE_IDS].join(", ")})`);
console.log(`Rows kept: ${kept.length}`);
