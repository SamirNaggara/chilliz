'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount, useBalance, useReadContract, useWriteContract, useReconnect } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { handleWeb3Error } from '@/lib/web3'
import { useChilizContract, FanTokenBalance, loadSimulationFromStorage, SIMULATED_TOKEN_HOLDERS } from '@/lib/chiliz'

export function useWeb3() {
  const { address, isConnected, chainId } = useAccount()
  const { reconnect } = useReconnect()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [psgTokenBalance, setPsgTokenBalance] = useState<FanTokenBalance | null>(null)
  const [isCheckingPsgToken, setIsCheckingPsgToken] = useState(false)

  // Hook pour obtenir le solde
  const { data: balance } = useBalance({
    address: address,
  })

  // Hook pour les contrats
  const { writeContract } = useWriteContract()

  // Charger la simulation au montage du composant
  useEffect(() => {
    loadSimulationFromStorage()
  }, [])

  // Fonction stable pour vérifier le solde PSG
  const getPsgTokenBalance = useCallback(async (userAddress: string, useSimulation: boolean = true): Promise<FanTokenBalance> => {
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
  }, [])

  // Persistance de la connexion - reconnexion automatique
  useEffect(() => {
    const reconnectWallet = async () => {
      try {
        // Vérifier si une connexion était précédemment établie
        const previousConnection = localStorage.getItem('wallet-connected')
        if (previousConnection === 'true' && !isConnected) {
          console.log('Tentative de reconnexion automatique...')
          await reconnect()
        }
      } catch (error) {
        console.log('Reconnexion automatique échouée:', error)
        localStorage.removeItem('wallet-connected')
      }
    }

    reconnectWallet()
  }, [reconnect, isConnected])

  // Sauvegarder l'état de connexion
  useEffect(() => {
    if (isConnected) {
      localStorage.setItem('wallet-connected', 'true')
      localStorage.setItem('wallet-address', address || '')
    } else {
      localStorage.removeItem('wallet-connected')
      localStorage.removeItem('wallet-address')
    }
  }, [isConnected, address])

  // Vérifier le solde PSG quand l'adresse change
  useEffect(() => {
    const checkPsgBalance = async () => {
      if (!address || !isConnected) {
        setPsgTokenBalance(null)
        return
      }

      setIsCheckingPsgToken(true)
      try {
        const balance = await getPsgTokenBalance(address, true) // true = mode simulation
        setPsgTokenBalance(balance)
      } catch (error) {
        console.error('Erreur lors de la vérification du token PSG:', error)
        setPsgTokenBalance(null)
      } finally {
        setIsCheckingPsgToken(false)
      }
    }

    checkPsgBalance()
  }, [address, isConnected, getPsgTokenBalance]) // Remettre getPsgTokenBalance maintenant qu'elle est stable

  // Fonction pour envoyer des transactions
  const sendTransaction = useCallback(async (
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[] = [],
    value: string = '0'
  ) => {
    if (!isConnected || !address) {
      setError('Wallet non connecté')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName,
        args,
        value: parseEther(value),
      })

      setIsLoading(false)
      return result
    } catch (err: any) {
      const errorMessage = handleWeb3Error(err)
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }, [isConnected, address, writeContract])

  // Fonction pour lire des données de contrat
  const readContract = useCallback((
    contractAddress: string,
    abi: any[],
    functionName: string,
    args: any[] = []
  ) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName,
      args,
    })
  }, [])

  // Fonction pour formater le solde
  const getFormattedBalance = useCallback(() => {
    if (!balance) return '0'
    return formatEther(balance.value)
  }, [balance])

  // Fonction pour vérifier si on est sur la bonne chaîne
  const isCorrectChain = useCallback((expectedChainId: number) => {
    return chainId === expectedChainId
  }, [chainId])

  // Fonction pour forcer la vérification du token PSG
  const recheckPsgBalance = useCallback(async () => {
    if (!address || !isConnected) return null

    setIsCheckingPsgToken(true)
    try {
      const balance = await getPsgTokenBalance(address, true)
      setPsgTokenBalance(balance)
      return balance
    } catch (error) {
      console.error('Erreur lors de la re-vérification du token PSG:', error)
      return null
    } finally {
      setIsCheckingPsgToken(false)
    }
  }, [address, isConnected, getPsgTokenBalance])

  // Fonction pour vérifier si l'utilisateur a assez de tokens PSG pour une réduction
  const hasEnoughPsgTokens = useCallback(() => {
    if (!psgTokenBalance) return false
    return psgTokenBalance.hasTokens && psgTokenBalance.balance >= psgTokenBalance.minimumForDiscount
  }, [psgTokenBalance])

  // Fonction pour obtenir le pourcentage de réduction basé sur les tokens PSG
  const getPsgDiscountPercentage = useCallback(() => {
    if (!hasEnoughPsgTokens()) return 0
    
    // Logique de réduction progressive basée sur le nombre de tokens
    const balance = Number(psgTokenBalance?.balance || 0) / 1e18 // Convertir en tokens entiers
    
    if (balance >= 1000) return 25 // 25% pour 1000+ tokens
    if (balance >= 500) return 20  // 20% pour 500+ tokens  
    if (balance >= 100) return 15  // 15% pour 100+ tokens
    
    return 0
  }, [psgTokenBalance, hasEnoughPsgTokens])

  // Fonction pour déconnecter proprement
  const disconnectWallet = useCallback(() => {
    localStorage.removeItem('wallet-connected')
    localStorage.removeItem('wallet-address')
    setPsgTokenBalance(null)
  }, [])

  return {
    // État de connexion
    address,
    isConnected,
    chainId,
    balance: balance?.value,
    formattedBalance: getFormattedBalance(),
    
    // État des tokens PSG
    psgTokenBalance,
    isCheckingPsgToken,
    hasEnoughPsgTokens: hasEnoughPsgTokens(),
    psgDiscountPercentage: getPsgDiscountPercentage(),
    
    // État des transactions
    isLoading,
    error,
    setError,
    
    // Fonctions utilitaires
    sendTransaction,
    readContract,
    isCorrectChain,
    recheckPsgBalance,
    disconnectWallet,
    
    // Utilitaires
    clearError: () => setError(null),
  }
}

export default useWeb3
