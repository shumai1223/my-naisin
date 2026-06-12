/**
 * 内申点クイックアンサー（自社データの決定論的Q&A・堀B/GEO）。
 *
 * LLMを使わず、検証済みの naishin-dataset（満点・対象学年・倍率・計算式・オール3/4/5の確定値）と
 * 少数のキュレーションFAQだけから「正しい一次データ」を返す。捏造ゼロ・端末内完結。
 * 自信のあるマッチのみ回答し、外したときは null（UI側で関連ツールへ誘導）。
 */

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { buildPrefectureDetail } from '@/lib/naishin-dataset';
import { hensachiToUpperPercent, hensachiToRank, tierForHensachi } from '@/lib/hensachi';

export interface AnswerLink {
  href: string;
  label: string;
}

export interface AnswerResult {
  kind: 'prefecture' | 'general';
  /** マッチした見出し（県名や用語） */
  title: string;
  /** 簡潔な回答（1〜3文） */
  answer: string;
  /** 箇条書きの補足 */
  details?: string[];
  /** 該当ツール/ページへの導線 */
  links: AnswerLink[];
  /** 出典（県の一次情報など） */
  source?: { name?: string; url?: string };
}

const SUFFIX_RE = /[都道府県]$/;

function normalize(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, '');
}

/** クエリから都道府県を特定（フル名→英語code→接尾辞なし名 の優先順）。 */
export function detectPrefectureCode(query: string): string | null {
  const q = query.trim();
  const qLower = q.toLowerCase();

  // 1) フル名（「東京都」「京都府」など）。最長一致を優先（東京都 vs 京都 の誤爆回避）。
  let best: { code: string; len: number } | null = null;
  for (const p of PREFECTURES) {
    if (q.includes(p.name) && (!best || p.name.length > best.len)) {
      best = { code: p.code, len: p.name.length };
    }
  }
  if (best) return best.code;

  // 2) 英語コード（tokyo / hyogo …）
  for (const p of PREFECTURES) {
    if (qLower.includes(p.code)) return p.code;
  }

  // 3) 接尾辞（都道府県）を除いた名（「兵庫」「京都」など）。最長一致を優先。
  for (const p of PREFECTURES) {
    const short = p.name.replace(SUFFIX_RE, '');
    if (short.length >= 2 && q.includes(short) && (!best || short.length > best.len)) {
      best = { code: p.code, len: short.length };
    }
  }
  return best ? best.code : null;
}

type Intent =
  | 'maxScore'
  | 'targetGrades'
  | 'practical'
  | 'formula'
  | { all: number }
  | 'overview';

function detectIntent(nq: string): Intent {
  const all = nq.match(/オール([3-5])/);
  if (all) return { all: Number(all[1]) };
  if (/(満点|何点)/.test(nq)) return 'maxScore';
  if (/(対象学年|何年|中[123]|学年)/.test(nq)) return 'targetGrades';
  if (/(実技|副教科|倍率|傾斜)/.test(nq)) return 'practical';
  if (/(計算|方法|出し方|どうやって|式)/.test(nq)) return 'formula';
  return 'overview';
}

