import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const API_URL = 'https://api.scryfall.com/cards/search'
const QUERY = 'e:hob cn<=193'
const EXPECTED_CARD_COUNT = 193
const USER_AGENT = 'ClearTheStack/0.1 (HOB catalog importer)'
const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../src/content/generated/hob-catalog.json',
)

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function optionalString(value) {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function mapFace(face) {
  return {
    name: face.name,
    ...(optionalString(face.mana_cost) ? { manaCost: face.mana_cost } : {}),
    typeLine: face.type_line,
    oracleText: face.oracle_text ?? '',
    ...(optionalString(face.image_uris?.normal)
      ? { imageUri: face.image_uris.normal }
      : {}),
    ...(optionalString(face.artist) ? { artist: face.artist } : {}),
  }
}

function mapCard(card) {
  const faces = card.card_faces?.map(mapFace)

  return {
    id: slugify(card.name.replaceAll(' // ', '-')),
    oracleId: card.oracle_id,
    scryfallId: card.id,
    setCode: 'HOB',
    collectorNumber: card.collector_number,
    name: card.name,
    ...(optionalString(card.mana_cost) ? { manaCost: card.mana_cost } : {}),
    typeLine: card.type_line,
    oracleText:
      card.oracle_text ?? faces?.map((face) => face.oracleText).join('\n//\n') ?? '',
    ...(optionalString(card.image_uris?.normal)
      ? { imageUri: card.image_uris.normal }
      : {}),
    scryfallUri: card.scryfall_uri,
    ...(optionalString(card.artist) ? { artist: card.artist } : {}),
    ...(faces ? { faces } : {}),
  }
}

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': USER_AGENT,
    },
  })

  if (!response.ok) {
    throw new Error(`Scryfall request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

async function importCatalog() {
  const firstUrl = new URL(API_URL)
  firstUrl.searchParams.set('q', QUERY)
  firstUrl.searchParams.set('unique', 'prints')
  firstUrl.searchParams.set('order', 'set')

  const cards = []
  let nextUrl = firstUrl.toString()

  while (nextUrl) {
    const page = await fetchPage(nextUrl)
    cards.push(...page.data)
    nextUrl = page.has_more ? page.next_page : undefined
  }

  if (cards.length !== EXPECTED_CARD_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_CARD_COUNT} HOB cards, received ${cards.length}`,
    )
  }

  const catalog = cards
    .map(mapCard)
    .toSorted(
      (left, right) =>
        Number(left.collectorNumber) - Number(right.collectorNumber),
    )

  const ids = new Set(catalog.map((card) => card.id))
  const collectorNumbers = new Set(catalog.map((card) => card.collectorNumber))
  const oracleIds = new Set(catalog.map((card) => card.oracleId))

  if (
    ids.size !== EXPECTED_CARD_COUNT ||
    collectorNumbers.size !== EXPECTED_CARD_COUNT ||
    oracleIds.size !== EXPECTED_CARD_COUNT
  ) {
    throw new Error('Catalog contains duplicate card, collector, or Oracle IDs')
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${catalog.length} HOB cards to ${OUTPUT_PATH}`)
}

await importCatalog()
