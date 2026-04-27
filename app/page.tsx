"use client";

import { FormEvent, useMemo, useState } from "react";

type Weather = {
  temp: string;
  condition: string;
  detail: string;
};

type Traffic = {
  status: string;
  commute: string;
  alerts: string[];
};

type LocalItem = {
  title: string;
  meta: string;
  description: string;
  tag: string;
};

type AreaSnapshot = {
  zip: string;
  name: string;
  weather: Weather;
  traffic: Traffic;
  events: LocalItem[];
  restaurants: LocalItem[];
  deals: LocalItem[];
};

const mockAreas: Record<string, AreaSnapshot> = {
  "60614": {
    zip: "60614",
    name: "Lincoln Park, Chicago",
    weather: {
      temp: "62°F",
      condition: "Bright and breezy",
      detail: "Great afternoon for walking, with gusts near the lake after 4 PM."
    },
    traffic: {
      status: "Moderate",
      commute: "18 min to River North",
      alerts: ["Fullerton westbound is slow near Halsted", "CTA Brown Line running close to schedule"]
    },
    events: [
      {
        title: "Armitage Makers Night",
        meta: "Tonight, 6:30 PM",
        description: "Small-batch goods, live acoustic sets, and late shopping along Armitage.",
        tag: "Free"
      },
      {
        title: "Park Conservatory Walk",
        meta: "Tomorrow, 10:00 AM",
        description: "A guided spring planting tour around the conservatory grounds.",
        tag: "Outdoors"
      }
    ],
    restaurants: [
      {
        title: "Hearth & Fig",
        meta: "Opened 2 weeks ago",
        description: "Wood-fired flatbreads, seasonal plates, and a compact natural wine list.",
        tag: "Dinner"
      },
      {
        title: "Canal Coffee Bar",
        meta: "Soft opening",
        description: "Espresso, cardamom buns, and window seats for weekday remote work.",
        tag: "Cafe"
      }
    ],
    deals: [
      {
        title: "Neighborhood Bike Tune",
        meta: "15% off through Friday",
        description: "Quick adjustments and brake checks at a nearby repair shop.",
        tag: "Service"
      },
      {
        title: "Two-for-one Matinee",
        meta: "Weekdays before 5 PM",
        description: "Local cinema promotion for same-day walk-up tickets.",
        tag: "Arts"
      }
    ]
  },
  "10011": {
    zip: "10011",
    name: "Chelsea, New York",
    weather: {
      temp: "58°F",
      condition: "Clouds clearing",
      detail: "Dry evening expected, with cooler air moving in after sunset."
    },
    traffic: {
      status: "Heavy",
      commute: "24 min to Midtown East",
      alerts: ["9th Avenue moving slowly near 23rd", "A/C/E trains have minor downtown delays"]
    },
    events: [
      {
        title: "Gallery Late Hours",
        meta: "Tonight, 7:00 PM",
        description: "Several West Chelsea galleries keep doors open for new exhibitions.",
        tag: "Art"
      },
      {
        title: "High Line Sketch Session",
        meta: "Saturday, 11:00 AM",
        description: "Bring a notebook for a casual architectural drawing meetup.",
        tag: "Community"
      }
    ],
    restaurants: [
      {
        title: "Juniper Market",
        meta: "Opened last month",
        description: "All-day counter service with soups, grain bowls, and house pastries.",
        tag: "Lunch"
      },
      {
        title: "Little Tempo",
        meta: "New cafe",
        description: "Single-origin pour-overs and tiny savory tarts near 8th Avenue.",
        tag: "Coffee"
      }
    ],
    deals: [
      {
        title: "Pilates Intro Pack",
        meta: "3 classes for $39",
        description: "New-client offer at a boutique studio west of 7th Avenue.",
        tag: "Fitness"
      },
      {
        title: "Lunch Combo",
        meta: "$12 before 2 PM",
        description: "Rotating sandwich, soup, and iced tea special.",
        tag: "Food"
      }
    ]
  },
  "78704": {
    zip: "78704",
    name: "South Austin",
    weather: {
      temp: "78°F",
      condition: "Warm with high clouds",
      detail: "Comfortable patio weather, with a low chance of evening showers."
    },
    traffic: {
      status: "Light",
      commute: "12 min to Downtown Austin",
      alerts: ["South Congress clear in both directions", "I-35 northbound building near Riverside"]
    },
    events: [
      {
        title: "SoCo Vinyl Swap",
        meta: "Tonight, 5:30 PM",
        description: "Collectors and local DJs trade records behind a neighborhood venue.",
        tag: "Music"
      },
      {
        title: "Creekside Yoga",
        meta: "Sunday, 8:30 AM",
        description: "Donation-based outdoor class near the trail entrance.",
        tag: "Wellness"
      }
    ],
    restaurants: [
      {
        title: "Verde Mesa",
        meta: "Grand opening",
        description: "Tex-Mex breakfast tacos, aguas frescas, and an herb-filled patio.",
        tag: "Breakfast"
      },
      {
        title: "Fig Leaf Cafe",
        meta: "Opened 10 days ago",
        description: "Mediterranean coffee, flatbreads, and late-night desserts.",
        tag: "Cafe"
      }
    ],
    deals: [
      {
        title: "Patio Happy Hour",
        meta: "4-6 PM weekdays",
        description: "Half-price spritzes and snacks at a new South First spot.",
        tag: "Drinks"
      },
      {
        title: "Trail Gear Rental",
        meta: "20% off today",
        description: "Paddleboard and bike rentals with same-day online booking.",
        tag: "Outdoors"
      }
    ]
  }
};

