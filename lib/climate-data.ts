// This is a simplified dataset for demo purposes
// In a real application, this would be a more comprehensive dataset
// or would be fetched from an API

export const climateData: {
  [key: string]: {
    sunshineHours: number
    windSpeed: number
    rainfall: number
    monthlyData: {
      sunshine: number
      wind: number
      rain: number
      temp: number
    }[]
  }
} = {
  Paris: {
    sunshineHours: 1662,
    windSpeed: 12.5,
    rainfall: 637,
    monthlyData: [
      { sunshine: 62, wind: 14.2, rain: 51, temp: 5 },
      { sunshine: 79, wind: 13.8, rain: 43, temp: 6 },
      { sunshine: 128, wind: 13.5, rain: 48, temp: 9 },
      { sunshine: 166, wind: 12.1, rain: 53, temp: 12 },
      { sunshine: 193, wind: 11.3, rain: 65, temp: 16 },
      { sunshine: 202, wind: 10.8, rain: 55, temp: 19 },
      { sunshine: 212, wind: 10.5, rain: 63, temp: 21 },
      { sunshine: 212, wind: 10.2, rain: 43, temp: 21 },
      { sunshine: 167, wind: 10.9, rain: 53, temp: 18 },
      { sunshine: 117, wind: 12.3, rain: 59, temp: 14 },
      { sunshine: 67, wind: 13.1, rain: 51, temp: 9 },
      { sunshine: 57, wind: 14.0, rain: 53, temp: 6 },
    ],
  },
  Marseille: {
    sunshineHours: 2858,
    windSpeed: 15.8,
    rainfall: 515,
    monthlyData: [
      { sunshine: 149, wind: 17.2, rain: 47, temp: 9 },
      { sunshine: 157, wind: 16.8, rain: 32, temp: 10 },
      { sunshine: 232, wind: 16.5, rain: 30, temp: 13 },
      { sunshine: 244, wind: 15.1, rain: 49, temp: 15 },
      { sunshine: 292, wind: 14.3, rain: 39, temp: 19 },
      { sunshine: 326, wind: 13.8, rain: 22, temp: 23 },
      { sunshine: 366, wind: 13.5, rain: 8, temp: 26 },
      { sunshine: 327, wind: 13.2, rain: 17, temp: 26 },
      { sunshine: 258, wind: 14.9, rain: 47, temp: 22 },
      { sunshine: 196, wind: 15.3, rain: 72, temp: 18 },
      { sunshine: 155, wind: 16.1, rain: 56, temp: 13 },
      { sunshine: 156, wind: 17.0, rain: 48, temp: 10 },
    ],
  },
  Bordeaux: {
    sunshineHours: 2035,
    windSpeed: 13.7,
    rainfall: 944,
    monthlyData: [
      { sunshine: 96, wind: 15.2, rain: 87, temp: 7 },
      { sunshine: 114, wind: 14.8, rain: 71, temp: 8 },
      { sunshine: 169, wind: 14.5, rain: 65, temp: 11 },
      { sunshine: 182, wind: 13.1, rain: 78, temp: 13 },
      { sunshine: 217, wind: 12.3, rain: 80, temp: 17 },
      { sunshine: 239, wind: 11.8, rain: 62, temp: 20 },
      { sunshine: 249, wind: 11.5, rain: 50, temp: 22 },
      { sunshine: 242, wind: 11.2, rain: 56, temp: 22 },
      { sunshine: 204, wind: 11.9, rain: 84, temp: 19 },
      { sunshine: 147, wind: 13.3, rain: 87, temp: 15 },
      { sunshine: 94, wind: 14.1, rain: 110, temp: 10 },
      { sunshine: 82, wind: 15.0, rain: 114, temp: 8 },
    ],
  },
  Lyon: {
    sunshineHours: 2002,
    windSpeed: 11.3,
    rainfall: 831,
    monthlyData: [
      { sunshine: 93, wind: 12.2, rain: 47, temp: 4 },
      { sunshine: 117, wind: 11.8, rain: 44, temp: 6 },
      { sunshine: 174, wind: 11.5, rain: 50, temp: 10 },
      { sunshine: 190, wind: 11.1, rain: 80, temp: 13 },
      { sunshine: 219, wind: 10.3, rain: 85, temp: 17 },
      { sunshine: 248, wind: 9.8, rain: 65, temp: 21 },
      { sunshine: 275, wind: 9.5, rain: 60, temp: 24 },
      { sunshine: 252, wind: 9.2, rain: 56, temp: 23 },
      { sunshine: 193, wind: 9.9, rain: 80, temp: 19 },
      { sunshine: 137, wind: 10.3, rain: 100, temp: 14 },
      { sunshine: 84, wind: 11.1, rain: 70, temp: 8 },
      { sunshine: 70, wind: 12.0, rain: 55, temp: 5 },
    ],
  },
  Lille: {
    sunshineHours: 1617,
    windSpeed: 14.2,
    rainfall: 742,
    monthlyData: [
      { sunshine: 58, wind: 15.2, rain: 60, temp: 4 },
      { sunshine: 77, wind: 14.8, rain: 47, temp: 5 },
      { sunshine: 121, wind: 14.5, rain: 58, temp: 8 },
      { sunshine: 158, wind: 13.1, rain: 51, temp: 11 },
      { sunshine: 185, wind: 12.3, rain: 62, temp: 15 },
      { sunshine: 189, wind: 11.8, rain: 65, temp: 18 },
      { sunshine: 201, wind: 11.5, rain: 75, temp: 20 },
      { sunshine: 189, wind: 11.2, rain: 63, temp: 20 },
      { sunshine: 143, wind: 12.9, rain: 61, temp: 17 },
      { sunshine: 112, wind: 13.3, rain: 67, temp: 13 },
      { sunshine: 63, wind: 14.1, rain: 70, temp: 8 },
      { sunshine: 51, wind: 15.0, rain: 63, temp: 5 },
    ],
  },
  Strasbourg: {
    sunshineHours: 1693,
    windSpeed: 10.8,
    rainfall: 665,
    monthlyData: [
      { sunshine: 63, wind: 11.2, rain: 32, temp: 2 },
      { sunshine: 84, wind: 10.8, rain: 34, temp: 4 },
      { sunshine: 134, wind: 10.5, rain: 42, temp: 8 },
      { sunshine: 177, wind: 10.1, rain: 51, temp: 12 },
      { sunshine: 201, wind: 9.3, rain: 73, temp: 16 },
      { sunshine: 219, wind: 8.8, rain: 73, temp: 20 },
      { sunshine: 235, wind: 8.5, rain: 71, temp: 22 },
      { sunshine: 219, wind: 8.2, rain: 61, temp: 21 },
      { sunshine: 159, wind: 8.9, rain: 57, temp: 17 },
      { sunshine: 115, wind: 9.3, rain: 51, temp: 12 },
      { sunshine: 65, wind: 10.1, rain: 44, temp: 6 },
      { sunshine: 52, wind: 11.0, rain: 46, temp: 3 },
    ],
  },
}

