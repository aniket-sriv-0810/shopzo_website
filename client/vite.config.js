import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../server/public', // This builds React into backend/public folder
    emptyOutDir: true,          // Clears old build files before new build
    assetsDir: 'assets',        // Ensure assets are properly organized
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
