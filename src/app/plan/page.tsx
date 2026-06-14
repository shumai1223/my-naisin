import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, CalendarClock } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';
import { StudyPlanCalculator } from '@/components/StudyPlan/StudyPlanCalculator';
import { SITE_URL } from '@/lib/naishin-dataset';

const PLAN_FAQS = [
  {
    question: '内申点は何週間で上げられますか？',
    answer:
      '内申点は定期テスト・提出物・授業態度の積み重ねで決まるため、次の定期テストまでの数週間〜1学期単位で変化します。当ツールは「目標までの差」を残り週数で割り、週ごとに必要な改善量の目安を示します。短期で大きく上げるより、毎週コツコツ積み上げるのが現実的です。',
  },
  {
    question: 'どの教科を上げると内申点が伸びやすい？',
    answer:
      '都道府県によって実技4教科の倍率が高い場合があり、その地域では実技を1段階上げる方が内申点への影響が大きくなります。当ツールは選んだ都道府県の配点をもとに、主要5教科と実技どちらを優先すべきかを示します。',
  },
  {
    question: '現在の内申点が分かりません。',
    answer:
      '現在の内申点が不明な場合は、各都道府県の内申点計算ツールで9教科の評定から先に算出できます。未入力のままでも「0点から目標まで」の計画として週次マイルストーンを表示します。',
  },
];

export const metadata: Metadata = {
  title: '内申点アップの学習計画ジェネレータ｜目標まであと何点・週次プラン【無料】 | My Naishin',
  description:
    '【無料】目標の内申点と残り週数を入れるだけで、週ごとに必要な内申点アップの目安・優先教科・マイルストーンを自動作成。全国47都道府県の配点に対応。志望校まで「あと何点」を計画に落とし込めます。',
  keywords: [
    '内申点 上げ方 計画',
    '内申点 あと何点',
    '内申点 目標',
    '学習計画 高校受験',
    '内申点 いつまで',
    '志望校 内申 逆算',
  ],
  alternates: { canonical: `${SITE_URL}/plan` },
  openGraph: {
    title: '内申点アップの学習計画ジェネレータ｜目標まであと何点・週次プラン | My Naishin',
    description: '目標内申と残り週数から、週ごとの目標・優先教科・マイルストーンを無料で自動作成。',
    url: `${SITE_URL}/plan`,
    type: 'website',
  },
};

export default function PlanPage() {
  return (
    <>
      <WebApplicationSchema
        name="内申点アップの学習計画ジェネレータ | My Naishin"
        description="目標内申点と残り週数から、週ごとの目標・優先教科・マイルストーンを自動作成する無料ツール。"
        url={`${SITE_URL}/plan`}
        featureList={[
          '目標内申点までの差を週次マイルストーンに分解',
          '週あたり必要な内申点アップ量を算出',
          '実技・主要どちらを上げると効率的か提示',
          '全国47都道府県の配点に対応',
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '学習計画ジェネレータ', url: `${SITE_URL}/plan` },
        ]}
      />
      <HowToSchema
        id="howto-plan"
        name="内申点アップの学習計画を作る方法"
        description="目標内申点と残り週数から、週ごとの目標と優先教科を割り出す手順。"
        totalTime="PT1M"
        steps={[
          { name: '都道府県を選ぶ', text: 'お住まい（受験する）都道府県を選びます。配点方式が反映されます。' },
          { name: '現在と目標の内申点を入力', text: '現在の内申点（不明なら空欄）と、志望校の目安となる目標内申点を入力します。' },
          { name: '残り週数を入力', text: '本番または学期末までの残り週数を入力します。' },
          { name: '計画を確認する', text: '週あたり必要な改善量・優先教科・週次マイルストーンが表示されます。' },
        ]}
      />
      <FAQPageSchema faqItems={PLAN_FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">学習計画ジェネレータ</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl">
              <CalendarClock className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">内申点アップの学習計画ジェネレータ</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              目標の内申点と残り週数を入れるだけ。<strong>「あと何点」</strong>を週ごとの目標に分解し、
              <strong>どの教科を上げると効率的か</strong>まで、全国47都道府県の配点で自動計算します。
            </p>
          </header>

          <StudyPlanCalculator />

          <ParentLeadCTA placement="result" className="mt-10" />

          <SaveResultCTA
            source="gap-target"
            heading="作った計画と「あと何点」を、受験本番まで受け取りませんか？"
            body="内申点アップのコツと出願スケジュールを、LINEまたはメールで無料配信します。いつでも解除できます。"
            className="mt-6"
          />

          <RelatedToolsSection
            className="mt-10"
            links={[
              { href: '/reverse', title: '志望校から逆算する', desc: '目標校から必要な内申点・当日点を逆算' },
              { href: '/juken-schedule', title: '高校受験の年間スケジュール', desc: '中3の4月〜3月にやることを月別に確認' },
              { href: '/hensachi', title: '偏差値を計算する', desc: '学力の立ち位置を5教科で把握' },
              { href: '/hogosha', title: '保護者の方へ', desc: '塾はいつから・費用の目安・内申の上げ方' },
            ]}
          />
        </div>
      </div>
    </>
  );
}
