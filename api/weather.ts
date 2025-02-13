const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const REQUEST_TYPE = "weather";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const UNITS = "metric";

export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility?: number;
  wind?: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds?: {
    all: number;
  };
  rain?: {
    "1h"?: number;
  };
  snow?: {
    "1h"?: number;
  };
  dt: number; // Timestamp in Unix UTC
  sys: {
    type?: number;
    id?: number;
    message?: string;
    country: string;
    sunrise: number; // Unix UTC time
    sunset: number; // Unix UTC time
  };
  timezone: number; // Shift in seconds from UTC
  id: number; // City ID
  name: string; // City name
  cod: number; // Internal parameter
}

export const getCurrentWeather = async (city: string) => {
  const url = `${BASE_URL}${REQUEST_TYPE}?q=${city}&appid=${API_KEY}&units=${UNITS}`;

  const response = await fetch(url);
  const data = await response.json();
  console.debug(data);
  return data as WeatherResponse;
};