"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import { CheckCircle, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddToJerseydexButtonProps {
  jerseyId: string;
}

export function AddToJerseydexButton({ jerseyId }: AddToJerseydexButtonProps) {
  const { address, isConnected } = useAccount();
  const [isInDex, setIsInDex] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !address) return;
    setLoading(true);
    fetch(`/api/jerseydex?wallet=${address}`)
      .then((res) => res.json())
      .then((data) => {
        const entries: any[] = data.entries || [];
        const found = entries.some((e) => e.jerseyId === jerseyId);
        setIsInDex(!!found);
      })
      .catch(() => setIsInDex(false))
      .finally(() => setLoading(false));
  }, [address, isConnected, jerseyId]);

  const handleAdd = async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/jerseydex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: address, jerseyId }),
    });
    const data = await res.json();
    if (data.success) {
      // Vérifier si c'est le premier ajout
      const res2 = await fetch(`/api/jerseydex?wallet=${address}`);
      const data2 = await res2.json();
      if (data2.entries && data2.entries.length === 1) {
        router.push("/jerseydex");
        return;
      }
      setIsInDex(true);
      setSuccess(true);
    } else {
      setError(data.message || "Erreur lors de l'ajout");
    }
    setLoading(false);
  };

  if (!isConnected) return null;

  if (isInDex) {
    return (
      <div className="flex items-center gap-2 text-green-700 font-semibold mt-4">
        <CheckCircle className="w-5 h-5" />
        You already have this item in your collection
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Button
        onClick={handleAdd}
        disabled={loading || isInDex || success}
        className="bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold px-6 py-2 rounded-lg shadow"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        {loading ? "Adding..." : "Add to my Jerseydex"}
      </Button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      {success && (
        <div className="flex items-center gap-2 text-green-700 font-semibold mt-2">
          <CheckCircle className="w-4 h-4" />
          Added to your collection!
        </div>
      )}
    </div>
  );
}
