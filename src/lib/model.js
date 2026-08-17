import { uid } from './uid'

// Factory helpers for the recipe data shape. Keeping them in one place means
// both storage backends and the form agree on the structure.

export function newIngredient(amount = '', name = '') {
  return { id: uid(), amount, name, optional: false }
}

export function newStep(text = '') {
  return { id: uid(), text }
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
    foodprep: false, // "perfect for food prep"
    comment: '', // shown above the ingredient list, only when non-empty
    ingredients: [newIngredient()],
    steps: [newStep()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Flatten all ingredient names of a recipe (lowercased) for filtering/search.
export function recipeIngredientNames(recipe) {
  return (recipe.ingredients || [])
    .map((ing) => (ing.name || '').trim().toLowerCase())
    .filter(Boolean)
}
