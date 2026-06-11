'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Sparkles, ArrowRight, ExternalLink, MessageCircleQuestion } from 'lucide-react';

import { answerQuery, type AnswerResult } from '@/lib/answer-bot';
import { track } from '@/lib/track';

const EXAMPLE_QUERIES = [
  '兵庫県の内申点は何点満点？',
  '東京でオール5だと内申いくつ？',
  '神奈川は何年生が対象？',
  '評定平均とは？',
  'オール3で行ける高校は？',
];

export function AnswerBotClient() {
  const [query, setQuery] = React.useState('');
  const [submitted, setSubmitted] = React.useState('');

  // 入力に対する決定論的な回答（LLM非使用・自社の検証済みデータのみ）。
  const result: AnswerResult | null = React.useMemo(() => {
    const q = submitted || query;
    return q.trim().length >= 2 ? answerQuery(q) : null;
  }, [query, submitted]);

  const runQuery = (q: string) => {
    setQuery(q);
    setSubmitted(q);
    if (q.trim().length >= 2) {
      track('answer_bot_query', { matched: answerQuery(q) ? 1 : 0 });
    }
  };

  const showNoMatch = (submitted || query).trim().length >= 2 && !result;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runQuery(query);
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          inputMode="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSubmitted('');
          }}
          placeholder="例：兵庫県の内申点は何点満点？"
          aria-label="内申点について質問する"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-28 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
        >
          質問する
        </button>
      </form>

      {/* 例示チップ */}
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLE_QUERIES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => runQuery(ex)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* 回答 */}
      {result && (
        <div className="mt-5 animate-fade-in rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-slate-800">{result.title}</span>
            <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-blue-600 ring-1 ring-blue-100">
              自社データ回答
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{result.answer}</p>

          {result.details && result.details.length > 0 && (
            <ul className="mt-3 grid gap-1 text-xs text-slate-600 sm:grid-cols-2">
              {result.details.map((d, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {result.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
              >
                {l.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>

          {result.source?.url && (
            <p className="mt-3 text-[11px] text-slate-400">
              出典：
              <a
                href={result.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 underline hover:text-blue-600"
              >
                {result.source.name ?? result.source.url}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          )}
        </div>
      )}

      {/* マッチしなかったとき：関連ツールへ誘導（誤った回答は返さない） */}
      {showNoMatch && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
            <MessageCircleQuestion className="h-4 w-4 text-slate-400" />
            この質問には自信を持って答えられませんでした
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            都道府県名（例：兵庫県）や「満点」「対象学年」「オール3」などを含めると答えやすくなります。
            まずは以下のツールもお試しください。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/" className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700">内申点を計算する</Link>
            <Link href="/prefectures" className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">47都道府県の方式を見る</Link>
          </div>
        </div>
      )}
    </div>
  );
}
