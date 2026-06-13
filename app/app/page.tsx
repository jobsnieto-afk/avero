"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/formatters";

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
  ahorro: {
  bg: "bg-emerald-500/10",
  text: "text-emerald-200",
  icon: "🏦",
},
  inversion: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-200",
    icon: "📈",
  },
  educacion: {
    bg: "bg-violet-500/10",
    text: "text-violet-200",
    icon: "🎓",
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

  const [currency] = useState<"GBP" | "EUR" | "USD" | "COP" | "MXN" | "ARS">("GBP");
  const formatMoney = (value: number) =>
  formatCurrency(value, currency);

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
  // GRÁFICO PRINCIPAL
  // 6 meses, 12 meses o histórico
  // ============================

    const [chartRange, setChartRange] = useState<"1m" | "3m" | "6m" | "12m" | "all">("6m");

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

// ============================
// DATOS DEL GRÁFICO PRINCIPAL
// Agrupa ingresos, gastos y balance por mes.
// ============================

const monthsToShow =
  chartRange === "1m"
    ? 1
    : chartRange === "3m"
    ? 3
    : chartRange === "6m"
    ? 6
    : chartRange === "12m"
    ? 12
    : 999;

const chartTransactions =
  chartRange === "all"
    ? transactions
    : transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_date);
        const limitDate = new Date();

        limitDate.setMonth(limitDate.getMonth() - monthsToShow);

        return transactionDate >= limitDate;
      });

const chartData = chartTransactions.reduce(
  (acc, transaction) => {
    const date = new Date(transaction.transaction_date);
    const monthKey = date.toLocaleDateString("es-ES", {
      month: "short",
      year: "2-digit",
    });

    if (!acc[monthKey]) {
  acc[monthKey] = {
    date: new Date(date.getFullYear(), date.getMonth(), 1),
    income: 0,
    expenses: 0,
  };
}

    if (transaction.type === "income") {
      acc[monthKey].income += Number(transaction.amount);
    } else {
      acc[monthKey].expenses += Number(transaction.amount);
    }

    return acc;
  },
  {} as Record<
  string,
  { date: Date; income: number; expenses: number }
>
);

const chartItems = Object.entries(chartData)
  .map(([month, values]) => ({
    month,
    date: values.date,
    income: values.income,
    expenses: values.expenses,
    balance: values.income - values.expenses,
  }))
  .sort((a, b) => a.date.getTime() - b.date.getTime());

  // ============================
// INSIGHTS DE AVERO
// ============================

const periodIncome = chartItems.reduce(
  (sum, item) => sum + item.income,
  0
);

const periodExpenses = chartItems.reduce(
  (sum, item) => sum + item.expenses,
  0
);

const periodBalance = periodIncome - periodExpenses;

const monthsInPeriod = chartItems.length || 1;

const averageIncome =
  periodIncome / monthsInPeriod;

const averageExpenses =
  periodExpenses / monthsInPeriod;

const averageBalance =
  (periodIncome - periodExpenses) /
  monthsInPeriod;

const savingsRate = periodIncome > 0
    ? ((periodBalance / periodIncome) * 100).toFixed(1)
    : "0";


// ============================
// RESÚMENES MENSUALES
// ============================
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const previousMonthDate = new Date();

previousMonthDate.setMonth(
  previousMonthDate.getMonth() - 1
);

const previousMonth =
  previousMonthDate.getMonth();

const previousYear =
  previousMonthDate.getFullYear();

const previousMonthLabel =
  previousMonthDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

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

const previousMonthIncome = transactions
  .filter((transaction) => {
    const date = new Date(
      transaction.transaction_date
    );

    return (
      transaction.type === "income" &&
      date.getMonth() === previousMonth &&
      date.getFullYear() === previousYear
    );
  })
  .reduce(
    (sum, transaction) =>
      sum + Number(transaction.amount),
    0
  );

const monthlyExpenses = monthlyTransactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

const totalMovements = monthlyTransactions.length;

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

  const topCategory =
  Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])[0];

    

// ============================
// PRESUPUESTOS
// ============================

const budgets: Record<string, number> = {
  gasolina: 400,
  comida: 300,
  suscripciones: 80,
  tarjetas: 250,
  negocio: 1000,
  otros: 500,
  coche: 300,
  casa: 1200,
  impuestos: 500,
  ocio: 200,
};

// ============================
// PRESUPUESTO PERSONAL
// Método porcentual
// ============================

const personalBudgetPercentages: Record<string, number> = {
  "Necesidades básicas": 50,
  Ahorro: 15,
  Inversión: 15,
  Educación: 10,
  Entretenimiento: 10,
};

