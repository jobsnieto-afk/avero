"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type Transaction = {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  note: string | null;
  transaction_date: string;
  created_at: string;
};


const categoryStyles: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  gasolina: {
    bg: "bg-amber-500/10",
    text: "text-amber-200",
    icon: "⛽",
  },
  comida: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-200",
    icon: "🍔",
  },
  tarjetas: {
    bg: "bg-rose-500/10",
    text: "text-rose-200",
    icon: "💳",
  },
  suscripciones: {
    bg: "bg-violet-500/10",
    text: "text-violet-200",
    icon: "📺",
  },
  coche: {
    bg: "bg-blue-500/10",
    text: "text-blue-200",
    icon: "🚗",
  },
  casa: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-200",
    icon: "🏠",
  },
  negocio: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-200",
    icon: "🏢",
  },
  impuestos: {
    bg: "bg-orange-500/10",
    text: "text-orange-200",
    icon: "📄",
  },
  ocio: {
    bg: "bg-pink-500/10",
    text: "text-pink-200",
    icon: "🎮",
  },
  otros: {
    bg: "bg-slate-500/10",
    text: "text-slate-200",
    icon: "📦",
  },
};

export default function AppPage() {

   // ============================
  // ESTADOS DE AUTENTICACIÓN
  // ============================
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");

     // ============================
  // ESTADOS DE MOVIMIENTOS
  // ============================

    const [transactions, setTransactions] = useState<Transaction[]>([]);


  // ============================
  // ESTADOS DE FILTROS
  // ============================

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
    const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date");


  // ============================
  // ESTADOS DEL FORMULARIO
  // ============================

    const [type, setType] = useState<"income" | "expense">("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("gasolina");
    const [note, setNote] = useState("");
    
    // ============================
  // ESTADOS DE UX
  // ============================

    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [actionStatus, setActionStatus] = useState<"idle" | "updated" | "deleted" | "error">("idle");
    const [transactionDate, setTransactionDate] = useState(
      new Date().toISOString().split("T")[0]
    );

    const [editingId, setEditingId] = useState<number | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [editingAmount, setEditingAmount] = useState("");
    const [editingNote, setEditingNote] = useState("");



  // ============================
// FILTROS Y BÚSQUEDAS
// ============================

    const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
    filter === "all" || transaction.type === filter;

  const matchesSearch =
    transaction.category.toLowerCase().includes(search.toLowerCase()) ||
    transaction.note?.toLowerCase().includes(search.toLowerCase());

  return matchesFilter && matchesSearch;
});

const sortedTransactions = [...filteredTransactions].sort((a, b) => {
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

// ============================
// AUTENTICACIÓN
// ============================


    useEffect(() => {
  async function loadUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email || "");
      setUser(user);


      await loadTransactions(user.id);
  
    } catch (error) {
      console.error("APP LOAD USER ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  }

  loadUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      window.location.href = "/login";
      return;
    }

    setUser(session.user);
    setEmail(session.user.email || "");

    //await loadTransactions(session.user.id);
    setIsLoading(false);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  // ============================
  // CARGA DE MOVIMIENTOS
  // ============================

  async function loadTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("id, type, amount, category, note, transaction_date, created_at")
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false });

  if (error) {
    console.error("LOAD TRANSACTIONS ERROR:", error);
    setTransactions([]);
    return;
  }

  setTransactions(data || []);
}

// ============================
// CRUD DE MOVIMIENTOS
// ============================

  async function handleAddTransaction(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!user) return;

  const numericAmount = Number(amount);

if (!numericAmount || numericAmount <= 0) {
  alert("Introduce una cantidad válida.");
  return;
}

  setSaveStatus("saving");
  
  const { data, error } = await supabase
  .from("transactions")
  .insert({
    user_id: user.id,
    type,
    amount: numericAmount,
    category,
    note,
    transaction_date: transactionDate,
  })
  .select();

  if (error) {
    console.error(error);
    alert("No se pudo guardar el movimiento.");
    return;
  }

  setAmount("");
  setNote("");
  setTransactionDate(new Date().toISOString().split("T")[0]);
  setTransactions((prev) => [
  {
    id: Date.now(),
    type,
    amount: numericAmount,
    category,
    note,
    transaction_date: transactionDate,
    created_at: new Date().toISOString(),
  },
  ...prev,
]);

