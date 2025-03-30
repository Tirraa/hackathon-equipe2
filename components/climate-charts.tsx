"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Droplets, ThermometerSun } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { weatherService } from "@/lib/api";

interface ClimateChartsProps {
  location: {
    lat: number;
    lng: number;
    name: string;
  };
}

export default function ClimateCharts({ location }: ClimateChartsProps) {
  const [activeTab, setActiveTab] = useState("wind");
  const [windData, setWindData] = useState<any>(null);
  const [temperatureData, setTemperatureData] = useState<any>(null);
  const [rainData, setRainData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWindData = async () => {
    const data = await weatherService.getWindGraph(location);

    const transformedData = data.xValues.map(
      (timestamp: number, index: number) => ({
        date: new Date(timestamp).toLocaleDateString(),
        wind: data.yValues[index],
      })
    );

    setWindData(transformedData);
  };

  const fetchTemperatureData = async () => {
    const data = await weatherService.getTemperatureGraph(location);

    const transformedData = data.xValues.map(
      (timestamp: number, index: number) => ({
        date: new Date(timestamp).toLocaleDateString(),
        temperature: data.yValues[index],
      })
    );

    setTemperatureData(transformedData);
  };

  const fetchRainData = async () => {
    const data = await weatherService.getRainGraph(location);

    const transformedData = data.xValues.map(
      (timestamp: number, index: number) => ({
        date: new Date(timestamp).toLocaleDateString(),
        rain: data.yValues[index],
      })
    );

    setRainData(transformedData);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await fetchWindData();
      await fetchTemperatureData();
      await fetchRainData();
      setLoading(false);
    };

    getData();
  }, [location]);

  if (loading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <Tabs defaultValue="wind" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
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

        <TabsContent value="wind">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={windData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: "km/h",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="wind"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Vitesse moyenne du vent pour {location.name}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rain">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rainData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: "mm",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Bar dataKey="rain" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Précipitations (mm) pour {location.name}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temperature">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      label={{
                        value: "°C",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Température moyenne (°C) pour {location.name}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
