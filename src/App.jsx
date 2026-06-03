import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/dashboard/Dashboard";
import Wizard from "./components/wizard/Wizard";

function PlaceholderView({ title, hint }) {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
      <p className="text-text-secondary mt-2">{hint}</p>
      <div className="mt-8 bg-bg-surface border border-border-color border-dashed rounded-xl p-16 text-center text-text-secondary">
        <div className="text-5xl mb-3">🚧</div>
        <div className="text-sm">Coming soon — this view is part of the next sprint.</div>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState({ name: "dashboard", project: null });
  const [sidebar, setSidebar] = useState("dashboard");

  const handleSidebar = (id) => {
    setSidebar(id);
    if (id === "dashboard" || id === "projects") {
      setView({ name: "dashboard", project: null });
    } else if (id === "new") {
      setView({ name: "wizard", project: null });
    } else {
      setView({ name: "placeholder", id });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((o) => !o)} />
      <div className="flex flex-1 min-h-0">
        {sidebarOpen && <Sidebar active={sidebar} onSelect={handleSidebar} />}
        <main className="flex-1 overflow-y-auto">
          {view.name === "dashboard" && (
            <Dashboard
              onNewAnalysis={() => {
                setSidebar("new");
                setView({ name: "wizard", project: null });
              }}
              onContinue={(project) => {
                setSidebar("new");
                setView({ name: "wizard", project });
              }}
            />
          )}
          {view.name === "wizard" && (
            <Wizard
              initialProject={view.project}
              onExit={() => {
                setSidebar("dashboard");
                setView({ name: "dashboard", project: null });
              }}
            />
          )}
          {view.name === "placeholder" && (
            <PlaceholderView
              title={
                {
                  competitive: "Competitive Map",
                  personas: "Persona Library",
                  reports: "Reports",
                  settings: "Settings",
                }[view.id]
              }
              hint="This module is part of the next ValueForge release."
            />
          )}
        </main>
      </div>
    </div>
  );
}
