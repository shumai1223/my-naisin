import { Metadata } from 'next';
import { PREFECTURES } from '@/lib/prefectures';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ prefecture: string }>;
}

// 「確認」日: データの値（YYYY-MM-DD）を日本語の日付で表示するだけ（新しい日付は作らない）。
function formatJaDate(iso: string) {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(iso);
  return m ? `${m[1]}年${Number(m[2])}月${Number(m[3])}日` : iso;
}

export async function generateMetadata({ params }: { params: Promise<{ prefecture: string }> }): Promise<Metadata> {
  const { prefecture: code } = await params;
  const prefecture = PREFECTURES.find(p => p.code === code);

  if (!prefecture) {
    return {
      title: '都道府県が見つかりません | My Naishin',
    };
  }

  const title = `【無料】${prefecture.name}の内申点 自動計算サイト｜${prefecture.maxScore}点満点・2026年最新版 | My Naishin`;
  const description = `${prefecture.name}の内申点を無料で自動計算。${prefecture.description} 5教科＋実技4教科の評定から${prefecture.maxScore}点満点で瞬時に算出し、志望校のボーダーラインとも比較できます。2026年（令和8年度）入試の最新計算式に対応。`;
  const keywords = [
    prefecture.name,
    `${prefecture.name} 内申点`,
    `${prefecture.name} 内申点 計算`,
    `${prefecture.name} 高校入試`,
    `${prefecture.name} 内申`,
    '内申点計算',
    '高校受験',
    prefecture.region
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'ja_JP',
      siteName: 'My Naishin - 内申点計算ツール',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://my-naishin.com/${code}/naishin`,
    },
  };
}

export async function generateStaticParams() {
  return PREFECTURES.map((prefecture) => ({
    prefecture: prefecture.code,
  }));
}

export default async function PrefectureNaishinLayout({ children, params }: LayoutProps) {
  const { prefecture: code } = await params;
  const prefecture = PREFECTURES.find(p => p.code === code);

  return (
    <>
      {children}

      {/* SSR静的コンテンツ - Googlebotが初回HTMLで読めるテキスト */}
      {prefecture && (
        <>
        <section className="mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              {prefecture.name}の内申点計算について
            </h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              {prefecture.name}の内申点は{prefecture.maxScore}点満点で計算されます。
              {prefecture.description}
            </p>
            <dl className="mb-4 grid grid-cols-2 border-t border-slate-200">
              <div className="border-b border-slate-200 py-3 pr-4 odd:border-r even:pl-4">
                <dt className="text-xs text-slate-600">満点</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900">{prefecture.maxScore}点</dd>
              </div>
              <div className="border-b border-slate-200 py-3 pr-4 odd:border-r even:pl-4">
                <dt className="text-xs text-slate-600">対象学年</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900">
                  中{prefecture.targetGrades.join('・')}年
                </dd>
              </div>
              <div className="border-b border-slate-200 py-3 pr-4 odd:border-r even:pl-4">
                <dt className="text-xs text-slate-600">5教科倍率</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900">{prefecture.coreMultiplier}倍</dd>
              </div>
              <div className="border-b border-slate-200 py-3 pr-4 odd:border-r even:pl-4">
                <dt className="text-xs text-slate-600">実技4教科倍率</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900">{prefecture.practicalMultiplier}倍</dd>
              </div>
            </dl>
            {prefecture.note && (
              <p className="mb-3 text-sm leading-[1.8] text-slate-600">
                ※ {prefecture.note}
              </p>
            )}
            {prefecture.sourceUrl && (
              <p className="text-xs leading-[1.8] text-slate-600">
                出典：
                <a
                  href={prefecture.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  {prefecture.sourceTitle ?? `${prefecture.name}教育委員会`}
                </a>
                {prefecture.lastVerified && (
                  <span>（{formatJaDate(prefecture.lastVerified)} 確認）</span>
                )}
              </p>
            )}
          </div>
        </section>
        <div className="mx-auto max-w-4xl px-4 pb-8">
          <ParentLeadCTA
            heading={`${prefecture.name}の入試で、お子さまの内申点は足りていますか？`}
            body={`${prefecture.name}は${prefecture.maxScore}点満点。合格ラインまであと何点必要か、お子さまに必要な対策をオンライン個別指導の無料体験で確認できます。全国どこからでも受講でき、費用はかかりません。`}
            affiliateId="sora-juku-text"
            ctaText="無料体験を申し込む（そら塾）"
            note="【そら塾】オンライン個別指導の無料体験（PR）"
            placement="prefecture"
          />
        </div>
        </>
      )}

    </>
  );
}
