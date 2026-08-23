import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { ArrowIcon, SearchIcon } from './icons'
import { searchContent } from '@/lib/search'
import type { SearchEntry } from '@/lib/search'

const suggestions = [
  'Storied',
  'Thorin Oakenshield',
  'Do Treasure tokens count?',
]

export function getSearchDestination(result: SearchEntry) {
  if (result.kind === 'card') return { to: '/cards/$cardSlug' as const, params: { cardSlug: result.slug } }
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
  const results = useMemo(() => searchContent(query), [query])

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
            placeholder="Search a card, mechanic, or question"
          />
        </label>
        <div className="search-results" aria-live="polite">
          {results.length ? (
            results.map((result) => {
              const destination = getSearchDestination(result)

              return (
                <Link key={result.id} {...destination} className="result-link">
                  <span className="result-icon" aria-hidden="true">
                    {result.kind === 'card'
                      ? 'C'
                      : result.kind === 'learn'
                        ? 'L'
                        : 'M'}
                  </span>
                  <span>
                    <span className="result-title">{result.title}</span>
                    <span className="result-description">
                      {result.description}
                    </span>
                  </span>
                  <span className="result-type">{result.kind}</span>
                </Link>
              )
            })
          ) : (
            <div className="empty-state">
              We don’t have an explanation for that yet. Try a card or mechanic
              name.
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
