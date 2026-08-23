import {
  cardSchema,
  contentDataSchema,
  conceptSchema,
  sourceSchema,
  sourceLocatorSchema,
  type Card,
  type Concept,
  type Source,
  type SourceLocator,
} from './schema'

const rawSources = [
  {
    id: 'magic-comprehensive-rules',
    title: 'Magic: The Gathering Comprehensive Rules',
    publisher: 'Wizards of the Coast',
    url: 'https://media.wizards.com/2026/downloads/MagicCompRules%2020260819.txt',
    sourceType: 'comprehensive-rules',
    retrievedAt: '2026-08-22',
    rulesEffectiveDate: '2026-08-07',
    version: 'MagicCompRules 20260819 text release',
  },
  {
    id: 'scryfall-hob-catalog',
    title: 'Scryfall Cards API — HOB Main-Set Catalog Query',
    publisher: 'Scryfall, LLC',
    url: 'https://api.scryfall.com/cards/search?q=e%3Ahob%20cn%3C%3D193&unique=prints&order=set',
    sourceType: 'oracle-text',
    retrievedAt: '2026-08-22',
  },
  {
    id: 'hob-release-notes',
    title: 'Magic: The Gathering | The Hobbit Release Notes',
    publisher: 'Wizards of the Coast',
    url: 'https://magic.wizards.com/en/news/feature/the-hobbit-release-notes',
    sourceType: 'release-notes',
    retrievedAt: '2026-08-22',
  },
  {
    id: 'hob-mechanics',
    title: 'Magic: The Gathering | The Hobbit Mechanics',
    publisher: 'Wizards of the Coast',
    url: 'https://magic.wizards.com/en/news/feature/the-hobbit-mechanics',
    sourceType: 'official-mechanics',
    retrievedAt: '2026-08-22',
  },
  {
    id: 'hob-update-bulletin',
    title: 'Magic: The Gathering | The Hobbit Update Bulletin',
    publisher: 'Wizards of the Coast',
    url: 'https://magic.wizards.com/en/news/announcements/the-hobbit-update-bulletin',
    sourceType: 'update-bulletin',
    retrievedAt: '2026-08-22',
  },
  {
    id: 'hob-prerelease-guide',
    title: 'Magic: The Gathering | The Hobbit Prerelease Guide',
    publisher: 'Wizards of the Coast',
    url: 'https://magic.wizards.com/en/news/feature/the-hobbit-prerelease-guide',
    sourceType: 'official-guide',
    retrievedAt: '2026-08-22',
  },
] satisfies Source[]

