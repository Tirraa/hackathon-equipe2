import { Injectable } from '@nestjs/common';
import { GraphData } from './models/GraphData';
import axios from 'axios';
import { GraphRequestDto } from './dto/GraphRequest';
import { formatDate, parseDate } from 'src/utils/date';

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
        const temperature = temperatures[date];
        const pressure = pressures[date];
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
    const url = new URL(`/api/temporal/${type ||DateType.DAY}/point`, this.BASE_URL);

    url.searchParams.append('parameters', parameter);
    url.searchParams.append('community', 'RE');
    url.searchParams.append('longitude', request.lng.toString());
    url.searchParams.append('latitude', request.lat.toString());
    url.searchParams.append('format', 'JSON');

    if(type === DateType.MONTH){
      url.searchParams.append('start', request.start.getFullYear().toString());
      url.searchParams.append('end', request.end.getFullYear().toString());
    } else {
      url.searchParams.append('start', formatDate(request.start));
      url.searchParams.append('end', formatDate(request.end));
    }
    

    return url.toString();
  }
}
