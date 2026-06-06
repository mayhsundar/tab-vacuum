# Privacy Policy — Tab Vacuum

**Effective date:** 2026-06-07
**Last updated:** 2026-06-07

## Plain English summary

Tab Vacuum does not collect, store, transmit, sell, or share any of your data.
There is no server. Everything runs inside your browser, only when you click
the extension icon.

## What the extension reads

When you click the Tab Vacuum toolbar icon, the extension reads the URLs of
your currently open tabs in order to:

1. Identify duplicate URLs.
2. Move surviving tabs into one window.
3. Group remaining tabs by hostname.

That's all it does with tab URLs. They are never logged, exported, sent over
the network, or persisted to disk by the extension.

## What the extension does NOT do

- ❌ No analytics, telemetry, or crash reporting.
- ❌ No accounts, sign-in, or syncing.
- ❌ No background data collection (the code only runs when you click).
- ❌ No third-party services, ads, or trackers.
- ❌ No reading of page content — only the tab URL itself.
- ❌ No reading of tabs from incognito windows unless you explicitly enable it.

## Permissions used

| Permission | Why it's required |
|---|---|
| `tabs` | To read tab URLs (to find duplicates) and to close duplicates / move tabs between windows. |
| `tabGroups` | To create, label, and collapse tab groups by website hostname. |

These permissions are used **only in direct response to you clicking the
extension icon**. The extension does nothing in the background.

## Data sharing

Tab Vacuum does not share data with anyone, because Tab Vacuum does not
collect data in the first place.

## Children

Tab Vacuum does not knowingly collect any data from anyone, including
children under 13.

## Changes to this policy

If this policy ever changes, the updated version will be published in this
repository and a new "Last updated" date will be set above.

## Source code

Tab Vacuum is open source. You can verify everything in this policy by
reading the code:

- [`manifest.json`](manifest.json)
- [`background.js`](background.js)

## Contact

Questions? Open an issue: https://github.com/YOUR-USERNAME/tab-vacuum/issues
Or email: YOUR-EMAIL@example.com
