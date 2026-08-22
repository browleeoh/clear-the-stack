import { describe, expect, it } from 'vitest'
import { catalogCards, getCatalogCard } from '@/content/catalog'
import { cards, concepts, sources } from '@/content/data'
import { searchContent } from '@/lib/search'

describe('HOB catalog', () => {
  it('contains exactly the 193 mechanically distinct main-set cards', () => {
    expect(catalogCards).toHaveLength(193)
    expect(new Set(catalogCards.map((card) => card.id))).toHaveLength(193)
    expect(new Set(catalogCards.map((card) => card.oracleId))).toHaveLength(193)
    expect(
      new Set(catalogCards.map((card) => card.collectorNumber)),
    ).toHaveLength(193)
    expect(catalogCards.every((card) => card.setCode === 'HOB')).toBe(true)
    expect(catalogCards.map((card) => Number(card.collectorNumber))).toEqual(
      Array.from({ length: 193 }, (_, index) => index + 1),
    )
  })

  it('provides content-layer lookup for basic catalog data', () => {
    expect(getCatalogCard('thorin-oakenshield')).toMatchObject({
      collectorNumber: '165',
      name: 'Thorin Oakenshield',
      typeLine: 'Legendary Creature — Dwarf Noble',
    })
  })

  it('preserves multi-face card data without requiring images', () => {
    const card = getCatalogCard('bofur-reliable-guardian-concerted-care')

    expect(card?.faces?.map((face) => face.name)).toEqual([
      'Bofur, Reliable Guardian',
      'Concerted Care',
    ])
  })
})

describe('verified content', () => {
  it('keeps curated Thorin guidance separate from generated catalog data', () => {
    const curatedThorin = cards.find((card) => card.id === 'thorin-oakenshield')

    expect(curatedThorin?.summary).toContain('storied requirement')
    expect(curatedThorin?.scenarios).toHaveLength(1)
    expect(getCatalogCard('thorin-oakenshield')).not.toHaveProperty('summary')
  })

  it('keeps every published source reference resolvable', () => {
    const sourceIds = new Set(sources.map((source) => source.id))
    const referencedIds = [
      ...cards.flatMap((card) => [
        ...card.sourceIds,
        ...card.scenarios.flatMap((scenario) => scenario.sourceIds),
      ]),
      ...concepts.flatMap((concept) => [
        ...concept.sourceIds,
        ...concept.scenarios.flatMap((scenario) => scenario.sourceIds),
      ]),
    ]

    expect(referencedIds.every((id) => sourceIds.has(id))).toBe(true)
  })

  it('finds Storied from a beginner token question', () => {
    expect(searchContent('do treasure tokens count')[0]?.title).toBe('Storied')
  })

  it('finds Thorin by partial name', () => {
    expect(searchContent('thorin')[0]?.title).toBe('Thorin Oakenshield')
  })
})
