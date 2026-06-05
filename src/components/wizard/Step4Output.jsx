import { useState } from "react";
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

function SubScoreBar({ label, value }) {
  const color =
    value < 40 ? "var(--danger)" : value < 70 ? "var(--accent-amber)" : "var(--accent-teal)";
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
          style={{ width: `${value}%`, background: color, transition: "width 800ms ease-out" }}
        />
      </div>
    </div>
  );
}

const OWNERSHIP_CONFIG = {
  fragmented: { badge: "bg-accent-teal/10 text-accent-teal border-accent-teal/30", label: "Fragmented", symbol: "✓" },
  contested: { badge: "bg-accent-amber/10 text-accent-amber border-accent-amber/30", label: "Contested", symbol: "!" },
  dominated: { badge: "bg-danger/10 text-danger border-danger/30", label: "Dominated", symbol: "✗" },
};

function VPCard({ vp, expanded, onToggle }) {
  const [ownershipTooltip, setOwnershipTooltip] = useState(false);
  const oc = OWNERSHIP_CONFIG[vp.ownership?.state] || null;

  return (
    <div
      className={`bg-bg-primary border rounded-lg p-4 transition-all ${
        vp.rank === 1 ? "border-accent-amber amber-glow" : "border-border-color"
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
                  ? `Spread across ${vp.ownership.share} brands — no dominant player`
                  : vp.ownership.state === "contested"
                  ? `${vp.ownership.player} holds ~${vp.ownership.share}% share of voice`
                  : `${vp.ownership.player} owns this claim psychologically — very hard to displace`}
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

export default function Step4Output({ onSave, onNew, onBackToDashboard }) {
  const [expanded, setExpanded] = useState(0);
  const [copied, setCopied] = useState(false);

  const o = STEP4_OUTPUT;
  const hasHighRisk = o.value_propositions.some((v) => v.risk === "high");

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
            Step 4 — Strategy Output
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Your Value Proposition Strategy</h2>
          <p className="text-text-secondary mt-1 text-sm">
            Differentiated, persona-aligned, and ready to brief.
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
            <ScoreGauge value={o.differentiation_score} size={240} label="out of 100" />
            <div className="text-sm text-text-secondary text-center max-w-xs mt-3">
              Your concept lands in the <span className="text-accent-amber font-semibold">upper-mid</span> band —
              meaningfully differentiated, with a clear path to climb.
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <SubScoreBar label="Claim Uniqueness Index" value={o.claim_uniqueness_index} />
            <SubScoreBar label="Persona–Claim Fit" value={o.persona_claim_fit} />
            <SubScoreBar label="Whitespace Score" value={o.whitespace_score} />
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
            <span className="text-xs text-text-secondary">Ranked by fit × whitespace</span>
          </div>
          <div className="space-y-3 mt-4">
            {o.value_propositions.map((vp, i) => (
              <VPCard
                key={vp.rank}
                vp={vp}
                expanded={expanded === i}
                onToggle={() => setExpanded(expanded === i ? -1 : i)}
              />
            ))}
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
          <h3 className="text-lg font-semibold text-text-primary mb-4">Messaging Direction</h3>
          <table className="w-full text-sm">
            <tbody>
              {[
                { k: "Lead Claim", v: o.messaging.lead_claim },
                { k: "Proof Point", v: o.messaging.proof_point },
                { k: "Emotional Hook", v: o.messaging.emotional_hook, italic: true },
                {
                  k: "Claims to Avoid",
                  v: (
                    <div className="flex flex-wrap gap-1.5">
                      {o.messaging.avoid.map((a) => (
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
                { k: "Tone", v: o.messaging.tone },
                {
                  k: "Channel Priority",
                  v: (
                    <div className="text-xs font-mono text-text-primary">
                      {o.messaging.channels.join("  >  ")}
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
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
