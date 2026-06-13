export type CurrencyCode =
  | "GBP"
  | "EUR"
  | "USD"
  | "COP"
  | "MXN"
  | "ARS";

export function formatCurrency(
  value: number,
  currency: CurrencyCode = "GBP"
) {
  const localeMap: Record<CurrencyCode, string> = {
    GBP: "en-GB",
    EUR: "es-ES",
    USD: "en-US",
    COP: "es-CO",
    MXN: "es-MX",
    ARS: "es-AR",
  };

  return new Intl.NumberFormat(localeMap[currency], {
    style: "currency",
    currency,
  }).format(value);
}