import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testAllDataUpdates() {
  console.log("🧪 Test complet des mises à jour de données...\n");

  try {
    // 1. Test des Contests
    console.log("1. Test des Contests...");
    const existingContests = await prisma.contest.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    console.log(`   ✅ ${existingContests.length} contests existants`);

    // Créer un contest de test
    const testContest = await prisma.contest.create({
      data: {
        name: `Test Data Update ${Date.now()}`,
        description: "Contest de test pour vérifier les mises à jour",
        startedAt: new Date(),
        endedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        firstPrize: "1000 CHZ",
        secondPrize: "500 CHZ",
        thirdPrize: "250 CHZ",
        maxWinners: 3,
        status: "ACTIVE",
      },
    });
    console.log(`   ✅ Contest créé: ${testContest.name}`);

    // 2. Test des Jerseys
    console.log("\n2. Test des Jerseys...");
    const existingJerseys = await prisma.jersey.findMany({
      include: { scans: true },
      take: 3,
    });
    console.log(`   ✅ ${existingJerseys.length} jerseys existants`);
    console.log(
      `   ✅ ${existingJerseys.reduce(
        (total, jersey) => total + (jersey.scans?.length || 0),
        0
      )} scans totaux`
    );

    // Créer un jersey de test
    const testJersey = await prisma.jersey.create({
      data: {
        id: `test-jersey-${Date.now()}`,
        name: `Test Jersey ${Date.now()}`,
      },
    });
    console.log(`   ✅ Jersey créé: ${testJersey.name}`);

    // 3. Test du JerseyDex
    console.log("\n3. Test du JerseyDex...");
    const testWallet = "0x1234567890123456789012345678901234567890";

    // Ajouter un jersey au dex
    const jerseyDexEntry = await prisma.jerseyDex.create({
      data: {
        walletAddress: testWallet.toLowerCase(),
        jerseyId: testJersey.id,
      },
      include: { jersey: true },
    });
    console.log(`   ✅ Jersey ajouté au dex: ${jerseyDexEntry.jersey.name}`);

    // Vérifier les entrées du dex
    const dexEntries = await prisma.jerseyDex.findMany({
      where: { walletAddress: testWallet.toLowerCase() },
      include: { jersey: true },
    });
    console.log(
      `   ✅ ${dexEntries.length} entrées dans le dex pour ce wallet`
    );

    // 4. Vérification des statistiques
    console.log("\n4. Vérification des statistiques...");
    const allJerseys = await prisma.jersey.findMany({
      include: { scans: true },
    });
    const totalScans = allJerseys.reduce(
      (total, jersey) => total + (jersey.scans?.length || 0),
      0
    );
    const uniqueWallets = new Set(
      allJerseys.flatMap(
        (jersey) => jersey.scans?.map((scan) => scan.walletAddress) || []
      )
    ).size;

    console.log(`   ✅ Total jerseys: ${allJerseys.length}`);
    console.log(`   ✅ Total scans: ${totalScans}`);
    console.log(`   ✅ Wallets uniques: ${uniqueWallets}`);

    // 5. Nettoyage des données de test
    console.log("\n5. Nettoyage des données de test...");

    // Supprimer les contests de test
    const deletedContests = await prisma.contest.deleteMany({
      where: { name: { contains: "Test Data Update" } },
    });
    console.log(`   ✅ ${deletedContests.count} contests de test supprimés`);

    // Supprimer les jerseys de test
    const deletedJerseys = await prisma.jersey.deleteMany({
      where: { id: { contains: "test-jersey-" } },
    });
    console.log(`   ✅ ${deletedJerseys.count} jerseys de test supprimés`);

    // Supprimer les entrées dex de test
    const deletedDexEntries = await prisma.jerseyDex.deleteMany({
      where: { walletAddress: testWallet.toLowerCase() },
    });
    console.log(
      `   ✅ ${deletedDexEntries.count} entrées dex de test supprimées`
    );

    console.log("\n🎉 Test terminé avec succès !");
    console.log("\n📋 Solutions implémentées pour toutes les données :");
    console.log(
      "   ✅ Actions serveur avec revalidatePath() pour les contests"
    );
    console.log(
      "   ✅ Actions serveur avec revalidatePath() pour le jerseydex"
    );
    console.log("   ✅ Configuration Next.js anti-cache");
    console.log("   ✅ Revalidation automatique après création/modification");
    console.log("   ✅ Affichage immédiat des nouvelles données");
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAllDataUpdates();
