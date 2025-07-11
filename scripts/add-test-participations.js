import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addTestParticipations() {
  try {
    // Récupérer le concours de test
    const contest = await prisma.contest.findFirst({
      where: {
        name: {
          contains: "Concours Été 2024",
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
        contestId: contest.id,
        walletAddress: "0x1234567890abcdef",
        jerseyId: "jersey-mbappe-2024",
        username: "user1",
      },
      {
        contestId: contest.id,
        walletAddress: "0xabcdef1234567890",
        jerseyId: "jersey-messi-2024",
        username: "user2",
      },
      {
        contestId: contest.id,
        walletAddress: "0x1111111111111111",
        jerseyId: "jersey-mbappe-2024",
        username: "user3",
      },
      {
        contestId: contest.id,
        walletAddress: "0x2222222222222222",
        jerseyId: "jersey-mbappe-2024",
        username: "user4",
      },
      {
        contestId: contest.id,
        walletAddress: "0x3333333333333333",
        jerseyId: "jersey-messi-2024",
        username: "user5",
      },
      {
        contestId: contest.id,
        walletAddress: "0x4444444444444444",
        jerseyId: "jersey-mbappe-2024",
        username: "user6",
      },
      {
        contestId: contest.id,
        walletAddress: "0x5555555555555555",
        jerseyId: "jersey-mbappe-2024",
        username: "user7",
      },
      {
        contestId: contest.id,
        walletAddress: "0x6666666666666666",
        jerseyId: "jersey-messi-2024",
        username: "user8",
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
            contestId: participant.contestId,
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
    console.log(`   http://localhost:3000/admin/contests/${contest.id}`);
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addTestParticipations();
