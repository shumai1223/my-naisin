/**
 * 栃木県 公立高等学校 倍率パイプラインα（Y-6・8県目・全日制完全達成）。
 *
 * 一次ソース: 栃木県教育委員会「令和8（2026）年度県立高等学校入学者選抜一般選抜出願変更状況
 * （全日制課程）」（2月25日変更後確定値・全3ページ）。
 *
 * ⚠️栃木県は同じ発表単元に複数のPDFが存在する（①出願状況(2/19時点) ②出願変更状況(2/25変更後) ③
 * 出願・合格状況）。③は「合格倍率」という別定義（受検者数と合格者数の比率）の列を持ち、他県で
 * 採用している「志願倍率（出願人員／一般選抜定員）」とは異なる指標のため使用しない。本ファイルは
 * ②の変更後確定値（出願倍率＝出願人員／一般選抜定員、PDFに記載の計算式と一致）を採用した。
 *
 * ⚠️栃木県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山と同型の高信頼度技法）。
 *
 * ⚠️罠: 「一般選抜定員」＝募集定員－特色選抜内定者数－Ａ海外特別選抜内定者数が基本式だが、宇都宮東・
 * 佐野・矢板東の3校のみ「－内部進学による内定者数」が追加控除される特例がある（PDF備考に明記）。
 * 独自計算はせず、PDFに印字された一般選抜定員の値をそのまま採用した。宇都宮東は特色選抜＋Ａ海外の
 * みで定員が充足し一般選抜定員＝0（一般入学者選抜非実施）のため、レコードとして採用しない（quota>0
 * の不変条件を維持・岡山県御津高校キャリアデザイン科と同型パターン）。
 *
 * 機械集計（quota7,259・applicants7,602・倍率1.05、57校107レコード）が、PDF末尾の合計行
 * （募集定員10,405・特色選抜内定者数2,854・Ａ海外内定者数25・一般選抜定員7,259・変更後出願人員
 * 7,602・出願倍率1.05）と完全一致した（初回転記で一致・再修正なし）。定時制課程は他県と同じ理由で
 * スコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const TOCHIGI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'tochigi',
  sources: [
    {
      url: 'https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippansenbatsusyutsuganhenkojokyo.pdf',
      docTitle: '栃木県教育委員会 令和8（2026）年度県立高等学校入学者選抜一般選抜出願変更状況（全日制課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制県立（57校107レコード。一般入学者選抜非実施の宇都宮東は対象外）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note: 'PDF末尾の合計行（quota7,259・applicants7,602・倍率1.05）と機械集計が完全一致した。',
  },
  officialSubtotals: [{ label: '全日制計', schoolCount: 57, quota: 7259, finalApplicants: 7602, finalRate: 1.05 }],
  records: [
    { schoolName: '宇都宮', department: '普通', quota: 255, finalApplicants: 308, finalRate: 1.21 },
    { schoolName: '宇都宮南', department: '普通', quota: 185, finalApplicants: 217, finalRate: 1.17 },
    { schoolName: '宇都宮北', department: '普通', quota: 270, finalApplicants: 420, finalRate: 1.56 },
    { schoolName: '宇都宮清陵', department: '普通', quota: 128, finalApplicants: 128, finalRate: 1.0 },
    { schoolName: '宇都宮女子', department: '普通', quota: 250, finalApplicants: 299, finalRate: 1.2 },
    { schoolName: '宇都宮中央', department: '普通', quota: 203, finalApplicants: 326, finalRate: 1.61 },
    { schoolName: '宇都宮中央', department: '総合家庭', quota: 31, finalApplicants: 34, finalRate: 1.1 },
    { schoolName: '宇都宮白楊', department: '農業経営', quota: 27, finalApplicants: 47, finalRate: 1.74 },
    { schoolName: '宇都宮白楊', department: '生物工学', quota: 28, finalApplicants: 37, finalRate: 1.32 },
    { schoolName: '宇都宮白楊', department: '食品科学', quota: 26, finalApplicants: 59, finalRate: 2.27 },
    { schoolName: '宇都宮白楊', department: '農業工学', quota: 28, finalApplicants: 45, finalRate: 1.61 },
    { schoolName: '宇都宮白楊', department: '情報技術', quota: 26, finalApplicants: 41, finalRate: 1.58 },
    { schoolName: '宇都宮白楊', department: '流通経済', quota: 26, finalApplicants: 53, finalRate: 2.04 },
    { schoolName: '宇都宮白楊', department: '服飾デザイン', quota: 26, finalApplicants: 37, finalRate: 1.42 },
    { schoolName: '宇都宮工業', department: '機械システム', quota: 78, finalApplicants: 103, finalRate: 1.32 },
    { schoolName: '宇都宮工業', department: '電気情報システム', quota: 52, finalApplicants: 58, finalRate: 1.12 },
    { schoolName: '宇都宮工業', department: '建築デザイン', quota: 26, finalApplicants: 36, finalRate: 1.38 },
    { schoolName: '宇都宮工業', department: '環境建設システム', quota: 52, finalApplicants: 80, finalRate: 1.54 },
    { schoolName: '宇都宮商業', department: '商業', quota: 128, finalApplicants: 169, finalRate: 1.32 },
    { schoolName: '宇都宮商業', department: '情報処理', quota: 55, finalApplicants: 58, finalRate: 1.05 },
    { schoolName: '鹿沼', department: '普通', quota: 150, finalApplicants: 184, finalRate: 1.23 },
    { schoolName: '鹿沼東', department: '普通', quota: 104, finalApplicants: 116, finalRate: 1.12 },
    { schoolName: '鹿沼南', department: '食料生産', quota: 29, finalApplicants: 26, finalRate: 0.9 },
    { schoolName: '鹿沼南', department: '環境緑地', quota: 31, finalApplicants: 23, finalRate: 0.74 },
    { schoolName: '鹿沼南', department: 'ライフデザイン', quota: 27, finalApplicants: 29, finalRate: 1.07 },
    { schoolName: '鹿沼商工', department: '情報科学', quota: 30, finalApplicants: 39, finalRate: 1.3 },
    { schoolName: '鹿沼商工', department: '商業', quota: 52, finalApplicants: 52, finalRate: 1.0 },
    { schoolName: '今市', department: '総合学科', quota: 105, finalApplicants: 98, finalRate: 0.93 },
    { schoolName: '今市工業', department: '機械', quota: 31, finalApplicants: 18, finalRate: 0.58 },
    { schoolName: '今市工業', department: '電気', quota: 35, finalApplicants: 9, finalRate: 0.26 },
    { schoolName: '今市工業', department: '建設工学', quota: 35, finalApplicants: 3, finalRate: 0.09 },
    { schoolName: '日光明峰', department: '普通', quota: 60, finalApplicants: 23, finalRate: 0.38 },
    { schoolName: '上三川', department: '普通', quota: 120, finalApplicants: 117, finalRate: 0.98 },
    { schoolName: '石橋', department: '普通', quota: 179, finalApplicants: 254, finalRate: 1.42 },
    { schoolName: '小山', department: '普通', quota: 90, finalApplicants: 97, finalRate: 1.08 },
    { schoolName: '小山', department: '数理科学', quota: 30, finalApplicants: 33, finalRate: 1.1 },
    { schoolName: '小山南', department: '普通', quota: 58, finalApplicants: 57, finalRate: 0.98 },
    { schoolName: '小山南', department: 'スポーツ', quota: 36, finalApplicants: 41, finalRate: 1.14 },
    { schoolName: '小山西', department: '普通', quota: 150, finalApplicants: 169, finalRate: 1.13 },
    { schoolName: '小山北桜', department: '食料環境', quota: 26, finalApplicants: 21, finalRate: 0.81 },
    { schoolName: '小山北桜', department: '建築システム', quota: 28, finalApplicants: 24, finalRate: 0.86 },
    { schoolName: '小山北桜', department: '総合ビジネス', quota: 29, finalApplicants: 27, finalRate: 0.93 },
    { schoolName: '小山北桜', department: '生活文化', quota: 26, finalApplicants: 36, finalRate: 1.38 },
    { schoolName: '小山城南', department: '総合学科', quota: 129, finalApplicants: 171, finalRate: 1.33 },
    { schoolName: '栃木', department: '普通', quota: 180, finalApplicants: 168, finalRate: 0.93 },
    { schoolName: '栃木女子', department: '普通', quota: 180, finalApplicants: 187, finalRate: 1.04 },
    { schoolName: '栃木農業', department: '農業科学', quota: 26, finalApplicants: 30, finalRate: 1.15 },
    { schoolName: '栃木農業', department: '食品科学', quota: 26, finalApplicants: 28, finalRate: 1.08 },
    { schoolName: '栃木工業', department: '機械', quota: 26, finalApplicants: 35, finalRate: 1.35 },
    { schoolName: '栃木工業', department: '電気', quota: 26, finalApplicants: 31, finalRate: 1.19 },
    { schoolName: '栃木工業', department: '電子情報', quota: 26, finalApplicants: 23, finalRate: 0.88 },
    { schoolName: '栃木商業', department: '商業', quota: 52, finalApplicants: 47, finalRate: 0.9 },
    { schoolName: '栃木商業', department: '情報処理', quota: 29, finalApplicants: 26, finalRate: 0.9 },
    { schoolName: '栃木翔南', department: '普通', quota: 150, finalApplicants: 166, finalRate: 1.11 },
    { schoolName: '壬生', department: '普通', quota: 114, finalApplicants: 105, finalRate: 0.92 },
    { schoolName: '佐野', department: '普通', quota: 45, finalApplicants: 26, finalRate: 0.58 },
    { schoolName: '佐野東', department: '普通', quota: 160, finalApplicants: 154, finalRate: 0.96 },
    { schoolName: '佐野松桜', department: '情報制御', quota: 26, finalApplicants: 35, finalRate: 1.35 },
    { schoolName: '佐野松桜', department: '商業', quota: 26, finalApplicants: 27, finalRate: 1.04 },
    { schoolName: '佐野松桜', department: '家政', quota: 26, finalApplicants: 26, finalRate: 1.0 },
    { schoolName: '佐野松桜', department: '介護福祉', quota: 20, finalApplicants: 16, finalRate: 0.8 },
    { schoolName: '足利', department: '普通', quota: 179, finalApplicants: 215, finalRate: 1.2 },
    { schoolName: '足利南', department: '総合学科', quota: 114, finalApplicants: 72, finalRate: 0.63 },
    { schoolName: '足利工業', department: '機械', quota: 56, finalApplicants: 33, finalRate: 0.59 },
    { schoolName: '足利工業', department: '電気システム', quota: 35, finalApplicants: 12, finalRate: 0.34 },
    { schoolName: '足利工業', department: '産業デザイン', quota: 27, finalApplicants: 20, finalRate: 0.74 },
    { schoolName: '足利清風', department: '普通', quota: 52, finalApplicants: 45, finalRate: 0.87 },
    { schoolName: '足利清風', department: '商業', quota: 52, finalApplicants: 36, finalRate: 0.69 },
    { schoolName: '真岡', department: '普通', quota: 130, finalApplicants: 141, finalRate: 1.08 },
    { schoolName: '真岡女子', department: '普通', quota: 150, finalApplicants: 119, finalRate: 0.79 },
    { schoolName: '真岡北陵', department: '生物生産', quota: 27, finalApplicants: 18, finalRate: 0.67 },
    { schoolName: '真岡北陵', department: '農業機械', quota: 30, finalApplicants: 17, finalRate: 0.57 },
    { schoolName: '真岡北陵', department: '食品科学', quota: 26, finalApplicants: 12, finalRate: 0.46 },
    { schoolName: '真岡北陵', department: '総合ビジネス', quota: 13, finalApplicants: 5, finalRate: 0.38 },
    { schoolName: '真岡北陵', department: '介護福祉', quota: 13, finalApplicants: 5, finalRate: 0.38 },
    { schoolName: '真岡工業', department: '機械システム', quota: 26, finalApplicants: 26, finalRate: 1.0 },
    { schoolName: '真岡工業', department: '建設', quota: 26, finalApplicants: 22, finalRate: 0.85 },
    { schoolName: '真岡工業', department: '電子', quota: 29, finalApplicants: 16, finalRate: 0.55 },
    { schoolName: '益子芳星', department: '普通', quota: 78, finalApplicants: 47, finalRate: 0.6 },
    { schoolName: '茂木', department: '総合学科', quota: 104, finalApplicants: 104, finalRate: 1.0 },
    { schoolName: '烏山', department: '普通', quota: 104, finalApplicants: 84, finalRate: 0.81 },
    { schoolName: '馬頭', department: '普通', quota: 36, finalApplicants: 15, finalRate: 0.42 },
    { schoolName: '馬頭', department: '水産', quota: 17, finalApplicants: 14, finalRate: 0.82 },
    { schoolName: '大田原', department: '普通', quota: 150, finalApplicants: 147, finalRate: 0.98 },
    { schoolName: '大田原女子', department: '普通', quota: 150, finalApplicants: 146, finalRate: 0.97 },
    { schoolName: '黒羽', department: '普通', quota: 58, finalApplicants: 54, finalRate: 0.93 },
    { schoolName: '那須拓陽', department: '普通', quota: 52, finalApplicants: 49, finalRate: 0.94 },
    { schoolName: '那須拓陽', department: '農業経営', quota: 26, finalApplicants: 23, finalRate: 0.88 },
    { schoolName: '那須拓陽', department: '生物工学', quota: 26, finalApplicants: 27, finalRate: 1.04 },
    { schoolName: '那須拓陽', department: '食品化学', quota: 26, finalApplicants: 29, finalRate: 1.12 },
    { schoolName: '那須拓陽', department: '食物文化', quota: 26, finalApplicants: 23, finalRate: 0.88 },
    { schoolName: '那須清峰', department: '機械システム', quota: 26, finalApplicants: 25, finalRate: 0.96 },
    { schoolName: '那須清峰', department: '電気情報', quota: 26, finalApplicants: 25, finalRate: 0.96 },
    { schoolName: '那須清峰', department: '建設工学', quota: 26, finalApplicants: 24, finalRate: 0.92 },
    { schoolName: '那須清峰', department: '商業', quota: 28, finalApplicants: 17, finalRate: 0.61 },
    { schoolName: '那須', department: '普通', quota: 31, finalApplicants: 19, finalRate: 0.61 },
    { schoolName: '那須', department: 'リゾート観光', quota: 27, finalApplicants: 13, finalRate: 0.48 },
    { schoolName: '黒磯', department: '普通', quota: 104, finalApplicants: 104, finalRate: 1.0 },
    { schoolName: '黒磯南', department: '総合学科', quota: 104, finalApplicants: 110, finalRate: 1.06 },
    { schoolName: '矢板', department: '農業経営', quota: 26, finalApplicants: 22, finalRate: 0.85 },
    { schoolName: '矢板', department: '工業システム', quota: 28, finalApplicants: 13, finalRate: 0.46 },
    { schoolName: '矢板', department: '栄養食物', quota: 26, finalApplicants: 22, finalRate: 0.85 },
    { schoolName: '矢板', department: '介護福祉', quota: 22, finalApplicants: 8, finalRate: 0.36 },
    { schoolName: '矢板東', department: '普通', quota: 69, finalApplicants: 66, finalRate: 0.96 },
    { schoolName: '高根沢', department: '普通', quota: 56, finalApplicants: 22, finalRate: 0.39 },
    { schoolName: '高根沢', department: '商業', quota: 64, finalApplicants: 25, finalRate: 0.39 },
    { schoolName: 'さくら清修', department: '総合学科', quota: 130, finalApplicants: 159, finalRate: 1.22 },
  ],
};
