import { getRandomOutfit } from "@/utils/outfit"
import * as Location from "expo-location"
import { get5DayForecast, getCurrentWeather } from "@/api/weather"
import { WeatherResponse, ForecastResponse } from "@/utils/types"
import { useEffect, useCallback, useState } from "react"

export const useWeather = (initialCity: string) => {
	const [city, setCity] = useState(initialCity)
	const [data, setData] = useState<WeatherResponse | null>(null)
	const [forecast, setForecast] = useState<ForecastResponse | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const fetchWeatherForCity = useCallback(async (cityName: string) => {
		setLoading(true)
		setError(null)
		try {
			const weatherData = await getCurrentWeather(cityName)
			const forecastData = await get5DayForecast(cityName)
			setForecast(forecastData as ForecastResponse)
			setData(weatherData as WeatherResponse)
			// setOutfit(getRandomOutfit(weatherData.main.temp));
		} catch (error) {
			console.error("Error fetching weather data:", error)
		} finally {
			setLoading(false)
		}
	}, [])

	// get current location and fetch weather for it
	const fetchCurrentLocationAndWeather = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== "granted") {
				// Fall back to a default city if permission isn't granted.
				fetchWeatherForCity(initialCity)
				return
			}
			const currentLocation = await Location.getCurrentPositionAsync({})
			const geocode = await Location.reverseGeocodeAsync(currentLocation.coords)
			if (geocode.length > 0 && geocode[0].city) {
				// Combine city and country into a string
				const userCity = geocode[0].city
				const userCountry = geocode[0].isoCountryCode
				fetchWeatherForCity(`${userCity},${userCountry}`)
			} else {
				// If geocoding fails, fallback to a default city.
				fetchWeatherForCity(initialCity)
			}
		} catch (error) {
			console.error("Error retrieving location:", error)
			// Fallback in case of error.
			fetchWeatherForCity(initialCity)
		}
	}, [fetchWeatherForCity, initialCity])

	useEffect(() => {
		if (city && city !== initialCity) {
			fetchWeatherForCity(city)
		} else {
			fetchCurrentLocationAndWeather()
		}
	}, [city, fetchWeatherForCity, fetchCurrentLocationAndWeather, initialCity])

	return {
		data,
		forecast,
		loading,
		error,
		setCity,
		refetch: () => fetchWeatherForCity(city),
		fetchCurrentLocationAndWeather,
	}
}
