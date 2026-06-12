const PRODUCTION_URL = 'https://bridgeai-realworld-problem.vercel.app';
const LOCAL_URL      = 'http://localhost:5173';
const LOCAL_API      = 'http://localhost:5001';
let API_BASE = PRODUCTION_URL;
let WEB_BASE = PRODUCTION_URL;
let userSession = null;

/* ── AI Platform logo SVGs ────────────────────────────────── */
const PLATFORM_LOGOS = {
    chatgpt: `<svg width="16" height="16" viewBox="0 0 41 41" fill="none"><path d="M37.532 16.87a9.963 9.963 0 00-.856-8.184 10.078 10.078 0 00-10.855-4.835 9.964 9.964 0 00-7.505-3.360 10.079 10.079 0 00-9.612 6.977 9.967 9.967 0 00-6.664 4.834 10.08 10.08 0 001.24 11.817 9.965 9.965 0 00.856 8.185 10.079 10.079 0 0010.855 4.835 9.965 9.965 0 007.504 3.36 10.079 10.079 0 009.617-6.981 9.967 9.967 0 006.663-4.834 10.079 10.079 0 00-1.243-11.814zM22.498 37.886a7.474 7.474 0 01-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 00.655-1.134V19.054l3.366 1.944a.12.12 0 01.066.092v9.299a7.505 7.505 0 01-7.49 7.496zM6.392 31.006a7.471 7.471 0 01-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 001.308 0l9.724-5.614v3.888a.12.12 0 01-.048.103l-8.051 4.648a7.504 7.504 0 01-10.24-2.743zM4.297 13.62A7.469 7.469 0 018.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 00.654 1.132l9.723 5.614-3.366 1.944a.12.12 0 01-.114.012L7.044 23.86a7.504 7.504 0 01-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 01.114-.012l8.048 4.648a7.498 7.498 0 01-1.158 13.528v-9.476a1.293 1.293 0 00-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 00-1.308 0l-9.723 5.614v-3.888a.12.12 0 01.048-.103l8.05-4.645a7.497 7.497 0 0111.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 01-.065-.092v-9.299a7.497 7.497 0 0112.293-5.756 6.94 6.94 0 00-.236.134l-7.965 4.6a1.294 1.294 0 00-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.499v4.993l-4.330 2.5-4.332-2.5V18z" fill="#74aa9c"/></svg>`,
    claude:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-1.227-.072L2 12.66l.097-.791.766-.072 1.156.025 2.29.097 2.507.122 1.194.048-.048-.178L9.61 11.2 8.978 9.485 8.008 6.876l-.571-1.784-.388-1.316.534-.766h.938l.433.388.388 1.123.655 2.036.875 2.616.534 1.614.194.607.146-.097.972-2.616.729-1.93.777-1.735.534-.97.729-.389h.801l.656.583-.146.85-.534.923-.875 1.832-.826 1.98-.631 1.784.157.048 1.39-.157 2.786-.146 1.784-.024h1.026l.8.754-.146.68-.607.51-1.784.122-2.362.17-1.978.17-.986.097.048.146.729.777 1.784 2.12.996 1.297.55 1.03-.194.85-.777.388-.534-.146-.68-.63-1.49-1.784-1.784-1.954-.84-.996-.097.048-.048 1.16v1.736l-.073 1.49-.17 1.3-.413.729-.729.194-.68-.437-.17-.68.073-.948.17-1.832.048-1.783v-2.12l-.048-1.33-.146.072-1.27 3.005-.923 2.169-.826 1.59-.656.923-.85.122-.607-.437.097-.85.34-.607.777-1.42.875-2.023.972-2.41z" fill="#D97757"/></svg>`,
    gemini:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 24A14.232 14.232 0 019.86 12 14.232 14.232 0 0112 0a14.232 14.232 0 012.14 12A14.232 14.232 0 0112 24z" fill="url(#ga)"/><path d="M24 12c-3.53.35-8.765 2.14-12 2.14C8.765 14.14 3.53 12.35 0 12c3.53-.35 8.765-2.14 12-2.14C15.235 9.86 20.47 11.65 24 12z" fill="url(#gb)"/><defs><linearGradient id="ga" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#1C7DFF"/><stop offset="1" stop-color="#1C69FF"/></linearGradient><linearGradient id="gb" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="#1C7DFF"/><stop offset="1" stop-color="#1C69FF"/></linearGradient></defs></svg>`,
    perplexity: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#20B2AA" opacity="0.9"/><path d="M12 6v12M6 12h12" stroke="white" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    deepseek: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#4D6BFE" opacity="0.9"/><text x="5" y="16" fill="white" font-size="9" font-weight="bold" font-family="sans-serif">DS</text></svg>`,
    poe:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#8B5CF6" opacity="0.9"/><circle cx="12" cy="12" r="5" fill="white" opacity="0.9"/></svg>`,
    mistral:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" fill="#F97316" opacity="0.9"/><path d="M7 8h10M7 12h10M7 16h6" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    default:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>`,
};

const PLATFORM_COLORS = {
    chatgpt: '#74aa9c', claude: '#D97757', gemini: '#1C7DFF',
    perplexity: '#20B2AA', deepseek: '#4D6BFE', poe: '#8B5CF6',
    mistral: '#F97316', default: 'rgba(255,255,255,0.3)',
};

/* ── Mode Prompts ─────────────────────────────────────────── */
const MODE_PROMPTS = {
    quick:     'Give a brief TL;DR summary (3-5 bullet points) of the following conversation:\n\nCONVERSATION:\n',
    developer: 'Summarize the following chat as Developer Context:\n1. Goal / Feature\n2. Tech Stack\n3. Current Bugs / Issues\n4. Next Steps\n\nCONVERSATION:\n',
    research:  'Summarize the following chat into Research Notes:\n1. Core Concepts\n2. Key Insights\n3. Open Questions\n4. Sources mentioned\n\nCONVERSATION:\n',
    study:     'Summarize the following chat into Study Notes:\n1. Topic\n2. Key Concepts\n3. Important Points\n4. Questions to Review\n\nCONVERSATION:\n',
    project:   'Summarize the following chat as a Project Overview:\n1. Project Status\n2. Completed Tasks\n3. Current Blockers\n4. Immediate Next Steps\n\nCONVERSATION:\n',
};

/* ── Detect platform from URL ─────────────────────────────── */
function detectPlatform(url) {
    if (!url) return { key: 'default', name: 'Universal LLM' };
    const h = url.toLowerCase();
    if (h.includes('chatgpt.com') || h.includes('chat.openai'))   return { key: 'chatgpt',    name: 'ChatGPT' };
    if (h.includes('claude.ai'))                                    return { key: 'claude',     name: 'Claude' };
    if (h.includes('gemini.google') || h.includes('bard.google'))  return { key: 'gemini',     name: 'Gemini' };
    if (h.includes('perplexity.ai'))                               return { key: 'perplexity', name: 'Perplexity' };
    if (h.includes('deepseek.com') || h.includes('chat.deepseek')) return { key: 'deepseek',   name: 'DeepSeek' };
    if (h.includes('poe.com'))                                      return { key: 'poe',        name: 'Poe' };
    if (h.includes('mistral.ai') || h.includes('le.chat'))         return { key: 'mistral',    name: 'Mistral' };
    return { key: 'default', name: 'Universal LLM' };
}

/* ── Sync user session from BridgeAI tab ─────────────────── */
async function syncUserSession() {
    const tabs = await chrome.tabs.query({});
    const targets = tabs.filter(t =>
        t.url?.includes('bridgeai-realworld-problem.vercel.app') ||
        t.url?.includes('bridgeai.com') ||
        t.url?.includes('localhost:5173')
    ).sort((a, b) => (a.active ? -1 : b.active ? 1 : 0));

    for (const t of targets) {
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: t.id },
                func: () => localStorage.getItem('bridge_user')
            });
            if (results?.[0]?.result) {
                userSession = JSON.parse(results[0].result);
                API_BASE = t.url.includes('localhost') ? LOCAL_API : PRODUCTION_URL;
                WEB_BASE = t.url.includes('localhost') ? LOCAL_URL : PRODUCTION_URL;
                return true;
            }
        } catch (e) {}
    }
    return false;
}

