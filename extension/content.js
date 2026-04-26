/**
 * BridgeAI - Content Script
 * Universal LLM Extraction Logic
 */

const EXTRACTORS = {
  chatgpt: {
    messageSelector: 'article, [data-testid^="conversation-turn-"]',
    authorSelector: '[data-message-author-role]'
  },
  gemini: {
    messageSelector: 'message-content, .message-content, .chat-element',
    authorSelector: '.author-name'
  },
  claude: {
    messageSelector: '.font-claude-message',
    authorSelector: '.nickname'
  },
  mistral: {
    messageSelector: '[class*="chat-message"]',
    authorSelector: '[class*="message-author"]'
  },
  deepseek: {
    messageSelector: '[class*="ds-message"]',
    authorSelector: '[class*="ds-message-author"]'
  },
  poe: {
    messageSelector: '[class*="Message_column"]',
    authorSelector: '[class*="Message_botName"]'
  },
  universal: {
    // Enhanced universal selector for any content-rich website or custom LLM UI
    messageSelector: 'article, main, .content, #content, .post, .message, [class*="message"], [class*="content"], [class*="body"], [class*="article"], p, li, td',
    dataSelector: 'input[type="text"], input[type="email"], textarea, select'
  }
};

function getPlatform() {
  const host = window.location.hostname;
  if (host.includes('chatgpt') || host.includes('openai')) return 'chatgpt';
  if (host.includes('gemini') || host.includes('google')) return 'gemini';
  if (host.includes('claude')) return 'claude';
  if (host.includes('perplexity')) return 'perplexity';
  if (host.includes('mistral')) return 'mistral';
  if (host.includes('deepseek')) return 'deepseek';
  if (host.includes('poe')) return 'poe';
  if (host.includes('bridgeai-realworld-problem') || host.includes('localhost')) return 'dashboard';
  return 'universal';
}

