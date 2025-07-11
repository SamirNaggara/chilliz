// Contrats et ABIs spécifiques à Chiliz
export const CHILIZ_CONTRACTS = {
  // Mainnet Chiliz
  CHZ_TOKEN: '0x3506424f91fd33084466f402d5d97f05f8e3b4af',
  
  // Sporthub (exemple)
  SPORTHUB: '0x0000000000000000000000000000000000000000', // À remplacer
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

// Hook spécialisé pour les interactions Chiliz
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

  return {
    getChzBalance,
    transferChz,
    contracts: CHILIZ_CONTRACTS,
  }
}
