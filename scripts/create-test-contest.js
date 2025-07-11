const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createTestContest() {
  try {
    // Créer un concours de test qui commence maintenant et dure 1 heure
    const now = new Date();
    const endTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 heure

    const contest = await prisma.contest.create({
      data: {
        name: "🏆 Concours Maillot Mbappé 2024",
        description:
          "Participez au grand concours PSG et tentez de remporter des prix exclusifs ! Scannez votre maillot authentique pour participer automatiquement.",
        startedAt: now,
        endedAt: endTime,
        prize: "1000 CHZ + Maillot Collector Signé",
        maxWinners: 3,
        status: "ACTIVE",
      },
    });

    console.log("✅ Concours de test créé avec succès !");
    console.log("ID:", contest.id);
    console.log("Nom:", contest.name);
    console.log("Prix:", contest.prize);
    console.log("Début:", contest.startedAt);
    console.log("Fin:", contest.endedAt);

    console.log("\n🎯 Pour tester la popup :");
    console.log(
      "1. Allez sur http://localhost:3001/jersey/jersey-1?isAuth=true"
    );
    console.log("2. La popup devrait apparaître automatiquement");
  } catch (error) {
    console.error("❌ Erreur lors de la création du concours:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestContest();
