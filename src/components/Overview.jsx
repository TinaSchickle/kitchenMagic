import { useMemo, useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import { recipeIngredientNames } from '../lib/model'
import { GalleryCard, ListRow } from './RecipeCard'
import IngredientFilter from './IngredientFilter'
import { CheckIcon, GridIcon, ListIcon, PlusIcon } from './icons'

export default function Overview({
  recipes,
  loading,
  plannedIds,
  onOpen,
  onAdd,
  onTogglePlan,
}) {
  const [category, setCategory] = useState('all')
  const [mode, setMode] = useState('gallery') // 'gallery' | 'list'
  const [selected, setSelected] = useState([]) // ingredient keys (lowercased)
  const [foodprepOnly, setFoodprepOnly] = useState(false)

  const counts = useMemo(() => {
    const c = { all: recipes.length }
    for (const cat of CATEGORIES) c[cat.id] = 0
    for (const r of recipes) if (c[r.category] != null) c[r.category] += 1
    return c
  }, [recipes])

  // Every distinct ingredient across all recipes → checkbox options.
  const allIngredients = useMemo(() => {
    const map = new Map() // key -> display label (first seen)
    for (const r of recipes) {
      for (const name of recipeIngredientNames(r)) {
        if (!map.has(name)) map.set(name, name)
      }
    }
    return Array.from(map.keys())
      .sort((a, b) => a.localeCompare(b))
      .map((key) => ({ key, label: key }))
  }, [recipes])

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (category !== 'all' && r.category !== category) return false
      if (foodprepOnly && !r.foodprep) return false
      if (selected.length) {
        const names = new Set(recipeIngredientNames(r))
        // AND matching: recipe must contain every checked ingredient.
        return selected.every((key) => names.has(key))
      }
      return true
    })
  }, [recipes, category, selected, foodprepOnly])

  const foodprepCount = useMemo(
    () => recipes.filter((r) => r.foodprep).length,
    [recipes],
  )

  const toggleIngredient = (key) =>
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )

  return (
    <div className="mt-5">
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

      {/* Food-prep toggle */}
      <div className="mb-3">
        <button
          onClick={() => setFoodprepOnly((v) => !v)}
          aria-pressed={foodprepOnly}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold transition-all ${
            foodprepOnly
              ? 'bg-terracotta-500 text-white shadow-soft'
              : 'bg-white/70 text-cocoa-600 hover:bg-white'
          }`}
        >
          <span
            className={`grid place-items-center w-5 h-5 rounded-md border-2 flex-shrink-0 ${
              foodprepOnly
                ? 'bg-white/25 border-white/60 text-white'
                : 'border-cream-200 bg-white'
            }`}
          >
            {foodprepOnly && <CheckIcon width={13} height={13} />}
          </span>
          {'\u{1F961}'} Perfect for food prep
          <span
            className={`text-xs rounded-full px-1.5 py-0.5 ${
              foodprepOnly ? 'bg-white/25' : 'bg-cream-200 text-cocoa-400'
            }`}
          >
            {foodprepCount}
          </span>
        </button>
      </div>

      {/* Ingredient filter */}
      <div className="mb-6">
        <IngredientFilter
          allIngredients={allIngredients}
          selected={selected}
          onToggle={toggleIngredient}
          onClear={() => setSelected([])}
        />
      </div>

      {/* Content */}
      {loading ? (
        <Loading mode={mode} />
      ) : filtered.length === 0 ? (
        <EmptyState
          hasRecipes={recipes.length > 0}
          selected={selected}
          onAdd={onAdd}
        />
      ) : mode === 'gallery' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((r) => (
            <GalleryCard
              key={r.id}
              recipe={r}
              onOpen={onOpen}
              planned={plannedIds.has(r.id)}
              onTogglePlan={onTogglePlan}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((r) => (
            <ListRow
              key={r.id}
              recipe={r}
              onOpen={onOpen}
              planned={plannedIds.has(r.id)}
              onTogglePlan={onTogglePlan}
            />
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

function EmptyState({ hasRecipes, selected, onAdd }) {
  if (hasRecipes) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-3">{'\u{1F50D}'}</p>
        <p className="text-cocoa-600 text-lg font-semibold">No matches</p>
        <p className="text-cocoa-400 mt-1">
          {selected.length
            ? `No recipe contains ${selected.join(' + ')}.`
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