const fallbackArea: AreaSnapshot = {
  zip: "00000",
  name: "Sample Local Area",
  weather: {
    temp: "67°F",
    condition: "Seasonable",
    detail: "Mock weather snapshot for previewing local conditions."
  },
  traffic: {
    status: "Steady",
    commute: "16 min to city center",
    alerts: ["Main corridor moving normally", "Transit departures are mostly on time"]
  },
  events: [
    {
      title: "Neighborhood Night Market",
      meta: "Tonight, 6:00 PM",
      description: "Food stalls, local artists, and live music in the central plaza.",
      tag: "Popular"
    },
    {
      title: "Library Author Talk",
      meta: "Tomorrow, 7:00 PM",
      description: "A local writer discusses a new book with audience Q&A.",
      tag: "Culture"
    }
  ],
  restaurants: [
    {
      title: "Cornerstone Cafe",
      meta: "Recently opened",
      description: "Breakfast sandwiches, espresso, and fresh baked goods.",
      tag: "Cafe"
    },
    {
      title: "Northline Noodles",
      meta: "New this month",
      description: "Fast casual bowls with a short seasonal menu.",
      tag: "Dinner"
    }
  ],
  deals: [
    {
      title: "Local Market Coupon",
      meta: "$10 off $50",
      description: "Mock grocery offer for nearby shoppers.",
      tag: "Shopping"
    },
    {
      title: "Studio Trial Pass",
      meta: "First class free",
      description: "Introductory offer from a nearby fitness studio.",
      tag: "Fitness"
    }
  ]
};

function getArea(zip: string) {
  return mockAreas[zip] ?? { ...fallbackArea, zip };
}

function Section({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-tide">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ItemCard({ item }: { item: LocalItem }) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink">{item.title}</h3>
          <p className="mt-1 text-sm font-medium text-moss">{item.meta}</p>
        </div>
        <span className="shrink-0 rounded-full bg-paper px-3 py-1 text-xs font-bold text-sunrise">
          {item.tag}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/70">{item.description}</p>
    </article>
  );
}

export default function Home() {
  const [zipInput, setZipInput] = useState("60614");
  const [activeZip, setActiveZip] = useState("60614");

  const area = useMemo(() => getArea(activeZip), [activeZip]);
  const isMockFallback = !mockAreas[activeZip];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = zipInput.replace(/\D/g, "").slice(0, 5);
    if (normalized.length === 5) {
      setActiveZip(normalized);
      setZipInput(normalized);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-5 border-b border-ink/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-tide">Nearcast</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-ink sm:text-5xl">
              Discover what is happening around you
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink/70">
              Enter a ZIP code to preview a local snapshot for weather, traffic, events, new spots,
              and nearby offers.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 rounded-lg border border-ink/10 bg-white p-3 shadow-soft sm:max-w-md sm:flex-row"
          >
            <label className="sr-only" htmlFor="zip">
              ZIP code
            </label>
            <input
              id="zip"
              inputMode="numeric"
              maxLength={5}
              pattern="[0-9]{5}"
              value={zipInput}
              onChange={(event) => setZipInput(event.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="Enter ZIP code"
              className="min-h-12 flex-1 rounded-md border border-ink/15 px-4 text-base font-semibold outline-none transition focus:border-tide focus:ring-4 focus:ring-tide/15"
            />
            <button
              type="submit"
              className="min-h-12 rounded-md bg-ink px-5 text-sm font-bold text-white transition hover:bg-tide focus:outline-none focus:ring-4 focus:ring-tide/25"
            >
              Search
            </button>
          </form>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg bg-ink p-6 text-white shadow-soft sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-white/60">
              Local snapshot
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-black sm:text-4xl">{area.name}</h2>
                <p className="mt-2 text-white/70">ZIP {area.zip}</p>
              </div>
              {isMockFallback ? (
                <span className="rounded-full bg-white/12 px-4 py-2 text-sm font-bold text-white">
                  Sample mock data
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-moss">Weather</p>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-4xl font-black text-ink">{area.weather.temp}</span>
                <span className="font-bold text-tide">{area.weather.condition}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/70">{area.weather.detail}</p>
            </div>

            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-moss">Traffic</p>
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <span className="text-2xl font-black text-ink">{area.traffic.status}</span>
                <span className="text-sm font-bold text-sunrise">{area.traffic.commute}</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink/70">
                {area.traffic.alerts.map((alert) => (
                  <li key={alert}>{alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          <Section title="Nearby Events" eyebrow="Today and soon">
            <div className="grid gap-4">
              {area.events.map((item) => (
                <ItemCard key={item.title} item={item} />
              ))}
            </div>
          </Section>

          <Section title="New Restaurants & Cafes" eyebrow="Fresh openings">
            <div className="grid gap-4">
              {area.restaurants.map((item) => (
                <ItemCard key={item.title} item={item} />
              ))}
            </div>
          </Section>

          <Section title="Local Deals" eyebrow="Nearby offers">
            <div className="grid gap-4">
              {area.deals.map((item) => (
                <ItemCard key={item.title} item={item} />
              ))}
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
