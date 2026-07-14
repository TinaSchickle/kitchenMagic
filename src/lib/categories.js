// The category tabs, in display order. `id` is stored on the recipe.
export const CATEGORIES = [
  { id: 'breakfast', label: 'Breakfast', emoji: '\u{1F373}' }, // 🍳
  { id: 'lunch', label: 'Lunch', emoji: '\u{1F957}' }, // 🥗
  { id: 'sweet', label: 'Sweet', emoji: '\u{1F370}' }, // 🍰
  { id: 'party', label: 'Party', emoji: '\u{1F389}' }, // 🎉
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
)

export function categoryLabel(id) {
  return CATEGORY_MAP[id]?.label ?? id
}
