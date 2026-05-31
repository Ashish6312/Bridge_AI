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
    messageSelector: '.font-claude-message, .font-user-message, [data-testid*="message"], [data-testid*="turn"], [class*="Message__"], [class*="MessageRow"], [class*="MessageContainer"], [class*="message-row"], [class*="message-container"], [class*="message-content"], [class*="user-message"], [class*="assistant-message"], [class*="claude-message"]',
    authorSelector: '.nickname'
  },
  perplexity: {
    messageSelector: '[class*="query"], [class*="answer"], [class*="UserMessage"], [class*="AssistantMessage"]',
    authorSelector: ''
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
  gmail: {
    messageSelector: '[role="gridcell"], .ii.gt, .ha',
    authorSelector: '.gD'
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
  if (host.includes('mail.google')) return 'gmail';
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

/**
 * Detect role of a message node dynamically.
 */
function detectRole(msg, index, platform) {
  // 1. Try to get role from data attributes on the element, its children, or its ancestors
  let role = msg.getAttribute('data-message-author-role') || 
             msg.querySelector('[data-message-author-role]')?.getAttribute('data-message-author-role') ||
             msg.closest('[data-message-author-role]')?.getAttribute('data-message-author-role');
  
  if (role) {
    role = role.toLowerCase();
    if (role === 'user' || role === 'human') return 'user';
    if (role === 'assistant' || role === 'model' || role === 'bot') return 'assistant';
  }

  // 2. Platform-specific selector-based role detection
  if (platform === 'claude') {
    if (msg.closest('.font-user-message, [data-testid="user-message"]')) return 'user';
    if (msg.closest('.font-claude-message, [data-testid="assistant-message"]')) return 'assistant';
  }
  
  if (platform === 'chatgpt') {
    const turn = msg.closest('[data-testid^="conversation-turn-"]');
    if (turn) {
      if (turn.querySelector('[data-message-author-role="user"]')) return 'user';
      if (turn.querySelector('[data-message-author-role="assistant"]')) return 'assistant';
    }
  }

  if (platform === 'gemini') {
    if (msg.closest('.query-container, .user-query, [class*="user"]')) return 'user';
    if (msg.closest('.model-response, [class*="model"], [class*="assistant"]')) return 'assistant';
  }

  if (platform === 'perplexity') {
    if (msg.closest('[class*="query"], [class*="UserMessage"]')) return 'user';
    if (msg.closest('[class*="answer"], [class*="AssistantMessage"]')) return 'assistant';
  }

  // 3. Fallback to general class/testid checks
  const testId = (msg.getAttribute('data-testid') || msg.closest('[data-testid]')?.getAttribute('data-testid') || '').toLowerCase();
  const className = (msg.className || '').toLowerCase() + ' ' + (msg.parentElement?.className || '').toLowerCase();
  
  if (testId.includes('user') || className.includes('user') || className.includes('font-user')) {
    return 'user';
  }
  if (testId.includes('assistant') || testId.includes('model') || className.includes('assistant') || className.includes('model') || className.includes('claude') || className.includes('font-claude')) {
    return 'assistant';
  }

  // 4. Text prefix check
  const txt = msg.innerText.toLowerCase();
  if (txt.startsWith('user:') || txt.startsWith('me:')) return 'user';
  if (txt.startsWith('ai:') || txt.startsWith('assistant:') || txt.startsWith('claude:')) return 'assistant';

  // 5. Index-based alternation
  return (index % 2 === 0) ? 'user' : 'assistant';
}

/**
 * Compress messages using native CompressionStream (gzip) and convert to base64.
 */
async function compressMessages(messages) {
  try {
    const jsonString = JSON.stringify(messages);
    const stream = new Blob([jsonString]).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
    const response = new Response(compressedStream);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('BridgeAI Compression Failed:', err);
    return null;
  }
}

/**
 * Asynchronously extract full chat logs from page's React State if available.
 * Bypasses DOM-based virtual scrolling limits.
 */
function extractReactState() {
  return new Promise((resolve) => {
    let resolved = false;
    const handleResponse = (e) => {
      if (resolved) return;
      resolved = true;
      window.removeEventListener('BRIDGE_REACT_EXTRACTED', handleResponse);
      resolve(e.detail.messages);
    };
    
    // Listen for custom event from main world
    window.addEventListener('BRIDGE_REACT_EXTRACTED', handleResponse);
    
    // Safety timeout fallback (1.5 seconds)
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        window.removeEventListener('BRIDGE_REACT_EXTRACTED', handleResponse);
        resolve(null);
      }
    }, 1500);

    // Inject helper script into main world to access standard DOM element JS properties
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        try {
          const keysToSkip = new Set([
            'return', 'child', 'sibling', 'stateNode', '_owner', '_currentElement', 
            '_reactInternalFiber', '_reactFiber', 'domNode', 'element', 'container', 
            'current', 'owner', 'fiber', 'node', 'react'
          ]);

          // Helper to recursively find a messages list array inside any object/state
          function findMessagesArray(obj, depth = 0, visited = new WeakSet()) {
            if (!obj || depth > 12) return null;
            if (typeof obj !== 'object') return null;
            if (visited.has(obj)) return null;
            visited.add(obj);

            const isMessagesList = (arr) => {
              if (!Array.isArray(arr) || arr.length === 0) return false;
              
              // We check if the array contains at least one object that looks like a message
              return arr.some(sample => {
                if (!sample || typeof sample !== 'object') return false;
                
                const roleVal = String(sample.sender || sample.role || sample.type || sample.author || '').toLowerCase();
                const isKnownRole = roleVal.includes('user') || 
                                    roleVal.includes('human') || 
                                    roleVal.includes('assistant') || 
                                    roleVal.includes('model') || 
                                    roleVal.includes('bot') || 
                                    roleVal.includes('system');
                                    
                const hasContent = sample.text !== undefined || 
                                   sample.content !== undefined || 
                                   sample.parts !== undefined || 
                                   sample.body !== undefined ||
                                   sample.message !== undefined;
                                   
                return isKnownRole && hasContent;
              });
            };

            // 1. Check all direct keys first
            for (const key in obj) {
              if (keysToSkip.has(key)) continue;
              try {
                const val = obj[key];
                if (Array.isArray(val) && isMessagesList(val)) {
                  return val;
                }
              } catch(e) {}
            }

            // 2. Prioritize key names that are highly likely to contain messages
            const priorityKeys = ['messages', 'history', 'turns', 'chatHistory', 'messageList', 'conversation', 'currentConversation'];
            for (const key of priorityKeys) {
              if (key in obj && !keysToSkip.has(key)) {
                try {
                  const val = obj[key];
                  if (val && typeof val === 'object') {
                    const found = findMessagesArray(val, depth + 1, visited);
                    if (found) return found;
                  }
                } catch(e) {}
              }
            }

            // 3. Fallback search
            for (const key in obj) {
              if (priorityKeys.includes(key) || keysToSkip.has(key)) continue;
              try {
                const val = obj[key];
                if (val && typeof val === 'object') {
                  const found = findMessagesArray(val, depth + 1, visited);
                  if (found) return found;
                }
              } catch(e) {}
            }
            return null;
          }

          // Query the actual message DOM elements first
          const msgEls = document.querySelectorAll(
            '.font-claude-message, .font-user-message, [data-testid*="message"], [data-testid*="turn"], [class*="Message"], [class*="message"], [class*="turn"]'
          );
          
          let messages = null;
          for (const el of msgEls) {
            const key = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (!key) continue;
            
            let curr = el[key];
            while (curr) {
              // Recursively search memoizedProps and memoizedState for a message list
              if (curr.memoizedProps) {
                const found = findMessagesArray(curr.memoizedProps);
                if (found) { messages = found; break; }
              }
              if (curr.memoizedState) {
                const found = findMessagesArray(curr.memoizedState);
                if (found) { messages = found; break; }
              }
              curr = curr.return;
            }
            if (messages) break;
          }
          
          // If not found from message elements, scan all elements as a last resort
          if (!messages) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const key = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
              if (!key) continue;
              
              let curr = el[key];
              while (curr) {
                if (curr.memoizedProps) {
                  const found = findMessagesArray(curr.memoizedProps);
                  if (found) { messages = found; break; }
                }
                if (curr.memoizedState) {
                  const found = findMessagesArray(curr.memoizedState);
                  if (found) { messages = found; break; }
                }
                curr = curr.return;
              }
              if (messages) break;
            }
          }

          if (messages) {
            const formatted = messages
              .filter(m => m && typeof m === 'object')
              .map(m => {
                let text = '';
                if (typeof m.text === 'string') text = m.text;
                else if (typeof m.content === 'string') text = m.content;
                else if (Array.isArray(m.content)) {
                  text = m.content.map(c => {
                    if (typeof c === 'string') return c;
                    return c.text || c.val || '';
                  }).join('\\\\n');
                } else if (Array.isArray(m.parts)) {
                  text = m.parts.map(p => typeof p === 'string' ? p : p.text || '').join('\\\\n');
                }
                
                const roleVal = String(m.sender || m.role || 'user').toLowerCase();
                const role = (roleVal === 'human' || roleVal === 'user') ? 'user' : 'assistant';
                return { role, text: text.trim() };
              }).filter(m => m.text.length > 0);
            
            if (formatted.length > 0) {
              window.dispatchEvent(new CustomEvent('BRIDGE_REACT_EXTRACTED', { detail: { messages: formatted } }));
              return;
            }
          }
        } catch(e) {}
        window.dispatchEvent(new CustomEvent('BRIDGE_REACT_EXTRACTED', { detail: { messages: null } }));
      })();
    `;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  });
}

/**
 * Extract contents of active artifacts, Monaco editors, and Canvas documents.
 */
function extractArtifacts() {
  const artifacts = [];
  
  // 1. Look for Monaco editor (used for code views in Claude/ChatGPT)
  const editors = document.querySelectorAll('.monaco-editor, [class*="monaco-editor"]');
  editors.forEach(editor => {
    const text = editor.innerText || '';
    if (text.trim().length > 50) {
      artifacts.push({ role: 'system_data', text: `[Active Editor Code]\n\n${text.trim()}` });
    }
  });

  // 2. Look for Claude Artifact Viewer panels or ChatGPT Canvas panels
  const viewers = document.querySelectorAll(
    '[data-testid="artifact-viewer"], [class*="artifact-viewer"], [class*="artifact-container"], ' +
    '[data-testid="canvas-editor"], [class*="canvas-editor"], [class*="canvas-view"]'
  );
  viewers.forEach(viewer => {
    const title = viewer.querySelector('[class*="title"], h1, h2, h3')?.innerText || 'Active Document';
    const text = viewer.innerText || '';
    if (text.trim().length > 50) {
      artifacts.push({ role: 'system_data', text: `[Document: ${title}]\n\n${text.trim()}` });
    }
  });

  // 3. Fallback to any visible code views or text pre blocks outside normal turns
  const preBlocks = document.querySelectorAll('pre');
  preBlocks.forEach(pre => {
    const isInsideMessage = Array.from(document.querySelectorAll('.font-claude-message, .font-user-message, article, .message-content')).some(msg => msg.contains(pre));
    if (!isInsideMessage) {
      const text = pre.innerText || '';
      if (text.trim().length > 50) {
        artifacts.push({ role: 'system_data', text: `[Sidebar Code Snippet]\n\n${text.trim()}` });
      }
    }
  });

  return artifacts;
}

async function extractChat() {
  const platform = getPlatform();
  const config = EXTRACTORS[platform] || EXTRACTORS.universal;
  
  let messages = [];

  // Try React State Extraction first for known platforms
  const isKnownPlatform = platform !== 'universal' && platform !== 'dashboard';
  if (isKnownPlatform) {
    try {
      const reactMessages = await extractReactState();
      if (reactMessages && reactMessages.length > 0) {
        messages = reactMessages;
        console.log('BridgeAI: Successfully extracted ' + messages.length + ' messages from React State.');
      }
    } catch (e) {
      console.warn('BridgeAI: React extraction skipped:', e);
    }
  }

  // Fallback to DOM-based extraction if React state extraction did not yield messages
  if (messages.length === 0) {
    let nodes = document.querySelectorAll(config.messageSelector);
    const uniqueNodes = Array.from(new Set(Array.from(nodes)));
    
    // De-duplicate nested matched elements (keep outermost nodes to capture full message text and prevent turn-splitting)
    const nonNestedNodes = uniqueNodes.filter(node => {
      return !uniqueNodes.some(otherNode => otherNode !== node && otherNode.contains(node));
    });

    const minLength = isKnownPlatform ? 1 : 20;
    const validNodes = nonNestedNodes.filter(node => node.innerText && node.innerText.trim().length >= minLength);
    
    messages = validNodes.map((msg, index) => {
      const role = detectRole(msg, index, platform);
      let text = msg.innerText.trim();
      
      // Clean up common action button labels and UI noise typically found at the end of message cards
      text = text
        .replace(/(\n|^)(Copy|Copy code|Read aloud|Share|Regenerate|Thumbs up|Thumbs down|Try again|Retry|Good response|Bad response)\s*$/gi, '')
        .trim();
        
      return { role, text };
    });
  }

  // 2. Generic Data Extraction (Avoid polluting known platforms unless we captured absolutely nothing)
  if ((!isKnownPlatform && messages.length < 5) || (isKnownPlatform && messages.length === 0)) {
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

  // 3. Extract active artifacts, monaco code editor sessions, or Canvas views
  if (isKnownPlatform) {
    try {
      const artifacts = extractArtifacts();
      // Ensure we don't duplicate if already extracted (e.g. from React state)
      const filteredArtifacts = artifacts.filter(art => {
        return !messages.some(m => m.text.includes(art.text.substring(0, 100)));
      });
      messages.push(...filteredArtifacts);
    } catch (e) {
      console.warn('BridgeAI: Artifact extraction skipped/failed:', e);
    }
  }

  const host = window.location.hostname;
  const siteName = formatPlatformName(platform, host);
  const minTextLength = isKnownPlatform ? 0 : 5;
  const filteredMessages = messages.filter(m => m.text.trim().length > minTextLength);
  const compressed = await compressMessages(filteredMessages);

  return {
    platform: siteName,
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    compressedMessages: compressed, // Gzip compressed Base64
    messages: filteredMessages
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
    extractChat()
      .then(data => {
        sendResponse({ data });
      })
      .catch(e => {
        console.error('BridgeAI Extraction Error:', e);
        sendResponse({ data: null, error: e.message || 'Unknown extraction error' });
      });
    return true; // Keep message channel open for async response!
  }
  if (request.action === 'VAULT_UPDATED') {
    // Trigger real-time update in Dashboard via localStorage event
    localStorage.setItem('bridge_vault_updated', Date.now());
    return true;
  }
});

// Run automation if applicable
handleAutoPaste();
// Setup dashboard listener
handleDashboardEvents();

console.log('BridgeAI Intelligence Pulse Active');