function formatPlatformName(platform, host) {
  const mapping = {
    chatgpt: 'ChatGPT',
    gemini: 'Gemini',
    claude: 'Claude',
    perplexity: 'Perplexity',
    mistral: 'Mistral',
    deepseek: 'DeepSeek',
    poe: 'Poe',
    dashboard: 'Bridge Dashboard'
  };
  if (mapping[platform]) return mapping[platform];
  
  let name = host.replace('www.', '').split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function extractChat() {
  const platform = getPlatform();
  const config = EXTRACTORS[platform] || EXTRACTORS.universal;
  
  let messages = [];

  // 1. Try Chat Extraction
  let nodes = document.querySelectorAll(config.messageSelector);
  const uniqueNodes = Array.from(new Set(Array.from(nodes)));
  const validNodes = uniqueNodes.filter(node => node.innerText && node.innerText.trim().length > 20);
  
  messages = validNodes.map((msg, index) => {
    let role = msg.getAttribute('data-message-author-role');
    if (!role) {
      const txt = msg.innerText.toLowerCase();
      if (txt.includes('user:') || txt.includes('me:')) role = 'user';
      else if (txt.includes('ai:') || txt.includes('assistant:')) role = 'assistant';
      else role = (index % 2 === 0) ? 'user' : 'assistant';
    }
    return { role, text: msg.innerText.trim() };
  });

  // 2. Generic Data Extraction (For sites like Internship Portal)
  if (messages.length < 5) {
    // Grab Meta Description
    const metaDesc = document.querySelector('meta[name="description"]')?.content;
    if (metaDesc) messages.push({ role: 'system_metadata', text: `Description: ${metaDesc}` });

    // Grab all inputs
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea, [role="textbox"]');
    inputs.forEach(input => {
        const val = input.value || input.innerText;
        if (val && val.trim().length > 0) {
            const label = document.querySelector(`label[for="${input.id}"]`) || input.placeholder || input.name || 'Field';
            messages.push({ role: 'system_data', text: `${label}: ${val.trim()}` });
        }
    });
    
    // Grab all headings for semantic context
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5');
    headings.forEach(h => {
        if (h.innerText.trim().length > 3) {
            messages.push({ role: 'context_heading', text: h.innerText.trim() });
        }
    });

    // Grab lists/tables
    const lists = document.querySelectorAll('li, td');
    lists.forEach(l => {
        if (l.innerText.trim().length > 10 && l.innerText.trim().length < 200) {
            messages.push({ role: 'list_item', text: l.innerText.trim() });
        }
    });
  }

  const host = window.location.hostname;
  const siteName = formatPlatformName(platform, host);

  return {
    platform: siteName,
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    messages: messages.filter(m => m.text.length > 5)
  };
}

// ─── Auto-Paste & Bridge Logic ────────────────────────────────────

const TARGET_SELECTORS = {
  gemini: 'div[contenteditable="true"], textarea[aria-label*="Gemini"], #input-area',
  claude: 'div[contenteditable="true"], textarea[placeholder*="Claude"], .ProseMirror',
  chatgpt: 'textarea#prompt-textarea, [contenteditable="true"]',
  perplexity: 'textarea[placeholder*="Ask"], [contenteditable="true"]',
  fallback: 'textarea, [contenteditable="true"]'
};

/**
 * Handle Auto-Paste on AI Platforms
 */
async function handleAutoPaste() {
  const platform = getPlatform();
  // We check for storage on ALL pages now to support Universal Bridge
  const { pending_bridge } = await chrome.storage.local.get('pending_bridge');
  if (!pending_bridge) return;

  console.log('BridgeAI: Detected pending context for cross-platform bridge.');

  let attempts = 0;
  const interval = setInterval(() => {
    // Try platform specific, then try any visible textarea
    const selector = TARGET_SELECTORS[platform] || TARGET_SELECTORS.fallback;
    const target = document.querySelector(selector);
    
    if (target && (target.offsetWidth > 0 || target.isContentEditable)) {
      clearInterval(interval);
      console.log('BridgeAI: Hub target acquired. Bridging intelligence...');
      
      const intro = "System: Continuing from BridgeAI extracted context.\n\n";
      const fullText = intro + pending_bridge;

      if (target.isContentEditable) {
        target.focus();
        // More robust insertion for ContentEditable (preserves newlines)
        const lines = fullText.split('\n');
        lines.forEach((line, i) => {
          document.execCommand('insertText', false, line);
          if (i < lines.length - 1) {
            // Try to force a real newline in the editor's model
            document.execCommand('insertParagraph', false);
          }
        });
      } else {
        target.value = fullText;
        target.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      chrome.storage.local.remove('pending_bridge');
    }

    if (++attempts > 40) clearInterval(interval);
  }, 600);
}

/**
 * Handle Dashboard Communication (Running on bridgeai-realworld-problem.vercel.app / dashboard)
 */
function handleDashboardEvents() {
  window.addEventListener('BRIDGE_SEND_TO_STORAGE', async (event) => {
    const { context } = event.detail;
    if (!context) return;
    
    await chrome.storage.local.set({ pending_bridge: context });
    console.log('BridgeAI: Context cached for cross-platform bridge.');
  });

  // Relay Auth Updates to Extension (Bypasses hardcoded IDs)
  window.addEventListener('BRIDGE_AUTH_UPDATE', (event) => {
    const { user } = event.detail;
    if (user) {
      chrome.runtime.sendMessage({ action: 'AUTH_RELAY', user });
    }
  });

  // Relay Reload Signal
  window.addEventListener('RELOAD_EXTENSION', () => {
    chrome.runtime.sendMessage({ action: 'RELOAD_EXTENSION' });
  });
}

// ─── Initializers ────────────────────────────────────────────────

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'EXTRACT_CHAT') {
    try {
      const data = extractChat();
      sendResponse({ data });
    } catch (e) {
      console.error('BridgeAI Extraction Error:', e);
      sendResponse({ data: null, error: e.message || 'Unknown extraction error' });
    }
  }
  if (request.action === 'VAULT_UPDATED') {
    window.dispatchEvent(new CustomEvent('bridge-vault-update'));
    return;
  }
  return true;
});

// Run automation if applicable
handleAutoPaste();
// Setup dashboard listener
handleDashboardEvents();

console.log('BridgeAI Intelligence Pulse Active');
