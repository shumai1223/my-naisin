// Gmail API を「自分のGoogleアカウントのOAuth権限」で叩くための共通ロジック。
// scripts/lib/gsc-client.mjs / ga4-client.mjs と同一パターン（OAuthクライアントは
// .ga4/client_secret.json を共用・トークンとスコープだけ分離）。
//
// .gmail/ ディレクトリ（すべて gitignore 済み）:
//   token.json … gmail-auth.mjs が生成する access/refresh トークン
//
// スコープ方針（2026-07-13 運用設計）:
//   readonly … 受信箱の監視・返信検知（B2Bアウトリーチの返信ウィンドウ対応）
//   compose  … 下書きの作成まで。**送信ボタンは常に人間が押す**。
//   gmail.send は意図的に含めない。外向き送信は取り消し不能で、誤送信1通が
//   法人窓口との接点を恒久的に焼くため、自動化の権限境界を「下書きまで」に固定する。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OAuth2Client } from 'google-auth-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
export const GMAIL_DIR = path.join(ROOT, '.gmail');
const CLIENT_SECRET_PATH = path.join(ROOT, '.ga4', 'client_secret.json'); // GA4/GSCと共用
const TOKEN_PATH = path.join(GMAIL_DIR, 'token.json');

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.compose',
];

function ensureDir() {
  if (!fs.existsSync(GMAIL_DIR)) fs.mkdirSync(GMAIL_DIR, { recursive: true });
}

export function loadClientSecret() {
  if (!fs.existsSync(CLIENT_SECRET_PATH)) {
    throw new Error(
      `OAuthクライアントが見つかりません: ${CLIENT_SECRET_PATH}\n` +
        '→ GA4/GSC連携で使っているのと同じ client_secret.json です。先にGA4連携を済ませてください。'
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
    throw new Error(`認証トークンがありません（${TOKEN_PATH}）。先に \`npm run gmail:auth\` を実行してください。`);
  }
  return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
}

export function getAuthedClient() {
  const oauth2 = getOAuth2Client();
  oauth2.setCredentials(loadToken());
  oauth2.on('tokens', (t) => saveToken(t));
  return oauth2;
}
