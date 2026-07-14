import { useState } from 'react'
import { SearchIcon, XIcon } from './icons'

// Token-based ingredient filter. Type an ingredient and press Enter (or comma)
// to add it. A recipe must contain ALL active tokens to match.
export default function IngredientFilter({ tokens, onAdd, onRemove, onClear }) {
  const [text, setText] = useState('')

  const commit = () => {
    const value = text.trim().toLowerCase()
    if (value && !tokens.includes(value)) onAdd(value)
    setText('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !text && tokens.length) {
      onRemove(tokens[tokens.length - 1])
    }
  }

  return (
    <div className="card p-2 pl-4 flex flex-wrap items-center gap-2">
      <SearchIcon width={18} height={18} className="text-cocoa-400 flex-shrink-0" />
      {tokens.map((t) => (
        <span key={t} className="chip bg-sage-100 text-sage-600">
          {t}
          <button
            onClick={() => onRemove(t)}
            className="hover:text-sage-600/60"
            aria-label={`Remove ${t}`}
          >
            <XIcon width={14} height={14} />
          </button>
        </span>
      ))}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={
          tokens.length ? 'add another…' : 'Filter by ingredient — e.g. zucchini, carrot'
        }
        className="flex-1 min-w-[10rem] bg-transparent px-1 py-1.5 text-cocoa-800 placeholder-cocoa-400/70 focus:outline-none"
      />
      {tokens.length > 0 && (
        <button
          onClick={onClear}
          className="text-sm text-cocoa-400 hover:text-terracotta-500 px-2"
        >
          clear
        </button>
      )}
    </div>
  )
}
