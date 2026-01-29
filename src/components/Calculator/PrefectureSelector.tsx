'use client';

import * as React from 'react';
import { ChevronDown, MapPin, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { PREFECTURES, REGIONS, getPrefecturesByRegion, type PrefectureConfig } from '@/lib/prefectures';
import { cn } from '@/lib/utils';

interface PrefectureSelectorProps {
  selectedCode: string;
  onChange: (code: string) => void;
  use10PointScale: boolean;
  onScale10Change: (enabled: boolean) => void;
  className?: string;
}

export function PrefectureSelector({
  selectedCode,
  onChange,
  use10PointScale,
  onScale10Change,
  className
}: PrefectureSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedPrefecture = React.useMemo(
    () => PREFECTURES.find(p => p.code === selectedCode),
    [selectedCode]
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

  return (
    <div className={cn('space-y-3', className)}>
      {/* Prefecture Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left transition-all',
            'border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400',
            isOpen && 'ring-2 ring-blue-500/20 border-blue-400'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">
                {selectedPrefecture?.name ?? '都道府県を選択'}
              </div>
              <div className="text-xs text-slate-500">
                {selectedPrefecture?.description ?? '計算方法を選んでください'}
              </div>
            </div>
          </div>
          <ChevronDown className={cn(
            'h-5 w-5 text-slate-400 transition-transform',
            isOpen && 'rotate-180'
          )} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
            >
              {REGIONS.map(region => (
                <div key={region}>
                  <div className="sticky top-0 bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {region}
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-2 sm:grid-cols-3">
                    {getPrefecturesByRegion(region).map(pref => (
                      <button
                        key={pref.code}
                        type="button"
                        onClick={() => handleSelect(pref.code)}
                        className={cn(
                          'rounded-xl px-3 py-2 text-left text-sm transition-all',
                          pref.code === selectedCode
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 font-bold text-white shadow-md'
                            : 'text-slate-700 hover:bg-slate-100'
                        )}
                      >
                        {pref.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prefecture Info Card */}
      {selectedPrefecture && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-800">{selectedPrefecture.name}の計算方法</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-600">
                {selectedPrefecture.description}
              </div>
              {selectedPrefecture.note && (
                <div className="mt-2 text-xs text-slate-500">
                  ※ {selectedPrefecture.note}
                </div>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm">
                  満点: {selectedPrefecture.maxScore}点
                </span>
                <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm">
                  対象: 中{selectedPrefecture.targetGrades.join('・')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 10-Point Scale Toggle */}
      {selectedPrefecture?.supports10PointScale && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-800">10段階評価モード</div>
              <div className="mt-0.5 text-xs text-slate-600">
                {selectedPrefecture.name}では中3の成績が10段階評価です
              </div>
            </div>
            <button
              type="button"
              onClick={() => onScale10Change(!use10PointScale)}
              className={cn(
                'relative h-7 w-12 rounded-full transition-all duration-200',
                use10PointScale
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-inner'
                  : 'bg-slate-200'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-200',
                  use10PointScale ? 'left-[22px]' : 'left-0.5'
                )}
              />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
