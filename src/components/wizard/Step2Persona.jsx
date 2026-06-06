import { useState, useEffect, useRef } from "react";
import { ArrowRight, Check, Loader2, Plus, X } from "lucide-react";
import Chip from "../shared/Chip";
import PersonaPreview from "./PersonaPreview";
import {
  GENDERS,
  LOCATIONS,
  INCOME_LEVELS,
  OCCUPATIONS,
  LIFESTYLE_TAGS,
  PURCHASE_BEHAVIORS,
  MEDIA_CHANNELS,
} from "../../data/demoData";

let nextId = 2;
function genId() {
  return `persona_${nextId++}`;
}

const LOADING_LINES = [
  "Scanning competitor claims...",
  "Mapping claim saturation...",
  "Running persona resonance model...",
];

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-text-primary mb-1.5">{label}</div>
      {children}
    </label>
  );
}

const inputCls =
  "w-full bg-bg-primary border border-border-color rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent-amber transition-colors";

const TAB_CLS =
  "px-3 py-1.5 text-xs rounded-md font-medium transition-all flex items-center gap-1.5";

function TabBar({ personas, activeId, onSelect, onAdd, onDelete, onSave }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
      {personas.map((p) => {
        const name = p.persona_name || `Persona ${personas.indexOf(p) + 1}`;
        const isActive = p.id === activeId;
        return (
          <div key={p.id} className="flex items-center">
            <button
              type="button"
              onClick={() => { onSave(); onSelect(p.id); }}
              className={`${TAB_CLS} ${
                isActive
                  ? "bg-bg-primary text-text-primary border-b-2 border-accent-amber rounded-b-none"
                  : "bg-[#252B47] text-text-secondary hover:text-text-primary"
              }`}
            >
              {name}
            </button>
            {personas.length > 1 && (
              <button
                type="button"
                onClick={() => onDelete(p.id)}
                className="text-text-secondary hover:text-danger ml-0.5 p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      })}
      {personas.length < 4 ? (
        <button
          type="button"
          onClick={onAdd}
          className={`${TAB_CLS} border border-dashed border-accent-amber/60 text-accent-amber hover:border-accent-amber`}
        >
          <Plus size={14} className="text-accent-teal" /> Add Persona
        </button>
      ) : (
        <div className="relative group">
          <button
            type="button"
            disabled
            className={`${TAB_CLS} border border-dashed border-border-color text-text-secondary/40 cursor-not-allowed`}
          >
            <Plus size={14} /> Add Persona
          </button>
          <div className="absolute top-full left-0 mt-1 z-50 hidden group-hover:block bg-bg-surface border border-border-color rounded-md px-3 py-1.5 text-xs text-text-secondary whitespace-nowrap shadow-xl">
            Maximum 4 personas reached
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_PERSONA = {
  persona_name: "",
  age_range: [18, 45],
  gender: [],
  location_type: "",
  income_level: "",
  occupation: [],
  lifestyle_tags: [],
  purchase_behavior: "",
  media_channels: [],
};

export default function Step2Persona({ personas, setPersonas, activePersonaId, setActivePersonaId, onNext }) {
  const [loadingIdx, setLoadingIdx] = useState(-1);

  const activePersona = personas.find((p) => p.id === activePersonaId) || personas[0];
  const [form, setForm] = useState({ ...activePersona });

  const saveRef = useRef(() => {});
  saveRef.current = () => {
    setPersonas((prev) =>
      prev.map((p) => (p.id === form.id ? { ...form } : p))
    );
  };

  useEffect(() => {
    setForm({ ...(personas.find((p) => p.id === activePersonaId) || personas[0]) });
  }, [activePersonaId, personas]);

  const updateForm = (patch) => {
    const next = { ...form, ...patch };
    setForm(next);
    saveRef.current();
    if (patch.persona_name !== undefined || Object.keys(patch).length > 0) {
      setPersonas((prev) =>
        prev.map((p) => (p.id === next.id ? { ...next } : p))
      );
    }
  };

  const toggleArr = (key, val) => {
    const arr = form[key] || [];
    const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
    updateForm({ [key]: next });
  };

  const setAge = (i, v) => {
    const next = [...form.age_range];
    next[i] = v;
    updateForm({ age_range: next });
  };

  const saveCurrent = () => {
    setPersonas((prev) =>
      prev.map((p) => (p.id === form.id ? { ...form } : p))
    );
  };

  const handleTabSelect = (id) => {
    saveCurrent();
    setActivePersonaId(id);
  };

  const handleAddPersona = () => {
    saveCurrent();
    const id = genId();
    setPersonas((prev) => [...prev, { id, ...EMPTY_PERSONA, age_range: [18, 45] }]);
    setActivePersonaId(id);
  };

  const handleDeletePersona = (id) => {
    if (personas.length <= 1) return;
    setPersonas((prev) => prev.filter((p) => p.id !== id));
    if (activePersonaId === id) {
      const remaining = personas.filter((p) => p.id !== id);
      setActivePersonaId(remaining[0].id);
    }
  };

  const handleNext = (e) => {
    e?.preventDefault?.();
    saveCurrent();
    let i = 0;
    setLoadingIdx(0);
    const tick = () => {
      i += 1;
      if (i < LOADING_LINES.length) {
        setLoadingIdx(i);
        setTimeout(tick, 900);
      } else {
        setLoadingIdx(-1);
        onNext();
      }
    };
    setTimeout(tick, 900);
  };

  const loading = loadingIdx >= 0;

  return (
    <form onSubmit={handleNext} className="animate-slide-right">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-text-primary mb-1">Persona Builder</h2>
        <p className="text-text-secondary text-sm">
          Define the consumer this product is built for. The preview updates live.
        </p>
      </div>

      <TabBar
        personas={personas}
        activeId={activePersonaId}
        onSelect={handleTabSelect}
        onAdd={handleAddPersona}
        onDelete={handleDeletePersona}
        onSave={saveCurrent}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 mt-4">
        <div className="bg-bg-surface border border-border-color rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Persona Name">
              <input
                className={inputCls}
                placeholder="e.g. Priya M."
                value={form.persona_name}
                onChange={(e) => updateForm({ persona_name: e.target.value })}
              />
            </Field>
            <Field label="Occupation">
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {OCCUPATIONS.slice(0, 6).map((o) => (
                  <Chip key={o} label={o} size="sm" active={form.occupation?.includes(o)} onClick={() => toggleArr("occupation", o)} />
                ))}
              </div>
            </Field>
          </div>

          <Field label={`Age Range: ${form.age_range[0]} – ${form.age_range[1]}`}>
            <div className="px-1 pt-1">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={18}
                  max={65}
                  value={form.age_range[0]}
                  onChange={(e) => setAge(0, parseInt(e.target.value))}
                  className="flex-1 accent-amber"
                />
                <input
                  type="range"
                  min={18}
                  max={65}
                  value={form.age_range[1]}
                  onChange={(e) => setAge(1, parseInt(e.target.value))}
                  className="flex-1 accent-amber"
                />
              </div>
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>18</span>
                <span>65</span>
              </div>
            </div>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Gender">
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {GENDERS.map((g) => (
                  <Chip key={g} label={g} size="sm" active={form.gender.includes(g)} onClick={() => toggleArr("gender", g)} />
                ))}
              </div>
            </Field>
            <Field label="Location Type">
              <div className="flex gap-1.5 pt-0.5">
                {LOCATIONS.map((l) => (
                  <Chip key={l} label={l} size="sm" active={form.location_type === l} onClick={() => updateForm({ location_type: l })} />
                ))}
              </div>
            </Field>
          </div>

          <Field label="Income Level">
            <div className="grid grid-cols-4 gap-1.5">
              {INCOME_LEVELS.map((l) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => updateForm({ income_level: l })}
                  className={`text-xs py-2 rounded-md border transition-all ${
                    form.income_level === l
                      ? "bg-accent-amber text-bg-primary border-accent-amber font-semibold"
                      : "bg-bg-primary text-text-secondary border-border-color hover:text-text-primary"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Lifestyle Tags (max 5)">
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {LIFESTYLE_TAGS.map((l) => {
                const active = form.lifestyle_tags.includes(l);
                const disabled = !active && form.lifestyle_tags.length >= 5;
                return (
                  <Chip
                    key={l}
                    label={l}
                    size="sm"
                    active={active}
                    onClick={() => {
                      if (disabled) return;
                      toggleArr("lifestyle_tags", l);
                    }}
                  />
                );
              })}
            </div>
          </Field>

          <Field label="Purchase Behavior">
            <select
              className={inputCls}
              value={form.purchase_behavior}
              onChange={(e) => updateForm({ purchase_behavior: e.target.value })}
            >
              <option value="">Select...</option>
              {PURCHASE_BEHAVIORS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Media Channels">
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {MEDIA_CHANNELS.map((m) => (
                <Chip key={m} label={m} size="sm" active={form.media_channels.includes(m)} onClick={() => toggleArr("media_channels", m)} />
              ))}
            </div>
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-amber text-bg-primary font-semibold py-3 rounded-md flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {LOADING_LINES[loadingIdx]}
              </>
            ) : (
              <>
                Map Competitive Landscape
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {loading && (
            <div className="space-y-1.5 pt-2">
              {LOADING_LINES.map((line, i) => (
                <div
                  key={line}
                  className={`text-xs flex items-center gap-2 ${
                    i < loadingIdx
                      ? "text-accent-teal"
                      : i === loadingIdx
                      ? "text-accent-amber"
                      : "text-text-secondary/40"
                  }`}
                >
                  {i < loadingIdx ? <Check size={12} /> : i === loadingIdx ? <Loader2 size={12} className="animate-spin" /> : <span className="w-3 h-3 inline-block" />}
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-4 self-start">
          <PersonaPreview data={form} />
        </div>
      </div>
    </form>
  );
}