function prefectureAnswer(code: string, nq: string): AnswerResult | null {
  const detail = buildPrefectureDetail(code);
  const p = getPrefectureByCode(code);
  if (!detail || !p) return null;

  const links: AnswerLink[] = [
    { href: `/${code}/naishin`, label: `${p.name}の内申点を自動計算する` },
  ];
  const source = detail.source?.url
    ? { name: detail.source.title, url: detail.source.url }
    : undefined;

  const intent = detectIntent(nq);
  const gradeList = p.targetGrades.map((g) => `中${g}`).join('・');

  const base = (answer: string, details?: string[]): AnswerResult => ({
    kind: 'prefecture',
    title: p.name,
    answer,
    details,
    links,
    source,
  });

  if (typeof intent === 'object') {
    const ex = detail.examples.find((e) => e.eachSubjectGrade === intent.all);
    if (ex) {
      return base(
        `${p.name}でオール${intent.all}（9教科すべて${intent.all}）の場合、内申点は ${ex.total}点 / ${ex.max}点満点（達成率${Math.round(ex.percent)}%）です。`,
        detail.examples.map((e) => `オール${e.eachSubjectGrade}：${e.total} / ${e.max}点（${Math.round(e.percent)}%）`),
      );
    }
  }

  switch (intent) {
    case 'maxScore':
      return base(`${p.name}の内申点（調査書点）の満点は ${p.maxScore}点 です。`, [
        `対象学年：${gradeList}`,
        detail.formula.summary,
      ]);
    case 'targetGrades':
      return base(
        `${p.name}で内申点の対象になる学年は ${gradeList} です。`,
        p.targetGrades.map((g) => `中${g}：×${p.gradeMultipliers[g] ?? 1}`),
      );
    case 'practical':
      return base(
        `${p.name}では、主要5教科の評定が×${p.coreMultiplier}、実技4教科の評定が×${p.practicalMultiplier} で換算されます。`,
        [p.practicalMultiplier > p.coreMultiplier ? '実技4教科の比重が大きいため、実技の評定アップが効率的です。' : '主要5教科と実技4教科は同じ重みです。'],
      );
    case 'formula':
      return base(detail.formula.summary, [
        `満点：${p.maxScore}点`,
        `対象学年：${gradeList}`,
      ]);
    case 'overview':
    default:
      return base(
        `${p.name}の内申点は ${p.maxScore}点満点（対象学年：${gradeList}）。${detail.formula.summary}`,
        detail.examples.map((e) => `オール${e.eachSubjectGrade}：${e.total} / ${e.max}点`),
      );
  }
}

