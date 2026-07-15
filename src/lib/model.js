import { uid } from './uid'

// Factory helpers for the recipe data shape. Keeping them in one place means
// both storage backends and the form agree on the structure.

export function newIngredient(amount = '', name = '') {
  return { id: uid(), amount, name }
}

export function newBlock() {
  return { id: uid(), instruction: '', ingredients: [newIngredient()] }
}

export function newRecipe() {
  return {
    id: uid(),
    title: '',
    category: 'lunch',
    image: null,
    // Yield at the base (×1) portion — both optional, both scale with portions.
    serves: 4, // "feeds N people"
    makes: null, // "makes N pieces"
    blocks: [newBlock()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// The block letter shown as a watermark: 0 -> A, 1 -> B, ... 26 -> AA
export function blockLetter(index) {
  let n = index
  let s = ''
  do {
    s = String.fromCharCode(65 + (n % 26)) + s
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return s
}

// Flatten all ingredient names of a recipe (lowercased) for filtering/search.
export function recipeIngredientNames(recipe) {
  const names = []
  for (const block of recipe.blocks || []) {
    for (const ing of block.ingredients || []) {
      if (ing.name && ing.name.trim()) names.push(ing.name.trim().toLowerCase())
    }
  }
  return names
}
