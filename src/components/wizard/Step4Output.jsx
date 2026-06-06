import { useState, useEffect } from "react";
import {
  Download,
  Copy,
  Share2,
  Star,
  AlertTriangle,
  Target,
  Users,
  Radar,
  Megaphone,
  Share,
  Check,
  Bookmark,
  Plus,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import ScoreGauge from "../shared/ScoreGauge";
import { STEP4_OUTPUT } from "../../data/demoData";

const ICON_MAP = {
  target: Target,
  users: Users,
  radar: Radar,
  megaphone: Megaphone,
  share: Share,
};

function SubScoreBar({ label, value, delay = 0 }) {
  const color =
    value < 40 ? "var(--danger)" : value < 70 ? "var(--accent-amber)" : "var(--accent-teal)";
  const [animWidth, setAnimWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="font-mono font-semibold" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-border-color overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${animWidth}%`, background: color, transition: "width 800ms ease-out" }}
        />
      </div>
    </div>
  );
}

function PersonaFitBars({ personas, personaClaimFit }) {
  const perPersona = personas.map((p, i) => ({
    name: p.persona_name || `Persona ${i + 1}`,
    value: Array.isArray(personaClaimFit) ? (personaClaimFit[i] ?? 65) : personaClaimFit,
  }));

  return (
    <div className="space-y-2.5">
      <div className="text-xs text-text-secondary">Persona-Claim Fit</div>
      {perPersona.map((pp, idx) => {
        const color = pp.value < 40 ? "var(--danger)" : pp.value < 70 ? "var(--accent-amber)" : "var(--accent-teal)";
        const delay = idx * 150;
        return <PersonaFitRow key={personas[idx].id} name={pp.name} value={pp.value} delay={delay} color={color} />;
      })}
    </div>
  );
}

function PersonaFitRow({ name, value, delay, color }) {
  const [animWidth, setAnimWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-secondary w-20 truncate">{name}</span>
      <div className="flex-1 h-2 rounded-full bg-border-color overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${animWidth}%`, background: color, transition: "width 800ms ease-out" }} />
      </div>
      <span className="font-mono text-xs font-semibold w-8 text-right" style={{ color }}>{value}%</span>
    </div>
  );
}

const OWNERSHIP_CONFIG = {
  fragmented: { badge: "bg-accent-teal/10 text-accent-teal border-accent-teal/30", label: "Fragmented", symbol: "\u2713" },
  contested: { badge: "bg-accent-amber/10 text-accent-amber border-accent-amber/30", label: "Contested", symbol: "!" },
  dominated: { badge: "bg-danger/10 text-danger border-danger/30", label: "Dominated", symbol: "\u2717" },
};

