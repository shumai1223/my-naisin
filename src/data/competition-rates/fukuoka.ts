/**
 * 福岡県 公立高等学校 倍率パイプラインα（Y-2・先行8県の7県目）。
 *
 * 一次ソース: 福岡県教育委員会「令和8年度県立高等学校入学者選抜 一般入試 志願者数（確定）」
 * （県立分PDF、市組合立分は別PDF）。
 *
 * ⚠️対象範囲=現時点でPDF1ページ目全27校（青豊〜遠賀）＋PDF2ページ目の30校
 * （宗像・光陵・水産・玄界・新宮・福岡魁誠・須恵・宇美商業・香住丘・香椎・香椎工業・福岡
 * ＋筑紫丘〜糸島の15校＋福岡工業/福岡農業/糸島農業）＋PDF3ページ目の21校（小郡〜浮羽工業）
 * ＋PDF4ページ目（最終ページ）10校（田川・東鷹・田川科学技術・稲築志耕館・嘉穂・嘉穂東・
 * 嘉穂総合・鞍手・直方・鞍手竜徳）のみを高い確信度で確定済み。2ページ目は宗像から始まる。
 *
 * ⚠️2026-07-25追記: PDF4ページ目が最終ページと判明した（末尾に「県立合計（90校）入学定員
 * 22,200・確定志願者数22,854・倍率1.03」という県レベルのグランドトータル行を確認・
 * これは既知のリセモム記事の数値と完全一致）。英進館「筑豊地区」記事で9校を外部裏取り、
 * 田川科学技術はこの記事に掲載が無かったがΣ子学科=計行の自己検算が完全一致したため
 * PDF読み取り値のみで採用（4学科合計170=計行170と一致）。**残る1校「筑豊」のみ、
 * 自分のPDF読み取りで学科別内訳の合計(120)と「計」行の入学定員(160)が食い違う矛盾を検出し、
 * 誤読の可能性が高いため今回は見送り、未着手のまま持ち越した**（Y-0憲法の捏造ゼロ優先）。
 * 筑豊が解決すればPDF県立分は完結し、県レベルグランドトータルとの最終突合を試みられる。
 *
 * ⚠️2026-07-25再訂正: 登録済みsourceUrl（pref.fukuoka.lg.jp/soshiki/kyouiku-somu/nyuusen.html）
 * が404化したため現在の掲載場所を再探索し、site/kyouiku/nyushi8.html配下のPDF
 * （uploaded/life/806459_62802786_misc.pdf）に同一の「確定数」表があることを確認した。
 * このPDFをReadツールでページ画像として直接閲覧した結果、**「八幡南・北筑・東筑・折尾・
 * 中間・遠賀はページ1に存在せず誤記憶」という直前の結論は誤りだったと判明**＝これら6校は
 * 実際にPDF1ページ目の八幡工業の直後に実在すると確認し、今回追加収録した。うち北筑は
 * 2回の独立した視覚読み取りで「計」の確定志願者数が235→281と食い違う誤読シグナルが出た
 * ため、外部の学習塾サイト（英進館・北九州地区記事）の学科別内訳（普通科200/235/1.18・
 * 英語科40/46/1.15）を採用した。折尾・遠賀は学科別内訳のΣが「計」行と完全一致することを
 * 自己検算で確認できたためPDF読み取り値をそのまま採用（遠賀は英進館記事でも同値を確認）。
 * 八幡南・東筑・中間は単一学科（普通科のみ）のため読み違いの余地が小さく、PDF読み取り値を
 * 採用（八幡南・中間は英進館記事でも同値を確認、東筑は複数回の再読で値が安定していた）。
 * ⚠️2026-07-25追記: PDF3ページ目（小郡〜朝倉光陽、21校）は英進館「筑後地区」記事で
 * 16校29レコードを外部裏取りできた（全レコードでΣ子学科=計行の自己検算も完全一致）。
 * 残る5校（久留米筑水・八女工業・八女農業・浮羽工業・三池工業）は当初この記事に掲載が
 * 無いと誤認したが、実際には「実業高校」記事（福岡工業等と同一記事）が福岡地区限定ではなく
 * 県内実業高校を横断的に収録しており、この5校も含まれていたと判明＝再探索で全15レコードを
 * 裏取りできた（PDF3ページ目が完結）。八女農業のみ記事側が4学科を「農業系4科」として
 * 集計済みの単一値のみ提供していたため、学科別分解はせず学校単位1レコードとして記録
 * （小倉商業・水産と同型パターン）。また同記事に「南筑（久留米市立）」の記載があったが、
 * これは市組合立分PDFの管轄であり本ファイル（県立分）には含めない
 * （次回の市組合立PDF転記時に活用予定）。
 *
 * ⚠️2ページ目の筑紫丘・柏陵〜糸島の15校（普通科系20レコード）は、PDF自体の密集した
 * 表組みの視覚読み取りが試行のたびに異なる数値を返す（例:筑紫丘の学科別内訳が読むたびに
 * 矛盾した）という誤読シグナルが出たため、PDF読み取りを断念し、代わりに外部の学習塾
 * サイト（英進館・福岡地区記事）から学校名・学科名・募集定員・確定志願者数・志願倍率を
 * 一括で構造的に引用し、全レコードでrate=applicants/quotaの算数整合性を確認した上で採用
 * （1データ点=1出典の原則の例外だが、内部整合性チェックで裏取り済み）。
 * 福岡工業・福岡農業・糸島農業は、当初は福岡地区記事の対象外だったが、英進館の
 * 「実業高校」専用記事（高校別に学科別定員/確定志願者数/倍率が明記）を発見し全16レコードを
 * 引用した。事前のPDF視覚読み取り（1回のみ）ではこの3校のうち複数レコード（機械工学科37→35・
 * 染織デザイン科45→41・建築科60→45等）が実業高校記事の値と食い違っており、桁の近い数字への
 * 誤読が実際に起きていたことをこの独立記事との突合で検出できた＝PDF読み取り値は採用せず
 * 実業高校記事の値のみを正とする。
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
      url: 'https://www.pref.fukuoka.lg.jp/site/kyouiku/nyushi8.html',
      docTitle: '福岡県教育委員会 令和8年度公立高等学校一般入試志願状況（県立分PDF: uploaded/life/806459_62802786_misc.pdf）※旧URL(soshiki/kyouiku-somu/nyuusen.html)は2026-07-25時点で404のため付け替え',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.eishinkan.net/entrance/high_admissions/7927/',
      docTitle: '英進館 北九州地区 令和8年度公立高校一般入試志願者状況（北九州高校・八幡南/北筑/東筑/中間/遠賀の学科別内訳の裏取りに使用）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.eishinkan.net/entrance/high_admissions/7920/',
      docTitle: '英進館 福岡地区 令和8年度公立高校一般入試志願者状況（新宮高校の裏取り、および筑紫丘〜糸島の15校の一括引用元）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.eishinkan.net/entrance/high_admissions/7942/',
      docTitle: '英進館 実業高校 令和8年度公立高校一般入試志願者状況（福岡工業/福岡農業/糸島農業＋久留米筑水/三池工業/八女工業/八女農業/浮羽工業の学科別内訳の一括引用元・県内実業高校を横断収録）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.eishinkan.net/entrance/high_admissions/7932/',
      docTitle: '英進館 筑後地区 令和8年度公立高校一般入試志願者状況（PDF3ページ目・小郡/三井/明善/久留米/八女/福島/伝習館/山門/三潴/大川樟風/三池/ありあけ新世/朝倉/朝倉東/朝倉光陽/浮羽究真館の一括引用元）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.eishinkan.net/entrance/high_admissions/7937/',
      docTitle: '英進館 筑豊地区 令和8年度公立高校一般入試志願者状況（PDF4ページ目・田川/東鷹/嘉穂/嘉穂東/嘉穂総合/鞍手/直方/稲築志耕館/鞍手竜徳の一括引用元）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '県立全日制（PDF1ページ目・青豊〜遠賀の27校）',
      '県立全日制（PDF2ページ目・宗像〜糸島の30校=宗像〜福岡魁誠等の12校+筑紫丘〜糸島の15校(外部塾サイト裏取り)+福岡工業/福岡農業/糸島農業の3校(外部塾サイト裏取り)）',
      '県立全日制（PDF3ページ目・小郡〜浮羽工業の21校、全て英進館筑後地区/実業高校記事で裏取り済み＝PDF3ページ目完結）',
      '県立全日制（PDF4ページ目=最終ページ・田川〜鞍手竜徳の10校。うち9校は英進館筑豊地区記事で外部裏取り、田川科学技術はΣ子学科=計行の自己検算で採用）',
    ],
    pendingDepartments: [
      '県立全日制（PDF4ページ目残り・筑豊の1校。自己読み取りで学科別内訳合計(120)と「計」行の入学定員(160)が食い違う矛盾を検出し、外部裏取り元も見つからず未着手）',
      '市組合立全日制（別PDF・uploaded/life/806459_62802784_misc.pdf・未着手。南筑（久留米市立）はこちらに含まれる見込み）',
    ],
    note: '福岡県は資料が複数ページ＋県立/市組合立の別PDFに分かれており、今回はPDF1〜4ページ目のうち88校のみを高確信度で確定。PDF4ページ目末尾に県立合計行（90校・定員22,200・確定志願者22,854・倍率1.03）を確認済み＝これはリセモム記事の数値と完全一致し、PDF県立分はこの4ページで全てであることが判明した。残る筑豊1校が解決すればPDF県立分が完結し、このグランドトータルとの最終突合を試みられる（現時点では88校のみでの部分突合はしていない）。',
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
    { label: '北筑 計', quota: 240, finalApplicants: 281, finalRate: 1.17 },
    { label: '折尾 計', quota: 160, finalApplicants: 169, finalRate: 1.06 },
    { label: '小郡 計', quota: 280, finalApplicants: 299, finalRate: 1.07 },
    { label: '三井 計', quota: 160, finalApplicants: 136, finalRate: 0.85 },
    { label: '明善 計', quota: 320, finalApplicants: 417, finalRate: 1.3 },
    { label: '久留米 計', quota: 240, finalApplicants: 278, finalRate: 1.16 },
    { label: '福島 計', quota: 160, finalApplicants: 134, finalRate: 0.84 },
    { label: '山門 計', quota: 160, finalApplicants: 148, finalRate: 0.93 },
    { label: '三潴 計', quota: 120, finalApplicants: 67, finalRate: 0.56 },
    { label: '大川樟風 計', quota: 120, finalApplicants: 85, finalRate: 0.71 },
    { label: '朝倉東 計', quota: 160, finalApplicants: 137, finalRate: 0.86 },
    { label: '朝倉光陽 計', quota: 120, finalApplicants: 105, finalRate: 0.88 },
    { label: '東鷹 計', quota: 160, finalApplicants: 135, finalRate: 0.84 },
    { label: '嘉穂 計', quota: 320, finalApplicants: 317, finalRate: 0.99 },
    { label: '嘉穂東 計', quota: 240, finalApplicants: 223, finalRate: 0.93 },
    { label: '嘉穂総合 計', quota: 160, finalApplicants: 161, finalRate: 1.01 },
    { label: '鞍手 計', quota: 240, finalApplicants: 212, finalRate: 0.88 },
    { label: '直方 計', quota: 200, finalApplicants: 173, finalRate: 0.87 },
    { label: '田川科学技術 計', quota: 200, finalApplicants: 170, finalRate: 0.85 },
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
    { schoolName: '八幡南', department: '普通科', quota: 240, finalApplicants: 269, finalRate: 1.12 },
    { schoolName: '北筑', department: '普通科', quota: 200, finalApplicants: 235, finalRate: 1.18 },
    { schoolName: '北筑', department: '英語科', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '東筑', department: '普通科', quota: 280, finalApplicants: 374, finalRate: 1.34 },
    { schoolName: '折尾', department: '総合ビジネス科', quota: 80, finalApplicants: 83, finalRate: 1.04 },
    { schoolName: '折尾', department: '生活デザイン科', quota: 80, finalApplicants: 86, finalRate: 1.08 },
    { schoolName: '中間', department: '普通科', quota: 200, finalApplicants: 201, finalRate: 1.01 },
    { schoolName: '遠賀', department: '普通科・情報科学コース・情報ビジネスコース・生活創造コース（くくり募集）', quota: 120, finalApplicants: 64, finalRate: 0.53 },
    { schoolName: '遠賀', department: '農業食品科', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '福岡工業', department: '工業進学科', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '福岡工業', department: '機械工学科', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '福岡工業', department: '電子情報工学科', quota: 80, finalApplicants: 71, finalRate: 0.89 },
    { schoolName: '福岡工業', department: '電気工学科', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '福岡工業', department: '環境化学科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '福岡工業', department: '染織デザイン科', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '福岡工業', department: '建築科', quota: 40, finalApplicants: 60, finalRate: 1.5 },
    { schoolName: '福岡工業', department: '都市工学科', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '福岡農業', department: '都市園芸科', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '福岡農業', department: '環境活用科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '福岡農業', department: '食品科学科', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '福岡農業', department: '生活デザイン科', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '糸島農業', department: '園芸技術科', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '糸島農業', department: '動植物活用科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '糸島農業', department: '食品科学科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '糸島農業', department: '生活科学科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '小郡', department: '普通科（コースを除く）', quota: 240, finalApplicants: 259, finalRate: 1.08 },
    { schoolName: '小郡', department: '普通科みらい創造コース', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '三井', department: '普通科（コースを除く）', quota: 80, finalApplicants: 66, finalRate: 0.83 },
    { schoolName: '三井', department: '福祉教養コース', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '三井', department: 'スポーツ健康コース', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '明善', department: '普通科（コースを除く）', quota: 240, finalApplicants: 263, finalRate: 1.1 },
    { schoolName: '明善', department: '普通科総合文科コース', quota: 40, finalApplicants: 63, finalRate: 1.58 },
    { schoolName: '明善', department: '理数科', quota: 40, finalApplicants: 91, finalRate: 2.28 },
    { schoolName: '久留米', department: '普通科', quota: 200, finalApplicants: 227, finalRate: 1.14 },
    { schoolName: '久留米', department: '英語科', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '八女', department: '普通科', quota: 240, finalApplicants: 243, finalRate: 1.01 },
    { schoolName: '福島', department: '普通科', quota: 80, finalApplicants: 62, finalRate: 0.78 },
    { schoolName: '福島', department: '総合ビジネス科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '福島', department: '生活デザイン科', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '伝習館', department: '普通科', quota: 200, finalApplicants: 257, finalRate: 1.29 },
    { schoolName: '山門', department: '普通科（コースを除く）', quota: 140, finalApplicants: 141, finalRate: 1.01 },
    { schoolName: '山門', department: '普通科理数探究コース', quota: 20, finalApplicants: 7, finalRate: 0.35 },
    { schoolName: '三潴', department: '普通科（コースを除く）', quota: 80, finalApplicants: 28, finalRate: 0.35 },
    { schoolName: '三潴', department: '普通科スポーツ文化コース', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '大川樟風', department: '普通科文理コース', quota: 80, finalApplicants: 60, finalRate: 0.75 },
    { schoolName: '大川樟風', department: '住環境システム科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '三池', department: '普通科', quota: 200, finalApplicants: 192, finalRate: 0.96 },
    { schoolName: 'ありあけ新世', department: '総合学科', quota: 160, finalApplicants: 153, finalRate: 0.96 },
    { schoolName: '朝倉', department: '普通科', quota: 240, finalApplicants: 232, finalRate: 0.97 },
    { schoolName: '朝倉東', department: '普通科', quota: 80, finalApplicants: 66, finalRate: 0.83 },
    { schoolName: '朝倉東', department: 'ビジネス科', quota: 80, finalApplicants: 71, finalRate: 0.89 },
    { schoolName: '朝倉光陽', department: '普通科', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '朝倉光陽', department: '食農科学科', quota: 80, finalApplicants: 73, finalRate: 0.91 },
    { schoolName: '浮羽究真館', department: '普通科総合コース', quota: 160, finalApplicants: 96, finalRate: 0.6 },
    { schoolName: '久留米筑水', department: '園芸技術科等（くくり募集）', quota: 80, finalApplicants: 113, finalRate: 1.41 },
    { schoolName: '久留米筑水', department: '社会福祉科', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '久留米筑水', department: '食物調理科', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '三池工業', department: '電気科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '三池工業', department: '電子機械科・情報電子科', quota: 80, finalApplicants: 88, finalRate: 1.1 },
    { schoolName: '三池工業', department: '土木科・工業化学科', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '八女工業', department: '電子機械科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '八女工業', department: 'IT自動車科', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '八女工業', department: '電気科', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '八女工業', department: '情報技術科', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '八女工業', department: '工業化学科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '八女工業', department: '土木科', quota: 40, finalApplicants: 53, finalRate: 1.33 },
    { schoolName: '八女農業', department: '農業系4科（くくり募集）', quota: 120, finalApplicants: 102, finalRate: 0.85 },
    { schoolName: '浮羽工業', department: '建築系', quota: 80, finalApplicants: 53, finalRate: 0.66 },
    { schoolName: '浮羽工業', department: '機械・電気系', quota: 80, finalApplicants: 76, finalRate: 0.95 },
    { schoolName: '田川', department: '普通科', quota: 200, finalApplicants: 162, finalRate: 0.81 },
    { schoolName: '東鷹', department: '普通科総合コース', quota: 120, finalApplicants: 103, finalRate: 0.86 },
    { schoolName: '東鷹', department: '総合生活科', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '嘉穂', department: '普通科（コースを除く）', quota: 240, finalApplicants: 234, finalRate: 0.98 },
    { schoolName: '嘉穂', department: '普通科武道・日本文化コース', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '嘉穂', department: '理数科', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: '嘉穂東', department: '普通科', quota: 200, finalApplicants: 192, finalRate: 0.96 },
    { schoolName: '嘉穂東', department: '英語科', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '嘉穂総合', department: '普通科総合コース', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '嘉穂総合', department: '農業食品科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '嘉穂総合', department: '工業科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '嘉穂総合', department: '情報科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '鞍手', department: '普通科（コースを除く）', quota: 160, finalApplicants: 143, finalRate: 0.89 },
    { schoolName: '鞍手', department: '普通科人間文科コース', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '鞍手', department: '理数科', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '直方', department: '普通科（コースを除く）', quota: 160, finalApplicants: 135, finalRate: 0.84 },
    { schoolName: '直方', department: '普通科スポーツ科学コース', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '稲築志耕館', department: '総合学科', quota: 200, finalApplicants: 144, finalRate: 0.72 },
    { schoolName: '鞍手竜徳', department: '総合学科', quota: 160, finalApplicants: 111, finalRate: 0.69 },
    { schoolName: '田川科学技術', department: '農業食品科', quota: 80, finalApplicants: 71, finalRate: 0.89 },
    { schoolName: '田川科学技術', department: '工業システム科機械電気コース', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '田川科学技術', department: '工業システム科建築土木コース', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '田川科学技術', department: 'ビジネス科学科', quota: 40, finalApplicants: 30, finalRate: 0.75 },
  ],
};
