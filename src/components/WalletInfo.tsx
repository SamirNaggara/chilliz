'use client'

import React from 'react'
import { useAccount, useBalance, useChainId } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatAddress, formatEther } from '@/lib/web3'

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon Mainnet',
  42161: 'Arbitrum One',
  88888: 'Chiliz Chain', // Chiliz mainnet
  88882: 'Chiliz Spicy Testnet',
}

export function WalletInfo() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: balance } = useBalance({ address })

  if (!isConnected || !address) {
    return null
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-blue-600">Informations Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-600">Réseau :</p>
          <p className="text-sm bg-blue-50 p-2 rounded">
            {CHAIN_NAMES[chainId] || `Chaîne inconnue (${chainId})`}
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-600">Adresse :</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">
            {formatAddress(address)}
          </p>
        </div>
        
        {balance && (
          <div>
            <p className="text-sm font-medium text-gray-600">Solde :</p>
            <p className="text-sm bg-green-50 p-2 rounded">
              {formatEther(balance.value)} {balance.symbol}
            </p>
          </div>
        )}

        {chainId === 88888 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              🌶️ Connecté à Chiliz Chain !
            </p>
          </div>
        )}

        {chainId === 88882 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              🔥 Connecté à Chiliz Spicy Testnet !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WalletInfo
