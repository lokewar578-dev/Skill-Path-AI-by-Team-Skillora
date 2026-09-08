import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Deduplicate React so @xyflow/react and other packages use the same
    // instance as the app — prevents "Invalid hook call" errors.
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    alias: {
      // Ensure a single React copy is resolved
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    // Force Vite to pre-bundle xyflow together so it picks up the same React
    include: ['@xyflow/react', 'dagre'],
  },
})

