// Contrats et ABIs spécifiques à Chiliz
export const CHILIZ_CONTRACTS = {
  // Mainnet Chiliz
  CHZ_TOKEN: '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
  
  // Fan Tokens sur Chiliz Chain
  PSG_FAN_TOKEN: '0x054c9d4c9f5951ff7bd4503c8e30fa14c1d40c82', // Adresse réelle PSG Fan Token sur Chiliz
  
  // Testnet/Simulation (pour développement)
  PSG_SIMULATION_CONTRACT: '0x1234567890123456789012345678901234567890', // Contrat de simulation
  
  // Sporthub (exemple)
  SPORTHUB: '0x0000000000000000000000000000000000000000', // À remplacer
}

// Configuration des réseaux Chiliz
export const CHILIZ_CHAINS = {
  MAINNET: {
    id: 88888,
    name: 'Chiliz Chain',
    rpcUrl: 'https://rpc.ankr.com/chiliz',
    blockExplorer: 'https://scan.chiliz.com',
  },
  TESTNET: {
    id: 88882,
    name: 'Chiliz Spicy Testnet',
    rpcUrl: 'https://spicy-rpc.chiliz.com',
    blockExplorer: 'https://spicy-explorer.chiliz.com',
  },
}

// ABI simplifié pour les tokens ERC20 (CHZ)
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
] as const

// ABI pour les NFTs (ERC721)
export const ERC721_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
    type: 'function',
  },
] as const

// Types pour les Fan Tokens
export interface FanTokenBalance {
  balance: bigint
  decimals: number
  symbol: string
  hasTokens: boolean
  minimumForDiscount: bigint
}

// Simulation des utilisateurs avec tokens (pour le hackathon)
// Ajouter ici les adresses des juges et testeurs
export const SIMULATED_TOKEN_HOLDERS = new Set([
  '0x742d35cc6636c0532925a3b8d6b9dcc7c1c72e72', // Adresse exemple 1
  '0x8ba1f109551bd432803012645dc12c18e34f7c1b', // Adresse exemple 2
  
  // Adresses MetaMask communes pour tests
  '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', // Exemple MetaMask
  '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // Adresse test Hardhat
  
  // Ajouter ici les adresses spécifiques des juges du hackathon
  // '0x...', // Juge 1
  // '0x...', // Juge 2
  // '0x...', // Organisateur
])

// Hook spécialisé pour les interactions Chiliz et Fan Tokens
export const useChilizContract = () => {
  // Fonction pour lire le solde CHZ
  const getChzBalance = async (userAddress: string) => {
    // À implémenter selon vos besoins
    return null
  }

  // Fonction pour transférer des CHZ
  const transferChz = async (to: string, amount: string) => {
    // À implémenter selon vos besoins
    return null
  }

  // Fonction pour vérifier le solde du PSG Fan Token
  const getPsgTokenBalance = async (userAddress: string, useSimulation: boolean = true): Promise<FanTokenBalance> => {
    if (!userAddress) {
      return {
        balance: BigInt(0),
        decimals: 18,
        symbol: '$PSG',
        hasTokens: false,
        minimumForDiscount: BigInt('100000000000000000000'), // 100 tokens minimum
      }
    }

    // Mode simulation pour le hackathon
    if (useSimulation) {
      const hasTokens = SIMULATED_TOKEN_HOLDERS.has(userAddress.toLowerCase())
      return {
        balance: hasTokens ? BigInt('500000000000000000000') : BigInt(0), // 500 tokens simulés
        decimals: 18,
        symbol: '$PSG',
        hasTokens,
        minimumForDiscount: BigInt('100000000000000000000'), // 100 tokens minimum
      }
    }

    // Mode production avec contrat réel (à utiliser après le hackathon)
    try {
      // Note: Cette partie nécessiterait un appel de contrat réel
      // Pour le moment, on retourne la simulation
      return {
        balance: BigInt(0),
        decimals: 18,
        symbol: '$PSG',
        hasTokens: false,
        minimumForDiscount: BigInt('100000000000000000000'),
      }
    } catch (error) {
      console.error('Erreur lors de la lecture du solde PSG:', error)
      return {
        balance: BigInt(0),
        decimals: 18,
        symbol: '$PSG',
        hasTokens: false,
        minimumForDiscount: BigInt('100000000000000000000'),
      }
    }
  }

  return {
    getChzBalance,
    transferChz,
    getPsgTokenBalance,
    contracts: CHILIZ_CONTRACTS,
    chains: CHILIZ_CHAINS,
  }
}

// Utilitaires pour la gestion de la simulation (hackathon)
export const addToSimulation = (address: string): boolean => {
  if (address && address.length === 42 && address.startsWith('0x')) {
    SIMULATED_TOKEN_HOLDERS.add(address.toLowerCase())
    console.log('✅ Adresse ajoutée à la simulation PSG:', address)
    return true
  }
  console.error('❌ Adresse invalide pour simulation:', address)
  return false
}

export const removeFromSimulation = (address: string): boolean => {
  const removed = SIMULATED_TOKEN_HOLDERS.delete(address.toLowerCase())
  if (removed) {
    console.log('🗑️ Adresse retirée de la simulation PSG:', address)
  }
  return removed
}

export const isInSimulation = (address: string): boolean => {
  return SIMULATED_TOKEN_HOLDERS.has(address.toLowerCase())
}

export const getSimulationList = (): string[] => {
  return Array.from(SIMULATED_TOKEN_HOLDERS)
}

// Fonction pour ajouter automatiquement l'adresse courante (pour tests)
export const enablePsgTokensForCurrentWallet = (address: string) => {
  if (typeof window !== 'undefined') {
    addToSimulation(address)
    // Optionnel: sauvegarder dans localStorage pour persistance
    const currentList = getSimulationList()
    localStorage.setItem('psg-simulation-addresses', JSON.stringify(currentList))
  }
}

// Charger les adresses sauvegardées au démarrage
export const loadSimulationFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('psg-simulation-addresses')
      if (saved) {
        const addresses = JSON.parse(saved) as string[]
        addresses.forEach(addr => addToSimulation(addr))
        console.log('📋 Simulation PSG chargée:', addresses.length, 'adresses')
      }
    } catch (error) {
      console.error('Erreur lors du chargement simulation:', error)
    }
  }
}
