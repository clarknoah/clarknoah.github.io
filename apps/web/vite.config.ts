import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = import.meta.dirname

export default defineConfig({
  root,
  plugins: [react(), tailwindcss()],
  // Served from the custom domain root; assets are relative-safe anyway.
  base: '/',
  // Repo-level public dir: resume.pdf, favicon, active-inference/, images/.
  publicDir: resolve(root, '../../public'),
  build: { outDir: 'dist', emptyOutDir: true },
})
