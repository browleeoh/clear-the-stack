import { describe, expect, it } from 'vitest'
import {
  catalogCards,
  getCardContentBySlug,
  getCatalogCard,
  getCatalogCardBySlug,
  getRelatedCatalogCards,
} from '@/content/catalog'
import {
  cards,
  concepts,
  getConcept,
  resolveSourceReference,
} from '@/content/data'
import { searchContent, searchEntries } from '@/lib/search'
import { turnStructurePhases, turnStructureSourceIds } from '@/routes/learn/turn-structure'
import { castingSourceIds, castingSteps } from '@/routes/learn/casting-resolution'
import { combatSourceIds, combatSteps } from '@/routes/learn/combat'
import { coreConceptSections, coreConceptSourceIds } from '@/routes/learn/core-concepts'
import {
  getSearchDestination,
  getSearchStatus,
  groupSearchResults,
  parseRecentSearches,
  searchPopupOptions,
  updateRecentSearches,
} from '@/components/search-experience'
import {
  addSelectedSearch,
  addUnansweredSearch,
  parseLocalTestLog,
  updateLookupFeedback,
  serializeLocalTestLog,
} from '@/lib/local-test-log'

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

  it('derives related curated cards from their existing stable concept IDs', () => {
    expect(getRelatedCatalogCards('storied').map((card) => card.slug)).toContain('thorin-oakenshield')
    expect(getConcept('storied')?.relatedConceptIds).toContain('legendary-permanent')
  })
})

