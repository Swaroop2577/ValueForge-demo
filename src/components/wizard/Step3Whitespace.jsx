import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { HEATMAP_DATA, CLAIM_SATURATION, WHITESPACE_OPPORTUNITIES, RESONANCE_BY_PERSONA } from "../../data/demoData";
import SaturationBar from "../shared/SaturationBar";

const BENEFIT_ROWS = [
  "Protein", "Gut Health", "Digestive Health", "Natural", "Clean Label",
  "Convenience", "Hydration", "Sustainability", "Energy", "Recovery",
  "Weight Loss", "Mental Clarity", "Taste", "Immunity", "Price Value",
];

// Each claim keyword maps to ONE OR MORE benefit rows
// This means "plant-based" correctly signals both Natural AND Sustainability
const claimToBenefitsMap = {
  // ── Protein & Performance ────────────────────────────────────────────
  "high-protein":        ["Protein"],
  "whey-based":          ["Protein", "Recovery"],
  "whey":                ["Protein", "Recovery"],
  "plant protein":       ["Protein", "Natural", "Sustainability"],
  "protein":             ["Protein"],
  "complete nutrition":  ["Protein", "Immunity"],
  "post-workout":        ["Recovery", "Protein"],
  "muscle recovery":     ["Recovery"],
  "pre-workout":         ["Energy", "Recovery"],
  "bcaa":                ["Recovery", "Protein"],
  "gym-focused":         ["Protein", "Recovery", "Energy"],
  "mass brand":          ["Protein"],
  "sports":              ["Recovery", "Energy", "Protein"],
  "performance":         ["Recovery", "Energy"],

  // ── Natural & Clean ──────────────────────────────────────────────────
  "natural":             ["Natural"],
  "no added sugar":      ["Natural", "Clean Label"],
  "organic":             ["Natural", "Clean Label"],
  "clean label":         ["Clean Label", "Natural"],
  "clean ingredients":   ["Natural", "Clean Label"],
  "no artificial":       ["Clean Label", "Natural"],
  "minimally processed": ["Natural", "Clean Label"],
  "whole grain":         ["Natural", "Gut Health"],
  "ingredient":          ["Clean Label"],

  // ── Plant-based & Sustainability ─────────────────────────────────────
  "plant-based":         ["Natural", "Sustainability", "Clean Label"],
  "vegan":               ["Natural", "Sustainability"],
  "gluten-free":         ["Clean Label"],
  "eco-friendly":        ["Sustainability"],
  "eco":                 ["Sustainability"],
  "recyclable":          ["Sustainability"],
  "locally sourced":     ["Sustainability", "Natural"],
  "sustainable":         ["Sustainability"],

  // ── Gut & Digestive ──────────────────────────────────────────────────
  "gut-friendly":        ["Gut Health"],
  "gut health":          ["Gut Health"],
  "gut":                 ["Gut Health"],
  "probiotic":           ["Gut Health"],
  "prebiotic":           ["Gut Health"],
  "high-fibre":          ["Gut Health", "Weight Loss"],
  "digestive support":   ["Gut Health"],
  "digestive":           ["Gut Health"],

  // ── Weight & Metabolism ──────────────────────────────────────────────
  "low-calorie":         ["Weight Loss"],
  "keto-friendly":       ["Weight Loss", "Clean Label"],
  "low-carb":            ["Weight Loss"],
  "fat-burning":         ["Weight Loss", "Energy"],
  "metabolism boost":    ["Weight Loss", "Energy"],
  "metabolism":          ["Weight Loss", "Energy"],
  "weight":              ["Weight Loss"],

  // ── Energy & Mental ──────────────────────────────────────────────────
  "energy boost":        ["Energy"],
  "energy":              ["Energy"],
  "slow-release energy": ["Energy"],
  "caffeine-free":       ["Natural", "Energy"],
  "caffeine":            ["Energy"],
  "electrolyte":         ["Hydration", "Energy"],
  "focus":               ["Mental Clarity", "Energy"],
  "nootropic":           ["Mental Clarity"],
  "stress relief":       ["Mental Clarity"],
  "mental":              ["Mental Clarity"],

  // ── Immunity & Wellness ──────────────────────────────────────────────
  "immunity support":    ["Immunity"],
  "immunity":            ["Immunity"],
  "immune":              ["Immunity"],
  "vitamin-rich":        ["Immunity"],
  "vitamin":             ["Immunity"],
  "antioxidant":         ["Immunity", "Natural"],
  "zinc":                ["Immunity"],
  "adaptogen":           ["Immunity", "Mental Clarity"],
  "clinically proven":   ["Immunity", "Clean Label"],

  // ── Convenience ──────────────────────────────────────────────────────
  "ready-to-drink":      ["Convenience"],
  "on-the-go":           ["Convenience"],
  "no prep":             ["Convenience"],
  "kid-friendly":        ["Convenience"],
  "quick dissolve":      ["Convenience"],
  "convenient":          ["Convenience"],

  // ── Hydration ────────────────────────────────────────────────────────
  "hydration":           ["Hydration"],
  "hydrat":              ["Hydration"],
  "coconut water":       ["Hydration", "Natural"],

  // ── Taste & Indulgence ───────────────────────────────────────────────
  "great taste":         ["Taste"],
  "indulgent":           ["Taste"],
  "no chalky":           ["Taste"],
  "dessert":             ["Taste"],
  "flavour":             ["Taste"],
  "flavor":              ["Taste"],
  "taste":               ["Taste"],

  // ── Price & Value ────────────────────────────────────────────────────
  "affordable":          ["Price Value"],
  "value for money":     ["Price Value"],
  "budget-friendly":     ["Price Value"],
  "premium pricing":     ["Clean Label"],
  "premium":             ["Clean Label"],
};

// Backwards-compat helper: returns first benefit (for single-benefit contexts)
const claimToBenefitMap = Object.fromEntries(
  Object.entries(claimToBenefitsMap).map(([k, v]) => [k, v[0]])
);

