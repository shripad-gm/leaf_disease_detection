import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // History routes → Flask (handles save + fetch + delete)
      '/api/history': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      // All other /api routes → Node.js (auth etc.)
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  }
})
