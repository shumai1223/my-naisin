import { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, Home } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { HokkaidoRankResultFlow } from '@/components/Hokkaido/HokkaidoRankResultFlow';
import { getPrefectureByCode } from '@/lib/prefectures';
import { AdUnit } from '@/components/AdSlot';

// ZZ-10c: 出典リンクはprefectures.ts(X-14再検証で更新される単一ソース)から動的取得し、
// ハードコード文字列との乖離(ドリフト)を構造的に防ぐ。フォールバックは万一未設定時の保険。
const HOKKAIDO_SOURCE_URL =
  getPrefectureByCode('hokkaido')?.sourceUrl ?? 'https://www.dokyoi.pref.hokkaido.lg.jp/';

// ページ冒頭のメタ行の「制度の最終確認」。値は prefectures.ts の既存データをそのまま表示するだけ（新しい日付は作らない）。
const HOKKAIDO_PREF = getPrefectureByCode('hokkaido');
const formatYearMonth = (iso: string) => {
  const [y, m] = iso.split('-');
  return y && m && !Number.isNaN(Number(m)) ? `${y}年${Number(m)}月` : iso;
};
const HOKKAIDO_LAST_VERIFIED = HOKKAIDO_PREF?.lastVerified ? formatYearMonth(HOKKAIDO_PREF.lastVerified) : null;

// 可視の「よくある質問」セクションと完全一致させた FAQ（FAQ リッチリザルト用）
const HOKKAIDO_RANK_FAQS = [
  {
    question: '内申ランクは北海道だけの制度ですか？',
    answer:
      'はい。内申点をA〜Mのようなアルファベットのランクに変換して合否判定に使う方式は、47都道府県の中で北海道だけが採用している独自の制度です。他の都府県は内申点の素点や、県独自の計算式で換算した点数をそのまま使用します。',
  },
  {
    question: '内申ランクとは何ですか？',
    answer:
      '内申ランクとは、北海道公立高校入試で使われる内申点（315点満点）を20点刻みでA〜Mの13段階に分類した指標です。Aランクが最上位（296〜315点）、Mランクが最下位（0〜75点）。志望校の合格判定にランクと学力検査の組み合わせが使われます。',
  },
  {
    question: '札幌南に合格するには何ランクが必要？',
    answer:
      '札幌南・札幌北などの最上位校はAランク（内申点296以上）が望ましく、学力検査でも270点以上が目安です。Bランク（276〜295）でも当日点が高ければ合格圏内です。',
  },
  {
    question: '中1からランクは決まる？',
    answer:
      '北海道の内申点は中1〜中3の3年間の成績を、2:2:3の比重で合算します。中3の比重が大きいですが、中1・中2の評定も無視できない比重を持つため、中1の最初の定期テストから内申点に影響します。',
  },
];

export const metadata: Metadata = {
  title: '内申ランクA〜M判定【北海道だけの制度】315点満点を自動変換 | My Naishin',
  description: '「なぜ北海道だけ内申ランク?」他都府県は点数制ですが、北海道はA(296点)〜M(75点以下)の13段階ランク制。315点満点の内申点から30秒で自動判定し、札幌南・北など主要校の合格目安も比較できます。2026年度入試対応。',
  keywords: ['北海道 内申ランク', '北海道 ランク 計算', '北海道 公立高校', 'Aランク', 'Bランク', '札幌南', '札幌北', '内申点 北海道'],
  alternates: {
    canonical: 'https://my-naishin.com/hokkaido/rank',
  },
  openGraph: {
    title: '内申ランクA〜M判定【北海道だけの制度】315点満点を自動変換 | My Naishin',
    description: '北海道公立高校入試の内申ランクを瞬時に判定。主要校の合格目安と比較可能。',
    url: 'https://my-naishin.com/hokkaido/rank',
  },
};

