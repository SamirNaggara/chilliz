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

// Fonction pour détecter la disponibilité de MetaMask
export const detectMetaMask = (): {
  isInstalled: boolean;
  isAvailable: boolean;
  provider: any;
} => {
  if (typeof window === 'undefined') {
    return { isInstalled: false, isAvailable: false, provider: null }
  }

  const { ethereum } = window as any;
  
  const isInstalled = Boolean(ethereum && ethereum.isMetaMask);
  const isAvailable = Boolean(ethereum);
  
  return {
    isInstalled,
    isAvailable,
    provider: ethereum
  }
}

// Fonction pour vérifier si l'utilisateur est sur un réseau supporté
export const isSupportedChain = (chainId: number): boolean => {
  const supportedChains = [1, 11155111, 137, 42161, 88888, 88882]; // Mainnet, Sepolia, Polygon, Arbitrum, Chiliz
  return supportedChains.includes(chainId)
}

// Fonction pour obtenir le nom d'un réseau
export const getChainName = (chainId: number): string => {
  const chainNames: Record<number, string> = {
    1: 'Ethereum Mainnet',
    11155111: 'Sepolia Testnet',
    137: 'Polygon Mainnet',
    42161: 'Arbitrum One',
    88888: 'Chiliz Chain',
    88882: 'Chiliz Spicy Testnet',
  }
  return chainNames[chainId] || `Réseau inconnu (${chainId})`
}
