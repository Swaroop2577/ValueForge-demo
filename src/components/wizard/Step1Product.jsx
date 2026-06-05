import { useState } from "react";
import { ArrowRight, Loader2, Plus, X, Pencil } from "lucide-react";
import Chip from "../shared/Chip";
import { CATEGORIES, MARKETS, CONSUMER_NEEDS } from "../../data/demoData";

const DEMO_COMPETITORS = [
  { name: "Slurrp Farm", category: "Functional Beverages", claims: ["Natural", "No added sugar", "Kid-friendly"], marketPosition: "Niche Player" },
  { name: "Yoga Bar", category: "Functional Beverages / Snacks", claims: ["High-protein", "Clean ingredients", "Plant-based"], marketPosition: "Challenger" },
  { name: "Ensure (Abbott)", category: "Functional Nutrition Drinks", claims: ["Complete nutrition", "Clinically proven", "High-protein"], marketPosition: "Category Leader" },
];

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {hint && <span className="text-xs text-text-secondary">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-bg-primary border border-border-color rounded-md px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent-amber transition-colors";

function CompetitorCard({ comp, editable, onUpdate }) {
  const [localName, setLocalName] = useState(comp.name);
  const [localClaims, setLocalClaims] = useState(comp.claims.join(", "));

  if (editable) {
    return (
      <div className="bg-bg-surface border border-border rounded-lg p-3 flex flex-col gap-2">
        <input
          className="w-full bg-bg-primary border border-border rounded px-2 py-1.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent-amber transition-colors"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          placeholder="Brand name"
        />
        <input
          className="w-full bg-bg-primary border border-border rounded px-2 py-1.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent-amber transition-colors"
          value={localClaims}
          onChange={(e) => setLocalClaims(e.target.value)}
          placeholder="Claims (comma-separated)"
        />
        <select
          className="w-full bg-bg-primary border border-border rounded px-2 py-1.5 text-sm text-text-primary focus:border-accent-amber transition-colors"
          value={comp.marketPosition}
          onChange={(e) => onUpdate({ ...comp, marketPosition: e.target.value })}
        >
          <option value="Category Leader" className="bg-bg-primary">Category Leader</option>
          <option value="Challenger" className="bg-bg-primary">Challenger</option>
          <option value="Niche Player" className="bg-bg-primary">Niche Player</option>
        </select>
        <button
          type="button"
          onClick={() => onUpdate({ name: localName, category: comp.category, claims: localClaims.split(",").map((c) => c.trim()).filter(Boolean), marketPosition: comp.marketPosition })}
          className="text-xs text-accent-amber hover:underline self-end"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border rounded-lg p-3">
      <div className="text-sm font-semibold text-text-primary mb-0.5">{comp.name}</div>
      <div className="text-[10px] font-mono text-text-secondary mb-2">{comp.category}</div>
      <div className="mb-2">
        <div className="text-[10px] uppercase tracking-wider text-text-secondary mb-1">Key Claims</div>
        <div className="flex flex-wrap gap-1">
          {comp.claims.map((cl) => (
            <span key={cl} className="text-[10px] px-1.5 py-0.5 rounded bg-accent-amber/10 text-accent-amber border border-accent-amber/20">{cl}</span>
          ))}
        </div>
      </div>
      <div className="text-[10px] font-mono text-text-secondary">{comp.marketPosition}</div>
    </div>
  );
}

function CompetitorsBlock({ detected, onUpdateDetected }) {
  const [editing, setEditing] = useState(false);
  const [competitors, setCompetitors] = useState(detected?.length ? detected : DEMO_COMPETITORS);

  const updateCompetitor = (i, comp) => {
    const next = [...competitors];
    next[i] = comp;
    setCompetitors(next);
    onUpdateDetected(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#B0B8D1]">🔍 Competitors Detected from Your Concept</span>
          <span className="ml-2 text-[10px] font-mono text-accent-teal">Auto-generated based on category + concept description</span>
        </div>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="text-[10px] font-mono text-text-secondary hover:text-accent-amber transition-colors flex items-center gap-1"
        >
          {editing ? "Done Editing" : <><Pencil size={10} /> Edit</>}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {competitors.map((comp, i) => (
          <CompetitorCard key={i} comp={comp} editable={editing} onUpdate={(c) => updateCompetitor(i, c)} />
        ))}
      </div>
    </div>
  );
}

export default function Step1Product({ data, setData, onNext }) {
  const [loading, setLoading] = useState(false);

  const update = (patch) => setData({ ...data, ...patch });

  const toggleMarket = (m) => {
    const next = data.target_markets.includes(m)
      ? data.target_markets.filter((x) => x !== m)
      : [...data.target_markets, m];
    update({ target_markets: next });
  };

  const toggleNeed = (n) => {
    const next = data.consumer_needs.includes(n)
      ? data.consumer_needs.filter((x) => x !== n)
      : [...data.consumer_needs, n];
    update({ consumer_needs: next });
  };

  const updateDetected = (competitors) => update({ detected_competitors: competitors });

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-right">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Product Concept</h2>
        <p className="text-text-secondary mt-1 text-sm">
          Tell us what you're launching. The more context, the sharper the analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 max-w-2xl mx-auto">
        <Field label="Product Name">
          <input
            className={inputCls}
            placeholder="e.g. Sunrise Oat Protein Shake"
            value={data.product_name}
            onChange={(e) => update({ product_name: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Category">
            <select
              className={inputCls}
              value={data.category}
              onChange={(e) => update({ category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Target Market">
            <div className="flex flex-wrap gap-2 pt-1">
              {MARKETS.map((m) => (
                <Chip key={m} label={m} active={data.target_markets.includes(m)} onClick={() => toggleMarket(m)} />
              ))}
            </div>
          </Field>
        </div>

        <Field label="Concept Description" hint={`${data.concept_description.length} / 500`}>
          <textarea
            rows={4}
            maxLength={500}
            className={inputCls + " resize-none"}
            placeholder="What is the product? Who is it for? What problem does it solve?"
            value={data.concept_description}
            onChange={(e) => update({ concept_description: e.target.value })}
          />
        </Field>

        <Field label="Current Positioning Angle">
          <textarea
            rows={2}
            className={inputCls + " resize-none"}
            placeholder="How would you describe this product's angle in one line?"
            value={data.positioning_angle}
            onChange={(e) => update({ positioning_angle: e.target.value })}
          />
        </Field>

        <Field label="Consumer Need">
          <div className="flex flex-wrap gap-2 pt-1">
            {CONSUMER_NEEDS.map((n) => (
              <Chip key={n} label={n} active={data.consumer_needs.includes(n)} onClick={() => toggleNeed(n)} />
            ))}
          </div>
        </Field>

        <CompetitorsBlock
          detected={data.detected_competitors}
          onUpdateDetected={updateDetected}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-accent-amber text-bg-primary font-semibold py-3 rounded-md flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              ValueForge is reading your concept...
            </>
          ) : (
            <>
              Analyze My Concept
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
