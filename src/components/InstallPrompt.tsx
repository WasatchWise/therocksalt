'use client'

import { useEffect, useState } from 'react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) return

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // For iOS, show prompt after a short delay if not standalone
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    if (isIOS && !('standalone' in navigator && (navigator as any).standalone)) {
      setTimeout(() => setShowPrompt(true), 3000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowPrompt(false)
    }

    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showPrompt) return null

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-2xl animate-slide-up">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-white rounded-full p-1 flex-shrink-0">
            <img src="/icon-192.png" alt="Rock Salt" className="w-10 h-10 rounded-full" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Install The Rock Salt</h3>
            <p className="text-sm text-white/90">
              {isIOS
                ? "Tap the Share button and select 'Add to Home Screen'"
                : "Get quick access to local music anytime!"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-white/90 hover:text-white font-semibold"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
