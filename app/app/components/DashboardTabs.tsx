import type { ActiveTab } from "../types";

type DashboardTabsProps = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
};

const tabs: { id: ActiveTab; label: string }[] = [
  { id: "summary", label: "📊 Resumen" },
  { id: "transactions", label: "💸 Movimientos" },
  { id: "budget", label: "📋 Presupuestos" },
  { id: "history", label: "📈 Histórico" },
  { id: "goals", label: "🎯 Objetivos" },
];

export function DashboardTabs({
  activeTab,
  setActiveTab,
}: DashboardTabsProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`rounded-2xl border px-5 py-3 font-medium transition ${
            activeTab === tab.id
              ? "border-cyan-500 bg-cyan-500 text-white"
              : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}