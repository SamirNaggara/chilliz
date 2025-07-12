# Guide de Test - Correction MetaMask Mobile

## 🔧 Corrections Apportées

### 1. **Nouvelles Fonctions dans `web3.ts`**
- `isMobileDevice()` - Détection fiable des appareils mobiles
- `createMetaMaskDeepLink()` - Génération de deep links MetaMask
- `connectMetaMaskMobile()` - Connexion spécialisée mobile
- `getMobileMetaMaskError()` - Messages d'erreur contextuels
- `isProductionEnvironment()` - Vérification HTTPS/production

### 2. **Améliorations `JerseyWalletConnector`**
- ✅ Détection mobile automatique
- ✅ Deep links MetaMask pour mobile
- ✅ Redirection vers App Store/Play Store
- ✅ Messages d'erreur adaptés
- ✅ Fallback automatique en cas d'erreur
- ✅ Avertissement HTTPS pour localhost

### 3. **Améliorations `WalletConnector`**
- ✅ Support mobile amélioré
- ✅ Instructions spécifiques iOS/Android
- ✅ Gestion des erreurs mobile

## 🧪 Comment Tester

### Test Desktop (pour référence)
1. Ouvrir sur navigateur desktop
2. Vérifier que "Install MetaMask" s'affiche si pas installé
3. Vérifier connexion normale si installé

### Test Mobile - Cas 1: MetaMask Non Installé
1. Ouvrir sur mobile (iPhone/Android)
2. Le bouton devrait afficher "Install MetaMask App" ou "Open MetaMask"
3. Cliquer → Devrait rediriger vers App Store/Play Store approprié

### Test Mobile - Cas 2: MetaMask Installé
1. Installer MetaMask mobile
2. Ouvrir l'app via browser mobile
3. Le bouton devrait afficher "Connect Wallet" ou "Open MetaMask"
4. Cliquer → Devrait ouvrir MetaMask app ou utiliser deep link

### Test Mobile - Cas 3: Environnement Localhost
1. Tester en localhost sur mobile
2. Devrait afficher avertissement "HTTPS requis pour mobile"
3. Devrait rediriger vers store plutôt que deep link

## 🔗 URLs de Test

### Deep Link MetaMask (mobile seulement)
```
https://metamask.app.link/dapp/[VOTRE_DOMAINE]/[PATH]
```

### App Stores
- **iOS**: https://apps.apple.com/app/metamask/id1438144202
- **Android**: https://play.google.com/store/apps/details?id=io.metamask

## 📱 Comportement Attendu

| Situation | Desktop | Mobile sans MetaMask | Mobile avec MetaMask |
|-----------|---------|---------------------|---------------------|
| **Bouton** | "Connect Wallet" | "Install MetaMask App" | "Connect Wallet" |
| **Action** | Connexion directe | → App Store | → Deep link/App |
| **Fallback** | Message erreur | Store forcé | Deep link forcé |

## 🐛 Debug Mobile

### Script de Test
Utiliser `test-mobile-metamask-fix.js` dans la console:
```javascript
// Charger le script de test
// Vérifier window.testMetaMaskMobile.info
```

### Logs à Vérifier
```javascript
console.log('🔗 Redirection vers MetaMask mobile:', deepLink)
console.log('🔗 Fallback deep link:', deepLink)
console.log('📱 Mobile détecté, redirection store')
```

### Indicateurs de Succès
- ✅ Détection mobile correcte
- ✅ Deep link généré avec bon format
- ✅ Redirection store appropriée (iOS/Android)
- ✅ Pas d'erreurs console JavaScript
- ✅ Transitions fluides entre apps

## ⚠️ Points d'Attention

### HTTPS Obligatoire
- MetaMask mobile requiert HTTPS en production
- Les deep links ne fonctionnent qu'en HTTPS
- Localhost peut ne pas fonctionner sur mobile

### Gestion des Erreurs
- Fallback automatique vers deep link
- Redirection store si MetaMask absent
- Messages d'erreur contextuels

### Cross-Platform
- URLs différentes iOS/Android
- Détection user agent fiable
- Support navigateurs mobile variés

## 🚀 Déploiement

### Checklist Pré-Production
- [ ] Tester sur iPhone Safari
- [ ] Tester sur Android Chrome
- [ ] Vérifier HTTPS en production
- [ ] Tester avec/sans MetaMask installé
- [ ] Vérifier deep links fonctionnels
- [ ] Valider redirections store

### Monitoring
- Surveiller logs d'erreur MetaMask
- Vérifier taux de connexion mobile
- Monitorer redirections store
