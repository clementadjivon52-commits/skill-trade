import MatchSwiper from "@/components/MatchSwiper";
import { getMatchQueue, getMissionById } from "@/lib/site-data";

type MatchPageProps = {
  searchParams: Promise<{
    offer?: string;
  }>;
};

export default async function MatchPage({ searchParams }: MatchPageProps) {
  const { offer } = await searchParams;
  const matchQueue = await getMatchQueue();
  const selectedOffer = await getMissionById(offer);

  return (
    <div className="page-shell space-y-8 py-10 md:py-14">
      <section className="glass-card rounded-[2rem] p-6 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-200">
              Match stack
            </p>
            <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
              Swipe visuel, décisions physiques, vraie synergie.
            </h1>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-slate-300">
            {selectedOffer
              ? `Offre ciblée : ${selectedOffer.title}`
              : "Mode découverte pour trouver le bon partenaire"}
          </div>
        </div>
      </section>

      {/* Renders our beautiful client-side MatchSwiper */}
      <MatchSwiper
        queue={matchQueue}
        selectedOfferId={offer}
        selectedOfferTitle={selectedOffer?.title}
      />
    </div>
  );
}

