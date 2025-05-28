import { useCallback, useState } from "react"
import * as ImagePicker from "expo-image-picker"
import { ClothingItem } from "@/utils/types"
import { addClothingItem, addItemTag } from "@/utils/db"
import { router } from "expo-router"

export default function useClothingForm() {
	const [image, setImage] = useState<string | null>(null)
	const [clothingType, setClothingType] = useState<string[]>([])
	const [tags, setTags] = useState<string[]>([])

	// logic to open the image picker
	const pickImage = useCallback(async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})
		console.log(result)
		if (!result.canceled) {
			setImage(result.assets[0].uri)
		}
	}, [])

	const addClothingItemToDb = useCallback(async () => {
		const item: ClothingItem = {
			type: clothingType[0],
			imageUri: image,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}

		const clothingId = await addClothingItem(item)
		// Add tags to the item
		tags.map(async (tag) => {
			const tagId = await addItemTag(clothingId, tag)
		})

		router.back()
	}, [image, clothingType, tags])

	return {
		image,
		clothingType,
		tags,
    pickImage,
    setClothingType,
    setTags,
		addClothingItemToDb,
	}
}
