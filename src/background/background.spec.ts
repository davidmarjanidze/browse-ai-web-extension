type Listener = (
  message: unknown,
  sender: { tab?: { windowId?: number } },
  sendResponse: (response: unknown) => void
) => boolean

describe('background worker', () => {
  let listener: Listener
  const captureVisibleTab = vi.fn(async () => 'data:image/png;base64,AA')

  beforeAll(async () => {
    ;(globalThis as { chrome?: unknown }).chrome = {
      runtime: {
        onMessage: { addListener: (fn: Listener) => (listener = fn) }
      },
      tabs: { captureVisibleTab }
    }
    await import('./background')
  })

  afterAll(() => delete (globalThis as { chrome?: unknown }).chrome)

  it('ignores other messages', () => {
    expect(listener({ type: 'PING' }, {}, vi.fn())).toBe(false)
  })

  it('answers capture requests asynchronously', async () => {
    const sendResponse = vi.fn()
    expect(
      listener(
        { type: 'CAPTURE_VISIBLE_TAB' },
        { tab: { windowId: 3 } },
        sendResponse
      )
    ).toBe(true)
    await vi.waitFor(() =>
      expect(sendResponse).toHaveBeenCalledWith({
        ok: true,
        dataUrl: 'data:image/png;base64,AA'
      })
    )
    expect(captureVisibleTab).toHaveBeenCalledWith(3, { format: 'png' })
  })
})
