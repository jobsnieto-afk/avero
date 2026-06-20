import type {
  CategoryStyles,
  FiscalInsight,
  FiscalYearSummary,
  Transaction,
} from "../types";

type BuildFiscalSummaryParams = {
  transactions: Transaction[];
  categoryStyles: CategoryStyles;
};

function getFiscalYearLabel(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;

  return `${startYear}/${String(endYear).slice(-2)}`;
}

function calculateGrowth(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
}

export function buildFiscalSummary({
  transactions,
}: BuildFiscalSummaryParams) {
  const grouped = transactions.reduce<
    Record<
      string,
      {
        label: string;
        income: number;
        expenses: number;
        balance: number;
      }
    >
  >((acc, transaction) => {
    const date = new Date(transaction.transaction_date);
    const label = getFiscalYearLabel(date);

    if (!acc[label]) {
      acc[label] = {
        label,
        income: 0,
        expenses: 0,
        balance: 0,
      };
    }

    const amount = Number(transaction.amount);

    if (transaction.type === "income") {
      acc[label].income += amount;
      acc[label].balance += amount;
    } else {
      acc[label].expenses += amount;
      acc[label].balance -= amount;
    }

    return acc;
  }, {});

  const fiscalSummary: FiscalYearSummary[] = Object.values(grouped)
    .map((year) => ({
      ...year,
      margin:
        year.income > 0
          ? (year.balance / year.income) * 100
          : 0,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const latestFiscalYear =
    fiscalSummary[fiscalSummary.length - 1] ?? {
      label: "Sin datos",
      income: 0,
      expenses: 0,
      balance: 0,
      margin: 0,
    };

  const previousFiscalYear =
    fiscalSummary[fiscalSummary.length - 2] ?? {
      label: "Sin datos",
      income: 0,
      expenses: 0,
      balance: 0,
      margin: 0,
    };

  const incomeGrowth = calculateGrowth(
    latestFiscalYear.income,
    previousFiscalYear.income
  );

  const expenseGrowth = calculateGrowth(
    latestFiscalYear.expenses,
    previousFiscalYear.expenses
  );

  const balanceGrowth = calculateGrowth(
    latestFiscalYear.balance,
    previousFiscalYear.balance
  );

  const fiscalInsight: FiscalInsight =
    expenseGrowth > incomeGrowth
      ? {
          tone: "warning",
          message: "Los gastos están creciendo más rápido que los ingresos.",
          detail:
            "Revisa tus principales categorías de gasto para evitar que el margen se reduzca.",
        }
      : {
          tone: "positive",
          message: "La evolución financiera es saludable.",
          detail:
            "Tus ingresos crecen al mismo ritmo o por encima de tus gastos.",
        };

  const latestFiscalExpensesByCategory = transactions
    .filter((transaction) => {
      const label = getFiscalYearLabel(new Date(transaction.transaction_date));

      return (
        label === latestFiscalYear.label &&
        transaction.type === "expense"
      );
    })
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + Number(transaction.amount);

      return acc;
    }, {});

  const topFiscalExpenses = Object.entries(latestFiscalExpensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    fiscalSummary,
    latestFiscalYear,
    previousFiscalYear,
    incomeGrowth,
    expenseGrowth,
    balanceGrowth,
    fiscalInsight,
    topFiscalExpenses,
  };
}