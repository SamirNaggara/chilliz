const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testContests() {
  try {
    console.log("🔍 Test des concours...\n");

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
        `   Début: ${contest.startedAt.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );
      console.log(
        `   Fin: ${
          contest.endedAt
            ? contest.endedAt.toLocaleString("fr-FR", {
                timeZone: "Europe/Paris",
              })
            : "Pas de fin"
        }`
      );

      const isStarted = contest.startedAt <= now;
      const isEnded = contest.endedAt ? contest.endedAt <= now : false;
      const isActive = contest.status === "ACTIVE" && isStarted && !isEnded;

      console.log(`   Débuté: ${isStarted ? "✅" : "❌"}`);
      console.log(`   Terminé: ${isEnded ? "✅" : "❌"}`);
      console.log(`   Actif: ${isActive ? "✅" : "❌"}`);
      console.log("");
    });

    // Test de la logique exacte de l'app
    console.log("🔍 LOGIQUE DE L'APPLICATION:");
    const activeContest = await prisma.contest.findFirst({
      where: {
        status: "ACTIVE",
        startedAt: {
          lte: now,
        },
        OR: [{ endedAt: null }, { endedAt: { gte: now } }],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (activeContest) {
      console.log("✅ CONCOURS ACTIF TROUVÉ:");
      console.log(`   ID: ${activeContest.id}`);
      console.log(`   Nom: ${activeContest.name}`);
      console.log(
        `   Début: ${activeContest.startedAt.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );
      console.log(
        `   Fin: ${
          activeContest.endedAt
            ? activeContest.endedAt.toLocaleString("fr-FR", {
                timeZone: "Europe/Paris",
              })
            : "Pas de fin"
        }`
      );
    } else {
      console.log("❌ AUCUN CONCOURS ACTIF TROUVÉ");
      console.log("\n🔍 DÉTAIL DE LA RECHERCHE:");
      console.log(`   Status ACTIVE requis`);
      console.log(
        `   startedAt <= ${now.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );
      console.log(
        `   endedAt >= ${now.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })} ou null`
      );
    }
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testContests();
