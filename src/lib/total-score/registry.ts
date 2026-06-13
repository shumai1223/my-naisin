// 第1層（計算可能）県の総合得点システム登録簿。
//
// ここに載った県だけが /[prefecture]/total-score 動的ルートで計算機として公開される（allowlist）。
// 未検証・第2層の県は載せない＝未検証県は404（信頼の堀）。
//
// 出典・配点はすべて令和8年度（2026年度）の県教委一次ソースで確認したもの（[[session 2026-06-13 研究]]）。
// 二次情報どまりの県（大分ほか）は確定するまで載せない。

import type { TotalScoreSystem } from './types';

/** 兵庫県：判定資料A（内申250）＝判定資料C（学力250）を同等に扱う固定1:1。総合500点。 */
const hyogo: TotalScoreSystem = {
  code: 'hyogo',
  name: '兵庫県',
  routeSlug: 'total-score',
  localTerm: '判定資料（複数志願選抜）',
  fiscalYear: '2026',
  academic: { subjects: 5, perSubjectMax: 100, rawMax: 500, weightingNote: '一部学科で傾斜配点あり' },
  report: {
    targetGrades: [3],
    perGradeMax: 5,
    coreMultiplier: 4,
    practicalMultiplier: 7.5,
    rawMax: 250,
    note: '第3学年のみ。5教科評定和×4（=100）＋実技4教科評定和×7.5（=150）＝判定資料A 250点',
  },
  ratioOptions: [{ id: 'standard', label: '判定資料A・C 同等（内申250：学力250）', reportMax: 250, academicMax: 250 }],
  source: {
    url: 'https://www2.hyogo-c.ed.jp/hpe/koko/nyuushi/senbatsuyoukou_r8/',
    docTitle: '令和8年度兵庫県公立高等学校入学者選抜要綱',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 京都府（中期選抜）：報告書195点＋学力200点を同等に扱う固定式。総合395点。 */
const kyoto: TotalScoreSystem = {
  code: 'kyoto',
  name: '京都府',
  routeSlug: 'total-score',
  localTerm: '中期選抜',
  fiscalYear: '2026',
  academic: { subjects: 5, perSubjectMax: 40, rawMax: 200 },
  report: {
    targetGrades: [1, 2, 3],
    perGradeMax: 5,
    coreMultiplier: 1,
    practicalMultiplier: 2,
    rawMax: 195,
    note: '中1〜中3。5教科＝各5×5教科×3年=75、実技4教科＝各5×2倍×4教科×3年=120、計195点',
  },
  ratioOptions: [{ id: 'standard', label: '報告書195：学力200（同等）', reportMax: 195, academicMax: 200 }],
  source: {
    url: 'https://www.kyoto-be.ne.jp/koukyou/cms/?p=7836',
    docTitle: '令和8年度京都府公立高等学校入学者選抜要項（中期選抜）',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 栃木県：内申135点を500点換算し、学力500点と「内申:学力」9:1〜5:5の比率で合算。総合500点。 */
const tochigi: TotalScoreSystem = {
  code: 'tochigi',
  name: '栃木県',
  routeSlug: 'total-score',
  localTerm: '一般選抜',
  fiscalYear: '2026',
  academic: { subjects: 5, perSubjectMax: 100, rawMax: 500, weightingNote: '宇都宮・宇都宮女子等で国数英（社）に傾斜' },
  report: {
    targetGrades: [1, 2, 3],
    perGradeMax: 5,
    coreMultiplier: 1,
    practicalMultiplier: 1,
    rawMax: 135,
    note: '中1〜中3 9教科×5段階×3年=135点を500点に換算',
  },
  ratioOptions: [
    { id: '9-1', label: '内申9：学力1', reportMax: 450, academicMax: 50 },
    { id: '8-2', label: '内申8：学力2', reportMax: 400, academicMax: 100 },
    { id: '7-3', label: '内申7：学力3', reportMax: 350, academicMax: 150 },
    { id: '6-4', label: '内申6：学力4', reportMax: 300, academicMax: 200 },
    { id: '5-5', label: '内申5：学力5', reportMax: 250, academicMax: 250 },
  ],
  source: {
    url: 'https://www.pref.tochigi.lg.jp/m04/r08/r08_kennritukoutougakkounyuugakushasennbatunikannsuruosirase.html',
    docTitle: '令和8（2026）年度栃木県立高等学校入学者選抜要項',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 新潟県：調査書135点・学力500点をそれぞれ1000点に換算し、「調査書:学力」7:3〜3:7で合算。総合1000点。 */
const niigata: TotalScoreSystem = {
  code: 'niigata',
  name: '新潟県',
  routeSlug: 'total-score',
  localTerm: '一般選抜',
  fiscalYear: '2026',
  academic: { subjects: 5, perSubjectMax: 100, rawMax: 500, weightingNote: '一部校で英語・数学等を2倍に傾斜' },
  report: {
    targetGrades: [1, 2, 3],
    perGradeMax: 5,
    coreMultiplier: 1,
    practicalMultiplier: 1,
    rawMax: 135,
    note: '中1〜中3 9教科×5×3年=135点。調査書・学力をそれぞれ1000点に換算して比率で合算（学校独自検査は別途加算）',
  },
  ratioOptions: [
    { id: '7-3', label: '調査書7：学力3', reportMax: 700, academicMax: 300 },
    { id: '6-4', label: '調査書6：学力4', reportMax: 600, academicMax: 400 },
    { id: '5-5', label: '調査書5：学力5', reportMax: 500, academicMax: 500 },
    { id: '4-6', label: '調査書4：学力6', reportMax: 400, academicMax: 600 },
    { id: '3-7', label: '調査書3：学力7', reportMax: 300, academicMax: 700 },
  ],
  source: {
    url: 'https://www.pref.niigata.lg.jp/uploaded/attachment/472931.pdf',
    docTitle: '令和8年度新潟県公立高等学校入学者選抜要項',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 鳥取県：第3学年のみ内申（実技2倍）65点を各校倍率α=2〜4で130〜260点に拡大し、学力250点と合算。 */
const tottori: TotalScoreSystem = {
  code: 'tottori',
  name: '鳥取県',
  routeSlug: 'total-score',
  localTerm: '一般入学者選抜',
  fiscalYear: '2026',
  academic: { subjects: 5, perSubjectMax: 50, rawMax: 250, weightingNote: '理数科・総合学科で傾斜あり' },
  report: {
    targetGrades: [3],
    perGradeMax: 5,
    coreMultiplier: 1,
    practicalMultiplier: 2,
    rawMax: 65,
    note: '第3学年のみ。5教科＋実技4教科×2＝65点を、各校設定の倍率α（2〜4）で130〜260点に拡大',
  },
  ratioOptions: [
    { id: 'a2', label: '内申130：学力250（α=2）', reportMax: 130, academicMax: 250 },
    { id: 'a3', label: '内申195：学力250（α=3）', reportMax: 195, academicMax: 250 },
    { id: 'a4', label: '内申260：学力250（α=4）', reportMax: 260, academicMax: 250 },
  ],
  source: {
    url: 'https://www.pref.tottori.lg.jp/',
    docTitle: '令和8年度鳥取県立高等学校入学者選抜実施要項',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 第1層・検証済みの県（allowlist）。 */
export const TOTAL_SCORE_SYSTEMS: Record<string, TotalScoreSystem> = {
  hyogo,
  kyoto,
  tochigi,
  niigata,
  tottori,
};

export const VERIFIED_TOTAL_SCORE_CODES = Object.keys(TOTAL_SCORE_SYSTEMS);

export function getTotalScoreSystem(code: string): TotalScoreSystem | undefined {
  return TOTAL_SCORE_SYSTEMS[code];
}

/** 計算機として公開してよい県か（未検証＝404 の判定に使う）。 */
export function isVerifiedTotalScore(code: string): boolean {
  return Object.prototype.hasOwnProperty.call(TOTAL_SCORE_SYSTEMS, code);
}
