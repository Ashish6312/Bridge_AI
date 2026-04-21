@echo off
echo 🔷 BridgeAI Developer Relay: Auto-Linking Extension...
cd /d "%~dp0"
call npm run package-extension
echo 🚀 Launching Chrome with BridgeAI Pre-Loaded...
start chrome --load-extension="%~dp0extension" "https://bridge-ai-brown.vercel.app/dashboard?tab=extension"
echo ✅ Extension auto-linked for current session.
pause
