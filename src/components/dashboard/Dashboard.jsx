import { ArrowRight, FileText } from "lucide-react";
import { PROJECTS } from "../../data/demoData";

function scoreColor(score) {
  if (score === 0) return "var(--border)";
  if (score < 40) return "var(--danger)";
  if (score < 70) return "var(--accent-amber)";
  return "var(--accent-teal)";
}

function statusBadge(status) {
  const map = {
    draft: { label: "Draft", cls: "bg-bg-primary text-text-secondary border-border-color" },
    in_progress: { label: "In Progress", cls: "bg-accent-amber/15 text-accent-amber border-accent-amber/40" },
    complete: { label: "Complete", cls: "bg-accent-teal/15 text-accent-teal border-accent-teal/40" },
  };
  const cfg = map[status];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function ScoreRing({ score, size = 56 }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none" />
        {score > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={scoreColor(score)}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 800ms ease-out" }}
          />
        )}
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-sm"
        style={{ color: scoreColor(score) }}
      >
        {score > 0 ? score : "—"}
      </div>
    </div>
  );
}

function ProjectCard({ project, onContinue, onView }) {
  return (
    <div className="bg-bg-surface border border-border-color rounded-xl p-5 flex flex-col gap-4 hover:border-accent-amber/50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-text-primary font-semibold truncate">
            {project.name}
          </div>
          <div className="text-text-secondary text-xs mt-0.5">
            {project.category} · Updated {project.updated}
          </div>
        </div>
        <ScoreRing score={project.score} />
      </div>
      <div className="flex items-center justify-between">
        {statusBadge(project.status)}
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={onContinue}
          className="flex-1 bg-accent-amber text-bg-primary text-sm font-semibold py-2 rounded-md flex items-center justify-center gap-1.5 hover:opacity-90"
        >
          {project.status === "complete" ? "View" : "Continue"}
          <ArrowRight size={14} />
        </button>
        <button
          onClick={onView}
          className="px-3 py-2 border border-border-color text-text-secondary hover:text-text-primary rounded-md text-sm flex items-center gap-1.5"
        >
          <FileText size={14} />
          Report
        </button>
      </div>
    </div>
  );
}

export default function Dashboard({ onNewAnalysis, onContinue }) {
  const totalActive = PROJECTS.filter((p) => p.status === "in_progress").length;
  const completedScores = PROJECTS.filter((p) => p.status === "complete").map((p) => p.score);
  const avgScore = completedScores.length
    ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length)
    : 0;
  const totalClaims = 24;
  const whitespace = 7;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome back. Here's where your brand strategy stands today.
          </p>
        </div>
        <button
          onClick={onNewAnalysis}
          className="bg-accent-amber text-bg-primary font-semibold px-5 py-2.5 rounded-md flex items-center gap-2 hover:opacity-90"
        >
          <span>+ New Analysis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Active Analyses", value: totalActive, hint: "2 ending this week", accent: "amber", emoji: "📊" },
          { label: "Avg Differentiation Score", value: avgScore, hint: "Out of 100", accent: "teal" },
          { label: "Claims Flagged", value: totalClaims, hint: "Across all projects", accent: "danger" },
          { label: "Whitespace Opportunities", value: whitespace, hint: "Ready to claim", accent: "teal" },
        ].map((k) => (
          <div
            key={k.label}
            className="bg-bg-surface border border-border-color rounded-xl p-5"
          >
            <div className="text-xs uppercase tracking-wider text-text-secondary">
              {k.label}
            </div>
            <div
              className="font-mono text-3xl font-bold mt-2"
              style={{
                color:
                  k.accent === "danger"
                    ? "var(--danger)"
                    : k.accent === "teal"
                    ? "var(--accent-teal)"
                    : "var(--accent-amber)",
              }}
            >
              {k.value}
            </div>
            <div className="text-xs text-text-secondary mt-1">{k.hint}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">My Projects</h2>
        <div className="flex items-center gap-2">
          <button className="text-xs text-text-secondary border border-border-color px-3 py-1.5 rounded-md">
            All
          </button>
          <button className="text-xs text-text-secondary border border-border-color px-3 py-1.5 rounded-md">
            Drafts
          </button>
          <button className="text-xs text-text-secondary border border-border-color px-3 py-1.5 rounded-md">
            In Progress
          </button>
          <button className="text-xs text-text-secondary border border-border-color px-3 py-1.5 rounded-md">
            Complete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onContinue={() => onContinue(p)}
            onView={() => onContinue(p)}
          />
        ))}
      </div>
    </div>
  );
}
