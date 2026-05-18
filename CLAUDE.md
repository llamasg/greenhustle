# CLAUDE.md — Project context for Green Hustle '26 site

This file gives Claude Code persistent context about the project, the festival, and the voice of the website. Read this first in every session before writing any user-facing copy.

## What Green Hustle is

Green Hustle is a Nottingham-based community interest company (CIC) running since 2020. The festival is one day, but the organisation works year-round on rewilding projects, school garden programmes, and grassroots climate education across Nottingham. It is community-powered, free, and locally rooted. It is not a corporate festival, not ticketed, not curated like a music festival - it's closer to a community gathering at the scale of a small city festival.

The 2026 festival:
- Date: Saturday 30 May 2026, 11am–6pm
- Locations: three sites in Nottingham city centre — Old Market Square (Gather), Sussex Street Tram Stop (Move), Notts Central Library (Imagine)
- Free, no tickets, just turn up
- ~10,000 expected attendees based on previous year
- 100+ stallholders, makers, performers, and activities
- This year's theme: "Growing Together"

## Voice and tone

The website's voice is warm, specific, and unpretentious. Reads like a thoughtful person in their late twenties wrote it, not a corporate marketing team. UK English throughout.

**Do:**
- Use plain language. "Free entry" not "complimentary access."
- Be specific. "Veggies has been cooking vegan food in Nottingham since 1984" lands better than "delicious plant-based food."
- Trust the work to speak. Don't pad with adjectives.
- Acknowledge people's time. Get to the point.
- Use sentences of varied length. Mostly short.

**Don't:**
- Use em dashes anywhere. Use commas, full stops, or rephrase. This is a hard rule.
- Use press-release language ("we're thrilled to announce", "join us for an unforgettable day")
- Use generic festival adjectives ("vibrant", "immersive", "unforgettable", "epic")
- Use AI-tell phrases ("delve into", "tapestry", "navigate the landscape", "at the heart of")
- Hedge with adverbs ("really", "very", "incredibly", "truly")
- Use exclamation marks except in genuine moments of welcome or celebration. One per page maximum.

## Calls to action

CTAs name their destination. "See the lineup" not "Click here" or "Find out more." NN/G research is clear on this: generic CTAs reduce conversion. Specific destination labels increase trust.

Phase-dependent CTAs:
- Pre-launch (lineup not out yet): "Save the date" → calendar link
- Lineup live (most of the year): "See the lineup" → /lineup
- Festival day (30 May): "What's on right now" → /lineup/now
- Post-festival: "Relive Green Hustle '26" → recap

## What this site is for

The website serves four audiences in different proportions across the year:

1. **Pre-festival planners** (April–mid May): want lineup, accessibility, getting there. Highest traffic period.
2. **Decided attendees** (mid May to day-of-eve): want practical info, lineup details, what to bring.
3. **Day-of attendees on phone** (30 May): want live info — what's on now, where, where to find food.
4. **Year-round visitors** (June–March): want to know what Green Hustle does the rest of the year.

The site should serve all four without compromising the experience of any.

## What the site is NOT

