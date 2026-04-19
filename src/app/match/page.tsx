import Image from "next/image";
import Link from "next/link";
import { getMatchQueue, getMissionById } from "@/lib/site-data";

type MatchPageProps = {
  searchParams: Promise<{
    index?: string;
    offer?: string;
  }>;
};

export default async function MatchPage({ searchParams }: MatchPageProps) {
  const { index = "0", offer } = await searchParams;
  const matchQueue = await getMatchQueue();
  const currentIndex = Number.parseInt(index, 10) || 0;
  const safeIndex = Math.min(currentIndex, matchQueue.length - 1);
  const profile = matchQueue[safeIndex];
  const stack = matchQueue.slice(safeIndex, safeIndex + 3);
  const selectedOffer = await getMissionById(offer);

  return (
    <div className="page-shell space-y-8 py-10 md:py-14">
      <section className="glass-card rounded-[2rem] p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-cyan-200">
              Match stack
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
              Swipe visuel, decisions rapides, vraie proposition.
            </h1>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            {selectedOffer
              ? `Offre ciblee : ${selectedOffer.title}`
              : "Mode decouverte pour trouver le bon partenaire"}
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[560px]">
          {stack
            .slice()
            .reverse()
            .map((candidate, reverseIndex) => {
              const depth = stack.length - reverseIndex - 1;
              const isTop = candidate.id === profile.id;

              return (
                <article
                  key={candidate.id}
                  className="glass-card absolute inset-0 card-hover overflow-hidden rounded-[2.2rem]"
                  style={{
                    transform: `translateY(${depth * 18}px) scale(${1 - depth * 0.03}) rotate(${depth * 1.6}deg)`,
                    opacity: 1 - depth * 0.14,
                  }}
                >
                  <div className="relative h-full min-h-[560px]">
                    <Image
                      src={candidate.photo}
                      alt={candidate.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="rounded-[1.8rem] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-xl">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">
                              Compatibilite {candidate.compatibility}%
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold text-white">
                              {candidate.name}
                            </h2>
                            <p className="mt-2 text-slate-300">
                              {candidate.role} · {candidate.location}
                            </p>
                          </div>
                          {isTop ? (
                            <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-violet-100">
                              Carte active
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                          {candidate.bio}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {[...candidate.skills, ...candidate.timeServices]
                            .slice(0, 4)
                            .map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-200"
                              >
                                {item}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
              Action deck
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              Choisis ton mouvement
            </h3>
            <div className="mt-6 grid gap-3">
              <Link
                href={`/match?index=${Math.min(safeIndex + 1, matchQueue.length - 1)}${offer ? `&offer=${offer}` : ""}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center font-medium text-slate-100 hover:border-cyan-400/60"
              >
                Swipe suivant
              </Link>
              <Link
                href={`/profile/${profile.id}`}
                className="rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-3 text-center font-medium text-violet-100 hover:bg-violet-500/20"
              >
                Voir le profil
              </Link>
              <Link
                href={`/match/success?user=${profile.id}${offer ? `&offer=${offer}` : ""}`}
                className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-3 text-center font-semibold text-white hover:scale-[1.02]"
              >
                Envoyer une proposition
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
              Disponibilite
            </p>
            <p className="mt-3 text-lg font-medium text-white">
              {profile.availability}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {selectedOffer
                ? `Propose une collab autour de "${selectedOffer.title}" et passe en contact direct apres validation.`
                : "Utilise les cartes pour decouvrir un partenaire pertinent avant d'ouvrir la conversation."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
