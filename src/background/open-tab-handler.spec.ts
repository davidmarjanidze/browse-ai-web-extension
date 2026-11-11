import { isOpenTabRequest, openTab } from './open-tab-handler'

describe('open tab handler', () => {
  it('recognizes open-tab requests', () => {
    expect(isOpenTabRequest({ type: 'OPEN_TAB', url: 'https://a.test' })).toBe(
      true
    )
    expect(isOpenTabRequest({ type: 'OPEN_TAB' })).toBe(false)
    expect(isOpenTabRequest({ type: 'CAPTURE_VISIBLE_TAB' })).toBe(false)
  })

  it('opens http links next to the sender tab, in the background by default', async () => {
    const create = vi.fn(async () => ({}))
    const result = await openTab(
      { create },
      { type: 'OPEN_TAB', url: 'https://a.test/x' },
      { index: 2, id: 7, windowId: 1 }
    )
    expect(result).toEqual({ ok: true })
    expect(create).toHaveBeenCalledWith({
      url: 'https://a.test/x',
      active: false,
      index: 3,
      openerTabId: 7,
      windowId: 1
    })
  })

  it('refuses other schemes and reports errors', async () => {
    const create = vi.fn(async () => {
      throw new Error('nope')
    })
    expect(
      await openTab(
        { create },
        { type: 'OPEN_TAB', url: 'javascript:alert(1)' },
        undefined
      )
    ).toEqual({ ok: false, error: 'Only http and https links can be opened.' })
    expect(
      await openTab(
        { create },
        { type: 'OPEN_TAB', url: 'https://a.test' },
        undefined
      )
    ).toEqual({ ok: false, error: 'nope' })
  })
})
