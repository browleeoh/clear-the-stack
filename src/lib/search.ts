import MiniSearch from 'minisearch'
import { catalogCards } from '@/content/catalog'
import { concepts, getCardByOracleId } from '@/content/data'

export type SearchEntry = {
  id: string
  title: string
  description: string
  kind: 'card' | 'mechanic' | 'concept' | 'learn' | 'scenario'
  href: string
  slug: string
  aliases: string
  body: string
  parentKind?: 'card' | 'mechanic'
  parentSlug?: string
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
  ...catalogCards.flatMap((card) => {
    const enrichment = getCardByOracleId(card.id)
    return enrichment?.scenarios.map((scenario) => ({
      id: `scenario:${scenario.id}`,
      title: scenario.title,
      description: `Example from ${card.name}`,
      kind: 'scenario' as const,
      href: `/cards/${card.slug}#${scenario.id}`,
      slug: scenario.id,
      aliases: `${card.name} ${scenario.tags.join(' ')}`,
      body: `${scenario.setup.join(' ')} ${scenario.question} ${scenario.explanation} ${scenario.commonMistake ?? ''}`,
      parentKind: 'card' as const,
      parentSlug: card.slug,
    })) ?? []
  }),
  ...concepts.flatMap((concept) => concept.scenarios.map((scenario) => ({
    id: `scenario:${scenario.id}`,
    title: scenario.title,
    description: `Example from ${concept.name}`,
    kind: 'scenario' as const,
    href: `/mechanics/${concept.id}#${scenario.id}`,
    slug: scenario.id,
    aliases: `${concept.name} ${concept.aliases.join(' ')} ${scenario.tags.join(' ')}`,
    body: `${scenario.setup.join(' ')} ${scenario.question} ${scenario.explanation} ${scenario.commonMistake ?? ''}`,
    parentKind: 'mechanic' as const,
    parentSlug: concept.id,
  }))),
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

// MiniSearch searches card names, aliases, descriptions, and explanatory text. For
// 1–3 character lookups we deliberately search card titles only: broad prefix or
// fuzzy matching against rules text is noisy at that length. Longer queries retain
// the broader index so beginner-language questions still resolve naturally.
const searchConfiguration = {
  fields: ['title', 'aliases', 'body', 'description'],
  storeFields: ['title', 'description', 'kind', 'href', 'slug', 'parentKind', 'parentSlug'],
  searchOptions: {
    boost: { title: 4, aliases: 2.5 },
    prefix: true,
    fuzzy: 0.22,
  },
}

const primarySearch = new MiniSearch<SearchEntry>(searchConfiguration)
const scenarioSearch = new MiniSearch<SearchEntry>(searchConfiguration)

primarySearch.addAll(searchEntries.filter((entry) => entry.kind !== 'scenario'))
scenarioSearch.addAll(searchEntries.filter((entry) => entry.kind === 'scenario'))

export function searchContent(query: string): SearchEntry[] {
  const normalized = query.trim().replace(/[^\p{L}\p{N}\s]/gu, '')
  if (!normalized) {
    return searchEntries
      .filter(
        (entry) =>
          entry.slug === 'thorin-oakenshield' || entry.kind !== 'card',
      )
      .slice(0, 5)
  }

  if (normalized.length <= 3) {
    const titleMatches = primarySearch.search(normalized, {
      fields: ['title'],
      prefix: true,
      fuzzy: false,
    })
      .filter((entry) => entry.kind === 'card') as unknown as SearchEntry[]
    const fullTitlePrefixMatches = titleMatches.filter((entry) =>
      entry.title.toLocaleLowerCase().startsWith(normalized.toLocaleLowerCase()),
    )

    return (fullTitlePrefixMatches.length ? fullTitlePrefixMatches : titleMatches).slice(0, 8)
  }

  const primaryMatches = primarySearch.search(normalized).slice(0, 8) as unknown as SearchEntry[]
  const scenarioMatches = scenarioSearch.search(normalized).slice(0, 4) as unknown as SearchEntry[]
  return [...primaryMatches, ...scenarioMatches]
}
