import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true
  },
  resolve: {
    alias: {
      buffer: 'buffer', // Alias the `buffer` module for browser compatibility
    },
  },
})
