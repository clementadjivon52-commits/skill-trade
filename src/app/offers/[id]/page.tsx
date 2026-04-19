import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMissionById } from "@/lib/site-data";

type OfferDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const { id } = await params;
  const offer = await getMissionById(id);

  if (!offer) {
    notFound();
  }

  const owner = offer.owner;

  if (!owner) {
    notFound();
  }

  return (
    <div className="page-shell space-y-8 py-10 md:py-14">
      <section className="glass-card overflow-hidden rounded-[2rem]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[420px]">
            <Image
              src={offer.image}
              alt={offer.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          </div>
          <div className="p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">
              {offer.typeLabel}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white">
              {offer.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              {offer.description}
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
                Recompense
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {offer.reward}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/match?offer=${offer.id}`}
                className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-5 py-3 text-center font-semibold text-white"
              >
                Lancer ce match
              </Link>
              <Link
                href={`/profile/${owner.id}`}
                className="rounded-full border border-white/10 px-5 py-3 text-center font-medium text-slate-200 hover:border-cyan-400/60"
              >
                Voir le profil
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[2rem] p-6 md:p-8">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
          Propose par
        </p>
        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-3xl">
              <Image src={owner.photo} alt={owner.name} fill className="object-cover" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{owner.name}</p>
              <p className="text-slate-400">
                {owner.role} · {owner.location}
              </p>
              <p className="mt-2 text-sm text-cyan-200">{owner.trustBadge}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/contact/${owner.id}?offer=${offer.id}`}
              className="rounded-full border border-violet-400/25 bg-violet-500/10 px-5 py-3 text-center font-medium text-violet-100 hover:bg-violet-500/20"
            >
              Contacter pour cette offre
            </Link>
            <Link
              href="/marketplace"
              className="rounded-full border border-white/10 px-5 py-3 text-center font-medium text-slate-200 hover:border-cyan-400/60"
            >
              Retour au marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
