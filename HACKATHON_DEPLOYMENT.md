# 🚀 Configuration Déploiement Hackathon - PSG Fan Tokens

## 🎯 Fonctionnalités Implémentées

### ✅ Persistance Connexion Wallet
- **Reconnexion automatique** au chargement de page
- **Sauvegarde localStorage** de l'état de connexion
- **Nettoyage propre** lors de la déconnexion
- **Gestion d'erreurs** avec fallback gracieux

### ✅ Vérification Tokens PSG
- **Mode simulation** pour le hackathon (toggle facile)
- **Barème de réductions** progressif selon le solde
- **Calcul automatique** des prix réduits
- **Interface temps réel** avec badges et indicateurs

### ✅ Composants Améliorés
- `useWeb3()` - Hook central avec persistance et PSG
- `WalletPriceDisplay` - Prix avec réductions cumulées
- `PsgTokenStatus` - Statut et simulation interactive
- `PsgShopSection` - Boutique avec produits exclusifs
- `WalletDebugPanel` - Outils de test et debug

## 🔧 Configuration pour les Juges

### Adresses de Test Pré-configurées
```typescript
// Dans src/lib/chiliz.ts - SIMULATED_TOKEN_HOLDERS
'0x742d35cc6636c0532925a3b8d6b9dcc7c1c72e72', // Exemple 1
'0x8ba1f109551bd432803012645dc12c18e34f7c1b', // Exemple 2
'0xd8da6bf26964af9d7eed9e03e53415d37aa96045', // MetaMask commun
'0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // Hardhat test

// AJOUTER ICI les adresses MetaMask des juges :
// '0x[ADRESSE_JUGE_1]',
// '0x[ADRESSE_JUGE_2]',
// '0x[ADRESSE_ORGANISATEUR]',
```

### Comment Ajouter une Adresse de Juge
1. **Méthode Rapide** - Dans `/test-wallet` :
   - Saisir l'adresse dans le champ "Ajouter une adresse"
   - Cliquer "Ajouter" pour activer la simulation
   
2. **Méthode Code** - Modifier directement :
   ```typescript
   // src/lib/chiliz.ts ligne ~45
   export const SIMULATED_TOKEN_HOLDERS = new Set([
     // adresses existantes...
     '0x[ADRESSE_JUGE]', // AJOUTER ICI
   ])
   ```

## 🎮 Démonstration Recommandée

### Étape 1 : Connexion Wallet (2 min)
1. **Aller sur** `/test-wallet` 
2. **Cliquer** "Connecter Wallet" → MetaMask popup
3. **Accepter** la connexion dans MetaMask
4. **Observer** les badges : "✅ Connecté" + "❌ Non éligible PSG"

### Étape 2 : Activation Tokens PSG (1 min)
1. **Dans le panneau debug** → Cliquer "🟢 Activer PSG"
2. **Observer** le changement : "✅ -20% PSG" ou similar
3. **Voir** les réductions appliquées dans tous les prix

### Étape 3 : Test Persistance (1 min)
1. **Recharger** la page (F5)
2. **Vérifier** reconnexion automatique
3. **Confirmer** état PSG conservé

### Étape 4 : Navigation & Shop (2 min)
1. **Aller sur** `/jersey/jersey-mbappe-2024`
2. **Voir** les prix avec réductions cumulées
3. **Tester** la boutique avec produits exclusifs PSG

### Points Clés à Montrer
- 🔄 **Persistance** : Reload → reconnexion auto
- 💰 **Réductions** : Wallet (-20%) + PSG (-20%) = 36% total
- 👑 **Exclusivité** : Produits VIP seulement avec tokens PSG
- 📱 **Responsive** : Interface mobile/desktop

## 📊 Métriques de Réussite

### Performance
- **Connexion** : < 3 secondes
- **Persistance** : 100% après reload
- **Calculs prix** : Temps réel

### UX/UI
- **Badges** visuels clairs
- **Messages** contextuels
- **Transitions** fluides
- **État persistant** entre pages

### Fonctionnalités
- **Simulation PSG** : Toggle instantané
- **Réductions** : Calcul correct
- **Boutique exclusive** : Accès conditionnel
- **Debug panel** : Tools complets

## 🚨 Troubleshooting Hackathon

### Problème : Adresse juge non reconnue
```bash
# Solution 1 : Interface web
1. Aller sur /test-wallet
2. Panneau debug → "Ajouter une adresse"
3. Saisir l'adresse du juge
4. Cliquer "Ajouter"

# Solution 2 : Console navigateur
addToSimulation('0x[ADRESSE_JUGE]')
```

### Problème : Persistance ne fonctionne pas
```bash
# Vérifier localStorage
localStorage.getItem('wallet-connected') // doit être 'true'

# Nettoyer si nécessaire
localStorage.clear()
```

### Problème : Réductions non appliquées
```bash
# Vérifier console navigateur
console.log('PSG Balance:', psgTokenBalance)
console.log('Has enough tokens:', hasEnoughPsgTokens)
console.log('Discount %:', psgDiscountPercentage)

# Forcer re-vérification
recheckPsgBalance()
```

## 🔄 Migration vers Production

### Étape 1 : Désactiver Simulation
```typescript
// src/lib/chiliz.ts
const balance = await getPsgTokenBalance(address, false) // false = production
```

### Étape 2 : Contrat PSG Réel
```typescript
// Chiliz Chain Mainnet
const PSG_CONTRACT = '0x054c9d4c9f5951ff7bd4503c8e30fa14c1d40c82'

// Appel balanceOf réel
const balance = await readContract({
  address: PSG_CONTRACT,
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [userAddress]
})
```

### Étape 3 : Analytics Production
```typescript
// Tracking événements
analytics.track('wallet_connected', { address, chainId })
analytics.track('psg_tokens_detected', { balance, discount })
analytics.track('purchase_with_discount', { originalPrice, finalPrice, savings })
```

## 📋 Checklist Final

### Pré-Demo
- [ ] MetaMask installé sur machine de démo
- [ ] Adresses juges ajoutées à SIMULATED_TOKEN_HOLDERS
- [ ] Page `/test-wallet` accessible
- [ ] Connexion internet stable

### Pendant Demo
- [ ] Montrer connexion wallet
- [ ] Activer simulation PSG
- [ ] Démontrer persistance (reload)
- [ ] Naviguer vers boutique
- [ ] Expliquer roadmap production

### Post-Demo
- [ ] Donner accès code source
- [ ] Expliquer migration production
- [ ] Proposer développements futurs

---

## 🎉 Message Final

Cette intégration **MetaMask + PSG Fan Tokens** démontre :

1. **Innovation technique** : Persistance wallet + tokens verification
2. **UX excellence** : Réductions automatiques + interface intuitive  
3. **Business impact** : Engagement fans + monetization premium
4. **Scalabilité** : Architecture prête pour écosystème Chiliz

**Prêt pour le hackathon ! 🚀**
