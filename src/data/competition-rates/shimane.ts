/**
 * 島根県 公立高等学校 倍率パイプラインα（Y-6・保留県からの再挑戦で完全達成）。
 *
 * 一次ソース: 島根県教育委員会「令和８年度島根県公立高等学校入学者選抜 一般選抜出願者数（志願変更後）」
 * （令和8年2月16日17:00現在・全日制1ページ）。
 *
 * ⚠️過去のセッションで「身元引受人枠/地域外枠/特色選抜による複数控除が入学定員から一般選抜募集定員を
 * 導出する構造で、学校別合計行での逆算検証を試みたが値が一意に確定できなかった」として保留していたが、
 * 実際にはa(入学定員)からb(身元引受人枠上限)・地域外枠上限・c/d/e(特色選抜合格内定者数)を逆算する
 * 必要は無く、**一般選抜募集定員(列i)・志願者数合計/志願変更後(列j)・対募集定員競争率(列p、令和8年度)
 * がいずれも資料に直接印字されている**と今回のpdftotext -layout抽出で判明し、3列をそのまま転記する
 * だけで解決した（他県で確立した「複雑な控除構造は逆算せず印字済みの最終列をそのまま使う」原則を適用）。
 * quota=i（一般選抜募集定員）、finalApplicants=志願者数合計（志願変更後）、finalRate=p（対募集定員
 * 競争率・入学者選抜8年度）を採用。機械集計と「合計」行の完全一致で正確性を担保した。
 *
 * くくり募集（同一の入学者枠数を複数学科・コースが共有し、資料上は代表学科のみに数値が印字される）:
 * 安来「情報科学（情報システム・情報処理・マルチメディア）」、松江商業「商業（商業・国際ビジネス・
 * 情報処理）」、浜田商業「商業（商業・情報処理）」、隠岐島前「普通（普通・地域共創）」はいずれも
 * 「計」行の数値が代表学科の数値と完全一致することを確認し、単一レコードに統合した。
 *
 * 松江市立皆美が丘女子高等学校（市立）は県立高校とは別に「合計」行に含まれるため、公式の「県立高校計」
 * （quota3,031・applicants2,447）とは別に「合計」（quota3,084・applicants2,493・県立63レコード+
 * 市立1レコード=64レコード）の両方をofficialSubtotalsに保持した。
 *
 * 機械集計（quota3,084・applicants2,493、35校（県立34校+市立1校）64レコード）が「合計」行と
 * 初回転記で完全一致した（再修正なし）。定時制課程は他県の定時制と同じ理由でスコープ外。
 *
 * ⚠️掛-1（R7追加時の年度差）: R7一次資料は志願変更前後2列でなく同一構造（i=一般選抜募集定員・
 * j=出願者数合計(志願変更後)・p=対募集定員競争率）で、全日制の後に定時制の別表、さらに
 * 全日制+定時制の総計表が続く3部構成だった。全日制表の末尾に「県立高校計」（quota3,133・
 * applicants2,596・倍率0.83）と「合計」（quota3,217・applicants2,667・倍率0.83、35校65
 * レコード）が印字されており、機械集計と初回転記で完全一致した。
 * 松江市立皆美が丘女子高等学校のR7時点は「普通」「国際コミュニケーション」の2学科構成だったが、
 * 国際コミュニケーション科は5年連続で定員未充足のため2026年度（R8）入試から募集停止・普通科に
 * 一本化されたことをWebSearchで確認した（実在の学科再編。転記ミスではない）。
 *
 * ⚠️掛-1（学校別×多年度）R6追加: 令和6年度一次資料（R6.2.14 17:00現在・全日制+定時制+総計の
 * 3部構成）をWayback Machine経由で取得した（`senbatsu_info/index.data/01_R6ippansenbatu_henkougo.pdf`。
 * R7/R8とは異なりこの年はフォルダが`index.data`直下でR7以降の`R07_kouritsukoutougakkounyuushi.data`
 * のような年度別サブフォルダが導入される前）。R7/R8同様に列構成は資料に直接印字された最終列を
 * そのまま転記する方針を踏襲: quota=l（一般選抜募集定員=b-f）、finalApplicants=m（出願者数合計・
 * 志願変更後=n+p）、finalRate=s（入学者6年度選抜度=m/l）。65レコード（35校＝県立34校+市立1校）を
 * 転記、「県立高校計」（quota4,066・applicants3,416・倍率0.84）と「合計」（quota4,169・
 * applicants3,481・倍率0.83）の両方がnode.js機械集計と完全一致（誤差ゼロ・初回転記で一致）。
 * R7とのschoolName+department diffは差分1件のみ検出: 津和野が「普通」（R6）→「未来共創」（R7〜）。
 * WebSearchで裏取りした結果、令和7年度から新学科「未来共創科」を新設し普通科（1年生分）を転換した
 * ことが確認できた（tsuwano.ed.jp公式サイト・2024年度に文科省の学際的な学び関連事業に採択され
 * 令和7年度から普通科を未来共創科へ転換。R6入試時点はまだ「普通」科という表記が正しい・転記ミス
 * ではない）。
 *
 * ⚠️掛-1（学校別×多年度）R5追加（4年度目）: 令和5年度一次資料（R5.2.15 17:00現在・全日制+定時制+
 * 総計の3部構成）を県公式サイトから取得した（`senbatsu_info/index.data/R5gakuryokusenbatusiganhenkougo_.pdf`。
 * R6以降と異なりファイル名が「一般選抜」でなく「学力選抜」表記だが内容・書式は同一。2026-08-22時点で
 * 県公式サイトから200 OKで取得できたためWayback Machineは不要だった）。列の記号・位置がR6/R7/R8と
 * 微妙に異なり pdftotext -layout の単純な空白区切りでは列がずれる（「計」行等で列数が変動する）ため、
 * `pdftotext -bbox` でPDF内の各語のX座標を取得し、ヘッダ行の列ラベル（l=b-ｆ・m=n+p・m/l=s）のX座標に
 * 対して機械的に列を同定する方式で再抽出した。quota=l（一般選抜募集定員）、finalApplicants=n（一般選抜
 * 募集定員の2つ右の値＝出願者数合計・志願変更後。ヘッダの「m=n+p」という定義注記とは別に、m自体は
 * 志願変更前の合計値であり、実際に競争率(s)と algebraically 整合するのはmの次の値nであることを
 * 既存R6資料の既知値との突合で確認した）、finalRate=s（対募集定員競争率・令和5年度、m/l）を採用。
 * 65校ではなく**66レコード（35校＝県立34校+市立1校）**を転記——R6/R7より1レコード多いのは、松江工業が
 * R5時点でまだ「機械・電子機械・電気・電子・情報技術・建築都市工学」の6学科構成だったため（R6以降の
 * 「機械・電子機械・電気電子工学・情報クリエイター学・建築都市工学」5学科とは異なる）。WebSearchで
 * 裏取りした結果、Wikipedia「島根県立松江工業高等学校」の沿革に「2024年3月－電子科と電気科を
 * 併合し、電気電子工学科を作成」「2024年3月－情報技術科を情報クリエイター学科と名称変更」と明記されて
 * おり、令和5年度入試（2023年2月実施、R5.2.15時点の資料）はまだ改編前の6学科体制だったことと整合する
 * （転記ミスではなく実在の学科再編）。「県立高校計」（quota4,122・applicants3,783・倍率0.92）と「合計」
 * （quota4,227・applicants3,873・倍率0.92、35校66レコード）の両方がnode.js機械集計と初回転記で完全
 * 一致した（誤差ゼロ）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const SHIMANE_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'shimane',
  sources: [
    {
      url: 'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/kanendosenbatsu.data/01_R8_henkougoitiran_teisei.pdf',
      docTitle: '島根県教育委員会 令和８年度島根県公立高等学校入学者選抜 一般選抜出願者数（志願変更後）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-26',
    },
    {
      url: 'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/R07_kouritsukoutougakkounyuushi.data/R7_henkougo_itiran.pdf',
      docTitle: '島根県教育委員会 令和７年度島根県公立高等学校入学者選抜 一般選抜出願者数（志願変更後）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-08',
    },
    {
      url: 'https://www1.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/index.data/01_R6ippansenbatu_henkougo.pdf',
      docTitle: '島根県教育委員会 令和６年度島根県公立高等学校入学者選抜 一般選抜出願者数（志願変更後）※2026-08-09時点で県公式サイトからは404のため、Wayback Machine(20240719052239)経由で取得',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-09',
    },
    {
      url: 'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/index.data/R5gakuryokusenbatusiganhenkougo_.pdf',
      docTitle: '島根県教育委員会 令和５年度島根県公立高等学校入学者選抜 一般選抜出願者数（志願変更後）',
      fiscalYear: '令和5年度（2023年度）',
      fetchedAt: '2026-08-22',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制課程（35校（県立34校+市立1校）64レコード）'],
    pendingDepartments: ['定時制課程（他県の定時制と同じ理由でスコープ外）'],
    note:
      '「合計」行（一般選抜募集定員3,084・志願者数合計(志願変更後)2,493・倍率0.81）と機械集計が' +
      '完全一致した（初回転記で一致・再修正なし）。quota/finalApplicants/finalRateはいずれも資料に' +
      '直接印字された列（i・志願変更後合計・p=令和8年度競争率）をそのまま転記し、身元引受人枠等の' +
      '控除構造を自前で逆算する必要は無かった。',
  },
  officialSubtotals: [
    { label: '県立高校計', schoolCount: 34, quota: 3031, finalApplicants: 2447, finalRate: 0.81 },
    { label: '合計', schoolCount: 35, quota: 3084, finalApplicants: 2493, finalRate: 0.81 },
  ],
  records: [
    { schoolName: '安来', department: '普通', quota: 81, finalApplicants: 48, finalRate: 0.59 },
    {
      schoolName: '安来',
      department: '情報科学(情報システム・情報処理・マルチメディア)',
      quota: 72,
      finalApplicants: 46,
      finalRate: 0.64,
    },
    { schoolName: '松江北', department: '普通', quota: 192, finalApplicants: 201, finalRate: 1.05 },
    { schoolName: '松江北', department: '理数', quota: 36, finalApplicants: 35, finalRate: 0.97 },
    { schoolName: '松江南', department: '普通', quota: 163, finalApplicants: 201, finalRate: 1.23 },
    { schoolName: '松江南', department: '探究科学', quota: 24, finalApplicants: 19, finalRate: 0.79 },
    { schoolName: '松江東', department: '普通', quota: 109, finalApplicants: 121, finalRate: 1.11 },
    { schoolName: '松江工業', department: '機械', quota: 23, finalApplicants: 25, finalRate: 1.09 },
    { schoolName: '松江工業', department: '電子機械', quota: 19, finalApplicants: 20, finalRate: 1.05 },
    { schoolName: '松江工業', department: '電気電子工学', quota: 22, finalApplicants: 19, finalRate: 0.86 },
    { schoolName: '松江工業', department: '情報クリエイター学', quota: 27, finalApplicants: 22, finalRate: 0.81 },
    { schoolName: '松江工業', department: '建築都市工学', quota: 27, finalApplicants: 18, finalRate: 0.67 },
    {
      schoolName: '松江商業',
      department: '商業(商業・国際ビジネス・情報処理)',
      quota: 101,
      finalApplicants: 133,
      finalRate: 1.32,
    },
    { schoolName: '松江農林', department: '生物生産', quota: 24, finalApplicants: 30, finalRate: 1.25 },
    { schoolName: '松江農林', department: '環境土木', quota: 24, finalApplicants: 17, finalRate: 0.71 },
    { schoolName: '松江農林', department: '総合学科', quota: 44, finalApplicants: 49, finalRate: 1.11 },
    { schoolName: '大東', department: '普通', quota: 52, finalApplicants: 23, finalRate: 0.44 },
    { schoolName: '横田', department: '普通', quota: 67, finalApplicants: 37, finalRate: 0.55 },
    { schoolName: '三刀屋', department: '総合学科', quota: 89, finalApplicants: 52, finalRate: 0.58 },
    { schoolName: '掛合', department: '普通', quota: 33, finalApplicants: 23, finalRate: 0.7 },
    { schoolName: '飯南', department: '普通', quota: 34, finalApplicants: 19, finalRate: 0.56 },
    { schoolName: '平田', department: '普通', quota: 88, finalApplicants: 105, finalRate: 1.19 },
    { schoolName: '出雲', department: '普通', quota: 143, finalApplicants: 160, finalRate: 1.12 },
    { schoolName: '出雲', department: '理数', quota: 24, finalApplicants: 24, finalRate: 1.0 },
    { schoolName: '出雲工業', department: '機械', quota: 22, finalApplicants: 22, finalRate: 1.0 },
    { schoolName: '出雲工業', department: '電気', quota: 24, finalApplicants: 21, finalRate: 0.88 },
    { schoolName: '出雲工業', department: '電子機械', quota: 24, finalApplicants: 30, finalRate: 1.25 },
    { schoolName: '出雲工業', department: '建築', quota: 21, finalApplicants: 26, finalRate: 1.24 },
    { schoolName: '出雲商業', department: '商業', quota: 68, finalApplicants: 56, finalRate: 0.82 },
    { schoolName: '出雲商業', department: '情報処理', quota: 24, finalApplicants: 21, finalRate: 0.88 },
    { schoolName: '出雲農林', department: '植物科学', quota: 23, finalApplicants: 20, finalRate: 0.87 },
    { schoolName: '出雲農林', department: '環境科学', quota: 19, finalApplicants: 20, finalRate: 1.05 },
    { schoolName: '出雲農林', department: '食品科学', quota: 23, finalApplicants: 24, finalRate: 1.04 },
    { schoolName: '出雲農林', department: '動物科学', quota: 23, finalApplicants: 29, finalRate: 1.26 },
    { schoolName: '大社', department: '普通', quota: 140, finalApplicants: 163, finalRate: 1.16 },
    { schoolName: '大社', department: '体育', quota: 12, finalApplicants: 16, finalRate: 1.33 },
    { schoolName: '大田', department: '普通', quota: 92, finalApplicants: 76, finalRate: 0.83 },
    { schoolName: '大田', department: '理数', quota: 30, finalApplicants: 7, finalRate: 0.23 },
    { schoolName: '邇摩', department: '総合学科', quota: 68, finalApplicants: 24, finalRate: 0.35 },
    { schoolName: '島根中央', department: '普通', quota: 55, finalApplicants: 22, finalRate: 0.4 },
    { schoolName: '矢上', department: '普通', quota: 41, finalApplicants: 11, finalRate: 0.27 },
    { schoolName: '矢上', department: '産業技術', quota: 20, finalApplicants: 18, finalRate: 0.9 },
    { schoolName: '江津', department: '普通', quota: 49, finalApplicants: 13, finalRate: 0.27 },
    { schoolName: '江津工業', department: '機械・ロボット', quota: 33, finalApplicants: 5, finalRate: 0.15 },
    { schoolName: '江津工業', department: '建築・電気', quota: 22, finalApplicants: 27, finalRate: 1.23 },
    { schoolName: '浜田', department: '普通', quota: 92, finalApplicants: 68, finalRate: 0.74 },
    { schoolName: '浜田', department: '理数', quota: 29, finalApplicants: 8, finalRate: 0.28 },
    { schoolName: '浜田商業', department: '商業(商業・情報処理)', quota: 44, finalApplicants: 29, finalRate: 0.66 },
    { schoolName: '浜田水産', department: '海洋技術', quota: 22, finalApplicants: 10, finalRate: 0.45 },
    { schoolName: '浜田水産', department: '食品流通', quota: 30, finalApplicants: 4, finalRate: 0.13 },
    { schoolName: '益田', department: '普通', quota: 106, finalApplicants: 101, finalRate: 0.95 },
    { schoolName: '益田', department: '理数', quota: 38, finalApplicants: 14, finalRate: 0.37 },
    { schoolName: '益田翔陽', department: '電子機械', quota: 24, finalApplicants: 6, finalRate: 0.25 },
    { schoolName: '益田翔陽', department: '電気', quota: 22, finalApplicants: 8, finalRate: 0.36 },
    { schoolName: '益田翔陽', department: '生物環境工学', quota: 22, finalApplicants: 12, finalRate: 0.55 },
    { schoolName: '益田翔陽', department: '総合学科', quota: 22, finalApplicants: 12, finalRate: 0.55 },
    { schoolName: '吉賀', department: '普通', quota: 18, finalApplicants: 3, finalRate: 0.17 },
    { schoolName: '津和野', department: '未来共創', quota: 44, finalApplicants: 20, finalRate: 0.45 },
    { schoolName: '隠岐', department: '普通', quota: 38, finalApplicants: 4, finalRate: 0.11 },
    { schoolName: '隠岐', department: '商業', quota: 24, finalApplicants: 10, finalRate: 0.42 },
    {
      schoolName: '隠岐島前',
      department: '普通(普通・地域共創)',
      quota: 51,
      finalApplicants: 17,
      finalRate: 0.33,
    },
    { schoolName: '隠岐水産', department: '海洋システム', quota: 26, finalApplicants: 14, finalRate: 0.54 },
    { schoolName: '隠岐水産', department: '海洋生産', quota: 28, finalApplicants: 9, finalRate: 0.32 },
    { schoolName: '皆美が丘女子', department: '普通', quota: 53, finalApplicants: 46, finalRate: 0.87 },
    { schoolName: '安来', department: '普通', quota: 98, finalApplicants: 69, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '安来', department: '情報科学(情報システム・情報処理・マルチメディア)', quota: 82, finalApplicants: 47, finalRate: 0.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江北', department: '普通', quota: 233, finalApplicants: 225, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江北', department: '理数', quota: 36, finalApplicants: 34, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江南', department: '普通', quota: 167, finalApplicants: 206, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江南', department: '探究科学', quota: 54, finalApplicants: 31, finalRate: 0.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江東', department: '普通', quota: 111, finalApplicants: 132, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江工業', department: '機械', quota: 19, finalApplicants: 28, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江工業', department: '電子機械', quota: 26, finalApplicants: 28, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江工業', department: '電気電子工学', quota: 21, finalApplicants: 23, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江工業', department: '情報クリエイター学', quota: 21, finalApplicants: 26, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江工業', department: '建築都市工学', quota: 22, finalApplicants: 22, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江商業', department: '商業(商業・国際ビジネス・情報処理)', quota: 100, finalApplicants: 110, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江農林', department: '生物生産', quota: 22, finalApplicants: 23, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江農林', department: '環境土木', quota: 22, finalApplicants: 23, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松江農林', department: '総合学科', quota: 44, finalApplicants: 47, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大東', department: '普通', quota: 46, finalApplicants: 33, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横田', department: '普通', quota: 61, finalApplicants: 33, finalRate: 0.54, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三刀屋', department: '総合学科', quota: 94, finalApplicants: 67, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '掛合', department: '普通', quota: 35, finalApplicants: 24, finalRate: 0.69, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '飯南', department: '普通', quota: 37, finalApplicants: 23, finalRate: 0.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '平田', department: '普通', quota: 97, finalApplicants: 79, finalRate: 0.81, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲', department: '普通', quota: 142, finalApplicants: 180, finalRate: 1.27, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲', department: '理数', quota: 24, finalApplicants: 13, finalRate: 0.54, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲工業', department: '機械', quota: 24, finalApplicants: 19, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲工業', department: '電気', quota: 24, finalApplicants: 19, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲工業', department: '電子機械', quota: 22, finalApplicants: 23, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲工業', department: '建築', quota: 24, finalApplicants: 23, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲商業', department: '商業', quota: 68, finalApplicants: 36, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲商業', department: '情報処理', quota: 26, finalApplicants: 14, finalRate: 0.54, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲農林', department: '植物科学', quota: 23, finalApplicants: 17, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲農林', department: '環境科学', quota: 23, finalApplicants: 12, finalRate: 0.52, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲農林', department: '食品科学', quota: 23, finalApplicants: 25, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '出雲農林', department: '動物科学', quota: 23, finalApplicants: 17, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大社', department: '普通', quota: 138, finalApplicants: 160, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大社', department: '体育', quota: 14, finalApplicants: 10, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大田', department: '普通', quota: 98, finalApplicants: 70, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大田', department: '理数', quota: 34, finalApplicants: 18, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '邇摩', department: '総合学科', quota: 68, finalApplicants: 42, finalRate: 0.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '島根中央', department: '普通', quota: 55, finalApplicants: 33, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '矢上', department: '普通', quota: 44, finalApplicants: 16, finalRate: 0.36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '矢上', department: '産業技術', quota: 20, finalApplicants: 15, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '江津', department: '普通', quota: 43, finalApplicants: 37, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '江津工業', department: '機械・ロボット', quota: 21, finalApplicants: 7, finalRate: 0.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '江津工業', department: '建築・電気', quota: 27, finalApplicants: 7, finalRate: 0.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浜田', department: '普通', quota: 94, finalApplicants: 103, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浜田', department: '理数', quota: 23, finalApplicants: 7, finalRate: 0.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浜田商業', department: '商業(商業・情報処理)', quota: 48, finalApplicants: 40, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浜田水産', department: '海洋技術', quota: 22, finalApplicants: 7, finalRate: 0.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浜田水産', department: '食品流通', quota: 30, finalApplicants: 6, finalRate: 0.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '益田', department: '普通', quota: 106, finalApplicants: 103, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '益田', department: '理数', quota: 34, finalApplicants: 20, finalRate: 0.59, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '益田翔陽', department: '電子機械', quota: 22, finalApplicants: 14, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '益田翔陽', department: '電気', quota: 24, finalApplicants: 2, finalRate: 0.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '益田翔陽', department: '生物環境工学', quota: 22, finalApplicants: 7, finalRate: 0.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '益田翔陽', department: '総合学科', quota: 22, finalApplicants: 24, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉賀', department: '普通', quota: 24, finalApplicants: 0, finalRate: 0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津和野', department: '未来共創', quota: 44, finalApplicants: 50, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '隠岐', department: '普通', quota: 39, finalApplicants: 16, finalRate: 0.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '隠岐', department: '商業', quota: 24, finalApplicants: 15, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '隠岐島前', department: '普通(普通・地域共創)', quota: 50, finalApplicants: 20, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '隠岐水産', department: '海洋システム', quota: 20, finalApplicants: 10, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '隠岐水産', department: '海洋生産', quota: 29, finalApplicants: 6, finalRate: 0.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '皆美が丘女子', department: '普通', quota: 63, finalApplicants: 60, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '皆美が丘女子', department: '国際コミュニケーション', quota: 21, finalApplicants: 11, finalRate: 0.52, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '安来', department: '普通', quota: 138, finalApplicants: 83, finalRate: 0.6, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '安来', department: '情報科学(情報システム・情報処理・マルチメディア)', quota: 111, finalApplicants: 70, finalRate: 0.63, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江北', department: '普通', quota: 236, finalApplicants: 215, finalRate: 0.91, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江北', department: '理数', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江南', department: '普通', quota: 200, finalApplicants: 231, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江南', department: '探究科学', quota: 60, finalApplicants: 54, finalRate: 0.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江東', department: '普通', quota: 181, finalApplicants: 198, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江工業', department: '機械', quota: 34, finalApplicants: 27, finalRate: 0.79, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江工業', department: '電子機械', quota: 34, finalApplicants: 29, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江工業', department: '電気電子工学', quota: 30, finalApplicants: 31, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江工業', department: '情報クリエイター学', quota: 30, finalApplicants: 24, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江工業', department: '建築都市工学', quota: 33, finalApplicants: 25, finalRate: 0.76, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江商業', department: '商業(商業・国際ビジネス・情報処理)', quota: 147, finalApplicants: 126, finalRate: 0.86, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江農林', department: '生物生産', quota: 31, finalApplicants: 26, finalRate: 0.84, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江農林', department: '環境土木', quota: 33, finalApplicants: 28, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松江農林', department: '総合学科', quota: 53, finalApplicants: 61, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大東', department: '普通', quota: 80, finalApplicants: 43, finalRate: 0.54, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横田', department: '普通', quota: 67, finalApplicants: 44, finalRate: 0.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三刀屋', department: '総合学科', quota: 130, finalApplicants: 128, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '掛合', department: '普通', quota: 40, finalApplicants: 29, finalRate: 0.73, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '飯南', department: '普通', quota: 42, finalApplicants: 11, finalRate: 0.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '平田', department: '普通', quota: 125, finalApplicants: 140, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲', department: '普通', quota: 240, finalApplicants: 249, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲', department: '理数', quota: 32, finalApplicants: 43, finalRate: 1.34, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲工業', department: '機械', quota: 33, finalApplicants: 24, finalRate: 0.73, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲工業', department: '電気', quota: 32, finalApplicants: 20, finalRate: 0.63, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲工業', department: '電子機械', quota: 32, finalApplicants: 39, finalRate: 1.22, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲工業', department: '建築', quota: 29, finalApplicants: 29, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲商業', department: '商業', quota: 77, finalApplicants: 90, finalRate: 1.17, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲商業', department: '情報処理', quota: 27, finalApplicants: 23, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲農林', department: '植物科学', quota: 27, finalApplicants: 16, finalRate: 0.59, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲農林', department: '環境科学', quota: 36, finalApplicants: 20, finalRate: 0.56, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲農林', department: '食品科学', quota: 22, finalApplicants: 18, finalRate: 0.82, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '出雲農林', department: '動物科学', quota: 31, finalApplicants: 18, finalRate: 0.58, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大社', department: '普通', quota: 174, finalApplicants: 195, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大社', department: '体育', quota: 13, finalApplicants: 11, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大田', department: '普通', quota: 120, finalApplicants: 94, finalRate: 0.78, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大田', department: '理数', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '邇摩', department: '総合学科', quota: 110, finalApplicants: 83, finalRate: 0.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '島根中央', department: '普通', quota: 56, finalApplicants: 42, finalRate: 0.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '矢上', department: '普通', quota: 51, finalApplicants: 42, finalRate: 0.82, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '矢上', department: '産業技術', quota: 26, finalApplicants: 21, finalRate: 0.81, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '江津', department: '普通', quota: 71, finalApplicants: 47, finalRate: 0.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '江津工業', department: '機械・ロボット', quota: 37, finalApplicants: 8, finalRate: 0.22, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '江津工業', department: '建築・電気', quota: 33, finalApplicants: 18, finalRate: 0.55, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浜田', department: '普通', quota: 159, finalApplicants: 135, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浜田', department: '理数', quota: 31, finalApplicants: 19, finalRate: 0.61, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浜田商業', department: '商業(商業・情報処理)', quota: 56, finalApplicants: 47, finalRate: 0.84, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浜田水産', department: '海洋技術', quota: 28, finalApplicants: 14, finalRate: 0.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浜田水産', department: '食品流通', quota: 30, finalApplicants: 15, finalRate: 0.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '益田', department: '普通', quota: 120, finalApplicants: 95, finalRate: 0.79, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '益田', department: '理数', quota: 36, finalApplicants: 26, finalRate: 0.72, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '益田翔陽', department: '電子機械', quota: 34, finalApplicants: 9, finalRate: 0.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '益田翔陽', department: '電気', quota: 31, finalApplicants: 11, finalRate: 0.35, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '益田翔陽', department: '生物環境工学', quota: 22, finalApplicants: 25, finalRate: 1.14, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '益田翔陽', department: '総合学科', quota: 22, finalApplicants: 28, finalRate: 1.27, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '吉賀', department: '普通', quota: 13, finalApplicants: 8, finalRate: 0.62, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '津和野', department: '普通', quota: 56, finalApplicants: 20, finalRate: 0.36, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '隠岐', department: '普通', quota: 57, finalApplicants: 38, finalRate: 0.67, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '隠岐', department: '商業', quota: 30, finalApplicants: 29, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '隠岐島前', department: '普通(普通・地域共創)', quota: 50, finalApplicants: 22, finalRate: 0.44, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '隠岐水産', department: '海洋システム', quota: 30, finalApplicants: 22, finalRate: 0.73, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '隠岐水産', department: '海洋生産', quota: 37, finalApplicants: 16, finalRate: 0.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '皆美が丘女子', department: '普通', quota: 76, finalApplicants: 54, finalRate: 0.71, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '皆美が丘女子', department: '国際コミュニケーション', quota: 27, finalApplicants: 11, finalRate: 0.41, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '安来', department: '普通', quota: 138, finalApplicants: 120, finalRate: 0.87, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '安来', department: '情報科学(情報システム・情報処理・マルチメディア)', quota: 103, finalApplicants: 84, finalRate: 0.82, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江北', department: '普通', quota: 236, finalApplicants: 244, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江北', department: '理数', quota: 40, finalApplicants: 53, finalRate: 1.33, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江南', department: '普通', quota: 200, finalApplicants: 251, finalRate: 1.26, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江南', department: '探究科学', quota: 65, finalApplicants: 49, finalRate: 0.75, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江東', department: '普通', quota: 181, finalApplicants: 198, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江工業', department: '機械', quota: 32, finalApplicants: 21, finalRate: 0.66, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江工業', department: '電子機械', quota: 34, finalApplicants: 40, finalRate: 1.18, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江工業', department: '電気', quota: 37, finalApplicants: 30, finalRate: 0.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江工業', department: '電子', quota: 37, finalApplicants: 23, finalRate: 0.62, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江工業', department: '情報技術', quota: 22, finalApplicants: 41, finalRate: 1.86, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江工業', department: '建築都市工学', quota: 22, finalApplicants: 32, finalRate: 1.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江商業', department: '商業(商業・国際ビジネス・情報処理)', quota: 133, finalApplicants: 129, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江農林', department: '生物生産', quota: 30, finalApplicants: 33, finalRate: 1.10, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江農林', department: '環境土木', quota: 26, finalApplicants: 30, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松江農林', department: '総合学科', quota: 44, finalApplicants: 51, finalRate: 1.16, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大東', department: '普通', quota: 112, finalApplicants: 59, finalRate: 0.53, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横田', department: '普通', quota: 73, finalApplicants: 58, finalRate: 0.79, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三刀屋', department: '総合学科', quota: 136, finalApplicants: 131, finalRate: 0.96, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '掛合', department: '普通', quota: 40, finalApplicants: 24, finalRate: 0.60, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '飯南', department: '普通', quota: 48, finalApplicants: 37, finalRate: 0.77, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '平田', department: '普通', quota: 136, finalApplicants: 117, finalRate: 0.86, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲', department: '普通', quota: 240, finalApplicants: 261, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲', department: '理数', quota: 37, finalApplicants: 36, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲工業', department: '機械', quota: 36, finalApplicants: 29, finalRate: 0.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲工業', department: '電気', quota: 34, finalApplicants: 17, finalRate: 0.50, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲工業', department: '電子機械', quota: 33, finalApplicants: 36, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲工業', department: '建築', quota: 22, finalApplicants: 31, finalRate: 1.41, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲商業', department: '商業', quota: 77, finalApplicants: 68, finalRate: 0.88, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲商業', department: '情報処理', quota: 31, finalApplicants: 29, finalRate: 0.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲農林', department: '植物科学', quota: 26, finalApplicants: 30, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲農林', department: '環境科学', quota: 30, finalApplicants: 29, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲農林', department: '食品科学', quota: 22, finalApplicants: 27, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '出雲農林', department: '動物科学', quota: 22, finalApplicants: 25, finalRate: 1.14, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大社', department: '普通', quota: 183, finalApplicants: 212, finalRate: 1.16, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大社', department: '体育', quota: 14, finalApplicants: 14, finalRate: 1.00, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大田', department: '普通', quota: 120, finalApplicants: 88, finalRate: 0.73, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大田', department: '理数', quota: 40, finalApplicants: 44, finalRate: 1.10, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '邇摩', department: '総合学科', quota: 111, finalApplicants: 88, finalRate: 0.79, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '島根中央', department: '普通', quota: 75, finalApplicants: 48, finalRate: 0.64, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '矢上', department: '普通', quota: 42, finalApplicants: 46, finalRate: 1.10, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '矢上', department: '産業技術', quota: 26, finalApplicants: 23, finalRate: 0.88, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '江津', department: '普通', quota: 73, finalApplicants: 68, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '江津工業', department: '機械・ロボット', quota: 40, finalApplicants: 13, finalRate: 0.33, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '江津工業', department: '建築・電気', quota: 34, finalApplicants: 30, finalRate: 0.88, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浜田', department: '普通', quota: 156, finalApplicants: 141, finalRate: 0.90, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浜田', department: '理数', quota: 30, finalApplicants: 35, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浜田商業', department: '商業(商業・情報処理)', quota: 48, finalApplicants: 56, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浜田水産', department: '海洋技術', quota: 34, finalApplicants: 14, finalRate: 0.41, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浜田水産', department: '食品流通', quota: 38, finalApplicants: 10, finalRate: 0.26, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '益田', department: '普通', quota: 120, finalApplicants: 104, finalRate: 0.87, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '益田', department: '理数', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '益田翔陽', department: '電子機械', quota: 22, finalApplicants: 24, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '益田翔陽', department: '電気', quota: 26, finalApplicants: 7, finalRate: 0.27, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '益田翔陽', department: '生物環境工学', quota: 23, finalApplicants: 17, finalRate: 0.74, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '益田翔陽', department: '総合学科', quota: 27, finalApplicants: 17, finalRate: 0.63, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '吉賀', department: '普通', quota: 14, finalApplicants: 12, finalRate: 0.86, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '津和野', department: '普通', quota: 46, finalApplicants: 41, finalRate: 0.89, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '隠岐', department: '普通', quota: 51, finalApplicants: 37, finalRate: 0.73, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '隠岐', department: '商業', quota: 28, finalApplicants: 25, finalRate: 0.89, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '隠岐島前', department: '普通(普通・地域共創)', quota: 54, finalApplicants: 30, finalRate: 0.56, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '隠岐水産', department: '海洋システム', quota: 36, finalApplicants: 24, finalRate: 0.67, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '隠岐水産', department: '海洋生産', quota: 36, finalApplicants: 20, finalRate: 0.56, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '皆美が丘女子', department: '普通', quota: 79, finalApplicants: 83, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '皆美が丘女子', department: '国際コミュニケーション', quota: 26, finalApplicants: 7, finalRate: 0.27, fiscalYear: '令和5年度（2023年度）' },
  ],
};
