const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function addTestParticipations() {
  try {
    // Récupérer le concours de test
    const contest = await prisma.contest.findFirst({
      where: {
        name: {
          contains: "Concours Maillot Mbappé 2024",
        },
      },
    });

    if (!contest) {
      console.log(
        "❌ Aucun concours de test trouvé. Créez d'abord un concours avec create-test-contest.js"
      );
      return;
    }

    console.log(`📋 Concours trouvé: ${contest.name} (ID: ${contest.id})`);

    // Adresses de test avec des usernames
    const testParticipants = [
      {
        walletAddress: "0x1234567890123456789012345678901234567890",
        username: "MbappéFan2024",
        jerseyId: "jersey-1",
      },
      {
        walletAddress: "0x2345678901234567890123456789012345678901",
        username: "PSGSupporter",
        jerseyId: "jersey-2",
      },
      {
        walletAddress: "0x3456789012345678901234567890123456789012",
        username: "ChillizLover",
        jerseyId: "jersey-1",
      },
      {
        walletAddress: "0x4567890123456789012345678901234567890123",
        username: "CryptoCollector",
        jerseyId: "jersey-3",
      },
      {
        walletAddress: "0x5678901234567890123456789012345678901234",
        username: "FanTokenHolder",
        jerseyId: "jersey-2",
      },
      {
        walletAddress: "0x6789012345678901234567890123456789012345",
        username: "Web3Enthusiast",
        jerseyId: "jersey-1",
      },
      {
        walletAddress: "0x7890123456789012345678901234567890123456",
        username: "BlockchainGuru",
        jerseyId: "jersey-3",
      },
      {
        walletAddress: "0x8901234567890123456789012345678901234567",
        username: "DeFiMaster",
        jerseyId: "jersey-2",
      },
    ];

    console.log(
      `🎯 Ajout de ${testParticipants.length} participations de test...`
    );

    // Ajouter les participations
    for (const participant of testParticipants) {
      try {
        await prisma.participation.create({
          data: {
            contestId: contest.id,
            jerseyId: participant.jerseyId,
            walletAddress: participant.walletAddress,
            username: participant.username,
            participatedAt: new Date(),
          },
        });
        console.log(`✅ Participation ajoutée pour ${participant.username}`);
      } catch (error) {
        if (error.code === "P2002") {
          console.log(
            `⚠️  Participation déjà existante pour ${participant.username}`
          );
        } else {
          console.log(`❌ Erreur pour ${participant.username}:`, error.message);
        }
      }
    }

    // Vérifier le nombre total de participations
    const participationsCount = await prisma.participation.count({
      where: { contestId: contest.id },
    });

    console.log(`\n🎉 Participations ajoutées avec succès !`);
    console.log(
      `📊 Total des participations pour ce concours: ${participationsCount}`
    );
    console.log(`\n🔗 Pour tester la sélection des gagnants:`);
    console.log(`   http://localhost:3001/admin/contests/${contest.id}`);
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestParticipations();
