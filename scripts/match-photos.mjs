import * as XLSX from "xlsx";
import { readFileSync, readdirSync } from "node:fs";

const buf = readFileSync("data/lineup.xlsx");
const wb = XLSX.read(buf, { type: "buffer" });
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
const ids = rows.map(r => String(r.id ?? "").trim()).filter(Boolean);
const photos = readdirSync("public/images/lineupphotos/").filter(f => f.endsWith(".webp"));

console.log(`IDs: ${ids.length}, Photos: ${photos.length}\n`);

// For each photo, find the best-matching id (longest prefix that matches).
function bestIdForPhoto(photo) {
  const base = photo.replace(/\.webp$/, "");
  // Sort ids by length DESC so longest match wins.
  const sorted = [...ids].sort((a, b) => b.length - a.length);
  for (const id of sorted) {
    if (base === id || base.startsWith(`${id}-`) || base.startsWith(`${id}.`)) {
      return id;
    }
  }
  return null;
}

const photoToId = {};
const unmatched = [];
for (const p of photos) {
  const id = bestIdForPhoto(p);
  if (id) photoToId[id] = p;
  else unmatched.push(p);
}

console.log(`Photos matched to ids: ${Object.keys(photoToId).length}`);
console.log(`Photos with no matching id: ${unmatched.length}`);
if (unmatched.length) {
  console.log("Unmatched photos:");
  unmatched.forEach(p => console.log("  " + p));
}

const idsWithPhoto = new Set(Object.keys(photoToId));
const idsWithoutPhoto = ids.filter(id => !idsWithPhoto.has(id));
console.log(`\nIDs without a photo: ${idsWithoutPhoto.length}`);
if (idsWithoutPhoto.length) {
  console.log("Missing photo for:");
  idsWithoutPhoto.forEach(id => console.log("  " + id));
}
