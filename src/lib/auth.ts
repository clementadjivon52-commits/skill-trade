import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const secretKey = process.env.JWT_SECRET || "fallback_secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expires });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function getUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: {
        wallet: true,
        skills: { include: { skill: true } },
        timeServices: { include: { timeService: true } },
        portfolio: true,
      },
    });

    if (!user) return null;

    // Adapting to the shape expected by UI
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      role: user.role,
      location: user.location,
      bio: user.bio,
      whatsapp: user.whatsapp,
      trustBadge: user.trustBadge,
      availability: user.availability,
      heroOffer: user.heroOffer,
      isAdmin: user.isAdmin,
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      theme: user.theme,
      language: user.language,
      tokens: user.wallet?.balance ?? 0,
      skills: user.skills.map(({ skill }) => skill.name),
      timeServices: user.timeServices.map(({ timeService }) => timeService.name),
      portfolio: user.portfolio.map((item) => ({
        title: item.title,
        image: item.image,
      })),
    };
  } catch (error) {
    return null;
  }
}
