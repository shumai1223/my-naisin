import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { simulateHighToUniversity } from '@/lib/education-cost/engine';
import type { CourseType, IncomeBracket, UniversityType, Residence } from '@/lib/education-cost/types';
import { SITE_URL } from '@/lib/naishin-dataset';

const COURSE_TYPES: CourseType[] = ['public', 'private'];
const INCOME_BRACKETS: IncomeBracket[] = ['under590', 'under910', 'over910'];
const UNIVERSITY_TYPES: UniversityType[] = ['none', 'national', 'privateHumanities', 'privateScience'];
const RESIDENCES: Residence[] = ['home', 'away'];

/**
 * 公開データAPI（堀B・E-4）— 高校〜大学卒業までの進路別総額シミュレーション。
 *
 * GET /api/education-cost/path-to-university?highCourse=public&incomeBracket=under590&universityType=national&residence=home
 *   就学支援金の軽減後の高校実質負担＋大学4年の総額（自宅外なら仕送り込み）を計算する（/shinro-hiyou と同一エンジン）。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('education-cost-path', request, { tier: gate.tier });

  const url = new URL(request.url);
  const highCourseRaw = url.searchParams.get('highCourse') ?? 'public';
  const incomeBracketRaw = url.searchParams.get('incomeBracket') ?? 'under590';
  const universityTypeRaw = url.searchParams.get('universityType') ?? 'national';
  const residenceRaw = url.searchParams.get('residence') ?? 'home';

  if (!COURSE_TYPES.includes(highCourseRaw as CourseType)) {
    return corsJson(
      { error: 'invalid_params', message: 'highCourse は public または private で指定してください。' },
      { status: 400, cacheSeconds: 300, headers: gate.headers },
    );
  }
  if (!INCOME_BRACKETS.includes(incomeBracketRaw as IncomeBracket)) {
    return corsJson(
      { error: 'invalid_params', message: 'incomeBracket は under590, under910, over910 のいずれかで指定してください。' },
      { status: 400, cacheSeconds: 300, headers: gate.headers },
    );
  }
  if (!UNIVERSITY_TYPES.includes(universityTypeRaw as UniversityType)) {
    return corsJson(
      {
        error: 'invalid_params',
        message: 'universityType は none, national, privateHumanities, privateScience のいずれかで指定してください。',
      },
      { status: 400, cacheSeconds: 300, headers: gate.headers },
    );
  }
  if (!RESIDENCES.includes(residenceRaw as Residence)) {
    return corsJson(
      { error: 'invalid_params', message: 'residence は home または away で指定してください。' },
      { status: 400, cacheSeconds: 300, headers: gate.headers },
    );
  }

  const result = simulateHighToUniversity({
    highCourse: highCourseRaw as CourseType,
    incomeBracket: incomeBracketRaw as IncomeBracket,
    universityType: universityTypeRaw as UniversityType,
    residence: residenceRaw as Residence,
  });

  return corsJson(
    {
      meta: {
        name: '高校〜大学 進路別総額シミュレーション',
        source: `${SITE_URL}/shinro-hiyou`,
        generatedAt: new Date().toISOString(),
      },
      input: {
        highCourse: highCourseRaw,
        incomeBracket: incomeBracketRaw,
        universityType: universityTypeRaw,
        residence: residenceRaw,
      },
      result,
    },
    { headers: gate.headers, private: gate.cachePrivate },
  );
}

export function OPTIONS() {
  return corsPreflight();
}
