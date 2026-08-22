import { useEffect } from 'react'

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // The app remains usable online if registration is unavailable.
      })
    }
  }, [])

  return null
}
