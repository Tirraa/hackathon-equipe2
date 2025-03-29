import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
  imports: [WeatherModule]
})
export class ProductModule {}
