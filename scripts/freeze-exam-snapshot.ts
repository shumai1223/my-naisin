#!/usr/bin/env node
/**
 * T-N1-1: 令和8(2026)年度の内申点計算制度を「機械比較可能な正規形」に落とし、
 * src/data/snapshots/2026-r8/exam-system.json として凍結する一回限りの生成スクリプト。
 *
 * 実行後、生成されたJSONは手で編集しない。来年度の差分を取る基準点そのものであり、
 * prefectures.tsが後日修正されても本ファイルは動かさない(=凍結)。
 *
 * 使い方: npx tsx scripts/freeze-exam-snapshot.ts
 */
import { PREFECTURES, type PrefectureConfig } from '@/lib/prefectures';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'src/data/snapshots/2026-r8');
const OUT_FILE = path.join(OUT_DIR, 'exam-system.json');

function normalizeReverseCalc(rc: PrefectureConfig['reverseCalc']) {
  if (!rc) return undefined;
  return {
    totalMaxScore: rc.totalMaxScore,
    examMaxScore: rc.examMaxScore,
    defaultRatio: rc.defaultRatio,
    calcType: rc.calcType,
    naishinMultiplier: rc.naishinMultiplier ?? null,
    kValue: rc.kValue ?? null,
    sValueCoefficients: rc.sValueCoefficients ?? null,
    osakaTypeCount: rc.osakaTypes ? rc.osakaTypes.length : null,
    hasTokyoSettings: !!rc.tokyoSettings,
    hasKanagawaSettings: !!rc.kanagawaSettings,
  };
}

const entries = PREFECTURES.map((p) => ({
  code: p.code,
  name: p.name,
  region: p.region,
  fiscalYear: p.fiscalYear ?? null,
  targetGrades: p.targetGrades,
  gradeMultipliers: p.gradeMultipliers,
  coreMultiplier: p.coreMultiplier,
  practicalMultiplier: p.practicalMultiplier,
  maxScore: p.maxScore,
  simplifiedCalc: p.simplifiedCalc ?? false,
  actualMaxScore: p.actualMaxScore ?? null,
  supports10PointScale: p.supports10PointScale ?? false,
  variantCount: p.variants ? p.variants.length : 0,
  reverseCalc: normalizeReverseCalc(p.reverseCalc) ?? null,
  sourceUrl: p.sourceUrl ?? null,
  sourceUrl2: p.sourceUrl2 ?? null,
  sourceTitle: p.sourceTitle ?? null,
  lastVerified: p.lastVerified ?? null,
  // ⚠️ 未収集(N1-1の残タスク)。WebFetch/curlでPDF実体を取得しSHA-256を計算する作業は
  // 47件分の外部フェッチを要するため別イテレーションで実施する。ここで架空の値を
  // 入れることは捏造にあたるため、収集できるまでnullのまま正直に残す。
  pdfHash: null as string | null,
}));

const snapshot = {
  meta: {
    fiscalYearLabel: '令和8年度(2026年度)',
    frozenAt: '2026-08-30',
    frozenBy: 'scripts/freeze-exam-snapshot.ts (T-N1-1)',
    sourceOfTruth: 'src/lib/prefectures.ts (この日付時点のスナップショット)',
    prefectureCount: entries.length,
    pdfHashStatus: 'not_yet_collected',
    freezePolicy:
      '本ディレクトリは生成後に書き換え禁止。prefectures.tsが後日修正されても本ファイルは追随させない。来年度の差分エンジン(N1-3)の基準点として使う。',
  },
  entries,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(snapshot, null, 2) + '\n', 'utf-8');
console.log(`wrote ${entries.length} entries to ${OUT_FILE}`);
