export default function Chip({ label, active, onClick, size = "md" }) {
  const sizeCls = size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-3 py-1.5";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${sizeCls} rounded-full border transition-all duration-150 ${
        active
          ? "bg-accent-amber text-bg-primary border-accent-amber font-medium"
          : "bg-transparent text-text-secondary border-border-color hover:border-text-secondary hover:text-text-primary"
      }`}
    >
      {label}
    </button>
  );
}
