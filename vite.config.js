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
      includeAssets: ['favicon.svg', 'pwa-icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: 'index.html',
      },
      manifest: {
        name: 'To-Do List',
        short_name: 'To-Do List',
        description: 'Create and manage your tasks, even when offline.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#4f46e5',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
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

