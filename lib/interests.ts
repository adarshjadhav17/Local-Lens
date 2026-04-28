import type { LocalItem } from "@/types/local-area";

export type InterestProfile = {
  domains: Record<string, number>;
  interests: Record<string, number>;
};

type InterestSignal = {
  domain: string;
  interest: string;
  weight: number;
};

type InterestRule = {
  domain: string;
  interest: string;
  keywords: string[];
  fuzzy?: boolean;
  weight?: number;
};

type InterestTag = {
  domain: string;
  interest: string;
  label: string;
};

const interestStorageKey = "localLens:interestProfile";
export const interestProfileChangeEvent = "localLens:interestProfileChange";
const MAX_FUZZY_KEYWORD_LENGTH = 28;
const MIN_FUZZY_KEYWORD_LENGTH = 6;
const emptyInterestProfile: InterestProfile = {
  domains: {},
  interests: {}
};
let cachedStoredProfile: string | null = null;
let cachedInterestProfile: InterestProfile = emptyInterestProfile;

export const interestTags: InterestTag[] = [
  { domain: "fitness", interest: "strength_training", label: "Strength training" },
  { domain: "fitness", interest: "running", label: "Running" },
  { domain: "fitness", interest: "yoga", label: "Yoga" },
  { domain: "fitness", interest: "pilates", label: "Pilates" },
  { domain: "fitness", interest: "cycling", label: "Cycling" },
  { domain: "fitness", interest: "supplements", label: "Supplements" },
  { domain: "fitness", interest: "activewear", label: "Activewear" },
  { domain: "fitness", interest: "fitness_classes", label: "Fitness classes" },
  { domain: "wellness", interest: "recovery", label: "Recovery" },
  { domain: "wellness", interest: "spa", label: "Spa" },
  { domain: "food", interest: "coffee", label: "Coffee" },
  { domain: "food", interest: "pizza", label: "Pizza" },
  { domain: "food", interest: "tacos", label: "Tacos" },
  { domain: "food", interest: "brunch", label: "Brunch" },
  { domain: "food", interest: "fast_food", label: "Fast food" },
  { domain: "food", interest: "vegan", label: "Vegan" },
  { domain: "food", interest: "desserts", label: "Desserts" },
  { domain: "food", interest: "meal_kits", label: "Meal kits" },
  { domain: "sports", interest: "baseball", label: "Baseball" },
  { domain: "sports", interest: "basketball", label: "Basketball" },
  { domain: "sports", interest: "football", label: "Football" },
  { domain: "sports", interest: "soccer", label: "Soccer" },
  { domain: "sports", interest: "combat_sports", label: "Combat sports" },
  { domain: "music", interest: "rock", label: "Rock" },
  { domain: "music", interest: "pop", label: "Pop" },
  { domain: "music", interest: "r_and_b", label: "R&B" },
  { domain: "music", interest: "jazz", label: "Jazz" },
  { domain: "music", interest: "country", label: "Country" },
  { domain: "arts", interest: "theater", label: "Theater" },
  { domain: "arts", interest: "comedy", label: "Comedy" },
  { domain: "arts", interest: "museums", label: "Museums" },
  { domain: "arts", interest: "festivals", label: "Festivals" },
  { domain: "family", interest: "family_events", label: "Family events" },
  { domain: "outdoors", interest: "parks", label: "Parks" },
  { domain: "outdoors", interest: "outdoor_gear", label: "Outdoor gear" },
  { domain: "shopping", interest: "sneakers", label: "Sneakers" },
  { domain: "shopping", interest: "electronics", label: "Electronics" },
  { domain: "shopping", interest: "fashion", label: "Fashion" },
  { domain: "shopping", interest: "beauty", label: "Beauty" },
  { domain: "shopping", interest: "home_goods", label: "Home goods" },
  { domain: "travel", interest: "hotels", label: "Hotels" },
  { domain: "travel", interest: "local_tours", label: "Local tours" }
];

