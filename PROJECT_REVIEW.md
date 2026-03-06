# TracklabX Project Review

## 1) Product Concept

TracklabX is positioned as a premium "pit wall" style F1 companion product with two core value streams:

- **F1 setup sharing** for F1 25 players (community setup DB by circuit/team/conditions/session).
- **Race intelligence surfaces** (calendar, standings, and live timing views) built around modern F1 data APIs.

The app is both a utility product (functional setup workflows) and a brand-driven experience (high-contrast, telemetry-inspired visual design language).

## 2) Design Guidelines (as implemented)

### Visual system

- Dark-first experience with **carbon/gunmetal base** and **red accent** as action/glow color.
- Typography hierarchy:
  - Barlow Condensed for display/hero/section headings.
  - Plus Jakarta Sans for body/interface copy.
  - Geist Mono for telemetry/data numerics.
- Motion is used for premium feel:
  - staggered reveals,
  - scroll-driven section entrances,
  - interactive state transitions.

### UX principles

- Strong emphasis on **information density with legibility**.
- Selection flows are split into **sequential steps** to reduce setup complexity.
- Feature pages mix **educational marketing + utility navigation** (CTA paths to setup, standings, calendar, live).

## 3) User Flow Map

### A) Setup workflow (primary product flow)

1. **Track selection** (`/setup`)
2. **Team selection** (`/setup/team`)
3. **Conditions selection** (`/setup/conditions`)
4. **Session selection** (`/setup/session`)
5. **Result grid + posting** (`/setup/results` + post form)
6. **Share link experience** (`/setup/[shareToken]`)

State handoff currently relies heavily on browser storage and client routing between setup steps.

### B) Championship intelligence flow

1. User enters standings page (`/standings`).
2. Server component loads driver + constructor + race datasets in parallel.
3. Cached Firestore standings data is returned when fresh; otherwise fetched from Jolpica and cached.
4. Client renders tables/charts/drawers with year and tab switching.

### C) Live timing flow

1. Lightweight live status checks are used in shell/nav surfaces.
2. Live page hook initializes latest OpenF1 session.
3. If session is live, app polls positions/intervals/laps/stints/pits + weather at different cadences.
4. UI modules render timing tower, gap chart, weather, fastest lap, pit feed, tyre map, etc.

### D) Calendar flow

- Calendar is driven by local season data structures and race status utility logic.
- Race detail pages provide session timing and contextual race metadata.

## 4) Module & Architecture Breakdown

## App shell and routing

- `app/layout.tsx`: global metadata, font loading, and provider mounting.
- `components/layout/*`: navbar/footer/providers.
- Uses Next App Router with both marketing and utility routes.

## Data sources and integration

- **Firebase**: auth, Firestore, storage, setup persistence, user profiles.
- **Jolpica API**: championship standings + season race results.
- **OpenF1 API**: live telemetry/timing/session feeds.

## Domain modules

- `lib/firestore.ts`: setup CRUD, filtering, pagination, votes, profile helpers.
- `lib/standingsCache.ts`: season-aware cache policy with Firestore persistence.
- `lib/openf1.ts`: low-level API fetch adapters + live-session helpers.
- `lib/predictions.ts`: deterministic scoring model for grid/podium/pole projections.

## Static data model

- `lib/data/*`: tracks, teams, drivers, calendar, track layouts.
- `lib/circuitMaps.ts`: track ID normalization and asset mapping between providers/UI contexts.

## UI modules by capability

- **Setup**: multi-step pages + `PostSetupForm`.
- **Standings**: client shell, tables, progression chart, race drawer.
- **Live**: timing tower, gap chart, tyre map, weather/status bars, fastest lap, pit feed.
- **Calendar**: season listing and per-race detail route.

## 5) Observed Strengths

- Clear product identity + consistent design tokens.
- Good modular split between static motorsport data, fetch adapters, and feature UI blocks.
- Firestore caching strategy avoids unnecessary API calls for older seasons.
- Live module uses separated polling intervals for heavier vs lighter data streams.

## 6) Important Gaps / Risks to Track

- **Version alignment**: README says Next.js 15 while package uses Next 16.
- **Type rigor**: several modules use `any` in adapter/output mapping; this can hide runtime data-shape drift.
- **Client-side localStorage dependency** in setup flow can make deep-link recovery brittle without guards.
- **Data mapping complexity** across track IDs (`melbourne` vs `albert_park`, underscore vs hyphen cases) requires careful normalization consistency.
- **Legacy duplicates** (`.js` + `.ts` siblings in `lib/`) may increase maintenance overhead if both are active.

## 7) Suggested Next Documentation Upgrades

- Add a formal **Architecture.md** with:
  - route map,
  - API dependency map,
  - data contracts per module,
  - cache invalidation rules,
  - error/fallback UX matrix.
- Add **Design System.md** that codifies tokens, spacing, type scale, and animation principles.
- Add **Setup Flow State Contract.md** describing required state keys per step and invalid-state handling.

---

If helpful next, I can produce:

1) a route-by-route technical specification, or
2) an engineering onboarding document with sequence diagrams for setup, standings, and live timing.
