import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
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

export default function Step2Persona({ data, setData, onNext }) {
  const [loadingIdx, setLoadingIdx] = useState(-1);

  const update = (patch) => setData({ ...data, ...patch });

  const toggleArr = (key, val) => {
    const arr = data[key] || [];
    const next = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
    update({ [key]: next });
  };

  const setAge = (i, v) => {
    const next = [...data.age_range];
    next[i] = v;
    update({ age_range: next });
  };

  const handleNext = (e) => {
    e?.preventDefault?.();
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
      <div className="mb-6 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Persona Builder</h2>
          <p className="text-text-secondary mt-1 text-sm">
            Define the consumer this product is built for. The preview updates live.
          </p>
        </div>
        <div className="inline-flex bg-bg-surface border border-border-color rounded-md p-0.5 text-xs">
          <button
            type="button"
            className="px-3 py-1.5 rounded bg-accent-amber text-bg-primary font-semibold"
          >
            Build New Persona
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded text-text-secondary hover:text-text-primary"
          >
            Load from Library
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        <div className="bg-bg-surface border border-border-color rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Persona Name">
              <input
                className={inputCls}
                placeholder="e.g. Priya M."
                value={data.persona_name}
                onChange={(e) => update({ persona_name: e.target.value })}
              />
            </Field>
            <Field label="Occupation">
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {OCCUPATIONS.slice(0, 6).map((o) => (
                  <Chip key={o} label={o} size="sm" active={data.occupation?.includes(o)} onClick={() => toggleArr("occupation", o)} />
                ))}
              </div>
            </Field>
          </div>

          <Field label={`Age Range: ${data.age_range[0]} – ${data.age_range[1]}`}>
            <div className="px-1 pt-1">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={18}
                  max={65}
                  value={data.age_range[0]}
                  onChange={(e) => setAge(0, parseInt(e.target.value))}
                  className="flex-1 accent-amber"
                />
                <input
                  type="range"
                  min={18}
                  max={65}
                  value={data.age_range[1]}
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
                  <Chip key={g} label={g} size="sm" active={data.gender.includes(g)} onClick={() => toggleArr("gender", g)} />
                ))}
              </div>
            </Field>
            <Field label="Location Type">
              <div className="flex gap-1.5 pt-0.5">
                {LOCATIONS.map((l) => (
                  <Chip key={l} label={l} size="sm" active={data.location_type === l} onClick={() => update({ location_type: l })} />
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
                  onClick={() => update({ income_level: l })}
                  className={`text-xs py-2 rounded-md border transition-all ${
                    data.income_level === l
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
                const active = data.lifestyle_tags.includes(l);
                const disabled = !active && data.lifestyle_tags.length >= 5;
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
              value={data.purchase_behavior}
              onChange={(e) => update({ purchase_behavior: e.target.value })}
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
                <Chip key={m} label={m} size="sm" active={data.media_channels.includes(m)} onClick={() => toggleArr("media_channels", m)} />
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
          <PersonaPreview data={data} />
        </div>
      </div>
    </form>
  );
}
