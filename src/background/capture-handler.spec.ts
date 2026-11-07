import { captureVisibleTab, isCaptureRequest } from './capture-handler'

describe('capture handler', () => {
  it('recognizes capture requests', () => {
    expect(isCaptureRequest({ type: 'CAPTURE_VISIBLE_TAB' })).toBe(true)
    expect(isCaptureRequest({ type: 'OTHER' })).toBe(false)
    expect(isCaptureRequest(null)).toBe(false)
  })

  it('returns the screenshot of the sender window', async () => {
    const tabs = {
      captureVisibleTab: vi.fn(async () => 'data:image/png;base64,AA')
    }
    await expect(captureVisibleTab(tabs, 7)).resolves.toEqual({
      ok: true,
      dataUrl: 'data:image/png;base64,AA'
    })
    expect(tabs.captureVisibleTab).toHaveBeenCalledWith(7, { format: 'png' })
  })

  it('returns errors instead of throwing', async () => {
    const tabs = {
      captureVisibleTab: vi.fn(async () => {
        throw new Error('Cannot access a chrome:// URL')
      })
    }
    await expect(captureVisibleTab(tabs, undefined)).resolves.toEqual({
      ok: false,
      error: 'Cannot access a chrome:// URL'
    })
  })

  it('reports an empty screenshot', async () => {
    const tabs = { captureVisibleTab: vi.fn(async () => '') }
    expect((await captureVisibleTab(tabs, 1)).ok).toBe(false)
  })
})
