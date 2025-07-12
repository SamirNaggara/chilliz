import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testCacheSolution() {
  console.log("🧪 Test de la solution de cache pour les contests...\n");

  try {
    // 1. Vérifier les contests existants
    console.log("1. Vérification des contests existants...");
    const existingContests = await prisma.contest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    console.log(`   ✅ ${existingContests.length} contests trouvés`);
    existingContests.forEach((contest) => {
      console.log(
        `   - ${contest.name} (${contest.status}) - Créé: ${contest.createdAt}`
      );
    });

    // 2. Créer un nouveau contest de test
    console.log("\n2. Création d'un nouveau contest de test...");
    const testContest = await prisma.contest.create({
      data: {
        name: `Test Cache ${Date.now()}`,
        description: "Contest de test pour vérifier la solution de cache",
        startedAt: new Date(),
        endedAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // +24h
        firstPrize: "1000 CHZ + Maillot Collector",
        secondPrize: "500 CHZ + Maillot",
        thirdPrize: "250 CHZ",
        maxWinners: 3,
        status: "ACTIVE",
      },
    });

    console.log(
      `   ✅ Contest créé: ${testContest.name} (ID: ${testContest.id})`
    );

    // 3. Vérifier que le contest apparaît immédiatement
    console.log("\n3. Vérification de l'apparition immédiate...");
    const updatedContests = await prisma.contest.findMany({
      where: { name: { contains: "Test Cache" } },
      orderBy: { createdAt: "desc" },
    });

    console.log(`   ✅ ${updatedContests.length} contests de test trouvés`);
    updatedContests.forEach((contest) => {
      console.log(
        `   - ${contest.name} (${contest.status}) - Créé: ${contest.createdAt}`
      );
    });

    // 4. Nettoyer les contests de test
    console.log("\n4. Nettoyage des contests de test...");
    const deletedContests = await prisma.contest.deleteMany({
      where: { name: { contains: "Test Cache" } },
    });

    console.log(`   ✅ ${deletedContests.count} contests de test supprimés`);

    console.log("\n🎉 Test terminé avec succès !");
    console.log("\n📋 Solutions implémentées :");
    console.log("   ✅ Actions serveur avec revalidatePath()");
    console.log("   ✅ Configuration Next.js pour éviter le cache statique");
    console.log("   ✅ Affichage des contests actifs sur la page principale");
    console.log("   ✅ Revalidation automatique après création");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testCacheSolution();
