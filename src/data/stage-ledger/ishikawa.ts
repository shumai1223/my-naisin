import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 石川県 段階台帳（T-Y11F §5順序#7・16県目・全日制70レコードで完結）。
 *
 * 一次ソース: 石川県教育委員会「令和8年度石川県公立高等学校（全日制）の合格状況」
 * （令和8年3月18日・全3頁）。
 * https://www.pref.ishikawa.lg.jp/kisya/r7kyoui/documents/20260318.pdf
 *
 * ⚠️石川県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（他県と同型の
 * 高信頼度技法）。列は[募集定員(A) / 内定者数(B) / 一般入学枠(C=A-B＝quota) / 一般入学受検者数
 * (J＝testTakersConfirmed) / 受検倍率(J/C) / 一般入学合格者数(K＝finalPassers) / 合格者数計
 * (L=B+K)]という、段階台帳が必要とする4フィールド中3つ（quota・testTakersConfirmed・
 * finalPassers）が単一資料に揃う稀な高効率構造。
 *
 * applicantsConfirmedのみ既存パイプライン`competition-rates/ishikawa.ts`（「一般入学(全日制)の
 * 出願状況（2月24日）」）を再利用。⚠️既存パイプラインのapplicants（2/24時点）と本台帳の
 * testTakersConfirmed（3月・志願変更後）は別時点のスナップショットであり、石川県では出願後にも
 * 「志願変更」で出願先を変えられる制度があるため、他県で通常成立する
 * `testTakersConfirmed<=applicantsConfirmed`が一部の学科で成立しない（例: 松任・総合学科は
 * applicants50<testTakers51）。これは転記ミスではなく出願先変更の反映であり、quota・
 * testTakersConfirmed・finalPassersの3系列が本資料自身の「全県合計」行と完全一致することで
 * 正確性を担保する。
 *
 * ⚠️「普・理併願」制度（他県未見・既存パイプラインのコメントに記載）: 小松・金沢泉丘・七尾の3校は
 * 同一校内の複数学科（普通・理数等）に同時出願できる制度があり、既存パイプラインと同じく学科別
 * 行＋併願専用行（quota無し）を1レコードに合算した（quota・applicantsConfirmedは既存パイプライン
 * の合算値をそのまま再利用、testTakersConfirmedは学科別行＋併願行のJ列合計、finalPassersは
 * 併願行にK値が無いため学科別行のK列合計のみ）。
 *
 * quota・testTakersConfirmed・finalPassersの70レコード全数の機械集計（6,566／6,050／5,302）が
 * 本資料冒頭の「全県合計」表（一般入学枠6,566・一般入学受検者数6,050・一般入学合格者数5,302）と
 * 完全一致した。quotaは既存パイプラインの70レコード全数とも完全一致（1件の転記ミス〈穴水・普通を
 * 33と誤読、正しくは40〉をこの突合で発見・修正済み）。
 *
 * ⚠️既知の6件: finalPassersがtestTakersConfirmedを上回るのは全て複数学科を持つ工業系学校
 * （小松工業「材料化学」・工業「電子情報」「テキスタイル工学」・金沢市立工業「電気」「電子情報」
 * 「土木」）で、鳥取県・熊本県で確認したのと同型の学科間の合格者再配分と推測される。
 *
 * 定時制課程は他県と同じ理由でスコープ外。
 */
