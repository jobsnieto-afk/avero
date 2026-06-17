type SummaryCardsProps = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  formatMoney: (value: number) => string;
};

export function SummaryCards({
  totalIncome,
  totalExpenses,
  balance,
  formatMoney,
}: SummaryCardsProps) {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-slate-400">
          Ingresos
        </p>

        <h2 className="mt-4 text-3xl font-semibold tracking-tight xl:text-3xl">
          {formatMoney(totalIncome)}
        </h2>
      </div>

      <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-slate-400">
          Gastos
        </p>

        <h2 className="mt-4 text-3xl font-semibold tracking-tight xl:text-3xl">
          {formatMoney(totalExpenses)}
        </h2>
      </div>

      <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
        <p className="text-sm text-slate-400">
          Balance
        </p>

        <h2
          className={`mt-4 text-3xl font-semibold tracking-tight xl:text-3xl ${
            balance >= 0 ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {formatMoney(balance)}
        </h2>
      </div>
    </div>
  );
}