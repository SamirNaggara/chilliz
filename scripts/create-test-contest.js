import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestContest() {
  try {
    console.log("🏆 Création d'un concours de test...");

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

    console.log("✅ Concours créé avec succès !");
    console.log(`📋 Nom: ${contest.name}`);
    console.log(`🆔 ID: ${contest.id}`);
    console.log(`📅 Début: ${contest.startedAt.toLocaleDateString()}`);
    console.log(`📅 Fin: ${contest.endedAt?.toLocaleDateString()}`);

    console.log("\n🔗 Pour tester le concours :");
    console.log(
      "1. Allez sur http://localhost:3000/jersey/jersey-mbappe-2024?isAuth=true"
    );
    console.log("2. Participez au concours");
    console.log("3. Vérifiez les participations dans l'admin");

    console.log(
      `\n🏆 Admin: http://localhost:3000/admin/contests/${contest.id}`
    );
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestContest();
