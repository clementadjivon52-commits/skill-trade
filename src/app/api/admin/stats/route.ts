import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  // Check admin
  const requestingUser = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { isAdmin: true },
  });

  if (!requestingUser?.isAdmin) {
    return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
  }

  const [totalUsers, totalServices, totalSubscriptions, recentUsers, recentServices, subscriptionRevenue, planBreakdown] =
    await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          isAdmin: true,
          createdAt: true,
          _count: { select: { services: true } },
        },
      }),
      prisma.service.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { name: true } },
        },
      }),
      prisma.subscription.aggregate({
        _sum: { price: true },
        where: { status: "active" },
      }),
      prisma.user.groupBy({
        by: ["plan"],
        _count: { plan: true },
      }),
    ]);

  return NextResponse.json({
    stats: {
      totalUsers,
      totalServices,
      totalSubscriptions,
      totalRevenue: subscriptionRevenue._sum.price ?? 0,
    },
    planBreakdown: planBreakdown.map((p) => ({
      plan: p.plan,
      count: p._count.plan,
    })),
    recentUsers,
    recentServices,
  });
}
