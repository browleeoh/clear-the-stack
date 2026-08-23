import { useEffect, useState } from 'react'
import {
  currentLookupKey,
  localTestLogKey,
  localTestLogUpdatedEvent,
  parseLocalTestLog,
  serializeLocalTestLog,
} from '@/lib/local-test-log'
import type { LocalTestLogRecord } from '@/lib/local-test-log'

export function TestLogControls() {
  const [records, setRecords] = useState<LocalTestLogRecord[]>([])
  const [confirmReset, setConfirmReset] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    function refresh() {
      try {
        setRecords(parseLocalTestLog(localStorage.getItem(localTestLogKey)))
      } catch {
        setStatus('Local test-log storage is unavailable in this browser.')
      }
    }
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener(localTestLogUpdatedEvent, refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener(localTestLogUpdatedEvent, refresh)
    }
  }, [])

  function exportLog() {
    const content = serializeLocalTestLog(records, new Date().toISOString())
    const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'mtg-helper-test-log.json'
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
    setStatus(`Exported ${records.length} ${records.length === 1 ? 'lookup' : 'lookups'}.`)
  }

  function resetLog() {
    try {
      localStorage.removeItem(localTestLogKey)
      sessionStorage.removeItem(currentLookupKey)
      setRecords([])
      window.dispatchEvent(new Event(localTestLogUpdatedEvent))
      setConfirmReset(false)
      setStatus('The complete local test log was reset.')
    } catch {
      setStatus('This browser could not reset the local test log.')
    }
  }

  return (
    <footer className="shell test-log-controls">
      <details>
        <summary>Local test log</summary>
        <p>{records.length ? `${records.length} saved ${records.length === 1 ? 'lookup' : 'lookups'} on this device.` : 'No saved lookups on this device.'}</p>
        <div className="feedback-actions">
          <button type="button" onClick={exportLog} disabled={!records.length}>Export JSON</button>
          {!confirmReset ? (
            <button type="button" onClick={() => setConfirmReset(true)} disabled={!records.length}>Reset log</button>
          ) : (
            <button className="danger-button" type="button" onClick={resetLog}>Confirm complete reset</button>
          )}
          {confirmReset ? <button type="button" onClick={() => setConfirmReset(false)}>Cancel</button> : null}
        </div>
        <p className="save-status" role="status">{status}</p>
      </details>
    </footer>
  )
}
