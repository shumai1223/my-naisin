import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 鹿児島県 段階台帳（T-Y11F §5順序#7・12県目・全日制156レコードで完結）。
 *
 * 一次ソース: 鹿児島県教育委員会「令和8年度公立高等学校入学者選抜学力検査受検者数」
 * （令和8年3月5日・全7ページ）＋「令和8年度公立高等学校入学者選抜合格者数及び第二次入学者
 * 選抜の募集定員」（令和8年3月12日・全9ページ）の2資料。
 * https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r3/r8jukensyasuu.html
 * https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r5/r8goukaku2jiteiin.html
 *
 * ⚠️両PDFともCJK埋め込みフォントでpdftotextが機能しないため、pdftoppm 200dpi + ビジョン読み取り
 * で転記した。
 *
 * quota・applicantsConfirmedは既存パイプライン`competition-rates/kagoshima.ts`（「学力検査
 * 最終出願者数」別資料・quota=学力検査定員=募集定員−推薦等内定者数）を再利用。「受検者数」資料の
 * 学力検査定員列・受検者数列がこのquota定義と完全一致することを156件全数・7学区の学区計すべてで
 * 確認済み。testTakersConfirmedは同資料の受検者数列から新規転記した。
 *
 * finalPassersは「合格者数」資料の合格者数列（推薦等内定者＋学力検査合格者の合算値）から、
 * 推薦等内定者数（＝「合格者数」資料の募集定員（総定員）−既存パイプラインのquota（学力検査
 * 定員））を差し引いて算出した（三重県で確立した設計と同型）。
 *
 * 3系列（quota/testTakersConfirmed/finalPassers）の機械集計がそれぞれ「受検者数」資料の学校別
 * 表末尾の「全日制合計」行（10,349/7,664）・「合格者数」資料の全日制合計（8,259）から算出した
 * 差分と完全一致した。転記中に1件の誤記（頴娃・機械電気の合格者数資料側募集定員を39〈quota値と
 * 混同〉ではなく正しくは40）を学区計の突合で発見・修正した。
 *
 * ⚠️既知の特徴: 156件中18件でfinalPassersがtestTakersConfirmedをわずかに上回る（多くは+1〜+9、
 * 最大は鹿児島工業・工業Ⅰ類の+9）。これは三重県と同型の「合格者数資料が推薦等入学者選抜と
 * 学力検査による選抜の合算値を表しているため」と推測される。2件（野田女子・衛生看護、与論・普通）
 * は志願者0名のためapplicantsConfirmed/testTakersConfirmed/finalPassersとも0値のまま採用した
 * （既存パイプライン側もfinalApplicants=0と記録済み）。鹿児島女子・スポーツビジネスは志願確定者数
 * 1名（既存パイプラインのfinalApplicants=1と一致）だが受検者数・合格者数はいずれも0（受検辞退と
 * 推定）のため、applicantsConfirmed=1・testTakersConfirmed=finalPassers=0として採用した。
 *
 * 定時制課程は他県と同じ理由で恒久的にスコープ外。
 */
