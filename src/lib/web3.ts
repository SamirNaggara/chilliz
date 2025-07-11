import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Configuration des chaînes blockchain supportées
export const config = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'votre-project-id-walletconnect',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
})

// Types pour les erreurs Web3
export interface Web3Error {
  code: number
  message: string
  data?: any
}

// Utilitaires pour la gestion des erreurs
export const handleWeb3Error = (error: any): string => {
  if (error?.code === 4001) {
    return 'Transaction rejetée par l\'utilisateur'
  }
  if (error?.code === -32602) {
    return 'Paramètres invalides'
  }
  if (error?.code === -32603) {
    return 'Erreur interne'
  }
  return error?.message || 'Une erreur inconnue s\'est produite'
}

// Fonction pour vérifier si MetaMask est installé
export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === 'undefined') return false
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask
}

// Fonction pour formater les adresses
export const formatAddress = (address: string): string => {
  if (!address) return ''
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

// Fonction pour formater les montants ETH
export const formatEther = (value: bigint): string => {
  const eth = Number(value) / 1e18
  return eth.toFixed(4)
}
