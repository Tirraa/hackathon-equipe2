import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class WeatherRequestDto {
  @IsNotEmpty({ message: 'La latitude est obligatoire' })
  //@IsNumber({}, { message: 'La latitude doit être un nombre' })
  lat: number;

  @IsNotEmpty({ message: 'La longitude est obligatoire' })
  //@IsNumber({}, { message: 'La longitude doit être un nombre' })
  lng: number;
}

export class GraphRequestDto {
  lat: number;
  lng: number;
  start: string;
  end: string;

  static mapFromWeatherRequest(data: WeatherRequestDto): GraphRequestDto{
    const requestDto = new GraphRequestDto();
    requestDto.lat=data.lat;
    requestDto.lng=data.lng;
    return requestDto;
  }
}
