// 第2層（計算機にしない）県の解説ページ・データ登録簿。
//
// 相関図・相関表・割合・段階選抜・校別比重・総合判断のため、内申点＋当日点の単純合計では合否が出ない県。
// 計算機を偽造せず「制度・配点・なぜ単純計算できないか」を正直に解説する＝独自コンテンツ＝信頼の堀。
// 出典・配点はすべて令和8年度（2026年度）の県教委一次ソース調査（[[session 2026-06-13]]）に準拠。不明は持たない。

import type { TotalScoreExplainer } from './types';

const explainers: TotalScoreExplainer[] = [
  // ── Tier A（GSC実測で需要大） ──
  {
    code: 'ibaraki',
    name: '茨城県',
    routeSlug: 'total-score',
    localTerm: '共通選抜・特色選抜',
    fiscalYear: '2026',
    method: '校別比重',
    academic: { subjects: 5, perSubjectMax: 100, rawMax: 500, weightingNote: 'IT科・科学技術科で数学・理科を各校設定の傾斜' },
    report: { targetGrades: [1, 2, 3], rawMax: 135, note: '中1〜中3の9教科×5段階×3年＝135点（中3も通年評価）' },
    others: '特色選抜で面接・プレゼンテーション等（配点は各校設定）。',
    composition:
      '茨城県は、学力検査と「各教科の学習の記録（調査書）」の比重を各高校・学科が独自に定めて選抜します。比重そのものが公開されないため、内申点と当日点を一律の式で合計することはできません。',
    tier2Reason: '学力と調査書の比重が高校・学科ごとで非公開のため、単純計算不可。',
    source: {
      url: 'https://kyoiku.pref.ibaraki.jp/gakko/nyushi/highschool/page-37313/',
      docTitle: '令和8年度茨城県立高等学校入学者選抜実施要項・実施細則',
      lastChecked: '2026-06-13',
    },
    schoolBordersOmitted: true,
  },
  {
    code: 'kumamoto',
    name: '熊本県',
    routeSlug: 'total-score',
    localTerm: '前期（特色）選抜・後期（一般）選抜',
    fiscalYear: '2026',
    method: '総合判断',
    academic: { subjects: 5, perSubjectMax: 50, rawMax: 250, weightingNote: '県央学区などで英語・数学・理科を2倍にする学科あり（熊本第二理数科350点等）。後期は数学・英語にA/B選択問題' },
    report: { targetGrades: [1, 2, 3], note: '5教科は（中1＋中2＋中3×2）を学力検査得点で「補正」、実技4教科は（中1＋中2＋中3×2）を加算して総計点を作る独自方式' },
    others: '前期（特色）選抜は学校独自検査（面接・小論文・実技等、A群／B群）で学力検査なし。',
    composition:
      '熊本県の後期選抜は、学力検査の順位と調査書総計点の順位がともに募集人員以内の者を第1選考で合格とし、不足分は各校が定める選抜基準で選びます。5教科の調査書を学力検査得点で「補正」する独自方式のため、固定の合計式にはなりません。',
    tier2Reason: '「補正」方式かつ第1選考は順位・不足分は校別基準のため、単純計算不可。',
    source: {
      url: 'https://www.pref.kumamoto.jp/uploaded/life/244675_716277_misc.pdf',
      docTitle: '令和8年度熊本県立高等学校入学者選抜要項',
      lastChecked: '2026-06-13',
    },
    schoolBordersOmitted: true,
  },
  {
    code: 'mie',
    name: '三重県',
    routeSlug: 'total-score',
    localTerm: '前期選抜・後期選抜',
    fiscalYear: '2026',
    method: '段階選抜',
    academic: { subjects: 5, perSubjectMax: 50, rawMax: 250, weightingNote: '傾斜配点を行う学科・コースあり（各45分）' },
    report: { targetGrades: [1, 2, 3], rawMax: 135, note: '3年間の各教科評定合計135点（高校別実施要項による）。後期で使用' },
    others: '前期選抜は面接・自己表現・作文／小論文・実技・学力検査または総合問題から各校指定。',
    composition:
      '三重県の後期選抜は3段階。第1段階で調査書により選んだ者のうち学力検査等の上位約80％、第2段階で残り定員の2分の1を学力上位、第3段階で「特に重視する選抜資料等」により総合的に判断します。段階ごとに見る資料が変わるため、合計点では決まりません。',
    tier2Reason: '3段階選抜かつ最終段階が「総合的に判断」のため、単純計算不可。',
    source: {
      url: 'https://www.pref.mie.lg.jp/KOKOKYO/HP/m0204200379.htm',
      docTitle: '令和8年度三重県立高等学校入学者選抜実施要項',
      lastChecked: '2026-06-13',
    },
    schoolBordersOmitted: true,
  },
  {
    code: 'fukushima',
    name: '福島県',
    routeSlug: 'total-score',
    localTerm: '前期選抜（特色・一般）・後期選抜',
    fiscalYear: '2026',
    method: '校別比重',
    academic: { subjects: 5, note: '一般選抜で志願者の自己申告による傾斜配点が可能（ただし学力と調査書の比重を変える場合は傾斜配点を実施しない）。1教科の満点は要確認' },
    report: { targetGrades: [1, 2, 3], note: '対象学年・満点は各高校選抜方法一覧で要確認' },
    others: '特色選抜は学校ごとの検査。自己申告書は補助資料。',
    composition:
      '福島県の一般選抜は、高校ごとに学力検査と調査書の比重を設定して選抜します。具体的な比重・配点は各高校の選抜方法一覧で個別に公表されるため、県一律の合計式は存在しません。',
    tier2Reason: '比重が校別で「総合」判定のため単純計算不可。配点詳細は各校選抜方法一覧で要確認。',
    caveat: '令和8年度要綱本文での配点（学力満点・内申換算）の逐語確認は未完。各高校選抜方法一覧で確定値を要確認。',
    source: {
      url: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/709972.pdf',
      docTitle: '令和8年度福島県立高等学校入学者選抜実施要綱',
      lastChecked: '2026-06-13',
    },
    schoolBordersOmitted: true,
  },
  // ── Tier B（冬需要・種火） ──
  {
    code: 'shizuoka',
    name: '静岡県',
    routeSlug: 'total-score',
    localTerm: '学校裁量枠・共通枠',
    fiscalYear: '2026',
    method: '段階選抜',
    academic: { subjects: 5, weightingNote: '共通枠は専門学科で2倍まで傾斜可。1教科の満点は標準' },
    report: { targetGrades: [3], rawMax: 45, note: '中3の第2学期末までの9教科5段階＝内申素点45点' },
    others: '面接（全員）。学校裁量枠で実技・作文・適応力検査等（校別）。',
    composition:
      '静岡県の一般選抜は、各校が独自方法で先に合格を決める「学校裁量枠（定員50％以内）」と「共通枠」に分かれます。共通枠も3段階（第1段階で調査書9教科評定の上位者から学力上位75％程度、第2段階で学習記録以外＋面接で10％程度、第3段階で総合審査15％程度）で、合計点では決まりません。',
    tier2Reason: '学校裁量枠＋共通枠の3段階審査のため、単純計算不可。',
    source: {
      url: 'https://www.pref.shizuoka.jp/kodomokyoiku/school/kyoiku/1003764/1003891/1072279.html',
      docTitle: '令和8年度静岡県公立高等学校入学者選抜関係発表資料',
      lastChecked: '2026-06-13',
    },
    schoolBordersOmitted: true,
  },
  {
    code: 'hiroshima',
    name: '広島県',
    routeSlug: 'total-score',
    localTerm: '一次選抜（一般枠・特色枠）',
    fiscalYear: '2026',
    method: '割合方式',
    academic: { subjects: 5, perSubjectMax: 50, rawMax: 250, weightingNote: '2倍まで傾斜可' },
    report: { targetGrades: [1, 2, 3], rawMax: 225, note: '中1・中2は評定のまま、中3は×3。合計225点（中1:中2:中3＝1:1:3）' },
    others: '自己表現（自己表現カードを活用した個人面談。検査官1人15点×2〜3人）。特色枠で学校独自検査。',
    composition:
      '広島県は基本方針で「学力検査：調査書：自己表現＝6：2：2」を基本と定めて1000点満点に換算します。比率は公開されていますが、自己表現が検査官による主観評価であり、特色枠は学校独自の比重（1000／1100／1200点満点）になるため、入力値から総合得点を一意に再現することはできません。',
    tier2Reason: '6:2:2は公開だが自己表現が主観評価＋特色枠が校別比重のため、単純計算不可。',
    source: {
      url: 'https://www.pref.hiroshima.lg.jp/site/kyouiku/08senior-2nd-r8-nyuushi-r8-kou-r8-kou-mokuji-r8-kou-mokuji.html',
      docTitle: '令和8年度広島県公立高等学校入学者選抜実施要項・基本方針',
      lastChecked: '2026-06-13',
    },
    schoolBordersOmitted: true,
  },
  {
    code: 'okinawa',
    name: '沖縄県',
    routeSlug: 'total-score',
    localTerm: '特色選抜・一般選抜',
    fiscalYear: '2026',
    method: '割合方式',
    academic: { subjects: 5, weightingNote: '傾斜・実技検査あり。1教科の満点は標準' },
    report: { targetGrades: [1, 2, 3], rawMax: 165, note: '中1〜中3。5教科5段階＋実技4教科5段階×1.5、各55点・合計165点' },
    others: '面接（全員）。学科により実技・適性検査。',
    composition:
      '沖縄県は調査書と学力検査等の比重を原則5:5とし、一部の高校で4:6〜6:4の範囲で変更します。比重の幅と総合判断、換算式が非公開のため、入力値から一律に総合得点を出すことはできません。',
    tier2Reason: '比重が校別の範囲設定＋換算式非公開のため、単純計算不可。',
    source: {
      url: 'https://www.pref.okinawa.jp/kyoiku/gakko/1008883/1008887/1035054.html',
      docTitle: '令和8年度県立高等学校入試関連情報（調査書と学力検査等の比重一覧）',
      lastChecked: '2026-06-13',
    },
    schoolBordersOmitted: true,
  },
  {
    code: 'nagasaki',
    name: '長崎県',
    routeSlug: 'total-score',
    localTerm: '特別選抜・一般選抜・チャレンジ選抜',
    fiscalYear: '2026',
    method: '校別比重',
    academic: { subjects: 5, perSubjectMax: 100, rawMax: 500, weightingNote: '数学・英語に難易度別選択問題。傾斜配点あり（長崎西理系で英数2倍・国理1.5倍 等）' },
    report: { targetGrades: [1, 2, 3], note: '中1〜中3の9教科5段階。「主体的に学習に取り組む態度」を重点評価。内申素点・換算は各校で比重設定（要確認）' },
    others: '面接（対面または紙上）。特別選抜は面接・プレゼンテーションから各校選択。',
    composition:
      '長崎県は調査書・学力検査・面接の比重を各高校が定めて選抜します。比重が高校ごとに異なり総合的に判断されるため、県一律の合計式は存在しません。',
    tier2Reason: '比重が校別・「総合的に判断」のため、単純計算不可。',
    source: {
      url: 'https://www.pref.nagasaki.jp/bunrui/kanko-kyoiku-bunka/shochuko/koko-nyushi/koko-yoryo/746842.html',
      docTitle: '令和8年度長崎県公立高等学校入学者選抜実施要領',
      lastChecked: '2026-06-13',
    },
    schoolBordersOmitted: true,
  },
  {
    code: 'miyagi',
    name: '宮城県',
    routeSlug: 'total-score',
    localTerm: '共通選抜・特色選抜（相関図方式）',
    fiscalYear: '2026',
    method: '相関図',
    academic: { subjects: 5, perSubjectMax: 100, rawMax: 500, weightingNote: '特色選抜は教科ごと0.25〜2.0倍に換算' },
    report: { targetGrades: [1, 2, 3], rawMax: 195, note: '共通選抜は5教科評定合計＋実技4教科評定合計×2＝195点。特色選抜は5教科0.25〜2.0倍・実技4教科0.5〜4.0倍' },
    others: '特色選抜で面接・実技・作文（配点は校別）。',
    composition:
      '宮城県の共通選抜は、要項に「学力検査点と調査書点の相関図を基に、その両方の満点により近い者を上位として、上位の者から審査し、共通選抜の募集人数分を選抜する」と明記された相関図方式です。学力500点と調査書195点を2軸にプロットし、比重（7:3／6:4／5:5／4:6／3:7）は学校・学科が設定するため、合計点1つでは合否が決まりません。',
    tier2Reason: '公文書で明示された相関図方式・「総合的に審査」のため、単純計算不可（第2層の代表例）。',
    source: {
      url: 'https://www.pref.miyagi.jp/site/sub-jigyou/',
      docTitle: '宮城県公立高等学校入学者選抜 入試制度説明資料',
      lastChecked: '2026-06-13',
    },
    schoolBordersOmitted: true,
  },
];

/** 第2層・解説ページの登録簿（code → explainer）。 */
export const TOTAL_SCORE_EXPLAINERS: Record<string, TotalScoreExplainer> = Object.fromEntries(
  explainers.map((e) => [e.code, e]),
);

export const EXPLAINER_CODES = Object.keys(TOTAL_SCORE_EXPLAINERS);

export function getExplainer(code: string): TotalScoreExplainer | undefined {
  return TOTAL_SCORE_EXPLAINERS[code];
}
