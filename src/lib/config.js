// Supabase connection. These are PUBLIC values (the anon key is designed to be
// exposed in client apps) so it is fine that they ship in the built bundle.
//
// Cross-device sync turns on automatically as soon as both values are present.
// Easiest: paste your project's values into the two constants below. (Env vars
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY still override them if set.)
// While both are empty, the app runs fully on this device using local storage.
const PROJECT_URL = 'https://wscuovmzdbhwugxsgfjw.supabase.co'
const ANON_KEY = 'sb_publishable_eAz7id9uPfkRq0wTll_UFA_HaR9JMj1'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || PROJECT_URL
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || ANON_KEY

export const IMAGE_BUCKET = 'recipe-images'

export const isCloudConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
