import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GraphRequestDto, WeatherRequestDto } from './dto/GraphRequest';
import { EnergieRecommendation } from './models/energie.model'; 

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/graph/solar')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getSolarGraph(@Query() query: WeatherRequestDto) {
    const graphRequest  = GraphRequestDto.mapFromWeatherRequest(query)
    graphRequest.start = "2023-12-01T14:21:41.499Z";
    graphRequest.end = "2023-12-31T14:21:41.499Z";
    return await this.weatherService.getSolarGraph(graphRequest);
  }

  @Get('/graph/wind')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getWindGraph(@Query() query: WeatherRequestDto) {
    const graphRequest  = GraphRequestDto.mapFromWeatherRequest(query)
    graphRequest.start = "2023-12-01T14:21:41.499Z";
    graphRequest.end = "2023-12-31T14:21:41.499Z";
    return await this.weatherService.getWindGraph(graphRequest);
  }

  @Get('/graph/temperature')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getTemperatureGraph(@Query() query: WeatherRequestDto) {
    const graphRequest  = GraphRequestDto.mapFromWeatherRequest(query)
    graphRequest.start = "2023-12-01T14:21:41.499Z";
    graphRequest.end = "2023-12-31T14:21:41.499Z";
    return await this.weatherService.getTemperatureGraph(graphRequest);
  }

  @Get('/graph/rain')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getRainGraph(@Query() query: WeatherRequestDto) {
    const graphRequest  = GraphRequestDto.mapFromWeatherRequest(query)
    graphRequest.start = "2023-12-01T14:21:41.499Z";
    graphRequest.end = "2023-12-31T14:21:41.499Z";
    return await this.weatherService.getRainGraph(graphRequest);
  }

  @Get('/power/wind')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPutWindPuissance(@Query() query: WeatherRequestDto) {
    const graphRequest  = GraphRequestDto.mapFromWeatherRequest(query)
    graphRequest.start = "2023-12-01T14:21:41.499Z";
    graphRequest.end = "2023-12-31T14:21:41.499Z";
    return this.weatherService.getWindPower(graphRequest);
  }

  @Get('/power/solar')
  @UsePipes(new ValidationPipe({ transform: true }))
  getSolarPower(@Query() query: WeatherRequestDto) {
    const graphRequest  = GraphRequestDto.mapFromWeatherRequest(query)
    graphRequest.start = "2023-12-01T14:21:41.499Z";
    graphRequest.end = "2023-12-31T14:21:41.499Z";
    return this.weatherService.getSolarPower(graphRequest);
  }

  @Get('/power/recommendation')
  @UsePipes(new ValidationPipe({ transform: true }))
  getRecommendation(@Query() query: WeatherRequestDto): Promise<EnergieRecommendation> {
    const graphRequest  = GraphRequestDto.mapFromWeatherRequest(query)
    graphRequest.start = "2023-12-01T14:21:41.499Z";
    graphRequest.end = "2023-12-31T14:21:41.499Z";
    return this.weatherService.recommanderSourceEnergie(graphRequest);
  }
}
