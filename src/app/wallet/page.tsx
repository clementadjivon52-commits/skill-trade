import Link from "next/link";
import { getWalletSnapshot } from "@/lib/site-data";

type WalletPageProps = {
  searchParams: Promise<{
    method?: string;
    status?: string;
  }>;
};

export default async function WalletPage({ searchParams }: WalletPageProps) {
  const { method, status } = await searchParams;
  const walletInfo = await getWalletSnapshot();
  const selectedMethod = walletInfo.methods.find((item) => item.id === method);
  const paymentSuccess = status === "success" && selectedMethod;

  return (
    <div className="page-shell space-y-8 py-10 md:py-14">
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-card rounded-[2rem] p-8">
          <p className="text-sm uppercase tracking-[0.34em] text-cyan-200">
            Skill-Tokens
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Une economie simple pour debloquer les services.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Les membres sans competences techniques peuvent recharger leur
            wallet pour acceder aux talents disponibles dans le marketplace.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="glass-card rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
              Solde actuel
            </p>
            <p className="mt-4 text-5xl font-bold text-white">
              {walletInfo.balance}
            </p>
            <p className="mt-2 text-slate-400">Skill-Tokens disponibles</p>
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              Derniere recharge : {walletInfo.lastTopUp}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
              Benefices
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                Paiements simules via T-Money et Flooz.
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                Acces rapide aux profils verifies.
              </div>
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                Budget flexible pour missions ponctuelles.
              </div>
            </div>
          </div>
        </div>
      </section>

      {paymentSuccess ? (
        <section className="glass-card rounded-[2rem] border border-cyan-400/35 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">
            Recharge confirmee
          </p>
          <p className="mt-3 text-xl font-semibold text-white">
            Paiement simule avec {selectedMethod.label} valide.
          </p>
          <p className="mt-2 text-slate-300">
            Pack ajoute : {selectedMethod.amount}. Tu peux maintenant lancer un
            match ou payer une mission.
          </p>
        </section>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2">
        {walletInfo.methods.map((methodItem) => (
          <article
            key={methodItem.id}
            className="glass-card card-hover rounded-[2rem] p-6"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
              Acheter des jetons
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              {methodItem.label}
            </h2>
            <p className="mt-4 text-lg text-slate-300">{methodItem.amount}</p>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              Simulation de paiement mobile money pour rendre l&apos;acces aux
              services immediate.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href={methodItem.href}
                className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-3 text-center font-semibold text-white"
              >
                Payer avec {methodItem.label}
              </Link>
              <Link
                href="/marketplace"
                className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 hover:border-cyan-400/60"
              >
                Voir les services
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
