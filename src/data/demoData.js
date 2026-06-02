export const CATEGORIES = [
  "Functional Beverages",
  "Snacks & Bars",
  "Dairy",
  "Supplements",
  "Bakery",
  "Personal Care",
  "Other",
];

export const MARKETS = ["India", "USA", "UK", "SEA", "Global"];

export const CONSUMER_NEEDS = [
  "Gut Health",
  "Weight Management",
  "Energy",
  "Immunity",
  "Convenience",
  "Sustainability",
  "Indulgence",
  "Sleep",
  "Sports Performance",
];

export const LIFESTYLE_TAGS = [
  "Fitness Conscious",
  "Eco-Aware",
  "Time-Starved",
  "Budget-Minded",
  "Premium Seeker",
  "Convenience-First",
  "Family-Oriented",
  "Wellness-Driven",
  "Trend-Follower",
  "Brand-Loyal",
];

export const GENDERS = ["Female", "Male", "Non-Binary"];
export const LOCATIONS = ["Metro", "Tier-2", "Rural"];
export const INCOME_LEVELS = ["Low", "Mid", "Upper-Mid", "High"];
export const OCCUPATIONS = [
  "Working Professional",
  "Student",
  "Homemaker",
  "Entrepreneur",
  "Freelancer",
  "Healthcare",
  "Fitness Trainer",
  "Parent",
];
export const PURCHASE_BEHAVIORS = [
  "Research-heavy online buyer",
  "Impulse in-store buyer",
  "Subscription-based",
  "Discount-driven",
  "Brand-loyal repeater",
];
export const MEDIA_CHANNELS = [
  "Instagram",
  "YouTube",
  "TikTok",
  "LinkedIn",
  "Podcasts",
  "Twitter / X",
  "Email Newsletters",
  "TV / Streaming",
  "In-Store",
];

export const BENEFIT_CATEGORIES = [
  "Protein",
  "Gut Health",
  "Natural",
  "Convenience",
  "Sustainability",
  "Energy",
  "Weight Loss",
  "Taste",
  "Immunity",
  "Price Value",
];

export const COMPETITORS = [
  "MuscleBlaze",
  "Oziva",
  "Yoga Bar",
  "Wow Life Science",
  "Plix",
];

export const HEATMAP_DATA = {
  rows: BENEFIT_CATEGORIES,
  cols: [...COMPETITORS, "Your Product"],
  values: {
    Protein:        { "MuscleBlaze": 95, "Oziva": 78, "Yoga Bar": 70, "Wow Life Science": 65, "Plix": 58, "Your Product": 78 },
    "Gut Health":   { "MuscleBlaze": 35, "Oziva": 80, "Yoga Bar": 55, "Wow Life Science": 60, "Plix": 72, "Your Product": 48 },
    Natural:        { "MuscleBlaze": 50, "Oziva": 95, "Yoga Bar": 90, "Wow Life Science": 88, "Plix": 92, "Your Product": 91 },
    Convenience:    { "MuscleBlaze": 30, "Oziva": 45, "Yoga Bar": 60, "Wow Life Science": 50, "Plix": 70, "Your Product": 35 },
    Sustainability: { "MuscleBlaze": 18, "Oziva": 70, "Yoga Bar": 75, "Wow Life Science": 55, "Plix": 65, "Your Product": 22 },
    Energy:         { "MuscleBlaze": 90, "Oziva": 60, "Yoga Bar": 45, "Wow Life Science": 70, "Plix": 55, "Your Product": 40 },
    "Weight Loss":  { "MuscleBlaze": 75, "Oziva": 80, "Yoga Bar": 50, "Wow Life Science": 65, "Plix": 70, "Your Product": 30 },
    Taste:          { "MuscleBlaze": 70, "Oziva": 55, "Yoga Bar": 95, "Wow Life Science": 60, "Plix": 75, "Your Product": 65 },
    Immunity:       { "MuscleBlaze": 55, "Oziva": 90, "Yoga Bar": 65, "Wow Life Science": 75, "Plix": 60, "Your Product": 25 },
    "Price Value":  { "MuscleBlaze": 60, "Oziva": 35, "Yoga Bar": 50, "Wow Life Science": 45, "Plix": 40, "Your Product": 24 },
  },
  topClaimants: {
    Protein:        "MuscleBlaze (95)",
    "Gut Health":   "Oziva (80)",
    Natural:        "Oziva (95)",
    Convenience:    "Plix (70)",
    Sustainability: "Yoga Bar (75)",
    Energy:         "MuscleBlaze (90)",
    "Weight Loss":  "Oziva (80)",
    Taste:          "Yoga Bar (95)",
    Immunity:       "Oziva (90)",
    "Price Value":  "MuscleBlaze (60)",
  },
};

