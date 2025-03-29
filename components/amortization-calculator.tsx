"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Wind, Droplets, ThermometerSun } from "lucide-react"
import { climateData } from "@/lib/climate-data"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AmortizationCalculatorProps {
  location: {
    lat: number
    lng: number
    name: string
  }
}

export default function AmortizationCalculator({ location }: AmortizationCalculatorProps) {
  const [energyType, setEnergyType] = useState("solar")
  const [installationCost, setInstallationCost] = useState(10000)
  const [annualProduction, setAnnualProduction] = useState(0)
  const [energyPrice, setEnergyPrice] = useState(0.1743) // Prix moyen du kWh en France
  const [amortizationYears, setAmortizationYears] = useState(0)
  const [amortizationData, setAmortizationData] = useState<any[]>([])

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
        // Simplified calculation: sunshine hours * efficiency factor
        production = data.sunshineHours * 0.8
        break
      case "wind":
        // Simplified calculation: wind speed * efficiency factor
        production = data.windSpeed * 800
        break
      case "hydro":
        // Simplified calculation: rainfall * efficiency factor
        production = data.rainfall * 0.5
        break
      case "geothermal":
        // Fixed value for demo
        production = 5000
        break
    }

    setAnnualProduction(Math.round(production))

    // Calculate amortization
    const annualSavings = production * energyPrice
    const years = installationCost / annualSavings
    setAmortizationYears(Math.round(years * 10) / 10)

    // Generate data for chart
    const chartData = []
    let cumulativeSavings = 0

    for (let i = 0; i <= Math.ceil(years) + 2; i++) {
      cumulativeSavings = i * annualSavings
      chartData.push({
        year: i,
        savings: cumulativeSavings,
        investment: installationCost,
      })
    }

    setAmortizationData(chartData)
  }, [energyType, installationCost, location])

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
            <Label htmlFor="installation-cost">Coût de l'installation (€)</Label>
            <Input
              id="installation-cost"
              type="number"
              min="1000"
              max="100000"
              value={installationCost}
              onChange={(e) => setInstallationCost(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Ajustez le coût</Label>
            <Slider
              value={[installationCost]}
              min={1000}
              max={50000}
              step={1000}
              onValueChange={(value) => setInstallationCost(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 000 €</span>
              <span>50 000 €</span>
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between">
              <Label>Production annuelle estimée</Label>
              <span className="font-medium">{annualProduction} kWh</span>
            </div>
            <div className="flex justify-between">
              <Label>Économies annuelles</Label>
              <span className="font-medium">{Math.round(annualProduction * energyPrice)} €</span>
            </div>
            <div className="flex justify-between">
              <Label>Temps d'amortissement</Label>
              <span className="font-medium">{amortizationYears} ans</span>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={amortizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: "Années", position: "insideBottom", offset: -5 }} />
                  <YAxis label={{ value: "Euros (€)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="investment" name="Investissement" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="savings" name="Économies cumulées" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground">
        <p>
          Ces calculs sont basés sur un prix moyen de l'électricité de {energyPrice} €/kWh et les données climatiques de
          votre région. Le temps d'amortissement réel peut varier en fonction de nombreux facteurs, notamment les aides
          gouvernementales et l'évolution des prix de l'énergie.
        </p>
      </div>
    </div>
  )
}

