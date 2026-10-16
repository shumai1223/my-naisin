'use client';

import Link from 'next/link';
import { ArrowRight, Clock } from '@/components/icons';

// タグは記事の種類を表す短い語。順位・緊急性をあおる語（人気・必見・緊急）は使わない。
const FEATURED_ARTICLES = [
  {
    slug: 'what-is-naishinten',
    title: '内申点とは？仕組み・計算方法・評価基準をわかりやすく解説',
    description: '内申点の基本をゼロから理解。成績表の見方から5段階評価の仕組みまで。',
    tag: '基本',
    readTime: '12分',
  },
  {
    slug: 'naishinten-average-score',
    title: '内申点の平均は何点？「オール3＝平均」は間違い！',
    description: '全国平均3.3の真実。学年別・教科別のデータで自分の位置を知ろう。',
    tag: 'データ',
    readTime: '10分',
  },
  {
    slug: 'how-to-raise-naishinten',
    title: '内申点の上げ方7選｜今日からできる具体的な方法',
    description: 'テスト・提出物・授業態度…確実に点を伸ばす実践テクニック集。',
    tag: '上げ方',
    readTime: '15分',
  },
  {
    slug: 'all-3-high-school-options-2026-update',
    title: 'オール3で行ける高校は？偏差値・進路の目安【2026年度入試対応】',
    description: 'オール3は偏差値40〜50が目安。逆転合格の戦略も紹介。',
    tag: '進路',
    readTime: '13分',
  },
  {
    slug: 'naishinten-not-enough-strategies',
    title: '内申点が足りない！志望校を諦めない5つの戦略',
    description: '内申不足でも逆転可能。当日点・私立併願・推薦活用の全パターン。',
    tag: '対策',
    readTime: '14分',
  },
  {
    slug: 'naishin-guide',
    title: '内申点の基本から都道府県別対策まで完全ガイド',
    description: '計算方法の基本を理解して、自分の地域に合った対策を立てよう',
    tag: '総合ガイド',
    readTime: '15分',
  },
];

export function BlogSection() {
  return (
    <section>
      {/* 外側は枠で囲まない（カードの中にカードを入れない）。枠を持つのは記事カードだけ。 */}
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">内申点コラム</h2>
          <p className="mt-1 text-sm text-slate-600">基礎知識から実践テクニックまで、全80記事以上</p>
        </div>
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
        >
          すべての記事
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Articles — すべて同じ見た目の白いカード */}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_ARTICLES.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 hover:border-brand-700 hover:bg-brand-50"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                  {article.tag}
                </span>
                <span className="inline-flex items-center gap-1 text-xs tabular-nums text-slate-600">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </span>
              </div>
              <h3 className="text-base font-bold leading-snug text-slate-900">{article.title}</h3>
              <p className="mt-2 text-sm leading-[1.8] text-slate-600">{article.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      {/* コラム一覧への案内（バナーにせず、白い面＋罫線のリンク） */}
      <Link
        href="/blog"
        className="mt-6 flex min-h-11 items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 hover:bg-brand-50"
      >
        <span className="min-w-0">
          <span className="block text-base font-bold text-slate-900">もっと詳しく知りたい？</span>
          <span className="mt-0.5 block text-sm text-slate-600">
            内申点アップのコツ、不登校対策、入試方式別の仕組みなど多数掲載
          </span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 text-slate-600" />
      </Link>
    </section>
  );
}
