import { mountBrowseAi } from './content/mount'

const start = (): void => {
  mountBrowseAi().catch((error: unknown) =>
    console.error('BrowseAI could not start:', error)
  )
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true })
} else {
  start()
}
