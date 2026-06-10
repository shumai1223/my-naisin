import { corsJson, corsPreflight } from '@/lib/api-cors';
import {
  buildPrefectureDetail,
  buildStudyPlan,
  reverseCalcRequiredAverage,
  targetToRequiredGrades,
} from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B）— 単一都道府県の内申点計算方式 + 厳密な計算例 + 目安校。
 *
 * GET /api/naishin/{code}（例: /api/naishin/tokyo）
 *   「概算で終わらせない」ためのグラウンドトゥルース（オール3/4/5の厳密値）を含む。
 * GET /api/naishin/{code}?target=180
 *   目標内申点からの逆算（必要評定平均）＋効率の良い教科の提案を返す。
 * GET /api/naishin/{code}?target=180&current=140&weeks=12
 *   さらに学習計画（週次マイルストーン）を含めて返す。
 */
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const notFound = () =>
    corsJson(
      {
        error: 'not_found',
        message: `都道府県コード「${code}」は見つかりませんでした。一覧は /api/naishin を参照してください。`,
        index: 'https://my-naishin.com/api/naishin',
      },
      { status: 404, cacheSeconds: 300 }
    );

  // ?target= があれば逆算モード（reverse_calc + target_to_required_grades）。
  const targetRaw = new URL(request.url).searchParams.get('target');
  if (targetRaw !== null) {
    const target = Number(targetRaw);
    if (!Number.isFinite(target)) {
      return corsJson(
        { error: 'invalid_params', message: 'target は数値で指定してください（例: ?target=180）。' },
        { status: 400, cacheSeconds: 300 }
      );
    }
    const reverse = reverseCalcRequiredAverage({ prefectureCode: code, targetNaishin: target });
    const efficiency = targetToRequiredGrades({ prefectureCode: code, targetNaishin: target });
    if (!reverse || !efficiency) return notFound();

    // weeks があれば学習計画（週次マイルストーン）も同梱。current 未指定は0扱い。
    const sp = new URL(request.url).searchParams;
    const weeksRaw = sp.get('weeks');
    let studyPlan: ReturnType<typeof buildStudyPlan> | undefined;
    if (weeksRaw !== null && Number.isFinite(Number(weeksRaw))) {
      const current = Number(sp.get('current'));
      studyPlan = buildStudyPlan({
        prefectureCode: code,
        currentNaishin: Number.isFinite(current) ? current : 0,
        targetNaishin: target,
        weeksRemaining: Number(weeksRaw),
      });
    }

    return corsJson({
      mode: 'reverse',
      ...reverse,
      perGradeGain: efficiency.perGradeGain,
      raisePriority: efficiency.note,
      ...(studyPlan ? { studyPlan } : {}),
    });
  }

  const detail = buildPrefectureDetail(code);
  if (!detail) return notFound();
  return corsJson(detail);
}

export function OPTIONS() {
  return corsPreflight();
}