const personalBudgetCategories: Record<string, string[]> = {
  "Necesidades básicas": [
    "comida",
    "casa",
    "coche",
    "gasolina",
    "impuestos",
  ],

  Ahorro: ["ahorro"],

  Inversión: ["inversion"],

  Educación: ["educacion"],

  Entretenimiento: [
    "ocio",
    "suscripciones",
  ],
};

const personalBudget = Object.entries(personalBudgetPercentages).map(
  ([name, percentage]) => {
    const limit = (previousMonthIncome * percentage) / 100;

    const linkedCategories = personalBudgetCategories[name] || [];

    const spent = monthlyTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          linkedCategories.includes(transaction.category)
      )
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const remaining = limit - spent;

    const usedPercentage =
      limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

    return {
      name,
      percentage,
      limit,
      spent,
      remaining,
      usedPercentage,
    };
  }
);

const savingsTarget =
  personalBudget.find((item) => item.name === "Ahorro")?.limit || 0;

const investmentTarget =
  personalBudget.find((item) => item.name === "Inversión")?.limit || 0;

const futureTarget = savingsTarget + investmentTarget;

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
  savingsTarget > 0 ? Math.min((currentSavings / savingsTarget) * 100, 100) : 0;

const investmentProgress =
  investmentTarget > 0
    ? Math.min((currentInvestment / investmentTarget) * 100, 100)
    : 0;

const budgetAlerts = Object.entries(budgets)
  .map(([category, limit]) => {
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

    const percentage = (spent / limit) * 100;

    return {
      category,
      spent,
      limit,
      percentage,
    };
  })
  .filter((item) => item.percentage >= 75);

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
      <p className="text-slate-400">Cargando Avero, tu app de finanzas personal y empresarial</p>
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


        {/*
        
============================
    RESUMEN GENERAL
============================ */}

<div className="mt-12 grid gap-6 md:grid-cols-3">
  <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
    <p className="text-sm text-slate-400">
      Ingresos
    </p>

    <h2 className="mt-4 text-3xl font-semibold tracking-tight xl:text-3xl">
      {formatMoney(totalIncome)}
    </h2>
  </div>

  <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
    <p className="text-sm text-slate-400">
      Gastos
    </p>

    <h2 className="mt-4 text-3xl font-semibold tracking-tight xl:text-3xl">
      {formatMoney(totalExpenses)}
    </h2>
  </div>

  <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
    <p className="text-sm text-slate-400">
      Balance
    </p>

    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-emerald-300 xl:text-3xl">
      {formatMoney(balance)}
    </h2>
  </div>
</div>

{/* ============================
    RESUMEN MENSUAL
============================ */}

<div className="mt-6 grid gap-6 md:grid-cols-3">
  <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
    <p className="text-sm text-slate-400">
      Gastos este mes
    </p>

    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-rose-300 xl:text-3xl">
      {formatMoney(monthlyExpenses)}
    </h3>
  </div>

  <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
    <p className="text-sm text-slate-400">
      Ingresos este mes
    </p>

    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-emerald-300 xl:text-3xl">
      {formatMoney(monthlyIncome)}
    </h3>
  </div>

  <div className="min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.03] p-7">
    <p className="text-sm text-slate-400">
      Movimientos este mes
    </p>

    <h3 className="mt-4 text-2xl font-semibold tracking-tight xl:text-3xl">
      {totalMovements}
    </h3>
  </div>
</div>


