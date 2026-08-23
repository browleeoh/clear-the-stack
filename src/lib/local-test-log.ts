export const localTestLogKey = 'mtg-helper-test-log'

export type LocalTestLogRecord = {
  id: string
  query: string
  resultSelected: boolean
  timestamp: string
}

export function parseLocalTestLog(value: string | null): LocalTestLogRecord[] {
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((record) => {
      if (!record || typeof record !== 'object') return []
      const candidate = record as Partial<LocalTestLogRecord>
      if (
        typeof candidate.id !== 'string'
        || !candidate.id.trim()
        || typeof candidate.query !== 'string'
        || !candidate.query.trim()
        || typeof candidate.resultSelected !== 'boolean'
        || typeof candidate.timestamp !== 'string'
        || Number.isNaN(Date.parse(candidate.timestamp))
      ) return []

      return [{
        id: candidate.id.trim(),
        query: candidate.query.trim(),
        resultSelected: candidate.resultSelected,
        timestamp: candidate.timestamp,
      }]
    })
  } catch {
    return []
  }
}

export function addUnansweredSearch(
  records: LocalTestLogRecord[],
  query: string,
  id: string,
  timestamp: string,
) {
  const normalized = query.trim()
  if (!normalized) return { records, added: false }
  const duplicate = records.some((record) =>
    !record.resultSelected && record.query.toLocaleLowerCase() === normalized.toLocaleLowerCase(),
  )
  if (duplicate) return { records, added: false }
  return {
    records: [...records, { id, query: normalized, resultSelected: false, timestamp }],
    added: true,
  }
}
