import catalogData from './generated/hob-catalog.json'
import { getCardByOracleId } from './data'
import { catalogCardSchema, type CatalogCard } from './schema'

export const catalogCards: CatalogCard[] = catalogCardSchema
  .array()
  .length(193)
  .parse(catalogData)

const catalogCardsById = new Map(catalogCards.map((card) => [card.id, card]))
const catalogCardsBySlug = new Map(
  catalogCards.map((card) => [card.slug, card]),
)

export function getCatalogCard(id: string) {
  return catalogCardsById.get(id)
}

export function getCatalogCardBySlug(slug: string) {
  return catalogCardsBySlug.get(slug)
}

export function getCardContentBySlug(slug: string) {
  const catalogCard = getCatalogCardBySlug(slug)
  if (!catalogCard) return undefined

  return {
    catalogCard,
    enrichment: getCardByOracleId(catalogCard.id),
  }
}
