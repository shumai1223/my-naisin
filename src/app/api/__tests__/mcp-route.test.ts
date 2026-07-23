/**
 * @jest-environment node
 *
 * MCPサーバ（/api/mcp）のルートハンドラ契約テスト。
 * JSON-RPC 2.0 の主要メソッド（initialize / tools/list / tools/call / resources / prompts / エラー）を
 * 実際のハンドラ経由で検証し、AIエージェントとの接続契約の回帰を防ぐ。
 */
import { POST, GET } from '@/app/api/mcp/route';
import { resetApiRateLimiterForTests } from '@/lib/api-auth';

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

// 2026-07-16: MCPもgateApiRequest配下になった。テストリクエストはヘッダ無し＝ip:unknownの
// mcpバケットを全テストが共有するため、テストごとにクリアしないと匿名上限で偽429になる。
beforeEach(() => {
  resetApiRateLimiterForTests();
});

describe('/api/mcp JSON-RPC 契約', () => {
  test('initialize は tools/resources/prompts を宣言', async () => {
    const res = await POST(rpc('initialize', { protocolVersion: '2025-06-18' }));
    const json = await res.json();
    expect(json.jsonrpc).toBe('2.0');
    expect(json.result.capabilities.tools).toBeDefined();
    expect(json.result.capabilities.resources).toBeDefined();
    expect(json.result.capabilities.prompts).toBeDefined();
  });

  test('tools/list は25ツールを返す（S-5でhensachi/total-score/bairitsu/education-cost/stats/tokyo/kanagawa/osaka/aichi/chiba/saitama/fukuoka/hokkaidoの18本を追加=13統一エンジン県+8個別実装県が全てMCP化完了）', async () => {
    const res = await POST(rpc('tools/list'));
    const json = await res.json();
    expect(json.result.tools).toHaveLength(25);
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

  test('tools/call calculate_aichi_total_score は評価方法Ⅰ満点入力で200点を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_aichi_total_score', arguments: { naishinSumRaw: 45, gakuryokuRaw: 110 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.total).toBe(200);
    expect(data.max).toBe(200);
  });

  test('tools/call calculate_chiba_k_value はK=1.0満点入力で635点を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_chiba_k_value', arguments: { hyoteiRaw: 135, gakuryokuRaw: 500, kValue: 1.0 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.total).toBe(635);
    expect(data.max).toBe(635);
  });

  test('tools/call calculate_chiba_k_value はothersRaw未指定なら満点計算に含まれない', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_chiba_k_value', arguments: { hyoteiRaw: 100, gakuryokuRaw: 400 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.max).toBe(635); // 500 + 135*1.0（othersRaw未指定）
  });

  test('tools/call calculate_saitama_total_score は単純合算を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_saitama_total_score', arguments: { gakuryokuRaw: 380, chosashoRaw: 260 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.total).toBe(640);
  });

  test('tools/call calculate_fukuoka_score は満点入力で345点を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_fukuoka_score', arguments: { naishinRaw: 45, gakuryokuRaw: 300 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.total).toBe(345);
    expect(data.percent).toBe(100);
  });

  test('tools/call calculate_hokkaido_rank は満点入力でAランク・615点を返す', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'calculate_hokkaido_rank', arguments: { naishinRaw: 315, gakuryokuRaw: 300 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.rank.rank).toBe('A');
    expect(data.total).toBe(615);
  });

  test('tools/call list_prefectures は全47件、region指定で絞り込む', async () => {
    const all = await POST(rpc('tools/call', { name: 'list_prefectures', arguments: {} }));
    const allData = JSON.parse((await all.json()).result.content[0].text);
    expect(allData.count).toBe(47);

    const filtered = await POST(rpc('tools/call', { name: 'list_prefectures', arguments: { region: '関東' } }));
    const filteredData = JSON.parse((await filtered.json()).result.content[0].text);
    expect(filteredData.count).toBeGreaterThan(0);
    expect(filteredData.count).toBeLessThan(47);
  });

  test('tools/call get_prefecture は東京都の詳細を返し、未知コードはnot_found', async () => {
    const res = await POST(rpc('tools/call', { name: 'get_prefecture', arguments: { code: 'tokyo' } }));
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.code).toBe('tokyo');

    const missing = await POST(rpc('tools/call', { name: 'get_prefecture', arguments: { code: 'nowhere' } }));
    const missingData = JSON.parse((await missing.json()).result.content[0].text);
    expect(missingData.error).toBe('not_found');
  });

  test('tools/call compare_prefectures はオール4既定で複数県を比較する', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'compare_prefectures', arguments: { codes: ['tokyo', 'osaka', 'hyogo'] } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.grade).toBe(4);
    expect(data.results).toHaveLength(3);
    expect(data.results.map((r: { code: string }) => r.code)).toEqual(['tokyo', 'osaka', 'hyogo']);
  });

  test('tools/call reverse_calc は目標内申から必要な評定平均を逆算する', async () => {
    const res = await POST(
      rpc('tools/call', { name: 'reverse_calc', arguments: { prefectureCode: 'tokyo', targetNaishin: 65 } })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.requiredAverageGrade).toBe(5);
    expect(data.achievable).toBe(true);
  });

  test('tools/call target_to_required_grades は優先教科の提案を返す', async () => {
    const res = await POST(
      rpc('tools/call', {
        name: 'target_to_required_grades',
        arguments: { prefectureCode: 'tokyo', targetNaishin: 65, currentScores: ALL_FIVE },
      })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.currentTotal).toBe(65);
    expect(data.gap).toBe(0);
  });

  test('tools/call build_study_plan は週次マイルストーンを返す', async () => {
    const res = await POST(
      rpc('tools/call', {
        name: 'build_study_plan',
        arguments: { prefectureCode: 'tokyo', currentNaishin: 50, targetNaishin: 65, weeksRemaining: 4 },
      })
    );
    const data = JSON.parse((await res.json()).result.content[0].text);
    expect(data.weeksRemaining).toBe(4);
    expect(data.milestones).toHaveLength(4);
    expect(data.milestones[3].targetNaishin).toBe(65);
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
    expect(json.tools).toHaveLength(25);
    expect(json.methods).toContain('resources/read');
  });
});