// ── Derive consumer needs from persona attributes ───────────────────────────
const LIFESTYLE_TO_NEEDS = {
  "Fitness Conscious":  ["Sports Performance", "Energy", "Weight Management"],
  "Time-Starved":       ["Convenience"],
  "Wellness-Driven":    ["Gut Health", "Immunity", "Sleep"],
  "Eco-Aware":          ["Sustainability"],
  "Budget-Minded":      ["Price Value"],
  "Premium Seeker":     ["Clean Label", "Immunity"],
  "Convenience-First":  ["Convenience"],
  "Family-Oriented":    ["Gut Health", "Immunity"],
  "Trend-Follower":     ["Energy", "Mental Clarity"],
  "Brand-Loyal":        [],
};

const OCCUPATION_TO_NEEDS = {
  "Working Professional": ["Convenience", "Energy", "Mental Clarity"],
  "Student":              ["Energy", "Price Value"],
  "Homemaker":            ["Gut Health", "Convenience"],
  "Entrepreneur":         ["Energy", "Mental Clarity", "Convenience"],
  "Freelancer":           ["Energy", "Mental Clarity"],
  "Healthcare":           ["Immunity", "Energy"],
  "Fitness Trainer":      ["Sports Performance", "Recovery", "Protein"],
  "Parent":               ["Gut Health", "Immunity", "Convenience"],
};

const INCOME_TO_NEEDS = {
  "Low":       ["Price Value"],
  "Mid":       [],
  "Upper-Mid": ["Clean Label", "Sustainability"],
  "High":      ["Clean Label", "Sustainability", "Indulgence"],
};

const PURCHASE_TO_NEEDS = {
  "Research-heavy online buyer": ["Clean Label"],
  "Impulse in-store buyer":      ["Convenience", "Taste"],
  "Subscription-based":          ["Convenience"],
  "Discount-driven":             ["Price Value"],
  "Brand-loyal repeater":        [],
};

// ── Whitespace copy recommendations ────────────────────────────────────────
const WHITESPACE_COPY = {
  "Gut Health": {
    ingredient: "Prebiotic oat beta-glucan at 3g per serve \u2014 clinically linked to gut lining support, unclaimed in RTD format in this category",
    format: "Ready-to-drink, chilled format, morning occasion",
    framings: ["Built for your gut. Ready in 60s.", "Protein that works from the inside out.", "Not just clean. Actually functional."],
  },
  "Convenience": {
    ingredient: "Single-serve, no-mix oat protein base \u2014 full nutrition in a grab-and-go format",
    format: "Tetra pak or chilled bottle, 200ml, priced for daily use",
    framings: ["No prep. No compromise.", "Your 20-minute morning sorted.", "Fast breakfast. Real nutrition."],
  },
  "Energy": {
    ingredient: "Natural caffeine from green tea extract + oat slow-release carbs \u2014 sustained energy without crash",
    format: "250ml functional RTD, morning or pre-work occasion",
    framings: ["Steady energy. No crash.", "Fuel that lasts till lunch.", "Not a shot. A meal."],
  },
  "Recovery": {
    ingredient: "Oat protein + electrolyte blend \u2014 muscle recovery without artificial additives",
    format: "Post-workout RTD, 330ml, gym and sports retail channel",
    framings: ["Recover clean.", "Real protein. Real recovery.", "No whey. No problem."],
  },
  "Weight Loss": {
    ingredient: "High-fibre oat protein \u2014 satiety-first formulation, low glycaemic index",
    format: "Meal replacement format, 300\u2013400 kcal, breakfast or lunch occasion",
    framings: ["Full for longer. Lighter over time.", "Protein that manages hunger.", "Clean calories that count."],
  },
  "Immunity": {
    ingredient: "Vitamin C + Zinc + oat beta-glucan \u2014 natural immune stack, no synthetic fortification",
    format: "Daily functional shot or RTD, 100\u2013150ml, morning ritual",
    framings: ["Immunity you can taste.", "Built in. Not bolted on.", "Your daily defence. Under \u20B960."],
  },
  "Natural": {
    ingredient: "Whole grain oat base, no isolates, no artificial sweeteners \u2014 clean label from field to bottle",
    format: "Transparent packaging showing real ingredients, no-nonsense label design",
    framings: ["You can read every ingredient.", "Nothing you can\u2019t pronounce.", "Real food. Liquid form."],
  },
  "Sustainability": {
    ingredient: "Oat farming has 80% lower carbon footprint than dairy \u2014 lead with provenance",
    format: "Compostable or recyclable packaging, local sourcing callout",
    framings: ["Better for you. Easier on the planet.", "Low footprint protein.", "Grown here. Made here."],
  },
  "default": {
    ingredient: "Oat-based functional formulation \u2014 leverage whole grain credibility in an unclaimed benefit space",
    format: "RTD or sachet format, daily habit occasion",
    framings: ["Simple. Functional. Yours.", "The gap your competitors missed.", "Clean protein in a new space."],
  },
};

// ── Persona pain point lookup for resonance copy ───────────────────────────
const PERSONA_PAIN_POINTS = {
  "Time-Starved":       "no time for complicated nutrition",
  "Fitness Conscious":  "performance without artificial shortcuts",
  "Wellness-Driven":    "ingredients you can actually trust",
  "Eco-Aware":          "products that don\u2019t cost the planet",
  "Budget-Minded":      "real nutrition at a real price",
  "Premium Seeker":     "quality that justifies the price",
  "Convenience-First":  "nutrition that fits into real life",
  "Family-Oriented":    "something the whole family can trust",
};

// Need → benefit row mapping (for heatmap boosting)
const NEED_TO_BENEFIT = {
  "Sports Performance": ["Protein", "Recovery", "Energy"],
  "Energy":             ["Energy"],
  "Weight Management":  ["Weight Loss", "Protein"],
  "Gut Health":         ["Gut Health"],
  "Immunity":           ["Immunity"],
  "Sleep":              ["Mental Clarity"],
  "Sustainability":     ["Sustainability"],
  "Convenience":        ["Convenience"],
  "Clean Label":        ["Clean Label", "Natural"],
  "Mental Clarity":     ["Mental Clarity"],
  "Indulgence":         ["Taste"],
  "Price Value":        ["Price Value"],
  "Protein":            ["Protein"],
  "Recovery":           ["Recovery"],
  "Taste":              ["Taste"],
};

