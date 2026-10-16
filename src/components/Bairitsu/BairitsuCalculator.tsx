'use client';

import * as React from 'react';

import { calcApplicationRatio, calcActualRatio, roundRatio } from '@/lib/bairitsu';
import { funnel } from '@/lib/track';

/**
 * 高校入試の倍率計算機（志願倍率・実質倍率）。B-6。
 * 学校別の実数（志願者数・合格者数）は年度で変動し県教委の一次発表でしか正確に分からないため、
 * 特定校の数値は持たず、ユーザーが自分で調べた数字を入れて計算する汎用ツールにする（捏造ゼロ）。
 */
export function BairitsuCalculator() {
  const [capacity, setCapacity] = React.useState('');
  const [applicants, setApplicants] = React.useState('');
  const [testTakers, setTestTakers] = React.useState('');
  const [passers, setPassers] = React.useState('');
  const trackedRef = React.useRef(false);

  function onFirstUse() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    funnel.toolStart({ tool: 'bairitsu', placement: 'bairitsu' });
  }

  const capacityNum = Number(capacity);
  const applicantsNum = Number(applicants);
  const testTakersNum = Number(testTakers);
  const passersNum = Number(passers);

  const applicationRatio =
    capacity !== '' && applicants !== '' ? calcApplicationRatio(applicantsNum, capacityNum) : null;
  const actualRatio = testTakers !== '' && passers !== '' ? calcActualRatio(testTakersNum, passersNum) : null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-2 text-[17px] font-bold text-slate-900">① 志願倍率（志願者数 ÷ 募集人員）</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-900">募集人員</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={capacity}
            onChange={(e) => {
              onFirstUse();
              setCapacity(e.target.value);
            }}
            placeholder="例：200"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-900">志願者数</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={applicants}
            onChange={(e) => {
              onFirstUse();
              setApplicants(e.target.value);
            }}
            placeholder="例：280"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </label>
      </div>
      {applicationRatio !== null && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4 text-center">
          <div className="text-sm text-slate-600">志願倍率</div>
          <div className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{roundRatio(applicationRatio)}倍</div>
        </div>
      )}

      <div className="mb-2 mt-6 text-[17px] font-bold text-slate-900">② 実質倍率（受験者数 ÷ 合格者数・任意）</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-900">受験者数</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={testTakers}
            onChange={(e) => {
              onFirstUse();
              setTestTakers(e.target.value);
            }}
            placeholder="例：270"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-900">合格者数</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={passers}
            onChange={(e) => {
              onFirstUse();
              setPassers(e.target.value);
            }}
            placeholder="例：200"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </label>
      </div>
      {actualRatio !== null && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4 text-center">
          <div className="text-sm text-slate-600">実質倍率</div>
          <div className="mt-1 text-3xl font-bold tabular-nums text-slate-900">{roundRatio(actualRatio)}倍</div>
        </div>
      )}

      {applicationRatio === null && actualRatio === null && (
        <p className="mt-4 text-center text-sm text-slate-600">募集人員・志願者数（または受験者数・合格者数）を入力してください</p>
      )}

      <p className="mt-4 text-sm leading-[1.8] text-slate-600">
        ※ このツールは数字を入れて倍率を計算する汎用計算機です。学校別・年度別の実際の募集人員・志願者数・合格者数は当サイトでは保持していません。志望校の最新の倍率は、必ず志望する都道府県教育委員会の発表資料でご確認ください。
      </p>
    </div>
  );
}
