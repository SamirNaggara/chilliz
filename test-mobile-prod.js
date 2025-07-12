// Test de compatibilité mobile pour production
console.log('🧪 Test compatibilité mobile MetaMask');

// Détection environnement
const isProduction = window.location.protocol === 'https:';
const isLocalhost = window.location.hostname === 'localhost';
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

console.log('📍 Environnement:', {
  isProduction,
  isLocalhost,
  isMobile,
  protocol: window.location.protocol,
  hostname: window.location.hostname
});

// Test MetaMask
const hasMetaMask = !!window.ethereum?.isMetaMask;
const hasEthereum = !!window.ethereum;

console.log('🦊 MetaMask:', {
  hasMetaMask,
  hasEthereum,
  provider: window.ethereum
});

// Test deep link
if (isMobile) {
  const deepLink = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
  console.log('🔗 Deep link:', deepLink);
  
  // Test si le deep link est valide
  const isValidDeepLink = deepLink.includes('https://') && !deepLink.includes('localhost');
  console.log('✅ Deep link valide pour prod:', isValidDeepLink);
}

// Recommandations
console.log('💡 Recommandations:');
if (isLocalhost) {
  console.log('- En localhost: MetaMask mobile peut ne pas fonctionner');
  console.log('- Solution: Déployer sur un vrai domaine HTTPS');
}
if (!isProduction) {
  console.log('- HTTP détecté: MetaMask requiert HTTPS en production');
}
if (isMobile && hasMetaMask) {
  console.log('- Mobile + MetaMask: Parfait pour la prod !');
}
