chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://bridgeai-realworld-problem.vercel.app/dashboard?tab=extension' });
  }
  
  chrome.contextMenus.create({
    id: "bridgeai-share",
    title: "Share Context via Bridge AI",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "bridgeai-chatgpt",
    parentId: "bridgeai-share",
    title: "ChatGPT",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "bridgeai-gemini",
    parentId: "bridgeai-share",
    title: "Gemini",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "bridgeai-claude",
    parentId: "bridgeai-share",
    title: "Claude",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("bridgeai-")) {
    const text = info.selectionText;
    if (!text) return;

    chrome.storage.local.set({ pending_bridge: text }, () => {
      if (info.menuItemId === "bridgeai-chatgpt") {
        chrome.tabs.create({ url: "https://chatgpt.com/" });
      } else if (info.menuItemId === "bridgeai-gemini") {
        chrome.tabs.create({ url: "https://gemini.google.com/" });
      } else if (info.menuItemId === "bridgeai-claude") {
        chrome.tabs.create({ url: "https://claude.ai/new" });
      }
    });
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

  if (request.action === 'RELOAD_EXTENSION') {
    chrome.runtime.reload();
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