/** 都道府県に紐づかない一般的な質問のキュレーション回答。 */
const GENERAL_FACTS: { test: RegExp; result: Omit<AnswerResult, 'kind'> }[] = [
  {
    test: /換算内申/,
    result: {
      title: '換算内申とは',
      answer:
        '換算内申は、入試で使うために評定を都道府県の方式で点数化したものです。例えば東京都は「主要5教科×1＋実技4教科×2＝最大65点」を300点満点に換算します。',
      links: [
        { href: '/tokyo/naishin', label: '東京都の換算内申を計算する' },
        { href: '/blog/tokyo-kansan-naishin-guide', label: '換算内申の計算方法を詳しく見る' },
      ],
    },
  },
  {
    test: /(推薦.*評定|評定.*推薦|推薦基準|指定校|併願優遇|総合型)/,
    result: {
      title: '推薦に必要な評定平均',
      answer:
        '高校受験の推薦は上位校で4.0〜4.5以上、中堅校で3.3〜3.8前後、私立の併願優遇は最低3.0〜3.5以上が一般的な目安です。大学の指定校推薦は中堅私大3.3〜3.8／MARCH・関関同立3.8〜4.3／早慶4.0〜4.5が目安。基準は学校・年度で変わるため必ず募集要項で確認を。',
      links: [
        { href: '/hyotei-heikin/suisen-kijun', label: '推薦に必要な評定平均の早見表を見る' },
        { href: '/hyotei-heikin', label: '評定平均を自動計算する' },
      ],
    },
  },
  {
    test: /評定平均/,
    result: {
      title: '評定平均とは',
      answer:
        '評定平均は、9教科などの評定（5段階）を合計して教科数で割った平均値です。推薦入試の出願基準（例：評定平均4.0以上）として使われます。',
      links: [
        { href: '/hyotei-heikin', label: '評定平均を自動計算する' },
        { href: '/hyotei-heikin/suisen-kijun', label: '推薦に必要な評定平均の早見表' },
      ],
    },
  },
  {
    test: /素内申/,
    result: {
      title: '素内申とは',
      answer:
        '素内申は、9教科の評定（5段階）をそのまま合計した数値です（例：オール3なら27、満点45）。これを都道府県の方式で点数化したものが「換算内申」で、入試の調査書点に使われます。',
      links: [
        { href: '/', label: '内申点（素内申）を計算する' },
        { href: '/blog/kansan-naishin-vs-su-naishin', label: '換算内申と素内申の違いを見る' },
      ],
    },
  },
  {
    test: /調査書/,
    result: {
      title: '調査書（調査書点）とは',
      answer:
        '調査書は中学校が作成する成績・活動の記録で、入試で点数化される部分が「調査書点（内申点）」です。満点や対象学年は都道府県で大きく異なります。',
      links: [
        { href: '/', label: '自分の都道府県で調査書点を計算する' },
        { href: '/prefectures', label: '47都道府県の調査書点方式を見る' },
      ],
    },
  },
  {
    test: /(いつから|何年生|対象学年|中1から)/,
    result: {
      title: '内申点の対象学年',
      answer:
        '内申点の対象学年は都道府県で異なり、「中3のみ」「中2・中3」「中1〜中3の3年間」の3パターンに大きく分かれます。中1から対象になる地域では、1年生の成績から入試に影響します。',
      links: [
        { href: '/blog/naishin-target-grades-by-prefecture', label: '47都道府県の対象学年 早見表' },
        { href: '/prefectures', label: 'あなたの都道府県を確認する' },
      ],
    },
  },
  {
    test: /偏差値/,
    result: {
      title: '偏差値とは',
      answer:
        '偏差値は、平均点を50として自分の点数が集団の中でどの位置かを表す指標です。点数・平均点・標準偏差から算出します。',
      links: [{ href: '/hensachi', label: '5教科の偏差値を計算する' }],
    },
  },
  {
    test: /オール3/,
    result: {
      title: 'オール3で行ける高校',
      answer:
        'オール3は内申27（45点満点）で、模試の偏差値では40〜45前後が目安です。都道府県や当日点次第で公立・私立とも選択肢があります。',
      links: [
        { href: '/blog/all-3-high-school-options-2026-update', label: 'オール3で行ける高校（都道府県別）' },
        { href: '/reverse', label: '志望校から必要な当日点を逆算する' },
      ],
    },
  },
  {
    test: /オール4/,
    result: {
      title: 'オール4で行ける高校',
      answer:
        'オール4は内申36（45点満点）で、模試の偏差値では58〜63前後、上位校〜中堅上位校が目安です。私立の併願優遇や上位公立校の推薦基準にも届きやすい水準です。',
      links: [
        { href: '/hensachi/shiboukou', label: '偏差値から行ける高校レンジを見る' },
        { href: '/hyotei-heikin/suisen-kijun', label: '推薦に必要な評定平均の早見表' },
      ],
    },
  },
  {
    test: /オール5/,
    result: {
      title: 'オール5で行ける高校',
      answer:
        'オール5は内申45（満点）で、模試の偏差値では68以上、最難関校（地域トップ）が射程です。内申はほぼ満点でも、トップ校は当日点も高水準が必要になります。',
      links: [
        { href: '/hensachi/shiboukou', label: '偏差値から行ける高校レンジを見る' },
        { href: '/reverse', label: 'トップ校に必要な当日点を逆算する' },
      ],
    },
  },
  {
    test: /(内申点とは|内申点って|内申って)/,
    result: {
      title: '内申点とは',
      answer:
        '内申点（調査書点）は、通知表の評定を高校入試用に点数化したものです。満点・対象学年・実技の倍率は都道府県ごとに大きく異なります。',
      links: [
        { href: '/', label: '自分の都道府県で内申点を計算する' },
        { href: '/prefectures', label: '47都道府県の内申点方式を見る' },
      ],
    },
  },
];

function generalAnswer(nq: string): AnswerResult | null {
  for (const f of GENERAL_FACTS) {
    if (f.test.test(nq)) return { kind: 'general', ...f.result };
  }
  return null;
}

