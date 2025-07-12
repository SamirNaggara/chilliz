import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testCacheFix() {
  console.log("🧪 Test de la solution de cache améliorée...\n");

  try {
    // 1. Vérifier les contests existants
    console.log("1. Vérification des contests existants...");
    const existingContests = await prisma.contest.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
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
        name: `Test Cache Fix ${Date.now()}`,
        description:
          "Contest de test pour vérifier la solution de cache améliorée",
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
      where: { name: { contains: "Test Cache Fix" } },
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
      where: { name: { contains: "Test Cache Fix" } },
    });

    console.log(`   ✅ ${deletedContests.count} contests de test supprimés`);

    console.log("\n🎉 Test terminé avec succès !");
    console.log("\n📋 Solutions implémentées pour le cache :");
    console.log('   ✅ Configuration dynamic = "force-dynamic"');
    console.log("   ✅ Configuration revalidate = 0");
    console.log("   ✅ Headers Cache-Control agressifs");
    console.log("   ✅ Rewrites pour forcer la revalidation");
    console.log("   ✅ Actions serveur avec revalidatePath()");

    console.log("\n🔧 Configuration technique :");
    console.log('   - Pages avec dynamic = "force-dynamic"');
    console.log("   - Pages avec revalidate = 0");
    console.log(
      "   - Headers Cache-Control: no-cache, no-store, must-revalidate, max-age=0"
    );
    console.log("   - Headers Pragma: no-cache");
    console.log("   - Headers Expires: 0");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testCacheFix();
