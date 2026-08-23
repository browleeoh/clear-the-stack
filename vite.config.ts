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
        { path: '/mechanics/hone-counters' },
        { path: '/mechanics/permanent' },
        { path: '/mechanics/token' },
        { path: '/mechanics/triggered-ability' },
        { path: '/mechanics/target' },
        { path: '/mechanics/resolution' },
        { path: '/mechanics/stack' },
        { path: '/mechanics/priority' },
        { path: '/mechanics/activated-ability' },
        { path: '/mechanics/static-ability' },
        { path: '/mechanics/zones' },
        { path: '/mechanics/state-based-actions' },
        { path: '/mechanics/this-way' },
        { path: '/mechanics/and-or' },
        { path: '/mechanics/recruit' },
        { path: '/mechanics/amass-goblins' },
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
