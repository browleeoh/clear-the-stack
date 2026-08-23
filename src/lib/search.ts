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
      concept.kind === 'keyword-ability' || concept.kind === 'set-mechanic'
        ? 'Set mechanic'
        : 'Rules concept',
    kind:
      concept.kind === 'keyword-ability' || concept.kind === 'set-mechanic'
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
    aliases: 'how to take a turn what can I do now phases steps when can I play a land cast a sorcery',
    body: 'Untap upkeep draw precombat main combat attackers blockers postcombat main end cleanup example turn priority stack',
  },
  {
    id: 'learn:casting-resolution',
    title: 'Casting and resolving a spell',
    description: 'From announcing a spell to its final destination',
    kind: 'learn',
    href: '/learn/casting-resolution',
    slug: 'casting-resolution',
    aliases: 'how to cast a spell pay mana choose targets respond resolution what happens next',
    body: 'Put spell on stack make choices choose targets determine costs activate mana abilities pay costs pass priority resolve top object permanent battlefield instant sorcery graveyard',
  },
  {
    id: 'learn:combat',
    title: 'Attacking and blocking',
    description: 'Declare combat choices, respond, and deal damage',
    kind: 'learn',
    href: '/learn/combat',
    slug: 'combat',
    aliases: 'how do I attack block when can I respond combat order summoning sickness vigilance',
    body: 'beginning of combat declare attackers tap attackers attack triggers priority declare blockers block triggers combat damage end of combat unblocked creature defending player',
  },
  {
    id: 'learn:core-concepts',
    title: 'Tokens, counters, targets, stack, and priority',
    description: 'Five core ideas that explain common game interactions',
    kind: 'learn',
    href: '/learn/core-concepts',
    slug: 'core-concepts',
    aliases: 'token versus counter is a counter a permanent choose target respond last in first out who acts now',
    body: 'token permanent not card counter marker not object target chosen spell ability stack newest resolves first priority one player act pass all players target illegal resolution',
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
