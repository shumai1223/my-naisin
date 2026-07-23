/**
 * グラウンデッドAIアドバイザー（ZZ-3a）のレンダラ。
 * 準拠必須仕様: docs/zz-specs/zz3-grounded-advisor-spec.md §1-4。
 *
 * テンプレート文の数値スロットは台帳エントリの参照のみ（地の文への算用数字直書きを原則禁止）。
 * AI層は実装しない（決定論版で完成・§8 DoD「AI層は実装しない」）。
 */
import { calculateTotalScore, calculateMaxScore } from '@/lib/utils';
import { getPrefectureByCode } from '@/lib/prefectures';
import { calcHensachi, roundHensachi } from '@/lib/hensachi';
import { TOTAL_SCORE_SYSTEMS } from '@/lib/total-score/registry';
import { computeReportRaw, computeTotalScore } from '@/lib/total-score/engine';
import { SUBJECTS } from '@/lib/constants';
import type { Scores } from '@/lib/types';
import { classifyQuestion, type AdvisorQuestionType } from './classify';
import { addEntry, type GroundingLedger } from './ledger';
import { verifyGrounding, SAFE_FALLBACK_TEXT, REQUIRED_DISCLAIMER } from './verify';

export interface AdvisorQuestion {
  raw: string;
  /** 構造化入力。自然文からの評定・点数抽出は行わない（classify.tsの設計判断を参照）。 */
  prefectureCode?: string;
  scores?: Scores;
  /** 総合得点用：学力検査（当日点）の素点。 */
  academicRaw?: number;
  /** 偏差値用：自分の点数・平均点・標準偏差。 */
  hensachiInput?: { score: number; average: number; stdDev: number };
  /** 逆算用：目標総合得点。 */
  targetTotal?: number;
  /** 県間比較用：もう一方の都道府県コード。 */
  compareWithPrefectureCode?: string;
}

export interface AdvisorAnswer {
  type: AdvisorQuestionType;
  text: string;
  ledger: GroundingLedger;
}

/** verify.tsと同一の定型文・免責文言を単一ソースとして再利用する（文言のドリフト防止）。 */
const JUDGMENT_DISCLAIMER = REQUIRED_DISCLAIMER;

function fallback(type: AdvisorQuestionType): AdvisorAnswer {
  return { type, text: SAFE_FALLBACK_TEXT, ledger: [] };
}

/**
 * ランタイム検証（§1④・DoD「verifyGroundingがランタイムにも組み込まれfail時フォールバック動作」）。
 * テスト時と同じverifyGroundingを使い、failした場合は該当回答を破棄して安全定型文へ落とす
 * （エラーを見せない・利用者には常に何らかの回答が返る）。
 */
function verifyOrFallback(type: AdvisorQuestionType, text: string, ledger: GroundingLedger, prefContext?: string): AdvisorAnswer {
  const result = verifyGrounding(text, ledger, prefContext);
  if (!result.ok) return fallback(type);
  return { type, text, ledger };
}

function sumByCategory(scores: Scores, category: 'core' | 'practical'): number {
  return SUBJECTS.filter((s) => s.category === category).reduce((sum, s) => sum + (scores[s.key] ?? 0), 0);
}

