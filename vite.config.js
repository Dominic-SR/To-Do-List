import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
// import basicSsl from '@vitejs/plugin-basic-ssl' // 1. Import SSL plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // basicSsl(), // 2. Add basicSsl() first
    react(), 
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      workbox: {
        // Caches all static build assets including dynamically loaded chunks
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        // Force service worker to immediately claim clients so it works on first install
        clientsClaim: true,
        skipWaiting: true
      },
      manifest: {
        name: 'My Vite PWA',
        short_name: 'VitePWA',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
    ,
    tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
  server:{
    allowedHosts: ['192.168.43.161.nip.io'],
    host:true
  }
})


