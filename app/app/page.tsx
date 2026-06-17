"use client";

"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/formatters";

import { DashboardTabs } from "./components/DashboardTabs";
import { GoalsTab } from "./components/GoalsTab";
import { HistoryTab } from "./components/HistoryTab";
import { BudgetTab } from "./components/BudgetTab";
import { TransactionsTab } from "./components/TransactionsTab";
import { SummaryTab } from "./components/SummaryTab";
import { DashboardHeader } from "./components/DashboardHeader";

import type {
  ActiveTab,
  ActionStatus,
  ChartRange,
  SaveStatus,
  FiscalInsight,
  Transaction,
  TransactionFilter,
  TransactionSort,
  TransactionType,
} from "./types";

import type { SubmitEvent } from "react";


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

  const [activeTab, setActiveTab] = useState<ActiveTab>("summary");

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

    const [chartRange, setChartRange] = useState<ChartRange>("6m");

  // ============================
  // ESTADOS DE FILTROS
  // ============================

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<TransactionFilter>("all");
    const [sortBy, setSortBy] = useState<TransactionSort>("date");


  // ============================
  // ESTADOS DEL FORMULARIO
  // ============================

    const [type, setType] = useState<TransactionType>("expense");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("gasolina");
    const [note, setNote] = useState("");
    
    // ============================
  // ESTADOS DE UX
  // ============================

    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [actionStatus, setActionStatus] = useState<ActionStatus>("idle");
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

  async function handleAddTransaction(event: SubmitEvent<HTMLFormElement>) {
  event.preventDefault();

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
// COMPARATIVA POR AÑOS FISCALES
// UK fiscal year: abril - marzo
// ============================

const fiscalYears = [
  {
    label: "2023-2024",
    start: "2023-04-01",
    end: "2024-03-31",
  },
  {
    label: "2024-2025",
    start: "2024-04-01",
    end: "2025-03-31",
  },
  {
    label: "2025-2026",
    start: "2025-04-01",
    end: "2026-03-31",
  },
];

const fiscalSummary = fiscalYears.map((year) => {
  
  const yearTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.transaction_date);

    return (
      date >= new Date(year.start) &&
      date <= new Date(year.end)
    );
  });


  const income = yearTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const expenses = yearTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const balance = income - expenses;

  const margin =
    income > 0 ? (balance / income) * 100 : 0;

  return {
    label: year.label,
    income,
    expenses,
    balance,
    margin,
  };
});

const latestFiscalYear =
  fiscalSummary[fiscalSummary.length - 1];

const previousFiscalYear =
  fiscalSummary[fiscalSummary.length - 2];

  const incomeGrowth =
  previousFiscalYear?.income
    ? (
        ((latestFiscalYear.income -
          previousFiscalYear.income) /
          previousFiscalYear.income) *
        100
      )
    : 0;

const expenseGrowth =
  previousFiscalYear?.expenses
    ? (
        ((latestFiscalYear.expenses -
          previousFiscalYear.expenses) /
          previousFiscalYear.expenses) *
        100
      )
    : 0;

const balanceGrowth =
  previousFiscalYear?.balance
    ? (
        ((latestFiscalYear.balance -
          previousFiscalYear.balance) /
          previousFiscalYear.balance) *
        100
      )
    : 0;

    const fiscalInsight: FiscalInsight =
  expenseGrowth > incomeGrowth
    ? {
        tone: "warning",
        message:
          "Tus gastos crecieron más rápido que tus ingresos durante el último ejercicio fiscal.",
        detail: `Los ingresos crecieron un ${incomeGrowth.toFixed(
          1
        )}%, mientras que los gastos crecieron un ${expenseGrowth.toFixed(
          1
        )}%.`,
      }
    : {
        tone: "positive",
        message:
          "Tus ingresos crecieron más rápido que tus gastos durante el último ejercicio fiscal.",
        detail: `Los ingresos crecieron un ${incomeGrowth.toFixed(
          1
        )}%, mientras que los gastos crecieron un ${expenseGrowth.toFixed(
          1
        )}%.`,
      };

      const latestFiscalYearTransactions = transactions.filter((transaction) => {
  const date = new Date(transaction.transaction_date);

  return (
    date >= new Date(fiscalYears[fiscalYears.length - 1].start) &&
    date <= new Date(fiscalYears[fiscalYears.length - 1].end)
  );
});

const latestFiscalExpensesByCategory = latestFiscalYearTransactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((acc, transaction) => {
    const category = transaction.category;

    acc[category] =
      (acc[category] || 0) + Number(transaction.amount);

    return acc;
  }, {} as Record<string, number>);

const topFiscalExpenses = Object.entries(latestFiscalExpensesByCategory)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3);

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

  const emergencyFundTarget = Math.max(monthlyExpenses * 3, 3000);

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
      <DashboardHeader
        email={email}
        handleLogout={handleLogout}
      />

      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "summary" && (
        <SummaryTab
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          totalMovements={totalMovements}
          chartItems={chartItems}
          chartRange={chartRange}
          setChartRange={setChartRange}
          averageIncome={averageIncome}
          averageExpenses={averageExpenses}
          averageBalance={averageBalance}
          periodIncome={periodIncome}
          periodExpenses={periodExpenses}
          savingsRate={savingsRate}
          budgetAlerts={budgetAlerts}
          topCategory={topCategory}
          subscriptions={subscriptions}
          totalSubscriptions={totalSubscriptions}
          formatMoney={formatMoney}
        />
    )}

      {activeTab === "budget" && (
        <BudgetTab
          personalBudget={personalBudget}
          previousMonthLabel={previousMonthLabel}
          previousMonthIncome={previousMonthIncome}
          expensesByCategory={expensesByCategory}
          categoryStyles={categoryStyles}
          formatMoney={formatMoney}
        />
      )}

      {activeTab === "transactions" && (
        <TransactionsTab
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
          actionStatus={actionStatus}
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortedTransactions={sortedTransactions}
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
          handleAddTransaction={handleAddTransaction}
          handleUpdateTransaction={handleUpdateTransaction}
          handleDeleteTransaction={handleDeleteTransaction}
        />
      )}

      {activeTab === "history" && (
        <HistoryTab
          incomeGrowth={incomeGrowth}
          expenseGrowth={expenseGrowth}
          balanceGrowth={balanceGrowth}
          fiscalInsight={fiscalInsight}
          topFiscalExpenses={topFiscalExpenses}
          fiscalSummary={fiscalSummary}
          latestFiscalYear={latestFiscalYear}
          categoryStyles={categoryStyles}
          formatMoney={formatMoney}
        />
      )}

      {activeTab === "goals" && (
        <GoalsTab
          emergencyFundTarget={emergencyFundTarget}
          savingsTarget={savingsTarget}
          investmentTarget={investmentTarget}
          futureTarget={futureTarget}
          formatMoney={formatMoney}
        />
      )}
    </div>
  </main>
);
}