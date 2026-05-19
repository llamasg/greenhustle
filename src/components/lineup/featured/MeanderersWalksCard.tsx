"use client";

import {
  ContainerCard,
  type FeaturedSearch,
  type SubItem,
} from "@/components/lineup/ContainerCard";
import type { NavTarget } from "@/components/lineup/types";
import type { SiteKey } from "@/lib/festival/lineup";

export const MEANDERERS_WALKS_ID = "meanderers-walks";
export const MEANDERERS_WALKS_SITE: SiteKey = "library";

const TITLE = "Meanderers Walks";
const SHORT_DESCRIPTION =
  "Arty walks with Amelia Daiz, planting seeds of creative inspiration";

// Three walks across the day. The two public Wanders link out to the
// Meanderers booking page; the lunchtime Schools walk is internal so
// has no booking link.
const WALKS: SubItem[] = [
  {
    id: "mw-01",
    startTime: "10:30",
    endTime: "12:30",
    title: "Meanderers Green Hustle Wander",
    category: "walks",
    summary:
      "An arty tour through the Festival sites, planting seeds of creative inspiration. Meet at Nottingham Central Library, ends up at Old Market Square. Bookable via link or just join us at 10:30am on the day.",
    bookingUrl:
      "https://www.meanderers.org/event-details/green-hustle-wander-2026-05-30-10-30",
  },
  {
    id: "mw-02",
    startTime: "13:00",
    endTime: "14:00",
    title: "Schools walk: OMS → Sussex Street",
    category: "walks",
  },
  {
    id: "mw-03",
    startTime: "16:00",
    endTime: "18:00",
    title: "Meanderers Green Hustle Wander",
    category: "walks",
    summary:
      "An arty tour through the Festival sites, planting seeds of creative inspiration. Meet at Nottingham Central Library, ends up at Old Market Square. Bookable via link or just join us at 4pm on the day.",
    bookingUrl:
      "https://www.meanderers.org/event-details/green-hustle-wander-2026-05-30-10-30",
  },
];

export const MEANDERERS_WALKS_SEARCH: FeaturedSearch = {
  title: TITLE,
  shortDescription: SHORT_DESCRIPTION,
  subItems: WALKS,
};

type Props = {
  nowMinutes: number | null;
  target: NavTarget | null;
};

export function MeanderersWalksCard({ nowMinutes, target }: Props) {
  return (
    <ContainerCard
      id={MEANDERERS_WALKS_ID}
      tone={MEANDERERS_WALKS_SITE}
      topLabel="ALL DAY"
      mainLabel="WALKS"
      title={TITLE}
      shortDescription={SHORT_DESCRIPTION}
      subItems={WALKS}
      nowMinutes={nowMinutes}
      target={target}
    />
  );
}
