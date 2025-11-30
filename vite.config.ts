import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['vite.config.ts', 'tailwind.config.js']
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib.ts'),
      name: 'XoGeminiCliDevTools',
      fileName: (format) => `xo-gemini-cli-devtools.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
