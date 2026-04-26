const PRODUCTION_URL = 'https://bridgeai-realworld-problem.vercel.app';
const LOCAL_URL      = 'http://localhost:5173';
const LOCAL_API      = 'http://localhost:5001';
let API_BASE = PRODUCTION_URL; 
let WEB_BASE = PRODUCTION_URL;
let userSession = null;
let capturedData = null;
let currentMode = 'quick';

// DOM Elements (Initialized on Load)
let extractBtn, platformName, siteEmoji, dashboardView, analysisView, dataContainer, cancelBtn, bridgeBtn, modal, modalTitle, modalMessage, modalCloseBtn, modalUpgradeBtn;

async function syncUserSession() {
    // 1. Try persistent storage first (Standalone Mode)
    const stored = await chrome.storage.local.get(['bridge_token', 'bridge_user', 'api_base', 'web_base']);
    if (stored.bridge_user) {
        userSession = stored.bridge_user;
        if (stored.api_base) API_BASE = stored.api_base;
        if (stored.web_base) WEB_BASE = stored.web_base;
        updateUIWithSession(userSession);
        return true;
    }

    // 2. Fallback to scraping active tabs (Legacy / Initial Sync)
    const tabs = await chrome.tabs.query({});
    const targetTabs = tabs.filter(t => 
        t.url?.includes('bridgeai-realworld-problem.vercel.app') || 
        t.url?.includes('bridgeai.com') ||
        t.url?.includes('localhost:5173')
    );

    // Prioritize active tab
    targetTabs.sort((a, b) => {
        if (a.active) return -1;
        if (b.active) return 1;
        return 0;
    });

    if (targetTabs.length === 0) return false;

    for (const t of targetTabs) {
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: t.id },
                func: () => localStorage.getItem('bridge_user')
            });
            
            if (results?.[0]?.result) {
                userSession = JSON.parse(results[0].result);
                // Intelligent Environment Detection
                if (t.url.includes('localhost')) {
                    API_BASE = LOCAL_API;
                    WEB_BASE = LOCAL_URL;
                } else {
                    API_BASE = PRODUCTION_URL;
                    WEB_BASE = PRODUCTION_URL;
                }
                
                // Persist it for standalone use
                chrome.storage.local.set({ bridge_user: userSession, api_base: API_BASE, web_base: WEB_BASE });
                updateUIWithSession(userSession);
                return true;
            }
        } catch (e) {}
    }
    return false;
}

// 3. Real-Time External Push (Direct Link from Website)
chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    console.log('Sovereign Hub External Relay:', request);
    if (request.action === 'STORE_AUTH' && request.user) {
        userSession = request.user;
        chrome.storage.local.set({ bridge_user: userSession });
        updateUIWithSession(userSession);
        sendResponse({ success: true, status: 'Identity Materialized' });
    }
});

// Listener for internal messages to catch these auth updates
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'AUTH_RELAY' && request.user) {
        userSession = request.user;
        chrome.storage.local.set({ bridge_user: userSession });
        updateUIWithSession(userSession);
    }
});

function updateUIWithSession(session) {
    const infoContainer = document.getElementById('user-info-container');
    const loginContainer = document.getElementById('login-container');

    if (!infoContainer || !loginContainer) return; // Wait for DOM

    if (session && session.email) {
        infoContainer.style.display = 'flex';
        loginContainer.style.display = 'none';
        
        const emailEl = document.getElementById('user-email');
        const initialEl = document.getElementById('user-initial');
        const syncEl = document.getElementById('sync-status');

        if (emailEl) emailEl.textContent = session.email;
        if (initialEl) initialEl.textContent = session.email[0].toUpperCase();
        if (syncEl) {
            syncEl.textContent = 'Relay Secure';
            syncEl.style.color = '#4ade80';
        }

        // Refresh Quota
        fetchQuota(session.email);

        // Enforce Plan Limits
        const plan = (session.plan || 'free').toLowerCase();
        const isUnlimited = plan === 'pro' || plan === 'infinite';
        
        document.querySelectorAll('.mode-item').forEach(item => {
            if (item.dataset.mode !== 'quick') {
                if (!isUnlimited) {
                    item.style.opacity = '0.3';
                    item.style.cursor = 'not-allowed';
                    item.classList.add('locked-mode');
                    item.title = 'Upgrade to unlock advanced modes';
                } else {
                    item.style.opacity = '1';
                    item.style.cursor = 'pointer';
                    item.classList.remove('locked-mode');
                    item.title = '';
                }
            }
        });
    } else {
        infoContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }
}

