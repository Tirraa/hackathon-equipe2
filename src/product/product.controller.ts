import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { GraphRequestDto, WeatherRequestDto} from 'src/weather/dto/GraphRequest';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllProducts(@Query() query: WeatherRequestDto) {

    const a  = GraphRequestDto.mapFromWeatherRequest(query)
    a.start = "2023-03-01T14:21:41.499Z";
    a.end = "2023-03-10T14:21:41.499Z";

    return await this.productService.getAllProducts(a);
  }
}
