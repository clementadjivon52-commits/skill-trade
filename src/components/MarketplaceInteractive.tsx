"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  photo: string;
  role: string;
  location: string;
  bio: string;
  whatsapp: string;
  trustBadge: string;
  availability: string;
  heroOffer: string;
  tokens: number;
  skills: string[];
  timeServices: string[];
  portfolio: { title: string; image: string }[];
};

type Offer = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  reward: string;
  owner?: User;
  typeLabel: string;
};

type MarketplaceInteractiveProps = {
  initialOffers: Offer[];
  initialType?: string;
};

const filters = [
  { label: "Tout voir", value: "all", desc: "Tous les échanges actifs" },
  { label: "Compétences Tech", value: "tech", desc: "Dev, design, marketing" },
  { label: "Services de Temps", value: "time", desc: "Livraison, courses, assistance" },
];

export default function MarketplaceInteractive({
  initialOffers,
  initialType = "all",
}: MarketplaceInteractiveProps) {
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Instant filtering on clientside state
  const filteredOffers = initialOffers.filter((offer) => {
    // 1. Filter by category
    const categoryMatch = selectedType === "all" || offer.category === selectedType;

    // 2. Filter by search query
    const q = searchQuery.toLowerCase().trim();
    if (!q) return categoryMatch;

    const matchesSearch =
      offer.title.toLowerCase().includes(q) ||
      offer.description.toLowerCase().includes(q) ||
      offer.reward.toLowerCase().includes(q) ||
      (offer.owner && offer.owner.name.toLowerCase().includes(q)) ||
      (offer.owner && offer.owner.location.toLowerCase().includes(q)) ||
      (offer.owner && offer.owner.role.toLowerCase().includes(q));

    return categoryMatch && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search & Categories Hero panel */}
      <section className="glass-card grid gap-6 rounded-[2rem] p-6 md:p-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">
              Marketplace
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-white leading-tight md:text-5xl">
              Le cœur du troc de Lomé.
            </h1>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-300">
              Recherchez des compétences tech ou proposez des services de temps, et matchez instantanément avec la communauté locale.
            </p>
            
            {/* Highly Visible Action Buttons to Create Service / Manage Dashboard */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/services/create"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 font-bold text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:scale-[1.03] transition-all text-xs uppercase tracking-wider"
              >
                <span className="text-sm font-extrabold">+</span> Proposer un Service
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-200 hover:border-cyan-400/60 hover:bg-white/10 transition-all text-xs uppercase tracking-wider"
              >
                📊 Mon Tableau de Bord
              </Link>
            </div>
          </div>

          {/* Premium search bar with dynamic icons */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher logo, cours, livraison, Komi..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-4 pl-12 pr-5 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Category cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {filters.map((filter) => {
            const isActive = filter.value === selectedType;
            return (
              <button
                key={filter.value}
                onClick={() => {
                  startTransition(() => {
                    setSelectedType(filter.value);
                  });
                }}
                className={`rounded-[1.5rem] border text-left p-5 transition-all cursor-pointer ${
                  isActive
                    ? "border-cyan-400/60 bg-cyan-400/10 text-white shadow-[0_10px_30px_rgba(34,211,238,0.15)] scale-[1.02]"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-violet-400/40 hover:scale-[1.01]"
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  Filtre
                </p>
                <p className="mt-2.5 text-lg font-bold text-white tracking-wide">{filter.label}</p>
                <p className="mt-2 text-xs text-slate-400 leading-normal">
                  {filter.desc}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Offers listings with transition animation state */}
      <div className={`transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}>
        {filteredOffers.length === 0 ? (
          <div className="glass-card rounded-[2rem] p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 border border-white/10 text-slate-400">
              🔍
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">Aucun résultat trouvé</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
              Nous n&apos;avons trouvé aucun service correspondant à &quot;{searchQuery}&quot; pour cette catégorie. Essayez d&apos;élargir vos termes de recherche !
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedType("all");
              }}
              className="mt-6 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-2.5 text-xs font-semibold text-white hover:scale-102"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredOffers.map((offer) => {
              const owner = offer.owner ?? {
                id: "marketplace",
                name: "Équipe SKILL-TRADE",
                role: "Support",
                location: "Lomé",
              };

              return (
                <article
                  key={offer.id}
                  className="glass-card card-hover overflow-hidden rounded-[2rem] flex flex-col justify-between group transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200 backdrop-blur-md">
                      {offer.typeLabel}
                    </div>
                  </div>

                  <div className="space-y-5 p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-slate-400">{owner.location}</p>
                      <h2 className="mt-2 text-xl font-bold text-white group-hover:text-cyan-200 transition-colors line-clamp-1">
                        {offer.title}
                      </h2>
                      <p className="mt-3 text-xs leading-6 text-slate-300 line-clamp-3">
                        {offer.description}
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition-all group-hover:border-violet-500/20">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Proposé par</p>
                        <Link
                          href={`/profile/${owner.id}`}
                          className="mt-2 flex items-center justify-between gap-4 group/owner"
                        >
                          <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white group-hover/owner:text-violet-300 transition-colors line-clamp-1">
                              {owner.name}
                            </p>
                            <p className="text-xs text-slate-400 line-clamp-1">{owner.role}</p>
                          </div>
                          <span className="rounded-full bg-violet-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200 border border-violet-500/10">
                            {offer.reward}
                          </span>
                        </Link>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/offers/${offer.id}`}
                          className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-3 text-center text-xs font-bold text-white shadow-[0_4px_14px_rgba(124,58,237,0.25)] hover:scale-[1.02] transition-all"
                        >
                          Voir l&apos;offre
                        </Link>
                        <Link
                          href={`/profile/${owner.id}`}
                          className="rounded-full border border-white/10 px-4 py-3 text-xs font-semibold text-slate-200 hover:border-cyan-400/60 hover:bg-white/5 transition-all"
                        >
                          Profil
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
