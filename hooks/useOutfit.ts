import { getRandomOutfit } from "@/utils/outfit"
import { getItemsForTag } from "@/utils/db"
import { Outfit } from "@/utils/types"
import { useEffect, useState } from "react"

function pickRandom<T>(arr: T[]): T | null {
	if (arr.length === 0) return null
	return arr[Math.floor(Math.random() * arr.length)]
}

function getSeasonByTemp(
	temp: number
): "Winter" | "Fall" | "Spring" | "Summer" {
	if (temp < 8) {
		return "Winter" // chilly, needs heavy layers
	} else if (temp < 15) {
		return "Fall" // cool → light jacket or sweater
	} else if (temp < 22) {
		return "Spring" // mild → long sleeves or light top
	} else {
		return "Summer" // warm/hot → short sleeves
	}
}

export const useOutfit = (temp: number | null) => {
	const [outfit, setOutfit] = useState<string | null>(null)
	const [userOutfit, setUserOutfit] = useState<Outfit | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		if (temp == null) {
			setUserOutfit(null)
			setOutfit(null)
			return
		}
		let cancelled = false

		async function buildOutfit() {
			setLoading(true)
			setError(null)
			try {
				const img = getRandomOutfit(temp ?? 0)
				if (!cancelled) setOutfit(img)
				const currentTag = getSeasonByTemp(temp ?? 0)
				const items = await getItemsForTag(currentTag)

				const newOutfit = {
					shirt: pickRandom(items.filter((i) => i.type === "Shirt")),
					pants: pickRandom(items.filter((i) => i.type === "Pants")),
					shoes: pickRandom(items.filter((i) => i.type === "Shoe")),
					headwear: pickRandom(items.filter((i) => i.type === "Headwear")),
				}

				if (!cancelled) setUserOutfit(newOutfit)
			} catch (error) {
				if (!cancelled) setError(error as Error)
			} finally {
				if (!cancelled) setLoading(false)
			}
		}

		buildOutfit()

		return () => {
			cancelled = true
		}
	}, [temp])

	return { outfit, userOutfit, loading, error }
}
