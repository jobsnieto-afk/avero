import type {
  CategoryStyles,
  PersonalBudgetItem,
} from "../types";

type BudgetTabProps = {
  personalBudget: PersonalBudgetItem[];
  previousMonthLabel: string;
  previousMonthIncome: number;
  expensesByCategory: Record<string, number>;
  categoryStyles: CategoryStyles;
  formatMoney: (value: number) => string;
};

export function BudgetTab({
  personalBudget,
  previousMonthLabel,
  previousMonthIncome,
  expensesByCategory,
  categoryStyles,
  formatMoney,
}: BudgetTabProps) {
  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Presupuestos
          </h2>

          <div className="text-right">
            <p className="text-sm text-slate-400">
              Este mes
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Basado en ingresos de {previousMonthLabel} (
              {formatMoney(previousMonthIncome)})
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {personalBudget.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.percentage}% de tus ingresos mensuales
                  </p>
                </div>

                <p
                  className={`text-sm font-medium ${
                    item.remaining >= 0
                      ? "text-emerald-300"
                      : "text-rose-300"
                  }`}
                >
                  {formatMoney(item.remaining)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
                <div>
                  <p>Objetivo</p>
                  <p className="mt-1 font-medium text-white">
                    {formatMoney(item.limit)}
                  </p>
                </div>

                <div>
                  <p>Gastado</p>
                  <p className="mt-1 font-medium text-rose-300">
                    {formatMoney(item.spent)}
                  </p>
                </div>

                <div>
                  <p>Disponible</p>
                  <p
                    className={`mt-1 font-medium ${
                      item.remaining >= 0
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }`}
                  >
                    {formatMoney(item.remaining)}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${
                    item.usedPercentage >= 100
                      ? "bg-rose-400"
                      : item.usedPercentage >= 75
                      ? "bg-amber-400"
                      : "bg-violet-400"
                  }`}
                  style={{
                    width: `${item.usedPercentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <h2 className="text-2xl font-semibold">
          Gastos por categoría
        </h2>

        <div className="mt-6 space-y-4">
          {Object.entries(expensesByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([category, amount]) => (
              <div
                key={category}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {categoryStyles[category]?.icon || "📦"}
                  </span>

                  <span className="capitalize">
                    {category}
                  </span>
                </div>

                <span className="font-medium">
                  {formatMoney(amount)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}