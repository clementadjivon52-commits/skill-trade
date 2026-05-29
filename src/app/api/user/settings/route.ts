import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { language, theme, name, bio, whatsapp, photo } = body;

    const allowedThemes = ["dark", "light"];
    const allowedLanguages = ["fr", "en"];

    const updateData: Record<string, unknown> = {};
    if (language && allowedLanguages.includes(language)) updateData.language = language;
    if (theme && allowedThemes.includes(theme)) updateData.theme = theme;
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (photo) updateData.photo = photo;

    const user = await prisma.user.update({
      where: { id: session.userId as string },
      data: updateData,
      select: { language: true, theme: true, name: true, bio: true, whatsapp: true, photo: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
