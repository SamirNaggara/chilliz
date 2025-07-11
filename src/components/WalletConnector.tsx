'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { formatAddress, isMetaMaskInstalled } from '@/lib/web3'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function WalletConnector() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isClient, setIsClient] = useState(false)

  // S'assurer que le composant est rendu côté client
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Chargement...</div>
  }

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-green-600">Wallet Connecté</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Adresse :</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">
              {formatAddress(address)}
            </p>
          </div>
          <Button onClick={() => disconnect()} variant="outline" className="w-full">
            Déconnecter
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Connexion Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isMetaMaskInstalled() && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ MetaMask n'est pas installé. Veuillez l'installer pour continuer.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Télécharger MetaMask
            </a>
          </div>
        )}
        
        <div className="space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="w-full"
              variant={connector.name === 'MetaMask' ? 'default' : 'outline'}
            >
              {isPending ? 'Connexion...' : `Connecter ${connector.name}`}
            </Button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Erreur de connexion : {error.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WalletConnector
