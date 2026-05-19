"use client";

import {
  ContainerCard,
  type FeaturedSearch,
  type SubItem,
} from "@/components/lineup/ContainerCard";
import type { NavTarget } from "@/components/lineup/types";
import type { SiteKey } from "@/lib/festival/lineup";

export const SUSSEX_STAGE_ID = "sussex-stage";
export const SUSSEX_STAGE_SITE: SiteKey = "sussex";

const TITLE = "Sussex Stage";
const SHORT_DESCRIPTION = "Live programme at the Sussex Street tram stop";

// Timetable. Edit this array to change the programme.
const ACTS: SubItem[] = [
  { id: "sx-st-01", startTime: "11:00", endTime: "12:30", title: "Little and Grown DJs", category: "music" },
  { id: "sx-st-02", startTime: "12:30", endTime: "14:30", title: "Club Makumba x Sugar Stealers", category: "music" },
  { id: "sx-st-03", startTime: "14:30", endTime: "15:15", title: "Step N Groove R&B Workshop", category: "workshops" },
  { id: "sx-st-04", startTime: "15:15", endTime: "15:35", title: "Sing It Bold", category: "music" },
  { id: "sx-st-05", startTime: "15:35", endTime: "16:30", title: "Trekkah Crews", category: "music" },
  { id: "sx-st-06", startTime: "16:30", endTime: "17:00", title: "Catwalk", category: "music" },
  { id: "sx-st-07", startTime: "17:00", endTime: "18:00", title: "Trekkah Crews", category: "music" },
];

export const SUSSEX_STAGE_SEARCH: FeaturedSearch = {
  title: TITLE,
  shortDescription: SHORT_DESCRIPTION,
  subItems: ACTS,
};

type Props = {
  nowMinutes: number | null;
  target: NavTarget | null;
};

export function SussexStageCard({ nowMinutes, target }: Props) {
  return (
    <ContainerCard
      id={SUSSEX_STAGE_ID}
      tone={SUSSEX_STAGE_SITE}
      topLabel="11–18"
      mainLabel="STAGE"
      title={TITLE}
      shortDescription={SHORT_DESCRIPTION}
      subItems={ACTS}
      nowMinutes={nowMinutes}
      target={target}
    />
  );
}
