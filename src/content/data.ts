import {
  cardSchema,
  conceptSchema,
  sourceSchema,
  type Card,
  type Concept,
  type Source,
} from './schema'

export const sources: Source[] = sourceSchema.array().parse([
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
])

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

export function getSource(id: string) {
  return sources.find((source) => source.id === id)
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
