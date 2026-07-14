import { useCallback, useEffect, useMemo, useState } from 'react'
import * as storage from './lib/storage'
import Header from './components/Header'
import PrimaryNav from './components/PrimaryNav'
import Overview from './components/Overview'
import Planner from './components/Planner'
import ShoppingList from './components/ShoppingList'
import RecipeView from './components/RecipeView'
import RecipeForm from './components/RecipeForm'

export default function App() {
  const [recipes, setRecipes] = useState([])
  const [planner, setPlanner] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // view: overview | planner | shopping | recipe | form
  const [view, setView] = useState({ name: 'overview' })

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const [list, plan] = await Promise.all([
        storage.listRecipes(),
        storage.listPlanner(),
      ])
      setRecipes(list)
      setPlanner(plan)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not load your recipes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Cross-device sync: re-pull the latest data whenever the tab regains focus
  // (e.g. you switch back after editing on your phone). Only meaningful with
  // the Supabase backend, so we skip it for the local-only fallback.
  useEffect(() => {
    if (!storage.isCloud) return
    const onFocus = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onFocus)
    window.addEventListener('focus', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onFocus)
      window.removeEventListener('focus', onFocus)
    }
  }, [refresh])

  const plannedIds = useMemo(
    () => new Set(planner.map((e) => e.recipeId)),
    [planner],
  )

  const openOverview = () => setView({ name: 'overview' })
  const openPlanner = () => setView({ name: 'planner' })
  const openShopping = () => setView({ name: 'shopping' })
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
    await storage.removeFromPlanner(id)
    await refresh()
    openOverview()
  }

  const togglePlan = async (id, portions = 1) => {
    if (plannedIds.has(id)) await storage.removeFromPlanner(id)
    else await storage.addToPlanner(id, portions)
    await refresh()
  }

  const setPlanPortions = async (id, portions) => {
    // Optimistic update so the stepper feels instant.
    setPlanner((prev) =>
      prev.map((e) => (e.recipeId === id ? { ...e, portions } : e)),
    )
    await storage.setPlannerPortions(id, portions)
  }

  const removeFromPlanner = async (id) => {
    await storage.removeFromPlanner(id)
    await refresh()
  }

  const clearPlanner = async () => {
    await storage.clearPlanner()
    await refresh()
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

        {(view.name === 'overview' || view.name === 'planner') && (
          <PrimaryNav
            current={view.name}
            plannerCount={planner.length}
            onNavigate={(v) => setView({ name: v })}
          />
        )}

        {view.name === 'overview' && (
          <Overview
            recipes={recipes}
            loading={loading}
            plannedIds={plannedIds}
            onOpen={openRecipe}
            onAdd={openNew}
            onTogglePlan={togglePlan}
          />
        )}

        {view.name === 'planner' && (
          <Planner
            planner={planner}
            recipes={recipes}
            onOpen={openRecipe}
            onRemove={removeFromPlanner}
            onSetPortions={setPlanPortions}
            onClear={clearPlanner}
            onCreateShopping={openShopping}
            onBrowse={openOverview}
          />
        )}

        {view.name === 'shopping' && (
          <ShoppingList
            planner={planner}
            recipes={recipes}
            onBack={openPlanner}
          />
        )}

        {view.name === 'recipe' && current && (
          <RecipeView
            recipe={current}
            isPlanned={plannedIds.has(current.id)}
            onTogglePlan={togglePlan}
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
