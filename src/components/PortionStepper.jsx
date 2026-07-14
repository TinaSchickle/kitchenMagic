import { MinusIcon, PlusIcon } from './icons'

// Integer portion multiplier. Default & minimum = 1, no upper limit.
export default function PortionStepper({ value, onChange }) {
  const set = (n) => {
    const int = Math.max(1, Math.floor(Number(n) || 1))
    onChange(int)
  }

  return (
    <div className="inline-flex items-center gap-1 bg-white rounded-full p-1 shadow-soft border border-cream-200">
      <button
        onClick={() => set(value - 1)}
        disabled={value <= 1}
        className="grid place-items-center w-9 h-9 rounded-full text-cocoa-600 hover:bg-cream-100 disabled:opacity-40 disabled:hover:bg-transparent transition"
        aria-label="Fewer portions"
      >
        <MinusIcon width={18} height={18} />
      </button>
      <input
        type="number"
        min={1}
        inputMode="numeric"
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-12 text-center bg-transparent font-display text-xl font-semibold text-cocoa-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Portion multiplier"
      />
      <button
        onClick={() => set(value + 1)}
        className="grid place-items-center w-9 h-9 rounded-full text-cocoa-600 hover:bg-cream-100 transition"
        aria-label="More portions"
      >
        <PlusIcon width={18} height={18} />
      </button>
    </div>
  )
}
