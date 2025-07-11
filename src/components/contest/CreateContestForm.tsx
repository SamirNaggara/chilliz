"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Play, Pause } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateContestFormProps {
  onSuccess?: () => void;
}

export function CreateContestForm({ onSuccess }: CreateContestFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    prize: "",
    maxWinners: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/contests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création du concours");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        prize: "",
        maxWinners: 3,
      });

      // Refresh the page to show the new contest
      router.refresh();
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxWinners" ? parseInt(value) || 3 : value,
    }));
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Créer un Nouveau Concours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nom du Concours *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Concours But Mbappé"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="maxWinners">Nombre de Gagnants</Label>
              <Input
                id="maxWinners"
                name="maxWinners"
                type="number"
                value={formData.maxWinners}
                onChange={handleInputChange}
                min={1}
                max={10}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description du concours..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startTime">Heure de Début *</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">Heure de Fin *</Label>
              <Input
                id="endTime"
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="prize">Prix à Gagner *</Label>
            <Input
              id="prize"
              name="prize"
              value={formData.prize}
              onChange={handleInputChange}
              placeholder="Ex: 1000 CHZ + Maillot Collector"
              className="mt-1"
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-red-600 to-blue-600"
            >
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? "Création..." : "Créer et Lancer"}
            </Button>
            <Button type="button" variant="outline" disabled={isLoading}>
              <Pause className="w-4 h-4 mr-2" />
              Créer en Mode Brouillon
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
