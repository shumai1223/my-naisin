/**
 * 三重県 公立高等学校 倍率パイプラインα（Y-6・12県目・全日制完全達成）。
 *
 * 一次ソース: 三重県教育委員会「令和8年度三重県立高等学校後期選抜志願状況（最終）」
 * （3月5日公表・全5ページ）。
 *
 * ⚠️三重県は前期選抜・後期選抜の2段階制。前期選抜は特色選抜的な小規模枠であり、後期選抜が
 * 他県の「一般選抜」に相当する主要選抜（全日制課程の大半の入学者を占める）と判断し、後期選抜の
 * 志願状況を一次ソースとして採用した（福島県も同型の前期/後期制だが、前期選抜自体の規模比率が
 * 大きく複雑なため見送り、三重県を優先した）。
 *
 * ⚠️三重県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木・群馬・長野・茨城と同型の高信頼度技法）。
 *
 * ⚠️構造上の強み: 列は[入学定員 / 前期選抜等合格内定者数（前期選抜で既に決定済みの人数） /
 * 後期選抜募集人数（＝入学定員－前期内定者数＝本ファイルのquota） / 志願者数（＝applicants） /
 * 志願倍率]。さらに各校の末尾に「学校計」行が付随し、自己集計との突合チェックポイントとして機能
 * する（他県にはあまり見られない高信頼度設計）。前期選抜のみで定員が充足した学科（後期募集人数
 * =0）は他県の0-quotaパターンと同型でレコードとして採用しない（昴学園は学校全体が該当し記録なし）。
 *
 * ⚠️罠（くくり募集）: 複数学科・コースが後期選抜募集人数を共有する「くくり募集」が存在する
 * （桑名工業の機械＋材料技術・電気＋電子、四日市西の比較文化歴史＋数理情報、四日市農芸の
 * 農業科学＋食品科学＋環境造園、久居農林の2組、伊賀白鳳の2組）。連結学科名の単一レコードとして
 * 記録する（他県のくくり募集と同型パターン）。
 *
 * 機械集計（quota6,419・applicants6,636・倍率1.03、52校108レコード）が全日制総計と完全一致した
 * （PDF3ページ目・末尾の総計行と一致・全52校の学校計行とも個別に完全一致）。定時制課程は他県と
 * 同じ理由でスコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const MIE_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'mie',
  sources: [
    {
      url: 'https://www.pref.mie.lg.jp/common/content/001243656.pdf',
      docTitle: '三重県教育委員会 令和8年度三重県立高等学校後期選抜志願状況（最終）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程（PDF1〜3ページ目・52校108レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note:
      '全日制総計（quota6,419・applicants6,636・倍率1.03）と機械集計が完全一致した。全52校の学科別' +
      '内訳合計もPDF記載の「学校計」行と個別に完全一致している。',
  },
  officialSubtotals: [{ label: '全日制総計', schoolCount: 52, quota: 6419, finalApplicants: 6636, finalRate: 1.03 }],
  records: [
    { schoolName: '桑名', department: '普通', quota: 240, finalApplicants: 253, finalRate: 1.05 },
    { schoolName: '桑名', department: '理数', quota: 40, finalApplicants: 101, finalRate: 2.53 },
    { schoolName: '桑名西', department: '普通', quota: 240, finalApplicants: 271, finalRate: 1.13 },
    { schoolName: '桑名北', department: '普通', quota: 107, finalApplicants: 62, finalRate: 0.58 },
    { schoolName: '桑名工業', department: '機械・材料技術（くくり募集）', quota: 36, finalApplicants: 37, finalRate: 1.03 },
    { schoolName: '桑名工業', department: '電気・電子（くくり募集）', quota: 36, finalApplicants: 23, finalRate: 0.64 },
    { schoolName: 'いなべ総合学園', department: '総合学科', quota: 132, finalApplicants: 148, finalRate: 1.12 },
    { schoolName: '四日市', department: '普通', quota: 240, finalApplicants: 174, finalRate: 0.73 },
    { schoolName: '四日市', department: '国際科学コース', quota: 80, finalApplicants: 204, finalRate: 2.55 },
    { schoolName: '四日市南', department: '普通', quota: 240, finalApplicants: 208, finalRate: 0.87 },
    { schoolName: '四日市南', department: '数理科学コース', quota: 80, finalApplicants: 203, finalRate: 2.54 },
    { schoolName: '四日市西', department: '普通', quota: 120, finalApplicants: 87, finalRate: 0.73 },
    { schoolName: '四日市西', department: '比較文化・歴史・数理情報（くくり募集）', quota: 60, finalApplicants: 73, finalRate: 1.22 },
    { schoolName: '朝明', department: '普通', quota: 36, finalApplicants: 42, finalRate: 1.17 },
    { schoolName: '朝明', department: 'ふくし', quota: 28, finalApplicants: 4, finalRate: 0.14 },
    { schoolName: '四日市四郷', department: '普通', quota: 80, finalApplicants: 85, finalRate: 1.06 },
    { schoolName: '四日市工業', department: '機械', quota: 18, finalApplicants: 19, finalRate: 1.06 },
    { schoolName: '四日市工業', department: '電子機械', quota: 18, finalApplicants: 29, finalRate: 1.61 },
    { schoolName: '四日市工業', department: '電気', quota: 18, finalApplicants: 22, finalRate: 1.22 },
    { schoolName: '四日市工業', department: '電子工学', quota: 18, finalApplicants: 26, finalRate: 1.44 },
    { schoolName: '四日市工業', department: '建築', quota: 18, finalApplicants: 21, finalRate: 1.17 },
    { schoolName: '四日市工業', department: '物質工学', quota: 18, finalApplicants: 23, finalRate: 1.28 },
    { schoolName: '四日市工業', department: '自動車', quota: 18, finalApplicants: 17, finalRate: 0.94 },
    { schoolName: '四日市中央工業', department: '機械', quota: 18, finalApplicants: 20, finalRate: 1.11 },
    { schoolName: '四日市中央工業', department: '電気', quota: 18, finalApplicants: 20, finalRate: 1.11 },
    { schoolName: '四日市中央工業', department: '化学工学', quota: 18, finalApplicants: 20, finalRate: 1.11 },
    { schoolName: '四日市中央工業', department: '都市工学', quota: 18, finalApplicants: 22, finalRate: 1.22 },
    { schoolName: '四日市中央工業', department: '設備システム', quota: 18, finalApplicants: 14, finalRate: 0.78 },
    { schoolName: '四日市商業', department: '商業', quota: 92, finalApplicants: 87, finalRate: 0.95 },
    { schoolName: '四日市商業', department: '情報マネジメント', quota: 18, finalApplicants: 12, finalRate: 0.67 },
    { schoolName: '四日市農芸', department: '農業科学・食品科学・環境造園（くくり募集）', quota: 54, finalApplicants: 50, finalRate: 0.93 },
    { schoolName: '四日市農芸', department: '生活文化', quota: 36, finalApplicants: 55, finalRate: 1.53 },
    { schoolName: '菰野', department: '普通', quota: 107, finalApplicants: 103, finalRate: 0.96 },
    { schoolName: '川越', department: '探究', quota: 200, finalApplicants: 211, finalRate: 1.06 },
    { schoolName: '川越', department: '国際探究', quota: 40, finalApplicants: 91, finalRate: 2.28 },
    { schoolName: '神戸', department: '普通', quota: 200, finalApplicants: 128, finalRate: 0.64 },
    { schoolName: '神戸', department: '理数', quota: 40, finalApplicants: 114, finalRate: 2.85 },
    { schoolName: '飯野', department: '英語コミュニケーション', quota: 36, finalApplicants: 49, finalRate: 1.36 },
    { schoolName: '白子', department: '普通', quota: 107, finalApplicants: 92, finalRate: 0.86 },
    { schoolName: '白子', department: '生活創造', quota: 18, finalApplicants: 16, finalRate: 0.89 },
    { schoolName: '石薬師', department: '普通', quota: 36, finalApplicants: 32, finalRate: 0.89 },
    { schoolName: '稲生', department: '普通', quota: 80, finalApplicants: 93, finalRate: 1.16 },
    { schoolName: '亀山', department: '普通', quota: 53, finalApplicants: 40, finalRate: 0.75 },
    { schoolName: '亀山', department: 'システムメディア', quota: 36, finalApplicants: 40, finalRate: 1.11 },
    { schoolName: '亀山', department: '総合生活', quota: 18, finalApplicants: 19, finalRate: 1.06 },
    { schoolName: '津', department: '普通', quota: 320, finalApplicants: 376, finalRate: 1.18 },
    { schoolName: '津西', department: '普通', quota: 240, finalApplicants: 181, finalRate: 0.75 },
    { schoolName: '津西', department: '国際科学', quota: 40, finalApplicants: 131, finalRate: 3.28 },
    { schoolName: '津商業', department: 'ビジネス', quota: 92, finalApplicants: 93, finalRate: 1.01 },
    { schoolName: '津商業', department: '情報システム', quota: 18, finalApplicants: 13, finalRate: 0.72 },
    { schoolName: '津東', department: '普通', quota: 178, finalApplicants: 201, finalRate: 1.13 },
    { schoolName: '津工業', department: '機械', quota: 54, finalApplicants: 55, finalRate: 1.02 },
    { schoolName: '津工業', department: '電気', quota: 18, finalApplicants: 16, finalRate: 0.89 },
    { schoolName: '津工業', department: '電子', quota: 18, finalApplicants: 20, finalRate: 1.11 },
    { schoolName: '津工業', department: '建設工学', quota: 18, finalApplicants: 16, finalRate: 0.89 },
    { schoolName: '久居', department: '普通', quota: 107, finalApplicants: 109, finalRate: 1.02 },
    { schoolName: '久居農林', department: '生物生産・生物資源（くくり募集）', quota: 36, finalApplicants: 25, finalRate: 0.69 },
    { schoolName: '久居農林', department: '環境情報・環境土木（くくり募集）', quota: 36, finalApplicants: 27, finalRate: 0.75 },
    { schoolName: '久居農林', department: '生活デザイン', quota: 36, finalApplicants: 34, finalRate: 0.94 },
    { schoolName: '白山', department: '普通', quota: 18, finalApplicants: 10, finalRate: 0.56 },
    { schoolName: '白山', department: '情報コミュニケーション', quota: 23, finalApplicants: 6, finalRate: 0.26 },
    { schoolName: '上野', department: '学際探究', quota: 112, finalApplicants: 119, finalRate: 1.06 },
    { schoolName: '上野', department: '理数', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: 'あけぼの学園', department: '総合学科', quota: 18, finalApplicants: 16, finalRate: 0.89 },
    { schoolName: '伊賀白鳳', department: '機械・電子機械・建築デザイン（くくり募集）', quota: 48, finalApplicants: 37, finalRate: 0.77 },
    { schoolName: '伊賀白鳳', department: '生物資源・フードシステム（くくり募集）', quota: 30, finalApplicants: 34, finalRate: 1.13 },
    { schoolName: '伊賀白鳳', department: '経営', quota: 15, finalApplicants: 7, finalRate: 0.47 },
    { schoolName: '伊賀白鳳', department: 'ヒューマンサービス', quota: 15, finalApplicants: 12, finalRate: 0.8 },
    { schoolName: '名張', department: '総合学科', quota: 92, finalApplicants: 113, finalRate: 1.23 },
    { schoolName: '名張青峰', department: '普通', quota: 107, finalApplicants: 99, finalRate: 0.93 },
    { schoolName: '名張青峰', department: '文理探究コース', quota: 20, finalApplicants: 22, finalRate: 1.1 },
    { schoolName: '松阪', department: '普通', quota: 200, finalApplicants: 162, finalRate: 0.81 },
    { schoolName: '松阪', department: '理数', quota: 39, finalApplicants: 98, finalRate: 2.51 },
    { schoolName: '松阪工業', department: '機械', quota: 18, finalApplicants: 19, finalRate: 1.06 },
    { schoolName: '松阪工業', department: '電気工学', quota: 18, finalApplicants: 26, finalRate: 1.44 },
    { schoolName: '松阪工業', department: '工業化学', quota: 18, finalApplicants: 23, finalRate: 1.28 },
    { schoolName: '松阪工業', department: '自動車', quota: 18, finalApplicants: 17, finalRate: 0.94 },
    { schoolName: '松阪商業', department: '総合ビジネス', quota: 54, finalApplicants: 51, finalRate: 0.94 },
    { schoolName: '松阪商業', department: '国際ビジネス', quota: 18, finalApplicants: 20, finalRate: 1.11 },
    { schoolName: '飯南', department: '総合学科', quota: 22, finalApplicants: 4, finalRate: 0.18 },
    { schoolName: '相可', department: '普通', quota: 53, finalApplicants: 43, finalRate: 0.81 },
    { schoolName: '相可', department: '生産経済', quota: 18, finalApplicants: 19, finalRate: 1.06 },
    { schoolName: '相可', department: '環境創造', quota: 18, finalApplicants: 19, finalRate: 1.06 },
    { schoolName: '明野', department: '生産科学', quota: 18, finalApplicants: 22, finalRate: 1.22 },
    { schoolName: '明野', department: '食品科学', quota: 18, finalApplicants: 9, finalRate: 0.5 },
    { schoolName: '明野', department: '生活教養', quota: 18, finalApplicants: 13, finalRate: 0.72 },
    { schoolName: '明野', department: '福祉', quota: 18, finalApplicants: 10, finalRate: 0.56 },
    { schoolName: '宇治山田', department: '普通', quota: 107, finalApplicants: 110, finalRate: 1.03 },
    { schoolName: '伊勢', department: '普通', quota: 240, finalApplicants: 201, finalRate: 0.84 },
    { schoolName: '伊勢', department: '国際科学コース', quota: 40, finalApplicants: 65, finalRate: 1.63 },
    { schoolName: '宇治山田商業', department: '商業', quota: 36, finalApplicants: 51, finalRate: 1.42 },
    { schoolName: '宇治山田商業', department: '情報処理', quota: 18, finalApplicants: 22, finalRate: 1.22 },
    { schoolName: '宇治山田商業', department: '国際', quota: 18, finalApplicants: 27, finalRate: 1.5 },
    { schoolName: '伊勢工業', department: '機械', quota: 36, finalApplicants: 32, finalRate: 0.89 },
    { schoolName: '伊勢工業', department: '電気', quota: 18, finalApplicants: 19, finalRate: 1.06 },
    { schoolName: '伊勢工業', department: '建築', quota: 18, finalApplicants: 10, finalRate: 0.56 },
    { schoolName: '南伊勢（度会校舎）', department: '普通', quota: 35, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '鳥羽', department: '総合学科', quota: 18, finalApplicants: 9, finalRate: 0.5 },
    { schoolName: '志摩', department: '普通', quota: 18, finalApplicants: 2, finalRate: 0.11 },
    { schoolName: '水産', department: '海洋・機関', quota: 18, finalApplicants: 17, finalRate: 0.94 },
    { schoolName: '水産', department: '水産資源', quota: 20, finalApplicants: 2, finalRate: 0.1 },
    { schoolName: '尾鷲', department: '普通', quota: 47, finalApplicants: 42, finalRate: 0.89 },
    { schoolName: '尾鷲', department: 'プログレッシブコース', quota: 21, finalApplicants: 5, finalRate: 0.24 },
    { schoolName: '尾鷲', department: '情報ビジネス', quota: 20, finalApplicants: 15, finalRate: 0.75 },
    { schoolName: '尾鷲', department: 'システム工学', quota: 21, finalApplicants: 12, finalRate: 0.57 },
    { schoolName: '熊野青藍（木本校舎）', department: '普通', quota: 120, finalApplicants: 105, finalRate: 0.88 },
    { schoolName: '熊野青藍（木本校舎）', department: '総合学科', quota: 26, finalApplicants: 28, finalRate: 1.08 },
    { schoolName: '熊野青藍（紀南校舎）', department: '総合学科', quota: 27, finalApplicants: 27, finalRate: 1.0 },
  ],
};
