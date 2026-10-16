'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ExternalLink } from '@/components/icons';

import { answerQuery, type AnswerResult } from '@/lib/answer-bot';
import { track } from '@/lib/track';

const EXAMPLE_QUERIES = [
  '兵庫県の内申点は何点満点？',
  '東京でオール5だと内申いくつ？',
  '偏差値60は上位何%？',
  '評定平均とは？',
  'オール3で行ける高校は？',
  '三者面談で先生に聞くことは？',
  '当日点・総合得点とは？',
  '高校3年間の費用の目安は？',
  '高校無償化は年収いくらまで？',
  '教育費は中学から高校までいくら？',
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
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runQuery(query);
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <div className="relative w-full min-w-0 sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />
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
            className="w-full rounded border border-slate-300 bg-white py-3 pl-10 pr-3 text-base text-slate-900 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors duration-100 hover:bg-brand-800 sm:w-auto sm:shrink-0"
        >
          質問する
        </button>
      </form>

      {/* 回答（例示チップより上に置く：スマホで押した直後に回答が画面内に出るようにするため） */}
      {result && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-brand-50 p-4 motion-safe:animate-fade-in">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-slate-900">{result.title}</span>
            <span className="ml-auto inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
              自社データ回答
            </span>
          </div>
          <p className="text-base leading-[1.8] text-slate-900">{result.answer}</p>

          {result.details && result.details.length > 0 && (
            <ul className="mt-3 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
              {result.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-700" />
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
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 transition-colors duration-100 hover:bg-brand-50"
              >
                {l.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>

          {result.source?.url && (
            <p className="mt-3 text-sm text-slate-600">
              出典：
              <a
                href={result.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {result.source.name ?? result.source.url}
                <ExternalLink className="h-4 w-4" />
              </a>
            </p>
          )}
        </div>
      )}

      {/* マッチしなかったとき：関連ツールへ誘導（誤った回答は返さない） */}
      {showNoMatch && (
        <div className="mt-5 rounded-lg border border-slate-200 bg-brand-50 p-4">
          <div className="mb-2 text-sm font-bold text-slate-900">
            この質問には自信を持って答えられませんでした
          </div>
          <p className="text-sm leading-[1.8] text-slate-700">
            都道府県名（例：兵庫県）や「満点」「対象学年」「オール3」などを含めると答えやすくなります。
            まずは以下のツールもお試しください。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center rounded bg-brand-700 px-4 py-2 text-sm font-bold text-white transition-colors duration-100 hover:bg-brand-800"
            >
              内申点を計算する
            </Link>
            <Link
              href="/prefectures"
              className="inline-flex min-h-[44px] items-center rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 transition-colors duration-100 hover:bg-brand-50"
            >
              47都道府県の方式を見る
            </Link>
          </div>
        </div>
      )}

      {/* 例示チップ（押す面は44px以上。スマホは2列・PCは折り返し） */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {EXAMPLE_QUERIES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => runQuery(ex)}
            className="inline-flex min-h-[44px] w-full items-center rounded border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-100 hover:bg-brand-50 hover:text-brand-800 sm:w-auto"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
