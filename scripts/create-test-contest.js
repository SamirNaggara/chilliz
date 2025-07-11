const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createTestContest() {
  try {
    // Créer un concours de test
    const contest = await prisma.contest.create({
      data: {
        name: "🏆 Concours Maillot Mbappé 2024",
        description: "Participez au concours pour gagner des prix exclusifs !",
        startedAt: new Date(),
        endedAt: new Date(Date.now() + 60 * 60 * 1000), // +1 heure
        firstPrize: "1000 CHZ + Maillot Collector Signé",
        secondPrize: "500 CHZ + Maillot Officiel",
        thirdPrize: "250 CHZ + Goodies PSG",
        maxWinners: 3,
        status: "ACTIVE",
      },
    });

    console.log("✅ Concours de test créé avec succès !");
    console.log(`ID: ${contest.id}`);
    console.log(`Nom: ${contest.name}`);
    console.log(`1er Prix: ${contest.firstPrize}`);
    console.log(`2ème Prix: ${contest.secondPrize}`);
    console.log(`3ème Prix: ${contest.thirdPrize}`);
    console.log(`Début: ${contest.startedAt}`);
    console.log(`Fin: ${contest.endedAt}`);

    console.log("\n🎯 Pour tester la popup :");
    console.log(
      "1. Allez sur http://localhost:3001/jersey/jersey-1?isAuth=true"
    );
    console.log("2. La popup devrait apparaître automatiquement");
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestContest();
