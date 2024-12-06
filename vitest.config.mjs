import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte'; // Use named import

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Simulates a browser environment for DOM
  },
  plugins: [svelte()], // Only needed for processing Svelte files
});