async function fetchQuota(email) {
    if (!API_BASE) return;
    try {
        const res = await fetch(`${API_BASE}/api/user/status?email=${email}`);
        const data = await res.json();
        if (data.success) {
            // Live Plan Sync: Update session with server-side truth
            if (data.plan && userSession) {
                const planChanged = userSession.plan !== data.plan;
                userSession.plan = data.plan;
                if (planChanged) {
                    updateUIWithSession(userSession);
                }
            }

            const limit = data.plan === 'pro' ? 100 : (data.plan === 'infinite' ? 1000 : 3);
            const used = data.usage || 0;
            const remaining = Math.max(0, limit - used);
            
            const quotaText = document.getElementById('quota-text');
            const quotaBar = document.getElementById('quota-bar');
            
            if (quotaText) quotaText.textContent = `${remaining} / ${limit} Left`;
            if (quotaBar) {
                const percent = (remaining / limit) * 100;
                quotaBar.style.width = `${percent}%`;
                
                if (percent < 20) {
                    quotaBar.style.background = '#f43f5e';
                } else if (percent < 50) {
                    quotaBar.style.background = '#f59e0b';
                } else {
                    quotaBar.style.background = 'var(--accent-gradient)';
                }
            }
        }
    } catch (e) {
        console.error('Quota Fetch Error:', e);
    }
}

const showCustomModal = (title, message, type = 'warning') => {
    if (!modalTitle || !modalMessage || !modal) return;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'flex';
    
    const iconContainer = document.getElementById('modal-icon');
    if (!iconContainer) return;
    const iconSvg = iconContainer.querySelector('svg');
    if (!iconSvg) return;
    
    if (type === 'error') {
        iconContainer.style.background = 'rgba(244, 63, 94, 0.1)';
        iconSvg.style.stroke = '#f43f5e';
        iconSvg.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>';
    } else if (type === 'success') {
        iconContainer.style.background = 'rgba(16, 185, 129, 0.1)';
        iconSvg.style.stroke = '#10b981';
        iconSvg.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
        
        // Auto-dismiss success modals after 3 seconds
        setTimeout(() => {
            if (modal.style.display === 'flex') modal.style.display = 'none';
        }, 3000);
    } else {
        iconContainer.style.background = 'rgba(139, 92, 246, 0.1)';
        iconSvg.style.stroke = '#8b5cf6';
        iconSvg.innerHTML = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>';
    }
};