<div className="mt-10 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
  <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm uppercase tracking-[0.2em] text-violet-300">
        Evolución financiera
      </p>

      <h2 className="mt-3 text-3xl font-semibold">
        Ingresos · Gastos
      </h2>
    </div>

    <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
      {[
  ["1m", "1M"],
  ["3m", "3M"],
  ["6m", "6M"],
  ["12m", "12M"],
  ["all", "Todo"],
].map(([value, label]) => (
        <button
          key={value}
          onClick={() => setChartRange(value as "1m" | "3m" | "6m" | "12m" | "all")}
          className={`rounded-full px-3 py-1 text-xs transition ${
            chartRange === value
              ? "bg-white text-slate-950"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  </div>

  <div className="mt-10 h-64">
  {chartItems.length === 0 ? (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-white/10 text-sm text-slate-400">
      Añade movimientos para ver tu evolución financiera.
    </div>
  ) : (
    <svg
      viewBox="0 0 600 220"
      className="h-full w-full overflow-visible"
      preserveAspectRatio="none"
    >
      {[0, 1, 2, 3].map((line) => (
        <line
          key={line}
          x1="0"
          x2="600"
          y1={line * 55}
          y2={line * 55}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}

      {(() => {
        const maxValue = Math.max(
          ...chartItems.map((item) =>
            Math.max(item.income, item.expenses)
          ),
          1
        );

        const getX = (index: number) =>
          chartItems.length === 1
            ? 300
            : (index / (chartItems.length - 1)) * 600;

        const getY = (value: number) =>
          210 - (value / maxValue) * 190;

        const incomePath = chartItems
          .map((item, index) => {
            const command = index === 0 ? "M" : "L";
            return `${command} ${getX(index)} ${getY(item.income)}`;
          })
          .join(" ");

        const expensesPath = chartItems
          .map((item, index) => {
            const command = index === 0 ? "M" : "L";
            return `${command} ${getX(index)} ${getY(item.expenses)}`;
          })
          .join(" ");

        return (
          <>
            <path
              d={incomePath}
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={expensesPath}
              fill="none"
              stroke="#fb7185"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />


            {chartItems.map((item, index) => (
              <g key={item.month}>
                <circle
                  cx={getX(index)}
                  cy={getY(item.income)}
                  r="3"
                  fill="#34d399"
                />

                <circle
                  cx={getX(index)}
                  cy={getY(item.expenses)}
                  r="3"
                  fill="#fb7185"
                />

                {index % 4 === 0 && (
                <text
                  x={getX(index)}
                  y="218"
                  textAnchor="middle"
                  className="fill-slate-500 text-xs"
                >
                  {item.month}
                </text>
)}
              </g>
            ))}
          </>
        );
      })()}
    </svg>
  )}
</div>

<div className="mt-6 grid gap-4 sm:grid-cols-3">
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <p className="text-xs text-slate-400">
      Ingresos del periodo
    </p>

    <p className="mt-2 text-xl font-semibold text-emerald-300">
      {formatMoney(
        chartItems.reduce((sum, item) => sum + item.income, 0), currency
      )}
    </p>

    <div className="mt-3">
    <p className="text-[11px] uppercase tracking-wide text-slate-500">
      Promedio mensual
    </p>

    <p className="text-sm font-medium text-slate-300">
      {formatMoney(averageIncome, currency)}
    </p>
</div>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <p className="text-xs text-slate-400">
      Gastos del periodo
    </p>

    <p className="mt-2 text-xl font-semibold text-rose-300">
      {formatMoney(
        chartItems.reduce((sum, item) => sum + item.expenses, 0),
      )}
    </p>
    <div className="mt-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        Promedio mensual
      </p>

      <p className="text-sm font-medium text-slate-300">
        {formatMoney(averageExpenses, currency)}
      </p>
    </div>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <p className="text-xs text-slate-400">
      Balance del periodo
    </p>

    <p className="mt-2 text-xl font-semibold text-cyan-300">
      {formatMoney(
        chartItems.reduce((sum, item) => sum + item.balance, 0), 
        currency
      )}
    </p>
    <div className="mt-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        Promedio mensual
      </p>

      <p className="text-sm font-medium text-slate-300">
        {formatMoney(averageBalance, currency)}
      </p>
    </div>
  </div>
</div>

  <div className="mt-6 flex items-center gap-6 text-sm text-slate-400">
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      Ingresos
    </div>

    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-rose-400" />
      Gastos
    </div>

    
  </div>
  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
  <p className="text-sm text-slate-400">
    Resumen del periodo
  </p>

  <p
    className={`mt-2 font-medium ${
      chartItems.reduce(
        (sum, item) => sum + item.balance,
        0
      ) >= 0
        ? "text-emerald-300"
        : "text-rose-300"
    }`}
  >
    {chartItems.reduce(
      (sum, item) => sum + item.balance,
      0
    ) >= 0
      ? "Balance positivo. Tus ingresos superan tus gastos en este periodo."
      : "Atención. Tus gastos superan tus ingresos en este periodo."}
  </p>
</div>

<div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
  <p className="text-xs uppercase tracking-[0.2em] text-violet-300">
    Insights de AVERO
  </p>

  <div className="mt-4 space-y-3 text-sm">
    <p>
      💰 Has generado{" "}
      <span className="font-semibold text-emerald-300">
        {formatMoney(periodIncome)}
      </span>{" "}
      durante el periodo analizado.
    </p>

    <p>
      💸 Has gastado{" "}
      <span className="font-semibold text-rose-300">
        {formatMoney(periodExpenses)}
      </span>.
    </p>

    <p>
      📈 Tu tasa de ahorro es de{" "}
      <span className="font-semibold text-cyan-300">
        {savingsRate}%
      </span>.
    </p>

    {budgetAlerts.map((alert) => (
  <p key={alert.category}>
    {alert.percentage >= 100 ? "🚨" : "⚠️"}{" "}
    {alert.percentage >= 100
      ? `Has superado el presupuesto de ${alert.category}.`
      : `Has consumido el ${alert.percentage.toFixed(0)

      }
      % del presupuesto de ${alert.category}.`
      }
  </p>
))}

    {topCategory && (
  <p>
    🎯 Tu mayor gasto ha sido{" "}
    <span className="font-semibold">
      {topCategory[0]}
    </span>{" "}
    con {formatMoney(topCategory[1])}.
  </p>
)}
  </div>
</div>
<div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
    Objetivos financieros
  </p>

  <div className="mt-4 space-y-4">
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">
          🏦 Ahorro
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Colchón de tranquilidad
        </p>
      </div>

      <p className="text-sm font-semibold text-emerald-300">
        {savingsProgress.toFixed(0)}%
      </p>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
      <div>
        <p>Objetivo</p>
        <p className="mt-1 font-medium text-white">
          {formatMoney(savingsTarget)}
        </p>
      </div>

      <div>
        <p>Actual</p>
        <p className="mt-1 font-medium text-emerald-300">
          {formatMoney(currentSavings)}
        </p>
      </div>

      <div>
        <p>Falta</p>
        <p className="mt-1 font-medium text-slate-300">
          {formatMoney(Math.max(savingsTarget - currentSavings, 0))}
        </p>
      </div>
    </div>

    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-emerald-400"
        style={{ width: `${savingsProgress}%` }}
      />
    </div>
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">
          📈 Inversión
        </p>

        <p className="mt-1 text-xs text-slate-500">
          ETFs / largo plazo
        </p>
      </div>

      <p className="text-sm font-semibold text-cyan-300">
        {investmentProgress.toFixed(0)}%
      </p>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
      <div>
        <p>Objetivo</p>
        <p className="mt-1 font-medium text-white">
          {formatMoney(investmentTarget)}
        </p>
      </div>

      <div>
        <p>Actual</p>
        <p className="mt-1 font-medium text-cyan-300">
          {formatMoney(currentInvestment)}
        </p>
      </div>

      <div>
        <p>Falta</p>
        <p className="mt-1 font-medium text-slate-300">
          {formatMoney(Math.max(investmentTarget - currentInvestment, 0))}
        </p>
      </div>
    </div>

    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-cyan-400"
        style={{ width: `${investmentProgress}%` }}
      />
    </div>
  </div>

  <div className="border-t border-white/10 pt-4">
    <div className="flex items-center justify-between">
      <span className="font-medium">
        Total futuro objetivo
      </span>

      <span className="font-semibold text-white">
        {formatMoney(futureTarget)}
      </span>
    </div>
  </div>
</div>
</div>
</div>


<div className="space-y-6">

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-center justify-between">
  <h2 className="text-2xl font-semibold">
    Presupuestos
  </h2>

  <div className="text-right">
    <p className="text-sm text-slate-400">
      Este mes
    </p>

    <p className="mt-1 text-xs text-slate-500">
      Basado en ingresos de {previousMonthLabel} 
      {formatMoney(previousMonthIncome)}
</p>
  </div>
</div>


  <div className="mt-6 space-y-5">
  {personalBudget.map((item) => (
  <div key={item.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-medium">
          {item.name}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {item.percentage}% de tus ingresos mensuales
        </p>
      </div>

      <p
        className={`text-sm font-medium ${
          item.remaining >= 0 ? "text-emerald-300" : "text-rose-300"
        }`}
      >
        {formatMoney(item.remaining)}
      </p>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
      <div>
        <p>Objetivo</p>
        <p className="mt-1 font-medium text-white">
          {formatMoney(item.limit)}
        </p>
      </div>

      <div>
        <p>Gastado</p>
        <p className="mt-1 font-medium text-rose-300">
          {formatMoney(item.spent)}
        </p>
      </div>

      <div>
        <p>Disponible</p>
        <p
          className={`mt-1 font-medium ${
            item.remaining >= 0 ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {formatMoney(item.remaining)}
        </p>
      </div>
    </div>

    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full ${
          item.usedPercentage >= 100
            ? "bg-rose-400"
            : item.usedPercentage >= 75
            ? "bg-amber-400"
            : "bg-violet-400"
        }`}
        style={{
          width: `${item.usedPercentage}%`,
        }}
      />
    </div>
  </div>
))}
  </div>
</div>

<div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
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
            {formatMoney(amount)}
          </span>
        </div>
      ))}
  </div>
</div>

<div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold">
      Suscripciones
    </h2>

    <p className="text-sm text-slate-400">
      {formatMoney(totalSubscriptions)} / mes
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
            {formatMoney(subscription.amount)}
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
      <option value="inversion">Inversión</option>
      <option value="educacion">Educación</option>
      <option value="tarjetas">Tarjetas</option>
      <option value="suscripciones">Suscripciones</option>
      <option value="coche">Coche</option>
      <option value="casa">Casa</option>
      <option value="negocio">Negocio</option>
      <option value="impuestos">Impuestos</option>
      <option value="ocio">Ocio</option>
      <option value="otros">Otros</option>
      <option value="ahorro">Ahorro</option>
      
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
          {transaction.type === "income" ? "+" : "-"}
          {formatMoney(Number(transaction.amount))}
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