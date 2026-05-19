"use client";

import {
  ContainerCard,
  type FeaturedSearch,
  type SubItem,
} from "@/components/lineup/ContainerCard";
import type { NavTarget } from "@/components/lineup/types";
import type { SiteKey } from "@/lib/festival/lineup";

export const WILD_NG_WALKS_ID = "wild-ng-walks";
export const WILD_NG_WALKS_SITE: SiteKey = "library";

const TITLE = "Wild NG Chalk and Walk";
const SHORT_DESCRIPTION =
  "Spot street wildflowers and chalk the streets with their names";
const LONG_DESCRIPTION =
  "Join us for an exploration of street wildflowers, identifying what we find and chalking the streets with labels and all things wild and wonderful. All ages welcome. We supply chalk and wildflower love, but please bring your own chalk if you wish to.";

// Same walk, two different routes. The shared description (what it is,
// what to bring) lives on the container's longDescription; the per-route
// detail (meeting point + route) is on each sub-item.
const WALKS: SubItem[] = [
  {
    id: "wng-01",
    startTime: "13:00",
    endTime: "14:00",
    title: "WildNG Chalk and Walk Street Graffiti Tour",
    category: "walks",
    summary:
      "Meet at Nottingham Central Library, ends up at Old Market Square via Sussex Street.",
  },
  {
    id: "wng-02",
    startTime: "15:00",
    endTime: "16:00",
    title: "WildNG Chalk and Walk Street Graffiti Tour",
    category: "walks",
    summary:
      "Meet at Nottingham Central Library, ends up at Old Market Square via Lister Gate.",
  },
];

export const WILD_NG_WALKS_SEARCH: FeaturedSearch = {
  title: TITLE,
  shortDescription: SHORT_DESCRIPTION,
  longDescription: LONG_DESCRIPTION,
  subItems: WALKS,
};

type Props = {
  nowMinutes: number | null;
  target: NavTarget | null;
};

export function WildNGWalksCard({ nowMinutes, target }: Props) {
  return (
    <ContainerCard
      id={WILD_NG_WALKS_ID}
      tone={WILD_NG_WALKS_SITE}
      topLabel="ALL DAY"
      mainLabel="WALKS"
      title={TITLE}
      shortDescription={SHORT_DESCRIPTION}
      longDescription={LONG_DESCRIPTION}
      subItems={WALKS}
      nowMinutes={nowMinutes}
      target={target}
    />
  );
}
