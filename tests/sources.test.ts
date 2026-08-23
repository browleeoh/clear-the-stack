import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { SourceList } from '@/components/source-list'
import { catalogCards } from '@/content/catalog'
import {
  cards,
  concepts,
  sourceLocators,
  sources,
  validateContentData,
} from '@/content/data'
import { sourceSchema } from '@/content/schema'

const validData = () => ({
  sources: structuredClone(sources),
  sourceLocators: structuredClone(sourceLocators),
  concepts: structuredClone(concepts),
  cards: structuredClone(cards),
})

describe('authoritative source records', () => {
  it('keeps stable source IDs and records the current rules version', () => {
    expect(sources.map((source) => source.id)).toEqual(
      expect.arrayContaining(['hob-release-notes', 'hob-mechanics']),
    )
    expect(
      sources.find((source) => source.id === 'magic-comprehensive-rules'),
    ).toMatchObject({
      publisher: 'Wizards of the Coast',
      rulesEffectiveDate: '2026-08-07',
      version: 'MagicCompRules 20260819 text release',
    })
  })

  it('distinguishes first-ten release-note coverage', () => {
    const cardLocators = sourceLocators.filter((locator) => locator.cardOracleId)
    const byType = cardLocators.reduce<
      Record<string, typeof cardLocators>
    >((groups, locator) => {
      ;(groups[locator.locatorType] ??= []).push(locator)
      return groups
    }, {})

    expect(cardLocators).toHaveLength(10)
    expect(byType['card-specific-entry']?.map((locator) => locator.label)).toEqual(
      expect.arrayContaining([
        'Azog, Moria\'s Ruin',
        'Bard, King of Dale',
        'Bifur, Melodic Rider',
        'Bolg of the North',
        'Celebrate the Mountain-king',
        'Nasty Little Rabbit',
      ]),
    )
    expect(byType['mechanic-example']).toHaveLength(2)
    expect(byType['no-card-specific-entry']).toHaveLength(2)
  })

  it('keeps the normalized hone-counter mechanic locators precise', () => {
    expect(
      sourceLocators.filter((locator) =>
        [
          'cr-rule-122-1j',
          'hob-release-notes-hone-counters',
          'hob-mechanics-hone-counters',
        ].includes(locator.id),
      ),
    ).toEqual([
      expect.objectContaining({
        id: 'cr-rule-122-1j',
        sourceId: 'magic-comprehensive-rules',
        locatorType: 'rule-number',
      }),
      expect.objectContaining({
        id: 'hob-release-notes-hone-counters',
        sourceId: 'hob-release-notes',
        locatorType: 'named-section',
      }),
      expect.objectContaining({
        id: 'hob-mechanics-hone-counters',
        sourceId: 'hob-mechanics',
        locatorType: 'named-section',
      }),
    ])
  })

  it('links every card locator to a catalog Oracle ID', () => {
    const catalogIds = new Set(catalogCards.map((card) => card.id))
    expect(
      sourceLocators
        .filter((locator) => locator.cardOracleId)
        .every((locator) => catalogIds.has(locator.cardOracleId!)),
    ).toBe(true)
  })

  it('rejects duplicate source IDs', () => {
    const data = validData()
    data.sources.push(structuredClone(data.sources[0]))
    expect(() => validateContentData(data)).toThrow(/Duplicate source ID/)
  })

  it('rejects duplicate source locator IDs', () => {
    const data = validData()
    data.sourceLocators.push(structuredClone(data.sourceLocators[0]))
    expect(() => validateContentData(data)).toThrow(
      /Duplicate source locator ID/,
    )
  })

  it('rejects a locator ID that duplicates a document source ID', () => {
    const data = validData()
    data.sourceLocators[0].id = data.sources[0].id
    expect(() => validateContentData(data)).toThrow(
      /Source locator ID duplicates source ID/,
    )
  })

  it('rejects malformed source URLs', () => {
    expect(() =>
      sourceSchema.parse({
        id: 'invalid-url',
        title: 'Invalid URL',
        publisher: 'Publisher',
        url: 'not a URL',
        sourceType: 'official-guide',
        retrievedAt: '2026-08-22',
      }),
    ).toThrow()
  })

  it('rejects invalid locator parent references', () => {
    const data = validData()
    data.sourceLocators[0].sourceId = 'missing-parent'
    expect(() => validateContentData(data)).toThrow(
      /Invalid parent source reference/,
    )
  })

  it('rejects dangling content source references', () => {
    const data = validData()
    data.cards[0].sourceIds = ['missing-source']
    expect(() => validateContentData(data)).toThrow(/Dangling source reference/)
  })

  it('renders a locator reference using its parent document and label', () => {
    const data = validData()
    const locatorId = 'hob-release-notes-bifur'
    data.cards[0].sourceIds = [locatorId]

    expect(() => validateContentData(data)).not.toThrow()

    const html = renderToStaticMarkup(SourceList({ sourceIds: [locatorId] }))
    expect(html).toContain(
      'https://magic.wizards.com/en/news/feature/the-hobbit-release-notes',
    )
    expect(html).toContain('Bifur, Melodic Rider')
  })
})
