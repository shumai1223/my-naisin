import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, ExternalLink } from '@/components/icons';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { ArticleSchema } from '@/components/StructuredData/ArticleSchema';
import { DatasetSchema } from '@/components/StructuredData/DatasetSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { DATASET_META, SITE_URL } from '@/lib/naishin-dataset';
import { PREFECTURES } from '@/lib/prefectures';
import { VERIFIED_TOTAL_SCORE_CODES } from '@/lib/total-score/registry';
import { getAllSourceHistories } from '@/lib/source-history';
import { getLicensedPrefectureSummaries } from '@/lib/reliability-license-summary';
import { getAnnualUpdateExamples } from '@/lib/annual-update-examples';

/**
 * 信頼性ページ(ZZ-6d・Ω-4実行層)。/quality(人間・E-E-A-T向けの検証プロセス説明)、
 * /genten-archive(47県の一次ソース確認履歴)、/api/status(稼働ステータスJSON)は
 * それぞれ既存だが、AIエージェント・開発者が「このデータは今も新鮮か・検証されているか・
 * APIは動いているか」を1ページで機械可読に把握できる集約面が無かった。
 * 数値は全てprefectures.ts/source-history.tsから動的算出し、手書きの都道府県数・日付は
 * 一切含めない(ドリフト防止・[[fable5-loop-protocol]]の教訓に準拠)。
 */

const verifiedPrefectures = PREFECTURES.filter((p) => p.sourceUrl && p.lastVerified);
const latestVerifiedDate = verifiedPrefectures
  .map((p) => p.lastVerified as string)
  .sort()
  .at(-1);

const histories = getAllSourceHistories();
const totalHistoryEntries = histories.reduce((sum, h) => sum + h.history.length, 0);
const latestHistoryDate = histories
  .flatMap((h) => h.history.map((s) => s.date))
  .sort()
  .at(-1);

// T-C9: 応募状況データの再配布・引用許諾状況（個人名は含めない）。ロジックはlib側で共有・テスト済み。
const licensedPrefectures = getLicensedPrefectureSummaries();
// T-C9: 年次更新の実績（実例）。公表日を記録するフィールドが無いため経過日数は計算しない。
const annualUpdateExamples = getAnnualUpdateExamples();

const FAQS = [
  {
    question: 'このデータはいつ更新されましたか？',
    answer: `47都道府県のうち${verifiedPrefectures.length}県で教育委員会の一次ソースURLと最終確認日を記録しており、直近の確認日は${latestVerifiedDate ?? '未確認'}です。データセットのバージョンは${DATASET_META.version}(${DATASET_META.fiscalYear})です。`,
  },
  {
    question: 'データの正確性はどのように検証されていますか？',
    answer:
      '各都道府県の計算方式は教育委員会の入学者選抜要綱を主たる根拠とし、自動テストで手計算との一致を検証しています。一次ソースをいつ確認したかの履歴は/genten-archiveで公開しています。詳しい検証プロセスは/qualityを参照してください。',
  },
  {
    question: 'APIやMCPサーバーは今動いていますか？',
    answer:
      '/api/statusで稼働状況・データセットバージョンをリアルタイムに確認できます(認証不要・レート制限なし)。全ての公開エンドポイントの仕様は/api/openapi(OpenAPI 3.1)にも機械可読で記載しています。',
  },
];

export const metadata: Metadata = {
  title: 'データの信頼性・鮮度・稼働状況 | My Naishin',
  description:
    '47都道府県の内申点データの最終検証日・一次ソース確認履歴・API稼働状況を1ページで確認できます。AIエージェント・開発者向けの信頼性サマリー。',
  keywords: ['内申点 データ 信頼性', 'API 稼働状況', 'データセット 鮮度', '一次ソース 検証履歴'],
  alternates: { canonical: `${SITE_URL}/reliability` },
  openGraph: {
    title: 'データの信頼性・鮮度・稼働状況 | My Naishin',
    description: '47都道府県の内申点データの最終検証日・検証履歴・API稼働状況のサマリー。',
    url: `${SITE_URL}/reliability`,
    type: 'website',
  },
};

