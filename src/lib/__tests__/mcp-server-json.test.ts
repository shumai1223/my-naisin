/**
 * @jest-environment node
 *
 * Λ-11: 公開MCPレジストリ（registry.modelcontextprotocol.io）登録用マニフェスト（リポジトリ直下server.json）の
 * 回帰テスト。server.jsonは静的ファイルのためAPIルートの実装と自動で同期しない＝手動更新漏れが起きうる
 * （例: SITE_URLやversionを変えたのにserver.jsonを更新し忘れる）。ここでserver.jsonの内容を
 * DATASET_META（唯一の正準ソース）・実際のMCPルートのGETディスカバリ応答と突合し、ドリフトを検知する。
 */
import fs from 'node:fs';
import path from 'node:path';
import { DATASET_META, SITE_URL } from '@/lib/naishin-dataset';
import { GET } from '@/app/api/mcp/route';

const SERVER_JSON_PATH = path.resolve(process.cwd(), 'server.json');

function loadServerJson() {
  return JSON.parse(fs.readFileSync(SERVER_JSON_PATH, 'utf8'));
}

describe('server.json（MCP公開レジストリ登録用マニフェスト）', () => {
  it('リポジトリ直下に存在し、有効なJSONである', () => {
    expect(fs.existsSync(SERVER_JSON_PATH)).toBe(true);
    expect(() => loadServerJson()).not.toThrow();
  });

  it('必須フィールド（$schema/name/description/version/remotes）を持つ', () => {
    const manifest = loadServerJson();
    expect(manifest.$schema).toEqual(expect.stringContaining('modelcontextprotocol.io'));
    expect(typeof manifest.name).toBe('string');
    expect(typeof manifest.description).toBe('string');
    expect(typeof manifest.version).toBe('string');
    expect(Array.isArray(manifest.remotes)).toBe(true);
    expect(manifest.remotes.length).toBeGreaterThan(0);
  });

  it('name は逆DNS形式で、運営者の本名を含まない（サイト名義/GitHubハンドルのみ）', () => {
    const manifest = loadServerJson();
    // 逆DNS形式: 'io.github.xxx/yyy' や 'com.example/yyy' のようにドット区切り+スラッシュを含む。
    expect(manifest.name).toMatch(/^[a-z0-9.]+\/[a-z0-9-]+$/i);
    // 実名を排除する明示的なブラックリストではなく、既知の許可済み識別子のみを許容する設計
    // （新しい識別子に変える場合は、このテストも合わせて更新して意図的な変更にする）。
    expect(manifest.name).toBe('io.github.shumai1223/my-naishin');
  });

  it('remotes[0].url は実際のMCPエンドポイント（SITE_URL/api/mcp）と一致する', () => {
    const manifest = loadServerJson();
    expect(manifest.remotes[0].url).toBe(`${SITE_URL}/api/mcp`);
    expect(manifest.remotes[0].type).toBe('streamable-http');
  });

  it('version はDATASET_META.version（唯一の正準ソース）と一致する', () => {
    const manifest = loadServerJson();
    expect(manifest.version).toBe(DATASET_META.version);
  });

  it('version は実際のMCP GETディスカバリ応答のライセンス/データセット情報とも矛盾しない', async () => {
    const manifest = loadServerJson();
    const res = await GET(new Request('https://my-naishin.com/api/mcp'));
    const body = await res.json();
    // GETディスカバリはversionを直接返さないが、endpointとlicenseの整合性を確認することで
    // server.jsonが指す先が実際に稼働しているサーバであることを間接的に検証する。
    expect(manifest.remotes[0].url).toBe(body.endpoint);
    expect(body.license.attribution).toEqual(expect.stringContaining('My Naishin'));
    // 念のためversion単体の形式チェック（DATASET_META.versionとの一致は上のテストで担保済み）。
    expect(manifest.version).toMatch(/^\d{4}\.\d+$/);
  });
});
