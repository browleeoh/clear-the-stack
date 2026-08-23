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

  it('distinguishes tracked release-note coverage', () => {
    const cardLocators = sourceLocators.filter((locator) => locator.cardOracleId)
    const byType = cardLocators.reduce<
      Record<string, typeof cardLocators>
    >((groups, locator) => {
      ;(groups[locator.locatorType] ??= []).push(locator)
      return groups
    }, {})

    expect(cardLocators).toHaveLength(17)
    expect(byType['card-specific-entry']?.map((locator) => locator.label)).toEqual(
      expect.arrayContaining([
        'Azog, Moria\'s Ruin',
        'Balin, Loremaster',
        'Bard, King of Dale',
        'Bard the Bowman',
        "Bard's Company",
        "Beorn's Hospitality",
        'Bifur, Melodic Rider',
        'Bolg of the North',
        'Celebrate the Mountain-king',
        'Nasty Little Rabbit',
        'The Chief Warg',
        'The Queen of Dale',
      ]),
    )
    expect(byType['mechanic-example']).toHaveLength(2)
    expect(byType['no-card-specific-entry']?.map((locator) => locator.label)).toEqual(
      expect.arrayContaining([
        'Down in the Valley — no card-specific release-note entry',
        'Silvan Reveler — no card-specific release-note entry',
        "Sting, Bilbo's Sword — no card-specific release-note entry",
      ]),
    )
  })

  it('preserves Sting as having no card-specific release-note entry', () => {
    expect(
      sourceLocators.find((locator) => locator.id === 'hob-release-notes-sting'),
    ).toMatchObject({
      locatorType: 'no-card-specific-entry',
      cardOracleId: '9779f32c-b1a2-42a3-8e78-14c28c3ad254',
    })
  })

  it('preserves Bolg card-specific release-note coverage', () => {
    expect(sourceLocators.find((locator) => locator.id === 'hob-release-notes-bolg')).toMatchObject({
      locatorType: 'card-specific-entry',
      cardOracleId: '88522a0f-5377-4522-97f4-4148bef954af',
    })
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

  it('keeps precise Counter, Equipment, attach, and equip locators', () => {
    expect(
      sourceLocators
        .filter((locator) =>
          [
            'cr-rule-122-1',
            'cr-rule-122-2',
            'cr-rule-301-5',
            'cr-rule-301-5b',
            'cr-rule-301-5c',
            'cr-rule-701-3',
            'cr-rule-702-6a',
          ].includes(locator.id),
        )
        .map((locator) => locator.id),
    ).toEqual([
      'cr-rule-122-1',
      'cr-rule-122-2',
      'cr-rule-301-5',
      'cr-rule-301-5b',
      'cr-rule-301-5c',
      'cr-rule-701-3',
      'cr-rule-702-6a',
    ])
  })

  it('keeps precise triggered-ability, target, and resolution locators', () => {
    const ids = [
      'cr-rule-113-3c',
      'cr-rule-113-7a',
      'cr-rule-117-4',
      'cr-rule-115-1',
      'cr-rule-115-1d',
      'cr-rule-115-6',
      'cr-rule-603-1',
      'cr-rule-603-2',
      'cr-rule-603-3',
      'cr-rule-603-3b',
      'cr-rule-608-2b',
      'cr-rule-608-2c',
    ]

    expect(
      sourceLocators
        .filter((locator) => ids.includes(locator.id))
        .map((locator) => locator.id),
    ).toEqual(ids)
  })

  it('keeps precise ability-word and intervening-if locators', () => {
    const ids = ['cr-rule-207-2c', 'cr-rule-109-2', 'cr-rule-603-4']

    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id)).toEqual(ids)
    expect(sourceLocators.find((locator) => locator.id === 'hob-release-notes-chief-warg')).toMatchObject({
      locatorType: 'card-specific-entry',
      cardOracleId: '5ebe8de1-aa3d-410d-b43d-1685259c7a97',
    })
  })

  it('keeps precise land-entry and Landfall locators', () => {
    const ids = ['cr-rule-305-4', 'cr-rule-603-6a', 'hob-release-notes-landfall']

    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id)).toEqual(ids)
  })

  it('keeps precise Silvan graveyard and resolution-payment locators', () => {
    const ids = ['cr-rule-113-6m', 'cr-rule-608-2g']

    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id)).toEqual(ids)
    expect(sourceLocators.find((locator) => locator.id === 'hob-release-notes-silvan-reveler')).toMatchObject({
      locatorType: 'no-card-specific-entry',
      cardOracleId: '11932191-4b19-49b1-bfe4-abb7b83b2e59',
    })
  })

  it('keeps precise artifact, permanent, token, and legendary locators', () => {
    const ids = ['cr-rule-110-1', 'cr-rule-110-4', 'cr-rule-111-1', 'cr-rule-111-10a', 'cr-rule-704-5j', 'cr-rule-301-2', 'cr-rule-205-4']

    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id)).toEqual(ids)
  })

  it('keeps Azog controller, destroy, and indestructible locators precise', () => {
    const ids = ['cr-rule-109-5', 'cr-rule-701-8', 'cr-rule-702-12b']

    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id)).toEqual(ids)
    expect(sourceLocators.find((locator) => locator.id === 'hob-release-notes-azog')).toMatchObject({
      locatorType: 'card-specific-entry',
      cardOracleId: 'a8b018a7-0350-4ee0-9582-8d391018bdee',
    })
  })

  it('keeps precise stack, priority, activated, and static ability locators', () => {
    const ids = [
      'cr-rule-113-3b',
      'cr-rule-113-3d',
      'cr-rule-117-1',
      'cr-rule-117-2e',
      'cr-rule-117-3d',
      'cr-rule-117-7',
      'cr-rule-405-1',
      'cr-rule-405-2',
      'cr-rule-405-5',
      'cr-rule-405-6b',
      'cr-rule-602-1',
      'cr-rule-602-2',
      'cr-rule-604-1',
      'cr-rule-604-2',
    ]

    expect(
      sourceLocators
        .filter((locator) => ids.includes(locator.id))
        .map((locator) => locator.id),
    ).toEqual(ids)
  })

  it('keeps precise zone, state-based action, and wording locators', () => {
    const ids = [
      'cr-rule-400-1',
      'cr-rule-400-2',
      'cr-rule-400-7',
      'cr-rule-400-7j',
      'cr-rule-403-1',
      'cr-rule-404-1',
      'cr-rule-406-1',
      'cr-rule-608-3a',
      'cr-rule-117-5',
      'cr-rule-704-3',
      'cr-rule-704-5f',
    ]

    expect(
      sourceLocators
        .filter((locator) => ids.includes(locator.id))
        .map((locator) => locator.id),
    ).toEqual(ids)
  })

  it('keeps precise Recruit draw, discard, and impossible-action locators', () => {
    const ids = [
      'cr-rule-101-3',
      'cr-rule-121-1',
      'cr-rule-121-4',
      'cr-rule-121-6',
      'cr-rule-701-9a',
    ]

    expect(
      sourceLocators
        .filter((locator) => ids.includes(locator.id))
        .map((locator) => locator.id),
    ).toEqual(ids)
  })

  it('keeps precise replacement-effect and modified draw/discard locators', () => {
    const ids = [
      'cr-rule-121-2',
      'cr-rule-121-5',
      'cr-rule-121-7',
      'cr-rule-701-9b',
      'cr-rule-701-9c',
      'cr-rule-614-1',
      'cr-rule-614-4',
      'cr-rule-614-5',
      'cr-rule-614-6',
      'cr-rule-614-11',
      'cr-rule-614-16',
      'cr-rule-616-1',
      'cr-rule-616-2',
    ]

    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id)).toEqual(ids)
  })

  it('keeps the precise operative Amass locator', () => {
    expect(
      sourceLocators.find((locator) => locator.id === 'cr-rule-701-47a'),
    ).toMatchObject({
      sourceId: 'magic-comprehensive-rules',
      locatorType: 'rule-number',
      label: 'Rule 701.47a — Amass a subtype',
    })
    expect(
      sourceLocators.find((locator) => locator.id === 'cr-rule-704-4'),
    ).toMatchObject({
      sourceId: 'magic-comprehensive-rules',
      locatorType: 'rule-number',
    })
  })

  it('keeps precise Saga chapter, lore-counter, and sacrifice locators', () => {
    const ids = ['cr-rule-714-2', 'cr-rule-714-3', 'cr-rule-714-4']
    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id)).toEqual(ids)
  })

  it("keeps precise Bard's Company casting and mana-ability locators", () => {
    const ids = ['cr-rule-601-2', 'cr-rule-601-3d', 'cr-rule-601-6a', 'cr-rule-605-3a', 'cr-rule-702-8a']
    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id)).toEqual(ids)
  })

  it('keeps precise attack-event and per-event trigger locators', () => {
    const ids = ['cr-rule-508-1m', 'cr-rule-603-2c']
    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id).sort()).toEqual(ids)
  })

  it('keeps precise lasting-animation and power/toughness locators', () => {
    const ids = ['cr-rule-205-1b', 'cr-rule-208-3', 'cr-rule-611-2a', 'cr-rule-613-1', 'cr-rule-613-4b']
    expect(sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id).sort()).toEqual([...ids].sort())
  })

  it('keeps the resolved-effect affected-set locator precise', () => {
    expect(sourceLocators.find((locator) => locator.id === 'cr-rule-611-2c')).toMatchObject({
      sourceId: 'magic-comprehensive-rules',
      locatorType: 'rule-number',
      label: 'Rule 611.2c — Objects affected by resolving continuous effects',
    })
  })

  it('keeps precise sacrifice, LKI, reflexive-trigger, and excess-damage locators', () => {
    const ids = [
      'cr-rule-701-21a',
      'cr-rule-603-12',
      'cr-rule-120-4a',
      'cr-rule-120-6',
      'cr-rule-120-10',
    ]

    expect(
      sourceLocators.filter((locator) => ids.includes(locator.id)).map((locator) => locator.id),
    ).toEqual(ids)
  })

  it('keeps the Dwalin resolution-information locator precise', () => {
    expect(
      sourceLocators.find((locator) => locator.id === 'cr-rule-608-2h'),
    ).toMatchObject({
      sourceId: 'magic-comprehensive-rules',
      locatorType: 'rule-number',
      label: 'Rule 608.2h — Determining game-state information on resolution',
    })
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
