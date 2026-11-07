# Release

## Version

The version is in two files and they must match:

- `package.json` → `version`
- `public/manifest.json` → `version` (the one Chrome and the store use)

Each release gets a `release/<version>` branch and a `<version>` tag:

```console
git checkout -b release/1.4.0
git push --set-upstream origin release/1.4.0
git tag -a 1.4.0 -m "Release 1.4.0"
git push origin 1.4.0
```

## Build the zip

```console
./publish.sh
```

It runs `npm test`, then `npm run build:extension`, which compiles the worker,
makes a production build in `dist/browse-ai` and zips it into
`browseai-extension.zip`. `manifest.json` is at the root of the zip, as the
store requires.

Before uploading, load `dist/browse-ai` unpacked and check on a few sites that
the chat opens, answers, captures a screenshot, fills a form and extracts a
table, with no errors in the console.

## Submit to the Chrome Web Store

You need a Chrome Web Store developer account (one-time $5 registration).

1. Open the
   [developer dashboard](https://chrome.google.com/webstore/devconsole).
2. For a new item click **Create new item**; for an update open the item and go
   to **Package**. Upload `browseai-extension.zip` and fix any errors the
   dashboard reports.
3. **Store listing**: name "BrowseAI", short description "Your AI Assistant for
   Every Page", the full description (kept up to date in the dashboard),
   category Productivity, language English.
4. Images:
   - Icon: 128×128 PNG (`images/icon/icon-128.png`).
   - At least one screenshot, up to five, 1280×800 (`images/demo/` has
     screenshots to resize).
   - Promotional tile if wanted.
5. **Privacy practices**: check that the answers still match
   [privacy-policy.md](privacy-policy.md). The privacy policy URL points to that
   file on GitHub.
6. Click **Submit for review**. Review usually takes 1–3 days, and the result
   comes by email.

If the review asks for changes, fix them, bump the version in both files, build
a new zip and upload it to the same item.

## Checklist

- [ ] Version bumped in `package.json` and `public/manifest.json`.
- [ ] `browse-ai-core` is a published version from npm, not a local path.
- [ ] `./publish.sh` passes.
- [ ] Manual check in Chrome done.
- [ ] Permissions in the manifest match the dashboard's permission
      justifications and [privacy-policy.md](privacy-policy.md).
- [ ] Listing text matches what the extension does.
- [ ] Release branch and tag pushed.

## Icons

Icons were made with https://www.appicongenerator.ad. The build copies the PNGs
in `images/icon/` (16, 32, 48 and 128 px) to `icons/` in `dist/browse-ai`, where
`manifest.json` expects them.
