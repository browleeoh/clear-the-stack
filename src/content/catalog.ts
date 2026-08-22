import catalogData from './generated/hob-catalog.json'
import { catalogCardSchema, type CatalogCard } from './schema'

export const catalogCards: CatalogCard[] = catalogCardSchema
  .array()
  .length(193)
  .parse(catalogData)

const catalogCardsById = new Map(catalogCards.map((card) => [card.id, card]))

export function getCatalogCard(id: string) {
  return catalogCardsById.get(id)
}
