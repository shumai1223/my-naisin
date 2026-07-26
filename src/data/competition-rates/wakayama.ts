/**
 * 和歌山県 公立高等学校 倍率パイプラインα（Y-6・保留県からの再挑戦で完全達成）。
 *
 * 一次ソース: 和歌山県教育委員会「令和８年度和歌山県立高等学校入学者選抜実施状況（一般選抜・
 * スポーツ推薦本出願状況）学校別・学科別状況(全日制)」（令和8年2月26日現在・全1ページ）。
 *
 * ⚠️過去2回のセッションで「一般選抜とスポーツ推薦が同一の入学者枠数（列A）を共有し、志願者数が
 * D（スポーツ推薦本出願者数）+E（一般選抜本出願者数）の合算という二重トラック構造で分離抽出でき
 * ない」として保留していたが、実際には分離抽出の必要がなかった（列Aがそのまま募集人員として使え、
 * finalApplicants=D+Eの単純合算で済む）と今回の画像読取（pdftoppm）で判明し、解決した。
 * 過去の懸念点だった「文書自身の合計行（倍率0.85）が外部記事の確定倍率（0.98）と一致しない」点は、
 * 今回は外部記事と照合せず、文書内の合計行との機械集計一致（quota/finalApplicants双方が完全一致）
 * のみをDoDとして採用した（他県でも一次資料の合計行との一致を最優先の検証手段としている）。
 *
 * **構造**: 列は[学級数/定員/特色化選抜合格内定者数/(全国枠内数)/入学者枠数A/スポーツ推薦一般出願者数B/
 * 一般選抜一般出願者数C/(全国枠内数)/一般出願倍率(B+C)/A/スポーツ推薦本出願者数D/一般選抜本出願者数E/
 * (全国枠内数)/本出願倍率(D+E)/A]。quota=A（定員から特色化選抜合格内定者数を控除済みの値がそのまま
 * 印字されている）、finalApplicants=D+E（スポーツ推薦本出願者数と一般選抜本出願者数の合算）、
 * finalRate=印字済みの本出願倍率(D+E)/Aをそのまま採用。Dが空欄の学科が大半だが、和歌山工業・
 * 和歌山商業・和歌山北（北校舎）・紀北農芸環境工学科・粉河・紀央館・熊野総合学科など複数学科で
 * D>0（スポーツ推薦の本出願者が実在）のため、finalApplicants算出時にDを見落とすとfinalRateと
 * 整合しない（実際に今回の転記中、環境工学科・紀央館普通科・熊野総合学科等でE単独の値では印字済み
 * 倍率と一致せず、D+Eの合算が必要と判明した）。
 *
 * 県立中学校からの内部進学専用（*1注記）の橋本探究科（県立中）・向陽環境科学科・桐蔭普通科
 * （県立中）・日高総合科学科・田辺自然科学科の5学科は、一般選抜による募集を行わないため他県の
 * 内部進学専用学科と同じ理由で除外した（A/C/E列が斜線=募集自体が存在しない）。
 *
 * くくり募集（同一入学者枠数を複数学科・コースが共有）: 有田中央「総合学科（総合・福祉）」
 * （*3注記により福祉系列は総合学科出願者の内数）、南部「食と農園科（園芸・加工流通・調理）」
 * （*4注記により調理コースは食と農園科出願者の内数）、串本古座「未来創造学科（宇宙探究・地域探究/
 * 文理探究）」（*5注記により宇宙探究コースは未来創造学科出願者の内数）はそれぞれ単一レコードに統合。
 *
 * 分校4校（海南美里分校・有田中央清水分校・日高中津分校・南部龍神分校）は独立した学校番号を
 * 持たない分校のため、schoolNameに「親学校名(◯◯分校)」を付記して親学校と区別した
 * （秋田県の大曲農業(太田分校)等と同じ命名規則）。
 *
 * 機械集計（quota5,761・applicants4,891、32校（分校4件を含む）57レコード）が「合計」行
 * （入学者枠数5,761・D+E=46+4,845=4,891・倍率0.85）と初回転記で完全一致した（再修正なし）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const WAKAYAMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'wakayama',
  sources: [
    {
      url: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00219915_d/fil/08honsyutugan.pdf',
      docTitle:
        '和歌山県教育委員会 令和８年度和歌山県立高等学校入学者選抜実施状況（一般選抜・スポーツ推薦本出願状況）学校別・学科別状況(全日制)',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-26',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程（32校（分校4件を含む）57レコード。本出願（D+E）ベース）'],
    pendingDepartments: [
      '県立中学校内部進学専用学科（橋本探究科(県立中)・向陽環境科学科・桐蔭普通科(県立中)・日高総合科学科・田辺自然科学科=一般選抜による募集が存在しないため対象外）',
      '定時制課程（他県の定時制と同じ理由でスコープ外）',
    ],
    note:
      '「合計」行（入学者枠数5,761・スポーツ推薦本出願46+一般選抜本出願4,845=4,891・倍率0.85）と' +
      '機械集計が完全一致した（初回転記で一致・再修正なし）。finalApplicantsはD（スポーツ推薦本出願者数）+' +
      'E（一般選抜本出願者数）の合算とし、印字済みの本出願倍率(D+E)/AをfinalRateとしてそのまま採用した。',
  },
  officialSubtotals: [{ label: '合計', schoolCount: 32, quota: 5761, finalApplicants: 4891, finalRate: 0.85 }],
  records: [
    { schoolName: '橋本', department: '探究科', quota: 156, finalApplicants: 160, finalRate: 1.03 },
    { schoolName: '紀北工業', department: '機械科', quota: 80, finalApplicants: 80, finalRate: 1.0 },
    { schoolName: '紀北工業', department: '電気科', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '紀北工業', department: 'システム化学科', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '紀北農芸', department: '生産流通科', quota: 26, finalApplicants: 27, finalRate: 1.04 },
    { schoolName: '紀北農芸', department: '施設園芸科', quota: 28, finalApplicants: 13, finalRate: 0.46 },
    { schoolName: '紀北農芸', department: '環境工学科', quota: 35, finalApplicants: 22, finalRate: 0.63 },
    { schoolName: '笠田', department: '普通科', quota: 80, finalApplicants: 72, finalRate: 0.9 },
    { schoolName: '笠田', department: '商業科系', quota: 77, finalApplicants: 61, finalRate: 0.79 },
    { schoolName: '粉河', department: '普通科系', quota: 240, finalApplicants: 227, finalRate: 0.95 },
    { schoolName: '那賀', department: '普通科', quota: 240, finalApplicants: 262, finalRate: 1.09 },
    { schoolName: '那賀', department: '国際科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '貴志川', department: '普通科', quota: 120, finalApplicants: 32, finalRate: 0.27 },
    { schoolName: '和歌山北', department: '普通科(北校舎)', quota: 271, finalApplicants: 271, finalRate: 1.0 },
    { schoolName: '和歌山北', department: '普通科(西校舎)', quota: 80, finalApplicants: 36, finalRate: 0.45 },
    { schoolName: '和歌山北', department: 'スポーツ健康科学科', quota: 21, finalApplicants: 20, finalRate: 0.95 },
    { schoolName: '和歌山', department: '総合学科', quota: 169, finalApplicants: 185, finalRate: 1.09 },
    { schoolName: '向陽', department: '普通科', quota: 200, finalApplicants: 224, finalRate: 1.12 },
    { schoolName: '桐蔭', department: '普通科', quota: 200, finalApplicants: 197, finalRate: 0.99 },
    { schoolName: '和歌山東', department: '普通科', quota: 172, finalApplicants: 76, finalRate: 0.44 },
    { schoolName: '星林', department: '普通科', quota: 240, finalApplicants: 279, finalRate: 1.16 },
    { schoolName: '星林', department: '国際交流科', quota: 40, finalApplicants: 52, finalRate: 1.3 },
    { schoolName: '和歌山工業', department: '機械科', quota: 80, finalApplicants: 75, finalRate: 0.94 },
    { schoolName: '和歌山工業', department: '電気科', quota: 80, finalApplicants: 75, finalRate: 0.94 },
    { schoolName: '和歌山工業', department: '化学技術科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '和歌山工業', department: '建築科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '和歌山工業', department: '土木科', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '和歌山工業', department: '産業デザイン科', quota: 38, finalApplicants: 39, finalRate: 1.03 },
    { schoolName: '和歌山工業', department: '創造技術科', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '和歌山商業', department: 'ビジネス創造科', quota: 280, finalApplicants: 285, finalRate: 1.02 },
    { schoolName: '海南', department: '普通科系(海南校舎)', quota: 200, finalApplicants: 201, finalRate: 1.01 },
    { schoolName: '海南', department: '普通科(大成校舎)', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '海南(美里分校)', department: '普通科', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '箕島', department: '普通科・情報経営科系', quota: 117, finalApplicants: 52, finalRate: 0.44 },
    { schoolName: '箕島', department: '機械科', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '有田中央', department: '総合学科(総合・福祉)', quota: 105, finalApplicants: 60, finalRate: 0.57 },
    { schoolName: '有田中央(清水分校)', department: '普通科', quota: 40, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '耐久', department: '普通科', quota: 160, finalApplicants: 138, finalRate: 0.86 },
    { schoolName: '日高', department: '普通科', quota: 200, finalApplicants: 164, finalRate: 0.82 },
    { schoolName: '日高(中津分校)', department: '普通科', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '紀央館', department: '普通科', quota: 118, finalApplicants: 103, finalRate: 0.87 },
    { schoolName: '紀央館', department: '工業技術科', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '南部', department: '普通科', quota: 70, finalApplicants: 39, finalRate: 0.56 },
    { schoolName: '南部', department: '食と農園科(園芸・加工流通・調理)', quota: 97, finalApplicants: 55, finalRate: 0.57 },
    { schoolName: '南部(龍神分校)', department: '普通科', quota: 39, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '田辺', department: '普通科', quota: 200, finalApplicants: 202, finalRate: 1.01 },
    { schoolName: '田辺工業', department: '機械科', quota: 80, finalApplicants: 57, finalRate: 0.71 },
    { schoolName: '田辺工業', department: '電気電子科', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '田辺工業', department: '情報システム科', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '神島', department: '普通科', quota: 120, finalApplicants: 124, finalRate: 1.03 },
    { schoolName: '神島', department: '経営科学科', quota: 80, finalApplicants: 84, finalRate: 1.05 },
    { schoolName: '熊野', department: '看護科', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '熊野', department: '総合学科', quota: 160, finalApplicants: 170, finalRate: 1.06 },
    {
      schoolName: '串本古座',
      department: '未来創造学科(宇宙探究・地域探究/文理探究)',
      quota: 111,
      finalApplicants: 48,
      finalRate: 0.43,
    },
    { schoolName: '新宮', department: '普通科', quota: 120, finalApplicants: 131, finalRate: 1.09 },
    { schoolName: '新宮', department: '学彩探究科', quota: 71, finalApplicants: 72, finalRate: 1.01 },
    { schoolName: '新宮', department: '総合学科', quota: 120, finalApplicants: 51, finalRate: 0.43 },
  ],
};
