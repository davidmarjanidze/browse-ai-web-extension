import type { ApplicationConfig, ApplicationRef, Type } from '@angular/core'
import { createComponent } from '@angular/core'
import { createApplication } from '@angular/platform-browser'
import {
  BrowseAiCoreComponent,
  provideBrowseAiCore
} from 'browse-ai-core/angular'
import { EXTENSION_CONFIG, EXTENSION_HOST_TAG } from './extension-config'

export interface MountOptions {
  document?: Document
  createApp?: (config: ApplicationConfig) => Promise<ApplicationRef>
  component?: Type<unknown>
}

/**
 * Adds the chat to the page once. Content scripts can't define custom
 * elements, so the Angular component is attached to a plain host element.
 * Returns the host, or null if the chat is already on the page.
 */
export async function mountBrowseAi(
  options: MountOptions = {}
): Promise<HTMLElement | null> {
  const doc = options.document ?? document
  if (doc.querySelector(EXTENSION_HOST_TAG)) return null

  const host = doc.createElement(EXTENSION_HOST_TAG)
  doc.body.appendChild(host)

  const app = await (options.createApp ?? createApplication)({
    providers: [provideBrowseAiCore(EXTENSION_CONFIG)]
  })
  const component = createComponent(
    options.component ?? BrowseAiCoreComponent,
    {
      environmentInjector: app.injector,
      hostElement: host
    }
  )
  app.attachView(component.hostView)
  return host
}
