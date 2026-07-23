import { decodeSharePayload } from '@/lib/share';

/**
 * 成績レポート画像カード（P2-1）＝サーバー生成の OG/共有用カード。
 *
 *   GET /api/card?d=<base64url payload>          … 共有文脈（県・点・満点・目標・差・学年・指標・立ち位置）を埋め込んだカード
 *   GET /api/card?d=...&ratio=square             … LINE/X最適比率（1080×1080・ZZ-5a）
 *   GET /api/card                                 … 既定（ブランド）カード
 *
 * 設計判断：satori/next-og（PNG）は WASM 依存で Cloudflare Workers 上の動作が未検証
 * （[[fable5-task-backlog-2026-06]] P2-1 の⚠️）。本番を壊さないため、ここは依存ゼロで
 * 確実に Workers で動く **SVG** を返す。ブラウザは <img src> でそのまま表示でき、
 * クライアント側で canvas→PNG 変換すれば Web Share API（ファイル添付）にも載せられる。
 * 将来 satori の Workers 動作が確認できたら、本ルートの戻りを PNG に差し替えるだけでよい。
 *
 * 入力は decodeSharePayload で必ずクランプ済み（信頼の堀＝外部入力を信用しない）。
 * 立ち位置（percentile/percentileScope）もdecodeSharePayload経由の値をそのまま表示するだけ
 * ＝このルート自身は統計値を一切計算しない（ZZ-5a・カード内数値は全てエンジン由来）。
 */

const RATIOS = {
  og: { w: 1200, h: 630 },
  // LINE/X最適比率（ZZ-5a）：正方形はLINEタイムライン・Xのフィード内表示で画像が最大限に
  // 表示され、og比率(1200x630)よりトリミングされにくい。
  square: { w: 1080, h: 1080 },
} as const;
type CardRatio = keyof typeof RATIOS;

/** SVG/XML に安全に埋める（属性・テキスト共通）。 */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface CardData {
  metric: string;
  prefectureName?: string;
  score?: number;
  max?: number;
  target?: number;
  gap?: number;
  grade?: number;
  /** ZZ-5a：/api/stats/percentileの実測値をそのまま表示する（n充足時のみ・k-匿名性ガード済み）。 */
  percentile?: number;
  percentileScope?: 'prefecture' | 'national';
}

