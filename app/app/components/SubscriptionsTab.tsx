import type { SubscriptionItem } from "../types";

type SubscriptionsTabProps = {
  subscriptions: SubscriptionItem[];
  totalSubscriptions: number;

  subscriptionName: string;
  subscriptionAmount: string;
  subscriptionBillingDay: string;

  setSubscriptionName: (value: string) => void;
  setSubscriptionAmount: (value: string) => void;
  setSubscriptionBillingDay: (value: string) => void;

  handleAddSubscription: (event: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteSubscription: (subscriptionId: number) => void;

  formatMoney: (value: number) => string;
};

export function SubscriptionsTab({
  subscriptions,
  totalSubscriptions,
  subscriptionName,
  subscriptionAmount,
  subscriptionBillingDay,
  setSubscriptionName,
  setSubscriptionAmount,
  setSubscriptionBillingDay,
  handleAddSubscription,
  handleDeleteSubscription,
  formatMoney,
}: SubscriptionsTabProps) {
  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">
          Suscripciones
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          Gastos recurrentes
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Añade tus pagos mensuales para entender cuánto dinero se va cada mes
          en servicios, software y herramientas.
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-sm text-slate-400">Total mensual estimado</p>
          <p className="mt-2 text-4xl font-semibold text-white">
            {formatMoney(totalSubscriptions)}
          </p>
        </div>

        <form onSubmit={handleAddSubscription} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Nombre
            </label>
            <input
              value={subscriptionName}
              onChange={(event) => setSubscriptionName(event.target.value)}
              placeholder="Netflix, Spotify, ChatGPT..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Importe mensual
              </label>
              <input
                value={subscriptionAmount}
                onChange={(event) =>
                  setSubscriptionAmount(event.target.value)
                }
                placeholder="20"
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Día de cobro
              </label>
              <input
                value={subscriptionBillingDay}
                onChange={(event) =>
                  setSubscriptionBillingDay(event.target.value)
                }
                placeholder="18"
                type="number"
                min="1"
                max="31"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Añadir suscripción
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
              Lista activa
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Tus pagos mensuales
            </h3>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300">
            {subscriptions.length} activas
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {subscriptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-center">
              <p className="text-sm text-slate-400">
                Todavía no has añadido ninguna suscripción.
              </p>
            </div>
          ) : (
            subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4"
              >
                <div>
                  <p className="font-medium text-white">
                    {subscription.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Día {subscription.billing_day} de cada mes
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-cyan-300">
                    {formatMoney(Number(subscription.amount))}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubscription(subscription.id)}
                    className="rounded-full border border-rose-400/20 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-400/10"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}