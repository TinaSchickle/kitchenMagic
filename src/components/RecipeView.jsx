import { useState } from 'react'
import { CATEGORY_MAP } from '../lib/categories'
import { blockLetter } from '../lib/model'
import { scaleAmount } from '../lib/scale'
import PortionStepper from './PortionStepper'
import {
  ArrowLeftIcon,
  BookmarkCheckIcon,
  BookmarkIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from './icons'

export default function RecipeView({
  recipe,
  isPlanned,
  onTogglePlan,
  onBack,
  onEdit,
  onDelete,
}) {
  const [portions, setPortions] = useState(1)
  const [confirming, setConfirming] = useState(false)
  const cat = CATEGORY_MAP[recipe.category]

  return (
    <div className="pt-4 sm:pt-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button className="btn-ghost" onClick={onBack}>
          <ArrowLeftIcon width={18} height={18} />
          <span className="hidden sm:inline">All recipes</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            className={
              isPlanned
                ? 'btn bg-sage-500 text-white px-4 py-2 hover:bg-sage-600 shadow-soft'
                : 'btn-ghost'
            }
            onClick={() => onTogglePlan(recipe.id, portions)}
          >
            {isPlanned ? (
              <BookmarkCheckIcon width={18} height={18} />
            ) : (
              <BookmarkIcon width={18} height={18} />
            )}
            <span className="hidden sm:inline">
              {isPlanned ? 'In planner' : 'Add to planner'}
            </span>
          </button>
          <button className="btn-ghost" onClick={onEdit}>
            <PencilIcon width={18} height={18} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            className="btn bg-white/70 text-terracotta-600 px-4 py-2 hover:bg-terracotta-50 shadow-soft"
            onClick={() => setConfirming(true)}
            aria-label="Delete recipe"
          >
            <TrashIcon width={18} height={18} />
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="card overflow-hidden mb-6">
        {recipe.image && (
          <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {cat && (
                <span className="chip bg-sage-100 text-sage-600">
                  <span>{cat.emoji}</span>
                  {cat.label}
                </span>
              )}
              {recipe.foodprep && (
                <span className="chip bg-terracotta-100 text-terracotta-700">
                  {'\u{1F961}'} Food-prep friendly
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-cocoa-800 leading-tight">
              {recipe.title || 'Untitled recipe'}
            </h1>
          </div>
          <div className="flex-shrink-0">
            <p className="text-sm text-cocoa-400 mb-1 sm:text-right">Portions</p>
            <PortionStepper value={portions} onChange={setPortions} />
            {recipe.serves ? (
              <p className="text-sm text-cocoa-600 mt-2 sm:text-right">
                <span aria-hidden>{'\u{1F37D}️'} </span>
                Feeds {recipe.serves * portions}{' '}
                {recipe.serves * portions === 1 ? 'person' : 'people'}
              </p>
            ) : null}
            {recipe.makes ? (
              <p className="text-sm text-cocoa-600 mt-1 sm:text-right">
                <span aria-hidden>{'\u{1F9C1}'} </span>
                Makes {recipe.makes * portions}{' '}
                {recipe.makes * portions === 1 ? 'piece' : 'pieces'}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="flex flex-col gap-4">
        {recipe.blocks.map((block, i) => (
          <Block key={block.id} block={block} index={i} portions={portions} />
        ))}
      </div>

      {confirming && (
        <ConfirmDelete
          title={recipe.title}
          onCancel={() => setConfirming(false)}
          onConfirm={onDelete}
        />
      )}
    </div>
  )
}

function Block({ block, index, portions }) {
  const letter = blockLetter(index)
  const ingredients = (block.ingredients || []).filter(
    (ing) => (ing.name && ing.name.trim()) || (ing.amount && ing.amount.trim()),
  )

  return (
    <section className="relative card overflow-hidden">
      {/* Big greyed watermark letter */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -top-4 right-2 font-display font-semibold text-cocoa-800/[0.06] leading-none text-[6rem] sm:text-[11rem]"
      >
        {letter}
      </span>

      {/* Always two columns — ingredients left, method right, like a table */}
      <div className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Left — ingredients */}
        <div className="p-4 sm:p-6 border-r border-cream-200/70">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid place-items-center w-7 h-7 rounded-full bg-terracotta-500 text-white text-sm font-bold shadow-soft">
              {letter}
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-cocoa-400">
              Ingredients
            </span>
          </div>
          {ingredients.length ? (
            <ul className="space-y-2">
              {ingredients.map((ing) => (
                <li key={ing.id} className="flex items-baseline gap-3">
                  <span className="font-semibold text-terracotta-600 tabular-nums whitespace-nowrap">
                    {scaleAmount(ing.amount, portions)}
                  </span>
                  <span className="text-cocoa-800">{ing.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-cocoa-400 text-sm italic">No ingredients</p>
          )}
        </div>

        {/* Right — process */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-wider font-bold text-cocoa-400">
              Method
            </span>
          </div>
          {block.instruction && block.instruction.trim() ? (
            <p className="text-cocoa-800 leading-relaxed whitespace-pre-wrap">
              {block.instruction}
            </p>
          ) : (
            <p className="text-cocoa-400 text-sm italic">No steps written</p>
          )}
        </div>
      </div>
    </section>
  )
}

function ConfirmDelete({ title, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-cocoa-800/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="card p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="ml-auto block text-cocoa-400 hover:text-cocoa-600"
          aria-label="Close"
        >
          <XIcon />
        </button>
        <p className="text-4xl mb-2">{'\u{1F5D1}️'}</p>
        <h3 className="font-display text-xl font-semibold text-cocoa-800">
          Delete this recipe?
        </h3>
        <p className="text-cocoa-400 mt-1 mb-5">
          “{title || 'Untitled recipe'}” will be gone for good.
        </p>
        <div className="flex gap-3">
          <button className="btn-ghost flex-1" onClick={onCancel}>
            Keep it
          </button>
          <button
            className="btn bg-terracotta-500 text-white px-5 py-2.5 shadow-soft hover:bg-terracotta-600 flex-1"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