const showAnalysis = (data) => {
    if (!dashboardView || !analysisView || !dataContainer) return;
    dashboardView.style.display = 'none';
    analysisView.style.display = 'block';
    dataContainer.innerHTML = '';

    const platform = data.platform.toLowerCase();
    const isAI = ['chatgpt', 'gemini', 'claude', 'perplexity'].some(s => platform.includes(s));
    
    const points = [
        { label: 'Intelligence Source', value: data.platform },
        { label: 'Origin URL', value: data.url },
        { label: 'Context Title', value: data.title },
        { 
            label: isAI ? 'Conversation Depth' : 'Intelligence Signals', 
            value: isAI ? `${data.messages.length} messages captured` : `${data.messages.length} data points extracted` 
        }
    ];

    points.forEach(p => {
        const div = document.createElement('div');
        div.className = 'data-point fade-in';
        div.innerHTML = `<label>${p.label}</label><span>${p.value}</span>`;
        dataContainer.appendChild(div);
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize DOM elements
    extractBtn = document.getElementById('extract-btn');
    platformName = document.getElementById('platform-name');
    siteEmoji = document.getElementById('site-emoji');
    dashboardView = document.getElementById('dashboard-view');
    analysisView = document.getElementById('analysis-view');
    dataContainer = document.getElementById('data-container');
    cancelBtn = document.getElementById('cancel-btn');
    bridgeBtn = document.getElementById('bridge-btn');
    modal = document.getElementById('custom-modal');
    modalTitle = document.getElementById('modal-title');
    modalMessage = document.getElementById('modal-message');
    modalCloseBtn = document.getElementById('modal-close-btn');
    modalUpgradeBtn = document.getElementById('modal-upgrade-btn');

    await syncUserSession();

    function formatPlatformName(host) {
        if (!host) return 'Universal Bridge';
        const h = host.toLowerCase();
        if (h.includes('chatgpt') || h.includes('openai')) return 'ChatGPT';
        if (h.includes('gemini') || h.includes('google')) return 'Gemini';
        if (h.includes('claude')) return 'Claude';
        if (h.includes('perplexity')) return 'Perplexity';
        if (h.includes('mail.google')) return 'Gmail';
        if (h.includes('bridgeai-realworld-problem') || h.includes('localhost')) return 'Bridge Hub';
        
        let name = host.replace('www.', '').split('.')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    async function updatePlatformUI() {
        const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (activeTab?.url) {
            try {
                const urlObj = new URL(activeTab.url);
                if (platformName) platformName.textContent = formatPlatformName(urlObj.hostname);
                
                // Emoji logic
                if (siteEmoji) {
                    const url = activeTab.url.toLowerCase();
                    if (url.includes('chatgpt')) siteEmoji.textContent = '🤖';
                    else if (url.includes('gemini')) siteEmoji.textContent = '✨';
                    else if (url.includes('claude')) siteEmoji.textContent = '🧠';
                    else if (url.includes('mail.google')) siteEmoji.textContent = '✉️';
                    else if (url.includes('internship')) siteEmoji.textContent = '🎓';
                    else siteEmoji.textContent = '🌐';
                }
            } catch {
                if (platformName) platformName.textContent = 'Universal Bridge';
            }
        }
    }

    await updatePlatformUI();

    // Auto-sync on tab changes
    chrome.tabs.onActivated.addListener(async () => {
        await syncUserSession();
        await updatePlatformUI();
    });

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
        if (changeInfo.status === 'complete') {
            await syncUserSession();
            await updatePlatformUI();
        }
    });

    // Persistent Sync: Poll for session/platform changes every 3 seconds
    setInterval(async () => {
        const synced = await syncUserSession();
        if (!synced && !userSession) {
            updateUIWithSession(null);
        }
        await updatePlatformUI();
    }, 3000);

    // Button Listeners
    if (document.getElementById('sidepanel-login-btn')) {
        document.getElementById('sidepanel-login-btn').addEventListener('click', () => {
            chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` });
        });
    }

    const accountTrigger = document.getElementById('user-info-container');
    const accountMenu = document.getElementById('account-menu');
    if (accountTrigger && accountMenu) {
        accountTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            accountMenu.style.display = accountMenu.style.display === 'none' ? 'block' : 'none';
        });
    }

    document.addEventListener('click', () => {
        if (accountMenu) accountMenu.style.display = 'none';
    });

    if (document.getElementById('logout-btn')) {
        document.getElementById('logout-btn').addEventListener('click', async () => {
            userSession = null;
            await chrome.storage.local.remove(['bridge_user', 'bridge_token']);
            updateUIWithSession(null);
            showCustomModal('System Logout', 'Sovereign session terminated successfully.', 'success');
        });
    }

    if (document.getElementById('refresh-ext-btn')) {
        document.getElementById('refresh-ext-btn').addEventListener('click', async () => {
            const synced = await syncUserSession();
            if (synced) {
                showCustomModal('Sync Complete', 'Intelligence relay re-established.', 'success');
            } else {
                showCustomModal('Sync Failed', 'Could not detect active Bridge Hub session.', 'error');
            }
        });
    }

    document.querySelectorAll('.mode-item').forEach(item => {
        item.addEventListener('click', () => {
            const isFree = (userSession?.plan || 'free') === 'free';
            if (isFree && item.dataset.mode !== 'quick') {
                showCustomModal('Forge Access Locked', 'Upgrade to Pro or Infinite plans to unlock specialized Intelligence Modes.');
                return;
            }
            document.querySelectorAll('.mode-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentMode = item.dataset.mode;
        });
    });

    if (extractBtn) {
        extractBtn.addEventListener('click', async () => {
            if (!userSession) await syncUserSession();
            if (!userSession) {
                showCustomModal('Identity Required', 'Please sign in to your BridgeAI account to enable cross-LLM intelligence sync.');
                chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` });
                return;
            }

            const [activeTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            
            const attemptExtraction = (tabId, targetTab, retryOnFail = true) => {
                chrome.tabs.sendMessage(tabId, { action: 'EXTRACT_CHAT' }, async (response) => {
                    if (chrome.runtime.lastError || !response?.data) {
                        console.warn('BridgeAI: Connection lost. Attempting smart re-injection...');
                        
                        if (retryOnFail) {
                            try {
                                // Manually inject content script if connection is lost
                                await chrome.scripting.executeScript({
                                    target: { tabId: tabId },
                                    files: ['content.js']
                                });
                                // Wait a bit for injection to settle
                                setTimeout(() => attemptExtraction(tabId, targetTab, false), 500);
                                return;
                            } catch (err) {
                                console.error('Smart Injection Failed:', err);
                            }
                        }

                        extractBtn.disabled = false;
                        extractBtn.innerHTML = `Capture Chat`;
                        showCustomModal(
                            'Relay Interrupted', 
                            'Failed to link with the Hub. Please refresh the page (ChatGPT/Gemini) manually to re-establish the connection.', 
                            'error'
                        );
                        return;
                    }

                    extractBtn.disabled = false;
                    extractBtn.innerHTML = `Capture Chat`;
                    capturedData = response.data;
                    const urlObj = new URL(targetTab.url);
                    capturedData.platform = formatPlatformName(urlObj.hostname);
                    showAnalysis(capturedData);
                });
            };

            if (!activeTab || !activeTab.id || activeTab.url.includes('bridgeai-realworld-problem.vercel.app')) {
                const allTabs = await chrome.tabs.query({ lastFocusedWindow: true });
                const chatTab = allTabs.find(t => t.url && (t.url.includes('chatgpt.com') || t.url.includes('gemini.google') || t.url.includes('claude.ai')));
                
                if (chatTab) {
                    attemptExtraction(chatTab.id, chatTab);
                    return;
                } else {
                    showCustomModal('Target Not Found', 'Please select a chat tab (ChatGPT/Gemini/Claude) before initiating extraction.');
                    return;
                }
            }

            extractBtn.disabled = true;
            extractBtn.textContent = 'Syncing...';
            attemptExtraction(activeTab.id, activeTab);
        });
    }

    if (bridgeBtn) {
        bridgeBtn.addEventListener('click', async () => {
            if (!capturedData || !capturedData.messages) {
                showCustomModal('Protocol Error', 'No intelligence data captured. Please rescan the chat.', 'error');
                return;
            }
            if (!userSession) await syncUserSession();
            
            bridgeBtn.disabled = true;
            bridgeBtn.textContent = '⚡ SAVING...';

            try {
                const res = await fetch(`${API_BASE}/api/summarize`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: capturedData.messages,
                        platform: capturedData.platform,
                        title: capturedData.title,
                        email: userSession?.email || 'guest',
                        mode: currentMode
                    })
                });

                const result = await res.json();
                if (result.success) {
                    bridgeBtn.textContent = '✅ SAVED';
                    chrome.runtime.sendMessage({ action: 'VAULT_UPDATED' });
                    setTimeout(() => {
                        bridgeBtn.disabled = false;
                        bridgeBtn.innerHTML = 'Save to My Account';
                    }, 2000);
                } else {
                    throw new Error(result.error);
                }
            } catch (err) {
                showCustomModal('Vault Sync Failed', err.message, 'error');
                bridgeBtn.disabled = false;
                bridgeBtn.textContent = 'Retry Save';
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            capturedData = null; // Clear old capture
            if (analysisView) analysisView.style.display = 'none';
            if (dashboardView) {
                dashboardView.style.display = 'block';
                dashboardView.classList.remove('fade-in');
                void dashboardView.offsetWidth; // Trigger reflow
                dashboardView.classList.add('fade-in');
            }
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => modal.style.display = 'none');
    if (modalUpgradeBtn) modalUpgradeBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: `${PRODUCTION_URL}/services` });
        modal.style.display = 'none';
    });

    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'VAULT_UPDATED') {
            if (userSession?.email) fetchQuota(userSession.email);
            const dot = document.getElementById('hub-dot');
            const status = document.getElementById('hub-status-text');
            if (dot) dot.classList.add('pulse');
            if (status) status.textContent = 'Relay Updated';
            setTimeout(() => {
                if (status) status.textContent = 'Hub Active';
            }, 3000);
        }
    });
});
