export const CAPTURE_VISIBLE_TAB = 'CAPTURE_VISIBLE_TAB'

export type CaptureResponse =
  { ok: true; dataUrl: string } | { ok: false; error: string }

export interface TabsApi {
  captureVisibleTab(
    windowId: number | undefined,
    options: { format: 'png' }
  ): Promise<string>
}

export function isCaptureRequest(message: unknown): boolean {
  return (
    typeof message === 'object' &&
    message !== null &&
    (message as { type?: unknown }).type === CAPTURE_VISIBLE_TAB
  )
}

/** Takes a PNG of the visible part of the sender's tab. */
export async function captureVisibleTab(
  tabs: TabsApi,
  windowId: number | undefined
): Promise<CaptureResponse> {
  try {
    const dataUrl = await tabs.captureVisibleTab(windowId, { format: 'png' })
    return dataUrl
      ? { ok: true, dataUrl }
      : { ok: false, error: 'No screenshot data was returned.' }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to capture the current tab.'
    }
  }
}
