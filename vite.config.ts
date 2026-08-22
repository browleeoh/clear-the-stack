import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import catalogData from './src/content/generated/hob-catalog.json' with { type: 'json' }

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      pages: [
        { path: '/' },
        { path: '/learn/turn-structure' },
        { path: '/mechanics/storied' },
        { path: '/mechanics/permanent' },
        { path: '/mechanics/token' },
        ...catalogData.map((card) => ({ path: `/cards/${card.slug}` })),
      ],
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
})
