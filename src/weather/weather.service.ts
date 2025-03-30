import { Injectable } from '@nestjs/common';
import { GraphData } from './models/GraphData';
import axios from 'axios';
import { GraphRequestDto } from './dto/GraphRequest';
import { formatDate, parseDate } from 'src/utils/date';
import { EnergieRecommendation } from './models/energie.model';

export interface PowerOutput {
  date: string;
  windSpeed: number;
  airDensity: number;
}

enum DateType {
  DAY = "daily",
  MONTH = "monthly",
  YEAR = "year",
}

@Injectable()
export class WeatherService {
  private readonly BASE_URL = 'https://power.larc.nasa.gov';
  private readonly R = 287.05; // Constante spécifique de l'air sec en J/(kg·K)
  private nasaNotAValue = -999;

  private calculateAirDensity(
    temperatureCelsius: number,
    pression: number,
  ): number {
    const temperatureKelvin = temperatureCelsius + 273.15;
    return pression / (this.R * temperatureKelvin);
  }

  private calculerEnergieSolaire(irradiation: number, surface: number, rendement: number, heuresEnsoleillement: number): number {
    return irradiation * surface * rendement * heuresEnsoleillement;
  }

  private calculerEnergieEolienne(vitesseVent: number, surfacePales: number, densiteAir: number = 1.225): number {
    return 0.5 * densiteAir * surfacePales * Math.pow(vitesseVent, 3);
  }

  private productionAnnuelle(energieSolaire: number, energieEolienne: number, facteurDeCapaciteEolienne: number = 0.35, heuresParAn: number = 8760): { productionSolaireAnnuelle: number; productionEolienneAnnuelle: number } {
    const productionSolaireAnnuelle = energieSolaire * heuresParAn / 1000;
    const productionEolienneAnnuelle = energieEolienne * facteurDeCapaciteEolienne * heuresParAn / 1000;
    return { productionSolaireAnnuelle, productionEolienneAnnuelle };
  }

  async recommanderSourceEnergie(request: GraphRequestDto): Promise<EnergieRecommendation> {
    const res = await axios.get(this.getUrl('ALLSKY_SFC_SW_DWN,WS10M,T2M,PS', request, DateType.MONTH));

    if (!res?.data?.properties?.parameter) {
      return {
        energieSolaire: { puissance: 0, tauxRecommandation: 0 },
        energieEolienne: { puissance: 0, tauxRecommandation: 0 },
        message: "Données non disponibles"
      };
    }

    const irradiationData = res.data.properties.parameter.ALLSKY_SFC_SW_DWN as Record<string, number>;
    const windSpeedData = res.data.properties.parameter.WS10M as Record<string, number>;
    const temperatureData = res.data.properties.parameter.T2M as Record<string, number>;
    const pressureData = res.data.properties.parameter.PS as Record<string, number>;

    // Calculate averages
    const irradiationAvg = Object.values(irradiationData).reduce((sum: number, val: number) => sum + val, 0) / Object.keys(irradiationData).length;
    const windSpeedAvg = Object.values(windSpeedData).reduce((sum: number, val: number) => sum + val, 0) / Object.keys(windSpeedData).length;
    const temperatureAvg = Object.values(temperatureData).reduce((sum: number, val: number) => sum + val, 0) / Object.keys(temperatureData).length;
    const pressureAvg = Object.values(pressureData).reduce((sum: number, val: number) => sum + val, 0) / Object.keys(pressureData).length;

    const airDensity = this.calculateAirDensity(temperatureAvg, pressureAvg * 100);

    const energieSolaire = this.calculerEnergieSolaire(irradiationAvg, 100, 0.18, 1000);
    const energieEolienne = this.calculerEnergieEolienne(windSpeedAvg, 100, airDensity);

    const { productionSolaireAnnuelle, productionEolienneAnnuelle } = this.productionAnnuelle(energieSolaire, energieEolienne);

    const totalProduction = productionSolaireAnnuelle + productionEolienneAnnuelle;
    const pourcentageSolaire = (productionSolaireAnnuelle / totalProduction) * 100;
    const pourcentageEolienne = (productionEolienneAnnuelle / totalProduction) * 100;

    let message = '';
    if (pourcentageSolaire > pourcentageEolienne) {
      message = `La meilleure source d'énergie est l'énergie solaire avec ${pourcentageSolaire.toFixed(2)}% de recommandation.`;
    } else {
      message = `La meilleure source d'énergie est l'énergie éolienne avec ${pourcentageEolienne.toFixed(2)}% de recommandation.`;
    }

    return {
      energieSolaire: {
        puissance: Number(productionSolaireAnnuelle.toFixed(2)),
        tauxRecommandation: Number(pourcentageSolaire.toFixed(2))
      },
      energieEolienne: {
        puissance: Number(productionEolienneAnnuelle.toFixed(2)),
        tauxRecommandation: Number(pourcentageEolienne.toFixed(2))
      },
      message
    };
  }

