const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function updateExpiredContests() {
  try {
    console.log("🕐 Vérification des concours expirés...");

    const now = new Date();

    // Trouver tous les concours actifs qui sont expirés
    const expiredContests = await prisma.contest.findMany({
      where: {
        status: "ACTIVE",
        endedAt: {
          lt: now,
        },
      },
    });

    console.log(`📊 ${expiredContests.length} concours expirés trouvés`);

    if (expiredContests.length > 0) {
      // Mettre à jour le statut des concours expirés
      const updateResult = await prisma.contest.updateMany({
        where: {
          status: "ACTIVE",
          endedAt: {
            lt: now,
          },
        },
        data: {
          status: "FINISHED",
        },
      });

      console.log(`✅ ${updateResult.count} concours mis à jour vers FINISHED`);

      // Afficher les détails des concours mis à jour
      for (const contest of expiredContests) {
        console.log(`  - ${contest.name} (ID: ${contest.id})`);
        console.log(`    Début: ${contest.startedAt}`);
        console.log(`    Fin: ${contest.endedAt}`);
        console.log(`    Statut: ACTIVE → FINISHED`);
        console.log("");
      }
    } else {
      console.log("✅ Aucun concours expiré trouvé");
    }

    // Afficher tous les concours actuels
    console.log("\n📋 État actuel des concours :");
    const allContests = await prisma.contest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    for (const contest of allContests) {
      const status =
        contest.status === "ACTIVE"
          ? "🟢 ACTIVE"
          : contest.status === "FINISHED"
          ? "🔴 FINISHED"
          : "⚫ CANCELLED";
      console.log(`  ${status} - ${contest.name}`);
      console.log(`    ID: ${contest.id}`);
      console.log(`    Début: ${contest.startedAt}`);
      console.log(`    Fin: ${contest.endedAt}`);
      console.log("");
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExpiredContests();
