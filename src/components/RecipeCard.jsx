import { CATEGORY_MAP } from '../lib/categories'
import { recipeIngredientNames } from '../lib/model'
import { BookmarkIcon, BookmarkCheckIcon } from './icons'

// Placeholder shown when a recipe has no photo — a warm gradient with the
// category emoji so the gallery still looks intentional.
function Placeholder({ category }) {
  const cat = CATEGORY_MAP[category]
  return (
    <div className="w-full h-full grid place-items-center bg-gradient-to-br from-cream-100 to-terracotta-100">
      <span className="text-4xl opacity-80">{cat?.emoji ?? '\u{1F37D}'}</span>
    </div>
  )
}

function CategoryTag({ category }) {
  const cat = CATEGORY_MAP[category]
  if (!cat) return null
  return (
    <span className="chip bg-white/85 text-cocoa-600 text-xs shadow-soft backdrop-blur">
      <span>{cat.emoji}</span>
      {cat.label}
    </span>
  )
}

function PlanButton({ planned, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      aria-label={planned ? 'Remove from planner' : 'Add to planner'}
      title={planned ? 'In planner' : 'Add to planner'}
      className={`grid place-items-center w-9 h-9 rounded-full transition shadow-soft ${
        planned
          ? 'bg-sage-500 text-white hover:bg-sage-600'
          : 'bg-white/85 text-cocoa-600 hover:bg-white hover:text-sage-600 backdrop-blur'
      } ${className}`}
    >
      {planned ? (
        <BookmarkCheckIcon width={18} height={18} />
      ) : (
        <BookmarkIcon width={18} height={18} />
      )}
    </button>
  )
}

export function GalleryCard({ recipe, onOpen, planned, onTogglePlan }) {
  const count = recipeIngredientNames(recipe).length
  return (
    <div className="group relative card overflow-hidden hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200">
      <button onClick={() => onOpen(recipe.id)} className="block w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <Placeholder category={recipe.category} />
          )}
          <div className="absolute top-3 left-3">
            <CategoryTag category={recipe.category} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-cocoa-800 leading-snug line-clamp-2">
            {recipe.title || 'Untitled recipe'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-cocoa-400">
              {count} {count === 1 ? 'ingredient' : 'ingredients'}
            </p>
            {recipe.foodprep && (
              <span className="chip bg-terracotta-100 text-terracotta-700 text-xs py-0.5">
                {'\u{1F961}'} prep
              </span>
            )}
          </div>
        </div>
      </button>
      <PlanButton
        planned={planned}
        onClick={() => onTogglePlan(recipe.id)}
        className="absolute top-3 right-3"
      />
    </div>
  )
}

export function ListRow({ recipe, onOpen, planned, onTogglePlan }) {
  const cat = CATEGORY_MAP[recipe.category]
  return (
    <div className="group card px-4 py-3 flex items-center gap-4 hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200">
      <button
        onClick={() => onOpen(recipe.id)}
        className="flex items-center gap-4 min-w-0 flex-1 text-left"
      >
        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-soft">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <Placeholder category={recipe.category} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-cocoa-800 truncate">
            {recipe.title || 'Untitled recipe'}
          </h3>
          <p className="text-sm text-cocoa-400">
            {cat ? `${cat.emoji} ${cat.label}` : ''}
            {recipe.foodprep && (
              <span className="text-terracotta-600"> · {'\u{1F961}'} food prep</span>
            )}
          </p>
        </div>
      </button>
      <PlanButton planned={planned} onClick={() => onTogglePlan(recipe.id)} />
    </div>
  )
}
