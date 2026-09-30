import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Required for GitHub Pages project site: https://<user>.github.io/<repo>/
  // Vercel/Netlify can keep '/'. We default to repo sub-path so the
  // auto-deploy workflow works out of the box.
  base: process.env.VITE_BASE || '/ama/',
  build: {
    chunkSizeWarningLimit: 1200,
  },
})