/* ── Update UI with session ───────────────────────────────── */
function updateSessionUI() {
    const userChip    = document.getElementById('user-chip');
    const userAvatar  = document.getElementById('user-avatar');
    const userEmail   = document.getElementById('user-email');
    const userPlanLbl = document.getElementById('user-plan-label');
    const planBadge   = document.getElementById('plan-badge');
    const loginPrompt = document.getElementById('login-prompt');

    if (userSession) {
        // Show user chip
        userChip.style.display = 'flex';
        loginPrompt.style.display = 'none';
        userAvatar.textContent = userSession.name?.charAt(0).toUpperCase() || userSession.email?.charAt(0).toUpperCase() || '?';
        userEmail.textContent = userSession.email || '—';
        const plan = userSession.plan || 'free';
        userPlanLbl.textContent = plan === 'pro' ? '⚡ Pro Plan — Unlimited' : plan === 'infinite' ? '∞ Infinite Plan' : '🆓 Free Plan';
        planBadge.textContent = plan.toUpperCase();
        if (plan === 'pro' || plan === 'infinite') {
            planBadge.classList.add('pro');
        }
    } else {
        userChip.style.display = 'none';
        loginPrompt.style.display = 'block';
    }
}

/* ── Update quota display ─────────────────────────────────── */
async function updateQuota() {
    const quotaText = document.getElementById('quota-text');
    const quotaBar  = document.getElementById('quota-bar');

    if (!userSession) {
        quotaText.textContent = 'Sign in to view';
        quotaBar.style.width = '0%';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/user/status?email=${userSession.email}`);
        const data = await res.json();
        if (data.success) {
            const plan = data.plan || 'free';
            const used = data.usage || 0;
            const isUnlimited = plan === 'pro' || plan === 'infinite';
            const limit = isUnlimited ? Infinity : 10;
            const pct = isUnlimited ? 100 : Math.min(100, Math.round((used / limit) * 100));
            quotaText.textContent = isUnlimited ? `${used} used (∞)` : `${used} / ${limit} used`;
            quotaBar.style.width = `${pct}%`;
            if (pct > 85) quotaBar.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
            document.getElementById('intel-density').textContent = used;

            if (userSession) {
                userSession.plan = plan;
                updateSessionUI();
                enforcePlanLimits(plan);
            }
        }
    } catch(e) {
        quotaText.textContent = 'Offline';
    }
}

/* ── Enforce plan limits on modes ─────────────────────────── */
function enforcePlanLimits(plan) {
    const isFree = plan === 'free';
    ['dev', 'research', 'study', 'project'].forEach(mode => {
        const input = document.getElementById(`m-${mode}`);
        const wrap  = document.getElementById(`mode-${mode}-wrap`);
        if (input) input.disabled = isFree;
        if (wrap && isFree) {
            wrap.classList.add('locked');
            wrap.querySelector('label').onclick = (e) => {
                e.preventDefault();
                const s = document.getElementById('status-text-result');
                if (s) { s.textContent = '⚡ Upgrade to Pro to unlock this mode.'; s.className = 'status-msg error'; }
            };
        }
    });
}

/* ── Set platform UI ──────────────────────────────────────── */
function setPlatformUI(platform) {
    const iconWrap = document.getElementById('platform-icon-wrap');
    const nameEl   = document.getElementById('platform-name');
    if (iconWrap) iconWrap.innerHTML = PLATFORM_LOGOS[platform.key] || PLATFORM_LOGOS.default;
    if (nameEl)   nameEl.textContent = platform.name;
    // Set icon background tint
    if (iconWrap) {
        const color = PLATFORM_COLORS[platform.key] || 'rgba(255,255,255,0.08)';
        iconWrap.style.background = `${color}22`;
    }
}

/* ══ MAIN ══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
    // Sync session first
    await syncUserSession();
    updateSessionUI();
    updateQuota();

    if (userSession) enforcePlanLimits(userSession.plan || 'free');

    const extractBtn    = document.getElementById('extract-btn');
    const bridgeBtn     = document.getElementById('bridge-btn');
    const backBtn       = document.getElementById('back-btn');
    const statusText    = document.getElementById('status-text');
    const statusResult  = document.getElementById('status-text-result');
    const mainSection   = document.getElementById('main');
    const resultSection = document.getElementById('result');
    const msgCount      = document.getElementById('msg-count');

    let capturedData = null;

    // Detect active tab platform
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const platform = detectPlatform(tab?.url);
    setPlatformUI(platform);

    // Relay speed heartbeat
    setInterval(() => {
        const speedEl = document.getElementById('relay-speed');
        if (speedEl) speedEl.textContent = (3.2 + Math.random() * 1.8).toFixed(1) + ' ms';
    }, 3000);

    // Login button
    document.getElementById('login-btn')?.addEventListener('click', () => {
        chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` });
    });

    // Footer links
    document.getElementById('open-dashboard')?.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: `${WEB_BASE}/dashboard` });
    });
    document.getElementById('open-profile')?.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: `${WEB_BASE}/profile` });
    });
    document.getElementById('open-support')?.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: `${WEB_BASE}/support` });
    });

    // Back button
    backBtn?.addEventListener('click', () => {
        resultSection.style.display = 'none';
        mainSection.style.display = 'block';
        extractBtn.disabled = false;
        statusText.textContent = 'Ready to capture your chat.';
        statusText.className = 'status-msg';
    });

    /* ── CAPTURE ─────────────────────────────────────────── */
    extractBtn.addEventListener('click', async () => {
        if (!userSession) {
            statusText.textContent = 'Please sign in to your account first.';
            statusText.className = 'status-msg error';
            setTimeout(() => chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` }), 1200);
            return;
        }

        statusText.textContent = 'Scanning chat messages...';
        statusText.className = 'status-msg';
        extractBtn.disabled = true;

        chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_CHAT' }, (response) => {
            if (chrome.runtime.lastError) {
                statusText.textContent = 'Not linked — Please refresh the chat page.';
                statusText.className = 'status-msg error';
                extractBtn.disabled = false;
                return;
            }
            if (response?.data?.messages?.length > 0) {
                capturedData = response.data;
                msgCount.textContent = capturedData.messages.length;
                mainSection.style.display = 'none';
                resultSection.style.display = 'block';
            } else {
                statusText.textContent = 'No messages found. Try scrolling up first.';
                statusText.className = 'status-msg error';
                extractBtn.disabled = false;
            }
        });
    });

    /* ── DIRECT SHARE ────────────────────────────────────────── */
    document.querySelectorAll('.llm-share-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const target = e.currentTarget.dataset.target;
            const selectedMode = document.querySelector('input[name="summary-mode"]:checked')?.value || 'quick';
            const promptStr = MODE_PROMPTS[selectedMode];
            
            let contextText = capturedData.messages.map(m => `${(m.role || 'user').toUpperCase()}: ${m.text}`).join('\n\n');
            let finalPayload = `[BridgeAI Context Transfer]\n\n${promptStr}\n\n${contextText}`;

            await chrome.storage.local.set({ pending_bridge: finalPayload });

            let url = '';
            if (target === 'chatgpt') url = 'https://chatgpt.com/';
            else if (target === 'claude') url = 'https://claude.ai/new';
            else if (target === 'gemini') url = 'https://gemini.google.com/';

            chrome.tabs.create({ url });
        });
    });

    /* ── SAVE ────────────────────────────────────────────── */
    bridgeBtn.addEventListener('click', async () => {
        if (!userSession) await syncUserSession();

        if (!userSession) {
            statusResult.textContent = 'Please sign in to your account.';
            statusResult.className = 'status-msg error';
            setTimeout(() => chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` }), 1200);
            return;
        }

        bridgeBtn.disabled = true;
        bridgeBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Saving...`;
        statusResult.textContent = 'Connecting to your account...';
        statusResult.className = 'status-msg';

        // Add spin animation
        const spinStyle = document.createElement('style');
        spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(spinStyle);

        const selectedMode = document.querySelector('input[name="summary-mode"]:checked')?.value || 'quick';

        try {
            const res = await fetch(`${API_BASE}/api/summarize`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: capturedData.compressedMessages ? [] : capturedData.messages,
                    compressedMessages: capturedData.compressedMessages,
                    platform: capturedData.platform || platform.name || 'Universal',
                    title:    capturedData.title || '',
                    email:    userSession?.email || 'guest',
                    mode:     selectedMode,
                    prompt:   MODE_PROMPTS[selectedMode],
                    optimizedText: (capturedData.optimized && capturedData.optimizedPrompt) ? capturedData.optimizedPrompt : null
                })
            });

            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Save failed');

            bridgeBtn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(16,185,129,0.2)"/><path d="M8 12l3 3 5-5" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Saved!`;
            bridgeBtn.style.borderColor = 'rgba(16,185,129,0.3)';
            bridgeBtn.style.color = '#10b981';
            statusResult.textContent = 'Context saved successfully!';
            statusResult.className = 'status-msg ok';

            setTimeout(() => {
                chrome.tabs.create({ url: `${WEB_BASE}/dashboard?status=success&bridgeId=${data.bridgeData?.id}` });
            }, 900);

        } catch (err) {
            console.error('Save error:', err);
            const isAuth = err.message?.includes('Unauthorized') || err.message?.includes('auth');
            bridgeBtn.innerHTML = `⚠ Save Failed`;
            bridgeBtn.disabled = false;
            statusResult.textContent = isAuth ? 'Session expired. Please sign in again.' : `Error: ${err.message}`;
            statusResult.className = 'status-msg error';
            if (isAuth) setTimeout(() => chrome.tabs.create({ url: `${PRODUCTION_URL}/login?redirect=dashboard` }), 1200);
        }
    });

    // Health check (silent)
    try {
        await fetch(`${API_BASE}/api/health`);
    } catch (e) {}
});
