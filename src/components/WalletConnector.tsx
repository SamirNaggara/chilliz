'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { 
  formatAddress, 
  isMetaMaskInstalled, 
  isMobileDevice, 
  createMetaMaskDeepLink, 
  connectMetaMaskMobile 
} from '@/lib/web3'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function WalletConnector() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, error, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // S'assurer que le composant est rendu côté client
  useEffect(() => {
    setIsClient(true)
    setIsMobile(isMobileDevice())
  }, [])

  const handleConnectWallet = async (connector: any) => {
    try {
      // Sur mobile, utiliser la logique spéciale pour MetaMask
      if (isMobile && (connector.name === "MetaMask" || connector.name === "Injected")) {
        // Si MetaMask n'est pas installé sur mobile, utiliser deep link
        if (!isMetaMaskInstalled()) {
          const deepLink = createMetaMaskDeepLink()
          console.log("🔗 Redirection vers MetaMask mobile:", deepLink)
          window.location.href = deepLink
          return
        }
        
        // Si MetaMask est installé, essayer la connexion directe
        try {
          await connectMetaMaskMobile()
        } catch (error) {
          console.error("Erreur connexion directe mobile:", error)
          // Fallback vers deep link en cas d'erreur
          const deepLink = createMetaMaskDeepLink()
          window.location.href = deepLink
          return
        }
      }
      
      // Connexion standard pour desktop ou autres wallets
      await connect({ connector })
    } catch (error) {
      console.error("Erreur de connexion wallet:", error)
      
      // Sur mobile, toujours essayer le deep link en cas d'erreur
      if (isMobile && (connector.name === "MetaMask" || connector.name === "Injected")) {
        const deepLink = createMetaMaskDeepLink()
        console.log("🔗 Fallback deep link:", deepLink)
        window.location.href = deepLink
      }
    }
  }

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
        {!isMetaMaskInstalled() && !isMobile && (
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
        
        {isMobile && !isMetaMaskInstalled() && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              📱 Sur mobile, utilisez l'application MetaMask.
            </p>
            <div className="flex gap-2 mt-2">
              <a
                href="https://apps.apple.com/app/metamask/id1438144202"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                iOS App Store
              </a>
              <span className="text-gray-400">|</span>
              <a
                href="https://play.google.com/store/apps/details?id=io.metamask"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Google Play
              </a>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              onClick={() => handleConnectWallet(connector)}
              disabled={isPending}
              className="w-full"
              variant={connector.name === 'MetaMask' ? 'default' : 'outline'}
            >
              {isPending ? 'Connexion...' : 
                isMobile && connector.name === 'MetaMask' && !isMetaMaskInstalled() 
                  ? 'Ouvrir MetaMask'
                  : `Connecter ${connector.name}`
              }
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
