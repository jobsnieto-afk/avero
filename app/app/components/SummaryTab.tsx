import type {
  BudgetAlert,
  ChartItem,
  ChartRange,
  SubscriptionItem,
} from "../types";

import { FinancialChart } from "./FinancialChart";
import { SummaryCards } from "./SummaryCards";
import { SubscriptionsCard } from "./SubscriptionsCard";

type SummaryTabProps = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;

  monthlyIncome: number;
  monthlyExpenses: number;
  totalMovements: number;

  chartItems: ChartItem[];
  chartRange: ChartRange;
  setChartRange: (range: ChartRange) => void;

  averageIncome: number;
  averageExpenses: number;
  averageBalance: number;

  periodIncome: number;
  periodExpenses: number;
  savingsRate: string;

  budgetAlerts: BudgetAlert[];
  topCategory: [string, number] | undefined;

  subscriptions: SubscriptionItem[];
  totalSubscriptions: number;

  formatMoney: (value: number) => string;
};

export function SummaryTab({
  totalIncome,
  totalExpenses,
  balance,
  monthlyIncome,
  monthlyExpenses,
  totalMovements,
  chartItems,
  chartRange,
  setChartRange,
  averageIncome,
  averageExpenses,
  averageBalance,
  periodIncome,
  periodExpenses,
  savingsRate,
  budgetAlerts,
  topCategory,
  subscriptions,
  totalSubscriptions,
  formatMoney,
}: SummaryTabProps) {
  const chartData = chartItems.map((item) => ({
    label: item.month,
    income: item.income,
    expenses: item.expenses,
  }));

  const periodBalance = chartItems.reduce(
    (sum, item) => sum + item.balance,
    0
  );

  return (
    <>
      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        formatMoney={formatMoney}
      />

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
          <p className="text-sm text-slate-400">
            Gastos este mes
          </p>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-rose-300 xl:text-3xl">
            {formatMoney(monthlyExpenses)}
          </h3>
        </div>

        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
          <p className="text-sm text-slate-400">
            Ingresos este mes
          </p>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-emerald-300 xl:text-3xl">
            {formatMoney(monthlyIncome)}
          </h3>
        </div>

        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
          <p className="text-sm text-slate-400">
            Movimientos este mes
          </p>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight xl:text-3xl">
            {totalMovements}
          </h3>
        </div>
      </div>

      <FinancialChart
        chartData={chartData}
        chartRange={chartRange}
        setChartRange={setChartRange}
        formatMoney={formatMoney}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-400">
            Ingresos del periodo
          </p>

          <p className="mt-2 text-xl font-semibold text-emerald-300">
            {formatMoney(periodIncome)}
          </p>

          <div className="mt-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Promedio mensual
            </p>

            <p className="text-sm font-medium text-slate-300">
              {formatMoney(averageIncome)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-400">
            Gastos del periodo
          </p>

          <p className="mt-2 text-xl font-semibold text-rose-300">
            {formatMoney(periodExpenses)}
          </p>

          <div className="mt-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Promedio mensual
            </p>

            <p className="text-sm font-medium text-slate-300">
              {formatMoney(averageExpenses)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-slate-400">
            Balance del periodo
          </p>

          <p className="mt-2 text-xl font-semibold text-cyan-300">
            {formatMoney(periodBalance)}
          </p>

          <div className="mt-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Promedio mensual
            </p>

            <p className="text-sm font-medium text-slate-300">
              {formatMoney(averageBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm text-slate-400">
          Resumen del periodo
        </p>

        <p
          className={`mt-2 font-medium ${
            periodBalance >= 0 ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {periodBalance >= 0
            ? "Balance positivo. Tus ingresos superan tus gastos en este periodo."
            : "Atención. Tus gastos superan tus ingresos en este periodo."}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-300">
          Insights de AVERO
        </p>

        <div className="mt-4 space-y-3 text-sm">
          <p>
            💰 Has generado{" "}
            <span className="font-semibold text-emerald-300">
              {formatMoney(periodIncome)}
            </span>{" "}
            durante el periodo analizado.
          </p>

          <p>
            💸 Has gastado{" "}
            <span className="font-semibold text-rose-300">
              {formatMoney(periodExpenses)}
            </span>
            .
          </p>

          <p>
            📈 Tu tasa de ahorro es de{" "}
            <span className="font-semibold text-cyan-300">
              {savingsRate}%
            </span>
            .
          </p>

          {budgetAlerts.map((alert) => (
            <p key={alert.category}>
              {alert.percentage >= 100 ? "🚨" : "⚠️"}{" "}
              {alert.percentage >= 100
                ? `Has superado el presupuesto de ${alert.category}.`
                : `Has consumido el ${alert.percentage.toFixed(0)} % del presupuesto de ${alert.category}.`}
            </p>
          ))}

          {topCategory && (
            <p>
              🎯 Tu mayor gasto ha sido{" "}
              <span className="font-semibold">
                {topCategory[0]}
              </span>{" "}
              con {formatMoney(topCategory[1])}.
            </p>
          )}
        </div>
      </div>

      <SubscriptionsCard
        subscriptions={subscriptions}
        totalSubscriptions={totalSubscriptions}
        formatMoney={formatMoney}
      />
    </>
  );
}