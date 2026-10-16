// 県別リンクリストコンポーネント
import Link from 'next/link';
import { PREFECTURES, REGIONS } from '@/lib/prefectures';
import { ChevronRight } from '@/components/icons';

interface PrefectureLinkListProps {
  region?: string;
  limit?: number;
}

export function PrefectureLinkList({ region, limit }: PrefectureLinkListProps) {
  let prefectures = PREFECTURES;
  
  // 地域でフィルター
  if (region) {
    prefectures = prefectures.filter(p => p.region === region);
  }
  
  // 件数制限
  if (limit) {
    prefectures = prefectures.slice(0, limit);
  }
  
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {prefectures.map((prefecture) => (
        <div key={prefecture.code} className="prefecture-item">
          <Link 
            href={`/${prefecture.code}/naishin`} 
            className="prefecture-link block rounded-lg border border-slate-200 bg-white p-4 transition-colors duration-150 hover:border-brand-700 hover:bg-brand-50"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900">{prefecture.name}</h4>
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs font-bold tabular-nums text-brand-700">{prefecture.maxScore}点満点</p>
              <div className="text-xs text-slate-600">
                中{prefecture.targetGrades.join('・')}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

// 地域別リストコンポーネント
export function RegionPrefectureList() {
  return (
    <div className="space-y-10">
      {REGIONS.map((region) => {
        const regionPrefectures = PREFECTURES.filter(p => p.region === region);
        
        return (
          <div key={region} className="region-section">
            <div className="mb-4 flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                {region}エリア
              </h3>
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs tabular-nums text-slate-700">
                {regionPrefectures.length}
              </span>
            </div>
            <PrefectureLinkList region={region} />
          </div>
        );
      })}
    </div>
  );
}
