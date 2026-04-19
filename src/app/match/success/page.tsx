import Link from "next/link";
import { getMissionById, getUserProfile } from "@/lib/site-data";

type MatchSuccessPageProps = {
  searchParams: Promise<{
    user?: string;
    offer?: string;
  }>;
};

export default async function MatchSuccessPage({
  searchParams,
}: MatchSuccessPageProps) {
  const { user, offer } = await searchParams;
  const [partner, selectedOffer] = await Promise.all([
    user ? getUserProfile(user) : Promise.resolve(null),
    getMissionById(offer),
  ]);

  return (
    <div className="page-shell py-14">
      <section className="glass-card grid-glow mx-auto max-w-3xl rounded-[2.4rem] p-8 text-center md:p-12">
        <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-400 text-3xl text-white shadow-[0_0_40px_rgba(34,211,238,0.22)]">
          +
        </div>
        <p className="mt-6 text-sm uppercase tracking-[0.34em] text-cyan-200">
          Proposition envoyee
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">
          Ton echange est pret a demarrer.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          {partner
            ? `Une proposition a ete envoyee a ${partner.name}.`
            : "Une proposition a ete enregistree sur SKILL-TRADE."}{" "}
          {selectedOffer ? `Offre concernee : ${selectedOffer.title}.` : ""}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href={partner ? `/profile/${partner.id}` : "/marketplace"}
            className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 font-semibold text-white"
          >
            {partner ? "Voir le partenaire" : "Retour au marketplace"}
          </Link>
          <Link
            href="/marketplace"
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-100 hover:border-cyan-400/60"
          >
            Explorer d&apos;autres offres
          </Link>
        </div>
      </section>
    </div>
  );
}