- A marketing funnel selling tickets (it's free)
- A corporate brochure (Green Hustle is a CIC, not a brand)
- A music festival site (music is one of many things)
- A blog or news site (announcements live on social)
- A donation platform (handled separately)

## Stack notes

- Next.js (App Router, TypeScript), already installed
- Tailwind for styling
- Sanity will be the eventual CMS — for now, content is hardcoded as typed objects in lib/festival/content.ts
- Stay within the existing stack. No additional libraries without checking first.

## Accessibility commitments

The site aims for WCAG 2.2 AA conformance. Accessibility is a built-in property of the main experience, not a separate tab. When in doubt:
- Semantic HTML always (heading hierarchy, landmarks, labels)
- Visible focus states on every interactive element
- Colour contrast ratios meet AA (we'll add the brand colours later — assume they will)
- Forms have associated labels, error states announced
- Images have meaningful alt text or are marked decorative
- Motion respects prefers-reduced-motion
- Touch targets minimum 44x44px

## Sample copy that lands

> "Free, no tickets, just turn up. We mean it."

> "Veggies has been cooking vegan food in Nottingham since 1984. They're not new to this."

> "Three sites, all within a 10 minute walk."

> "The festival is one day. The work is the other 364."

## Sample copy that doesn't

> "Join us for an unforgettable day of music, creativity, and community!"
> "Immerse yourself in a vibrant tapestry of sustainable experiences."
> "Don't miss out on the festival event of the year!"

Reject this kind of writing. If a draft sounds like a press release, rewrite it.

## UI sizing defaults — important

This project is for a public-facing festival website. Users include older adults, parents reading on phones in bright sunlight, and people with mild vision impairments. The "default scale" for text and UI elements is larger than typical web app defaults.

**Default body text**: 16px minimum (`text-base`), never smaller for content users need to read.

**Supporting metadata** (times, categories, tags, captions): 14px (`text-sm`) minimum, never smaller. If it's worth showing on the page, it's worth being readable.

**Anything that is primary scannable information** (times in a schedule, prices, names): use `text-lg` or larger. Time values in a schedule are not "metadata" - they are the primary information users are scanning for. Treat them accordingly.

**Touch targets**: 44x44px minimum (already in CLAUDE.md but worth restating).

**Spacing**: generous by default. Tight spacing is for dense data tables, not for public-facing content. When in doubt, increase padding by one step.

**Visual hierarchy test**: after building a card or list item, look at the rendered output. Identify which element draws the eye first. Confirm that element is the most important piece of information on the card. If a small grey caption is doing the work of primary information, the hierarchy is wrong - fix it before considering the task complete.

**Specifically, do not use these defaults:**
- `text-xs` for important information (it's 12px, often unreadable)
- `text-gray-400` for anything users need to read
- Margins or padding below 8px on content cards
- Title size at `text-base` when the title is the primary element (use `text-lg` or `text-xl` minimum)

The bias is toward larger, more spacious, more readable. Polished modern UI looks generous, not packed.

## Debugging layout issues

When investigating a layout bug, do NOT patch the immediate element where the bug appears. Instead, follow this debugging sequence:

1. **Identify the layout context.** What element actually establishes the layout that's affecting the bug? It's almost always an ancestor, not the broken element itself. Read the DOM tree upward from the bug until you find the element with `display: grid`, `display: flex`, `position: relative`, or other layout-establishing properties.

2. **Verify the diagnosis with a hypothesis.** Before changing code, state what you think the layout context is and why it's producing the wrong result. If you can't articulate which ancestor is causing the problem, you haven't found the root cause yet.

3. **Fix at the layout-establishing element.** The fix should be at the level where the layout context is defined, not on the broken element or its immediate parent. Common fixes:
   - Add `grid-column: 1 / -1` to escape a grid context for full-width children
   - Restructure so the affected element is a sibling rather than a child of the layout-establishing element
   - Change the layout context type (grid to flex, for example)

4. **Don't reach for browser quirks first.** Specs and modern browsers handle the common cases. If a layout is misbehaving, it's almost always a structural issue in the markup or CSS, not a browser implementation quirk. Workarounds based on suspected quirks are technical debt - they obscure the real problem and break on the next refactor.

5. **Read the whole component before patching.** Before editing a component file to fix a bug, read the parent component(s) that use it. Layout bugs often live in the relationship between components, not within a single component.

## Sizing in ratios, not absolutes

When refining typography hierarchy, specify relationships between elements rather than absolute sizes:

- Primary element vs secondary: typically 1.25x-1.5x larger, often a weight step heavier (500 → 600 or 600 → 700)
- Secondary vs tertiary: typically 1.15x-1.25x larger, similar weight
- Loud vs quiet: typically also involves colour contrast - loud is darker, quiet is lighter

When the brief says "make X primary," the change should be visible across multiple dimensions: larger, bolder, darker. Not just one of these. A single-dimension change (just bigger) is usually not enough to create the desired hierarchy.

Test: after the change, name which element is the loudest, the second-loudest, and the quietest in the rendered component. If you can't clearly rank them, the hierarchy is still flat and needs more contrast between elements.

## When in doubt

Ask. Don't invent festival details, sponsor names, act information, or organisational facts. If something needs a date, a number, or a name that isn't in the brief or the existing data, leave a clearly-marked TODO and continue.