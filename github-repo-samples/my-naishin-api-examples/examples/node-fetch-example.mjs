// My Naishin API / MCP サンプルコード（Node.js 18以降・fetch組み込み・依存パッケージ不要）
// 実行: node node-fetch-example.mjs

const BASE_URL = 'https://my-naishin.com';

// 1) REST API: 都道府県の内申点計算方式の詳細を取得（GET・認証不要）
async function getPrefectureDetail(code) {
  const res = await fetch(`${BASE_URL}/api/naishin/${code}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// 2) REST API: 目標内申点から逆算（必要評定平均＋効率の良い教科）
async function reverseCalcNaishin(code, target) {
  const res = await fetch(`${BASE_URL}/api/naishin/${code}?target=${target}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// 3) MCP: 生徒の9教科評定（1〜5）から内申点を計算する（calculate_naishinツール・全47都道府県対応）
async function calculateNaishinViaMcp(prefectureCode, scores) {
  const res = await fetch(`${BASE_URL}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: 'calculate_naishin', arguments: { prefectureCode, scores } },
    }),
  });
  const rpc = await res.json();
  // MCPのtools/callはJSON-RPC 2.0標準に従い、結果がcontent[0].textにJSON文字列で入る
  return JSON.parse(rpc.result.content[0].text);
}

// 4) REST API: 内申点×当日点の総合得点（対応5県のみ・非対応県は404を返すので分岐する）
async function calculateTotalScoreIfSupported(prefectureCode, academicRaw, reportRaw) {
  const res = await fetch(
    `${BASE_URL}/api/total-score/${prefectureCode}?academicRaw=${academicRaw}&reportRaw=${reportRaw}`
  );
  if (res.status === 404) return null; // 兵庫・京都・栃木・新潟・鳥取の5県のみ対応
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main() {
  console.log('=== 1) 東京都の内申点計算方式の詳細 ===');
  const tokyo = await getPrefectureDetail('tokyo');
  console.log(JSON.stringify(tokyo, null, 2).slice(0, 500), '...\n');

  console.log('=== 2) 目標内申240点への逆算（東京都） ===');
  const reverse = await reverseCalcNaishin('tokyo', 240);
  console.log(JSON.stringify(reverse, null, 2), '\n');

  console.log('=== 3) 評定からの内申点計算（兵庫県・MCP経由） ===');
  const scores = {
    japanese: 4, math: 4, english: 5, science: 3, social: 4,
    music: 4, art: 3, pe: 4, tech: 3,
  };
  const naishin = await calculateNaishinViaMcp('hyogo', scores);
  console.log(JSON.stringify(naishin, null, 2), '\n');

  console.log('=== 4) 総合得点（兵庫県・内申点×当日点） ===');
  const totalScore = await calculateTotalScoreIfSupported('hyogo', 420, naishin.total);
  console.log(JSON.stringify(totalScore, null, 2));

  console.log('\n=== 5) 総合得点が非対応の県の例（東京都は総合得点API未対応→null） ===');
  const unsupported = await calculateTotalScoreIfSupported('tokyo', 500, 200);
  console.log('tokyo total-score:', unsupported); // null
}

main().catch((err) => {
  console.error('エラー:', err.message);
  process.exit(1);
});
