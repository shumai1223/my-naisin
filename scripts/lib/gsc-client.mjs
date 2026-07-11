// Search Console API を「自分のGoogleアカウントのOAuth権限」で叩くための共通ロジック。
// scripts/lib/ga4-client.mjs と同一パターン（OAuthクライアントは.ga4/のものを再利用・
// トークンとスコープだけ分離）。npx起動のgsc-mcp-server（外部パッケージ・疎通不安定）を
// node直接起動の自前MCPへ置き換えるための土台（2026-07-11補修）。
//
// .gsc/ ディレクトリ（すべて gitignore 済み）:
//   token.json  … gsc-auth.mjs が生成する access/refresh トークン（webmasters.readonly スコープ）
//   config.json … { "siteUrl": "sc-domain:my-naishin.com" }
//
// OAuthクライアント自体は .ga4/client_secret.json を共用する（同じGoogle Cloudプロジェクトの
// デスクトップアプリクライアント・スコープが違うだけなので新規クライアント作成は不要）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OAuth2Client } from 'google-auth-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
export const GSC_DIR = path.join(ROOT, '.gsc');
const CLIENT_SECRET_PATH = path.join(ROOT, '.ga4', 'client_secret.json'); // GA4と共用
const TOKEN_PATH = path.join(GSC_DIR, 'token.json');
const CONFIG_PATH = path.join(GSC_DIR, 'config.json');

// 読み取り専用スコープのみ（Search Consoleの設定変更は一切できない）。
export const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];

export const DEFAULT_SITE_URL = 'sc-domain:my-naishin.com';

function ensureDir() {
  if (!fs.existsSync(GSC_DIR)) fs.mkdirSync(GSC_DIR, { recursive: true });
}

export function loadClientSecret() {
  if (!fs.existsSync(CLIENT_SECRET_PATH)) {
    throw new Error(
      `OAuthクライアントが見つかりません: ${CLIENT_SECRET_PATH}\n` +
        '→ GA4連携（npm run ga4:auth）で使っているのと同じ client_secret.json です。先にGA4連携を済ませてください。'
    );
  }
  const raw = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, 'utf8'));
  const c = raw.installed || raw.web || raw;
  if (!c.client_id || !c.client_secret) {
    throw new Error('client_secret.json の形式が不正です（client_id / client_secret が見つかりません）。');
  }
  return { clientId: c.client_id, clientSecret: c.client_secret };
}

export function getOAuth2Client(redirectUri) {
  const { clientId, clientSecret } = loadClientSecret();
  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

export function saveToken(tokens) {
  ensureDir();
  let merged = tokens;
  if (!tokens.refresh_token) {
    let existing = {};
    if (fs.existsSync(TOKEN_PATH)) {
      try {
        existing = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
      } catch {
        /* ignore */
      }
    }
    merged = { ...existing, ...tokens };
  }
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2));
  return TOKEN_PATH;
}

export function loadToken() {
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error(`認証トークンがありません（${TOKEN_PATH}）。先に \`npm run gsc:auth\` を実行してください。`);
  }
  return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
}

export function getAuthedClient() {
  const oauth2 = getOAuth2Client();
  oauth2.setCredentials(loadToken());
  oauth2.on('tokens', (t) => saveToken(t));
  return oauth2;
}

export function saveConfig(patch) {
  ensureDir();
  let cfg = {};
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch {
      /* ignore */
    }
  }
  Object.assign(cfg, patch);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

export function getSiteUrl(cliValue) {
  if (cliValue) {
    saveConfig({ siteUrl: String(cliValue) });
    return String(cliValue);
  }
  if (process.env.GSC_SITE_URL) return String(process.env.GSC_SITE_URL);
  if (fs.existsSync(CONFIG_PATH)) {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    if (cfg.siteUrl) return String(cfg.siteUrl);
  }
  return DEFAULT_SITE_URL;
}
