import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [WeatherModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
