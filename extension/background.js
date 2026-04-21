chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'https://bridge-ai-brown.vercel.app/dashboard?tab=extension' });
  }
});

// Securely capture auth token from the website and persist it
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.action === 'STORE_AUTH' && request.token) {
    chrome.storage.local.set({ 
      bridge_token: request.token,
      bridge_user: request.user 
    }, () => {
      console.log('BridgeAI: Identity secured in Sovereign Vault.');
      sendResponse({ success: true });
    });
    return true;
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
