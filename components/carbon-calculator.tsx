"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Wind, Droplets, ThermometerSun, Car, TreesIcon as Tree } from "lucide-react"
import { climateData } from "@/lib/climate-data"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

interface CarbonCalculatorProps {
  location: {
    lat: number
    lng: number
    name: string
  }
}

export default function CarbonCalculator({ location }: CarbonCalculatorProps) {
  const [energyType, setEnergyType] = useState("solar")
  const [installationSize, setInstallationSize] = useState(3) // kW for solar, etc.
  const [annualProduction, setAnnualProduction] = useState(0)
  const [carbonSavings, setCarbonSavings] = useState(0)
  const [equivalents, setEquivalents] = useState({
    cars: 0,
    trees: 0,
    flights: 0,
  })

  // Carbon intensity of different energy sources (g CO2/kWh)
  const carbonIntensity = {
    grid: 56, // France has low carbon electricity due to nuclear
    coal: 820,
    gas: 490,
    solar: 41,
    wind: 11,
    hydro: 24,
    geothermal: 38,
  }

  // Find the closest city in our dataset
  const findNearestLocation = (lat: number, lng: number) => {
    // For demo purposes, just return a random location from our dataset
    const locations = Object.keys(climateData)
    const randomIndex = Math.floor(Math.random() * locations.length)
    return locations[randomIndex]
  }

  useEffect(() => {
    const nearestLocation = findNearestLocation(location.lat, location.lng)
    const data = climateData[nearestLocation]

    // Calculate annual production based on energy type and location data
    let production = 0

    switch (energyType) {
      case "solar":
        // Simplified calculation: sunshine hours * efficiency factor * size
        production = data.sunshineHours * 0.8 * installationSize
        break
      case "wind":
        // Simplified calculation: wind speed * efficiency factor * size
        production = data.windSpeed * 800 * installationSize
        break
      case "hydro":
        // Simplified calculation: rainfall * efficiency factor * size
        production = data.rainfall * 0.5 * installationSize
        break
      case "geothermal":
        // Fixed value for demo * size
        production = 5000 * installationSize
        break
    }

    setAnnualProduction(Math.round(production))

    // Calculate carbon savings (grid - renewable) * production
    const savings =
      ((carbonIntensity.grid - carbonIntensity[energyType as keyof typeof carbonIntensity]) * production) / 1000 // kg CO2
    setCarbonSavings(Math.round(savings))

    // Calculate equivalents
    setEquivalents({
      cars: Math.round((savings / 2000) * 10) / 10, // Average car emits ~2000kg CO2/year
      trees: Math.round(savings / 25), // Average tree absorbs ~25kg CO2/year
      flights: Math.round((savings / 500) * 10) / 10, // Average Paris-Nice flight ~500kg CO2
    })
  }, [energyType, installationSize, location])

  const pieData = [
    { name: "Économies", value: carbonSavings },
    {
      name: "Émissions restantes",
      value: (annualProduction * carbonIntensity[energyType as keyof typeof carbonIntensity]) / 1000,
    },
  ]

  const COLORS = ["#10b981", "#d1d5db"]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="solar" value={energyType} onValueChange={setEnergyType}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="solar" className="flex items-center gap-1">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Solaire</span>
          </TabsTrigger>
          <TabsTrigger value="wind" className="flex items-center gap-1">
            <Wind className="h-4 w-4" />
            <span className="hidden sm:inline">Éolien</span>
          </TabsTrigger>
          <TabsTrigger value="hydro" className="flex items-center gap-1">
            <Droplets className="h-4 w-4" />
            <span className="hidden sm:inline">Hydraulique</span>
          </TabsTrigger>
          <TabsTrigger value="geothermal" className="flex items-center gap-1">
            <ThermometerSun className="h-4 w-4" />
            <span className="hidden sm:inline">Géothermique</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="installation-size">Taille de l'installation (kW)</Label>
            <Input
              id="installation-size"
              type="number"
              min="1"
              max="20"
              value={installationSize}
              onChange={(e) => setInstallationSize(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Ajustez la taille</Label>
            <Slider
              value={[installationSize]}
              min={1}
              max={20}
              step={0.5}
              onValueChange={(value) => setInstallationSize(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 kW</span>
              <span>20 kW</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <Label>Production annuelle estimée</Label>
              <span className="font-medium">{annualProduction} kWh</span>
            </div>
            <div className="flex justify-between">
              <Label>Économies de CO₂</Label>
              <span className="font-medium">{carbonSavings} kg/an</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-medium">Équivalent à :</h3>
            <div className="grid grid-cols-3 gap-2">
              <Card>
                <CardContent className="p-3 text-center">
                  <Car className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-lg font-bold">{equivalents.cars}</div>
                  <div className="text-xs text-muted-foreground">voitures/an</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <Tree className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-lg font-bold">{equivalents.trees}</div>
                  <div className="text-xs text-muted-foreground">arbres plantés</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <svg
                    className="h-5 w-5 mx-auto mb-1 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <div className="text-lg font-bold">{equivalents.flights}</div>
                  <div className="text-xs text-muted-foreground">vols Paris-Nice</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kg CO₂`, ""]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Ces calculs sont basés sur l'intensité carbone moyenne du réseau électrique français ({carbonIntensity.grid} g
          CO₂/kWh) et l'intensité carbone de la production{" "}
          {energyType === "solar"
            ? "solaire"
            : energyType === "wind"
              ? "éolienne"
              : energyType === "hydro"
                ? "hydraulique"
                : "géothermique"}
          ({carbonIntensity[energyType as keyof typeof carbonIntensity]} g CO₂/kWh).
        </p>
      </div>
    </div>
  )
}

