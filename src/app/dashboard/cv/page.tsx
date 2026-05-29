import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CVClient from "./CVClient";

export default async function CVPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const cv = await prisma.cV.findUnique({ where: { userId: user.id } });

  const initial = cv
    ? {
        fullName: cv.fullName,
        title: cv.title,
        summary: cv.summary,
        phone: cv.phone,
        email: cv.email,
        address: cv.address,
        skills: JSON.parse(cv.skills || "[]"),
        experience: JSON.parse(cv.experience || "[]"),
        education: JSON.parse(cv.education || "[]"),
        pdfPath: cv.pdfPath ?? undefined,
      }
    : null;

  return <CVClient initial={initial} />;
}