function VPCard({ vp, expanded, onToggle, onSelect, isSelected }) {
  const [ownershipTooltip, setOwnershipTooltip] = useState(false);
  const oc = OWNERSHIP_CONFIG[vp.ownership?.state] || null;

  return (
    <div
      onClick={() => onSelect?.()}
      className={`bg-bg-primary border rounded-lg p-4 transition-all cursor-pointer ${
        isSelected ? "border-accent-amber amber-glow" : "border-border-color opacity-70 hover:opacity-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-sm flex-shrink-0 ${
            vp.rank === 1
              ? "bg-accent-amber text-bg-primary"
              : "bg-bg-surface text-text-secondary"
          }`}
        >
          {vp.rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="text-base font-bold text-text-primary">
              {vp.headline}
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  className={i <= vp.stars ? "text-accent-amber fill-accent-amber" : "text-border-color"}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                vp.risk === "low"
                  ? "border-accent-teal text-accent-teal bg-accent-teal/10"
                  : vp.risk === "medium"
                  ? "border-accent-amber text-accent-amber bg-accent-amber/10"
                  : "border-danger text-danger bg-danger/10"
              }`}
            >
              {vp.risk} risk
            </span>
            <span className="text-xs text-text-secondary">
              Resonance match
            </span>
          </div>

          {oc && (
            <div className="flex flex-wrap items-center gap-2 mb-2 relative">
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 cursor-default ${oc.badge}`}
                onMouseEnter={() => setOwnershipTooltip(true)}
                onMouseLeave={() => setOwnershipTooltip(false)}
              >
                {oc.symbol} {oc.label}
              </span>
              <span className="text-xs text-text-secondary">
                {vp.ownership.state === "fragmented"
                  ? `Spread across ${vp.ownership.share} brands \u2014 no dominant player`
                  : vp.ownership.state === "contested"
                  ? `${vp.ownership.player} holds ~${vp.ownership.share}% share of voice`
                  : `${vp.ownership.player} owns this claim psychologically \u2014 very hard to displace`}
              </span>
              {ownershipTooltip && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-bg-surface border border-accent-amber/30 rounded-md px-3 py-2 text-xs shadow-xl pointer-events-none" style={{ minWidth: 280 }}>
                  Dominant Ownership Index measures whether a claim is statistically frequent or psychologically owned by one brand. These are not the same thing.
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-bg-surface border-l border-t border-accent-amber/30 rotate-45" />
                </div>
              )}
            </div>
          )}

          <button
            onClick={onToggle}
            className="text-xs text-accent-amber flex items-center gap-1 hover:underline"
          >
            {expanded ? "Hide rationale" : "Show rationale"}
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {expanded && (
            <p className="text-sm text-text-secondary mt-2 leading-relaxed animate-fade-in">
              {vp.rationale}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const personaClaimFitLookup = {
  VP1: { persona_1: 81, persona_2: 58, persona_3: 74, persona_4: 79 },
  VP2: { persona_1: 67, persona_2: 86, persona_3: 49, persona_4: 61 },
  VP3: { persona_1: 55, persona_2: 61, persona_3: 71, persona_4: 52 },
};

const whitespaceScoreLookup = { VP1: 70, VP2: 58, VP3: 41 };

const differentiationScore = (cui, pcf, ws) =>
  Math.round((cui * 0.35) + (pcf * 0.40) + (ws * 0.25));

const interpretation = {
  high: { text: "Your concept is strongly differentiated \u2014 clear whitespace owned.", band: "high" },
  mid: { text: "Your concept lands in the upper-mid band \u2014 meaningful differentiation, with a clear path to climb.", band: "upper-mid" },
  low: { text: "Your concept needs stronger differentiation \u2014 consider whitespace cards 1 or 2.", band: "low" },
};

const claimScoreMap = {
  Natural: 91, "High-protein": 78, "Plant-based": 62,
  "Gut health": 48, "Mood boosting": 19, default: 35,
};

const proofPointMap = {
  "Fitness Conscious": "18g oat protein, ready in 30 seconds",
  "Time-Starved": "One sachet. No blender. No prep.",
  "Wellness-Driven": "Fermented oat base \u2014 gut-active, clinically validated",
  "Eco-Aware": "Upcycled grain base, compostable packaging",
  "Budget-Minded": "Complete protein under \u20B960 per serve",
  "Premium Seeker": "Lactobacillus rhamnosus GG at 10 billion CFU",
};

const proofPriority = ["Wellness-Driven", "Fitness Conscious", "Eco-Aware", "Premium Seeker", "Budget-Minded", "Time-Starved"];

const emotionalHookMap = {
  "Fitness Conscious + Time-Starved": "You're doing everything right. This makes it easier.",
  "Wellness-Driven + Eco-Aware": "Good for you. Good for what comes after you.",
  "Budget-Minded + Family-Oriented": "The best choice shouldn't cost the most.",
  "Premium Seeker + Trend-Forward": "You knew about fermented before it was everywhere.",
};

const toneMap = {
  "Research-heavy online buyer": "Precise, evidence-backed, no fluff",
  "Impulse buyer": "Bold, punchy, immediate",
  "Brand loyal": "Warm, familiar, trustworthy",
  "Price-sensitive switcher": "Direct, value-forward, no-nonsense",
  "Occasion-driven buyer": "Contextual, moment-driven, aspirational",
  default: "Practical, warm, no-nonsense",
};

export default function Step4Output({ productName, category, personas = [], keyClaims = [], onSave, onNew, onBackToDashboard }) {
  const [expanded, setExpanded] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedVP, setSelectedVP] = useState("VP1");
  const [activeMsgPersonaId, setActiveMsgPersonaId] = useState(
    personas.length > 0 ? personas[0].id : null
  );

  const o = STEP4_OUTPUT;
  const hasHighRisk = o.value_propositions.some((v) => v.risk === "high");

  const personaNames = personas.map((p, i) => p.persona_name || `Persona ${i + 1}`);
  const namesStr = personaNames.join(", ");

  const pcfLookup = personaClaimFitLookup[selectedVP];
  const perPersonaPcf = personas.map((p) => pcfLookup?.[p.id] ?? 65);
  const avgPcf = Math.round(perPersonaPcf.reduce((a, b) => a + b, 0) / perPersonaPcf.length);
  const wsScore = whitespaceScoreLookup[selectedVP];
  const diffScore = differentiationScore(o.claim_uniqueness_index, avgPcf, wsScore);
  const interpKey = diffScore > 70 ? "high" : diffScore >= 50 ? "mid" : "low";
  const interp = interpretation[interpKey];

  const computeMessaging = (persona) => {
    const tags = persona.lifestyle_tags || [];
    const tagsLower = tags.map((t) => t.toLowerCase());

    const leadClaim = o.value_propositions.find((vp) => `VP${vp.rank}` === selectedVP)?.headline || o.messaging.lead_claim;

    const proofTag = proofPriority.find((p) => tagsLower.includes(p.toLowerCase()));
    const proofPoint = proofTag ? proofPointMap[proofTag] : proofPointMap["Fitness Conscious"];

    const topTwo = tags.slice(0, 2).sort().join(" + ");
    const hookKey = Object.keys(emotionalHookMap).find((k) => {
      const parts = k.split(" + ").map((p) => p.trim().toLowerCase());
      return parts.every((p) => tagsLower.includes(p));
    });
    const emotionalHook = hookKey ? emotionalHookMap[hookKey] : "You're doing everything right. This makes it easier.";

    const userClaims = keyClaims.filter((c) => claimScoreMap[c] > 75);
    const claimsToAvoid = userClaims.length > 0 ? userClaims : ["Natural", "100% Pure", "High-Protein"];

    const baseTone = toneMap[persona.purchase_behavior] || toneMap["default"] || "Practical, warm, no-nonsense";
    let tone = baseTone;
    const eco = tagsLower.includes("eco-aware");
    const premium = tagsLower.includes("premium seeker");
    if (premium) tone += " \u2014 refined, understated";
    else if (eco) tone += " \u2014 sustainability-conscious undertone";

    const channels = persona.media_channels && persona.media_channels.length > 0
      ? persona.media_channels
      : ["Instagram Reels", "YouTube Shorts", "Podcasts"];

    return { leadClaim, proofPoint, emotionalHook, claimsToAvoid, tone, channels };
  };

  const msgPersona = personas.find((p) => p.id === activeMsgPersonaId) || personas[0];
  const msg = msgPersona ? computeMessaging(msgPersona) : null;

  const handleCopy = () => {
    const text = `${o.value_propositions[0].headline}\n\n${o.messaging.lead_claim}\nProof: ${o.messaging.proof_point}\nHook: ${o.messaging.emotional_hook}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="animate-slide-right">
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-accent-amber mb-1">
            {'Step 4 \u2014 Strategy Output'}
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{'Your ValueForge Report \u2014'} {productName || "Untitled Concept"}</h2>
          <p className="text-text-secondary mt-1 text-sm">
            Generated for {namesStr} | {category || "\u2014"} | {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-sm border border-border-color text-text-secondary hover:text-text-primary px-3 py-2 rounded-md flex items-center gap-1.5"
          >
            {copied ? <Check size={14} className="text-accent-teal" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button className="text-sm border border-border-color text-text-secondary hover:text-text-primary px-3 py-2 rounded-md flex items-center gap-1.5">
            <Share2 size={14} /> Share Link
          </button>
          <button className="text-sm bg-bg-surface text-text-primary border border-border-color hover:border-accent-amber px-3 py-2 rounded-md flex items-center gap-1.5">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-bg-surface border border-border-color rounded-xl p-6 flex flex-col">
          <div className="text-xs uppercase tracking-widest text-text-secondary mb-1">
            Quadrant A
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Differentiation Score</h3>
          <div className="flex flex-col items-center">
            <ScoreGauge value={diffScore} size={240} label="out of 100" />
            <div className="text-sm text-text-secondary text-center max-w-xs mt-3">
              {interp.text.split(interp.band).length > 1 ? (
                <>
                  {interp.text.split(interp.band)[0]}
                  <span className="text-accent-amber font-semibold">{interp.band}</span>
                  {interp.text.split(interp.band)[1]}
                </>
              ) : (
                interp.text
              )}
            </div>
          </div>
          <div className="mt-6 space-y-3" key={selectedVP}>
            <SubScoreBar label="Claim Uniqueness Index" value={o.claim_uniqueness_index} delay={0} />
            <PersonaFitBars personas={personas} personaClaimFit={perPersonaPcf} />
            <SubScoreBar label="Whitespace Score" value={wsScore} delay={300} />
          </div>
        </div>

        <div className="bg-bg-surface border border-border-color rounded-xl p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="text-xs uppercase tracking-widest text-text-secondary">
                Quadrant B
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Value Propositions</h3>
            </div>
            <span className="text-xs text-text-secondary">{'Ranked by fit \u00d7 whitespace'}</span>
          </div>
          <div className="space-y-3 mt-4">
            {o.value_propositions.map((vp, i) => {
            const vpId = `VP${vp.rank}`;
            return (
              <VPCard
                key={vp.rank}
                vp={vp}
                isSelected={selectedVP === vpId}
                onSelect={() => setSelectedVP(vpId)}
                expanded={expanded === i}
                onToggle={() => setExpanded(expanded === i ? -1 : i)}
              />
            );
          })}
          </div>
          {hasHighRisk && (
            <div className="mt-4 border border-danger/50 bg-danger/10 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle size={16} className="text-danger flex-shrink-0 mt-0.5" />
              <div className="text-sm text-text-primary">
                <span className="font-semibold text-danger">Misalignment risk:</span> one or more VPs
                drift from the persona's core need. Consider deprioritising.
              </div>
            </div>
          )}
        </div>

        <div className="bg-bg-surface border border-border-color rounded-xl p-6">
          <div className="text-xs uppercase tracking-widest text-text-secondary mb-1">
            Quadrant C
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Messaging Direction</h3>
          {personas.length > 1 && (
            <div className="flex items-center gap-1.5 mb-3" style={{ scrollbarWidth: "thin" }}>
              {personas.map((p) => {
                const name = p.persona_name || `Persona ${personas.indexOf(p) + 1}`;
                const isActive = activeMsgPersonaId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActiveMsgPersonaId(p.id)}
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
          )}
          {msg && (
            <table className="w-full text-sm" key={`${activeMsgPersonaId}-${selectedVP}`}>
              <tbody>
                {[
                  { k: "Lead Claim", v: msg.leadClaim },
                  { k: "Proof Point", v: msg.proofPoint },
                  { k: "Emotional Hook", v: msg.emotionalHook, italic: true },
                  {
                    k: "Claims to Avoid",
                    v: (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.claimsToAvoid.map((a) => (
                          <span
                            key={a}
                            className="text-xs px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/40"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    ),
                  },
                  { k: "Tone", v: msg.tone },
                  {
                    k: "Channel Priority",
                    v: (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.channels.map((ch) => (
                          <span
                            key={ch}
                            className="text-xs px-2 py-0.5 rounded bg-accent-amber/10 text-accent-amber border border-accent-amber/30"
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    ),
                  },
                ].map((row) => (
                  <tr key={row.k} className="border-b border-border-color/50 last:border-0">
                    <td className="py-2.5 pr-4 text-text-secondary w-32 align-top">{row.k}</td>
                    <td className={`py-2.5 text-text-primary ${row.italic ? "italic" : ""}`}>
                      {row.v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-bg-surface border border-border-color rounded-xl p-6 flex flex-col">
          <div className="text-xs uppercase tracking-widest text-text-secondary mb-1">
            Quadrant D
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Next Steps</h3>
          <ol className="space-y-3 flex-1">
            {o.next_steps.map((step, i) => {
              const Icon = ICON_MAP[step.icon] || Target;
              return (
                <li
                  key={step.title}
                  className="flex items-start gap-3 bg-bg-primary border border-border-color rounded-md p-3"
                >
                  <span className="font-mono text-xs text-accent-amber mt-0.5 w-5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-text-primary">{step.title}</span>
                </li>
              );
            })}
          </ol>
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={onSave}
              className="flex-1 bg-accent-amber text-bg-primary text-sm font-semibold py-2.5 rounded-md flex items-center justify-center gap-1.5 hover:opacity-90"
            >
              <Bookmark size={14} /> Save to My Projects
            </button>
            <button
              onClick={onNew}
              className="flex-1 border border-accent-amber text-accent-amber text-sm font-semibold py-2.5 rounded-md flex items-center justify-center gap-1.5 hover:bg-accent-amber/5"
            >
              <Plus size={14} /> Start New Analysis
            </button>
          </div>
          <button
            onClick={onBackToDashboard}
            className="mt-3 text-xs text-text-secondary hover:text-text-primary text-center"
          >
            {'\u2190 Back to Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}