  async getWindPower(
    request: GraphRequestDto,
  ): Promise<{ windSpeedAvg: number; airDensityAvg: number }> {
    const res = await axios.get(this.getUrl('WS10M,T2M,PS', request, DateType.MONTH));

    if (res?.data?.properties?.parameter) {
      const windSpeeds = res.data.properties.parameter.WS10M;
      const temperatures = res.data.properties.parameter.T2M;
      const pressures = res.data.properties.parameter.PS;
      const powerOutputs: PowerOutput[] = [];

      for (const date in windSpeeds) {
        const windSpeed = windSpeeds[date]; 
        const temperature = temperatures[date] + 273.15;
        const pressure = pressures[date] * 100;
        console.log(temperature, pressure)
        const airDensity = this.calculateAirDensity(temperature, pressure);

        powerOutputs.push({
          date,
          windSpeed,
          airDensity: Number(airDensity.toFixed(3)),
        });
      }

      const totalWindSpeed = powerOutputs.reduce(
        (sum, entry) => sum + entry.windSpeed,
        0,
      );
      const totalWindSpeedAvg = totalWindSpeed / powerOutputs.length;

      const totalAirDensity = powerOutputs.reduce(
        (sum, entry) => sum + entry.airDensity,
        0,
      );
      const totalAirDensityAvg = totalAirDensity / powerOutputs.length;

      console.log(totalWindSpeedAvg, totalAirDensityAvg)
      return {
        windSpeedAvg: totalWindSpeedAvg,  
        airDensityAvg: totalAirDensityAvg,
      };
    }

    return { windSpeedAvg: 0, airDensityAvg: 0 };
  }

  async getSolarPower(request: GraphRequestDto): Promise<number> {
    const res = await axios.get(this.getUrl('ALLSKY_SFC_SW_DWN', request, DateType.MONTH));

    if (res?.data?.properties?.parameter) {
      const ghiData = res.data.properties.parameter.ALLSKY_SFC_SW_DWN;
      const powerOutputs: any[] = [];

      for (const date in ghiData) {
        const irradiation = ghiData[date];

        powerOutputs.push({
          date,
          irradiation,
        });
      }

      if (powerOutputs.length === 0) return 0;

      const totalIrradiation = powerOutputs.reduce(
        (sum, entry) => sum + entry.irradiation,
        0,
      );
      return totalIrradiation / powerOutputs.length;
    }

    return 0;
  }

  async getSolarGraph(request: GraphRequestDto): Promise<GraphData> {
    const res = await axios.get(this.getUrl('ALLSKY_SFC_SW_DWN', request));
    const a = new GraphData();
    return a;
  }

  async getWindGraph(request: GraphRequestDto): Promise<GraphData> {
    const res = await axios.get(this.getUrl('WS10M', request));
    const data = new GraphData();

    const windData = res?.data?.properties?.parameter?.WS10M;

    if (!windData) {
      return data;
    }

    const entries = Object.entries(windData);

    data.xValues = entries.map(([key]) => parseDate(key).getTime());
    data.yValues = entries.map(([_, value]) => {
      const val = Number(value);
      return isNaN(val) || val < 0 ? 0 : val;
    });

    data.label = 'wind-graph-label';
    data.xLabel = 'wind-graph-x-label';
    data.yLabel = 'wind-graph-y-label';

    return data;
  }

  async getRainGraph(request: GraphRequestDto): Promise<GraphData> {
    const res = await axios.get(this.getUrl('PRECTOTCORR', request));
    const data = new GraphData();

    const rainData = res?.data?.properties?.parameter?.PRECTOTCORR;

    if (!rainData) {
      return data;
    }

    const entries = Object.entries(rainData);

    data.xValues = entries.map(([key]) => parseDate(key).getTime());
    data.yValues = entries.map(([_, value]) => {
      const val = Number(value);
      return isNaN(val) || val < 0 ? 0 : val;
    });

    data.label = 'rain-graph-label';
    data.xLabel = 'rain-graph-x-label';
    data.yLabel = 'rain-graph-y-label';

    return data;
  }

  async getTemperatureGraph(request: GraphRequestDto): Promise<GraphData> {
    const res = await axios.get(this.getUrl('T2M', request));
    const data = new GraphData();

    const tempData = res?.data?.properties?.parameter?.T2M;

    if (!tempData) {
      return data;
    }

    const entries = Object.entries(tempData);

    data.xValues = entries.map(([key]) => parseDate(key).getTime());
    data.yValues = entries.map(([_, value]) => {
      const val = Number(value);
      return isNaN(val) ? 0 : val;
    });

    data.label = 'temperature-graph-label';
    data.xLabel = 'temperature-graph-x-label';
    data.yLabel = 'temperature-graph-y-label';

    return data;
  }

  
  private getUrl(parameter: string, request: GraphRequestDto, type?: DateType): string {
    const url = new URL(`/api/temporal/${type || DateType.DAY}/point`, this.BASE_URL);

    url.searchParams.append('parameters', parameter);
    url.searchParams.append('community', 'RE');
    url.searchParams.append('longitude', request.lng.toString());
    url.searchParams.append('latitude', request.lat.toString());
    url.searchParams.append('format', 'JSON');

    if(type === DateType.MONTH){
      url.searchParams.append('start', new Date(request.start).getFullYear().toString());
      url.searchParams.append('end', new Date(request.end).getFullYear().toString());
    } else {
      const startDate = new Date(request.start);
      const endDate = new Date(request.end);
      url.searchParams.append('start', `${startDate.getFullYear()}${String(startDate.getMonth() + 1).padStart(2, '0')}${String(startDate.getDate()).padStart(2, '0')}`);
      url.searchParams.append('end', `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, '0')}${String(endDate.getDate()).padStart(2, '0')}`);
    }

    return url.toString();
  }
}
