import { useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import { newIngredient, newRecipe, newStep } from '../lib/model'
import { uploadImage } from '../lib/storage'
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from './icons'
import StepText from './StepText'

// Deep clone so edits don't mutate the stored recipe until saved.
function cloneOrNew(initial) {
  if (!initial) return newRecipe()
  return JSON.parse(JSON.stringify(initial))
}

export default function RecipeForm({ initial, onCancel, onSave }) {
  const [recipe, setRecipe] = useState(() => cloneOrNew(initial))
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(initial)

  const canSave = recipe.title.trim().length > 0 && !uploading && !saving

  const patch = (fields) => setRecipe((r) => ({ ...r, ...fields }))

  const updateIngredient = (ingId, fields) =>
    setRecipe((r) => ({
      ...r,
      ingredients: r.ingredients.map((ing) =>
        ing.id === ingId ? { ...ing, ...fields } : ing,
      ),
    }))

  const addIngredient = () =>
    setRecipe((r) => ({ ...r, ingredients: [...r.ingredients, newIngredient()] }))

  const removeIngredient = (ingId) =>
    setRecipe((r) => ({
      ...r,
      ingredients:
        r.ingredients.length > 1
          ? r.ingredients.filter((ing) => ing.id !== ingId)
          : r.ingredients,
    }))

  const updateStep = (stepId, text) =>
    setRecipe((r) => ({
      ...r,
      steps: r.steps.map((s) => (s.id === stepId ? { ...s, text } : s)),
    }))

  const addStep = () =>
    setRecipe((r) => ({ ...r, steps: [...r.steps, newStep()] }))

  const removeStep = (stepId) =>
    setRecipe((r) => ({
      ...r,
      steps: r.steps.length > 1 ? r.steps.filter((s) => s.id !== stepId) : r.steps,
    }))

  const onPickImage = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file
    if (!file) return
    try {
      setUploading(true)
      const url = await uploadImage(file)
      patch({ image: url })
    } catch (err) {
      console.error(err)
      alert('Sorry, the image could not be added: ' + (err.message || err))
    } finally {
      setUploading(false)
    }
  }

  const submit = async () => {
    if (!canSave) return
    // Drop fully-empty ingredient rows before saving.
    const cleaned = {
      ...recipe,
      title: recipe.title.trim(),
      ingredients: recipe.ingredients.filter(
        (ing) => ing.name.trim() || ing.amount.trim(),
      ),
    }
    try {
      setSaving(true)
      await onSave(cleaned)
    } catch (err) {
      console.error(err)
      alert('Could not save: ' + (err.message || err))
      setSaving(false)
    }
  }

  return (
    <div className="pt-4 sm:pt-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button className="btn-ghost" onClick={onCancel}>
          <ArrowLeftIcon width={18} height={18} />
          Cancel
        </button>
        <h1 className="font-display text-2xl font-semibold text-cocoa-800">
          {isEdit ? 'Edit recipe' : 'New recipe'}
        </h1>
        <button className="btn-primary" onClick={submit} disabled={!canSave}>
          <CheckIcon width={18} height={18} />
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* Basics */}
      <div className="card p-5 sm:p-6 mb-4">
        <label className="block text-sm font-bold text-cocoa-600 mb-1.5">
          Title
        </label>
        <input
          value={recipe.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Grandma's zucchini fritters"
          className="field font-display text-lg"
          autoFocus
        />

        <label className="block text-sm font-bold text-cocoa-600 mt-5 mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = recipe.category === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => patch({ category: cat.id })}
                className={`chip px-4 py-2 transition-all ${
                  active
                    ? 'bg-terracotta-500 text-white shadow-soft'
                    : 'bg-white text-cocoa-600 border border-cream-200 hover:border-terracotta-300'
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            )
          })}
        </div>

        <label className="block text-sm font-bold text-cocoa-600 mt-5 mb-2">
          Yield
        </label>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={recipe.serves ?? ''}
            onChange={(e) =>
              patch({
                serves:
                  e.target.value === ''
                    ? null
                    : Math.max(1, Math.floor(Number(e.target.value) || 1)),
              })
            }
            placeholder="4"
            className="field w-20 text-center"
            aria-label="Number of people this recipe feeds"
          />
          <span className="text-cocoa-600">feeds people</span>
          <span className="text-cocoa-400 px-1">/</span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={recipe.makes ?? ''}
            onChange={(e) =>
              patch({
                makes:
                  e.target.value === ''
                    ? null
                    : Math.max(1, Math.floor(Number(e.target.value) || 1)),
              })
            }
            placeholder="12"
            className="field w-20 text-center"
            aria-label="Number of pieces this recipe makes"
          />
          <span className="text-cocoa-600">makes pieces</span>
        </div>
        <p className="text-xs text-cocoa-400 mt-1">
          At 1 portion. Both scale with the portion multiplier — leave a field
          blank to hide it.
        </p>

        <label className="flex items-center gap-3 mt-5 cursor-pointer select-none w-fit">
          <span
            className={`grid place-items-center w-6 h-6 rounded-lg border-2 flex-shrink-0 transition ${
              recipe.foodprep
                ? 'bg-sage-500 border-sage-500 text-white'
                : 'border-cream-200 bg-white'
            }`}
          >
            {recipe.foodprep && <CheckIcon width={15} height={15} />}
          </span>
          <span className="text-sm font-bold text-cocoa-600">
            {'\u{1F961}'} Perfect for food prep
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={recipe.foodprep}
            onChange={(e) => patch({ foodprep: e.target.checked })}
          />
        </label>

        <label className="block text-sm font-bold text-cocoa-600 mt-5 mb-2">
          Photo
        </label>
        <ImagePicker
          image={recipe.image}
          uploading={uploading}
          onPick={onPickImage}
          onRemove={() => patch({ image: null })}
        />
      </div>

      {/* Comment */}
      <section className="card p-5 sm:p-6 mb-4">
        <p className="text-xs uppercase tracking-wider font-bold text-cocoa-400 mb-3">
          Kommentar
        </p>
        <textarea
          value={recipe.comment}
          onChange={(e) => patch({ comment: e.target.value })}
          rows={3}
          placeholder="z. B. eine Anmerkung zu diesem Rezept…"
          className="field resize-y leading-relaxed"
        />
        <p className="text-xs text-cocoa-400 mt-2">
          Wird nur angezeigt, wenn hier etwas steht — sonst bleibt der Block
          auf der Rezeptseite komplett ausgeblendet.
        </p>
      </section>

      {/* Ingredients */}
      <section className="card p-5 sm:p-6 mb-4">
        <p className="text-xs uppercase tracking-wider font-bold text-cocoa-400 mb-3">
          Zutaten
        </p>
        <div className="space-y-2">
          {recipe.ingredients.map((ing) => (
            <div key={ing.id} className="flex items-center gap-2">
              <input
                value={ing.amount}
                onChange={(e) =>
                  updateIngredient(ing.id, { amount: e.target.value })
                }
                placeholder="200 g"
                className="field w-24 flex-shrink-0 px-2.5 py-2 text-center"
                aria-label="Amount (optional)"
              />
              <input
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, { name: e.target.value })}
                placeholder="Mehl"
                className="field px-3 py-2"
                aria-label="Ingredient"
              />
              <button
                onClick={() =>
                  updateIngredient(ing.id, { optional: !ing.optional })
                }
                aria-pressed={Boolean(ing.optional)}
                aria-label="Mark as optional"
                title="Optional"
                className={`flex-shrink-0 text-xs font-bold px-2.5 py-2 rounded-xl transition ${
                  ing.optional
                    ? 'bg-cocoa-600 text-white'
                    : 'bg-cream-100 text-cocoa-400 hover:bg-cream-200'
                }`}
              >
                opt.
              </button>
              <button
                onClick={() => removeIngredient(ing.id)}
                className="text-cocoa-400 hover:text-terracotta-500 p-1 flex-shrink-0"
                aria-label="Remove ingredient"
              >
                <XIcon width={16} height={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addIngredient}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sage-600 hover:text-sage-600/80"
        >
          <PlusIcon width={16} height={16} />
          Add ingredient
        </button>
        <p className="text-xs text-cocoa-400 mt-2">
          Amount is optional — leave it blank for things like "salt".
        </p>
      </section>

      {/* Steps */}
      <div className="flex flex-col gap-4">
        {recipe.steps.map((step, i) => (
          <StepEditor
            key={step.id}
            step={step}
            number={i + 1}
            canRemove={recipe.steps.length > 1}
            ingredients={recipe.ingredients}
            onChangeText={(v) => updateStep(step.id, v)}
            onRemoveStep={() => removeStep(step.id)}
          />
        ))}
      </div>

      <button
        onClick={addStep}
        className="btn-soft w-full mt-4 py-3 border-2 border-dashed border-sage-300 bg-sage-50 hover:bg-sage-100"
      >
        <PlusIcon width={18} height={18} />
        Add step
      </button>

      {/* Bottom save for long forms */}
      <div className="mt-6 flex justify-end">
        <button className="btn-primary" onClick={submit} disabled={!canSave}>
          <CheckIcon width={18} height={18} />
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Save recipe'}
        </button>
      </div>
      {!recipe.title.trim() && (
        <p className="text-sm text-cocoa-400 text-right mt-2">
          Add a title to save.
        </p>
      )}
    </div>
  )
}

function ImagePicker({ image, uploading, onPick, onRemove }) {
  return (
    <div>
      {image ? (
        <div className="relative rounded-2xl overflow-hidden shadow-soft">
          <img src={image} alt="" className="w-full max-h-64 object-cover" />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 grid place-items-center w-9 h-9 rounded-full bg-cocoa-800/60 text-white hover:bg-cocoa-800 backdrop-blur"
            aria-label="Remove photo"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cream-200 bg-cream-50 py-8 cursor-pointer hover:border-terracotta-300 hover:bg-terracotta-50/40 transition">
          <span className="grid place-items-center w-12 h-12 rounded-full bg-white text-terracotta-500 shadow-soft">
            <CameraIcon />
          </span>
          <span className="text-cocoa-600 font-semibold">
            {uploading ? 'Uploading…' : 'Add a photo'}
          </span>
          <span className="text-xs text-cocoa-400">tap to choose an image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPick}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}

function StepEditor({
  step,
  number,
  canRemove,
  ingredients,
  onChangeText,
  onRemoveStep,
}) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-terracotta-500 text-white font-bold shadow-soft tabular-nums">
            {number}
          </span>
          <span className="text-sm font-bold text-cocoa-600">
            Step {number}
          </span>
        </div>
        {canRemove && (
          <button
            onClick={onRemoveStep}
            className="text-cocoa-400 hover:text-terracotta-500 p-1"
            aria-label={`Remove step ${number}`}
          >
            <TrashIcon width={18} height={18} />
          </button>
        )}
      </div>

      <textarea
        value={step.text}
        onChange={(e) => onChangeText(e.target.value)}
        rows={4}
        placeholder="Mehl mit [Milch] verrühren, dann [Salz] unterheben…"
        className="field resize-y leading-relaxed"
      />
      <p className="text-xs text-cocoa-400 mt-2">
        Menge einfügen: Zutatname in eckigen Klammern schreiben, genau wie
        oben in der Zutatenliste, z. B. [Milch].
      </p>

      {step.text.trim() && (
        <div className="mt-3 pt-3 border-t border-cream-200/70">
          <p className="text-xs uppercase tracking-wider font-bold text-cocoa-400 mb-1.5">
            Vorschau
          </p>
          <StepText
            text={step.text}
            ingredients={ingredients}
            portions={1}
            className="text-cocoa-700 leading-relaxed whitespace-pre-wrap"
          />
        </div>
      )}
    </section>
  )
}
