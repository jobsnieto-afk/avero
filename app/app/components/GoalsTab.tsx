type GoalsTabProps = {
  emergencyFundTarget: number;

  monthlySavingsTarget: number;
  monthlyInvestmentTarget: number;
  monthlyGoalsTarget: number;

  currentSavings: number;
  currentInvestment: number;
  savingsProgress: number;
  investmentProgress: number;

  longTermSavingsTarget: number;
  longTermInvestmentTarget: number;
  longTermTarget: number;

  previousMonthLabel: string;
  previousMonthIncome: number;

  formatMoney: (value: number) => string;
};

export function GoalsTab({
  emergencyFundTarget,
  monthlySavingsTarget,
  monthlyInvestmentTarget,
  monthlyGoalsTarget,
  currentSavings,
  currentInvestment,
  savingsProgress,
  investmentProgress,
  longTermSavingsTarget,
  longTermInvestmentTarget,
  longTermTarget,
  previousMonthLabel,
  previousMonthIncome,
  formatMoney,
}: GoalsTabProps) {
  return (
    <div className="mt-10 space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          Objetivos financieros
        </p>

        <h2 className="mt-2 text-3xl font-semibold">
          Planifica sin perder flexibilidad
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          Como tus ingresos pueden variar mes a mes, AVERO separa tus objetivos
          en dos niveles: metas mensuales dinámicas basadas en el mes anterior y
          metas de largo plazo para construir estabilidad financiera.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                Objetivo mensual dinámico
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                Basado en tus ingresos recientes
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Calculado usando los ingresos de {previousMonthLabel}:{" "}
                <span className="font-semibold text-white">
                  {formatMoney(previousMonthIncome)}
                </span>
                .
              </p>
            </div>

            <span className="text-3xl">🔁</span>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Ahorro recomendado</p>

                  <p className="mt-1 text-xs text-slate-500">
                    Reserva mensual sugerida según tu presupuesto.
                  </p>
                </div>

                <p className="text-xl font-semibold text-emerald-300">
                  {formatMoney(monthlySavingsTarget)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
                <div>
                  <p>Objetivo</p>

                  <p className="mt-1 font-medium text-white">
                    {formatMoney(monthlySavingsTarget)}
                  </p>
                </div>

                <div>
                  <p>Aportado</p>

                  <p className="mt-1 font-medium text-emerald-300">
                    {formatMoney(currentSavings)}
                  </p>
                </div>

                <div>
                  <p>Progreso</p>

                  <p className="mt-1 font-medium text-cyan-300">
                    {savingsProgress.toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-400"
                  style={{ width: `${savingsProgress}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Inversión recomendada</p>

                  <p className="mt-1 text-xs text-slate-500">
                    Cantidad orientativa para crecimiento a largo plazo.
                  </p>
                </div>

                <p className="text-xl font-semibold text-violet-300">
                  {formatMoney(monthlyInvestmentTarget)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
                <div>
                  <p>Objetivo</p>

                  <p className="mt-1 font-medium text-white">
                    {formatMoney(monthlyInvestmentTarget)}
                  </p>
                </div>

                <div>
                  <p>Aportado</p>

                  <p className="mt-1 font-medium text-violet-300">
                    {formatMoney(currentInvestment)}
                  </p>
                </div>

                <div>
                  <p>Progreso</p>

                  <p className="mt-1 font-medium text-cyan-300">
                    {investmentProgress.toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-400"
                  style={{ width: `${investmentProgress}%` }}
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-300">
                  Total recomendado este mes
                </p>

                <p className="text-2xl font-semibold text-white">
                  {formatMoney(monthlyGoalsTarget)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/5 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                Fondo de emergencia
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                6 meses de gastos
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Tu colchón de seguridad se calcula como 6 meses de gastos
                mensuales, con un mínimo base de £3,000.
              </p>
            </div>

            <span className="text-3xl">🛡️</span>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">
              Objetivo recomendado
            </p>

            <p className="mt-3 text-4xl font-semibold text-cyan-300">
              {formatMoney(emergencyFundTarget)}
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Fórmula: gastos mensuales × 6, respetando un mínimo de £3,000.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-violet-500/20 bg-violet-500/5 p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-violet-300">
              Objetivos a largo plazo
            </p>

            <h3 className="mt-2 text-2xl font-semibold">
              Construcción patrimonial
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Estos objetivos son fijos por ahora. Más adelante deberían poder
              editarse desde una sección de configuración o metas financieras.
            </p>
          </div>

          <span className="text-3xl">🎯</span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">
              Ahorro largo plazo
            </p>

            <p className="mt-3 text-2xl font-semibold text-emerald-300">
              {formatMoney(longTermSavingsTarget)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">
              Inversión largo plazo
            </p>

            <p className="mt-3 text-2xl font-semibold text-violet-300">
              {formatMoney(longTermInvestmentTarget)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">
              Total objetivo futuro
            </p>

            <p className="mt-3 text-2xl font-semibold text-white">
              {formatMoney(longTermTarget)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}