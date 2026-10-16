'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BookOpen, ChevronRight, Send, Share2 } from '@/components/icons';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import { Switch } from '@/components/ui/Switch';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { PrintButton } from '@/components/PrintButton';
import { ScoreGauge } from '@/components/Result/ScoreGauge';
import { GapToTarget } from '@/components/Result/GapToTarget';
import { ParentCostBridge } from '@/components/ParentCostBridge';
import { RankCard } from '@/components/Result/RankCard';
import { CalculationBasis } from '@/components/Result/CalculationBasis';
import { PointValueCard } from '@/components/Result/PointValueCard';
import { AdUnit } from '@/components/AdSlot';
import { getPrefectureByCode, type PrefectureConfig } from '@/lib/prefectures';
import { track, EVENTS } from '@/lib/track';
import { beaconParentFunnelEvent } from '@/lib/parent-funnel-beacon';
import type { ResultData, SavedHistoryEntry, Scores } from '@/lib/types';

/**
 * 都道府県別「総合得点計算」ページへのクロスプロモーション。X-4(内部リンク権威配分の総点検)で
 * tokyoのみ特別扱いだった箇所を、既に総合得点系ページが存在する全県に展開(2026-07-23)。
 * 文言は各ページのtitle/description/FAQに既に公開済みの内容の要約のみ(新規数値の追加なし)。
 */
const TOTAL_SCORE_PROMOTIONS: Record<string, { href: string; title: string; description: string }> = {
  tokyo: {
    href: '/tokyo/total-score',
    title: '都立高校 総合得点計算（1020点満点）',
    description:
      '学力検査700点・調査書点300点・ESAT-J 20点の3要素から、都立入試の総合得点を算出。志望校の合格目安と比較できます。',
  },
  osaka: {
    href: '/osaka/total-score',
    title: '大阪府 タイプⅠ〜Ⅴ 総合点計算',
    description:
      '学力検査450点・内申点450点を、タイプⅠ（7:3）〜タイプⅤ（3:7）の選抜タイプ別に瞬時に算出できます。',
  },
  aichi: {
    href: '/aichi/total-score',
    title: '愛知県 総合得点計算（評定得点×2倍）',
    description: '中3の評定合計を2倍した評定得点（90点満点）と学力検査点を合わせた総合得点を算出できます。',
  },
  chiba: {
    href: '/chiba/total-score',
    title: '千葉県 総合得点計算（係数K対応）',
    description: '調査書点135点満点に各高校の係数K（0.5〜2）を掛けた実際の得点で、総合得点を算出できます。',
  },
  saitama: {
    href: '/saitama/total-score',
    title: '埼玉県 総合得点計算（学年比率対応）',
    description: '高校ごとに異なる学年比率（1:1:2など）を反映した調査書点と学力検査点で総合得点を算出できます。',
  },
  fukuoka: {
    href: '/fukuoka/total-score',
    title: '福岡県 総合得点計算（中3のみ45点満点）',
    description: '合否判定に使う中3のみの内申点（45点満点）と学力検査点を合わせた総合得点を算出できます。',
  },
  hokkaido: {
    href: '/hokkaido/rank',
    title: '北海道 内申ランク判定（A〜M全13段階）',
    description: '内申点（315点満点）を20点刻みのA〜M13段階に自動変換し、学力検査点と合わせて比較できます。',
  },
};

const CARD_LOADER = (
  <div
    className="flex h-28 items-center justify-center rounded-lg border border-slate-200 bg-white"
    aria-busy="true"
  >
    <Loader variant="spinner" size="md" message="読み込み中..." />
  </div>
);

