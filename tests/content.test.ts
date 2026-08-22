import { describe, expect, it } from 'vitest'
import { cards, concepts, sources } from '@/content/data'
import { searchContent } from '@/lib/search'

describe('verified content', () => {
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
