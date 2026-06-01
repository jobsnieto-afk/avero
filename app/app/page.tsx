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
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState("");

    const [transactions, setTransactions] = useState<Transaction[]>([]);


    const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
    const [type, setType] = useState<"income" | "expense">("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("gasolina");
    const [note, setNote] = useState("");
    const [transactionDate, setTransactionDate] = useState(
      new Date().toISOString().split("T")[0]
    );

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingAmount, setEditingAmount] = useState("");
    const [editingNote, setEditingNote] = useState("");


    const filteredTransactions = transactions.filter((transaction) => {
      if (filter === "all") return true;
      return transaction.type === filter;
}); 
    useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email || "");
      setUser(user);
      loadTransactions(user.id);
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }
  async function loadTransactions(userId: string) {
  const { data, error } = await supabase
    .from("transactions")
    .select("id, type, amount, category, note, transaction_date")
    .eq("user_id", userId)
    .order("transaction_date", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setTransactions(data || []);
}

  async function handleAddTransaction(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!user) return;

  const { data, error } = await supabase
  .from("transactions")
  .insert({
    user_id: user.id,
    type,
    amount: Number(amount),
    category,
    note,
    transaction_date: transactionDate,
  })
  .select();

console.log("TRANSACTION RESULT:", { data, error });

  if (error) {
    console.error(error);
    alert("No se pudo guardar el movimiento.");
    return;
  }

  setAmount("");
  setNote("");
  setTransactionDate(new Date().toISOString().split("T")[0]);
  await loadTransactions(user.id);
  alert("Movimiento guardado.");
}

async function handleDeleteTransaction(transactionId: number) {
  if (!user) return;

  const confirmed = window.confirm("¿Seguro que quieres borrar este movimiento?");
  if (!confirmed) return;

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", transactionId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    alert("No se pudo borrar el movimiento.");
    return;
  }

  await loadTransactions(user.id);
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
}
const totalIncome = transactions
  .filter((transaction) => transaction.type === "income")
  .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

const totalExpenses = transactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

const balance = totalIncome - totalExpenses;
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

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
  <h2 className="text-2xl font-semibold">Añadir movimiento</h2>

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
    className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950"
  >
    Guardar movimiento
  </button>
  
</form>
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

  <div className="mt-6 space-y-3">
    {filteredTransactions.map((transaction) => (    
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
              {transaction.note || "Sin nota"} · {transaction.transaction_date}
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

        <button
          onClick={() => handleDeleteTransaction(transaction.id)}
          className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-400 transition hover:text-white"
        >
          Borrar
        </button>
      </div>
    </div>
  ))}

    {filteredTransactions.length === 0 && (
      <p className="text-slate-400">
      Todavía no hay movimientos.
    </p>
  )}
</div>
</div>
      </div>
    </main>
  );
}