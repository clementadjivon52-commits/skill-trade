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
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      price: parseInt((formData.get("price") as string) || "0", 10),
      isPremium: formData.get("isPremium") === "on",
    };

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.message || "Une erreur est survenue");
        if (data.limitReached) {
          // short pause then redirect
          setTimeout(() => router.push("/plans"), 2000);
        }
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: "var(--text-muted)" }}>
          Dashboard
        </p>
        <h1 className="text-3xl font-bold md:text-5xl" style={{ color: "var(--heading)" }}>
          Créer un Service
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--text-muted)" }}>
          Proposez vos compétences ou votre temps sur le marketplace.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
              {error.includes("Limite") && (
                <Link href="/plans" className="ml-2 underline text-amber-300">
                  Voir les plans →
                </Link>
              )}
            </div>
          )}

          <div className="glass-card rounded-[2rem] p-6 md:p-8 space-y-6">
            <div>
              <label className="mb-1.5 block text-sm" style={{ color: "var(--text-muted)" }}>
                Titre du service *
              </label>
              <input
                type="text"
                name="title"
                required
                className="form-input"
                placeholder="Ex: Création de logo, Livraison de colis…"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm" style={{ color: "var(--text-muted)" }}>
                Description détaillée *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="form-input resize-y"
                placeholder="Décrivez exactement ce que vous proposez…"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm" style={{ color: "var(--text-muted)" }}>
                  Catégorie *
                </label>
                <select name="category" required className="form-input">
                  <option value="tech">Compétences Tech / Design</option>
                  <option value="time">Services de Temps / Manuels</option>
                  <option value="marketing">Marketing / Communication</option>
                  <option value="general">Général</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm" style={{ color: "var(--text-muted)" }}>
                  Prix (FCFA) — 0 = Troc
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  defaultValue="0"
                  className="form-input"
                  placeholder="Ex: 5000"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPremium"
                name="isPremium"
                className="h-4 w-4 rounded border-violet-400 accent-violet-500"
              />
              <label htmlFor="isPremium" className="text-sm" style={{ color: "var(--text)" }}>
                Service <span className="text-cyan-400 font-medium">Premium</span>{" "}
                <span style={{ color: "var(--text-muted)" }}>
                  (visible en tête de marketplace — nécessite plan Pro ou Business)
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-4 text-base disabled:opacity-70"
            >
              {loading ? "Création…" : "Publier le service"}
            </button>
            <Link
              href="/dashboard"
              className="rounded-full border px-8 py-4 text-center font-medium hover:border-violet-400/60 hover:bg-violet-400/10 transition-all"
              style={{ borderColor: "var(--line)", color: "var(--text)" }}
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
