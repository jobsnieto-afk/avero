import type { ChartRange, Transaction } from "../types";

type BuildChartItemsParams = {
  transactions: Transaction[];
  chartRange: ChartRange;
};

function getRangeStartDate(chartRange: ChartRange) {
  const now = new Date();

  if (chartRange === "all") {
    return null;
  }

  const monthsMap: Record<Exclude<ChartRange, "all">, number> = {
    "1m": 1,
    "3m": 3,
    "6m": 6,
    "12m": 12,
  };

  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - monthsMap[chartRange]);

  return startDate;
}

function formatMonthLabel(date: Date) {
  return date.toLocaleDateString("es-ES", {
    month: "short",
    year: "2-digit",
  });
}

export function buildChartItems({
  transactions,
  chartRange,
}: BuildChartItemsParams) {
  const rangeStartDate = getRangeStartDate(chartRange);

  const filteredTransactions = transactions.filter((transaction) => {
    if (!rangeStartDate) {
      return true;
    }

    return new Date(transaction.transaction_date) >= rangeStartDate;
  });

  const groupedByMonth = filteredTransactions.reduce<
    Record<
      string,
      {
        month: string;
        date: Date;
        income: number;
        expenses: number;
        balance: number;
      }
    >
  >((acc, transaction) => {
    const date = new Date(transaction.transaction_date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: formatMonthLabel(date),
        date,
        income: 0,
        expenses: 0,
        balance: 0,
      };
    }

    const amount = Number(transaction.amount);

    if (transaction.type === "income") {
      acc[monthKey].income += amount;
      acc[monthKey].balance += amount;
    } else {
      acc[monthKey].expenses += amount;
      acc[monthKey].balance -= amount;
    }

    return acc;
  }, {});

  return Object.values(groupedByMonth).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
}