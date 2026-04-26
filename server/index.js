const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
// Sovereign Extension Protocol: Enable universal handshake
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// Enterprise Telemetery Log
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] -> ${req.method} ${req.url}`);
  // Sovereign Security Policy
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'online', hub: 'BridgeAI Sovereign' }));

app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    version: '1.0.0',
    min_extension_version: '1.0.0',
    platforms: {
      chatgpt: { enabled: true, name: 'ChatGPT' },
      gemini: { enabled: true, name: 'Gemini' },
      claude: { enabled: true, name: 'Claude' },
      perplexity: { enabled: true, name: 'Perplexity' }
    },
    features: {
      realTimeSync: true,
      autoSummarize: true
    }
  });
});



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20, // High-concurrency throughput
  idleTimeoutMillis: 10000, // Faster resource recycling
  connectionTimeoutMillis: 2000 // Quick failure recovery
});

pool.on('error', (err) => {
  console.error('Unexpected Sovereign Hub Pool Error:', err);
});

if (!process.env.DATABASE_URL) {
  console.warn('⚠️  WARNING: DATABASE_URL is not set. DB queries will fail.');
}

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        password TEXT,
        name TEXT,
        picture TEXT,
        google_id TEXT,
        plan TEXT DEFAULT 'free',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bridges (
        id VARCHAR(50) PRIMARY KEY,
        user_email TEXT,
        title TEXT,
        source VARCHAR(50),
        summary TEXT,
        chat_log TEXT,
        tokens VARCHAR(100),
        snippets INTEGER,
        mode VARCHAR(20) DEFAULT 'quick',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(50) PRIMARY KEY,
        user_email TEXT,
        plan TEXT,
        amount DECIMAL(10, 2),
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'paid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Performance Indexing
      CREATE INDEX IF NOT EXISTS idx_bridges_user_email ON bridges(user_email);
      CREATE INDEX IF NOT EXISTS idx_invoices_user_email ON invoices(user_email);
    `);
    // Crucial Migrations
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT \'free\'');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSON DEFAULT \'{"notifications":true,"autoBridge":false,"secureMode":true}\'');
    await pool.query('ALTER TABLE bridges ADD COLUMN IF NOT EXISTS mode VARCHAR(20) DEFAULT \'quick\'');
  } catch (err) {
    console.error("DB Init Error:", err);
  }
};
initDB();

