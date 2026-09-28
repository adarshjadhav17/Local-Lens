# Local Lens

**Work in progress.** Local Lens is an unfinished local discovery dashboard that brings weather, traffic, nearby events, restaurants, and local deals into one view for a US ZIP code.

The current prototype combines external APIs with sample content and estimated traffic when live data is unavailable. A multi-agent retrieval-augmented generation (RAG) system is a planned direction; no LLM, vector database, or agent orchestration is implemented yet.

## Current features

- Search by five-digit US ZIP code, with the last selection saved in the browser.
- Use browser geolocation to find a ZIP code through TomTom reverse geocoding.
- Fetch current weather from Open-Meteo.
- Fetch traffic from TomTom, with time-of-day estimates as a fallback.
- Discover events through Ticketmaster, supplemented by Tavily web search when results are sparse.
- Find restaurants and fast food within a 10-mile radius through Google Places.
- Display sample local deals and fallback event and restaurant cards.
- Rank events and restaurants using a browser-local interest profile inferred from detail-link clicks.
- Responsive dashboard with expandable event and restaurant lists.

## Stack and structure

Next.js App Router, React, TypeScript, and Tailwind CSS. API integrations run in server route handlers; saved ZIP codes and interest profiles use browser local storage.

```text
app/          Dashboard, styles, layout, and API routes
components/   Search, snapshot, weather, traffic, and discovery UI
hooks/        Snapshot fetching and interest-profile subscriptions
lib/          Provider integrations, location utilities, and ranking
data/         Sample areas and fallback content
types/        Shared TypeScript data models
tests/        Node tests for utilities and interest inference
```

The dashboard calls `GET /api/local-snapshot?zip=60614`. After resolving the ZIP through Zippopotam.us or Open-Meteo geocoding, the server requests weather, traffic, restaurants, and events concurrently. `GET /api/location-zip?lat=...&lon=...` handles reverse geocoding.

## Run locally

Use Node.js 22.13+ on the Node 22 line, or Node.js 24+, and npm. The test command uses Node's experimental TypeScript transform support.

```bash
git clone https://github.com/adarshjadhav17/Local-Lens.git
cd Local-Lens
npm ci
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). Add provider keys to `.env.local` to enable the associated integrations, then restart the development server.

| Variable | Enables |
| --- | --- |
| `TOMTOM_API_KEY` | Live traffic and current-location ZIP lookup |
| `GOOGLE_PLACES_API_KEY` | Nearby restaurant search |
| `TICKETMASTER_API_KEY` | Event discovery |
| `TAVILY_API_KEY` | Supplemental event web search |

ZIP lookup and weather do not use API keys in this implementation. You can start without provider keys: restaurants and events fall back to sample content, traffic uses estimates, and current-location ZIP lookup is unavailable. Network access is still required for ZIP resolution and live weather. Provider account permissions and quotas affect live results.

Keep credentials in `.env.local`, which is ignored by Git. `.env.example` contains only blank placeholders. Dependencies, build output, generated Next.js declarations, and TypeScript caches are also ignored; Next.js regenerates `next-env.d.ts` during development or builds. Keep `package-lock.json` committed for reproducible installs.

## Development commands

```bash
npm run dev    # Development server
npm run lint   # ESLint checks
npm test       # Utility and interest-inference tests
npm run build  # Production build
npm start      # Serve the production build
```

## Known limitations

- Local deals are sample data. Events and restaurants can also be sample content, including for ZIP codes without a curated sample area.
- The existing sample indicator is based on whether a ZIP has a mock area; it is not a reliable per-section indicator of live data. Source and freshness labeling needs improvement.
- Traffic estimates are heuristics, not measured road conditions. Live coverage depends on provider availability.
- A failed provider request can cause the combined snapshot request to fail. Independent section recovery, timeouts, and retries need further work.
- Personalization uses keyword rules and local storage. There are no accounts, cross-device profiles, conversational search, or AI-generated recommendations.
- Tests currently cover a small set of utilities and interest inference, not provider integrations or complete browser journeys.

## Proposed roadmap

These are intended directions and potential additions, not completed features or release commitments. Scope and implementation choices may change as the project develops.

### Multi-agent RAG system

- Build an ingestion pipeline for local event listings, business information, community resources, and verified offers, with normalization, deduplication, source URLs, timestamps, and expiry handling.
- Add embeddings and a vector store, combining semantic and keyword retrieval with location, distance, date, and category filters.
- Introduce a coordinating agent that interprets a user's request and delegates to specialized event, restaurant, local-deal, and travel-context agents.
- Let specialist agents retrieve relevant documents and call live weather, traffic, and place tools when fresh information is needed.
- Add a verification step to check source support, location relevance, expired events, and conflicting information before composing an answer.
- Generate conversational recommendations and local itineraries with citations, freshness information, and clear handling of missing evidence.
- Evaluate retrieval relevance, factual grounding, geographic accuracy, response latency, and cost; add agent tracing, bounded tool usage, and protections against instructions embedded in retrieved content.

### Data coverage and reliability

- Replace sample deals with verified local offers and expand event and business coverage.
- Label every section with its source, last update, and live, estimated, or sample status.
- Add provider timeouts, retries, rate limiting, shared caching, quota monitoring, and independent fallback behavior.
- Improve ZIP and coordinate validation, geographic coverage, event deduplication, and expired-listing removal.
- Add persistent storage and scheduled refresh jobs where appropriate.

### Discovery and personalization

- Add natural-language search, follow-up questions, and explanations of why a result was recommended.
- Support explicit interests, editable preferences, and controls to reset or disable personalization.
- Add filters for date, distance, price, cuisine, accessibility, and event category.
- Explore map views, saved places, favorite events, trip planning, and optional accounts for cross-device sync.
- Explore opt-in alerts for upcoming events, new offers, and relevant local changes.

### Product quality and deployment

- Improve loading, empty, and error states, mobile usability, and keyboard and screen-reader accessibility.
- Add provider contract tests, API integration tests, browser tests, and automated CI checks.
- Establish deployment configuration, monitoring, structured logs, and performance budgets.
- Document data retention, location handling, provider attribution, and user privacy controls before broader release.

Contributions and ideas are welcome. This repository is still evolving, and the immediate priority is making the existing dashboard's data and fallback behavior dependable before extending it with agents and RAG.
