"use client";

import {
  ContainerCard,
  type FeaturedSearch,
  type SubItem,
} from "@/components/lineup/ContainerCard";
import type { NavTarget } from "@/components/lineup/types";
import type { SiteKey } from "@/lib/festival/lineup";

// Featured-card metadata. Exported so the lineup view can filter visibility
// without importing the timetable itself.
export const OMS_MAIN_STAGE_ID = "oms-main-stage";
export const OMS_MAIN_STAGE_SITE: SiteKey = "market";

const TITLE = "Main Stage";
const SHORT_DESCRIPTION = "Headline programme on Old Market Square";

// Timetable. Edit this array to change the programme; nothing else needs
// touching. Ids are stable so saves + OnNowBanner deep-links keep working.
const ACTS: SubItem[] = [
  { id: "oms-ms-01", startTime: "11:00", endTime: "12:15", title: "Justin Turford (DJ)", category: "music" },
  { id: "oms-ms-02", startTime: "12:15", endTime: "12:45", title: "Schools Performance", category: "music" },
  { id: "oms-ms-03", startTime: "12:45", endTime: "13:30", title: "Step N Groove Workshop", category: "workshops" },
  { id: "oms-ms-04", startTime: "13:30", endTime: "14:45", title: "Shekayla (DJ)", category: "music" },
  { id: "oms-ms-05", startTime: "14:45", endTime: "16:00", title: "Suga Lion (DJ)", category: "music" },
  { id: "oms-ms-06", startTime: "16:00", endTime: "16:30", title: "Sing It Bold Choir", category: "music" },
  { id: "oms-ms-07", startTime: "16:30", endTime: "17:30", title: "Soundhism (DJ)", category: "music" },
  { id: "oms-ms-08", startTime: "17:30", endTime: "18:00", title: "Catwalk", category: "music" },
];

export const OMS_MAIN_STAGE_SEARCH: FeaturedSearch = {
  title: TITLE,
  shortDescription: SHORT_DESCRIPTION,
  subItems: ACTS,
};

type Props = {
  nowMinutes: number | null;
  target: NavTarget | null;
};

export function OMSMainStageCard({ nowMinutes, target }: Props) {
  return (
    <ContainerCard
      id={OMS_MAIN_STAGE_ID}
      tone={OMS_MAIN_STAGE_SITE}
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
