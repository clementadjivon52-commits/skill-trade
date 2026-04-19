"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateServicePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      reward: formData.get("reward"),
    };

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/offers/${data.id}`);
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
    <div className="page-shell py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white md:text-5xl">
          Créer un Service
        </h1>
        <p className="mt-3 text-lg text-slate-300">
          Propose tes compétences ou ton temps sur le marketplace.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-200">
              {error}
            </div>
          )}

          <div className="glass-card rounded-[2rem] p-6 md:p-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Titre du service
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Ex: Création de logo, Livraison de colis..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description détaillée
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                placeholder="Décris exactement ce que tu proposes..."
              ></textarea>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Catégorie
                </label>
                <select
                  name="category"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 [&>option]:bg-slate-900"
                >
                  <option value="tech">Compétences Tech / Design</option>
                  <option value="time">Services de Temps / Manuels</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Récompense demandée
                </label>
                <input
                  type="text"
                  name="reward"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  placeholder="Ex: 50 Skill-Tokens ou Troc contre X"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-4 font-semibold text-white shadow-[0_12px_40px_rgba(124,58,237,0.35)] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? "Création..." : "Publier le service"}
            </button>
            <Link
              href="/marketplace"
              className="rounded-full border border-white/10 px-8 py-4 text-center font-medium text-slate-200 hover:border-cyan-400/60 hover:bg-white/5"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
