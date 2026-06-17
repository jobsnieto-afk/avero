import type {
  PersonalBudgetItem,
  Transaction,
} from "../types";

type CalculateGoalsParams = {
  monthlyExpenses: number;
  personalBudget: PersonalBudgetItem[];
  monthlyTransactions: Transaction[];
};

export function calculateGoals({
  monthlyExpenses,
  personalBudget,
  monthlyTransactions,
}: CalculateGoalsParams) {
  const emergencyFundTarget = Math.max(monthlyExpenses * 6, 3000);

  const monthlySavingsTarget =
    personalBudget.find((item) => item.name === "Ahorro")?.limit || 0;

  const monthlyInvestmentTarget =
    personalBudget.find((item) => item.name === "Inversión")?.limit || 0;

  const monthlyGoalsTarget =
    monthlySavingsTarget + monthlyInvestmentTarget;

  const longTermSavingsTarget = 10000;
  const longTermInvestmentTarget = 20000;

  const longTermTarget =
    emergencyFundTarget + longTermSavingsTarget + longTermInvestmentTarget;

  const currentSavings = monthlyTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.category === "ahorro"
    )
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const currentInvestment = monthlyTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.category === "inversion"
    )
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const savingsProgress =
    monthlySavingsTarget > 0
      ? Math.min((currentSavings / monthlySavingsTarget) * 100, 100)
      : 0;

  const investmentProgress =
    monthlyInvestmentTarget > 0
      ? Math.min((currentInvestment / monthlyInvestmentTarget) * 100, 100)
      : 0;

  return {
    emergencyFundTarget,
    monthlySavingsTarget,
    monthlyInvestmentTarget,
    monthlyGoalsTarget,
    longTermSavingsTarget,
    longTermInvestmentTarget,
    longTermTarget,
    currentSavings,
    currentInvestment,
    savingsProgress,
    investmentProgress,
  };
}