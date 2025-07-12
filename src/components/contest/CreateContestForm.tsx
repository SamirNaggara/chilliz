"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Gift, Loader2 } from "lucide-react";
import { createContest } from "@/lib/contest-actions";
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
    firstPrize: "",
    secondPrize: "",
    thirdPrize: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await createContest(formData);

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
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Créer un Nouveau Concours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du Concours *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Concours But Mbappé"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description optionnelle du concours"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Gift className="w-5 h-5 text-yellow-500" />
              Prix à Gagner
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstPrize" className="text-green-600">
                  1er Prix *
                </Label>
                <Input
                  id="firstPrize"
                  name="firstPrize"
                  value={formData.firstPrize}
                  onChange={handleInputChange}
                  placeholder="Ex: 1000 CHZ + Maillot Collector"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondPrize" className="text-blue-600">
                  2ème Prix *
                </Label>
                <Input
                  id="secondPrize"
                  name="secondPrize"
                  value={formData.secondPrize}
                  onChange={handleInputChange}
                  placeholder="Ex: 500 CHZ + Maillot"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thirdPrize" className="text-orange-600">
                  3ème Prix *
                </Label>
                <Input
                  id="thirdPrize"
                  name="thirdPrize"
                  value={formData.thirdPrize}
                  onChange={handleInputChange}
                  placeholder="Ex: 250 CHZ"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Créer le Concours
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
