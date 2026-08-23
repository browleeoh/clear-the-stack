import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('mobile installation readiness', () => {
  const manifest = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8'))
  const serviceWorker = readFileSync('public/sw.js', 'utf8')

  it('defines a scoped standalone manifest with a scalable maskable icon', () => {
    expect(manifest).toMatchObject({ id: '/', scope: '/', start_url: '/', display: 'standalone' })
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(manifest.icons).toContainEqual(expect.objectContaining({ sizes: 'any', type: 'image/svg+xml', purpose: expect.stringContaining('maskable') }))
  })

  it('keeps offline caching same-origin and limits shell fallback to navigation', () => {
    expect(serviceWorker).toContain('requestUrl.origin !== self.location.origin')
    expect(serviceWorker).toContain("event.request.mode === 'navigate'")
    expect(serviceWorker).toContain("key.startsWith('mtg-helper-')")
    expect(serviceWorker).toContain('html.matchAll(/(?:src|href)')
  })
})
