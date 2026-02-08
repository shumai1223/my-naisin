// 信頼性情報コンポーネント
import { Calendar, FileText, AlertCircle } from 'lucide-react';

interface TrustInfoProps {
  sources: Array<{
    name: string;
    url: string;
    lastVerified: string;
    description?: string;
  }>;
  lastUpdated: string;
  prefectureName: string;
}

export function TrustInfo({ sources, lastUpdated, prefectureName }: TrustInfoProps) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-800">
        <FileText className="h-5 w-5" />
        {prefectureName}の情報源と更新履歴
      </h3>
      
      <div className="space-y-4">
        {/* 参照資料 */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
            <FileText className="h-4 w-4" />
            参照した公式資料
          </h4>
          <div className="space-y-2">
            {sources.map((source, index) => (
              <div key={index} className="rounded-lg border border-blue-200 bg-white p-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="font-medium text-blue-800">{source.name}</h5>
                    {source.description && (
                      <p className="mt-1 text-xs text-blue-600">{source.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-xs text-blue-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        最終確認: {source.lastVerified}
                      </span>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <span>公式サイトで確認</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 更新履歴 */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
            <Calendar className="h-4 w-4" />
            更新履歴
          </h4>
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800">ページ最終更新</span>
                <span className="text-blue-600">{lastUpdated}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800">データ最終検証</span>
                <span className="text-blue-600">{sources[0]?.lastVerified || '未確認'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-700">
            <AlertCircle className="h-4 w-4" />
            利用上の注意
          </h4>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <ul className="space-y-1 text-xs text-amber-700">
              <li>• 入試制度は年度によって変更される場合があります</li>
              <li>• 最新の情報は各教育委員会の公式サイトでご確認ください</li>
              <li>• 計算結果は目安としてお考えください</li>
              <li>• 学校によっては独自の選考基準がある場合があります</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
