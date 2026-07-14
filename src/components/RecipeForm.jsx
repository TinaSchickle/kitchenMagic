import { useMemo, useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import {
  blockLetter,
  newBlock,
  newIngredient,
  newRecipe,
} from '../lib/model'
import { uploadImage } from '../lib/storage'
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from './icons'

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

  const updateBlock = (blockId, fields) =>
    setRecipe((r) => ({
      ...r,
      blocks: r.blocks.map((b) => (b.id === blockId ? { ...b, ...fields } : b)),
    }))

  const updateIngredient = (blockId, ingId, fields) =>
    setRecipe((r) => ({
      ...r,
      blocks: r.blocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              ingredients: b.ingredients.map((ing) =>
                ing.id === ingId ? { ...ing, ...fields } : ing,
              ),
            }
          : b,
      ),
    }))

  const addIngredient = (blockId) =>
    setRecipe((r) => ({
      ...r,
      blocks: r.blocks.map((b) =>
        b.id === blockId
          ? { ...b, ingredients: [...b.ingredients, newIngredient()] }
          : b,
      ),
    }))

  const removeIngredient = (blockId, ingId) =>
    setRecipe((r) => ({
      ...r,
      blocks: r.blocks.map((b) =>
        b.id === blockId
          ? {
              ...b,
              ingredients:
                b.ingredients.length > 1
                  ? b.ingredients.filter((ing) => ing.id !== ingId)
                  : b.ingredients,
            }
          : b,
      ),
    }))

  const addBlock = () =>
    setRecipe((r) => ({ ...r, blocks: [...r.blocks, newBlock()] }))

  const removeBlock = (blockId) =>
    setRecipe((r) => ({
      ...r,
      blocks:
        r.blocks.length > 1
          ? r.blocks.filter((b) => b.id !== blockId)
          : r.blocks,
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
      blocks: recipe.blocks.map((b) => ({
        ...b,
        ingredients: b.ingredients.filter(
          (ing) => ing.name.trim() || ing.amount.trim(),
        ),
      })),
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
          Photo
        </label>
        <ImagePicker
          image={recipe.image}
          uploading={uploading}
          onPick={onPickImage}
          onRemove={() => patch({ image: null })}
        />
      </div>

      {/* Blocks */}
      <div className="flex flex-col gap-4">
        {recipe.blocks.map((block, i) => (
          <BlockEditor
            key={block.id}
            block={block}
            letter={blockLetter(i)}
            canRemove={recipe.blocks.length > 1}
            onChangeInstruction={(v) => updateBlock(block.id, { instruction: v })}
            onChangeIngredient={(ingId, fields) =>
              updateIngredient(block.id, ingId, fields)
            }
            onAddIngredient={() => addIngredient(block.id)}
            onRemoveIngredient={(ingId) => removeIngredient(block.id, ingId)}
            onRemoveBlock={() => removeBlock(block.id)}
          />
        ))}
      </div>

      <button
        onClick={addBlock}
        className="btn-soft w-full mt-4 py-3 border-2 border-dashed border-sage-300 bg-sage-50 hover:bg-sage-100"
      >
        <PlusIcon width={18} height={18} />
        Add another block
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

function BlockEditor({
  block,
  letter,
  canRemove,
  onChangeInstruction,
  onChangeIngredient,
  onAddIngredient,
  onRemoveIngredient,
  onRemoveBlock,
}) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-8 h-8 rounded-full bg-terracotta-500 text-white font-bold shadow-soft">
            {letter}
          </span>
          <span className="text-sm font-bold text-cocoa-600">
            Block {letter}
          </span>
        </div>
        {canRemove && (
          <button
            onClick={onRemoveBlock}
            className="text-cocoa-400 hover:text-terracotta-500 p-1"
            aria-label={`Remove block ${letter}`}
          >
            <TrashIcon width={18} height={18} />
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Ingredients */}
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-cocoa-400 mb-2">
            Ingredients
          </p>
          <div className="space-y-2">
            {block.ingredients.map((ing) => (
              <div key={ing.id} className="flex items-center gap-2">
                <input
                  value={ing.amount}
                  onChange={(e) =>
                    onChangeIngredient(ing.id, { amount: e.target.value })
                  }
                  placeholder="200g"
                  className="field w-20 flex-shrink-0 px-2.5 py-2 text-center"
                  aria-label="Amount (optional)"
                />
                <input
                  value={ing.name}
                  onChange={(e) =>
                    onChangeIngredient(ing.id, { name: e.target.value })
                  }
                  placeholder="flour"
                  className="field px-3 py-2"
                  aria-label="Ingredient"
                />
                <button
                  onClick={() => onRemoveIngredient(ing.id)}
                  className="text-cocoa-400 hover:text-terracotta-500 p-1 flex-shrink-0"
                  aria-label="Remove ingredient"
                >
                  <XIcon width={16} height={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={onAddIngredient}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-sage-600 hover:text-sage-600/80"
          >
            <PlusIcon width={16} height={16} />
            Add ingredient
          </button>
          <p className="text-xs text-cocoa-400 mt-2">
            Amount is optional — leave it blank for things like “salt”.
          </p>
        </div>

        {/* Method */}
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-cocoa-400 mb-2">
            Method
          </p>
          <textarea
            value={block.instruction}
            onChange={(e) => onChangeInstruction(e.target.value)}
            rows={6}
            placeholder={`How to process block ${letter}…\ne.g. Mix block A into ${letter}, then fold gently.`}
            className="field resize-y leading-relaxed"
          />
        </div>
      </div>
    </section>
  )
}
