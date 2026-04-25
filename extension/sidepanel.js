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
        t.url?.includes('localhost:5173')
    );

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

function updateUIWithSession(session) {
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
}

document.addEventListener('DOMContentLoaded', async () => {
    await syncUserSession();

    const extractBtn = document.getElementById('extract-btn');
    const bridgeBtn = document.getElementById('bridge-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const platformName = document.getElementById('platform-name');
    const dashboardView = document.getElementById('dashboard-view');
    const analysisView = document.getElementById('analysis-view');
    const dataContainer = document.getElementById('data-container');
    const siteEmoji = document.getElementById('site-emoji');

    // Detect platform
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
        try {
            const urlObj = new URL(tab.url);
            let site = urlObj.hostname.replace('www.', '').split('.')[0];
            platformName.textContent = site.charAt(0).toUpperCase() + site.slice(1);
            
            // Emoji logic
            if (tab.url.includes('chatgpt')) siteEmoji.textContent = '🤖';
            else if (tab.url.includes('gemini')) siteEmoji.textContent = '✨';
            else if (tab.url.includes('claude')) siteEmoji.textContent = '🧠';
            else if (tab.url.includes('internship')) siteEmoji.textContent = '🎓';
            else siteEmoji.textContent = '🌐';
        } catch {
            platformName.textContent = 'Universal Session';
        }
    }

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

        extractBtn.disabled = true;
        extractBtn.textContent = 'Scanning...';
        
        chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_CHAT' }, (response) => {
            extractBtn.disabled = false;
            extractBtn.innerHTML = `Capture Chat`;

            if (chrome.runtime.lastError || !response?.data) {
                alert('Connection lost. Please refresh the page and try again.');
                return;
            }

            capturedData = response.data;
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
            { label: 'DATA VOLUME', value: `${data.messages.length} signals captured` }
        ];

        points.forEach(p => {
            const div = document.createElement('div');
            div.className = 'data-point fade-in';
            div.innerHTML = `<label>${p.label}</label><span>${p.value}</span>`;
            dataContainer.appendChild(div);
        });
    };

    cancelBtn.addEventListener('click', () => {
        analysisView.style.display = 'none';
        dashboardView.style.display = 'block';
    });

    bridgeBtn.addEventListener('click', async () => {
        if (!userSession) await syncUserSession();
        
        bridgeBtn.disabled = true;
        bridgeBtn.textContent = '⚡ DISTILLING...';

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
