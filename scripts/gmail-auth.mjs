// Gmail OAuth 認証（インストールアプリ型 / loopback フロー）。
// GA4/GSC連携（.ga4/client_secret.json）と同じOAuthクライアントを使い、
// gmail.readonly + gmail.compose スコープだけを新規に同意する。
// 実行 → ブラウザでGoogleアカウント承認 → refresh_token を .gmail/token.json に保存。
//
//   npm run gmail:auth
import http from 'node:http';
import { exec } from 'node:child_process';
import { getOAuth2Client, saveToken, SCOPES } from './lib/gmail-client.mjs';

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
  access_type: 'offline',
  prompt: 'consent',
  scope: SCOPES,
});

console.log('\n────────────────────────────────────────────────────────');
console.log('B2B送信に使っている Google アカウント（naishin.dev@gmail.com）で');
console.log('ログインして承認してください。求められる権限は「読み取り」と「下書き作成」の');
console.log('2つだけで、送信権限は含まれません。');
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
      res.writeHead(204);
      res.end();
      return;
    }
    const { tokens } = await oauth2.getToken({ code, redirect_uri: redirectUri });
    const savedPath = saveToken(tokens);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h2>Gmail 連携完了 ✅</h2><p>このタブを閉じてターミナルに戻ってください。</p>');
    console.log('✅ トークンを保存しました:', savedPath);
    console.log('   refresh_token:', tokens.refresh_token ? 'あり' : 'なし（再実行が必要かも）');
    console.log('\n次: Claude Code を再起動すると gmail MCP が使えるようになります。');
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
