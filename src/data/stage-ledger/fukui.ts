import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 福井県 段階台帳（T-Y11F §5順序#7・20県目・全日制72レコードで完結）。
 *
 * 一次ソース: 福井県教育委員会「令和8年度福井県立高等学校一般入学者選抜 合格者数」
 * （令和8年3月3日・全2頁）。
 * https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r08ippan_d/fil/R8goukaku.pdf
 *
 * ⚠️このPDFはタイトルの文字化けを除きpdftotextは数値抽出可能だが列対応が不明瞭なため、
 * pdftoppm 200dpi + ビジョン読み取りで転記した。列は[募集定員(A) / 推薦・特色等合格者数(B) /
 * 一般選抜募集人員(C=A-B) / 一般選抜受験者数 / 一般選抜合格者数 / 合計合格者数 / 第2次募集人員]。
 *
 * quota・applicantsConfirmedは既存パイプライン`competition-rates/fukui.ts`（一般選抜募集人員C＝
 * quota・変更後第一志望出願者数＝applicants、2/16時点）を再利用。testTakersConfirmed・
 * finalPassersは本資料（3/3公表）の一般選抜受験者数・一般選抜合格者数列から新規転記した。
 * 鯖江高校の2組のくくり募集（「スポーツ・健康福祉」「IT・アートデザイン」）は既存パイプラインと
 * 同じくPDF上も統合済みの1行として印字されており、既存の合算方針をそのまま踏襲した。
 *
 * quota・testTakersConfirmed・finalPassersの72レコード全数の機械集計（3,316／3,426／3,108）が
 * 資料本文の「合計」行（全日制計：一般選抜募集人員3,316・受験者数3,426・合格者数3,108）と完全
 * 一致した（quotaは既存パイプラインの72レコード全数とも完全一致・初回転記で再修正なし）。
 *
 * ⚠️既知の19件: finalPassersがtestTakersConfirmedを上回るのは、いずれも受験者数が募集人員を
 * 下回る（定員割れ）学科で、資料の「合計合格者数」列が募集定員をちょうど満たす値になっている
 * ケース（例: 羽水「普通」は受験者数163人に対し合格者数232人＝一般選抜募集人員と同数）。他県の
 * 「学科間再配分」とは異なり、定員割れ学科では受験者全員合格＋未充足枠を別枠から充足という
 * 仕組みによるものと推測される。
 *
 * 定時制課程は他県と同じ理由でスコープ外。
 */