function buildCard(d: CardData, ratio: CardRatio): string {
  const { w: W, h: H } = RATIOS[ratio];
  const metric = esc(d.metric);
  const hasScore = typeof d.score === 'number';
  const scoreText = hasScore ? String(d.score) : '—';
  const maxText = typeof d.max === 'number' ? `/ ${d.max}` : '';
  const pref = d.prefectureName ? esc(d.prefectureName) : '';

  // 目標との差（正＝不足／0以下＝達成）。
  let gapLabel = '';
  let gapValue = '';
  let gapColor = '#0f766e';
  if (typeof d.gap === 'number' && typeof d.target === 'number') {
    if (d.gap > 0) {
      gapLabel = `目標 ${d.target} まで`;
      gapValue = `あと ${d.gap}点`;
      gapColor = '#b45309';
    } else {
      gapLabel = `目標 ${d.target} を`;
      gapValue = `${Math.abs(d.gap)}点 達成`;
      gapColor = '#047857';
    }
  }

  const gradeChip = typeof d.grade === 'number' ? `中${d.grade}` : '';
  const chip = [pref, gradeChip].filter(Boolean).join(' ・ ');

  // 目標カードはW依存の右寄せ配置（W=1200/1080どちらでも右端72pxマージンで収まる）。
  const gapBoxW = 428;
  const gapBoxX = W - gapBoxW - 72;

  // 立ち位置チップ（ZZ-5a）：全国/県内いずれかのpercentileがあれば表示。値はAPI由来のみ・ここでは計算しない。
  const scopeLabel = d.percentileScope === 'prefecture' ? `${pref || '県内'}` : '全国';
  const percentileChip =
    typeof d.percentile === 'number'
      ? `<g transform="translate(72 500)">
    <rect x="0" y="0" width="380" height="72" rx="20" fill="#ffffff" stroke="#0d9488" stroke-width="3"/>
    <text x="24" y="30" font-size="18" font-weight="700" fill="#475569">${esc(scopeLabel)}の協力者内で</text>
    <text x="24" y="58" font-size="30" font-weight="800" fill="#0d9488">上位 ${Math.max(1, 100 - Math.round(d.percentile))}%</text>
  </g>`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Yu Gothic',sans-serif">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ecfdf5"/>
      <stop offset="0.55" stop-color="#f0fdfa"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#059669"/>
      <stop offset="1" stop-color="#0d9488"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="14" fill="url(#brand)"/>

  <!-- ブランド -->
  <g transform="translate(72 70)">
    <rect x="0" y="0" width="56" height="56" rx="16" fill="url(#brand)"/>
    <text x="28" y="38" text-anchor="middle" font-size="30" font-weight="700" fill="#ffffff">M</text>
    <text x="76" y="26" font-size="26" font-weight="700" fill="#0f172a">My Naishin</text>
    <text x="76" y="50" font-size="17" fill="#64748b">高校受験 成績レポート</text>
  </g>

  ${chip ? `<g transform="translate(72 168)">
    <rect x="0" y="0" width="${Math.min(560, 40 + chip.length * 26)}" height="46" rx="23" fill="#ffffff" stroke="#a7f3d0" stroke-width="2"/>
    <text x="24" y="31" font-size="22" font-weight="700" fill="#0f766e">${chip}</text>
  </g>` : ''}

  <!-- 指標ラベル -->
  <text x="72" y="300" font-size="34" font-weight="700" fill="#334155">${metric}</text>

  <!-- スコア -->
  <text x="72" y="430" font-size="150" font-weight="800" fill="#0f172a" letter-spacing="-2">${esc(scoreText)}<tspan font-size="64" font-weight="700" fill="#94a3b8" dx="18">${esc(maxText)}</tspan></text>

  ${gapLabel ? `<g transform="translate(${gapBoxX} 330)">
    <rect x="0" y="0" width="${gapBoxW}" height="120" rx="20" fill="#ffffff" stroke="${gapColor}" stroke-width="3" opacity="0.95"/>
    <text x="32" y="48" font-size="24" font-weight="700" fill="#475569">${esc(gapLabel)}</text>
    <text x="32" y="98" font-size="54" font-weight="800" fill="${gapColor}">${esc(gapValue)}</text>
  </g>` : ''}

  ${percentileChip}

  <!-- フッター -->
  <rect x="0" y="${H - 64}" width="${W}" height="64" fill="url(#brand)"/>
  <text x="72" y="${H - 24}" font-size="24" font-weight="700" fill="#ffffff">my-naishin.com</text>
  <text x="${W - 72}" y="${H - 24}" text-anchor="end" font-size="20" fill="#d1fae5">無料で内申点・偏差値・志望校との差を計算</text>
</svg>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const decoded = decodeSharePayload(url.searchParams.get('d') ?? undefined);
  const ratio: CardRatio = url.searchParams.get('ratio') === 'square' ? 'square' : 'og';

  const data: CardData = decoded
    ? {
        metric: decoded.metricLabel ?? '内申点',
        prefectureName: decoded.prefectureName,
        score: decoded.score,
        max: decoded.max,
        target: decoded.target,
        gap: decoded.gap,
        grade: decoded.grade,
        percentile: decoded.percentile,
        percentileScope: decoded.percentileScope,
      }
    : { metric: '内申点' };

  const svg = buildCard(data, ratio);

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      // 共有カードは内容＝URL固定なので強めにキャッシュ可（payloadが変わればURLも変わる）。
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
    },
  });
}
