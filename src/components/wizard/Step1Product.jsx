import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2, Plus, X, Pencil, Trash2 } from "lucide-react";
import Chip from "../shared/Chip";
import { CATEGORIES, MARKETS, PREDEFINED_CLAIMS } from "../../data/demoData";

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

const POSITIONS = ["Category Leader", "Challenger", "Niche Player"];

function CompetitorCard({ comp, editable, onUpdate, onRemove, isLast }) {
  const [snapshot] = useState({ ...comp, claims: [...(comp.claims || [])] });

  const [localName, setLocalName] = useState(comp.name);
  const [localClaims, setLocalClaims] = useState(
    Array.isArray(comp.claims) ? [...comp.claims] : []
  );
  const [localPosition, setLocalPosition] = useState(comp.marketPosition);
  const [claimInput, setClaimInput] = useState("");

  const addClaim = () => {
    const val = claimInput.trim();
    if (!val || localClaims.includes(val)) return;
    setLocalClaims([...localClaims, val]);
    setClaimInput("");
  };

  const removeClaim = (cl) => setLocalClaims(localClaims.filter((c) => c !== cl));

  const handleSave = () => {
    if (!localName.trim()) return;
    onUpdate({
      ...comp,
      name: localName.trim(),
      claims: localClaims,
      marketPosition: localPosition,
    });
  };

  const handleCancel = () => {
    setLocalName(snapshot.name);
    setLocalClaims([...snapshot.claims]);
    setLocalPosition(snapshot.marketPosition);
    onUpdate(snapshot);
  };

  if (editable) {
    return (
      <div className="bg-bg-surface border border-accent-amber/40 rounded-lg p-3 flex flex-col gap-3">

        {!isLast && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onRemove}
              className="text-text-secondary hover:text-red-400 transition-colors"
              title="Remove competitor"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}

        <input
          className="w-full bg-bg-primary border border-border-color rounded px-2 py-1.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent-amber transition-colors"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          placeholder="Brand name"
        />

        <div>
          <div className="text-[10px] uppercase tracking-wider text-text-secondary mb-1.5">
            Key Claims
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
            {localClaims.map((cl) => (
              <span
                key={cl}
                className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-accent-amber/10 text-accent-amber border border-accent-amber/20"
              >
                {cl}
                <button
                  type="button"
                  onClick={() => removeClaim(cl)}
                  className="hover:text-red-400 transition-colors leading-none"
                >
                  <X size={9} />
                </button>
              </span>
            ))}
            {localClaims.length === 0 && (
              <span className="text-[10px] text-text-secondary/50 italic">No claims yet</span>
            )}
          </div>
          <div className="flex gap-1.5">
            <input
              className="flex-1 bg-bg-primary border border-border-color rounded px-2 py-1 text-[11px] text-text-primary placeholder:text-text-secondary/50 focus:border-accent-amber transition-colors"
              value={claimInput}
              onChange={(e) => setClaimInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addClaim(); } }}
              placeholder="+ Add claim..."
            />
            <button
              type="button"
              onClick={addClaim}
              className="text-[10px] px-2 py-1 rounded border border-accent-amber/40 text-accent-amber hover:bg-accent-amber/10 transition-colors whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-wider text-text-secondary mb-1.5">
            Market Position
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setLocalPosition(pos)}
                className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                  localPosition === pos
                    ? "bg-accent-amber text-bg-primary border-accent-amber font-semibold"
                    : "text-accent-amber border-accent-amber/40 hover:bg-accent-amber/10"
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-1 border-t border-border-color">
          <button
            type="button"
            onClick={handleSave}
            className="w-full bg-accent-amber text-bg-primary text-xs font-semibold py-1.5 rounded hover:opacity-90 transition-opacity"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full text-xs text-text-secondary hover:text-text-primary transition-colors py-1"
          >
            Cancel
          </button>
        </div>

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
          {(Array.isArray(comp.claims) ? comp.claims : []).map((cl) => (
            <span key={cl} className="text-[10px] px-1.5 py-0.5 rounded bg-accent-amber/10 text-accent-amber border border-accent-amber/20">
              {cl}
            </span>
          ))}
        </div>
      </div>
      <div className="text-[10px] font-mono text-text-secondary">{comp.marketPosition}</div>
    </div>
  );
}

