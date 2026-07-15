// Supabase backend. A single shared recipe collection (no login) so the same
// data appears on every device. Row shape in the `recipes` table:
//   id (uuid, pk) | title (text) | category (text) | image_url (text)
//   | blocks (jsonb) | created_at (timestamptz) | updated_at (timestamptz)
// Images live in the public storage bucket named by IMAGE_BUCKET.

import { createClient } from '@supabase/supabase-js'
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  IMAGE_BUCKET,
  isCloudConfigured,
} from '../config'
import { uid } from '../uid'

// Only build the client when configured — createClient throws on an empty URL,
// and this module is imported eagerly by the backend selector.
const supabase = isCloudConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null

function rowToRecipe(row) {
  return {
    id: row.id,
    title: row.title || '',
    category: row.category || 'lunch',
    image: row.image_url || null,
    serves: row.serves ?? null,
    blocks: row.blocks || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function recipeToRow(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    image_url: recipe.image || null,
    serves: recipe.serves ?? null,
    blocks: recipe.blocks || [],
    updated_at: new Date().toISOString(),
  }
}

export async function listRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(rowToRecipe)
}

export async function getRecipe(id) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data ? rowToRecipe(data) : null
}

export async function saveRecipe(recipe) {
  const row = recipeToRow(recipe)
  let res = await supabase
    .from('recipes')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single()
  // Graceful fallback if the `serves` column hasn't been added to the DB yet:
  // retry without it so saving still works (serves just won't persist).
  if (res.error && /serves/i.test(res.error.message || '')) {
    const { serves, ...rest } = row
    res = await supabase
      .from('recipes')
      .upsert(rest, { onConflict: 'id' })
      .select()
      .single()
  }
  if (res.error) throw res.error
  return rowToRecipe(res.data)
}

export async function deleteRecipe(id) {
  const { error } = await supabase.from('recipes').delete().eq('id', id)
  if (error) throw error
}

// --- Planner ------------------------------------------------------------------
// Table `planner`: recipe_id (uuid, pk) | portions (int) | added_at (timestamptz)

function clampPortions(p) {
  return Math.max(1, Math.floor(Number(p) || 1))
}

export async function listPlanner() {
  const { data, error } = await supabase
    .from('planner')
    .select('*')
    .order('added_at', { ascending: true })
  if (error) throw error
  return (data || []).map((r) => ({
    recipeId: r.recipe_id,
    portions: r.portions || 1,
    addedAt: r.added_at,
  }))
}

export async function addToPlanner(recipeId, portions = 1) {
  const { data, error } = await supabase
    .from('planner')
    .upsert(
      { recipe_id: recipeId, portions: clampPortions(portions) },
      { onConflict: 'recipe_id' },
    )
    .select()
    .single()
  if (error) throw error
  return {
    recipeId: data.recipe_id,
    portions: data.portions,
    addedAt: data.added_at,
  }
}

export async function setPlannerPortions(recipeId, portions) {
  const { error } = await supabase
    .from('planner')
    .update({ portions: clampPortions(portions) })
    .eq('recipe_id', recipeId)
  if (error) throw error
}

export async function removeFromPlanner(recipeId) {
  const { error } = await supabase
    .from('planner')
    .delete()
    .eq('recipe_id', recipeId)
  if (error) throw error
}

export async function clearPlanner() {
  // Delete every row (guard clause required by Supabase on bulk delete).
  const { error } = await supabase
    .from('planner')
    .delete()
    .not('recipe_id', 'is', null)
  if (error) throw error
}

export async function uploadImage(file) {
  const ext = (file.name?.split('.').pop() || 'jpg').toLowerCase()
  const path = `${uid()}.${ext}`
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
