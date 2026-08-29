// The category tabs, in display order. `id` is stored on the recipe.
export const CATEGORIES = [
  { id: 'breakfast', label: 'Frühstück', emoji: '\u{1F373}' }, // 🍳
  { id: 'lunch', label: 'Mittagessen', emoji: '\u{1F957}' }, // 🥗
  { id: 'sweet', label: 'Süßes', emoji: '\u{1F370}' }, // 🍰
  { id: 'party', label: 'Party', emoji: '\u{1F389}' }, // 🎉
  { id: 'thyroid', label: 'Schilddrüse', emoji: '\u{1F98B}' }, // 🦋
  { id: 'try', label: 'Ausprobieren', emoji: '\u{1F9EA}' }, // 🧪 — noch nicht getestet
  // hiddenFromAll: kein Essen, daher vom Tab „Alle“ ausgenommen — nur
  // sichtbar, wenn der Tab „Selbermachen“ selbst gewählt ist.
  { id: 'diy', label: 'Selbermachen', emoji: '\u{1F9F9}', hiddenFromAll: true }, // 🧹
]

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
)

export function categoryLabel(id) {
  return CATEGORY_MAP[id]?.label ?? id
}
