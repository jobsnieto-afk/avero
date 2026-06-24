"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/formatters";

import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardTabs } from "./components/DashboardTabs";
import { SummaryTab } from "./components/SummaryTab";
import { BudgetTab } from "./components/BudgetTab";
import { TransactionsTab } from "./components/TransactionsTab";
import { HistoryTab } from "./components/HistoryTab";
import { GoalsTab } from "./components/GoalsTab";
import { calculateGoals } from "./utils/goals";
import { getSortedTransactions } from "./utils/transactions";
import { buildChartItems } from "./utils/chart";
import { buildFiscalSummary } from "./utils/fiscal";
import { SubscriptionsTab } from "./components/SubscriptionsTab";

import {
  budgets,
  categoryStyles,
  defaultCategory,
} from "./constants/categories";

import {
  calculateExpensesByCategory,
  getTopExpenseCategory,
} from "./utils/categories";

import {
  calculateBudgetAlerts,
  calculatePersonalBudget,
} from "./utils/budget";

import type {
  ActiveTab,
  ActionStatus,
  ChartRange,
  SaveStatus,
  SubscriptionItem,
  Transaction,
  TransactionFilter,
  TransactionSort,
  TransactionType,
} from "./types";

import type { SubmitEvent } from "react";

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

    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
const [subscriptionName, setSubscriptionName] = useState("");
const [subscriptionAmount, setSubscriptionAmount] = useState("");
const [subscriptionBillingDay, setSubscriptionBillingDay] = useState("");

const [editingSubscriptionId, setEditingSubscriptionId] = useState<number | null>(
  null
);
const [editingSubscriptionName, setEditingSubscriptionName] = useState("");
const [editingSubscriptionAmount, setEditingSubscriptionAmount] = useState("");
const [editingSubscriptionBillingDay, setEditingSubscriptionBillingDay] =
  useState("");

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
    const [category, setCategory] = useState(defaultCategory);
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



const sortedTransactions = getSortedTransactions({
  transactions,
  filter,
  search,
  sortBy,
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
      await loadSubscriptions(user.id);
  
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

async function handleAddSubscription(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!user) return;

  const numericAmount = Number(subscriptionAmount);
  const numericBillingDay = Number(subscriptionBillingDay);

  if (
    !subscriptionName.trim() ||
    Number.isNaN(numericAmount) ||
    numericAmount <= 0 ||
    Number.isNaN(numericBillingDay) ||
    numericBillingDay < 1 ||
    numericBillingDay > 31
  ) {
    return;
  }

  const { error } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    name: subscriptionName.trim(),
    amount: numericAmount,
    billing_day: numericBillingDay,
  });

  if (error) {
    console.error("Error adding subscription:", error);
    return;
  }

  setSubscriptionName("");
  setSubscriptionAmount("");
  setSubscriptionBillingDay("");

  await loadSubscriptions(user.id);
}

function handleStartEditSubscription(subscription: SubscriptionItem) {
  setEditingSubscriptionId(subscription.id);
  setEditingSubscriptionName(subscription.name);
  setEditingSubscriptionAmount(String(subscription.amount));
  setEditingSubscriptionBillingDay(String(subscription.billing_day));
}

function handleCancelEditSubscription() {
  setEditingSubscriptionId(null);
  setEditingSubscriptionName("");
  setEditingSubscriptionAmount("");
  setEditingSubscriptionBillingDay("");
}

async function handleUpdateSubscription(subscriptionId: number) {
  if (!user) return;

  const numericAmount = Number(editingSubscriptionAmount);
  const numericBillingDay = Number(editingSubscriptionBillingDay);

  if (
    !editingSubscriptionName.trim() ||
    Number.isNaN(numericAmount) ||
    numericAmount <= 0 ||
    Number.isNaN(numericBillingDay) ||
    numericBillingDay < 1 ||
    numericBillingDay > 31
  ) {
    return;
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({
      name: editingSubscriptionName.trim(),
      amount: numericAmount,
      billing_day: numericBillingDay,
    })
    .eq("id", subscriptionId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating subscription:", error);
    return;
  }

  handleCancelEditSubscription();

  await loadSubscriptions(user.id);
}

async function handleDeleteSubscription(subscriptionId: number) {
  if (!user) return;

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", subscriptionId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting subscription:", error);
    return;
  }

  await loadSubscriptions(user.id);
}

async function loadSubscriptions(userId: string) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("billing_day", { ascending: true });

  if (error) {
    console.error("Error loading subscriptions:", error);
    return;
  }

  setSubscriptions(data || []);
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

const {
  fiscalSummary,
  latestFiscalYear,
  incomeGrowth,
  expenseGrowth,
  balanceGrowth,
  fiscalInsight,
  topFiscalExpenses,
} = buildFiscalSummary({
  transactions,
  categoryStyles,
});

