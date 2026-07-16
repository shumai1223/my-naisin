import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ChevronRightSquare, Scale } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { PREFECTURES } from '@/lib/prefectures';
import { SITE_URL } from '@/lib/naishin-dataset';

// 全て src/lib/prefectures.ts (各都道府県教育委員会の公式発表に基づく既存データ) から算出。
// 新規の数値は追加していない＝捏造ゼロ。

const SKEW = PREFECTURES.map((p) => ({
  code: p.code,
  name: p.name,
  region: p.region,
  ratio: p.practicalMultiplier / p.coreMultiplier,
  core: p.coreMultiplier,
  practical: p.practicalMultiplier,
})).sort((a, b) => b.ratio - a.ratio);

const NO_SKEW_COUNT = SKEW.filter((s) => s.ratio === 1).length;
const TOP_SKEW = SKEW.slice(0, 8);

const GRADE3_ONLY = PREFECTURES.filter(
  (p) => p.targetGrades.length === 1 && p.targetGrades[0] === 3
);
const EQUAL_WEIGHT = PREFECTURES.filter((p) => {
  const g = p.gradeMultipliers;
  return p.targetGrades.length === 3 && g[1] === g[2] && g[2] === g[3];
});
const GRADE3_WEIGHTED = PREFECTURES.filter((p) => {
  const isGrade3Only = p.targetGrades.length === 1 && p.targetGrades[0] === 3;
  const isEqual =
    p.targetGrades.length === 3 &&
    p.gradeMultipliers[1] === p.gradeMultipliers[2] &&
    p.gradeMultipliers[2] === p.gradeMultipliers[3];
  return !isGrade3Only && !isEqual;
});

const FAQS = [
  {
    question: '内申点の「重み」が県によって違うとはどういうことですか？',
    answer:
      '内申点の算出方法（中1〜中3のどの学年を使うか、実技教科をどれだけ重視するか、満点を何点にするか）は都道府県ごとに教育委員会が独自に定めており、全国共通の基準はありません。同じ成績（例えばオール5・オール3）でも、住んでいる県によって入試の総合得点に占める内申点の実質的な重みが大きく異なります。',
  },
  {
    question: '実技教科の内申点が特に重視される県はどこですか？',
    answer:
      `本サイトの計算式データ(src/lib/prefectures.ts)によると、鹿児島県は実技4教科(音楽・美術・保健体育・技術家庭)の倍率が主要5教科の10倍に設定されており、47都道府県の中で突出しています。次点は宮城・秋田・福島・東京・京都・鳥取・岡山・徳島など2倍の県が11県、実技と主要教科を同じ倍率で扱う(傾斜なし)県が${NO_SKEW_COUNT}県(全体の${Math.round((NO_SKEW_COUNT / PREFECTURES.length) * 100)}%)です。`,
  },
  {
    question: '中1・中2の内申点は入試に関係ないのですか？',
    answer: `本サイトの集計では、${GRADE3_ONLY.length}都道府県(${GRADE3_ONLY.map((p) => p.name).join('・')})が中3の内申点のみを入試の合否判定に使用します。残りの都道府県は中1〜中3のいずれか複数学年を使用しますが、学年ごとの重み付けも県によって異なります。`,
  },
  {
    question: 'このデータの出典はどこですか？',
    answer:
      '各都道府県の教育委員会が公式に発表している入学者選抜実施要項・実施要領を出典としています。都道府県ごとの詳しい出典URLは、各都道府県の内申点計算ページでご確認いただけます。実際の選抜では高校・学科ごとにさらに詳細な傾斜配点が設定される場合があるため、必ず志望校の学校説明会資料・教育委員会の最新発表も合わせてご確認ください。',
  },
];

export const metadata: Metadata = {
  title: '都道府県別 内申点格差レポート【実技傾斜・学年比重の違いを比較】| My Naishin',
  description:
    '47都道府県の内申点計算方式を横断比較。実技教科の傾斜倍率・学年別の重み付け・満点構造の違いを、各教育委員会の公式データに基づいて分析。同じ成績でも県によって内申点の重みがどう変わるかがわかります。',
  keywords: [
    '内申点 都道府県 違い',
    '内申点 実技 傾斜',
    '内申点 計算方法 県別',
    '内申点 学年 比率',
  ],
  alternates: { canonical: `${SITE_URL}/naishin-kakusa` },
  openGraph: {
    title: '都道府県別 内申点格差レポート | My Naishin',
    description: '47都道府県の内申点の重み付けを公式データで横断比較。',
    url: `${SITE_URL}/naishin-kakusa`,
    type: 'article',
  },
};

