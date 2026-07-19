import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ChevronRightSquare, Map as MapIcon } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { NaishinMapGrid } from '@/components/NaishinMapGrid';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: 'この地図は実際の都道府県の形をしていますか？',
    answer:
      'いいえ。この地図は47都道府県の位置関係（北海道が北・沖縄が南など）を保ちつつ、1つのマス目で1都道府県を表す「簡略化した模式図（タイルグリッド地図）」です。実際の県境の形状・面積とは異なります。実際の県境を正確に再現した地図ではなく、データを比較しやすくするための模式図としてご利用ください。',
  },
  {
    question: 'マス目の色は何を表していますか？',
    answer:
      '選んだ指標（実技教科の傾斜倍率／中3の重み／内申点の満点）について、47都道府県の実測値を5段階に色分けしています。色が濃いほど値が大きいことを表します。正確な数値は各マスにカーソルを合わせる（タップする）か、下の「表で見る」から確認できます。',
  },
  {
    question: 'データの出典はどこですか？',
    answer:
      '各都道府県の教育委員会が公式に発表している入学者選抜実施要項・実施要領です。本サイトの内申点計算エンジン（src/lib/prefectures.ts）と同じデータソースを使用しており、新しい一次データを追加したものではなく、既存の検証済みデータから算出した派生値です。',
  },
  {
    question: '内申点の満点が大きい都道府県ほど有利なのですか？',
    answer:
      'いいえ、そうとは限りません。内申点の満点は学年数・倍率の設定の掛け算で決まる「ものさしの目盛り」であり、満点の大小そのものに合否の有利・不利の意味はありません。重要なのは満点に対してどれだけの割合を取れているかです。詳しくは「都道府県別 内申点格差レポート」で解説しています。',
  },
];

export const metadata: Metadata = {
  title: '内申点の日本地図【都道府県タイルマップで比較】| My Naishin',
  description:
    '47都道府県の内申点の「実技教科の傾斜倍率」「中3の重み」「満点」を、色分けされたタイルグリッド地図で一目比較。各都道府県教育委員会の公式データに基づく、簡略化した模式図です。',
  keywords: ['内申点 地図', '内申点 都道府県 比較 地図', '内申点 全国マップ', '内申点 都道府県 違い 可視化'],
  alternates: { canonical: `${SITE_URL}/naishin-map` },
  openGraph: {
    title: '内申点の日本地図【都道府県タイルマップ】| My Naishin',
    description: '47都道府県の内申点の重み付けを、色分けされたタイル地図で一目比較。',
    url: `${SITE_URL}/naishin-map`,
    type: 'article',
  },
};

export default function NaishinMapPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '内申点格差レポート', url: `${SITE_URL}/naishin-kakusa` },
          { name: '内申点の日本地図', url: `${SITE_URL}/naishin-map` },
        ]}
      />
      <ArticleSchema
        title="内申点の日本地図（都道府県タイルマップ）"
        description="47都道府県の内申点算出方式（実技傾斜・中3の重み・満点）を、簡略化したタイルグリッド地図で色分け比較する可視化コンテンツ"
        datePublished="2026-07-19"
        dateModified="2026-07-19"
        author="My Naishin"
      />
      <DatasetSchema
        name="都道府県別 内申点算出方式データ（地図可視化）"
        description="47都道府県の内申点計算に用いられる実技教科倍率・学年別倍率・満点設定を地図形式で可視化したデータ"
        url={`${SITE_URL}/naishin-map`}
        variableMeasured={['実技教科倍率', '中3の重み（学年比率）', '内申点満点']}
        dateModified="2026-07-19"
        keywords={['内申点', '都道府県', '入試制度', '調査書点', 'データ可視化']}
        distribution={[
          {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: `${SITE_URL}/api/naishin`,
            name: '都道府県別内申点データAPI',
          },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-indigo-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/naishin-kakusa" className="hover:text-indigo-600">
              内申点格差レポート
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">内申点の日本地図</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-xl">
              <MapIcon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              内申点の日本地図
            </h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              47都道府県の内申点の重み付けを、色分けされたタイル地図で一目比較。
              マス目をタップすると、その県の詳しい解説に移動します。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">都道府県別マップ</h2>
            <NaishinMapGrid />
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">この地図の読み方</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              上の指標切替ボタンで「実技傾斜」「中3偏重度」「満点」の3つを切り替えられます。
              いずれも47都道府県すべての実測値を5段階の濃淡で色分けしており、色が濃いほど値が大きいことを表します。
              地図は実際の県境ではなく、位置関係のみを保った簡略化した模式図です。
              指標ごとの詳しい分析（実技傾斜がなぜ鹿児島県で突出しているか等）は
              <Link href="/naishin-kakusa" className="font-bold text-indigo-700 hover:underline">
                内申点格差レポート
              </Link>
              で解説しています。
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800">自分の県の内申点を計算する</h2>
            <p className="mb-4 text-xs text-slate-500">
              47都道府県すべてで、実際の成績を入れて内申点を計算できます。
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {[
                'hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima',
                'ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa',
                'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu',
                'shizuoka', 'aichi', 'mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara',
                'wakayama', 'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi',
                'tokushima', 'kagawa', 'ehime', 'kochi', 'fukuoka', 'saga', 'nagasaki',
                'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa',
              ].map((code) => (
                <Link
                  key={code}
                  href={`/${code}/naishin`}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-medium text-indigo-800 shadow-sm transition-colors hover:bg-indigo-50 hover:text-indigo-900"
                >
                  <span className="truncate">{code}</span>
                  <ChevronRightSquare className="h-3 w-3 shrink-0 opacity-60" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/naishin-kakusa"
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                内申点格差レポートを読む
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link
                href="/total-score"
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                都道府県別の総合得点の仕組みを見る
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link
                href="/developers"
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                このデータをAPIで使う
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
              <Link
                href="/press"
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                取材・掲載についてのご案内
                <ChevronRightSquare className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
