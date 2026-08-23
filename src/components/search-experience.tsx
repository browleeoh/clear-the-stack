import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { ArrowIcon, SearchIcon } from './icons'
import { searchContent } from '@/lib/search'
import type { SearchEntry } from '@/lib/search'
import {
  addUnansweredSearch,
  addSelectedSearch,
  currentLookupKey,
  localTestLogKey,
  localTestLogUpdatedEvent,
  parseLocalTestLog,
} from '@/lib/local-test-log'

const suggestions = [
  'Storied',
  'Thorin Oakenshield',
  'Do Treasure tokens count?',
]

const recentSearchesKey = 'mtg-helper-recent-searches'
const resultGroupOrder = ['learn', 'scenario', 'card', 'mechanic'] as const

const resultGroupLabels = {
  learn: 'Beginner guides',
  scenario: 'Examples',
  card: 'Cards',
  mechanic: 'Rules and mechanics',
} as const

export function parseRecentSearches(value: string | null) {
  if (!value) return []
  try {
    const stored: unknown = JSON.parse(value)
    return Array.isArray(stored)
      ? stored.filter((item): item is string => typeof item === 'string').slice(0, 5)
      : []
  } catch {
    return []
  }
}

export function updateRecentSearches(current: string[], query: string) {
  const normalized = query.trim()
  if (!normalized) return current
  return [normalized, ...current.filter((item) => item !== normalized)].slice(0, 5)
}

export function groupSearchResults(results: SearchEntry[], query = '') {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const exactMatch = results.find((result) => result.title.toLocaleLowerCase() === normalizedQuery)
  const exactKind: (typeof resultGroupOrder)[number] | undefined = exactMatch?.kind === 'concept' || exactMatch?.kind === 'mechanic'
    ? 'mechanic'
    : exactMatch?.kind
  const groupOrder: readonly (typeof resultGroupOrder)[number][] = exactKind
    ? [exactKind, ...resultGroupOrder.filter((kind) => kind !== exactKind)]
    : resultGroupOrder

  return groupOrder.map((kind) => ({
    kind,
    label: resultGroupLabels[kind],
    results: results.filter((result) =>
      kind === 'mechanic'
        ? result.kind === 'mechanic' || result.kind === 'concept'
        : result.kind === kind,
    ),
  })).filter((group) => group.results.length)
}

export function getSearchDestination(result: SearchEntry) {
  if (result.kind === 'card') return { to: '/cards/$cardSlug' as const, params: { cardSlug: result.slug } }
  if (result.kind === 'scenario') {
    if (result.parentKind === 'card') {
      return { to: '/cards/$cardSlug' as const, params: { cardSlug: result.parentSlug ?? '' }, hash: result.slug }
    }
    return { to: '/mechanics/$mechanicSlug' as const, params: { mechanicSlug: result.parentSlug ?? '' }, hash: result.slug }
  }
  if (result.kind !== 'learn') return { to: '/mechanics/$mechanicSlug' as const, params: { mechanicSlug: result.slug } }

  switch (result.slug) {
    case 'turn-structure': return { to: '/learn/turn-structure' as const, params: {} }
    case 'casting-resolution': return { to: '/learn/casting-resolution' as const, params: {} }
    case 'combat': return { to: '/learn/combat' as const, params: {} }
    case 'core-concepts': return { to: '/learn/core-concepts' as const, params: {} }
    default: throw new Error(`Unknown Learn destination: ${result.slug}`)
  }
}

