import { Injectable } from '@nestjs/common';
import { productsList } from './utils/ProductList';
import { Product, ProductType } from './models/ProductData';
import { GraphRequestDto } from 'src/weather/dto/GraphRequest';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class ProductService {
  constructor(private weatherService: WeatherService) {}

  private SOLAR_PANEL_EFFICIENCY = 0.18;
  private WIND_TURBINE_EFFICIENCY = 0.45;

  async getAllProducts(request: GraphRequestDto): Promise<Product[]> {
    const products = productsList;

    const solarPower = await this.weatherService.getSolarPower(request);
    const windPower = await this.weatherService.getWindPower(request);

    return products.map((product) => {
      const sfPanelValue = product.sfPanel;
      const panelArea = product.sfPanel;

      if (product.type == ProductType.SOLAR && product.sfPanel) {
        product.production =
          solarPower * product.sfPanel * this.SOLAR_PANEL_EFFICIENCY * 10;
      }

      if (product.type == ProductType.WIND) {
        const power =  this.calculateWindPower(
          windPower.airDensityAvg,
          windPower.windSpeedAvg,
          product.nbBlades,
        ).toFixed(2);
        product.production = Number(power);
      }

      console.log(
        `Valeur de sfPanel pour le produit ${product.id}: ${product.production}`,
      );

      return product;
    });
  }

  private calculateWindPower(
    airDensity: number,
    windSpeed: number,
    radius?: number,
  ): number {
    if (radius) {
      const A = Math.PI * Math.pow(radius, 2);
      return (
        0.5 *
        airDensity *
        A *
        Math.pow(windSpeed, 3) *
        this.WIND_TURBINE_EFFICIENCY
      );
    }
    return 0;
  }
}
