import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Bobriki',
        short_name: 'Bobr',
        description: 'A Progressive Web App built with Vite and React',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/bobriki/',  // <-- Adjusted for GitHub Pages
        icons: [
          {
            src: 'https://raw.githubusercontent.com/SargisX/bobriki/main/src/assets/bobrik.jpg',  // <-- Adjusted path
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://raw.githubusercontent.com/SargisX/bobriki/main/src/assets/bobrik.jpg',  // <-- Adjusted path
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        navigateFallback: '/bobriki/index.html',  // Ensures navigation works offline
      },
      devOptions: {
        enabled: true, // Ensures service worker works during development
      },
    })
  ],
  base: "/bobriki/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Avoids chunks being split incorrectly
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  }
})
