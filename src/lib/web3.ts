import { createConfig, http } from "wagmi";
import { mainnet, sepolia, polygon, arbitrum } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

// Configuration des chaînes blockchain supportées
export const config = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId:
        process.env.NEXT_PUBLIC_WC_PROJECT_ID ||
        "votre-project-id-walletconnect",
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});

// Types pour les erreurs Web3
export interface Web3Error {
  code: number;
  message: string;
  data?: any;
}

// Utilitaires pour la gestion des erreurs
export const handleWeb3Error = (error: any): string => {
  if (error?.code === 4001) {
    return "Transaction rejetée par l'utilisateur";
  }
  if (error?.code === -32602) {
    return "Paramètres invalides";
  }
  if (error?.code === -32603) {
    return "Erreur interne";
  }
  return error?.message || "Une erreur inconnue s'est produite";
};

// Fonction pour vérifier si MetaMask est installé
export const isMetaMaskInstalled = (): boolean => {
  if (typeof window === "undefined") return false;
  return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask;
};

// Fonction pour formater les adresses
export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

// Fonction pour formater les montants ETH
export const formatEther = (value: bigint): string => {
  const eth = Number(value) / 1e18;
  return eth.toFixed(4);
};

// Fonction pour détecter la disponibilité de MetaMask
export const detectMetaMask = (): {
  isInstalled: boolean;
  isAvailable: boolean;
  provider: any;
} => {
  if (typeof window === "undefined") {
    return { isInstalled: false, isAvailable: false, provider: null };
  }

  const { ethereum } = window as any;

  const isInstalled = Boolean(ethereum && ethereum.isMetaMask);
  const isAvailable = Boolean(ethereum);

  return {
    isInstalled,
    isAvailable,
    provider: ethereum,
  };
};

// Fonction pour vérifier si l'utilisateur est sur un réseau supporté
export const isSupportedChain = (chainId: number): boolean => {
  const supportedChains = [1, 11155111, 137, 42161, 88888, 88882]; // Mainnet, Sepolia, Polygon, Arbitrum, Chiliz
  return supportedChains.includes(chainId);
};

// Fonction pour obtenir le nom d'un réseau
export const getChainName = (chainId: number): string => {
  const chainNames: Record<number, string> = {
    1: "Ethereum Mainnet",
    11155111: "Sepolia Testnet",
    137: "Polygon Mainnet",
    42161: "Arbitrum One",
    88888: "Chiliz Chain",
    88882: "Chiliz Spicy Testnet",
  };
  return chainNames[chainId] || `Réseau inconnu (${chainId})`;
};

// Fonction pour détecter si l'utilisateur est sur mobile
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Fonction pour créer un deep link MetaMask
export const createMetaMaskDeepLink = (fallbackUrl?: string): string => {
  if (typeof window === "undefined") return "";

  const currentUrl = fallbackUrl || window.location.href;
  const host = window.location.host;
  const pathname = window.location.pathname;

  // Créer le deep link pour MetaMask mobile
  return `https://metamask.app.link/dapp/${host}${pathname}`;
};

// Fonction pour gérer la connexion MetaMask sur mobile
export const connectMetaMaskMobile = async (): Promise<void> => {
  if (typeof window === "undefined") return;

  const isMobile = isMobileDevice();
  const hasMetaMask = isMetaMaskInstalled();

  if (isMobile && !hasMetaMask) {
    // Sur mobile, si MetaMask n'est pas détecté, utiliser le deep link
    const deepLink = createMetaMaskDeepLink();
    window.location.href = deepLink;
    return;
  }

  // Sinon, utiliser la connexion standard
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("Erreur lors de la connexion MetaMask:", error);
      throw error;
    }
  }
};

// Fonction pour vérifier si nous sommes en production HTTPS
export const isProductionEnvironment = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "https:" && !window.location.hostname.includes("localhost");
};

// Fonction pour obtenir le message d'erreur approprié pour mobile
export const getMobileMetaMaskError = (): string => {
  const isMobile = isMobileDevice();
  const isProduction = isProductionEnvironment();
  
  if (isMobile && !isProduction) {
    return "MetaMask mobile requiert HTTPS. Veuillez déployer sur un domaine sécurisé.";
  }
  
  if (isMobile) {
    return "Veuillez installer l'application MetaMask mobile pour continuer.";
  }
  
  return "Veuillez installer l'extension MetaMask pour votre navigateur.";
};

// Fonction pour obtenir le type de mobile (pour compatibilité)
export const getMobileType = (): 'ios' | 'android' | 'other' => {
  if (typeof window === "undefined") return 'other';
  
  const userAgent = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
  if (/Android/.test(userAgent)) return 'android';
  return 'other';
};

// Fonction legacy pour compatibilité (alias de isMobileDevice)
export const isMobile = isMobileDevice;

// Fonction pour obtenir le lien MetaMask approprié
export const getMetaMaskLink = (): string => {
  const mobileType = getMobileType();
  
  switch (mobileType) {
    case 'ios':
      return "https://apps.apple.com/app/metamask/id1438144202";
    case 'android':
      return "https://play.google.com/store/apps/details?id=io.metamask";
    default:
      return "https://metamask.io/download/";
  }
};
