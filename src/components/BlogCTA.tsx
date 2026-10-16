'use client';

import * as React from 'react';
import Link from 'next/link';
import { Calculator, ChevronRight, MapPin, Target } from '@/components/icons';

import { PREFECTURES, REGIONS, getPrefecturesByRegion } from '@/lib/prefectures';

interface BlogCTAProps {
  prefectureCode?: string;
  variant?: 'default' | 'compact';
}

export function BlogCTA({ prefectureCode, variant = 'default' }: BlogCTAProps) {
  const [selectedPrefecture, setSelectedPrefecture] = React.useState(prefectureCode || '');
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePrefectureSelect = (code: string) => {
    setSelectedPrefecture(code);
    setIsOpen(false);
  };

  const selectedPref = PREFECTURES.find(p => p.code === selectedPrefecture);

  if (variant === 'compact') {
    return (
      <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-brand-700" />
            <span className="text-base text-slate-900">今すぐ内申点を計算</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="都道府県を選択"
              value={selectedPrefecture}
              onChange={(e) => setSelectedPrefecture(e.target.value)}
              className="h-11 rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
            >
              <option value="">都道府県を選択</option>
              {REGIONS.map(region => (
                <optgroup key={region} label={region}>
                  {getPrefecturesByRegion(region).map(p => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <Link
              href={selectedPrefecture ? `/${selectedPrefecture}/naishin` : '/prefectures'}
              className="flex h-11 items-center gap-1 rounded bg-brand-700 px-4 text-sm font-bold text-white transition-colors hover:bg-brand-800"
            >
              計算する
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div>
        <h3 className="text-[17px] font-bold leading-snug text-slate-900">あなたの内申点を計算してみましょう</h3>
        <p className="mt-2 text-sm text-slate-600">
          都道府県を選んで、すぐに計算を始められます
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-12 w-full items-center justify-between gap-2 rounded border border-slate-300 bg-white px-4 text-left text-base text-slate-900 transition-colors hover:bg-slate-50 sm:w-64"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{selectedPref ? selectedPref.name : '都道府県を選択'}</span>
            </div>
            <ChevronRight className={`h-5 w-5 ${isOpen ? 'rotate-90' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-full z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 shadow-overlay sm:w-64">
              {REGIONS.map(region => (
                <div key={region}>
                  <div className="px-2 py-1 text-xs text-slate-600">{region}</div>
                  {getPrefecturesByRegion(region).map(p => (
                    <button
                      key={p.code}
                      onClick={() => handlePrefectureSelect(p.code)}
                      className={`flex min-h-[44px] w-full items-center rounded px-3 py-2 text-left text-sm transition-colors hover:bg-brand-50 ${
                        selectedPrefecture === p.code ? 'bg-brand-100 font-bold text-brand-700' : 'text-slate-900'
                      }`}
                    >
                      {p.name}
                      <span className="ml-2 text-xs tabular-nums text-slate-600">{p.maxScore}点</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href={selectedPrefecture ? `/${selectedPrefecture}/naishin` : '/prefectures'}
          className="flex h-12 w-full items-center justify-center gap-2 rounded bg-brand-700 px-6 text-base font-bold text-white transition-colors hover:bg-brand-800 sm:w-auto"
        >
          <Calculator className="h-5 w-5" />
          {selectedPrefecture ? '計算する' : '都道府県一覧へ'}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-6 text-sm">
        <Link href="/prefectures" className="inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-2 hover:text-brand-800">
          47都道府県一覧
        </Link>
        <Link href="/reverse" className="inline-flex min-h-[44px] items-center gap-1 text-brand-700 underline underline-offset-2 hover:text-brand-800">
          <Target className="h-4 w-4" />
          志望校から逆算
        </Link>
      </div>
    </div>
  );
}
