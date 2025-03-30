"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Zap, Calculator, BarChart3 } from "lucide-react";
import LocationSearch from "@/components/location-search";
import EnergyRecommendations from "@/components/energy-recommendations";
import ClimateCharts from "@/components/climate-charts";
import EnergyProductCatalog from "@/components/energy-product-catalog";

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex items-center justify-center bg-muted/30 rounded-lg">
      <p className="text-muted-foreground">Chargement de la carte...</p>
    </div>
  ),
});

export default function Home() {
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState("map");

  const handleLocationSelect = (selectedLocation: {
    lat: number;
    lng: number;
    name: string;
  }) => {
    setLocation(selectedLocation);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Solutions Énergétiques Locales
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez les meilleures options d'énergie renouvelable adaptées à
            votre localisation et estimez vos économies potentielles.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sélectionnez votre localisation
            </CardTitle>
            <CardDescription>
              Cliquez sur la carte ou recherchez votre ville pour obtenir des
              recommandations personnalisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="map"
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="map">Carte Interactive</TabsTrigger>
                <TabsTrigger value="search">Recherche par Ville</TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="space-y-4">
                <Map onLocationSelect={handleLocationSelect} />
              </TabsContent>

              <TabsContent value="search" className="space-y-4">
                <LocationSearch onLocationSelect={handleLocationSelect} />
              </TabsContent>
            </Tabs>

            {location && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">{location.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {location && (
          <>
            <EnergyRecommendations location={location} />

            <Card>
              <CardHeader>
                <CardTitle>Tendances Climatiques Locales</CardTitle>
                <CardDescription>
                  Visualisez les données climatiques pour votre localisation sur
                  l'année
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClimateCharts location={location} />
              </CardContent>
            </Card>
          </>
        )}

        {location && (
          <>
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
              <span className="text-green-600">⚡</span> Solutions Énergétiques
              Durables
            </h1>
            <EnergyProductCatalog userConsumption={5000} recommendations={location}/>
          </>
        )}
      </div>
    </main>
  );
}
