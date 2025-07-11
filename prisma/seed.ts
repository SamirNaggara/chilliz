import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Créer quelques utilisateurs d'exemple
  const user1 = await prisma.user.upsert({
    where: { wallet: "0x1234567890abcdef" },
    update: {},
    create: {
      wallet: "0x1234567890abcdef",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { wallet: "0xabcdef1234567890" },
    update: {},
    create: {
      wallet: "0xabcdef1234567890",
    },
  });

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
      userId: user1.id,
      jerseyId: jersey1.id,
    },
  });

  await prisma.scan.upsert({
    where: { id: "scan-2" },
    update: {},
    create: {
      id: "scan-2",
      userId: user2.id,
      jerseyId: jersey2.id,
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("👥 Users created:", user1.wallet, user2.wallet);
  console.log("👕 Jerseys created:", jersey1.name, jersey2.name);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
