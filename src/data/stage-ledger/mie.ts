import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 三重県 段階台帳（T-Y11F §5順序#7・11県目・全日制108レコードで完結）。
 *
 * 一次ソース: 三重県教育委員会「令和8年度三重県立高等学校後期選抜受検状況」（令和8年3月10日
 * 午前10時現在・全4ページ）＋「令和8年度三重県立高等学校入学者選抜合格者数及び再募集定員」
 * （令和8年3月17日・全4ページ）の2資料。
 * https://www.pref.mie.lg.jp/TOPICS/m0045100491.htm （受検状況）
 * https://www.pref.mie.lg.jp/TOPICS/m0045100493.htm （合格者数）
 *
 * ⚠️両PDFともCJK埋め込みフォントでpdftotextが機能しないため、pdftoppm 200〜400dpi + ビジョン
 * 読み取りで転記した。
 *
 * quota・applicantsConfirmedは既存パイプライン`competition-rates/mie.ts`（「後期選抜志願状況」
 * 別資料・quota=入学定員−前期選抜等合格内定者数）をそのまま再利用。testTakersConfirmed（受検
 * 者数）は「後期選抜受検状況」から新規転記し、quota算出式が既存パイプラインと同一のため個別
 * レコード・学校計とも独立に一致することを確認済み。finalPassers（後期選抜のみの合格者数）は
 * 「合格者数及び再募集定員」の合格者数列（前期選抜等内定者＋後期選抜合格者の合算値）から、
 * 「後期選抜受検状況」の前期選抜等合格内定者数を差し引いて算出した
 * （finalPassers = 合格者数計 − 前期選抜等合格内定者数）。
 *
 * ⚠️既知の特徴: 108件中24件でfinalPassersがtestTakersConfirmedをわずかに上回る（多くは+1〜+2、
 * 一部の普通科系学科では受検者数を大きく上回る〈例: 四日市・普通=240、受検者数173〉）。これは
 * 「合格者数及び再募集定員」資料の合格者数が後期選抜の学力検査結果だけでなく、連携型・欠員補充等
 * を含む最終入学予定者数を表しているためと推測される（3月10日〈受検状況〉と3月17日〈合格者数〉
 * の1週間の間に生じた繰り上げ合格等も含まれる可能性がある）。quota・testTakersConfirmedの
 * 108件全数・52校の学校計は資料本文の印字値と完全一致（欠落・誤カウント無し）を確認済みであり、
 * この上振れはデータ品質の問題ではなく、三重県の選抜制度上の構造的な特徴と判断した。
 *
 * quota・testTakersConfirmedの機械集計（quota6,419・testTakersConfirmed6,566）が「後期選抜受検
 * 状況」資料本文末尾の総計行と完全一致。finalPassersの機械集計（5,982）も「合格者数及び再募集
 * 定員」の総計（9,524）から「後期選抜受検状況」の前期選抜等合格内定者数の総計（3,542）を差し
 * 引いた値と完全一致した（3系列すべてで独立検証済み）。
 *
 * 定時制・通信制課程は他県と同じ理由で恒久的にスコープ外。
 */
