# 🔍 Guide de Vérification Blockchain - Données de Loterie

## 🎯 Comment Vérifier que Vos Données Sont On-Chain

### 1. Via l'Interface Utilisateur

#### A. Après Participation
Quand vous participez à un concours :

1. **Hash de transaction** apparaît automatiquement
2. **Bouton "Vérifier"** pour vérification temps réel
3. **Lien explorateur** pour voir publiquement
4. **Statut confirmé** quand enregistré on-chain

#### B. Interface Admin
Dans `/admin/contests/[id]` :

1. **Historique blockchain** complet visible
2. **Tous les événements** listés avec hash
3. **Liens directs** vers l'explorateur Chiliz
4. **Timeline** des participations et annonces

### 2. Via l'Explorateur Chiliz Directement

#### URLs Importantes
```
Testnet Spicy: https://spicy-explorer.chiliz.com
Mainnet: https://scan.chiliz.com
```

#### Comment Vérifier
1. **Copier le hash** de transaction depuis l'interface
2. **Aller sur** l'explorateur Chiliz
3. **Coller le hash** dans la barre de recherche
4. **Voir les détails** de la transaction

#### Exemple d'URL
```
https://spicy-explorer.chiliz.com/tx/0x1234567890abcdef...
```

### 3. Que Voir Sur l'Explorateur

#### Informations de Base
- ✅ **Hash** : Identifiant unique de la transaction
- ✅ **Block Number** : Numéro du bloc (preuve d'inclusion)
- ✅ **Status** : Success/Failed
- ✅ **From/To** : Adresses expéditeur/destinataire
- ✅ **Gas Used** : Coût de la transaction
- ✅ **Timestamp** : Horodatage précis

#### Données de Loterie (dans Input Data)
Les données JSON de votre participation/annonce :

```json
{
  "type": "LOTTERY_PARTICIPATION",
  "contestId": "contest-summer-2024",
  "participantAddress": "0x742d35cc...",
  "jerseyId": "jersey-messi-2024",
  "username": "FanPSG",
  "timestamp": 1673456789
}
```

### 4. Via les APIs de Vérification

#### A. API d'Inspection
```bash
GET /api/blockchain/inspect/[hash]
```

**Exemple :**
```bash
curl http://localhost:3000/api/blockchain/inspect/0x1234...
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "hash": "0x1234...",
    "blockNumber": 12345,
    "status": 1,
    "data": {
      "type": "LOTTERY_PARTICIPATION",
      "contestId": "contest-123",
      "participantAddress": "0x742d35cc...",
      "jerseyId": "jersey-messi-2024",
      "username": "FanPSG"
    }
  }
}
```

#### B. API d'Historique
```bash
GET /api/blockchain/contests/[id]/history
```

### 5. Utilisation du Script de Vérification

```bash
# Vérifier une transaction spécifique
./verify-blockchain.sh 0x1234567890abcdef...

# Ou utiliser le script d'inspection complet
node -e "
const { inspectLotteryTransaction } = require('./src/lib/blockchain-inspector');
inspectLotteryTransaction('0x1234567890abcdef...');
"
```

### 6. Garanties Blockchain

#### Ce Qui Est Garanti
✅ **Immuabilité** : Impossible de modifier après enregistrement  
✅ **Horodatage** : Timestamp précis et vérifiable  
✅ **Transparence** : Visible par tous publiquement  
✅ **Auditabilité** : Historique complet consultable  
✅ **Décentralisation** : Stocké sur réseau Chiliz distribué  

#### Structure des Données Enregistrées

**Pour une Participation :**
```json
{
  "type": "LOTTERY_PARTICIPATION",
  "contestId": "ID du concours",
  "participantAddress": "0x... (wallet du participant)",
  "jerseyId": "ID du maillot scanné", 
  "username": "Nom d'utilisateur",
  "timestamp": "Horodatage Unix"
}
```

**Pour une Annonce de Gagnant :**
```json
{
  "type": "WINNER_ANNOUNCEMENT", 
  "contestId": "ID du concours",
  "winnerAddress": "0x... (wallet du gagnant)",
  "prize": "Description du prix",
  "rank": "Position (1, 2, 3)",
  "timestamp": "Horodatage Unix"
}
```

### 7. Outils de Développement

#### Console Browser
Dans la console de votre navigateur :

```javascript
// Vérifier une transaction
fetch('/api/blockchain/inspect/0x1234...')
  .then(r => r.json())
  .then(console.log);

// Voir l'historique d'un concours  
fetch('/api/blockchain/contests/contest-123/history')
  .then(r => r.json())
  .then(console.log);
```

#### Vérification RPC Directe
```javascript
// Connexion directe au RPC Chiliz
const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
const tx = await provider.getTransaction('0x1234...');
console.log(tx);
```

### 8. Checklist de Vérification

#### Pour une Participation
- [ ] Hash de transaction généré
- [ ] Transaction visible sur explorateur Chiliz
- [ ] Données JSON décodables dans Input Data
- [ ] ContestId correct
- [ ] ParticipantAddress correspond
- [ ] JerseyId correct
- [ ] Timestamp cohérent

#### Pour une Annonce de Gagnant
- [ ] Hash de transaction généré
- [ ] Transaction visible sur explorateur Chiliz  
- [ ] Données JSON décodables dans Input Data
- [ ] ContestId correct
- [ ] WinnerAddress correspond
- [ ] Prize description correcte
- [ ] Rank approprié (1, 2, 3)

### 9. Troubleshooting

#### Transaction Non Trouvée
- ✅ Vérifier le hash complet (64 caractères)
- ✅ Confirmer le bon réseau (testnet vs mainnet)
- ✅ Attendre la confirmation (peut prendre quelques secondes)

#### Données Non Décodables
- ✅ Vérifier que c'est bien une transaction de loterie
- ✅ Données peuvent être en hexadécimal (utiliser ethers.toUtf8String)

#### Lien Explorateur Cassé
- ✅ Vérifier l'URL : `https://spicy-explorer.chiliz.com/tx/[HASH]`
- ✅ Utiliser l'API de vérification en backup

---

## 🏆 Résultat

**Avec cette intégration, chaque action de loterie (participation et annonce de gagnant) est automatiquement et de manière transparente enregistrée sur la blockchain Chiliz. Toutes les données sont publiquement vérifiables, ce qui garantit l'équité et la transparence du système de loterie.**
