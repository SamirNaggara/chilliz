import { BlockchainVerifier } from "@/components/BlockchainVerifier";

export default function BlockchainVerificationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header de la page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vérification Blockchain
          </h1>
          <p className="text-lg text-gray-600">
            Vérifiez la transparence et l'authenticité des données de loterie 
            enregistrées sur la blockchain Chiliz
          </p>
        </div>

        {/* Composant principal */}
        <BlockchainVerifier />

        {/* Section d'aide */}
        <div className="mt-8 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              💡 Comment utiliser cette interface
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-blue-800 mb-2">🔍 Vérifier une Transaction</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Collez le hash d'une transaction de loterie</li>
                  <li>• Voir tous les détails enregistrés sur la blockchain</li>
                  <li>• Vérifier l'authenticité et l'horodatage</li>
                  <li>• Accéder directement à l'explorateur Chiliz</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">📊 Historique d'un Concours</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Entrez l'ID d'un concours</li>
                  <li>• Voir toutes les participations enregistrées</li>
                  <li>• Consulter les annonces de gagnants</li>
                  <li>• Timeline complète des événements</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              🔐 Garanties Blockchain
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-green-800 mb-2">Immutabilité</h3>
                <p className="text-sm text-green-700">
                  Toutes les données sont gravées de manière permanente sur la blockchain Chiliz. 
                  Impossible de les modifier ou supprimer rétroactivement.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-2">Transparence</h3>
                <p className="text-sm text-green-700">
                  Chaque transaction est publiquement vérifiable via l'explorateur officiel. 
                  Aucune donnée cachée, tout est transparent.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-2">Horodatage Certifié</h3>
                <p className="text-sm text-green-700">
                  Chaque événement est horodaté par la blockchain elle-même. 
                  Impossible de falsifier les timestamps.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-green-800 mb-2">Décentralisation</h3>
                <p className="text-sm text-green-700">
                  Les données sont répliquées sur tous les nœuds du réseau Chiliz. 
                  Aucun point de défaillance unique.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-900 mb-4">
              🌐 Réseau Chiliz
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">
                  <strong>Testnet Spicy:</strong> Réseau de test pour le développement et les tests
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">
                  <strong>Mainnet Chiliz:</strong> Réseau principal pour les transactions réelles
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">
                  <strong>Explorateur:</strong> Interface publique pour consulter toutes les transactions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
