#!/bin/bash
# Builds BrowseAI and creates browseai-extension.zip for the Chrome Web Store.
set -e

npm test
npm run build:extension

echo "Created browseai-extension.zip (manifest.json is at the root of the zip)."
echo "Upload it in the Chrome Web Store developer dashboard. See docs/release.md."