export function deriveConsumerNeeds(personas = []) {
  const needScores = {};
  const add = (need, weight = 1) => {
    needScores[need] = (needScores[need] || 0) + weight;
  };

  personas.forEach((p) => {
    (p.lifestyle_tags || []).forEach((tag) => {
      (LIFESTYLE_TO_NEEDS[tag] || []).forEach((n) => add(n, 2));
    });
    (p.occupation || []).forEach((occ) => {
      (OCCUPATION_TO_NEEDS[occ] || []).forEach((n) => add(n, 1.5));
    });
    (INCOME_TO_NEEDS[p.income_level] || []).forEach((n) => add(n, 1));
    (PURCHASE_TO_NEEDS[p.purchase_behavior] || []).forEach((n) => add(n, 1));
  });

  // Return needs sorted by score, deduplicated
  return Object.entries(needScores)
    .sort((a, b) => b[1] - a[1])
    .map(([need]) => need);
}

function compClaimsList(comp) {
  if (Array.isArray(comp.claims)) return comp.claims.map((c) => c.toLowerCase().trim());
  if (typeof comp.claims === "string") return comp.claims.split(/[,;]\s*/).map((c) => c.toLowerCase().trim());
  return [];
}

// ── Tunable priority config ────────────────────────────────────────────────
// Adjust these ranges to control the shape of scores. All values 0-100.
// claimed:   [min, max] when the brand actively makes this claim
// unclaimed: [min, max] when the brand doesn't mention this benefit
const MARKET_POSITION_PRIORITY = {
  "Category Leader": { active: [72, 95], passive_adjacent: [35, 62], passive_distant: [18, 40] },
  "Challenger":      { active: [50, 74], passive_adjacent: [22, 45], passive_distant: [8,  28] },
  "Niche Player":    { active: [32, 58], passive_adjacent: [10, 28], passive_distant: [4,  18] },
};

// Which benefit categories bleed into each other for passive scoring
const SCORING_ADJACENCY = {
  "Protein":        ["Recovery", "Energy", "Weight Loss", "Gut Health"],
  "Natural":        ["Clean Label", "Gut Health", "Sustainability", "Immunity", "Weight Loss"],
  "Gut Health":     ["Natural", "Immunity", "Clean Label", "Weight Loss"],
  "Clean Label":    ["Natural", "Sustainability", "Gut Health", "Immunity"],
  "Energy":         ["Recovery", "Protein", "Mental Clarity", "Convenience", "Weight Loss"],
  "Recovery":       ["Protein", "Energy"],
  "Weight Loss":    ["Protein", "Energy", "Natural", "Gut Health"],
  "Immunity":       ["Gut Health", "Natural", "Clean Label"],
  "Convenience":    ["Energy", "Taste"],
  "Sustainability": ["Natural", "Clean Label"],
  "Taste":          ["Convenience", "Natural"],
  "Mental Clarity": ["Energy", "Immunity"],
  "Hydration":      ["Energy", "Natural", "Recovery"],
  "Price Value":    ["Convenience"],
};

// Claim-strength modifier: how much a specific claim type skews toward the
// top of the range. 1.0 = full top, 0.0 = full bottom, 0.5 = midpoint.
const CLAIM_STRENGTH = {
  "high-protein":      0.85,
  "protein":           0.80,
  "natural":           0.80,
  "plant-based":       0.75,
  "gut-friendly":      0.70,
  "gut health":        0.70,
  "clean label":       0.70,
  "no added sugar":    0.65,
  "organic":           0.65,
  "clinically proven": 0.80,
  "vegan":             0.60,
  "gluten-free":       0.55,
  "keto-friendly":     0.55,
  "low-calorie":       0.50,
  "recovery":          0.70,
  "hydration":         0.65,
  "energy":            0.65,
  "complete nutrition":0.75,
  "default":           0.50, // unknown claim → midpoint
};

// Known market positions for brands. Add any brand here to give it a position.
// Brands not listed default to "Challenger".
const KNOWN_MARKET_POSITIONS = {
  "MuscleBlaze":    "Category Leader",
  "Oziva":          "Challenger",
  "Yoga Bar":       "Niche Player",
  "Wow Life Science":"Niche Player",
  "Plix":           "Niche Player",
  "Slurrp Farm":    "Niche Player",
  "Ensure (Abbott)":"Category Leader",
  "Horlicks":       "Category Leader",
  "Complan":        "Category Leader",
  "RiteBite":       "Challenger",
  "Mojo":           "Challenger",
};

