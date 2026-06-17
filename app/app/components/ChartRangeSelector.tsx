import type { ChartRange } from "../types";

type ChartRangeSelectorProps = {
  chartRange: ChartRange;
  setChartRange: (range: ChartRange) => void;
};

const chartRanges: { value: ChartRange; label: string }[] = [
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "12m", label: "12M" },
  { value: "all", label: "Todo" },
];

export function ChartRangeSelector({
  chartRange,
  setChartRange,
}: ChartRangeSelectorProps) {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
      {chartRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => setChartRange(range.value)}
          className={`rounded-full px-3 py-1 text-xs transition ${
            chartRange === range.value
              ? "bg-white text-slate-950"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}