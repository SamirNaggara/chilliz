const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixNewContest() {
  try {
    console.log("🕐 Modification du nouveau concours...\n");

    const now = new Date();
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 heures

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
    console.log(
      `   Nouvelle date de début: ${now.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      })}`
    );
    console.log(
      `   Nouvelle date de fin: ${endTime.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      })}`
    );

    // Vérifier le concours mis à jour
    const activeContest = await prisma.contest.findFirst({
      where: {
        status: "ACTIVE",
      },
    });

    if (activeContest) {
      console.log("\n🎉 CONCOURS ACTIF:");
      console.log(`   ID: ${activeContest.id}`);
      console.log(`   Nom: ${activeContest.name}`);
      console.log(
        `   Début: ${activeContest.startedAt.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );
      console.log(
        `   Fin: ${activeContest.endedAt?.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );
    }
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixNewContest();
