"use client";

import { useState } from "react";
import { createUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateUserForm() {
  const [wallet, setWallet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await createUser(wallet);

    if (result.success) {
      setMessage("Utilisateur créé avec succès !");
      setWallet("");
    } else {
      setMessage(result.error || "Erreur lors de la création");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wallet">Adresse Wallet</Label>
        <Input
          id="wallet"
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0x1234..."
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Création..." : "Créer l'utilisateur"}
      </Button>

      {message && (
        <p
          className={`text-sm ${
            message.includes("succès") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
