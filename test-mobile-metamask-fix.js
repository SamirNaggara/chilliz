// Test de la correction MetaMask mobile
console.log('🧪 Test de la correction MetaMask mobile');

// Détection environnement
const isProduction = window.location.protocol === 'https:';
const isLocalhost = window.location.hostname === 'localhost';
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);

console.log('📱 Détection mobile:', {
  isMobile,
  isIOS,
  isAndroid,
  userAgent: navigator.userAgent
});

// Test MetaMask
const hasMetaMask = !!window.ethereum?.isMetaMask;
const hasEthereum = !!window.ethereum;

console.log('🦊 État MetaMask:', {
  hasMetaMask,
  hasEthereum,
  provider: window.ethereum
});

// Test des fonctions de correction
if (isMobile) {
  console.log('📱 Tests spécifiques mobile:');
  
  // Test création deep link
  const deepLink = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
  console.log('🔗 Deep link généré:', deepLink);
  
  // Test URLs des stores
  const iosStoreUrl = "https://apps.apple.com/app/metamask/id1438144202";
  const androidStoreUrl = "https://play.google.com/store/apps/details?id=io.metamask";
  
  console.log('🏪 URLs des stores:', {
    ios: iosStoreUrl,
    android: androidStoreUrl,
    recommended: isIOS ? iosStoreUrl : androidStoreUrl
  });
  
  // Test environnement de production
  console.log('🌐 Environnement:', {
    isProduction,
    isLocalhost,
    protocol: window.location.protocol,
    canUseDeepLink: isProduction && !isLocalhost
  });
  
  // Simulation du comportement de connexion
  console.log('🔄 Simulation comportement:');
  if (!hasMetaMask) {
    console.log('- MetaMask non détecté → Utiliser deep link ou store');
    if (isProduction) {
      console.log(`- Deep link: ${deepLink}`);
    } else {
      console.log('- Localhost détecté → Rediriger vers store');
    }
  } else {
    console.log('- MetaMask détecté → Connexion directe possible');
  }
} else {
  console.log('💻 Desktop détecté - comportement standard');
}

// Test de la fonction de deep link
function testDeepLink() {
  if (!isMobile) {
    console.log('❌ Test deep link ignoré (non mobile)');
    return;
  }
  
  console.log('🧪 Test du deep link MetaMask...');
  const deepLink = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
  
  console.log('✅ Deep link créé:', deepLink);
  console.log('ℹ️ Pour tester, copiez ce lien dans le navigateur mobile');
  
  return deepLink;
}

// Test de détection store
function testStoreRedirection() {
  if (!isMobile) {
    console.log('❌ Test store ignoré (non mobile)');
    return;
  }
  
  console.log('🧪 Test redirection store...');
  const storeUrl = isIOS 
    ? "https://apps.apple.com/app/metamask/id1438144202"
    : "https://play.google.com/store/apps/details?id=io.metamask";
    
  console.log(`✅ Store URL pour ${isIOS ? 'iOS' : 'Android'}:`, storeUrl);
  console.log('ℹ️ Pour tester, décommentez la ligne suivante:');
  console.log('// window.open(storeUrl, "_blank");');
  
  return storeUrl;
}

// Exporter les fonctions de test
window.testMetaMaskMobile = {
  testDeepLink,
  testStoreRedirection,
  info: {
    isMobile,
    isIOS,
    isAndroid,
    hasMetaMask,
    isProduction,
    deepLink: isMobile ? `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}` : null
  }
};

console.log('🎯 Tests terminés. Utilisez window.testMetaMaskMobile pour plus de tests.');
