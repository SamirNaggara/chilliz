import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Créer quelques maillots d'exemple
  const jersey1 = await prisma.jersey.upsert({
    where: { id: "jersey-mbappe-2024" },
    update: {},
    create: {
      id: "jersey-mbappe-2024",
      name: "Maillot Mbappé Home 2024",
    },
  });

  const jersey2 = await prisma.jersey.upsert({
    where: { id: "jersey-messi-2024" },
    update: {},
    create: {
      id: "jersey-messi-2024",
      name: "Maillot Messi Away 2024",
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
  console.log(
    "📱 Sample wallet addresses: 0x1234567890abcdef, 0xabcdef1234567890"
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
