chrome.action.onClicked.addListener(async (tab) => {
  const { currentWindowOnly = false } = await chrome.storage.local.get("currentWindowOnly");
  const queryFilter = currentWindowOnly ? { windowId: tab.windowId } : {};

  // Installed PWAs opened in their own window report type "app" (not returned by default).
  // Treat every non-"normal" window (PWAs, popups, devtools) as off limits.
  const windows = await chrome.windows.getAll({ windowTypes: ["normal", "popup", "app", "devtools"] });
  const protectedWindowIds = new Set(windows.filter((w) => w.type !== "normal").map((w) => w.id));
  const isProtected = (t) => t.pinned || protectedWindowIds.has(t.windowId);

  // Protected tabs are never closed, and claim their URL first so that
  // unprotected duplicates of them are the ones removed.
  const tabs = await chrome.tabs.query(queryFilter);
  const seen = new Map();
  for (const t of tabs) {
    if (isProtected(t) && !seen.has(t.url)) seen.set(t.url, t.id);
  }
  const dupes = [];
  for (const t of tabs) {
    if (isProtected(t)) continue;
    if (seen.has(t.url)) dupes.push(t.id);
    else seen.set(t.url, t.id);
  }
  if (dupes.length) await chrome.tabs.remove(dupes);

  if (!currentWindowOnly) {
    const keep = await chrome.tabs.query({});
    const moving = keep.filter((t) => t.windowId !== tab.windowId && !protectedWindowIds.has(t.windowId));
    if (moving.length) {
      await chrome.tabs.move(moving.map((t) => t.id), { windowId: tab.windowId, index: -1 });
      // Moving a pinned tab to the end of another window unpins it, so pin it again.
      for (const t of moving) {
        if (t.pinned) await chrome.tabs.update(t.id, { pinned: true });
      }
    }
  }

  const all = await chrome.tabs.query({ windowId: tab.windowId });
  const byHost = new Map();
  for (const t of all) {
    if (t.pinned) continue; // grouping would unpin it
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
