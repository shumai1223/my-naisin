import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { simulateEducationCost } from '@/lib/education-cost/engine';
import type { CourseType, JukuType } from '@/lib/education-cost/types';
import { SITE_URL } from '@/lib/naishin-dataset';

const COURSE_TYPES: CourseType[] = ['public', 'private'];
const JUKU_TYPES: JukuType[] = ['none', 'shudan', 'kobetsu', 'katei'];

/**
 * 公開データAPI（堀B・E-4）— 教育費総額シミュレーション（中学残り＋高校3年＋塾代）。
 *
 * GET /api/education-cost?currentGrade=2&juniorCourse=public&highCourse=public&jukuType=kobetsu
 *   文部科学省「子供の学習費調査」等の一次データに基づく総額を計算して返す（/kyouiku-hi と同一エンジン）。
 * パラメータ省略時は既定値（currentGrade=1・public・public・none）で計算する。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('education-cost', request, { tier: gate.tier });

  const url = new URL(request.url);
  const currentGradeRaw = url.searchParams.get('currentGrade') ?? '1';
  const juniorCourseRaw = url.searchParams.get('juniorCourse') ?? 'public';
  const highCourseRaw = url.searchParams.get('highCourse') ?? 'public';
  const jukuTypeRaw = url.searchParams.get('jukuType') ?? 'none';

  const currentGrade = Number(currentGradeRaw);
  if (![1, 2, 3].includes(currentGrade)) {
    return corsJson(
      { error: 'invalid_params', message: 'currentGrade は 1, 2, 3 のいずれかで指定してください。' },
      { status: 400, cacheSeconds: 300, headers: gate.headers },
    );
  }
  if (!COURSE_TYPES.includes(juniorCourseRaw as CourseType) || !COURSE_TYPES.includes(highCourseRaw as CourseType)) {
    return corsJson(
      { error: 'invalid_params', message: 'juniorCourse・highCourse は public または private で指定してください。' },
      { status: 400, cacheSeconds: 300, headers: gate.headers },
    );
  }
  if (!JUKU_TYPES.includes(jukuTypeRaw as JukuType)) {
    return corsJson(
      { error: 'invalid_params', message: 'jukuType は none, shudan, kobetsu, katei のいずれかで指定してください。' },
      { status: 400, cacheSeconds: 300, headers: gate.headers },
    );
  }

  const result = simulateEducationCost({
    currentGrade: currentGrade as 1 | 2 | 3,
    juniorCourse: juniorCourseRaw as CourseType,
    highCourse: highCourseRaw as CourseType,
    jukuType: jukuTypeRaw as JukuType,
  });

  return corsJson(
    {
      meta: {
        name: '教育費総額シミュレーション（中学残り＋高校3年＋塾代）',
        source: `${SITE_URL}/kyouiku-hi`,
        generatedAt: new Date().toISOString(),
      },
      input: { currentGrade, juniorCourse: juniorCourseRaw, highCourse: highCourseRaw, jukuType: jukuTypeRaw },
      result,
    },
    { headers: gate.headers, private: gate.cachePrivate },
  );
}

export function OPTIONS() {
  return corsPreflight();
}
