import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import {
  users as fallbackUsers,
  missions as fallbackMissions,
  walletInfo as fallbackWalletInfo,
  marketplaceOffers as fallbackMarketplaceOffers,
  matchQueue as fallbackMatchQueue,
  getUserById as fallbackGetUserById,
} from "@/data/mockData";

function mapUser(user: {
  id: string;
  name: string;
  photo: string;
  role: string;
  location: string;
  bio: string;
  whatsapp: string;
  trustBadge: string;
  availability: string;
  heroOffer: string;
  wallet: { balance: number } | null;
  skills: { skill: { name: string } }[];
  timeServices: { timeService: { name: string } }[];
  portfolio: { id: string; title: string; image: string }[];
}) {
  return {
    id: user.id,
    name: user.name,
    photo: user.photo,
    role: user.role,
    location: user.location,
    bio: user.bio,
    whatsapp: user.whatsapp,
    trustBadge: user.trustBadge,
    availability: user.availability,
    heroOffer: user.heroOffer,
    tokens: user.wallet?.balance ?? 0,
    skills: user.skills.map(({ skill }) => skill.name),
    timeServices: user.timeServices.map(({ timeService }) => timeService.name),
    portfolio: user.portfolio.map((item) => ({
      title: item.title,
      image: item.image,
    })),
  };
}

function mapMission(mission: {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  reward: string;
  owner: {
    id: string;
    name: string;
    photo: string;
    role: string;
    location: string;
    bio: string;
    whatsapp: string;
    trustBadge: string;
    availability: string;
    heroOffer: string;
    wallet: { balance: number } | null;
    skills: { skill: { name: string } }[];
    timeServices: { timeService: { name: string } }[];
    portfolio: { id: string; title: string; image: string }[];
  };
}) {
  return {
    id: mission.id,
    title: mission.title,
    description: mission.description,
    category: mission.category,
    image: mission.image,
    reward: mission.reward,
    owner: mapUser(mission.owner),
    typeLabel:
      mission.category === "tech" ? "Competences Tech" : "Services de Temps",
  };
}

const userInclude = {
  wallet: true,
  skills: { include: { skill: true } },
  timeServices: { include: { timeService: true } },
  portfolio: true,
} as const;

export async function getFeaturedUsers() {
  if (!isDatabaseConfigured()) {
    return fallbackUsers.slice(0, 3);
  }

  const users = await prisma.user.findMany({
    include: userInclude,
    orderBy: { createdAt: "asc" },
    take: 3,
  });

  return users.map(mapUser);
}

export async function getMarketplaceOffers(type = "all") {
  if (!isDatabaseConfigured()) {
    return type === "all"
      ? fallbackMarketplaceOffers
      : fallbackMarketplaceOffers.filter((offer) => offer.category === type);
  }

  const [missions, services] = await Promise.all([
    prisma.mission.findMany({
      where: type === "all" ? undefined : { category: type },
      include: {
        owner: {
          include: userInclude,
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.service.findMany({
      where: {
        status: "active",
        ...(type === "all" ? {} : { category: type }),
      },
      include: {
        user: {
          include: userInclude,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const mappedMissions = missions.map(mapMission);
  const mappedServices = services.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    image: s.image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80",
    reward: s.price > 0 ? `${s.price.toLocaleString()} FCFA` : "Troc",
    owner: mapUser(s.user),
    typeLabel: s.isPremium
      ? "★ Premium"
      : s.category === "tech"
      ? "Competences Tech"
      : "Services de Temps",
    isPremium: s.isPremium,
  }));

  // Combine and sort premium offers to the top
  const combined = [...mappedServices, ...mappedMissions];
  return combined.sort((a, b) => {
    const aPremium = (a as any).isPremium ? 1 : 0;
    const bPremium = (b as any).isPremium ? 1 : 0;
    return bPremium - aPremium;
  });
}

export async function getWalletSnapshot() {
  if (!isDatabaseConfigured()) {
    return fallbackWalletInfo;
  }

  const wallet = await prisma.wallet.findUnique({
    where: { id: "demo-wallet" },
    include: {
      packages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!wallet) {
    return fallbackWalletInfo;
  }

  return {
    balance: wallet.balance,
    lastTopUp: wallet.lastTopUp,
    methods: wallet.packages.map((pack) => ({
      id: pack.id,
      label: pack.label,
      amount: pack.amount,
      href: pack.href,
    })),
  };
}

export async function getMatchQueue() {
  if (!isDatabaseConfigured()) {
    return fallbackMatchQueue;
  }

  const users = await prisma.user.findMany({
    include: userInclude,
    orderBy: { createdAt: "asc" },
  });

  return users.map((user, index) => ({
    ...mapUser(user),
    compatibility: 88 - index * 4,
  }));
}

export async function getUserProfile(id: string) {
  if (!isDatabaseConfigured()) {
    return fallbackGetUserById(id) ?? null;
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: userInclude,
  });

  return user ? mapUser(user) : null;
}

export async function getMissionById(id?: string) {
  if (!id) {
    return null;
  }

  if (!isDatabaseConfigured()) {
    return fallbackMarketplaceOffers.find((mission) => mission.id === id) ?? null;
  }

  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      owner: {
        include: userInclude,
      },
    },
  });

  return mission ? mapMission(mission) : null;
}

export async function getWalletMethod(id?: string) {
  if (!id) {
    return null;
  }

  const wallet = await getWalletSnapshot();
  return wallet.methods.find((method) => method.id === id) ?? null;
}

export async function getLandingStats() {
  const wallet = await getWalletSnapshot();
  const offers = await getMarketplaceOffers("all");

  return {
    activeOffers: `${offers.length}+`,
    responseRate: "95%",
    tokenVolume: `${wallet.balance}`,
  };
}

export async function getLandingPreviewOffers() {
  const offers = await getMarketplaceOffers("all");
  return offers.slice(0, 4);
}

export async function getAllSeedData() {
  return {
    users: fallbackUsers,
    missions: fallbackMissions,
    walletInfo: fallbackWalletInfo,
  };
}
