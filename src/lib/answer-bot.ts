/**
 * 内申点クイックアンサー（自社データの決定論的Q&A・堀B/GEO）。
 *
 * LLMを使わず、検証済みの naishin-dataset（満点・対象学年・倍率・計算式・オール3/4/5の確定値）と
 * 少数のキュレーションFAQだけから「正しい一次データ」を返す。捏造ゼロ・端末内完結。
 * 自信のあるマッチのみ回答し、外したときは null（UI側で関連ツールへ誘導）。
 */

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { buildPrefectureDetail } from '@/lib/naishin-dataset';

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
    test: /評定平均/,
    result: {
      title: '評定平均とは',
      answer:
        '評定平均は、9教科などの評定（5段階）を合計して教科数で割った平均値です。推薦入試の出願基準（例：評定平均4.0以上）として使われます。',
      links: [{ href: '/hyotei-heikin', label: '評定平均を自動計算する' }],
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

/**
 * クエリに対する最良の単一回答を返す（自信がなければ null）。
 * 県が特定できれば県の検証済みデータを最優先、なければ一般FAQ。
 */
export function answerQuery(query: string): AnswerResult | null {
  const raw = (query ?? '').trim();
  if (raw.length < 2) return null;
  const nq = normalize(raw);

  const code = detectPrefectureCode(raw);
  if (code) {
    const ans = prefectureAnswer(code, nq);
    if (ans) return ans;
  }
  return generalAnswer(nq);
}
