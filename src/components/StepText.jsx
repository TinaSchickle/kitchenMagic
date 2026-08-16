import { resolveStepText } from '../lib/stepText'

// Renders a step's instruction text, resolving `[Ingredient name]`
// references into the (portion-scaled) amount, highlighted inline. Used both
// in the recipe reading view and as a live preview while editing.
export default function StepText({ text, ingredients, portions, className }) {
  const segments = resolveStepText(text, ingredients, portions)
  return (
    <p className={className}>
      {segments.map((seg, i) => {
        if (seg.type === 'ref') {
          return (
            <span
              key={i}
              className="font-semibold text-terracotta-600 bg-terracotta-50 rounded px-1"
            >
              {seg.value}
            </span>
          )
        }
        if (seg.type === 'missing') {
          return (
            <span
              key={i}
              className="font-semibold text-amber-700 bg-amber-50 rounded px-1"
              title="Keine passende Zutat gefunden"
            >
              [{seg.value}]
            </span>
          )
        }
        return <span key={i}>{seg.value}</span>
      })}
    </p>
  )
}
