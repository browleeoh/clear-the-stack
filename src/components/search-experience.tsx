import { Combobox } from '@base-ui/react/combobox'
import { useEffect, useMemo, useState } from 'react'
import { SearchIcon } from './icons'
import { searchContent } from '@/lib/search'
import type { SearchEntry } from '@/lib/search'

const examples = ['Thorin Oakenshield', 'How does fight work?']
const recentSearchesKey = 'mtg-helper-recent-searches'
const groupOrder = ['card', 'scenario', 'learn', 'mechanic'] as const
const labels = { card: 'Cards', scenario: 'Examples', learn: 'Beginner guides', mechanic: 'Rules and mechanics' } as const

export function parseRecentSearches(value: string | null) {
  if (!value) return []
  try {
    const stored: unknown = JSON.parse(value)
    return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === 'string').slice(0, 5) : []
  } catch { return [] }
}

export function updateRecentSearches(current: string[], query: string) {
  const normalized = query.trim()
  return normalized ? [normalized, ...current.filter((item) => item !== normalized)].slice(0, 5) : current
}

export function groupSearchResults(results: SearchEntry[], _query = '') {
  const query = _query.trim().toLocaleLowerCase()
  const terms = query.split(/\s+/).filter(Boolean)
  const exact = results.find((result) => result.title.toLocaleLowerCase() === query)
  const exactKind = exact?.kind === 'concept' || exact?.kind === 'mechanic' ? 'mechanic' : exact?.kind
  const matchingCard = terms.length ? results.find((result) => result.kind === 'card' && terms.every((term) => result.title.toLocaleLowerCase().includes(term))) : undefined
  const order: readonly (typeof groupOrder)[number][] = exactKind ? [exactKind, ...groupOrder.filter((kind) => kind !== exactKind)] : matchingCard ? ['card', 'scenario', 'learn', 'mechanic'] : ['learn', 'scenario', 'card', 'mechanic']
  return order.map((kind) => ({ kind, label: labels[kind], results: results.filter((result) => kind === 'mechanic' ? result.kind === 'mechanic' || result.kind === 'concept' : result.kind === kind) })).filter((group) => group.results.length)
}

export function getSearchDestination(result: SearchEntry) {
  if (result.kind === 'card') return { to: '/cards/$cardSlug' as const, params: { cardSlug: result.slug } }
  if (result.kind === 'scenario') {
    return result.parentKind === 'card'
      ? { to: '/cards/$cardSlug' as const, params: { cardSlug: result.parentSlug ?? '' }, hash: result.slug }
      : { to: '/mechanics/$mechanicSlug' as const, params: { mechanicSlug: result.parentSlug ?? '' }, hash: result.slug }
  }
  if (result.kind !== 'learn') return { to: '/mechanics/$mechanicSlug' as const, params: { mechanicSlug: result.slug } }
  return { to: `/learn/${result.slug}` as const, params: {} }
}

export function SearchExperience() {
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState<string[]>([])
  const results = useMemo(() => query.trim() ? searchContent(query).slice(0, 10) : [], [query])
  const groups = useMemo(() => groupSearchResults(results, query), [results, query])

  useEffect(() => {
    try { setRecent(parseRecentSearches(localStorage.getItem(recentSearchesKey))) } catch { setRecent([]) }
  }, [])

  function remember(value: string) {
    const next = updateRecentSearches(recent, value)
    setRecent(next)
    try { localStorage.setItem(recentSearchesKey, JSON.stringify(next)) } catch { /* local storage is optional */ }
  }

  function select(result: SearchEntry) {
    remember(query)
    globalThis.location.assign(result.href)
  }

  return (
    <Combobox.Root items={results} inputValue={query} onInputValueChange={setQuery} autoHighlight>
      <div className="search-panel">
        <label className="search-box">
          <SearchIcon />
          <span className="sr-only">Search cards, mechanics, or questions</span>
          <Combobox.Input placeholder={'Try “Troll Negotiations” or “How does fight work?”'} autoComplete="off" />
        </label>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner className="search-positioner" sideOffset={8}>
          <Combobox.Popup className="search-overlay" initialFocus={false}>
            {!query.trim() ? (
              <section className="search-discovery" aria-label={recent.length ? 'Recent searches' : 'Example searches'}>
                <div className="overlay-heading"><h2>{recent.length ? 'Recent' : 'Try an example'}</h2>{recent.length ? <button type="button" onClick={() => { setRecent([]); localStorage.removeItem(recentSearchesKey) }}>Clear</button> : null}</div>
                <div className="search-choice-list">{(recent.length ? recent : examples).map((value) => <button key={value} type="button" className="search-choice" onClick={() => setQuery(value)}>{value}</button>)}</div>
              </section>
            ) : results.length ? (
              <Combobox.List className="search-results">
                {groups.map((group) => <Combobox.Group key={group.kind} className="result-group"><Combobox.GroupLabel className="result-group-label">{labels[group.kind]}</Combobox.GroupLabel>{group.results.map((result) => <Combobox.Item key={result.id} value={result} className="result-link" onClick={() => select(result)}><span className="result-icon" aria-hidden="true">{result.kind === 'card' ? 'C' : result.kind === 'learn' ? 'L' : result.kind === 'scenario' ? 'E' : 'M'}</span><span><span className="result-title">{result.title}</span><span className="result-description">{result.description}</span></span></Combobox.Item>)}</Combobox.Group>)}
              </Combobox.List>
            ) : <p className="empty-state">No matches yet. Try a card name, mechanic, or rules question.</p>}
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
