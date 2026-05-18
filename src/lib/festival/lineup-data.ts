import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as XLSX from "xlsx";
import {
  CATEGORY_SET,
  SITE_SET,
  type Category,
  type LineupItem,
  type SiteKey,
} from "./lineup";

type RawRow = {
  id?: unknown;
  title?: unknown;
  short_description?: unknown;
  long_description?: unknown;
  category?: unknown;
  site?: unknown;
  time?: unknown;
  photo?: unknown;
  website?: unknown;
  instagram?: unknown;
};

function cleanString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function buildInstagramUrl(handle: string | undefined): string | undefined {
  if (!handle) return undefined;
  const trimmed = handle.replace(/^@/, "").trim();
  if (!trimmed) return undefined;
  return `https://instagram.com/${trimmed}`;
}

function buildWebsiteUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

function parseRow(row: RawRow, index: number): LineupItem | null {
  const id = cleanString(row.id);
  const title = cleanString(row.title);
  const categoryRaw = cleanString(row.category)?.toLowerCase();
  const siteRaw = cleanString(row.site)?.toLowerCase();

  if (!id || !title) {
    console.warn(`[lineup] Row ${index} skipped: missing id or title`, {
      id,
      title,
    });
    return null;
  }

  if (!categoryRaw || !CATEGORY_SET.has(categoryRaw as Category)) {
    console.warn(
      `[lineup] Row ${index} (${id}) skipped: invalid category "${categoryRaw}"`
    );
    return null;
  }

  let site: SiteKey | undefined;
  if (siteRaw) {
    if (SITE_SET.has(siteRaw as SiteKey)) {
      site = siteRaw as SiteKey;
    } else {
      console.warn(
        `[lineup] Row ${index} (${id}): unknown site "${siteRaw}", treating as TBC`
      );
    }
  }

  return {
    id,
    title,
    category: categoryRaw as Category,
    site,
    shortDescription: cleanString(row.short_description),
    longDescription: cleanString(row.long_description),
    time: cleanString(row.time),
    photo: cleanString(row.photo),
    website: buildWebsiteUrl(cleanString(row.website)),
    instagram: buildInstagramUrl(cleanString(row.instagram)),
  };
}

function loadLineupFromXlsx(): LineupItem[] {
  const path = join(process.cwd(), "data", "lineup.xlsx");
  const buf = readFileSync(path);
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) {
    throw new Error("[lineup] xlsx has no sheets");
  }
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: "" });

  const items: LineupItem[] = [];
  rows.forEach((row, i) => {
    const item = parseRow(row, i);
    if (item) items.push(item);
  });
  return items;
}

// In production, parse once at module load and cache for the lifetime of
// the server process. In development, re-read on every call so edits to
// data/lineup.xlsx show up without a dev-server restart.
const PRODUCTION_CACHE: LineupItem[] | null =
  process.env.NODE_ENV === "production" ? loadLineupFromXlsx() : null;

export function getLineup(): LineupItem[] {
  return PRODUCTION_CACHE ?? loadLineupFromXlsx();
}
