import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './client',
  publicDir: '../client/public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:1221',
        changeOrigin: true
      },
      '/pdfs': {
        target: 'http://localhost:1221',
        changeOrigin: true
      }
    }
  }
});
