"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/components/LanguageProvider";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  isAdmin?: boolean;
};

export default function AuthButtons({ isLoggedIn, isAdmin }: AuthButtonsProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useTranslation();

  const handleLogout = async () => {
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
    <div className="flex items-center gap-2">
      {settingsControls}

      {isLoggedIn ? (
        <>
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400/20"
            >
              👑 {t("nav.admin")}
            </Link>
          )}
          <Link
            href="/settings"
            className="rounded-full border border-[var(--line)] px-3 py-2 text-sm hover:border-violet-400/60 hover:bg-violet-400/10"
            style={{ color: "var(--text-muted)" }}
            title={t("nav.settings")}
          >
            ⚙
          </Link>
          <Link
            href="/services/create"
            className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:scale-[1.02]"
          >
            + {t("nav.marketplace") === "Marketplace" ? "Service" : "Service"}
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
            style={{ color: "var(--text-muted)" }}
          >
            {t("nav.logout")}
          </button>
        </>
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