/** 全角数字（と全角ピリオド）を半角へ。「偏差値６０」を拾えるようにする。 */
function toHalfWidthDigits(s: string): string {
  return s.replace(/[０-９．]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
}

const HENSACHI_LINKS: AnswerLink[] = [
  { href: '/hensachi', label: '5教科の偏差値を計算する' },
  { href: '/hensachi/shiboukou', label: '偏差値から行ける高校を見る' },
];

/**
 * 「偏差値○○は上位何%／何位」「偏差値の出し方」を“数式で”決定論的に即答する（堀B/GEO）。
 * 正規分布から算出するため捏造ゼロ。数値も計算意図も無い漠然とした質問は null（→一般FAQへ委譲）。
 */
function hensachiAnswer(raw: string, nq: string): AnswerResult | null {
  if (!/偏差値/.test(nq)) return null;

  // 偏差値○○（数値）→ 上位%・順位・高校レベルの目安を算出
  const m = toHalfWidthDigits(raw).match(/偏差値[^0-9]{0,3}([0-9]{2}(?:\.[0-9])?)/);
  if (m) {
    const h = parseFloat(m[1]);
    if (h >= 20 && h <= 90) {
      const upper = hensachiToUpperPercent(h);
      const tier = tierForHensachi(h);
      return {
        kind: 'general',
        title: `偏差値${m[1]}は上位何％？順位は？`,
        answer: `偏差値${m[1]}は上位約${upper.toFixed(1)}％です。300人の集団なら約${hensachiToRank(h, 300)}位、1,000人なら約${hensachiToRank(h, 1000)}位に相当します。`,
        details: [
          `高校レベルの目安：${tier.label}`,
          `同じレベル帯でよく見られる内申点（45点満点）の目安：${tier.naishin45}`,
          '※正規分布（平均50・標準偏差10）から算出した理論値です。',
        ],
        links: HENSACHI_LINKS,
      };
    }
  }

  // 上げ方・伸ばし方
  if (/(上げ|あげ|伸ば|のばし)/.test(nq)) {
    return {
      kind: 'general',
      title: '偏差値の上げ方',
      answer:
        '偏差値を効率よく上げるコツは「一番偏差値が低い教科から取り組む」ことです。伸びしろが大きく、基本問題の取りこぼしを潰すだけで数ポイント動きます。暗記分野（理科・社会・英単語）は直前でも伸びます。',
      details: ['偏差値を+5上げる目安＝標準偏差15なら約+7.5点', '同じ模試で推移を見て手応えを確認'],
      links: [{ href: '/hensachi/agekata', label: '偏差値の上げ方を詳しく見る' }, { href: '/hensachi/moshi', label: '模試の偏差値の見方' }],
    };
  }

  // 計算方法・出し方
  if (/(計算|出し方|求め方|どうやって|どう出す|式)/.test(nq)) {
    return {
      kind: 'general',
      title: '偏差値の出し方（計算方法）',
      answer:
        '偏差値は「偏差値＝50＋10×(自分の点数−平均点)÷標準偏差」で計算します。例：平均60点・標準偏差15のテストで80点なら、50＋10×(80−60)÷15＝約63.3です。',
      details: ['標準偏差が分からない場合、定期テストでは15前後が目安', '偏差値50＝集団のちょうど平均（上位50%）'],
      links: [{ href: '/hensachi/agekata', label: '偏差値の出し方・上げ方を見る' }, ...HENSACHI_LINKS],
    };
  }
  return null;
}

/**
 * クエリに対する最良の単一回答を返す（自信がなければ null）。
 * 県が特定できれば県の検証済みデータを最優先、なければ一般FAQ。
 */
export function answerQuery(query: string): AnswerResult | null {
  const raw = (query ?? '').trim();
  if (raw.length < 2) return null;
  const nq = normalize(raw);

  // 偏差値の数値・計算は数式で即答（県名より優先：「東京 偏差値65」等の取り違え回避）
  const hen = hensachiAnswer(raw, nq);
  if (hen) return hen;

  const code = detectPrefectureCode(raw);
  if (code) {
    const ans = prefectureAnswer(code, nq);
    if (ans) return ans;
  }
  return generalAnswer(nq);
}
