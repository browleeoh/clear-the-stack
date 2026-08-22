import MiniSearch from 'minisearch'
import { catalogCards } from '@/content/catalog'
import { concepts, getCardByOracleId } from '@/content/data'

export type SearchEntry = {
  id: string
  title: string
  description: string
  kind: 'card' | 'mechanic' | 'concept' | 'learn'
  href: string
  slug: string
  aliases: string
  body: string
}

export const searchEntries: SearchEntry[] = [
  ...catalogCards.map((card) => {
    const enrichment = getCardByOracleId(card.id)

    return {
      id: `card:${card.id}`,
      title: card.name,
      description: card.typeLine,
      kind: 'card' as const,
      href: `/cards/${card.slug}`,
      slug: card.slug,
      aliases: enrichment?.easyToMiss.join(' ') ?? '',
      body: `${card.oracleText} ${enrichment?.summary ?? ''}`,
    }
  }),
  ...concepts.map((concept) => ({
    id: `concept:${concept.id}`,
    title: concept.name,
    description:
      concept.kind === 'keyword-ability' ? 'Set mechanic' : 'Rules concept',
    kind:
      concept.kind === 'keyword-ability'
        ? ('mechanic' as const)
        : ('concept' as const),
    href:
      concept.kind === 'keyword-ability'
        ? `/mechanics/${concept.id}`
        : `/mechanics/${concept.id}`,
    slug: concept.id,
    aliases: concept.aliases.join(' '),
    body: `${concept.summary} ${concept.memoryAid} ${concept.scenarios
      .map((scenario) => `${scenario.title} ${scenario.question}`)
      .join(' ')}`,
  })),
  {
    id: 'learn:turn-structure',
    title: 'Turn structure',
    description: 'Beginning, main, combat, and ending phases',
    kind: 'learn',
    href: '/learn/turn-structure',
    slug: 'turn-structure',
    aliases: 'how to take a turn what can I do now phases steps',
    body: 'Untap upkeep draw precombat main combat postcombat main end cleanup',
  },
]

const miniSearch = new MiniSearch<SearchEntry>({
  fields: ['title', 'aliases', 'body', 'description'],
  storeFields: ['title', 'description', 'kind', 'href', 'slug'],
  searchOptions: {
    boost: { title: 4, aliases: 2.5 },
    prefix: true,
    fuzzy: 0.22,
  },
})

miniSearch.addAll(searchEntries)

export function searchContent(query: string): SearchEntry[] {
  const normalized = query.trim()
  if (!normalized) {
    return searchEntries
      .filter(
        (entry) =>
          entry.slug === 'thorin-oakenshield' || entry.kind !== 'card',
      )
      .slice(0, 5)
  }

  return miniSearch.search(normalized).slice(0, 8) as unknown as SearchEntry[]
}