// ============================
// DATOS DEL GRÁFICO PRINCIPAL
// Agrupa ingresos, gastos y balance por mes.
// ============================


const chartItems = buildChartItems({
  transactions,
  chartRange,
});

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

const monthlyExpensesByCategory =
  calculateExpensesByCategory(monthlyTransactions);

const allTimeExpensesByCategory =
  calculateExpensesByCategory(transactions);

const monthlyTopCategory =
  getTopExpenseCategory(monthlyExpensesByCategory);

const allTimeTopCategory =
  getTopExpenseCategory(allTimeExpensesByCategory);

// ============================
// PRESUPUESTOS
// ============================

const personalBudget = calculatePersonalBudget({
  previousMonthIncome,
  monthlyTransactions,
});

const {
  emergencyFundTarget,
  monthlySavingsTarget,
  monthlyInvestmentTarget,
  monthlyGoalsTarget,
  longTermSavingsTarget,
  longTermInvestmentTarget,
  longTermTarget,
  currentSavings,
  currentInvestment,
  savingsProgress,
  investmentProgress,
} = calculateGoals({
  monthlyExpenses,
  personalBudget,
  monthlyTransactions,
});

const budgetAlerts = calculateBudgetAlerts({
  budgets,
  monthlyTransactions,
});

const totalSubscriptions = subscriptions.reduce(
  (sum, subscription) => sum + Number(subscription.amount),
  0
);

const annualSubscriptions = totalSubscriptions * 12;

const subscriptionsExpensePercentage =
  monthlyExpenses > 0
    ? Math.min((totalSubscriptions / monthlyExpenses) * 100, 100)
    : 0;

const monthlyBalanceAfterSubscriptions =
  monthlyIncome - monthlyExpenses - totalSubscriptions;

  


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
          monthlyTopCategory={monthlyTopCategory}
          allTimeTopCategory={allTimeTopCategory}
          subscriptions={subscriptions}
          totalSubscriptions={totalSubscriptions}
          formatMoney={formatMoney}
          annualSubscriptions={annualSubscriptions}
          subscriptionsExpensePercentage={subscriptionsExpensePercentage}
          monthlyBalanceAfterSubscriptions={monthlyBalanceAfterSubscriptions}
          
        />
)}

      {activeTab === "budget" && (
      <BudgetTab
        personalBudget={personalBudget}
        previousMonthLabel={previousMonthLabel}
        previousMonthIncome={previousMonthIncome}
        monthlyExpensesByCategory={monthlyExpensesByCategory}
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

      {activeTab === "subscriptions" && (
  <SubscriptionsTab
  subscriptions={subscriptions}
  totalSubscriptions={totalSubscriptions}
  annualSubscriptions={annualSubscriptions}
  subscriptionsExpensePercentage={subscriptionsExpensePercentage}
  monthlyBalanceAfterSubscriptions={monthlyBalanceAfterSubscriptions}
  monthlyIncome={monthlyIncome}
  monthlyExpenses={monthlyExpenses}
  subscriptionName={subscriptionName}
  subscriptionAmount={subscriptionAmount}
  subscriptionBillingDay={subscriptionBillingDay}
  setSubscriptionName={setSubscriptionName}
  setSubscriptionAmount={setSubscriptionAmount}
  setSubscriptionBillingDay={setSubscriptionBillingDay}
  handleAddSubscription={handleAddSubscription}
  handleDeleteSubscription={handleDeleteSubscription}
  editingSubscriptionId={editingSubscriptionId}
  editingSubscriptionName={editingSubscriptionName}
  editingSubscriptionAmount={editingSubscriptionAmount}
  editingSubscriptionBillingDay={editingSubscriptionBillingDay}
  setEditingSubscriptionName={setEditingSubscriptionName}
  setEditingSubscriptionAmount={setEditingSubscriptionAmount}
  setEditingSubscriptionBillingDay={setEditingSubscriptionBillingDay}
  handleStartEditSubscription={handleStartEditSubscription}
  handleCancelEditSubscription={handleCancelEditSubscription}
  handleUpdateSubscription={handleUpdateSubscription}
  formatMoney={formatMoney}
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
    monthlySavingsTarget={monthlySavingsTarget}
    monthlyInvestmentTarget={monthlyInvestmentTarget}
    monthlyGoalsTarget={monthlyGoalsTarget}
    currentSavings={currentSavings}
    currentInvestment={currentInvestment}
    savingsProgress={savingsProgress}
    investmentProgress={investmentProgress}
    longTermSavingsTarget={longTermSavingsTarget}
    longTermInvestmentTarget={longTermInvestmentTarget}
    longTermTarget={longTermTarget}
    previousMonthLabel={previousMonthLabel}
    previousMonthIncome={previousMonthIncome}
    formatMoney={formatMoney}
  />
)}
    </div>
  </main>
);
}