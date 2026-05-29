import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// PATCH /api/admin/users/[id] — toggle isAdmin or change plan
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  const requestingUser = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { isAdmin: true },
  });

  if (!requestingUser?.isAdmin) {
    return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { isAdmin, plan } = body;

  const updateData: Record<string, unknown> = {};
  if (typeof isAdmin === "boolean") updateData.isAdmin = isAdmin;
  if (plan && ["free", "pro", "business"].includes(plan)) updateData.plan = plan;

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, isAdmin: true, plan: true },
  });

  return NextResponse.json(user);
}
