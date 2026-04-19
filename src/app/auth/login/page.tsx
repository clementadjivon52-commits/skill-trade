"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/marketplace");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell flex min-h-[80vh] items-center justify-center py-10">
      <div className="glass-card grid-glow w-full max-w-md rounded-[2rem] p-8">
        <div className="mb-6 inline-flex rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.32em] text-violet-200">
          Bon retour
        </div>
        <h1 className="text-3xl font-bold text-white">Connexion</h1>
        <p className="mt-2 text-slate-300">
          Accède à ton compte Skill-Trade.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
              placeholder="ton@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder-slate-500 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 font-semibold text-white shadow-[0_12px_40px_rgba(124,58,237,0.35)] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Tu n'as pas de compte ?{" "}
          <Link href="/auth/register" className="text-violet-400 hover:underline">
            Inscris-toi
          </Link>
        </p>
      </div>
    </div>
  );
}
