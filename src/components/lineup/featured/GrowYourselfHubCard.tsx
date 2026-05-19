"use client";

import {
  ContainerCard,
  type FeaturedSearch,
  type SubItem,
} from "@/components/lineup/ContainerCard";
import type { NavTarget } from "@/components/lineup/types";
import type { SiteKey } from "@/lib/festival/lineup";

export const GROW_YOURSELF_HUB_ID = "grow-yourself-hub";
export const GROW_YOURSELF_HUB_SITE: SiteKey = "market";

const TITLE = "Grow Yourself Hub";
const SHORT_DESCRIPTION =
  "Money confidence, energy advice and hands-on climate wins, all in the OMS dome";
const LONG_DESCRIPTION =
  "A cosy dome in Old Market Square for boosting money skills, energy know-how and climate confidence.";

// Participants sharing the dome all day. No per-item times — they're
// present for the whole festival. Categories mirror the original
// xlsx rows so the icon (talks = mic, workshops = wrench) stays useful.
const PARTICIPANTS: SubItem[] = [
  {
    id: "gyh-eon",
    title: "E.ON Next",
    category: "talks",
    summary:
      "Green skills, energy affordability and the route to net zero from E.ON's net zero training academy.",
  },
  {
    id: "gyh-experian",
    title: "Experian",
    category: "talks",
    summary:
      "Boost your financial confidence and build everyday money skills.",
  },
  {
    id: "gyh-resolve",
    title: "Resolve",
    category: "talks",
  },
  {
    id: "gyh-extinction-rebellion",
    title: "Extinction Rebellion Nottingham",
    category: "workshops",
    summary:
      "Badge making and a craft activity around growing a rebel.",
  },
  {
    id: "gyh-climate-assembly",
    title: "Nottingham Climate Assembly",
    category: "talks",
    summary:
      "Outcomes from Nottingham's first Climate Assembly, with interactive ways to feed in your own thoughts.",
  },
  {
    id: "gyh-food-charter",
    title: "Nottingham Food Charter",
    category: "talks",
    summary:
      "Share your experiences of food and your vision for Nottingham's food future.",
  },
  {
    id: "gyh-energy-partnership",
    title: "Nottingham Energy Partnership",
    category: "talks",
    summary:
      "Add a memory to the Peepboard and chat about insulation, heating and reducing bills.",
  },
  {
    id: "gyh-national-numeracy",
    title: "National Numeracy",
    category: "workshops",
    summary:
      "A game, opinion gathering and a hands-on activity around numeracy and number confidence.",
  },
  {
    id: "gyh-open-spaces",
    title: "Nottingham Open Spaces Forum",
    category: "talks",
  },
];

export const GROW_YOURSELF_HUB_SEARCH: FeaturedSearch = {
  title: TITLE,
  shortDescription: SHORT_DESCRIPTION,
  longDescription: LONG_DESCRIPTION,
  subItems: PARTICIPANTS,
};

type Props = {
  nowMinutes: number | null;
  target: NavTarget | null;
};

export function GrowYourselfHubCard({ nowMinutes, target }: Props) {
  return (
    <ContainerCard
      id={GROW_YOURSELF_HUB_ID}
      tone={GROW_YOURSELF_HUB_SITE}
      topLabel="ALL DAY"
      mainLabel="HUB"
      title={TITLE}
      shortDescription={SHORT_DESCRIPTION}
      longDescription={LONG_DESCRIPTION}
      subItems={PARTICIPANTS}
      nowMinutes={nowMinutes}
      target={target}
    />
  );
}
