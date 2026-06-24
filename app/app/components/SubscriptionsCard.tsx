import type { SubscriptionItem } from "../types";

type SubscriptionsCardProps = {
  subscriptions: SubscriptionItem[];
  totalSubscriptions: number;
  annualSubscriptions: number;
  subscriptionsExpensePercentage: number;
  monthlyBalanceAfterSubscriptions: number;
  formatMoney: (value: number) => string;
};

export function SubscriptionsCard({
  subscriptions,
  totalSubscriptions,
  annualSubscriptions,
  subscriptionsExpensePercentage,
  monthlyBalanceAfterSubscriptions,
  formatMoney,
}: SubscriptionsCardProps) {
  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
            Suscripciones
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Gastos recurrentes
          </h2>
        </div>

        <p className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
          {subscriptions.length} activas
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">Mensual</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatMoney(totalSubscriptions)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">Anual</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatMoney(annualSubscriptions)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">Sobre gastos</p>
          <p className="mt-2 text-lg font-semibold text-white">
            {subscriptionsExpensePercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-slate-400">
        Después de gastos y suscripciones, tu margen mensual estimado es{" "}
        <span className="font-semibold text-white">
          {formatMoney(monthlyBalanceAfterSubscriptions)}
        </span>
        .
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-medium text-white">
                {subscription.name}
              </p>

              <p className="font-semibold text-violet-300">
                {formatMoney(Number(subscription.amount))}
              </p>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Se cobra el día {subscription.billing_day} de cada mes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}