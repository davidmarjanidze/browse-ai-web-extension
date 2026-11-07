# Architecture

BrowseAI has three parts: a content script that shows the chat, a background
service worker that takes screenshots, and a static toolbar popup. Everything
the user sees in the chat comes from the `browse-ai-core` package.

```text
web page
└── <browse-ai-extension>            content script (main.js)
    └── shadow root
        └── BrowseAiCoreComponent    from browse-ai-core/angular
              │  chrome.storage.local   settings, personalization, bookmarks
              │  LanguageModel          Gemini Nano (Prompt API)
              └─ runtime.sendMessage ──► background/background.js
                 { type: 'CAPTURE_VISIBLE_TAB' }   chrome.tabs.captureVisibleTab
                 ◄── { ok, dataUrl } or { ok: false, error }
```

## Repo layout

| Path                                | Contents                                                             |
| ----------------------------------- | -------------------------------------------------------------------- |
| `src/main.ts`                       | Content script entry. Calls `mountBrowseAi()` once the DOM is ready. |
| `src/content/mount.ts`              | Creates the host element and mounts the Angular component.           |
| `src/content/extension-config.ts`   | The `BrowseAiCoreConfig` the extension uses.                         |
| `src/background/background.ts`      | Service worker. Listens for screenshot requests.                     |
| `src/background/capture-handler.ts` | Takes the screenshot and builds the response.                        |
| `public/manifest.json`              | The extension manifest.                                              |
| `public/popup.html`                 | Toolbar popup with short usage notes. No script.                     |
| `images/`                           | Icons and the README screenshots.                                    |
| `publish.sh`                        | Runs the tests and builds the store zip.                             |

## Content script

The manifest injects `main.js` into every page (`<all_urls>`) at `document_end`.
`mountBrowseAi()`:

1. Returns early if a `<browse-ai-extension>` element is already on the page, so
   the chat is never added twice.
2. Appends `<browse-ai-extension>` to `document.body`.
3. Creates an Angular application with `createApplication()` and
   `provideBrowseAiCore(EXTENSION_CONFIG)`.
4. Creates `BrowseAiCoreComponent` on that host element with `createComponent()`
   and attaches it to the application.

The component uses `ViewEncapsulation.ShadowDom`, so the page's CSS doesn't
reach the chat and the chat's CSS doesn't reach the page.

The host tag is `browse-ai-extension`, not `browse-ai-core`. A page that uses
the package's custom element itself keeps working, and the two never upgrade
each other.

The content script is built by the Angular application builder
(`@angular/build:application`, browser entry `src/main.ts`) as one `main.js`
file without hashes, because the manifest points to that name.

## Background service worker

`background/background.js` is a module service worker compiled from
`src/background/` with `tsc -p tsconfig.background.json`. It is not part of the
Angular build.

It handles one message. When the chat sends `{ type: 'CAPTURE_VISIBLE_TAB' }`,
the worker calls `chrome.tabs.captureVisibleTab` for the sender's window as a
PNG and answers with `{ ok: true, dataUrl }`, or `{ ok: false, error }` when the
capture fails. Other messages are ignored.

The package's default screen capture adapter sends this message whenever it runs
inside an extension, so no extra wiring is needed on the chat side.

## Storage

The package's default storage adapter uses `chrome.storage.local` when the
extension API is available. The extension sets `storageKey` to `_browseAIV2`.
Settings, personalization and AI bookmarks are saved under that key as one JSON
value. Nothing else is stored.

## AI model

The chat uses the package's default AI provider, which calls Chrome's Prompt API
(`LanguageModel`, Gemini Nano). All prompts run on the device. If the model
isn't downloaded yet, the chat shows a download button.

## Permissions

| Permission        | Why                                                       |
| ----------------- | --------------------------------------------------------- |
| `storage`         | Save settings, personalization and AI bookmarks locally.  |
| `activeTab`       | Take a screenshot of the current tab after a user action. |
| host `<all_urls>` | Show the chat and read the page on any site.              |

## Dependencies

- `browse-ai-core`: the chat (Angular entry `browse-ai-core/angular`).
- Angular 22 (`@angular/core`, `common`, `compiler`, `forms`,
  `platform-browser`) and `rxjs`, needed because the chat is mounted as a native
  Angular component.
- Dev: Angular CLI and build, TypeScript, Vitest with jsdom, `@types/chrome`,
  Prettier.