const interestAliases: Record<string, string> = {
  pre: "pre workout",
  "preworkout": "pre workout",
  "pre-workout": "pre workout",
  creatin: "creatine",
  protien: "protein",
  protiens: "protein",
  suppliments: "supplements",
  supps: "supplements",
  mealprep: "meal kit",
  "meal prep": "meal kit",
  meals: "meal kit",
  meal: "meal kit",
  gymwear: "activewear",
  "gym wear": "activewear",
  "gym clothes": "activewear",
  "workout clothes": "activewear",
  athleisure: "activewear",
  trainers: "sneakers",
  kicks: "sneakers",
  "running shoe": "sneakers",
  "running shoes": "sneakers",
  lift: "strength training",
  lifts: "strength training",
  lifting: "strength training",
  weights: "strength training",
  xfit: "crossfit",
  bicycling: "cycling",
  biking: "cycling",
  "spin class": "cycling",
  mex: "mexican",
  buritto: "burrito",
  burittos: "burrito",
  burguer: "burger",
  sandwhich: "sandwich",
  vegitarian: "vegetarian",
  "plant based": "plant based",
  brekkie: "breakfast",
  "icecream": "ice cream",
  bball: "basketball",
  hoops: "basketball",
  footbal: "football",
  futbol: "soccer",
  fútbol: "soccer",
  ufc: "mma",
  rb: "r&b",
  "rnb": "r&b",
  "r and b": "r&b",
  theatre: "theater",
  broadway: "theater",
  laughs: "comedy",
  comic: "comedy",
  musem: "museum",
  exibit: "exhibit",
  exhibtion: "exhibition",
  fest: "festival",
  fairs: "festival",
  kid: "kids",
  childs: "children",
  families: "family",
  outdoors: "outdoor",
  camp: "camping",
  campgear: "camping gear",
  skincare: "beauty",
  makeup: "beauty",
  cosmetics: "beauty",
  furnature: "furniture",
  decor: "home goods",
  staycation: "hotel"
};

