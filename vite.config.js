import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@ui': resolve(__dirname, 'src/ui'),
      '@builder': resolve(__dirname, 'src/core/builder'),
      '@core': resolve(__dirname, 'src/core')
    }
  },
  css: {
    postcss: require('./postcss.config.cjs')
  }
});
