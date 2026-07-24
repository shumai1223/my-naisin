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
 * ⚠️2ページ目の筑紫丘・柏陵〜糸島の15校（普通科系20レコード）は、PDF自体の密集した
 * 表組みの視覚読み取りが試行のたびに異なる数値を返す（例:筑紫丘の学科別内訳が読むたびに
 * 矛盾した）という誤読シグナルが出たため、PDF読み取りを断念し、代わりに外部の学習塾
 * サイト（英進館・福岡地区記事）から学校名・学科名・募集定員・確定志願者数・志願倍率を
 * 一括で構造的に引用し、全レコードでrate=applicants/quotaの算数整合性を確認した上で採用
 * （1データ点=1出典の原則の例外だが、内部整合性チェックで裏取り済み）。
 * 福岡工業・福岡農業・糸島農業（工業/農業系のためこの塾記事の対象外）は3ページ目以降と
 * 合わせて未着手のまま次回に持ち越し。
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
      docTitle: '英進館 福岡地区 令和8年度公立高校一般入試志願者状況（新宮高校の裏取り、および筑紫丘〜糸島の15校の一括引用元）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '県立全日制（PDF1ページ目・青豊〜八幡工業の21校）',
      '県立全日制（PDF2ページ目・宗像〜糸島の27校、うち筑紫丘〜糸島15校は外部塾サイト裏取り採用）',
    ],
    pendingDepartments: [
      '県立全日制（PDF2ページ目残り・福岡工業/福岡農業/糸島農業の3校、工業/農業系のため裏取り元が見つからず未着手）',
      '県立全日制（PDF3ページ目以降、存在する場合）',
      '市組合立全日制（別PDF・未着手）',
    ],
    note: '福岡県は資料が複数ページ＋県立/市組合立の別PDFに分かれており、今回はPDF1ページ目21校＋2ページ目27校の計48校のみを高確信度で確定。県レベルの公式合計（全日制県立 定員22,200/志願者22,854/倍率1.03）との突合はまだ行っていない（残りページ未読のため）。学校単位の計行との突合、および外部裏取り値のrate整合性チェックのみ実施済み。',
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
    { schoolName: '筑紫丘', department: '普通科', quota: 400, finalApplicants: 533, finalRate: 1.33 },
    { schoolName: '筑紫丘', department: '理数科', quota: 40, finalApplicants: 106, finalRate: 2.65 },
    { schoolName: '柏陵', department: '普通科（コースを除く）', quota: 360, finalApplicants: 297, finalRate: 0.83 },
    { schoolName: '柏陵', department: '普通科環境科学コース', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '福岡中央', department: '普通科', quota: 400, finalApplicants: 428, finalRate: 1.07 },
    { schoolName: '城南', department: '普通科（コースを除く）', quota: 400, finalApplicants: 583, finalRate: 1.46 },
    { schoolName: '城南', department: '普通科理数コース', quota: 40, finalApplicants: 63, finalRate: 1.58 },
    { schoolName: '修猷館', department: '普通科', quota: 440, finalApplicants: 730, finalRate: 1.66 },
    { schoolName: '福岡講倫館', department: '総合学科', quota: 360, finalApplicants: 349, finalRate: 0.97 },
    { schoolName: '早良', department: '普通科（コースを除く）', quota: 120, finalApplicants: 80, finalRate: 0.67 },
    { schoolName: '早良', department: '普通科スポーツコミュニケーションコース', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '玄洋', department: '普通科', quota: 280, finalApplicants: 186, finalRate: 0.66 },
    { schoolName: '筑前', department: '普通科', quota: 400, finalApplicants: 404, finalRate: 1.01 },
    { schoolName: '春日', department: '普通科', quota: 440, finalApplicants: 493, finalRate: 1.12 },
    { schoolName: '太宰府', department: '普通科', quota: 240, finalApplicants: 94, finalRate: 0.39 },
    { schoolName: '太宰府', department: '芸術科', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '筑紫中央', department: '普通科', quota: 440, finalApplicants: 711, finalRate: 1.62 },
    { schoolName: '武蔵台', department: '普通科', quota: 400, finalApplicants: 365, finalRate: 0.91 },
    { schoolName: '筑紫', department: '普通科', quota: 400, finalApplicants: 372, finalRate: 0.93 },
    { schoolName: '糸島', department: '普通科', quota: 360, finalApplicants: 319, finalRate: 0.89 },
  ],
};
