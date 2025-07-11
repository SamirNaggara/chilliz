const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteContest() {
  try {
    console.log("🗑️ Suppression du concours 'Barcol goals'...");

    // Supprimer d'abord les participations et gagnants liés
    const contestId = "cmcz67j7h0000fn2p61oenzhd";

    console.log("📊 Suppression des participations...");
    await prisma.participation.deleteMany({
      where: {
        contestId: contestId,
      },
    });

    console.log("📊 Suppression des gagnants...");
    await prisma.winner.deleteMany({
      where: {
        contestId: contestId,
      },
    });

    console.log("📊 Suppression du concours...");
    await prisma.contest.delete({
      where: {
        id: contestId,
      },
    });

    console.log("✅ Concours 'Barcol goals' supprimé avec succès !");

    // Afficher les concours restants
    console.log("\n📋 Concours restants :");
    const remainingContests = await prisma.contest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    for (const contest of remainingContests) {
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

deleteContest();
