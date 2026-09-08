import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 三重県 定時制課程・通信制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 三重県教育委員会「令和8年度三重県立高等学校入学者選抜」（全5頁・既存の全日制
 * `src/data/competition-rates/mie.ts`と同一PDF）4頁目【定時制課程】【通信制課程】の全数表。
 * https://www.pref.mie.lg.jp/common/content/001243656.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、既存の全日制収集元と同一PDFの
 * 4頁目に定時制課程（11校17レコード：桑名・四日市工業[機械交通工学/住システム工学]・
 * 北星[普通・情報ビジネス昼間部くくり募集/普通夜間部]・飯野・みえ夢学園[午前/午後/夜間の
 * 3部制]・上野・名張・松阪工業・伊勢まなび[午前/午後/夜間の3部制]・尾鷲・熊野青藍木本校舎）と
 * 通信制課程（2校2レコード：北星・松阪）が独立して存在する。定時制のみのS1-3スコープに加え、
 * 通信制も同じ頁にあったため合わせて収録した（北海道の有朋単位制と同型の扱い）。
 *
 * quotaは「後期選抜募集人数」列（入学定員から前期選抜等合格内定者数を控除した実質枠）、
 * finalApplicantsは「志願者数」列、finalRateは「志願倍率」列を採用（全日制mie.tsと同じ規律）。
 * 北星の普通（昼間部）・情報ビジネス（昼間部）はくくり募集（入学定員40+40=80人を1枠で運用）
 * のため単一レコードとして統合し、学科名を連結して記録した。
 *
 * 機械集計は2段階の自己検算が一致した: 定時制課程計=quota558・applicants182・倍率0.33
 * （17レコード、表末尾「総計」770(入学定員)/202/558/182/0.33と完全一致）／通信制課程計=
 * quota392・applicants53・倍率0.14（2レコード、表末尾「総計」500(入学定員)/48/392/53/0.14と
 * 完全一致）。この頁はToUnicode欠落があったが罫線・数字は明瞭で、pdftoppm 120dpiの
 * ビジョン解析1回で全19レコードを判読できた。
 */

export const MIE_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'mie',
  sources: [
    {
      url: 'https://www.pref.mie.lg.jp/common/content/001243656.pdf',
      docTitle: '三重県教育委員会 令和8年度三重県立高等学校入学者選抜（定時制課程・通信制課程・4頁目）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程', '通信制課程'],
    pendingDepartments: [],
    note: '4頁目「定時制課程」（17レコード・11校）＋「通信制課程」（2レコード・2校）の全19レコードを完全収録。',
  },
  records: [
    { schoolName: '桑名', department: '普通', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '四日市工業', department: '機械交通工学', quota: 32, finalApplicants: 3, finalRate: 0.09 },
    { schoolName: '四日市工業', department: '住システム工学', quota: 34, finalApplicants: 5, finalRate: 0.15 },
    { schoolName: '北星', department: '普通（昼間部）・情報ビジネス（昼間部）（くくり募集）', quota: 32, finalApplicants: 52, finalRate: 1.63 },
    { schoolName: '北星', department: '普通（夜間部）', quota: 30, finalApplicants: 9, finalRate: 0.3 },
    { schoolName: '飯野', department: '普通', quota: 54, finalApplicants: 9, finalRate: 0.17 },
    { schoolName: 'みえ夢学園', department: '総合学科（午前の部）', quota: 17, finalApplicants: 19, finalRate: 1.12 },
    { schoolName: 'みえ夢学園', department: '総合学科（午後の部）', quota: 17, finalApplicants: 17, finalRate: 1.0 },
    { schoolName: 'みえ夢学園', department: '総合学科（夜間部）', quota: 17, finalApplicants: 7, finalRate: 0.41 },
    { schoolName: '上野', department: '普通', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '名張', department: '普通', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '松阪工業', department: '普通', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '伊勢まなび', department: '普通（午前の部）', quota: 23, finalApplicants: 1, finalRate: 0.04 },
    { schoolName: '伊勢まなび', department: '普通（午後の部）', quota: 27, finalApplicants: 2, finalRate: 0.07 },
    { schoolName: '伊勢まなび', department: 'ものづくり工学（夜間部）', quota: 35, finalApplicants: 0, finalRate: 0 },
    { schoolName: '尾鷲', department: '普通', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '熊野青藍（木本校舎）', department: '普通', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '北星（通信制）', department: '普通', quota: 192, finalApplicants: 26, finalRate: 0.14 },
    { schoolName: '松阪（通信制）', department: '普通', quota: 200, finalApplicants: 27, finalRate: 0.14 },
  ],
  officialSubtotals: [
    { label: '定時制課程 総計', quota: 558, finalApplicants: 182, finalRate: 0.33 },
    { label: '通信制課程 総計', quota: 392, finalApplicants: 53, finalRate: 0.14 },
  ],
};
