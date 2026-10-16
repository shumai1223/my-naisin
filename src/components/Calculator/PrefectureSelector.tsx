'use client';

import * as React from 'react';
import { ChevronDown, MapPin, AlertTriangle, ExternalLink } from '@/components/icons';

import { PREFECTURES, REGIONS, getPrefecturesByRegion, resolvePrefectureConfig } from '@/lib/prefectures';
import { cn } from '@/lib/utils';

interface PrefectureSelectorProps {
  selectedCode: string;
  onChange: (code: string) => void;
  use10PointScale: boolean;
  onScale10Change: (enabled: boolean) => void;
  variantCode?: string;
  onVariantChange?: (code: string) => void;
  className?: string;
  /** 「都道府県の選択」の見出しレベル。既定は3（直前が h2 のとき）。h1 の直下に置くページでは 2 を渡す。 */
  headingLevel?: 2 | 3;
}

export function PrefectureSelector({
  selectedCode,
  onChange,
  use10PointScale,
  onScale10Change,
  variantCode,
  onVariantChange,
  className,
  headingLevel = 3
}: PrefectureSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  const rawSelectedPrefecture = React.useMemo(
    () => PREFECTURES.find(p => p.code === selectedCode),
    [selectedCode]
  );

  const selectedPrefecture = React.useMemo(
    () => (rawSelectedPrefecture ? resolvePrefectureConfig(rawSelectedPrefecture, variantCode) : undefined),
    [rawSelectedPrefecture, variantCode]
  );

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  const isDefaultPrefecture = selectedCode === 'tokyo';

  return (
    <div className={cn('space-y-4', className)}>
      {/* Attention Banner - Show when using default Tokyo */}
      {isDefaultPrefecture && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 motion-safe:animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" />
            <div className="flex-1">
              <div className="text-sm font-bold text-amber-900">お住まいの都道府県を選択してください</div>
              <div className="mt-1 text-sm leading-relaxed text-amber-900">
                現在「東京都」が選択されています。<span className="font-bold">都道府県によって計算方法が大きく異なります</span>。
                正しい内申点を計算するため、下のボタンからお住まいの地域を選んでください。
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {/* Section Label */}
        <div className="mb-2">
          <Heading className="text-[17px] font-bold text-slate-900">都道府県の選択</Heading>
          <p className="text-sm text-slate-600">お住まいの地域を選んでください</p>
        </div>

        {/* Prefecture Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className={cn(
              'flex min-h-[56px] w-full items-center justify-between gap-3 rounded border bg-white px-4 py-3 text-left transition-colors duration-100 hover:bg-slate-50',
              'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700',
              isDefaultPrefecture ? 'border-amber-200' : 'border-slate-300'
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-brand-700" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-base font-bold text-slate-900">
                    {selectedPrefecture?.name ?? '都道府県を選択'}
                  </div>
                  {isDefaultPrefecture && (
                    <span className="inline-flex items-center rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-900">
                      変更推奨
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-600">
                  {isDefaultPrefecture ? 'タップして都道府県を選択' : selectedPrefecture?.description ?? '計算方法を選んでください'}
                </div>
              </div>
            </div>
            <ChevronDown className={cn('h-5 w-5 shrink-0 text-slate-600', isOpen && 'rotate-180')} />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-overlay motion-safe:animate-fade-in">
              {REGIONS.map(region => (
                <div key={region}>
                  <div className="sticky top-0 border-b border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
                    {region}
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2 sm:grid-cols-3">
                    {getPrefecturesByRegion(region).map(pref => (
                      <button
                        key={pref.code}
                        type="button"
                        onClick={() => handleSelect(pref.code)}
                        aria-current={pref.code === selectedCode ? 'true' : undefined}
                        className={cn(
                          'min-h-[44px] rounded px-3 py-2 text-left text-sm transition-colors duration-100',
                          pref.code === selectedCode
                            ? 'bg-brand-700 font-bold text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        )}
                      >
                        {pref.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prefecture Info Card */}
      {selectedPrefecture && (
        <div className="rounded-lg border border-slate-200 bg-brand-50 p-4 motion-safe:animate-fade-in">
          <div className="text-sm font-bold text-slate-900">{selectedPrefecture.name}の計算方法</div>
          <div className="mt-1 text-sm leading-relaxed text-slate-900">
            {selectedPrefecture.description}
          </div>
          {selectedPrefecture.note && (
            <div className="mt-2 text-sm text-slate-600">
              ※ {selectedPrefecture.note}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs tabular-nums text-slate-700">
              満点: {selectedPrefecture.maxScore}点
            </span>
            <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs tabular-nums text-slate-700">
              対象: 中{selectedPrefecture.targetGrades.join('・')}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-200 pt-3 text-sm text-slate-600">
            <span className="inline-flex flex-wrap items-center gap-x-1">
              出典：
              <a
                href={selectedPrefecture.sourceUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1 text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {selectedPrefecture.sourceTitle || `${selectedPrefecture.name}教育委員会`}
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </span>
            <span>最終確認日: {selectedPrefecture.lastVerified ?? '未確認'}</span>
          </div>
        </div>
      )}

      {/* 10-Point Scale Toggle */}
      {selectedPrefecture?.supports10PointScale && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 motion-safe:animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900">10段階評価モード</div>
              <div className="mt-0.5 text-sm text-slate-600">
                {selectedPrefecture.name}では中3の成績が10段階評価です
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={use10PointScale}
              aria-label="10段階評価モード"
              onClick={() => onScale10Change(!use10PointScale)}
              className="relative inline-flex h-11 w-14 shrink-0 items-center justify-center rounded outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              <span
                className={cn(
                  'relative block h-7 w-12 rounded-full motion-safe:transition-colors motion-safe:duration-100',
                  use10PointScale
                    ? 'bg-brand-700'
                    : 'bg-slate-400'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-6 w-6 rounded-full bg-white motion-safe:transition-all motion-safe:duration-100',
                    use10PointScale ? 'left-[22px]' : 'left-0.5'
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* School-dependent Pattern Selector（例: 奈良県2026年改定の4パターン） */}
      {rawSelectedPrefecture?.variants && rawSelectedPrefecture.variants.length > 1 && onVariantChange && (
        <div className="rounded-lg border border-slate-200 bg-brand-50 p-4 motion-safe:animate-fade-in">
          <div className="text-sm font-bold text-slate-900">志望校のパターンを選択</div>
          <div className="mt-0.5 text-sm text-slate-600">
            {rawSelectedPrefecture.name}は学校により満点・計算方法が異なります。志望校の募集要項で確認してください。
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {rawSelectedPrefecture.variants.map((variant) => {
              const isActive = (variantCode ?? rawSelectedPrefecture.variants![0].code) === variant.code;
              return (
                <button
                  key={variant.code}
                  type="button"
                  onClick={() => onVariantChange(variant.code)}
                  aria-pressed={isActive}
                  className={cn(
                    'min-h-[44px] rounded border px-3 py-2 text-left text-sm transition-colors duration-100',
                    isActive
                      ? 'border-brand-700 bg-brand-700 text-white'
                      : 'border-slate-300 bg-white text-slate-900 hover:bg-brand-50'
                  )}
                >
                  <div className="font-bold">{variant.name}（{variant.maxScore}点満点）</div>
                  <div className={cn('mt-0.5 leading-relaxed', isActive ? 'text-brand-50' : 'text-slate-600')}>
                    {variant.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
