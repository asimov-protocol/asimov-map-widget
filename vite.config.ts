import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/main.ts'),
      name: 'asimov-map-module',
      fileName: "asimov-map-module",
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', 'tailwindcss'],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'react/jsx-runtime',
          'react-dom': 'ReactDOM',
          tailwindcss: 'tailwindcss',
        },
      },
    },
  },
});
