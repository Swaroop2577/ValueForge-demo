import { Sparkles, TrendingUp, Radio, MapPin } from "lucide-react";

const TRAIT_BARS = [
  { key: "fitness", label: "Fitness" },
  { key: "eco", label: "Eco-Aware" },
  { key: "time", label: "Time Pressure" },
  { key: "budget", label: "Budget Sensitivity" },
  { key: "premium", label: "Premium Affinity" },
];

function getTraits(data) {
  const tags = data.lifestyle_tags || [];
  return {
    fitness: tags.includes("Fitness Conscious") ? 5 : 2,
    eco: tags.includes("Eco-Aware") ? 5 : 1,
    time: tags.includes("Time-Starved") ? 5 : 3,
    budget: tags.includes("Budget-Minded") ? 5 : 2,
    premium: tags.includes("Premium Seeker") ? 5 : 1,
  };
}

export default function PersonaPreview({ data }) {
  const traits = getTraits(data);

  return (
    <div className="dashed-amber bg-bg-primary/60 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-widest text-accent-amber">
          Live Preview
        </div>
        <Sparkles size={14} className="text-accent-amber" />
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-text-primary leading-tight">
          {data.persona_name || "Unnamed Persona"}
        </div>
        <div className="flex items-center gap-2 text-text-secondary text-sm mt-1 flex-wrap">
          <span className="font-mono">{data.age_range[0]}–{data.age_range[1]}</span>
          {data.gender.length > 0 && <span>· {data.gender.join(", ")}</span>}
          {data.location_type && (
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {data.location_type}
            </span>
          )}
        </div>
        {data.income_level && (
          <div className="text-xs text-text-secondary mt-1">Income: {data.income_level}</div>
        )}
      </div>

      {data.lifestyle_tags.length > 0 && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-widest text-text-secondary mb-2 flex items-center gap-1">
            <TrendingUp size={12} /> Lifestyle
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.lifestyle_tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full bg-accent-amber/10 text-accent-amber border border-accent-amber/30"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="text-xs uppercase tracking-widest text-text-secondary mb-2">Trait Profile</div>
        <div className="space-y-2">
          {TRAIT_BARS.map((t) => (
            <div key={t.key} className="flex items-center gap-3">
              <div className="text-xs text-text-secondary w-32 flex-shrink-0">{t.label}</div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i <= traits[t.key] ? "bg-accent-amber" : "bg-border-color"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.purchase_behavior && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-widest text-text-secondary mb-1">
            Behavior
          </div>
          <div className="text-sm text-text-primary">{data.purchase_behavior}</div>
        </div>
      )}

      {data.media_channels.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-text-secondary mb-2 flex items-center gap-1">
            <Radio size={12} /> Reachable On
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.media_channels.slice(0, 6).map((m) => (
              <span
                key={m}
                className="text-xs px-2 py-0.5 rounded bg-bg-surface text-text-secondary border border-border-color"
              >
                {m}
              </span>
            ))}
            {data.media_channels.length > 6 && (
              <span className="text-xs text-text-secondary px-2 py-0.5">
                +{data.media_channels.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
