import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

const FAVORITES_KEY = "favoriteLocations"

// Save a new favorite location
const saveFavoriteLocation = async (location: string) => {
	try {
		const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY)
		const favorites = storedFavorites ? JSON.parse(storedFavorites) : []
		// Avoid duplicates
		if (!favorites.includes(location)) {
			favorites.push(location)
			await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
			console.log("Favorite saved:", location)
		}
	} catch (error) {
		console.error("Error saving favorite location:", error)
	}
}

// Retrieve favorite locations
const getFavoriteLocations = async (): Promise<string[]> => {
	try {
		const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY)
		return storedFavorites ? JSON.parse(storedFavorites) : []
	} catch (error) {
		console.error("Error retrieving favorite locations:", error)
		return []
	}
}

// Remove a favorite location
const removeFavoriteLocation = async (location: string) => {
	try {
		const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY)
		let favorites = storedFavorites ? JSON.parse(storedFavorites) : []
		favorites = favorites.filter((item: string) => item !== location)
		await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
		console.log("Favorite removed:", location)
	} catch (error) {
		console.error("Error removing favorite location:", error)
	}
}


export const useFavorites = () => {
	const [favorites, setFavorites] = useState<string[]>([])

	const loadFavorites = async () => {
		const favs = await getFavoriteLocations()
		setFavorites(favs)
	}

	const addFavorite = async (favoriteLocation: string) => {
		await saveFavoriteLocation(favoriteLocation)
		await loadFavorites()
	}

	const removeFavorite = async (favoriteLocation: string) => {
		await removeFavoriteLocation(favoriteLocation)
		await loadFavorites()
	}

	useEffect(() => {
		loadFavorites()
	}, [])

	return { favorites, addFavorite, removeFavorite }
}