/** 表示形を作る唯一の場所（丸めはここで1回だけ・レンダラでの再丸めを禁止）。 */
function fmt(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function renderNaishinCalc(q: AdvisorQuestion): AdvisorAnswer {
  const prefCode = q.prefectureCode;
  if (!prefCode || !q.scores) return fallback('naishin-calc');
  const pref = getPrefectureByCode(prefCode);
  if (!pref) return fallback('naishin-calc');

  let ledger: GroundingLedger = [];
  const total = calculateTotalScore(q.scores, prefCode);
  const max = calculateMaxScore(prefCode);
  const totalStr = fmt(total);
  const maxStr = fmt(max);
  ledger = addEntry(ledger, totalStr, 'naishin-engine', prefCode);
  ledger = addEntry(ledger, maxStr, 'naishin-engine', prefCode);

  const link = `[${pref.name}の内申点計算ツール](/${prefCode}/naishin)`;
  const text = `入力いただいた9教科の評定から計算すると、${pref.name}の内申点は **${totalStr}点**（満点${maxStr}点）です。詳しい内訳は${link}でご確認いただけます。\n\n${JUDGMENT_DISCLAIMER}`;
  return verifyOrFallback('naishin-calc', text, ledger, prefCode);
}

function renderTotalScore(q: AdvisorQuestion): AdvisorAnswer {
  const prefCode = q.prefectureCode;
  if (!prefCode || !q.scores || typeof q.academicRaw !== 'number') return fallback('total-score');
  const system = TOTAL_SCORE_SYSTEMS[prefCode];
  if (!system) return fallback('total-score'); // 検証済み総合得点システムが無い県は正直に答えない

  const coreSum = sumByCategory(q.scores, 'core');
  const practicalSum = sumByCategory(q.scores, 'practical');
  const reportRaw = computeReportRaw(system.report, { coreSum, practicalSum });
  const result = computeTotalScore(system, { academicRaw: q.academicRaw, reportRaw });

  let ledger: GroundingLedger = [];
  const totalStr = fmt(result.total);
  const maxStr = fmt(result.totalMax);
  ledger = addEntry(ledger, totalStr, 'total-score-engine', prefCode);
  ledger = addEntry(ledger, maxStr, 'total-score-engine', prefCode);

  const link = `[${system.name}の総合得点計算ツール](/${prefCode}/total-score)`;
  const text = `入力いただいた内容から計算すると、${system.name}の総合得点は **${totalStr}点**（満点${maxStr}点）です。詳しい内訳は${link}でご確認いただけます。\n\n${JUDGMENT_DISCLAIMER}`;
  return verifyOrFallback('total-score', text, ledger, prefCode);
}

function renderHensachi(q: AdvisorQuestion): AdvisorAnswer {
  const input = q.hensachiInput;
  if (!input) return fallback('hensachi');
  const raw = calcHensachi(input.score, input.average, input.stdDev);
  if (raw === null) return fallback('hensachi');
  const rounded = roundHensachi(raw);

  let ledger: GroundingLedger = [];
  const hensachiStr = fmt(rounded);
  ledger = addEntry(ledger, hensachiStr, 'hensachi-engine', 'none');

  const link = '[偏差値計算ツール](/hensachi)';
  const text = `点数・平均点・標準偏差から計算すると、偏差値は **${hensachiStr}** です。詳しい計算は${link}でご確認いただけます。\n\n${JUDGMENT_DISCLAIMER}`;
  return verifyOrFallback('hensachi', text, ledger);
}

function renderReverse(q: AdvisorQuestion): AdvisorAnswer {
  const prefCode = q.prefectureCode;
  if (!prefCode || !q.scores || typeof q.targetTotal !== 'number') return fallback('reverse');
  const pref = getPrefectureByCode(prefCode);
  if (!pref) return fallback('reverse');

  const current = calculateTotalScore(q.scores, prefCode);
  const gap = q.targetTotal - current;

  let ledger: GroundingLedger = [];
  const currentStr = fmt(current);
  const targetStr = fmt(q.targetTotal);
  const gapStr = fmt(Math.abs(gap));
  ledger = addEntry(ledger, currentStr, 'naishin-engine', prefCode);
  ledger = addEntry(ledger, targetStr, 'naishin-engine', prefCode);
  ledger = addEntry(ledger, gapStr, 'naishin-engine', prefCode);

  const link = `[${pref.name}の逆算シミュレーター](/reverse)`;
  const text =
    gap > 0
      ? `現在の内申点は${currentStr}点、目標の${targetStr}点まで**あと${gapStr}点**です。詳しい内訳は${link}でご確認いただけます。\n\n${JUDGMENT_DISCLAIMER}`
      : `現在の内申点は${currentStr}点で、目標の${targetStr}点に**${gapStr}点届いています**。詳しい内訳は${link}でご確認いただけます。\n\n${JUDGMENT_DISCLAIMER}`;
  return verifyOrFallback('reverse', text, ledger, prefCode);
}

function renderSystemExplainForPrefecture(prefCode: string): { text: string; ledger: GroundingLedger } | null {
  const pref = getPrefectureByCode(prefCode);
  if (!pref) return null;
  let ledger: GroundingLedger = [];
  const maxStr = fmt(pref.maxScore);
  const coreStr = fmt(pref.coreMultiplier);
  const practicalStr = fmt(pref.practicalMultiplier);
  ledger = addEntry(ledger, maxStr, 'prefectures', pref.code);
  ledger = addEntry(ledger, coreStr, 'prefectures', pref.code);
  ledger = addEntry(ledger, practicalStr, 'prefectures', pref.code);

  const link = `[${pref.name}の内申点の重み解説](/${pref.code}/naishin-omomi)`;
  const text = `${pref.name}の内申点は、主要5教科が${coreStr}倍・実技4教科が${practicalStr}倍で計算され、満点は${maxStr}点です。詳しくは${link}で解説しています。\n\n${JUDGMENT_DISCLAIMER}`;
  return { text, ledger };
}

function renderSystemExplain(q: AdvisorQuestion): AdvisorAnswer {
  const prefCode = q.prefectureCode;
  if (!prefCode) return fallback('system-explain');
  const result = renderSystemExplainForPrefecture(prefCode);
  if (!result) return fallback('system-explain');
  return verifyOrFallback('system-explain', result.text, result.ledger, prefCode);
}

function renderPrefectureCompare(q: AdvisorQuestion): AdvisorAnswer {
  const prefCodeA = q.prefectureCode;
  const prefCodeB = q.compareWithPrefectureCode;
  if (!prefCodeA || !prefCodeB) return fallback('prefecture-compare');
  const blockA = renderSystemExplainForPrefecture(prefCodeA);
  const blockB = renderSystemExplainForPrefecture(prefCodeB);
  if (!blockA || !blockB) return fallback('prefecture-compare');

  // 県混線ガード（§4）：各ブロックを、そのブロック自身の県コードのみをprefContextとして
  // 個別に検証する（片方でも他県の数値が紛れ込んでいればfail→回答全体をフォールバック）。
  const verifiedA = verifyGrounding(blockA.text, blockA.ledger, prefCodeA);
  const verifiedB = verifyGrounding(blockB.text, blockB.ledger, prefCodeB);
  if (!verifiedA.ok || !verifiedB.ok) return fallback('prefecture-compare');

  // 各ブロックは独立した台帳を持ち、テキストも県ごとに分離して連結する
  // （1回答=1県の制約を「県Aブロック＋県Bブロック」の2ブロック構成で満たす）。
  const text = `${blockA.text.replace(`\n\n${JUDGMENT_DISCLAIMER}`, '')}\n\n---\n\n${blockB.text}`;
  const ledger: GroundingLedger = [...blockA.ledger, ...blockB.ledger];
  return { type: 'prefecture-compare', text, ledger };
}

/** 質問を分類し、対応する決定論レンダラへディスパッチする（AI不使用・§8 DoD）。 */
export function renderAdvisorAnswer(q: AdvisorQuestion): AdvisorAnswer {
  const classified = classifyQuestion(q.raw);
  const prefectureCode = q.prefectureCode ?? classified.mentionedPrefectureCodes[0];
  const withPrefecture: AdvisorQuestion = { ...q, prefectureCode };

  switch (classified.type) {
    case 'naishin-calc':
      return renderNaishinCalc(withPrefecture);
    case 'total-score':
      return renderTotalScore(withPrefecture);
    case 'hensachi':
      return renderHensachi(withPrefecture);
    case 'reverse':
      return renderReverse(withPrefecture);
    case 'system-explain':
      return renderSystemExplain(withPrefecture);
    case 'prefecture-compare': {
      const [codeA, codeB] = classified.mentionedPrefectureCodes;
      return renderPrefectureCompare({ ...withPrefecture, prefectureCode: q.prefectureCode ?? codeA, compareWithPrefectureCode: q.compareWithPrefectureCode ?? codeB });
    }
    case 'out-of-scope':
    default:
      return fallback('out-of-scope');
  }
}
