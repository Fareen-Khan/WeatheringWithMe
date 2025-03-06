import { WeatherResponse, ForecastResponse, GeoResponse } from "@/utils/types";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const GEO_URL = process.env.EXPO_PUBLIC_API_BASE_GEO_URL
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const UNITS = "metric";

export const getCurrentWeather = async (city: string) => {
  const url = `${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=${UNITS}`;

  const response = await fetch(url);
  const data = await response.json();
  return data as WeatherResponse;
};

export const get5DayForecast = async (city: string) => {
  const url = `${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=${UNITS}&cnt=8`;

  const response = await fetch(url);
  const data = await response.json();
  return data as ForecastResponse;
};

export const getListofCities = async (search: string) => {
  console.log("entering func")
  const url = `${GEO_URL}${search}&limit=10&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data as GeoResponse[];
}