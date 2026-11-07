# Development

## Requirements

- Node.js and npm (the package uses Angular 22, TypeScript 6).
- Desktop Chrome with the built-in AI model available, to try the chat for real.

## Setup

```console
npm install
./claude/scripts/install.sh   # once per clone: git hooks
```

## Commands

| Command                    | What it does                                                       |
| -------------------------- | ------------------------------------------------------------------ |
| `npm start`                | Builds the worker, then rebuilds `dist/browse-ai` on every change. |
| `npm test`                 | Unit tests (Vitest through `ng test`, jsdom).                      |
| `npm run build`            | Builds the worker and the content script.                          |
| `npm run build:extension`  | Production build and `browseai-extension.zip`.                     |
| `npm run build:background` | Compiles `src/background/` to `public/background/`.                |
| `npm run prettier`         | Formats every file.                                                |
| `./publish.sh`             | Runs the tests, then `build:extension`.                            |

## Load the extension

1. Run `npm start`.
2. Open `chrome://extensions` and turn on developer mode.
3. Click **Load unpacked** and pick `dist/browse-ai`.
4. After a rebuild, click the reload icon on the extension card and reload the
   page.

## Tests

`npm test` runs the specs next to the code:

- `src/content/mount.spec.ts`: the host element is added once and the component
  is mounted with the extension config.
- `src/background/*.spec.ts`: screenshot messages are answered, other messages
  are ignored, and capture errors become `{ ok: false, error }`.

The chat itself is tested in the package repo.

## Changing the chat

Chat changes go into the `browse-ai-core` repo (`../browse-ai-core`), not here.
To try a change in the extension before it is published:

```console
cd ../browse-ai-core && npm run build
cd ../browse-ai && npm install ../browse-ai-core/dist/browse-ai-core
npm start
```

When the change is published, install the released version so `package.json` and
the lockfile point to npm again:

```console
npm install browse-ai-core@^<version>
```

A new version can take a few minutes to become installable after it's published.

## Code style

- Angular rules (signals APIs, `inject()`, `#private` fields, separate `.html`
  templates) are in `CLAUDE.md`.
- Prettier settings are in `.prettierrc`.
- Each source file stays under about 5,000 tokens (~20 KB). A pre-commit hook
  checks this.
- Commits use Conventional Commits, for example
  `fix: keep the chat mounted after navigation`.
