// GA4 OAuth 認証（インストールアプリ型 / loopback フロー）。
// 実行 → ブラウザでGoogleアカウント承認 → refresh_token を .ga4/token.json に保存。
// GA4にアクセスできる本人アカウントでログインして承認すること（ユーザー追加・サービスアカウント不要）。
//
//   npm run ga4:auth
import http from 'node:http';
import { exec } from 'node:child_process';
import { getOAuth2Client, saveToken, SCOPES } from './lib/ga4-client.mjs';

function openBrowser(url) {
  const platform = process.platform;
  const cmd =
    platform === 'win32'
      ? `cmd /c start "" "${url}"`
      : platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd, () => {
    /* 失敗してもURLは標準出力に出しているので無視 */
  });
}

const server = http.createServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const redirectUri = `http://localhost:${port}`;

const oauth2 = getOAuth2Client(redirectUri);
const authUrl = oauth2.generateAuthUrl({
  access_type: 'offline', // refresh_token を得る
  prompt: 'consent', // 既存同意があっても refresh_token を確実に再発行
  scope: SCOPES,
});

console.log('\n────────────────────────────────────────────────────────');
console.log('GA4 にアクセスできる Google アカウントでログインして承認してください。');
console.log('ブラウザが開かない場合は以下のURLを手動で開いてください:\n');
console.log(authUrl);
console.log('\n承認後はこのターミナルに自動で戻ります（待機中…）');
console.log('────────────────────────────────────────────────────────\n');
openBrowser(authUrl);

server.on('request', async (req, res) => {
  try {
    const u = new URL(req.url, redirectUri);
    const err = u.searchParams.get('error');
    if (err) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('認証エラー: ' + err);
      console.error('認証エラー:', err);
      server.close();
      process.exit(1);
    }
    const code = u.searchParams.get('code');
    if (!code) {
      // favicon など本筋でないリクエストは無視
      res.writeHead(204);
      res.end();
      return;
    }
    const { tokens } = await oauth2.getToken({ code, redirect_uri: redirectUri });
    const savedPath = saveToken(tokens);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h2>GA4 連携完了 ✅</h2><p>このタブを閉じてターミナルに戻ってください。</p>');
    console.log('✅ トークンを保存しました:', savedPath);
    console.log('   refresh_token:', tokens.refresh_token ? 'あり' : 'なし（再実行が必要かも）');
    console.log('\n次: `node scripts/ga4.mjs totals --property <数値プロパティID>` で疎通確認。');
    server.close();
    process.exit(0);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('トークン交換に失敗: ' + e.message);
    console.error('トークン交換に失敗:', e.message);
    server.close();
    process.exit(1);
  }
});
