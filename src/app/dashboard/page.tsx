import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_LABELS: Record<string, string> = {
  free: "Gratuit",
  pro: "Pro",
  business: "Business",
};

const PLAN_LIMITS: Record<string, number | string> = {
  free: 1,
  pro: 10,
  business: "∞",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
  paused: "text-amber-400 bg-amber-400/10 border-amber-400/25",
  pending: "text-sky-400 bg-sky-400/10 border-sky-400/25",
};

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const [services, cv] = await Promise.all([
    prisma.service.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.cV.findUnique({ where: { userId: user.id } }),
  ]);

  const serviceLimit = PLAN_LIMITS[user.plan] ?? 1;
  const usedServices = services.length;
  const canCreate =
    user.plan === "business" ||
    (typeof serviceLimit === "number" && usedServices < serviceLimit);

  const planExpiryStr = user.planExpiresAt
    ? new Date(user.planExpiresAt).toLocaleDateString("fr-FR")
    : null;

  return (
    <div className="page-shell py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
            Tableau de bord
          </p>
          <h1 className="mt-1 text-3xl font-bold" style={{ color: "var(--heading)" }}>
            Bonjour, {user.name.split(" ")[0]} 👋
          </h1>
        </div>
        <Link
          href="/plans"
          className="rounded-full border border-violet-400/40 bg-violet-400/10 px-5 py-2 text-sm font-medium text-violet-300 hover:bg-violet-400/20"
        >
          Voir les plans
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Plan */}
        <div className="stat-card">
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
            Plan actuel
          </p>
          <p className="mt-2 text-2xl font-bold" style={{ color: "var(--heading)" }}>
            {PLAN_LABELS[user.plan] ?? user.plan}
          </p>
          {planExpiryStr && (
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              Expire le {planExpiryStr}
            </p>
          )}
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium border ${
              user.plan === "business"
                ? "badge-plan-business"
                : user.plan === "pro"
                ? "badge-plan-pro"
                : "badge-plan-free"
            }`}
          >
            {PLAN_LABELS[user.plan]}
          </span>
        </div>

        {/* Services */}
        <div className="stat-card">
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
            Services créés
          </p>
          <p className="mt-2 text-2xl font-bold" style={{ color: "var(--heading)" }}>
            {usedServices}
            <span className="text-base font-normal ml-1" style={{ color: "var(--text-muted)" }}>
              / {serviceLimit}
            </span>
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
              style={{
                width:
                  user.plan === "business"
                    ? "100%"
                    : `${Math.min((usedServices / (serviceLimit as number)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Tokens */}
        <div className="stat-card">
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
            Skill-Tokens
          </p>
          <p className="mt-2 text-2xl font-bold" style={{ color: "var(--heading)" }}>
            {user.tokens}
          </p>
          <Link
            href="/wallet"
            className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300"
          >
            Recharger →
          </Link>
        </div>

        {/* CV */}
        <div className="stat-card">
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
            Mon CV
          </p>
          <p className="mt-2 text-base font-semibold" style={{ color: "var(--heading)" }}>
            {cv ? "✅ CV enregistré" : "❌ Pas encore de CV"}
          </p>
          {cv?.pdfPath && (
            <a
              href={cv.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-xs text-cyan-400 hover:text-cyan-300"
            >
              Voir le PDF →
            </a>
          )}
          <Link
            href="/dashboard/cv"
            className="mt-3 inline-block text-xs text-violet-400 hover:text-violet-300"
          >
            {cv ? "Modifier →" : "Créer →"}
          </Link>
        </div>
      </div>

      {/* Services list */}
      <div className="glass-card rounded-[2rem] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ color: "var(--heading)" }}>
            Mes services
          </h2>
          {canCreate ? (
            <Link
              href="/services/create"
              className="btn-primary text-sm px-5 py-2"
            >
              + Nouveau service
            </Link>
          ) : (
            <Link
              href="/plans"
              className="rounded-full border border-amber-400/40 bg-amber-400/10 px-5 py-2 text-sm font-medium text-amber-300 hover:bg-amber-400/20"
            >
              ⬆ Upgrader
            </Link>
          )}
        </div>

        {!canCreate && (
          <div className="mb-5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-300">
            Limite atteinte. Passez à <strong>Pro</strong> (1 000 FCFA/mois) pour jusqu&apos;à 10 services, ou{" "}
            <strong>Business</strong> (3 000 FCFA/mois) pour des services illimités.
          </div>
        )}

        {services.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-lg font-medium" style={{ color: "var(--heading)" }}>
              Aucun service pour l&apos;instant
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Créez votre premier service et commencez à proposer vos compétences.
            </p>
            <Link href="/services/create" className="btn-primary mt-6">
              Créer mon premier service
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border p-5 transition-all hover:-translate-y-1"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--panel)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                      STATUS_COLORS[service.status] ?? "text-slate-400 bg-white/5 border-white/10"
                    }`}
                  >
                    {service.status === "active" ? "Actif" : service.status === "paused" ? "En pause" : service.status}
                  </span>
                  {service.isPremium && (
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] text-cyan-300">
                      Premium
                    </span>
                  )}
                </div>
                <h3 className="font-semibold" style={{ color: "var(--heading)" }}>
                  {service.title}
                </h3>
                <p className="mt-1 text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  {service.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                  <span>{service.category}</span>
                  <span className="font-semibold text-cyan-400">
                    {service.price > 0 ? `${service.price.toLocaleString()} FCFA` : "Troc"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
