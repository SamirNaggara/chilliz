# Guide d'installation et configuration Web3

## Installation de MetaMask

### 1. Téléchargement
- Visitez [https://metamask.io/download/](https://metamask.io/download/)
- Choisissez votre navigateur (Chrome, Firefox, Edge, Brave)
- Cliquez sur "Install MetaMask for [votre navigateur]"

### 2. Configuration initiale
1. Cliquez sur l'extension MetaMask dans votre navigateur
2. Choisissez "Créer un nouveau portefeuille" ou "Importer un portefeuille existant"
3. Créez un mot de passe sécurisé
4. **IMPORTANT** : Sauvegardez votre phrase secrète de récupération en lieu sûr

### 3. Ajout du réseau Chiliz

#### Chiliz Chain Mainnet
- **Nom du réseau** : Chiliz Chain
- **URL RPC** : https://rpc.ankr.com/chiliz
- **ID de chaîne** : 88888
- **Symbole de devise** : CHZ
- **Explorateur de blocs** : https://scan.chiliz.com/

#### Chiliz Spicy Testnet
- **Nom du réseau** : Chiliz Spicy Testnet
- **URL RPC** : https://spicy-rpc.chiliz.com/
- **ID de chaîne** : 88882
- **Symbole de devise** : CHZ
- **Explorateur de blocs** : https://testnet.chiliscan.com/

### 4. Ajout manuel des réseaux dans MetaMask

1. Ouvrez MetaMask
2. Cliquez sur le menu déroulant du réseau (en haut)
3. Cliquez sur "Ajouter un réseau"
4. Sélectionnez "Ajouter un réseau manuellement"
5. Remplissez les informations ci-dessus
6. Cliquez sur "Enregistrer"

## Configuration du projet

### Variables d'environnement
Copiez `.env.example` vers `.env.local` et configurez :

```bash
cp .env.example .env.local
```

### Obtenir un Project ID WalletConnect
1. Visitez [https://cloud.walletconnect.com/](https://cloud.walletconnect.com/)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Copiez le Project ID dans `.env.local`

## Test de l'intégration

### 1. Démarrer l'application
```bash
npm run dev
```

### 2. Vérifier la connexion
1. Ouvrez http://localhost:3000
2. Cliquez sur "Connecter MetaMask"
3. Approuvez la connexion dans MetaMask
4. Vérifiez que votre adresse et solde s'affichent

### 3. Tester les différents réseaux
1. Changez de réseau dans MetaMask
2. Vérifiez que l'interface se met à jour
3. Testez sur Chiliz Spicy Testnet pour le développement

## Fonctionnalités disponibles

### Composants React
- `WalletConnector` : Connexion/déconnexion du wallet
- `WalletInfo` : Affichage des informations du wallet
- `Web3Provider` : Provider global pour l'application

### Hooks personnalisés
- `useWeb3()` : Hook principal pour les interactions Web3
- `useChilizContract()` : Hook spécialisé pour Chiliz

### Utilitaires
- `formatAddress()` : Formatage des adresses
- `formatEther()` : Formatage des montants
- `handleWeb3Error()` : Gestion des erreurs Web3
- `isMetaMaskInstalled()` : Vérification d'installation MetaMask

## Résolution des problèmes

### MetaMask non détecté
- Vérifiez que l'extension est installée et activée
- Actualisez la page
- Vérifiez que vous êtes sur HTTPS (requis pour Web3)

### Connexion échouée
- Vérifiez que MetaMask n'est pas verrouillé
- Essayez de réinitialiser la connexion dans MetaMask
- Vérifiez la console pour les erreurs

### Réseau incorrect
- Ajoutez manuellement le réseau Chiliz dans MetaMask
- Vérifiez les paramètres RPC
- Utilisez le testnet pour le développement

## Prochaines étapes

1. Intégrer les smart contracts spécifiques au projet
2. Ajouter la signature de transactions
3. Implémenter les interactions avec les NFTs de maillots
4. Connecter avec la base de données pour synchroniser les wallets
