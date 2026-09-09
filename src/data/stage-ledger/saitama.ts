import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 埼玉県 段階台帳（T-Y11F §5順序#7・2県目パイロット・全日制普通科の一部・10レコード）。
 *
 * 一次ソース: 埼玉県教育委員会「令和8年度埼玉県公立高等学校入学者選抜における入学許可候補者数・
 * 欠員補充人員（令和8年3月6日現在）」（全10頁）1頁目の冒頭10校。
 * https://www.pref.saitama.lg.jp/documents/268192/r8nyugakukyokakouhosya0306_4.pdf
 *
 * ⚠️既存の`competition-rates/saitama.ts`（倍率パイプライン）は**別の一次資料**（「令和8年度
 * 埼玉県公立高等学校における入学志願確定者数」・2月19〜20日頃公表のPDF）から募集人員(quota)＝
 * 入学許可予定者数(A)・志願確定者数(applicants)＝B(倍率B÷A)を採用している。今回の3月6日資料は
 * 選抜結果（試験後）の資料で、列構成は[募集人員 / 転編入者数 / 入学許可予定者数(A) /
 * 実受検者数(B) / 入学許可候補者数(C) / 倍率(B÷C)]——**「志願確定者数」に相当する列が無い**
 * （実受検者数(B)は学力検査当日に実際に受検した人数で、志願確定者数よりわずかに少ない）。
 * そのため本ファイルは**quota・applicantsConfirmedを既存`competition-rates/saitama.ts`から
 * そのまま再利用**し（Aの値は両資料で完全一致することを確認済み）、**testTakersConfirmed・
 * finalPassersのみを本資料から新規に転記**する設計にした（同一の学校×学科について複数の
 * 一次資料を組み合わせる、段階台帳で初めてのケース）。
 *
 * ⚠️上尾（普通科）はfinalPassers(244)がquota(238)を6名上回る。これはY-0違反ではなく、
 * 学力検査の合格ボーダー得点に同点者が複数出た場合、全員を合格とする（募集人員をわずかに
 * 超過する）という一般的な選抜運用の結果と考えられる（推測に留め断定しない）。段階台帳では
 * 「finalPassers≤quota」を全県共通の不変条件とはしない（chibaでは常に成立していたが、
 * これは県ごとの選抜運用に依存するローカルな傾向であり普遍的な制約ではないと判明した）。
 *
 * coverage='partial'（1頁目冒頭10校のみ・全10頁中）。
 */

export const SAITAMA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'saitama',
  sources: [
    {
      url: 'https://www.pref.saitama.lg.jp/documents/268192/r8nyugakukyokakouhosya0306_4.pdf',
      docTitle: '埼玉県教育委員会 令和8年度埼玉県公立高等学校入学者選抜における入学許可候補者数・欠員補充人員（令和8年3月6日現在）1頁目',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['全日制普通科（1頁目冒頭10校）'],
    pendingDepartments: ['全日制普通科の残り（1頁目後半〜10頁目）', '専門学科', '総合学科'],
    note: '1頁目冒頭10校のみパイロット収集。quota/applicantsConfirmedは既存competition-rates/saitama.ts（同一quotaを別資料で確認済み）を再利用し、testTakersConfirmed/finalPassersのみ本資料から新規転記。',
  },
  records: [
    { schoolName: '上尾', department: '普通科', quota: 238, applicantsConfirmed: 316, testTakersConfirmed: 315, finalPassers: 244 },
    { schoolName: '上尾鷹の台', department: '普通科', quota: 198, applicantsConfirmed: 182, testTakersConfirmed: 182, finalPassers: 182 },
    { schoolName: '上尾橘', department: '普通科', quota: 118, applicantsConfirmed: 53, testTakersConfirmed: 53, finalPassers: 53 },
    { schoolName: '上尾南', department: '普通科', quota: 238, applicantsConfirmed: 247, testTakersConfirmed: 247, finalPassers: 238 },
    { schoolName: '朝霞', department: '普通科', quota: 318, applicantsConfirmed: 305, testTakersConfirmed: 305, finalPassers: 303 },
    { schoolName: '朝霞西', department: '普通科', quota: 318, applicantsConfirmed: 369, testTakersConfirmed: 369, finalPassers: 318 },
    { schoolName: '伊奈学園総合', department: '普通科（普通・スポーツ科学・芸術の合算）', quota: 718, applicantsConfirmed: 789, testTakersConfirmed: 789, finalPassers: 718 },
    { schoolName: '入間向陽', department: '普通科', quota: 318, applicantsConfirmed: 332, testTakersConfirmed: 332, finalPassers: 318 },
    { schoolName: '岩槻', department: '普通科', quota: 278, applicantsConfirmed: 305, testTakersConfirmed: 305, finalPassers: 278 },
    { schoolName: '浦和', department: '普通科', quota: 358, applicantsConfirmed: 434, testTakersConfirmed: 424, finalPassers: 362 },
  ],
};
