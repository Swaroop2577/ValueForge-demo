import {
  LayoutDashboard,
  PlusCircle,
  FolderKanban,
  Map,
  Users,
  FileText,
  Settings,
} from "lucide-react";

const LINKS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "new", label: "New Analysis", icon: PlusCircle },
  { id: "projects", label: "My Projects", icon: FolderKanban },
  { id: "competitive", label: "Competitive Map", icon: Map },
  { id: "personas", label: "Persona Library", icon: Users },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="w-60 bg-bg-surface border-r border-border-color flex-shrink-0 flex flex-col py-6">
      <div className="px-5 mb-2 text-xs uppercase tracking-widest text-text-secondary">
        Workspace
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = active === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelect(link.id)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left ${
                isActive
                  ? "text-accent-amber bg-bg-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-primary/40"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-accent-amber" />
              )}
              <Icon size={18} />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto mx-3 p-4 rounded-lg bg-bg-primary border border-border-color">
        <div className="text-xs text-text-secondary mb-1">PRO FEATURE</div>
        <div className="text-sm text-text-primary font-medium mb-2">
          AI Claim Forecasting
        </div>
        <button className="w-full text-xs bg-accent-amber text-bg-primary font-semibold py-1.5 rounded">
          Upgrade
        </button>
      </div>
    </aside>
  );
}
