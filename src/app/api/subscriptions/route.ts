import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const PLAN_PRICES: Record<string, number> = {
  pro: 1000,
  business: 3000,
};

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const { plan } = await request.json();

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ message: "Plan invalide" }, { status: 400 });
    }

    const price = PLAN_PRICES[plan];

    // Expiry: 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create subscription record
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.userId as string,
        plan,
        price,
        status: "active",
        expiresAt,
      },
    });

    // Update user plan
    await prisma.user.update({
      where: { id: session.userId as string },
      data: {
        plan,
        planExpiresAt: expiresAt,
      },
    });

    return NextResponse.json({
      message: `Souscription au plan ${plan} activée avec succès !`,
      subscription,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
