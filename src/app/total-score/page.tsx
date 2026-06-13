import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, ChevronRight, Home, Network, HelpCircle, MapPin, Info } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HUB_CALCULATORS, HUB_EXPLAINERS, HUB_ALL } from '@/lib/total-score/hub';

const BASE = 'https://my-naishin.com';

const FAQS = [
  {
    q: '公立高校入試の「総合得点」とは何ですか？',
    a: '総合得点とは、内申点（調査書点）と当日の学力検査の点数を、各都道府県のルールで合算した合否判定用の点数です。多くの県で内申点と当日点の比率や換算方法が異なり、兵庫県のように単純に足し算できる県もあれば、宮城県のように相関図で判定する県もあります。',
  },
  {
    q: 'なぜ県によって計算機があったり解説だけだったりするのですか？',
    a: '満点・配点・換算式が公文書で明示され、内申点と当日点の入力で総合得点を再現できる県には計算機を用意しています。一方、相関図・相関表・割合方式・学校別比重・総合判断などで「足し算では合否が出ない」県は、不正確な数字で誤解を与えないよう、仕組みを正確に解説するページにしています。',
  },
  {
    q: '内申点が分からない場合はどうすればいいですか？',
    a: '各県の内申点計算ツールで先に内申点を算出してから、総合得点の計算や仕組みの確認に進むのがおすすめです。各ページに、その県の内申点計算ツールへのリンクを用意しています。',
  },
  {
    q: '学校別の合格ボーダーは載っていますか？',
    a: '掲載していません。学校別の合格ボーダーは年度・倍率で変動し正確な検証が難しいため、当サイトでは県教委の一次情報で確認できる満点・配点・換算式のみを扱っています。',
  },
];

export const metadata: Metadata = {
  title: '都道府県別 公立高校 総合得点・合否の仕組み 一覧【令和8年度】内申点＋当日点 | My Naishin',
  description:
    '全国の公立高校入試の総合得点（内申点＋学力検査）の計算方法・合否の決まり方を都道府県別にまとめた一覧。兵庫・京都・栃木など計算できる県は自動計算ツール、宮城・広島など相関図・相関表の県は仕組みを一次情報に基づき正確に解説。令和8年度（2026年度）入試対応。',
  alternates: { canonical: `${BASE}/total-score` },
};

function PrefCard({ href, name, term, kind }: { href: string; name: string; term: string; kind: string }) {
  const calc = kind === 'calculator';
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
      style={{ borderColor: calc ? '#bfdbfe' : '#ddd6fe' }}
    >
      <div className="min-w-0">
        <div className="font-bold text-slate-800">{name}</div>
        <div className="truncate text-xs text-slate-500">{term}</div>
      </div>
      <ChevronRight className={`h-4 w-4 shrink-0 ${calc ? 'text-blue-400' : 'text-violet-400'}`} />
    </Link>
  );
}

export default function TotalScoreHubPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${BASE}/` },
          { name: '都道府県別 総合得点の仕組み', url: `${BASE}/total-score` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS.map((f) => ({ question: f.q, answer: f.a }))} />
      {/* 47県への内部リンクを ItemList として明示（索引・GEO） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: '都道府県別 公立高校 総合得点・合否の仕組み',
            numberOfItems: HUB_ALL.length,
            itemListElement: HUB_ALL.map((e, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `${e.name}の総合得点・合否の仕組み`,
              url: `${BASE}${e.href}`,
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">都道府県別 総合得点の仕組み</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-700 text-white shadow-xl">
              <MapPin className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              都道府県別 公立高校 総合得点・合否の仕組み
            </h1>
            <div className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              全{HUB_ALL.length}都道府県・令和8年度（2026年度）入試対応
            </div>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              公立高校入試の合否は、内申点（調査書点）と当日の学力検査をどう合わせるかで決まります。
              <br />
              その方法は都道府県ごとに大きく異なります。あなたの県を選んで、総合得点の計算や合否の仕組みを確認してください。
            </p>
          </header>

          {/* 概要 */}
          <section className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/40 p-6">
            <p className="leading-loose text-slate-700">
              内申点と当日点を単純に足し算できる県もあれば、相関図・相関表・割合方式・学校別比重・段階選抜など、
              足し算では合否が出ない県も多くあります。当サイトでは、満点・配点・換算式が一次情報で確認できる県には
              <strong className="text-blue-700">自動計算ツール</strong>を、足し算で出ない県には
              <strong className="text-violet-700">仕組みの正確な解説</strong>を用意しています。
              すべて県教育委員会の令和8年度（2026年度）入試要項に準拠し、学校別の合格ボーダーは扱いません。
            </p>
          </section>

          {/* 計算機がある県 */}
          <section className="mb-10">
            <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-slate-800">
              <Calculator className="h-6 w-6 text-blue-600" />
              総合得点を計算できる県（{HUB_CALCULATORS.length}県）
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              内申点と当日点を入力すると、総合得点を自動計算します。
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HUB_CALCULATORS.map((e) => (
                <PrefCard key={e.code} {...e} />
              ))}
            </div>
          </section>

          {/* 解説の県 */}
          <section className="mb-10">
            <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-slate-800">
              <Network className="h-6 w-6 text-violet-600" />
              合否の仕組みを解説している県（{HUB_EXPLAINERS.length}県）
            </h2>
            <p className="mb-4 text-sm text-slate-500">
              相関図・相関表・割合方式など、内申点と当日点の単純合計では合否が出ない県。配点と合否の決まり方を正確に解説します。
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HUB_EXPLAINERS.map((e) => (
                <PrefCard key={e.code} {...e} />
              ))}
            </div>
          </section>

          {/* なぜ2種類あるか */}
          <section className="mb-10 rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Info className="h-5 w-5 text-violet-500" />
              「計算できる県」と「解説の県」がある理由
            </h2>
            <p className="leading-relaxed text-slate-700">
              総合得点が内申点と当日点の足し算で再現できるのは、実は少数派です。多くの県は相関図（2軸グラフ）・相関表・
              割合方式・学校別比重・段階選抜などを使い、座標や区分線で合否を決めます。当サイトは、不正確な数字で
              受験生を誤解させないために、足し算で出せない県を無理に計算機にせず、仕組みを正直に解説する方針を取っています。
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              よくある質問
            </h2>
            <div className="space-y-4">
              {FAQS.map((f, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <h3 className="mb-2 flex gap-2 text-sm font-bold text-slate-800">
                    <span className="text-blue-600">Q.</span>
                    {f.q}
                  </h3>
                  <p className="flex gap-2 text-sm leading-relaxed text-slate-600">
                    <span className="font-bold text-emerald-600">A.</span>
                    <span>{f.a}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 関連リンク */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">内申点を計算する（都道府県別）</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hensachi" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/hyotei-heikin" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">評定平均を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/tools" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-sm font-medium text-slate-700">すべての受験ツールを見る</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
