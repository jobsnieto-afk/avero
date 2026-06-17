import type { SubscriptionItem } from "../types";

type SubscriptionsCardProps = {
  subscriptions: SubscriptionItem[];
  totalSubscriptions: number;
  formatMoney: (value: number) => string;
};

export function SubscriptionsCard({
  subscriptions,
  totalSubscriptions,
  formatMoney,
}: SubscriptionsCardProps) {
  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Suscripciones
        </h2>

        <p className="text-sm text-slate-400">
          {formatMoney(totalSubscriptions)} / mes
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.name}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {subscription.name}
              </p>

              <p className="font-semibold text-violet-300">
                {formatMoney(subscription.amount)}
              </p>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Se cobra el día {subscription.day} de cada mes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}