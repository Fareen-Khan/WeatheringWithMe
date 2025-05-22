import { getItemsForTag } from "@/utils/db"
import { Outfit } from "@/utils/types"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useState } from "react"

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

// pick random
function pickRandom<T>(arr: T[]): T | null {
	if (arr.length === 0) return null
	return arr[Math.floor(Math.random() * arr.length)]
}

export default function useOutfit(feelsLike?: number) {
  const [userOutfit, setUserOutfit] = useState<Outfit | null>(null)
  

  const getOutfit = useCallback(async (temp:number) => {
		const currentTag = getSeasonByTemp(temp)
		const items = await getItemsForTag(currentTag)

		// get random outfit from the items
		const shirt = pickRandom(items.filter((i) => i.type === "Shirt"))
		const pants = pickRandom(items.filter((i) => i.type === "Pants"))
		const shoes = pickRandom(items.filter((i) => i.type === "Shoe"))
		const headwear = pickRandom(items.filter((i) => i.type === "Headwear"))
    setUserOutfit({ shirt, pants, shoes, headwear })
		return { shirt, pants, shoes, headwear }
	}, [])

	useEffect(() => {
		if (feelsLike == null) return
		getOutfit(feelsLike)
	}, [feelsLike, getOutfit])

  useFocusEffect(
		useCallback(() => {
			if (feelsLike != null) {
				getOutfit(feelsLike)
			}
		}, [feelsLike, getOutfit])
	)
  
  return userOutfit
}