await loadTransactions(user.id);
  setSaveStatus("saved");

  setTimeout(() => {
  setSaveStatus("idle");
}, 4000);
}

async function handleDeleteTransaction(transactionId: number) {
  if (!user) return;

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    setSaveStatus("error");
    return;
  }

  await loadTransactions(user.id);
  setActionStatus("deleted");

setTimeout(() => {
  setActionStatus("idle");
  }, 3000);
}

async function handleUpdateTransaction(transactionId: number) {
  if (!user) return;

  const { error } = await supabase
    .from("transactions")
    .update({
      amount: Number(editingAmount),
      note: editingNote,
    })
    .eq("id", transactionId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    alert("No se pudo actualizar.");
    return;
  }

  setEditingId(null);
  await loadTransactions(user.id);

  setActionStatus("updated");

    setTimeout(() => {
    setActionStatus("idle");
}, 3000);
}
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ============================
// CÁLCULOS DEL DASHBOARD
// ============================


const totalIncome = transactions
  .filter((transaction) => transaction.type === "income")
  .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

const totalExpenses = transactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

const balance = totalIncome - totalExpenses;
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

// ============================
// RESÚMENES MENSUALES
// ============================

const monthlyTransactions = transactions.filter((transaction) => {
  const date = new Date(transaction.transaction_date);

  return (
    date.getMonth() === currentMonth &&
    date.getFullYear() === currentYear
  );
});

const monthlyIncome = monthlyTransactions
  .filter((transaction) => transaction.type === "income")
  .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

const monthlyExpenses = monthlyTransactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

const totalMovements = monthlyTransactions.length;

// ============================
// GASTOS POR CATEGORÍA
// ============================


// ============================
// GASTOS POR CATEGORÍA
// Agrupa todos los gastos por categoría.
// Ejemplo: gasolina + gasolina = total gasolina.
// ============================

const expensesByCategory = transactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((acc, transaction) => {
    const category = transaction.category;

    acc[category] = (acc[category] || 0) + Number(transaction.amount);

    return acc;
  }, {} as Record<string, number>);

// ============================
// PRESUPUESTOS
// ============================

const budgets = {
  gasolina: 400,
  comida: 300,
  suscripciones: 80,
  tarjetas: 250,
};

const subscriptions = [
  {
    name: "Netflix",
    amount: 10.99,
    day: 5,
  },
  {
    name: "Spotify",
    amount: 11.99,
    day: 12,
  },
  {
    name: "ChatGPT",
    amount: 20,
    day: 18,
  },
  {
    name: "Software",
    amount: 49,
    day: 25,
  },
];

const totalSubscriptions = subscriptions.reduce(
  (sum, subscription) => sum + subscription.amount,
  0
);

if (isLoading) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
      <p className="text-slate-400">Cargando AVERO... v2</p>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300">
              Dashboard privado
            </p>

            <h1 className="mt-2 text-4xl font-semibold">
              Bienvenido a AVERO
            </h1>

            <p className="mt-2 text-slate-400">
              {email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3 xl:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm text-slate-400">
              Ingresos
            </p>

            <h2 className="mt-4 text-4xl font-semibold">
              £{totalIncome.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm text-slate-400">
              Gastos
            </p>

            <h2 className="mt-4 text-4xl font-semibold">
              £{totalExpenses.toFixed(2)}
            </h2>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm text-slate-400">
              Balance
            </p>

            <h2 className="mt-4 text-4xl font-semibold text-emerald-300">
              £{balance.toFixed(2)}
            </h2>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-1">
  
        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
          <p className="whitespace-nowrap text-sm text-slate-400">
            Gastos este mes
          </p>

          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-rose-300">
            £{monthlyExpenses.toFixed(2)}
          </h3>
        </div>

        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
          <p className="whitespace-nowrap text-sm text-slate-400">
            Ingresos este mes
          </p>

          <h3 className="mt-4 text-3xl font-semibold tracking-tight text-emerald-300">
            £{monthlyIncome.toFixed(2)}
          </h3>
        </div>

        <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
          <p className="whitespace-nowrap text-sm text-slate-400">
            Movimientos este mes
          </p>

          <h3 className="mt-4 text-3xl font-semibold tracking-tight">
            {totalMovements}
          </h3>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Presupuestos
          </h2>

          <p className="text-sm text-slate-400">
            Este mes
          </p>
          </div>


  <div className="mt-6 space-y-5">
    {Object.entries(budgets).map(([category, limit]) => {
      const spent = monthlyTransactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category === category
        )
        .reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount),
          0
        );

      const percentage = Math.min(
        (spent / limit) * 100,
        100
      );

      return (
        <div key={category}>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>
                {categoryStyles[category]?.icon || "📦"}
              </span>

              <p className="capitalize">
                {category}
              </p>
            </div>

            <p className="text-sm text-slate-400">
              £{spent.toFixed(0)} / £{limit}
            </p>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${
                percentage > 85
                  ? "bg-rose-400"
                  : percentage > 60
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div> 
      );
    })}
  </div>
