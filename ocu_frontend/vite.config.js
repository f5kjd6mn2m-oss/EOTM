import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev rejimda /api so'rovlari backendga (5000-port) yo'naltiriladi — CORS muammosi bo'lmaydi
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
