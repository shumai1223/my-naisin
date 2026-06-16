import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * 答え先出し（answer-first）の要約ボックス＝GEO/AI引用・強調スニペット最適化。
 *
 * AI検索（ChatGPT/Perplexity等・既に流入の約7%で増加中）と Google の強調スニペットは、
 * 「質問に2-3文で即答する塊」を抜き出して引用する。ページ冒頭にこの塊を置くことで、
 * 長文コンテンツの中から要点を探させず、そのまま引用される確率を上げる。
 *
 * 内容は検証済みデータ（prefectures / total-score / education-cost エンジン）由来のみ＝捏造ゼロ。
 * 装飾は最小・テキスト主体（AIが本文として抽出しやすい）。
 */
export function AnswerBox({ question, children }: { question: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-5 shadow-sm">
      <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
        <Sparkles className="h-3.5 w-3.5" />
        30秒でわかる答え
      </div>
      <p className="text-sm font-semibold text-slate-700">{question}</p>
      <div className="mt-1.5 text-sm leading-relaxed text-slate-800">{children}</div>
    </section>
  );
}
