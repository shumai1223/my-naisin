import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { calcKyokaStatus, calcOverallStatus, toGaihyou, type Kamoku } from '@/lib/gakushu-seiseki';
import { DATASET_META, SITE_URL } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B・T-C4）— 学習成績の状況（大学受験の評定平均）の計算。
 *
 * 既存の /api/naishin /api/hensachi と同じ作法（CORS・レート制限・APIキー・課金ゲート）。
 * 出典: 文部科学省「令和９年度大学入学者選抜実施要項について（通知）」別紙様式１
 * （2026-08-27にPyMuPDFで全文確認・[[T-C4-gakushu-seiseki-engine]]）。
 *
 * ★個人情報を受け取らない設計（DoD §3）: リクエストは教科・科目・学年・評定の配列のみ。
 * 氏名・学籍番号・学校名等を受け取るフィールドは存在しない（追加する予定もない）。
 * サーバーに保存しない（計算して返すだけ）。
 *
 * GET /api/gakushu-seiseki → エンドポイント説明（機械可読メタ情報）。
 * POST /api/gakushu-seiseki { kamoku: [{ kyoka, kamoku, gakunen, hyotei }, ...] }
 *   → 教科別/全体の学習成績の状況・学習成績概評を計算して返す。
 */

const SOURCE = {
  title:
    '文部科学省「令和９年度大学入学者選抜実施要項について（通知）」（令和８年５月27日付け８文科高第318号）別紙様式１「調査書記入上の注意事項等について」',
  url: 'https://www.mext.go.jp/content/20260529-mxt_daigakuc02-000005144_1.pdf',
  verifiedAt: '2026-08-27',
} as const;

const MAX_ENTRIES = 100;
const VALID_GAKUNEN = new Set([1, 2, 3, 4]);
const VALID_HYOTEI = new Set([1, 2, 3, 4, 5]);

function buildMeta() {
  return {
    meta: {
      name: `${DATASET_META.name}（学習成績の状況・大学受験の評定平均）`,
      description:
        '大学入学者選抜の調査書に記載される「学習成績の状況」を、文部科学省の公式計算方法どおりに算出するAPI。単位数は計算に使用しない。',
      version: DATASET_META.version,
      license: DATASET_META.license,
      source: SOURCE,
      request: {
        method: 'POST',
        url: `${SITE_URL}/api/gakushu-seiseki`,
        body: {
          kamoku: [{ kyoka: '理科', kamoku: '物理基礎', gakunen: 1, hyotei: 3 }],
        },
        note: '氏名・学籍番号・学校名等の個人情報を受け取るフィールドはありません。修得単位数も受け取りません（計算に使わないため）。',
      },
      toolUrl: `${SITE_URL}/hyotei-heikin/gakushu-seiseki`,
    },
  };
}

interface ParsedKamoku {
  ok: true;
  kamoku: Kamoku[];
}
interface ParseError {
  ok: false;
  message: string;
}

function parseKamokuList(input: unknown): ParsedKamoku | ParseError {
  if (!Array.isArray(input)) {
    return { ok: false, message: 'kamokuは配列で指定してください。' };
  }
  if (input.length === 0) {
    return { ok: false, message: 'kamokuは1件以上指定してください。' };
  }
  if (input.length > MAX_ENTRIES) {
    return { ok: false, message: `kamokuは最大${MAX_ENTRIES}件までです。` };
  }

  const kamokuList: Kamoku[] = [];
  for (const [i, raw] of input.entries()) {
    if (typeof raw !== 'object' || raw === null) {
      return { ok: false, message: `kamoku[${i}]はオブジェクトで指定してください。` };
    }
    const { kyoka, kamoku, gakunen, hyotei } = raw as Record<string, unknown>;
    if (typeof kyoka !== 'string' || kyoka.trim() === '') {
      return { ok: false, message: `kamoku[${i}].kyokaは空でない文字列で指定してください。` };
    }
    if (typeof kamoku !== 'string' || kamoku.trim() === '') {
      return { ok: false, message: `kamoku[${i}].kamokuは空でない文字列で指定してください。` };
    }
    if (typeof gakunen !== 'number' || !VALID_GAKUNEN.has(gakunen)) {
      return { ok: false, message: `kamoku[${i}].gakunenは1〜4の整数で指定してください。` };
    }
    if (typeof hyotei !== 'number' || !VALID_HYOTEI.has(hyotei)) {
      return { ok: false, message: `kamoku[${i}].hyoteiは1〜5の整数で指定してください。` };
    }
    kamokuList.push({ kyoka, kamoku, gakunen: gakunen as 1 | 2 | 3 | 4, hyotei: hyotei as 1 | 2 | 3 | 4 | 5 });
  }
  return { ok: true, kamoku: kamokuList };
}

export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('gakushu-seiseki-meta', request, { tier: gate.tier });
  return corsJson(buildMeta(), { headers: gate.headers, private: gate.cachePrivate });
}

export async function POST(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('gakushu-seiseki-compute', request, { tier: gate.tier });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return corsJson(
      { error: 'invalid_json', message: 'リクエストボディはJSONで指定してください。' },
      { status: 400, cacheSeconds: 0, headers: gate.headers },
    );
  }

  const kamokuRaw = typeof body === 'object' && body !== null ? (body as Record<string, unknown>).kamoku : undefined;
  const parsed = parseKamokuList(kamokuRaw);
  if (!parsed.ok) {
    return corsJson(
      { error: 'invalid_params', message: parsed.message },
      { status: 400, cacheSeconds: 0, headers: gate.headers },
    );
  }

  const kyokaStatus = calcKyokaStatus(parsed.kamoku);
  const overall = calcOverallStatus(parsed.kamoku);
  const gaihyou = toGaihyou(overall);

  return corsJson(
    {
      kyokaStatus,
      overall,
      gaihyou,
      source: SOURCE,
    },
    { headers: gate.headers, private: true, cacheSeconds: 0 },
  );
}

export function OPTIONS() {
  return corsPreflight();
}
