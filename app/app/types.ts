export type ActiveTab =
  | "summary"
  | "transactions"
  | "budget"
  | "history"
  | "goals";

export type TransactionType = "income" | "expense";

export type TransactionFilter = "all" | "income" | "expense";

export type TransactionSort = "date" | "amount" | "category";

export type ChartRange = "1m" | "3m" | "6m" | "12m" | "all";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type ActionStatus = "idle" | "updated" | "deleted" | "error";

export type Transaction = {
  id: number;
  type: TransactionType;
  amount: number;
  category: string;
  note: string | null;
  transaction_date: string;
};

export type CategoryStyle = {
  bg: string;
  text: string;
  icon: string;
};

export type CategoryStyles = Record<string, CategoryStyle>;

export type PersonalBudgetItem = {
  name: string;
  percentage: number;
  limit: number;
  spent: number;
  remaining: number;
  usedPercentage: number;
};

export type FiscalYearSummary = {
  label: string;
  income: number;
  expenses: number;
  balance: number;
  margin: number;
};

export type FiscalInsight = {
  tone: "warning" | "positive";
  message: string;
  detail: string;
};

export type SubscriptionItem = {
  name: string;
  amount: number;
  day: string | number;
};

export type ChartItem = {
  month: string;
  income: number;
  expenses: number;
  balance: number;
};

export type BudgetAlert = {
  category: string;
  percentage: number;
};

