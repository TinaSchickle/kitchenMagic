// Picks the storage backend at load time: Supabase when configured (cross-device
// sync), otherwise local browser storage. Both expose the same async API so the
// rest of the app never needs to know which one is active.
import { isCloudConfigured } from '../config'
import * as local from './local'
import * as cloud from './cloud'

const backend = isCloudConfigured ? cloud : local

export const isCloud = isCloudConfigured
export const listRecipes = backend.listRecipes
export const getRecipe = backend.getRecipe
export const saveRecipe = backend.saveRecipe
export const deleteRecipe = backend.deleteRecipe
export const uploadImage = backend.uploadImage
export const listPlanner = backend.listPlanner
export const addToPlanner = backend.addToPlanner
export const setPlannerPortions = backend.setPlannerPortions
export const removeFromPlanner = backend.removeFromPlanner
export const clearPlanner = backend.clearPlanner
