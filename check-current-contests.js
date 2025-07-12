const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkCurrentContests() {
  try {
    console.log("🔍 Vérification des concours actuels...\n");

    const now = new Date();
    console.log(
      `⏰ Heure actuelle: ${now.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      })}`
    );
    console.log(`⏰ Heure UTC: ${now.toISOString()}\n`);

    // Récupérer tous les concours
    const allContests = await prisma.contest.findMany({
      orderBy: { createdAt: "desc" },
    });

    console.log(`📊 Total des concours: ${allContests.length}\n`);

    allContests.forEach((contest, index) => {
      console.log(`🏆 Concours ${index + 1}:`);
      console.log(`   ID: ${contest.id}`);
      console.log(`   Nom: ${contest.name}`);
      console.log(`   Statut: ${contest.status}`);
      console.log(
        `   Début (locale): ${contest.startedAt.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );
      console.log(`   Début (UTC): ${contest.startedAt.toISOString()}`);
      console.log(
        `   Fin (locale): ${contest.endedAt.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );
      console.log(`   Fin (UTC): ${contest.endedAt.toISOString()}`);

      // Vérifier si le concours est actif selon la logique de l'app
      const isActive =
        contest.status === "ACTIVE" &&
        now >= contest.startedAt &&
        now < contest.endedAt;

      console.log(`   Actif: ${isActive ? "✅ OUI" : "❌ NON"}`);
      console.log(
        `   Raison: ${
          contest.status !== "ACTIVE"
            ? "Statut non ACTIVE"
            : now < contest.startedAt
            ? "Pas encore commencé"
            : now >= contest.endedAt
            ? "Déjà terminé"
            : "Actif"
        }`
      );
      console.log("");
    });

    // Vérifier la logique exacte de l'application
    console.log("🔍 LOGIQUE DE L'APPLICATION:");
    const activeContest = await prisma.contest.findFirst({
      where: {
        status: "ACTIVE",
        startedAt: { lte: now },
        endedAt: { gt: now },
      },
    });

    if (activeContest) {
      console.log(`✅ Concours actif trouvé: ${activeContest.name}`);
    } else {
      console.log("❌ Aucun concours actif trouvé");
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentContests();
