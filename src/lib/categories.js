// The category tabs, in display order. `id` is stored on the recipe.
export const CATEGORIES = [
  { id: 'breakfast', label: 'Breakfast', emoji: '\u{1F373}' }, // 🍳
  { id: 'lunch', label: 'Lunch', emoji: '\u{1F957}' }, // 🥗
  { id: 'sweet', label: 'Sweet', emoji: '\u{1F370}' }, // 🍰
  { id: 'party', label: 'Party', emoji: '\u{1F389}' }, // 🎉
  { id: 'thyroid', label: 'Schilddrüse', emoji: '\u{1F98B}' }, // 🦋
  { id: 'try', label: 'Try', emoji: '\u{1F9EA}' }, // 🧪 — untested / not yet made
  // hiddenFromAll: not food, so it's excluded from the "All" tab — only
  // visible when the DIY tab itself is selected.
  { id: 'diy', label: 'DIY', emoji: '\u{1F9F9}', hiddenFromAll: true }, // 🧹
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
)

export function categoryLabel(id) {
  return CATEGORY_MAP[id]?.label ?? id
}
