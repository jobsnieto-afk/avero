import type { CategoryStyles } from "../types";

export const categoryStyles: CategoryStyles = {

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

export const budgets: Record<string, number> = {
  
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

export const defaultCategory = "gasolina";