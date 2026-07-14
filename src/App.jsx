import { useCallback, useEffect, useState } from 'react'
import * as storage from './lib/storage'
import Header from './components/Header'
import Overview from './components/Overview'
import RecipeView from './components/RecipeView'
import RecipeForm from './components/RecipeForm'

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // view: { name: 'overview' } | { name: 'recipe', id } | { name: 'form', id|null }
  const [view, setView] = useState({ name: 'overview' })

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const list = await storage.listRecipes()
      setRecipes(list)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not load recipes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const openOverview = () => setView({ name: 'overview' })
  const openRecipe = (id) => setView({ name: 'recipe', id })
  const openNew = () => setView({ name: 'form', id: null })
  const openEdit = (id) => setView({ name: 'form', id })

  const handleSave = async (recipe) => {
    const saved = await storage.saveRecipe(recipe)
    await refresh()
    openRecipe(saved.id)
  }

  const handleDelete = async (id) => {
    await storage.deleteRecipe(id)
    await refresh()
    openOverview()
  }

  const current = view.id ? recipes.find((r) => r.id === view.id) : null

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onLogoClick={openOverview}
        onAdd={openNew}
        showAdd={view.name === 'overview'}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {error && (
          <div className="mt-6 rounded-2xl bg-terracotta-50 text-terracotta-700 border border-terracotta-100 px-4 py-3">
            {error}
          </div>
        )}

        {view.name === 'overview' && (
          <Overview
            recipes={recipes}
            loading={loading}
            onOpen={openRecipe}
            onAdd={openNew}
          />
        )}

        {view.name === 'recipe' && current && (
          <RecipeView
            recipe={current}
            onBack={openOverview}
            onEdit={() => openEdit(current.id)}
            onDelete={() => handleDelete(current.id)}
          />
        )}

        {view.name === 'recipe' && !current && !loading && (
          <NotFound onBack={openOverview} />
        )}

        {view.name === 'form' && (
          <RecipeForm
            initial={current}
            onCancel={view.id ? () => openRecipe(view.id) : openOverview}
            onSave={handleSave}
          />
        )}
      </main>

      <footer className="text-center text-sm text-cocoa-400 pb-8">
        made with warmth · kitchenMagic
      </footer>
    </div>
  )
}

function NotFound({ onBack }) {
  return (
    <div className="mt-16 text-center">
      <p className="text-cocoa-600 text-lg">That recipe couldn't be found.</p>
      <button className="btn-primary mt-4" onClick={onBack}>
        Back to recipes
      </button>
    </div>
  )
}
