import type { Transaction } from "../types";

export function calculateExpensesByCategory(
  transactions: Transaction[]
): Record<string, number> {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Record<string, number>>((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + Number(transaction.amount);

      return acc;
    }, {});
}

export function getTopExpenseCategory(
  expensesByCategory: Record<string, number>
): [string, number] | undefined {
  return Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];
}