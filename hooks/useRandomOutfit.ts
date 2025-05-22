import { getRandomOutfit } from "@/utils/outfit";
import { useEffect, useState } from "react";

export default function useRandomOutfit(feelsLike?: number) {
  const [outfit, setOutfit] = useState<string | null>(null)

	useEffect(() => {
		if (feelsLike == null) {
			setOutfit(null)
			return
		}
		const uri = getRandomOutfit(feelsLike) 
		setOutfit(uri)
  }, [feelsLike])
  
  

	return outfit
}
