import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensure relative paths for Electron file protocol
  build: {
    target: 'chrome108', // Electron 22 uses Chrome 108
    outDir: 'dist',
    assetsDir: '.',
  },
})
