import { Injectable } from '@nestjs/common';
import { GraphData } from './models/GraphData';
import axios from 'axios';
import { GraphRequestDto } from './dto/GraphRequest';

export interface PowerOutput {
  date: string;
  power: string;
  windSpeed: number;
  temperature: number;
  airDensity: string;
}

@Injectable()
export class WeatherService {
  private readonly BASE_URL = 'https://power.larc.nasa.gov/api/temporal';
  private readonly R = 287.05; // Constante spécifique de l'air sec en J/(kg·K)
  private readonly RADIUS = 120; // Rayon des pales en mètres A M
  private readonly CP = 0.45; // Coefficient de performance moyen

  private calculateAirDensity(
    temperatureCelsius: number,
    pression: number,
  ): number {
    const temperatureKelvin = temperatureCelsius + 273.15;
    return pression / (this.R * temperatureKelvin);
  }

  private calculateWindPower(airDensity: number, windSpeed: number): number {
    const A = Math.PI * Math.pow(this.RADIUS, 2);
    return 0.5 * airDensity * A * Math.pow(windSpeed, 3) * this.CP;
  }

  async getWindPuissance(request: GraphRequestDto): Promise<PowerOutput[]> {
    const res = await axios.get(
      `${this.BASE_URL}/daily/point?parameters=WS10M,T2M,PS&community=RE&longitude=2.3522&latitude=48.8566&start=20240301&end=20240310&format=JSON`,
    );

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
        const power = this.calculateWindPower(airDensity, windSpeed);

        powerOutputs.push({
          date,
          power: power.toFixed(2),
          windSpeed,
          temperature,
          airDensity: airDensity.toFixed(3),
        });
      }

      console.log('Wind power calculations:', powerOutputs);
      return powerOutputs;
    }

    return [];
  }

  private readonly PANEL_EFFICIENCY = 0.18; // Rendement moyen des panneaux solaires

  private calculateSolarPower(irradiation: number, panelArea: number): number {
    return irradiation * panelArea * this.PANEL_EFFICIENCY;
  }

  private calculatePanelArea(panelWidth: number, panelHeight: number): number {
    return panelWidth * panelHeight;
  }

  async getSolarPower(request: GraphRequestDto): Promise<any[]> {
    const res = await axios.get(
      `${this.BASE_URL}/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=2.3522&latitude=48.8566&start=20240301&end=20240310&format=JSON`,
    );

    if (res?.data?.properties?.parameter) {
      const ghiData = res.data.properties.parameter.ALLSKY_SFC_SW_DWN;
      const panelArea = this.calculatePanelArea(2, 1);

      const powerOutputs: any[] = [];

      for (const date in ghiData) {
        const irradiation = ghiData[date];
        const power = this.calculateSolarPower(irradiation, panelArea);

        powerOutputs.push({
          date,
          power: power.toFixed(2),
          irradiation,
        });
      }

      console.log('Solar power calculations:', powerOutputs);
      return powerOutputs;
    }

    return [];
  }

  async getSolarGraph(request: GraphRequestDto): Promise<GraphData[]> {
    const res = await axios.get(
      `${this.BASE_URL}/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${request.lng}&latitude=${request.lat}&start=${this.formatDate(request.start)}&end=${this.formatDate(request.end)}&format=JSON`,
    );
    const a = new GraphData();
    return [];
  }

  async getWindGraph(request: GraphRequestDto): Promise<GraphData> {
    const res = await axios.get(this.getUrl('WS10M', request));
    const data = new GraphData();

    const WS10M = res?.data?.properties?.parameter?.WS10M;

    if (!WS10M) {
      return data;
    }

    const entries = Object.entries(WS10M);

    data.xValues = entries.map(([key]) => this.parseDate(key).getTime());
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

    const WS10M = res?.data?.properties?.parameter?.PRECTOTCORR;

    if (!WS10M) {
      return data;
    }

    const entries = Object.entries(WS10M);

    data.xValues = entries.map(([key]) => this.parseDate(key).getTime());
    data.yValues = entries.map(([_, value]) => {
      const val = Number(value);
      return isNaN(val) || val < 0 ? 0 : val;
    });

    data.label = 'rain-graph-label';
    data.xLabel = 'rain-graph-x-label';
    data.yLabel = 'rain-graph-y-label';

    return data;
  }

  private getUrl(parameter: string, request: GraphRequestDto): string {
    return `${this.BASE_URL}/daily/point?parameters=${parameter}&community=RE&longitude=${request.lng}&latitude=${request.lat}&start=${this.formatDate(request.start)}&end=${this.formatDate(request.end)}&format=JSON`;
  }

  private formatDate(date: Date): string {
    return (
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0')
    );
  }

  private parseDate(dateString: string): Date {
    const match: RegExpMatchArray | null = dateString.match(
      /(\d{4})(\d{2})(\d{2})/,
    );

    if (!match) {
      throw new Error('Format de date invalide. Attendu: YYYYMMDD');
    }

    const year: number = Number(match[1]);
    const month: number = Number(match[2]) - 1; // Mois commence à 0 en JS
    const day: number = Number(match[3]);

    return new Date(year, month, day);
  }
}

//WINd : https://power.larc.nasa.gov/api/temporal/daily/point?parameters=WS10M&community=RE&longitude=2.3522&latitude=48.8566&start=20240301&end=20240310&format=JSON
//Pluie : https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR&community=RE&longitude=2.3522&latitude=48.8566&start=20240301&end=20240310&format=JSON
