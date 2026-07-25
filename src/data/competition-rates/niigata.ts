/**
 * 新潟県 公立高等学校 倍率パイプラインα（Y-6・27県目・全日制完全達成）。
 *
 * 一次ソース: 新潟県教育委員会「令和8年度新潟県公立高等学校入学者選抜一般選抜志願変更後の
 * 志願状況一覧」（令和8年2月26日現在・全6ページ）。
 *
 * ⚠️新潟県のPDFはテキスト埋め込み型でpdftotextを試みたが日本語のToUnicodeマッピングが欠落しており
 * 学校名/学科名が読めなかったため、PDFをReadツールで画像として視覚的に読み取った。
 *
 * 列は[募集学級 / 一般選抜募集人数(A。＝本ファイルのquota) / 一般選抜志願者数(B。＝applicants) /
 * 倍率(B/A。＝finalRate。印字済み値をそのまま採用) / 海外帰国生徒等特別選抜志願者数]。海外帰国
 * 生徒等特別選抜の志願者数は一般選抜の志願者数・倍率の算出に含まれない（注記に明記）ため、本
 * データベースでも一般選抜分（B列）のみを採用した。
 *
 * 資料は学科系統ごとに8区分（1.普通科系学科 2.農業 3.工業 4.商業 5.水産 6.家庭 7.その他専門教育
 * 8.総合学科）に分かれて掲載され、各区分末尾に「計」行が印字される（区分ごとの内訳合計＋全日制
 * 合計の二重突合が可能）。定時制課程は他県と同じ理由でスコープ外。
 *
 * 機械集計（quota11,709・applicants11,679、73校93レコード）が「全日制 合計」行（一般選抜募集人数
 * 11,709・一般選抜志願者数11,679・倍率0.99）と初回転記で完全一致した（再修正なし）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const NIIGATA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'niigata',
  sources: [
    {
      url: 'https://kyouikucho.nein.ed.jp/koukoukyouiku/senbatu/koukou/ippan_henkogo.pdf',
      docTitle: '新潟県教育委員会 令和8年度新潟県公立高等学校入学者選抜一般選抜志願変更後の志願状況一覧',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程（8学科区分・73校93レコード）'],
    pendingDepartments: ['定時制課程（他県と同じ理由でスコープ外）'],
    note: '「全日制 合計」行（一般選抜募集人数11,709・一般選抜志願者数11,679・倍率0.99）と機械集計が完全一致した（初回転記で一致・再修正なし）。',
  },
  officialSubtotals: [{ label: '全日制合計', schoolCount: 73, quota: 11709, finalApplicants: 11679, finalRate: 0.99 }],
  records: [
    { schoolName: '新潟', department: '普通', quota: 240, finalApplicants: 303, finalRate: 1.26 },
    { schoolName: '新潟中央', department: '普通', quota: 155, finalApplicants: 146, finalRate: 0.94 },
    { schoolName: '新潟中央', department: '学究コース', quota: 80, finalApplicants: 65, finalRate: 0.81 },
    { schoolName: '新潟南', department: '普通', quota: 320, finalApplicants: 404, finalRate: 1.26 },
    { schoolName: '新潟南', department: '理数コース', quota: 40, finalApplicants: 62, finalRate: 1.55 },
    { schoolName: '新潟江南', department: '普通', quota: 280, finalApplicants: 379, finalRate: 1.35 },
    { schoolName: '新潟西', department: '普通', quota: 272, finalApplicants: 258, finalRate: 0.94 },
    { schoolName: '新潟東', department: '普通', quota: 280, finalApplicants: 214, finalRate: 0.76 },
    { schoolName: '碧', department: '普通', quota: 160, finalApplicants: 153, finalRate: 0.95 },
    { schoolName: '新潟向陽', department: '普通', quota: 200, finalApplicants: 229, finalRate: 1.14 },
    { schoolName: '巻', department: '普通', quota: 235, finalApplicants: 245, finalRate: 1.04 },
    { schoolName: '新津', department: '普通', quota: 240, finalApplicants: 233, finalRate: 0.97 },
    { schoolName: '新津南', department: '普通', quota: 120, finalApplicants: 61, finalRate: 0.5 },
    { schoolName: '白根', department: '普通', quota: 40, finalApplicants: 33, finalRate: 0.82 },
    { schoolName: '村松', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '阿賀黎明', department: '普通', quota: 36, finalApplicants: 4, finalRate: 0.11 },
    { schoolName: '新発田', department: '普通', quota: 240, finalApplicants: 256, finalRate: 1.06 },
    { schoolName: '新発田南', department: '普通', quota: 160, finalApplicants: 180, finalRate: 1.12 },
    { schoolName: '村上', department: '普通', quota: 160, finalApplicants: 104, finalRate: 0.65 },
    { schoolName: '中条', department: '普通', quota: 76, finalApplicants: 31, finalRate: 0.4 },
    { schoolName: '阿賀野', department: '普通', quota: 35, finalApplicants: 26, finalRate: 0.74 },
    { schoolName: '長岡', department: '普通', quota: 240, finalApplicants: 254, finalRate: 1.05 },
    { schoolName: '長岡大手', department: '普通', quota: 233, finalApplicants: 299, finalRate: 1.28 },
    { schoolName: '長岡向陵', department: '普通', quota: 200, finalApplicants: 278, finalRate: 1.39 },
    { schoolName: '正徳館', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '見附', department: '普通', quota: 80, finalApplicants: 73, finalRate: 0.91 },
    { schoolName: '三条', department: '普通', quota: 200, finalApplicants: 229, finalRate: 1.14 },
    { schoolName: '三条東', department: '普通', quota: 200, finalApplicants: 215, finalRate: 1.07 },
    { schoolName: '吉田', department: '普通', quota: 80, finalApplicants: 63, finalRate: 0.78 },
    { schoolName: '分水', department: '普通', quota: 80, finalApplicants: 59, finalRate: 0.73 },
    { schoolName: '加茂', department: '普通', quota: 160, finalApplicants: 192, finalRate: 1.2 },
    { schoolName: '小千谷', department: '普通', quota: 160, finalApplicants: 159, finalRate: 0.99 },
    { schoolName: '小出', department: '普通', quota: 113, finalApplicants: 116, finalRate: 1.02 },
    { schoolName: '六日町', department: '普通', quota: 200, finalApplicants: 198, finalRate: 0.99 },
    { schoolName: '八海', department: '普通', quota: 72, finalApplicants: 77, finalRate: 1.06 },
    { schoolName: '十日町', department: '普通', quota: 153, finalApplicants: 161, finalRate: 1.05 },
    { schoolName: '十日町', department: 'クロス探究', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '松代', department: '普通', quota: 77, finalApplicants: 43, finalRate: 0.55 },
    { schoolName: '柏崎', department: '普通', quota: 195, finalApplicants: 141, finalRate: 0.72 },
    { schoolName: '柏崎常盤', department: '普通', quota: 120, finalApplicants: 99, finalRate: 0.82 },
    { schoolName: '高田', department: '普通', quota: 200, finalApplicants: 207, finalRate: 1.03 },
    { schoolName: '高田北城', department: '普通', quota: 160, finalApplicants: 192, finalRate: 1.2 },
    { schoolName: '有恒', department: '普通', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '糸魚川', department: '普通', quota: 120, finalApplicants: 111, finalRate: 0.92 },
    { schoolName: '佐渡', department: '普通', quota: 160, finalApplicants: 179, finalRate: 1.11 },
    { schoolName: '佐渡(両津)', department: '普通', quota: 40, finalApplicants: 3, finalRate: 0.07 },
    { schoolName: '羽茂', department: '普通', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '市立万代', department: '普通', quota: 200, finalApplicants: 285, finalRate: 1.42 },
    { schoolName: '新発田農業', department: '農業', quota: 160, finalApplicants: 164, finalRate: 1.02 },
    { schoolName: '長岡農業', department: '農業', quota: 160, finalApplicants: 164, finalRate: 1.02 },
    { schoolName: '加茂農林', department: '農業', quota: 160, finalApplicants: 127, finalRate: 0.79 },
    { schoolName: '高田農業', department: '農業', quota: 160, finalApplicants: 186, finalRate: 1.16 },
    { schoolName: '新潟工業', department: 'ミライ創造工学', quota: 265, finalApplicants: 247, finalRate: 0.93 },
    { schoolName: '新津工業', department: '工業マイスター', quota: 40, finalApplicants: 41, finalRate: 1.02 },
    { schoolName: '新津工業', department: '生産工学', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '新津工業', department: 'ロボット工学', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '新津工業', department: '日本建築', quota: 30, finalApplicants: 32, finalRate: 1.06 },
    { schoolName: '新発田南', department: '工業', quota: 160, finalApplicants: 154, finalRate: 0.96 },
    { schoolName: '長岡工業', department: '工業', quota: 200, finalApplicants: 190, finalRate: 0.95 },
    { schoolName: '新潟県央工業', department: '工業', quota: 158, finalApplicants: 91, finalRate: 0.57 },
    { schoolName: '塩沢商工', department: '地域創造工学', quota: 80, finalApplicants: 32, finalRate: 0.4 },
    { schoolName: '柏崎工業', department: '工業', quota: 120, finalApplicants: 55, finalRate: 0.45 },
    { schoolName: '上越総合技術', department: '工業', quota: 195, finalApplicants: 215, finalRate: 1.1 },
    { schoolName: '新潟商業', department: '総合ビジネス', quota: 137, finalApplicants: 195, finalRate: 1.42 },
    { schoolName: '新潟商業', department: '情報処理', quota: 79, finalApplicants: 93, finalRate: 1.17 },
    { schoolName: '新発田商業', department: '商業', quota: 115, finalApplicants: 101, finalRate: 0.87 },
    { schoolName: '長岡商業', department: '総合ビジネス', quota: 147, finalApplicants: 151, finalRate: 1.02 },
    { schoolName: '三条商業', department: '総合ビジネス', quota: 120, finalApplicants: 100, finalRate: 0.83 },
    { schoolName: '塩沢商工', department: '商業', quota: 40, finalApplicants: 23, finalRate: 0.57 },
    { schoolName: '高田商業', department: '総合ビジネス', quota: 120, finalApplicants: 121, finalRate: 1.0 },
    { schoolName: '海洋', department: '水産', quota: 75, finalApplicants: 74, finalRate: 0.98 },
    { schoolName: '新潟中央', department: '食物', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '長岡大手', department: '家政', quota: 40, finalApplicants: 51, finalRate: 1.27 },
    { schoolName: '高田北城', department: '生活文化', quota: 40, finalApplicants: 54, finalRate: 1.35 },
    { schoolName: '新潟', department: '理数', quota: 80, finalApplicants: 156, finalRate: 1.95 },
    { schoolName: '新潟中央', department: '音楽', quota: 21, finalApplicants: 1, finalRate: 0.04 },
    { schoolName: '新潟商業', department: '国際教養', quota: 80, finalApplicants: 95, finalRate: 1.18 },
    { schoolName: '新発田', department: '理数', quota: 40, finalApplicants: 49, finalRate: 1.22 },
    { schoolName: '長岡', department: '理数', quota: 80, finalApplicants: 83, finalRate: 1.03 },
    { schoolName: '三条', department: '理数', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '国際情報', department: '専門系', quota: 80, finalApplicants: 14, finalRate: 0.17 },
    { schoolName: '高田', department: '理数', quota: 40, finalApplicants: 43, finalRate: 1.07 },
    { schoolName: '市立万代', department: '英語理数', quota: 40, finalApplicants: 66, finalRate: 1.65 },
    { schoolName: '巻総合', department: '総合', quota: 160, finalApplicants: 199, finalRate: 1.24 },
    { schoolName: '五泉総合', department: '総合', quota: 200, finalApplicants: 200, finalRate: 1.0 },
    { schoolName: '村上桜ケ丘', department: '総合', quota: 118, finalApplicants: 112, finalRate: 0.94 },
    { schoolName: '栃尾', department: '総合', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '小千谷西', department: '総合', quota: 120, finalApplicants: 98, finalRate: 0.81 },
    { schoolName: '十日町総合', department: '総合', quota: 119, finalApplicants: 113, finalRate: 0.94 },
    { schoolName: '柏崎総合', department: '総合', quota: 120, finalApplicants: 112, finalRate: 0.93 },
    { schoolName: '新井', department: '総合', quota: 158, finalApplicants: 181, finalRate: 1.14 },
    { schoolName: '糸魚川白嶺', department: '総合', quota: 120, finalApplicants: 102, finalRate: 0.85 },
    { schoolName: '佐渡総合', department: '総合', quota: 120, finalApplicants: 89, finalRate: 0.74 },
  ],
};
