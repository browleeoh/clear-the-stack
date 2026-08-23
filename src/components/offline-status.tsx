import { useEffect, useState } from 'react'

export function OfflineStatus() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return offline ? (
    <div className="offline-status" role="status">
      You’re offline. Bundled card text and guidance remain available; card images and official source links may need a connection.
    </div>
  ) : null
}
