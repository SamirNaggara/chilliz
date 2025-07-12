const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createNowContest() {
  try {
    console.log("🏆 Création d'un concours qui commence maintenant...\n");

    const now = new Date();
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 heures

    console.log(
      `⏰ Heure actuelle: ${now.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      })}`
    );
    console.log(
      `⏰ Heure de fin: ${endTime.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      })}`
    );

    // Créer un nouveau concours
    const newContest = await prisma.contest.create({
      data: {
        name: "Concours Test - Maintenant",
        description: "Test de concours qui commence immédiatement",
        startedAt: now,
        endedAt: endTime,
        status: "ACTIVE",
        firstPrize: "1000 CHZ",
        secondPrize: "500 CHZ",
        thirdPrize: "250 CHZ",
      },
    });

    console.log(`✅ Concours créé avec succès!`);
    console.log(`   ID: ${newContest.id}`);
    console.log(`   Nom: ${newContest.name}`);
    console.log(
      `   Début: ${newContest.startedAt.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      })}`
    );
    console.log(
      `   Fin: ${newContest.endedAt.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      })}`
    );
    console.log(`   Statut: ${newContest.status}`);

    // Vérifier que le concours est actif
    const activeContest = await prisma.contest.findFirst({
      where: {
        status: "ACTIVE",
        startedAt: { lte: now },
        endedAt: { gt: now },
      },
    });

    console.log(
      `\n🔍 Vérification: ${
        activeContest ? "CONCOURS ACTIF TROUVÉ" : "AUCUN CONCOURS ACTIF"
      }`
    );
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createNowContest();
