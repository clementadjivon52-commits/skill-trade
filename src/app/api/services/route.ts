import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  pro: 10,
  business: Infinity,
};

export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    where: { userId: session.userId as string },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, category, price, isPremium, image } = body;

    if (!title || !description) {
      return NextResponse.json(
        { message: "Titre et description requis." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { _count: { select: { services: true } } },
    });

    if (!user) {
      return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
    }

    const limit = PLAN_LIMITS[user.plan] ?? 1;
    if (user._count.services >= limit) {
      return NextResponse.json(
        {
          message: `Limite atteinte. Votre plan "${user.plan}" permet ${limit === Infinity ? "∞" : limit} service(s). Passez à Pro ou Business pour créer plus.`,
          limitReached: true,
        },
        { status: 403 }
      );
    }

    const service = await prisma.service.create({
      data: {
        userId: session.userId as string,
        title,
        description,
        category: category ?? "general",
        price: price ?? 0,
        isPremium: isPremium ?? false,
        image: image ?? "",
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Service creation error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
