import React, { useEffect, useState, useCallback } from 'react';

const MonkfeedWidget = () => {
    const [userData, setUserData] = useState(null);
    const [remountKey, setRemountKey] = useState(0);

    const fetchSession = useCallback(async () => {
        try {
            // Try to get from localStorage first as the backend might not have the endpoint yet
            const storedUser = localStorage.getItem('bridge_user');
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
                return;
            }

            // Fallback to API if implemented
            const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '';
            const res = await fetch(`${API_BASE}/api/auth/me?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setUserData(data?.email ? data : null);
            } else {
                setUserData(null);
            }
        } catch (e) {
            // Expected if backend isn't running; silently fallback to null session
            setUserData(null);
        }
    }, []);

    useEffect(() => {
        fetchSession();
        
        const handleLogin = (e) => { 
            setUserData(e.detail?.user || e.detail); 
            setRemountKey(k => k + 1); 
        };
        const handleLogout = () => {
            setUserData(null);
            setRemountKey(k => k + 1);
            if (window.__upvote_cleanup) window.__upvote_cleanup();
        };

        window.addEventListener('monkfeed:login', handleLogin);
        window.addEventListener('monkfeed:logout', handleLogout);
        window.addEventListener('BRIDGE_AUTH_UPDATE', handleLogin); // Support existing app events
        window.addEventListener('focus', fetchSession);

        // Inject Script
        const script = document.createElement('script');
        script.src = "https://monkfeed.entrext.com/widget.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            window.removeEventListener('monkfeed:login', handleLogin);
            window.removeEventListener('monkfeed:logout', handleLogout);
            window.removeEventListener('BRIDGE_AUTH_UPDATE', handleLogin);
            window.removeEventListener('focus', fetchSession);
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [fetchSession]);

    return (
        <div key={remountKey}>
            <div className="monkfeed-widget"
                data-application-id="69a41f4f3a9a405a41b02afe"
                data-user-id={userData?.email || ''} // Using email as ID for consistency
                data-email={userData?.email || ''}
                data-logo-url="/favicon.svg"
                data-primary-color="#8b5cf6"
                data-secondary-color="#06b6d4"
                data-bg-color="#FFFFFF"
                data-text-color="#000000"
                data-launcher-color="#4F46E5"
                data-launcher-active-color="#4338CA"
                data-product-overview="BridgeAI is a professional-grade context infrastructure designed to bridge the intelligence gap between disparate AI platforms (Gemini, Claude, ChatGPT, Perplexity). It ensures seamless context continuity, accelerates development velocity, and preserves logical constraints across sessions."
                data-about-text="Built for architects who value momentum over redundant typing. BridgeAI allows you to extract, forge, and relay intelligence with zero logic decay. Welcome to the Context Revolution."
                data-faqs='[
                    {"question":"What does BridgeAI do?","answer":"BridgeAI extracts your conversation context from one LLM (like ChatGPT) and allows you to seamlessly relay it to another (like Gemini or Claude) with perfect logical continuity."},
                    {"question":"How does the Intelligence Forge work?","answer":"It re-distills raw chat logs into highly optimized \"Intelligence Bundles\" that are formatted specifically for consumption by other LLMs."},
                    {"question":"Is there a browser extension?","answer":"Yes! The Analyst Module is a Manifest V3 extension that enables live, one-click extraction from any compatible AI interface."},
                    {"question":"Does it store my data?","answer":"BridgeAI prioritizes sovereignty. Extractions are vaulted in your account, but you have full control over your intelligence bundles and can delete them at any time."},
                    {"question":"Which AI platforms are supported?","answer":"Currently, we support ChatGPT, Gemini, Claude, and Perplexity, with more being added to the protocol regularly."}
                ]'
                data-position="right" />
        </div>
    );
};

export default MonkfeedWidget;
