/**
 * 岡山県 公立高等学校 倍率パイプラインα（Y-6・7県目・全日制完全達成）。
 *
 * 一次ソース: 岡山県教育委員会「令和8年度岡山県公立高等学校一般入学者選抜志願者数について」
 * （令和8年2月27日公表・全7ページ、全国募集を除く）。
 *
 * ⚠️岡山県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜と同型の高信頼度技法）。1〜2ページ目の総括表・比率ランキング表も含め、3〜6ページ目の
 * 学校別詳細表（募集定員(A)/特別入学等合格内定者数(B)/一般入学募集人員(A-B)/一般入学志願者数(C)/
 * 比率）まで全てテキストとして抽出でき、画像化(pdftoppm)は「くくり募集」の学科対応関係の確認のみ
 * に限定して使用した。
 *
 * ⚠️構造: 表は[募集定員(A) / 特別入学等合格内定者数(B) / 一般入学募集人員(A-B) / 一般入学志願者数
 * (C) / 一般入学募集人員に対する比率(C/(A-B)) / 前年度募集人員に対する比率]の6列。本ファイルの
 * quota=一般入学募集人員(A-B)・finalApplicants=一般入学志願者数(C)・finalRate=公表比率(C/(A-B))
 * として転記する（他県と同じ「一般選抜の実質倍率」の定義に整合）。A-B列はPDFに記載の値をそのまま
 * 採用し、A-Bの単純引き算では再現できない例（例: 和気閑谷「普通」はA80-B35=45だが記載値は42。
 * 注記により全国募集で募集定員の10%を超えた特別入学等合格内定者3人を追加控除しているため）が
 * あり、独自計算せず列の値をそのまま信頼する方針を徹底した。
 *
 * ⚠️罠1（くくり募集）: 複数学科が一般入学募集人員を共有する「くくり募集」は、PDF画像上で波括弧
 * （brace）により複数の学科名行にまたがって示され、pdftotextのテキスト抽出だけでは列がどの学科に
 * 対応するか判別できない（岡山一宮の普通+理数・西大寺の普通+国際情報・東岡山工業の機械+電子機械+
 * 電気・岡山東商業のビジネス創造+情報ビジネス・倉敷中央の普通+子ども+健康スポーツ・玉島の普通+
 * 理数・倉敷商業の商業+国際経済+情報処理・津山の普通+理数・津山商業の地域ビジネス+情報ビジネスで
 * 実際に確認）。該当校はpdftoppmで画像化し波括弧の範囲を目視確認したうえで、連結学科名（例:
 * 「普通・理数（くくり募集）」）の単一レコードとして記録する（福岡県小倉商業・広島県呉工業等と
 * 同型パターン）。総括表（２）（３）の「比率の高い/低い科」ランキング表に掲載された「〇〇
 * （くくり募集）」表記の倍率と、算出したquota/applicants比が完全一致することでダブルチェック済み。
 *
 * ⚠️罠2（学校名とpdftotextの行折返し）: 一部の複数学科校（津山東・玉野光南）では、pdftotextの
 * レイアウト抽出時に学校名ラベルが「その学校の複数学科行のうち最初でない行」に付着する（例:
 * 津山東の場合、テキスト出現順は[普通の数値行(学校名なし)]→[「津山東食物調理」学校名+2番目学科
 * 名が結合したラベル行]→[看護の数値行]）。学校名なしで出現する数値行を見落とすと学科が1件欠落
 * するため、（２）（３）の比率ランキング表（例:「津山東 普通 0.98」）と突合して学科の存在を
 * 確認する二重チェックを徹底した。
 *
 * ⚠️罠3（quota=0の学科は一般選抜非実施）: 岡山御津（キャリアデザイン科=全員特別入学枠のため
 * 一般入学募集人員が0）・倉敷天城理数科（同様に0）・玉野光南体育科（同様に0）・井原地域生活
 * ＜グリーンライフ＞（同様に0）は、A-B=0で一般入学志願者数欄が「－」（数値化不能）のため
 * レコードとして採用しない（quota>0の不変条件を維持）。総括表の県立全日制「50校中、49校115科
 * ３コースで一般入学者選抜を実施」という注記は、この岡山御津1校が一般入学者選抜を実施しない
 * ことと整合する。
 *
 * 機械集計（県立全日制: quota5,698・applicants5,650・倍率0.99、49校106レコード ／ 市立全日制:
 * quota63・applicants54・倍率0.86、2校3レコード）が、PDF1ページ目「総括表（全国募集を除く）」
 * 記載の県立全日制計・市立全日制計と両方とも完全一致した（初回転記で一致・再修正なし）。
 * 定時制（県立1校・市立5校）・全国募集（別枠）は他県と同じ理由でスコープ外。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const OKAYAMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'okayama',
  sources: [
    {
      url: 'https://www.pref.okayama.jp/uploaded/life/1044733_10111198_misc.pdf',
      docTitle: '岡山県教育委員会 令和8年度岡山県公立高等学校一般入学者選抜志願者数について',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '全日制県立（49校106レコード。一般入学者選抜非実施の岡山御津キャリアデザイン科は対象外）',
      '全日制市立（岡山後楽館・玉野商工の2校3レコード）',
    ],
    pendingDepartments: [
      '定時制（県立1校=烏城・市立5校、他県と同じ理由でスコープ外）',
      '全国募集（別枠のため対象外）',
    ],
    note:
      '総括表（全国募集を除く）記載の県立全日制計（50校・quota5,698・applicants5,650・倍率0.99）と' +
      '市立全日制計（2校・quota63・applicants54・倍率0.86）の両方に機械集計が完全一致した。',
  },
  officialSubtotals: [
    { label: '県立全日制計', schoolCount: 50, quota: 5698, finalApplicants: 5650, finalRate: 0.99 },
    { label: '市立全日制計', schoolCount: 2, quota: 63, finalApplicants: 54, finalRate: 0.86 },
  ],
  records: [
    { schoolName: '岡山朝日', department: '普通', quota: 320, finalApplicants: 299, finalRate: 0.93 },
    { schoolName: '岡山操山', department: '普通', quota: 166, finalApplicants: 188, finalRate: 1.13 },
    { schoolName: '岡山芳泉', department: '普通', quota: 320, finalApplicants: 376, finalRate: 1.18 },
    { schoolName: '岡山一宮', department: '普通・理数（くくり募集）', quota: 280, finalApplicants: 320, finalRate: 1.14 },
    { schoolName: '岡山城東', department: '普通', quota: 263, finalApplicants: 352, finalRate: 1.34 },
    { schoolName: '西大寺', department: '普通・国際情報（くくり募集）', quota: 180, finalApplicants: 243, finalRate: 1.35 },
    { schoolName: '西大寺', department: '商業', quota: 16, finalApplicants: 31, finalRate: 1.94 },
    { schoolName: '瀬戸', department: '普通', quota: 80, finalApplicants: 66, finalRate: 0.83 },
    { schoolName: '高松農業', department: '農業科学', quota: 8, finalApplicants: 10, finalRate: 1.25 },
    { schoolName: '高松農業', department: '園芸科学', quota: 10, finalApplicants: 3, finalRate: 0.3 },
    { schoolName: '高松農業', department: '畜産科学', quota: 8, finalApplicants: 10, finalRate: 1.25 },
    { schoolName: '高松農業', department: '農業土木', quota: 12, finalApplicants: 4, finalRate: 0.33 },
    { schoolName: '高松農業', department: '食品科学', quota: 8, finalApplicants: 12, finalRate: 1.5 },
    { schoolName: '興陽', department: '農業', quota: 8, finalApplicants: 17, finalRate: 2.13 },
    { schoolName: '興陽', department: '農業機械', quota: 8, finalApplicants: 11, finalRate: 1.38 },
    { schoolName: '興陽', department: '造園デザイン', quota: 8, finalApplicants: 13, finalRate: 1.63 },
    { schoolName: '興陽', department: 'ライフデザイン', quota: 16, finalApplicants: 35, finalRate: 2.19 },
    { schoolName: '瀬戸南', department: '生物生産', quota: 8, finalApplicants: 7, finalRate: 0.88 },
    { schoolName: '瀬戸南', department: '園芸科学', quota: 8, finalApplicants: 1, finalRate: 0.13 },
    { schoolName: '瀬戸南', department: '生活デザイン', quota: 8, finalApplicants: 24, finalRate: 3.0 },
    { schoolName: '岡山工業', department: '機械', quota: 16, finalApplicants: 21, finalRate: 1.31 },
    { schoolName: '岡山工業', department: '電気', quota: 8, finalApplicants: 15, finalRate: 1.88 },
    { schoolName: '岡山工業', department: '情報技術', quota: 8, finalApplicants: 23, finalRate: 2.88 },
    { schoolName: '岡山工業', department: '化学工学', quota: 8, finalApplicants: 14, finalRate: 1.75 },
    { schoolName: '岡山工業', department: '土木', quota: 8, finalApplicants: 11, finalRate: 1.38 },
    { schoolName: '岡山工業', department: '建築', quota: 8, finalApplicants: 16, finalRate: 2.0 },
    { schoolName: '岡山工業', department: 'デザイン', quota: 8, finalApplicants: 13, finalRate: 1.63 },
    { schoolName: '東岡山工業', department: '機械・電子機械・電気（くくり募集）', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '東岡山工業', department: '設備システム', quota: 8, finalApplicants: 6, finalRate: 0.75 },
    { schoolName: '東岡山工業', department: '工業化学', quota: 8, finalApplicants: 3, finalRate: 0.38 },
    { schoolName: '岡山東商業', department: 'ビジネス創造・情報ビジネス（くくり募集）', quota: 64, finalApplicants: 143, finalRate: 2.23 },
    { schoolName: '岡山南', department: '商業', quota: 16, finalApplicants: 23, finalRate: 1.44 },
    { schoolName: '岡山南', department: '国際経済', quota: 8, finalApplicants: 9, finalRate: 1.13 },
    { schoolName: '岡山南', department: '情報処理', quota: 16, finalApplicants: 27, finalRate: 1.69 },
    { schoolName: '岡山南', department: '生活創造', quota: 16, finalApplicants: 41, finalRate: 2.56 },
    { schoolName: '岡山南', department: '服飾デザイン', quota: 8, finalApplicants: 9, finalRate: 1.13 },
    { schoolName: '倉敷青陵', department: '普通', quota: 320, finalApplicants: 363, finalRate: 1.13 },
    { schoolName: '倉敷天城', department: '普通', quota: 109, finalApplicants: 121, finalRate: 1.11 },
    { schoolName: '倉敷南', department: '普通', quota: 320, finalApplicants: 322, finalRate: 1.01 },
    { schoolName: '倉敷古城池', department: '普通', quota: 280, finalApplicants: 322, finalRate: 1.15 },
    { schoolName: '倉敷中央', department: '普通・子ども・健康スポーツ（くくり募集）', quota: 120, finalApplicants: 127, finalRate: 1.06 },
    { schoolName: '倉敷中央', department: '家政', quota: 10, finalApplicants: 13, finalRate: 1.3 },
    { schoolName: '倉敷中央', department: '看護', quota: 10, finalApplicants: 16, finalRate: 1.6 },
    { schoolName: '倉敷中央', department: '福祉', quota: 10, finalApplicants: 14, finalRate: 1.4 },
    { schoolName: '玉島', department: '普通・理数（くくり募集）', quota: 220, finalApplicants: 191, finalRate: 0.87 },
    { schoolName: '倉敷鷲羽', department: '普通', quota: 60, finalApplicants: 22, finalRate: 0.37 },
    { schoolName: '倉敷鷲羽', department: 'ビジネス', quota: 16, finalApplicants: 4, finalRate: 0.25 },
    { schoolName: '倉敷工業', department: '機械', quota: 16, finalApplicants: 22, finalRate: 1.38 },
    { schoolName: '倉敷工業', department: '電子機械', quota: 16, finalApplicants: 16, finalRate: 1.0 },
    { schoolName: '倉敷工業', department: '電気', quota: 17, finalApplicants: 8, finalRate: 0.47 },
    { schoolName: '倉敷工業', department: '工業化学', quota: 8, finalApplicants: 5, finalRate: 0.63 },
    { schoolName: '倉敷工業', department: 'テキスタイル工学', quota: 8, finalApplicants: 15, finalRate: 1.88 },
    { schoolName: '水島工業', department: '機械', quota: 16, finalApplicants: 12, finalRate: 0.75 },
    { schoolName: '水島工業', department: '電気', quota: 16, finalApplicants: 11, finalRate: 0.69 },
    { schoolName: '水島工業', department: '情報技術', quota: 8, finalApplicants: 11, finalRate: 1.38 },
    { schoolName: '水島工業', department: '工業化学', quota: 8, finalApplicants: 9, finalRate: 1.13 },
    { schoolName: '水島工業', department: '建築', quota: 8, finalApplicants: 7, finalRate: 0.88 },
    { schoolName: '倉敷商業', department: '商業・国際経済・情報処理（くくり募集）', quota: 64, finalApplicants: 122, finalRate: 1.91 },
    { schoolName: '玉島商業', department: 'ビジネス情報', quota: 32, finalApplicants: 48, finalRate: 1.5 },
    { schoolName: '津山', department: '普通・理数（くくり募集）', quota: 148, finalApplicants: 131, finalRate: 0.89 },
    { schoolName: '津山東', department: '普通', quota: 120, finalApplicants: 118, finalRate: 0.98 },
    { schoolName: '津山東', department: '食物調理', quota: 10, finalApplicants: 14, finalRate: 1.4 },
    { schoolName: '津山東', department: '看護', quota: 10, finalApplicants: 10, finalRate: 1.0 },
    { schoolName: '津山工業', department: '機械', quota: 12, finalApplicants: 5, finalRate: 0.42 },
    { schoolName: '津山工業', department: 'ロボット電気', quota: 16, finalApplicants: 6, finalRate: 0.38 },
    { schoolName: '津山工業', department: '工業化学', quota: 12, finalApplicants: 14, finalRate: 1.17 },
    { schoolName: '津山工業', department: '土木', quota: 12, finalApplicants: 10, finalRate: 0.83 },
    { schoolName: '津山工業', department: '建築', quota: 12, finalApplicants: 10, finalRate: 0.83 },
    { schoolName: '津山工業', department: 'デザイン', quota: 12, finalApplicants: 13, finalRate: 1.08 },
    { schoolName: '津山商業', department: '地域ビジネス・情報ビジネス（くくり募集）', quota: 37, finalApplicants: 29, finalRate: 0.78 },
    { schoolName: '玉野', department: '普通', quota: 160, finalApplicants: 112, finalRate: 0.7 },
    { schoolName: '玉野光南', department: '普通', quota: 120, finalApplicants: 111, finalRate: 0.93 },
    { schoolName: '玉野光南', department: '情報', quota: 10, finalApplicants: 14, finalRate: 1.4 },
    { schoolName: '笠岡', department: '普通', quota: 160, finalApplicants: 115, finalRate: 0.72 },
    { schoolName: '笠岡工業', department: '電子機械', quota: 8, finalApplicants: 0, finalRate: 0.0 },
    { schoolName: '笠岡工業', department: '電気情報', quota: 16, finalApplicants: 1, finalRate: 0.06 },
    { schoolName: '笠岡工業', department: '環境土木', quota: 17, finalApplicants: 2, finalRate: 0.12 },
    { schoolName: '笠岡商業', department: 'ビジネス情報', quota: 24, finalApplicants: 17, finalRate: 0.71 },
    { schoolName: '井原', department: '普通', quota: 60, finalApplicants: 11, finalRate: 0.18 },
    { schoolName: '井原', department: '地域生活＜ヒューマンライフ＞', quota: 3, finalApplicants: 0, finalRate: 0.0 },
    { schoolName: '総社', department: '普通', quota: 200, finalApplicants: 178, finalRate: 0.89 },
    { schoolName: '総社', department: '家政', quota: 12, finalApplicants: 18, finalRate: 1.5 },
    { schoolName: '総社南', department: '普通', quota: 190, finalApplicants: 218, finalRate: 1.15 },
    { schoolName: '高梁', department: '普通', quota: 60, finalApplicants: 48, finalRate: 0.8 },
    { schoolName: '高梁', department: '家政', quota: 8, finalApplicants: 7, finalRate: 0.88 },
    { schoolName: '高梁城南', department: '電気', quota: 8, finalApplicants: 4, finalRate: 0.5 },
    { schoolName: '高梁城南', department: 'デザイン', quota: 8, finalApplicants: 2, finalRate: 0.25 },
    { schoolName: '高梁城南', department: '環境科学', quota: 8, finalApplicants: 14, finalRate: 1.75 },
    { schoolName: '新見', department: '普通', quota: 40, finalApplicants: 0, finalRate: 0.0 },
    { schoolName: '新見', department: '生物生産', quota: 23, finalApplicants: 2, finalRate: 0.09 },
    { schoolName: '新見', department: '工業技術', quota: 20, finalApplicants: 1, finalRate: 0.05 },
    { schoolName: '備前緑陽', department: '総合学科', quota: 28, finalApplicants: 19, finalRate: 0.68 },
    { schoolName: '邑久', department: '普通', quota: 20, finalApplicants: 17, finalRate: 0.85 },
    { schoolName: '邑久', department: '生活ビジネス', quota: 16, finalApplicants: 32, finalRate: 2.0 },
    { schoolName: '勝山', department: '普通', quota: 60, finalApplicants: 44, finalRate: 0.73 },
    { schoolName: '勝山', department: '普通（蒜山校地）', quota: 18, finalApplicants: 2, finalRate: 0.11 },
    { schoolName: '真庭', department: '食農生産', quota: 8, finalApplicants: 4, finalRate: 0.5 },
    { schoolName: '真庭', department: '経営ビジネス', quota: 16, finalApplicants: 2, finalRate: 0.13 },
    { schoolName: '真庭', department: '看護', quota: 29, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '林野', department: '普通', quota: 60, finalApplicants: 6, finalRate: 0.1 },
    { schoolName: '鴨方', department: '総合学科', quota: 38, finalApplicants: 8, finalRate: 0.21 },
    { schoolName: '和気閑谷', department: '普通', quota: 42, finalApplicants: 15, finalRate: 0.36 },
    { schoolName: '和気閑谷', department: 'キャリア探求', quota: 16, finalApplicants: 4, finalRate: 0.25 },
    { schoolName: '矢掛', department: '普通', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '矢掛', department: '地域ビジネス', quota: 16, finalApplicants: 0, finalRate: 0.0 },
    { schoolName: '勝間田', department: '総合学科', quota: 60, finalApplicants: 10, finalRate: 0.17 },
    { schoolName: '岡山後楽館', department: '総合学科', quota: 24, finalApplicants: 40, finalRate: 1.67 },
    { schoolName: '玉野商工', department: 'ビジネス情報', quota: 30, finalApplicants: 10, finalRate: 0.33 },
    { schoolName: '玉野商工', department: '機械', quota: 9, finalApplicants: 4, finalRate: 0.44 },
  ],
};
