import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getUser } from "@/lib/auth";
import AuthButtons from "@/components/AuthButtons";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "SKILL-TRADE",
  description:
    "Plateforme de troc de competences et services pour les jeunes de Lome.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const cookieStore = await cookies();

  const rawTheme = cookieStore.get("theme")?.value ?? user?.theme ?? "dark";
  const initialTheme = rawTheme === "light" ? "light" : "dark";

  const rawLang = cookieStore.get("lang")?.value ?? user?.language ?? "fr";
  const initialLang: "fr" | "en" = rawLang === "en" ? "en" : "fr";

  return (
    <html lang={initialLang} data-theme={initialTheme} className="h-full antialiased">
      <body className="min-h-full">
        <ThemeProvider initialTheme={initialTheme}>
          <LanguageProvider initialLang={initialLang}>
            <div className="relative min-h-screen overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:90px_90px] opacity-30" />
              <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-slate-950/60 backdrop-blur-xl">
                <div className="page-shell flex items-center justify-between py-4">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-400 text-lg font-bold text-white shadow-[0_0_40px_rgba(124,58,237,0.35)]">
                      ST
                    </div>
                    <div>
                      <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">
                        Skill-Trade
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Troc de talents et services à Lomé
                      </p>
                    </div>
                  </Link>

                  <nav className="hidden items-center gap-3 md:flex">
                    {[
                      ["/marketplace", "Marketplace"],
                      ["/match", "Match"],
                      ["/wallet", "Wallet"],
                      ...(user ? [["/dashboard", "Dashboard"]] : []),
                    ].map(([href, label]) => (
                      <Link
                        key={href}
                        href={href}
                        className="pill-link rounded-full border border-[var(--line)] bg-white/5 px-4 py-2 text-sm hover:border-cyan-400/60 hover:bg-cyan-400/10"
                        style={{ color: "var(--text)" }}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>

                  <AuthButtons
                    isLoggedIn={!!user}
                    isAdmin={user?.isAdmin ?? false}
                    userName={user?.name ?? undefined}
                    userPhoto={user?.photo ?? undefined}
                  />
                </div>
              </header>

              <main className="relative z-10">{children}</main>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
