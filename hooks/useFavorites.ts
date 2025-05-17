import { useEffect, useState } from "react"
import { getFavoriteLocations, removeFavoriteLocation, saveFavoriteLocation } from "@/utils/favorites"

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
