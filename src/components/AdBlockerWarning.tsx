import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'

export const AdBlockerWarning = () => {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // Check if requests to civic.com are being blocked
    const checkAdBlocker = async () => {
      try {
        const response = await fetch('https://auth.civic.com/health', { 
          method: 'HEAD',
          mode: 'no-cors'
        })
        // If we get here without error, it's not blocked
      } catch (error) {
        // Likely blocked by ad blocker
        setShowWarning(true)
      }
    }

    checkAdBlocker()
  }, [])

  if (!showWarning) return null

  return (
    <div 
      className="fixed bottom-6 right-6 max-w-md rounded-2xl border-2 p-6 shadow-2xl z-50 animate-in slide-in-from-bottom"
      style={{ backgroundColor: 'var(--nb-card)', borderColor: 'var(--nb-warn)' }}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--nb-warn)' }}>
            <AlertCircle className="text-white" size={24} />
          </div>
        </div>
        <div>
          <h3 className="font-black text-lg mb-2">Ad Blocker Detected</h3>
          <p className="text-sm text-gray-600 mb-3">
            Please disable your ad blocker for this site to use authentication features.
          </p>
          <button
            onClick={() => setShowWarning(false)}
            className="text-sm font-bold hover:underline"
            style={{ color: 'var(--nb-warn)' }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
