import type { SubmitEventHandler } from "react";
import type {
  CategoryStyles,
  SaveStatus,
  TransactionType,
} from "../types";

type TransactionFormProps = {
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

  categories: string[];
  categoryStyles: CategoryStyles;

  onSubmit: SubmitEventHandler<HTMLFormElement>;
};

export function TransactionForm({
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
  categories,
  categoryStyles,
  onSubmit,
}: TransactionFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">
            Nuevo movimiento
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Registra un ingreso o gasto manualmente.
          </p>
        </div>

        {saveStatus === "saved" && (
          <p className="text-sm text-emerald-300">
            Movimiento guardado
          </p>
        )}

        {saveStatus === "error" && (
          <p className="text-sm text-rose-300">
            Error al guardar
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => setType("income")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            type === "income"
              ? "bg-emerald-400 text-slate-950"
              : "border border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          Ingreso
        </button>

        <button
          type="button"
          onClick={() => setType("expense")}
          className={`rounded-full px-5 py-2 text-sm font-medium transition ${
            type === "expense"
              ? "bg-rose-400 text-slate-950"
              : "border border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          Gasto
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">
            Importe
          </label>

          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">
            Categoría
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {categoryStyles[item]?.icon || "📦"} {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400">
            Fecha
          </label>

          <input
            type="date"
            value={transactionDate}
            onChange={(event) => setTransactionDate(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>

        <div>
          <label className="text-sm text-slate-400">
            Nota
          </label>

          <input
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ej: Seguro coche, cliente, gasolina..."
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saveStatus === "saving"}
        className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saveStatus === "saving" ? "Guardando..." : "Añadir movimiento"}
      </button>
    </form>
  );
}