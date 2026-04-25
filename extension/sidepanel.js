const PRODUCTION_URL = 'https://bridge-ai-brown.vercel.app';
const LOCAL_URL      = 'http://localhost:5173';
const LOCAL_API      = 'http://localhost:5001';
let API_BASE = PRODUCTION_URL; 
let WEB_BASE = PRODUCTION_URL;
let userSession = null;
let capturedData = null;
let currentMode = 'quick';

async function syncUserSession() {
    // 1. Try persistent storage first (Standalone Mode)
    const stored = await chrome.storage.local.get(['bridge_token', 'bridge_user']);
    if (stored.bridge_user) {
        userSession = stored.bridge_user;
        updateUIWithSession(userSession);
        return true;
    }

    // 2. Fallback to scraping active tabs (Legacy / Initial Sync)
    const tabs = await chrome.tabs.query({});
    const targetTabs = tabs.filter(t => 
        t.url?.includes('bridge-ai-brown.vercel.app') || 
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

function updateUIWithSession(session) {
    const infoContainer = document.getElementById('user-info-container');
    const loginContainer = document.getElementById('login-container');

    if (session && session.email) {
        infoContainer.style.display = 'flex';
        loginContainer.style.display = 'none';
        
        document.getElementById('user-email').textContent = session.email;
        document.getElementById('user-initial').textContent = session.email[0].toUpperCase();
        document.getElementById('sync-status').textContent = 'Relay Secure';
        document.getElementById('sync-status').style.color = '#4ade80';

        // Enforce Plan Limits
        const isFree = (session.plan || 'free') === 'free';
        document.querySelectorAll('.mode-item').forEach(item => {
            if (item.dataset.mode !== 'quick') {
                if (isFree) {
                    item.style.opacity = '0.3';
                    item.style.cursor = 'not-allowed';
                    item.title = 'Upgrade to Pro to unlock';
                } else {
                    item.style.opacity = '1';
                    item.style.cursor = 'pointer';
                    item.title = '';
                }
            }
        });
    } else {
        infoContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await syncUserSession();

    async function updatePlatformUI() {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab?.url) {
            try {
                const urlObj = new URL(activeTab.url);
                let site = urlObj.hostname.replace('www.', '').split('.')[0];
                platformName.textContent = site.charAt(0).toUpperCase() + site.slice(1);
                
                // Emoji logic
                if (activeTab.url.includes('chatgpt')) siteEmoji.textContent = '🤖';
                else if (activeTab.url.includes('gemini')) siteEmoji.textContent = '✨';
                else if (activeTab.url.includes('claude')) siteEmoji.textContent = '🧠';
                else if (activeTab.url.includes('internship')) siteEmoji.textContent = '🎓';
                else siteEmoji.textContent = '🌐';
            } catch {
                platformName.textContent = 'Universal Session';
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
    // This handles login/logout on the website without refresh
    setInterval(async () => {
        const synced = await syncUserSession();
        if (!synced && !userSession) {
            updateUIWithSession(null);
        }
        await updatePlatformUI();
    }, 3000);

    // Login Action
    document.getElementById('sidepanel-login-btn').addEventListener('click', () => {
        chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` });
    });

    // Mode Selection
    document.querySelectorAll('.mode-item').forEach(item => {
        item.addEventListener('click', () => {
            const isFree = (userSession?.plan || 'free') === 'free';
            if (isFree && item.dataset.mode !== 'quick') {
                alert('Upgrade to Pro to unlock advanced Intelligence Modes.');
                return;
            }
            document.querySelectorAll('.mode-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentMode = item.dataset.mode;
        });
    });

    extractBtn.addEventListener('click', async () => {
        // Enforce Login First
        if (!userSession) await syncUserSession();

        if (!userSession) {
            alert('Please log in to your account first.');
            chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` });
            return;
        }

        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!activeTab || !activeTab.id) {
            alert('Please select a chat tab first.');
            return;
        }

        // Clear stale data before new scan
        capturedData = null;
        extractBtn.disabled = true;
        extractBtn.textContent = 'Scanning...';
        
        console.log('BridgeAI: Dispatching extraction to Tab ID:', activeTab.id, activeTab.url);
        
        chrome.tabs.sendMessage(activeTab.id, { action: 'EXTRACT_CHAT' }, (response) => {
            extractBtn.disabled = false;
            extractBtn.innerHTML = `Capture Chat`;

            if (chrome.runtime.lastError || !response?.data) {
                console.error('BridgeAI Sync Error:', chrome.runtime.lastError);
                alert('Connection lost. Please refresh your chat page (ChatGPT/Gemini) and try again.');
                return;
            }

            capturedData = response.data;
            
            // Critical: Force source detection from the ACTUAL tab we extracted from
            const urlObj = new URL(activeTab.url);
            let site = urlObj.hostname.replace('www.', '').split('.')[0];
            capturedData.platform = site.charAt(0).toUpperCase() + site.slice(1);
            
            showAnalysis(capturedData);
        });
    });

    const showAnalysis = (data) => {
        dashboardView.style.display = 'none';
        analysisView.style.display = 'block';
        dataContainer.innerHTML = '';

        const points = [
            { label: 'SOURCE', value: data.platform },
            { label: 'SESSION TITLE', value: data.title },
            { label: 'DATA VOLUME', value: `${data.messages.length} messages saved` }
        ];

        points.forEach(p => {
            const div = document.createElement('div');
            div.className = 'data-point fade-in';
            div.innerHTML = `<label>${p.label}</label><span>${p.value}</span>`;
            dataContainer.appendChild(div);
        });

        console.log('Capture Analysis Complete:', data.platform, data.url);
    };

    cancelBtn.addEventListener('click', () => {
        analysisView.style.display = 'none';
        dashboardView.style.display = 'block';
    });

    bridgeBtn.addEventListener('click', async () => {
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
                setTimeout(() => {
                    bridgeBtn.disabled = false;
                    bridgeBtn.innerHTML = 'Save to My Account';
                }, 2000);
            } else {
                throw new Error(result.error);
            }
        } catch (err) {
            alert('Save Failed: ' + err.message);
            bridgeBtn.disabled = false;
            bridgeBtn.textContent = 'Retry Save';
        }
    });
});