export const CLAIM_SATURATION = [
  { claim: "Natural", score: 91, status: "saturated" },
  { claim: "High-Protein", score: 78, status: "saturated" },
  { claim: "Plant-Based", score: 62, status: "competitive" },
  { claim: "Gut Health", score: 48, status: "competitive" },
  { claim: "Mood Boosting", score: 19, status: "available" },
  { claim: "Affordable Protein", score: 24, status: "available" },
];

export const WHITESPACE_OPPORTUNITIES = [
  {
    pairing: "Sustainability × Convenience",
    description:
      "No brand owns 'quick AND responsible'. Eco claims exist but are tied to slow, ritualistic moments — not the 30-second morning.",
  },
  {
    pairing: "Protein × Budget-Friendly",
    description:
      "Affordable functional protein is open. Current players either charge a premium (Oziva) or under-deliver on protein density (mass brands).",
  },
  {
    pairing: "Mood × Routine",
    description:
      "Protein is gym-associated, not a daily ritual. The 'morning mood boost' territory is unclaimed by oat-shake competitors.",
  },
];

export const RESONANCE_PREDICTIONS = [
  { positioning: "20-minute morning protein", score: 87, risk: "low" },
  { positioning: "Honest, no-BS ingredients", score: 74, risk: "low" },
  { positioning: "Affordable daily fuel", score: 71, risk: "low" },
  { positioning: "Eco-friendly packaging", score: 62, risk: "medium" },
  { positioning: "Performance protein", score: 48, risk: "high" },
  { positioning: "Indulgent dessert shake", score: 35, risk: "high" },
];

export const STEP4_OUTPUT = {
  differentiation_score: 68,
  claim_uniqueness_index: 54,
  persona_claim_fit: 81,
  whitespace_score: 70,
  value_propositions: [
    {
      rank: 1,
      headline: "Protein that fits your 20-minute morning.",
      rationale:
        "Slots the product into a specific time-of-day routine. Aligns directly with Priya's 'Time-Starved' lifestyle and the open 'mood × routine' whitespace. Differentiation is high because competitors are stuck on gym/premium positioning.",
      stars: 5,
      risk: "low",
    },
    {
      rank: 2,
      headline: "Clean fuel. Real ingredients. Under ₹60.",
      rationale:
        "Hits the budget + transparency gap. Competes on clarity, not aspiration. Lower resonance than #1 because 'clean' is partially saturated, but price + simplicity lands a strong second punch.",
      stars: 4,
      risk: "low",
    },
    {
      rank: 3,
      headline: "The oat shake that tastes like you didn't have to try.",
      rationale:
        "Emotional, self-aware tone. Strong on tone of voice and shares territory with the indulgence gap. Risk is medium because 'taste' is competitive — needs strong creative execution to break through.",
      stars: 3,
      risk: "medium",
    },
  ],
  messaging: {
    lead_claim: "20-minute morning protein — no prep, no compromise",
    proof_point: "18g oat protein, ready in 30 seconds",
    emotional_hook: "You're doing everything right. This makes it easier.",
    avoid: ["Natural", "100% Pure", "High-Protein"],
    tone: "Practical, warm, no-nonsense",
    channels: ["Instagram Reels", "YouTube Shorts", "Podcasts"],
  },
  next_steps: [
    { title: "Finalize Value Proposition #1", icon: "target" },
    { title: "Run a 30-person consumer concept test", icon: "users" },
    { title: "Monitor MuscleBlaze's product gap", icon: "radar" },
    { title: "Brief creative agency with messaging table", icon: "megaphone" },
    { title: "Share report with brand leadership", icon: "share" },
  ],
};

export const PROJECTS = [
  {
    id: "p-001",
    name: "Sunrise Oat Protein Shake",
    category: "Functional Beverages",
    score: 68,
    status: "complete",
    updated: "2 days ago",
  },
  {
    id: "p-002",
    name: "PlantFuel Recovery Bar",
    category: "Snacks & Bars",
    score: 42,
    status: "in_progress",
    updated: "Today",
  },
  {
    id: "p-003",
    name: "Calm Night Sleep Tonic",
    category: "Functional Beverages",
    score: 0,
    status: "draft",
    updated: "5 days ago",
  },
  {
    id: "p-004",
    name: "GreenGut Daily Yoghurt",
    category: "Dairy",
    score: 0,
    status: "draft",
    updated: "1 week ago",
  },
  {
    id: "p-005",
    name: "Hydra+ Vitamin Water",
    category: "Functional Beverages",
    score: 57,
    status: "complete",
    updated: "3 weeks ago",
  },
  {
    id: "p-006",
    name: "EcoWhey Protein Pouch",
    category: "Supplements",
    score: 71,
    status: "in_progress",
    updated: "Yesterday",
  },
];
