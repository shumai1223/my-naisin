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

  test('tools/list は20ツールを返す（S-5でhensachi/total-score/bairitsu/education-cost/stats/tokyo/kanagawa/osakaの13本を追加）', async () => {
    const res = await POST(rpc('tools/list'));
    const json = await res.json();
    expect(json.result.tools).toHaveLength(20);
    expect(json.result.tools.map((t: { name: string }) => t.name)).toContain('build_study_plan');
    expect(json.result.tools.map((t: { name: string }) => t.name)).toContain('calculate_hensachi');
    expect(json.result.tools.map((t: { name: string }) => t.name)).toContain('calculate_total_score');
    expect(json.result.tools.map((t: { name: string }) => t.name)).toContain('calculate_bairitsu');
    expect(json.result.tools.map((t: { name: string }) => t.name)).toContain('calculate_education_cost');
    expect(json.result.tools.map((t: { name: string }) => t.name)).toContain('calculate_path_to_university_cost');
  });

  test('tools/call calculate_naishin は確定値(東京オール5=65)を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_naishin', arguments: { prefectureCode: 'tokyo', scores: ALL_FIVE } })
    );
    const json = await res.json();
    const data = JSON.parse(json.result.content[0].text);
    expect(data.total).toBe(65);
  });

  test('tools/call calculate_hensachi は式通りの偏差値を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_hensachi', arguments: { score: 70, average: 60, stdDev: 10 } })
    );
    const json = await res.json();
    const data = JSON.parse(json.result.content[0].text);
    expect(data.hensachi).toBe(60);
  });

  test('tools/call reverse_calc_hensachi は必要点数を逆算する', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'reverse_calc_hensachi', arguments: { targetHensachi: 60, average: 60, stdDev: 10 } })
    );
    const json = await res.json();
    const data = JSON.parse(json.result.content[0].text);
    expect(data.requiredScore).toBe(70);
  });

  test('tools/call hensachi_rank_convert（to_rank/to_hensachi 双方向）', async () => {
    const toRank = await POST(
      rpc('tools/call', { name: 'hensachi_rank_convert', arguments: { direction: 'to_rank', hensachi: 50, population: 300 } })
    );
    const toRankData = JSON.parse((await toRank.json()).result.content[0].text);
    expect(toRankData.rank).toBe(150);

    const toHensachi = await POST(
      rpc('tools/call', { name: 'hensachi_rank_convert', arguments: { direction: 'to_hensachi', rank: 150, population: 300 } })
    );
    const toHensachiData = JSON.parse((await toHensachi.json()).result.content[0].text);
    expect(toHensachiData.hensachi).toBeCloseTo(50, 1);
  });

  test('tools/call list_total_score_systems はregistryの県一覧を返す', async () => {
    const res = await POST(rpc('tools/call', { name: 'list_total_score_systems', arguments: {} }));
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.count).toBeGreaterThanOrEqual(5);
    expect(data.systems.map((s: { code: string }) => s.code)).toContain('hyogo');
  });

  test('tools/call calculate_total_score / reverse_calc_total_score は既存REST同等の結果を返す', async () => {
    const compute = await POST(
      rpc('tools/call', {
        name: 'calculate_total_score',
        arguments: { prefectureCode: 'hyogo', academicRaw: 500, reportRaw: 250 },
      })
    );
    const computeData = JSON.parse((await compute.json()).result.content[0].text);
    expect(computeData.mode).toBe('compute');
    expect(computeData.total).toBe(500);

    const reverse = await POST(
      rpc('tools/call', {
        name: 'reverse_calc_total_score',
        arguments: { prefectureCode: 'hyogo', targetTotal: 500, reportRaw: 250 },
      })
    );
    const reverseData = JSON.parse((await reverse.json()).result.content[0].text);
    expect(reverseData.mode).toBe('reverse');
    expect(reverseData.requiredAcademicRaw).toBe(500);
  });

  test('tools/call calculate_total_score は未対応県で not_found を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_total_score', arguments: { prefectureCode: 'nowhere', academicRaw: 1, reportRaw: 1 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.error).toBe('not_found');
  });

  test('tools/call calculate_bairitsu（application/actual 双方向）', async () => {
    const application = await POST(
      rpc('tools/call', { name: 'calculate_bairitsu', arguments: { mode: 'application', applicants: 120, capacity: 80 } })
    );
    const applicationData = JSON.parse((await application.json()).result.content[0].text);
    expect(applicationData.ratio).toBe(1.5);

    const actual = await POST(
      rpc('tools/call', { name: 'calculate_bairitsu', arguments: { mode: 'actual', testTakers: 160, passers: 80 } })
    );
    const actualData = JSON.parse((await actual.json()).result.content[0].text);
    expect(actualData.ratio).toBe(2);
  });

  test('tools/call calculate_education_cost は既定値で総額を計算する', async () => {
    const res = await POST(rpc('tools/call', { name: 'calculate_education_cost', arguments: {} }));
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.input.currentGrade).toBe(1);
    expect(data.result.total).toBeGreaterThan(0);
  });

  test('tools/call calculate_path_to_university_cost は既定値で総額を計算する', async () => {
    const res = await POST(rpc('tools/call', { name: 'calculate_path_to_university_cost', arguments: {} }));
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.input.universityType).toBe('national');
    expect(data.result.total).toBeGreaterThan(0);
  });

  test('tools/call get_stats_distribution はD1未設定のテスト環境ではinsufficientData:trueを返す（no-op契約）', async () => {
    const res = await POST(rpc('tools/call', { name: 'get_stats_distribution', arguments: { metric: 'naishin' } }));
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.metric).toBe('naishin');
    expect(data.insufficientData).toBe(true);
    expect(data.aggregate).toBeNull();
  });

  test('tools/call get_stats_distribution は不正なmetricで invalid_params を返す', async () => {
    const res = await POST(rpc('tools/call', { name: 'get_stats_distribution', arguments: { metric: 'unknown' } }));
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.error).toBe('invalid_params');
  });

  test('tools/call calculate_tokyo_total_score は満点入力で1020点を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_tokyo_total_score', arguments: { academicRaw: 500, naishinRaw: 65, esatGrade: 'A' } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.total).toBe(1020);
    expect(data.rankLabel).toContain('最難関校レベル');
  });

  test('tools/call calculate_kanagawa_s_value は満点入力でS1=1000を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_kanagawa_s_value', arguments: { naishinRaw: 135, gakuryokuRaw: 500 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.s1).toBe(1000);
    expect(data.rankLabel).toContain('最難関校レベル');
  });

  test('tools/call calculate_osaka_total_score は満点入力で450点を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_osaka_total_score', arguments: { naishinRaw: 450, gakuryokuRaw: 450 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.total).toBe(450);
    expect(data.rankLabel).toContain('最難関校レベル');
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
    expect(json.tools).toHaveLength(20);
    expect(json.methods).toContain('resources/read');
  });
});
