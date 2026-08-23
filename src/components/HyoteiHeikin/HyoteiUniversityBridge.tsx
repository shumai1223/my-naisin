'use client';

import * as React from 'react';
import { GraduationCap, ChevronRight } from 'lucide-react';

import { EVENTS, track } from '@/lib/track';
import { beaconStudentFunnelEvent } from '@/lib/student-funnel-beacon';

const MY_SHINGAKU_URL = 'https://my-shingaku.com';

/**
 * 高校生シグナル限定の大学受験ブリッジ（TIER Σ-7・2026-08-03）。
 *
 * Σ-6の実測診断（GSC28日クエリ分解）で /hyotei-heikin の検索意図は「高校生専用」ではなく
 * 中学生/高校生の混在と確定した。最多クリック語「評定平均 計算 サイト」(904クリック・1位・
 * CTR56%)は学年シグナルが無い汎用語で、このページ自体が「評定平均 自動計算 中学生」等の
 * 中学生明示クエリでも実際にクリックされている。
 *
 * → ページ本体の中立フレームは変更せず、学年を自己申告してもらった上で「高校生」を選んだ
 *   場合だけ大学受験導線（姉妹サイトMy Shingaku）を追加表示する。新しいCTA種別は増やさず、
 *   自己申告なし（大多数）の場合は既存の導線（ParentShareInvite→ParentLeadCTA→SaveResultCTA）
 *   のみが今までどおり表示される＝#1ランクページへの実害ゼロ。
 *
 * 大学資料請求は本人（高校生）が完結できるため、内申点/偏差値の保護者ブリッジとは分離し、
 * 直接My Shingakuへ誘導する（ASP新規提携は不要・既存の姉妹サイトへの内部相互送客）。
 */
export function HyoteiUniversityBridge({ value }: { value: number | null }) {
  const [grade, setGrade] = React.useState<'unset' | 'chugaku' | 'koukou'>('unset');

  const selectGrade = React.useCallback((g: 'chugaku' | 'koukou') => {
    setGrade(g);
    track(EVENTS.GRADE_SELF_IDENTIFY, { tool: 'hyotei-heikin', grade: g });
    // S12-1: GA4がこのページで計測系統ごと機能していない疑いがあるため、D1一次記録を併走させる。
    beaconStudentFunnelEvent('grade_self_identify', { grade: g, tool: 'hyotei-heikin' });
  }, []);

  const onBridgeClick = React.useCallback(() => {
    track(EVENTS.UNIVERSITY_BRIDGE_CLICK, { tool: 'hyotei-heikin' });
    beaconStudentFunnelEvent('university_bridge_click', { grade: 'koukou', tool: 'hyotei-heikin' });
  }, []);

  // 中学生を選んだ場合は既存導線のまま＝何も追加しない。
  if (grade === 'chugaku') return null;

  if (grade === 'koukou') {
    const v = typeof value === 'number' ? value.toFixed(1) : null;
    return (
      <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 md:p-5">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
          <GraduationCap className="h-3.5 w-3.5" />
          高校生の方へ
        </div>
        <p className="mb-3 text-sm leading-relaxed text-slate-700">
          {v ? `評定平均${v}は` : '今の評定平均は'}
          指定校推薦・総合型選抜の出願基準に直結します。大学の学費・奨学金・一人暮らしの費用まで、姉妹サイト「My
          Shingaku」で無料で調べられます。
        </p>
        <a
          href={MY_SHINGAKU_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onBridgeClick}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          My Shingakuで大学の費用・進路を調べる
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
      <p className="mb-3 text-sm font-semibold text-slate-700">今の学年を教えてください（あなたに合った次の一歩をご案内します）</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => selectGrade('chugaku')}
          className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
        >
          中学生
        </button>
        <button
          type="button"
          onClick={() => selectGrade('koukou')}
          className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
        >
          高校生
        </button>
      </div>
    </div>
  );
}