export function SearchExperience() {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'duplicate' | 'unavailable'>('idle')
  const results = useMemo(() => searchContent(query), [query])
  const groupedResults = useMemo(() => groupSearchResults(results, query), [query, results])

  useEffect(() => {
    try {
      setRecentSearches(parseRecentSearches(localStorage.getItem(recentSearchesKey)))
    } catch {
      setRecentSearches([])
    }
  }, [])

  function rememberSearch(result: SearchEntry) {
    const next = updateRecentSearches(recentSearches, query)
    if (next === recentSearches) return
    setRecentSearches(next)
    try {
      localStorage.setItem(recentSearchesKey, JSON.stringify(next))
    } catch {
      // Search remains fully usable when storage is unavailable.
    }

    try {
      if (!query.trim()) return
      const records = parseLocalTestLog(localStorage.getItem(localTestLogKey))
      const id = globalThis.crypto?.randomUUID?.() ?? `lookup-${Date.now()}`
      const selectedResult = { id: result.id, title: result.title, href: result.href }
      const record = { id, query: query.trim(), resultSelected: true, selectedResult, timestamp: new Date().toISOString() }
      localStorage.setItem(localTestLogKey, JSON.stringify(addSelectedSearch(records, record)))
      sessionStorage.setItem(currentLookupKey, id)
      window.dispatchEvent(new Event(localTestLogUpdatedEvent))
    } catch {
      // Navigation remains fully usable when storage is unavailable.
    }
  }

  function saveUnansweredSearch() {
    try {
      const records = parseLocalTestLog(localStorage.getItem(localTestLogKey))
      const id = globalThis.crypto?.randomUUID?.() ?? `lookup-${Date.now()}`
      const next = addUnansweredSearch(records, query, id, new Date().toISOString())
      if (!next.added) {
        setSaveStatus('duplicate')
        return
      }
      localStorage.setItem(localTestLogKey, JSON.stringify(next.records))
      window.dispatchEvent(new Event(localTestLogUpdatedEvent))
      setSaveStatus('saved')
    } catch {
      setSaveStatus('unavailable')
    }
  }

  return (
    <>
      <div className="search-panel">
        <label className="search-box">
          <SearchIcon />
          <span className="sr-only">Search cards, mechanics, or questions</span>
          <input
            type="search"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onInput={() => setSaveStatus('idle')}
            placeholder="Search a card, mechanic, or question"
          />
        </label>
        <div className="search-results" aria-live="polite">
          {results.length ? (
            groupedResults.map((group) => (
              <section className="result-group" key={group.kind} aria-labelledby={`result-group-${group.kind}`}>
                <h2 id={`result-group-${group.kind}`}>{group.label}</h2>
                {group.results.map((result) => {
                  const destination = getSearchDestination(result)
                  return (
                    <Link key={result.id} {...destination} className="result-link" onClick={() => rememberSearch(result)}>
                      <span className="result-icon" aria-hidden="true">
                        {result.kind === 'card' ? 'C' : result.kind === 'learn' ? 'L' : result.kind === 'scenario' ? 'E' : 'M'}
                      </span>
                      <span>
                        <span className="result-title">{result.title}</span>
                        <span className="result-description">{result.description}</span>
                      </span>
                      <span className="result-type">{result.kind === 'scenario' ? 'example' : result.kind}</span>
                    </Link>
                  )
                })}
              </section>
            ))
          ) : (
            <div className="empty-state">
              <p>We don’t have an explanation for that yet. Try a card or mechanic name.</p>
              <button className="save-question" type="button" onClick={saveUnansweredSearch} disabled={saveStatus === 'saved' || saveStatus === 'duplicate'}>
                {saveStatus === 'saved' || saveStatus === 'duplicate' ? 'Question saved' : 'Save this question'}
              </button>
              <p className="save-status" role="status">
                {saveStatus === 'saved' ? 'Saved on this device for later review.' : null}
                {saveStatus === 'duplicate' ? 'This question was already saved on this device.' : null}
                {saveStatus === 'unavailable' ? 'This browser could not save the question.' : null}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="suggestion-row" aria-label="Suggested searches">
        {suggestions.map((suggestion) => (
          <button
            className="suggestion"
            key={suggestion}
            type="button"
            onClick={() => setQuery(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {recentSearches.length ? (
        <div className="recent-searches">
          <p className="eyebrow">Recent searches</p>
          <div className="suggestion-row" aria-label="Recent searches">
            {recentSearches.map((recent) => (
              <button className="suggestion" key={recent} type="button" onClick={() => setQuery(recent)}>{recent}</button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="section-grid">
        <Link
          to="/mechanics/$mechanicSlug"
          params={{ mechanicSlug: 'storied' }}
          className="feature-card"
        >
          <p className="eyebrow">Set mechanic</p>
          <h2>Learn Storied</h2>
          <p>Tokens, overlapping types, response windows, and what stays forever.</p>
        </Link>
        <Link
          to="/cards/$cardSlug"
          params={{ cardSlug: 'thorin-oakenshield' }}
          className="feature-card"
        >
          <p className="eyebrow">Featured card</p>
          <h2>Thorin Oakenshield</h2>
          <p>See how Storied changes this card and when its ward effect ends.</p>
        </Link>
        <Link to="/learn/turn-structure" className="feature-card">
          <p className="eyebrow">Beginner guide</p>
          <h2>Take a turn</h2>
          <p>Follow the phases in order and learn when you can cast or attack.</p>
          <span className="sr-only"><ArrowIcon /></span>
        </Link>
      </div>
    </>
  )
}
