export interface WeatherResponse {
	coord: {
		lon: number
		lat: number
	}
	weather: {
		id: number
		main: string
		description: string
		icon: string
	}[]
	base: string
	main: {
		temp: number
		feels_like: number
		temp_min: number
		temp_max: number
		pressure: number
		humidity: number
		sea_level?: number
		grnd_level?: number
	}
	visibility?: number
	wind?: {
		speed: number
		deg: number
		gust?: number
	}
	clouds?: {
		all: number
	}
	rain?: {
		"1h"?: number
	}
	snow?: {
		"1h"?: number
	}
	dt: number // Timestamp in Unix UTC
	sys: {
		country: string
		sunrise: number // Unix UTC time
		sunset: number // Unix UTC time
	}
	timezone: number
	id: number
	name: string
	cod: number
}

// New interface for the forecast list
export interface ForecastItem {
	dt: number // Forecast timestamp (Unix UTC)
	main: {
		temp: number
		feels_like: number
		temp_min: number
		temp_max: number
		pressure: number
		humidity: number
		sea_level?: number
		grnd_level?: number
	}
	weather: {
		id: number
		main: string
		description: string
		icon: string
	}[]
	clouds?: {
		all: number
	}
	wind: {
		speed: number
		deg: number
		gust?: number
	}
	visibility?: number
	pop: number // Probability of precipitation (0 to 1)
	rain?: {
		"3h"?: number // Rain volume in the last 3 hours
	}
	snow?: {
		"3h"?: number // Snow volume in the last 3 hours
	}
	sys: {
		pod: "n" | "d" // Part of the day (night or day)
	}
	dt_txt: string // Forecast time in ISO UTC format
}

// New interface for the Forecast API response
export interface ForecastResponse {
	cod: string
	message: number
	cnt: number
	list: ForecastItem[]
	city: {
		id: number
		name: string
		coord: {
			lat: number
			lon: number
		}
		country: string
		timezone: number
		sunrise: number
		sunset: number
	}
}

export interface GeoResponse {
	name: string
	// local_names?: [string] // this I dont really care about atm
	lat: number
	lon: number
	country: string
	state: string
}