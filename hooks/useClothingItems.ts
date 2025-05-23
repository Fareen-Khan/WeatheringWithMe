import { deleteClothingItem, getAllClothingItems, getTagsForItems } from "@/utils/db"
import { ClothingItem } from "@/utils/types"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"

export default function useClothingItems() {
	const [allClothingItems, setAllClothingItems] = useState<ClothingItem[]>([])
	const [tagsMap, setTagsMap] = useState<Record<number, string>>({})
	const [loading, setLoading] = useState(false)

	const loadAll = useCallback(async () => {
		setLoading(true)
		try {
			const fetchedItems = await getAllClothingItems()
			setAllClothingItems(fetchedItems)

			const entries = await Promise.all(
				fetchedItems.map(async (item) => {
					const tags = await getTagsForItems(item.id!)
					return [item.id!, tags.join(", ")]
				})
			)
			setTagsMap(Object.fromEntries(entries))
		} finally {
			setLoading(false)
		}
	}, [])

	const deleteItem = useCallback(
		async (id: number) => {
			await deleteClothingItem(id)
			await loadAll()
		},
		[loadAll]
  )
  
  useFocusEffect(
		useCallback(() => {
			loadAll()
		}, [loadAll])
	)

	return {
		allClothingItems,
		tagsMap,
		loading,
		reload: loadAll,
		deleteItem,
	}
}
