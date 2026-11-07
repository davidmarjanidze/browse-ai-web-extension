import type { BrowseAiCoreConfig } from 'browse-ai-core'

/** Tag of the host element. Not `browse-ai-core`, so pages using the package don't upgrade it. */
export const EXTENSION_HOST_TAG = 'browse-ai-extension'

/** Same storage key as extension 1.x, so saved settings and bookmarks stay. */
export const EXTENSION_STORAGE_KEY = '_browseAIV2'

export const EXTENSION_CONFIG: BrowseAiCoreConfig = {
  mode: 'drawer',
  position: 'bottom-right',
  palette: 'forest',
  theme: 'system',
  storageKey: EXTENSION_STORAGE_KEY,
  features: { bookmarks: true }
}
