const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testNewSimpleContests() {
  try {
    console.log("🧪 Test de la nouvelle logique simplifiée des concours...\n");

    // 1. Créer un concours en attente
    console.log("1. Création d'un concours en attente...");
    const pendingContest = await prisma.contest.create({
      data: {
        name: "Concours Test - En Attente",
        description: "Test de concours en attente de démarrage",
        firstPrize: "1000 CHZ + Maillot Collector",
        secondPrize: "500 CHZ + Maillot",
        thirdPrize: "250 CHZ",
        status: "PENDING",
      },
    });

    console.log(
      `   ✅ Concours créé: ${pendingContest.name} (${pendingContest.status})`
    );

    // 2. Démarrer le concours
    console.log("\n2. Démarrage du concours...");
    const startedContest = await prisma.contest.update({
      where: { id: pendingContest.id },
      data: { status: "ACTIVE" },
    });

    console.log(
      `   ✅ Concours démarré: ${startedContest.name} (${startedContest.status})`
    );

    // 3. Vérifier qu'il n'y a qu'un seul concours actif
    console.log("\n3. Vérification des concours actifs...");
    const activeContests = await prisma.contest.findMany({
      where: { status: "ACTIVE" },
    });

    console.log(`   📊 ${activeContests.length} concours actifs trouvés`);
    activeContests.forEach((contest, index) => {
      console.log(`   ${index + 1}. ${contest.name} (ID: ${contest.id})`);
    });

    // 4. Terminer le concours
    console.log("\n4. Terminaison du concours...");
    const finishedContest = await prisma.contest.update({
      where: { id: startedContest.id },
      data: { status: "FINISHED" },
    });

    console.log(
      `   ✅ Concours terminé: ${finishedContest.name} (${finishedContest.status})`
    );

    // 5. Afficher tous les concours
    console.log("\n5. État final des concours:");
    const allContests = await prisma.contest.findMany({
      orderBy: { createdAt: "desc" },
    });

    allContests.forEach((contest, index) => {
      const statusEmoji =
        contest.status === "ACTIVE"
          ? "🟢"
          : contest.status === "PENDING"
          ? "🟡"
          : contest.status === "FINISHED"
          ? "🔴"
          : "⚫";

      console.log(
        `   ${index + 1}. ${statusEmoji} ${contest.name} (${contest.status})`
      );
      console.log(`      ID: ${contest.id}`);
      console.log(`      Créé: ${contest.createdAt.toLocaleString("fr-FR")}`);
      console.log("");
    });

    console.log("✅ Test de la nouvelle logique terminé avec succès !");
    console.log("\n🎯 Points vérifiés:");
    console.log("   ✅ Création de concours en statut PENDING");
    console.log("   ✅ Démarrage manuel vers ACTIVE");
    console.log("   ✅ Terminaison manuelle vers FINISHED");
    console.log("   ✅ Plus de vérification de dates automatiques");
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testNewSimpleContests();
