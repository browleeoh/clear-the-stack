import { resolveSourceReference } from '@/content/data'

export function SourceList({ sourceIds }: { sourceIds: string[] }) {
  return (
    <ul className="source-list">
      {sourceIds.map((sourceId) => {
        const reference = resolveSourceReference(sourceId)
        if (!reference) return null

        const { source, locator } = reference
        return (
          <li key={reference.id}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title}
            </a>
            {locator ? ` — ${locator.label}` : null} — {source.publisher}
          </li>
        )
      })}
    </ul>
  )
}
