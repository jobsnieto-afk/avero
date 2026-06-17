import type {
  CategoryStyles,
  FiscalInsight,
  FiscalYearSummary,
} from "../types";


type HistoryTabProps = {
  incomeGrowth: number;
  expenseGrowth: number;
  balanceGrowth: number;
  fiscalInsight: FiscalInsight;
  topFiscalExpenses: [string, number][];
  fiscalSummary: FiscalYearSummary[];
  latestFiscalYear: FiscalYearSummary;
  categoryStyles: CategoryStyles;
  formatMoney: (value: number) => string;
};

export function HistoryTab({
  incomeGrowth,
  expenseGrowth,
  balanceGrowth,
  fiscalInsight,
  topFiscalExpenses,
  fiscalSummary,
  latestFiscalYear,
  categoryStyles,
  formatMoney,
}: HistoryTabProps) {
  return (
    <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300">
            Años fiscales
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Comparativa anual
          </h2>
        </div>

        <p className="text-sm text-slate-400">
          UK · Abril - Marzo
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-xs text-slate-400">Ingresos</p>

          <p
            className={`mt-1 font-semibold ${
              incomeGrowth >= 0 ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {incomeGrowth >= 0 ? "▲" : "▼"} {Math.abs(incomeGrowth).toFixed(1)}%
          </p>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
          <p className="text-xs text-slate-400">Gastos</p>

          <p
            className={`mt-1 font-semibold ${
              expenseGrowth <= 0 ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {expenseGrowth >= 0 ? "▲" : "▼"} {Math.abs(expenseGrowth).toFixed(1)}%
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
          <p className="text-xs text-slate-400">Beneficio</p>

          <p
            className={`mt-1 font-semibold ${
              balanceGrowth >= 0 ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {balanceGrowth >= 0 ? "▲" : "▼"} {Math.abs(balanceGrowth).toFixed(1)}%
          </p>
        </div>
      </div>

      <div
        className={`mt-4 rounded-2xl border p-4 ${
          fiscalInsight.tone === "warning"
            ? "border-amber-500/20 bg-amber-500/5"
            : "border-emerald-500/20 bg-emerald-500/5"
        }`}
      >
        <p
          className={`font-medium ${
            fiscalInsight.tone === "warning"
              ? "text-amber-300"
              : "text-emerald-300"
          }`}
        >
          {fiscalInsight.tone === "warning" ? "⚠️" : "✅"}{" "}
          {fiscalInsight.message}
        </p>

        <p className="mt-2 text-sm text-slate-400">
          {fiscalInsight.detail}
        </p>
      </div>

      {topFiscalExpenses.length > 0 && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-medium">
            Top gastos del último año fiscal
          </p>

          <div className="mt-4 space-y-3">
            {topFiscalExpenses.map(([category, amount]) => (
              <div key={category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{categoryStyles[category]?.icon || "📦"}</span>

                    <span className="capitalize text-slate-300">
                      {category}
                    </span>
                  </div>

                  <span className="font-medium">
                    {formatMoney(amount)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-rose-400"
                    style={{
                      width: `${(amount / topFiscalExpenses[0][1]) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {fiscalSummary.map((year) => (
          <div
            key={year.label}
            className={`rounded-2xl border p-4 ${
              year.label === latestFiscalYear.label
                ? "border-cyan-500/30 bg-cyan-500/5"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">{year.label}</p>

              <p
                className={`text-sm font-semibold ${
                  year.balance >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {formatMoney(year.balance)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
              <div>
                <p>Ingresos</p>
                <p className="mt-1 font-medium text-emerald-300">
                  {formatMoney(year.income)}
                </p>
              </div>

              <div>
                <p>Gastos</p>
                <p className="mt-1 font-medium text-rose-300">
                  {formatMoney(year.expenses)}
                </p>
              </div>

              <div>
                <p>Margen</p>
                <p className="mt-1 font-medium text-cyan-300">
                  {year.margin.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}