"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    price: 0,
    color: "from-slate-600 to-slate-500",
    glowColor: "rgba(100,116,139,0.2)",
    borderColor: "rgba(100,116,139,0.3)",
    badge: "",
    features: [
      "1 service",
      "Dashboard personnel",
      "CV visible & PDF upload",
      "Accès à la marketplace",
      "Matchmaking",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 1000,
    color: "from-violet-600 to-violet-500",
    glowColor: "rgba(124,58,237,0.3)",
    borderColor: "rgba(124,58,237,0.5)",
    badge: "🔥 Populaire",
    features: [
      "Jusqu'à 10 services",
      "Badge Pro prioritaire",
      "Services payants",
      "Support prioritaire",
      "Tout le plan Gratuit",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 3000,
    color: "from-cyan-500 to-sky-500",
    glowColor: "rgba(34,211,238,0.25)",
    borderColor: "rgba(34,211,238,0.45)",
    badge: "⭐ Premium",
    features: [
      "Services illimités",
      "Analytics avancés",
      "Mise en avant premium",
      "Support dédié",
      "Tout le plan Pro",
    ],
  },
];

export default function PlansClient({
  currentPlan,
  isLoggedIn,
}: {
  currentPlan: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!isLoggedIn) {
      router.push("/auth/register");
      return;
    }
    if (planId === "free") return;
    setLoading(planId);
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      if (res.ok) {
        setSuccess(planId);
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="page-shell py-14 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-violet-300">
          Nos offres
        </div>
        <h1 className="text-4xl font-bold md:text-5xl" style={{ color: "var(--heading)" }}>
          Choisissez votre plan
        </h1>
        <p className="max-w-xl mx-auto text-lg leading-8" style={{ color: "var(--text-muted)" }}>
          Commencez gratuitement, évoluez à votre rythme.
          Tous les plans incluent l&apos;accès à la marketplace.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isSucceeded = success === plan.id;

          return (
            <div
              key={plan.id}
              className="relative flex flex-col rounded-[2rem] border p-8 transition-all duration-300 hover:-translate-y-2"
              style={{
                borderColor: isCurrent ? plan.borderColor : "var(--line)",
                background: "var(--panel)",
                boxShadow: isCurrent
                  ? `0 0 60px ${plan.glowColor}, 0 20px 60px rgba(0,0,0,0.2)`
                  : "0 8px 40px rgba(0,0,0,0.1)",
              }}
            >
              {/* Glow top border */}
              {plan.price > 0 && (
                <div
                  className="absolute inset-x-0 top-0 h-px rounded-t-[2rem]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${plan.borderColor}, transparent)`,
                  }}
                />
              )}

              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <div
                  className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${plan.color} px-4 py-2 text-sm font-bold text-white mb-4`}
                >
                  {plan.name}
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-black" style={{ color: "var(--heading)" }}>
                    {plan.price === 0 ? "0" : plan.price.toLocaleString()}
                  </span>
                  <span className="text-lg font-medium mb-1" style={{ color: "var(--text-muted)" }}>
                    {plan.price > 0 ? " FCFA/mois" : " FCFA"}
                  </span>
                </div>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm" style={{ color: "var(--text)" }}>
                    <span className="text-emerald-400 font-bold">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent || loading === plan.id}
                className={`w-full rounded-full py-3 text-sm font-semibold transition-all ${
                  isCurrent
                    ? "border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 cursor-default"
                    : plan.price === 0
                    ? "border border-[var(--line)] bg-white/5 hover:border-violet-400/40 hover:bg-violet-400/10"
                    : `bg-gradient-to-r ${plan.color} text-white hover:scale-[1.02] shadow-lg`
                }`}
                style={
                  isCurrent
                    ? {}
                    : plan.price > 0
                    ? { boxShadow: `0 4px 20px ${plan.glowColor}` }
                    : {}
                }
              >
                {isSucceeded
                  ? "✅ Activé !"
                  : loading === plan.id
                  ? "Activation…"
                  : isCurrent
                  ? "Plan actuel ✓"
                  : plan.price === 0
                  ? "Commencer gratuitement"
                  : `Souscrire — ${plan.price.toLocaleString()} FCFA/mois`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison table */}
      <div className="glass-card rounded-[2rem] overflow-hidden">
        <div className="p-6 border-b" style={{ borderColor: "var(--line)" }}>
          <h2 className="text-xl font-semibold" style={{ color: "var(--heading)" }}>
            Comparatif détaillé
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--line)" }}>
                <th className="text-left p-4" style={{ color: "var(--text-muted)" }}>Fonctionnalité</th>
                {PLANS.map((p) => (
                  <th key={p.id} className="text-center p-4 font-semibold" style={{ color: "var(--heading)" }}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Nombre de services", "1", "10", "Illimité"],
                ["Dashboard personnel", "✅", "✅", "✅"],
                ["Gestion CV + PDF", "✅", "✅", "✅"],
                ["Marketplace", "✅", "✅", "✅"],
                ["Matchmaking", "✅", "✅", "✅"],
                ["Services payants", "❌", "✅", "✅"],
                ["Badge prioritaire", "❌", "✅ Pro", "✅ Business"],
                ["Support prioritaire", "❌", "✅", "✅"],
                ["Analytics avancés", "❌", "❌", "✅"],
                ["Mise en avant premium", "❌", "❌", "✅"],
              ].map(([feature, ...vals]) => (
                <tr key={feature} className="border-b last:border-0" style={{ borderColor: "var(--line)" }}>
                  <td className="p-4" style={{ color: "var(--text)" }}>{feature}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="p-4 text-center" style={{ color: "var(--text-muted)" }}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
