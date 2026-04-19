import Link from "next/link";
import { notFound } from "next/navigation";
import { getWalletMethod } from "@/lib/site-data";

type PaymentMethodPageProps = {
  params: Promise<{
    method: string;
  }>;
};

export default async function PaymentMethodPage({
  params,
}: PaymentMethodPageProps) {
  const { method } = await params;
  const paymentMethod = await getWalletMethod(method);

  if (!paymentMethod) {
    notFound();
  }

  return (
    <div className="page-shell py-10 md:py-14">
      <section className="glass-card grid-glow mx-auto max-w-3xl rounded-[2.2rem] p-8 md:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-200">
          Paiement mobile
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">
          Acheter des tokens avec {paymentMethod.label}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          Cette page simule une etape de paiement dediee a {paymentMethod.label}.
          Le pack choisi credite {paymentMethod.amount} sur le wallet.
        </p>

        <div className="mt-6 rounded-[1.7rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
            Pack selectionne
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {paymentMethod.amount}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href={`/wallet?method=${paymentMethod.id}&status=success`}
            className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 text-center font-semibold text-white"
          >
            Confirmer avec {paymentMethod.label}
          </Link>
          <Link
            href="/wallet"
            className="rounded-full border border-white/10 px-6 py-3 text-center font-medium text-slate-200 hover:border-cyan-400/60"
          >
            Retour au wallet
          </Link>
        </div>
      </section>
    </div>
  );
}
