chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://bridgeai-realworld-problem.vercel.app/dashboard?tab=extension' });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'OPEN_SIDEPANEL') {
    chrome.sidePanel.setOptions({
      tabId: sender.tab.id,
      path: 'sidepanel.html',
      enabled: true
    });
    chrome.sidePanel.open({ tabId: sender.tab.id });
  }

  if (request.action === 'VAULT_UPDATED') {
    // Broadcast to all BridgeAI tabs to refresh their dashboard
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && (
            tab.url.includes('bridgeai-realworld-problem') || 
            tab.url.includes('localhost:5173') ||
            tab.url.includes('localhost:5001')
        )) {
          chrome.tabs.sendMessage(tab.id, { action: 'VAULT_UPDATED' }).catch(() => {});
        }
      });
    });
  }
});

// Real-Time External Sync (Direct Link from Website)
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.action === 'STORE_AUTH') {
    const data = {};
    if (request.token) data.bridge_token = request.token;
    if (request.user) data.bridge_user = request.user;
    
    chrome.storage.local.set(data, () => {
      console.log('BridgeAI: Sovereign Identity Sync Complete.');
      sendResponse({ success: true });
    });
    return true; // Keep channel open for async response
  }
  if (request.action === 'RELOAD_EXTENSION') {
    console.log('BridgeAI: Receiving Sovereign Pulse — Reloading Protocol...');
    chrome.runtime.reload();
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
