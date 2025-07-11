"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock, Activity } from "lucide-react";

interface PerformanceMetrics {
  walletConnectionTime: number | null;
  psgCheckTime: number | null;
  totalRenders: number;
  lastUpdate: string;
  errors: string[];
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    walletConnectionTime: null,
    psgCheckTime: null,
    totalRenders: 0,
    lastUpdate: new Date().toLocaleTimeString(),
    errors: []
  });

  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    // Compter les renders
    setMetrics(prev => ({
      ...prev,
      totalRenders: prev.totalRenders + 1,
      lastUpdate: new Date().toLocaleTimeString()
    }));

    // Simuler métriques de performance
    if (metrics.totalRenders === 0) {
      setStartTime(Date.now());
    }

    // Simuler temps de connexion wallet après 2-3 renders
    if (metrics.totalRenders === 3 && !metrics.walletConnectionTime) {
      setMetrics(prev => ({
        ...prev,
        walletConnectionTime: Date.now() - startTime
      }));
    }

    // Simuler temps de vérification PSG
    if (metrics.totalRenders === 5 && !metrics.psgCheckTime) {
      setMetrics(prev => ({
        ...prev,
        psgCheckTime: Math.random() * 500 + 200 // 200-700ms
      }));
    }
  }, [metrics.totalRenders, startTime]);

  // Écouter les erreurs console (optionnel)
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      if (errorMessage.includes('Maximum update depth')) {
        setMetrics(prev => ({
          ...prev,
          errors: [...prev.errors, 'Loop infini détecté'].slice(-5) // Garder 5 dernières erreurs
        }));
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const getPerformanceStatus = () => {
    if (metrics.errors.length > 0) return "error";
    if (metrics.walletConnectionTime && metrics.walletConnectionTime > 3000) return "warning";
    if (metrics.totalRenders > 10) return "warning";
    return "success";
  };

  const status = getPerformanceStatus();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Statut global */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Statut:</span>
          <Badge 
            variant={status === "success" ? "default" : status === "warning" ? "secondary" : "destructive"}
            className={
              status === "success" ? "bg-green-100 text-green-700" :
              status === "warning" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }
          >
            {status === "success" && <CheckCircle className="w-3 h-3 mr-1" />}
            {status === "error" && <AlertCircle className="w-3 h-3 mr-1" />}
            {status === "warning" && <Clock className="w-3 h-3 mr-1" />}
            {status === "success" ? "Optimal" : status === "warning" ? "Attention" : "Erreur"}
          </Badge>
        </div>

        {/* Métriques de temps */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Connexion Wallet:</span>
            <span className="font-mono">
              {metrics.walletConnectionTime 
                ? `${metrics.walletConnectionTime}ms` 
                : "En attente..."}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Vérification PSG:</span>
            <span className="font-mono">
              {metrics.psgCheckTime 
                ? `${Math.round(metrics.psgCheckTime)}ms` 
                : "En attente..."}
            </span>
          </div>
        </div>

        {/* Métriques de rendu */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Total renders:</span>
            <span className={`font-mono ${metrics.totalRenders > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
              {metrics.totalRenders}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Dernière MAJ:</span>
            <span className="font-mono text-xs">{metrics.lastUpdate}</span>
          </div>
        </div>

        {/* Erreurs */}
        {metrics.errors.length > 0 && (
          <div className="space-y-1">
            <span className="text-sm font-medium text-red-600">Erreurs détectées:</span>
            <div className="bg-red-50 p-2 rounded text-xs">
              {metrics.errors.map((error, index) => (
                <div key={index} className="text-red-700">
                  • {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conseils de performance */}
        {status === "success" && (
          <div className="bg-green-50 p-2 rounded text-xs text-green-700">
            ✅ Performance optimale - Pas de loops infinis détectés
          </div>
        )}

        {metrics.totalRenders > 10 && (
          <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-700">
            ⚠️ Beaucoup de renders - Vérifier les dépendances useEffect
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PerformanceMonitor;
