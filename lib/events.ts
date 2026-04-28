import type { LocalItem } from "@/types/local-area";
import type { ZipLocation } from "@/types/zip-location";

type TicketmasterEvent = {
  name?: string;
  url?: string;
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
    };
    status?: {
      code?: string;
    };
  };
  classifications?: Array<{
    segment?: {
      name?: string;
    };
    genre?: {
      name?: string;
    };
  }>;
  _embedded?: {
    venues?: Array<{
      name?: string;
      city?: {
        name?: string;
      };
      state?: {
        stateCode?: string;
      };
    }>;
  };
};

type TicketmasterResponse = {
  _embedded?: {
    events?: TicketmasterEvent[];
  };
};

type TavilySearchResult = {
  title?: string;
  url?: string;
  content?: string;
};

type TavilySearchResponse = {
  results?: TavilySearchResult[];
};

const EVENT_RADIUS_MILES = 25;
const EVENT_LOOKAHEAD_DAYS = 30;
const MAX_EVENT_RESULTS = 20;
const TICKETMASTER_FETCH_SIZE = 40;
const TAVILY_RESULT_COUNT = 5;
const TAVILY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const TAVILY_ERROR_CACHE_TTL_MS = 60 * 60 * 1000;
const MIN_EVENTS_BEFORE_WEB_FALLBACK = 8;

const tavilyCache = new Map<string, { expiresAt: number; events: LocalItem[] | null }>();

export async function getNearbyEvents(location: ZipLocation): Promise<LocalItem[] | null> {
  const ticketmasterEvents = await getTicketmasterEvents(location);

  if ((ticketmasterEvents?.length ?? 0) >= MIN_EVENTS_BEFORE_WEB_FALLBACK) {
    return ticketmasterEvents;
  }

  const webEvents = await getTavilyEventResults(location);
  const mergedEvents = dedupeEvents([...(ticketmasterEvents ?? []), ...(webEvents ?? [])]);

  return mergedEvents.length > 0 ? mergedEvents.slice(0, MAX_EVENT_RESULTS) : null;
}

async function getTicketmasterEvents(location: ZipLocation): Promise<LocalItem[] | null> {
  const apiKey = process.env.TICKETMASTER_API_KEY;

  if (!apiKey) {
    return null;
  }

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + EVENT_LOOKAHEAD_DAYS);

  const params = new URLSearchParams({
    apikey: apiKey,
    countryCode: "US",
    latlong: `${location.latitude},${location.longitude}`,
    radius: String(EVENT_RADIUS_MILES),
    unit: "miles",
    size: String(TICKETMASTER_FETCH_SIZE),
    sort: "date,asc",
    startDateTime: now.toISOString().replace(/\.\d{3}Z$/, "Z"),
    endDateTime: endDate.toISOString().replace(/\.\d{3}Z$/, "Z")
  });

  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as TicketmasterResponse;
  const events = data._embedded?.events ?? [];

  if (events.length === 0) {
    return null;
  }

  const activeEvents = events.filter(isActiveEvent);

  if (activeEvents.length === 0) {
    return null;
  }

  return activeEvents.slice(0, MAX_EVENT_RESULTS).map(toLocalItem);
}

async function getTavilyEventResults(location: ZipLocation): Promise<LocalItem[] | null> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return null;
  }

  const cacheKey = `${location.zip}:${location.city}:${location.state}`.toLowerCase();
  const cached = tavilyCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.events;
  }

  const query = [
    `upcoming events near ${location.city}, ${location.state}`,
    `next ${EVENT_LOOKAHEAD_DAYS} days`,
    "community sports cultural festival marathon calendar"
  ].join(" ");

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      search_depth: "basic",
      max_results: TAVILY_RESULT_COUNT,
      include_answer: false,
      include_images: false,
      include_raw_content: false
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    tavilyCache.set(cacheKey, { expiresAt: Date.now() + TAVILY_ERROR_CACHE_TTL_MS, events: null });
    return null;
  }

  const data = (await response.json()) as TavilySearchResponse;
  const events = (data.results ?? []).map(toWebEventItem).filter((event) => event !== null);

  tavilyCache.set(cacheKey, {
    expiresAt: Date.now() + TAVILY_CACHE_TTL_MS,
    events: events.length > 0 ? events : null
  });

  return events.length > 0 ? events : null;
}

function toLocalItem(event: TicketmasterEvent): LocalItem {
  const venue = event._embedded?.venues?.[0];
  const title = event.name ?? "Nearby event";
  const category = getEventCategory(event);
  const dateLabel = formatEventDate(event.dates?.start?.localDate, event.dates?.start?.localTime);
  const venueLabel = [venue?.name, venue?.city?.name, venue?.state?.stateCode].filter(Boolean).join(", ");

  return {
    title,
    meta: `${dateLabel} · ${category}`,
    description: venueLabel || "Venue unavailable",
    tag: "Event",
    url: event.url
  };
}

function getEventCategory(event: TicketmasterEvent) {
  const classification = event.classifications?.[0];
  const category = classification?.genre?.name ?? classification?.segment?.name;

  return category && category.toLowerCase() !== "undefined" ? category : "Event";
}

function isActiveEvent(event: TicketmasterEvent) {
  const status = event.dates?.status?.code?.toLowerCase();
  const title = event.name?.toLowerCase() ?? "";

  return status !== "cancelled" && !title.includes("cancelled") && !title.includes("canceled");
}

function formatEventDate(localDate?: string, localTime?: string) {
  if (!localDate) {
    return "Date TBA";
  }

  const date = new Date(`${localDate}T${localTime ?? "12:00:00"}`);

  if (Number.isNaN(date.getTime())) {
    return localDate;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: localTime ? "numeric" : undefined,
    minute: localTime ? "2-digit" : undefined
  }).format(date);
}

function toWebEventItem(result: TavilySearchResult): LocalItem | null {
  if (!result.title || !result.url) {
    return null;
  }

  return {
    title: result.title,
    meta: "Local events · Web result",
    description: result.content ?? "Event listing found from local web search.",
    tag: "Web",
    url: result.url
  };
}

function dedupeEvents(events: LocalItem[]) {
  const seen = new Set<string>();

  return events.filter((event) => {
    const key = `${event.url ?? event.title}:${event.description}`.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
