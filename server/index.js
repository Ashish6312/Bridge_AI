const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const EventEmitter = require('events');
const zlib = require('zlib');
const { sendEmail, sendWelcomeEmail, sendPromotionEmail } = require('./emailService');

/**
 * Helper to call Groq API with fallback to Pollinations
 */
async function callGroq(messages, options = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set in environment variables.");
  }
  const model = options.model || 'llama-3.3-70b-versatile';
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages,
        model,
        temperature: options.temperature !== undefined ? options.temperature : 0.2,
        max_tokens: options.max_tokens || 1024,
        ...(options.jsonMode ? { response_format: { type: "json_object" } } : {})
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error: ${response.status} ${response.statusText} - ${errText}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API call failed, falling back to Pollinations:", error.message);
    try {
      const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY || 'sk_M5IjtRCEG0eC7SeKI0zDw44jPPuHAdWO'}`
        },
        body: JSON.stringify({
          messages,
          model: 'openai',
          seed: 42
        })
      });
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError.message);
      throw error;
    }
  }
}

const app = express();
const hubEmitter = new EventEmitter();
// Sovereign Extension Protocol: Enable universal handshake
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enterprise Telemetery Log
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] -> ${req.method} ${req.url}`);
  // Sovereign Security Policy
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

app.get('/api/realtime', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required for realtime sync" });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const onUpdate = (data) => {
    if (data.email === email) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  hubEmitter.on('bridge-update', onUpdate);

  req.on('close', () => {
    hubEmitter.off('bridge-update', onUpdate);
  });
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
  connectionTimeoutMillis: 15000 // Allow up to 15 seconds for serverless DB to wake up
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
        project_id TEXT,
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

      CREATE TABLE IF NOT EXISTS subscribers (
        email TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_promo_sent TIMESTAMP
      );

      -- Performance Indexing
      CREATE INDEX IF NOT EXISTS idx_bridges_user_email ON bridges(user_email);
      CREATE INDEX IF NOT EXISTS idx_invoices_user_email ON invoices(user_email);

      -- Shared Knowledge Layer Tables
      CREATE TABLE IF NOT EXISTS project_contexts (
        project_id TEXT,
        user_email TEXT,
        tech_stack TEXT,
        goals TEXT,
        rules TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (project_id, user_email)
      );

      CREATE TABLE IF NOT EXISTS project_decisions (
        id VARCHAR(50) PRIMARY KEY,
        project_id TEXT,
        user_email TEXT,
        decision_type VARCHAR(20),
        title TEXT,
        rationale TEXT,
        alternatives TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS project_chats (
        id VARCHAR(50) PRIMARY KEY,
        project_id TEXT,
        user_email TEXT,
        title TEXT DEFAULT 'New Chat',
        messages JSON DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_project_contexts_lookup ON project_contexts(user_email, project_id);
      CREATE INDEX IF NOT EXISTS idx_project_decisions_lookup ON project_decisions(user_email, project_id);
      CREATE INDEX IF NOT EXISTS idx_project_chats_lookup ON project_chats(user_email, project_id);
    `);
    // Crucial Migrations
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT \'free\'');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSON DEFAULT \'{"notifications":true,"autoBridge":false,"secureMode":true}\'');
    await pool.query('ALTER TABLE bridges ADD COLUMN IF NOT EXISTS mode VARCHAR(20) DEFAULT \'quick\'');
    await pool.query('ALTER TABLE bridges ADD COLUMN IF NOT EXISTS project_id TEXT');
    await pool.query("ALTER TABLE project_contexts ADD COLUMN IF NOT EXISTS chat_history JSON DEFAULT '[]'");
    await pool.query("ALTER TABLE project_contexts ADD COLUMN IF NOT EXISTS problem_statement TEXT");
    // Deduplicate existing project decisions
    await pool.query(`
      DELETE FROM project_decisions 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM project_decisions 
        GROUP BY project_id, user_email, LOWER(title)
      )
    `);
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

app.get('/api/auth/me', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
        // In a real app we'd check JWT, but here we'll check localStorage-like param for the widget
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    const user = result.rows[0];
    delete user.password;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * Helper to decompress gzip base64 string to message array
 */
function decompressMessages(base64Str) {
  if (!base64Str) return null;
  try {
    const buffer = Buffer.from(base64Str, 'base64');
    const decompressed = zlib.gunzipSync(buffer);
    return JSON.parse(decompressed.toString('utf8'));
  } catch (err) {
    console.error('[COMPRESSION] Decompression failed:', err);
    return null;
  }
}

app.post('/api/summarize', async (req, res) => {
  try {
    let { messages, compressedMessages, platform, title, email, mode = 'quick', project_id = null } = req.body;

    if (compressedMessages) {
      const decompressed = decompressMessages(compressedMessages);
      if (decompressed && decompressed.length > 0) {
        messages = decompressed;
      }
    }

    if (!messages) {
      messages = [];
    }

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

    const LIMITS = { 'free': 10, 'pro': 999999, 'infinite': 999999 };
    const limit = LIMITS[userPlan] || 10;

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

    const aiSummary = await callGroq([
      { role: 'system', content: `You are an expert intelligence analyst. ${PROMPTS[finalMode] || PROMPTS.quick} Output ONLY the summary in professional markdown.` },
      { role: 'user', content: formattedChat.substring(0, 120000) }
    ]);
    const summaryHeader = `### ${finalMode.toUpperCase()} INTELLIGENCE LOG [${platform.toUpperCase()}]\n\n`;
    const summary = `${summaryHeader}${aiSummary.trim()}`;
    
    const id = 'brid_' + Date.now().toString(36);
    
    const query = `
      INSERT INTO bridges (id, user_email, title, source, summary, chat_log, tokens, snippets, mode, project_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
    `;
    const values = [id, email, title || `Bridge: ${goal.substring(0, 30)}`, platform, summary, formattedChat, `${Math.round(formattedChat.length/4)} tokens`, snippetsCount, finalMode, project_id];
    
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

    hubEmitter.emit('bridge-update', { email, type: 'create', bridgeId: id });

    res.json({ success: true, bridgeData: { id, title, summary, mode: finalMode } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/optimize', async (req, res) => {
  try {
    const { summary } = req.body;
    if (!summary) return res.status(400).json({ success: false, error: "No summary provided" });

    const optimized = await callGroq([
      { role: 'system', content: 'You are an expert prompt engineer. Turn the following context into a highly efficient, professional system prompt for another AI. Be structured and authoritative.' },
      { role: 'user', content: summary }
    ], { temperature: 0.2, max_tokens: 1024 });

    res.json({ success: true, optimized: optimized.trim() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/rename', async (req, res) => {
  try {
    const { summary } = req.body;
    if (!summary) return res.status(400).json({ success: false, error: "No summary provided" });

    const title = await callGroq([
      { role: 'system', content: 'Generate a short, professional, authoritative title (max 5 words) for the following context. Output ONLY the title.' },
      { role: 'user', content: summary }
    ], { temperature: 0.2, max_tokens: 50 });

    res.json({ success: true, title: title.replace(/"/g, '').trim() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/regenerate', async (req, res) => {
  try {
    const { chat_log } = req.body;
    if (!chat_log) return res.status(400).json({ success: false, error: "No chat log provided" });

    const summary = await callGroq([
      { role: 'system', content: 'You are an expert AI context summarizer. Be concise, structured, and accurate. Output only the summary.' },
      { role: 'user', content: `Give a brief TL;DR summary (3-5 bullet points) of the following text:\n\n${chat_log}` }
    ], { temperature: 0.2, max_tokens: 500 });

    res.json({ success: true, summary });
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
    
    const [countRes, totalRes] = await Promise.all([
      pool.query(
        "SELECT COUNT(*) FROM bridges WHERE user_email = $1 AND created_at > date_trunc('month', now())",
        [email]
      ),
      pool.query(
        "SELECT COUNT(*) FROM bridges WHERE user_email = $1",
        [email]
      )
    ]);
    
    res.json({ 
      success: true, 
      plan: user.rows[0].plan || 'free',
      usage: parseInt(countRes.rows[0].count),
      total: parseInt(totalRes.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/bridge/:id', async (req, res) => {
  try {
    const { title, project_id, summary, chat_log } = req.body;
    let query = 'UPDATE bridges SET ';
    const params = [];
    let setClauses = [];

    if (title !== undefined) {
      params.push(title);
      setClauses.push(`title = $${params.length}`);
    }
    if (project_id !== undefined) {
      params.push(project_id);
      setClauses.push(`project_id = $${params.length}`);
    }
    if (summary !== undefined) {
      params.push(summary);
      setClauses.push(`summary = $${params.length}`);
    }
    if (chat_log !== undefined) {
      params.push(chat_log);
      setClauses.push(`chat_log = $${params.length}`);
    }

    if (setClauses.length === 0) return res.status(400).json({ error: "No fields to update" });

    query += setClauses.join(', ') + ` WHERE id = $${params.length + 1}`;
    params.push(req.params.id);

    await pool.query(query, params);

    // Get the user_email for this bridge to notify correctly
    const bridgeInfo = await pool.query('SELECT user_email FROM bridges WHERE id = $1', [req.params.id]);
    if (bridgeInfo.rowCount > 0) {
      hubEmitter.emit('bridge-update', { email: bridgeInfo.rows[0].user_email, type: 'update', bridgeId: req.params.id });
    }

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
    
    console.log(`[DISPATCH] Relay initiated for ${email} via SMTP.`);
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Intelligence Dispatch: ${bridge.title}</h2>
        <p><strong>Source:</strong> ${bridge.source}</p>
        <p><strong>Date:</strong> ${bridge.created_at}</p>
        <h3>Summary</h3>
        <p style="white-space: pre-wrap;">${bridge.summary}</p>
        <h3>Log Snapshot</h3>
        <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${bridge.chat_log.substring(0, 1000)}${bridge.chat_log.length > 1000 ? '...' : ''}</pre>
      </div>
    `;
    
    const emailResult = await sendEmail(email, `BridgeAI Dispatch: ${bridge.title}`, html);
    if (emailResult.success) {
      res.json({ success: true, protocol: 'SMTP-GMAIL' });
    } else {
      res.status(500).json({ error: "Failed to dispatch email." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    
    console.log(`[SUBSCRIPTION] Email registered: ${email}`);
    
    // Save to subscribers table
    await pool.query(
      'INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      [email]
    );

    // Send welcome email immediately
    await sendWelcomeEmail(email);

    res.json({ success: true, message: "Welcome to the Revolution. Check your inbox!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── DAILY PROMOTIONAL CRON JOB ─────────────────────────────
// Runs every day at 10:00 AM
cron.schedule('0 10 * * *', async () => {
  console.log('[CRON] Initiating daily promotional email broadcast...');
  try {
    // Get all subscribers who haven't upgraded to a paid plan yet
    // We join with users table to check their current plan
    const result = await pool.query(`
      SELECT s.email 
      FROM subscribers s
      LEFT JOIN users u ON s.email = u.email
      WHERE u.plan IS NULL OR u.plan = 'free'
    `);

    console.log(`[CRON] Found ${result.rowCount} potential targets for promotion.`);

    for (const row of result.rows) {
      console.log(`[CRON] Sending promotion to: ${row.email}`);
      await sendPromotionEmail(row.email);
      // Update last_promo_sent
      await pool.query('UPDATE subscribers SET last_promo_sent = CURRENT_TIMESTAMP WHERE email = $1', [row.email]);
    }
    
    console.log('[CRON] Daily broadcast completed successfully.');
  } catch (err) {
    console.error('[CRON] Broadcast failure:', err);
  }
});

app.delete('/api/bridge/:id', async (req, res) => {
  try {
    const bridgeInfo = await pool.query('SELECT user_email FROM bridges WHERE id = $1', [req.params.id]);
    await pool.query('DELETE FROM bridges WHERE id = $1', [req.params.id]);
    
    if (bridgeInfo.rowCount > 0) {
      hubEmitter.emit('bridge-update', { email: bridgeInfo.rows[0].user_email, type: 'delete', bridgeId: req.params.id });
    }

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

app.patch('/api/user/profile', async (req, res) => {
  try {
    const { email, name, picture } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    
    const params = [];
    const setClauses = [];
    
    if (name !== undefined) {
      params.push(name);
      setClauses.push(`name = $${params.length}`);
    }
    if (picture !== undefined) {
      params.push(picture);
      setClauses.push(`picture = $${params.length}`);
    }
    
    if (setClauses.length === 0) return res.status(400).json({ error: "No fields to update" });
    
    params.push(email);
    const query = `UPDATE users SET ${setClauses.join(', ')} WHERE email = $${params.length} RETURNING *`;
    
    const result = await pool.query(query, params);
    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });
    
    const updatedUser = result.rows[0];
    delete updatedUser.password;
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/user/data', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });
    
    // Delete all bridges for the user
    await pool.query('DELETE FROM bridges WHERE user_email = $1', [email]);
    
    // Reset settings
    await pool.query(
      `UPDATE users 
       SET settings = '{"notifications":true,"autoBridge":false,"secureMode":true}' 
       WHERE email = $1`,
      [email]
    );
    
    res.json({ success: true, message: "All user context and settings deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── SHARED KNOWLEDGE LAYER ENDPOINTS ────────────────────────

// Retrieve Project Context
app.get('/api/projects/context', async (req, res) => {
  try {
    const { email, project_id } = req.query;
    if (!email || !project_id) return res.status(400).json({ error: "Email and project_id required" });
    const result = await pool.query(
      'SELECT * FROM project_contexts WHERE user_email = $1 AND project_id = $2',
      [email, project_id]
    );
    if (result.rowCount === 0) {
      return res.json({ success: true, data: { project_id, user_email: email, tech_stack: '', goals: '', rules: '', problem_statement: '', chat_history: [] } });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Project Context
app.post('/api/projects/context', async (req, res) => {
  try {
    const { email, project_id, tech_stack, goals, rules, problem_statement } = req.body;
    if (!email || !project_id) return res.status(400).json({ error: "Email and project_id required" });
    const result = await pool.query(
      `INSERT INTO project_contexts (project_id, user_email, tech_stack, goals, rules, problem_statement, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       ON CONFLICT (project_id, user_email)
       DO UPDATE SET tech_stack = $3, goals = $4, rules = $5, problem_statement = $6, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [project_id, email, tech_stack || '', goals || '', rules || '', problem_statement || '']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Project Chat History
app.post('/api/projects/chat/history', async (req, res) => {
  try {
    const { email, project_id, chat_history } = req.body;
    if (!email || !project_id) return res.status(400).json({ error: "Email and project_id required" });
    const result = await pool.query(
      `INSERT INTO project_contexts (project_id, user_email, chat_history, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT (project_id, user_email)
       DO UPDATE SET chat_history = $3, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [project_id, email, JSON.stringify(chat_history || [])]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// List all chat sessions for a project
app.get('/api/projects/chats', async (req, res) => {
  try {
    const { email, project_id } = req.query;
    if (!email || !project_id) return res.status(400).json({ error: "Email and project_id required" });
    const result = await pool.query(
      'SELECT * FROM project_chats WHERE user_email = $1 AND project_id = $2 ORDER BY updated_at DESC',
      [email, project_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create or update a chat session
app.post('/api/projects/chats', async (req, res) => {
  try {
    const { id, email, project_id, title, messages } = req.body;
    if (!id || !email || !project_id) {
      return res.status(400).json({ error: "id, email, and project_id required" });
    }
    const result = await pool.query(
      `INSERT INTO project_chats (id, project_id, user_email, title, messages, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (id)
       DO UPDATE SET title = $4, messages = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [id, project_id, email, title || 'New Chat', JSON.stringify(messages || [])]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a specific chat session
app.delete('/api/projects/chats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email query parameter required" });
    
    const result = await pool.query(
      'DELETE FROM project_chats WHERE id = $1 AND user_email = $2 RETURNING *',
      [id, email]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: "Chat session not found or unauthorized" });
    }
    res.json({ success: true, message: "Chat session deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Retrieve Project Decisions
app.get('/api/projects/decisions', async (req, res) => {
  try {
    const { email, project_id } = req.query;
    if (!email || !project_id) return res.status(400).json({ error: "Email and project_id required" });
    const result = await pool.query(
      'SELECT * FROM project_decisions WHERE user_email = $1 AND project_id = $2 ORDER BY created_at DESC',
      [email, project_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create/Update Project Decision
app.post('/api/projects/decisions', async (req, res) => {
  try {
    const { id, email, project_id, decision_type, title, rationale, alternatives } = req.body;
    if (!email || !project_id || !title || !decision_type) {
      return res.status(400).json({ error: "Email, project_id, decision_type, and title required" });
    }
    const finalId = id || 'dec_' + Date.now().toString(36);
    const result = await pool.query(
      `INSERT INTO project_decisions (id, project_id, user_email, decision_type, title, rationale, alternatives, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       ON CONFLICT (id)
       DO UPDATE SET decision_type = $4, title = $5, rationale = $6, alternatives = $7
       RETURNING *`,
      [finalId, project_id, email, decision_type, title, rationale || '', alternatives || '']
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Project Decision
app.delete('/api/projects/decisions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM project_decisions WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: "Decision deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Elaborate a Decision via AI
app.post('/api/projects/decisions/elaborate', async (req, res) => {
  try {
    const { email, project_id, title, decision_type, rationale, alternatives } = req.body;
    if (!email || !project_id || !title || !decision_type) {
      return res.status(400).json({ error: "Email, project_id, decision_type, and title required" });
    }

    // Fetch context to ground the response
    const contextRes = await pool.query(
      'SELECT * FROM project_contexts WHERE user_email = $1 AND project_id = $2',
      [email, project_id]
    );
    const context = contextRes.rows[0] || { tech_stack: '', goals: '', rules: '', problem_statement: '' };

    const promptMessages = [
      {
        role: 'system',
        content: `You are an expert Senior Principal Software Architect and AI Engineer.
Your job is to write a highly detailed, professional, and practical architectural elaboration and impact analysis for a project decision.

Use the project context below to make your elaboration specific and relevant:
- Problem Statement: ${context.problem_statement || 'Not specified'}
- Tech Stack: ${context.tech_stack || 'Not specified'}
- Goals: ${context.goals || 'Not specified'}
- Rules: ${context.rules || 'Not specified'}

Write the elaboration in clean Markdown with the following sections:
1. **Overview & Context**: A brief summary of the decision and why it's relevant to our goals and problem statement.
2. **Architectural Implications**: Analyze the impact on performance, security, complexity, maintenance, and scalability.
3. **Integration & Tech Details**: Explain how this is implemented using the specific tech stack and rules.
4. **Concrete Action Plan**: Give a checklist (using [ ] markdown checkboxes) of implementation tasks to execute this decision.

Be precise, highly technical, and avoid generic boilerplate. Format all code snippets or commands cleanly.`
      },
      {
        role: 'user',
        content: `Please elaborate on this project decision:
- **Title**: ${title}
- **Status/Type**: ${decision_type.toUpperCase()}
- **Rationale**: ${rationale || 'None provided'}
- **Alternatives/Options Considered**: ${alternatives || 'None provided'}`
      }
    ];

    const elaboration = await callGroq(promptMessages);
    res.json({ success: true, elaboration });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Compile Project Memory via AI
app.post('/api/projects/compile', async (req, res) => {
  try {
    const { email, project_id } = req.body;
    if (!email || !project_id) return res.status(400).json({ error: "Email and project_id required" });

    // Fetch bridges
    const bridgesRes = await pool.query(
      'SELECT title, summary, chat_log, source, created_at FROM bridges WHERE user_email = $1 AND project_id = $2 ORDER BY created_at ASC',
      [email, project_id]
    );

    if (bridgesRes.rowCount === 0) {
      return res.status(400).json({ error: "No intelligence logs found in this project to compile context from. Please add some bridges first." });
    }

    const logsContext = bridgesRes.rows.map((b, idx) => {
      return `### Log #${idx + 1}: ${b.title} [Source: ${b.source}, Date: ${b.created_at}]\nSummary:\n${b.summary}\nFull Transcript:\n${b.chat_log || 'No transcript available.'}\n`;
    }).join('\n');

    const systemPrompt = `You are an expert software architect and knowledge engineer.
Your task is to analyze multiple conversation summaries and chat logs from a developer project and distill them into a single, unified "Shared Memory Layer" JSON object.

Analyze the input logs and extract:
1. "problem_statement": A concise summary of the core business or technical problem(s) this project is trying to solve (e.g. real-world challenges, inefficiencies, target user pain points).
2. "tech_stack": Bullet points of languages, frameworks, databases, libraries, tools, and platforms actively being used.
3. "goals": Bullet points of the project's core objectives and current focus.
4. "rules": Bullet points of project constraints, guidelines, style rules, or environment details.
5. "decisions": An array of architectural or business decision objects, each having:
   - "title": A short title (e.g. "Use Tailwind CSS", "Muted Postgres DB setup").
   - "decision_type": Strictly one of "accepted", "rejected", or "open".
   - "rationale": Why this path was chosen, or why it was rejected, or what is being discussed.
   - "alternatives": Other options considered (comma-separated or empty).

Output strictly valid JSON and nothing else. Do NOT surround it in backticks, markdown code fences, or any other wrapper.
Format:
{
  "problem_statement": "A description of the real-world problem being solved...",
  "tech_stack": "- React 19\\n- Postgres\\n...",
  "goals": "- Build scalable API\\n...",
  "rules": "- 100% test coverage\\n...",
  "decisions": [
    {
      "title": "Use Tailwind CSS",
      "decision_type": "accepted",
      "rationale": "High velocity prototyping...",
      "alternatives": "CSS Modules, styled-components"
    }
  ]
}`;

    let responseText = await callGroq([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Here are the intelligence logs for project "${project_id}":\n\n${logsContext.substring(0, 100000)}` }
    ], { jsonMode: true });
    
    // Clean up markdown markers if any
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let compiledJson;
    try {
      compiledJson = JSON.parse(responseText);
    } catch (parseErr) {
      console.error("JSON parse failure on AI compiler response:", responseText);
      compiledJson = {
        problem_statement: "Distillation Parse Error. Check raw logs.",
        tech_stack: "Distillation Parse Error. Check raw logs.",
        goals: "Check raw logs",
        rules: "Check raw logs",
        decisions: []
      };
    }

    // Save project context
    await pool.query(
      `INSERT INTO project_contexts (project_id, user_email, tech_stack, goals, rules, problem_statement, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       ON CONFLICT (project_id, user_email)
       DO UPDATE SET tech_stack = $3, goals = $4, rules = $5, problem_statement = $6, updated_at = CURRENT_TIMESTAMP`,
      [project_id, email, compiledJson.tech_stack || '', compiledJson.goals || '', compiledJson.rules || '', compiledJson.problem_statement || '']
    );

    // Save project decisions (upsert to avoid duplicates by checking title)
    if (compiledJson.decisions && Array.isArray(compiledJson.decisions)) {
      for (const dec of compiledJson.decisions) {
        if (!dec.title) continue;
        const existing = await pool.query(
          'SELECT id FROM project_decisions WHERE project_id = $1 AND user_email = $2 AND LOWER(title) = LOWER($3)',
          [project_id, email, dec.title]
        );
        if (existing.rowCount > 0) {
          await pool.query(
            `UPDATE project_decisions 
             SET decision_type = $1, rationale = $2, alternatives = $3 
             WHERE id = $4`,
            [dec.decision_type || 'accepted', dec.rationale || '', dec.alternatives || '', existing.rows[0].id]
          );
        } else {
          const decId = 'dec_' + Math.random().toString(36).substr(2, 9);
          await pool.query(
            `INSERT INTO project_decisions (id, project_id, user_email, decision_type, title, rationale, alternatives, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
            [decId, project_id, email, dec.decision_type || 'accepted', dec.title, dec.rationale || '', dec.alternatives || '']
          );
        }
      }
    }

    res.json({ success: true, data: compiledJson });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Query Project Memory via AI Assistant
app.post('/api/projects/chat', async (req, res) => {
  try {
    const { email, project_id, message, history = [] } = req.body;
    if (!email || !project_id || !message) {
      return res.status(400).json({ error: "Email, project_id, and message required" });
    }

    // Fetch context
    const contextRes = await pool.query(
      'SELECT * FROM project_contexts WHERE user_email = $1 AND project_id = $2',
      [email, project_id]
    );
    const context = contextRes.rows[0] || { tech_stack: '', goals: '', rules: '', problem_statement: '' };

    // Fetch decisions
    const decisionsRes = await pool.query(
      'SELECT * FROM project_decisions WHERE user_email = $1 AND project_id = $2',
      [email, project_id]
    );
    const decisionsText = decisionsRes.rows.map(d => {
      return `- [${d.decision_type.toUpperCase()}] ${d.title}\n  Rationale: ${d.rationale}\n  Alternatives considered: ${d.alternatives || 'None'}`;
    }).join('\n');

    // RAG: Retrieve all saved chats (bridges) for the project to provide context
    const bridgesRes = await pool.query(
      'SELECT title, summary, chat_log, source, created_at FROM bridges WHERE user_email = $1 AND project_id = $2 ORDER BY created_at DESC LIMIT 15',
      [email, project_id]
    );
    const bridgesText = bridgesRes.rows.map((b, idx) => {
      return `[Saved Chat #${idx + 1}] Title: ${b.title}\nSource: ${b.source} (Created: ${b.created_at})\nSummary: ${b.summary}\nFull Transcript:\n${b.chat_log || 'No transcript available.'}`;
    }).join('\n\n');

    const systemPrompt = `You are the Project Memory Assistant for the project "${project_id}".
Your purpose is to answer questions, generate documentation, draft system prompts, or summarize findings based on the compiled Project Memory Layer and Saved Chats below.

### PROJECT MEMORY LAYER
0. CORE PROBLEM STATEMENT:
${context.problem_statement || "Not specified."}

1. TECH STACK:
${context.tech_stack || "Not specified."}

2. CORE GOALS:
${context.goals || "Not specified."}

3. DEVELOPMENT RULES:
${context.rules || "Not specified."}

4. DECISION LEDGER:
${decisionsText || "No decisions logged yet."}

### SAVED CHATS / UPLOADED CONTEXTS (RAG)
${bridgesText || "No saved chats uploaded for this project yet."}

### INSTRUCTIONS:
- Always prioritize, ground, and frame your responses in the context of this specific project, referencing specific rules, goals, decisions, and detailed conversation logs from the "SAVED CHATS / UPLOADED CONTEXTS" (RAG) section above.
- If the user asks a general technical question (e.g., "what is LLM", "explain RAG"), explain the concept clearly, but then immediately elaborate on how it applies to, fits into, or is implemented within their specific project stack, rules, and objectives (such as their goals around securing AI/ML internships and gaining experience with LLM/RAG workflows).
- When discussing the saved chats or uploaded contexts (RAG), pull details directly from the transcripts (like specific guide summaries or application details) to explain or answer the user's query.
- Tailor all generated code snippets, setup guides, and system prompts to work specifically with the project's stack (Python, FastAPI, Django, SQL, HTML).
- Be concise, professional, and clear. Use clean Markdown formatting.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.text })),
      { role: 'user', content: message }
    ];

    const responseText = await callGroq(messages);
    res.json({ success: true, text: responseText });
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

