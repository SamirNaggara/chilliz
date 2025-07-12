// Test de la nouvelle conversion locale -> UTC
function testNewConversion() {
  console.log("🧪 Test de la nouvelle conversion...\n");

  // Simuler l'heure locale choisie par l'utilisateur
  const localTimeStr = "2025-07-12T20:25:00"; // 20h25 heure locale
  console.log(`⏰ Heure locale choisie: ${localTimeStr}`);

  // Nouvelle logique de conversion
  const [datePart, timePart] = localTimeStr.split("T");
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

  // Convertir en UTC en soustrayant le décalage horaire
  const utcDate = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000
  );
  console.log(`🌍 Date UTC (convertie): ${utcDate.toISOString()}`);
  console.log(
    `🌍 Date UTC (locale): ${utcDate.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );

  // Comparaison avec l'heure actuelle
  const now = new Date();
  console.log(
    `\n⏰ Heure actuelle: ${now.toLocaleString("fr-FR", {
      timeZone: "Europe/Paris",
    })}`
  );
  console.log(`⏰ Heure actuelle (UTC): ${now.toISOString()}`);

  console.log(
    `\n✅ Résultat: ${
      now >= utcDate ? "CONCOURS ACTIF" : "CONCOURS PAS ENCORE COMMENCÉ"
    }`
  );
  console.log(`⏱️ Différence: ${(now - utcDate) / 60000} minutes`);
}

testNewConversion();