// Seeded pseudo-random: same brand+benefit always gives same score (stable UI)
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function strToSeed(str) {
  return str.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function scoredValue(brandName, benefit, hasClaim, claimKey, marketPosition, claimedBenefits) {
  const mp = marketPosition || KNOWN_MARKET_POSITIONS[brandName] || "Challenger";
  const priority = MARKET_POSITION_PRIORITY[mp] || MARKET_POSITION_PRIORITY["Challenger"];

  let lo, hi;
  if (hasClaim) {
    [lo, hi] = priority.active;
  } else {
    // Check if any of the brand's claimed benefits are adjacent to this one
    const isAdjacent = (claimedBenefits || []).some(
      (cb) => (SCORING_ADJACENCY[cb] || []).includes(benefit)
    );
    [lo, hi] = isAdjacent ? priority.passive_adjacent : priority.passive_distant;
  }

  const strength = hasClaim
    ? (CLAIM_STRENGTH[claimKey] ?? CLAIM_STRENGTH["default"])
    : 0.5;

  const rand = seededRandom(strToSeed(brandName + benefit));
  const skewed = lo + (hi - lo) * (strength * 0.6 + rand * 0.4);
  return Math.round(Math.max(lo, Math.min(hi, skewed)));
}

function getCompScores(competitor, rows) {
  const claims = compClaimsList(competitor);

  // Build benefit → claim key map (active claims only)
  const benefitToClaimKey = {};
  claims.forEach((claim) => {
    Object.entries(claimToBenefitsMap).forEach(([key, benefits]) => {
      if (claim.includes(key)) {
        benefits.forEach((benefit) => {
          if (!benefitToClaimKey[benefit]) benefitToClaimKey[benefit] = key;
        });
      }
    });
  });

  // All benefits this competitor actively claims — used for passive adjacency
  const claimedBenefits = Object.keys(benefitToClaimKey);

  const scores = {};
  rows.forEach((benefit) => {
    const matchedClaimKey = benefitToClaimKey[benefit] ?? null;
    const hasClaim = matchedClaimKey !== null;
    scores[benefit] = scoredValue(
      competitor.name, benefit, hasClaim, matchedClaimKey,
      competitor.marketPosition, claimedBenefits
    );
  });
  return scores;
}

// ── Whitespace opportunity engine ─────────────────────────────────────────
function computeWhitespaceOpportunities(heatmapValues, dynamicRows, competitors, keyClaims, personas, derivedNeeds) {
  const wsRows = dynamicRows.filter(row =>
    competitors.every(c => (heatmapValues[row]?.[c.name] ?? 0) < 40)
  );
  if (wsRows.length === 0) return null;

  const scored = wsRows.map(row => {
    const compScores = competitors.map(c => heatmapValues[row]?.[c.name] ?? 0);
    const maxComp = Math.max(...compScores, 0);
    const whitespaceGap = maxComp === 0 ? 100 : Math.round(((40 - maxComp) / 40) * 100);

    const needIdx = derivedNeeds.indexOf(row);
    const personaWeight = needIdx === -1 ? 20
      : needIdx === 0 ? 100
      : needIdx === 1 ? 85
      : needIdx === 2 ? 70
      : needIdx === 3 ? 55
      : 40;

    const claimsMapToRow = keyClaims.some(kc => {
      const lc = kc.toLowerCase().trim();
      return Object.entries(claimToBenefitsMap).some(([key, benefits]) =>
        lc.includes(key) && benefits.includes(row)
      );
    });
    const adjacentBenefits = SCORING_ADJACENCY[row] || [];
    const claimsMapAdjacent = !claimsMapToRow && keyClaims.some(kc => {
      const lc = kc.toLowerCase().trim();
      return Object.entries(claimToBenefitsMap).some(([key, benefits]) =>
        lc.includes(key) && benefits.some(b => adjacentBenefits.includes(b))
      );
    });
    const claimCredibility = claimsMapToRow ? 100 : claimsMapAdjacent ? 60 : 20;

    const opportunityScore = Math.round(whitespaceGap * 0.5 + personaWeight * 0.3 + claimCredibility * 0.2);
    const type = compScores.every(s => s < 25) ? "virgin" : "abandoned";
    const confidence = opportunityScore >= 70 ? "high" : opportunityScore >= 45 ? "medium" : "speculative";

    const adjacent = (SCORING_ADJACENCY[row] || [])
      .map(adjRow => ({
        claim: adjRow,
        score: Math.max(...competitors.map(c => heatmapValues[adjRow]?.[c.name] ?? 0))
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    const copy = WHITESPACE_COPY[row] || WHITESPACE_COPY["default"];

    const fitByPersona = personas.map(persona => {
      const pNeeds = deriveConsumerNeeds([persona]);
      const pIdx = pNeeds.indexOf(row);
      const needScore = pIdx === -1 ? 20
        : pIdx === 0 ? 95
        : pIdx === 1 ? 80
        : pIdx === 2 ? 65
        : 50;
      return Math.round(needScore * 0.6 + opportunityScore * 0.4);
    });

    return { row, opportunityScore, type, confidence, adjacent, copy, fitByPersona };
  });

  scored.sort((a, b) => b.opportunityScore - a.opportunityScore);

  const buildCard = (sr) => ({
    zone: sr.row,
    type: sr.type,
    confidence: sr.confidence,
    fit: sr.opportunityScore,
    fitByPersona: sr.fitByPersona,
    adjacentClaims: sr.adjacent,
    ingredient: sr.copy.ingredient,
    format: sr.copy.format,
    claimFramings: sr.copy.framings,
  });

  const cards = [buildCard(scored[0])];

  if (scored.length >= 2) {
    const top = scored[0], combo = scored[1];
    const avgScore = Math.round((top.opportunityScore + combo.opportunityScore) / 2);
    const combinedScore = Math.min(95, Math.round(avgScore * 1.1));
    const combinedType = top.type === "virgin" && combo.type === "virgin" ? "virgin" : "abandoned";
    const combinedConfidence = combinedScore >= 70 ? "high" : combinedScore >= 45 ? "medium" : "speculative";
    const combinedCopy = WHITESPACE_COPY[top.row] || WHITESPACE_COPY["default"];
    const combinedAdjacent = [...top.adjacent, ...combo.adjacent]
      .filter((a, i, arr) => arr.findIndex(x => x.claim === a.claim) === i)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    const combinedFitByPersona = personas.map((_, pi) => {
      const topFit = top.fitByPersona[pi] || 50;
      const comboFit = combo.fitByPersona[pi] || 50;
      return Math.min(95, Math.round((topFit + comboFit) / 2 + 5));
    });

    cards.push({
      zone: top.row + " \u00d7 " + combo.row,
      type: combinedType,
      confidence: combinedConfidence,
      fit: combinedScore,
      fitByPersona: combinedFitByPersona,
      adjacentClaims: combinedAdjacent,
      ingredient: combinedCopy.ingredient,
      format: combinedCopy.format,
      claimFramings: combinedCopy.framings,
    });
  }

  if (scored.length >= 3) cards.push(buildCard(scored[2]));
  return cards;
}

// ── Consumer Resonance engine ──────────────────────────────────────────────
function computeResonance(keyClaims, competitors, heatmapValues, dynamicRows, persona) {
  const tags = persona.lifestyle_tags || [];
  const painPoint = tags.map(t => PERSONA_PAIN_POINTS[t]).filter(Boolean)[0] || "nutrition that works for you";
  const topClaim = keyClaims[0] || "";
  const topClaimBenefit = (() => {
    const lc = topClaim.toLowerCase().trim();
    for (const [key, benefits] of Object.entries(claimToBenefitsMap)) {
      if (lc.includes(key)) return benefits[0];
    }
    return "";
  })();
  const secondClaim = keyClaims[1] || "";
  const secondClaimBenefit = (() => {
    const lc = secondClaim.toLowerCase().trim();
    for (const [key, benefits] of Object.entries(claimToBenefitsMap)) {
      if (lc.includes(key)) return benefits[0];
    }
    return "";
  })();

  const wsRows = dynamicRows.filter(row =>
    competitors.every(c => (heatmapValues[row]?.[c.name] ?? 0) < 40)
  );
  const wsScores = wsRows.map(row => ({
    row,
    maxComp: Math.max(...competitors.map(c => heatmapValues[row]?.[c.name] ?? 0)),
  })).sort((a, b) => a.maxComp - b.maxComp);
  const topWsRow = wsScores[0]?.row || "";

  const personaNeeds = deriveConsumerNeeds([persona]);
  const topNeed = personaNeeds[0] || "";

  const pos1Claim = topClaimBenefit || topClaim;
  const pos1 = { positioning: pos1Claim + " that fits your " + (topNeed.toLowerCase() || "lifestyle") };

  const pos2 = {
    positioning: topWsRow
      ? topWsRow + " protein \u2014 the gap every big brand missed"
      : (topClaimBenefit || "Real nutrition") + " \u2014 " + painPoint,
  };

  const pos3 = {
    positioning: secondClaim
      ? (topClaimBenefit || topClaim) + ". " + (secondClaimBenefit || secondClaim) + ". No compromise."
      : (topClaimBenefit || topClaim) + " \u2014 " + painPoint,
  };

  const result = [pos1, pos2, pos3].map((p, i) => {
    const posLower = p.positioning.toLowerCase();
    const claimFit = keyClaims.some(kc => posLower.includes(kc.toLowerCase().trim().substring(0, 8))) ? 90 : 65;
    const benefitInPos = dynamicRows.find(r => posLower.includes(r.toLowerCase().trim().substring(0, 6)));
    const maxCompForBenefit = benefitInPos
      ? Math.max(...competitors.map(c => heatmapValues[benefitInPos]?.[c.name] ?? 0))
      : 50;
    const whitespaceBonus = benefitInPos && maxCompForBenefit < 40 ? 100
      : benefitInPos && maxCompForBenefit <= 65 ? 60
      : 20;

    let tagMatchScore = 0;
    tags.forEach(tag => {
      if (posLower.includes(tag.toLowerCase().substring(0, 5))) tagMatchScore = Math.min(100, tagMatchScore + 25);
    });
    personaNeeds.forEach(need => {
      if (posLower.includes(need.toLowerCase().substring(0, 6))) tagMatchScore = Math.min(100, tagMatchScore + 25);
    });

    const resonanceScore = Math.round(claimFit * 0.4 + whitespaceBonus * 0.3 + tagMatchScore * 0.3);
    const risk = resonanceScore >= 70 ? "low" : resonanceScore >= 50 ? "medium" : "high";
    return { rank: i + 1, positioning: p.positioning, score: resonanceScore, risk };
  });
  return result;
}

function cellColor(v) {
  if (v >= 75) return "bg-danger";
  if (v >= 40) return "bg-accent-amber";
  if (v > 0) return "border-2 border-accent-teal text-accent-teal";
  return "bg-border-color";
}

function cellOpacity(v) {
  return Math.max(0.35, Math.min(1, v / 100));
}

function Heatmap({ cols, rows, values, topClaimants, rowStyles, compClaimsMap }) {
  const [hover, setHover] = useState(null);

  const getTopClaims = (col) => {
    const claims = compClaimsMap?.[col];
    if (!claims || claims.length === 0) return null;
    return claims.slice(0, 2).join(" \u00b7 ");
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left text-text-secondary font-medium pl-2 pb-2">Benefit</th>
              {cols.map((c) => (
                <th
                  key={c}
                  className={`text-text-secondary font-medium pb-2 px-2 ${
                    c === "Your Product" ? "border-2 border-dashed border-accent-amber text-accent-amber rounded-t" : ""
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const rs = rowStyles?.[row];
              return (
                <tr key={row}>
                  <td
                    className={`text-left pl-2 pr-3 py-1 font-medium ${
                      rs?.leftBorder ? "pl-1.5 border-l-[3px] " + rs.leftBorder : ""
                    } ${rs?.bg ? rs.bg : "text-text-primary"}`}
                    style={rs?.bgColor ? { backgroundColor: rs.bgColor } : undefined}
                  >
                    {row}
                  </td>
                  {cols.map((col) => {
                    const v = values[row]?.[col] ?? 0;
                    const isYou = col === "Your Product";
                    return (
                      <td key={col} className="p-0">
                        <div
                          className={`relative h-10 rounded flex items-center justify-center font-mono text-xs cursor-pointer transition-all ${
                            isYou ? "border-2 border-dashed border-accent-amber" : ""
                          } ${cellColor(v)}`}
                          style={{ opacity: cellOpacity(v), color: v >= 40 ? "#1A1F35" : v > 0 ? "var(--accent-teal)" : "var(--text-secondary)" }}
                          onMouseEnter={(e) =>
                            setHover({
                              x: e.clientX,
                              y: e.clientY,
                              row,
                              col,
                              v,
                              top: topClaimants?.[row] || "\u2014",
                              claims: getTopClaims(col),
                            })
                          }
                          onMouseMove={(e) =>
                            setHover((h) => (h ? { ...h, x: e.clientX, y: e.clientY } : null))
                          }
                          onMouseLeave={() => setHover(null)}
                        >
                          {v > 0 ? v : "\u2014"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hover && (
        <div
          className="fixed z-50 pointer-events-none bg-bg-surface border border-accent-amber rounded-md px-3 py-2 text-xs shadow-xl"
          style={{
            top: hover.y - 70,
            left: hover.x - 120,
            minWidth: 220,
          }}
        >
          <div className="font-semibold text-text-primary mb-0.5">
            {hover.row} <span className="text-text-secondary font-normal">&middot; {hover.col}</span>
          </div>
          <div className="text-text-secondary">
            Saturation score: <span className="font-semibold text-text-primary">{hover.v} / 100</span>
          </div>
          <div className="text-[10px] text-text-secondary/70 mt-0.5">
            Higher = more crowded in market
          </div>
          <div className="text-accent-amber mt-0.5">Top: {hover.top}</div>
          {hover.claims && (
            <div className="text-text-secondary mt-1 border-t border-border-color/50 pt-1">
              Claims: {hover.claims}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-danger" /> Saturated (75+)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-accent-amber" /> Competitive ({'40\u201374'})
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-accent-teal" /> Minimal ({'1\u201339'})
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-border-color" /> Whitespace (0)
        </div>
      </div>
    </div>
  );
}

const VELOCITY_CONFIG = {
  "rising-fast": { arrow: "\u2191", label: "Rising Fast", color: "text-accent-amber", tooltipBg: "bg-accent-amber/10 border-accent-amber/30" },
  "early-signal": { arrow: "\u2191", label: "Early Signal", color: "text-accent-teal", tooltipBg: "bg-accent-teal/10 border-accent-teal/30" },
  plateaued: { arrow: "\u2192", label: "Plateaued", color: "text-[#B0B8D1]", tooltipBg: "bg-[#B0B8D1]/10 border-[#B0B8D1]/30" },
  declining: { arrow: "\u2193", label: "Declining", color: "text-accent-teal", tooltipBg: "bg-accent-teal/10 border-accent-teal/30" },
};

const CLAIM_SCORE_MAP = {
  "Natural": { score: 91, status: "saturated", velocity: "declining", velocityDetail: "This claim dropped 23% in usage over the last 6 months across your category." },
  "High-protein": { score: 78, status: "saturated", velocity: "plateaued", velocityDetail: "This claim grew only 4% in usage over the last 6 months \u2014 market has stabilised." },
  "Plant-based": { score: 62, status: "competitive", velocity: "rising-fast", velocityDetail: "This claim grew 41% in usage over the last 6 months across your category." },
  "Gut health": { score: 48, status: "competitive", velocity: "plateaued", velocityDetail: "This claim grew only 6% in usage over the last 6 months \u2014 market has stabilised." },
  "Mood boosting": { score: 19, status: "available", velocity: "early-signal", velocityDetail: "This claim grew 28% in usage over the last 6 months \u2014 early but gaining." },
  "default": { score: 35, status: "available", velocity: "early-signal", velocityDetail: "Emerging claim with growing traction \u2014 low saturation makes this a differentiation opportunity." },
};

function ClaimFlagList({ keyClaims }) {
  const [tooltip, setTooltip] = useState(null);

  const claims = keyClaims?.length > 0
    ? keyClaims.map((claim) => {
        const mapped = CLAIM_SCORE_MAP[claim] || CLAIM_SCORE_MAP["default"];
        return { claim, ...mapped };
      })
    : CLAIM_SATURATION;

  return (
    <div className="space-y-3">
      {claims.map((c) => {
        const v = VELOCITY_CONFIG[c.velocity];
        return (
          <div key={c.claim} className="bg-bg-primary border border-border-color rounded-md p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-text-primary">{c.claim}</div>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                  c.status === "saturated"
                    ? "border-danger text-danger bg-danger/10"
                    : c.status === "competitive"
                    ? "border-accent-amber text-accent-amber bg-accent-amber/10"
                    : "border-accent-teal text-accent-teal bg-accent-teal/10"
                }`}
              >
                {c.status}
              </span>
            </div>
            <SaturationBar value={c.score} status={c.status} />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-text-secondary font-mono">{c.score} / 100</span>
              <span
                className={`relative flex items-center gap-1 text-xs font-semibold cursor-default ${v.color}`}
                onMouseEnter={(e) => setTooltip({ x: e.clientX, y: e.clientY, text: c.velocityDetail })}
                onMouseMove={(e) => setTooltip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : null))}
                onMouseLeave={() => setTooltip(null)}
              >
                {v.arrow} {v.label}
              </span>
            </div>
          </div>
        );
      })}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-bg-surface border border-border-color rounded-md px-3 py-2 text-xs shadow-xl"
          style={{ top: tooltip.y - 50, left: tooltip.x - 140, minWidth: 260 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

function TabBar({ personas, activeId, onSelect }) {
  if (personas.length <= 1) return null;
  return (
    <div className="flex items-center gap-1.5 mb-3" style={{ scrollbarWidth: "thin" }}>
      {personas.map((p) => {
        const name = p.persona_name || `Persona ${personas.indexOf(p) + 1}`;
        const isActive = p.id === activeId;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={`px-3 py-1 text-[11px] rounded-md font-medium transition-all ${
              isActive
                ? "bg-bg-primary text-text-primary border-b-2 border-accent-amber rounded-b-none"
                : "bg-[#252B47] text-text-secondary/60 hover:text-text-primary"
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}

function ResonanceList({ personas, activeResonanceId, onResonanceTab, computedResonance }) {
  const resonanceData = (computedResonance || RESONANCE_BY_PERSONA)[activeResonanceId]
    || (computedResonance || RESONANCE_BY_PERSONA)[Object.keys(computedResonance || RESONANCE_BY_PERSONA)[0]];
  const activePersona = personas.find((p) => p.id === activeResonanceId) || personas[0];
  const personaName = activePersona?.persona_name || `Persona ${personas.indexOf(activePersona) + 1}`;

  return (
    <div className="space-y-2.5">
      {personas.length > 1 && (
        <TabBar personas={personas} activeId={activeResonanceId} onSelect={onResonanceTab} />
      )}
      <div className="text-xs text-text-secondary mb-2">For <span className="text-text-primary font-semibold">{personaName}</span> {'\u2014'} Predicted Resonance</div>
      {resonanceData.map((r) => {
        const color =
          r.risk === "low" ? "var(--accent-teal)" : r.risk === "medium" ? "var(--accent-amber)" : "var(--danger)";
        return (
          <div
            key={r.positioning}
            className="bg-bg-primary border border-border-color rounded-md p-3"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="text-sm text-text-primary font-medium truncate">
                {r.positioning}
              </div>
              <div className="font-mono text-sm font-semibold flex-shrink-0" style={{ color }}>
                {r.score}%
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-border-color overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${r.score}%`,
                  background: color,
                  transition: "width 900ms ease-out",
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
              <span className="text-text-secondary">Resonance</span>
              <span className="font-semibold" style={{ color }}>
                {r.risk} risk
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CONFIDENCE_STYLES = {
  high: { border: "border-accent-teal", badge: "bg-accent-teal/10 text-accent-teal border-accent-teal/30", shadow: "shadow-[0_0_12px_-2px_rgba(16,185,129,0.15)]" },
  medium: { border: "border-accent-amber", badge: "bg-accent-amber/10 text-accent-amber border-accent-amber/30", shadow: "shadow-[0_0_12px_-2px_rgba(245,158,11,0.15)]" },
  speculative: { border: "border-[#252B47]", badge: "bg-[#252B47]/10 text-text-secondary border-[#252B47]/30", shadow: "" },
};

function WhitespaceCards({ personas, dynamicZones }) {
  const cards = dynamicZones || WHITESPACE_OPPORTUNITIES;
  const getPersonaName = (p, idx) => p.persona_name || `Persona ${idx + 1}`;

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-accent-teal" />
        <span className="text-xs uppercase tracking-widest text-accent-teal font-semibold">
          Whitespace Opportunities
        </span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
        {cards.map((w, i) => {
          const cs = CONFIDENCE_STYLES[w.confidence];
          const fits = w.fitByPersona || personas.map(() => w.fit);
          return (
            <div
              key={w.zone}
              className={`flex-shrink-0 w-[360px] bg-bg-surface border rounded-lg p-4 ${cs.border} ${cs.shadow}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                    w.type === "virgin"
                      ? "border-accent-teal text-accent-teal bg-accent-teal/10"
                      : "border-danger text-danger bg-danger/10"
                  }`}
                >
                  {w.type === "virgin" ? "VIRGIN WHITESPACE" : "ABANDONED WHITESPACE"}
                </span>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${cs.badge}`}>
                  {w.confidence === "high" ? "HIGH" : w.confidence === "medium" ? "MEDIUM" : "SPECULATIVE"}
                </span>
              </div>

              <h4 className="text-base font-bold text-text-primary mb-3">{w.zone}</h4>

              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1.5">Adjacent Saturated Claims</p>
                <div className="flex flex-wrap gap-1.5">
                  {w.adjacentClaims.map((ac) => (
                    <span key={ac.claim} className="text-[10px] font-mono bg-bg-primary border border-border-color rounded px-1.5 py-0.5 text-text-secondary">
                      {ac.claim} <span className="text-text-primary">{ac.score}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#B0B8D1] mb-2">Recommended Direction</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-accent-amber font-semibold">Ingredient</span>
                    <p className="text-xs text-text-primary mt-0.5 leading-relaxed">{w.ingredient}</p>
                  </div>
                  <div>
                    <span className="text-xs text-accent-amber font-semibold">Format</span>
                    <p className="text-xs text-text-primary mt-0.5 leading-relaxed">{w.format}</p>
                  </div>
                  <div>
                    <span className="text-xs text-accent-amber font-semibold">Claim Framings</span>
                    <ol className="space-y-0.5 mt-0.5">
                      {w.claimFramings.map((cf, j) => (
                        <li key={j} className="flex gap-2 text-xs text-text-primary">
                          <span className="text-accent-amber font-mono flex-shrink-0">{j + 1}.</span>
                          <span>{'\u201C'}{cf}{'\u201D'}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border-color space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-text-secondary">Persona-Claim Fit</span>
                {personas.map((p, idx) => {
                  const pName = getPersonaName(p, idx);
                  const fitVal = fits[idx] || w.fit;
                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="text-xs text-text-secondary w-24 truncate">{pName}</span>
                      <div className="flex-1 h-2 rounded-full bg-border-color overflow-hidden">
                        <div className="h-full rounded-full bg-accent-amber" style={{ width: `${fitVal}%` }} />
                      </div>
                      <span className="font-mono text-xs font-semibold text-accent-amber w-8 text-right">{fitVal}%</span>
                    </div>
                  );
                })}
              </div>

              {w.type === "abandoned" && w.warning && (
                <div className="mt-3 bg-danger/10 border border-danger/30 rounded-md p-2.5 flex items-start gap-2">
                  <span className="text-danger flex-shrink-0 text-sm">&#9888;&#65039;</span>
                  <p className="text-xs text-text-primary leading-relaxed">{w.warning}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Step3Whitespace({ onNext, keyClaims = [], competitors = [], personas = [] }) {
  const [activeResonanceId, setActiveResonanceId] = useState(
    personas.length > 0 ? personas[0].id : "persona_1"
  );

  const useFallback = keyClaims.length === 0 || competitors.length === 0;

  const heatmapCols = useFallback
    ? HEATMAP_DATA.cols
    : [...competitors.map((c) => c.name), "Your Product"];

  // Derive consumer needs from all personas
  const derivedNeeds = deriveConsumerNeeds(personas);

  // ── Build dynamic rows from user's claims + persona-derived needs ──────────
  const dynamicRows = useMemo(() => {
    if (useFallback) return HEATMAP_DATA.rows;
    const seen = new Set();
    const rows = [];
    const add = (row) => { if (row && !seen.has(row)) { seen.add(row); rows.push(row); } };

    // 1. Key claims — map each to benefit rows via claimToBenefitsMap
    // Use ONLY lc.includes(key) — no key.includes(lc) to prevent over-matching
    // If a claim has no mapping, SKIP IT (do not add as a raw row)
    keyClaims.forEach((claim) => {
      const lc = claim.toLowerCase().trim();
      Object.entries(claimToBenefitsMap).forEach(([key, benefits]) => {
        if (lc.includes(key)) {
          benefits.forEach(add);
        }
      });
    });

    // 2. Persona-derived needs — cap at 5 to prevent flooding
    derivedNeeds.slice(0, 5).forEach((need) => {
      (NEED_TO_BENEFIT[need] || []).forEach(add);
    });

    return rows;
  }, [useFallback, keyClaims, derivedNeeds]);

  const heatmapRows = dynamicRows;

  const heatmapValues = useFallback
    ? HEATMAP_DATA.values
    : (() => {
        const vals = {};
        dynamicRows.forEach((benefit) => {
          vals[benefit] = {};
          competitors.forEach((comp) => {
            const scores = getCompScores(comp, dynamicRows);
            vals[benefit][comp.name] = scores[benefit] ?? 20;
          });
          // Score Your Product using the same scoredValue() as competitors
          // Build claimedBenefits from the user's key claims
          const yourClaimedBenefits = [];
          keyClaims.forEach((kc) => {
            const lc = kc.toLowerCase().trim();
            Object.entries(claimToBenefitsMap).forEach(([key, b]) => {
              if (lc.includes(key)) yourClaimedBenefits.push(...b);
            });
          });
          // Deduplicate
          const yourUniqueBenefits = [...new Set(yourClaimedBenefits)];

          // Find the matching claim key for this benefit (if any)
          let yourClaimKey = null;
          for (const kc of keyClaims) {
            const lc = kc.toLowerCase().trim();
            for (const [key, mappedBenefits] of Object.entries(claimToBenefitsMap)) {
              if (lc.includes(key) && mappedBenefits.includes(benefit)) {
                yourClaimKey = key;
                break;
              }
            }
            if (yourClaimKey) break;
          }

          const hasYourClaim = yourClaimKey !== null;
          const yourProductNeeds = derivedNeeds.flatMap((n) => NEED_TO_BENEFIT[n] || []);
          let yourScore;

          if (hasYourClaim) {
            // Active claim → use scoredValue with the matched claim key
            yourScore = scoredValue(
              "Your Product", benefit, true, yourClaimKey,
              "Challenger", yourUniqueBenefits
            );
          } else if (yourProductNeeds.includes(benefit)) {
            // No direct claim, but persona needs it → moderate signal
            // Check if any claimed benefit is adjacent
            const isAdjacent = yourUniqueBenefits.some(
              (cb) => (SCORING_ADJACENCY[cb] || []).includes(benefit)
            );
            if (isAdjacent) {
              yourScore = scoredValue(
                "Your Product", benefit, false, null,
                "Challenger", yourUniqueBenefits
              );
            } else {
              // Persona wants it but no adjacency → lower capped signal
              const needIdx = derivedNeeds.indexOf(
                derivedNeeds.find((n) => (NEED_TO_BENEFIT[n] || []).includes(benefit))
              );
              const needStrength = needIdx === -1 ? 25
                : needIdx === 0 ? 55
                : needIdx === 1 ? 45
                : needIdx === 2 ? 38
                : 30;
              yourScore = needStrength;
            }
          } else {
            yourScore = 0;
          }

          vals[benefit]["Your Product"] = yourScore;
        });
        return vals;
      })();

  const userBenefits = new Set();
  keyClaims.forEach((c) => {
    const lc = c.toLowerCase().trim();
    Object.entries(claimToBenefitsMap).forEach(([key, benefits]) => {
      if (lc.includes(key)) benefits.forEach(b => userBenefits.add(b));
    });
  });

  const rowStyles = {};
  if (!useFallback) {
    heatmapRows.forEach((row) => {
      const allCompScores = competitors
        .map((c) => heatmapValues[row]?.[c.name] ?? 0)
        .filter((v) => v > 0);
      const isWhitespace = allCompScores.length === 0 || allCompScores.every((v) => v < 40);
      const isUser = userBenefits.has(row);
      if (isWhitespace) {
        rowStyles[row] = { leftBorder: "border-accent-teal", bg: "text-text-primary" };
      } else if (isUser) {
        rowStyles[row] = { leftBorder: "border-accent-amber", bgColor: "#1E2440", bg: "text-text-primary" };
      }
    });
  }

  const dynamicZones = useMemo(() => {
    if (useFallback) return null;
    return computeWhitespaceOpportunities(
      heatmapValues, dynamicRows, competitors, keyClaims, personas, derivedNeeds
    );
  }, [useFallback, heatmapValues, dynamicRows, competitors, keyClaims, personas, derivedNeeds]);

  const computedResonance = useMemo(() => {
    if (useFallback) return RESONANCE_BY_PERSONA;
    const result = {};
    personas.forEach((persona) => {
      result[persona.id] = computeResonance(keyClaims, competitors, heatmapValues, dynamicRows, persona);
    });
    return result;
  }, [useFallback, keyClaims, competitors, heatmapValues, dynamicRows, personas]);

  const topClaimants = useFallback
    ? HEATMAP_DATA.topClaimants
    : (() => {
        const map = {};
        dynamicRows.forEach((row) => {
          let top = null;
          let topScore = -1;
          competitors.forEach((c) => {
            const s = heatmapValues[row]?.[c.name] ?? 0;
            if (s > topScore) { topScore = s; top = c.name; }
          });
          map[row] = top ? `${top} (${topScore})` : "\u2014";
        });
        return map;
      })();

  const compClaimsMap = useFallback ? null : Object.fromEntries(
    competitors.map((c) => [c.name, Array.isArray(c.claims) ? c.claims : typeof c.claims === "string" ? c.claims.split(/[,;]\s*/) : []])
  );

  return (
    <div className="animate-slide-right">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Competitive Whitespace Map</h2>
        <p className="text-text-secondary mt-1 text-sm">
          Where competitors are crowded, where you can stand out, where this persona will listen.
        </p>
      </div>

      <div className="bg-bg-surface border border-border-color rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm uppercase tracking-widest text-text-secondary">
              Panel A
            </div>
            <h3 className="text-lg font-semibold text-text-primary">Claim Saturation Heatmap</h3>
          </div>
          <div className="text-xs text-text-secondary">
            Hover any cell for details
          </div>
        </div>
        {!useFallback && derivedNeeds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-lg bg-bg-primary border border-border-color">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary font-mono whitespace-nowrap">
              🧠 Needs inferred from persona
            </span>
            {derivedNeeds.slice(0, 6).map((need) => (
              <span
                key={need}
                className="text-[10px] px-2 py-0.5 rounded-full border border-accent-teal/40 text-accent-teal bg-accent-teal/10"
              >
                {need}
              </span>
            ))}
            <span className="text-[10px] text-text-secondary/60 ml-1">
              · Amber cells = claimed · Teal cells = persona signal only
            </span>
          </div>
        )}
        <Heatmap
          cols={heatmapCols}
          rows={heatmapRows}
          values={heatmapValues}
          topClaimants={topClaimants}
          rowStyles={rowStyles}
          compClaimsMap={compClaimsMap}
        />
        <WhitespaceCards personas={personas} dynamicZones={dynamicZones} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr_35%] gap-5 mb-5">
        <div className="bg-bg-surface border border-border-color rounded-xl p-5">
          <div className="text-sm uppercase tracking-widest text-text-secondary mb-1">
            Panel B
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Claim Overuse Flags</h3>
          <ClaimFlagList keyClaims={keyClaims} />
        </div>

        <div className="bg-bg-surface border border-border-color rounded-xl p-5 lg:col-span-2">
          <div className="text-sm uppercase tracking-widest text-text-secondary mb-1">
            Panel C
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Consumer Resonance Predictor
          </h3>
          <ResonanceList
            personas={personas}
            activeResonanceId={activeResonanceId}
            onResonanceTab={setActiveResonanceId}
            computedResonance={computedResonance}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-accent-amber text-bg-primary font-semibold py-3 rounded-md flex items-center justify-center gap-2 hover:opacity-90"
      >
        Generate Value Propositions
        <ArrowRight size={18} />
      </button>
    </div>
  );
}