const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixContestNow() {
  try {
    console.log(
      "🕐 Modification du concours pour qu'il commence maintenant...\n"
    );

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

    // Mettre à jour le concours le plus récent
    const updatedContest = await prisma.contest.updateMany({
      where: {
        status: "ACTIVE",
      },
      data: {
        startedAt: now,
        endedAt: endTime,
      },
    });

    console.log(
      `✅ Concours mis à jour: ${updatedContest.count} concours modifiés`
    );

    // Vérifier que le concours est maintenant actif
    const activeContest = await prisma.contest.findFirst({
      where: {
        status: "ACTIVE",
        startedAt: { lte: now },
        endedAt: { gt: now },
      },
    });

    if (activeContest) {
      console.log(`\n✅ CONCOURS MAINTENANT ACTIF:`);
      console.log(`   Nom: ${activeContest.name}`);
      console.log(
        `   Début: ${activeContest.startedAt.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );
      console.log(
        `   Fin: ${activeContest.endedAt.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );
    } else {
      console.log("\n❌ Aucun concours actif trouvé");
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixContestNow();