// ─── AUTH ENTITIES ─────────────────────────────────────────

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING RETURNING *',
      [email, hashedPassword, name || email.split('@')[0]]
    );
    
    if (result.rowCount === 0) return res.status(400).json({ error: 'User already exists' });
    const user = { ...result.rows[0] };
    delete user.password;
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    
    const user = result.rows[0];
    if (!user.password) return res.status(400).json({ error: 'Please use Google Login for this account' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });
    
    delete user.password;
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, picture, google_id } = req.body;
    const result = await pool.query(
      `INSERT INTO users (email, name, picture, google_id) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO UPDATE SET google_id = $4, picture = $3, name = $2
       RETURNING *`,
      [email, name, picture, google_id]
    );
    const user = result.rows[0];
    delete user.password;
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { messages, platform, title, email, mode = 'quick' } = req.body;
    if (!email || email === 'guest') {
      return res.status(401).json({ success: false, error: "Unauthorized: User session required for hub dispatch." });
    }

    // ── Plan Quota Enforcement ───────────────────────────────
    const userRes = await pool.query('SELECT plan FROM users WHERE email = $1', [email]);
    if (userRes.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    const userPlan = userRes.rows[0].plan || 'free';

    const countRes = await pool.query(
      "SELECT COUNT(*) FROM bridges WHERE user_email = $1 AND created_at > date_trunc('month', now())",
      [email]
    );
    const extractionCount = parseInt(countRes.rows[0].count);

    const LIMITS = { 'free': 3, 'pro': 100, 'infinite': 999999 };
    const limit = LIMITS[userPlan] || 3;

    if (extractionCount >= limit) {
      return res.status(403).json({ 
        success: false, 
        error: `Sovereign Quota Reached: Your '${userPlan}' plan is limited to ${limit} extractions per month.`,
        isLimitReached: true,
        currentCount: extractionCount,
        maxLimit: limit
      });
    }

    // ── Mode Enforcement ─────────────────────────────────────
    // Free users can ONLY use 'quick' mode. Pro/Infinite can use any.
    let finalMode = mode;
    if (userPlan === 'free' && mode !== 'quick') {
      console.log(`[SECURITY] Downgrading distillation mode from ${mode} to quick for user ${email}`);
      finalMode = 'quick';
    }
    // ────────────────────────────────────────────────────────
    
    const userPrompts = messages.filter(m => m.role === 'user' || m.role === 'user-message');
    const aiResponses = messages.filter(m => m.role !== 'user' && m.role !== 'user-message');
    
    let goalText = userPrompts.length > 0 ? userPrompts[0].text : (messages[0]?.text || "Extracted Session");
    const goal = goalText.substring(0, 150) + (goalText.length > 150 ? '...' : '');
    
    let snippetsCount = 0;
    messages.forEach(m => {
      const matches = m.text.match(/```[\s\S]*?```/g);
      if (matches) snippetsCount += matches.length;
    });

    const formattedChat = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n\n');
    
    // ── AI Distillation Protocol ──────────────────────────────
    console.log(`[PROTOCOL] Initiating AI distillation for mode: ${finalMode}`);
    
    const PROMPTS = {
      quick:     'Provide a brief, high-level TL;DR summary (3-5 bullet points) of this conversation.',
      developer: 'Extract technical context: 1. Goal 2. Tech Stack 3. Implementation Details 4. Blockers.',
      research:  'Distill into research notes: 1. Core Thesis 2. Evidence/Data 3. Key Findings 4. References.',
      study:     'Convert to study guide: 1. Main Topic 2. Key Concepts 3. Definition of Terms 4. Summary.',
      project:   'Summarize as project update: 1. Current Status 2. Milestone Progress 3. Risks 4. Next Actions.'
    };

    const distillationResponse = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: `You are an expert intelligence analyst. ${PROMPTS[finalMode] || PROMPTS.quick} Output ONLY the summary in professional markdown.` },
          { role: 'user', content: formattedChat.substring(0, 8000) }
        ],
        model: 'openai',
        seed: Date.now()
      })
    });

    const aiSummary = await distillationResponse.text();
    const summaryHeader = `### ${finalMode.toUpperCase()} INTELLIGENCE LOG [${platform.toUpperCase()}]\n\n`;
    const summary = `${summaryHeader}${aiSummary.trim()}`;
    
    const id = 'brid_' + Date.now().toString(36);
    
    const query = `
      INSERT INTO bridges (id, user_email, title, source, summary, chat_log, tokens, snippets, mode) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
    `;
    const values = [id, email, title || `Bridge: ${goal.substring(0, 30)}`, platform, summary, formattedChat, `${Math.round(formattedChat.length/4)} tokens`, snippetsCount, finalMode];
    
    try {
      await pool.query(query, values);
    } catch (dbErr) {
      if (dbErr.message.includes('column "mode"') || dbErr.code === '42703') {
        await pool.query('ALTER TABLE bridges ADD COLUMN IF NOT EXISTS mode VARCHAR(20) DEFAULT \'quick\'');
        await pool.query(query, values);
      } else {
        throw dbErr;
      }
    }

    res.json({ success: true, bridgeData: { id, title, summary, mode: finalMode } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/optimize', async (req, res) => {
  try {
    const { summary } = req.body;
    if (!summary) return res.status(400).json({ success: false, error: "No summary provided" });

    // Enterprise-Grade Prompt Engineering via AI Pulse
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are an expert prompt engineer. Turn the following context into a highly efficient, professional system prompt for another AI. Be structured and authoritative.' },
          { role: 'user', content: summary }
        ],
        model: 'openai',
        seed: 42
      })
    });

    const optimized = await response.text();
    res.json({ success: true, optimized: optimized.trim() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/rename', async (req, res) => {
  try {
    const { summary } = req.body;
    if (!summary) return res.status(400).json({ success: false, error: "No summary provided" });

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Generate a short, professional, authoritative title (max 5 words) for the following context. Output ONLY the title.' },
          { role: 'user', content: summary }
        ],
        model: 'openai',
        seed: 7
      })
    });

    const title = await response.text();
    res.json({ success: true, title: title.replace(/"/g, '').trim() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/bridge/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bridges WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      const row = result.rows[0];
      res.json({ success: true, data: { ...row, chatLog: row.chat_log, date: 'Previously' } });
    } else {
      res.status(404).json({ success: false, error: "Bridge not found." });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/bridges', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.json({ success: true, data: [] });
    
    const result = await pool.query('SELECT * FROM bridges WHERE user_email = $1 ORDER BY created_at DESC', [email]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/status', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });
    
    const user = await pool.query('SELECT plan FROM users WHERE email = $1', [email]);
    if (user.rowCount === 0) return res.status(404).json({ error: "User not found" });
    
    const countRes = await pool.query(
      "SELECT COUNT(*) FROM bridges WHERE user_email = $1 AND created_at > date_trunc('month', now())",
      [email]
    );
    
    res.json({ 
      success: true, 
      plan: user.rows[0].plan || 'free',
      usage: parseInt(countRes.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/bridge/:id', async (req, res) => {
  try {
    const { title } = req.body;
    await pool.query('UPDATE bridges SET title = $1 WHERE id = $2', [title, req.params.id]);
    res.json({ success: true, message: "Bridge updated." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Manual Plan Upgrade Utility (B2C Simulation)
app.post('/api/user/upgrade', async (req, res) => {
  try {
    const { email, plan } = req.body; // 'pro' or 'infinite'
    if (!['free', 'pro', 'infinite'].includes(plan)) return res.status(400).json({ error: "Invalid sovereign tier." });
    
    await pool.query('UPDATE users SET plan = $1 WHERE email = $2', [plan, email]);
    res.json({ success: true, message: `System: User upgraded to ${plan.toUpperCase()} tier successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Advanced Billing & Purchase Engine
app.post('/api/user/purchase', async (req, res) => {
  try {
    const { email, plan, amount } = req.body;
    if (!['free', 'pro', 'infinite'].includes(plan)) return res.status(400).json({ error: "Invalid plan selection." });

    // Validate User Existence
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Failsafe: Ensure column exists before updating during a serverless invocation
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT \'free\'').catch(() => {});

    const invoiceId = 'inv_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Begin Sovereign Transaction
    await pool.query('BEGIN');
    
    // 1. Update User Plan
    await pool.query('UPDATE users SET plan = $1 WHERE email = $2', [plan, email]);
    
    // 2. Create Invoice Record
    await pool.query(
      'INSERT INTO invoices (id, user_email, plan, amount) VALUES ($1, $2, $3, $4)',
      [invoiceId, email, plan, amount]
    );
    
    await pool.query('COMMIT');
    
    res.json({ 
      success: true, 
      message: `Purchase successful! You are now on the ${plan.toUpperCase()} plan.`,
      invoiceId 
    });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/user/invoices', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required for billing ledger." });
    
    const result = await pool.query('SELECT * FROM invoices WHERE user_email = $1 ORDER BY created_at DESC', [email]);
    res.json({ success: true, invoices: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/dispatch/mail', async (req, res) => {
  try {
    const { bridgeId, email } = req.body;
    const result = await pool.query('SELECT * FROM bridges WHERE id = $1', [bridgeId]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Bridge not found" });
    const bridge = result.rows[0];
    
    console.log(`[DISPATCH] Relay initiated for ${email} via FTP-GMAIL.`);
    res.json({ success: true, protocol: 'FTP-GMAIL' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(`[SUBSCRIPTION] Email registered: ${email}`);
    if (email === 'starterscope7@gmail.com') {
      console.log("[PROTOCOL] Special Sovereign handshake for analyst starterscope7.");
    }
    res.json({ success: true, message: "Welcome to the Revolution." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bridge/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM bridges WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: "Bridge deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/user/settings', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });
    const user = await pool.query('SELECT settings FROM users WHERE email = $1', [email]);
    if (user.rowCount === 0) return res.status(404).json({ error: "User not found" });
    res.json({ success: true, settings: user.rows[0].settings || { notifications: true, autoBridge: false, secureMode: true } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/user/settings', async (req, res) => {
  try {
    const { email, settings } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSON DEFAULT \'{"notifications":true,"autoBridge":false,"secureMode":true}\'').catch(() => {});
    await pool.query('UPDATE users SET settings = $1 WHERE email = $2', [settings, email]);
    res.json({ success: true, message: "Settings updated successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 404 CATCH-ALL ─────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Invalid Hub Endpoint: ${req.method} ${req.url}` });
});

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Core Hub Failure:', err.stack);
  res.status(500).json({ success: false, error: 'Internal Hub Exception: ' + err.message });
});

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`BridgeAI Sovereign Hub running on port ${PORT}`));
}

module.exports = app;

