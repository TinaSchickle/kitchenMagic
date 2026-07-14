import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path is '/kitchenMagic/' for GitHub Pages project sites,
// but '/' for local dev so the preview works normally.
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/kitchenMagic/' : '/',
  plugins: [react()],
}))
