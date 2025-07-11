# 🪙 Guide Intégration PSG Fan Tokens

> **Mise à jour:** Persistance wallet + Vérification tokens PSG + Réductions dynamiques

## 📋 Vue d'Ensemble

Cette intégration ajoute :
- **Persistance automatique** de la connexion wallet entre les sessions
- **Vérification du solde** $PSG Fan Token pour des réductions exclusives  
- **Réductions progressives** basées sur le nombre de tokens détenus
- **Mode simulation** pour le hackathon avec fallback production

## 🔧 Composants Mis à Jour

### `useWeb3()` Hook Amélioré
```typescript
const {
  // État de base
  isConnected, address, balance,
  
  // Nouveautés PSG
  psgTokenBalance,
  hasEnoughPsgTokens,
  psgDiscountPercentage,
  isCheckingPsgToken,
  
  // Fonctions utilitaires
  recheckPsgBalance,
  disconnectWallet
} = useWeb3()
```

### `WalletPriceDisplay` Amélioré
Affiche maintenant :
- **Réduction wallet de base** (ex: -20%)
- **Réduction PSG supplémentaire** (ex: -15% à -25%)
- **Total économisé** en euros
- **Détails des tokens** possédés

### Nouveaux Composants

#### `PsgTokenStatus`
Composant dédié pour :
- Afficher le solde $PSG en temps réel
- Simuler l'ajout/suppression de tokens
- Barres de progression vers les réductions
- Boutons de debug pour le hackathon

#### `PsgTokenPriceDisplay`
Alternative spécialisée avec :
- Prix exclusifs fans PSG
- Badges de statut VIP
- Messages promotionnels contextuels

## 💰 Système de Réductions PSG

### Barème Progressive
```javascript
1000+ $PSG = -25% de réduction
500+  $PSG = -20% de réduction  
100+  $PSG = -15% de réduction
< 100 $PSG = Pas de réduction
```

### Calcul des Prix
```javascript
// Prix final = Prix de base × (1 - réductionWallet/100) × (1 - réductionPSG/100)
const prixWallet = 111 * (1 - 20/100) = 89€
const prixFinal = 89 * (1 - 20/100) = 71€  // Avec 500+ PSG tokens
const economie = 111 - 71 = 40€ économisés !
```

## 🔄 Persistance de la Connexion

### Mécanisme Automatique
```typescript
// Sauvegarde automatique
localStorage.setItem('wallet-connected', 'true')
localStorage.setItem('wallet-address', address)

// Reconnexion au chargement
useEffect(() => {
  const wasConnected = localStorage.getItem('wallet-connected')
  if (wasConnected && !isConnected) {
    reconnect() // Tentative automatique
  }
}, [])
```

### Gestion des Erreurs
- **Échec de reconnexion** → Nettoyage localStorage
- **Wallet non disponible** → Fallback gracieux
- **Réseau changé** → Re-vérification des tokens

## 🎮 Mode Simulation (Hackathon)

### Utilisateurs Simulés avec Tokens
```typescript
const SIMULATED_TOKEN_HOLDERS = new Set([
  '0x742d35cc6636c0532925a3b8d6b9dcc7c1c72e72',
  '0x8ba1f109551bd432803012645dc12c18e34f7c1b',
  // Ajouter ici les adresses des juges
])
```

### Toggle Simulation
```typescript
// Dans PsgTokenStatus.tsx
const toggleSimulation = () => {
  if (SIMULATED_TOKEN_HOLDERS.has(address)) {
    SIMULATED_TOKEN_HOLDERS.delete(address) // Retirer tokens
  } else {
    SIMULATED_TOKEN_HOLDERS.add(address)    // Ajouter tokens
  }
  recheckPsgBalance() // Re-vérifier
}
```

## 📱 Pages de Test

### `/test-wallet` - Environnement Complet
- Connexion wallet multi-variantes
- Statut tokens PSG en temps réel
- Tests de prix avec réductions
- Simulation interactive
- Debug et monitoring

### Tests Recommandés
1. **Première connexion** → Persistance activée
2. **Rechargement page** → Reconnexion automatique
3. **Simulation tokens** → Réductions appliquées
4. **Navigation** → État conservé
5. **Déconnexion** → Nettoyage propre

## 🚀 Déploiement Production

### Configuration Live
```typescript
// Passer useSimulation à false
const balance = await getPsgTokenBalance(address, false)

// Utiliser le contrat PSG réel
const PSG_CONTRACT = '0x054c9d4c9f5951ff7bd4503c8e30fa14c1d40c82'
```

### Contrat PSG Fan Token
```typescript
// ABI balanceOf standard ERC20
const balance = await readContract({
  address: PSG_CONTRACT,
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [userAddress]
})
```

## 📊 Monitoring & Analytics

### Événements Trackés
```javascript
// Connexions wallet
console.log('🔗 Wallet connecté:', address)

// Tokens PSG détectés  
console.log('🪙 PSG tokens:', balance, 'réduction:', percentage)

// Réductions appliquées
console.log('💰 Économie:', savings, 'prix final:', finalPrice)
```

### Métriques Business
- **Taux de connexion wallet** : baseline établie
- **Utilisateurs avec tokens PSG** : segment premium
- **Conversion avec réductions** : impact ROI
- **Persistance sessions** : fidélisation

## 🔍 Debug & Troubleshooting

### Console de Debug
```javascript
// Vérifier état wallet
console.log('Wallet état:', {
  isConnected,
  address,
  hasTokens: hasEnoughPsgTokens,
  discount: psgDiscountPercentage
})

// Forcer re-vérification
await recheckPsgBalance()
```

### Problèmes Courants

#### Tokens PSG non détectés
```javascript
// Vérifier l'adresse dans la simulation
SIMULATED_TOKEN_HOLDERS.has(address.toLowerCase())

// Forcer la re-vérification
const balance = await getPsgTokenBalance(address, true)
```

#### Persistance qui ne fonctionne pas
```javascript
// Vérifier localStorage
localStorage.getItem('wallet-connected') // doit être 'true'
localStorage.getItem('wallet-address')   // doit contenir l'adresse

// Nettoyer si nécessaire
disconnectWallet() // nettoyage complet
```

#### Réductions non appliquées
```javascript
// Vérifier les conditions
hasEnoughPsgTokens              // true/false
psgTokenBalance.balance         // > minimumForDiscount
psgDiscountPercentage          // > 0
```

## 🎯 Roadmap Futures Améliorations

### Phase 2 : Intégration Complète
- **Paiement en CHZ** direct dans le shop
- **Staking de tokens** PSG pour plus de réductions
- **NFT badges** exclusifs pour les gros détenteurs
- **Programme de fidélité** multi-clubs

### Phase 3 : Écosystème Élargi
- **Cross-chain** support (Ethereum ↔ Chiliz)
- **DeFi yield farming** avec tokens club
- **Governance** votes sur collections futures
- **Marketplace P2P** pour échanger tokens

---

## ✅ Checklist de Validation

- [ ] **Connexion MetaMask** fonctionne
- [ ] **Persistance** entre rechargements
- [ ] **Tokens PSG** simulés correctement
- [ ] **Réductions** calculées et affichées
- [ ] **Interface responsive** mobile/desktop
- [ ] **Tests complets** sur `/test-wallet`
- [ ] **Documentation** à jour
- [ ] **Performance** optimisée

**🎉 Prêt pour le hackathon !**
