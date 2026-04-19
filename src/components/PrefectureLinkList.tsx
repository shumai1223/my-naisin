// 県別リンクリストコンポーネント
import Link from 'next/link';
import { PREFECTURES, REGIONS } from '@/lib/prefectures';
import { ChevronRight, MapPin } from 'lucide-react';

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
            className="prefecture-link block rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800">{prefecture.name}</h4>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-blue-600 font-bold">{prefecture.maxScore}点満点</p>
              <div className="text-[10px] text-slate-400">
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
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {region}エリア
              </h3>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
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
