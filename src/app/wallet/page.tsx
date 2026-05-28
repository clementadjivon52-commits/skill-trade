import Link from "next/link";
import WalletCard3D from "@/components/WalletCard3D";
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
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] items-center">
        <div className="glass-card rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-200">
            Skill-Tokens
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-white md:text-4xl">
            Une économie simple pour débloquer les services.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Les membres sans compétences techniques peuvent recharger leur
            wallet pour accéder aux talents disponibles dans le marketplace.
          </p>
        </div>

        {/* Premium 3D Wallet Card */}
        <div className="w-full flex justify-center">
          <WalletCard3D
            balance={walletInfo.balance}
            lastTopUp={walletInfo.lastTopUp}
            ownerName="Compte Démo Lomé"
          />
        </div>
      </section>

      {paymentSuccess ? (
        <section className="glass-card rounded-[2rem] border border-cyan-400/35 p-6 animate-pulse">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
            Recharge confirmée
          </p>
          <p className="mt-2.5 text-lg font-bold text-white">
            Paiement mobile money avec {selectedMethod.label} validé.
          </p>
          <p className="mt-1.5 text-xs text-slate-300">
            Pack ajouté : {selectedMethod.amount}. Tu peux maintenant lancer un
            match ou payer une mission directement.
          </p>
        </section>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2">
        {walletInfo.methods.map((methodItem) => (
          <article
            key={methodItem.id}
            className="glass-card card-hover rounded-[2rem] p-6 flex flex-col justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Acheter des jetons
              </p>
              <h2 className="mt-2.5 text-2xl font-bold text-white">
                {methodItem.label}
              </h2>
              <p className="mt-1.5 text-base font-semibold text-cyan-300">{methodItem.amount}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Simulation de paiement mobile money (T-Money ou Flooz) pour tester l&apos;accès immédiat aux compétences et talents.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                href={methodItem.href}
                className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-4 py-3 text-center text-xs font-bold text-white shadow-md hover:scale-[1.02] transition-transform"
              >
                Payer avec {methodItem.label}
              </Link>
              <Link
                href="/marketplace"
                className="rounded-full border border-white/10 px-4 py-3 text-xs font-semibold text-slate-200 hover:border-cyan-400/60 hover:bg-white/5"
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

