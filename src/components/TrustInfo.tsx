import Link from 'next/link';
import { AlertCircle } from '@/components/icons';

interface TrustInfoProps {
  sources?: Array<{
    name: string;
    url: string;
    lastVerified: string;
    description?: string;
  }>;
  lastUpdated?: string;
  prefectureName?: string;
}

export function TrustInfo({ sources, lastUpdated, prefectureName }: TrustInfoProps) {
  if (sources && lastUpdated && prefectureName) {
    return (
      <div className="mt-12 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        <h3 className="text-[17px] font-bold text-slate-900">{prefectureName}の情報源と更新履歴</h3>

        <div className="mt-4 space-y-6">
          {/* 参照資料 */}
          <div>
            <h4 className="text-base font-bold text-slate-900">参照した公式資料</h4>
            <ul className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
              {sources.map((source, index) => (
                <li key={index} className="py-3">
                  <h5 className="text-sm font-bold text-slate-900">{source.name}</h5>
                  {source.description && (
                    <p className="mt-1 text-sm text-slate-600">{source.description}</p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 text-sm text-slate-600">
                    <span>最終確認: {source.lastVerified}</span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                    >
                      公式サイトで確認
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 更新履歴 */}
          <div>
            <h4 className="text-base font-bold text-slate-900">更新履歴</h4>
            <dl className="mt-2 divide-y divide-slate-200 border-y border-slate-200 text-sm">
              <div className="flex items-center justify-between gap-4 py-2">
                <dt className="text-slate-600">ページ最終更新</dt>
                <dd className="font-bold tabular-nums text-slate-900">{lastUpdated}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-2">
                <dt className="text-slate-600">データ最終検証</dt>
                <dd className="font-bold tabular-nums text-slate-900">{sources[0]?.lastVerified || '未確認'}</dd>
              </div>
            </dl>
          </div>

          {/* 注意事項 */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <h4 className="flex items-center gap-2 text-base font-bold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              利用上の注意
            </h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[1.8]">
              <li>入試制度は年度によって変更される場合があります</li>
              <li>最新の情報は各教育委員会の公式サイトでご確認ください</li>
              <li>計算結果は目安としてお考えください</li>
              <li>学校によっては独自の選考基準がある場合があります</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="mt-12 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <h3 className="text-[17px] font-bold text-slate-900">内申点シミュレーター 開発・運営チーム</h3>
      <p className="mt-2 text-base leading-[1.8] text-slate-900">
        現役のエンジニアと受験指導経験者によって運営されています。各都道府県の教育委員会が発表する最新の「入学者選抜実施要綱」を1点1点プログラムに落とし込み、常に最新の計算ロジックを提供できるよう保守管理を行っています。
      </p>
      <div className="mt-2 flex flex-wrap gap-x-6">
        <Link
          href="/about/editor-profile"
          className="inline-flex min-h-[44px] items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          運営者プロフィール
        </Link>
        <Link
          href="/quality"
          className="inline-flex min-h-[44px] items-center text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          情報の正確性への取り組み
        </Link>
      </div>
    </section>
  );
}
