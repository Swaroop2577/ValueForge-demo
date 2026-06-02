export default function SaturationBar({ value, status }) {
  const fill =
    status === "saturated"
      ? "var(--danger)"
      : status === "competitive"
      ? "var(--accent-amber)"
      : "var(--accent-teal)";
  return (
    <div className="w-full h-2 rounded-full bg-border-color overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          background: fill,
          transition: "width 900ms ease-out",
        }}
      />
    </div>
  );
}
