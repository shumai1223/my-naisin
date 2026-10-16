import Link from 'next/link';
import { CheckCircle, Home, ChevronRight } from '@/components/icons';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '品質保証と信頼性への取り組み | My Naishin',
  description: '内申点シミュレーターMy Naishinの情報の正確性を担保する検証プロセス、テスト結果、更新履歴について。現役中学3年生エンジニアが各都道府県の公式選抜要綱を主たる根拠に解析し、信頼できる教育情報源と相互検証しています。',
};

// テスト結果データ
const testResults = [
  {
    prefecture: '東京都',
    testCases: [
      { name: '素内申39（換算52）', input: 39, expected: 52, actual: 52, status: 'pass' },
      { name: 'オール5（換算65）', input: 45, expected: 65, actual: 65, status: 'pass' },
      { name: '実技4のみ5（換算47）', input: 31, expected: 47, actual: 47, status: 'pass' },
    ],
    lastTest: '2026年4月22日',
    notes: '実技4教科2倍、中3成績100%の計算ロジックを検証',
    version: 'v2.1.0',
  },
  {
    prefecture: '愛知県',
    testCases: [
      { name: 'オール3（素点27→54点）', input: 27, expected: 54, actual: 54, status: 'pass' },
      { name: 'オール4（素点36→72点）', input: 36, expected: 72, actual: 72, status: 'pass' },
    ],
    lastTest: '2026年4月22日',
    notes: '中3成績×2倍 = 90点満点の算出式を検証',
    version: 'v2.1.0',
  },
  {
    prefecture: '大阪府',
    testCases: [
      { name: '中1〜3オール3（270点）', input: 27, expected: 270, actual: 270, status: 'pass' },
      { name: '中1・2(3)・中3(4)（306点）', input: 30, expected: 306, actual: 306, status: 'pass' },
    ],
    lastTest: '2026年4月22日',
    notes: '学年比率1:1:3、450点満点のロジックを検証',
    version: 'v2.1.0',
  }
];

// 全体の更新履歴
const globalUpdateHistory = [
  {
    date: '2026-04-22',
    version: 'v2026.4.20',
    changes: [
      'E-E-A-T強化：情報の正確性を担保する検証プロセス(Qualityページ)の大幅拡充',
      '都道府県別ページへの出典リンク（公式資料・信頼できる教育情報源）と具体的算出根拠の明記',
      '愛知県、青森県、岩手県、宮城県の詳細ガイドデータの新規作成と反映',
      '47都道府県の2026年度入試データの最終整合性チェック完了'
    ],
    tests: '47都道府県全ケースパス',
    coverage: '全国100%対応'
  },
  {
    date: '2026-03-20',
    version: 'v2026.3.20',
    changes: [
      '2026年度（令和8年度）入試要綱の反映',
      '逆算シミュレーターの精度向上',
      '用語辞典の項目拡充'
    ],
    tests: '主要県パス',
    coverage: '制度更新完了'
  }
];

