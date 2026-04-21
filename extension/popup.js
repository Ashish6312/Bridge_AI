const PRODUCTION_URL = 'https://bridge-ai-brown.vercel.app';
let API_BASE = PRODUCTION_URL; // ✅ Always default to production
let userSession = null;

const MODE_PROMPTS = {
    quick:     'Give a brief TL;DR summary (3-5 bullet points) of the following conversation:\n\nCONVERSATION:\n',
    developer: 'Summarize the following chat as Developer Context:\n1. Goal / Feature\n2. Tech Stack\n3. Current Bugs / Issues\n4. Next Steps\n\nCONVERSATION:\n',
    research:  'Summarize the following chat into Research Notes:\n1. Core Concepts\n2. Key Insights\n3. Open Questions\n4. Sources mentioned\n\nCONVERSATION:\n',
    study:     'Summarize the following chat into Study Notes:\n1. Topic\n2. Key Concepts\n3. Important Points\n4. Questions to Review\n\nCONVERSATION:\n',
    project:   'Summarize the following chat as a Project Overview:\n1. Project Status\n2. Completed Tasks\n3. Current Blockers\n4. Immediate Next Steps\n\nCONVERSATION:\n',
};

// Sovereign Sync: Detect user session from website
async function syncUserSession() {
    console.log('🔄 Initiating Sovereign Sync...');
    const tabs = await chrome.tabs.query({});
    const targetTabs = tabs.filter(t => 
        t.url?.includes('bridge-ai-brown.vercel.app') || 
        t.url?.includes('bridgeai.com')
    );

    // ✅ Always prefer production
    targetTabs.sort((a, b) => {
        const isProdA = a.url?.includes('vercel.app') || a.url?.includes('bridgeai.com');
        const isProdB = b.url?.includes('vercel.app') || b.url?.includes('bridgeai.com');
        return isProdA === isProdB ? 0 : isProdA ? -1 : 1;
    });
    
    if (targetTabs.length === 0) {
        return;
    }

    for (const t of targetTabs) {
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: t.id },
                func: () => localStorage.getItem('bridge_user')
            });
            
            if (results?.[0]?.result) {
                userSession = JSON.parse(results[0].result);
                
                // Authoritative API Base Detection
                API_BASE = PRODUCTION_URL;

                console.log('✅ Identity Materialized:', userSession.email, 'linking via', API_BASE);
                
                const statusResult = document.getElementById('status-text-result');
                if (statusResult && !statusResult.textContent.includes('Distilling')) {
                   statusResult.textContent = `Analyst Connected: ${userSession.email}`;
                   statusResult.style.color = '#4ade80';
                }
                return true;
            }
        } catch (e) {
            // Silently skip tabs without perms or issues
        }
    }
    return false;
}

document.addEventListener('DOMContentLoaded', async () => {
    await syncUserSession();

    const extractBtn    = document.getElementById('extract-btn');
    const bridgeBtn     = document.getElementById('bridge-btn');
    const statusText    = document.getElementById('status-text');
    const statusResult  = document.getElementById('status-text-result');
    const platformName  = document.getElementById('platform-name');
    const mainSection   = document.getElementById('main');
    const resultSection = document.getElementById('result');
    const msgCount      = document.getElementById('msg-count');

    let capturedData = null;

    // Detect platform
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
        try {
            const urlObj = new URL(tab.url);
            let siteName = urlObj.hostname.replace('www.', '').split('.')[0];
            platformName.textContent = siteName.charAt(0).toUpperCase() + siteName.slice(1) || 'Universal LLM';
        } catch {
            platformName.textContent = 'Universal LLM';
        }
    }

    extractBtn.addEventListener('click', () => {
        statusText.textContent = 'Scanning for intelligence...';
        extractBtn.disabled = true;

        chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_CHAT' }, (response) => {
            if (chrome.runtime.lastError) {
                statusText.textContent = 'Not linked — Refresh (F5) the chat page.';
                extractBtn.disabled = false;
                return;
            }
            if (response?.data?.messages?.length > 0) {
                capturedData = response.data;
                msgCount.textContent = capturedData.messages.length;
                mainSection.style.display  = 'none';
                resultSection.style.display = 'block';
            } else {
                statusText.textContent = 'No intelligence detected. Scroll context then retry.';
                extractBtn.disabled = false;
            }
        });
    });

    bridgeBtn.addEventListener('click', async () => {
        // Final Sync Re-check
        if (!userSession) await syncUserSession();

        if (!userSession) {
            statusResult.textContent = '❌ Hub Account Required. Redirecting...';
            statusResult.style.color = '#fb7185';
            bridgeBtn.textContent = '❌ RECONNECT';
            setTimeout(() => {
                chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` });
            }, 1000);
            return;
        }

        bridgeBtn.textContent   = '⚡ DISTILLING...';
        statusResult.textContent = 'Engaging Sovereign Relay...';

        try {
            const res = await fetch(`${API_BASE}/api/summarize`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: capturedData.messages,
                    platform: capturedData.platform || 'Universal',
                    title: capturedData.title || '',
                    email: userSession?.email || 'guest'
                })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Distillation failed');

            bridgeBtn.textContent   = '✅ VAULTED';
            statusResult.textContent = 'Synchronizing with Secure Vault…';

            setTimeout(() => {
                const redirectUrl = `${PRODUCTION_URL}/dashboard?status=success&bridgeId=${data.bridgeData.id}`;
                chrome.tabs.create({ url: redirectUrl });
            }, 800);

        } catch (err) {
            console.error('Core Engine Failure:', err);
            if (err.message.includes('Unauthorized')) {
                statusResult.textContent = '❌ Hub Account Required. Opening Dashboard...';
                statusResult.className = 'status error-text';
                bridgeBtn.textContent = '❌ RECONNECT';
                setTimeout(() => {
                    chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` });
                }, 1000);
            } else {
                statusResult.textContent = `Connection Error: ${err.message}`;
                statusResult.className = 'status error-text';
                bridgeBtn.textContent    = '❌ RECONNECT';
                bridgeBtn.disabled       = false;
            }
        }
    });

    // Health check
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        if (data.status === 'online') console.log(`Hub Sovereign Relay: ONLINE (${API_BASE})`);
    } catch (e) {}
});
