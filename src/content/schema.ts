import { z } from 'zod'

export const sourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().url(),
  sourceType: z.enum([
    'oracle-text',
    'comprehensive-rules',
    'official-ruling',
    'release-notes',
    'official-mechanics',
    'update-bulletin',
    'official-guide',
  ]),
  retrievedAt: z.iso.date(),
  rulesEffectiveDate: z.iso.date().optional(),
  version: z.string().min(1).optional(),
})

export const sourceLocatorSchema = z
  .object({
    id: z.string().min(1),
    sourceId: z.string().min(1),
    locatorType: z.enum([
      'named-section',
      'rule-number',
      'card-specific-entry',
      'mechanic-example',
      'no-card-specific-entry',
    ]),
    label: z.string().min(1),
    cardOracleId: z.string().uuid().optional(),
  })
  .superRefine((locator, context) => {
    const isCardLocator = [
      'card-specific-entry',
      'mechanic-example',
      'no-card-specific-entry',
    ].includes(locator.locatorType)

    if (isCardLocator !== Boolean(locator.cardOracleId)) {
      context.addIssue({
        code: 'custom',
        message:
          'Card coverage locators require cardOracleId, and other locators must omit it',
        path: ['cardOracleId'],
      })
    }
  })

export const scenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  setup: z.array(z.string()),
  question: z.string(),
  answer: z.enum(['yes', 'no', 'depends', 'explanation']),
  explanation: z.string(),
  canRespond: z.string().optional(),
  commonMistake: z.string().optional(),
  tags: z.array(z.string()),
  sourceIds: z.array(z.string()).min(1),
  verificationStatus: z.enum(['draft', 'reviewed', 'verified']),
  reviewedAt: z.iso.date().optional(),
})

export const conceptSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum([
    'keyword-ability',
    'keyword-action',
    'set-mechanic',
    'game-concept',
    'object',
  ]),
  aliases: z.array(z.string()),
  summary: z.string(),
  memoryAid: z.string(),
  officialText: z.string().optional(),
  easyToMiss: z.array(z.string()),
  relatedConceptIds: z.array(z.string()),
  sourceIds: z.array(z.string()).min(1),
  scenarios: z.array(scenarioSchema),
  verificationStatus: z.enum(['draft', 'reviewed', 'verified']),
})

export const cardSchema = z.object({
  id: z.string(),
  oracleId: z.string().uuid(),
  setCode: z.literal('HOB'),
  collectorNumber: z.string(),
  name: z.string(),
  manaCost: z.string(),
  typeLine: z.string(),
  oracleText: z.string(),
  power: z.string().optional(),
  toughness: z.string().optional(),
  summary: z.string(),
  conceptIds: z.array(z.string()),
  easyToMiss: z.array(z.string()),
  sourceIds: z.array(z.string()).min(1),
  scenarios: z.array(scenarioSchema),
  verificationStatus: z.enum(['draft', 'reviewed', 'verified']),
})

export const catalogCardFaceSchema = z.object({
  name: z.string(),
  manaCost: z.string().optional(),
  typeLine: z.string(),
  oracleText: z.string(),
  imageUri: z.string().url().optional(),
  artist: z.string().optional(),
})

export const catalogCardSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  scryfallId: z.string().uuid(),
  setCode: z.literal('HOB'),
  collectorNumber: z.string(),
  name: z.string(),
  manaCost: z.string().optional(),
  typeLine: z.string(),
  oracleText: z.string(),
  imageUri: z.string().url().optional(),
  scryfallUri: z.string().url(),
  artist: z.string().optional(),
  faces: z.array(catalogCardFaceSchema).optional(),
})

export const contentDataSchema = z
  .object({
    sources: z.array(sourceSchema),
    sourceLocators: z.array(sourceLocatorSchema),
    concepts: z.array(conceptSchema),
    cards: z.array(cardSchema),
  })
  .superRefine((data, context) => {
    const sourceIds = new Set<string>()
    for (const [index, source] of data.sources.entries()) {
      if (sourceIds.has(source.id)) {
        context.addIssue({
          code: 'custom',
          message: `Duplicate source ID: ${source.id}`,
          path: ['sources', index, 'id'],
        })
      }
      sourceIds.add(source.id)
    }

    const locatorIds = new Set<string>()
    for (const [index, locator] of data.sourceLocators.entries()) {
      if (sourceIds.has(locator.id)) {
        context.addIssue({
          code: 'custom',
          message: `Source locator ID duplicates source ID: ${locator.id}`,
          path: ['sourceLocators', index, 'id'],
        })
      }

      if (locatorIds.has(locator.id)) {
        context.addIssue({
          code: 'custom',
          message: `Duplicate source locator ID: ${locator.id}`,
          path: ['sourceLocators', index, 'id'],
        })
      }
      locatorIds.add(locator.id)

      if (!sourceIds.has(locator.sourceId)) {
        context.addIssue({
          code: 'custom',
          message: `Invalid parent source reference: ${locator.sourceId}`,
          path: ['sourceLocators', index, 'sourceId'],
        })
      }
    }

    const references = [
      ...data.cards.flatMap((card) => [
        ...card.sourceIds,
        ...card.scenarios.flatMap((scenario) => scenario.sourceIds),
      ]),
      ...data.concepts.flatMap((concept) => [
        ...concept.sourceIds,
        ...concept.scenarios.flatMap((scenario) => scenario.sourceIds),
      ]),
    ]

    for (const sourceId of references) {
      if (!sourceIds.has(sourceId) && !locatorIds.has(sourceId)) {
        context.addIssue({
          code: 'custom',
          message: `Dangling source reference: ${sourceId}`,
          path: ['sourceIds'],
        })
      }
    }
  })

export type Source = z.infer<typeof sourceSchema>
export type SourceLocator = z.infer<typeof sourceLocatorSchema>
export type Scenario = z.infer<typeof scenarioSchema>
export type Concept = z.infer<typeof conceptSchema>
export type Card = z.infer<typeof cardSchema>
export type CatalogCard = z.infer<typeof catalogCardSchema>
