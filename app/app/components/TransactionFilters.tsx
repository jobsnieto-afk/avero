import type {
  TransactionFilter,
  TransactionSort,
} from "../types";

type TransactionFiltersProps = {
  filter: TransactionFilter;
  setFilter: (filter: TransactionFilter) => void;
  search: string;
  setSearch: (search: string) => void;
  sortBy: TransactionSort;
  setSortBy: (sortBy: TransactionSort) => void;
};

export function TransactionFilters({
  filter,
  setFilter,
  search,
  setSearch,
  sortBy,
  setSortBy,
}: TransactionFiltersProps) {
  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          ["all", "Todos"],
          ["income", "Ingresos"],
          ["expense", "Gastos"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value as TransactionFilter)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              filter === value
                ? "bg-white text-slate-950"
                : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar movimientos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500"
      />

      <div className="mt-4 flex items-center gap-3">
        <p className="text-sm text-slate-400">
          Ordenar por:
        </p>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as TransactionSort)}
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white"
        >
          <option value="date">Fecha</option>
          <option value="amount">Importe</option>
          <option value="category">Categoría</option>
        </select>
      </div>
    </>
  );
}