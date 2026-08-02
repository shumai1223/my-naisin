'use client';

import Link from 'next/link';
import { Target, Search, MessageCircle, ChevronRight } from 'lucide-react';

import { lineAddUrl } from '@/lib/line';
import type { SchoolPageCta } from '@/lib/school-page-clicks-db';

interface SchoolPageConvertCTAProps {
  schoolName: string;
  prefectureCode: string;
  schoolCode: string;
  className?: string;
}

/**
 * 学校ページ（Λ-2）の換金導線＝主食②-1。計測は主食②-2（本コンポーネントのreportClick）。
 *
 * 倍率を見せて終わっていた学校ページに、学校名と県を引き継いだ状態で
 * 「内申計算機／保護者向けLINE／塾リード」へつなぐ。3,500ページ全部に一度に効く単一コンポーネント。
 * 学校別ボーダーは断定しない（Y-0）ため、CTA文言も「目安を確認する」に留める。
 *
 * クリック計測（[[ga4-undercounts-conversions]]でGA4は下限値と判明済みのためD1に一次記録）：
 * 遷移を止めずに `fetch(..., { keepalive: true })` で /api/school-click をベストエフォート送信する。
 * 失敗しても遷移（Link/外部リンク）は通常どおり進む＝計測がUXを壊さない。
 */
function reportClick(prefectureCode: string, schoolCode: string, cta: SchoolPageCta) {
  try {
    fetch('/api/school-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefectureCode, schoolCode, cta }),
      keepalive: true,
    }).catch(() => {
      /* no-op */
    });
  } catch {
    /* no-op */
  }
}

export function SchoolPageConvertCTA({ schoolName, prefectureCode, schoolCode, className = '' }: SchoolPageConvertCTAProps) {
  return (
    <section className={`rounded-2xl border border-blue-200 bg-blue-50/60 p-6 shadow-sm ${className}`}>
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-800">
        <Target className="h-5 w-5 shrink-0 text-blue-600" />
        {schoolName}を目指すなら
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">
        今の内申点で足りているか、県の配点比率から必要な当日点を逆算できます。無料体験のある塾を条件付きで探すこともできます。
      </p>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Link
          href={`/reverse?pref=${prefectureCode}`}
          onClick={() => reportClick(prefectureCode, schoolCode, 'reverse')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
        >
          <Target className="h-4 w-4 shrink-0" />
          必要な当日点を逆算する
        </Link>
        <Link
          href="/juku-shindan"
          onClick={() => reportClick(prefectureCode, schoolCode, 'juku-shindan')}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-4 py-3 text-sm font-bold text-blue-700 transition-all hover:bg-blue-50"
        >
          <Search className="h-4 w-4 shrink-0" />
          条件に合う塾を無料診断
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        </Link>
      </div>
      <a
        href={lineAddUrl('student')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => reportClick(prefectureCode, schoolCode, 'line')}
        className="mt-2.5 flex items-center justify-center gap-2 rounded-xl bg-[#06C755] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <MessageCircle className="h-4 w-4 shrink-0" />
        受験情報をLINEで受け取る
      </a>
    </section>
  );
}
