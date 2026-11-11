/** Must match `OPEN_TAB_MESSAGE` in browse-ai-core. */
export const OPEN_TAB = 'OPEN_TAB'

export type OpenTabResponse = { ok: true } | { ok: false; error: string }

export interface OpenTabRequest {
  type: typeof OPEN_TAB
  url: string
  active?: boolean
}

export interface TabsCreateApi {
  create(properties: {
    url: string
    active: boolean
    index?: number
    openerTabId?: number
    windowId?: number
  }): Promise<unknown>
}

export function isOpenTabRequest(message: unknown): message is OpenTabRequest {
  return (
    typeof message === 'object' &&
    message !== null &&
    (message as { type?: unknown }).type === OPEN_TAB &&
    typeof (message as { url?: unknown }).url === 'string'
  )
}

/** Opens an http(s) URL in a new tab next to the sender's tab (Agent Mode). */
export async function openTab(
  tabs: TabsCreateApi,
  request: OpenTabRequest,
  sender: { index?: number; id?: number; windowId?: number } | undefined
): Promise<OpenTabResponse> {
  let protocol = ''
  try {
    protocol = new URL(request.url).protocol
  } catch {
    return { ok: false, error: 'Invalid address.' }
  }
  if (protocol !== 'http:' && protocol !== 'https:') {
    return { ok: false, error: 'Only http and https links can be opened.' }
  }
  try {
    await tabs.create({
      url: request.url,
      active: request.active === true,
      ...(sender?.index !== undefined && { index: sender.index + 1 }),
      ...(sender?.id !== undefined && { openerTabId: sender.id }),
      ...(sender?.windowId !== undefined && { windowId: sender.windowId })
    })
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to open the tab.'
    }
  }
}