const rawSourceLocators = [
  { id: 'cr-rule-122-1j', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 122.1j — Hone counters' },
  { id: 'cr-rule-701-70', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 701.70 — Recruit' },
  { id: 'cr-rule-702-195', sourceId: 'magic-comprehensive-rules', locatorType: 'rule-number', label: 'Rule 702.195 — Storied' },
  { id: 'hob-release-notes-storied', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'New Keyword Ability: Storied' },
  { id: 'hob-release-notes-recruit', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'New Keyword Action: Recruit' },
  { id: 'hob-release-notes-hone-counters', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'New Mechanic: Hone Counters' },
  { id: 'hob-release-notes-amass', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'Returning Keyword Action: Amass' },
  { id: 'hob-release-notes-landfall', sourceId: 'hob-release-notes', locatorType: 'named-section', label: 'Returning Ability Word: Landfall' },
  { id: 'hob-mechanics-storied', sourceId: 'hob-mechanics', locatorType: 'named-section', label: 'Storied' },
  { id: 'hob-mechanics-recruit', sourceId: 'hob-mechanics', locatorType: 'named-section', label: 'Recruit' },
  { id: 'hob-mechanics-hone-counters', sourceId: 'hob-mechanics', locatorType: 'named-section', label: 'Hone Counters' },
  { id: 'hob-mechanics-amass', sourceId: 'hob-mechanics', locatorType: 'named-section', label: 'Amass' },
  { id: 'hob-update-bulletin-new-rules', sourceId: 'hob-update-bulletin', locatorType: 'named-section', label: 'New and Updated Rules' },
  { id: 'hob-release-notes-thorin', sourceId: 'hob-release-notes', locatorType: 'mechanic-example', label: 'Thorin Oakenshield — example in New Keyword Ability: Storied (no card-specific entry)', cardOracleId: 'bdd41af0-bbd1-4ecd-a699-99f006f5e5ce' },
  { id: 'hob-release-notes-bifur', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Bifur, Melodic Rider', cardOracleId: 'b8d563e4-e2bc-4e8b-8841-6655beff9138' },
  { id: 'hob-release-notes-bard-king', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Bard, King of Dale', cardOracleId: 'd05db2c1-a19a-4803-8e8a-fa2f9b798181' },
  { id: 'hob-release-notes-celebrate', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Celebrate the Mountain-king', cardOracleId: 'd51136fa-3c13-48a5-83fd-51fe00010a4b' },
  { id: 'hob-release-notes-dwalin', sourceId: 'hob-release-notes', locatorType: 'mechanic-example', label: 'Dwalin, Weaponmaster — example in New Mechanic: Hone Counters (no card-specific entry)', cardOracleId: 'cee583b7-7cc3-40ea-a227-b760839ec291' },
  { id: 'hob-release-notes-sting', sourceId: 'hob-release-notes', locatorType: 'no-card-specific-entry', label: "Sting, Bilbo's Sword — no card-specific release-note entry", cardOracleId: '9779f32c-b1a2-42a3-8e78-14c28c3ad254' },
  { id: 'hob-release-notes-bolg', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Bolg of the North', cardOracleId: '88522a0f-5377-4522-97f4-4148bef954af' },
  { id: 'hob-release-notes-azog', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: "Azog, Moria's Ruin", cardOracleId: 'a8b018a7-0350-4ee0-9582-8d391018bdee' },
  { id: 'hob-release-notes-nasty-little-rabbit', sourceId: 'hob-release-notes', locatorType: 'card-specific-entry', label: 'Nasty Little Rabbit', cardOracleId: 'ee86cce6-c7c1-40a6-896b-cde9b86bb532' },
  { id: 'hob-release-notes-silvan-reveler', sourceId: 'hob-release-notes', locatorType: 'no-card-specific-entry', label: 'Silvan Reveler — no card-specific release-note entry', cardOracleId: '11932191-4b19-49b1-bfe4-abb7b83b2e59' },
] satisfies SourceLocator[]

export const concepts: Concept[] = conceptSchema.array().parse([
  {
    id: 'storied',
    name: 'Storied',
    kind: 'keyword-ability',
    aliases: [
      'enduring story',
      'do treasure tokens count',
      'artifact tokens count',
      'counts twice',
      'three permanents',
    ],
    summary:
      'While you control a permanent with storied, controlling three or more qualifying permanents gives you an enduring story for the rest of the game.',
    memoryAid:
      'Three qualifying permanents, not three qualities—and tokens are permanents.',
    officialText:
      'Storied (If you control three or more artifacts, legendaries, and/or Sagas, you have an enduring story for the rest of the game.)',
    easyToMiss: [
      'Tokens count. A Treasure or other artifact token is a permanent.',
      'One permanent counts only once, even if it is both legendary and an artifact.',
      'You need to control a permanent with storied when you meet the requirement.',
      'Once earned, your enduring story cannot be removed—even if every qualifying permanent leaves.',
      'Storied is not a triggered ability and does not use the stack.',
    ],
    relatedConceptIds: ['permanent', 'token', 'artifact', 'legendary', 'saga'],
    sourceIds: ['hob-release-notes', 'hob-mechanics'],
    verificationStatus: 'verified',
    scenarios: [
      {
        id: 'storied-tokens-count',
        title: 'Do artifact tokens count?',
        setup: [
          'You control Thorin Oakenshield.',
          'You control a Treasure token.',
          'You control an Axe artifact token.',
        ],
        question: 'Do you have an enduring story?',
        answer: 'yes',
        explanation:
          'Thorin is legendary, and both tokens are artifact permanents. That gives you three separate qualifying permanents.',
        commonMistake: 'Assuming that only nontoken cards can qualify.',
        tags: ['token', 'artifact', 'treasure', 'counting'],
        sourceIds: ['hob-release-notes'],
        verificationStatus: 'verified',
      },
      {
        id: 'storied-overlapping-types',
        title: 'Does a legendary artifact count twice?',
        setup: [
          'You control a permanent with storied.',
          'You control one legendary artifact.',
          'You control one Saga.',
        ],
        question: 'Have you reached three qualifying permanents?',
        answer: 'no',
        explanation:
          'You control only two qualifying permanents. The legendary artifact has two qualifying characteristics, but it remains one permanent.',
        commonMistake: 'Counting qualities instead of separate permanents.',
        tags: ['legendary', 'artifact', 'saga', 'counting'],
        sourceIds: ['hob-release-notes'],
        verificationStatus: 'verified',
      },
      {
        id: 'storied-response-window',
        title: 'Can an opponent respond to you getting the story?',
        setup: [
          'You control a permanent with storied and two qualifying permanents.',
          'Your third qualifying permanent is on the stack.',
        ],
        question: 'When can an opponent act?',
        answer: 'explanation',
        explanation:
          'An opponent can respond to the spell before it resolves. Once the third permanent is on the battlefield and you meet the condition, earning the enduring story does not use the stack and cannot be responded to.',
        canRespond:
          'Yes—before the third permanent resolves, but not after you already control it and earn the designation.',
        tags: ['respond', 'stack', 'priority', 'timing'],
        sourceIds: ['hob-release-notes'],
        verificationStatus: 'verified',
      },
    ],
  },
  {
    id: 'permanent',
    name: 'Permanent',
    kind: 'game-concept',
    aliases: ['objects on battlefield', 'what is a permanent'],
    summary:
      'A permanent is an object on the battlefield, including creatures, artifacts, enchantments, lands, planeswalkers, battles, and tokens.',
    memoryAid: 'If it is on the battlefield, it is usually a permanent.',
    easyToMiss: ['Spells on the stack and emblems are not permanents.'],
    relatedConceptIds: ['token'],
    sourceIds: ['hob-release-notes'],
    scenarios: [],
    verificationStatus: 'verified',
  },
  {
    id: 'token',
    name: 'Token',
    kind: 'object',
    aliases: ['treasure', 'food', 'soldier token', 'artifact token'],
    summary:
      'A token is a marker representing a permanent that was created by a spell or ability rather than played as a card.',
    memoryAid: 'Tokens on the battlefield are permanents too.',
    easyToMiss: ['A token can be an artifact, creature, or both.'],
    relatedConceptIds: ['permanent', 'artifact'],
    sourceIds: ['hob-release-notes'],
    scenarios: [],
    verificationStatus: 'verified',
  },
])

export const cards: Card[] = cardSchema.array().parse([
  {
    id: 'thorin-oakenshield',
    oracleId: 'bdd41af0-bbd1-4ecd-a699-99f006f5e5ce',
    setCode: 'HOB',
    collectorNumber: '165',
    name: 'Thorin Oakenshield',
    manaCost: '{R}{W}',
    typeLine: 'Legendary Creature — Dwarf Noble',
    oracleText:
      'Trample\nStoried (If you control three or more artifacts, legendaries, and/or Sagas, you have an enduring story for the rest of the game.)\nAs long as you have an enduring story, artifacts and creatures you control have ward {1}.',
    power: '3',
    toughness: '2',
    summary:
      'Thorin counts toward his own storied requirement because he is legendary. After you earn an enduring story, he protects your artifacts and creatures with ward {1}.',
    conceptIds: ['storied', 'permanent'],
    easyToMiss: [
      'Thorin himself is one qualifying permanent because he is legendary.',
      'Artifact tokens can supply the other two qualifying permanents.',
      'Your enduring story remains if Thorin leaves, but Thorin’s ward effect does not.',
      'Ward applies to both artifacts and creatures you control; an artifact creature still receives one instance from Thorin.',
    ],
    sourceIds: ['hob-release-notes'],
    scenarios: [
      {
        id: 'thorin-leaves',
        title: 'What happens if Thorin leaves?',
        setup: [
          'You earned an enduring story while controlling Thorin.',
          'Thorin then leaves the battlefield.',
        ],
        question: 'Do you keep the story and ward?',
        answer: 'depends',
        explanation:
          'You keep the enduring story because the designation is on you for the rest of the game. You lose Thorin’s ward-granting effect because that ability only functions while Thorin is on the battlefield.',
        tags: ['ward', 'leaves battlefield', 'enduring story'],
        sourceIds: ['hob-release-notes'],
        verificationStatus: 'verified',
      },
    ],
    verificationStatus: 'verified',
  },
])

export function validateContentData(data: unknown) {
  return contentDataSchema.parse(data)
}

const validatedContentData = validateContentData({
  sources: sourceSchema.array().parse(rawSources),
  sourceLocators: sourceLocatorSchema.array().parse(rawSourceLocators),
  concepts,
  cards,
})

export const sources = validatedContentData.sources
export const sourceLocators = validatedContentData.sourceLocators

const sourcesById = new Map(sources.map((source) => [source.id, source]))
const sourceLocatorsById = new Map(
  sourceLocators.map((locator) => [locator.id, locator]),
)

export function getSource(id: string) {
  return sourcesById.get(id)
}

export function resolveSourceReference(id: string) {
  const source = sourcesById.get(id)
  if (source) return { id, source }

  const locator = sourceLocatorsById.get(id)
  if (!locator) return undefined

  const parentSource = sourcesById.get(locator.sourceId)
  if (!parentSource) return undefined

  return { id, source: parentSource, locator }
}

export function getConcept(id: string) {
  return concepts.find((concept) => concept.id === id)
}

export function getCard(id: string) {
  return cards.find((card) => card.id === id)
}

const cardsByOracleId = new Map(cards.map((card) => [card.oracleId, card]))

export function getCardByOracleId(oracleId: string) {
  return cardsByOracleId.get(oracleId)
}