const ScoreProgressChart = dynamic(
  () => import('@/components/Result/ScoreProgressChart').then((m) => ({ default: m.ScoreProgressChart })),
  { ssr: false, loading: () => CARD_LOADER }
);
const ScoreImprovementAnalysis = dynamic(
  () =>
    import('@/components/Result/ScoreImprovementAnalysis').then((m) => ({
      default: m.ScoreImprovementAnalysis
    })),
  { ssr: false, loading: () => CARD_LOADER }
);
const ComparisonCard = dynamic(
  () => import('@/components/Result/ComparisonCard').then((m) => ({ default: m.ComparisonCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const ReasoningCard = dynamic(
  () => import('@/components/Result/ReasoningCard').then((m) => ({ default: m.ReasoningCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const DailyQuoteCard = dynamic(
  () => import('@/components/Result/DailyQuoteCard').then((m) => ({ default: m.DailyQuoteCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const MotivationCard = dynamic(
  () => import('@/components/Result/MotivationCard').then((m) => ({ default: m.MotivationCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const RadarChart = dynamic(
  () => import('@/components/Result/RadarChart').then((m) => ({ default: m.RadarChart })),
  { ssr: false, loading: () => CARD_LOADER }
);
const AchievementBadges = dynamic(
  () => import('@/components/Result/AchievementBadges').then((m) => ({ default: m.AchievementBadges })),
  { ssr: false, loading: () => CARD_LOADER }
);
const SubjectImprovementCard = dynamic(
  () =>
    import('@/components/Result/SubjectImprovementCard').then((m) => ({
      default: m.SubjectImprovementCard
    })),
  { ssr: false, loading: () => CARD_LOADER }
);
const ImprovementAdvisor = dynamic(
  () => import('@/components/Result/ImprovementAdvisor').then((m) => ({ default: m.ImprovementAdvisor })),
  { ssr: false, loading: () => CARD_LOADER }
);
const PrefectureComparison = dynamic(
  () => import('@/components/Result/PrefectureComparison').then((m) => ({ default: m.PrefectureComparison })),
  { ssr: false, loading: () => CARD_LOADER }
);
const StudyAdvice = dynamic(
  () => import('@/components/Result/StudyAdvice').then((m) => ({ default: m.StudyAdvice })),
  { ssr: false, loading: () => CARD_LOADER }
);
const PersonalGoalCard = dynamic(
  () => import('@/components/Result/PersonalGoalCard').then((m) => ({ default: m.PersonalGoalCard })),
  { ssr: false, loading: () => CARD_LOADER }
);
const QuickStudyTimer = dynamic(
  () => import('@/components/Result/QuickStudyTimer').then((m) => ({ default: m.QuickStudyTimer })),
  { ssr: false, loading: () => CARD_LOADER }
);
const SubjectBreakdown = dynamic(
  () => import('@/components/SubjectBreakdown').then((m) => ({ default: m.SubjectBreakdown })),
  { ssr: false, loading: () => CARD_LOADER }
);
const GoalSection = dynamic(
  () => import('@/components/GoalSection').then((m) => ({ default: m.GoalSection })),
  { ssr: false, loading: () => CARD_LOADER }
);

export type ResultTabId = 'key' | 'detail';

interface ResultSectionProps {
  result: ResultData;
  scores: Scores;
  prefectureCode: string;
  selectedPrefecture: PrefectureConfig | undefined;
  variantCode?: string;
  saveEnabled: boolean;
  onSaveEnabledChange: (checked: boolean) => void;
  saveMemo: string;
  onSaveMemoChange: (memo: string) => void;
  onSaveNow: () => void;
  lastSaved: SavedHistoryEntry | null;
  onShareOpen: () => void;
}

export function ResultSection({
  result,
  scores,
  prefectureCode,
  selectedPrefecture,
  variantCode,
  saveEnabled,
  onSaveEnabledChange,
  saveMemo,
  onSaveMemoChange,
  onSaveNow,
  lastSaved,
  onShareOpen
}: ResultSectionProps) {
  const [activeTab, setActiveTab] = React.useState<ResultTabId>('key');

  // 橋②バトン（生徒→保護者）：最高インテントの瞬間（スコア表示直後）に押される送り手側の計装。
  // GapToTarget 内の同イベントとは source で区別する。決裁者（保護者）へオファーを届ける唯一の動線。
  const onSendToParent = React.useCallback(() => {
    track(EVENTS.SHARE_TO_PARENT, {
      pref: prefectureCode,
      source: 'result-top',
      percent: Math.round(result.percent),
    });
    beaconParentFunnelEvent('share_to_parent', { prefectureCode });
    onShareOpen();
  }, [prefectureCode, result.percent, onShareOpen]);

  // 学校ページ導線(2026-08-08・loop-question-note): 既にいる月10,105クリックの生徒を
  // 個別学校ページ(Λ-2)層へ橋渡しする。保護者共有導線(橋①/橋②)より必ず下に置くこと。
  const onSchoolPageBridgeClick = React.useCallback(() => {
    track(EVENTS.SCHOOL_PAGE_BRIDGE_CLICK, { pref: prefectureCode });
  }, [prefectureCode]);

  const tabs: TabItem[] = React.useMemo(
    () => [
      {
        id: 'key',
        label: '重要な情報',
        description: 'スコア・計算根拠・保存'
      },
      {
        id: 'detail',
        label: '詳しく分析',
        badge: '15+',
        description: 'グラフ・アドバイス・目標設定'
      }
    ],
    []
  );

  return (
    <section id="result" className="space-y-4" aria-label="計算結果">
      {/* スコア概要は常にトップに表示 */}
      <Card className="overflow-hidden" variant="elevated">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <h2 className="text-xl font-bold text-slate-900">あなたの内申点</h2>
        </div>
        <div className="p-5 md:p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              <ScoreGauge percent={result.percent} total={result.total} max={result.max} />
              <div>
                <div className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-slate-900">
                  {result.total}
                  <span className="text-xl font-bold text-slate-600">/{result.max}</span>
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {selectedPrefecture?.description ?? '9教科 × 5点 = 45点満点'}
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-auto md:items-end">
              {/* 橋②バトン：最上部＝感情ピークに「おうちの人に送る」を主役配置（目標設定の後ろに隠さない）。
                  共有先は保護者最適化ページ（/hogosha）への文脈付きリンク＝決裁者がオファーに着地する。 */}
              <button
                type="button"
                onClick={onSendToParent}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white outline-none transition-colors duration-100 hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 md:w-auto"
              >
                <Send className="h-4 w-4" />
                成績レポートをおうちの人に送る
                <ChevronRight className="h-4 w-4" />
              </button>
              <p className="text-sm text-slate-600 md:text-right">
                受験の相談用に、結果をまとめて共有できます
              </p>
              <div className="flex w-full gap-2 md:w-auto">
                <Button
                  variant="secondary"
                  onClick={onShareOpen}
                  leftIcon={<Share2 className="h-4 w-4" />}
                  className="w-full md:w-auto"
                >
                  シェア画像
                </Button>
                <PrintButton />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs items={tabs} activeId={activeTab} onChange={(id) => setActiveTab(id as ResultTabId)} />

      {activeTab === 'key' ? (
        <div
          id="tabpanel-key"
          role="tabpanel"
          aria-labelledby="tab-key"
          className="space-y-4"
        >
          {/* 橋①：取引の発火点。目標内申とのギャップを生成し、状態別に保護者向け成果報酬CTA＋保護者バトンを出す。
              最高インテントの瞬間なので最上部に単独配置（散らさない）。 */}
          <GapToTarget
            result={result}
            prefectureCode={prefectureCode}
            prefectureName={selectedPrefecture?.name}
            onShareOpen={onShareOpen}
          />

          {/* C3：学費橋の全面展開。結果が出た全員に「次はお金」の同スケール情報導線を出し、
              決裁者（保護者）が自然に関与する学費面（高CPAリードが正しく載る面）へ集約する。
              この面では購入を一切迫らない（権限ズレ対策＝換金は学費ページ側に委譲）。 */}
          <ParentCostBridge prefectureName={selectedPrefecture?.name} />

          {/* 学校ページ導線（2026-08-08・loop-question-note【A】）：既に月10,105クリック来ている
              生徒を個別学校ページ(Λ-2・実データの倍率/募集人員)へ橋渡しする。⚠️保護者共有導線
              (橋①GapToTarget・橋②送るボタン・ParentCostBridge)より必ず下に置くこと（収益の主導線を
              押し下げない）。新しい面は作らず既存の/pref/[code]ハブへリンクするだけ。 */}
          <Link
            href={`/pref/${prefectureCode}`}
            onClick={onSchoolPageBridgeClick}
            className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-5 py-4 transition-colors duration-100 hover:border-brand-700 hover:bg-brand-50"
          >
            <div className="min-w-0">
              <div className="text-base font-bold text-slate-900">この点数で狙える高校を見る</div>
              <div className="mt-0.5 text-sm text-slate-600">
                {selectedPrefecture?.name ?? 'この県'}の高校別の募集人員・志願者数・倍率を確認できます
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
          </Link>

          {/* T-ADS1 AdSense RESULT_BELOW（2026-09-25 位置を引き上げ）: 保護者CTA(GapToTarget/ParentCostBridge)と
              学校ページ導線の直後＝計算結果のすぐ下。ここには生徒向けの有料塾アフィリ（そら塾）のカードが3枚あったが、
              3か月で確定0件だったため外し、最も見られる位置をAdSenseに渡した。保護者CTAより上には置かない。 */}
          <AdUnit unit="RESULT_BELOW" />

          <RankCard result={result} />
          <PointValueCard scores={scores} prefectureCode={prefectureCode} />

          <CalculationBasis prefectureCode={prefectureCode} variantCode={variantCode} total={result.total} max={result.max} />

          {/* 内申点計算後の関連ツール導線（/hyotei-heikin・/hensachi の被リンク強化＋ユーザー回遊性アップ） */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-5 md:px-6">
              <h2 className="text-xl font-bold text-slate-900">関連する無料ツール</h2>
              <p className="mt-1 text-sm text-slate-600">
                内申点と合わせて確認しておきたい指標を、専用ツールで瞬時に算出できます。
              </p>
            </div>
            <ul className="divide-y divide-slate-200">
              <li>
                <Link
                  href="/hyotei-heikin"
                  className="flex min-h-11 items-center justify-between gap-3 px-5 py-4 hover:bg-brand-50 md:px-6"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-slate-900">評定平均 計算サイト</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                      通知表の評定（1〜5）から評定平均と素内申を瞬時に算出。私立併願優遇・推薦入試の基準確認に。
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/hensachi"
                  className="flex min-h-11 items-center justify-between gap-3 px-5 py-4 hover:bg-brand-50 md:px-6"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-slate-900">偏差値計算サイト（5教科）</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                      模試・定期テストの点数と平均点から偏差値を瞬時に算出。志望校との距離を確認できます。
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              {TOTAL_SCORE_PROMOTIONS[prefectureCode] && (
                <li>
                  <Link
                    href={TOTAL_SCORE_PROMOTIONS[prefectureCode].href}
                    className="flex min-h-11 items-center justify-between gap-3 px-5 py-4 hover:bg-brand-50 md:px-6"
                  >
                    <span className="min-w-0">
                      <span className="block text-base font-bold text-slate-900">
                        {TOTAL_SCORE_PROMOTIONS[prefectureCode].title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                        {TOTAL_SCORE_PROMOTIONS[prefectureCode].description}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                  </Link>
                </li>
              )}
            </ul>
          </Card>

          {prefectureCode === 'kanagawa' && (
            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 px-5 py-5 md:px-6">
                <h2 className="text-xl font-bold text-slate-900">神奈川は学校別比率で決まる</h2>
                <div className="mt-1 text-sm text-slate-600">
                  内申:学力の比率は 4:6 / 5:5 / 3:7 など学校ごとに異なります。
                  <span>（よくある例）</span>
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  学校・学科ごとに異なる（2:8〜8:2）。各2以上・合計10、特色検査は最大5。
                </div>
              </div>
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap gap-2">
                  {['4-6', '5-5', '3-7'].map((ratio) => (
                    <Link
                      key={ratio}
                      href={`/reverse?pref=kanagawa&ratio=${ratio}`}
                      className="inline-flex min-h-11 items-center rounded border border-slate-300 bg-white px-4 text-sm font-bold tabular-nums text-slate-900 hover:bg-brand-50"
                    >
                      {ratio.replace('-', ':')}
                    </Link>
                  ))}
                  <Link
                    href="/reverse?pref=kanagawa"
                    className="inline-flex min-h-11 items-center rounded bg-brand-700 px-5 text-sm font-bold text-white hover:bg-brand-800"
                  >
                    S1値を計算する
                  </Link>
                </div>
                <p className="mt-3 text-sm text-slate-600">比率は合計10、各2以上の整数が基本です。</p>
              </div>
            </Card>
          )}

          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-5 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">記録を保存</h2>
                  <p className="mt-1 text-sm text-slate-600">この端末のみに保存（外部に送信されません）</p>
                </div>
                <Switch checked={saveEnabled} onCheckedChange={onSaveEnabledChange} aria-label="記録を保存" />
              </div>
            </div>
            <div className="p-5 md:p-6">
              <div className="mb-3 text-sm text-slate-600">
                成績は自動的に保存されています。任意で名前を付けることができます。
              </div>
              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <div className="text-sm font-bold text-slate-900">記録に名前を付ける（任意）</div>
                  <input
                    value={saveMemo}
                    onChange={(e) => onSaveMemoChange(e.target.value)}
                    disabled={!saveEnabled}
                    aria-label="記録に名前を付ける（任意）"
                    placeholder="例：1学期中間、模試前 など"
                    className="mt-1 h-11 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
                <Button variant="secondary" onClick={onSaveNow} disabled={!saveEnabled} className="h-11 w-full md:w-auto">
                  名前を追加
                </Button>
              </div>
              <div className="mt-3 text-sm text-slate-600">
                {lastSaved ? (
                  <>最終保存：{new Date(lastSaved.savedAt).toLocaleString('ja-JP')}</>
                ) : (
                  <>まだ保存がありません</>
                )}
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="px-5 py-5 md:px-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {getPrefectureByCode(prefectureCode)?.name}の詳しい情報
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">計算根拠・FAQ・公式資料</p>
                </div>
                <Link
                  href={`/${prefectureCode}/naishin`}
                  className="inline-flex min-h-11 items-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors duration-100 hover:bg-brand-800"
                >
                  <BookOpen className="h-4 w-4" />
                  計算根拠ページへ
                </Link>
              </div>
            </div>
          </Card>

          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className="group flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-brand-50 px-5 py-4 text-left transition-colors duration-100 hover:border-brand-700"
          >
            <div>
              <div className="text-base font-bold text-slate-900">
                もっと詳しく分析する
              </div>
              <div className="mt-0.5 text-sm text-slate-600">
                レーダーチャート・成績推移・アドバイスなど15項目以上
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded bg-brand-700 px-4 py-2 text-sm font-bold text-white transition-colors duration-100 group-hover:bg-brand-800">
              詳しく見る
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>

        </div>
      ) : (
        <div
          id="tabpanel-detail"
          role="tabpanel"
          aria-labelledby="tab-detail"
          className="space-y-4"
        >
          <ScoreProgressChart
            currentTotal={result.total}
            currentMax={result.max}
            currentPrefecture={prefectureCode}
          />


          <Card className="overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-5 md:px-6">
              <h2 className="text-xl font-bold text-slate-900">受験対策のガイド</h2>
            </div>
            <ul className="divide-y divide-slate-200">
              <li>
                <Link
                  href="/blog"
                  className="flex min-h-11 items-center justify-between gap-3 px-5 py-4 hover:bg-brand-50 md:px-6"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-slate-900">内申点コラム</span>
                    <span className="block text-sm text-slate-600">基礎知識から実践まで</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="flex min-h-11 items-center justify-between gap-3 px-5 py-4 hover:bg-brand-50 md:px-6"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-slate-900">制度を理解する</span>
                    <span className="block text-sm text-slate-600">都道府県別の違い</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="flex min-h-11 items-center justify-between gap-3 px-5 py-4 hover:bg-brand-50 md:px-6"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-slate-900">ツール一覧</span>
                    <span className="block text-sm text-slate-600">計算・逆算・比較</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex min-h-11 items-center justify-between gap-3 px-5 py-4 hover:bg-brand-50 md:px-6"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-slate-900">運営者情報</span>
                    <span className="block text-sm text-slate-600">信頼性と透明性</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              </li>
            </ul>
          </Card>

          <ScoreImprovementAnalysis currentScores={scores} prefectureCode={prefectureCode} />
          <ComparisonCard
            result={result}
            scores={scores}
            saveEnabled={saveEnabled}
            lastSavedId={lastSaved?.id}
          />
          <ReasoningCard result={result} scores={scores} />
          <DailyQuoteCard />
          <MotivationCard result={result} />
          <RadarChart scores={scores} prefectureCode={prefectureCode} />
          <AchievementBadges scores={scores} result={result} />
          <SubjectImprovementCard currentScores={scores} />
          <ImprovementAdvisor scores={scores} prefectureCode={prefectureCode} />
          <PrefectureComparison scores={scores} currentPrefectureCode={prefectureCode} />
          <StudyAdvice scores={scores} result={result} />
          <PersonalGoalCard />
          <QuickStudyTimer />
          <SubjectBreakdown scores={scores} prefectureCode={prefectureCode} />
          <GoalSection currentScore={result.total} maxScore={result.max} />

        </div>
      )}
    </section>
  );
}
