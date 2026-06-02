import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { HEATMAP_DATA, CLAIM_SATURATION, WHITESPACE_OPPORTUNITIES, RESONANCE_PREDICTIONS } from "../../data/demoData";
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
                        {v > 0 ? v : "—"}
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
            {hover.row} <span className="text-text-secondary font-normal">· {hover.col}</span>
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
          <span className="w-3 h-3 rounded bg-accent-amber" /> Competitive (40–74)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-accent-teal" /> Minimal (1–39)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-border-color" /> Whitespace (0)
        </div>
      </div>
    </div>
  );
}

function ClaimFlagList() {
  return (
    <div className="space-y-3">
      {CLAIM_SATURATION.map((c) => (
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
          <div className="text-xs text-text-secondary mt-1 font-mono">{c.score} / 100</div>
        </div>
      ))}
    </div>
  );
}

function ResonanceList() {
  return (
    <div className="space-y-2.5">
      {RESONANCE_PREDICTIONS.map((r) => {
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

function WhitespaceCallout() {
  return (
    <div className="mt-5 border border-accent-teal/40 bg-accent-teal/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-accent-teal" />
        <span className="text-xs uppercase tracking-widest text-accent-teal font-semibold">
          Top 3 Whitespace Opportunities
        </span>
      </div>
      <ol className="space-y-2.5">
        {WHITESPACE_OPPORTUNITIES.map((w, i) => (
          <li key={w.pairing} className="flex gap-3">
            <span className="font-mono text-accent-teal font-semibold">{i + 1}.</span>
            <div>
              <div className="text-sm text-text-primary font-medium">{w.pairing}</div>
              <div className="text-xs text-text-secondary mt-0.5">{w.description}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Step3Whitespace({ onNext }) {
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
        <WhitespaceCallout />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr_35%] gap-5 mb-5">
        <div className="bg-bg-surface border border-border-color rounded-xl p-5">
          <div className="text-sm uppercase tracking-widest text-text-secondary mb-1">
            Panel B
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Claim Overuse Flags</h3>
          <ClaimFlagList />
        </div>

        <div className="bg-bg-surface border border-border-color rounded-xl p-5 lg:col-span-2">
          <div className="text-sm uppercase tracking-widest text-text-secondary mb-1">
            Panel C
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Consumer Resonance Predictor
          </h3>
          <ResonanceList />
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
