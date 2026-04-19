import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({ message: "Connexion réussie." }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Erreur lors de la connexion." },
      { status: 500 }
    );
  }
}