export const ISHIKAWA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'ishikawa',
  sources: [
    {
      url: 'https://www.pref.ishikawa.lg.jp/kisya/r7kyoui/documents/20260318.pdf',
      docTitle: '石川県教育委員会 令和8年度石川県公立高等学校（全日制）の合格状況',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-10',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（40校70レコードを完全収録）'],
    pendingDepartments: ['定時制の課程（他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制40校70レコードを完全収録。quota・testTakersConfirmed・finalPassersは本資料（一般入学枠・受検者数・合格者数の3列）から転記し、applicantsConfirmedのみ既存パイプライン`competition-rates/ishikawa.ts`（出願状況2/24）を再利用。3系列すべての機械集計（6,566／6,050／5,302）が資料冒頭の「全県合計」表と完全一致した。石川県独自の「普・理併願」制度により小松・金沢泉丘・七尾の3校は複数学科＋併願行を1レコードに合算（既存パイプラインの合算方針を継承）。applicantsConfirmedが別時点（2月24日出願状況）のスナップショットのため、testTakersConfirmedがapplicantsConfirmedを上回る学科が一部存在するが（志願変更の反映）、quota・testTakersConfirmed・finalPassersの本資料内3系列が独立に完全一致することで正確性を担保している。finalPassersがtestTakersConfirmedを上回る6件は全て複数学科を持つ工業系学校で、他県と同型の学科間合格者再配分と推測。定時制課程は恒久的にスコープ外。',
  },
  officialSubtotals: [
    { label: '全県合計', quota: 6566, applicantsConfirmed: 6076, testTakersConfirmed: 6050, finalPassers: 5302 },
  ],
  records: [
    { schoolName: '大聖寺実業', department: '機械システム', quota: 68, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '大聖寺実業', department: '情報ビジネス', quota: 28, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '大聖寺', department: '普通', quota: 160, applicantsConfirmed: 126, testTakersConfirmed: 130, finalPassers: 129 },
    { schoolName: '加賀', department: '総合学科', quota: 72, applicantsConfirmed: 49, testTakersConfirmed: 49, finalPassers: 49 },
    { schoolName: '小松商業', department: '総合情報ビジネス', quota: 112, applicantsConfirmed: 66, testTakersConfirmed: 66, finalPassers: 66 },
    { schoolName: '小松工業', department: '機械システム', quota: 56, applicantsConfirmed: 54, testTakersConfirmed: 57, finalPassers: 56 },
    { schoolName: '小松工業', department: '電気', quota: 56, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 47 },
    { schoolName: '小松工業', department: '建設', quota: 28, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '小松工業', department: '材料化学', quota: 29, applicantsConfirmed: 24, testTakersConfirmed: 23, finalPassers: 24 },
    { schoolName: '小松', department: '普通・理数（併願あり・合算）', quota: 320, applicantsConfirmed: 377, testTakersConfirmed: 369, finalPassers: 320 },
    { schoolName: '小松明峰', department: '普通', quota: 240, applicantsConfirmed: 246, testTakersConfirmed: 244, finalPassers: 240 },
    { schoolName: '寺井', department: '総合学科', quota: 113, applicantsConfirmed: 68, testTakersConfirmed: 66, finalPassers: 66 },
    { schoolName: '鶴来', department: '普通', quota: 77, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '鶴来', department: '普通（スポーツ科学）', quota: 31, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '松任', department: '普通', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '松任', department: '総合学科', quota: 79, applicantsConfirmed: 50, testTakersConfirmed: 51, finalPassers: 51 },
    { schoolName: '翠星', department: '総合グリーン科学', quota: 136, applicantsConfirmed: 126, testTakersConfirmed: 128, finalPassers: 127 },
    { schoolName: '野々市明倫', department: '普通', quota: 240, applicantsConfirmed: 249, testTakersConfirmed: 248, finalPassers: 240 },
    { schoolName: '金沢錦丘', department: '普通', quota: 202, applicantsConfirmed: 291, testTakersConfirmed: 296, finalPassers: 202 },
    { schoolName: '金沢泉丘', department: '普通・理数（併願あり・合算）', quota: 400, applicantsConfirmed: 490, testTakersConfirmed: 482, finalPassers: 400 },
    { schoolName: '金沢二水', department: '普通', quota: 400, applicantsConfirmed: 567, testTakersConfirmed: 559, finalPassers: 400 },
    { schoolName: '金沢伏見', department: '普通', quota: 240, applicantsConfirmed: 230, testTakersConfirmed: 238, finalPassers: 238 },
    { schoolName: '金沢辰巳丘', department: '普通', quota: 80, applicantsConfirmed: 33, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '金沢辰巳丘', department: '普通（芸術）', quota: 31, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '金沢商業', department: '総合情報ビジネス', quota: 196, applicantsConfirmed: 255, testTakersConfirmed: 246, finalPassers: 196 },
    { schoolName: '工業', department: '機械システム', quota: 56, applicantsConfirmed: 91, testTakersConfirmed: 75, finalPassers: 56 },
    { schoolName: '工業', department: '電気', quota: 28, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 28 },
    { schoolName: '工業', department: '電子情報', quota: 31, applicantsConfirmed: 18, testTakersConfirmed: 22, finalPassers: 28 },
    { schoolName: '工業', department: '材料化学', quota: 34, applicantsConfirmed: 32, testTakersConfirmed: 42, finalPassers: 34 },
    { schoolName: '工業', department: '工芸', quota: 28, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 28 },
    { schoolName: '工業', department: 'テキスタイル工学', quota: 28, applicantsConfirmed: 22, testTakersConfirmed: 24, finalPassers: 28 },
    { schoolName: '工業', department: 'デザイン', quota: 28, applicantsConfirmed: 47, testTakersConfirmed: 42, finalPassers: 28 },
    { schoolName: '金沢桜丘', department: '普通', quota: 360, applicantsConfirmed: 523, testTakersConfirmed: 523, finalPassers: 360 },
    { schoolName: '金沢西', department: '普通', quota: 320, applicantsConfirmed: 401, testTakersConfirmed: 400, finalPassers: 320 },
    { schoolName: '金沢北陵', department: '総合学科', quota: 149, applicantsConfirmed: 98, testTakersConfirmed: 98, finalPassers: 98 },
    { schoolName: '金沢向陽', department: '普通', quota: 116, applicantsConfirmed: 38, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '内灘', department: '普通', quota: 118, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 55 },
    { schoolName: '津幡', department: 'スポーツ健康科学', quota: 58, applicantsConfirmed: 31, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '津幡', department: '総合学科', quota: 80, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 58 },
    { schoolName: '羽咋', department: '普通', quota: 160, applicantsConfirmed: 141, testTakersConfirmed: 140, finalPassers: 140 },
    { schoolName: '羽咋工業', department: '機械システム', quota: 32, applicantsConfirmed: 33, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '羽咋工業', department: '電気', quota: 29, applicantsConfirmed: 34, testTakersConfirmed: 32, finalPassers: 29 },
    { schoolName: '羽咋工業', department: '建設・デザイン', quota: 28, applicantsConfirmed: 24, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '宝達', department: '普通', quota: 79, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '志賀', department: '普通', quota: 36, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '志賀', department: '普通（ビジネス・福祉）', quota: 38, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '七尾東雲', department: '機械システム', quota: 80, applicantsConfirmed: 20, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '七尾東雲', department: '演劇', quota: 20, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '七尾東雲', department: '総合学科', quota: 59, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '七尾', department: '普通・普通(文系フロンティア)・理数（併願あり・合算）', quota: 200, applicantsConfirmed: 188, testTakersConfirmed: 190, finalPassers: 190 },
    { schoolName: '田鶴浜', department: '衛生看護', quota: 28, applicantsConfirmed: 26, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '田鶴浜', department: '健康福祉', quota: 38, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '鹿西', department: '普通', quota: 120, applicantsConfirmed: 63, testTakersConfirmed: 63, finalPassers: 63 },
    { schoolName: '穴水', department: '普通', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '穴水', department: '普通（キャリア）', quota: 40, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '能登', department: '普通', quota: 33, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '能登', department: '地域産業', quota: 31, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '門前', department: '普通', quota: 36, applicantsConfirmed: 19, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '門前', department: '普通（キャリア）', quota: 35, applicantsConfirmed: 5, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '輪島', department: '普通', quota: 80, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '輪島', department: '普通（ビジネス）', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '飯田', department: '普通', quota: 80, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '飯田', department: '普通（ビジネス）', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '小松市立', department: '普通', quota: 90, applicantsConfirmed: 80, testTakersConfirmed: 85, finalPassers: 85 },
    { schoolName: '小松市立', department: '普通（芸術）', quota: 28, applicantsConfirmed: 14, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '金沢市立工業', department: '機械', quota: 56, applicantsConfirmed: 87, testTakersConfirmed: 68, finalPassers: 56 },
    { schoolName: '金沢市立工業', department: '電気', quota: 29, applicantsConfirmed: 21, testTakersConfirmed: 27, finalPassers: 29 },
    { schoolName: '金沢市立工業', department: '電子情報', quota: 33, applicantsConfirmed: 18, testTakersConfirmed: 26, finalPassers: 28 },
    { schoolName: '金沢市立工業', department: '建築', quota: 30, applicantsConfirmed: 38, testTakersConfirmed: 36, finalPassers: 30 },
    { schoolName: '金沢市立工業', department: '土木', quota: 30, applicantsConfirmed: 24, testTakersConfirmed: 27, finalPassers: 30 },
  ],
};
