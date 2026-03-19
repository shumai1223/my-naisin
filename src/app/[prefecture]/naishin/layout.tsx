import { Metadata } from 'next';
import { PREFECTURES } from '@/lib/prefectures';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ prefecture: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ prefecture: string }> }): Promise<Metadata> {
  const { prefecture: code } = await params;
  const prefecture = PREFECTURES.find(p => p.code === code);
  
  if (!prefecture) {
    return {
      title: '都道府県が見つかりません | My Naishin',
    };
  }

  const title = `${prefecture.name}の内申点計算ツール【${prefecture.maxScore}点満点】| My Naishin`;
  const description = `${prefecture.name}の内申点を自動計算。${prefecture.description} 計算式、注意点、よくある質問を詳しく解説。${prefecture.name}の高校入試対策に。`;
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
        <section className="mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-3">
              {prefecture.name}の内申点計算について
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 mb-3">
              {prefecture.name}の内申点は{prefecture.maxScore}点満点で計算されます。
              {prefecture.description}
            </p>
            <dl className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-medium text-slate-500">満点</dt>
                <dd className="text-lg font-bold text-slate-800">{prefecture.maxScore}点</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-medium text-slate-500">対象学年</dt>
                <dd className="text-lg font-bold text-slate-800">
                  中{prefecture.targetGrades.join('・')}年
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-medium text-slate-500">5教科倍率</dt>
                <dd className="text-lg font-bold text-slate-800">{prefecture.coreMultiplier}倍</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-medium text-slate-500">実技4教科倍率</dt>
                <dd className="text-lg font-bold text-slate-800">{prefecture.practicalMultiplier}倍</dd>
              </div>
            </dl>
            {prefecture.note && (
              <p className="text-xs text-slate-500 mb-3">
                ※ {prefecture.note}
              </p>
            )}
            {prefecture.sourceUrl && (
              <p className="text-xs text-slate-400">
                出典：
                <a
                  href={prefecture.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  {prefecture.sourceTitle ?? `${prefecture.name}教育委員会`}
                </a>
                {prefecture.lastVerified && (
                  <span>（{prefecture.lastVerified} 確認）</span>
                )}
              </p>
            )}
          </div>
        </section>
      )}

    </>
  );
}
