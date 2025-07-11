'use client'

import { useState, useCallback } from 'react'
import { useAccount, useBalance, useReadContract, useWriteContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { handleWeb3Error } from '@/lib/web3'

export function useWeb3() {
  const { address, isConnected, chainId } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hook pour obtenir le solde
  const { data: balance } = useBalance({
    address: address,
  })

  // Hook pour les contrats
  const { writeContract } = useWriteContract()

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

  return {
    // État de connexion
    address,
    isConnected,
    chainId,
    balance: balance?.value,
    formattedBalance: getFormattedBalance(),
    
    // État des transactions
    isLoading,
    error,
    setError,
    
    // Fonctions utilitaires
    sendTransaction,
    readContract,
    isCorrectChain,
    
    // Utilitaires
    clearError: () => setError(null),
  }
}

export default useWeb3
