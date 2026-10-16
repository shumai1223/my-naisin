'use client';

import * as React from 'react';
import Link from 'next/link';
import { Send } from '@/components/icons';

import { InputForm } from '@/components/Calculator/InputForm';
import { DEFAULT_SCORES } from '@/lib/constants';
import { PREFECTURES, DEFAULT_PREFECTURE_CODE } from '@/lib/prefectures';
import { renderAdvisorAnswer, type AdvisorAnswer } from '@/lib/advisor/render';
import type { Scores } from '@/lib/types';

/** 入力欄の共通の見た目（DESIGN-SYSTEM §3 入力・押す面は44px以上）。 */
const FIELD_CLASS =
  'w-full rounded border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700';

/** render.tsが返すテキスト（**太字**・[リンク](href)・段落区切り\n\n）を安全にJSXへ変換する。 */
function renderInline(text: string): React.ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > lastIndex) nodes.push(text.slice(lastIndex, m.index));
    if (m[1] !== undefined) {
      nodes.push(
        <Link key={key++} href={m[2]} className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
          {m[1]}
        </Link>
      );
    } else if (m[3] !== undefined) {
      nodes.push(
        <strong key={key++} className="font-bold text-slate-900">
          {m[3]}
        </strong>
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderMarkdownLite(text: string): React.ReactNode {
  return text.split('\n\n').map((para, pi) => (
    <p key={pi} className="mb-3 text-base leading-[1.8] text-slate-900 last:mb-0">
      {renderInline(para)}
    </p>
  ));
}

/**
 * 決定論アドバイザーUI（ZZ-3c・build-not-launch）。
 * 自然文からの評定・点数抽出は行わない設計（classify.tsの判断）のため、質問文に加えて
 * 構造化フィールド（都道府県・評定・当日点・偏差値の材料・目標点・比較先）を入力する。
 */
export function AdvisorClient() {
  const [raw, setRaw] = React.useState('');
  const [prefectureCode, setPrefectureCode] = React.useState(DEFAULT_PREFECTURE_CODE);
  const [scores, setScores] = React.useState<Scores>(DEFAULT_SCORES);
  const [academicRaw, setAcademicRaw] = React.useState('');
  const [hensachiScore, setHensachiScore] = React.useState('');
  const [hensachiAverage, setHensachiAverage] = React.useState('');
  const [hensachiStdDev, setHensachiStdDev] = React.useState('');
  const [targetTotal, setTargetTotal] = React.useState('');
  const [compareWithPrefectureCode, setCompareWithPrefectureCode] = React.useState('');
  const [answer, setAnswer] = React.useState<AdvisorAnswer | null>(null);

  const onScoreChange = React.useCallback((key: keyof Scores, next: number) => {
    setScores((prev) => ({ ...prev, [key]: next }));
  }, []);

  const onSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const toNum = (s: string): number | undefined => (s.trim() === '' ? undefined : Number(s));
      const hensachiInput =
        toNum(hensachiScore) !== undefined && toNum(hensachiAverage) !== undefined && toNum(hensachiStdDev) !== undefined
          ? { score: Number(hensachiScore), average: Number(hensachiAverage), stdDev: Number(hensachiStdDev) }
          : undefined;

      const result = renderAdvisorAnswer({
        raw,
        prefectureCode,
        scores,
        academicRaw: toNum(academicRaw),
        hensachiInput,
        targetTotal: toNum(targetTotal),
        compareWithPrefectureCode: compareWithPrefectureCode || undefined,
      });
      setAnswer(result);
      window.requestAnimationFrame(() => {
        document.getElementById('advisor-answer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [raw, prefectureCode, scores, academicRaw, hensachiScore, hensachiAverage, hensachiStdDev, targetTotal, compareWithPrefectureCode]
  );

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
        <div>
          <label htmlFor="advisor-question" className="mb-1 block text-sm font-bold text-slate-900">
            質問を入力してください
          </label>
          <textarea
            id="advisor-question"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={3}
            placeholder="例：東京都の内申点を計算して／偏差値を計算して／目標まであと何点か教えて"
            className={FIELD_CLASS}
          />
        </div>

        <div>
          <label htmlFor="advisor-pref" className="mb-1 block text-sm font-bold text-slate-900">
            都道府県（内申点・総合得点・逆算・制度説明の質問で使用）
          </label>
          <select
            id="advisor-pref"
            value={prefectureCode}
            onChange={(e) => setPrefectureCode(e.target.value)}
            className={FIELD_CLASS}
          >
            {PREFECTURES.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <details className="border-t border-slate-200 pt-1">
          <summary className="cursor-pointer py-3 text-sm font-bold text-slate-900">9教科の評定（内申点・総合得点・逆算の質問で使用）</summary>
          <div className="pb-2 pt-1">
            <InputForm prefectureCode={prefectureCode} scores={scores} onChange={onScoreChange} />
          </div>
        </details>

        <details className="border-t border-slate-200 pt-1">
          <summary className="cursor-pointer py-3 text-sm font-bold text-slate-900">詳細オプション（総合得点・偏差値・逆算・県比較）</summary>
          <div className="grid grid-cols-1 gap-4 pb-2 pt-1 sm:grid-cols-2">
            <label className="block text-sm text-slate-700">
              当日点（総合得点用）
              <input type="number" value={academicRaw} onChange={(e) => setAcademicRaw(e.target.value)} className={`mt-1 ${FIELD_CLASS}`} />
            </label>
            <label className="block text-sm text-slate-700">
              目標総合得点（逆算用）
              <input type="number" value={targetTotal} onChange={(e) => setTargetTotal(e.target.value)} className={`mt-1 ${FIELD_CLASS}`} />
            </label>
            <label className="block text-sm text-slate-700">
              偏差値：自分の点数
              <input type="number" value={hensachiScore} onChange={(e) => setHensachiScore(e.target.value)} className={`mt-1 ${FIELD_CLASS}`} />
            </label>
            <label className="block text-sm text-slate-700">
              偏差値：平均点
              <input type="number" value={hensachiAverage} onChange={(e) => setHensachiAverage(e.target.value)} className={`mt-1 ${FIELD_CLASS}`} />
            </label>
            <label className="block text-sm text-slate-700">
              偏差値：標準偏差
              <input type="number" value={hensachiStdDev} onChange={(e) => setHensachiStdDev(e.target.value)} className={`mt-1 ${FIELD_CLASS}`} />
            </label>
            <label className="block text-sm text-slate-700">
              比較したい都道府県（県比較用）
              <select value={compareWithPrefectureCode} onChange={(e) => setCompareWithPrefectureCode(e.target.value)} className={`mt-1 ${FIELD_CLASS}`}>
                <option value="">（指定なし）</option>
                {PREFECTURES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </details>

        <button
          type="submit"
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors duration-100 hover:bg-brand-800"
        >
          <Send className="h-4 w-4" />
          質問する
        </button>
      </form>

      {answer && (
        <div id="advisor-answer" className="scroll-mt-24 rounded-lg border border-slate-200 bg-brand-50 p-5">
          <div className="mb-3 text-sm font-bold text-brand-700">回答</div>
          {renderMarkdownLite(answer.text)}
        </div>
      )}
    </div>
  );
}
