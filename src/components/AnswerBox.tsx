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
 * 見た目は「やさしい学習帳」の注釈の型（薄いブランド面＋太字ラベル・アイコンなし）。
 */
export function AnswerBox({ question, children }: { question: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-brand-50 p-4">
      <p className="text-sm font-bold text-brand-700">要点</p>
      <p className="mt-1 text-base font-bold leading-[1.8] text-slate-900">{question}</p>
      <div className="mt-1 text-base leading-[1.8] text-slate-900">{children}</div>
    </section>
  );
}