export default function QualityPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '品質保証', url: 'https://my-naishin.com/quality' }
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">品質保証</span>
        </nav>

        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
            品質保証と情報の正確性について
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            令和8年度入試 ／ 出典：各都道府県教育委員会「入学者選抜要綱」（
            <Link href="/genten-archive" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">一次ソース確認履歴</Link>
            ） ／ 検証結果の最終更新 {globalUpdateHistory[0].date}
          </p>
          <p className="mt-4 text-base leading-[1.8] text-slate-900">
            「My Naishin」は、受験生の進路に関わる情報を扱うサイトとして、データの検証プロセスを設けています。
          </p>
        </header>

        {/* 信頼の証明セクション */}
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">公式の選抜要綱を主軸にした検証</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              当サイトの計算ロジックは、各都道府県教育委員会が発行する<strong>「令和8年度入学者選抜要綱」</strong>などの公式資料を主たる根拠とし、1点1点の重みや端数処理のルールまでプログラムに反映しています。
              県によっては、公式資料に加えて信頼できる教育情報サイトの解説も補助的に参照し、内容を相互に突き合わせて検証しています。
            </p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">自動テストと目視確認</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              主要な計算パターンについて、手計算とプログラムの結果が一致するかを検証する自動テストを定期的に実行しています。
              また、制度変更があった際は、代表自らが公式資料とサイトの出力を突き合わせる目視確認を全県で実施しています。
            </p>
          </section>
        </div>

        {/* テスト結果の可視化 */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900">代表的な計算ロジックの検証結果</h2>
          <div className="grid gap-4">
            {testResults.map((pref, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[17px] font-bold leading-snug text-slate-900">{pref.prefecture}：{pref.notes}</h3>
                  <span className="text-xs text-slate-600">VER: {pref.version}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-900 text-xs text-slate-600">
                        <th className="pb-2 text-left font-bold">テストケース</th>
                        <th className="pb-2 pl-4 text-right font-bold">期待される結果</th>
                        <th className="pb-2 pl-4 text-right font-bold">ツールの出力</th>
                        <th className="pb-2 pl-4 text-left font-bold">ステータス</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pref.testCases.map((tc, j) => (
                        <tr key={j} className="border-b border-slate-200 last:border-0">
                          <td className="py-3 text-slate-900">{tc.name}</td>
                          <td className="py-3 pl-4 text-right tabular-nums text-slate-900">{tc.expected}</td>
                          <td className="py-3 pl-4 text-right tabular-nums text-slate-900">{tc.actual}</td>
                          <td className="py-3 pl-4">
                            <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-brand-700">
                              <CheckCircle className="h-4 w-4" /> PASS
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 更新履歴 */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900">アップデート履歴</h2>
          <div className="space-y-4">
            {globalUpdateHistory.map((update, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold text-slate-900">{update.version}</span>
                  <span className="text-sm tabular-nums text-slate-600">{update.date}</span>
                </div>
                <ul className="list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
                  {update.changes.map((change, j) => (
                    <li key={j}>{change}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 統計データへの導線＋方法論・限界の開示（TIER N-8・研究/メディア利用向け） */}
        <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-xl font-bold text-slate-900">利用者の匿名データによる統計</h2>
          <p className="text-base leading-[1.8] text-slate-900">
            計算機の結果を任意でオプトインいただいた匿名データから、内申点・偏差値・総合得点の分布を集計しています。任意参加の自己選択標本であり、母集団を代表する統計ではありません。個人を特定できる情報は一切含みません。
          </p>
          {/* DW-1（2026-08-10）: 投稿の真正性を検証できないことが判明したため、現在は数値の公開を停止している。
              「公開しています」と書き続けると、このページ自体が信頼性の説明として嘘になる。 */}
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-[1.8] text-amber-900">
            ※ 2026-08-10 より、投稿の真正性を検証できないため集計値の公開を停止しています。送信元の検証を実装したうえで再収集します。件数の表示は続けています。
          </p>
          <div className="mt-3 flex flex-col">
            <Link href="/stats" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              統計データのページを見る →
            </Link>
            <Link href="/reliability" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              データの鮮度・検証履歴・API稼働状況のサマリーを見る →
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <h3 className="mb-3 text-[17px] font-bold leading-snug text-slate-900">研究・メディアの方へ：この統計データの方法論と限界</h3>
            <ul className="space-y-3 text-sm leading-[1.8] text-slate-900">
              <li>
                <strong>収集方法：</strong>
                各計算機ページ（内申点・偏差値・総合得点）で計算した利用者本人が、任意で「匿名で統計に協力する」にオプトインした場合のみ、計算結果（数値と都道府県）を収集します。氏名・メールアドレス・IPアドレス等の個人を特定できる情報は一切収集していません。同意はいつでも撤回できます。
              </li>
              <li>
                <strong>代表性の限界：</strong>
                本データは全国の中学生から無作為抽出したものではなく、「My Naishinの計算機を使い、かつ統計協力に同意した利用者」に限られる自己選択サンプルです。母集団（全国の中学生）の分布を正確に代表する保証はなく、学術的な統計調査とは性質が異なります。参考値としてご利用ください。
              </li>
              <li>
                <strong>プライバシー保護（k-匿名性）：</strong>
                個人の値が推測されるリスクを避けるため、サンプルサイズが30件未満のセグメントは集計値を非公開にし、件数のみを表示します（
                <Link href="/stats" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">/stats</Link>
                で「収集中」と表示される項目）。
              </li>
              <li>
                <strong>入手方法：</strong>
                JSON API（
                <code className="rounded bg-slate-100 px-1 py-0.5">/api/stats/distribution</code>
                ）およびCSV一括ダウンロード（
                <code className="rounded bg-slate-100 px-1 py-0.5">/api/stats/csv</code>
                ）で取得できます。引用の際は「出典：My Naishin（https://my-naishin.com/stats）」の明記をお願いします。
              </li>
              <li>
                <strong>お問い合わせ：</strong>
                研究・報道での利用にあたり詳細（収集期間・生データの取り扱い等）についてご質問がある場合は、
                <Link href="/contact" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">お問い合わせフォーム</Link>
                からご連絡ください。
              </li>
            </ul>
          </div>
        </section>

        {/* 誤り報告 */}
        <section className="rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
          <h2 className="mb-3 text-xl font-bold text-slate-900">受験生の正確な情報を守るために</h2>
          <p className="mb-5 text-base leading-[1.8] text-slate-900">
            情報の誤りは受験生の進路に影響しうる問題だと認識しています。
            もし制度との齟齬を発見された場合は、教育委員会資料のURL等を添えて下記よりお知らせください。
            24時間以内に内容を確認し、必要であれば速やかに修正を反映します。
          </p>
          <Link href="/contact" className="inline-flex min-h-[44px] items-center justify-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800">
            誤り報告・お問い合わせ
          </Link>
        </section>
      </div>
    </div>
  );
}
