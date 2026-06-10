import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { comparePrefectures } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B）— 複数都道府県の内申点を同一評定で横並び比較。
 *
 * GET /api/naishin/compare?codes=tokyo,osaka,hyogo&grade=4
 *   同じ評定でも満点・倍率設計の違いで内申が変わることを定量的に返す。
 *   静的セグメント /compare は動的 [code] より優先されるため衝突しない。
 */
export function GET(request: Request) {
  const url = new URL(request.url);
  const codesRaw = url.searchParams.get('codes') ?? '';
  const codes = codesRaw
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  if (codes.length === 0) {
    return corsJson(
      {
        error: 'invalid_params',
        message: 'codes をカンマ区切りで指定してください（例: ?codes=tokyo,osaka,hyogo）。',
        example: 'https://my-naishin.com/api/naishin/compare?codes=tokyo,osaka,hyogo&grade=4',
      },
      { status: 400, cacheSeconds: 300 }
    );
  }

  const gradeRaw = url.searchParams.get('grade');
  const grade = gradeRaw !== null && Number.isFinite(Number(gradeRaw)) ? Number(gradeRaw) : undefined;

  logApiHit('naishin-compare', request, { codes: codes.length });
  return corsJson(comparePrefectures({ codes, grade }));
}

export function OPTIONS() {
  return corsPreflight();
}
