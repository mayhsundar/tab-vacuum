chrome.action.onClicked.addListener(async (tab) => {
  const tabs = await chrome.tabs.query({});
  const seen = new Map();
  const dupes = [];
  for (const t of tabs) {
    if (seen.has(t.url)) dupes.push(t.id);
    else seen.set(t.url, t.id);
  }
  if (dupes.length) await chrome.tabs.remove(dupes);

  const keep = await chrome.tabs.query({});
  const moveIds = keep.filter((t) => t.windowId !== tab.windowId).map((t) => t.id);
  if (moveIds.length) await chrome.tabs.move(moveIds, { windowId: tab.windowId, index: -1 });

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
