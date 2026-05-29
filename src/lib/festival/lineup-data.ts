import "server-only";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import * as XLSX from "xlsx";
import {
  CATEGORY_SET,
  SITE_SET,
  type Category,
  type LineupItem,
  type SiteKey,
} from "./lineup";

const PHOTO_DIR = "images/lineupphotos";

// Manual overrides for photos whose filenames don't auto-match an id
// because of typos / extra prefixes / dropped hyphens in the source files.
// Map: lineup item id → photo filename in /public/images/lineupphotos/
const PHOTO_OVERRIDES: Record<string, string> = {
  "angolan-womens-voice":
    "angolan-women-voice-association-uk-cic-01.webp",
  "dished": "Dished-Project-iStock-1451891653.x9d9d3524.webp",
  "nottingham-climate-assembly": "nottingh-climate-assembly-05.webp",
  "clean-champions":
    "nottingham-city-council-nottingham-clean-champions-01.webp",
  "green-guardians": "nottingham-green-guardians-04.webp",
  "pythian-club": "pythianclub.webp",
  "tiger-green-textiles": "tiger-community-enterprise-cic-01.webp",
};

function loadPhotoFiles(): string[] {
  const dirPath = join(process.cwd(), "public", PHOTO_DIR);
  try {
    return readdirSync(dirPath).filter((f) => f.endsWith(".webp"));
  } catch {
    console.warn(`[lineup] photo dir missing at ${dirPath}, skipping photo wiring`);
    return [];
  }
}

function findPhoto(
  id: string,
  photoFiles: string[],
  allIds: string[]
): string | undefined {
  // Explicit overrides win — for typos / extra prefixes the auto-match can't handle.
  if (id in PHOTO_OVERRIDES) {
    return `/${PHOTO_DIR}/${PHOTO_OVERRIDES[id]}`;
  }
  // Auto-match: photo filename starts with `${id}-` or equals id. Guard
  // against shorter ids stealing files that belong to a longer id (e.g.
  // id `nottingham` claiming `nottingham-climate-assembly-*.webp`).
  for (const file of photoFiles) {
    const base = file.replace(/\.webp$/, "");
    const matches =
      base === id || base.startsWith(`${id}-`) || base.startsWith(`${id}.`);
    if (!matches) continue;
    const longerIdAlsoMatches = allIds.some(
      (otherId) =>
        otherId !== id &&
        otherId.length > id.length &&
        (base === otherId ||
          base.startsWith(`${otherId}-`) ||
          base.startsWith(`${otherId}.`))
    );
    if (!longerIdAlsoMatches) {
      return `/${PHOTO_DIR}/${file}`;
    }
  }
  return undefined;
}

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
  display_category_label?: unknown;
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
    displayCategoryLabel: cleanString(row.display_category_label),
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

  // Second pass: attach photos from /public/images/lineupphotos/.
  // Done after row parsing so findPhoto can disambiguate using the full id list.
  const photoFiles = loadPhotoFiles();
  if (photoFiles.length > 0) {
    const allIds = items.map((i) => i.id);
    for (const item of items) {
      if (!item.photo) {
        const resolved = findPhoto(item.id, photoFiles, allIds);
        if (resolved) item.photo = resolved;
      }
    }
  }

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
