import { get5DayForecast, getCurrentWeather } from "@/api/weather"
import { ForecastResponse, WeatherResponse } from "@/utils/types"
import { useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useMemo, useState } from "react"
import * as Location from "expo-location"
import { PillItem } from "@/components/weatherPillBox"

export default function useWeather() {
	const [data, setData] = useState<WeatherResponse | null>(null)
	const [forecast, setForecast] = useState<ForecastResponse | null>(null)
	const [loading, setLoading] = useState(true)

	// Extract location from search params and default to "Toronto" if not provided
	const { location } = useLocalSearchParams()
	// Default to Toronto if location is not provided and user not searching
	const city = typeof location === "string" ? location : "Toronto"

	// A helper function to fetch weather by a city name.
  const fetchWeatherForCity = useCallback(async (cityName: string) => {
    setLoading(true)
		try {
			const weatherData = await getCurrentWeather(cityName)
			const forecastData = await get5DayForecast(cityName)
			setForecast(forecastData as ForecastResponse)
			setData(weatherData as WeatherResponse)
			// setOutfit(getRandomOutfit(weatherData.main.temp))
		} catch (error) {
			console.error("Error fetching weather data:", error)
		} finally {
			setLoading(false)
		}
	}, [])

	// get current location and fetch weather for it
  const fetchCurrentLocationAndWeather = useCallback(async () => {
    setLoading(true)
		try {
			const { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== "granted") {
				// Fall back to a default city if permission isn't granted.
				fetchWeatherForCity("Toronto")
				return
			}
			const currentLocation = await Location.getCurrentPositionAsync({})
			const geocode = await Location.reverseGeocodeAsync(currentLocation.coords)
			if (geocode.length > 0 && geocode[0].city) {
				// Combine city and country into a string
				const userCity = geocode[0].city
				const userCountry = geocode[0].isoCountryCode
				return fetchWeatherForCity(`${userCity},${userCountry}`)
			} else {
				// If geocoding fails, fallback to a default city.
				return fetchWeatherForCity("Toronto")
			}
		} catch (error) {
			console.error("Error retrieving location:", error)
			// Fallback in case of error.
			return fetchWeatherForCity("Toronto")
		}
  }, [fetchWeatherForCity])

	// pill items:
	const pillItems: PillItem[] = useMemo(() => {
		if (!data) return []
		const items: PillItem[] = [
			{ value: data?.main.humidity ?? 0, symbol: "droplet", unit: "%" },
			{ value: data?.wind?.speed ?? 0, symbol: "wind", unit: "m/s" },
		]
		if (data.snow)
			items.push({
				value: Math.round(data.snow["1h"]!),
				symbol: "cloud-snow",
				unit: "cm",
			})
		if (data.rain)
			items.push({
				value: Math.round(data.rain["1h"]!),
				symbol: "cloud-rain",
				unit: "mm",
			})
		return items
  }, [data])
  
  useEffect(() => {
		if (location && typeof location === "string") {
			// console.log("Using searched location:", location);
			fetchWeatherForCity(location)
		} else {
			fetchCurrentLocationAndWeather()
		}
	}, [city])

  
  return {
		data,
		forecast,
		loading,
		pillItems,
		refresh: () => fetchCurrentLocationAndWeather(),
	}
}
