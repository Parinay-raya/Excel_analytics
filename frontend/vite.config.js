import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components')
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
