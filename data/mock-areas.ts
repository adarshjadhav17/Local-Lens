import type { AreaSnapshot } from "@/types/local-area";

export const mockAreas: Record<string, AreaSnapshot> = {
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
        title: "Clark Street Smash",
        meta: "Fast food outlet",
        description: "Counter-service burgers, fries, and late-night shakes near the park.",
        tag: "Fast food"
      },
      {
        title: "Halsted Noodle House",
        meta: "Opened last month",
        description: "Casual ramen bowls, rice plates, and quick weekday lunch service.",
        tag: "Lunch"
      },
      {
        title: "Fullerton Taco Stand",
        meta: "New this month",
        description: "Street-style tacos, tortas, and aguas frescas from a compact walk-up window.",
        tag: "Quick bite"
      },
      {
        title: "Parkside Pizzeria",
        meta: "Recently opened",
        description: "Thin-crust slices, whole pies, and a short list of salads.",
        tag: "Pizza"
      },
      {
        title: "Armitage Grill",
        meta: "Soft opening",
        description: "Neighborhood plates, sandwiches, and weekday dinner specials.",
        tag: "Dinner"
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
        title: "Ninth Ave Burger",
        meta: "Fast food outlet",
        description: "Smash burgers, chicken sandwiches, and fries built for quick takeout.",
        tag: "Fast food"
      },
      {
        title: "Chelsea Dumpling Co.",
        meta: "Recently opened",
        description: "Hand-folded dumplings, noodle soups, and lunch combos near the galleries.",
        tag: "Lunch"
      },
      {
        title: "Hudson Slice Shop",
        meta: "New this month",
        description: "NY-style slices, garlic knots, and quick counter service.",
        tag: "Pizza"
      },
      {
        title: "Little Tempo Grill",
        meta: "Soft opening",
        description: "Mediterranean plates, wraps, and late-afternoon dinner boxes.",
        tag: "Dinner"
      },
      {
        title: "Flatiron Taco Stop",
        meta: "Opened 3 weeks ago",
        description: "Fast casual tacos, bowls, and chips with rotating salsas.",
        tag: "Quick bite"
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
        title: "South First Chicken",
        meta: "Fast food outlet",
        description: "Crispy chicken sandwiches, tenders, and drive-up dinner boxes.",
        tag: "Fast food"
      },
      {
        title: "Barton Bowl House",
        meta: "Opened 10 days ago",
        description: "Rice bowls, grilled vegetables, and spicy sauces for a quick meal.",
        tag: "Lunch"
      },
      {
        title: "Congress Pizza",
        meta: "Recently opened",
        description: "Whole pies, slices, and salads with fast counter pickup.",
        tag: "Pizza"
      },
      {
        title: "Creekside Burger",
        meta: "New this month",
        description: "Burgers, fries, and soft serve close to the trail.",
        tag: "Fast food"
      },
      {
        title: "Oltorf Grill",
        meta: "Soft opening",
        description: "Casual dinner plates, tacos, and a small patio for warm evenings.",
        tag: "Dinner"
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

export const fallbackArea: AreaSnapshot = {
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
      title: "Cornerstone Grill",
      meta: "Recently opened",
      description: "Breakfast sandwiches, burgers, and quick counter-service plates.",
      tag: "Restaurant"
    },
    {
      title: "Northline Noodles",
      meta: "New this month",
      description: "Fast casual bowls with a short seasonal menu.",
      tag: "Dinner"
    },
    {
      title: "Main Street Burger",
      meta: "Fast food outlet",
      description: "Burgers, fries, and shakes with quick pickup service.",
      tag: "Fast food"
    },
    {
      title: "Market Taco Stop",
      meta: "Opened 2 weeks ago",
      description: "Tacos, bowls, and chips with house salsas.",
      tag: "Quick bite"
    },
    {
      title: "Central Pizzeria",
      meta: "Recently opened",
      description: "Slices, whole pies, and simple salads for lunch or dinner.",
      tag: "Pizza"
    },
    {
      title: "Station Chicken",
      meta: "Fast food outlet",
      description: "Chicken sandwiches, tenders, and family meal boxes.",
      tag: "Fast food"
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
