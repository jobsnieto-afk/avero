import { ChartRangeSelector } from "./ChartRangeSelector";
import type { ChartRange } from "../types";

type ChartPoint = {
  label: string;
  income: number;
  expenses: number;
};

type FinancialChartProps = {
  chartData: ChartPoint[];
  chartRange: ChartRange;
  setChartRange: (range: ChartRange) => void;
  formatMoney: (value: number) => string;
};

export function FinancialChart({
  chartData,
  chartRange,
  setChartRange,
  formatMoney,
}: FinancialChartProps) {
  const chartWidth = 900;
  const chartHeight = 260;
  const paddingX = 48;
  const paddingY = 32;

  const maxValue = Math.max(
    ...chartData.flatMap((item) => [item.income, item.expenses]),
    1
  );

  const getX = (index: number) => {
    if (chartData.length <= 1) return paddingX;

    return (
      paddingX +
      (index / (chartData.length - 1)) * (chartWidth - paddingX * 2)
    );
  };

  const getY = (value: number) => {
    return (
      chartHeight -
      paddingY -
      (value / maxValue) * (chartHeight - paddingY * 2)
    );
  };

  const incomePath = chartData
    .map((item, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${getX(index)} ${getY(item.income)}`;
    })
    .join(" ");

  const expensesPath = chartData
    .map((item, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${getX(index)} ${getY(item.expenses)}`;
    })
    .join(" ");

  return (
    <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
            Evolución financiera
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Ingresos vs gastos
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Visualiza cómo se comporta tu flujo de dinero en el tiempo.
          </p>
        </div>

        <ChartRangeSelector
          chartRange={chartRange}
          setChartRange={setChartRange}
        />
      </div>

      {chartData.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">
          Todavía no hay datos suficientes para mostrar el gráfico.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-[280px] min-w-[760px] w-full"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((line) => {
              const y =
                paddingY +
                line * (chartHeight - paddingY * 2);

              return (
                <line
                  key={line}
                  x1={paddingX}
                  x2={chartWidth - paddingX}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              );
            })}

            <path
              d={incomePath}
              fill="none"
              stroke="rgb(110, 231, 183)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={expensesPath}
              fill="none"
              stroke="rgb(251, 113, 133)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {chartData.map((item, index) => (
              <g key={`${item.label}-${index}`}>
                <circle
                  cx={getX(index)}
                  cy={getY(item.income)}
                  r="3"
                  fill="rgb(110, 231, 183)"
                />

                <circle
                  cx={getX(index)}
                  cy={getY(item.expenses)}
                  r="3"
                  fill="rgb(251, 113, 133)"
                />

                {index % 3 === 0 || chartData.length <= 6 ? (
                  <text
                    x={getX(index)}
                    y={chartHeight - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fill="rgb(148, 163, 184)"
                  >
                    {item.label}
                  </text>
                ) : null}
              </g>
            ))}
          </svg>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="h-3 w-3 rounded-full bg-emerald-300" />
          Ingresos
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="h-3 w-3 rounded-full bg-rose-300" />
          Gastos
        </div>

        <div className="ml-auto text-slate-500">
          Máximo: {formatMoney(maxValue)}
        </div>
      </div>
    </div>
  );
}