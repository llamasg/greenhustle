import * as XLSX from "xlsx";
import { readFileSync } from "node:fs";
const wb = XLSX.read(readFileSync("data/lineup.xlsx"), { type: "buffer" });
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
const lookFor = ["main-stage","sussex-stage","meanderers-walk-morning","meanderers-walk-afternoon","wild-ng-walk-1","wild-ng-walk-2"];
for (const id of lookFor) {
  const r = rows.find(x => String(x.id).trim() === id);
  console.log(r ? `FOUND  ${id.padEnd(28)} site=${(r.site||"(blank)").padEnd(8)} time=${(r.time||"(blank)").padEnd(28)} title="${r.title}"` : `MISSING ${id}`);
}
