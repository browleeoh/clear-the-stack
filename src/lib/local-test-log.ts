export const localTestLogKey = 'mtg-helper-test-log'
export const currentLookupKey = 'mtg-helper-current-lookup'

export type SelectedResult = {
  id: string
  title: string
  href: string
}

export type LocalTestLogRecord = {
  id: string
  query: string
  resultSelected: boolean
  timestamp: string
  selectedResult?: SelectedResult
  helpful?: boolean
  report?: 'unclear' | 'incorrect'
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
        || new Date(candidate.timestamp).toISOString() !== candidate.timestamp
      ) return []

      const selectedResult = candidate.selectedResult
      const sanitizedResult = selectedResult
        && typeof selectedResult.id === 'string'
        && Boolean(selectedResult.id.trim())
        && typeof selectedResult.title === 'string'
        && Boolean(selectedResult.title.trim())
        && typeof selectedResult.href === 'string'
        && selectedResult.href.startsWith('/')
        ? { id: selectedResult.id.trim(), title: selectedResult.title.trim(), href: selectedResult.href }
        : undefined
      if (candidate.resultSelected && !sanitizedResult) return []
      const helpful = typeof candidate.helpful === 'boolean' ? candidate.helpful : undefined
      const report = candidate.report === 'unclear' || candidate.report === 'incorrect' ? candidate.report : undefined

      return [{
        id: candidate.id.trim(),
        query: candidate.query.trim(),
        resultSelected: candidate.resultSelected,
        timestamp: candidate.timestamp,
        ...(candidate.resultSelected && sanitizedResult ? { selectedResult: sanitizedResult } : {}),
        ...(candidate.resultSelected && helpful !== undefined ? { helpful } : {}),
        ...(candidate.resultSelected && report ? { report } : {}),
      }]
    })
  } catch {
    return []
  }
}

export function addSelectedSearch(records: LocalTestLogRecord[], record: LocalTestLogRecord) {
  return [...records, record]
}

export function updateLookupFeedback(
  records: LocalTestLogRecord[],
  id: string,
  feedback: Pick<LocalTestLogRecord, 'helpful' | 'report'>,
) {
  return records.map((record) => record.id === id ? { ...record, ...feedback } : record)
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
