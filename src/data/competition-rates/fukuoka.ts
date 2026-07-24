/**
 * 福岡県 公立高等学校 倍率パイプラインα（Y-2・先行8県の7県目）。
 *
 * 一次ソース: 福岡県教育委員会「令和8年度県立高等学校入学者選抜 一般入試 志願者数（確定）」
 * （県立分PDF、市組合立分は別PDF）。
 *
 * ⚠️対象範囲=現時点でPDF1ページ目全21校（青豊〜八幡工業）＋PDF2ページ目の12校
 * （宗像・光陵・水産・玄界・新宮・福岡魁誠・須恵・宇美商業・香住丘・香椎・香椎工業・福岡）
 * のみを高い確信度で確定済み。2ページ目は宗像から始まる（事前の記憶で「八幡南・北筑・東筑・
 * 折尾・中間・遠賀」という校名を挙げていたが、再読の結果それらはページ1に存在せず誤記憶
 * だったと判明＝毎回ソースを再読する規律の重要性を裏付けた）。
 *
 * ⚠️2ページ目の筑紫丘・柏陵以降は、密集した表組みの視覚読み取りが試行のたびに異なる
 * 数値を返す（例:筑紫丘の学科別内訳が読むたびに矛盾した）ため、誤読リスクが高いと判断し
 * 意図的に未着手のまま次回に持ち越した（Y-0憲法=捏造ゼロを優先し、無理に確定させない）。
 * 3ページ目以降・市組合立分PDFも未着手。
 *
 * 北九州高校の「普通科(コースを除く)」「普通科体育コース」の2行、および新宮高校の
 * 普通科（コースを除く）／国際文化コース／理数科の3行は当初PDF読み取りで曖昧だったため、
 * 外部の学習塾サイト（英進館）の入試速報記事＋倍率=確定数/定員の算数整合性を使って
 * 確定値を裏取りした（1データ点=1出典の原則の例外的補強・数値そのものはPDF記載の
 * 学校単位「計」行の合計と完全に一致することを確認済み）。
 *
 * 水産高校は海洋科学科・食品流通科学科・アクアライフ科学科の3学科が募集定員合計160に
 * 対して志願者数が学校単位でしか読み取れなかった（くくり募集の可能性）ため、学科別に
 * 分解せず学校単位1レコードとして正直に記録。
 *
 * 複数学科を持つ学校（苅田工業・行橋・小倉工業・戸畑工業・八幡・八幡中央・八幡工業・新宮）は
 * 学科別内訳とPDF記載の学校単位「計」行の両方を記録し、Σ子学科=計行が一致することを
 * テストで検証する（学校単位の自己検算＝officialSubtotalsとして採用）。
 *
 * 定時制（全日制の外側の別課程）は東京都・神奈川県・千葉県・埼玉県と同じ理由でスコープ外。
 *
 * 参考（未使用・次回の県レベル突合用）: リセモム記事によると令和8年度確定の全日制県立
 * 合計は入学定員22,200・志願者数22,854・倍率1.03（全ページ収録後の最終DoDで使用予定）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const FUKUOKA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'fukuoka',
  sources: [
    {
      url: 'https://www.pref.fukuoka.lg.jp/soshiki/kyouiku-somu/nyuusen.html',
      docTitle: '福岡県教育委員会 令和8年度県立高等学校入学者選抜 一般入試志願者数（確定）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.eishinkan.net/entrance/high_admissions/7927/',
      docTitle: '英進館 北九州地区 令和8年度公立高校一般入試志願者状況（北九州高校の学科別内訳の裏取りに使用）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.eishinkan.net/entrance/high_admissions/7920/',
      docTitle: '英進館 福岡地区 令和8年度公立高校一般入試志願者状況（新宮高校の学科別内訳の裏取りに使用）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '県立全日制（PDF1ページ目・青豊〜八幡工業の21校）',
      '県立全日制（PDF2ページ目・宗像〜福岡の12校）',
    ],
    pendingDepartments: [
      '県立全日制（PDF2ページ目続き・筑紫丘以降〜末尾、視覚読み取りが不安定なため意図的に保留）',
      '県立全日制（PDF3ページ目以降、存在する場合）',
      '市組合立全日制（別PDF・未着手）',
    ],
    note: '福岡県は資料が複数ページ＋県立/市組合立の別PDFに分かれており、今回はPDF1ページ目21校＋2ページ目12校の計33校のみを高確信度で確定。2ページ目の筑紫丘以降は複数回の読み取り試行で数値が食い違ったため、誤読リスクを避けて意図的に未着手のまま持ち越した。県レベルの公式合計（全日制県立 定員22,200/志願者22,854/倍率1.03）との突合はまだ行っていない（残りページ未読のため）。学校単位の計行との突合のみ実施済み。',
  },
  officialSubtotals: [
    { label: '苅田工業 計', quota: 160, finalApplicants: 159, finalRate: 0.99 },
    { label: '行橋 計', quota: 200, finalApplicants: 167, finalRate: 0.84 },
    { label: '小倉工業 計', quota: 200, finalApplicants: 220, finalRate: 1.1 },
    { label: '戸畑工業 計', quota: 160, finalApplicants: 142, finalRate: 0.89 },
    { label: '八幡 計', quota: 280, finalApplicants: 295, finalRate: 1.05 },
    { label: '八幡中央 計', quota: 200, finalApplicants: 182, finalRate: 0.91 },
    { label: '八幡工業 計', quota: 200, finalApplicants: 218, finalRate: 1.09 },
    { label: '新宮 計', quota: 440, finalApplicants: 456, finalRate: 1.04 },
    { label: '香住丘 計', quota: 400, finalApplicants: 500, finalRate: 1.25 },
    { label: '香椎 計', quota: 440, finalApplicants: 603, finalRate: 1.37 },
    { label: '香椎工業 計', quota: 280, finalApplicants: 333, finalRate: 1.19 },
  ],
  records: [
    { schoolName: '青豊', department: '総合学科', quota: 280, finalApplicants: 286, finalRate: 1.02 },
    { schoolName: '築上西', department: '普通科', quota: 120, finalApplicants: 85, finalRate: 0.71 },
    { schoolName: '育徳館', department: '普通科', quota: 160, finalApplicants: 143, finalRate: 0.89 },
    { schoolName: '苅田工業', department: '電気科', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '苅田工業', department: '機械科', quota: 80, finalApplicants: 86, finalRate: 1.08 },
    { schoolName: '苅田工業', department: '情報技術科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '京都', department: '普通科', quota: 240, finalApplicants: 221, finalRate: 0.92 },
    { schoolName: '行橋', department: '農業技術科', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '行橋', department: '環境緑地科', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '行橋', department: '総合ビジネス科', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '行橋', department: '生活デザイン科', quota: 80, finalApplicants: 70, finalRate: 0.88 },
    { schoolName: '門司学園', department: '普通科', quota: 160, finalApplicants: 123, finalRate: 0.77 },
    { schoolName: '門司大翔館', department: '普通科', quota: 160, finalApplicants: 133, finalRate: 0.83 },
    { schoolName: '小倉南', department: '普通科', quota: 200, finalApplicants: 266, finalRate: 1.33 },
    { schoolName: '小倉商業', department: '商業に関する学科（くくり募集6コース）', quota: 240, finalApplicants: 291, finalRate: 1.21 },
    { schoolName: '小倉', department: '普通科', quota: 280, finalApplicants: 332, finalRate: 1.19 },
    { schoolName: '小倉工業', department: '機械系（機械科・電子機械科）', quota: 80, finalApplicants: 98, finalRate: 1.23 },
    { schoolName: '小倉工業', department: '電気系（電気科・電子科）', quota: 80, finalApplicants: 83, finalRate: 1.04 },
    { schoolName: '小倉工業', department: '化学科（工業化学科）', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '小倉西', department: '普通科', quota: 200, finalApplicants: 235, finalRate: 1.18 },
    { schoolName: '北九州', department: '普通科（コースを除く）', quota: 160, finalApplicants: 246, finalRate: 1.54 },
    { schoolName: '北九州', department: '普通科体育コース', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '戸畑', department: '普通科', quota: 160, finalApplicants: 173, finalRate: 1.08 },
    { schoolName: '戸畑工業', department: '機械・電気系（機械科・電気科）', quota: 120, finalApplicants: 103, finalRate: 0.86 },
    { schoolName: '戸畑工業', department: '建築系（建築科）', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '若松', department: '普通科', quota: 160, finalApplicants: 128, finalRate: 0.8 },
    { schoolName: '若松商業', department: '商業に関する学科（くくり募集）', quota: 160, finalApplicants: 107, finalRate: 0.67 },
    { schoolName: '八幡', department: '文理創創科', quota: 200, finalApplicants: 216, finalRate: 1.08 },
    { schoolName: '八幡', department: '理数科', quota: 80, finalApplicants: 79, finalRate: 0.99 },
    { schoolName: '八幡中央', department: '普通科（コースを除く）', quota: 160, finalApplicants: 143, finalRate: 0.89 },
    { schoolName: '八幡中央', department: '普通科芸術コース', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '八幡工業', department: '機械系（機械科・電子機械科・材料技術科）', quota: 120, finalApplicants: 131, finalRate: 1.09 },
    { schoolName: '八幡工業', department: '電気系（電気科）', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '八幡工業', department: '土木系（土木科）', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '宗像', department: '普通科', quota: 360, finalApplicants: 382, finalRate: 1.06 },
    { schoolName: '光陵', department: '普通科', quota: 400, finalApplicants: 285, finalRate: 0.71 },
    { schoolName: '水産', department: '海洋科学科・食品流通科学科・アクアライフ科学科（くくり募集）', quota: 160, finalApplicants: 180, finalRate: 1.13 },
    { schoolName: '玄界', department: '普通科', quota: 360, finalApplicants: 230, finalRate: 0.64 },
    { schoolName: '新宮', department: '普通科（コースを除く）', quota: 360, finalApplicants: 366, finalRate: 1.02 },
    { schoolName: '新宮', department: '普通科国際文化コース', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '新宮', department: '理数科', quota: 40, finalApplicants: 73, finalRate: 1.83 },
    { schoolName: '福岡魁誠', department: '総合学科', quota: 280, finalApplicants: 323, finalRate: 1.15 },
    { schoolName: '須恵', department: '総合学科', quota: 360, finalApplicants: 317, finalRate: 0.88 },
    { schoolName: '宇美商業', department: 'ビジネス探究科', quota: 200, finalApplicants: 182, finalRate: 0.91 },
    { schoolName: '香住丘', department: '普通科（コースを除く）', quota: 320, finalApplicants: 398, finalRate: 1.24 },
    { schoolName: '香住丘', department: '普通科数理データサイエンスコース', quota: 40, finalApplicants: 55, finalRate: 1.38 },
    { schoolName: '香住丘', department: '英語科', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: '香椎', department: '普通科', quota: 400, finalApplicants: 583, finalRate: 1.46 },
    { schoolName: '香椎', department: 'ファッションデザイン科', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '香椎工業', department: '電気科', quota: 80, finalApplicants: 103, finalRate: 1.29 },
    { schoolName: '香椎工業', department: '電子機械科', quota: 40, finalApplicants: 50, finalRate: 1.25 },
    { schoolName: '香椎工業', department: '工業化学科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '香椎工業', department: '機械科', quota: 80, finalApplicants: 77, finalRate: 0.96 },
    { schoolName: '香椎工業', department: '情報技術科', quota: 40, finalApplicants: 62, finalRate: 1.55 },
    { schoolName: '福岡', department: '普通科', quota: 440, finalApplicants: 631, finalRate: 1.43 },
  ],
};
