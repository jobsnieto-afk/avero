import type { SubmitEventHandler } from "react";

import { TransactionForm } from "./TransactionForm";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionList } from "./TransactionList";

import type {
  ActionStatus,
  CategoryStyles,
  SaveStatus,
  Transaction,
  TransactionFilter,
  TransactionSort,
  TransactionType,
} from "../types";

type TransactionsTabProps = {
  type: TransactionType;
  setType: (type: TransactionType) => void;

  amount: string;
  setAmount: (amount: string) => void;

  category: string;
  setCategory: (category: string) => void;

  note: string;
  setNote: (note: string) => void;

  transactionDate: string;
  setTransactionDate: (date: string) => void;

  saveStatus: SaveStatus;
  actionStatus: ActionStatus;

  filter: TransactionFilter;
  setFilter: (filter: TransactionFilter) => void;

  search: string;
  setSearch: (search: string) => void;

  sortBy: TransactionSort;
  setSortBy: (sortBy: TransactionSort) => void;

  sortedTransactions: Transaction[];

  categoryStyles: CategoryStyles;
  formatMoney: (value: number) => string;

  editingId: number | null;
  setEditingId: (id: number | null) => void;

  editingAmount: string;
  setEditingAmount: (amount: string) => void;

  editingNote: string;
  setEditingNote: (note: string) => void;

  pendingDeleteId: number | null;
  setPendingDeleteId: (id: number | null) => void;

  handleAddTransaction: SubmitEventHandler<HTMLFormElement>;
  handleUpdateTransaction: (id: number) => void;
  handleDeleteTransaction: (id: number) => void;
};

export function TransactionsTab({
  type,
  setType,
  amount,
  setAmount,
  category,
  setCategory,
  note,
  setNote,
  transactionDate,
  setTransactionDate,
  saveStatus,
  actionStatus,
  filter,
  setFilter,
  search,
  setSearch,
  sortBy,
  setSortBy,
  sortedTransactions,
  categoryStyles,
  formatMoney,
  editingId,
  setEditingId,
  editingAmount,
  setEditingAmount,
  editingNote,
  setEditingNote,
  pendingDeleteId,
  setPendingDeleteId,
  handleAddTransaction,
  handleUpdateTransaction,
  handleDeleteTransaction,
}: TransactionsTabProps) {
  return (
    <div className="mt-10 space-y-8">
      <TransactionForm
        type={type}
        setType={setType}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        note={note}
        setNote={setNote}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        saveStatus={saveStatus}
        categories={Object.keys(categoryStyles)}
        categoryStyles={categoryStyles}
        onSubmit={handleAddTransaction}
      />

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Movimientos recientes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Consulta, filtra, edita o elimina tus movimientos.
            </p>
          </div>

          {actionStatus === "updated" && (
            <p className="text-sm text-emerald-300">
              Movimiento actualizado
            </p>
          )}

          {actionStatus === "deleted" && (
            <p className="text-sm text-rose-300">
              Movimiento eliminado
            </p>
          )}

          {actionStatus === "error" && (
            <p className="text-sm text-rose-300">
              Ha ocurrido un error
            </p>
          )}
        </div>

        <TransactionFilters
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <TransactionList
          transactions={sortedTransactions}
          categoryStyles={categoryStyles}
          formatMoney={formatMoney}
          editingId={editingId}
          setEditingId={setEditingId}
          editingAmount={editingAmount}
          setEditingAmount={setEditingAmount}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
          pendingDeleteId={pendingDeleteId}
          setPendingDeleteId={setPendingDeleteId}
          handleUpdateTransaction={handleUpdateTransaction}
          handleDeleteTransaction={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}