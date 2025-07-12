const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function debugTimeConversion() {
  try {
    console.log("🔍 Débogage de la conversion des dates...\n");

    const now = new Date();
    console.log("⏰ HEURE ACTUELLE:");
    console.log(`   UTC: ${now.toISOString()}`);
    console.log(
      `   Locale (Paris): ${now.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      })}`
    );
    console.log(`   Timestamp: ${now.getTime()}`);
    console.log(`   Timezone offset (minutes): ${now.getTimezoneOffset()}`);
    console.log(`   Timezone offset (heures): ${now.getTimezoneOffset() / 60}`);

    // Test de la conversion locale -> UTC
    console.log("\n🔄 TEST CONVERSION LOCALE -> UTC:");
    const localTimeStr = "2025-07-12T20:18:00"; // Heure locale choisie
    console.log(`   Heure locale choisie: ${localTimeStr}`);

    const localDate = new Date(localTimeStr);
    console.log(`   Date locale (raw): ${localDate.toISOString()}`);
    console.log(
      `   Date locale (locale): ${localDate.toLocaleString("fr-FR", {
        timeZone: "Europe/Paris",
      })}`
    );

    // Conversion correcte locale -> UTC
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );
    console.log(`   Date UTC (convertie): ${utcDate.toISOString()}`);

    // Récupérer le concours en base
    const contest = await prisma.contest.findFirst({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });

    if (contest) {
      console.log("\n📅 CONCOURS EN BASE:");
      console.log(`   ID: ${contest.id}`);
      console.log(`   Nom: ${contest.name}`);
      console.log(`   startedAt (raw): ${contest.startedAt}`);
      console.log(`   startedAt (ISO): ${contest.startedAt.toISOString()}`);
      console.log(
        `   startedAt (locale): ${contest.startedAt.toLocaleString("fr-FR", {
          timeZone: "Europe/Paris",
        })}`
      );

      // Comparaison
      console.log("\n⚖️ COMPARAISON:");
      console.log(`   Maintenant (UTC): ${now.toISOString()}`);
      console.log(
        `   Début concours (UTC): ${contest.startedAt.toISOString()}`
      );
      console.log(`   Concours commencé: ${now >= contest.startedAt}`);
      console.log(
        `   Différence (minutes): ${(now - contest.startedAt) / 60000}`
      );
    }
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugTimeConversion();
