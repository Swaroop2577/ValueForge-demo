export default function Stepper({ steps, current, onJump }) {
  return (
    <div className="flex items-center gap-2 w-full">
      {steps.map((label, i) => {
        const idx = i + 1;
        const isDone = idx < current;
        const isActive = idx === current;
        return (
          <div key={label} className="flex items-center flex-1 min-w-0">
            <button
              type="button"
              onClick={() => isDone && onJump?.(idx)}
              disabled={!isDone}
              className={`flex items-center gap-3 min-w-0 ${
                isDone ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm font-semibold flex-shrink-0 transition-all ${
                  isDone
                    ? "bg-accent-amber text-bg-primary"
                    : isActive
                    ? "bg-bg-primary text-accent-amber border-2 border-accent-amber animate-pulse-amber"
                    : "bg-bg-primary text-text-secondary border-2 border-border-color"
                }`}
              >
                {isDone ? "✓" : idx}
              </div>
              <div className="hidden md:block text-left min-w-0">
                <div
                  className={`text-xs uppercase tracking-wider ${
                    isActive ? "text-accent-amber" : "text-text-secondary"
                  }`}
                >
                  Step {idx}
                </div>
                <div
                  className={`text-sm font-medium truncate ${
                    isActive
                      ? "text-text-primary"
                      : isDone
                      ? "text-text-primary"
                      : "text-text-secondary"
                  }`}
                >
                  {label}
                </div>
              </div>
            </button>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-border-color mx-3" />
            )}
          </div>
        );
      })}
    </div>
  );
}