</div>

<div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
  <h2 className="text-2xl font-semibold">
    Gastos por categoría
  </h2>

  <div className="mt-6 space-y-4">
    {Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => (
        <div
          key={category}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">
              {categoryStyles[category]?.icon || "📦"}
            </span>

            <span className="capitalize">
              {category}
            </span>
          </div>

          <span className="font-medium">
            £{amount.toFixed(2)}
          </span>
        </div>
      ))}
  </div>
</div>

<div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold">
      Suscripciones
    </h2>

    <p className="text-sm text-slate-400">
      £{totalSubscriptions.toFixed(2)} / mes
    </p>
  </div>

  <div className="mt-6 grid gap-4 md:grid-cols-2">
    {subscriptions.map((subscription) => (
      <div
        key={subscription.name}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="flex items-center justify-between">
          <p className="font-medium">
            {subscription.name}
          </p>

          <p className="font-semibold text-violet-300">
            £{subscription.amount.toFixed(2)}
          </p>
        </div>

        <p className="mt-2 text-sm text-slate-400">
          Se cobra el día {subscription.day} de cada mes
        </p>
      </div>
    ))}
  </div>
</div>
      </div>
    </div>
        <form
  onSubmit={handleAddTransaction}
  className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
>
<div className="flex items-center justify-between">
  <div>
    <p className="text-sm uppercase tracking-[0.2em] text-violet-300">
      Nuevo registro
    </p>

    <h2 className="mt-2 text-2xl font-semibold">
      Añadir movimiento
    </h2>
  </div>

  <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-400">
    Manual
  </div>
</div>
  <div className="mt-6 grid gap-4 md:grid-cols-2">
    <select
      value={type}
      onChange={(e) => setType(e.target.value as "income" | "expense")}
      className="rounded-xl bg-white px-4 py-3 text-slate-950"
    >
      <option value="expense">Gasto</option>
      <option value="income">Ingreso</option>
    </select>

    <input
      type="number"
      placeholder="Cantidad"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      className="rounded-xl bg-white px-4 py-3 text-slate-950"
      required
    />

    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="rounded-xl bg-white px-4 py-3 text-slate-950"
    >
      <option value="gasolina">Gasolina</option>
      <option value="comida">Comida</option>
      <option value="tarjetas">Tarjetas</option>
      <option value="suscripciones">Suscripciones</option>
      <option value="coche">Coche</option>
      <option value="casa">Casa</option>
      <option value="negocio">Negocio</option>
      <option value="impuestos">Impuestos</option>
      <option value="ocio">Ocio</option>
      <option value="otros">Otros</option>
    </select>
      <input
  type="date"
  value={transactionDate}
  onChange={(e) => setTransactionDate(e.target.value)}
  className="rounded-xl bg-white px-4 py-3 text-slate-950"
      />
    <input
      type="text"
      placeholder="Nota"
      value={note}
      onChange={(e) => setNote(e.target.value)}
      className="rounded-xl bg-white px-4 py-3 text-slate-950"
    />
    
  </div>

  <button
  type="submit"
  disabled={!user || !amount}
  className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
  >
  Guardar movimiento
  </button>

  {saveStatus === "saving" && (
  <p className="mt-4 text-sm text-slate-400">
    Guardando movimiento...
  </p>
)}

{saveStatus === "saved" && (
  <p className="mt-4 text-sm text-emerald-300">
    Movimiento guardado correctamente.
  </p>
)}

