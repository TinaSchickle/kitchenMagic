import { useMemo, useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import { recipeIngredientNames } from '../lib/model'
import { GalleryCard, ListRow } from './RecipeCard'
import IngredientFilter from './IngredientFilter'
import { GridIcon, ListIcon, PlusIcon } from './icons'

export default function Overview({ recipes, loading, onOpen, onAdd }) {
  const [category, setCategory] = useState('all')
  const [mode, setMode] = useState('gallery') // 'gallery' | 'list'
  const [tokens, setTokens] = useState([])

  const counts = useMemo(() => {
    const c = { all: recipes.length }
    for (const cat of CATEGORIES) c[cat.id] = 0
    for (const r of recipes) if (c[r.category] != null) c[r.category] += 1
    return c
  }, [recipes])

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (category !== 'all' && r.category !== category) return false
      if (tokens.length) {
        const names = recipeIngredientNames(r)
        // AND matching: every token must appear in some ingredient name.
        return tokens.every((t) => names.some((n) => n.includes(t)))
      }
      return true
    })
  }, [recipes, category, tokens])

  const addToken = (t) => setTokens((prev) => [...prev, t])
  const removeToken = (t) => setTokens((prev) => prev.filter((x) => x !== t))

  return (
    <div className="pt-6">
      <div className="mb-5">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-cocoa-800">
          Your recipes
        </h1>
        <p className="text-cocoa-400 mt-1">
          {recipes.length} saved · pick a tab or filter by ingredient
        </p>
      </div>

      {/* Category tabs + view toggle */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 flex gap-2 overflow-x-auto pb-1 -mb-1">
          <Tab
            label="All"
            emoji="\u{1F373}"
            active={category === 'all'}
            count={counts.all}
            onClick={() => setCategory('all')}
            allTab
          />
          {CATEGORIES.map((cat) => (
            <Tab
              key={cat.id}
              label={cat.label}
              emoji={cat.emoji}
              active={category === cat.id}
              count={counts[cat.id]}
              onClick={() => setCategory(cat.id)}
            />
          ))}
        </div>

        <div className="flex-shrink-0 flex items-center gap-1 bg-white/70 rounded-full p-1 shadow-soft">
          <ToggleBtn
            active={mode === 'gallery'}
            onClick={() => setMode('gallery')}
            label="Gallery view"
          >
            <GridIcon width={18} height={18} />
          </ToggleBtn>
          <ToggleBtn
            active={mode === 'list'}
            onClick={() => setMode('list')}
            label="List view"
          >
            <ListIcon width={18} height={18} />
          </ToggleBtn>
        </div>
      </div>

      {/* Ingredient filter */}
      <div className="mb-6">
        <IngredientFilter
          tokens={tokens}
          onAdd={addToken}
          onRemove={removeToken}
          onClear={() => setTokens([])}
        />
      </div>

      {/* Content */}
      {loading ? (
        <Loading mode={mode} />
      ) : filtered.length === 0 ? (
        <EmptyState
          hasRecipes={recipes.length > 0}
          tokens={tokens}
          onAdd={onAdd}
        />
      ) : mode === 'gallery' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((r) => (
            <GalleryCard key={r.id} recipe={r} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((r) => (
            <ListRow key={r.id} recipe={r} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  )
}

function Tab({ label, emoji, active, count, onClick, allTab }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-all ${
        active
          ? 'bg-terracotta-500 text-white shadow-soft'
          : 'bg-white/70 text-cocoa-600 hover:bg-white'
      }`}
    >
      {!allTab && <span>{emoji}</span>}
      {label}
      <span
        className={`text-xs rounded-full px-1.5 py-0.5 ${
          active ? 'bg-white/25' : 'bg-cream-200 text-cocoa-400'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

function ToggleBtn({ active, onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`grid place-items-center w-9 h-9 rounded-full transition-all ${
        active
          ? 'bg-terracotta-500 text-white shadow-soft'
          : 'text-cocoa-400 hover:text-cocoa-600'
      }`}
    >
      {children}
    </button>
  )
}

function Loading({ mode }) {
  const items = Array.from({ length: 6 })
  if (mode === 'list') {
    return (
      <div className="flex flex-col gap-2.5">
        {items.map((_, i) => (
          <div key={i} className="card h-20 animate-pulse bg-white/50" />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {items.map((_, i) => (
        <div key={i} className="card aspect-[4/3] animate-pulse bg-white/50" />
      ))}
    </div>
  )
}

function EmptyState({ hasRecipes, tokens, onAdd }) {
  if (hasRecipes) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-3">{'\u{1F50D}'}</p>
        <p className="text-cocoa-600 text-lg font-semibold">No matches</p>
        <p className="text-cocoa-400 mt-1">
          {tokens.length
            ? `No recipe contains ${tokens.join(' + ')}.`
            : 'Nothing in this category yet.'}
        </p>
      </div>
    )
  }
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-3">{'\u{1F373}'}</p>
      <p className="text-cocoa-600 text-lg font-semibold">
        No recipes yet
      </p>
      <p className="text-cocoa-400 mt-1 mb-5">
        Add your first recipe and it'll show up here.
      </p>
      <button className="btn-primary" onClick={onAdd}>
        <PlusIcon width={18} height={18} />
        Add a recipe
      </button>
    </div>
  )
}
