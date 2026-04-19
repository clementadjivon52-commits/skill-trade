import Link from "next/link";
import { notFound } from "next/navigation";
import { getMissionById, getUserProfile } from "@/lib/site-data";

type ContactPartnerPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    offer?: string;
  }>;
};

export default async function ContactPartnerPage({
  params,
  searchParams,
}: ContactPartnerPageProps) {
  const [{ id }, { offer }] = await Promise.all([params, searchParams]);
  const [user, selectedOffer] = await Promise.all([
    getUserProfile(id),
    getMissionById(offer),
  ]);

  if (!user) {
    notFound();
  }

  const message = encodeURIComponent(
    `Salut ${user.name}, je t'ecris depuis SKILL-TRADE pour discuter de ton offre "${selectedOffer?.title ?? user.heroOffer}".`,
  );
  const whatsappLink = `https://wa.me/${user.whatsapp}?text=${message}`;

  return (
    <div className="page-shell py-10 md:py-14">
      <section className="glass-card mx-auto max-w-3xl rounded-[2.2rem] p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-200">
          Contact partenaire
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">
          Ouvrir la discussion avec {user.name}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          {selectedOffer
            ? `Tu vas contacter ${user.name} au sujet de "${selectedOffer.title}".`
            : `Tu vas contacter ${user.name} au sujet de son offre principale.`}
        </p>

        <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
            Message automatique
          </p>
          <p className="mt-3 text-slate-200">
            Salut {user.name}, je t&apos;ecris depuis SKILL-TRADE pour discuter
            de ton offre &quot;{selectedOffer?.title ?? user.heroOffer}&quot;.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 text-center font-semibold text-white"
          >
            Ouvrir WhatsApp
          </Link>
          <Link
            href={selectedOffer ? `/offers/${selectedOffer.id}` : `/profile/${user.id}`}
            className="rounded-full border border-white/10 px-6 py-3 text-center font-medium text-slate-200 hover:border-cyan-400/60"
          >
            Retour
          </Link>
        </div>
      </section>
    </div>
  );
}
