// GA4 Data API を「自分のGoogleアカウントのOAuth権限」で叩くための共通ロジック。
// サービスアカウント方式（プロパティへのユーザー追加が必要）の権限問題を回避するため、
// インストールアプリ型OAuth（loopback）で refresh_token を取得し .ga4/ にローカル保存する。
//
// .ga4/ ディレクトリ（すべて gitignore 済み）:
//   client_secret.json … Google Cloud Console で作る「OAuth client ID (Desktop app)」のJSON
//   token.json         … ga4-auth.mjs が生成する access/refresh トークン
//   config.json        … { "propertyId": "123456789" } 数値プロパティID
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// 巨大な googleapis メタパッケージは import に2分かかる環境があるため、
// OAuth だけを担う軽量な google-auth-library を直接使う（google.auth.OAuth2 の実体）。
import { OAuth2Client } from 'google-auth-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const GA4_DIR = path.resolve(__dirname, '..', '..', '.ga4');
const CLIENT_SECRET_PATH = path.join(GA4_DIR, 'client_secret.json');
const TOKEN_PATH = path.join(GA4_DIR, 'token.json');
const CONFIG_PATH = path.join(GA4_DIR, 'config.json');

// 読み取り専用スコープのみ。GA4の設定変更は一切できない（安全）。
export const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

function ensureDir() {
  if (!fs.existsSync(GA4_DIR)) fs.mkdirSync(GA4_DIR, { recursive: true });
}

export function loadClientSecret() {
  if (!fs.existsSync(CLIENT_SECRET_PATH)) {
    throw new Error(
      `OAuthクライアントが見つかりません: ${CLIENT_SECRET_PATH}\n` +
        '→ Google Cloud Console で「OAuth 2.0 クライアントID（アプリの種類: デスクトップ）」を作成し、\n' +
        '  ダウンロードしたJSONを上記パスに client_secret.json として保存してください。'
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
  // refresh_token を含む = 新規の同意（npm run ga4:auth）。古いメタ（refresh_token_expires_in 等）を
  // 引きずらないよう丸ごと差し替える。本番公開後の再認証で「7日失効」表示が残るのを防ぐ。
  // refresh_token を含まない = アクセストークンの自動更新。既存の refresh_token を温存するためマージ。
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
    throw new Error(`認証トークンがありません（${TOKEN_PATH}）。先に \`npm run ga4:auth\` を実行してください。`);
  }
  return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
}

export function getAuthedClient() {
  const oauth2 = getOAuth2Client();
  oauth2.setCredentials(loadToken());
  // アクセストークンが期限切れなら googleapis が refresh_token で自動更新する。
  // 更新後の新しいトークンを取りこぼさないよう保存する。
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

export function getPropertyId(cliValue) {
  if (cliValue) {
    saveConfig({ propertyId: String(cliValue) });
    return String(cliValue);
  }
  if (process.env.GA4_PROPERTY_ID) return String(process.env.GA4_PROPERTY_ID);
  if (fs.existsSync(CONFIG_PATH)) {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    if (cfg.propertyId) return String(cfg.propertyId);
  }
  throw new Error(
    'GA4 プロパティID（数値）が未設定です。\n' +
      '→ GA4 管理 > プロパティ設定 の「プロパティID」(例: 123456789) を確認し、\n' +
      '   `node scripts/ga4.mjs <preset> --property 123456789` で一度渡す（以降は config.json に保存）か、\n' +
      '   環境変数 GA4_PROPERTY_ID で指定してください。\n' +
      '   ※ G-VRVSVK1X5Z は「測定ID」であってプロパティIDではありません。'
  );
}
