import type {
  PersonalBudgetItem,
  Transaction,
} from "../types";

type BudgetDefinition = {
  name: string;
  percentage: number;
  categories: string[];
};

type CalculatePersonalBudgetParams = {
  previousMonthIncome: number;
  monthlyTransactions: Transaction[];
};

const budgetDefinitions: BudgetDefinition[] = [
  {
    name: "Necesidades básicas",
    percentage: 50,
    categories: ["comida", "casa", "coche", "gasolina", "impuestos"],
  },
  {
    name: "Ahorro",
    percentage: 15,
    categories: ["ahorro"],
  },
  {
    name: "Inversión",
    percentage: 15,
    categories: ["inversion"],
  },
  {
    name: "Educación",
    percentage: 10,
    categories: ["educacion"],
  },
  {
    name: "Entretenimiento",
    percentage: 10,
    categories: ["ocio", "suscripciones"],
  },
];

export function calculatePersonalBudget({
  previousMonthIncome,
  monthlyTransactions,
}: CalculatePersonalBudgetParams): PersonalBudgetItem[] {
  return budgetDefinitions.map((definition) => {
    const limit = previousMonthIncome * (definition.percentage / 100);

    const spent = monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          definition.categories.includes(transaction.category)
      )
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const remaining = limit - spent;

    const usedPercentage =
      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

    return {
      name: definition.name,
      percentage: definition.percentage,
      limit,
      spent,
      remaining,
      usedPercentage,
    };
  });
}

type CalculateBudgetAlertsParams = {
  budgets: Record<string, number>;
  monthlyTransactions: Transaction[];
};

export function calculateBudgetAlerts({
  budgets,
  monthlyTransactions,
}: CalculateBudgetAlertsParams) {
  return Object.entries(budgets)
    .map(([category, limit]) => {
      const spent = monthlyTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category === category
        )
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

      const percentage = limit > 0 ? (spent / limit) * 100 : 0;

      return {
        category,
        spent,
        limit,
        percentage,
      };
    })
    .filter((item) => item.percentage >= 75);
}