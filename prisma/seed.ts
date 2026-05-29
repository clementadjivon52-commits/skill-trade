import { PrismaClient } from "@prisma/client";
import { getAllSeedData } from "../src/lib/site-data";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const { users, missions, walletInfo } = await getAllSeedData();

  await prisma.matchProposal.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.userTimeService.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.timeService.deleteMany();
  await prisma.walletRechargePack.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  const skillNames = [...new Set(users.flatMap((user) => user.skills))];
  const timeServiceNames = [...new Set(users.flatMap((user) => user.timeServices))];

  await prisma.skill.createMany({
    data: skillNames.map((name) => ({ name })),
  });

  await prisma.timeService.createMany({
    data: timeServiceNames.map((name) => ({ name })),
  });

  const createdSkills = await prisma.skill.findMany();
  const createdTimeServices = await prisma.timeService.findMany();

  const skillIdByName = new Map(createdSkills.map((skill) => [skill.name, skill.id]));
  const timeServiceIdByName = new Map(
    createdTimeServices.map((service) => [service.name, service.id]),
  );

  const defaultPassword = await bcrypt.hash("seeded-password", 10);

  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: `${user.id}@skill-trade.com`,
        password: defaultPassword,
        name: user.name,
        photo: user.photo,
        role: user.role,
        location: user.location,
        bio: user.bio,
        whatsapp: user.whatsapp,
        trustBadge: user.trustBadge,
        availability: user.availability,
        heroOffer: user.heroOffer,
        wallet: {
          create: {
            id: `${user.id}-wallet`,
            ownerLabel: user.name,
            balance: user.tokens,
            lastTopUp: walletInfo.lastTopUp,
          },
        },
        skills: {
          create: user.skills.map((name) => ({
            skill: {
              connect: {
                id: skillIdByName.get(name),
              },
            },
          })),
        },
        timeServices: {
          create: user.timeServices.map((name) => ({
            timeService: {
              connect: {
                id: timeServiceIdByName.get(name),
              },
            },
          })),
        },
        portfolio: {
          create: user.portfolio.map((item, index) => ({
            id: `${user.id}-portfolio-${index + 1}`,
            title: item.title,
            image: item.image,
          })),
        },
      },
    });
  }

  await prisma.wallet.create({
    data: {
      id: "demo-wallet",
      ownerLabel: "Compte Demo",
      balance: walletInfo.balance,
      lastTopUp: walletInfo.lastTopUp,
      packages: {
        create: walletInfo.methods.map((method) => ({
          id: method.id,
          label: method.label,
          amount: method.amount,
          href: method.href,
        })),
      },
    },
  });

  await prisma.mission.createMany({
    data: missions.map((mission) => ({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      category: mission.category,
      image: mission.image,
      reward: mission.reward,
      ownerId: mission.ownerId,
    })),
  });

  // Create admin user
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@skilltrade.tg" } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: "admin@skilltrade.tg",
        password: adminPassword,
        name: "Admin Skill-Trade",
        isAdmin: true,
        plan: "business",
        role: "Administrateur",
        bio: "Compte administrateur de la plateforme Skill-Trade.",
        trustBadge: "Vérifié",
        availability: "Toujours disponible",
        heroOffer: "Gestion de la plateforme",
      },
    });
    console.log("✅ Admin créé : admin@skilltrade.tg / admin1234");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
