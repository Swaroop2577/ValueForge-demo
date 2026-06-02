export default function ScoreGauge({ value = 0, size = 200, label = "" }) {
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = Math.PI * radius;
  const finalOffset = circumference - (value / 100) * circumference;
  const color =
    value < 40 ? "var(--danger)" : value < 70 ? "var(--accent-amber)" : "var(--accent-teal)";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size / 2 + 30 }}>
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--danger)" />
            <stop offset="50%" stopColor="var(--accent-amber)" />
            <stop offset="100%" stopColor="var(--accent-teal)" />
          </linearGradient>
        </defs>
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          stroke="var(--border)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{
            transition: "stroke-dashoffset 800ms ease-out, stroke 400ms ease",
            strokeDashoffset: finalOffset,
          }}
        />
      </svg>
      <div
        className="absolute flex flex-col items-center"
        style={{ bottom: 6, left: 0, right: 0 }}
      >
        <div
          className="font-mono font-bold leading-none"
          style={{ color, fontSize: size / 3.6 }}
        >
          {value}
        </div>
        {label && (
          <div className="text-xs uppercase tracking-widest text-text-secondary mt-1">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
