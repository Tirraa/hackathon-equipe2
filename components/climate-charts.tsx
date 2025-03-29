"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Wind, Droplets, ThermometerSun } from "lucide-react"
import { climateData } from "@/lib/climate-data"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ClimateChartsProps {
  location: {
    lat: number
    lng: number
    name: string
  }
}

export default function ClimateCharts({ location }: ClimateChartsProps) {
  const [activeTab, setActiveTab] = useState("sunshine")

  // Find the closest city in our dataset
  // In a real app, this would use the actual coordinates to find the nearest data point
  const findNearestLocation = (lat: number, lng: number) => {
    // For demo purposes, just return a random location from our dataset
    const locations = Object.keys(climateData)
    const randomIndex = Math.floor(Math.random() * locations.length)
    return locations[randomIndex]
  }

  const nearestLocation = findNearestLocation(location.lat, location.lng)
  const data = climateData[nearestLocation]

  // Prepare monthly data for charts
  const monthlyData = [
    {
      name: "Jan",
      sunshine: data.monthlyData[0].sunshine,
      wind: data.monthlyData[0].wind,
      rain: data.monthlyData[0].rain,
      temp: data.monthlyData[0].temp,
    },
    {
      name: "Fév",
      sunshine: data.monthlyData[1].sunshine,
      wind: data.monthlyData[1].wind,
      rain: data.monthlyData[1].rain,
      temp: data.monthlyData[1].temp,
    },
    {
      name: "Mar",
      sunshine: data.monthlyData[2].sunshine,
      wind: data.monthlyData[2].wind,
      rain: data.monthlyData[2].rain,
      temp: data.monthlyData[2].temp,
    },
    {
      name: "Avr",
      sunshine: data.monthlyData[3].sunshine,
      wind: data.monthlyData[3].wind,
      rain: data.monthlyData[3].rain,
      temp: data.monthlyData[3].temp,
    },
    {
      name: "Mai",
      sunshine: data.monthlyData[4].sunshine,
      wind: data.monthlyData[4].wind,
      rain: data.monthlyData[4].rain,
      temp: data.monthlyData[4].temp,
    },
    {
      name: "Juin",
      sunshine: data.monthlyData[5].sunshine,
      wind: data.monthlyData[5].wind,
      rain: data.monthlyData[5].rain,
      temp: data.monthlyData[5].temp,
    },
    {
      name: "Juil",
      sunshine: data.monthlyData[6].sunshine,
      wind: data.monthlyData[6].wind,
      rain: data.monthlyData[6].rain,
      temp: data.monthlyData[6].temp,
    },
    {
      name: "Août",
      sunshine: data.monthlyData[7].sunshine,
      wind: data.monthlyData[7].wind,
      rain: data.monthlyData[7].rain,
      temp: data.monthlyData[7].temp,
    },
    {
      name: "Sep",
      sunshine: data.monthlyData[8].sunshine,
      wind: data.monthlyData[8].wind,
      rain: data.monthlyData[8].rain,
      temp: data.monthlyData[8].temp,
    },
    {
      name: "Oct",
      sunshine: data.monthlyData[9].sunshine,
      wind: data.monthlyData[9].wind,
      rain: data.monthlyData[9].rain,
      temp: data.monthlyData[9].temp,
    },
    {
      name: "Nov",
      sunshine: data.monthlyData[10].sunshine,
      wind: data.monthlyData[10].wind,
      rain: data.monthlyData[10].rain,
      temp: data.monthlyData[10].temp,
    },
    {
      name: "Déc",
      sunshine: data.monthlyData[11].sunshine,
      wind: data.monthlyData[11].wind,
      rain: data.monthlyData[11].rain,
      temp: data.monthlyData[11].temp,
    },
  ]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="sunshine" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="sunshine" className="flex items-center gap-1">
            <Sun className="h-4 w-4" />
            <span className="hidden sm:inline">Ensoleillement</span>
          </TabsTrigger>
          <TabsTrigger value="wind" className="flex items-center gap-1">
            <Wind className="h-4 w-4" />
            <span className="hidden sm:inline">Vent</span>
          </TabsTrigger>
          <TabsTrigger value="rain" className="flex items-center gap-1">
            <Droplets className="h-4 w-4" />
            <span className="hidden sm:inline">Précipitations</span>
          </TabsTrigger>
          <TabsTrigger value="temperature" className="flex items-center gap-1">
            <ThermometerSun className="h-4 w-4" />
            <span className="hidden sm:inline">Température</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sunshine">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Heures", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sunshine" stroke="#f59e0b" fill="#fcd34d" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Heures d'ensoleillement par mois pour {location.name}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wind">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "km/h", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="wind" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Vitesse moyenne du vent par mois pour {location.name}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rain">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "mm", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Bar dataKey="rain" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Précipitations mensuelles (mm) pour {location.name}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temperature">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "°C", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Température moyenne mensuelle (°C) pour {location.name}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

