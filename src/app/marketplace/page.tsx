import Image from "next/image";
import Link from "next/link";
import { getMarketplaceOffers } from "@/lib/site-data";

type MarketplacePageProps = {
  searchParams: Promise<{
    type?: string;
  }>;
};

const filters = [
  { label: "Tout voir", value: "all" },
  { label: "Competences Tech", value: "tech" },
  { label: "Services de Temps", value: "time" },
];

export default async function MarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const { type = "all" } = await searchParams;
  const offers = await getMarketplaceOffers(type);

  return (
    <div className="page-shell space-y-8 py-10 md:py-14">
      <section className="glass-card grid gap-6 rounded-[2rem] p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">
            Marketplace
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Le coeur du site pour matcher besoins et talents.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            Filtre les echanges entre competences tech et services de temps,
            puis ouvre un vrai profil ou lance un vrai match.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {filters.map((filter) => {
            const isActive = filter.value === type;
            return (
              <Link
                key={filter.value}
                href={
                  filter.value === "all"
                    ? "/marketplace"
                    : `/marketplace?type=${filter.value}`
                }
                className={`rounded-[1.5rem] border p-5 ${
                  isActive
                    ? "border-cyan-400/60 bg-cyan-400/12 text-white"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/40"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Filtre
                </p>
                <p className="mt-3 text-lg font-semibold">{filter.label}</p>
                <p className="mt-2 text-sm text-slate-400">
                  {filter.value === "tech"
                    ? "Dev, design, marketing"
                    : filter.value === "time"
                      ? "Livraison, courses, assistance"
                      : "Tous les echanges actifs"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => {
          const owner = offer.owner ?? {
            id: "marketplace",
            name: "Equipe SKILL-TRADE",
            role: "Support",
            location: "Lome",
          };

          return (
            <article
              key={offer.id}
              className="glass-card card-hover overflow-hidden rounded-[2rem]"
            >
              <div className="relative h-56">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200">
                  {offer.typeLabel}
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="text-sm text-slate-400">{owner.location}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {offer.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {offer.description}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Propose par</p>
                  <Link
                    href={`/profile/${owner.id}`}
                    className="mt-2 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-lg font-medium text-white">
                        {owner.name}
                      </p>
                      <p className="text-sm text-slate-400">{owner.role}</p>
                    </div>
                    <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-violet-100">
                      {offer.reward}
                    </span>
                  </Link>
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/offers/${offer.id}`}
                    className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-3 text-center font-semibold text-white hover:scale-[1.02]"
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
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
