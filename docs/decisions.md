# Decisions

Each entry records a decision that shapes the extension, the reason for it and
what it costs. Decisions about the chat itself are in the
[browse-ai-core docs](https://github.com/davidmarjanidze/browse-ai-core/blob/main/docs/decisions.md).

## 1. The chat lives in the browse-ai-core package

**Decision:** All chat UI and logic is in the `browse-ai-core` npm package. This
repo only mounts it and adds the Chrome-only parts (background worker, manifest,
popup).

**Why:** The same chat is used on normal web sites and in Angular, React and Vue
apps. One codebase serves all of them, and the extension gets every fix by
updating the package version.

**Cost:** A change to the chat needs a package release before it reaches the
extension. For local testing the package can be installed from its `dist` folder
(see [development.md](development.md)).

## 2. Mount the native Angular component, not the custom element

**Decision:** The content script creates an Angular application and attaches
`BrowseAiCoreComponent` from `browse-ai-core/angular` to a plain host element.

**Why:** Content scripts run in an isolated world where `customElements` is not
available, so the `<browse-ai-core>` element can't be registered there.

**Cost:** The extension bundles Angular itself and depends on the Angular
version the package supports (22).

## 3. Host tag `browse-ai-extension`

**Decision:** The chat is mounted on `<browse-ai-extension>`, not
`<browse-ai-core>`.

**Why:** A page that already uses the package's custom element must not have its
element taken over by the extension, or the other way round. The tag is also
used to make sure the chat is mounted only once per page.

## 4. Screenshots come from the background worker

**Decision:** Screenshots are taken in the service worker with
`chrome.tabs.captureVisibleTab`. The chat asks for one with
`{ type: 'CAPTURE_VISIBLE_TAB' }`.

**Why:** Content scripts can't call `chrome.tabs`. With `activeTab` the capture
needs no prompt and no screen sharing dialog. The message format is the one the
package's default capture adapter already sends inside an extension, so the
extension needs no custom adapter.

**Cost:** The worker is built separately with `tsc`.

## 5. Settings stored under `_browseAIV2`

**Decision:** `storageKey` is `_browseAIV2` in `chrome.storage.local`.

**Why:** Users who already have saved settings and bookmarks under this key keep
them. The package reads that data and turns it into its own format.

## 6. Smallest set of permissions

**Decision:** Only `storage` and `activeTab`, plus host access to `<all_urls>`.
No `tabs`, no `scripting`, no remote code.

**Why:** Each permission is shown to users and reviewed by the Chrome Web Store.
These are enough for every feature: the content script is declared in the
manifest, and screenshots need only `activeTab`.

## 7. Everything runs on the device

**Decision:** The extension uses Chrome's built-in model and sends nothing to a
server. There is no analytics.

**Why:** Pages and prompts can be private. This is also what the privacy policy
and the store listing promise, so any change here needs both updated.
