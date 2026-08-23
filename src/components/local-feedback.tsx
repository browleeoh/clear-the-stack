import { useEffect, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import {
  currentLookupKey,
  localTestLogKey,
  localTestLogUpdatedEvent,
  parseLocalTestLog,
  updateLookupFeedback,
} from '@/lib/local-test-log'
import type { LocalTestLogRecord } from '@/lib/local-test-log'

export function LocalFeedback() {
  const location = useLocation()
  const [lookup, setLookup] = useState<LocalTestLogRecord>()
  const [status, setStatus] = useState('')

  useEffect(() => {
    function refresh() {
      setStatus('')
      try {
        const id = sessionStorage.getItem(currentLookupKey)
        const record = parseLocalTestLog(localStorage.getItem(localTestLogKey)).find((item) => item.id === id)
        if (record?.selectedResult && record.selectedResult.href.split('#')[0] === location.pathname) setLookup(record)
        else setLookup(undefined)
      } catch {
        setLookup(undefined)
      }
    }
    refresh()
    window.addEventListener(localTestLogUpdatedEvent, refresh)
    return () => window.removeEventListener(localTestLogUpdatedEvent, refresh)
  }, [location.pathname])

  function save(feedback: Pick<LocalTestLogRecord, 'helpful' | 'report'>, message: string) {
    if (!lookup) return
    try {
      const records = parseLocalTestLog(localStorage.getItem(localTestLogKey))
      const next = updateLookupFeedback(records, lookup.id, feedback)
      localStorage.setItem(localTestLogKey, JSON.stringify(next))
      window.dispatchEvent(new Event(localTestLogUpdatedEvent))
      setLookup(next.find((record) => record.id === lookup.id))
      setStatus(message)
    } catch {
      setStatus('This browser could not save feedback.')
    }
  }

  if (!lookup) return null

  return (
    <aside className="shell local-feedback" aria-labelledby="local-feedback-title">
      <h2 id="local-feedback-title">Did this answer your question?</h2>
      <div className="feedback-actions">
        <button type="button" aria-pressed={lookup.helpful === true} onClick={() => save({ helpful: true }, 'Marked helpful on this device.')}>Yes</button>
        <button type="button" aria-pressed={lookup.helpful === false} onClick={() => save({ helpful: false }, 'Marked not helpful on this device.')}>No</button>
      </div>
      <p>Report something unclear or incorrect:</p>
      <div className="feedback-actions">
        <button type="button" aria-pressed={lookup.report === 'unclear'} onClick={() => save({ report: 'unclear' }, 'Marked unclear on this device.')}>Unclear</button>
        <button type="button" aria-pressed={lookup.report === 'incorrect'} onClick={() => save({ report: 'incorrect' }, 'Marked incorrect on this device.')}>Incorrect</button>
      </div>
      <p className="save-status" role="status">{status}</p>
    </aside>
  )
}
