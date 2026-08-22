import { z } from 'zod'

export const sourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  url: z.string().url(),
  sourceType: z.enum([
    'oracle-text',
    'comprehensive-rules',
    'official-ruling',
    'release-notes',
    'official-mechanics',
  ]),
  retrievedAt: z.string(),
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

export type Source = z.infer<typeof sourceSchema>
export type Scenario = z.infer<typeof scenarioSchema>
export type Concept = z.infer<typeof conceptSchema>
export type Card = z.infer<typeof cardSchema>
