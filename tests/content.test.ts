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
