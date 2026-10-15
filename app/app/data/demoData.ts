
type DemoTransaction = {
  type: "income" | "expense";
  amount: number;
  category: string;
  note: string;
  transaction_date: string;
  is_demo: true;
};

type DemoSubscription = {
  name: string;
  amount: number;
  billing_day: number;
  is_demo: true;
};

function getDemoDate(monthOffset: number, day: number): string {
  const now = new Date();

  const date = new Date(
    now.getFullYear(),
    now.getMonth() + monthOffset,
    day
  );

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const dateDay = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${dateDay}`;
}

export function generateDemoTransactions(): DemoTransaction[] {
  const items: Array<{
    monthOffset: number;
    day: number;
    type: "income" | "expense";
    amount: number;
    category: string;
    note: string;
  }> = [
    // Mes anterior: base del presupuesto
    { monthOffset: -1, day: 2, type: "income", amount: 3250, category: "trabajo", note: "Ingresos profesionales" },
    { monthOffset: -1, day: 10, type: "income", amount: 850, category: "negocio", note: "Proyecto de diseño web" },
    { monthOffset: -1, day: 21, type: "income", amount: 420, category: "negocio", note: "Servicios a empresas" },

    { monthOffset: -1, day: 3, type: "expense", amount: 950, category: "casa", note: "Alquiler y suministros" },
    { monthOffset: -1, day: 5, type: "expense", amount: 367, category: "coche", note: "Cuota del vehículo" },
    { monthOffset: -1, day: 8, type: "expense", amount: 310, category: "gasolina", note: "Combustible" },
    { monthOffset: -1, day: 11, type: "expense", amount: 225, category: "comida", note: "Supermercado" },
    { monthOffset: -1, day: 15, type: "expense", amount: 280, category: "impuestos", note: "Provisión para impuestos" },
    { monthOffset: -1, day: 18, type: "expense", amount: 79, category: "software", note: "Herramientas profesionales" },
    { monthOffset: -1, day: 20, type: "expense", amount: 150, category: "educacion", note: "Formación" },
    { monthOffset: -1, day: 25, type: "expense", amount: 300, category: "ahorro", note: "Aportación al ahorro" },
    { monthOffset: -1, day: 26, type: "expense", amount: 200, category: "inversion", note: "Aportación a inversión" },
    { monthOffset: -1, day: 28, type: "expense", amount: 120, category: "ocio", note: "Actividades familiares" },

    // Mes actual
    { monthOffset: 0, day: 2, type: "income", amount: 1450, category: "trabajo", note: "Ingresos profesionales" },
    { monthOffset: 0, day: 6, type: "income", amount: 650, category: "negocio", note: "Proyecto digital" },
    { monthOffset: 0, day: 9, type: "income", amount: 320, category: "negocio", note: "Servicios profesionales" },

    { monthOffset: 0, day: 3, type: "expense", amount: 950, category: "casa", note: "Alquiler y suministros" },
    { monthOffset: 0, day: 5, type: "expense", amount: 367, category: "coche", note: "Cuota del vehículo" },
    { monthOffset: 0, day: 7, type: "expense", amount: 180, category: "gasolina", note: "Combustible" },
    { monthOffset: 0, day: 8, type: "expense", amount: 145, category: "comida", note: "Compra semanal" },
    { monthOffset: 0, day: 9, type: "expense", amount: 95, category: "software", note: "Herramientas digitales" },
    { monthOffset: 0, day: 10, type: "expense", amount: 80, category: "educacion", note: "Curso online" },
    { monthOffset: 0, day: 11, type: "expense", amount: 220, category: "ahorro", note: "Aportación al ahorro" },
    { monthOffset: 0, day: 12, type: "expense", amount: 150, category: "inversion", note: "Inversión mensual" },
    { monthOffset: 0, day: 13, type: "expense", amount: 65, category: "ocio", note: "Restaurantes y ocio" },
  ];

  return items.map(({ monthOffset, day, ...transaction }) => ({
    ...transaction,
    transaction_date: getDemoDate(monthOffset, day),
    is_demo: true,
  }));
}

export function generateDemoSubscriptions(): DemoSubscription[] {
  return [
    { name: "Netflix", amount: 10.99, billing_day: 5, is_demo: true },
    { name: "Canva Pro", amount: 12.99, billing_day: 7, is_demo: true },
    { name: "Spotify", amount: 11.99, billing_day: 12, is_demo: true },
    { name: "Hostinger", amount: 9.99, billing_day: 15, is_demo: true },
    { name: "ChatGPT Plus", amount: 20, billing_day: 18, is_demo: true },
    { name: "Software contable", amount: 18, billing_day: 25, is_demo: true },
  ];
}
