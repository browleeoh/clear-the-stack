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
      'this-way': ['this-way-recruit-own-discard', 'this-way-different-discard'],
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
