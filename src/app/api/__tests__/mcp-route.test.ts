/**
 * @jest-environment node
 *
 * MCPサーバ（/api/mcp）のルートハンドラ契約テスト。
 * JSON-RPC 2.0 の主要メソッド（initialize / tools/list / tools/call / resources / prompts / エラー）を
 * 実際のハンドラ経由で検証し、AIエージェントとの接続契約の回帰を防ぐ。
 */
import { POST, GET } from '@/app/api/mcp/route';

function rpc(method: string, params: Record<string, unknown> = {}, id: number | null = 1) {
  return new Request('https://my-naishin.com/api/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });
}

const ALL_FIVE = {
  japanese: 5, math: 5, english: 5, science: 5, social: 5, music: 5, art: 5, pe: 5, tech: 5,
};

describe('/api/mcp JSON-RPC 契約', () => {
  test('initialize は tools/resources/prompts を宣言', async () => {
    const res = await POST(rpc('initialize', { protocolVersion: '2025-06-18' }));
    const json = await res.json();
    expect(json.jsonrpc).toBe('2.0');
    expect(json.result.capabilities.tools).toBeDefined();
    expect(json.result.capabilities.resources).toBeDefined();
    expect(json.result.capabilities.prompts).toBeDefined();
  });

  test('tools/list は7ツールを返す', async () => {
    const res = await POST(rpc('tools/list'));
    const json = await res.json();
    expect(json.result.tools).toHaveLength(7);
    expect(json.result.tools.map((t: { name: string }) => t.name)).toContain('build_study_plan');
  });

  test('tools/call calculate_naishin は確定値(東京オール5=65)を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_naishin', arguments: { prefectureCode: 'tokyo', scores: ALL_FIVE } })
    );
    const json = await res.json();
    const data = JSON.parse(json.result.content[0].text);
    expect(data.total).toBe(65);
  });

  test('resources/list は47件、resources/read は該当県JSON', async () => {
    const list = await (await POST(rpc('resources/list'))).json();
    expect(list.result.resources).toHaveLength(47);
    const read = await (
      await POST(rpc('resources/read', { uri: 'https://my-naishin.com/api/naishin/osaka' }))
    ).json();
    const parsed = JSON.parse(read.result.contents[0].text);
    expect(parsed.code).toBe('osaka');
  });

  test('prompts/list と prompts/get が動く', async () => {
    const list = await (await POST(rpc('prompts/list'))).json();
    expect(list.result.prompts[0].name).toBe('naishin_lookup');
    const get = await (
      await POST(rpc('prompts/get', { name: 'naishin_lookup', arguments: { prefecture: 'tokyo' } }))
    ).json();
    expect(get.result.messages[0].content.text).toContain('calculate_naishin');
  });

  test('未知メソッドは -32601', async () => {
    const res = await POST(rpc('does_not_exist'));
    const json = await res.json();
    expect(json.error.code).toBe(-32601);
  });

  test('GET ディスカバリはツール/メソッド一覧を返す', async () => {
    const res = GET();
    const json = await res.json();
    expect(json.tools).toHaveLength(7);
    expect(json.methods).toContain('resources/read');
  });
});
