import type {
  Transaction,
  TransactionFilter,
  TransactionSort,
} from "../types";

type GetSortedTransactionsParams = {
  transactions: Transaction[];
  filter: TransactionFilter;
  search: string;
  sortBy: TransactionSort;
};

export function getSortedTransactions({
  transactions,
  filter,
  search,
  sortBy,
}: GetSortedTransactionsParams) {
  const normalizedSearch = search.toLowerCase().trim();

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      filter === "all" || transaction.type === filter;

    const matchesSearch =
      normalizedSearch.length === 0 ||
      transaction.category.toLowerCase().includes(normalizedSearch) ||
      transaction.note?.toLowerCase().includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  return [...filteredTransactions].sort((a, b) => {
    if (sortBy === "amount") {
      return Number(b.amount) - Number(a.amount);
    }

    if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }

    return (
      new Date(b.transaction_date).getTime() -
      new Date(a.transaction_date).getTime()
    );
  });
}