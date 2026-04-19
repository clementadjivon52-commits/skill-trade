import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { message: "Non autorisé. Connectez-vous d'abord." },
        { status: 401 }
      );
    }

    const { title, description, category, reward, image } = await request.json();

    if (!title || !description || !category || !reward) {
      return NextResponse.json(
        { message: "Veuillez remplir les champs requis." },
        { status: 400 }
      );
    }

    const defaultImage =
      category === "tech"
        ? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80";

    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        category,
        reward,
        image: image || defaultImage,
        ownerId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Service créé avec succès.", id: mission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Service Error:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du service." },
      { status: 500 }
    );
  }
}
