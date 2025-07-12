// Test de la conversion exacte du formulaire
function testFormConversion() {
  console.log("🧪 Test de la conversion du formulaire...\n");

  // Simuler l'heure choisie dans le formulaire (20h33)
  const formTimeStr = "2025-07-12T20:33:00";
  console.log(`⏰ Heure choisie dans le formulaire: ${formTimeStr}`);

  // Ancienne logique (qui causait le problème)
  console.log("\n❌ ANCIENNE LOGIQUE (problématique):");
  const oldLocalDate = new Date(formTimeStr);
  console.log(`   Date créée: ${oldLocalDate.toISOString()}`);
  console.log(
    `   Heure locale: ${oldLocalDate.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );

  // Nouvelle logique (corrigée)
  console.log("\n✅ NOUVELLE LOGIQUE (corrigée):");
  const [datePart, timePart] = formTimeStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Créer la date en heure locale (sans décalage UTC)
  const newLocalDate = new Date(year, month - 1, day, hour, minute, 0);
  console.log(
    `   Date locale créée: ${newLocalDate.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );
  console.log(`   Date locale (raw): ${newLocalDate.toISOString()}`);

  // Convertir en UTC en soustrayant le décalage horaire
  const utcDate = new Date(
    newLocalDate.getTime() - newLocalDate.getTimezoneOffset() * 60000
  );
  console.log(`   Date UTC (convertie): ${utcDate.toISOString()}`);
  console.log(
    `   Date UTC (locale): ${utcDate.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );

  // Comparaison
  console.log("\n📊 COMPARAISON:");
  console.log(`   Heure choisie: 20h33 heure locale`);
  console.log(
    `   Ancienne logique: ${oldLocalDate.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );
  console.log(
    `   Nouvelle logique: ${utcDate.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );

  const now = new Date();
  console.log(
    `\n⏰ Heure actuelle: ${now.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );
  console.log(
    `✅ Concours actif avec nouvelle logique: ${now >= utcDate ? "OUI" : "NON"}`
  );
}

testFormConversion();
