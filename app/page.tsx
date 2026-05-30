"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  Wallet,
  Building2,
  Check,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

const metrics = [
  { label: "Ingresos", value: "£8,420", change: "+12.4%" },
  { label: "Gastos", value: "£4,180", change: "-6.2%" },
  { label: "Ahorro", value: "£4,240", change: "+18.1%" },
];

const transactions = [
  ["BBONITA", "Ingreso", "+£1,250", "text-cyan-300"],
  ["Seguro vehículo", "Gasto", "-£220", "text-rose-300"],
  ["Software", "Negocio", "-£49", "text-rose-300"],
  ["Reserva cliente", "Ingreso", "+£380", "text-cyan-300"],
];

function FloatingCard({
  title,
  value,
  detail,
  className = "",
  delay = 0,
}: {
  title: string;
  value: string;
  detail: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`absolute hidden rounded-[1.4rem] border border-slate-200/70 bg-white/90 p-5 text-left text-slate-950 shadow-2xl shadow-slate-950/15 backdrop-blur-xl lg:block ${className}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {detail}
      </p>
    </motion.div>
  );
}

function DashboardMockup() {
  return (
    <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-900/10 bg-[#f8fafc] p-4 text-slate-950 shadow-2xl shadow-slate-950/20">
      <div className="grid gap-4 lg:grid-cols-[230px_1fr]">
        <aside className="hidden rounded-[1.6rem] bg-slate-950 p-5 text-white lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
              A
            </div>

            <div>
              <p className="text-sm font-semibold">AVERO</p>
              <p className="text-xs text-slate-500">
                Financial OS
              </p>
            </div>
          </div>

          {["Resumen", "Movimientos", "Presupuesto", "Balance"].map(
            (item, index) => (
              <div
                key={item}
                className={`mb-2 rounded-2xl px-4 py-3 text-sm ${
                  index === 0
                    ? "bg-white text-slate-950"
                    : "text-slate-400"
                }`}
              >
                {item}
              </div>
            )
          )}

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-500">
              Modo activo
            </p>

            <p className="mt-2 text-lg font-semibold">
              Empresa
            </p>

            <p className="mt-1 text-xs text-slate-500">
              GBP · Mayo 2026
            </p>
          </div>
        </aside>

        <div className="rounded-[1.6rem] bg-white p-5 shadow-sm md:p-7">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm text-slate-500">
                Resumen financiero
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Todo bajo control.
              </h2>
            </div>

            <div className="rounded-full bg-slate-100 p-1 text-sm">
              <span className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-white">
                Personal
              </span>

              <span className="inline-flex px-4 py-2 text-slate-500">
                Empresa
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-sm text-slate-500">
                  {metric.label}
                </p>

                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {metric.value}
                </p>

                <p className="mt-2 text-sm font-medium text-emerald-600">
                  {metric.change}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Cashflow
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    Últimos 12 meses
                  </p>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                  +18.1%
                </span>
              </div>

              <div className="flex h-56 items-end gap-3">
                {[44, 66, 52, 78, 62, 88, 70, 96, 74, 90, 80, 100].map(
                  (h, i) => (
                    <div
                      key={i}
                      className="flex flex-1 flex-col justify-end gap-2"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{
                          duration: 1,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                        className="rounded-t-xl bg-slate-950"
                      />

                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{
                          height: `${Math.max(16, h - 34)}%`,
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.05 + 0.15,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                        className="rounded-t-xl bg-indigo-100"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-slate-200 bg-slate-950 p-5 text-white">
              <p className="text-sm text-slate-400">
                Movimientos recientes
              </p>

              <div className="mt-5 space-y-3">
                {transactions.map(
                  ([name, type, amount, color]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-2xl bg-white/5 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {type}
                        </p>
                      </div>

                      <p
                        className={`text-sm font-semibold ${color}`}
                      >
                        {amount}
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 p-4">
                <p className="text-xs text-indigo-100">
                  Presupuesto usado
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  68%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
const [email, setEmail] = useState("");
const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");

async function handleWaitlistSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  if (!email) return;

  setStatus("loading");

  const { error } = await supabase.from("waitlist").insert({
    email,
  });

  if (error) {
  console.error(error);

  if (error.code === "23505") {
  setStatus("duplicate");
  return;
}

  setStatus("error");
  return;
}

  setEmail("");
  setStatus("success");
}

  const { scrollYProgress } = useScroll();

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [0.82, 1]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [120, 0]);
  const heroRotateX = useTransform(scrollYProgress, [0, 0.2], [0, 0]);

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.06],
    [0.45, 1]
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
              A
            </div>

            <span className="text-lg font-semibold tracking-tight text-white">
              AVERO
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#producto" className="hover:text-white">
              Producto
            </a>

            <a href="#funciones" className="hover:text-white">
              Funciones
            </a>

            <a href="#beta" className="hover:text-white">
              Beta
            </a>
          </div>

          <a
            href="#beta"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Unirme a la beta
          </a>
        </nav>
      </header>

      <section className="relative min-h-[150vh] overflow-hidden bg-[#f6f3ee] px-6 pt-28 text-center text-slate-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-20 h-[760px] w-[1120px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.24),transparent_62%)]" />

          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-indigo-500" />

            Finanzas personales y empresariales en un solo lugar
          </div>

          <h1 className="mx-auto max-w-6xl text-6xl font-semibold tracking-[-0.06em] md:text-8xl lg:text-9xl">
            Tu dinero,
            <span className="block text-slate-500">
               por fin claro.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            AVERO une tus finanzas personales y empresariales
            en una experiencia moderna, limpia y visual.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-2xl shadow-slate-950/20 transition hover:scale-[1.02]">
              Unirme a la beta

              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>

            <button className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-7 py-4 text-sm font-semibold text-slate-950 backdrop-blur transition hover:bg-white">
              Ver cómo funciona

              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="sticky top-24 mx-auto mt-16 max-w-[1180px] px-4 pb-40 [perspective:1600px]">
          <motion.div
         
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
          }}
            style={{
              scale: heroScale,
              y: heroY,
              rotateX: heroRotateX,
              opacity: heroOpacity,
            }}
            className="relative mx-auto origin-top will-change-transform"
          >
            <FloatingCard
              title="Cashflow"
              value="+£2,420"
              detail="Proyección mensual"
              className="-left-4 top-24"
            />

            <FloatingCard
              title="Patrimonio"
              value="£128k"
              detail="Activos menos pasivos"
              className="-right-4 bottom-32"
              delay={1.2}
            />

            <div className="pointer-events-none absolute -inset-16 rounded-[4rem] bg-[radial-gradient(circle_at_50%_20%,rgba(79,70,229,0.25),transparent_45%)] blur-3xl" />

            <div className="relative mx-auto rounded-[3rem] border border-white/60 bg-white/50 p-4 shadow-[0_80px_180px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <DashboardMockup />
            </div>
          </motion.div>
        </div>
      </section>
      <section
  id="producto"
  className="relative bg-slate-950 px-6 py-24 text-white"
>
  <div className="mx-auto grid max-w-7xl gap-6 text-center md:grid-cols-3">
    {[
      ["£12.6k", "controlados este mes"],
      ["34%", "menos gasto innecesario"],
      ["2 modos", "Personal y Empresa"],
    ].map(([value, label]) => (
      <div
        key={label}
        className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/20"
      >
        <p className="text-5xl font-semibold tracking-tight">
          {value}
        </p>

        <p className="mt-3 text-sm text-slate-400">
          {label}
        </p>
      </div>
    ))}
  </div>
</section>

<section className="border-y border-white/10 bg-gradient-to-b from-[#0B1020] to-[#050816] px-6 py-32 text-white">
  <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
        Personal + Empresa
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
        Separa lo personal de lo profesional sin perder visión global.
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-300">
        AVERO está diseñado para personas, autónomos y pequeños
        negocios que necesitan claridad financiera real sin usar
        herramientas diferentes.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-10">
        <Wallet className="h-9 w-9 text-cyan-300" />

        <h3 className="mt-6 text-2xl font-semibold">
          Personal
        </h3>

        <p className="mt-4 leading-7 text-slate-400">
          Controla ahorro, gastos familiares, tarjetas,
          patrimonio y presupuestos mensuales.
        </p>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-10">
        <Building2 className="h-9 w-9 text-violet-300" />

        <h3 className="mt-6 text-2xl font-semibold">
          Empresa
        </h3>

        <p className="mt-4 leading-7 text-slate-400">
          Supervisa ingresos, costes, cashflow,
          categorías y usuarios del negocio.
        </p>
      </div>
    </div>
  </div>
</section>
<section
  id="funciones"
  className="relative overflow-hidden bg-[#050816] px-6 py-32 text-white"
>
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-[-10%] top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />
    <div className="absolute right-[-10%] bottom-0 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
  </div>

  <div className="relative z-10 mx-auto max-w-7xl">
   
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
        Actividad en tiempo real
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
        Todo cambia en tiempo real.
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-300">
        Visualiza movimientos, presupuestos, cashflow y balances desde una
        interfaz rápida, limpia y moderna.
      </p>
    </div>

    <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Actividad reciente
            </p>

            <h3 className="mt-2 text-2xl font-semibold">
              Últimos movimientos
            </h3>
          </div>

          <div className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
            Live
          </div>
        </div>

        <div className="space-y-4">
          {[
            ["Transferencia recibida", "+£1,240"],
            ["Suscripción software", "-£29"],
            ["Pago cliente", "+£480"],
            ["Seguro vehículo", "-£220"],
            ["Reserva BBONITA", "+£350"],
          ].map(([name, amount]) => (
            <div
              key={name}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-5"
            >
              <div>
                <p className="font-medium">{name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Hace unos segundos
                </p>
              </div>

              <p
                className={`font-semibold ${
                  amount.startsWith("+")
                    ? "text-cyan-300"
                    : "text-rose-300"
                }`}
              >
                {amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
          Inteligencia financiera
        </p>

        <h3 className="mt-4 text-3xl font-semibold">
          Entiende patrones antes de que se conviertan en problemas.
        </h3>

        <p className="mt-6 leading-8 text-slate-200">
          Detecta categorías con exceso de gasto, meses débiles, cashflow
          negativo y tendencias importantes automáticamente.
        </p>

        <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Salud financiera
            </span>

            <span className="text-sm font-semibold text-cyan-300">
              Excelente
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Tu flujo mensual y nivel de ahorro están mejorando respecto al
            último trimestre.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="bg-[#0A1020] px-6 py-32 text-white">
  <div className="mx-auto max-w-7xl">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
        Funciones clave
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
        Todo lo que necesitas para ordenar tus finanzas.
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-300">
        AVERO combina control diario, visión estratégica y una experiencia
        visual pensada para personas y pequeños negocios.
      </p>
    </div>

    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[
        [
          "Movimientos",
          "Registra ingresos y gastos con categorías, notas y filtros claros.",
        ],
        [
          "Presupuestos",
          "Define límites mensuales y compara lo previsto con lo real.",
        ],
        [
          "Balance",
          "Controla activos, pasivos, deudas, efectivo e inversiones.",
        ],
        [
          "Importación",
          "Sube CSV o Excel para cargar movimientos rápidamente.",
        ],
        [
          "Usuarios",
          "Invita colaboradores con distintos niveles de permisos.",
        ],
        [
          "Multidivisa",
          "Trabaja con GBP, EUR, USD y otras monedas clave.",
        ],
      ].map(([title, text]) => (
        <div
          key={title}
          className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:bg-white/[0.07]"
        >
          <div className="mb-8 h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-400/20" />

          <h3 className="text-2xl font-semibold">
            {title}
          </h3>

          <p className="mt-4 leading-7 text-slate-400">
            {text}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
<section
  id="beta"
  className="relative overflow-hidden px-6 py-32"
>
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
  </div>

  <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] shadow-[0_0_120px_rgba(99,102,241,0.25)] border border-white/10 bg-gradient-to-br from-[#111827] to-[#050816] p-10 text-center md:p-16">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
      Beta privada
    </p>

    <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
      Sé de los primeros en usar AVERO.
    </h2>

    <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-300">
      Estamos construyendo una nueva forma de entender
      las finanzas personales y empresariales:
      más visual, más clara y mucho más moderna.
    </p>

    <form
  onSubmit={handleWaitlistSubmit}
  className="mx-auto mt-12 flex max-w-xl flex-col gap-3 rounded-full border border-white/10 bg-white/[0.04] p-2 sm:flex-row"
>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    placeholder="Tu email"
    className="min-w-0 flex-1 bg-transparent px-6 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none"
  />

  <button
    type="submit"
    disabled={status === "loading"}
    className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {status === "loading" ? "Guardando..." : "Unirme a la beta"}
  </button>
</form>
{status === "success" && (
  <p className="mt-4 text-sm text-cyan-300">
    Perfecto. Ya estás en la lista de espera.
  </p>
)}
{status === "duplicate" && (
  <p className="mt-4 text-sm text-cyan-300">
    Este email ya está en la lista de espera.
  </p>
)}

{status === "error" && (
  <p className="mt-4 text-sm text-rose-300">
    Ha ocurrido un error. Prueba con otro email o inténtalo de nuevo.
  </p>
)}
    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
      <span>✔ Acceso anticipado</span>
      <span>✔ Actualizaciones privadas</span>
      <span>✔ Feedback directo</span>
    </div>
  </div>
</section>

<footer className="border-t border-white/10 px-6 py-10 text-white">
  <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
        A
      </div>

      <div>
        <p className="font-semibold tracking-tight">
          AVERO
        </p>

        <p className="text-sm text-slate-500">
          Sistema Financiero Personal y Empresarial
        </p>
      </div>
    </div>

    <div className="flex gap-6 text-sm text-slate-500">
      <a href="#" className="transition hover:text-white">
        Privacidad
      </a>

      <a href="#" className="transition hover:text-white">
        Términos
      </a>

      <a href="#" className="transition hover:text-white">
        Contacto
      </a>
    </div>
  </div>
</footer>
    </main>
  );
}