export default function ReliabilityPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '信頼性・データ鮮度', url: `${SITE_URL}/reliability` },
        ]}
      />
      <ArticleSchema
        title="データの信頼性・鮮度・稼働状況"
        description="47都道府県の内申点データの最終検証日・一次ソース確認履歴・API稼働状況のサマリー"
        datePublished="2026-07-24"
        dateModified={latestVerifiedDate ?? '2026-07-24'}
        author="ないしんパンダ"
      />
      <DatasetSchema
        name={DATASET_META.name}
        description={DATASET_META.description}
        url={`${SITE_URL}/reliability`}
        variableMeasured={['都道府県', '一次ソースURL', '最終確認日', 'API稼働状況']}
        dateModified={latestVerifiedDate ?? '2026-07-24'}
        keywords={['データ鮮度', '検証履歴', 'API稼働状況', '内申点']}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">信頼性・データ鮮度</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              データの信頼性・鮮度・稼働状況
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              対象: {DATASET_META.fiscalYear} ／ 出典：各都道府県教育委員会の一次資料（
              <Link href="/genten-archive" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">一次ソース確認履歴</Link>
              ） ／ 最終確認 {latestVerifiedDate ?? '未確認'}
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              AIエージェント・開発者の方が「このデータは今も新鮮か・検証されているか・APIは動いているか」を
              1ページで確認できるサマリーです。数値は全て本番データから動的に算出しています。
            </p>
          </header>

          {/* データ鮮度 */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">データ鮮度</h2>
            <ul className="space-y-2 text-base leading-[1.8] text-slate-900">
              <li>
                データセットバージョン: <span className="font-mono font-bold">{DATASET_META.version}</span>
                {' '}（対象: {DATASET_META.fiscalYear}）
              </li>
              <li>
                内申点計算方式: 47都道府県中 <span className="font-bold">{verifiedPrefectures.length}県</span> で
                教育委員会一次ソースURL・最終確認日を記録済み
              </li>
              <li>
                直近の一次ソース確認日: <span className="font-mono font-bold">{latestVerifiedDate ?? '未確認'}</span>
              </li>
              <li>
                総合得点方式（学力検査点＋内申点）の統一エンジン対応:{' '}
                <span className="font-bold">{VERIFIED_TOTAL_SCORE_CODES.length}県</span>
              </li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-x-6">
              <a href="/api/naishin" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                /api/naishin(JSON) <ExternalLink className="h-4 w-4" />
              </a>
              <a href="/api/naishin/csv" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                /api/naishin/csv <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </section>

          {/* 検証履歴 */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">一次ソース検証履歴</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              各都道府県教育委員会の一次ソースを「いつ・どのURLで確認したか」の履歴を継続的に蓄積しています。
              現在 <span className="font-bold">{histories.length}都道府県ぶん・計{totalHistoryEntries}件</span> の
              確認記録があり、最終更新は <span className="font-mono font-bold">{latestHistoryDate ?? '未記録'}</span> です。
            </p>
            <Link
              href="/genten-archive"
              className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              全都道府県の確認履歴を見る →
            </Link>
          </section>

          {/* T-C9: 応募状況データの再配布・引用許諾状況（教育委員会からの明示的な許諾のみを掲載・個人名は含めない） */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">募集人員・応募者数・倍率データの再配布・引用許諾状況</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              各校の募集人員・応募者数・倍率（「応募状況」）データを掲載するにあたり、都道府県教育委員会へ
              個別に出典明記のうえでの掲載可否を確認しています。現在{' '}
              <span className="font-bold">{licensedPrefectures.length}県</span>{' '}
              から、出典を明記したうえでの掲載について明示的な許諾を得ています。
            </p>
            <ul className="grid gap-x-8 border-b border-slate-200 sm:grid-cols-2">
              {licensedPrefectures.map((p) => (
                <li key={p.code} className="border-t border-slate-200 py-3">
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="font-bold text-slate-900">{p.name}</span>
                    <span className="font-mono text-xs text-slate-600">{p.verifiedAt}</span>
                  </div>
                  <p className="text-sm leading-[1.8] text-slate-600">{p.text}</p>
                  {p.backlink && (
                    <span className="mt-2 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                      当委員会サイトへのリンク設定も許諾
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              許諾はいずれも当該教育委員会の担当課からの正式な回答に基づきます（回答者個人名は公開しません）。
              未確認の都道府県は掲載を見送っており、独自の推測で応募状況データを補うことはありません。
            </p>
          </section>

          {/* T-C9: 年次更新の実績（実例）。/termsの「公表から60日以内に反映」の裏付けとして、
              経過日数のSLA計測（公表日データが無く不可能）ではなく実際に検知・記録した変更を示す。 */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">年次更新の実績（実例）</h2>
            <p className="mb-4 text-base leading-[1.8] text-slate-900">
              入試制度は都道府県ごとに毎年見直しが入ります。当サイトは各都道府県教育委員会の公表資料を
              継続的に再確認し、内申点の計算方式に影響する変更を検知した場合はデータへ反映しています。
              実際に検知・記録した変更の例：
            </p>
            <ul className="border-b border-slate-200">
              {annualUpdateExamples.map((ex) => (
                <li key={`${ex.prefecture}-${ex.date}`} className="border-t border-slate-200 py-3">
                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <span className="font-bold text-slate-900">{ex.prefectureName}</span>
                    <span className="font-mono text-xs text-slate-600">検知日: {ex.date}</span>
                  </div>
                  <p className="text-sm leading-[1.8] text-slate-600">{ex.summary}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-[1.8] text-slate-600">
              上記{annualUpdateExamples.length}件はいずれも
              <Link href="/genten-archive" className="mx-1 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                一次ソース確認履歴アーカイブ
              </Link>
              に記録済みの実例です。教育委員会が制度改定を公表した正確な日付を記録するデータは
              現状保有していないため、「公表から何日で反映したか」の統計値は算出していません。
            </p>
          </section>

          {/* S6-3(2026-08-24): データの検証方法（自社の方針の自己記述のみ・他社への言及は行わない） */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">データの検証方法</h2>
            <ul className="space-y-3 text-base leading-[1.8] text-slate-900">
              <li>
                <strong>一次資料のみを出典とする：</strong>
                募集人員・応募者数・倍率・内申点の計算方式は、教育委員会が公表する入学者選抜要綱・
                入学者選抜結果等の一次資料のみを出典とし、独自に推測した数値は掲載しません。
              </li>
              <li>
                <strong>公式公表値との突合テスト：</strong>
                募集人員・応募者数の合計を学校単位で積み上げた値と、一次資料が公式に公表している
                小計・合計値とを突合するテストを実施しています。一致しない場合はデータを取り込みません。
              </li>
              <li>
                <strong>独自推定はしない：</strong>
                学校別の偏差値・合格ボーダーラインなど、公表資料に無い数値を独自に推定して掲載する
                ことはありません。一次資料が機械可読な形で取得できない場合は、正直に「未収録」として
                扱い、推測で埋めることはしません。
              </li>
            </ul>
          </section>

          {/* T-C8: 個人情報を受け取らない設計（データの信頼性の一部として要約表示） */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">個人情報を受け取らない設計</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              公開データ/計算API・MCPは、氏名・学籍番号・学校名・生年月日を受け取るフィールドが存在しません。
              「送らない運用」ではなく「送れない設計」です。受け取った内容は計算してレスポンスを返すのみで保存せず、
              アクセスログにも生徒個人のスコアや入力値は残しません。この設計はリクエストスキーマとログ出力の両方を
              自動テストで機械的に固定しています。
            </p>
            <Link
              href="/developers"
              className="mt-2 inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              リクエスト・レスポンスの実例を見る →
            </Link>
          </section>

          {/* 稼働状況 */}
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-xl font-bold text-slate-900">稼働状況</h2>
            <p className="text-base leading-[1.8] text-slate-900">
              公開API・MCPサーバーはCloudflareのグローバルエッジ上で稼働しています。稼働状況とデータセットの
              バージョンは認証不要・レート制限なしの軽量エンドポイントでリアルタイムに確認できます。
              全エンドポイントの仕様はOpenAPI 3.1形式でも機械可読に公開しており、コード変更のたびに
              自動テストで契約(レスポンス構造・応答時間)を検証しています。
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6">
              <a href="/api/status" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                /api/status(稼働確認) <ExternalLink className="h-4 w-4" />
              </a>
              <a href="/api/openapi" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                /api/openapi(仕様書) <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </section>

          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-bold text-slate-900">よくある質問</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-[17px] font-bold leading-snug text-slate-900">Q. {f.question}</h3>
                  <p className="text-base leading-[1.8] text-slate-900">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/quality" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
              品質保証と検証プロセス
            </Link>
            <Link href="/genten-archive" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
              一次ソース確認履歴
            </Link>
            <Link href="/developers" className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 transition-colors hover:bg-brand-50">
              API / MCPドキュメント
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
