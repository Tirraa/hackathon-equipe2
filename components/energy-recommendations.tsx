"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sun, Wind, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { weatherService } from "@/lib/api";

interface EnergyRecommendationsProps {
  location: {
    lat: number;
    lng: number;
    name: string;
  };
}

interface EnergyScore {
  type: string;
  score: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

export default function EnergyRecommendations({
  location,
}: EnergyRecommendationsProps) {
  const [energyScores, setEnergyScores] = useState<EnergyScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setIsLoading(true);
        const data = await weatherService.getAllRecommendations(location);

        setEnergyScores([
          {
            type: "Solaire",
            score: data.energieSolaire.tauxRecommandation,
            icon: <Sun className="h-5 w-5" />,
            color: "text-yellow-500",
            description:
              "Basé sur l'ensoleillement annuel et la température moyenne",
          },
          {
            type: "Éolien",
            score: data.energieEolienne.tauxRecommandation,
            icon: <Wind className="h-5 w-5" />,
            color: "text-blue-500",
            description: "Basé sur la vitesse moyenne du vent et sa constance",
          },
        ]);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, [location]);

  const getBestEnergyType = () => {
    if (energyScores.length === 0) return null;
    return energyScores.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );
  };

  const bestEnergy = getBestEnergyType();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Recommandations Énergétiques
        </CardTitle>
        <CardDescription>
          Solutions adaptées à votre localisation : {location.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4 py-8">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
          </div>
        ) : (
          <div className="space-y-6">
            {bestEnergy && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className={bestEnergy.color}>{bestEnergy.icon}</span>
                    Meilleure option : {bestEnergy.type}
                  </h3>
                  <Badge variant="outline" className="bg-primary/10">
                    {bestEnergy.score}% compatible
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {bestEnergy.description}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {energyScores.map((energy) => (
                <div key={energy.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={energy.color}>{energy.icon}</span>
                      <span className="font-medium">{energy.type}</span>
                    </div>
                    <span className="text-sm font-medium">{energy.score}%</span>
                  </div>
                  <Progress value={energy.score} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Les recommandations sont basées sur les données climatiques des 365
        derniers jours
      </CardFooter>
    </Card>
  );
}
