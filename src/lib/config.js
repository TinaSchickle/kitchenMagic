// Supabase connection. These are PUBLIC values (the anon key is designed to be
// exposed in client apps) so it is fine that they ship in the built bundle.
//
// Cross-device sync turns on automatically as soon as both values are present
// — either via Vite env vars (.env / build secrets) or by pasting them here.
// While they are empty, the app runs fully on this device using local storage.
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const IMAGE_BUCKET = 'recipe-images'

export const isCloudConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
