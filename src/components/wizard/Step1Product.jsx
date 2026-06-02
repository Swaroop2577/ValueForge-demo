import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Chip from "../shared/Chip";
import { CATEGORIES, MARKETS, CONSUMER_NEEDS } from "../../data/demoData";

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

const NUM_COMPETITORS = 3;

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

  const updateCompetitor = (i, patch) => {
    const next = data.competitors.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    update({ competitors: next });
  };

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

        <div>
          <div className="text-sm font-medium text-text-primary mb-2">Top 3 Competitors</div>
          <div className="space-y-3">
            {Array.from({ length: NUM_COMPETITORS }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className={inputCls}
                  placeholder={`Competitor ${i + 1} name`}
                  value={data.competitors[i]?.name || ""}
                  onChange={(e) => updateCompetitor(i, { name: e.target.value })}
                />
                <input
                  className={inputCls}
                  placeholder="Their key claims (comma-separated)"
                  value={data.competitors[i]?.claims || ""}
                  onChange={(e) => updateCompetitor(i, { claims: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>

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
