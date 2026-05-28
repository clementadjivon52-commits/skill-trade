"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthButtonsProps = {
  isLoggedIn: boolean;
};

export default function AuthButtons({ isLoggedIn }: AuthButtonsProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/services/create"
          className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:scale-[1.02]"
        >
          Créer un service
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-300"
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
        className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400/60 hover:bg-cyan-400/10"
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