export const KAGOSHIMA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'kagoshima',
  sources: [
    {
      url: 'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r3/documents/126852_20260305171728-1.pdf',
      docTitle: '鹿児島県教育委員会 令和8年度公立高等学校入学者選抜学力検査受検者数（全日制・学区別詳細）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
    {
      url: 'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r5/documents/127028_20260312140634-1.pdf',
      docTitle: '鹿児島県教育委員会 令和8年度公立高等学校入学者選抜合格者数及び第二次入学者選抜の募集定員（全日制・学区別詳細）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（7学区・156学科を完全収録）'],
    pendingDepartments: ['定時制の課程（他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制7学区（鹿児島・南薩・北薩・姶良伊佐・大隅・熊毛・大島）156学科を完全収録。quota・applicantsConfirmedは既存パイプライン`competition-rates/kagoshima.ts`を再利用し、「受検者数」資料の学力検査定員・受検者数列がこのquota定義と一致することを156件全数・7学区の学区計すべてで確認した。testTakersConfirmedは同資料の受検者数列から新規転記。finalPassersは「合格者数」資料の合格者数（推薦等内定者＋学力検査合格者の合算値）から推薦等内定者数（合格者数資料の総定員−quota）を差し引いて算出した。quota・testTakersConfirmedの機械集計（10,349/7,664）が「受検者数」資料の全日制合計行と完全一致し、finalPassersの機械集計（6,998）も「合格者数」資料の全日制合計（8,259）から算出した差分と完全一致した。156件中18件でfinalPassersがtestTakersConfirmedをわずかに上回るが、これは三重県と同型の「合格者数資料が推薦等入学者選抜と学力検査による選抜の合算値を表しているため」と推測される。2件（野田女子・衛生看護、与論・普通）は志願者0名のため3フィールドとも0値のまま採用した。鹿児島女子・スポーツビジネスは志願確定者数1名（既存パイプラインと一致）だが受検者数・合格者数は0（受検辞退と推定）のため採用した。',
  },
  officialSubtotals: [
    { label: '全日制合計', quota: 10349, applicantsConfirmed: 7948, testTakersConfirmed: 7664, finalPassers: 6998 },
  ],
  records: [
    { schoolName: '鶴丸', department: '普通', quota: 288, applicantsConfirmed: 423, testTakersConfirmed: 413, finalPassers: 288 },
    { schoolName: '甲南', department: '普通', quota: 288, applicantsConfirmed: 412, testTakersConfirmed: 405, finalPassers: 288 },
    { schoolName: '鹿児島中央', department: '普通', quota: 288, applicantsConfirmed: 471, testTakersConfirmed: 451, finalPassers: 288 },
    { schoolName: '錦江湾', department: '普通', quota: 153, applicantsConfirmed: 88, testTakersConfirmed: 83, finalPassers: 81 },
    { schoolName: '錦江湾', department: '理数', quota: 76, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '武岡台', department: '普通', quota: 217, applicantsConfirmed: 241, testTakersConfirmed: 226, finalPassers: 217 },
    { schoolName: '武岡台', department: '情報科学', quota: 77, applicantsConfirmed: 60, testTakersConfirmed: 58, finalPassers: 62 },
    { schoolName: '開陽', department: '普通', quota: 66, applicantsConfirmed: 54, testTakersConfirmed: 51, finalPassers: 51 },
    { schoolName: '開陽', department: '福祉', quota: 34, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '明桜館', department: '文理科学', quota: 113, applicantsConfirmed: 52, testTakersConfirmed: 49, finalPassers: 44 },
    { schoolName: '明桜館', department: '商業', quota: 71, applicantsConfirmed: 69, testTakersConfirmed: 65, finalPassers: 58 },
    { schoolName: '松陽', department: '普通', quota: 178, applicantsConfirmed: 174, testTakersConfirmed: 167, finalPassers: 167 },
    { schoolName: '松陽', department: '音楽', quota: 14, applicantsConfirmed: 8, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '松陽', department: '美術', quota: 14, applicantsConfirmed: 13, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '鹿児島東', department: '普通', quota: 80, applicantsConfirmed: 49, testTakersConfirmed: 47, finalPassers: 43 },
    { schoolName: '鹿児島工業', department: '工業Ⅰ類', quota: 168, applicantsConfirmed: 136, testTakersConfirmed: 121, finalPassers: 130 },
    { schoolName: '鹿児島工業', department: '工業Ⅱ類', quota: 84, applicantsConfirmed: 103, testTakersConfirmed: 96, finalPassers: 84 },
    { schoolName: '鹿児島南', department: '普通', quota: 144, applicantsConfirmed: 168, testTakersConfirmed: 156, finalPassers: 144 },
    { schoolName: '鹿児島南', department: '商業', quota: 68, applicantsConfirmed: 74, testTakersConfirmed: 74, finalPassers: 68 },
    { schoolName: '鹿児島南', department: '情報処理', quota: 34, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 34 },
    { schoolName: '鹿児島南', department: '体育', quota: 8, applicantsConfirmed: 12, testTakersConfirmed: 10, finalPassers: 8 },
    { schoolName: '吹上', department: '電気', quota: 37, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '吹上', department: '電子機械', quota: 39, applicantsConfirmed: 39, testTakersConfirmed: 38, finalPassers: 36 },
    { schoolName: '吹上', department: '情報処理', quota: 37, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 13 },
    { schoolName: '伊集院', department: '普通', quota: 231, applicantsConfirmed: 123, testTakersConfirmed: 119, finalPassers: 119 },
    { schoolName: '市来農芸', department: '農業', quota: 39, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '市来農芸', department: '畜産', quota: 36, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 11 },
    { schoolName: '市来農芸', department: '環境園芸', quota: 36, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 12 },
    { schoolName: '串木野', department: '普通', quota: 75, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '鹿児島玉龍', department: '普通', quota: 100, applicantsConfirmed: 172, testTakersConfirmed: 160, finalPassers: 100 },
    { schoolName: '鹿児島商業', department: 'ビジネスクリエイト', quota: 83, applicantsConfirmed: 87, testTakersConfirmed: 84, finalPassers: 79 },
    { schoolName: '鹿児島商業', department: '情報イノベーション', quota: 92, applicantsConfirmed: 74, testTakersConfirmed: 70, finalPassers: 67 },
    { schoolName: '鹿児島商業', department: 'アスリートスポーツ', quota: 8, applicantsConfirmed: 5, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '鹿児島女子', department: 'ファイナンシャルビジネス', quota: 33, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '鹿児島女子', department: 'ビジネスデザイン', quota: 72, applicantsConfirmed: 37, testTakersConfirmed: 35, finalPassers: 35 },
    { schoolName: '鹿児島女子', department: 'スポーツビジネス', quota: 27, applicantsConfirmed: 1, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '鹿児島女子', department: 'ファッション・フードクリエイト', quota: 62, applicantsConfirmed: 56, testTakersConfirmed: 54, finalPassers: 54 },
    { schoolName: '鹿児島女子', department: 'ライフ・スポーツ', quota: 53, applicantsConfirmed: 29, testTakersConfirmed: 28, finalPassers: 26 },
    { schoolName: '指宿', department: '普通', quota: 77, applicantsConfirmed: 65, testTakersConfirmed: 64, finalPassers: 65 },
    { schoolName: '山川', department: '園芸工学・農業経済', quota: 40, applicantsConfirmed: 8, testTakersConfirmed: 7, finalPassers: 8 },
    { schoolName: '山川', department: '生活情報', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '頴娃', department: '普通', quota: 40, applicantsConfirmed: 6, testTakersConfirmed: 5, finalPassers: 6 },
    { schoolName: '頴娃', department: '機械電気', quota: 39, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    { schoolName: '枕崎', department: '総合学科', quota: 67, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '鹿児島水産', department: '海洋', quota: 36, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 36 },
    { schoolName: '鹿児島水産', department: '情報通信', quota: 36, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 33 },
    { schoolName: '鹿児島水産', department: '食品工学', quota: 39, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 16 },
    { schoolName: '加世田', department: '普通', quota: 114, applicantsConfirmed: 103, testTakersConfirmed: 100, finalPassers: 100 },
    { schoolName: '加世田常潤', department: '食農プロデュース', quota: 38, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 11 },
    { schoolName: '加世田常潤', department: '生活福祉', quota: 38, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '川辺', department: '普通', quota: 77, applicantsConfirmed: 32, testTakersConfirmed: 31, finalPassers: 30 },
    { schoolName: '薩南工業', department: '機械', quota: 40, applicantsConfirmed: 9, testTakersConfirmed: 8, finalPassers: 5 },
    { schoolName: '薩南工業', department: '建築', quota: 39, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '薩南工業', department: '情報技術', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 13, finalPassers: 11 },
    { schoolName: '薩南工業', department: '生活科学', quota: 39, applicantsConfirmed: 31, testTakersConfirmed: 30, finalPassers: 26 },
    { schoolName: '指宿商業', department: '商業マネジメント', quota: 106, applicantsConfirmed: 95, testTakersConfirmed: 93, finalPassers: 90 },
    { schoolName: '指宿商業', department: '会計マネジメント', quota: 37, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '指宿商業', department: '情報マネジメント', quota: 38, applicantsConfirmed: 29, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '川内', department: '普通', quota: 253, applicantsConfirmed: 216, testTakersConfirmed: 208, finalPassers: 208 },
    { schoolName: '川内商工', department: '機械', quota: 107, applicantsConfirmed: 98, testTakersConfirmed: 98, finalPassers: 97 },
    { schoolName: '川内商工', department: '電気', quota: 72, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 46 },
    { schoolName: '川内商工', department: 'インテリア', quota: 33, applicantsConfirmed: 34, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '川内商工', department: '商業', quota: 68, applicantsConfirmed: 69, testTakersConfirmed: 69, finalPassers: 68 },
    { schoolName: '川薩清修館', department: 'ビジネス会計', quota: 40, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '川薩清修館', department: '総合学科', quota: 79, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '薩摩中央', department: '普通', quota: 38, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '薩摩中央', department: '生物生産', quota: 39, applicantsConfirmed: 11, testTakersConfirmed: 10, finalPassers: 9 },
    { schoolName: '薩摩中央', department: '農業工学', quota: 40, applicantsConfirmed: 24, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '薩摩中央', department: '福祉', quota: 38, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 13 },
    { schoolName: '鶴翔', department: '農業科学', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '鶴翔', department: '食品技術', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 31, finalPassers: 30 },
    { schoolName: '鶴翔', department: '総合学科', quota: 79, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '野田女子', department: '食物', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 24 },
    { schoolName: '野田女子', department: '生活文化', quota: 39, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 15 },
    { schoolName: '野田女子', department: '衛生看護', quota: 40, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
    { schoolName: '出水', department: '普通', quota: 113, applicantsConfirmed: 134, testTakersConfirmed: 132, finalPassers: 113 },
    { schoolName: '出水工業', department: '機械電気', quota: 77, applicantsConfirmed: 51, testTakersConfirmed: 50, finalPassers: 49 },
    { schoolName: '出水工業', department: '建築', quota: 39, applicantsConfirmed: 15, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '出水商業', department: '商業', quota: 80, applicantsConfirmed: 66, testTakersConfirmed: 66, finalPassers: 65 },
    { schoolName: '出水商業', department: '情報処理', quota: 79, applicantsConfirmed: 44, testTakersConfirmed: 43, finalPassers: 44 },
    { schoolName: '大口', department: '普通', quota: 75, applicantsConfirmed: 50, testTakersConfirmed: 48, finalPassers: 47 },
    { schoolName: '伊佐農林', department: '農林技術', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '伊佐農林', department: '生活情報', quota: 39, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 14 },
    { schoolName: '霧島', department: '機械', quota: 40, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 4 },
    { schoolName: '霧島', department: '総合学科', quota: 38, applicantsConfirmed: 29, testTakersConfirmed: 28, finalPassers: 22 },
    { schoolName: '蒲生', department: '普通', quota: 79, applicantsConfirmed: 35, testTakersConfirmed: 32, finalPassers: 41 },
    { schoolName: '蒲生', department: '情報処理', quota: 38, applicantsConfirmed: 34, testTakersConfirmed: 32, finalPassers: 23 },
    { schoolName: '加治木', department: '普通', quota: 295, applicantsConfirmed: 292, testTakersConfirmed: 278, finalPassers: 278 },
    { schoolName: '加治木工業', department: '機械', quota: 65, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 39 },
    { schoolName: '加治木工業', department: '電気', quota: 36, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 23 },
    { schoolName: '加治木工業', department: '電子', quota: 35, applicantsConfirmed: 40, testTakersConfirmed: 38, finalPassers: 35 },
    { schoolName: '加治木工業', department: '工業化学', quota: 37, applicantsConfirmed: 15, testTakersConfirmed: 14, finalPassers: 13 },
    { schoolName: '加治木工業', department: '建築', quota: 31, applicantsConfirmed: 26, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '加治木工業', department: '土木', quota: 30, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 14 },
    { schoolName: '隼人工業', department: 'インテリア', quota: 36, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 24 },
    { schoolName: '隼人工業', department: '電子機械', quota: 65, applicantsConfirmed: 69, testTakersConfirmed: 67, finalPassers: 65 },
    { schoolName: '隼人工業', department: '情報技術', quota: 35, applicantsConfirmed: 42, testTakersConfirmed: 39, finalPassers: 35 },
    { schoolName: '国分', department: '普通', quota: 260, applicantsConfirmed: 244, testTakersConfirmed: 242, finalPassers: 246 },
    { schoolName: '国分', department: '理数', quota: 28, applicantsConfirmed: 39, testTakersConfirmed: 32, finalPassers: 28 },
    { schoolName: '福山', department: '普通', quota: 40, applicantsConfirmed: 19, testTakersConfirmed: 17, finalPassers: 15 },
    { schoolName: '福山', department: '商業', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 15 },
    { schoolName: '国分中央', department: '園芸工学', quota: 39, applicantsConfirmed: 41, testTakersConfirmed: 39, finalPassers: 38 },
    { schoolName: '国分中央', department: '生活文化', quota: 69, applicantsConfirmed: 85, testTakersConfirmed: 82, finalPassers: 69 },
    { schoolName: '国分中央', department: 'ビジネス情報', quota: 106, applicantsConfirmed: 82, testTakersConfirmed: 78, finalPassers: 80 },
    { schoolName: '国分中央', department: 'スポーツ健康', quota: 18, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '曽於', department: '文理', quota: 40, applicantsConfirmed: 5, testTakersConfirmed: 4, finalPassers: 3 },
    { schoolName: '曽於', department: '普通', quota: 39, applicantsConfirmed: 10, testTakersConfirmed: 9, finalPassers: 8 },
    { schoolName: '曽於', department: '畜産食農', quota: 29, applicantsConfirmed: 12, testTakersConfirmed: 11, finalPassers: 9 },
    { schoolName: '曽於', department: '機械電子', quota: 37, applicantsConfirmed: 29, testTakersConfirmed: 27, finalPassers: 25 },
    { schoolName: '曽於', department: '商業', quota: 35, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 23 },
    { schoolName: '志布志', department: '普通', quota: 113, applicantsConfirmed: 87, testTakersConfirmed: 82, finalPassers: 82 },
    { schoolName: '串良商業', department: '情報処理', quota: 79, applicantsConfirmed: 37, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '串良商業', department: '総合ビジネス', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '楠隼', department: '普通', quota: 45, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '鹿屋', department: '普通', quota: 219, applicantsConfirmed: 174, testTakersConfirmed: 165, finalPassers: 166 },
    { schoolName: '鹿屋農業', department: '農業', quota: 38, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 12 },
    { schoolName: '鹿屋農業', department: '園芸', quota: 39, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 7 },
    { schoolName: '鹿屋農業', department: '畜産', quota: 38, applicantsConfirmed: 14, testTakersConfirmed: 13, finalPassers: 10 },
    { schoolName: '鹿屋農業', department: '農業機械', quota: 33, applicantsConfirmed: 19, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '鹿屋農業', department: '農林環境', quota: 39, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 5 },
    { schoolName: '鹿屋農業', department: '食と生活', quota: 38, applicantsConfirmed: 40, testTakersConfirmed: 39, finalPassers: 34 },
    { schoolName: '鹿屋工業', department: '機械', quota: 72, applicantsConfirmed: 69, testTakersConfirmed: 65, finalPassers: 68 },
    { schoolName: '鹿屋工業', department: '電気', quota: 33, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 33 },
    { schoolName: '鹿屋工業', department: '電子', quota: 34, applicantsConfirmed: 44, testTakersConfirmed: 42, finalPassers: 34 },
    { schoolName: '鹿屋工業', department: '建築', quota: 32, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '鹿屋工業', department: '土木', quota: 34, applicantsConfirmed: 24, testTakersConfirmed: 22, finalPassers: 16 },
    { schoolName: '垂水', department: '普通', quota: 39, applicantsConfirmed: 21, testTakersConfirmed: 20, finalPassers: 18 },
    { schoolName: '垂水', department: '生活デザイン', quota: 38, applicantsConfirmed: 20, testTakersConfirmed: 19, finalPassers: 21 },
    { schoolName: '南大隅', department: '商業', quota: 78, applicantsConfirmed: 15, testTakersConfirmed: 14, finalPassers: 13 },
    { schoolName: '鹿屋女子', department: '普通', quota: 37, applicantsConfirmed: 22, testTakersConfirmed: 21, finalPassers: 20 },
    { schoolName: '鹿屋女子', department: '情報ビジネス', quota: 73, applicantsConfirmed: 29, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '鹿屋女子', department: '生活科学', quota: 64, applicantsConfirmed: 57, testTakersConfirmed: 56, finalPassers: 56 },
    { schoolName: '種子島', department: '普通', quota: 80, applicantsConfirmed: 53, testTakersConfirmed: 51, finalPassers: 51 },
    { schoolName: '種子島', department: '生物生産', quota: 39, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '種子島', department: '電気', quota: 39, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '種子島中央', department: '普通', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '種子島中央', department: 'ミライデザイン', quota: 40, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 12 },
    { schoolName: '種子島中央', department: '情報処理', quota: 39, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 34 },
    { schoolName: '屋久島', department: '普通', quota: 75, applicantsConfirmed: 34, testTakersConfirmed: 33, finalPassers: 32 },
    { schoolName: '屋久島', department: '情報ビジネス', quota: 39, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 25 },
    { schoolName: '大島', department: '普通', quota: 228, applicantsConfirmed: 237, testTakersConfirmed: 237, finalPassers: 228 },
    { schoolName: '奄美', department: '機械電気', quota: 39, applicantsConfirmed: 27, testTakersConfirmed: 26, finalPassers: 24 },
    { schoolName: '奄美', department: '商業', quota: 40, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '奄美', department: '情報処理', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 29 },
    { schoolName: '奄美', department: '家政', quota: 39, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 24 },
    { schoolName: '奄美', department: '衛生看護', quota: 40, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '大島北', department: '普通', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '大島北', department: '情報処理', quota: 39, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 22 },
    { schoolName: '古仁屋', department: '普通', quota: 76, applicantsConfirmed: 31, testTakersConfirmed: 30, finalPassers: 31 },
    { schoolName: '喜界', department: '普通', quota: 29, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '喜界', department: '商業', quota: 6, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '徳之島', department: '普通', quota: 78, applicantsConfirmed: 49, testTakersConfirmed: 48, finalPassers: 48 },
    { schoolName: '徳之島', department: '総合学科', quota: 36, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 36 },
    { schoolName: '沖永良部', department: '普通', quota: 79, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '沖永良部', department: '商業', quota: 39, applicantsConfirmed: 33, testTakersConfirmed: 32, finalPassers: 31 },
    { schoolName: '与論', department: '普通', quota: 45, applicantsConfirmed: 0, testTakersConfirmed: 0, finalPassers: 0 },
  ],
};