{saveStatus === "error" && (
  <p className="mt-4 text-sm text-rose-300">
    No se pudo guardar el movimiento.
  </p>
)}
  
</form>

{actionStatus === "updated" && (
  <p className="mb-4 text-sm text-emerald-300">
    Movimiento actualizado correctamente.
  </p>
)}

{actionStatus === "deleted" && (
  <p className="mb-4 text-sm text-rose-300">
    Movimiento eliminado correctamente.
  </p>
)}

<div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
  <h2 className="text-2xl font-semibold">Movimientos recientes</h2>
    <div className="mt-4 flex flex-wrap gap-2">
  {[
    ["all", "Todos"],
    ["income", "Ingresos"],
    ["expense", "Gastos"],
  ].map(([value, label]) => (
    <button
      key={value}
      onClick={() => setFilter(value as "all" | "income" | "expense")}
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
  <p className="text-sm text-slate-400">Ordenar por:</p>

  <select
  value={sortBy}
  onChange={(e) =>
    setSortBy(e.target.value as "date" | "amount" | "category")
  }
  className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white"
>
  <option value="date">Fecha</option>
  <option value="amount">Importe</option>
  <option value="category">Categoría</option>
</select>
</div>

  <div className="mt-6 space-y-3">{
  sortedTransactions.map((transaction) => (      
  <div
      key={transaction.id}
      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4"
    >
      <div>
        {editingId === transaction.id ? (
          <div className="space-y-2">
            <input
              type="number"
              value={editingAmount}
              onChange={(e) => setEditingAmount(e.target.value)}
              className="rounded-lg bg-white px-3 py-2 text-slate-950"
            />

            <input
              type="text"
              value={editingNote}
              onChange={(e) => setEditingNote(e.target.value)}
              className="rounded-lg bg-white px-3 py-2 text-slate-950"
            />

            <button
              onClick={() => handleUpdateTransaction(transaction.id)}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950"
            >
              Guardar
            </button>
            <button
            onClick={() => {
              setEditingId(null);
              setEditingAmount("");
              setEditingNote("");
            }}
            className="ml-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 transition hover:text-white"
          >
            Cancelar
</button>
          </div>
        ) : (
          <>
            <div
  className={`inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-sm backdrop-blur-sm ${
    categoryStyles[transaction.category]?.bg ||
    "bg-slate-500/10"
  } ${
    categoryStyles[transaction.category]?.text ||
    "text-slate-200"
  }`}
>
  <span className="text-base leading-none">
    {categoryStyles[transaction.category]?.icon || "📦"}
  </span>

  <span className="capitalize font-medium">
    {transaction.category}
  </span>
</div>

            <p className="text-sm text-slate-400">
              {transaction.note || "Sin nota"} ·{" "}
              {formatDate(transaction.transaction_date)}
            </p>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <p
          className={`font-semibold ${
            transaction.type === "income"
              ? "text-emerald-300"
              : "text-rose-300"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}£
          {Number(transaction.amount).toFixed(2)}
        </p>

        <button
          onClick={() => {
            setEditingId(transaction.id);
            setEditingAmount(String(transaction.amount));
            setEditingNote(transaction.note || "");
          }}
          className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:text-white"
        >
          Editar
        </button>

        {pendingDeleteId === transaction.id ? (
  <div className="flex items-center gap-2">
    <button
      onClick={() => handleDeleteTransaction(transaction.id)}
      className="rounded-lg bg-rose-400 px-3 py-1 text-xs font-medium text-slate-950"
    >
      Confirmar
    </button>

    <button
      onClick={() => setPendingDeleteId(null)}
      className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:text-white"
    >
      Cancelar
    </button>
  </div>
) : (
  <button
    onClick={() => setPendingDeleteId(transaction.id)}
    className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:text-white"
  >
    Borrar
  </button>
)}
      </div>
    </div>
  ))}

    {sortedTransactions.length === 0 && (  
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
    <p className="text-lg font-medium text-white">
      Todavía no hay movimientos
    </p>

    <p className="mt-2 text-sm text-slate-400">
      Añade tu primer ingreso o gasto para empezar a construir tu historial financiero.
    </p>
  </div>
)}
</div>
</div>
      </div>
    </main>
  );
}