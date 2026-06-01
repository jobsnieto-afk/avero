"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      return;
    }

    window.location.href = "/app";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-semibold">Entrar en AVERO</h1>

        <input
          type="email"
          placeholder="Email"
          className="mt-8 w-full rounded-xl bg-white px-4 py-3 text-slate-950"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-slate-950"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-white px-4 py-3 font-semibold text-slate-950"
        >
          {status === "loading" ? "Entrando..." : "Entrar"}
        </button>

        {status === "error" && (
          <p className="mt-4 text-sm text-rose-300">
            Email o contraseña incorrectos.
          </p>
        )}
      </form>
    </main>
  );
}