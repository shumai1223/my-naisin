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
      <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-brand-600" />
            <span className="text-slate-700">今すぐ内申点を計算</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              aria-label="都道府県を選択"
              value={selectedPrefecture}
              onChange={(e) => setSelectedPrefecture(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-500"
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
              className="flex h-9 items-center gap-1 rounded-lg bg-brand-600 px-4 text-sm text-white hover:bg-brand-700"
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
    <div className="rounded-lg bg-brand-600 p-6 text-white">
      <div className="text-center">
        <h3 className="text-xl font-bold">あなたの内申点を計算してみよう！</h3>
        <p className="mt-2 text-sm text-brand-100">
          都道府県を選んで、すぐに計算を始められます
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-12 w-full items-center justify-between gap-2 rounded-lg bg-white px-4 text-left transition-colors hover:bg-white sm:w-64"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{selectedPref ? selectedPref.name : '都道府県を選択'}</span>
            </div>
            <ChevronRight className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute left-0 top-full z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-lg bg-white p-2 sm:w-64">
              {REGIONS.map(region => (
                <div key={region}>
                  <div className="px-2 py-1 text-xs text-slate-400">{region}</div>
                  {getPrefecturesByRegion(region).map(p => (
                    <button
                      key={p.code}
                      onClick={() => handlePrefectureSelect(p.code)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-brand-50 ${
                        selectedPrefecture === p.code ? 'bg-brand-100 text-brand-700' : 'text-slate-700'
                      }`}
                    >
                      {p.name}
                      <span className="ml-2 text-xs text-slate-400">{p.maxScore}点</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <Link
          href={selectedPrefecture ? `/${selectedPrefecture}/naishin` : '/prefectures'}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-6 font-bold text-brand-600 transition-all sm:w-auto"
        >
          <Calculator className="h-5 w-5" />
          {selectedPrefecture ? '計算する' : '都道府県一覧へ'}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 flex justify-center gap-4 text-xs text-brand-200">
        <Link href="/prefectures" className="hover:text-white hover:underline">
          47都道府県一覧
        </Link>
        <span>|</span>
        <Link href="/reverse" className="flex items-center gap-1 hover:text-white hover:underline">
          <Target className="h-3 w-3" />
          志望校から逆算
        </Link>
      </div>
    </div>
  );
}
