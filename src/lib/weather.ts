export type GeoResult = {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type WeatherData = {
  location: GeoResult;
  current: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    windSpeed: number;
    windGusts: number;
    precipitation: number;
    cloudCover: number;
    weatherCode: number;
    isDay: boolean;
    time: string;
  };
  daily: Array<{
    date: string;
    max: number;
    min: number;
    precipitationProbability: number;
    weatherCode: number;
  }>;
};

type GeocodingResponse = {
  results?: Array<{
    id: number;
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
};

type ForecastResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    precipitation: number;
    cloud_cover: number;
    weather_code: number;
    is_day: number;
    time: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
};

export async function searchLocations(query: string): Promise<GeoResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: "6",
    language: "en",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Could not reach the city search service.");
  }

  const data = (await response.json()) as GeocodingResponse;
  return data.results ?? [];
}

export async function fetchWeather(location: GeoResult): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    precipitation_unit: "mm",
    timezone: "auto",
    forecast_days: "5",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Could not load weather for that city.");
  }

  const data = (await response.json()) as ForecastResponse;

  return {
    location,
    current: {
      temperature: Math.round(data.current.temperature_2m),
      apparentTemperature: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windGusts: Math.round(data.current.wind_gusts_10m),
      precipitation: data.current.precipitation,
      cloudCover: data.current.cloud_cover,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
      time: data.current.time,
    },
    daily: data.daily.time.map((date, index) => ({
      date,
      max: Math.round(data.daily.temperature_2m_max[index]),
      min: Math.round(data.daily.temperature_2m_min[index]),
      precipitationProbability:
        data.daily.precipitation_probability_max[index] ?? 0,
      weatherCode: data.daily.weather_code[index],
    })),
  };
}

export function describeWeather(code: number): string {
  if (code === 0) return "Clear";
  if ([1, 2].includes(code)) return "Mostly clear";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Variable";
}
