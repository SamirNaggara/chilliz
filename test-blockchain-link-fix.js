// Test pour vérifier le problème avec les liens blockchain
console.log('🔍 Test des liens blockchain');

// Simuler un hash de transaction comme dans blockchain-actions.ts
const testTxHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
console.log('Hash généré:', testTxHash);
console.log('Hash formaté (formatTxHash):', testTxHash.slice(0, 10) + '...' + testTxHash.slice(-8));
console.log('Hash formaté (formatAddress):', testTxHash.slice(0, 6) + '...' + testTxHash.slice(-4));

// Tester le lien explorateur
const testConfig = {
  explorerUrl: 'https://spicy-explorer.chiliz.com'
};
const explorerLink = `${testConfig.explorerUrl}/tx/${testTxHash}`;
console.log('Lien explorateur:', explorerLink);

// Vérifier que le hash est valide (64 caractères hex + 0x)
console.log('Longueur du hash:', testTxHash.length);
console.log('Est-ce que ça commence par 0x:', testTxHash.startsWith('0x'));
console.log('Contenu après 0x:', testTxHash.slice(2));