describe('verified content', () => {
  it('keeps the verified Turn Structure Learn outline and sources complete', () => {
    expect(turnStructurePhases.map((phase) => phase.title)).toEqual(['1. Beginning phase', '2. First main phase', '3. Combat phase', '4. Second main phase', '5. Ending phase'])
    expect(turnStructureSourceIds).toEqual(['cr-rule-500-1', 'cr-rule-501-1', 'cr-rule-505-6', 'cr-rule-506-1', 'cr-rule-512-1'])
    expect(turnStructureSourceIds.every((sourceId) => resolveSourceReference(sourceId))).toBe(true)
  })

  it('discovers Turn Structure from beginner timing questions', () => {
    expect(searchContent('untap upkeep draw combat cleanup order')[0]).toMatchObject({ title: 'Turn structure', href: '/learn/turn-structure' })
  })

  it('keeps the verified casting and resolution Learn outline and sources complete', () => {
    expect(castingSteps.map(([title]) => title)).toEqual(['1. Put the spell on the stack', '2. Make its choices', '3. Work out and pay the cost', '4. Give players a chance to respond', '5. Resolve the top object', '6. Put it in the right place'])
    expect(castingSourceIds.every((sourceId) => resolveSourceReference(sourceId))).toBe(true)
  })

  it('discovers casting and resolution from beginner questions', () => {
    expect(searchContent('pay mana choose targets respond resolve spell')[0]).toMatchObject({ title: 'Casting and resolving a spell', href: '/learn/casting-resolution' })
  })

  it('keeps the verified attacking and blocking Learn outline and sources complete', () => {
    expect(combatSteps.map(([title]) => title)).toEqual(['1. Begin combat', '2. Declare attackers', '3. Handle attack triggers and responses', '4. Declare blockers', '5. Handle block triggers and responses', '6. Deal combat damage', '7. End combat'])
    expect(combatSourceIds.every((sourceId) => resolveSourceReference(sourceId))).toBe(true)
  })

  it('discovers attacking and blocking from beginner questions', () => {
    expect(searchContent('when can I respond after blockers combat damage')[0]).toMatchObject({ title: 'Attacking and blocking', href: '/learn/combat' })
  })

  it('keeps the verified core-concepts Learn outline and sources complete', () => {
    expect(coreConceptSections.map(([title]) => title)).toEqual(['1. Token', '2. Counter', '3. Target', '4. Stack', '5. Priority'])
    expect(coreConceptSourceIds.every((sourceId) => resolveSourceReference(sourceId))).toBe(true)
    expect(['token', 'counter', 'target', 'stack', 'priority'].every((id) => getConcept(id)?.verificationStatus === 'verified')).toBe(true)
  })

  it('discovers core concepts from beginner questions', () => {
    const result = searchContent('is a counter a permanent who responds last in first out')[0]
    expect(result).toMatchObject({ title: 'Tokens, counters, targets, stack, and priority', href: '/learn/core-concepts' })
    expect(getSearchDestination(result)).toEqual({ to: '/learn/core-concepts', params: {} })
  })

  it('merges curated Thorin guidance by stable card ID', () => {
    const curatedThorin = cards.find((card) => card.id === 'thorin-oakenshield')
    const content = getCardContentBySlug('thorin-oakenshield')

    expect(curatedThorin?.summary).toContain('storied requirement')
    expect(curatedThorin?.scenarios).toHaveLength(1)
    expect(content?.catalogCard.id).toBe(curatedThorin?.oracleId)
    expect(content?.enrichment).toBe(curatedThorin)
    expect(content?.catalogCard).not.toHaveProperty('summary')
  })

  it('merges curated Dwalin guidance by stable Oracle UUID and route slug', () => {
    const curatedDwalin = cards.find((card) => card.id === 'dwalin-weaponmaster')
    const content = getCardContentBySlug('dwalin-weaponmaster')

    expect(curatedDwalin).toMatchObject({
      oracleId: 'cee583b7-7cc3-40ea-a227-b760839ec291',
      verificationStatus: 'verified',
      conceptIds: [
        'hone-counters',
        'counter',
        'equipment',
        'attachment',
        'triggered-ability',
      ],
    })
    expect(content?.catalogCard.slug).toBe('dwalin-weaponmaster')
    expect(content?.catalogCard.id).toBe(curatedDwalin?.oracleId)
    expect(content?.enrichment).toBe(curatedDwalin)
    expect(curatedDwalin?.scenarios.map((scenario) => scenario.id)).toEqual([
      'dwalin-each-equipment',
      'dwalin-repeated-triggers',
      'dwalin-unattached-equipment',
      'dwalin-move-equipment',
      'dwalin-equipment-loses-abilities',
    ])
    expect(
      curatedDwalin?.scenarios.every(
        (scenario) =>
          scenario.verificationStatus === 'verified' &&
          scenario.reviewedAt === '2026-08-23',
      ),
    ).toBe(true)
  })

  it('merges curated Sting guidance by stable Oracle UUID and route slug', () => {
    const curatedSting = cards.find((card) => card.id === 'sting-bilbo-s-sword')
    const content = getCardContentBySlug('sting-bilbo-s-sword')

    expect(curatedSting).toMatchObject({
      oracleId: '9779f32c-b1a2-42a3-8e78-14c28c3ad254',
      verificationStatus: 'verified',
      conceptIds: [
        'hone-counters',
        'counter',
        'equipment',
        'attachment',
        'triggered-ability',
        'target',
        'resolution',
      ],
    })
    expect(content?.catalogCard.slug).toBe('sting-bilbo-s-sword')
    expect(content?.catalogCard.id).toBe(curatedSting?.oracleId)
    expect(content?.enrichment).toBe(curatedSting)
    expect(curatedSting?.scenarios.map((scenario) => scenario.id)).toEqual([
      'sting-normal-enter-resolution',
      'sting-choose-no-creature',
      'sting-creature-target-illegal',
      'sting-opponent-target-illegal',
      'sting-all-targets-illegal',
      'sting-move-later',
    ])
    expect(
      curatedSting?.scenarios.every(
        (scenario) =>
          scenario.verificationStatus === 'verified' &&
          scenario.reviewedAt === '2026-08-23',
      ),
    ).toBe(true)
  })

  it('merges curated Celebrate guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find(
      (card) => card.id === 'celebrate-the-mountain-king',
    )
    const content = getCardContentBySlug('celebrate-the-mountain-king')

    expect(curated).toMatchObject({
      oracleId: 'd51136fa-3c13-48a5-83fd-51fe00010a4b',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['recruit', 'zones', 'attachment']),
    })
    expect(content?.catalogCard.slug).toBe('celebrate-the-mountain-king')
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'celebrate-order-enter-triggers',
      'celebrate-leaves-before-exile',
      'celebrate-exiles-token',
      'celebrate-exiles-attached-permanent',
      'celebrate-return-is-immediate',
    ])
    expect(
      curated?.scenarios.every(
        (scenario) =>
          scenario.verificationStatus === 'verified' &&
          scenario.reviewedAt === '2026-08-23',
      ),
    ).toBe(true)
  })

  it('merges curated Azog guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'azog-moria-s-ruin')
    const content = getCardContentBySlug('azog-moria-s-ruin')

    expect(curated).toMatchObject({
      oracleId: 'a8b018a7-0350-4ee0-9582-8d391018bdee',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['amass-goblins', 'target', 'resolution', 'last-known-information']),
    })
    expect(content?.catalogCard.slug).toBe('azog-moria-s-ruin')
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'azog-opponent-creature',
      'azog-own-creature',
      'azog-no-target',
      'azog-illegal-target',
      'azog-indestructible-target',
      'azog-power-includes-counters',
    ])
    expect(curated?.scenarios.every((scenario) =>
      scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23',
    )).toBe(true)
  })

  it('merges curated Bolg guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'bolg-of-the-north')
    const content = getCardContentBySlug('bolg-of-the-north')

    expect(curated).toMatchObject({
      oracleId: '88522a0f-5377-4522-97f4-4148bef954af',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['sacrifice', 'last-known-information', 'reflexive-triggered-ability', 'excess-damage', 'amass-goblins']),
    })
    expect(content?.catalogCard.slug).toBe('bolg-of-the-north')
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'bolg-first-response-window',
      'bolg-second-response-window',
      'bolg-only-this-sacrifice',
      'bolg-last-known-power',
      'bolg-excess-calculation',
      'bolg-marked-damage',
      'bolg-illegal-damage-target',
    ])
    expect(curated?.scenarios.every((scenario) =>
      scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23',
    )).toBe(true)
  })

  it('merges curated Nasty Little Rabbit guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'nasty-little-rabbit')
    const content = getCardContentBySlug('nasty-little-rabbit')

    expect(curated).toMatchObject({
      oracleId: 'ee86cce6-c7c1-40a6-896b-cde9b86bb532',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['ferocious', 'intervening-if', 'priority', 'resolution', 'counter']),
    })
    expect(content?.catalogCard.slug).toBe('nasty-little-rabbit')
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'nasty-condition-true-twice',
      'nasty-false-at-combat-start',
      'nasty-creature-appears-late',
      'nasty-condition-lost-before-resolution',
      'nasty-different-creature-qualifies',
      'nasty-counts-itself-at-power-four',
    ])
    expect(curated?.scenarios.every((scenario) =>
      scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23',
    )).toBe(true)
  })

  it('merges curated Silvan Reveler guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'silvan-reveler')
    const content = getCardContentBySlug('silvan-reveler')

    expect(curated).toMatchObject({
      oracleId: '11932191-4b19-49b1-bfe4-abb7b83b2e59',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['landfall', 'this-way', 'zones', 'priority', 'resolution']),
    })
    expect(content?.catalogCard.slug).toBe('silvan-reveler')
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'silvan-draw-then-discard',
      'silvan-discard-land-return-tapped',
      'silvan-returned-land-triggers-landfall',
      'silvan-own-landfall-graveyard-only',
      'silvan-does-not-trigger-on-battlefield',
      'silvan-pay-during-resolution',
    ])
    expect(curated?.scenarios.every((scenario) =>
      scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23',
    )).toBe(true)
  })

  it('merges curated Bifur guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'bifur-melodic-rider')
    const content = getCardContentBySlug('bifur-melodic-rider')

    expect(curated).toMatchObject({
      oracleId: 'b8d563e4-e2bc-4e8b-8841-6655beff9138',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['storied', 'triggered-ability', 'static-ability', 'target', 'artifact', 'legendary-permanent']),
    })
    expect(content?.catalogCard.slug).toBe('bifur-melodic-rider')
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'bifur-enters-earns-story',
      'bifur-enters-without-story',
      'bifur-independent-targets',
      'bifur-one-target-illegal',
      'bifur-attacks-with-story',
      'bifur-leaves-after-triggers',
    ])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('merges curated Balin guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'balin-loremaster')
    const content = getCardContentBySlug('balin-loremaster')

    expect(curated).toMatchObject({
      oracleId: '0d420e41-43e9-41d6-832c-5a9f410c994e',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['storied', 'discard', 'draw', 'this-way', 'resolution']),
    })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'balin-decline-discard',
      'balin-empty-hand',
      'balin-discard-three-with-story',
      'balin-discard-three-without-story',
      'balin-choice-during-resolution',
      'balin-story-earned-before-resolution',
    ])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('exposes Balin enrichment through search', () => {
    expect(searchContent('Balin discard empty hand')[0]).toMatchObject({ title: 'Balin, Loremaster', href: '/cards/balin-loremaster' })
  })

  it('merges curated Bard, King of Dale guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'bard-king-of-dale')
    const content = getCardContentBySlug('bard-king-of-dale')

    expect(curated).toMatchObject({
      oracleId: 'd05db2c1-a19a-4803-8e8a-fa2f9b798181',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['replacement-effect', 'draw', 'recruit', 'amass-goblins', 'state-based-actions']),
    })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'bard-first-draw-step-draw',
      'bard-recruit-draw-and-token',
      'bard-multiple-draw-replacements',
      'bard-two-bards-cumulative',
      'bard-multiple-token-kinds',
      'bard-amass-two-armies',
      'bard-amass-existing-army',
    ])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('merges curated Bard the Bowman guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'bard-the-bowman')
    const content = getCardContentBySlug('bard-the-bowman')

    expect(curated).toMatchObject({
      oracleId: 'ec076f5b-b0e3-4b6f-9293-a8fc42f20bd8',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['draw', 'triggered-ability', 'target', 'stack', 'recruit', 'token']),
    })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'bard-bowman-enters-after-first-draw',
      'bard-bowman-misses-second-draw',
      'bard-bowman-leaves-before-second',
      'bard-bowman-recruit-soldier-target',
      'bard-bowman-recruit-no-soldier',
      'bard-bowman-draw-two-sequence',
      'bard-bowman-target-illegal',
    ])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it("merges curated Bard's Company guidance by stable Oracle UUID and route slug", () => {
    const curated = cards.find((card) => card.id === 'bard-s-company')
    const content = getCardContentBySlug('bard-s-company')

    expect(curated).toMatchObject({
      oracleId: '5c5bfbb2-0e63-4e43-b441-c4878983288f',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['recruit', 'static-ability', 'triggered-ability', 'stack', 'token']),
    })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'bards-company-cast-with-human',
      'bards-company-no-human',
      'bards-company-sacrifice-human-for-mana',
      'bards-company-human-lost-in-response',
      'bards-company-enter-recruit',
      'bards-company-attack-recruit',
      'bards-company-soldier-bonus',
    ])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('merges curated Queen of Dale guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'the-queen-of-dale')
    const content = getCardContentBySlug('the-queen-of-dale')

    expect(curated).toMatchObject({
      oracleId: 'a2ec1dd0-86c7-423d-b562-ed95b79bf8f7',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['recruit', 'triggered-ability', 'stack', 'priority', 'resolution']),
    })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'queen-first-noncreature-after-entry',
      'queen-earlier-spell-before-entry',
      'queen-creature-spells-do-not-count',
      'queen-second-noncreature-same-opponent',
      'queen-separate-opponents',
      'queen-mixed-preentry-opponents',
      'queen-trigger-response-window',
    ])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('merges curated Chief Warg guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'the-chief-warg')
    const content = getCardContentBySlug('the-chief-warg')

    expect(curated).toMatchObject({
      oracleId: '5ebe8de1-aa3d-410d-b43d-1685259c7a97',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['ferocious', 'triggered-ability', 'stack', 'resolution', 'draw']),
    })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'chief-warg-condition-true-at-attack',
      'chief-warg-power-drops-after-trigger',
      'chief-warg-condition-false-at-attack',
      'chief-warg-stays-back',
      'chief-warg-many-attackers-one-trigger',
      'chief-warg-extra-combat',
      'chief-warg-resolution-order',
    ])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it("merges curated Beorn's Hospitality guidance by stable Oracle UUID and route slug", () => {
    const curated = cards.find((card) => card.id === 'beorn-s-hospitality')
    const content = getCardContentBySlug('beorn-s-hospitality')

    expect(curated).toMatchObject({
      oracleId: 'd9ed7252-11d1-432b-9101-ac08cd28826d',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['landfall', 'activated-ability', 'target', 'counter', 'resolution']),
    })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'beorns-landfall-target-counter',
      'beorns-landfall-target-illegal',
      'beorns-transformation-retains-types',
      'beorns-transformation-persists',
      'beorns-power-follows-land-count',
      'beorns-animation-not-landfall',
      'beorns-transformed-self-target',
      'beorns-leaves-and-returns',
    ])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('merges curated Down in the Valley guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'down-in-the-valley')
    const content = getCardContentBySlug('down-in-the-valley')

    expect(curated).toMatchObject({
      oracleId: 'e3491542-569e-48a8-b625-fa7c4aa2792a',
      verificationStatus: 'verified',
      conceptIds: expect.arrayContaining(['landfall', 'saga', 'triggered-ability', 'token', 'counter']),
    })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual([
      'down-chapter-one-land-to-hand',
      'down-chapter-two-pending',
      'down-chapter-two-gains-landfall',
      'down-later-land-creates-elf',
      'down-multiple-lands-multiple-elves',
      'down-chapter-three-buffs-current-elves',
      'down-later-elf-not-buffed',
      'down-final-chapter-sacrifice-timing',
    ])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('merges curated Dancing from Dark to Dawn guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'dancing-from-dark-to-dawn')
    const content = getCardContentBySlug('dancing-from-dark-to-dawn')
    expect(curated).toMatchObject({ oracleId: '5ba482e9-fbb0-4d9f-a3a9-414892bcdfed', verificationStatus: 'verified', conceptIds: expect.arrayContaining(['landfall', 'triggered-ability', 'target', 'counter', 'token']) })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual(['dancing-cast-trigger-before-spell', 'dancing-spell-cannot-target-itself', 'dancing-invalid-target-spell-continues', 'dancing-mana-value-fixed-cost', 'dancing-x-spell-mana-value', 'dancing-creature-enters-not-cast', 'dancing-landfall-bear-independent'])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('merges curated Goblin Plate Mail guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'goblin-plate-mail')
    const content = getCardContentBySlug('goblin-plate-mail')
    expect(curated).toMatchObject({ oracleId: 'eda99a16-6a7c-4f39-8a6b-a284e6afd3fc', verificationStatus: 'verified', conceptIds: expect.arrayContaining(['amass-goblins', 'equipment', 'attachment', 'counter']) })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual(['plate-mail-no-army-create-attach', 'plate-mail-existing-army', 'plate-mail-multiple-armies', 'plate-mail-uninterrupted-resolution', 'plate-mail-attach-no-equip-cost', 'plate-mail-illegal-attachment', 'plate-mail-equip-later'])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('merges curated Rhovanion Rampager guidance by stable Oracle UUID and route slug', () => {
    const curated = cards.find((card) => card.id === 'rhovanion-rampager')
    const content = getCardContentBySlug('rhovanion-rampager')
    expect(curated).toMatchObject({ oracleId: '008a11c1-d283-49fe-abd7-ff4fe8b1fe79', verificationStatus: 'verified', conceptIds: expect.arrayContaining(['sacrifice', 'last-known-information', 'amass-goblins', 'counter']) })
    expect(content?.catalogCard.id).toBe(curated?.oracleId)
    expect(content?.enrichment).toBe(curated)
    expect(curated?.scenarios.map((scenario) => scenario.id)).toEqual(['rampager-attack-sacrifice-choice', 'rampager-sacrificed-power-lki', 'rampager-sacrificed-counters-count', 'rampager-sacrificed-nonpositive-power', 'rampager-decline-sacrifice', 'rampager-dies-base-power', 'rampager-dies-with-counters', 'rampager-death-trigger-response'])
    expect(curated?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
  })

  it('keeps at least twenty curated verified card records after Phase B', () => {
    expect(cards.filter((card) => card.verificationStatus === 'verified').length).toBeGreaterThanOrEqual(20)
  })

  it('exposes Rhovanion Rampager enrichment through search', () => {
    expect(searchContent('Rampager sacrificed power counters death amass X')[0]).toMatchObject({ title: 'Rhovanion Rampager', href: '/cards/rhovanion-rampager' })
  })

  it('exposes Goblin Plate Mail enrichment through search', () => {
    expect(searchContent('Goblin Plate Mail same amassed Army no equip cost')[0]).toMatchObject({ title: 'Goblin Plate Mail', href: '/cards/goblin-plate-mail' })
  })

  it('exposes Dancing from Dark to Dawn enrichment through search', () => {
    expect(searchContent('Dancing X creature spell Bear independent')[0]).toMatchObject({ title: 'Dancing from Dark to Dawn', href: '/cards/dancing-from-dark-to-dawn' })
  })

  it('exposes Down in the Valley enrichment through search', () => {
    expect(searchContent('Down Valley gains Landfall later Elf final chapter')[0]).toMatchObject({ title: 'Down in the Valley', href: '/cards/down-in-the-valley' })
  })

  it("exposes Beorn's Hospitality enrichment through search", () => {
    expect(searchContent('Beorns Hospitality lasting Bear land count')[0]).toMatchObject({ title: "Beorn's Hospitality", href: '/cards/beorn-s-hospitality' })
  })

  it('exposes Chief Warg enrichment through search', () => {
    expect(searchContent('Chief Warg power drops no recheck')[0]).toMatchObject({ title: 'The Chief Warg', href: '/cards/the-chief-warg' })
  })

  it('exposes Queen of Dale enrichment through search', () => {
    expect(searchContent('Queen separate opponents first noncreature')[0]).toMatchObject({ title: 'The Queen of Dale', href: '/cards/the-queen-of-dale' })
  })

  it("exposes Bard's Company enrichment through search", () => {
    expect(searchContent('Bards Company sacrifice Human mana')[0]).toMatchObject({ title: "Bard's Company", href: '/cards/bard-s-company' })
  })

  it('exposes Bard the Bowman enrichment through search', () => {
    expect(searchContent('Bard second draw Soldier target')[0]).toMatchObject({ title: 'Bard the Bowman', href: '/cards/bard-the-bowman' })
  })

  it('exposes Bard, King of Dale enrichment through search', () => {
    expect(searchContent('Bard two Armies 0/0')[0]).toMatchObject({ title: 'Bard, King of Dale', href: '/cards/bard-king-of-dale' })
  })

  it('exposes Bifur enrichment through search', () => {
    expect(searchContent('Bifur separate targets')[0]).toMatchObject({
      title: 'Bifur, Melodic Rider',
      href: '/cards/bifur-melodic-rider',
    })
  })

  it('exposes Silvan Reveler enrichment through search', () => {
    expect(searchContent('Silvan graveyard only')[0]).toMatchObject({
      title: 'Silvan Reveler',
      href: '/cards/silvan-reveler',
    })
  })

  it('exposes Nasty Little Rabbit enrichment through search', () => {
    expect(searchContent('Rabbit creature appears late')[0]).toMatchObject({
      title: 'Nasty Little Rabbit',
      href: '/cards/nasty-little-rabbit',
    })
  })

  it('exposes Bolg enrichment through search', () => {
    expect(searchContent('Bolg different sacrifice')[0]).toMatchObject({
      title: 'Bolg of the North',
      href: '/cards/bolg-of-the-north',
    })
  })

  it('exposes Azog enrichment through search', () => {
    expect(searchContent('Azog nobody amasses')[0]).toMatchObject({
      title: "Azog, Moria's Ruin",
      href: '/cards/azog-moria-s-ruin',
    })
  })

  it('exposes Celebrate enrichment through search', () => {
    expect(searchContent('Celebrate attached Equipment')[0]).toMatchObject({
      title: 'Celebrate the Mountain-king',
      href: '/cards/celebrate-the-mountain-king',
    })
  })

  it('exposes Sting enrichment through search', () => {
    expect(searchContent('Sting choose no creature')[0]).toMatchObject({
      title: "Sting, Bilbo's Sword",
      href: '/cards/sting-bilbo-s-sword',
    })
  })

  it('exposes Dwalin enrichment through search', () => {
    expect(searchContent('Dwalin each Equipment')[0]).toMatchObject({
      title: 'Dwalin, Weaponmaster',
      href: '/cards/dwalin-weaponmaster',
    })
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

  it('publishes the verified Counter, Equipment, and Attachment foundations', () => {
    const expected = {
      counter: ['counter-not-a-token', 'counter-zone-change'],
      equipment: [
        'equipment-enters-unattached',
        'equipment-attach-without-equip',
      ],
      attachment: ['attachment-moves-equipment', 'attachment-illegal-object'],
    }

    for (const [id, scenarioIds] of Object.entries(expected)) {
      const concept = getConcept(id)
      expect(concept?.verificationStatus).toBe('verified')
      expect(concept?.scenarios.map((scenario) => scenario.id)).toEqual(
        scenarioIds,
      )
      expect(
        concept?.scenarios.every(
          (scenario) =>
            scenario.verificationStatus === 'verified' &&
            scenario.reviewedAt === '2026-08-23',
        ),
      ).toBe(true)
      expect(
        concept?.relatedConceptIds.every((relatedId) => getConcept(relatedId)),
      ).toBe(true)
    }
  })

  it('discovers the supporting concepts with beginner language', () => {
    expect(searchContent('counter vs token')[0]?.title).toBe('Counter')
    expect(searchContent('equipment vs equip')[0]?.title).toBe('Equipment')
    expect(searchContent('illegal attachment')[0]?.title).toBe('Attachment')
  })

  it('publishes the verified Triggered Ability, Target, and Resolution foundations', () => {
    const expected = {
      'triggered-ability': ['trigger-effect-waits', 'trigger-source-leaves'],
      target: ['target-triggered-ability-choice', 'target-up-to-one-none'],
      resolution: [
        'resolution-all-targets-illegal',
        'resolution-one-target-illegal',
      ],
    }

    for (const [id, scenarioIds] of Object.entries(expected)) {
      const concept = getConcept(id)
      expect(concept?.verificationStatus).toBe('verified')
      expect(concept?.scenarios.map((scenario) => scenario.id)).toEqual(
        scenarioIds,
      )
      expect(
        concept?.scenarios.every(
          (scenario) =>
            scenario.verificationStatus === 'verified' &&
            scenario.reviewedAt === '2026-08-23',
        ),
      ).toBe(true)
      expect(
        concept?.relatedConceptIds.every((relatedId) => getConcept(relatedId)),
      ).toBe(true)
    }
  })

  it('discovers interaction concepts with beginner language', () => {
    expect(searchContent('trigger vs effect')[0]?.title).toBe(
      'Triggered Ability',
    )
    expect(searchContent('choose no creature')[0]?.title).toBe('Target')
    expect(searchContent('partial resolution')[0]?.title).toBe('Resolution')
  })

  it('publishes the verified stack, priority, and ability foundations', () => {
    const expected = {
      stack: ['stack-response-resolves-first', 'stack-one-object-at-a-time'],
      priority: [
        'priority-respond-before-resolution',
        'priority-action-restarts-passing',
      ],
      'activated-ability': [
        'activated-cost-paid-first',
        'activated-source-leaves',
      ],
      'static-ability': ['static-no-response-window', 'static-source-leaves'],
    }

    for (const [id, scenarioIds] of Object.entries(expected)) {
      const concept = getConcept(id)
      expect(concept?.verificationStatus).toBe('verified')
      expect(concept?.scenarios.map((scenario) => scenario.id)).toEqual(
        scenarioIds,
      )
      expect(
        concept?.scenarios.every(
          (scenario) =>
            scenario.verificationStatus === 'verified' &&
            scenario.reviewedAt === '2026-08-23',
        ),
      ).toBe(true)
      expect(
        concept?.relatedConceptIds.every((relatedId) => getConcept(relatedId)),
      ).toBe(true)
    }
  })

  it('discovers stack and ability concepts with beginner language', () => {
    expect(searchContent('what resolves first')[0]?.title).toBe('Stack')
    expect(searchContent('can I respond')[0]?.title).toBe(
      'Priority and Responding',
    )
    expect(searchContent('cost colon effect')[0]?.title).toBe(
      'Activated Ability',
    )
    expect(searchContent('always on ability')[0]?.title).toBe('Static Ability')
  })

  it('publishes artifact, legendary permanent, permanent, and token foundations', () => {
    const expected = {
      artifact: ['artifact-token-counts', 'artifact-creature-counts-once', 'artifact-color-independent'],
      'legendary-permanent': ['legendary-artifact-overlap', 'legendary-card-off-battlefield', 'legend-rule-same-controller-name'],
      permanent: ['permanent-battlefield-only', 'permanent-multiple-types-one-object'],
      token: ['token-is-permanent-not-card', 'token-characteristics-qualify'],
    }

    for (const [id, scenarioIds] of Object.entries(expected)) {
      const concept = getConcept(id)
      expect(concept?.verificationStatus).toBe('verified')
      expect(concept?.scenarios.map((scenario) => scenario.id)).toEqual(scenarioIds)
      expect(concept?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
      expect(concept?.relatedConceptIds.every((relatedId) => getConcept(relatedId))).toBe(true)
    }
  })

  it('discovers artifact and legendary permanent questions', () => {
    expect(searchContent('does treasure count as artifact')[0]?.title).toBe('Artifact')
    expect(searchContent('same named legendary permanents')[0]?.title).toBe('Legendary Permanent')
  })

  it('publishes the minimum verified Saga and lore-counter foundation', () => {
    const saga = getConcept('saga')

    expect(saga).toMatchObject({ kind: 'object', verificationStatus: 'verified' })
    expect(saga?.scenarios.map((scenario) => scenario.id)).toEqual([
      'saga-enters-chapter-one',
      'saga-precombat-lore-action',
      'saga-effect-adds-lore',
      'saga-crosses-multiple-chapters',
      'saga-final-chapter-sacrifice',
      'saga-leaves-chapter-remains',
    ])
    expect(saga?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
    expect(saga?.relatedConceptIds.every((relatedId) => getConcept(relatedId))).toBe(true)
  })

  it('discovers Saga timing and lore-counter questions', () => {
    expect(searchContent('final chapter sacrifice')[0]?.title).toBe('Saga')
    expect(searchContent('lore counter precombat main')[0]?.title).toBe('Saga')
  })

  it('publishes replacement-effect, draw, and discard foundations', () => {
    const expected = {
      'replacement-effect': ['replacement-original-event-never-happens', 'replacement-must-exist-first', 'replacement-multiple-effects', 'replacement-no-self-loop'],
      draw: ['draw-multiple-one-at-time', 'draw-put-into-hand', 'draw-replaced-in-sequence'],
      discard: ['discard-affected-player-chooses', 'discard-hidden-zone-characteristics', 'discard-impossible-continue'],
    }

    for (const [id, scenarioIds] of Object.entries(expected)) {
      const concept = getConcept(id)
      expect(concept?.verificationStatus).toBe('verified')
      expect(concept?.scenarios.map((scenario) => scenario.id)).toEqual(scenarioIds)
      expect(concept?.scenarios.every((scenario) => scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23')).toBe(true)
      expect(concept?.relatedConceptIds.every((relatedId) => getConcept(relatedId))).toBe(true)
    }
  })

  it('discovers replacement, draw, and discard questions', () => {
    expect(searchContent('affected player chooses replacement')[0]?.title).toBe('Replacement Effect')
    expect(searchContent('draw multiple cards one at a time')[0]?.title).toBe('Draw')
    expect(searchContent('discard into hidden zone')[0]?.title).toBe('Discard')
  })

  it('publishes the verified zones, state-based actions, and wording foundations', () => {
    const expected = {
      zones: [
        'zones-permanent-spell-to-battlefield',
        'zones-leave-and-return-new-object',
      ],
      'state-based-actions': [
        'sba-zero-toughness-before-response',
        'sba-repeat-until-clear',
      ],
      'this-way': ['this-way-recruit-own-discard', 'this-way-different-discard', 'this-way-discarded-land-return'],
      'and-or': ['and-or-different-qualities', 'and-or-one-object-once'],
    }

    for (const [id, scenarioIds] of Object.entries(expected)) {
      const concept = getConcept(id)
      expect(concept?.verificationStatus).toBe('verified')
      expect(concept?.scenarios.map((scenario) => scenario.id)).toEqual(
        scenarioIds,
      )
      expect(
        concept?.scenarios.every(
          (scenario) =>
            scenario.verificationStatus === 'verified' &&
            scenario.reviewedAt === '2026-08-23',
        ),
      ).toBe(true)
      expect(
        concept?.relatedConceptIds.every((relatedId) => getConcept(relatedId)),
      ).toBe(true)
    }
  })

  it('discovers zone, state-based action, and wording concepts', () => {
    expect(searchContent('zone change new object')[0]?.title).toBe('Zones')
    expect(searchContent('0 toughness creature dies')[0]?.title).toBe(
      'State-Based Actions',
    )
    expect(searchContent('discarded this way')[0]?.title).toBe('“This Way”')
    expect(searchContent('multiple qualities')[0]?.title).toBe('“And/Or”')
  })

  it('publishes the verified Recruit foundation with bounded cases', () => {
    const recruit = getConcept('recruit')

    expect(recruit).toMatchObject({
      kind: 'keyword-action',
      verificationStatus: 'verified',
      sourceIds: expect.arrayContaining([
        'cr-rule-701-70a',
        'hob-release-notes-recruit',
        'hob-mechanics-recruit',
      ]),
    })
    expect(recruit?.scenarios.map((scenario) => scenario.id)).toEqual([
      'recruit-nonland-happy-path',
      'recruit-land-no-token',
      'recruit-no-mid-resolution-response',
      'recruit-replaced-draw',
      'recruit-empty-library-or-no-discard',
    ])
    expect(
      recruit?.scenarios.every(
        (scenario) =>
          scenario.verificationStatus === 'verified' &&
          scenario.reviewedAt === '2026-08-23',
      ),
    ).toBe(true)
    expect(
      recruit?.relatedConceptIds.every((relatedId) => getConcept(relatedId)),
    ).toBe(true)
  })

  it('publishes the verified Amass Goblins foundation with bounded cases', () => {
    const amass = getConcept('amass-goblins')

    expect(amass).toMatchObject({
      kind: 'keyword-action',
      verificationStatus: 'verified',
      sourceIds: expect.arrayContaining([
        'cr-rule-701-47a',
        'hob-release-notes-amass',
        'hob-mechanics-amass',
      ]),
    })
    expect(amass?.scenarios.map((scenario) => scenario.id)).toEqual([
      'amass-create-first-army',
      'amass-existing-army',
      'amass-multiple-armies',
      'amass-adds-goblin-type',
      'amass-zero-toughness-window',
    ])
    expect(
      amass?.scenarios.every(
        (scenario) =>
          scenario.verificationStatus === 'verified' &&
          scenario.reviewedAt === '2026-08-23',
      ),
    ).toBe(true)
    expect(
      amass?.relatedConceptIds.every((relatedId) => getConcept(relatedId)),
    ).toBe(true)
  })

  it('discovers Amass Goblins from beginner questions', () => {
    expect(searchContent('multiple Armies')[0]?.title).toBe('Amass Goblins')
    expect(searchContent('zero toughness Army')[0]?.title).toBe('Amass Goblins')
  })

  it('publishes the verified Amass interaction foundations', () => {
    const expected = {
      sacrifice: ['sacrifice-not-destroy', 'sacrifice-during-resolution'],
      'last-known-information': [
        'lki-sacrificed-creature-power',
        'lki-includes-counters-and-effects',
      ],
      'reflexive-triggered-ability': [
        'reflexive-target-after-action',
        'reflexive-two-response-windows',
      ],
      'excess-damage': [
        'excess-basic-calculation',
        'excess-counts-marked-damage',
      ],
    }

    for (const [id, scenarioIds] of Object.entries(expected)) {
      const concept = getConcept(id)
      expect(concept?.verificationStatus).toBe('verified')
      expect(concept?.scenarios.map((scenario) => scenario.id)).toEqual(scenarioIds)
      expect(concept?.scenarios.every((scenario) =>
        scenario.verificationStatus === 'verified' &&
        scenario.reviewedAt === '2026-08-23',
      )).toBe(true)
      expect(concept?.relatedConceptIds.every((relatedId) => getConcept(relatedId))).toBe(true)
    }
  })

  it('discovers Amass interaction concepts with beginner language', () => {
    expect(searchContent('sacrifice vs destroy')[0]?.title).toBe('Sacrifice')
    expect(searchContent('creature left battlefield')[0]?.title).toBe('Last Known Information')
    expect(searchContent('two response windows')[0]?.title).toBe('Reflexive Triggered Ability')
    expect(searchContent('damage over lethal')[0]?.title).toBe('Excess Damage')
  })

  it('publishes the verified Ferocious and intervening-if foundations', () => {
    const expected = {
      ferocious: ['ferocious-ability-word-not-rule', 'ferocious-creature-counts-itself'],
      'intervening-if': [
        'intervening-if-false-at-event',
        'intervening-if-becomes-true-late',
        'intervening-if-false-on-resolution',
        'intervening-if-stays-true',
      ],
    }

    for (const [id, scenarioIds] of Object.entries(expected)) {
      const concept = getConcept(id)
      expect(concept?.verificationStatus).toBe('verified')
      expect(concept?.scenarios.map((scenario) => scenario.id)).toEqual(scenarioIds)
      expect(concept?.scenarios.every((scenario) =>
        scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23',
      )).toBe(true)
      expect(concept?.relatedConceptIds.every((relatedId) => getConcept(relatedId))).toBe(true)
    }
  })

  it('discovers Ferocious timing with beginner language', () => {
    expect(searchContent('ferocious power 4')[0]?.title).toBe('Ferocious')
    expect(searchContent('condition checks twice')[0]?.title).toBe('Intervening “If” Clause')
  })

  it('publishes the verified Landfall foundation with bounded cases', () => {
    const landfall = getConcept('landfall')

    expect(landfall).toMatchObject({
      kind: 'set-mechanic',
      verificationStatus: 'verified',
      sourceIds: expect.arrayContaining(['cr-rule-207-2c', 'cr-rule-305-4', 'cr-rule-603-6a', 'hob-release-notes-landfall']),
    })
    expect(landfall?.scenarios.map((scenario) => scenario.id)).toEqual([
      'landfall-play-land',
      'landfall-effect-puts-land',
      'landfall-permanent-becomes-land',
      'landfall-triggers-after-resolution',
      'landfall-multiple-triggers-order',
    ])
    expect(landfall?.scenarios.every((scenario) =>
      scenario.verificationStatus === 'verified' && scenario.reviewedAt === '2026-08-23',
    )).toBe(true)
    expect(landfall?.relatedConceptIds.every((relatedId) => getConcept(relatedId))).toBe(true)
  })

  it('discovers Landfall and land-return causality with beginner language', () => {
    expect(searchContent('put land onto battlefield')[0]?.title).toBe('Landfall')
    expect(searchContent('same discarded land')[0]?.title).toBe('“This Way”')
  })

  it('discovers Recruit from beginner questions', () => {
    expect(searchContent('draw discard token')[0]?.title).toBe('Recruit')
    expect(searchContent('respond during recruit')[0]?.title).toBe('Recruit')
    expect(searchContent('empty library recruit')[0]?.title).toBe('Recruit')
  })

  it('finds Thorin by partial name', () => {
    expect(searchContent('thorin')[0]?.title).toBe('Thorin Oakenshield')
  })
})

describe('catalog search', () => {
  const cardEntries = searchEntries.filter((entry) => entry.kind === 'card')
  const scenarioEntries = searchEntries.filter((entry) => entry.kind === 'scenario')

  it('indexes exactly 193 unique card entries alongside existing content', () => {
    expect(cardEntries).toHaveLength(193)
    expect(new Set(cardEntries.map((entry) => entry.id))).toHaveLength(193)
    expect(new Set(cardEntries.map((entry) => entry.slug))).toHaveLength(193)
    const scenarioCount = cards.flatMap((card) => card.scenarios).length
      + concepts.flatMap((concept) => concept.scenarios).length
    expect(scenarioEntries).toHaveLength(scenarioCount)
    expect(new Set(scenarioEntries.map((entry) => entry.id))).toHaveLength(scenarioCount)
    expect(searchEntries).toHaveLength(193 + concepts.length + scenarioCount + 4)
  })

  it('groups useful result types and links scenarios to exact sections', () => {
    const query = 'respond during recruit'
    const results = searchContent(query)
    const groups = groupSearchResults(results, query)
    expect(groups[0]?.label).toBe('Examples')

    const scenario = results.find((entry) => entry.kind === 'scenario')
    expect(scenario).toBeDefined()
    expect(getSearchDestination(scenario!)).toEqual({
      to: '/mechanics/$mechanicSlug',
      params: { mechanicSlug: 'recruit' },
      hash: scenario!.slug,
    })
  })

  it('keeps exact card and mechanic title matches visibly first', () => {
    const cardQuery = '  THORIN OAKENSHIELD '
    const cardGroups = groupSearchResults(searchContent(cardQuery), cardQuery)
    expect(cardGroups[0]?.label).toBe('Cards')
    expect(cardGroups[0]?.results[0]?.title).toBe('Thorin Oakenshield')

    const mechanicQuery = 'Storied'
    const mechanicGroups = groupSearchResults(searchContent(mechanicQuery), mechanicQuery)
    expect(mechanicGroups[0]?.label).toBe('Rules and mechanics')
    expect(mechanicGroups[0]?.results[0]?.title).toBe('Storied')
  })

  it('keeps requested Thorin and Bard partial-name lookups card-first', () => {
    for (const query of ['thorin oak', 'Thorin Oakenshield', 'Bard King']) {
      const groups = groupSearchResults(searchContent(query), query)
      expect(groups[0]?.label).toBe('Cards')
    }
    expect(groupSearchResults(searchContent('thorin oak'), 'thorin oak')[0]?.results[0]?.title).toBe('Thorin Oakenshield')
    expect(groupSearchResults(searchContent('Thorin Oakenshield'), 'Thorin Oakenshield')[0]?.results[0]?.title).toBe('Thorin Oakenshield')
    expect(groupSearchResults(searchContent('Bard King'), 'Bard King')[0]?.results[0]?.title).toBe('Bard, King of Dale')
  })

  it('shows partial card-name matches before scenarios', () => {
    const groups = groupSearchResults(searchContent('Bard King'), 'Bard King')
    expect(groups[0]?.label).toBe('Cards')
    expect(groups[0]?.results.map((result) => result.title)).toContain('Bard, King of Dale')
    expect(groups.findIndex((group) => group.label === 'Cards')).toBeLessThan(groups.findIndex((group) => group.label === 'Examples'))
  })

  it('keeps at most five deduplicated recent searches and ignores bad storage', () => {
    expect(updateRecentSearches(['two', 'one'], ' one ')).toEqual(['one', 'two'])
    expect(updateRecentSearches(['five', 'four', 'three', 'two', 'one'], 'six')).toEqual(['six', 'five', 'four', 'three', 'two'])
    expect(parseRecentSearches('["one",2,"three"]')).toEqual(['one', 'three'])
    expect(parseRecentSearches('{bad')).toEqual([])
  })

  it('keeps free-form lookup text and announces the available result state', () => {
    expect(getSearchStatus('', 0)).toBeNull()
    expect(getSearchStatus('how does fight work?', 0)).toBe('No matches available.')
    expect(getSearchStatus('thorin', 1)).toBe('1 result available.')
    expect(getSearchStatus('thorin', 2)).toBe('2 results available.')
  })

  it('uses a small start-aligned popup offset without horizontal collision shifts', () => {
    expect(searchPopupOptions).toEqual({
      align: 'start',
      sideOffset: 4,
      collisionAvoidance: { side: 'flip', align: 'none', fallbackAxisSide: 'none' },
    })
  })

  it('records normalized unanswered searches once without identity or game state', () => {
    const first = addUnansweredSearch([], '  unknown interaction  ', 'lookup-1', '2026-08-23T16:00:00.000Z')
    expect(first).toEqual({
      added: true,
      records: [{ id: 'lookup-1', query: 'unknown interaction', resultSelected: false, timestamp: '2026-08-23T16:00:00.000Z' }],
    })
    expect(addUnansweredSearch(first.records, 'UNKNOWN INTERACTION', 'lookup-2', '2026-08-23T17:00:00.000Z')).toEqual({ records: first.records, added: false })
    expect(first.records[0]).not.toHaveProperty('name')
    expect(first.records[0]).not.toHaveProperty('gameState')
  })

  it('recovers safely from malformed local test-log data', () => {
    expect(parseLocalTestLog('{bad')).toEqual([])
    expect(parseLocalTestLog('[{"id":"incomplete"}]')).toEqual([])
    expect(parseLocalTestLog('[{"id":"","query":"q","resultSelected":false,"timestamp":"2026-08-23T16:00:00.000Z"},{"id":"x","query":" ","resultSelected":false,"timestamp":"bad"}]')).toEqual([])
    expect(parseLocalTestLog('[{"id":"x","query":"q","resultSelected":true,"timestamp":"2026-08-23T16:00:00.000Z"}]')).toEqual([])
  })

  it('strips unknown identity and game-state fields from persisted records', () => {
    expect(parseLocalTestLog(JSON.stringify([{
      id: ' lookup-1 ',
      query: ' unknown interaction ',
      resultSelected: false,
      timestamp: '2026-08-23T16:00:00.000Z',
      name: 'Alice',
      gameState: 'secret board',
    }]))).toEqual([{
      id: 'lookup-1',
      query: 'unknown interaction',
      resultSelected: false,
      timestamp: '2026-08-23T16:00:00.000Z',
    }])
  })

  it('links selected results and later feedback to one privacy-bounded lookup', () => {
    const selected = {
      id: 'lookup-2',
      query: 'Storied',
      resultSelected: true,
      selectedResult: { id: 'concept:storied', title: 'Storied', href: '/mechanics/storied' },
      timestamp: '2026-08-23T16:30:00.000Z',
    }
    const records = addSelectedSearch([], selected)
    const updated = updateLookupFeedback(records, 'lookup-2', { helpful: false, report: 'unclear' })
    expect(updated).toEqual([{ ...selected, helpful: false, report: 'unclear' }])
    expect(parseLocalTestLog(JSON.stringify([{ ...updated[0], name: 'Alice', deck: 'Dwarves', gameState: 'hidden' }]))).toEqual(updated)
  })

  it('strips selection feedback from unanswered records', () => {
    expect(parseLocalTestLog(JSON.stringify([{
      id: 'lookup-3', query: 'unknown', resultSelected: false,
      timestamp: '2026-08-23T16:30:00.000Z', helpful: true, report: 'incorrect',
      selectedResult: { id: 'card:x', title: 'X', href: '/cards/x' },
    }]))).toEqual([{
      id: 'lookup-3', query: 'unknown', resultSelected: false,
      timestamp: '2026-08-23T16:30:00.000Z',
    }])
  })

  it('exports complete linked lookup records without adding private fields', () => {
    const records = parseLocalTestLog(JSON.stringify([{
      id: 'lookup-4', query: 'Storied', resultSelected: true,
      selectedResult: { id: 'concept:storied', title: 'Storied', href: '/mechanics/storied' },
      helpful: false, report: 'incorrect', timestamp: '2026-08-23T16:30:00.000Z',
      playerName: 'Alice', deck: 'Dwarves', gameState: 'secret',
    }]))
    const exported = JSON.parse(serializeLocalTestLog(records, '2026-08-23T17:00:00.000Z'))
    expect(exported).toEqual({ schemaVersion: 1, exportedAt: '2026-08-23T17:00:00.000Z', records })
    expect(exported.records[0]).toMatchObject({ query: 'Storied', resultSelected: true, helpful: false, report: 'incorrect' })
    expect(exported.records[0]).not.toHaveProperty('playerName')
    expect(exported.records[0]).not.toHaveProperty('deck')
    expect(exported.records[0]).not.toHaveProperty('gameState')
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
