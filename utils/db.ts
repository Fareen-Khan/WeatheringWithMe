import * as SQLite from "expo-sqlite"
import type { SQLiteDatabase } from "expo-sqlite"

export interface ClothingItem {
	id: string
	type: "shirt" | "pants" | "shoes" | "headwear"
	imageUri: string
	createdAt: number
	updatedAt: number
}
export interface Tag {
	id: number
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
        id TEXT PRIMARY KEY NOT NULL,
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
	} catch (e) {
		console.error("Insert failed:", e)
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

// ---------------- TAGS CRUD -------------------

// Add a new tag and return its id -> more so a helper function for the addItemTag function
export async function addTag(name: string) { 
  const database = await getDb()
  await database.runAsync(
    `INSERT OR IGNORE INTO tags (name) VALUES (?);`,
    name
  )

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
export async function addItemTag(itemId: string, tagName: string) { 
  const database = await getDb()
  const tagId = await addTag(tagName)
  await database.runAsync(
    `INSERT OR IGNORE INTO itemTags (itemId, tagId) VALUES (?, ?);`,
    itemId,
    tagId
  )
}

// Return all tags for a given item
export async function getTagsForItems(itemId: string): Promise<string[]> {
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

