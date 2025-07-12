// Test de la conversion corrigée
function testCorrectedConversion() {
  console.log("🧪 Test de la conversion corrigée...\n");

  // Simuler l'heure choisie dans le formulaire (20h33)
  const formTimeStr = "2025-07-12T20:33:00";
  console.log(`⏰ Heure choisie dans le formulaire: ${formTimeStr}`);

  // Logique corrigée
  const [datePart, timePart] = formTimeStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Créer la date en heure locale (sans décalage UTC)
  const localDate = new Date(year, month - 1, day, hour, minute, 0);
  console.log(
    `📅 Date locale créée: ${localDate.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );
  console.log(`📅 Date locale (raw): ${localDate.toISOString()}`);

  // Convertir en UTC en AJOUTANT le décalage horaire (correction)
  const utcDate = new Date(
    localDate.getTime() + localDate.getTimezoneOffset() * 60000
  );
  console.log(`🌍 Date UTC (convertie): ${utcDate.toISOString()}`);
  console.log(
    `🌍 Date UTC (locale): ${utcDate.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );

  const now = new Date();
  console.log(
    `\n⏰ Heure actuelle: ${now.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );
  console.log(`✅ Concours actif: ${now >= utcDate ? "OUI" : "NON"}`);
  console.log(`⏱️ Différence: ${(now - utcDate) / 60000} minutes`);
}

testCorrectedConversion();
