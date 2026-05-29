"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/components/LanguageProvider";
import Link from "next/link";

type User = {
  name: string;
  bio: string;
  whatsapp: string;
  photo: string;
  plan: string;
  language: string;
  theme: string;
};

const PLAN_LABELS: Record<string, string> = {
  free: "Gratuit",
  pro: "Pro",
  business: "Business",
};

const SECTIONS = [
  { id: "profile", icon: "👤", label: "Profil" },
  { id: "appearance", icon: "🎨", label: "Apparence" },
  { id: "plan", icon: "💎", label: "Mon plan" },
];

export default function SettingsClient({ user }: { user: User }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useTranslation();
  const [section, setSection] = useState("profile");

  // Profile form
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [whatsapp, setWhatsapp] = useState(user.whatsapp);
  const [photo, setPhoto] = useState(user.photo);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, whatsapp, photo }),
      });
      setSaved(true);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
          Compte
        </p>
        <h1 className="mt-1 text-3xl font-bold" style={{ color: "var(--heading)" }}>
          Paramètres
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <nav className="space-y-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`sidebar-link w-full text-left ${section === s.id ? "active" : ""}`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div>
          {/* PROFILE */}
          {section === "profile" && (
            <div className="glass-card rounded-[2rem] p-8 space-y-6">
              <h2 className="text-xl font-semibold" style={{ color: "var(--heading)" }}>
                Informations de profil
              </h2>

              {/* Avatar preview */}
              <div className="flex items-center gap-4">
                <div
                  className="h-16 w-16 rounded-2xl overflow-hidden border"
                  style={{ borderColor: "var(--line)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=150&q=80"}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--heading)" }}>{name}</p>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Votre photo de profil</p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    Nom complet
                  </label>
                  <input
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    WhatsApp
                  </label>
                  <input
                    className="form-input"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+228 90 00 00 00"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    Photo de profil (URL)
                  </label>
                  <input
                    className="form-input"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    Biographie
                  </label>
                  <textarea
                    className="form-input min-h-[80px] resize-y"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Parlez un peu de vous…"
                  />
                </div>
              </div>

              <button onClick={handleSaveProfile} disabled={saving} className="btn-primary">
                {saving ? "Enregistrement…" : saved ? "✅ Enregistré !" : "Enregistrer les modifications"}
              </button>
            </div>
          )}

          {/* APPEARANCE */}
          {section === "appearance" && (
            <div className="glass-card rounded-[2rem] p-8 space-y-8">
              <h2 className="text-xl font-semibold" style={{ color: "var(--heading)" }}>
                Apparence
              </h2>

              {/* Theme */}
              <div>
                <p className="font-medium mb-4" style={{ color: "var(--text)" }}>
                  🌓 Thème de l&apos;interface
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {(["dark", "light"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className="relative flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all"
                      style={{
                        borderColor: theme === t ? "var(--violet)" : "var(--line)",
                        background: theme === t ? "rgba(124,58,237,0.1)" : "var(--panel)",
                        boxShadow: theme === t ? "0 0 20px rgba(124,58,237,0.2)" : "none",
                      }}
                    >
                      <div className="text-3xl">{t === "dark" ? "🌙" : "☀️"}</div>
                      <div
                        className="rounded-xl border w-full h-12 overflow-hidden"
                        style={{ borderColor: "var(--line)" }}
                      >
                        {/* Mini theme preview */}
                        <div
                          className="h-full w-full flex items-center justify-center gap-1.5"
                          style={{
                            background: t === "dark" ? "#0f172a" : "#f8fafc",
                          }}
                        >
                          <div className="h-2 w-10 rounded-full" style={{ background: t === "dark" ? "#334155" : "#cbd5e1" }} />
                          <div className="h-2 w-6 rounded-full bg-violet-500" />
                        </div>
                      </div>
                      <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        {t === "dark" ? "Sombre" : "Clair"}
                      </span>
                      {theme === t && (
                        <span className="absolute top-3 right-3 text-xs text-violet-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <p className="font-medium mb-4" style={{ color: "var(--text)" }}>
                  🌍 Langue
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {([["fr", "Français", "🇫🇷"], ["en", "English", "🇬🇧"]] as const).map(
                    ([l, label, flag]) => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className="flex items-center gap-3 rounded-2xl border p-4 transition-all"
                        style={{
                          borderColor: lang === l ? "var(--cyan)" : "var(--line)",
                          background: lang === l ? "rgba(34,211,238,0.08)" : "var(--panel)",
                        }}
                      >
                        <span className="text-2xl">{flag}</span>
                        <span className="font-medium text-sm" style={{ color: "var(--text)" }}>
                          {label}
                        </span>
                        {lang === l && (
                          <span className="ml-auto text-cyan-400 text-xs">✓</span>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PLAN */}
          {section === "plan" && (
            <div className="glass-card rounded-[2rem] p-8 space-y-6">
              <h2 className="text-xl font-semibold" style={{ color: "var(--heading)" }}>
                Mon plan actuel
              </h2>

              <div
                className="rounded-2xl border p-6"
                style={{
                  borderColor:
                    user.plan === "business"
                      ? "rgba(34,211,238,0.35)"
                      : user.plan === "pro"
                      ? "rgba(124,58,237,0.35)"
                      : "var(--line)",
                  background:
                    user.plan === "business"
                      ? "rgba(34,211,238,0.06)"
                      : user.plan === "pro"
                      ? "rgba(124,58,237,0.06)"
                      : "var(--panel)",
                }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                        user.plan === "business"
                          ? "badge-plan-business"
                          : user.plan === "pro"
                          ? "badge-plan-pro"
                          : "badge-plan-free"
                      }`}
                    >
                      {PLAN_LABELS[user.plan] ?? user.plan}
                    </span>
                    <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
                      {user.plan === "free"
                        ? "1 service inclus. Passez à Pro pour plus."
                        : user.plan === "pro"
                        ? "Jusqu'à 10 services. Passez à Business pour des services illimités."
                        : "Services illimités. Vous êtes au maximum !"}
                    </p>
                  </div>
                  {user.plan !== "business" && (
                    <Link href="/plans" className="btn-primary text-sm px-6 py-3">
                      ⬆ Upgrader
                    </Link>
                  )}
                </div>
              </div>

              <div
                className="rounded-xl border p-4 text-sm"
                style={{ borderColor: "var(--line)", color: "var(--text-muted)" }}
              >
                <p>
                  💡 Les paiements sont simulés. Dans une version production, intégrez un fournisseur comme{" "}
                  <strong>Paydunya</strong> ou <strong>Stripe</strong> pour le traitement réel.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
