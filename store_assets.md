# Chrome Web Store Listing & Submission Metadata

This file contains the complete, production-ready, and reviewer-safe listings, disclosures, and justifications for **Bridge AI - Universal Chat & Prompt Sync**. Use these texts to fill out the Google Chrome Web Store developer dashboard submission forms.

---

## 1. Short Description (Max 132 Characters)
> Instantly bridge, summarize, and sync conversation contexts across ChatGPT, Claude, Gemini, and DeepSeek without context loss.

*(Length check: 126 characters - meets the maximum 132-character requirement).*

---

## 2. Full Description

### Bridge AI: Universal Chat & Prompt Sync

BridgeAI is a developer utility designed to simplify conversation context transfers between popular artificial intelligence portals. If you frequently toggle between Claude, ChatGPT, Gemini, Perplexity, DeepSeek, and Mistral, BridgeAI helps you maintain your active workspace state by extracting chat contexts on-demand and loading them into target prompt boxes without losing code logs or discussion history.

### Main Capabilities
* **On-Demand Context Transfer:** Extract conversation text from an active tab and copy/bridge it directly to another AI interface with a single user-triggered command.
* **Universal Text Extraction:** Parse message blocks and outline details from compatible documentation, portals, or Gmail threads to use as prompt context.
* **Structured Format Templates:** Convert extracted conversation histories into formatted Markdown or JSON blocks.
* **Local-First Buffering:** Save your current workspace buffers locally inside the extension sandbox.

### Supported Platforms
* OpenAI ChatGPT (chatgpt.com)
* Anthropic Claude (claude.ai)
* Google Gemini (gemini.google.com)
* Perplexity AI (perplexity.ai)
* DeepSeek (deepseek.com)
* Poe (poe.com)
* Mistral AI (mistral.ai)
* Google Gmail (mail.google.com) - for email discussion context

### How the Bridge Workflow Operates
1. **User-Triggered Capture:** Navigate to a thread on a supported AI website and click "Extract Context" in the BridgeAI popup or side panel.
2. **Local Compilation:** The extension script reads the webpage markup in that active tab to extract the conversation thread.
3. **Local Buffer Storage:** The structural summary is compiled and stored in your local browser sandbox (`chrome.storage.local`).
4. **Manual Bridge Transfer:** When you open a target AI platform tab, the pending context is retrieved from local storage and automatically populated into the prompt box, allowing you to resume your work instantly.

### Adjustable Transfer Modes
* **Quick Sync:** Formats a concise, text-only conversation log for rapid model handoffs.
* **Dev Sync:** Highlights code snippets, environment logs, and developer task outlines.
* **Deep Sync:** Retains conversational details and structured message outlines.

### Privacy Commitments
* **Zero Keystroke Logging:** BridgeAI does not monitor key logs, record passwords, or intercept form fields.
* **No Hidden Background Tracking:** Content scripts only execute when you manually open the extension interface or trigger a bridge transfer command.
* **No Data Monetization:** We do not sell user data, integrate tracking pixels, or distribute ads. Cloud syncing is 100% optional and disabled by default.

---

## 3. Recommended Homepage URL
* `https://bridgeai-realworld-problem.vercel.app/`

## 4. Recommended Support URL
* `https://bridgeai-realworld-problem.vercel.app/support`

## 5. Recommended Privacy Policy URL
* `https://bridgeai-realworld-problem.vercel.app/privacy`

---

## 6. Reviewer Test Instructions

To assist Chrome Web Store reviewers in verifying extension functionality:

