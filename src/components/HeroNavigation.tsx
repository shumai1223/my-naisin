'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from '@/components/icons';
import { Button } from '@/components/ui/Button';

export type NavigationMode = 'select' | 'calculate' | 'reverse' | 'learn';

interface HeroNavigationProps {
  onModeChange: (mode: NavigationMode) => void;
  currentMode: NavigationMode;
}

/**
 * 手順は実際の操作順（都道府県 → 評定の入力 → 結果）。
 * 文言は page.tsx の HowToSchema（内申点を計算する方法）と同じものを使い、構造化データと見える内容を一致させる。
 */
const STEPS = [
  {
    title: '都道府県を選ぶ',
    text: '内申点の計算方式（満点・対象学年・実技教科の倍率）は都道府県ごとに異なるため、まず自分の都道府県を選択します。',
  },
  {
    title: '9教科の評定を入力する',
    text: '国語・数学・英語・理科・社会・音楽・美術・保健体育・技術家庭の評定（1〜5）を入力します。',
  },
  {
    title: '結果を確認する',
    text: '選択した都道府県の方式に従って内申点が自動計算され、満点に対する達成率や目標との差も同時に表示されます。',
  },
];

export function HeroNavigation({ onModeChange, currentMode }: HeroNavigationProps) {
  if (currentMode !== 'select') {
    return null;
  }

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      {/* ページの頭: タイトル → メタ行 → 結論の1段落 → 主ボタン */}
      <div>
        <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
          内申点を計算する<span className="whitespace-nowrap">（47都道府県対応）</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">2026年度入試対応（令和8年度入学者選抜）</p>
        <p className="mt-4 text-base leading-[1.8] text-slate-900">
          <strong>通知表の数字を入れるだけ。</strong>計算根拠と公式資料も一緒に確認できます。
        </p>

        {/* Main CTA - Single prominent button */}
        <div className="mt-5">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={() => {
              onModeChange('calculate');
              setTimeout(() => {
                document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
          >
            内申点を計算する
          </Button>
          <p className="mt-3 text-sm text-slate-600">
            例：「通知表の数字をいま入れて、内申点を出したい」<span className="whitespace-nowrap">→ こちら</span>
          </p>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          運営者は<strong>2026年度受験生・現役中3</strong>。当事者が作る内申点ツール
        </p>
      </div>

      {/* 手順: 本当に順序のある内容だけ番号を付ける */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">3ステップで内申点を計算</h2>
        <ol className="mt-4 space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-slate-300 text-base font-bold tabular-nums text-slate-900">
                {index + 1}
              </span>
              <div className="min-w-0">
                <div className="text-[17px] font-bold leading-snug text-slate-900">{step.title}</div>
                <p className="mt-1 text-sm leading-[1.8] text-slate-600">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Quick Prefecture Selection - 1クリック化 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">都道府県を選んですぐに計算</h2>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {[
            { code: 'tokyo', name: '東京' },
            { code: 'kanagawa', name: '神奈川' },
            { code: 'osaka', name: '大阪' },
            { code: 'aichi', name: '愛知' },
            { code: 'saitama', name: '埼玉' },
            { code: 'chiba', name: '千葉' },
          ].map((pref) => (
            <Link
              key={pref.code}
              href={`/${pref.code}/naishin`}
              className="inline-flex min-h-11 items-center justify-center rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 hover:border-brand-700 hover:bg-brand-50"
            >
              <span>{pref.name}</span>
              <ChevronRight className="ml-1 h-4 w-4 text-slate-600" />
            </Link>
          ))}
        </div>

        <Link
          href="/prefectures"
          className="mt-3 inline-flex min-h-11 items-center text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          全47都道府県から選ぶ →
        </Link>
      </section>

      {/* Secondary navigation - 用途別に具体例つきで提示（すべて同じ見た目の白いカード） */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">目的別に選ぶ</h2>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href="/reverse"
              className="flex h-full flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-brand-700 hover:bg-brand-50"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-base font-bold text-slate-900">志望校から逆算</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </span>
              <span className="text-sm text-slate-600">目標点から必要な当日点を計算</span>
              <span className="mt-1 text-sm text-brand-700">
                例：「志望校の目標点に届くか確かめたい」<span className="whitespace-nowrap">→ こちら</span>
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/hensachi"
              className="flex h-full flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-brand-700 hover:bg-brand-50"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-base font-bold text-slate-900">偏差値を計算</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </span>
              <span className="text-sm text-slate-600">5教科の点数から偏差値を瞬時に算出</span>
              <span className="mt-1 text-sm text-brand-700">
                例：「模試の点数から偏差値を知りたい」<span className="whitespace-nowrap">→ こちら</span>
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/hyotei-heikin"
              className="flex h-full flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-brand-700 hover:bg-brand-50"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-base font-bold text-slate-900">評定平均を自動計算</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </span>
              <span className="text-sm text-slate-600">通知表の評定から平均値・素内申を算出</span>
              <span className="mt-1 text-sm text-brand-700">
                例：「推薦入試の評定平均を確認したい」<span className="whitespace-nowrap">→ こちら</span>
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/guide"
              className="flex h-full flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-brand-700 hover:bg-brand-50"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-base font-bold text-slate-900">制度を理解する</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </span>
              <span className="text-sm text-slate-600">都道府県別の計算方法・コラム</span>
              <span className="mt-1 text-sm text-brand-700">
                例：「換算内申って何？まず仕組みを知りたい」<span className="whitespace-nowrap">→ こちら</span>
              </span>
            </Link>
          </li>

          {/* 学校ページ(Λ-2)への導線(2026-08-08 loop-question-note【A】③)。既にいる月10,105クリックの
              生徒を個別学校ページ層(実データの倍率/募集人員)へ橋渡しする。新しい面は作らず既存の
              /prefectures(高校別の倍率を見るハブへのリンクを既に持つ)へつなぐだけ。 */}
          <li>
            <Link
              href="/prefectures"
              className="flex h-full flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4 text-left hover:border-brand-700 hover:bg-brand-50"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-base font-bold text-slate-900">高校の倍率を調べる</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
              </span>
              <span className="text-sm text-slate-600">県内の高校別の募集人員・志願者数・倍率を確認</span>
              <span className="mt-1 text-sm text-brand-700">
                例：「気になる高校の倍率を先に見ておきたい」<span className="whitespace-nowrap">→ こちら</span>
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
