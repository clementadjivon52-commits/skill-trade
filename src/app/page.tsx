import Image from "next/image";
import Link from "next/link";
import {
  getFeaturedUsers,
  getLandingPreviewOffers,
  getLandingStats,
} from "@/lib/site-data";

export default async function Home() {
  const [featuredUsers, offers, stats] = await Promise.all([
    getFeaturedUsers(),
    getLandingPreviewOffers(),
    getLandingStats(),
  ]);

  return (
    <div className="page-shell space-y-10 py-10 md:py-14">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card grid-glow rounded-[2rem] p-8 md:p-10">
          <div className="mb-6 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.32em] text-cyan-200">
            Lome youth exchange network
          </div>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Echange tes talents, booste ta carriere.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Une plateforme de troc de competences et de services pour creer,
            livrer, apprendre et gagner des Skill-Tokens sans sortir de
            l&apos;ecosysteme local.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/auth/register"
              className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 text-center font-semibold text-white shadow-[0_12px_40px_rgba(124,58,237,0.35)] hover:scale-[1.02]"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/match"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-center font-semibold text-slate-100 hover:border-cyan-300/60 hover:bg-cyan-300/10"
            >
              Voir les meilleurs matchs
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              [stats.activeOffers, "Offres actives"],
              [stats.responseRate, "Reponses sous 24h"],
              [stats.tokenVolume, "Skill-Tokens en circulation"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-1 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card card-hover overflow-hidden rounded-[2rem]">
          <div className="relative h-full min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80"
              alt="Jeunes qui collaborent"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="rounded-[1.5rem] border border-white/15 bg-slate-950/55 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
                  Hero Mission
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  Des profils tech et services qui se connectent en quelques
                  clics.
                </p>
                <Link
                  href="/wallet"
                  className="mt-5 inline-flex rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-100 hover:bg-violet-500/25"
                >
                  Recharger des tokens
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card rounded-[2rem] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Profils en vue
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Talents verifies
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400/60"
            >
              Explorer
            </Link>
          </div>

          <div className="grid gap-4">
            {featuredUsers.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}`}
                className="card-hover flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 hover:border-violet-400/40"
              >
                <div className="relative h-18 w-18 overflow-hidden rounded-2xl">
                  <Image
                    src={user.photo}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-white">
                      {user.name}
                    </p>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                      {user.trustBadge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{user.role}</p>
                  <p className="mt-3 text-sm text-slate-300">{user.heroOffer}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {offers.map((offer, index) => {
            const owner = offer.owner ?? {
              id: "marketplace",
              name: "Equipe SKILL-TRADE",
            };

            return (
              <article
                key={offer.id}
                className={`glass-card card-hover rounded-[2rem] p-5 ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div className="relative mb-5 h-44 overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-slate-950/75 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200">
                    {offer.typeLabel}
                  </div>
                </div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                  Offre active
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {offer.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {offer.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                  <span>{owner.name}</span>
                  <span>{offer.reward}</span>
                </div>
                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/offers/${offer.id}`}
                    className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-3 text-center font-semibold text-white"
                  >
                    Voir l&apos;offre
                  </Link>
                  <Link
                    href={`/profile/${owner.id}`}
                    className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 hover:border-cyan-400/60"
                  >
                    Profil
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
