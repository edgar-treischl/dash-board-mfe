import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  // IMPORTANT for GitHub Pages deployment
  base: '/dash-board-mfe/',

  plugins: [
    react(),
    federation({
      name: 'dash-board-mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './DashBoardApp': './src/App.tsx',
      },

      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: false,
        },
      }

    }),
  ],

  server: {
    host: true,
    port: 5174,
    cors: true,
  },

  preview: {
    host: true,
    port: 5174,
  },

  build: {
    target: 'esnext',
    cssCodeSplit: false,
    minify: false,
  },
});
