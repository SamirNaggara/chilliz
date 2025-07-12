"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Play, Pause, Crown, Medal, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContest } from "@/lib/contest-actions";

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
    firstPrize: "",
    secondPrize: "",
    thirdPrize: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Conversion locale -> UTC
    const toUTCISOString = (localDateStr: string) => {
      if (!localDateStr) return "";

      // Créer une date en heure locale
      const [datePart, timePart] = localDateStr.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute] = timePart.split(":").map(Number);

      // Créer la date en heure locale (sans décalage UTC)
      const localDate = new Date(year, month - 1, day, hour, minute, 0);

      // Convertir en UTC en ajoutant le décalage horaire (correction)
      const utcDate = new Date(
        localDate.getTime() + localDate.getTimezoneOffset() * 60000
      );

      return utcDate.toISOString();
    };

    const dataToSend = {
      ...formData,
      startTime: toUTCISOString(formData.startTime),
      endTime: toUTCISOString(formData.endTime),
    };

    try {
      const result = await createContest(dataToSend);

      if (!result.success) {
        setError(
          result.error ||
            "Une erreur s'est produite lors de la création du concours"
        );
        return;
      }

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        firstPrize: "",
        secondPrize: "",
        thirdPrize: "",
      });

      // Rediriger vers la page des concours
      router.push("/admin/contests");
      onSuccess?.();
    } catch (error) {
      console.error("Erreur lors de la création du concours:", error);
      setError("Une erreur s'est produite lors de la création du concours");
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
      [name]: value,
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
              <Label htmlFor="description">Description (optionnel)</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description du concours..."
                className="mt-1"
              />
            </div>
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

          {/* Section des 3 prix */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Prix à Gagner *</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstPrize"
                  className="flex items-center gap-2 text-yellow-700"
                >
                  <Crown className="w-4 h-4" />
                  1er Prix *
                </Label>
                <Input
                  id="firstPrize"
                  name="firstPrize"
                  value={formData.firstPrize}
                  onChange={handleInputChange}
                  placeholder="Ex: 1000 CHZ + Maillot Collector"
                  className="mt-1 border-yellow-300 focus:border-yellow-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="secondPrize"
                  className="flex items-center gap-2 text-gray-700"
                >
                  <Medal className="w-4 h-4" />
                  2ème Prix *
                </Label>
                <Input
                  id="secondPrize"
                  name="secondPrize"
                  value={formData.secondPrize}
                  onChange={handleInputChange}
                  placeholder="Ex: 500 CHZ + Maillot"
                  className="mt-1 border-gray-300 focus:border-gray-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="thirdPrize"
                  className="flex items-center gap-2 text-orange-700"
                >
                  <Award className="w-4 h-4" />
                  3ème Prix *
                </Label>
                <Input
                  id="thirdPrize"
                  name="thirdPrize"
                  value={formData.thirdPrize}
                  onChange={handleInputChange}
                  placeholder="Ex: 250 CHZ"
                  className="mt-1 border-orange-300 focus:border-orange-500"
                  required
                />
              </div>
            </div>
            <p className="text-sm text-gray-600">
              * Les 3 prix sont obligatoires. Le concours aura exactement 3
              gagnants.
            </p>
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
