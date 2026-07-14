// Local-storage backend. Recipes (including images as data-URLs) live in the
// browser. Used automatically when Supabase is not configured, so the app is
// fully usable on this device with zero setup.

const KEY = 'kitchenmagic.recipes.v1'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(recipes) {
  localStorage.setItem(KEY, JSON.stringify(recipes))
}

export async function listRecipes() {
  return readAll().sort((a, b) =>
    (b.createdAt || '').localeCompare(a.createdAt || ''),
  )
}

export async function getRecipe(id) {
  return readAll().find((r) => r.id === id) || null
}

export async function saveRecipe(recipe) {
  const all = readAll()
  const idx = all.findIndex((r) => r.id === recipe.id)
  const record = { ...recipe, updatedAt: new Date().toISOString() }
  if (idx >= 0) all[idx] = record
  else all.push(record)
  writeAll(all)
  return record
}

export async function deleteRecipe(id) {
  writeAll(readAll().filter((r) => r.id !== id))
}

// Store the image inline as a data-URL string.
export async function uploadImage(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
