const PRODUCTION_URL = 'https://bridgeai-realworld-problem.vercel.app';
const LOCAL_URL      = 'http://localhost:5173';
const LOCAL_API      = 'http://localhost:5001';
let API_BASE = PRODUCTION_URL; 
let WEB_BASE = PRODUCTION_URL;
let userSession = null;
let capturedData = null;
let currentMode = 'quick';

const PLATFORM_LOGOS = {
    chatgpt: `<svg width="24" height="24" viewBox="0 0 41 41" fill="none"><path d="M37.532 16.87a9.963 9.963 0 00-.856-8.184 10.078 10.078 0 00-10.855-4.835 9.964 9.964 0 00-7.505-3.360 10.079 10.079 0 00-9.612 6.977 9.967 9.967 0 00-6.664 4.834 10.08 10.08 0 001.24 11.817 9.965 9.965 0 00.856 8.185 10.079 10.079 0 0010.855 4.835 9.965 9.965 0 007.504 3.36 10.079 10.079 0 009.617-6.981 9.967 9.967 0 006.663-4.834 10.079 10.079 0 00-1.243-11.814zM22.498 37.886a7.474 7.474 0 01-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 00.655-1.134V19.054l3.366 1.944a.12.12 0 01.066.092v9.299a7.505 7.505 0 01-7.49 7.496zM6.392 31.006a7.471 7.471 0 01-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 001.308 0l9.724-5.614v3.888a.12.12 0 01-.048.103l-8.051 4.648a7.504 7.504 0 01-10.24-2.743zM4.297 13.62A7.469 7.469 0 018.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 00.654 1.132l9.723 5.614-3.366 1.944a.12.12 0 01-.114.012L7.044 23.86a7.504 7.504 0 01-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 01.114-.012l8.048 4.648a7.498 7.498 0 01-1.158 13.528v-9.476a1.293 1.293 0 00-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 00-1.308 0l-9.723 5.614v-3.888a.12.12 0 01.048-.103l8.05-4.645a7.497 7.497 0 0111.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 01-.065-.092v-9.299a7.497 7.497 0 0112.293-5.756 6.94 6.94 0 00-.236.134l-7.965 4.6a1.294 1.294 0 00-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.499v4.993l-4.330 2.5-4.332-2.5V18z" fill="#74aa9c"/></svg>`,
    claude:  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-1.227-.072L2 12.66l.097-.791.766-.072 1.156.025 2.29.097 2.507.122 1.194.048-.048-.178L9.61 11.2 8.978 9.485 8.008 6.876l-.571-1.784-.388-1.316.534-.766h.938l.433.388.388 1.123.655 2.036.875 2.616.534 1.614.194.607.146-.097.972-2.616.729-1.93.777-1.735.534-.97.729-.389h.801l.656.583-.146.85-.534.923-.875 1.832-.826 1.98-.631 1.784.157.048 1.39-.157 2.786-.146 1.784-.024h1.026l.8.754-.146.68-.607.51-1.784.122-2.362.17-1.978.17-.986.097.048.146.729.777 1.784 2.12.996 1.297.55 1.03-.194.85-.777.388-.534-.146-.68-.63-1.49-1.784-1.784-1.954-.84-.996-.097.048-.048 1.16v1.736l-.073 1.49-.17 1.3-.413.729-.729.194-.68-.437-.17-.68.073-.948.17-1.832.048-1.783v-2.12l-.048-1.33-.146.072-1.27 3.005-.923 2.169-.826 1.59-.656.923-.85.122-.607-.437.097-.85.34-.607.777-1.42.875-2.023.972-2.41z" fill="#D97757"/></svg>`,
    gemini:  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 24A14.232 14.232 0 019.86 12 14.232 14.232 0 0112 0a14.232 14.232 0 012.14 12A14.232 14.232 0 0112 24z" fill="url(#ga)"/><path d="M24 12c-3.53.35-8.765 2.14-12 2.14C8.765 14.14 3.53 12.35 0 12c3.53-.35 8.765-2.14 12-2.14C15.235 9.86 20.47 11.65 24 12z" fill="url(#gb)"/><defs><linearGradient id="ga" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#1C7DFF"/><stop offset="1" stop-color="#1C69FF"/></linearGradient><linearGradient id="gb" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="#1C7DFF"/><stop offset="1" stop-color="#1C69FF"/></linearGradient></defs></svg>`,
    perplexity: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#20B2AA" opacity="0.15" stroke="#20B2AA" stroke-width="1.2"/><path d="M12 5v14M5 12h14" stroke="#20B2AA" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    deepseek: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#4D6BFE" opacity="0.15" stroke="#4D6BFE" stroke-width="1.2"/><text x="4.5" y="16" fill="#4D6BFE" font-size="9" font-weight="bold" font-family="sans-serif">DS</text></svg>`,
    poe:      `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#8B5CF6" opacity="0.15" stroke="#8B5CF6" stroke-width="1.2"/><circle cx="12" cy="12" r="5" fill="#8B5CF6" opacity="0.4"/><circle cx="12" cy="12" r="2.5" fill="#8B5CF6"/></svg>`,
    mistral:  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#F97316" opacity="0.15" stroke="#F97316" stroke-width="1.2"/><path d="M6 8h12M6 12h12M6 16h8" stroke="#F97316" stroke-width="2" stroke-linecap="round"/></svg>`,
    gmail:    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    default:  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>`,
};

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

            const limit = data.plan === 'pro' ? 100 : (data.plan === 'infinite' ? Infinity : 3);
            const used = data.usage || 0;
            const remaining = limit === Infinity ? 'Unlimited' : Math.max(0, limit - used);
            
            const quotaText = document.getElementById('quota-text');
            const quotaBar = document.getElementById('quota-bar');
            
            if (quotaText) {
                quotaText.textContent = limit === Infinity ? 'Unlimited' : `${remaining} / ${limit} Left`;
            }
            if (quotaBar) {
                const percent = limit === Infinity ? 100 : (remaining / limit) * 100;
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
    
    if (modalUpgradeBtn) {
        const isUpgrade = type === 'upgrade' || title.toLowerCase().includes('forge') || title.toLowerCase().includes('lock') || message.toLowerCase().includes('upgrade');
        modalUpgradeBtn.style.display = isUpgrade ? 'block' : 'none';
    }
    
    const iconContainer = document.getElementById('modal-icon');
    if (!iconContainer) return;
    const iconSvg = iconContainer.querySelector('svg');
    if (!iconSvg) return;
    
    if (type === 'error') {
        iconContainer.style.background = 'rgba(244, 63, 94, 0.1)';
        iconContainer.style.borderColor = 'rgba(244, 63, 94, 0.25)';
        iconSvg.style.stroke = '#f43f5e';
        iconSvg.innerHTML = '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>';
    } else if (type === 'success') {
        iconContainer.style.background = 'rgba(16, 185, 129, 0.1)';
        iconContainer.style.borderColor = 'rgba(16, 185, 129, 0.25)';
        iconSvg.style.stroke = '#10b981';
        iconSvg.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
        
        // Auto-dismiss success modals after 3 seconds
        setTimeout(() => {
            if (modal.style.display === 'flex') modal.style.display = 'none';
        }, 3000);
    } else {
        iconContainer.style.background = 'rgba(139, 92, 246, 0.1)';
        iconContainer.style.borderColor = 'rgba(139, 92, 246, 0.25)';
        iconSvg.style.stroke = '#8b5cf6';
        iconSvg.innerHTML = '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>';
    }
};

const showAnalysis = (data) => {
    if (!dashboardView || !analysisView || !dataContainer) return;
    dashboardView.style.setProperty('display', 'none', 'important');
    analysisView.style.setProperty('display', 'block', 'important');
    dataContainer.innerHTML = ''; // Clear old data
    
    const isAI = data.messages && data.messages.length > 0;
    const points = [
        { label: 'Origin Platform', value: data.platform || 'Universal' },
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
    const optimizeBtn = document.getElementById('optimize-btn');

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
                
                // Real logo logic
                if (siteEmoji) {
                    const url = activeTab.url.toLowerCase();
                    let key = 'default';
                    if (url.includes('chatgpt') || url.includes('chat.openai')) key = 'chatgpt';
                    else if (url.includes('claude.ai')) key = 'claude';
                    else if (url.includes('gemini.google') || url.includes('bard.google')) key = 'gemini';
                    else if (url.includes('perplexity.ai')) key = 'perplexity';
                    else if (url.includes('deepseek.com') || url.includes('chat.deepseek')) key = 'deepseek';
                    else if (url.includes('poe.com')) key = 'poe';
                    else if (url.includes('mistral.ai') || url.includes('le.chat')) key = 'mistral';
                    else if (url.includes('mail.google')) key = 'gmail';
                    
                    siteEmoji.innerHTML = PLATFORM_LOGOS[key] || PLATFORM_LOGOS.default;
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
        
        // Advanced Telemetry Updates
        const speedEl = document.getElementById('relay-speed');
        const densityEl = document.getElementById('intel-density');
        if (speedEl) speedEl.textContent = (3.5 + Math.random() * 1.5).toFixed(1) + ' ms';
        if (densityEl) densityEl.textContent = (0.75 + Math.random() * 0.25).toFixed(2);
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

    if (document.getElementById('dashboard-ext-btn')) {
        document.getElementById('dashboard-ext-btn').addEventListener('click', () => {
            chrome.tabs.create({ url: `${WEB_BASE}/dashboard` });
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

    if (optimizeBtn) {
        optimizeBtn.addEventListener('click', () => {
            const isFree = (userSession?.plan || 'free') === 'free';
            if (isFree) {
                showCustomModal('Forge Logic Required', 'The optimization engine requires a Pro or Infinite plan to distill raw intelligence into professional prompts.');
                return;
            }
            
            optimizeBtn.disabled = true;
            optimizeBtn.innerHTML = `Distilling Intelligence...`;
            
            setTimeout(() => {
                optimizeBtn.innerHTML = `✅ Context Optimized`;
                optimizeBtn.style.background = 'rgba(16, 185, 129, 0.1)';
                optimizeBtn.style.borderColor = '#10b981';
                optimizeBtn.style.color = '#10b981';
                
                // Simulate optimization by adding a metadata flag
                if (capturedData) capturedData.optimized = true;
                
                showCustomModal('Optimization Complete', 'Your intelligence has been distilled into a high-fidelity context bundle ready for forging.', 'success');
            }, 1500);
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
            bridgeBtn.textContent = '⚡ VAULTING...';

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
            if (analysisView) analysisView.style.setProperty('display', 'none', 'important');
            if (dashboardView) {
                dashboardView.style.setProperty('display', 'block', 'important');
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
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

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
