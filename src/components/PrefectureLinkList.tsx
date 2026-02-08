// 県別リンクリストコンポーネント
import Link from 'next/link';
import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';

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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {prefectures.map((prefecture) => (
        <div key={prefecture.code} className="prefecture-item">
          <Link 
            href={`/${prefecture.code}/naishin`} 
            className="prefecture-link block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
          >
            <h4 className="font-semibold text-slate-800">{prefecture.name}</h4>
            <p className="mt-1 text-sm text-blue-600 font-medium">{prefecture.maxScore}点満点</p>
            <div className="mt-2 text-xs text-slate-500">
              中{prefecture.targetGrades.join('・')}対象
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <span>→ 詳細を見る</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

// 地域別リストコンポーネント
export function RegionPrefectureList() {
  const regions = [
    { name: '北海道・東北', code: 'hokkaido-tohoku' },
    { name: '関東', code: 'kanto' },
    { name: '中部', code: 'chubu' },
    { name: '近畿', code: 'kinki' },
    { name: '中国・四国', code: 'chugoku-shikoku' },
    { name: '九州・沖縄', code: 'kyushu-okinawa' }
  ];
  
  return (
    <div className="space-y-8">
      {regions.map((region) => {
        const regionPrefectures = PREFECTURES.filter(p => p.region === region.name);
        
        return (
          <div key={region.code} className="region-section">
            <h3 className="mb-4 text-lg font-bold text-slate-800">
              {region.name}（{regionPrefectures.length}件）
            </h3>
            <PrefectureLinkList region={region.name} />
          </div>
        );
      })}
    </div>
  );
}
