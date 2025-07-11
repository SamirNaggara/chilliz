"use client";

import { useState } from "react";
import { createScan } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type User = {
  id: string;
  wallet: string;
};

type Jersey = {
  id: string;
  name: string;
};

interface CreateScanFormProps {
  users: User[];
  jerseys: Jersey[];
}

export function CreateScanForm({ users, jerseys }: CreateScanFormProps) {
  const [userId, setUserId] = useState("");
  const [jerseyId, setJerseyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await createScan(userId, jerseyId);

    if (result.success) {
      setMessage("Scan enregistré avec succès !");
      setUserId("");
      setJerseyId("");
    } else {
      setMessage(result.error || "Erreur lors de l'enregistrement");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="userId">Utilisateur</Label>
        <select
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Sélectionner un utilisateur</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.wallet}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jerseyId">Maillot</Label>
        <select
          id="jerseyId"
          value={jerseyId}
          onChange={(e) => setJerseyId(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        >
          <option value="">Sélectionner un maillot</option>
          {jerseys.map((jersey) => (
            <option key={jersey.id} value={jersey.id}>
              {jersey.name} ({jersey.id})
            </option>
          ))}
        </select>
      </div>

      <Button
        type="submit"
        disabled={isLoading || users.length === 0 || jerseys.length === 0}
        className="w-full"
      >
        {isLoading ? "Enregistrement..." : "Enregistrer le scan"}
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

      {(users.length === 0 || jerseys.length === 0) && (
        <p className="text-sm text-yellow-600">
          {users.length === 0 && jerseys.length === 0
            ? "Créez d'abord des utilisateurs et des maillots"
            : users.length === 0
            ? "Créez d'abord des utilisateurs"
            : "Créez d'abord des maillots"}
        </p>
      )}
    </form>
  );
}
