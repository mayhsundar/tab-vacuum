# Changelog

All notable changes to Tab Vacuum will be documented here. Format roughly follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) with [SemVer](https://semver.org/) versioning.

## [Unreleased]

### Fixed
- Pinned tabs could be closed as duplicates when an unpinned copy of the same URL was in an earlier window (#2). Pinned tabs are now always kept, claim their URL before deduping, stay pinned when merged into the clicked window (moving one used to unpin it), and are skipped when grouping.

### Changed
- Tabs in non-normal windows (PWAs running in their own window, popups, devtools) are no longer closed, moved or grouped (#1). Unpinned duplicates of their pages in normal windows are still removed.

## [1.1.0] — 2026-06-19

### Added
- **"Current window only" toggle** in a new options page (right-click the toolbar icon → Options). When enabled, Tab Vacuum dedupes and groups only within the window you click in, leaving other windows untouched.
- `chrome.storage.local`-backed preference persistence (single boolean, never transmitted, never synced).
- New manifest permission: `storage` — used solely for the preference above.

### Changed
- Default behavior is **unchanged** — Tab Vacuum still acts on every open Chrome window unless you explicitly turn the new toggle on. Existing users see no difference.
- `manifest.json` `name` field corrected from "Clean Tabs" (a leftover from the prototype) to "Tab Vacuum" — matches the Chrome Web Store listing and the toolbar tooltip you actually see post-install.
- `default_title` updated to "Tab Vacuum — clean duplicate tabs" for consistency.

### Files added
- `options.html` (~60 lines, dark theme matching brand)
- `options.js` (9 lines)

### Notes
- The "no settings" claim in earlier marketing has been softened to "one optional toggle" — that's now the literal truth.
- All preferences stay on your device. Nothing syncs to a Google account or any server. The privacy story is intact.

## [1.0] — 2026-06-07

### Initial release
- ~50 lines of vanilla JavaScript, MIT licensed
- Click toolbar icon → removes every duplicate tab across all open Chrome windows (matched by URL)
- Surviving tabs merge into the window where you clicked
- Remaining tabs auto-grouped by hostname, collapsed by default
- Two permissions: `tabs`, `tabGroups`
- No background activity, no network calls, no analytics, no accounts
