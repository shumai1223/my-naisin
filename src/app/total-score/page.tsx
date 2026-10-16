import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HensachiPromo } from '@/components/HensachiPromo';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
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

function PrefCard({ href, name, term }: { href: string; name: string; term: string; kind: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-[44px] items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-brand-50"
    >
      <div className="min-w-0">
        <div className="font-bold text-slate-900">{name}</div>
        <div className="truncate text-xs text-slate-600">{term}</div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
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

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">都道府県別 総合得点の仕組み</span>
          </nav>

          {/* 頭: h1 → メタ行（年度）→ 結論の段落 */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              都道府県別 公立高校 総合得点・合否の仕組み
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              全{HUB_ALL.length}都道府県・令和8年度（2026年度）入試対応
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              公立高校入試の合否は、内申点（調査書点）と当日の学力検査をどう合わせるかで決まります。
              <br />
              その方法は都道府県ごとに大きく異なります。あなたの県を選んで、総合得点の計算や合否の仕組みを確認してください。
            </p>
          </header>

          {/* 概要 */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <p className="text-base leading-[1.8] text-slate-900">
              内申点と当日点を単純に足し算できる県もあれば、相関図・相関表・割合方式・学校別比重・段階選抜など、
              足し算では合否が出ない県も多くあります。当サイトでは、満点・配点・換算式が一次情報で確認できる県には
              <strong>自動計算ツール</strong>を、足し算で出ない県には
              <strong>仕組みの正確な解説</strong>を用意しています。
              すべて県教育委員会の令和8年度（2026年度）入試要項に準拠し、学校別の合格ボーダーは扱いません。
            </p>
          </section>

          {/* 主要6都府県クイックアクセス（ZZ-8b・内部リンク強化。専用計算機を持つ都府県への直接リンク） */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">主要都府県からすぐ計算する</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Link href="/tokyo/total-score" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-3 py-2 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
                東京都
              </Link>
              <Link href="/osaka/total-score" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-3 py-2 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
                大阪府
              </Link>
              <Link href="/aichi/total-score" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-3 py-2 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
                愛知県
              </Link>
              <Link href="/saitama/total-score" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-3 py-2 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
                埼玉県
              </Link>
              <Link href="/chiba/total-score" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-3 py-2 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
                千葉県
              </Link>
              <Link href="/fukuoka/total-score" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-3 py-2 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
                福岡県
              </Link>
            </div>
            <p className="mt-3 text-sm text-slate-600">その他の都道府県は下の一覧からお選びください。</p>
          </section>

          {/* 計算機がある県 */}
          <section className="mb-10">
            <h2 className="mb-1 text-xl font-bold text-slate-900">
              総合得点を計算できる県（{HUB_CALCULATORS.length}県）
            </h2>
            <p className="mb-4 text-sm text-slate-600">
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
            <h2 className="mb-1 text-xl font-bold text-slate-900">
              合否の仕組みを解説している県（{HUB_EXPLAINERS.length}県）
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              相関図・相関表・割合方式など、内申点と当日点の単純合計では合否が出ない県。配点と合否の決まり方を正確に解説します。
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {HUB_EXPLAINERS.map((e) => (
                <PrefCard key={e.code} {...e} />
              ))}
            </div>
          </section>

          {/* なぜ2種類あるか */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">「計算できる県」と「解説の県」がある理由</h2>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              総合得点が内申点と当日点の足し算で再現できるのは、実は少数派です。多くの県は相関図（2軸グラフ）・相関表・
              割合方式・学校別比重・段階選抜などを使い、座標や区分線で合否を決めます。当サイトは、不正確な数字で
              受験生を誤解させないために、足し算で出せない県を無理に計算機にせず、仕組みを正直に解説する方針を取っています。
            </p>
          </section>

          {/* 偏差値クラスタへ評価を集約（稼ぎ頭 /hensachi の文脈内部リンク） */}
          <HensachiPromo className="mb-10" />

          {/* FAQ */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="mt-1 divide-y divide-slate-200">
              {FAQS.map((f, i) => (
                <div key={i} className="py-4">
                  <h3 className="flex gap-2 text-[17px] font-bold text-slate-900">
                    <span className="text-brand-700">Q.</span>
                    {f.q}
                  </h3>
                  <p className="mt-2 flex gap-2 text-base leading-[1.8] text-slate-900">
                    <span className="font-bold text-brand-700">A.</span>
                    <span>{f.a}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 保護者リード */}
          <div className="mb-10">
            <ParentLeadCTA placement="prefecture" />
          </div>

          {/* 関連リンク */}
          <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">関連ツール</h2>
            <ul className="mt-2 grid sm:grid-cols-2 sm:gap-x-8">
              <li className="border-b border-slate-200">
                <Link href="/" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  内申点を計算する（都道府県別）
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/hensachi" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  偏差値を計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/hyotei-heikin" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  評定平均を計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/tools" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  すべての受験ツールを見る
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/total-score/mantenkan" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  得点を1000点満点に換算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/naishin-kakusa" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  都道府県別 内申点格差レポートを見る
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li className="border-b border-slate-200">
                <Link href="/kakomon-jisaiten" className="flex min-h-[44px] items-center justify-between gap-2 py-3 font-bold text-brand-700 hover:text-brand-800 hover:underline">
                  過去問の自己採点から総合得点を計算する
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
