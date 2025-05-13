import * as SQLite from "expo-sqlite"
import type { SQLiteDatabase } from "expo-sqlite"


export interface ClothingItem {
	id: string
	type: "shirt" | "pants" | "shoes" | "headwear"
	imageUri: string
	createdAt: number
	updatedAt: number
}

type ClothingRow = Omit<ClothingItem, "tags"> & { tags: string }

let db: SQLiteDatabase | null = null

async function getDb(): Promise<SQLiteDatabase> {
	console.log("getting db")
	if (db) return db

	db = await SQLite.openDatabaseAsync("wardrobe.db")

	try {
		// No trailing comma after the last column!
		await db.execAsync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS clothingItems (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        imageUri TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `)
	} catch (e) {
		console.error("🛑 schema init failed:", e)
	}

	return db
}

// Insert a new clothing item (including its tags array)
export async function addClothingItem(item: ClothingItem) {
	console.log("in addClothingItem")
	const database = await getDb()

	try {
		// Only five placeholders for five columns
		const res = await database.runAsync(
			`INSERT INTO clothingItems
         (id, type, imageUri, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?);`,
			item.id,
			item.type,
			item.imageUri,
			item.createdAt,
			item.updatedAt
		)
		console.log("Item added to DB:", res)
	} catch (e) {
		console.error("🛑 insert failed:", e)
	}
}

// Fetch all items and parse their tags JSON back into string[]
export async function getAllClothingItems(): Promise<ClothingItem[]> {
	const database = await getDb()
	const rows = await database.getAllAsync<ClothingRow>(
		`SELECT * FROM clothingItems;`
	)
	return rows.map((r) => ({
		id: r.id,
		type: r.type as ClothingItem["type"],
		imageUri: r.imageUri,
		createdAt: r.createdAt,
		updatedAt: r.updatedAt,
	}))
}

// Delete an item by id
export async function deleteClothingItem(id: string) {
	const database = await getDb()
	await database.runAsync(`DELETE FROM clothingItems WHERE id = ?;`, id)
}

