require("dotenv").config({ path: ".env.local" });

const XLSX = require("xlsx");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const USER_ID = "93fe4581-dbd2-41c7-8933-a827a7842275";
const FILE_PATH = "./Income vs Expenses 2025-2026.xlsx";

const START_YEAR = 2025;

function excelDateToISO(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "string") {
    const parsedString = new Date(value);

    if (!Number.isNaN(parsedString.getTime())) {
      return parsedString.toISOString().split("T")[0];
    }

    return null;
  }

  const parsed = XLSX.SSF.parse_date_code(Number(value));

  if (!parsed || !parsed.y || !parsed.m || !parsed.d) {
    return null;
  }

  const month = String(parsed.m).padStart(2, "0");
  const day = String(parsed.d).padStart(2, "0");

  return `${parsed.y}-${month}-${day}`;
}

function monthNameToISO(monthName) {
  if (!monthName) return null;

  const months = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };

  const month = months[String(monthName).toLowerCase()];

  if (!month) return null;

  const year = month >= 4
    ? START_YEAR
    : START_YEAR + 1;
  const paddedMonth = String(month).padStart(2, "0");

  return `${year}-${paddedMonth}-01`;
}

function normalizeCategory(description, type) {
  const text = String(description || "").toLowerCase();

  if (type === "income") return "negocio";

  if (
    text.includes("petrol") ||
    text.includes("shell") ||
    text.includes("fuel") ||
    text.includes("charging") ||
    text.includes("applegreen")
  ) {
    return "gasolina";
  }

  if (
    text.includes("black horse") ||
    text.includes("ratesetter") ||
    text.includes("zego") ||
    text.includes("insurance") ||
    text.includes("parking") ||
    text.includes("toll") ||
    text.includes("car wash") ||
    text.includes("taxi private hire") ||
    text.includes("granite finance") ||
    text.includes("firstcentral") ||
    text.includes("ca auto finance")
) {
  return "coche";
}

  if (text.includes("food")) {
    return "comida";
  }

  if (text.includes("id mobile")) {
    return "suscripciones";
  }

  return "otros";
}

function buildTransaction({ date, month, description, amount, type }) {
  const isoDate = excelDateToISO(date) || monthNameToISO(month);

  if (!isoDate || !description || !amount || Number(amount) <= 0) {
  return null;
}

  return {
    user_id: USER_ID,
    type,
    amount: Number(amount),
    category: normalizeCategory(description, type),
    note: String(description).trim(),
    transaction_date: isoDate,
  };
}

async function main() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  const workbook = XLSX.readFile(FILE_PATH);
  const sheet = workbook.Sheets["Income vs Expenses DAILY"];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });



  const transactions = [];

  for (const row of rows.slice(7)) {
    const incomeDate = row[0];
    const incomeDescription = row[2];
    const incomeAmount = row[3];

    const expenseDate = row[6];
    const expenseDescription = row[8];
    const expenseAmount = row[9];

    const income = buildTransaction({
    date: incomeDate,
     month: row[1],
    description: incomeDescription,
     amount: incomeAmount,
    type: "income",
    });

    const expense = buildTransaction({
        date: expenseDate,
        month: row[7],
        description: expenseDescription,
        amount: expenseAmount,
        type: "expense",
    });

    if (income) transactions.push(income);
    if (expense) transactions.push(expense);
  }

  console.log(`Prepared ${transactions.length} transactions`);

    console.log("First 10 transactions:");
    console.log(transactions.slice(0, 10));

    console.log("Last 10 transactions:");
    console.log(transactions.slice(-10));


  const nonEmptyRows = rows
  .map((row, index) => ({ index, row }))
  .filter(({ row }) =>
    row.some((cell) => cell !== "")
  );

  const { error } = await supabase
  .from("transactions")
  .insert(transactions);

if (error) {
  console.error("Import error:", error);
  process.exit(1);
}

console.log("Import completed successfully");
}
main();