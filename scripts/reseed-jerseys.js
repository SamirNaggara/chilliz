import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function reseedJerseys() {
  try {
    console.log("🧹 Nettoyage de la base de données...");

    // Supprimer toutes les données existantes
    await prisma.winner.deleteMany();
    await prisma.participation.deleteMany();
    await prisma.scan.deleteMany();
    await prisma.jerseyDex.deleteMany();
    await prisma.jersey.deleteMany();
    await prisma.contest.deleteMany();

    console.log("✅ Base de données nettoyée");

    // Créer les maillots qui correspondent aux images disponibles
    const jerseys = [
      {
        id: "jersey-mbappe-2024",
        name: "Maillot Mbappé Home 2024",
      },
      {
        id: "jersey-messi-2024",
        name: "Maillot Messi Away 2024",
      },
    ];

    console.log("👕 Création des maillots...");
    for (const jersey of jerseys) {
      await prisma.jersey.create({
        data: jersey,
      });
      console.log(`✅ ${jersey.name} créé`);
    }

    // Créer un concours de test
    const contest = await prisma.contest.create({
      data: {
        name: "Concours Été 2024",
        description: "Participez et gagnez des prix exclusifs !",
        startedAt: new Date("2024-07-01"),
        endedAt: new Date("2024-12-31"),
        firstPrize: "1000 CHZ + Maillot Collector Mbappé",
        secondPrize: "500 CHZ + Maillot Messi",
        thirdPrize: "250 CHZ + Ballon Officiel",
        status: "ACTIVE",
      },
    });

    console.log("🏆 Concours de test créé");

    // Créer quelques scans de test
    const scans = [
      {
        walletAddress: "0x1234567890abcdef",
        jerseyId: "jersey-mbappe-2024",
      },
      {
        walletAddress: "0xabcdef1234567890",
        jerseyId: "jersey-messi-2024",
      },
    ];

    for (const scan of scans) {
      await prisma.scan.create({
        data: scan,
      });
    }

    console.log("📱 Scans de test créés");

    console.log("\n🎉 Reseed terminé avec succès !");
    console.log("\n🔗 URLs de test :");
    console.log(
      "1. http://localhost:3000/jersey/jersey-mbappe-2024?isAuth=true"
    );
    console.log(
      "2. http://localhost:3000/jersey/jersey-messi-2024?isAuth=true"
    );
    console.log("\n🏆 Admin :");
    console.log(`   http://localhost:3000/admin/contests/${contest.id}`);
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

reseedJerseys();
