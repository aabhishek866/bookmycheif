import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin',        // 👈 important for Vercel - admin panel at /admin path
  server: { port: 5173 }
})
