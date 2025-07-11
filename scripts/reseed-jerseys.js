const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function reseedJerseys() {
  try {
    console.log("🗑️ Suppression des maillots existants...");
    await prisma.scan.deleteMany({});
    await prisma.participation.deleteMany({});
    await prisma.jersey.deleteMany({});

    console.log("👕 Création des maillots...");

    const jerseys = [
      {
        id: "jersey-1",
        name: "Maillot Mbappé Home 2024",
      },
      {
        id: "jersey-2",
        name: "Maillot Mbappé Away 2024",
      },
      {
        id: "jersey-3",
        name: "Maillot Mbappé Third 2024",
      },
      {
        id: "jersey-4",
        name: "Maillot Messi Home 2024",
      },
      {
        id: "jersey-5",
        name: "Maillot Messi Away 2024",
      },
      {
        id: "jersey-6",
        name: "Maillot Neymar Home 2024",
      },
      {
        id: "jersey-7",
        name: "Maillot Neymar Away 2024",
      },
      {
        id: "jersey-8",
        name: "Maillot Hakimi Home 2024",
      },
      {
        id: "jersey-9",
        name: "Maillot Hakimi Away 2024",
      },
      {
        id: "jersey-10",
        name: "Maillot Marquinhos Home 2024",
      },
    ];

    for (const jersey of jerseys) {
      await prisma.jersey.create({
        data: jersey,
      });
      console.log(`✅ Créé: ${jersey.name} (${jersey.id})`);
    }

    console.log("\n🎯 Maillots disponibles pour les tests :");
    console.log("1. http://localhost:3000/jersey/jersey-1?isAuth=true");
    console.log("2. http://localhost:3000/jersey/jersey-2?isAuth=true");
    console.log("3. http://localhost:3000/jersey/jersey-3?isAuth=true");
    console.log("4. http://localhost:3000/jersey/jersey-4?isAuth=true");
    console.log("5. http://localhost:3000/jersey/jersey-5?isAuth=true");
    console.log("6. http://localhost:3000/jersey/jersey-6?isAuth=true");
    console.log("7. http://localhost:3000/jersey/jersey-7?isAuth=true");
    console.log("8. http://localhost:3000/jersey/jersey-8?isAuth=true");
    console.log("9. http://localhost:3000/jersey/jersey-9?isAuth=true");
    console.log("10. http://localhost:3000/jersey/jersey-10?isAuth=true");

    console.log("\n📊 Statistiques :");
    const totalJerseys = await prisma.jersey.count();
    console.log(`Total maillots créés : ${totalJerseys}`);
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

reseedJerseys();
