import { getSource } from '@/content/data'

export function SourceList({ sourceIds }: { sourceIds: string[] }) {
  return (
    <ul className="source-list">
      {sourceIds.map((sourceId) => {
        const source = getSource(sourceId)
        if (!source) return null
        return (
          <li key={source.id}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title}
            </a>{' '}
            — {source.publisher}
          </li>
        )
      })}
    </ul>
  )
}
