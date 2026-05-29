"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  isAdmin?: boolean;
};

export default function AuthButtons({ isLoggedIn, isAdmin }: AuthButtonsProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link
            href="/admin"
            className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400/20"
          >
            ⚙ Admin
          </Link>
        )}
        <Link
          href="/settings"
          className="rounded-full border border-[var(--line)] px-3 py-2 text-sm hover:border-violet-400/60 hover:bg-violet-400/10"
          style={{ color: "var(--text-muted)" }}
          title="Paramètres"
        >
          ⚙
        </Link>
        <Link
          href="/services/create"
          className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:scale-[1.02]"
        >
          + Service
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-full border border-[var(--line)] px-4 py-2 text-sm hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-300"
          style={{ color: "var(--text-muted)" }}
        >
          Déconnexion
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/login"
        className="rounded-full border border-[var(--line)] px-4 py-2 text-sm hover:border-cyan-400/60 hover:bg-cyan-400/10"
        style={{ color: "var(--text)" }}
      >
        Connexion
      </Link>
      <Link
        href="/auth/register"
        className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:scale-[1.02]"
      >
        S&apos;inscrire
      </Link>
    </div>
  );
}
