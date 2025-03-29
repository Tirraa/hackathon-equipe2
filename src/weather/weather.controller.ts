import { Controller, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GraphRequestDto } from './dto/GraphRequest';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/graph/solar')
  async getSolarGraph() {
    const a: GraphRequestDto = {
      lat: 54,
      lng: 12,
      start: new Date(),
      end: new Date(),
    };
    return await this.weatherService.getSolarGraph(a);
  }

  @Get('/graph/wind')
  async getWindGraph() {
    const a: GraphRequestDto = {
      lat: 54,
      lng: 12,
      start: new Date('2025-03-23T14:21:41.499Z'),
      end: new Date('2025-03-29T14:21:41.499Z'),
    };
    return await this.weatherService.getWindGraph(a);
  }

  @Get('/graph/temperature')
  async getTemperatureGraph() {
    const a: GraphRequestDto = {
      lat: 54,
      lng: 12,
      start: new Date('2025-03-23T14:21:41.499Z'),
      end: new Date('2025-03-29T14:21:41.499Z'),
    };
    return await this.weatherService.getTemperatureGraph(a);
  }

  @Get('/graph/rain')
  async getRainGraph() {
    const a: GraphRequestDto = {
      lat: 54,
      lng: 12,
      start: new Date('2025-03-23T14:21:41.499Z'),
      end: new Date('2025-03-29T14:21:41.499Z'),
    };
    return await this.weatherService.getRainGraph(a);
  }

  @Get('/power/wind')
  getPutWindPuissance() {
    const a: GraphRequestDto = {
      lat: 48.8566,
      lng: 2.3522,
      start: new Date('2024-03-01T14:21:41.499Z'),
      end: new Date('2024-03-10T14:21:41.499Z'),
    };
    return this.weatherService.getWindPower(a);
  }

  @Get('/power/solar')
  getSolarPower() {
    const a: GraphRequestDto = {
      lat: 48.8566,
      lng: 2.3522,
      start: new Date('2024-03-01T14:21:41.499Z'),
      end: new Date('2024-03-10T14:21:41.499Z'),
    };
    return this.weatherService.getSolarPower(a);
  }
}
