import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const src = (dir) => fileURLToPath(new URL(`./src/${dir}`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    // Components read all copy from src/data, so content edits never touch markup.
    alias: {
      '@data': src('data'),
      '@hooks': src('hooks'),
    },
  },
  build: {
    // The three.js chunk is large but loads lazily, after the page is idle.
    chunkSizeWarningLimit: 700,
  },
});