function CompetitorsBlock({ detected, onUpdateDetected, conceptDescription }) {
  const [editing, setEditing] = useState(false);
  const [competitors, setCompetitors] = useState(detected?.length ? detected : DEMO_COMPETITORS);
  const [visible, setVisible] = useState(detected?.length > 0 || conceptDescription?.length > 10);
  const timerRef = useRef(null);

  useEffect(() => {
    if (detected?.length > 0) { setVisible(true); return; }
    if (timerRef.current) clearTimeout(timerRef.current);
    if (conceptDescription?.length > 3) {
      timerRef.current = setTimeout(() => setVisible(true), 500);
    } else { setVisible(false); }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [conceptDescription, detected]);

  const sync = (next) => { setCompetitors(next); onUpdateDetected(next); };

  const updateCompetitor = (i, comp) => {
    const next = [...competitors];
    next[i] = comp;
    sync(next);
  };

  const removeCompetitor = (i) => {
    if (competitors.length <= 1) return;
    sync(competitors.filter((_, idx) => idx !== i));
  };

  const addCompetitor = () => {
    const blank = { name: "", category: "", claims: [], marketPosition: "Challenger" };
    sync([...competitors, blank]);
    setEditing(true);
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
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-3 transition-all duration-300"
        style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-8px)" }}
      >
        {competitors.map((comp, i) => (
          <CompetitorCard
            key={i}
            comp={comp}
            editable={editing}
            onUpdate={(c) => updateCompetitor(i, c)}
            onRemove={() => removeCompetitor(i)}
            isLast={competitors.length === 1}
          />
        ))}
      </div>
      {editing && (
        <button
          type="button"
          onClick={addCompetitor}
          className="mt-3 flex items-center gap-1.5 text-xs text-accent-amber border border-accent-amber/30 px-3 py-1.5 rounded-md hover:bg-accent-amber/5 transition-colors"
        >
          <Plus size={12} /> Add Competitor
        </button>
      )}
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

        <Field label="Key Claims">
          <div className="flex flex-wrap gap-2 pt-1">
            {PREDEFINED_CLAIMS.map((cl) => (
              <Chip key={cl} label={cl} size="sm" active={(data.key_claims || []).includes(cl)} onClick={() => {
                const arr = data.key_claims || [];
                update({ key_claims: arr.includes(cl) ? arr.filter((x) => x !== cl) : [...arr, cl] });
              }} />
            ))}
            {(data._custom_claims || []).map((cc) => (
              <span key={cc} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border bg-accent-amber/10 text-accent-amber border-accent-amber/20 cursor-pointer transition-all hover:bg-accent-amber/20" onClick={() => {
                const arr = data.key_claims || [];
                update({ key_claims: arr.includes(cc) ? arr.filter((x) => x !== cc) : [...arr, cc] });
              }}>
                {cc}
                <button type="button" onClick={(e) => { e.stopPropagation(); update({ key_claims: (data.key_claims || []).filter((x) => x !== cc), _custom_claims: (data._custom_claims || []).filter((x) => x !== cc) }); }} className="hover:text-danger transition-colors">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              className={inputCls + " flex-1 text-xs"}
              placeholder="+ Add custom claim..."
              value={data._claimInput || ""}
              onChange={(e) => update({ _claimInput: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const val = data._claimInput?.trim();
                  if (val && !PREDEFINED_CLAIMS.includes(val) && !(data._custom_claims || []).includes(val)) {
                    update({ key_claims: [...(data.key_claims || []), val], _custom_claims: [...(data._custom_claims || []), val], _claimInput: "" });
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const val = data._claimInput?.trim();
                if (val && !PREDEFINED_CLAIMS.includes(val) && !(data._custom_claims || []).includes(val)) {
                  update({ key_claims: [...(data.key_claims || []), val], _custom_claims: [...(data._custom_claims || []), val], _claimInput: "" });
                }
              }}
              className="text-xs text-accent-amber border border-accent-amber/30 px-3 rounded-md hover:bg-accent-amber/5 transition-colors whitespace-nowrap"
            >
              + Add
            </button>
          </div>
          {(!data.key_claims || data.key_claims.length === 0) && (
            <p className="text-[10px] text-text-secondary mt-1.5">Click claims above to select, or add a custom one. Selected claims will be checked for saturation in Step 3.</p>
          )}
        </Field>


        <CompetitorsBlock
          detected={data.detected_competitors}
          onUpdateDetected={updateDetected}
          conceptDescription={data.concept_description}
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