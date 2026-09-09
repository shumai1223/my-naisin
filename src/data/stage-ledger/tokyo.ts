import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 東京都 段階台帳（T-Y11F §5順序#7・7県目・「普通科（コース・単位制以外）」区分107レコード）。
 *
 * 一次ソース: 東京都教育委員会「令和8年度東京都立高等学校入学者選抜合格発表」（一般募集・
 * 学力検査による選抜）のうち「普通科（コース、単位制以外の学校）」（区部57校＋多摩部44校）＋
 * 「普通科（島しょの学校）」（6校）。
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-03-02-181055-948
 * （PDF・全3頁。1〜2頁目に区部・多摩部、3頁目後半に島しょの別表）
 *
 * ⚠️既存の`competition-rates/tokyo.ts`（倍率パイプライン）は**別の一次資料**（受検状況・入試当日
 * 前の応募段階）を採用しており、本資料には志願者数列そのものが存在しない（募集人員・受検人員・
 * 合格人員のみを掲載する試験後の最終結果資料）。そのためquota・applicantsConfirmedは既存
 * パイプラインから再利用し（募集人員は試験日まで不変で全107件完全一致を確認済み）、
 * testTakersConfirmed＝「受検人員」列・finalPassers＝「合格人員」列のみを本資料から新規に
 * 転記した（ibaraki.ts/kanagawa.ts等と同型の複数資料合成設計）。PDFはテキスト層があるが
 * 学校名ラベルが罫線区切りの縦書き風レイアウトで文字化けするため`pdftoppm`ビジョン解析で
 * 転記した（数値は`pdftotext`でも抽出できるが対応する学校名の突合が困難なため）。
 *
 * quotaは107件全数が既存パイプラインと完全一致（募集人員は試験日まで不変）。区部57校・
 * 多摩部44校・島しょ6校の内訳もxlsx本文の「区部計」「多摩部計」「コース、単位制以外計」
 * 「島しょ計」の4段階の公式小計と107レコード全数の機械集計がquota/testTakersConfirmed/
 * finalPassersの3系列すべてで完全一致（applicantsConfirmedはこの資料に印字が無い参考値の
 * ため既存パイプラインの小計との一致のみ確認）。
 *
 * ⚠️**東京都に固有の異常値パターン発見**: finalPassers>quotaが107件中77件（72%）と、他県
 * （chiba/saitama/ibaraki/kanagawaでは各県数件〜十数件=既知の「合格ボーダー同点者」型）とは
 * 桁違いに高頻度で出現する。超過量の分布を見ると77件はいずれも+1〜+17の小幅（日比谷が最大の
 * +17）である一方、quota未達の学校（羽村quota204→final70等）は-100超の大幅未達になる非対称な
 * 分布を示す。東京都立高校は募集人員の一部を推薦選抜（学力検査を伴わない）に事前配分し、
 * 推薦選抜の合格者が募集人員に満たなかった場合は未消化枠が一般選抜（本資料の対象）へ繰り上げ
 * られる制度を持つため、**本資料の「募集人員」列は推薦繰り上げ前の当初一般枠を指し、
 * 「合格人員」列は繰り上げ後の実際の合格者数を指す可能性が高い**（人気校ほど推薦合格率が
 * 高く一般枠へ流入する繰り上げ量が小さく安定するため超過量が軒並み小幅、という分布とも整合）。
 * ただし公式資料にこの仕組みの明記は無いため断定はせず推測に留める（Y-0）。**この構造的な
 * 高頻度性のため、他県で採用した「既知の例外を明示列挙してfinalPassers<=quotaを主張する」
 * 設計は東京都には適用しない**（77件を個別列挙するのは非現実的かつ本質を見誤らせる）。
 * finalPassers>applicantsConfirmedは0件（東京都でもこのパターンは今回出現しなかった）。
 *
 * ⚠️注記: 立川の受検人員には同校の創造理数科（別学科）を第1志望とする者を含まない、と
 * 資料脚注に明記されている（本ファイルは対象を普通科のみとしているため直接の影響は無い）。
 *
 * ⚠️スコープ: 本ファイルは「普通科（コース・単位制以外）」区分＋「普通科（島しょの学校）」
 * のみ。「普通科（コース・単位制）」「専門学科・定時制課程（単位制）」「通信制（前期選抜）」
 * （いずれも同日公表の別PDF）は別セッションで横展開する。
 */

