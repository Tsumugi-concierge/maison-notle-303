Summary of 6-Language i18n Integration

Work completed on branch feat/i18n-6lang (no PR created, no changes pushed to main).

What was done
- Implemented a single-URL, single-HTML-per-page i18n solution across the site using shared assets:
  - assets/i18n.js
  - assets/i18n.css
- Added a language switcher to every page via a [data-i18n-switcher] container. The switcher:
  - Persists the selected language in localStorage
  - Defaults to the browser language on first visit (among en/ja/zh/ko/fr/es), otherwise English
  - Applies page translations from window.I18N_STRINGS and updates on change (dispatches i18n:change)
- Kept all URLs unchanged; no per-language page copies were created.
- Converted all pages to use data-i18n text keys and provided per-page window.I18N_STRINGS mappings.
- Where pages had existing ad-hoc language code, it was left in place where harmless and wired into the shared i18n (window.I18N_STRINGS and optional window.I18N_ON_CHANGE) to minimize invasive changes.

Pages converted
- /index.html (root)
- /access/index.html
- /taxi/index.html
- /how-to-open/index.html
- /house-rules/index.html
- /equipment/index.html
- /trash/index.html
- /nearby-shops/index.html
- /gas-reset/index.html
- /emergency/index.html
- /parking/index.html

Notable implementation details
- Root page index.html:
  - Replaced the hardcoded language button bar with the shared switcher and included assets/i18n.js and assets/i18n.css.
  - Exposed translations via window.I18N_STRINGS and synced on language change via window.I18N_ON_CHANGE.
  - Removed the in-tile duplicate Japanese subtitles so a single data-i18n label is used per tile.
  - Wi‑Fi password is no longer embedded (see Flags below). The QR toggle shows an informational toast if password isn’t present.
- Subpages:
  - Replaced local language bars with a [data-i18n-switcher] host and included ../assets/i18n.js and ../assets/i18n.css.
  - Hooked existing per-page translation objects up to window.I18N_STRINGS so the shared script manages text updates.
  - access/: added a missing Step 5 key and translations so the final caption is localized.
  - equipment/: preserved dynamic rendering from a multilingual SECTIONS model. Added window.I18N_ON_CHANGE to re-render on language changes.
  - parking/: added minimal i18n keys for title and back-to-menu.

Flags (sensitive information removed)
- Wi‑Fi password and any copy/QR behavior that would expose it have been removed from index.html. The password value is omitted and replaced with an informational message: guests are directed to booking messages. The QR button displays an informational toast when no password is present.
- No other key numbers, lock codes, keybox codes, or similar access codes were found in source content. If any are introduced later, they should be omitted from the pages and handled via guest messaging.

Site-specific note (kept as requested)
- There was an uncommitted change in index.html that removed an embedded chat section. That removal was preserved; nothing was reintroduced.

Storage and defaults
- Selected language is stored under localStorage key i18n.lang by assets/i18n.js.
- On first visit, browser language is used when it matches one of: en, ja, zh, ko, fr, es; otherwise English.

Next steps (optional)
- If desired, translate document <title> tags and meta descriptions using the same I18N_STRINGS dictionaries for improved SEO. Currently, visible content is localized; <title> remains English unless a specific requirement is added.

Git Repair Notes (2026-11-22)
- Backed up modified files to .backup-maison303-i18n-20261122/ and saved a unified diff to .maison303-i18n-20261122.patch in the original clone. Both paths added to .git/info/exclude.
- git fsck timed out once on the original clone; .git/objects/pack was empty; .git/HEAD was valid.
- Confirmed remote branch: origin/feat/i18n-6lang at e2aedcdc3 via git ls-remote.
- Original clone had index/object corruption blocking commit (invalid object under equipment/assets/pdf-pages). Created a clean nested clone at .reclone-maison303-20261122 and checked out feat/i18n-6lang.
- Reapplied the 6-language edits for SUMMARY.md, emergency/, equipment/, house-rules/, nearby-shops/ here.
- Committed and pushed to origin/feat/i18n-6lang; verified remote head matches the new commit with git ls-remote.
