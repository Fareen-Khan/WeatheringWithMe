import { getListofCities } from "@/api/weather";
import { GeoResponse } from "@/utils/types"
import { useEffect, useState } from "react"

export default function useLocationSearch(searchQuery: string) {
	const [locationResults, setLocationResults] = useState<GeoResponse[] | { cod: number; message: string }>([])
  const [error, setError] = useState<string | null>(null)
  
	useEffect(() => {
		if (searchQuery.trim() === "") {
			console.log("location is empty showing favorites")
			setLocationResults([])
			return
    }
    let cancelled = false
		const getResults = async () => {
			try {
        const searchResults = await getListofCities(searchQuery)
        setLocationResults(searchResults)
        if (cancelled) return
        if (!Array.isArray(locationResults) && locationResults.cod === 400) {
					setLocationResults([])
					setError(`Error ${locationResults.cod}: ${locationResults.message}`)
				} else {
					setError(null)
				}
			} catch (e:any) {
				if (!cancelled) setError(e.message)
			}
		}
    getResults()
    return () => {cancelled = true}
  }, [searchQuery])
  
  return {locationResults, error}
}
