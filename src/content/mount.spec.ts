import { ApplicationRef, Component } from '@angular/core'
import { createApplication } from '@angular/platform-browser'
import {
  EXTENSION_CONFIG,
  EXTENSION_HOST_TAG,
  EXTENSION_STORAGE_KEY
} from './extension-config'
import { mountBrowseAi } from './mount'

@Component({ selector: 'test-chat', template: '<p>chat</p>' })
class FakeChatComponent {}

describe('mountBrowseAi', () => {
  const apps: ApplicationRef[] = []
  const createApp = async (config: Parameters<typeof createApplication>[0]) => {
    const app = await createApplication(config)
    apps.push(app)
    return app
  }

  afterEach(() => {
    apps.splice(0).forEach((app) => app.destroy())
    document.body.innerHTML = ''
  })

  it('adds one host element and renders the chat into it', async () => {
    const host = await mountBrowseAi({
      createApp,
      component: FakeChatComponent
    })
    expect(host?.tagName.toLowerCase()).toBe(EXTENSION_HOST_TAG)
    apps[0].tick()
    expect(host?.textContent).toContain('chat')
  })

  it('does nothing when the chat is already on the page', async () => {
    await mountBrowseAi({ createApp, component: FakeChatComponent })
    expect(
      await mountBrowseAi({ createApp, component: FakeChatComponent })
    ).toBeNull()
    expect(document.querySelectorAll(EXTENSION_HOST_TAG)).toHaveLength(1)
  })

  it('passes the extension config to the chat', async () => {
    let providers: unknown[] = []
    await mountBrowseAi({
      component: FakeChatComponent,
      createApp: (config) => {
        providers = config.providers ?? []
        return createApp(config)
      }
    })
    expect(providers).toHaveLength(1)
  })
})

describe('extension config', () => {
  it('keeps the 1.x storage key and turns bookmarks on', () => {
    expect(EXTENSION_CONFIG.storageKey).toBe(EXTENSION_STORAGE_KEY)
    expect(EXTENSION_CONFIG.features?.bookmarks).toBe(true)
    expect(EXTENSION_CONFIG.mode).toBe('drawer')
  })

  it('does not use the package element tag', () => {
    expect(EXTENSION_HOST_TAG).not.toBe('browse-ai-core')
  })
})
