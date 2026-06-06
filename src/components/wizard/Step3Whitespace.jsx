import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { HEATMAP_DATA, CLAIM_SATURATION, WHITESPACE_OPPORTUNITIES, RESONANCE_BY_PERSONA } from "../../data/demoData";
import SaturationBar from "../shared/SaturationBar";

function cellColor(v) {
  if (v >= 75) return "bg-danger";
  if (v >= 40) return "bg-accent-amber";
  if (v > 0) return "border-2 border-accent-teal text-accent-teal";
  return "bg-border-color";
}

function cellOpacity(v) {
  return Math.max(0.35, Math.min(1, v / 100));
}

function Heatmap() {
  const [hover, setHover] = useState(null);

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left text-text-secondary font-medium pl-2 pb-2">Benefit</th>
              {HEATMAP_DATA.cols.map((c) => (
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
            {HEATMAP_DATA.rows.map((row) => (
              <tr key={row}>
                <td className="text-text-primary text-left pl-2 pr-3 py-1 font-medium">{row}</td>
                {HEATMAP_DATA.cols.map((col) => {
                  const v = HEATMAP_DATA.values[row]?.[col] ?? 0;
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
                            top: HEATMAP_DATA.topClaimants[row],
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
            ))}
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
            {hover.v} brands claim this
          </div>
          <div className="text-accent-amber mt-0.5">Top: {hover.top}</div>
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

function ResonanceList({ personas, activeResonanceId, onResonanceTab }) {
  const resonanceData = RESONANCE_BY_PERSONA[activeResonanceId] || RESONANCE_BY_PERSONA["persona_1"];
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

function WhitespaceCards({ personas }) {
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
        {WHITESPACE_OPPORTUNITIES.map((w, i) => {
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

export default function Step3Whitespace({ onNext, keyClaims = [], personas = [] }) {
  const [activeResonanceId, setActiveResonanceId] = useState(
    personas.length > 0 ? personas[0].id : "persona_1"
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
        <div className="flex items-center justify-between mb-4">
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
        <Heatmap />
        <WhitespaceCards personas={personas} />
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