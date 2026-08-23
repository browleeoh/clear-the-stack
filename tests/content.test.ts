import { describe, expect, it } from 'vitest'
import {
  catalogCards,
  getCardContentBySlug,
  getCatalogCard,
  getCatalogCardBySlug,
} from '@/content/catalog'
import {
  cards,
  concepts,
  getConcept,
  resolveSourceReference,
} from '@/content/data'
import { searchContent, searchEntries } from '@/lib/search'

describe('HOB catalog', () => {
  it('contains exactly the 193 mechanically distinct main-set cards', () => {
    expect(catalogCards).toHaveLength(193)
    expect(new Set(catalogCards.map((card) => card.id))).toHaveLength(193)
    expect(new Set(catalogCards.map((card) => card.slug))).toHaveLength(193)
    expect(
      new Set(catalogCards.map((card) => card.collectorNumber)),
    ).toHaveLength(193)
    expect(catalogCards.every((card) => card.setCode === 'HOB')).toBe(true)
    expect(catalogCards.map((card) => Number(card.collectorNumber))).toEqual(
      Array.from({ length: 193 }, (_, index) => index + 1),
    )
  })

  it('provides content-layer lookup for basic catalog data', () => {
    expect(
      getCatalogCard('bdd41af0-bbd1-4ecd-a699-99f006f5e5ce'),
    ).toMatchObject({
      collectorNumber: '165',
      name: 'Thorin Oakenshield',
      slug: 'thorin-oakenshield',
      typeLine: 'Legendary Creature — Dwarf Noble',
    })
    expect(getCatalogCardBySlug('thorin-oakenshield')?.id).toBe(
      'bdd41af0-bbd1-4ecd-a699-99f006f5e5ce',
    )
    expect(getCatalogCardBySlug('not-a-card')).toBeUndefined()
  })

  it('preserves multi-face card data without requiring images', () => {
    const card = getCatalogCardBySlug(
      'bofur-reliable-guardian-concerted-care',
    )

    expect(card?.faces?.map((face) => face.name)).toEqual([
      'Bofur, Reliable Guardian',
      'Concerted Care',
    ])
  })
})

describe('verified content', () => {
  it('merges curated Thorin guidance by stable card ID', () => {
    const curatedThorin = cards.find((card) => card.id === 'thorin-oakenshield')
    const content = getCardContentBySlug('thorin-oakenshield')

    expect(curatedThorin?.summary).toContain('storied requirement')
    expect(curatedThorin?.scenarios).toHaveLength(1)
    expect(content?.catalogCard.id).toBe(curatedThorin?.oracleId)
    expect(content?.enrichment).toBe(curatedThorin)
    expect(content?.catalogCard).not.toHaveProperty('summary')
  })

  it('keeps every published source reference resolvable', () => {
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

    expect(referencedIds.every((id) => resolveSourceReference(id))).toBe(true)
  })

  it('publishes the verified hone-counter foundation with bounded cases', () => {
    const honeCounters = getConcept('hone-counters')

    expect(honeCounters).toMatchObject({
      kind: 'set-mechanic',
      verificationStatus: 'verified',
      sourceIds: [
        'cr-rule-122-1j',
        'hob-release-notes-hone-counters',
        'hob-mechanics-hone-counters',
      ],
    })
    expect(honeCounters?.scenarios.map((scenario) => scenario.id)).toEqual([
      'hone-one-counter-simple-example',
      'hone-multiple-counters',
      'hone-unattached-equipment',
      'hone-move-equipment',
      'hone-equipment-loses-abilities',
      'hone-remove-or-leave',
    ])
    expect(
      honeCounters?.scenarios.every(
        (scenario) =>
          scenario.verificationStatus === 'verified' &&
          scenario.reviewedAt === '2026-08-22' &&
          scenario.sourceIds.length === 3,
      ),
    ).toBe(true)
  })

  it('resolves the hone-counter route slug and rejects an unknown slug', () => {
    expect(getConcept('hone-counters')?.name).toBe('Hone Counters')
    expect(getConcept('not-a-mechanic')).toBeUndefined()
  })

  it('finds Storied from a beginner token question', () => {
    expect(searchContent('do treasure tokens count')[0]?.title).toBe('Storied')
  })

  it('finds Hone Counters from a beginner Equipment question', () => {
    expect(searchContent('does hone work unattached')[0]).toMatchObject({
      title: 'Hone Counters',
      kind: 'mechanic',
      href: '/mechanics/hone-counters',
    })
  })

  it('finds Thorin by partial name', () => {
    expect(searchContent('thorin')[0]?.title).toBe('Thorin Oakenshield')
  })
})

describe('catalog search', () => {
  const cardEntries = searchEntries.filter((entry) => entry.kind === 'card')

  it('indexes exactly 193 unique card entries alongside existing content', () => {
    expect(cardEntries).toHaveLength(193)
    expect(new Set(cardEntries.map((entry) => entry.id))).toHaveLength(193)
    expect(new Set(cardEntries.map((entry) => entry.slug))).toHaveLength(193)
    expect(searchEntries).toHaveLength(193 + concepts.length + 1)
  })

  it('does not duplicate curated cards', () => {
    expect(
      cardEntries.filter((entry) => entry.slug === 'thorin-oakenshield'),
    ).toHaveLength(1)
  })

  it('finds basic cards by exact, partial, and fuzzy names', () => {
    expect(searchContent('Long-Bodied Grey Dog')[0]?.slug).toBe(
      'long-bodied-grey-dog',
    )
    expect(searchContent('grey dog')[0]?.slug).toBe('long-bodied-grey-dog')
    expect(searchContent('long bodid grey dog')[0]?.slug).toBe(
      'long-bodied-grey-dog',
    )
  })
})