const interestRules: InterestRule[] = [
  {
    domain: "fitness",
    interest: "strength_training",
    keywords: ["gym", "strength", "lifting", "barbell", "weights"]
  },
  {
    domain: "fitness",
    interest: "running",
    keywords: ["run", "running", "5k", "10k", "marathon", "race", "trail run"]
  },
  { domain: "fitness", interest: "yoga", keywords: ["yoga"] },
  { domain: "fitness", interest: "pilates", keywords: ["pilates"] },
  { domain: "fitness", interest: "cycling", keywords: ["cycling", "bike", "bicycle", "spin class"] },
  {
    domain: "fitness",
    interest: "supplements",
    keywords: ["protein", "supplement", "supplements", "nutrition", "pre workout", "creatine"]
  },
  {
    domain: "fitness",
    interest: "activewear",
    keywords: ["activewear", "athletic wear", "gymshark", "lululemon", "workout clothes"]
  },
  {
    domain: "fitness",
    interest: "fitness_classes",
    keywords: ["fitness class", "bootcamp", "crossfit", "training class"]
  },
  {
    domain: "wellness",
    interest: "recovery",
    keywords: ["recovery", "massage", "sauna", "stretch", "physical therapy"]
  },
  { domain: "wellness", interest: "spa", keywords: ["spa", "facial", "med spa"] },
  { domain: "food", interest: "coffee", keywords: ["coffee", "espresso", "cafe", "café"] },
  { domain: "food", interest: "pizza", keywords: ["pizza", "pizzeria"] },
  { domain: "food", interest: "tacos", keywords: ["taco", "tacos", "tex mex", "mexican", "burrito"] },
  { domain: "food", interest: "brunch", keywords: ["brunch", "pancake", "breakfast"] },
  { domain: "food", interest: "fast_food", keywords: ["fast food", "burger", "fries", "chicken sandwich"] },
  { domain: "food", interest: "vegan", keywords: ["vegan", "vegetarian", "plant-based"] },
  { domain: "food", interest: "desserts", keywords: ["dessert", "bakery", "ice cream", "pastry", "donut"] },
  { domain: "food", interest: "meal_kits", keywords: ["meal kit", "meal delivery", "prepared meals"] },
  { domain: "sports", interest: "baseball", keywords: ["baseball", "white sox", "cubs", "mlb"], weight: 1.5 },
  { domain: "sports", interest: "basketball", keywords: ["basketball", "nba", "wnba"], weight: 1.5 },
  { domain: "sports", interest: "football", keywords: ["football", "nfl"], weight: 1.5 },
  { domain: "sports", interest: "soccer", keywords: ["soccer", "mls"], weight: 1.5 },
  { domain: "sports", interest: "combat_sports", keywords: ["boxing", "mma", "ufc", "wrestling"] },
  { domain: "music", interest: "rock", keywords: ["rock", "alternative", "punk", "metal"] },
  { domain: "music", interest: "pop", keywords: ["pop"] },
  { domain: "music", interest: "r_and_b", keywords: ["r and b", "soul"] },
  { domain: "music", interest: "jazz", keywords: ["jazz"] },
  { domain: "music", interest: "country", keywords: ["country"] },
  { domain: "arts", interest: "theater", keywords: ["theatre", "theater", "broadway", "play", "musical"] },
  { domain: "arts", interest: "comedy", keywords: ["comedy", "comedian"] },
  { domain: "arts", interest: "museums", keywords: ["museum", "gallery", "exhibit", "exhibition"] },
  { domain: "arts", interest: "festivals", keywords: ["festival", "fair", "night market"] },
  { domain: "family", interest: "family_events", keywords: ["family", "kids", "children"] },
  { domain: "outdoors", interest: "parks", keywords: ["park", "outdoor", "trail", "hike", "camping"] },
  { domain: "outdoors", interest: "outdoor_gear", keywords: ["outdoor gear", "hiking boots", "camping gear"] },
  { domain: "shopping", interest: "sneakers", keywords: ["sneaker", "sneakers", "running shoes", "shoe store"] },
  { domain: "shopping", interest: "electronics", keywords: ["electronics", "computer", "phone", "tech", "gaming"] },
  { domain: "shopping", interest: "fashion", keywords: ["fashion", "apparel", "clothing", "boutique"] },
  { domain: "shopping", interest: "beauty", keywords: ["beauty", "cosmetics", "makeup", "skincare"] },
  { domain: "shopping", interest: "home_goods", keywords: ["home goods", "furniture", "decor", "mattress"] },
  { domain: "travel", interest: "hotels", keywords: ["hotel", "resort", "staycation"] },
  { domain: "travel", interest: "local_tours", keywords: ["tour", "cruise", "sightseeing"] }
];

export function getEmptyInterestProfile(): InterestProfile {
  return emptyInterestProfile;
}

export function readInterestProfile(): InterestProfile {
  if (typeof window === "undefined") {
    return getEmptyInterestProfile();
  }

  try {
    const storedProfile = window.localStorage.getItem(interestStorageKey);

    if (!storedProfile) {
      cachedStoredProfile = null;
      cachedInterestProfile = emptyInterestProfile;
      return cachedInterestProfile;
    }

    if (storedProfile === cachedStoredProfile) {
      return cachedInterestProfile;
    }

    const profile = JSON.parse(storedProfile) as Partial<InterestProfile>;

    cachedStoredProfile = storedProfile;
    cachedInterestProfile = {
      domains: sanitizeScores(profile.domains),
      interests: sanitizeScores(profile.interests)
    };

    return cachedInterestProfile;
  } catch {
    return emptyInterestProfile;
  }
}

export function recordItemInterest(item: LocalItem, interactionWeight = 1) {
  if (typeof window === "undefined") {
    return;
  }

  const signals = inferInterestSignals(item);

  if (signals.length === 0) {
    return;
  }

  const profile = readInterestProfile();

  for (const signal of signals) {
    profile.domains[signal.domain] =
      (profile.domains[signal.domain] ?? 0) + signal.weight * interactionWeight;
    profile.interests[signal.interest] =
      (profile.interests[signal.interest] ?? 0) + signal.weight * interactionWeight;
  }

  window.localStorage.setItem(interestStorageKey, JSON.stringify(profile));
  window.dispatchEvent(new Event(interestProfileChangeEvent));
}

