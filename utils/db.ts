import * as SQLite from "expo-sqlite"
import type { SQLiteDatabase } from "expo-sqlite"

export interface ClothingItem {
	id?: number
	type: string
	imageUri: string | null
	createdAt: number
	updatedAt: number
}
export interface Tag {
	id?: number
	name: string
}

type ClothingRow = Omit<ClothingItem, "tags"> & { tags: string }

let db: SQLiteDatabase | null = null

// Get the database instance and create the tables if they don't exist

async function getDb(): Promise<SQLiteDatabase> {
	if (db) return db

	db = await SQLite.openDatabaseAsync("wardrobe.db")

	try {
		// No trailing comma after the last column!
		await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS clothingItems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        imageUri TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS itemTags (
        itemId TEXT NOT NULL,
        tagId  INTEGER NOT NULL,
        PRIMARY KEY (itemId, tagId),
        FOREIGN KEY (itemId) REFERENCES clothingItems(id) ON DELETE CASCADE,
        FOREIGN KEY (tagId)  REFERENCES tags(id)       ON DELETE CASCADE
      );
    `)
	} catch (e) {
		console.error("Schema init failed:", e)
	}

	return db
}

// --------------- CLOTHING CRUD -------------------

// Insert a new clothing item (including its tags array)
export async function addClothingItem(item: ClothingItem) {
	const database = await getDb()

	const res = await database.runAsync(
		`INSERT INTO clothingItems
       (type, imageUri, createdAt, updatedAt)
     VALUES ( ?, ?, ?, ?);`,
		item.type,
		item.imageUri,
		item.createdAt,
		item.updatedAt
	)
	console.log("res:", res.lastInsertRowId)
	if (res.lastInsertRowId == null) {
		throw new Error("Failed to insert clothing item")
	}
	return res.lastInsertRowId
}

// Fetch all items and parse their tags JSON back into string[]
export async function getAllClothingItems(): Promise<ClothingItem[]> {
	const database = await getDb()
	const rows = await database.getAllAsync<ClothingRow>(
		`SELECT * FROM clothingItems;`
	)
	return database.getAllAsync<ClothingItem>(`SELECT * FROM clothingItems;`)
}

// Delete an item by id
export async function deleteClothingItem(id: string) {
	const database = await getDb()
	await database.runAsync(`DELETE FROM clothingItems WHERE id = ?;`, id)
}

// ---------------- TAGS CRUD -------------------

// Add a new tag and return its id -> more so a helper function for the addItemTag function
export async function addTag(name: string) {
	const database = await getDb()
	await database.runAsync(`INSERT OR IGNORE INTO tags (name) VALUES (?);`, name)

	const row = await database.getFirstAsync<{ id: number }>(
		`SELECT id FROM tags WHERE name = ?;`,
		name
	)
	if (!row) throw new Error(`Failed to get tag id for "${name}"`)
	return row.id
}

// Get all tags
export async function getAllTags(): Promise<Tag[]> {
	const database = await getDb()
	return await database.getAllAsync<Tag>(`SELECT * FROM tags;`)
}

// ---------------- ITEM TAGS CRUD -------------------

// link a clothing item to a tag (use to add tags from frontend)
export async function addItemTag(itemId: number, tagName: string) {
	const database = await getDb()
	const tagId = await addTag(tagName)
	await database.runAsync(
		`INSERT OR IGNORE INTO itemTags (itemId, tagId) VALUES (?, ?);`,
		itemId,
		tagId
	)
}

// Return all tags for a given item
export async function getTagsForItems(itemId: number): Promise<string[]> {
	const database = await getDb()
	const rows = await database.getAllAsync<{ name: string }>(
		`SELECT t.name
      FROM itemTags it
      JOIN tags t ON it.tagId = t.id
     WHERE it.itemId = ?;`,
		itemId
	)
	return rows.map((r) => r.name)
}

// Return all items for a given tag
export async function getItemsForTag(tagName: string): Promise<ClothingItem[]> {
	const database = await getDb()
	return database.getAllAsync<ClothingRow>(
		`SELECT ci.*
      FROM itemTags it
      JOIN tags t ON it.tagId = t.id
      JOIN clothingItems ci ON it.itemId = ci.id
      WHERE t.name = ?;
    `,
		tagName
	)
}
