/**
 * BridgeAI Extension Packager
 * Creates a clean .zip of ONLY the extension files — no server code, no secrets.
 * Run: node scripts/package-extension.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXT_DIR = path.join(__dirname, '..', 'extension');
const OUT_DIR = path.join(__dirname, '..', 'public');
const ZIP_NAME = 'bridgeai-extension.zip';

// Files/folders allowed in the zip — everything else is excluded
const ALLOWED = [
  'manifest.json',
  'popup.html',
  'popup.js',
  'background.js',
  'content.js',
  'sidepanel.html',
  'sidepanel.js',
  'icons',
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function validateManifest() {
  const manifest = JSON.parse(fs.readFileSync(path.join(EXT_DIR, 'manifest.json'), 'utf8'));
  const issues = [];
  if (!manifest.name)        issues.push('Missing: name');
  if (!manifest.version)     issues.push('Missing: version');
  if (!manifest.description) issues.push('Missing: description');
  if (!manifest.icons)       issues.push('Missing: icons');
  if (issues.length > 0) {
    console.warn('⚠️  Manifest warnings:\n  ' + issues.join('\n  '));
  } else {
    console.log('✅ Manifest valid:', manifest.name, 'v' + manifest.version);
  }
}

function checkNoSecrets() {
  const files = ['popup.js', 'background.js', 'content.js'];
  const secretPatterns = [/localhost:\d{4}/, /password/, /DATABASE_URL/, /neondb_owner/];
  let clean = true;
  files.forEach(file => {
    const fpath = path.join(EXT_DIR, file);
    if (!fs.existsSync(fpath)) return;
    const content = fs.readFileSync(fpath, 'utf8');
    secretPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        console.warn(`⚠️  Possible secret in ${file}: ${pattern}`);
        clean = false;
      }
    });
  });
  if (clean) console.log('✅ No secrets detected in extension files');
}

function stripComments(content) {
  // Simple regex to remove single-line and multi-line comments
  return content.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1').trim();
}

function buildZip() {
  ensureDir(OUT_DIR);
  const zipPath = path.join(OUT_DIR, ZIP_NAME);

  // Copy allowed files to a temp staging folder
  const staging = path.join(OUT_DIR, 'staging');
  if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true });
  fs.mkdirSync(staging);

  ALLOWED.forEach(item => {
    const src = path.join(EXT_DIR, item);
    const dest = path.join(staging, item);
    if (!fs.existsSync(src)) { console.warn(`⚠️  Not found: ${item}`); return; }
    
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      let content = fs.readFileSync(src, 'utf8');
      // If JS file, strip comments to protect logic privacy
      if (item.endsWith('.js')) {
        content = stripComments(content);
      }
      fs.writeFileSync(dest, content);
    }
  });

  // Create zip using powershell (Windows) or zip (Unix)
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  if (process.platform === 'win32') {
    execSync(`powershell Compress-Archive -Path "${staging}\\*" -DestinationPath "${zipPath}"`, { stdio: 'inherit' });
  } else {
    execSync(`cd "${staging}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
  }

  // Cleanup staging
  fs.rmSync(staging, { recursive: true });

  const size = (fs.statSync(zipPath).size / 1024).toFixed(1);
  console.log(`\n📦 Extension packaged: ${zipPath} (${size} KB)`);
  console.log('   → Ready for Chrome Web Store submission!\n');
}

console.log('\n🔷 BridgeAI Extension Packager\n');
validateManifest();
checkNoSecrets();
buildZip();
