import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  const cv = await prisma.cV.findUnique({
    where: { userId: session.userId as string },
  });

  return NextResponse.json(cv);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.userId) {
    return NextResponse.json({ message: "Non authentifié" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;
    const dataRaw = formData.get("data") as string | null;

    let pdfPath: string | undefined;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
      await mkdir(uploadDir, { recursive: true });

      const filename = `${session.userId as string}_${Date.now()}.pdf`;
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      pdfPath = `/uploads/cv/${filename}`;
    }

    let cvData: Record<string, unknown> = {};
    if (dataRaw) {
      cvData = JSON.parse(dataRaw);
    }

    const existing = await prisma.cV.findUnique({
      where: { userId: session.userId as string },
    });

    let cv;
    if (existing) {
      cv = await prisma.cV.update({
        where: { userId: session.userId as string },
        data: {
          ...cvData,
          ...(pdfPath ? { pdfPath } : {}),
        },
      });
    } else {
      cv = await prisma.cV.create({
        data: {
          userId: session.userId as string,
          ...cvData,
          ...(pdfPath ? { pdfPath } : {}),
        },
      });
    }

    return NextResponse.json(cv);
  } catch (error) {
    console.error("CV upload error:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