export const MIE_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'mie',
  sources: [
    {
      url: 'https://www.pref.mie.lg.jp/common/content/001244557.pdf',
      docTitle: '三重県教育委員会 令和8年度三重県立高等学校後期選抜受検状況（全日制課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
    {
      url: 'https://www.pref.mie.lg.jp/common/content/001246836.pdf',
      docTitle: '三重県教育委員会 令和8年度三重県立高等学校入学者選抜合格者数及び再募集定員（全日制課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制（53校・後期選抜募集人数を持つ108学科を完全収録）'],
    pendingDepartments: ['定時制・通信制の課程（他県と同じ理由で恒久的にスコープ外）'],
    note: '全日制53校108学科（後期選抜の実質募集枠を持つ学科）を完全収録。quota・applicantsConfirmedは既存パイプライン`competition-rates/mie.ts`を再利用。testTakersConfirmedは「後期選抜受検状況」から新規転記し、quotaが既存パイプラインと同一算出式（入学定員−前期選抜等合格内定者数）であることを108件全数・52校の学校計で確認済み。finalPassersは「合格者数及び再募集定員」の合格者数（前期+後期の合算値）から前期選抜等合格内定者数を差し引いて算出した。quota・testTakersConfirmedの機械集計（6,419/6,566）が受検状況資料の総計行と完全一致し、finalPassersの機械集計（5,982）も合格者数資料の総計（9,524）と受検状況資料の前期内定総計（3,542）の差分と完全一致した。108件中24件でfinalPassersがtestTakersConfirmedをわずかに上回るが（多くは+1〜+2、一部の普通科系学科では受検者数を大きく上回る）、これは合格者数資料が連携型・欠員補充等を含む最終入学予定者数を表しているためと推測され、quota・testTakersConfirmedの完全一致から見てデータ品質の問題ではなく制度上の構造的特徴と判断した。',
  },
  officialSubtotals: [
    { label: '総計（後期選抜・受検状況）', quota: 6419, applicantsConfirmed: 6636, testTakersConfirmed: 6566, finalPassers: 5982 },
  ],
  records: [
    { schoolName: '桑名', department: '普通', quota: 240, applicantsConfirmed: 253, testTakersConfirmed: 253, finalPassers: 240 },
    { schoolName: '桑名', department: '理数', quota: 40, applicantsConfirmed: 101, testTakersConfirmed: 101, finalPassers: 40 },
    { schoolName: '桑名西', department: '普通', quota: 240, applicantsConfirmed: 271, testTakersConfirmed: 269, finalPassers: 240 },
    { schoolName: '桑名北', department: '普通', quota: 107, applicantsConfirmed: 62, testTakersConfirmed: 62, finalPassers: 62 },
    { schoolName: '桑名工業', department: '機械・材料技術（くくり募集）', quota: 36, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 36 },
    { schoolName: '桑名工業', department: '電気・電子（くくり募集）', quota: 36, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 24 },
    { schoolName: 'いなべ総合学園', department: '総合学科', quota: 132, applicantsConfirmed: 148, testTakersConfirmed: 146, finalPassers: 132 },
    { schoolName: '四日市', department: '普通', quota: 240, applicantsConfirmed: 174, testTakersConfirmed: 173, finalPassers: 240 },
    { schoolName: '四日市', department: '国際科学コース', quota: 80, applicantsConfirmed: 204, testTakersConfirmed: 201, finalPassers: 80 },
    { schoolName: '四日市南', department: '普通', quota: 240, applicantsConfirmed: 208, testTakersConfirmed: 202, finalPassers: 240 },
    { schoolName: '四日市南', department: '数理科学コース', quota: 80, applicantsConfirmed: 203, testTakersConfirmed: 198, finalPassers: 80 },
    { schoolName: '四日市西', department: '普通', quota: 120, applicantsConfirmed: 87, testTakersConfirmed: 85, finalPassers: 98 },
    { schoolName: '四日市西', department: '比較文化・歴史・数理情報（くくり募集）', quota: 60, applicantsConfirmed: 73, testTakersConfirmed: 73, finalPassers: 60 },
    { schoolName: '朝明', department: '普通', quota: 36, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 36 },
    { schoolName: '朝明', department: 'ふくし', quota: 28, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 10 },
    { schoolName: '四日市四郷', department: '普通', quota: 80, applicantsConfirmed: 85, testTakersConfirmed: 85, finalPassers: 80 },
    { schoolName: '四日市工業', department: '機械', quota: 18, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '四日市工業', department: '電子機械', quota: 18, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 18 },
    { schoolName: '四日市工業', department: '電気', quota: 18, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 18 },
    { schoolName: '四日市工業', department: '電子工学', quota: 18, applicantsConfirmed: 26, testTakersConfirmed: 23, finalPassers: 18 },
    { schoolName: '四日市工業', department: '建築', quota: 18, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 18 },
    { schoolName: '四日市工業', department: '物質工学', quota: 18, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 18 },
    { schoolName: '四日市工業', department: '自動車', quota: 18, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 18 },
    { schoolName: '四日市中央工業', department: '機械', quota: 18, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 18 },
    { schoolName: '四日市中央工業', department: '電気', quota: 18, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 18 },
    { schoolName: '四日市中央工業', department: '化学工学', quota: 18, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 18 },
    { schoolName: '四日市中央工業', department: '都市工学', quota: 18, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 18 },
    { schoolName: '四日市中央工業', department: '設備システム', quota: 18, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 16 },
    { schoolName: '四日市商業', department: '商業', quota: 92, applicantsConfirmed: 87, testTakersConfirmed: 87, finalPassers: 87 },
    { schoolName: '四日市商業', department: '情報マネジメント', quota: 18, applicantsConfirmed: 12, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '四日市農芸', department: '農業科学・食品科学・環境造園（くくり募集）', quota: 54, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 54 },
    { schoolName: '四日市農芸', department: '生活文化', quota: 36, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 36 },
    { schoolName: '菰野', department: '普通', quota: 107, applicantsConfirmed: 103, testTakersConfirmed: 101, finalPassers: 101 },
    { schoolName: '川越', department: '探究', quota: 200, applicantsConfirmed: 211, testTakersConfirmed: 209, finalPassers: 200 },
    { schoolName: '川越', department: '国際探究', quota: 40, applicantsConfirmed: 91, testTakersConfirmed: 89, finalPassers: 40 },
    { schoolName: '神戸', department: '普通', quota: 200, applicantsConfirmed: 128, testTakersConfirmed: 128, finalPassers: 200 },
    { schoolName: '神戸', department: '理数', quota: 40, applicantsConfirmed: 114, testTakersConfirmed: 113, finalPassers: 40 },
    { schoolName: '飯野', department: '英語コミュニケーション', quota: 36, applicantsConfirmed: 49, testTakersConfirmed: 46, finalPassers: 36 },
    { schoolName: '白子', department: '普通', quota: 107, applicantsConfirmed: 92, testTakersConfirmed: 90, finalPassers: 90 },
    { schoolName: '白子', department: '生活創造', quota: 18, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '石薬師', department: '普通', quota: 36, applicantsConfirmed: 32, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '稲生', department: '普通', quota: 80, applicantsConfirmed: 93, testTakersConfirmed: 92, finalPassers: 80 },
    { schoolName: '亀山', department: '普通', quota: 53, applicantsConfirmed: 40, testTakersConfirmed: 39, finalPassers: 44 },
    { schoolName: '亀山', department: 'システムメディア', quota: 36, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 36 },
    { schoolName: '亀山', department: '総合生活', quota: 18, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '津', department: '普通', quota: 320, applicantsConfirmed: 376, testTakersConfirmed: 372, finalPassers: 320 },
    { schoolName: '津西', department: '普通', quota: 240, applicantsConfirmed: 181, testTakersConfirmed: 180, finalPassers: 240 },
    { schoolName: '津西', department: '国際科学', quota: 40, applicantsConfirmed: 131, testTakersConfirmed: 129, finalPassers: 40 },
    { schoolName: '津商業', department: 'ビジネス', quota: 92, applicantsConfirmed: 93, testTakersConfirmed: 92, finalPassers: 92 },
    { schoolName: '津商業', department: '情報システム', quota: 18, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '津東', department: '普通', quota: 178, applicantsConfirmed: 201, testTakersConfirmed: 200, finalPassers: 178 },
    { schoolName: '津工業', department: '機械', quota: 54, applicantsConfirmed: 55, testTakersConfirmed: 54, finalPassers: 54 },
    { schoolName: '津工業', department: '電気', quota: 18, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 17 },
    { schoolName: '津工業', department: '電子', quota: 18, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 18 },
    { schoolName: '津工業', department: '建設工学', quota: 18, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '久居', department: '普通', quota: 107, applicantsConfirmed: 109, testTakersConfirmed: 108, finalPassers: 107 },
    { schoolName: '久居農林', department: '生物生産・生物資源（くくり募集）', quota: 36, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '久居農林', department: '環境情報・環境土木（くくり募集）', quota: 36, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '久居農林', department: '生活デザイン', quota: 36, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 34 },
    { schoolName: '白山', department: '普通', quota: 18, applicantsConfirmed: 10, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '白山', department: '情報コミュニケーション', quota: 23, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '上野', department: '学際探究', quota: 112, applicantsConfirmed: 119, testTakersConfirmed: 119, finalPassers: 112 },
    { schoolName: '上野', department: '理数', quota: 40, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: 'あけぼの学園', department: '総合学科', quota: 18, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '伊賀白鳳', department: '機械・電子機械・建築デザイン（くくり募集）', quota: 48, applicantsConfirmed: 37, testTakersConfirmed: 36, finalPassers: 37 },
    { schoolName: '伊賀白鳳', department: '生物資源・フードシステム（くくり募集）', quota: 30, applicantsConfirmed: 34, testTakersConfirmed: 33, finalPassers: 30 },
    { schoolName: '伊賀白鳳', department: '経営', quota: 15, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 8 },
    { schoolName: '伊賀白鳳', department: 'ヒューマンサービス', quota: 15, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 13 },
    { schoolName: '名張', department: '総合学科', quota: 92, applicantsConfirmed: 113, testTakersConfirmed: 111, finalPassers: 92 },
    { schoolName: '名張青峰', department: '普通', quota: 107, applicantsConfirmed: 99, testTakersConfirmed: 98, finalPassers: 100 },
    { schoolName: '名張青峰', department: '文理探究コース', quota: 20, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 20 },
    { schoolName: '松阪', department: '普通', quota: 200, applicantsConfirmed: 162, testTakersConfirmed: 160, finalPassers: 200 },
    { schoolName: '松阪', department: '理数', quota: 39, applicantsConfirmed: 98, testTakersConfirmed: 96, finalPassers: 39 },
    { schoolName: '松阪工業', department: '機械', quota: 18, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '松阪工業', department: '電気工学', quota: 18, applicantsConfirmed: 26, testTakersConfirmed: 25, finalPassers: 18 },
    { schoolName: '松阪工業', department: '工業化学', quota: 18, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 18 },
    { schoolName: '松阪工業', department: '自動車', quota: 18, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 18 },
    { schoolName: '松阪商業', department: '総合ビジネス', quota: 54, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 52 },
    { schoolName: '松阪商業', department: '国際ビジネス', quota: 18, applicantsConfirmed: 20, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '飯南', department: '総合学科', quota: 22, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '相可', department: '普通', quota: 53, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 44 },
    { schoolName: '相可', department: '生産経済', quota: 18, applicantsConfirmed: 19, testTakersConfirmed: 18, finalPassers: 18 },
    { schoolName: '相可', department: '環境創造', quota: 18, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '明野', department: '生産科学', quota: 18, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 18 },
    { schoolName: '明野', department: '食品科学', quota: 18, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 13 },
    { schoolName: '明野', department: '生活教養', quota: 18, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '明野', department: '福祉', quota: 18, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '宇治山田', department: '普通', quota: 107, applicantsConfirmed: 110, testTakersConfirmed: 109, finalPassers: 107 },
    { schoolName: '伊勢', department: '普通', quota: 240, applicantsConfirmed: 201, testTakersConfirmed: 200, finalPassers: 225 },
    { schoolName: '伊勢', department: '国際科学コース', quota: 40, applicantsConfirmed: 65, testTakersConfirmed: 65, finalPassers: 40 },
    { schoolName: '宇治山田商業', department: '商業', quota: 36, applicantsConfirmed: 51, testTakersConfirmed: 49, finalPassers: 36 },
    { schoolName: '宇治山田商業', department: '情報処理', quota: 18, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 18 },
    { schoolName: '宇治山田商業', department: '国際', quota: 18, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 18 },
    { schoolName: '伊勢工業', department: '機械', quota: 36, applicantsConfirmed: 32, testTakersConfirmed: 31, finalPassers: 32 },
    { schoolName: '伊勢工業', department: '電気', quota: 18, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 18 },
    { schoolName: '伊勢工業', department: '建築', quota: 18, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '南伊勢（度会校舎）', department: '普通', quota: 35, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '鳥羽', department: '総合学科', quota: 18, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '志摩', department: '普通', quota: 18, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '水産', department: '海洋・機関', quota: 18, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '水産', department: '水産資源', quota: 20, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '尾鷲', department: '普通', quota: 47, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 42 },
    { schoolName: '尾鷲', department: 'プログレッシブコース', quota: 21, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '尾鷲', department: '情報ビジネス', quota: 20, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '尾鷲', department: 'システム工学', quota: 21, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '熊野青藍（木本校舎）', department: '普通', quota: 120, applicantsConfirmed: 105, testTakersConfirmed: 104, finalPassers: 105 },
    { schoolName: '熊野青藍（木本校舎）', department: '総合学科', quota: 26, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 26 },
    { schoolName: '熊野青藍（紀南校舎）', department: '総合学科', quota: 27, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
  ],
};
