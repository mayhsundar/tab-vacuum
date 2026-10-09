# Tab Vacuum

> **One click — remove duplicate tabs across all Chrome windows and group what's left by website.**

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-4285F4?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/tab-vacuum/apdjhdjcejehjiomcolfgfgjhaedoieb)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Size](https://img.shields.io/badge/code-~50%20lines-brightgreen)](background.js)

![Tab Vacuum demo](docs/demo.gif)

Drowning in 4 windows × 80 tabs, half of them duplicates of the same Stack Overflow page? Tab Vacuum is a 1-click fix.

## What it does

Click the toolbar icon and instantly:

1. **Removes every duplicate tab** across all your Chrome windows (matched by URL)
2. **Merges the survivors** into one window
3. **Groups the result by website** (collapsed, so you only see hostnames)

That's it. ~50 lines of code. No accounts, no tracking. One optional toggle (current window only vs. all windows — defaults to all).

## Install

- **From Chrome Web Store:** https://chromewebstore.google.com/detail/tab-vacuum/apdjhdjcejehjiomcolfgfgjhaedoieb
- **From source (developer mode):**
  1. Clone this repo: `git clone https://github.com/mayhsundar/tab-vacuum.git`
  2. Open `chrome://extensions`
  3. Enable **Developer mode** (top right)
  4. Click **Load unpacked** → select this folder
  5. Pin the Tab Vacuum icon to your toolbar

## Why it's different

| | Tab Vacuum | OneTab | Workona | Toby |
|---|---|---|---|---|
| Removes duplicates across windows | ✅ | ❌ | ❌ | ❌ |
| Groups remaining tabs by site | ✅ | ❌ | Manual | Manual |
| Works in 1 click | ✅ | ❌ | ❌ | ❌ |
| Free, no account | ✅ | ✅ | ❌ | ❌ |
| Code is auditable | ✅ (50 lines) | ❌ | ❌ | ❌ |
| Sends data anywhere | ❌ Never | ❌ | ✅ Cloud sync | ✅ Cloud sync |

## How it works (the whole source)

```js
chrome.action.onClicked.addListener(async (tab) => {
  const { currentWindowOnly = false } = await chrome.storage.local.get("currentWindowOnly");
  const queryFilter = currentWindowOnly ? { windowId: tab.windowId } : {};

  const tabs = await chrome.tabs.query(queryFilter);
  const seen = new Map();
  const dupes = [];
  for (const t of tabs) {
    if (seen.has(t.url)) dupes.push(t.id);
    else seen.set(t.url, t.id);
  }
  if (dupes.length) await chrome.tabs.remove(dupes);

  if (!currentWindowOnly) {
    const keep = await chrome.tabs.query({});
    const moveIds = keep.filter((t) => t.windowId !== tab.windowId).map((t) => t.id);
    if (moveIds.length) await chrome.tabs.move(moveIds, { windowId: tab.windowId, index: -1 });
  }

  const all = await chrome.tabs.query({ windowId: tab.windowId });
  const byHost = new Map();
  for (const t of all) {
    let host;
    try { host = new URL(t.url).hostname; } catch { continue; }
    if (!host) continue;
    if (!byHost.has(host)) byHost.set(host, []);
    byHost.get(host).push(t.id);
  }
  for (const [host, ids] of byHost) {
    if (ids.length < 2) continue;
    const groupId = await chrome.tabs.group({ tabIds: ids, createProperties: { windowId: tab.windowId } });
    await chrome.tabGroups.update(groupId, { title: host, collapsed: true });
  }
});
```

Plus a 9-line `options.js` that reads/writes the `currentWindowOnly` toggle.

That's the whole extension. Nothing hidden. [See manifest.json](manifest.json).

## Privacy

Tab Vacuum reads tab URLs **only when you click the icon**, **only on your device**, and **never sends anything anywhere**. There's no server. Full policy: [PRIVACY.md](PRIVACY.md).

## FAQ

**Q: How do I remove duplicate tabs in Chrome?**
Install Tab Vacuum, click the toolbar icon. Done.

**Q: Does it work across multiple Chrome windows?**
Yes — that's the whole point. It dedupes across all open windows, then merges survivors into the window where you clicked.

**Q: Can I limit it to only the current window?**
Yes. Right-click the Tab Vacuum icon → **Options** → toggle on **Current window only**. By default it acts on every open window (the magic-mode behavior). With the toggle on, only the window you clicked in is touched. Setting is stored locally and never syncs.

**Q: Will it close pinned tabs?**
Pinned tabs are kept, regardless of which window they're in; only unpinned duplicates of them are removed. When merging windows, pinned tabs are moved along with the rest and stay pinned. They are left out of grouping.

**Q: Will it touch PWAs (installed web apps) running in their own window?**
No. Any window that isn't a normal browser window (PWAs opened as app windows, popups, devtools) is left alone: its tabs are not closed, moved or grouped. Unpinned duplicates of a PWA's page in normal windows are removed. A PWA configured to open in a regular tab is just a tab, so it is treated like any other.

**Q: Tab Vacuum is adding entries to my bookmarks bar — why?**
Tab Vacuum doesn't touch bookmarks. It doesn't even request the `bookmarks` permission ([see manifest.json](manifest.json)). What you're seeing is Chrome's **Saved Tab Groups** feature (default-on since Chrome 126), which surfaces every tab group as an entry in the bookmarks bar. Disable it at `chrome://settings` → search "tab groups" → turn off "Show saved tab groups in bookmarks bar". Or per-group: right-click the colored group label and uncheck **Save group**.

**Q: What happens to tabs without a URL (loading, blank)?**
Tabs with empty/blank URLs are treated as distinct and kept.

**Q: Does it sync, save, or back up my tabs?**
No. It does not store anything. If you want session backup, use Chrome's built-in History or a session manager.

**Q: Why so simple? Will you add features?**
The simplicity is the feature. Anything you add (filters, exceptions, sync) makes it slower and scarier. The 50-line version is intentional.

**Q: Is it really free?**
Yes — free forever, no ads, no premium tier, no upsell. Code is MIT-licensed.

**Q: How do I group tabs by website manually?**
You don't need to — Tab Vacuum does it for you, by hostname, every click.

## Contributing

Issues and PRs welcome. Keep the spirit: **minimal code, no dependencies, no settings UI unless absolutely necessary**.

## License

[MIT](LICENSE) — do whatever you want.

---

If Tab Vacuum saved you from tab purgatory, a ⭐ on this repo and a review on the Chrome Web Store goes a long way.
