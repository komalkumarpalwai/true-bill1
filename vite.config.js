import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'react-refresh/babel': path.resolve('./node_modules/react-refresh/babel.js'),
    },
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'true-bill1.onrender.com',
      'localhost',  // You can add localhost here for local development as well.
    ],
   // port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
  },
});