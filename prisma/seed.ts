import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Créer les maillots qui correspondent aux images disponibles
  const jersey1 = await prisma.jersey.upsert({
    where: { id: "jersey-mbappe-2024" },
    update: {
      assetUrl: "/jerseys/jersey-mbappe-2024.png",
      assetType: "image",
    },
    create: {
      id: "jersey-mbappe-2024",
      name: "Maillot Mbappé Home 2024",
      assetUrl: "/jerseys/jersey-mbappe-2024.png",
      assetType: "image",
    },
  });

  const jersey2 = await prisma.jersey.upsert({
    where: { id: "jersey-messi-2024" },
    update: {
      assetUrl: "/jerseys/jersey-messi-2024.png",
      assetType: "image",
    },
    create: {
      id: "jersey-messi-2024",
      name: "Maillot Messi Away 2024",
      assetUrl: "/jerseys/jersey-messi-2024.png",
      assetType: "image",
    },
  });

  const jersey3 = await prisma.jersey.upsert({
    where: { id: "chiliz-hacking-paris-hat" },
    update: {
      assetUrl: "/jerseys/jersey_hat.mp4",
      assetType: "video",
    },
    create: {
      id: "chiliz-hacking-paris-hat",
      name: "Chiliz Hacking Paris Hat",
      assetUrl: "/jerseys/jersey_hat.mp4",
      assetType: "video",
    },
  });

  // Créer un concours actif avec les nouveaux champs de prix
  const contest = await prisma.contest.upsert({
    where: { id: "contest-summer-2024" },
    update: {
      firstPrize: "1000 CHZ + Maillot Collector Mbappé",
      secondPrize: "500 CHZ + Maillot Messi",
      thirdPrize: "250 CHZ + Ballon Officiel",
    },
    create: {
      id: "contest-summer-2024",
      name: "Concours Été 2024",
      description: "Participez et gagnez des prix exclusifs !",
      firstPrize: "1000 CHZ + Maillot Collector Mbappé",
      secondPrize: "500 CHZ + Maillot Messi",
      thirdPrize: "250 CHZ + Ballon Officiel",
      status: "ACTIVE",
    },
  });

  // Créer quelques scans d'exemple
  await prisma.scan.upsert({
    where: { id: "scan-1" },
    update: {},
    create: {
      id: "scan-1",
      walletAddress: "0x1234567890abcdef",
      jerseyId: jersey1.id,
    },
  });

  await prisma.scan.upsert({
    where: { id: "scan-2" },
    update: {},
    create: {
      id: "scan-2",
      walletAddress: "0xabcdef1234567890",
      jerseyId: jersey2.id,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("👕 Jerseys created:", jersey1.name, jersey2.name);
  console.log("🏆 Contest created:", contest.name);
  console.log(
    "📱 Sample wallet addresses: 0x1234567890abcdef, 0xabcdef1234567890"
  );
  console.log("👒 Casquette vidéo créée :", jersey3.name);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