export const FUKUI_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'fukui',
  sources: [
    {
      url: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r08ippan_d/fil/R8goukaku.pdf',
      docTitle: '福井県教育委員会 令和8年度福井県立高等学校一般入学者選抜 合格者数',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（一般選抜、24校72レコードを完全収録）'],
    pendingDepartments: ['定時制の課程（他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制24校72レコードを完全収録。quota・applicantsConfirmedは既存パイプライン`competition-rates/fukui.ts`（変更後第一志望出願者数2/16）を再利用し、testTakersConfirmed・finalPassersは本資料（合格者数3/3公表）の一般選抜受験者数・一般選抜合格者数列から新規転記した。3系列すべての機械集計（3,316／3,426／3,108）が資料本文の「合計」行と完全一致し、quotaは既存パイプライン全72件とも完全一致した。finalPassersがtestTakersConfirmedを上回る19件はいずれも定員割れ学科で、受験者全員合格＋未充足枠の別枠充足による構造的な結果と推測される。定時制課程は恒久的にスコープ外。',
  },
  officialSubtotals: [
    { label: '全日制計', quota: 3316, applicantsConfirmed: 3428, testTakersConfirmed: 3426, finalPassers: 3108 },
  ],
  records: [
    { schoolName: '足羽', department: '普通（キャリアデザイン）', quota: 71, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 57 },
    { schoolName: '足羽', department: '多文化共生（中国語・英語）', quota: 27, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '足羽', department: '多文化共生（日本語）', quota: 1, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '羽水', department: '普通', quota: 232, applicantsConfirmed: 163, testTakersConfirmed: 163, finalPassers: 232 },
    { schoolName: '羽水', department: '探究特進', quota: 33, applicantsConfirmed: 122, testTakersConfirmed: 122, finalPassers: 33 },
    { schoolName: '金津', department: '普通', quota: 164, applicantsConfirmed: 155, testTakersConfirmed: 154, finalPassers: 154 },
    { schoolName: '高志', department: '探究創造', quota: 143, applicantsConfirmed: 282, testTakersConfirmed: 282, finalPassers: 143 },
    { schoolName: '藤島', department: '普通', quota: 296, applicantsConfirmed: 397, testTakersConfirmed: 397, finalPassers: 296 },
    { schoolName: '丸岡', department: '普通（みらい共創）', quota: 42, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 40 },
    { schoolName: '丸岡', department: '普通（スポーツ探究）', quota: 12, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 12 },
    { schoolName: '三国', department: '普通', quota: 100, applicantsConfirmed: 99, testTakersConfirmed: 99, finalPassers: 98 },
    { schoolName: '大野', department: '普通', quota: 93, applicantsConfirmed: 84, testTakersConfirmed: 84, finalPassers: 84 },
    { schoolName: '勝山', department: '普通', quota: 72, applicantsConfirmed: 69, testTakersConfirmed: 69, finalPassers: 71 },
    { schoolName: '勝山', department: '探究特進', quota: 14, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 14 },
    { schoolName: '鯖江', department: '普通（スタンダード）', quota: 129, applicantsConfirmed: 114, testTakersConfirmed: 114, finalPassers: 129 },
    { schoolName: '鯖江', department: '普通（スポーツ・健康福祉くくり募集）', quota: 14, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '鯖江', department: '普通（IT・アートデザインくくり募集）', quota: 26, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 26 },
    { schoolName: '鯖江', department: '探究', quota: 27, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 27 },
    { schoolName: '武生', department: '普通', quota: 225, applicantsConfirmed: 196, testTakersConfirmed: 196, finalPassers: 225 },
    { schoolName: '武生', department: '探究進学', quota: 72, applicantsConfirmed: 116, testTakersConfirmed: 116, finalPassers: 72 },
    { schoolName: '武生東', department: '学際フロンティア', quota: 85, applicantsConfirmed: 87, testTakersConfirmed: 87, finalPassers: 85 },
    { schoolName: '丹生', department: '普通', quota: 78, applicantsConfirmed: 80, testTakersConfirmed: 80, finalPassers: 78 },
    { schoolName: '敦賀', department: '普通', quota: 70, applicantsConfirmed: 71, testTakersConfirmed: 71, finalPassers: 70 },
    { schoolName: '敦賀', department: '文理進学', quota: 42, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 42 },
    { schoolName: '敦賀', department: '商業', quota: 8, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '敦賀', department: '情報経理', quota: 12, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '美方', department: '普通', quota: 33, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '美方', department: '生活情報', quota: 12, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 12 },
    { schoolName: '美方', department: '食物', quota: 13, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 13 },
    { schoolName: '若狭', department: '普通', quota: 124, applicantsConfirmed: 105, testTakersConfirmed: 105, finalPassers: 124 },
    { schoolName: '若狭', department: '文理探究', quota: 30, applicantsConfirmed: 56, testTakersConfirmed: 56, finalPassers: 30 },
    { schoolName: '若狭', department: '海洋科学', quota: 46, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 46 },
    { schoolName: '福井農林', department: '生物生産', quota: 22, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 22 },
    { schoolName: '福井農林', department: '環境工学', quota: 29, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 20 },
    { schoolName: '福井農林', department: '生活科学', quota: 22, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 22 },
    { schoolName: '福井農林', department: '食品流通', quota: 31, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 31 },
    { schoolName: '科学技術', department: '機械システム', quota: 24, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '科学技術', department: '情報工学', quota: 26, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '科学技術', department: '電子電気', quota: 27, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '科学技術', department: '化学創造', quota: 30, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '科学技術', department: '産業デザイン', quota: 22, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '敦賀工業', department: '電子機械', quota: 14, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 15 },
    { schoolName: '敦賀工業', department: '電気', quota: 23, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 21 },
    { schoolName: '敦賀工業', department: '建築システム', quota: 15, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 15 },
    { schoolName: '敦賀工業', department: '情報ケミカル', quota: 23, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 22 },
    { schoolName: '福井商業', department: '商業', quota: 27, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 27 },
    { schoolName: '福井商業', department: '流通経済', quota: 25, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 25 },
    { schoolName: '福井商業', department: '会計', quota: 28, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 28 },
    { schoolName: '福井商業', department: '情報処理', quota: 37, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '福井商業', department: '国際経済', quota: 13, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 13 },
    { schoolName: '坂井', department: '食農科学（農業）', quota: 23, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 20 },
    { schoolName: '坂井', department: '食農科学（食品）', quota: 19, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 19 },
    { schoolName: '坂井', department: '機械・自動車（機械）', quota: 19, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 15 },
    { schoolName: '坂井', department: '機械・自動車（自動車）', quota: 18, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '坂井', department: '電気・情報システム（電気）', quota: 19, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 19 },
    { schoolName: '坂井', department: '電気・情報システム（情報システム）', quota: 13, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 13 },
    { schoolName: '坂井', department: 'ビジネス・生活デザイン（ビジネス）', quota: 17, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '坂井', department: 'ビジネス・生活デザイン（生活デザイン）', quota: 16, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '奥越明成', department: '機械', quota: 18, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '奥越明成', department: '電気', quota: 26, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '奥越明成', department: 'ビジネス情報', quota: 17, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '奥越明成', department: '生活福祉（生活）', quota: 19, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '奥越明成', department: '生活福祉（福祉）', quota: 18, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '武生商工', department: '機械創造', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 40 },
    { schoolName: '武生商工', department: '電気情報', quota: 27, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 27 },
    { schoolName: '武生商工', department: '都市・建築', quota: 24, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 24 },
    { schoolName: '武生商工', department: '商業マネジメント', quota: 44, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 42 },
    { schoolName: '武生商工', department: '情報ビジネス', quota: 13, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 13 },
    { schoolName: '若狭東', department: '生活創造', quota: 22, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 22 },
    { schoolName: '若狭東', department: '地域創造', quota: 22, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 21 },
    { schoolName: '若狭東', department: '工業創造', quota: 51, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '若狭東', department: 'ビジネス情報', quota: 47, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 42 },
  ],
};
