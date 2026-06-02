export default function StatCard({ label, value, hint, accent = "amber", icon: Icon }) {
  const colorVar =
    accent === "teal"
      ? "var(--accent-teal)"
      : accent === "danger"
      ? "var(--danger)"
      : "var(--accent-amber)";
  return (
    <div className="bg-bg-surface border border-border-color rounded-xl p-5 flex items-start gap-4">
      {Icon && (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${colorVar}1A` }}
        >
          <Icon size={20} color={colorVar} />
        </div>
      )}
      <div className="min-w-0">
        <div className="text-text-secondary text-xs uppercase tracking-wider mb-1">
          {label}
        </div>
        <div className="font-mono text-3xl font-bold" style={{ color: colorVar }}>
          {value}
        </div>
        {hint && (
          <div className="text-text-secondary text-xs mt-1 truncate">{hint}</div>
        )}
      </div>
    </div>
  );
}
