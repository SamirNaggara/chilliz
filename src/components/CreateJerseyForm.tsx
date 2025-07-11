"use client";

import { useState } from "react";
import { createJersey } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateJerseyForm() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await createJersey(id, name);

    if (result.success) {
      setMessage("Maillot créé avec succès !");
      setId("");
      setName("");
    } else {
      setMessage(result.error || "Erreur lors de la création");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jerseyId">ID du Maillot</Label>
        <Input
          id="jerseyId"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="jersey-1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jerseyName">Nom du Maillot</Label>
        <Input
          id="jerseyName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Maillot Mbappé Home 2024"
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Création..." : "Créer le maillot"}
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
