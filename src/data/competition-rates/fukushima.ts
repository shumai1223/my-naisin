/**
 * 福島県 県立高等学校 倍率パイプラインα（Y-6・保留県からの再挑戦で完全達成）。
 *
 * 一次ソース: 福島県教育委員会「令和８年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後）」
 * （令和8年3月19日公表・全日制2ページ）。
 *
 * ⚠️過去のセッションで「画像スキャンPDF（テキスト層なし）で低解像度・特色選抜/連携型選抜の内訳が
 * 前期選抜・後期選抜の多段ヘッダー構造で並記される」として保留していたが、実際には300dpiで
 * pdftoppmレンダリングすると罫線・数字とも極めて明瞭で、低解像度という過去の判定は誤りだった
 * （おそらく過去セッションはより低いdpi設定で試して断念した）。福島県は前期選抜（他県の特色選抜相当）
 * と後期選抜（他県の一般選抜相当）の完全2段階制で、後期選抜のみを対象とすれば他県と同型の
 * 「募集人員・確定志願者数」の単純な2列抽出で済み、複雑な逆算は不要だった。
 *
 * 列構成: 学校No/学校名/大学科名/小学科名/募集定員（＝入学定員、前期選抜控除前）/
 * **後期選抜募集定員**（＝募集定員－前期選抜内定者数、資料に直接印字済み＝quota）/
 * 志願者数[願書提出後（一次）/**出願先変更後**（＝志願変更後の確定値＝finalApplicants）]/
 * 後期選抜合格者/後期選抜後空き定員。倍率は資料に印字が無いため自前算出
 * （finalRate=finalApplicants/quota、小数第2位に四捨五入）。
 *
 * 機械集計（quota1,686・applicants106、50校99レコード）が「全日制　合計」行
 * （後期選抜募集定員1,686・願書提出後(一次)110・出願先変更後106）と完全一致した
 * （画像から直接転記した「願書提出後(一次)」列の機械集計も110と完全一致し、二重検証済み）。
 * 前期選抜・連携型選抜は他県の特色選抜と同じ理由でスコープ外。定時制課程も他県の定時制と
 * 同じ理由でスコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const FUKUSHIMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'fukushima',
  sources: [
    {
      url: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/735188.pdf',
      docTitle: '福島県教育委員会 令和８年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-26',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程・後期選抜（50校99レコード）'],
    pendingDepartments: [
      '前期選抜・連携型選抜（他県の特色選抜と同じ理由でスコープ外）',
      '定時制課程（他県の定時制と同じ理由でスコープ外）',
    ],
    note:
      '「全日制 合計」行（後期選抜募集定員1,686・願書提出後(一次)110・出願先変更後106）と機械集計が' +
      '完全一致した（quota/finalApplicantsとも一致・願書提出後(一次)列の合計110も独立に一致し二重検証）。' +
      '倍率は資料に印字が無いため自前算出（applicants/quotaの四捨五入）。',
  },
  officialSubtotals: [{ label: '全日制 合計', schoolCount: 50, quota: 1686, finalApplicants: 106 }],
  records: [
    { schoolName: '福島明成', department: '環境土木科', quota: 22, finalApplicants: 0, finalRate: 0 },
    { schoolName: '福島明成', department: '食品科学科', quota: 8, finalApplicants: 0, finalRate: 0 },
    { schoolName: '福島明成', department: '生産情報科', quota: 12, finalApplicants: 0, finalRate: 0 },
    { schoolName: '福島工業', department: '機械科', quota: 1, finalApplicants: 0, finalRate: 0 },
    { schoolName: '福島工業', department: '情報電子科', quota: 20, finalApplicants: 1, finalRate: 0.05 },
    { schoolName: '福島工業', department: '建築科', quota: 8, finalApplicants: 2, finalRate: 0.25 },
    { schoolName: '福島工業', department: '環境化学科', quota: 10, finalApplicants: 0, finalRate: 0 },
    { schoolName: '福島西', department: 'デザイン科学科', quota: 4, finalApplicants: 0, finalRate: 0 },
    { schoolName: '福島北', department: '総合学科', quota: 42, finalApplicants: 3, finalRate: 0.07 },
    { schoolName: '福島南', department: '情報会計科', quota: 2, finalApplicants: 0, finalRate: 0 },
    { schoolName: '川俣', department: '普通科', quota: 16, finalApplicants: 0, finalRate: 0 },
    { schoolName: '伊達', department: '普通科', quota: 87, finalApplicants: 2, finalRate: 0.02 },
    { schoolName: '安達', department: '普通科', quota: 60, finalApplicants: 10, finalRate: 0.17 },
    { schoolName: '二本松実業', department: '機械システム科', quota: 13, finalApplicants: 0, finalRate: 0 },
    { schoolName: '二本松実業', department: '情報システム科', quota: 17, finalApplicants: 0, finalRate: 0 },
    { schoolName: '二本松実業', department: '都市システム科', quota: 15, finalApplicants: 0, finalRate: 0 },
    { schoolName: '二本松実業', department: '生活文化科', quota: 11, finalApplicants: 0, finalRate: 0 },
    { schoolName: '本宮', department: '普通科', quota: 16, finalApplicants: 0, finalRate: 0 },
    { schoolName: '本宮', department: '情報会計科', quota: 23, finalApplicants: 0, finalRate: 0 },
    { schoolName: '郡山北工業', department: '機械科', quota: 14, finalApplicants: 1, finalRate: 0.07 },
    { schoolName: '郡山北工業', department: '電気科', quota: 5, finalApplicants: 0, finalRate: 0 },
    { schoolName: '郡山北工業', department: '電子科', quota: 5, finalApplicants: 0, finalRate: 0 },
    { schoolName: '郡山北工業', department: '化学工学科', quota: 10, finalApplicants: 2, finalRate: 0.2 },
    { schoolName: 'あさか開成', department: '国際科学科', quota: 13, finalApplicants: 4, finalRate: 0.31 },
    { schoolName: '湖南', department: '普通科', quota: 24, finalApplicants: 0, finalRate: 0 },
    { schoolName: '須賀川創英館', department: '普通科', quota: 79, finalApplicants: 3, finalRate: 0.04 },
    { schoolName: '須賀川桐陽', department: '数理科学科', quota: 18, finalApplicants: 2, finalRate: 0.11 },
    { schoolName: '清陵情報', department: '情報電子科', quota: 16, finalApplicants: 0, finalRate: 0 },
    { schoolName: '清陵情報', department: '電子機械科', quota: 13, finalApplicants: 1, finalRate: 0.08 },
    { schoolName: '清陵情報', department: '情報処理科', quota: 16, finalApplicants: 2, finalRate: 0.13 },
    { schoolName: '清陵情報', department: '情報会計科', quota: 14, finalApplicants: 2, finalRate: 0.14 },
    { schoolName: '岩瀬農業', department: 'ヒューマンサービス科', quota: 5, finalApplicants: 0, finalRate: 0 },
    { schoolName: '岩瀬農業', department: '生物生産科', quota: 11, finalApplicants: 0, finalRate: 0 },
    { schoolName: '岩瀬農業', department: '園芸科学科', quota: 23, finalApplicants: 0, finalRate: 0 },
    { schoolName: '岩瀬農業', department: '環境工学科', quota: 23, finalApplicants: 1, finalRate: 0.04 },
    { schoolName: '岩瀬農業', department: 'アグリビジネス科', quota: 16, finalApplicants: 0, finalRate: 0 },
    { schoolName: '光南', department: '総合学科', quota: 16, finalApplicants: 4, finalRate: 0.25 },
    { schoolName: '白河', department: '理数科', quota: 13, finalApplicants: 0, finalRate: 0 },
    { schoolName: '白河実業', department: '機械科', quota: 4, finalApplicants: 0, finalRate: 0 },
    { schoolName: '白河実業', department: '電気科', quota: 2, finalApplicants: 0, finalRate: 0 },
    { schoolName: '白河実業', department: '電子科', quota: 12, finalApplicants: 0, finalRate: 0 },
    { schoolName: '白河実業', department: '情報ビジネス科', quota: 4, finalApplicants: 0, finalRate: 0 },
    { schoolName: '修明', department: '文理探究科', quota: 34, finalApplicants: 5, finalRate: 0.15 },
    { schoolName: '修明', department: '食品科学科', quota: 4, finalApplicants: 0, finalRate: 0 },
    { schoolName: '修明', department: '地域資源科', quota: 29, finalApplicants: 0, finalRate: 0 },
    { schoolName: '修明', department: '情報ビジネス科', quota: 15, finalApplicants: 0, finalRate: 0 },
    { schoolName: '石川', department: '普通科', quota: 10, finalApplicants: 0, finalRate: 0 },
    { schoolName: '田村', department: '普通科', quota: 23, finalApplicants: 2, finalRate: 0.09 },
    { schoolName: 'あぶくま柏鵬', department: '総合学科', quota: 81, finalApplicants: 1, finalRate: 0.01 },
    { schoolName: '会津工業', department: '建築インテリア科', quota: 2, finalApplicants: 0, finalRate: 0 },
    { schoolName: '喜多方', department: '普通科', quota: 36, finalApplicants: 5, finalRate: 0.14 },
    { schoolName: '喜多方桐桜', department: '電気・電子科', quota: 16, finalApplicants: 1, finalRate: 0.06 },
    { schoolName: '喜多方桐桜', department: '建設科', quota: 21, finalApplicants: 4, finalRate: 0.19 },
    { schoolName: '喜多方桐桜', department: '経営マネジメント科', quota: 10, finalApplicants: 0, finalRate: 0 },
    { schoolName: '猪苗代', department: '普通科', quota: 10, finalApplicants: 1, finalRate: 0.1 },
    { schoolName: '西会津', department: '普通科', quota: 26, finalApplicants: 0, finalRate: 0 },
    { schoolName: '会津西陵', department: '普通科', quota: 11, finalApplicants: 1, finalRate: 0.09 },
    { schoolName: '川口', department: '普通科', quota: 15, finalApplicants: 0, finalRate: 0 },
    { schoolName: '会津農林', department: '生産科学科', quota: 21, finalApplicants: 2, finalRate: 0.1 },
    { schoolName: '会津農林', department: '環境科学科', quota: 21, finalApplicants: 1, finalRate: 0.05 },
    { schoolName: '会津農林', department: '食品科学科', quota: 2, finalApplicants: 1, finalRate: 0.5 },
    { schoolName: '会津農林', department: '地域創生科', quota: 21, finalApplicants: 0, finalRate: 0 },
    { schoolName: '南会津', department: '総合学科', quota: 29, finalApplicants: 2, finalRate: 0.07 },
    { schoolName: '只見', department: '普通科', quota: 19, finalApplicants: 0, finalRate: 0 },
    { schoolName: '磐城', department: '普通科', quota: 10, finalApplicants: 0, finalRate: 0 },
    { schoolName: '平工業', department: '機械工学科', quota: 14, finalApplicants: 0, finalRate: 0 },
    { schoolName: '平工業', department: '電気工学科', quota: 3, finalApplicants: 0, finalRate: 0 },
    { schoolName: '平工業', department: '制御工学科', quota: 16, finalApplicants: 0, finalRate: 0 },
    { schoolName: '平工業', department: '情報工学科', quota: 14, finalApplicants: 0, finalRate: 0 },
    { schoolName: 'いわき商業情報', department: '流通ビジネス科', quota: 19, finalApplicants: 1, finalRate: 0.05 },
    { schoolName: 'いわき商業情報', department: '情報ビジネス科', quota: 21, finalApplicants: 0, finalRate: 0 },
    { schoolName: 'いわき商業情報', department: '会計ビジネス科', quota: 13, finalApplicants: 0, finalRate: 0 },
    { schoolName: 'いわき商業情報', department: 'IT科', quota: 18, finalApplicants: 0, finalRate: 0 },
    { schoolName: 'いわき総合', department: '総合学科', quota: 24, finalApplicants: 4, finalRate: 0.17 },
    { schoolName: 'いわき光洋', department: '文理科', quota: 23, finalApplicants: 6, finalRate: 0.26 },
    { schoolName: 'いわき湯本', department: '普通科', quota: 31, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '小名浜海星', department: '普通科', quota: 11, finalApplicants: 1, finalRate: 0.09 },
    { schoolName: '小名浜海星', department: '商業科', quota: 33, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '小名浜海星', department: '情報通信科', quota: 5, finalApplicants: 0, finalRate: 0 },
    { schoolName: '小名浜海星', department: '海洋工学科', quota: 20, finalApplicants: 8, finalRate: 0.4 },
    { schoolName: '磐城農業', department: '園芸科', quota: 5, finalApplicants: 0, finalRate: 0 },
    { schoolName: '磐城農業', department: '緑地土木科', quota: 7, finalApplicants: 0, finalRate: 0 },
    { schoolName: '磐城農業', department: '生活科学科', quota: 2, finalApplicants: 0, finalRate: 0 },
    { schoolName: '勿来', department: '普通科', quota: 15, finalApplicants: 4, finalRate: 0.27 },
    { schoolName: '勿来工業', department: '電気科', quota: 6, finalApplicants: 0, finalRate: 0 },
    { schoolName: '勿来工業', department: '建築科', quota: 5, finalApplicants: 1, finalRate: 0.2 },
    { schoolName: '勿来工業', department: '工業化学科', quota: 2, finalApplicants: 0, finalRate: 0 },
    { schoolName: 'ふたば未来学園', department: '総合学科', quota: 9, finalApplicants: 0, finalRate: 0 },
    { schoolName: '相馬', department: '理数科', quota: 13, finalApplicants: 0, finalRate: 0 },
    { schoolName: '相馬総合', department: '総合学科', quota: 8, finalApplicants: 8, finalRate: 1.0 },
    { schoolName: '原町', department: '普通科', quota: 29, finalApplicants: 3, finalRate: 0.1 },
    { schoolName: '相馬農業', department: '生産環境科', quota: 20, finalApplicants: 0, finalRate: 0 },
    { schoolName: '相馬農業', department: '環境緑地科', quota: 29, finalApplicants: 0, finalRate: 0 },
    { schoolName: '相馬農業', department: '食品科学科', quota: 3, finalApplicants: 0, finalRate: 0 },
    { schoolName: '小高産業技術', department: '機械科', quota: 13, finalApplicants: 1, finalRate: 0.08 },
    { schoolName: '小高産業技術', department: '電気科', quota: 15, finalApplicants: 0, finalRate: 0 },
    {
      schoolName: '小高産業技術',
      department: '産業革新科(環境化学コース)',
      quota: 15,
      finalApplicants: 0,
      finalRate: 0,
    },
    {
      schoolName: '小高産業技術',
      department: '産業革新科(電子制御コース)',
      quota: 10,
      finalApplicants: 0,
      finalRate: 0,
    },
    {
      schoolName: '小高産業技術',
      department: '産業革新科(ビジネスパイオニアコース)',
      quota: 6,
      finalApplicants: 1,
      finalRate: 0.17,
    },
  ],
};