export function rankItemsByInterests(items: LocalItem[], profile: InterestProfile) {
  return items
    .map((item, index) => ({
      item,
      index,
      score: scoreItemForProfile(item, profile)
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
}

export function inferInterestSignals(item: LocalItem): InterestSignal[] {
  const searchableText = normalizeInterestText(
    [item.title, item.meta, item.description, item.tag].join(" ")
  );
  const signals = new Map<string, InterestSignal>();

  for (const rule of interestRules) {
    if (
      !rule.keywords.some((keyword) =>
        matchesInterestKeyword(searchableText, keyword, rule.fuzzy ?? true)
      )
    ) {
      continue;
    }

    signals.set(rule.interest, {
      domain: rule.domain,
      interest: rule.interest,
      weight: rule.weight ?? 1
    });
  }

  return Array.from(signals.values());
}

export function normalizeInterestText(text: string) {
  let normalizedText = ` ${text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")} `;

  for (const [alias, canonical] of Object.entries(interestAliases)) {
    const normalizedAlias = alias.replace(/[^a-z0-9]+/g, " ");
    const normalizedCanonical = canonical.replace(/[^a-z0-9]+/g, " ");
    normalizedText = normalizedText.replace(
      new RegExp(`\\b${escapeRegExp(normalizedAlias)}\\b`, "g"),
      ` ${normalizedCanonical} `
    );
  }

  return normalizedText.replace(/\s+/g, " ").trim();
}

function matchesInterestKeyword(text: string, keyword: string, allowFuzzy: boolean) {
  const normalizedKeyword = normalizeInterestText(keyword);

  return (
    text.includes(normalizedKeyword) ||
    (allowFuzzy && hasFuzzyKeywordMatch(text, normalizedKeyword))
  );
}

function hasFuzzyKeywordMatch(text: string, keyword: string) {
  if (keyword.length < MIN_FUZZY_KEYWORD_LENGTH || keyword.length > MAX_FUZZY_KEYWORD_LENGTH) {
    return false;
  }

  const textTokens = text.split(" ");
  const keywordTokens = keyword.split(" ");

  if (keywordTokens.length === 1) {
    return textTokens.some((token) => isNearMatch(token, keyword));
  }

  return textTokens.some((_, index) => {
    const phrase = textTokens.slice(index, index + keywordTokens.length).join(" ");

    return isNearMatch(phrase, keyword);
  });
}

function isNearMatch(value: string, keyword: string) {
  const maxDistance = keyword.length <= 8 ? 1 : 2;

  return (
    Math.abs(value.length - keyword.length) <= maxDistance &&
    getEditDistance(value, keyword) <= maxDistance
  );
}

function getEditDistance(left: string, right: string) {
  const distances = Array.from({ length: left.length + 1 }, (_, index) => index);

  for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
    let previousDiagonal = distances[0];
    distances[0] = rightIndex;

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const previousLeft = distances[leftIndex];
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

      distances[leftIndex] = Math.min(
        distances[leftIndex] + 1,
        distances[leftIndex - 1] + 1,
        previousDiagonal + substitutionCost
      );
      previousDiagonal = previousLeft;
    }
  }

  return distances[left.length];
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scoreItemForProfile(item: LocalItem, profile: InterestProfile) {
  return inferInterestSignals(item).reduce((score, signal) => {
    const domainScore = profile.domains[signal.domain] ?? 0;
    const interestScore = profile.interests[signal.interest] ?? 0;

    return score + domainScore * 0.25 + interestScore;
  }, 0);
}

function sanitizeScores(scores: unknown) {
  if (!scores || typeof scores !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(scores)
      .filter((entry): entry is [string, number] => typeof entry[1] === "number")
      .map(([key, value]) => [key, Math.max(value, 0)])
  );
}
