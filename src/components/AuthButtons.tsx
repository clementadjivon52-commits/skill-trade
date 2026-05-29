"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/components/LanguageProvider";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  userName?: string;
  userPhoto?: string;
};

export default function AuthButtons({
  isLoggedIn,
  isAdmin,
  userName,
  userPhoto,
}: AuthButtonsProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLang = () => {
    setLang(lang === "fr" ? "en" : "fr");
  };

  const settingsControls = (
    <div className="flex items-center gap-2 border-r border-[var(--line)] pr-4 mr-2">
      {/* Language Selector Button */}
      <button
        onClick={toggleLang}
        className="flex h-9 px-3 items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 active:scale-95 cursor-pointer"
        style={{ color: "var(--text)" }}
        title={lang === "fr" ? "Switch to English" : "Passer en Français"}
      >
        <span className="text-sm leading-none">{lang === "fr" ? "🇫🇷" : "🇬🇧"}</span>
        <span style={{ color: "var(--text-muted)" }}>{lang.toUpperCase()}</span>
      </button>

      {/* Theme Selector Button */}
      <button
        onClick={toggleTheme}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white/5 text-base transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 active:scale-95 cursor-pointer"
        title={theme === "dark" ? t("settings.light") : t("settings.dark")}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );

  return (
    <div className="flex items-center gap-2 relative" ref={dropdownRef}>
      {settingsControls}

      {isLoggedIn ? (
        <div className="relative flex items-center gap-3">
          {/* Quick Create Service Button */}
          <Link
            href="/services/create"
            className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:scale-[1.02] transition-transform"
          >
            + {t("nav.createService") === "Créer un service" ? "Service" : "Service"}
          </Link>

          {/* User Account Pill Dropdown Trigger */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/5 p-1 pr-3.5 hover:border-violet-400/50 hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            aria-expanded={dropdownOpen}
          >
            <img
              src={userPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
              alt={userName || "User avatar"}
              className="h-8 w-8 rounded-full border border-violet-500/50 object-cover"
              onError={(e) => {
                // Fallback avatar if user uploaded an invalid URL
                e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80";
              }}
            />
            <span className="text-xs font-semibold max-w-[90px] truncate hidden xs:inline-block" style={{ color: "var(--text)" }}>
              {userName ? userName.split(" ")[0] : "Compte"}
            </span>
            <span className="text-[10px] opacity-60 leading-none transition-transform duration-200" style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)" }}>
              ▼
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[var(--line)] p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              style={{
                boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 50px 0 rgba(124, 58, 237, 0.1)",
                background: "var(--panel)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              {/* Header */}
              <div className="px-3 py-2 border-b border-[var(--line)] mb-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                  {lang === "fr" ? "Mon Espace" : "My Space"}
                </p>
                <p className="text-sm font-bold truncate mt-0.5" style={{ color: "var(--heading)" }}>
                  {userName || "Membre"}
                </p>
              </div>

              {/* Core Links */}
              <div className="space-y-0.5">
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors"
                  style={{ color: "var(--text)" }}
                >
                  <span className="text-sm">📊</span>
                  <span>{t("dashboard.title")}</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors"
                  style={{ color: "var(--text)" }}
                >
                  <span className="text-sm">👤</span>
                  <span>{t("settings.profile")} & {t("settings.theme")}</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-amber-400/10 border border-amber-400/20 text-amber-300 transition-colors"
                  >
                    <span className="text-sm">👑</span>
                    <span>{t("admin.title")}</span>
                  </Link>
                )}

                {/* Mobile-only Nav Links (since center nav is hidden on md) */}
                <div className="md:hidden border-t border-[var(--line)] mt-1.5 pt-1.5 space-y-0.5">
                  <Link
                    href="/marketplace"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors"
                    style={{ color: "var(--text)" }}
                  >
                    <span className="text-sm">💼</span>
                    <span>Marketplace</span>
                  </Link>

                  <Link
                    href="/match"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors"
                    style={{ color: "var(--text)" }}
                  >
                    <span className="text-sm">🤝</span>
                    <span>Matchmaking</span>
                  </Link>

                  <Link
                    href="/wallet"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-white/5 transition-colors"
                    style={{ color: "var(--text)" }}
                  >
                    <span className="text-sm">🪙</span>
                    <span>Wallet</span>
                  </Link>
                  
                  <Link
                    href="/services/create"
                    onClick={() => setDropdownOpen(false)}
                    className="flex sm:hidden items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold bg-gradient-to-r from-violet-600/20 to-cyan-400/20 border border-violet-500/25 text-violet-300 transition-colors"
                  >
                    <span className="text-sm font-bold">+</span>
                    <span>{t("nav.createService")}</span>
                  </Link>
                </div>
              </div>

              {/* Footer / Logout */}
              <div className="border-t border-[var(--line)] mt-1.5 pt-1.5">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold hover:bg-red-500/10 hover:text-red-300 transition-colors text-left cursor-pointer"
                  style={{ color: "var(--text-muted)" }}
                >
                  <span className="text-sm">🚪</span>
                  <span>{t("nav.logout")}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link
            href="/auth/login"
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm hover:border-cyan-400/60 hover:bg-cyan-400/10"
            style={{ color: "var(--text)" }}
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:scale-[1.02]"
          >
            {t("nav.register")}
          </Link>
        </>
      )}
    </div>
  );
}
