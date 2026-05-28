"use client";

import { useRouter } from "next/navigation";
import MobileMoneySimulator from "@/components/MobileMoneySimulator";

type PaymentClientProps = {
  methodId: string;
  methodLabel: string;
  amount: string;
};

export default function PaymentClient({
  methodId,
  methodLabel,
  amount,
}: PaymentClientProps) {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(`/wallet?method=${methodId}&status=success`);
    router.refresh();
  };

  const handleCancel = () => {
    router.push("/wallet");
  };

  return (
    <div className="mx-auto max-w-lg">
      <MobileMoneySimulator
        methodId={methodId}
        methodLabel={methodLabel}
        amount={amount}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
