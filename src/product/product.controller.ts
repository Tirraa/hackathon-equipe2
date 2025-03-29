import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { GraphRequestDto } from 'src/weather/dto/GraphRequest';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts() {
    const a: GraphRequestDto = {
      lat: 47.188882703297175,
      lng: -2.3930926693584262,
      start: new Date('2023-03-01T14:21:41.499Z'),
      end: new Date('2023-03-10T14:21:41.499Z'),
    };

    return await this.productService.getAllProducts(a);
  }
}
