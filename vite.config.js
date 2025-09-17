import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@shared': resolve(__dirname, './src/shared'),
      '@features': resolve(__dirname, './src/features'),
      '@components': resolve(__dirname, './src/shared/components'),
      '@utils': resolve(__dirname, './src/shared/utils'),
      '@constants': resolve(__dirname, './src/shared/constants')
    }
  }
})
