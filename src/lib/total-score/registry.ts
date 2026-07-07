// 第1層（計算可能）県の総合得点システム登録簿。
//
// ここに載った県だけが /[prefecture]/total-score 動的ルートで計算機として公開される（allowlist）。
// 未検証・第2層の県は載せない＝未検証県は404（信頼の堀）。
//
// 出典・配点はすべて令和8年度（2026年度）の県教委一次ソースで確認したもの（[[session 2026-06-13 研究]]）。
// 二次情報どまりの県（大分ほか）は確定するまで載せない。

import type { TotalScoreSystem } from './types';
import { CURRENT_FISCAL_YEAR_STRING } from '@/lib/fiscal-year';

/** 兵庫県：判定資料A（内申250）＝判定資料C（学力250）を同等に扱う固定1:1。総合500点。 */
const hyogo: TotalScoreSystem = {
  code: 'hyogo',
  name: '兵庫県',
  routeSlug: 'total-score',
  localTerm: '判定資料（複数志願選抜）',
  fiscalYear: CURRENT_FISCAL_YEAR_STRING,
  academic: { subjects: 5, perSubjectMax: 100, rawMax: 500, weightingNote: '一部学科で傾斜配点あり' },
  report: {
    targetGrades: [3],
    perGradeMax: 5,
    coreMultiplier: 4,
    practicalMultiplier: 7.5,
    rawMax: 250,
    note: '第3学年のみ。5教科評定和×4（=100）＋実技4教科評定和×7.5（=150）＝判定資料A 250点',
  },
  ratioOptions: [{ id: 'standard', label: '判定資料A・C 同等（内申250：学力250）', reportMax: 250, academicMax: 250 }],
  overview:
    '兵庫県の公立高校一般入試（複数志願選抜）は、内申点から作る「判定資料A」（250点）と、学力検査から作る「判定資料C」（250点）を同等に取り扱い、合計500点で合否を判定します。内申は中3の成績だけが対象で、5教科は評定の和を4倍、実技4教科は評定の和を7.5倍する独特の換算が特徴です。第1志望者には学区別の「第1志望加算点」が上乗せされます。',
  computeSteps: [
    '判定資料A（内申）＝中3の主要5教科の評定合計×4（最大100点）＋実技4教科の評定合計×7.5（最大150点）＝最大250点。',
    '判定資料C（学力）＝5教科×100点＝500点満点の学力検査を×0.5して250点に換算。',
    '判定資料A（250）と判定資料C（250）を同等に扱い合計＝総合500点満点。',
    '第1志望の受験生には学区ごとに定められた「第1志望加算点」を加算する。',
  ],
  faqs: [
    {
      q: '兵庫県の公立高校入試で内申点と当日点の比率は？',
      a: '兵庫県の複数志願選抜では、内申点（判定資料A・250点）と学力検査（判定資料C・250点）を同等＝1:1で扱い、合計500点満点で合否を判定します。県内一律の比率で、高校ごとに比率が変わることはありません。',
    },
    {
      q: '兵庫県の内申点は中1・中2も入りますか？',
      a: '入りません。兵庫県の判定資料Aに使う内申点は中学3年生の成績のみが対象です。5教科の評定合計を4倍、実技4教科の評定合計を7.5倍して、最大250点に換算します。',
    },
    {
      q: '実技4教科の評定が7.5倍されるのはなぜ？',
      a: '兵庫県では実技4教科（音楽・美術・保健体育・技術家庭）を重視しており、評定合計（最大20）を7.5倍して最大150点とします。5教科は4倍で最大100点なので、内申250点のうち実技が150点と過半を占めるのが兵庫の大きな特徴です。',
    },
    {
      q: '第1志望加算点とは何ですか？',
      a: '複数志願選抜では第1志望・第2志望を出願でき、第1志望の高校を受ける受験生には学区ごとに定められた加算点が総合得点に上乗せされます。第1志望を有利にする仕組みで、加算点は学区により異なります。',
    },
  ],
  examples: [
    { label: '内申オール4（5教科20×4＋実技16×7.5＝200）・当日点350点なら', academicRaw: 350, reportRaw: 200 },
    { label: '内申オール5（満点250）・当日点420点なら', academicRaw: 420, reportRaw: 250 },
  ],
  source: {
    url: 'https://www2.hyogo-c.ed.jp/hpe/koko/nyuushi/senbatsuyoukou_r8/',
    docTitle: '令和8年度兵庫県公立高等学校入学者選抜要綱',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 京都府（中期選抜）：報告書195点＋学力200点を同等に扱う固定式。総合395点。 */
const kyoto: TotalScoreSystem = {
  code: 'kyoto',
  name: '京都府',
  routeSlug: 'total-score',
  localTerm: '中期選抜',
  fiscalYear: CURRENT_FISCAL_YEAR_STRING,
  academic: { subjects: 5, perSubjectMax: 40, rawMax: 200 },
  report: {
    targetGrades: [1, 2, 3],
    perGradeMax: 5,
    coreMultiplier: 1,
    practicalMultiplier: 2,
    rawMax: 195,
    note: '中1〜中3。5教科＝各5×5教科×3年=75、実技4教科＝各5×2倍×4教科×3年=120、計195点',
  },
  ratioOptions: [{ id: 'standard', label: '報告書195：学力200（同等）', reportMax: 195, academicMax: 200 }],
  overview:
    '京都府の公立高校「中期選抜」は、報告書（内申）195点と学力検査200点をほぼ同等に扱い、合計395点で合否を判定します。内申は中1〜中3の全学年が対象で、5教科は評定そのまま（各5点×5教科×3年＝75点）、実技4教科は評定を2倍（各5点×2×4教科×3年＝120点）して合計195点。学力検査は5教科×40点＝200点です。前期選抜は学校ごとに配点が違うため計算できません（このページは中期選抜の計算です）。',
  computeSteps: [
    '報告書点（内申）＝主要5教科の評定（中1〜中3で各5点×5×3＝75点）＋実技4教科の評定×2（各5点×2×4×3＝120点）＝195点満点。',
    '学力検査＝5教科×40点＝200点満点。',
    '報告書195点と学力200点を同等に扱い、第1次選考で両方の順位がともに募集定員内の者を合格とする。',
    '総合の目安＝報告書点＋学力点＝最大395点。',
  ],
  faqs: [
    {
      q: '京都の中期選抜は内申と当日点どちらが重い？',
      a: '京都の中期選抜は報告書（内申）195点と学力検査200点をほぼ同等（おおむね1:1）で扱います。わずかに学力検査が5点多い395点満点ですが、実質的に内申と当日点が同じ重みです。',
    },
    {
      q: '京都の内申点は中1から計算されますか？',
      a: 'はい。京都府の報告書点は中学1年〜3年の全学年が対象です。主要5教科は評定そのまま、実技4教科は評定を2倍して計算するため、全学年でバランスよく成績を取ることが重要です。',
    },
    {
      q: '前期選抜の総合得点は計算できますか？',
      a: '前期選抜は報告書・学力検査・面接・作文・実技などの項目と配点を高校ごとに自由に設定するため、京都府一律の計算式がありません。当ツールで計算できるのは配点が共通の中期選抜です。前期は志望校の募集要項で配点をご確認ください。',
    },
    {
      q: '令和9年度から京都の入試制度は変わりますか？',
      a: '京都府は令和9年度入試から前期選抜と中期選抜を一本化する予定です。令和8年度（2026年度）入試は従来どおり前期・中期・後期の方式で、このページは令和8年度の中期選抜に対応しています。',
    },
  ],
  examples: [
    { label: '内申オール4相当（報告書156）・当日点150点なら', academicRaw: 150, reportRaw: 156 },
    { label: '内申満点（195）・当日点170点なら', academicRaw: 170, reportRaw: 195 },
  ],
  source: {
    url: 'https://www.kyoto-be.ne.jp/koukyou/cms/?p=7836',
    docTitle: '令和8年度京都府公立高等学校入学者選抜要項（中期選抜）',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 栃木県：内申135点を500点換算し、学力500点と「内申:学力」9:1〜5:5の比率で合算。総合500点。 */
const tochigi: TotalScoreSystem = {
  code: 'tochigi',
  name: '栃木県',
  routeSlug: 'total-score',
  localTerm: '一般選抜',
  fiscalYear: CURRENT_FISCAL_YEAR_STRING,
  academic: { subjects: 5, perSubjectMax: 100, rawMax: 500, weightingNote: '宇都宮・宇都宮女子等で国数英（社）に傾斜' },
  report: {
    targetGrades: [1, 2, 3],
    perGradeMax: 5,
    coreMultiplier: 1,
    practicalMultiplier: 1,
    rawMax: 135,
    note: '中1〜中3 9教科×5段階×3年=135点を500点に換算',
  },
  ratioOptions: [
    { id: '9-1', label: '内申9：学力1', reportMax: 450, academicMax: 50 },
    { id: '8-2', label: '内申8：学力2', reportMax: 400, academicMax: 100 },
    { id: '7-3', label: '内申7：学力3', reportMax: 350, academicMax: 150 },
    { id: '6-4', label: '内申6：学力4', reportMax: 300, academicMax: 200 },
    { id: '5-5', label: '内申5：学力5', reportMax: 250, academicMax: 250 },
  ],
  overview:
    '栃木県の公立高校一般選抜は、内申点（調査書）と学力検査を、高校ごとに「内申：学力＝9:1〜5:5」のいずれかの比率で合算します。内申は中1〜中3の9教科×5段階×3年＝135点を、選んだ比率に応じた満点に換算。学力検査は5教科×100点＝500点満点です。上位80％は原則合格、残りは調査書の記載事項・面接等で総合判定するため、計算結果は1次審査の目安になります。',
  computeSteps: [
    '内申点（調査書）＝中1〜中3の9教科×5段階×3年＝135点満点を、選んだ比率の内申満点に換算する。',
    '学力検査＝5教科×100点＝500点満点を、選んだ比率の学力満点に換算する。',
    '志望校の比率（9:1〜5:5）を選び、換算した内申点と学力点を合計＝総合500点満点。',
    '総合得点の上位約80％を第1次で原則合格、残り約20％は調査書の記載事項・面接等で総合的に判定する。',
  ],
  faqs: [
    {
      q: '栃木県の公立高校で内申と当日点の比率はどう決まる？',
      a: '栃木県は高校・学科ごとに「内申：学力」の比率を9:1・8:2・7:3・6:4・5:5の5段階から設定します。進学校ほど学力重視（5:5寄り）の傾向があり、志望校がどの比率かは各校の選抜要項で確認できます。当ツールでは比率を選んで総合得点を計算できます。',
    },
    {
      q: '栃木県の内申点は何年生から対象ですか？',
      a: '中学1年〜3年の3年間が対象です。9教科×5段階×3年＝135点満点で、これを志望校の比率に応じた満点（例：5:5なら250点）に換算して学力検査と合算します。',
    },
    {
      q: '総合得点が上位80%に入れば必ず合格ですか？',
      a: '原則として上位約80％は合格となりますが、残り約20％は調査書の記載事項（特別活動・出欠など）や面接等を加えて総合的に判定します。総合得点はあくまで第1次審査の目安で、ボーダー付近では点数以外の要素も見られます。',
    },
    {
      q: '栃木県の入試制度は令和9年度から変わりますか？',
      a: '栃木県は令和9年度入試から制度変更が予告されています。令和8年度（2026年度）入試は特色選抜（2月）と一般選抜（3月5日）の方式で、このページは令和8年度の一般選抜に対応しています。',
    },
  ],
  examples: [
    { label: '進学校（5:5）・内申オール4（108）・当日点380点なら', academicRaw: 380, reportRaw: 108, ratioOptionId: '5-5' },
    { label: '内申重視校（7:3）・内申満点（135）・当日点300点なら', academicRaw: 300, reportRaw: 135, ratioOptionId: '7-3' },
  ],
  source: {
    url: 'https://www.pref.tochigi.lg.jp/m04/r08/r08_kennritukoutougakkounyuugakushasennbatunikannsuruosirase.html',
    docTitle: '令和8（2026）年度栃木県立高等学校入学者選抜要項',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 新潟県：調査書135点・学力500点をそれぞれ1000点に換算し、「調査書:学力」7:3〜3:7で合算。総合1000点。 */
const niigata: TotalScoreSystem = {
  code: 'niigata',
  name: '新潟県',
  routeSlug: 'total-score',
  localTerm: '一般選抜',
  fiscalYear: CURRENT_FISCAL_YEAR_STRING,
  academic: { subjects: 5, perSubjectMax: 100, rawMax: 500, weightingNote: '一部校で英語・数学等を2倍に傾斜' },
  report: {
    targetGrades: [1, 2, 3],
    perGradeMax: 5,
    coreMultiplier: 1,
    practicalMultiplier: 1,
    rawMax: 135,
    note: '中1〜中3 9教科×5×3年=135点。調査書・学力をそれぞれ1000点に換算して比率で合算（学校独自検査は別途加算）',
  },
  ratioOptions: [
    { id: '7-3', label: '調査書7：学力3', reportMax: 700, academicMax: 300 },
    { id: '6-4', label: '調査書6：学力4', reportMax: 600, academicMax: 400 },
    { id: '5-5', label: '調査書5：学力5', reportMax: 500, academicMax: 500 },
    { id: '4-6', label: '調査書4：学力6', reportMax: 400, academicMax: 600 },
    { id: '3-7', label: '調査書3：学力7', reportMax: 300, academicMax: 700 },
  ],
  overview:
    '新潟県の公立高校一般選抜は、調査書（内申）135点と学力検査500点をそれぞれ1000点満点に換算し、高校ごとの比率（調査書：学力＝7:3〜3:7）で合算します。内申は中1〜中3の9教科×5段階×3年＝135点が対象。学力検査は5教科×100点＝500点です。多くの学校が学校独自検査を実施し、その結果は別途加算されます（このページは調査書＋学力の本体部分の計算です）。',
  computeSteps: [
    '調査書点（内申）＝中1〜中3の9教科×5段階×3年＝135点満点を、1000点満点に換算する。',
    '学力検査＝5教科×100点＝500点満点を、1000点満点に換算する。',
    '志望校の比率（α:β＝0.7:0.3〜0.3:0.7）で、換算した調査書点と学力点を合算する。',
    '学校独自検査（100〜500点のいずれか）を実施する高校では、その結果を別途加算する。',
  ],
  faqs: [
    {
      q: '新潟県の公立高校で内申と当日点の比率は？',
      a: '新潟県は調査書と学力検査をそれぞれ1000点に換算し、高校ごとに比率（α:β）を0.7:0.3／0.6:0.4／0.5:0.5／0.4:0.6／0.3:0.7の5段階から設定します。学力重視の高校は学力側のβを大きく取ります。志望校の比率は各校の選抜方法で確認できます。',
    },
    {
      q: '新潟県の内申点は何年生から対象ですか？',
      a: '中学1年〜3年の3年間が対象です。9教科×5段階×3年＝135点満点を1000点に換算して使います。中1からの積み重ねが効くため、早い学年から評定を取ることが大切です。',
    },
    {
      q: '学校独自検査とは何ですか？総合得点にどう影響しますか？',
      a: '新潟県の多くの高校は、調査書＋学力検査に加えて学校独自検査（満点は100・200・300・400・500点のいずれか）を実施します。その結果は本体の総合得点に別途加算されるため、独自検査の配点が大きい高校ほど当日の出来が合否を左右します。',
    },
    {
      q: '新潟県の特色化選抜はなくなりますか？',
      a: '新潟県は令和9年度入試から特色化選抜を廃止する予定です。令和8年度（2026年度）入試では一般選抜（3月4日学力検査・5日独自検査）と特色化選抜があり、このページは令和8年度の一般選抜に対応しています。',
    },
  ],
  examples: [
    { label: '標準校（5:5）・内申オール4（108）・当日点350点なら', academicRaw: 350, reportRaw: 108, ratioOptionId: '5-5' },
    { label: '学力重視校（3:7）・内申満点（135）・当日点400点なら', academicRaw: 400, reportRaw: 135, ratioOptionId: '3-7' },
  ],
  source: {
    url: 'https://www.pref.niigata.lg.jp/uploaded/attachment/472931.pdf',
    docTitle: '令和8年度新潟県公立高等学校入学者選抜要項',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 鳥取県：第3学年のみ内申（実技2倍）65点を各校倍率α=2〜4で130〜260点に拡大し、学力250点と合算。 */
const tottori: TotalScoreSystem = {
  code: 'tottori',
  name: '鳥取県',
  routeSlug: 'total-score',
  localTerm: '一般入学者選抜',
  fiscalYear: CURRENT_FISCAL_YEAR_STRING,
  academic: { subjects: 5, perSubjectMax: 50, rawMax: 250, weightingNote: '理数科・総合学科で傾斜あり' },
  report: {
    targetGrades: [3],
    perGradeMax: 5,
    coreMultiplier: 1,
    practicalMultiplier: 2,
    rawMax: 65,
    note: '第3学年のみ。5教科＋実技4教科×2＝65点を、各校設定の倍率α（2〜4）で130〜260点に拡大',
  },
  ratioOptions: [
    { id: 'a2', label: '内申130：学力250（α=2）', reportMax: 130, academicMax: 250 },
    { id: 'a3', label: '内申195：学力250（α=3）', reportMax: 195, academicMax: 250 },
    { id: 'a4', label: '内申260：学力250（α=4）', reportMax: 260, academicMax: 250 },
  ],
  overview:
    '鳥取県の公立高校一般入学者選抜は、内申点（調査書）と学力検査250点を合算します。内申は中3のみが対象で、9教科を5段階評価し実技4教科を2倍した65点を基礎点とし、これに高校ごとの倍率α（2・3・4）を掛けて130点・195点・260点のいずれかに拡大します。学力検査は5教科×50点＝250点。αが大きい高校ほど内申点の比重が高くなります。',
  computeSteps: [
    '内申の基礎点＝中3の主要5教科の評定（最大25）＋実技4教科の評定×2（最大40）＝65点。',
    '志望校の倍率α（2・3・4）を掛けて、内申点を130点（α=2）・195点（α=3）・260点（α=4）に拡大する。',
    '学力検査＝5教科×50点＝250点満点。',
    '拡大した内申点と学力検査250点を合算する（内申:学力＝おおむね8:2〜2:8の幅で各校設定）。',
  ],
  faqs: [
    {
      q: '鳥取県の公立高校で内申と当日点の比重は？',
      a: '鳥取県は内申の基礎点65点に高校ごとの倍率α（2〜4）を掛けて130・195・260点に拡大し、学力検査250点と合算します。α=4の高校は内申260点：学力250点とほぼ内申重視、α=2の高校は内申130点：学力250点と学力重視になります。',
    },
    {
      q: '鳥取県の内申点は中1・中2も入りますか？',
      a: '入りません。鳥取県の合否に使う内申点は中学3年生のみが対象です。主要5教科の評定（最大25）に、実技4教科の評定を2倍したもの（最大40）を足した65点が基礎点になります。',
    },
    {
      q: '実技4教科が2倍されるのはなぜ？',
      a: '鳥取県は実技4教科（音楽・美術・保健体育・技術家庭）を重視し、評定を2倍します。基礎点65点のうち実技が40点を占めるため、主要5教科だけでなく実技の評定も内申点に大きく影響します。',
    },
    {
      q: '倍率αは志望校でどう違いますか？',
      a: 'αは高校・学科ごとに2・3・4のいずれかが設定されます。内申を重視する高校はα=4（内申260点）、学力を重視する高校はα=2（内申130点）を選ぶ傾向があります。志望校のαは募集要項で確認し、当ツールで該当する比率を選んで計算してください。',
    },
  ],
  examples: [
    { label: '学力重視校（α=2）・内申オール4（52）・当日点190点なら', academicRaw: 190, reportRaw: 52, ratioOptionId: 'a2' },
    { label: '内申重視校（α=4）・内申満点（65）・当日点180点なら', academicRaw: 180, reportRaw: 65, ratioOptionId: 'a4' },
  ],
  source: {
    url: 'https://www.pref.tottori.lg.jp/',
    docTitle: '令和8年度鳥取県立高等学校入学者選抜実施要項',
    lastChecked: '2026-06-13',
  },
  schoolBordersOmitted: true,
};

/** 第1層・検証済みの県（allowlist）。 */
export const TOTAL_SCORE_SYSTEMS: Record<string, TotalScoreSystem> = {
  hyogo,
  kyoto,
  tochigi,
  niigata,
  tottori,
};

export const VERIFIED_TOTAL_SCORE_CODES = Object.keys(TOTAL_SCORE_SYSTEMS);

export function getTotalScoreSystem(code: string): TotalScoreSystem | undefined {
  return TOTAL_SCORE_SYSTEMS[code];
}

/** 計算機として公開してよい県か（未検証＝404 の判定に使う）。 */
export function isVerifiedTotalScore(code: string): boolean {
  return Object.prototype.hasOwnProperty.call(TOTAL_SCORE_SYSTEMS, code);
}
