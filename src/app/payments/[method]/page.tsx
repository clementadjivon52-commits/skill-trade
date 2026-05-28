import { notFound } from "next/navigation";
import { getWalletMethod } from "@/lib/site-data";
import PaymentClient from "./PaymentClient";

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
      <PaymentClient
        methodId={paymentMethod.id}
        methodLabel={paymentMethod.label}
        amount={paymentMethod.amount}
      />
    </div>
  );
}

