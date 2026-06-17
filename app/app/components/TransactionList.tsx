import type {
  CategoryStyles,
  Transaction,
} from "../types";

type TransactionListProps = {
  transactions: Transaction[];
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

  handleUpdateTransaction: (id: number) => void;
  handleDeleteTransaction: (id: number) => void;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TransactionList({
  transactions,
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
  handleUpdateTransaction,
  handleDeleteTransaction,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <p className="mt-6 text-sm text-slate-500">
        No hay movimientos para mostrar.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {transactions.map((transaction) => {
        const style = categoryStyles[transaction.category];

        return (
          <div
            key={transaction.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            {editingId === transaction.id ? (
              <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto] md:items-center">
                <input
                  type="number"
                  step="0.01"
                  value={editingAmount}
                  onChange={(event) => setEditingAmount(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                />

                <input
                  type="text"
                  value={editingNote}
                  onChange={(event) => setEditingNote(event.target.value)}
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateTransaction(transaction.id)}
                    className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-semibold text-slate-950"
                  >
                    Guardar
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      style?.bg || "bg-slate-500/10"
                    }`}
                  >
                    <span>{style?.icon || "📦"}</span>
                  </div>

                  <div>
                    <p className="font-medium capitalize">
                      {transaction.category}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {transaction.note || "Sin nota"} ·{" "}
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p
                    className={`font-semibold ${
                      transaction.type === "income"
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatMoney(Number(transaction.amount))}
                  </p>

                  {pendingDeleteId === transaction.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="rounded-xl bg-rose-400 px-3 py-2 text-xs font-semibold text-slate-950"
                      >
                        Confirmar
                      </button>

                      <button
                        onClick={() => setPendingDeleteId(null)}
                        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(transaction.id);
                          setEditingAmount(String(transaction.amount));
                          setEditingNote(transaction.note ?? "");
                        }}
                        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 hover:text-white"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => setPendingDeleteId(transaction.id)}
                        className="rounded-xl border border-rose-500/20 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10"
                      >
                        Borrar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}