describe('/api/mcp レート制限（2026-07-16: ゲート未通過の穴を封鎖）', () => {
  test('匿名の連打はMCP専用上限(20/分)を超えると 429', async () => {
    let last: Response | null = null;
    for (let i = 0; i < 23; i += 1) {
      last = await POST(rpc('ping', {}, i + 1));
    }
    expect(last!.status).toBe(429);
  });

  test('上限内(20/分)のAIエージェント的バーストは全て通る', async () => {
    for (let i = 0; i < 20; i += 1) {
      const res = await POST(rpc('ping', {}, i + 1));
      expect(res.status).toBe(200);
    }
  });
});

/**
 * ZZ-6a: 25ツール全数の性能回帰スイート。
 * 各ツールに有効な最小引数を1組固定し、実ハンドラ経由で呼んで応答時間を計測する。
 * 「エラーにならない」だけでなく「遅くならない」ことをCIで毎回検知する（性能劣化の回帰ガード）。
 * しきい値は本番ネットワーク遅延を含まないin-process呼び出しの値のため、CI環境のばらつきを
 * 吸収できるよう十分に緩め（500ms）に設定している。厳密な絶対値ではなく「桁が変わる劣化」を検知する目的。
 */
const LATENCY_THRESHOLD_MS = 500;

const ALL_TOOL_FIXTURES: { name: string; arguments: Record<string, unknown> }[] = [
  { name: 'list_prefectures', arguments: {} },
  { name: 'get_prefecture', arguments: { code: 'tokyo' } },
  { name: 'calculate_naishin', arguments: { prefectureCode: 'tokyo', scores: ALL_FIVE } },
  { name: 'compare_prefectures', arguments: { codes: ['tokyo', 'osaka'] } },
  { name: 'reverse_calc', arguments: { prefectureCode: 'tokyo', targetNaishin: 60 } },
  { name: 'target_to_required_grades', arguments: { prefectureCode: 'tokyo', targetNaishin: 60 } },
  { name: 'build_study_plan', arguments: { prefectureCode: 'tokyo', currentNaishin: 50, targetNaishin: 65, weeksRemaining: 4 } },
  { name: 'calculate_hensachi', arguments: { score: 70, average: 60, stdDev: 10 } },
  { name: 'reverse_calc_hensachi', arguments: { targetHensachi: 60, average: 60, stdDev: 10 } },
  { name: 'hensachi_rank_convert', arguments: { direction: 'to_rank', hensachi: 50, population: 300 } },
  { name: 'list_total_score_systems', arguments: {} },
  { name: 'calculate_total_score', arguments: { prefectureCode: 'hyogo', academicRaw: 500, reportRaw: 250 } },
  { name: 'reverse_calc_total_score', arguments: { prefectureCode: 'hyogo', targetTotal: 500, reportRaw: 250 } },
  { name: 'calculate_bairitsu', arguments: { mode: 'application', applicants: 120, capacity: 80 } },
  { name: 'calculate_education_cost', arguments: {} },
  { name: 'calculate_path_to_university_cost', arguments: {} },
  { name: 'get_stats_distribution', arguments: { metric: 'naishin' } },
  { name: 'calculate_tokyo_total_score', arguments: { academicRaw: 500, naishinRaw: 65, esatGrade: 'A' } },
  { name: 'calculate_kanagawa_s_value', arguments: { naishinRaw: 135, gakuryokuRaw: 500 } },
  { name: 'calculate_osaka_total_score', arguments: { naishinRaw: 450, gakuryokuRaw: 450 } },
  { name: 'calculate_aichi_total_score', arguments: { naishinSumRaw: 45, gakuryokuRaw: 110 } },
  { name: 'calculate_chiba_k_value', arguments: { hyoteiRaw: 135, gakuryokuRaw: 500, kValue: 1.0 } },
  { name: 'calculate_saitama_total_score', arguments: { gakuryokuRaw: 380, chosashoRaw: 260 } },
  { name: 'calculate_fukuoka_score', arguments: { naishinRaw: 45, gakuryokuRaw: 300 } },
  { name: 'calculate_hokkaido_rank', arguments: { naishinRaw: 315, gakuryokuRaw: 300 } },
];

describe('/api/mcp 性能回帰スイート（ZZ-6a: 全25ツール）', () => {
  test('TOOLS定義と本スイートのfixtureが1対1で一致する（新規ツール追加時の計測漏れ防止）', async () => {
    const res = await POST(rpc('tools/list'));
    const json = await res.json();
    const declaredNames = json.result.tools.map((t: { name: string }) => t.name).sort();
    const fixtureNames = ALL_TOOL_FIXTURES.map((f) => f.name).sort();
    expect(fixtureNames).toEqual(declaredNames);
  });

  test.each(ALL_TOOL_FIXTURES.map((f) => [f.name, f] as const))(
    `%s: 正常応答かつ${LATENCY_THRESHOLD_MS}ms未満で返る`,
    async (_label, fixture) => {
      resetApiRateLimiterForTests();
      const start = performance.now();
      const res = await POST(rpc('tools/call', { name: fixture.name, arguments: fixture.arguments }));
      const elapsed = performance.now() - start;
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.result).toBeDefined();
      expect(json.error).toBeUndefined();
      expect(elapsed).toBeLessThan(LATENCY_THRESHOLD_MS);
    },
  );
});
