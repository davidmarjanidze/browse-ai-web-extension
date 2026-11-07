# BrowseAI docs

BrowseAI is a Chrome extension (Manifest V3) that adds an AI chat to every web
page. It runs on Chrome's built-in model (Gemini Nano). The chat UI and logic
come from the [browse-ai-core](https://www.npmjs.com/package/browse-ai-core) npm
package. This repo mounts the package in Chrome and adds the parts only an
extension can do.

| File                                   | What it covers                                   |
| -------------------------------------- | ------------------------------------------------ |
| [architecture.md](architecture.md)     | Parts of the extension and how they talk         |
| [features.md](features.md)             | What users get and how the extension is set up   |
| [decisions.md](decisions.md)           | Architecture decisions and why they were made    |
| [development.md](development.md)       | Setup, commands, tests, updating the package     |
| [release.md](release.md)               | Versioning, building the zip, store submission   |
| [privacy-policy.md](privacy-policy.md) | The privacy policy linked from the store listing |

The package has its own docs in the
[browse-ai-core repo](https://github.com/davidmarjanidze/browse-ai-core/tree/main/docs).