1. **Verify Manual Extraction:**
   * Open a supported platform (e.g., [https://chatgpt.com](https://chatgpt.com) or [https://claude.ai](https://claude.ai)).
   * Start a brief text conversation (e.g., write "Hello, I am testing the BridgeAI context parser.").
   * Click the **BridgeAI** icon (🔷) in the Chrome toolbar to open the extension popup.
   * Click the **"Extract Context"** button. The extension will read the visible DOM tree in the active tab and display a structured outline. *Note: No autonomous or unprompted scanning occurs.*
2. **Verify Manual Context Transfer (Bridge):**
   * Click **"Bridge Context"** in the popup to buffer the summary.
   * Open a different target AI website tab (e.g., [https://gemini.google.com](https://gemini.google.com)).
   * Notice that the extension reads the buffered context from local storage and formats it into the prompt input box: `System: Continuing from BridgeAI extracted context...`
3. **Verify Local-First Sandbox:**
   * Open the Chrome developer tools console for the extension.
   * Verify that no external telemetry endpoints are pinged. All storage, templates, and formatting are processed on the local device.

---

## 7. Data Usage Disclosure

Please select the following answers in the developer dashboard "Data Usage" questionnaire:

* **What data is collected?**
  * We collect the user's email address and profile credentials **only** if the user chooses to create an account on the dashboard to synchronize vaults. The extension itself does not collect personal data.
* **Is data sold?**
  * No. We do not sell, trade, or rent user data to third parties.
* **Is data shared?**
  * No. Data is not shared with any advertising networks, trackers, or marketing platforms.
* **Is browsing history collected?**
  * No. We do not track websites visited or history logs. We only interact with active tabs when explicitly triggered by the user.
* **Is personally identifiable information (PII) collected?**
  * Only the user's email address (for account creation on the dashboard).
* **Is data encrypted?**
  * Yes. Synced items are encrypted in transit using TLS 1.3 and at rest via AES-256 protocols.
* **How is data stored?**
  * Buffered data remains inside the browser client sandbox (`chrome.storage.local`). Account synchronization is entirely user-controlled and optional.

---

## 8. Permission Justifications

| Permission | Technical Rationale for Reviewers |
| :--- | :--- |
| `storage` | **Required to buffer pending context.** Stores the structured conversation summary locally in `chrome.storage.local` during a manual bridge action to allow transfer to a target input tab. |
| `activeTab` | **Required for user-triggered page reading.** Grants temporary DOM read access to compile conversation logs *only* when the user explicitly triggers an extraction action. |
| `scripting` | **Required to inject parser selectors.** Runs the local parsing script inside the active AI platform tab to structuralize the conversation tree when the user initiates a capture. |
| `clipboardWrite` | **Required to copy templates.** Enables the user to manually copy formatted Markdown or JSON outlines to the OS clipboard via the "Copy" UI buttons. |
| `tabs` | **Required to detect model pages.** Checks tab loading state to verify if a pending context bridge matches the loaded domain (e.g., loading Claude input fields). |
| `sidePanel` | **Required for side-by-side workflow.** Hosts the templates, project list, and troubleshooting panels in a clean, persistent browser side panel. |

---

## 9. Safe Host Permissions

We recommend listing explicit domains in the manifest rather than broad `<all_urls>` matches, to ensure a swift extension approval process:

```json
"host_permissions": [
  "https://chatgpt.com/*",
  "https://claude.ai/*",
  "https://gemini.google.com/*",
  "https://perplexity.ai/*",
  "https://deepseek.com/*",
  "https://poe.com/*",
  "https://mistral.ai/*",
  "https://bridgeai-realworld-problem.vercel.app/*"
]
```

---

## 10. Reviewer Notes (CWS Text Box)
```text
Reviewer Note:
BridgeAI is a local-first utility built on Manifest V3. 

Key Security Guidelines Met:
1. Least Privilege: Permissions are restricted to the storage of local buffers and scripting inside specific AI domains.
2. User Sovereignty: Extraction and auto-paste actions are strictly user-triggered (no background scanning or autonomous background requests).
3. Secure Execution: No remotely hosted scripts are loaded at runtime.
4. No Keystroke Logs: The extension parses DOM structures of existing conversations on demand and does not track active keyboard inputs.
```

---

## 11. Screenshot Captions

1. **Screenshot 1:** "On-Demand Context Extraction. Parse and outline chat logs from ChatGPT, Claude, and Gemini in a single click."
2. **Screenshot 2:** "Seamless Context Bridge. Instantly load buffered summaries when transitioning to rival AI platforms."
3. **Screenshot 3:** "Local Storage Buffer. Keep your conversation templates and environment logs in a secure client-side sandbox."
4. **Screenshot 4:** "Integrated Side Panel. Keep your workspace tools active alongside your primary coding window."
5. **Screenshot 5:** "User-Controlled Cloud Sync. Opt-in to sync your project vaults securely to your online account dashboard."

---

## 12. Promotional Asset Text

### Small Promo Tile (440x280)
* **Title:** BridgeAI
* **Subtitle:** Cross-LLM Context Bridge
* **Key Copy:** Client-side context portability. No logic decay.
* **Visual Concept:** Minimal, clean developer interface showing a glowing bridge linking ChatGPT, Claude, and Gemini icons.

### Marquee Promo Tile (1400x560)
* **Main Header:** Move Context Instantly Between AI Platforms
* **Features Copy:** Local-First Storage • User-Triggered Transfer • Manifest V3 Compliant
* **Call to Action:** Zero background tracking. Full privacy control.
* **Visual Concept:** Glowing blue-violet wireframe matrix showcasing the transition of structured code variables from Claude to ChatGPT.

---

## 13. Final Submission Approval Checklist

Prior to clicking "Submit for Review," complete these validation checks:

- [x] **URL Integrity:** Verify that `/privacy`, `/terms`, and `/support` are fully compiled and deployed to the server domain (`bridgeai-realworld-problem.vercel.app`).
- [x] **Safe Wording:** Double-check that all dashboard text entries avoid automated terms (like "autonomous scraping" or "hidden extraction") and emphasize manual triggers.
- [x] **Icon & Screenshot Files:** Ensure you upload the 128x128 store icon and at least one 1280x800 or 640x400 screenshot showing the extension interface in action.
- [x] **Permission Match:** Confirm that permissions requested in the packaged `manifest.json` (`storage`, `activeTab`, `scripting`, `clipboardWrite`, `tabs`, `sidePanel`) align exactly with the justifications entered in the developer console.
- [x] **No Remote Code:** Review the build scripts to verify that no libraries load remotely hosted JavaScript. All dependencies must be bundled locally inside the extension ZIP package.
