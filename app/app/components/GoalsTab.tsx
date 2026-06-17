type GoalsTabProps = {
  emergencyFundTarget: number;
  savingsTarget: number;
  investmentTarget: number;
  futureTarget: number;
  formatMoney: (value: number) => string;
};

export function GoalsTab({
  emergencyFundTarget,
  savingsTarget,
  investmentTarget,
  futureTarget,
  formatMoney,
}: GoalsTabProps) {
  return (
    <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
        Objetivos financieros
      </p>

      <h2 className="mt-2 text-xl font-semibold">
        Metas futuras
      </h2>

      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span>Fondo emergencia</span>
          <span>{formatMoney(emergencyFundTarget)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Ahorro</span>
          <span>{formatMoney(savingsTarget)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Inversión</span>
          <span>{formatMoney(investmentTarget)}</span>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              Total futuro objetivo
            </span>

            <span className="font-semibold text-white">
              {formatMoney(futureTarget)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}