export const TOKYO_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'tokyo',
  sources: [
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-03-02-181055-948',
      docTitle: '東京都教育委員会 令和8年度東京都立高等学校入学者選抜合格発表 1［普通科（コース、単位制以外の学校）］＋2［普通科（島しょの学校）］',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: ['普通科（コース・単位制以外・区部57校＋多摩部44校＋島しょ6校＝107レコード）'],
    pendingDepartments: [
      '普通科（コース・単位制）',
      '専門学科・定時制課程（単位制）',
      '通信制（前期選抜）',
    ],
    note: '「普通科（コース・単位制以外）」区分（区部57校＋多摩部44校＋島しょ6校＝107レコード）を完全収録。quotaは既存competition-rates/tokyo.tsと全107件で完全一致（募集人員は試験日まで不変であることを確認）。applicantsConfirmedも既存パイプラインをそのまま再利用（本資料には志願者数列が存在しないため）。testTakersConfirmed/finalPassersのみ本資料から新規転記。資料本文の「区部計」「多摩部計」「コース、単位制以外計」「島しょ計」の4段階の公式小計と107レコード全数の機械集計がquota/testTakersConfirmed/finalPassersの3系列すべてで完全一致。finalPassers>quotaが107件中77件と極めて高頻度（推薦選抜の未消化枠繰り上げが原因と推測・他県の「合格ボーダー同点者」型とは異質のため個別列挙による例外管理はせず）。普通科（コース・単位制）・専門学科・定時制課程（単位制）・通信制（前期選抜）は未着手。',
  },
  officialSubtotals: [
    { label: '区部計', quota: 12088, applicantsConfirmed: 16926, testTakersConfirmed: 15539, finalPassers: 11638 },
    { label: '多摩部計', quota: 9344, applicantsConfirmed: 11630, testTakersConfirmed: 10961, finalPassers: 8791 },
    { label: 'コース、単位制以外計', quota: 21432, applicantsConfirmed: 28556, testTakersConfirmed: 26500, finalPassers: 20429 },
    { label: '島しょ計', quota: 310, applicantsConfirmed: 100, testTakersConfirmed: 100, finalPassers: 100 },
  ],
  records: [
    { schoolName: '日比谷', department: '普通科', quota: 253, applicantsConfirmed: 520, testTakersConfirmed: 420, finalPassers: 270 },
    { schoolName: '三田', department: '普通科', quota: 236, applicantsConfirmed: 343, testTakersConfirmed: 301, finalPassers: 239 },
    { schoolName: '戸山', department: '普通科', quota: 252, applicantsConfirmed: 474, testTakersConfirmed: 396, finalPassers: 259 },
    { schoolName: '竹早', department: '普通科', quota: 177, applicantsConfirmed: 293, testTakersConfirmed: 275, finalPassers: 179 },
    { schoolName: '向丘', department: '普通科', quota: 220, applicantsConfirmed: 345, testTakersConfirmed: 324, finalPassers: 221 },
    { schoolName: '上野', department: '普通科', quota: 252, applicantsConfirmed: 471, testTakersConfirmed: 442, finalPassers: 257 },
    { schoolName: '日本橋', department: '普通科', quota: 189, applicantsConfirmed: 204, testTakersConfirmed: 194, finalPassers: 190 },
    { schoolName: '本所', department: '普通科', quota: 189, applicantsConfirmed: 273, testTakersConfirmed: 265, finalPassers: 192 },
    { schoolName: '城東', department: '普通科', quota: 252, applicantsConfirmed: 413, testTakersConfirmed: 394, finalPassers: 255 },
    { schoolName: '東', department: '普通科', quota: 189, applicantsConfirmed: 298, testTakersConfirmed: 287, finalPassers: 192 },
    { schoolName: '深川', department: '普通科', quota: 185, applicantsConfirmed: 265, testTakersConfirmed: 231, finalPassers: 194 },
    { schoolName: '大崎', department: '普通科', quota: 221, applicantsConfirmed: 349, testTakersConfirmed: 298, finalPassers: 227 },
    { schoolName: '小山台', department: '普通科', quota: 252, applicantsConfirmed: 412, testTakersConfirmed: 385, finalPassers: 256 },
    { schoolName: '八潮', department: '普通科', quota: 188, applicantsConfirmed: 131, testTakersConfirmed: 113, finalPassers: 113 },
    { schoolName: '駒場', department: '普通科', quota: 220, applicantsConfirmed: 458, testTakersConfirmed: 422, finalPassers: 224 },
    { schoolName: '目黒', department: '普通科', quota: 189, applicantsConfirmed: 395, testTakersConfirmed: 323, finalPassers: 197 },
    { schoolName: '大森', department: '普通科', quota: 127, applicantsConfirmed: 64, testTakersConfirmed: 57, finalPassers: 57 },
    { schoolName: '蒲田', department: '普通科', quota: 109, applicantsConfirmed: 99, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '田園調布', department: '普通科', quota: 188, applicantsConfirmed: 306, testTakersConfirmed: 274, finalPassers: 191 },
    { schoolName: '雪谷', department: '普通科', quota: 221, applicantsConfirmed: 359, testTakersConfirmed: 325, finalPassers: 224 },
    { schoolName: '桜町', department: '普通科', quota: 252, applicantsConfirmed: 286, testTakersConfirmed: 255, finalPassers: 254 },
    { schoolName: '千歳丘', department: '普通科', quota: 221, applicantsConfirmed: 287, testTakersConfirmed: 273, finalPassers: 223 },
    { schoolName: '松原', department: '普通科', quota: 156, applicantsConfirmed: 246, testTakersConfirmed: 229, finalPassers: 157 },
    { schoolName: '青山', department: '普通科', quota: 221, applicantsConfirmed: 455, testTakersConfirmed: 401, finalPassers: 226 },
    { schoolName: '広尾', department: '普通科', quota: 154, applicantsConfirmed: 280, testTakersConfirmed: 224, finalPassers: 155 },
    { schoolName: '鷺宮', department: '普通科', quota: 220, applicantsConfirmed: 403, testTakersConfirmed: 378, finalPassers: 222 },
    { schoolName: '武蔵丘', department: '普通科', quota: 253, applicantsConfirmed: 319, testTakersConfirmed: 286, finalPassers: 255 },
    { schoolName: '杉並', department: '普通科', quota: 253, applicantsConfirmed: 357, testTakersConfirmed: 319, finalPassers: 260 },
    { schoolName: '豊多摩', department: '普通科', quota: 252, applicantsConfirmed: 419, testTakersConfirmed: 377, finalPassers: 255 },
    { schoolName: '西', department: '普通科', quota: 252, applicantsConfirmed: 383, testTakersConfirmed: 326, finalPassers: 260 },
    { schoolName: '豊島', department: '普通科', quota: 252, applicantsConfirmed: 535, testTakersConfirmed: 501, finalPassers: 254 },
    { schoolName: '文京', department: '普通科', quota: 284, applicantsConfirmed: 381, testTakersConfirmed: 351, finalPassers: 286 },
    { schoolName: '竹台', department: '普通科', quota: 171, applicantsConfirmed: 238, testTakersConfirmed: 229, finalPassers: 173 },
    { schoolName: '板橋', department: '普通科', quota: 221, applicantsConfirmed: 346, testTakersConfirmed: 332, finalPassers: 224 },
    { schoolName: '大山', department: '普通科', quota: 157, applicantsConfirmed: 72, testTakersConfirmed: 62, finalPassers: 62 },
    { schoolName: '北園', department: '普通科', quota: 253, applicantsConfirmed: 421, testTakersConfirmed: 391, finalPassers: 256 },
    { schoolName: '高島', department: '普通科', quota: 252, applicantsConfirmed: 282, testTakersConfirmed: 264, finalPassers: 255 },
    { schoolName: '井草', department: '普通科', quota: 221, applicantsConfirmed: 274, testTakersConfirmed: 244, finalPassers: 224 },
    { schoolName: '石神井', department: '普通科', quota: 252, applicantsConfirmed: 417, testTakersConfirmed: 383, finalPassers: 256 },
    { schoolName: '田柄', department: '普通科', quota: 152, applicantsConfirmed: 74, testTakersConfirmed: 69, finalPassers: 69 },
    { schoolName: '練馬', department: '普通科', quota: 189, applicantsConfirmed: 213, testTakersConfirmed: 202, finalPassers: 191 },
    { schoolName: '光丘', department: '普通科', quota: 185, applicantsConfirmed: 137, testTakersConfirmed: 127, finalPassers: 127 },
    { schoolName: '青井', department: '普通科', quota: 164, applicantsConfirmed: 67, testTakersConfirmed: 66, finalPassers: 66 },
    { schoolName: '足立', department: '普通科', quota: 220, applicantsConfirmed: 299, testTakersConfirmed: 288, finalPassers: 223 },
    { schoolName: '足立新田', department: '普通科', quota: 222, applicantsConfirmed: 231, testTakersConfirmed: 223, finalPassers: 222 },
    { schoolName: '足立西', department: '普通科', quota: 156, applicantsConfirmed: 162, testTakersConfirmed: 161, finalPassers: 159 },
    { schoolName: '足立東', department: '普通科', quota: 138, applicantsConfirmed: 117, testTakersConfirmed: 116, finalPassers: 116 },
    { schoolName: '江北', department: '普通科', quota: 252, applicantsConfirmed: 421, testTakersConfirmed: 404, finalPassers: 255 },
    { schoolName: '淵江', department: '普通科', quota: 189, applicantsConfirmed: 177, testTakersConfirmed: 174, finalPassers: 174 },
    { schoolName: '葛飾野', department: '普通科', quota: 253, applicantsConfirmed: 285, testTakersConfirmed: 278, finalPassers: 255 },
    { schoolName: '南葛飾', department: '普通科', quota: 171, applicantsConfirmed: 216, testTakersConfirmed: 208, finalPassers: 173 },
    { schoolName: '江戸川', department: '普通科', quota: 253, applicantsConfirmed: 393, testTakersConfirmed: 378, finalPassers: 257 },
    { schoolName: '葛西南', department: '普通科', quota: 190, applicantsConfirmed: 150, testTakersConfirmed: 142, finalPassers: 142 },
    { schoolName: '小岩', department: '普通科', quota: 284, applicantsConfirmed: 390, testTakersConfirmed: 379, finalPassers: 285 },
    { schoolName: '小松川', department: '普通科', quota: 253, applicantsConfirmed: 297, testTakersConfirmed: 274, finalPassers: 257 },
    { schoolName: '篠崎', department: '普通科', quota: 222, applicantsConfirmed: 198, testTakersConfirmed: 187, finalPassers: 187 },
    { schoolName: '紅葉川', department: '普通科', quota: 189, applicantsConfirmed: 226, testTakersConfirmed: 217, finalPassers: 191 },
    { schoolName: '片倉', department: '普通科', quota: 189, applicantsConfirmed: 232, testTakersConfirmed: 222, finalPassers: 190 },
    { schoolName: '八王子北', department: '普通科', quota: 158, applicantsConfirmed: 178, testTakersConfirmed: 173, finalPassers: 160 },
    { schoolName: '八王子東', department: '普通科', quota: 252, applicantsConfirmed: 308, testTakersConfirmed: 284, finalPassers: 256 },
    { schoolName: '富士森', department: '普通科', quota: 249, applicantsConfirmed: 320, testTakersConfirmed: 310, finalPassers: 256 },
    { schoolName: '松が谷', department: '普通科', quota: 188, applicantsConfirmed: 265, testTakersConfirmed: 256, finalPassers: 189 },
    { schoolName: '立川', department: '普通科', quota: 220, applicantsConfirmed: 323, testTakersConfirmed: 301, finalPassers: 225 },
    { schoolName: '武蔵野北', department: '普通科', quota: 189, applicantsConfirmed: 281, testTakersConfirmed: 251, finalPassers: 191 },
    { schoolName: '多摩', department: '普通科', quota: 163, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '府中', department: '普通科', quota: 252, applicantsConfirmed: 410, testTakersConfirmed: 384, finalPassers: 254 },
    { schoolName: '府中西', department: '普通科', quota: 235, applicantsConfirmed: 267, testTakersConfirmed: 259, finalPassers: 238 },
    { schoolName: '府中東', department: '普通科', quota: 253, applicantsConfirmed: 328, testTakersConfirmed: 311, finalPassers: 254 },
    { schoolName: '昭和', department: '普通科', quota: 252, applicantsConfirmed: 472, testTakersConfirmed: 456, finalPassers: 255 },
    { schoolName: '拝島', department: '普通科', quota: 221, applicantsConfirmed: 213, testTakersConfirmed: 204, finalPassers: 204 },
    { schoolName: '神代', department: '普通科', quota: 252, applicantsConfirmed: 424, testTakersConfirmed: 387, finalPassers: 255 },
    { schoolName: '調布北', department: '普通科', quota: 188, applicantsConfirmed: 326, testTakersConfirmed: 287, finalPassers: 189 },
    { schoolName: '調布南', department: '普通科', quota: 189, applicantsConfirmed: 281, testTakersConfirmed: 244, finalPassers: 191 },
    { schoolName: '小川', department: '普通科', quota: 252, applicantsConfirmed: 285, testTakersConfirmed: 276, finalPassers: 255 },
    { schoolName: '成瀬', department: '普通科', quota: 221, applicantsConfirmed: 269, testTakersConfirmed: 250, finalPassers: 223 },
    { schoolName: '野津田', department: '普通科', quota: 95, applicantsConfirmed: 36, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '町田', department: '普通科', quota: 253, applicantsConfirmed: 306, testTakersConfirmed: 290, finalPassers: 256 },
    { schoolName: '山崎', department: '普通科', quota: 166, applicantsConfirmed: 62, testTakersConfirmed: 58, finalPassers: 58 },
    { schoolName: '小金井北', department: '普通科', quota: 189, applicantsConfirmed: 307, testTakersConfirmed: 284, finalPassers: 192 },
    { schoolName: '小平', department: '普通科', quota: 157, applicantsConfirmed: 235, testTakersConfirmed: 222, finalPassers: 161 },
    { schoolName: '小平西', department: '普通科', quota: 222, applicantsConfirmed: 256, testTakersConfirmed: 246, finalPassers: 224 },
    { schoolName: '小平南', department: '普通科', quota: 221, applicantsConfirmed: 317, testTakersConfirmed: 304, finalPassers: 225 },
    { schoolName: '日野', department: '普通科', quota: 253, applicantsConfirmed: 459, testTakersConfirmed: 442, finalPassers: 256 },
    { schoolName: '日野台', department: '普通科', quota: 241, applicantsConfirmed: 353, testTakersConfirmed: 332, finalPassers: 244 },
    { schoolName: '南平', department: '普通科', quota: 253, applicantsConfirmed: 329, testTakersConfirmed: 306, finalPassers: 256 },
    { schoolName: '東村山', department: '普通科', quota: 136, applicantsConfirmed: 133, testTakersConfirmed: 128, finalPassers: 128 },
    { schoolName: '東村山西', department: '普通科', quota: 189, applicantsConfirmed: 130, testTakersConfirmed: 123, finalPassers: 123 },
    { schoolName: '国立', department: '普通科', quota: 252, applicantsConfirmed: 330, testTakersConfirmed: 295, finalPassers: 260 },
    { schoolName: '福生', department: '普通科', quota: 221, applicantsConfirmed: 242, testTakersConfirmed: 236, finalPassers: 223 },
    { schoolName: '狛江', department: '普通科', quota: 253, applicantsConfirmed: 425, testTakersConfirmed: 377, finalPassers: 257 },
    { schoolName: '東大和', department: '普通科', quota: 221, applicantsConfirmed: 277, testTakersConfirmed: 264, finalPassers: 222 },
    { schoolName: '東大和南', department: '普通科', quota: 220, applicantsConfirmed: 367, testTakersConfirmed: 355, finalPassers: 225 },
    { schoolName: '清瀬', department: '普通科', quota: 220, applicantsConfirmed: 264, testTakersConfirmed: 251, finalPassers: 223 },
    { schoolName: '久留米西', department: '普通科', quota: 188, applicantsConfirmed: 169, testTakersConfirmed: 163, finalPassers: 163 },
    { schoolName: '武蔵村山', department: '普通科', quota: 221, applicantsConfirmed: 227, testTakersConfirmed: 221, finalPassers: 221 },
    { schoolName: '永山', department: '普通科', quota: 246, applicantsConfirmed: 234, testTakersConfirmed: 226, finalPassers: 226 },
    { schoolName: '羽村', department: '普通科', quota: 204, applicantsConfirmed: 71, testTakersConfirmed: 70, finalPassers: 70 },
    { schoolName: '秋留台', department: '普通科', quota: 166, applicantsConfirmed: 151, testTakersConfirmed: 146, finalPassers: 146 },
    { schoolName: '五日市', department: '普通科', quota: 129, applicantsConfirmed: 53, testTakersConfirmed: 51, finalPassers: 51 },
    { schoolName: '田無', department: '普通科', quota: 252, applicantsConfirmed: 299, testTakersConfirmed: 285, finalPassers: 255 },
    { schoolName: '保谷', department: '普通科', quota: 253, applicantsConfirmed: 364, testTakersConfirmed: 346, finalPassers: 256 },
    { schoolName: '大島', department: '普通科', quota: 80, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '新島', department: '普通科', quota: 40, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '神津', department: '普通科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '三宅', department: '普通科', quota: 40, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '八丈', department: '普通科', quota: 80, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '小笠原', department: '普通科', quota: 30, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
  ],
};
