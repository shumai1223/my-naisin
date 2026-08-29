#!/usr/bin/env node
/**
 * T-N2-2: AIハルシネーション検証セットの生成 + (APIキーがあれば)実測。
 *
 * 使い方:
 *   npx tsx scripts/run-ai-hallucination-benchmark.ts --out=data/ai-hallucination-benchmark-questions.json
 *
 * ⚠️ 実際にAIへ質問を送って誤答率を測るには、対応するAPIキー（ANTHROPIC_API_KEY等）が必要。
 * この環境にAPIキーが無い場合は、正解セット(188問)の生成までで止める（N2-2本文の既定動作）。
 * 架空の誤答率をでっち上げることは捏造にあたるため、実測できない場合は「未実施」と正直に書く。
 */
import { writeFileSync } from 'node:fs';
import { buildBenchmarkQuestions } from '@/lib/ai-hallucination-benchmark';

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

const outPath = arg('out') ?? 'data/ai-hallucination-benchmark-questions.json';

const questions = buildBenchmarkQuestions();

const AI_API_KEY_ENV_VARS = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GOOGLE_AI_API_KEY', 'GEMINI_API_KEY'];
const availableKeys = AI_API_KEY_ENV_VARS.filter((name) => !!process.env[name]);

writeFileSync(
  outPath,
  JSON.stringify(
    {
      meta: {
        generatedAt: '2026-08-30',
        totalQuestions: questions.length,
        prefectureCount: new Set(questions.map((q) => q.prefectureCode)).size,
        categories: ['maxScore', 'targetGrades', 'practicalWeighting', 'scale'],
        note: '出典は既存の一次ソース(prefectures.tsのsourceUrl)。新規データ収集は無し。',
      },
      questions,
    },
    null,
    2
  ) + '\n',
  'utf-8'
);
console.log(`正解セット${questions.length}問を${outPath}へ書き出した。`);

if (availableKeys.length === 0) {
  console.log('');
  console.log('AI APIキーが見つからないため、実測(AIへの質問送信・誤答率の集計)はここで停止する。');
  console.log('架空の誤答率を記録することは捏造にあたるため行わない。');
  console.log(`必要な環境変数(いずれか): ${AI_API_KEY_ENV_VARS.join(', ')}`);
  console.log('APIキーが用意された場合、このスクリプトに実測ロジックを追加して再実行する想定。');
  process.exit(0);
}

console.log(`APIキーを検知した(${availableKeys.join(', ')})が、実測呼び出しロジックは未実装。`);
console.log('N2-2の次のステップとして、対応するSDK呼び出し+summarizeGrading()での集計を実装する。');
