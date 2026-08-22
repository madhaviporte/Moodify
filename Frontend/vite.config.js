import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward API calls to backend
      '/api': 'http://localhost:8000',
      // Forward static song files to backend
      '/songs': 'http://localhost:8000',
      // Forward poster artwork to backend
      '/posters': 'http://localhost:8000',
    },
  },
})
