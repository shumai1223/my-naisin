'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, MapPin, Calculator, ChevronRight, ExternalLink, Calendar, ChevronDown } from 'lucide-react';

import { PREFECTURES, REGIONS, getPrefecturesByRegion } from '@/lib/prefectures';
import type { RegionName } from '@/lib/prefectures';

export default function PrefecturesPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRegion, setSelectedRegion] = React.useState<RegionName | 'all'>('all');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = React.useState(false);
  const regionDropdownRef = React.useRef<HTMLDivElement>(null);

  const filteredPrefectures = React.useMemo(() => {
    let results = PREFECTURES;
    
    if (selectedRegion !== 'all') {
      results = getPrefecturesByRegion(selectedRegion);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(p => 
        p.name.includes(searchQuery) || 
        p.code.toLowerCase().includes(query)
      );
    }
    
    return results;
  }, [searchQuery, selectedRegion]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setIsRegionDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groupedByRegion = React.useMemo(() => {
    if (selectedRegion !== 'all') {
      return { [selectedRegion]: filteredPrefectures };
    }
    
    const grouped: Record<string, typeof PREFECTURES> = {};
    for (const region of REGIONS) {
      const prefs = filteredPrefectures.filter(p => p.region === region);
      if (prefs.length > 0) {
        grouped[region] = prefs;
      }
    }
    return grouped;
  }, [filteredPrefectures, selectedRegion]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">ホーム</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">都道府県一覧</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">
            都道府県別 内申点計算
          </h1>
          <p className="mt-2 text-slate-600">
            47都道府県すべての内申点計算方法に対応。お住まいの地域を選んで計算できます。
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            2026年度入試対応（令和8年度入学者選抜）
          </div>
        </header>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="都道府県名で検索..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <div ref={regionDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
              className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-left transition-all shadow-sm hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 sm:w-48"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {selectedRegion === 'all' ? '全地域' : selectedRegion}
                  </div>
                  <div className="text-xs text-slate-500">
                    {selectedRegion === 'all' ? 'すべての地域' : `${selectedRegion}地域`}
                  </div>
                </div>
              </div>
              <div className="rounded-full bg-slate-100 p-2">
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isRegionDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-48">
                <div className="max-h-64 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRegion('all');
                      setIsRegionDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-blue-50 ${
                      selectedRegion === 'all' ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="font-medium text-slate-800">全地域</div>
                    <div className="text-xs text-slate-500">すべての都道府県</div>
                  </button>
                  {REGIONS.map(region => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => {
                        setSelectedRegion(region);
                        setIsRegionDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-colors hover:bg-blue-50 ${
                        selectedRegion === region ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="font-medium text-slate-800">{region}</div>
                      <div className="text-xs text-slate-500">{region}地域</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
            <div className="text-3xl font-bold text-blue-700">47</div>
            <div className="text-sm text-blue-600">都道府県対応</div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <div className="text-3xl font-bold text-emerald-700">2026年度入試対応</div>
            <div className="text-sm text-emerald-600">（令和8年度入学者選抜）</div>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 text-center">
            <div className="text-3xl font-bold text-violet-700">{filteredPrefectures.length}</div>
            <div className="text-sm text-violet-600">検索結果</div>
          </div>
        </div>

        {/* Prefecture List by Region */}
        <div className="space-y-8">
          {Object.entries(groupedByRegion).map(([region, prefectures]) => (
            <section key={region}>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                <MapPin className="h-5 w-5 text-blue-500" />
                {region}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  ({prefectures.length}件)
                </span>
              </h2>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {prefectures.map(pref => (
                  <Link
                    key={pref.code}
                    href={`/${pref.code}/naishin`}
                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600">
                          {pref.name}
                        </h3>
                        <div className="mt-1 text-2xl font-bold text-blue-600">
                          {pref.maxScore}点
                          <span className="ml-1 text-sm font-normal text-slate-500">満点</span>
                        </div>
                      </div>
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                        <Calculator className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <div>対象：中{pref.targetGrades.join('・')}</div>
                      {pref.practicalMultiplier > 1 && (
                        <div>実技：{pref.practicalMultiplier}倍</div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      {pref.sourceUrl ? (
                        <a
                          href={pref.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600"
                        >
                          <ExternalLink className="h-3 w-3" />
                          公式
                        </a>
                      ) : (
                        <span />
                      )}
                      {pref.lastVerified && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar className="h-3 w-3" />
                          {pref.lastVerified}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {filteredPrefectures.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="text-4xl">🔍</div>
            <div className="mt-4 text-lg font-medium text-slate-600">
              該当する都道府県が見つかりません
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('all');
              }}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              検索条件をリセット
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">今すぐ内申点を計算しよう</h2>
          <p className="mt-2 text-blue-100">
            都道府県を選んで、成績を入力するだけで内申点がわかります
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-600 shadow-lg transition-all hover:shadow-xl"
          >
            <Calculator className="h-5 w-5" />
            計算ツールを使う
          </Link>
        </div>
      </div>
    </div>
  );
}
