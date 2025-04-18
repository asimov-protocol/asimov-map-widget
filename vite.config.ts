import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      exclude: ['examples'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/main.ts'),
      name: 'asimov-map-widget',
      fileName: "asimov-map-widget",
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'react/jsx-runtime',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://qlever.cs.uni-freiburg.de/api/osm-planet',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