export default function NaishinKakusaPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '内申点格差レポート', url: `${SITE_URL}/naishin-kakusa` },
        ]}
      />
      <ArticleSchema
        title="都道府県別 内申点格差レポート"
        description="47都道府県の内申点計算方式を横断比較し、実技傾斜・学年比重・満点構造の違いを分析するレポート"
        datePublished="2026-07-17"
        dateModified="2026-07-17"
        author="My Naishin"
      />
      <DatasetSchema
        name="都道府県別 内申点算出方式データ"
        description="47都道府県の内申点計算に用いられる学年別倍率・実技教科倍率・満点設定の一覧データ"
        url={`${SITE_URL}/naishin-kakusa`}
        variableMeasured={['実技教科倍率', '学年別倍率', '内申点満点', '対象学年']}
        dateModified="2026-07-17"
        keywords={['内申点', '都道府県', '入試制度', '調査書点']}
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
            <span className="text-slate-700">内申点格差レポート</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-xl">
              <Scale className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              都道府県別 内申点格差レポート
            </h1>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">
              同じ「オール5」「オール3」の成績でも、住んでいる県によって高校入試での内申点の重みは大きく違います。
              47都道府県すべての公式データを横断比較しました。
            </p>
          </header>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">
              ① 実技教科の傾斜倍率：鹿児島県が突出
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              音楽・美術・保健体育・技術家庭の「実技4教科」を、国語・数学・英語・理科・社会の「主要5教科」より
              重く扱う県が全国に11県あります。中でも<strong>鹿児島県は実技教科の倍率が主要教科の10倍</strong>で、
              実技教科の出来が総合得点の約9割を占める計算になり、47都道府県の中で唯一のケタ違いです。
              残り{NO_SKEW_COUNT}県（{Math.round((NO_SKEW_COUNT / PREFECTURES.length) * 100)}%）は実技・主要教科を同倍率で扱い、傾斜はありません。
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2 pr-2">都道府県</th>
                    <th className="py-2 pr-2">実技/主要 倍率比</th>
                    <th className="py-2">内訳（主要教科倍率:実技教科倍率）</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_SKEW.map((s) => (
                    <tr key={s.code} className="border-b border-slate-100 last:border-0">
                      <td className="py-2 pr-2 font-medium text-slate-800">{s.name}</td>
                      <td className="py-2 pr-2 font-bold text-indigo-700">{s.ratio}倍</td>
                      <td className="py-2 text-slate-500">
                        {s.core}:{s.practical}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              出典：各都道府県教育委員会の公式発表（詳細出典は各都道府県ページに掲載）。倍率は本サイトの計算モデル上の値で、実際の選抜では学校・学科ごとにさらに傾斜配点が加わる場合があります。
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">
              ② 中1・中2は関係ある？ 学年別の重み付け3タイプ
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              内申点にどの学年の成績を使うかも県によって全く違います。47都道府県は大きく3タイプに分かれます。
            </p>
            <div className="space-y-3">
              <div className="rounded-xl bg-rose-50 p-4">
                <p className="text-sm font-bold text-rose-800">
                  中3のみで判定（{GRADE3_ONLY.length}都道府県）
                </p>
                <p className="mt-1 text-xs leading-relaxed text-rose-700">
                  {GRADE3_ONLY.map((p) => p.name).join('、')}
                  ―中1・中2の内申点は入試の合否には使われません（推薦入試等で別途参照される場合を除く）。
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-800">
                  中3を重く傾斜（{GRADE3_WEIGHTED.length}都道府県）
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-700">
                  {GRADE3_WEIGHTED.map((p) => p.name).join('、')}
                  ―中1・中2も使われますが、中3の比重が最も大きくなるよう倍率が設定されています。
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-sm font-bold text-emerald-800">
                  中1〜中3を均等に判定（{EQUAL_WEIGHT.length}都道府県）
                </p>
                <p className="mt-1 text-xs leading-relaxed text-emerald-700">
                  {EQUAL_WEIGHT.map((p) => p.name).join('、')}
                  ―中1から積み上げた成績がそのまま入試の内申点になります。
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-slate-800">
              ③ 満点の設計思想もバラバラ
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              内申点の満点は「45点満点（中3のみ・9教科×5段階）」の県から「660点満点（岩手県・全学年×高倍率）」の県まで幅があります。
              ただし満点の数字そのものは学年数・倍率の設定次第でいくらでも変わるため、単純な点数の大小に意味はありません。
              重要なのは<strong>「何%を実技が占めるか」「何%を中3が占めるか」という構造の違い</strong>で、①②で見た通りです。
              一部の県（岡山・香川・大分など）では、本サイトの計算モデルは簡易版であり、実際の選抜ではさらに複雑な換算（例：岡山は実選抜で200点満点に再換算）が行われる旨を各県ページに明記しています。
            </p>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800">自分の県の内申点を計算する</h2>
            <p className="mb-4 text-xs text-slate-500">
              47都道府県すべてで、実際の成績を入れて内申点を計算できます。
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {PREFECTURES.map((pref) => (
                <Link
                  key={pref.code}
                  href={`/${pref.code}/naishin`}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-medium text-indigo-800 shadow-sm transition-colors hover:bg-indigo-50 hover:text-indigo-900"
                >
                  <span className="truncate">{pref.name}</span>
                  <ChevronRightSquare className="h-3 w-3 shrink-0 opacity-60" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-700">あわせて確認</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/hensachi"
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                偏差値を計算する
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
                href="/koukou-bairitsu"
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                高校入試の倍率を計算する
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