export default function HokkaidoRankPage() {
  return (
    <>
      <WebApplicationSchema
        name="北海道 内申ランク判定 | My Naishin"
        description="北海道公立高校入試の内申ランク（A〜M）を瞬時に判定。志望校の合格目安と比較。"
        url="https://my-naishin.com/hokkaido/rank"
      />
      <DatasetSchema
        name="北海道 内申ランク算出方式データ（A〜M全13段階）"
        description="北海道公立高校入試の内申点(315点満点)を20点刻みでA〜M全13段階の内申ランクに変換する帯判定表。北海道教育委員会の入学者選抜情報に基づくデータ。"
        url="https://my-naishin.com/hokkaido/rank"
        variableMeasured={['内申点', '内申ランク(A〜M)', '学力検査点', '総合点満点']}
        keywords={['内申ランク', '北海道', '入試制度']}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '北海道', url: 'https://my-naishin.com/hokkaido' },
          { name: '内申ランク判定', url: 'https://my-naishin.com/hokkaido/rank' },
        ]}
      />
      <HowToSchema
        id="howto-hokkaido-rank"
        name="北海道 内申ランク（A〜M）を判定する方法"
        description="北海道公立高校入試の合否判定に使われる内申ランクを、内申点と学力検査点から自動算出する手順。"
        totalTime="PT1M"
        steps={[
          { name: '内申点（315点満点）を入力', text: '中1×2 + 中2×2 + 中3×3の重みで計算された内申点（315点満点）を入力します。' },
          { name: '学力検査点（300点満点）を入力', text: '5教科×60点の合計点（300点満点）を入力します。' },
          { name: 'ランクと合格目安を確認', text: 'Aランク（最上位）〜Mランク（要努力）のどこに該当するかが瞬時に判定され、札幌南・札幌北など主要高校の合格目安と比較できます。' },
        ]}
      />
      <FAQPageSchema faqItems={HOKKAIDO_RANK_FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav aria-label="パンくず" className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/hokkaido" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">北海道</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">内申ランク判定</span>
          </nav>

          {/* ページの頭: h1 → メタ行（年度・出典・最終確認）→ 結論の段落 */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              北海道 内申ランク（A〜M）判定ツール
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              A〜M 13ランク・2026年度入試対応 ／ 出典：
              <a href={HOKKAIDO_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">北海道教育委員会の公式サイト</a>
              {HOKKAIDO_LAST_VERIFIED && <> ／ 制度の最終確認 {HOKKAIDO_LAST_VERIFIED}</>}
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              北海道公立高校入試で使われる「内申ランク」を瞬時に判定。内申点・学力検査点から、Aランク〜Mランクのどこに該当するかと志望校との距離を確認できます。
            </p>
          </header>

          {/* ランクの仕組み */}
          <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              北海道の内申ランクA〜Mとは？
            </h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              北海道公立高校入試では、内申点（315点満点）をAランク〜Mランクの13段階に分類し、志望校の合否判定に使います。<strong>Aランクが最上位、Mランクが最下位</strong>で、各ランクは20点刻みで区切られています。学力検査（300点満点）と合わせた総合点で合否が判定されます。<strong>このアルファベット表記のランク制度は、47都道府県の中で北海道だけが採用している独自の方式</strong>です（他の都府県は内申点の素点や換算点をそのまま使用）。
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                    <th className="px-3 py-2 font-bold">ランク</th>
                    <th className="px-3 py-2 text-right font-bold">内申点（315点満点）</th>
                    <th className="px-3 py-2 font-bold">該当校レベル</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-900">
                  <tr><td className="px-3 py-2 font-bold">Aランク</td><td className="px-3 py-2 text-right tabular-nums">296〜315</td><td className="px-3 py-2">札幌南・札幌北</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Bランク</td><td className="px-3 py-2 text-right tabular-nums">276〜295</td><td className="px-3 py-2">札幌西・札幌東・札幌旭丘</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Cランク</td><td className="px-3 py-2 text-right tabular-nums">256〜275</td><td className="px-3 py-2">札幌月寒・札幌国際情報</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Dランク</td><td className="px-3 py-2 text-right tabular-nums">236〜255</td><td className="px-3 py-2">札幌北陵・札幌新川</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Eランク</td><td className="px-3 py-2 text-right tabular-nums">216〜235</td><td className="px-3 py-2">札幌啓成・市立札幌藻岩</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Fランク</td><td className="px-3 py-2 text-right tabular-nums">196〜215</td><td className="px-3 py-2">札幌平岸・札幌東陵</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Gランク</td><td className="px-3 py-2 text-right tabular-nums">176〜195</td><td className="px-3 py-2">札幌厚別・札幌真栄</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Hランク</td><td className="px-3 py-2 text-right tabular-nums">156〜175</td><td className="px-3 py-2">札幌東豊・市立札幌啓北商業</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Iランク</td><td className="px-3 py-2 text-right tabular-nums">136〜155</td><td className="px-3 py-2">札幌白石・札幌東商業</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Jランク</td><td className="px-3 py-2 text-right tabular-nums">116〜135</td><td className="px-3 py-2">下位中堅校</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Kランク</td><td className="px-3 py-2 text-right tabular-nums">96〜115</td><td className="px-3 py-2">札幌琴似工業など</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Lランク</td><td className="px-3 py-2 text-right tabular-nums">76〜95</td><td className="px-3 py-2">基礎下位</td></tr>
                  <tr><td className="px-3 py-2 font-bold">Mランク</td><td className="px-3 py-2 text-right tabular-nums">0〜75</td><td className="px-3 py-2">要努力</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Calculator＋結果連動の名簿導線（B-5：SaveResultCTAが無かった穴を埋める） */}
          <HokkaidoRankResultFlow />

          {/* 内申点の計算式 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              北海道の内申点・総合点の計算式
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-[17px] font-bold text-slate-900">内申点（315点満点）の計算式</h3>
                <p className="rounded-lg border border-slate-200 bg-brand-50 p-4 text-base font-bold leading-[1.8] text-slate-900">
                  内申点 ＝ 中1の評定合計×2 ＋ 中2の評定合計×2 ＋ 中3の評定合計×3
                </p>
                <p className="mt-2 text-sm leading-[1.8] text-slate-600">
                  ※ 9教科×5段階評価 × 学年倍率（2:2:3）で最大315点。中3の比重が大きい。詳細は<Link href="/hokkaido/naishin" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">北海道の内申点計算</Link>もご利用ください。
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-[17px] font-bold text-slate-900">総合点（615点満点）</h3>
                <p className="rounded-lg border border-slate-200 bg-brand-50 p-4 text-base font-bold leading-[1.8] text-slate-900">
                  総合点 ＝ 内申点（315点） ＋ 学力検査点（300点）
                </p>
                <p className="mt-2 text-sm leading-[1.8] text-slate-600">
                  ※ 学力検査は5教科×60点で300点満点。総合点が高い順に合格者が決まります。
                </p>
              </div>
            </div>
          </section>

          {/* 保護者向けリード（換金の本命：オンライン個別の無料体験送客。旧Z会/サプリ¥1.5-5.4/clickブロックは低EVで撤去） */}
          <ParentLeadCTA
            className="mt-10"
            placement="prefecture"
            heading="北海道の志望校、内申ランクはあと何点で上がりますか？"
            body="ランクは中1〜中3の評定で決まり、残りの定期テストでまだ動きます。お子さまにいま必要な対策を、オンライン個別指導の無料体験で具体的に確認できます（費用はかかりません）。"
            affiliateId="sora-juku-text"
            ctaText="無料体験を申し込む（そら塾）"
            note="【そら塾】オンライン個別指導の無料体験（PR）"
          />

          {/* よくある質問 */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">Q. 内申ランクは北海道だけの制度ですか？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  はい。内申点をA〜Mのようなアルファベットのランクに変換して合否判定に使う方式は、47都道府県の中で<strong>北海道だけ</strong>が採用している独自の制度です。他の都府県は内申点の素点や、県独自の計算式で換算した点数をそのまま使用します。
                </p>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">Q. 内申ランクとは何ですか？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  内申ランクとは、北海道公立高校入試で使われる内申点（315点満点）を20点刻みでA〜Mの13段階に分類した指標です。Aランクが最上位（296〜315点）、Mランクが最下位（0〜75点）。志望校の合格判定にランクと学力検査の組み合わせが使われます。
                </p>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">Q. 札幌南に合格するには何ランクが必要？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  札幌南・札幌北などの最上位校はAランク（内申点296以上）が望ましく、学力検査でも270点以上が目安です。Bランク（276〜295）でも当日点が高ければ合格圏内です。
                </p>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900">Q. 中1からランクは決まる？</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  北海道の内申点は<strong>中1〜中3の3年間</strong>の成績を、2:2:3の比重で合算します。中3の比重が大きいですが、中1・中2の評定も無視できない比重を持つため、中1の最初の定期テストから内申点に影響します。
                </p>
              </div>
            </div>
          </section>

          {/* 注意 */}
          <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              注意
            </p>
            <p className="mt-1 text-sm leading-[1.8] text-amber-900">
              本ツールの計算結果は北海道教育委員会の規定に基づく目安です。実際の合否は当日の倍率や他の受験者の得点状況により変動します。最新の情報は<a href={HOKKAIDO_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">北海道教育委員会の公式サイト</a>でご確認ください。
            </p>
          </div>

          {/* 関連リンク */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="mb-2 text-xl font-bold text-slate-900">関連ツール・コンテンツ</h2>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              <li>
                <Link href="/hokkaido/naishin" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">北海道の内申点を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/hokkaido" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">北海道の入試制度ガイド</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/reverse?pref=hokkaido" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">志望校から逆算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/hyotei-heikin" className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800">
                  <span className="underline underline-offset-2">評定平均を計算する</span>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              </li>
            </ul>
          </section>

          {/* T-ADS1 AdSense PAGE_BOTTOM: ページ最下部（フッターの前）。保護者リードCTAより後ろ。NEXT_PUBLIC_ADSENSE_ENABLED=1 まで描画0。 */}
          <AdUnit unit="PAGE_BOTTOM" />
        </div>
      </div>
    </>
  );
}
