const QUIZ_RESULTS_CHANNEL = 'code-xx-xy:quiz-results'
const QUIZ_RESULTS_STORAGE_KEY = 'code-xx-xy:quiz-results-sync'

export function notifyQuizResultsUpdated() {
  if (typeof window === 'undefined') return

  const payload = JSON.stringify({ updatedAt: Date.now() })

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(QUIZ_RESULTS_CHANNEL)
    channel.postMessage(payload)
    channel.close()
  }

  try {
    window.localStorage.setItem(QUIZ_RESULTS_STORAGE_KEY, payload)
  } catch {
    // Ignore storage failures and fall back to BroadcastChannel only.
  }
}

export function subscribeToQuizResultsUpdates(onUpdate: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === QUIZ_RESULTS_STORAGE_KEY) {
      onUpdate()
    }
  }

  window.addEventListener('storage', handleStorage)

  let channel: BroadcastChannel | null = null
  if ('BroadcastChannel' in window) {
    channel = new BroadcastChannel(QUIZ_RESULTS_CHANNEL)
    channel.onmessage = () => {
      onUpdate()
    }
  }

  return () => {
    window.removeEventListener('storage', handleStorage)
    if (channel) {
      channel.onmessage = null
      channel.close()
    }
  }
}
