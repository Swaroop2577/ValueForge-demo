import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-14 bg-bg-primary border-b border-border-color flex items-center px-6 gap-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-amber to-accent-teal flex items-center justify-center">
          <Sparkles size={18} color="#1A1F35" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-text-primary text-lg tracking-tight">
          Ai Palette
        </span>
      </div>
      <span className="text-text-secondary">/</span>
      <span className="text-text-primary font-medium">ValueForge</span>
      <div className="ml-auto flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-bg-surface border border-border-color flex items-center justify-center text-xs font-mono font-semibold text-accent-amber">
          BM
        </div>
        <div className="hidden sm:block">
          <div className="text-sm text-text-primary leading-tight">Brand Manager</div>
          <div className="text-xs text-text-secondary leading-tight">demo@aipalette.io</div>
        </div>
      </div>
    </header>
  );
}
