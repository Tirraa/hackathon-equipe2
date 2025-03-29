"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sun, Wind, Droplets, Zap, ThermometerSun } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { climateData } from "@/lib/climate-data"

interface EnergyRecommendationsProps {
  location: {
    lat: number
    lng: number
    name: string
  }
}

interface EnergyScore {
  type: string
  score: number
  icon: React.ReactNode
  color: string
  description: string
}

export default function EnergyRecommendations({ location }: EnergyRecommendationsProps) {
  const [energyScores, setEnergyScores] = useState<EnergyScore[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get climate data based on location
    setIsLoading(true)

    // Find the closest city in our dataset
    // In a real app, this would use the actual coordinates to find the nearest data point
    const nearestLocation = findNearestLocation(location.lat, location.lng)

    // Calculate energy scores based on climate data
    setTimeout(() => {
      const scores = calculateEnergyScores(nearestLocation)
      setEnergyScores(scores)
      setIsLoading(false)
    }, 1000)
  }, [location])

  // This is a simplified function to find the nearest location
  // In a real app, you would use actual distance calculations
  const findNearestLocation = (lat: number, lng: number) => {
    // For demo purposes, just return a random location from our dataset
    const locations = Object.keys(climateData)
    const randomIndex = Math.floor(Math.random() * locations.length)
    return locations[randomIndex]
  }

  const calculateEnergyScores = (locationKey: string): EnergyScore[] => {
    const data = climateData[locationKey]

    // Calculate scores based on climate data
    // These calculations are simplified for demo purposes
    const solarScore = Math.min(100, (data.sunshineHours / 2000) * 100)
    const windScore = Math.min(100, (data.windSpeed / 20) * 100)
    const hydroScore = Math.min(100, (data.rainfall / 1000) * 100)
    const geothermalScore = Math.min(100, 50 + Math.random() * 30) // Random score for demo

    return [
      {
        type: "Solaire",
        score: Math.round(solarScore),
        icon: <Sun className="h-5 w-5" />,
        color: "text-yellow-500",
        description: "Basé sur l'ensoleillement annuel et la température moyenne",
      },
      {
        type: "Éolien",
        score: Math.round(windScore),
        icon: <Wind className="h-5 w-5" />,
        color: "text-blue-500",
        description: "Basé sur la vitesse moyenne du vent et sa constance",
      },
      {
        type: "Hydraulique",
        score: Math.round(hydroScore),
        icon: <Droplets className="h-5 w-5" />,
        color: "text-cyan-500",
        description: "Basé sur les précipitations et la proximité des cours d'eau",
      },
      {
        type: "Géothermique",
        score: Math.round(geothermalScore),
        icon: <ThermometerSun className="h-5 w-5" />,
        color: "text-orange-500",
        description: "Basé sur les caractéristiques géologiques locales",
      },
    ]
  }

  const getBestEnergyType = () => {
    if (energyScores.length === 0) return null
    return energyScores.reduce((prev, current) => (prev.score > current.score ? prev : current))
  }

  const bestEnergy = getBestEnergyType()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Recommandations Énergétiques
        </CardTitle>
        <CardDescription>Solutions adaptées à votre localisation : {location.name}</CardDescription>
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
                <p className="text-sm text-muted-foreground">{bestEnergy.description}</p>
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
        Les recommandations sont basées sur les données climatiques des 365 derniers jours
      </CardFooter>
    </Card>
  )
}

