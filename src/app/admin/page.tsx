import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_COLORS: Record<string, string> = {
  free: "text-slate-400 bg-slate-400/10 border-slate-400/25",
  pro: "text-violet-400 bg-violet-400/10 border-violet-400/25",
  business: "text-cyan-400 bg-cyan-400/10 border-cyan-400/25",
};

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (!user.isAdmin) redirect("/");

  const [totalUsers, totalServices, activeSubscriptions, recentUsers, recentServices, subscriptionRevenue, planBreakdown] =
    await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          isAdmin: true,
          createdAt: true,
          _count: { select: { services: true } },
        },
      }),
      prisma.service.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { user: { select: { name: true } } },
      }),
      prisma.subscription.aggregate({
        _sum: { price: true },
        where: { status: "active" },
      }),
      prisma.user.groupBy({
        by: ["plan"],
        _count: { plan: true },
      }),
    ]);

  const totalRevenue = subscriptionRevenue._sum.price ?? 0;

  const stats = [
    {
      label: "Utilisateurs inscrits",
      value: totalUsers.toLocaleString(),
      icon: "👥",
      color: "from-violet-500 to-violet-700",
      glow: "rgba(124,58,237,0.25)",
    },
    {
      label: "Services créés",
      value: totalServices.toLocaleString(),
      icon: "📦",
      color: "from-cyan-500 to-sky-600",
      glow: "rgba(34,211,238,0.25)",
    },
    {
      label: "Abonnements actifs",
      value: activeSubscriptions.toLocaleString(),
      icon: "💳",
      color: "from-emerald-500 to-teal-600",
      glow: "rgba(16,185,129,0.25)",
    },
    {
      label: "Revenus (FCFA)",
      value: totalRevenue.toLocaleString(),
      icon: "💰",
      color: "from-amber-500 to-orange-500",
      glow: "rgba(245,158,11,0.25)",
    },
  ];

  return (
    <div className="page-shell py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.3em] text-amber-300 mb-3">
          ⚙ Espace Admin
        </div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--heading)" }}>
          Tableau de bord Admin
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Vue d&apos;ensemble en temps réel de la plateforme Skill-Trade
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative rounded-2xl border overflow-hidden p-5"
            style={{
              borderColor: "var(--line)",
              background: "var(--panel)",
              boxShadow: `0 0 40px ${stat.glow}`,
            }}
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
            />
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-black" style={{ color: "var(--heading)" }}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Plan Breakdown */}
      <div className="glass-card rounded-[2rem] p-6">
        <h2 className="text-lg font-semibold mb-5" style={{ color: "var(--heading)" }}>
          Répartition des plans
        </h2>
        <div className="flex flex-col gap-3">
          {planBreakdown
            .sort((a, b) => b._count.plan - a._count.plan)
            .map((p) => {
              const pct = totalUsers > 0 ? (p._count.plan / totalUsers) * 100 : 0;
              return (
                <div key={p.plan} className="flex items-center gap-4">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium w-20 text-center ${
                      PLAN_COLORS[p.plan] ?? "text-slate-400"
                    }`}
                  >
                    {p.plan.charAt(0).toUpperCase() + p.plan.slice(1)}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm w-12 text-right" style={{ color: "var(--text-muted)" }}>
                    {p._count.plan}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Tables row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="glass-card rounded-[2rem] overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: "var(--line)" }}>
            <h2 className="text-lg font-semibold" style={{ color: "var(--heading)" }}>
              Utilisateurs récents
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--line)" }}>
                  {["Nom", "Email", "Plan", "Services"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b last:border-0 hover:bg-white/3 transition-colors"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <td className="px-4 py-3" style={{ color: "var(--text)" }}>
                      <div className="flex items-center gap-2">
                        {u.name}
                        {u.isAdmin && (
                          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[10px] text-amber-300">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                          PLAN_COLORS[u.plan] ?? "text-slate-400"
                        }`}
                      >
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: "var(--text-muted)" }}>
                      {u._count.services}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Services */}
        <div className="glass-card rounded-[2rem] overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: "var(--line)" }}>
            <h2 className="text-lg font-semibold" style={{ color: "var(--heading)" }}>
              Services récents
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--line)" }}>
                  {["Service", "Créateur", "Prix", "Statut"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentServices.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b last:border-0 hover:bg-white/3 transition-colors"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <td className="px-4 py-3 max-w-[140px] truncate" style={{ color: "var(--text)" }}>
                      {s.title}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      {s.user.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-cyan-400">
                      {s.price > 0 ? `${s.price.toLocaleString()} FCFA` : "Troc"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${
                          s.status === "active"
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/25"
                            : "text-amber-400 bg-amber-400/10 border-amber-400/25"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
