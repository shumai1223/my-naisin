// AdSense Management API（v2）を「自分のGoogleアカウントのOAuth権限」で叩くための共通ロジック。
// scripts/lib/gsc-client.mjs と同一パターン（OAuthクライアントは .ga4/ のものを再利用・
// トークンとスコープだけ分離）。2026-09-26 新設（AdSense稼働に合わせてレポートをMCPから読むため）。
//
// .adsense/ ディレクトリ（gitignore 済み）:
//   token.json … adsense-auth.mjs が生成する access/refresh トークン（adsense.readonly スコープ）
//
// ⚠️ 読み取り専用スコープのみ。広告の設定・支払い情報の変更は一切できない。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OAuth2Client } from 'google-auth-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
export const ADSENSE_DIR = path.join(ROOT, '.adsense');
const CLIENT_SECRET_PATH = path.join(ROOT, '.ga4', 'client_secret.json'); // GA4・GSCと共用
const TOKEN_PATH = path.join(ADSENSE_DIR, 'token.json');

export const SCOPES = ['https://www.googleapis.com/auth/adsense.readonly'];

// my-naishin.com の AdSense アカウント（パブリッシャーID）。
export const DEFAULT_ACCOUNT = 'accounts/pub-7817682248719138';

function ensureDir() {
  if (!fs.existsSync(ADSENSE_DIR)) fs.mkdirSync(ADSENSE_DIR, { recursive: true });
}

export function loadClientSecret() {
  if (!fs.existsSync(CLIENT_SECRET_PATH)) {
    throw new Error(
      `OAuthクライアントが見つかりません: ${CLIENT_SECRET_PATH}\n` +
        '→ GA4連携（npm run ga4:auth）で使っているのと同じ client_secret.json です。'
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
    throw new Error(`認証トークンがありません（${TOKEN_PATH}）。先に \`npm run adsense:auth\` を実行してください。`);
  }
  return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
}

export function getAuthedClient() {
  const oauth2 = getOAuth2Client();
  oauth2.setCredentials(loadToken());
  oauth2.on('tokens', (t) => saveToken(t));
  return oauth2;
}
