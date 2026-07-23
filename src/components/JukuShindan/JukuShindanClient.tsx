'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  MapPin,
  GraduationCap,
  Target,
  Monitor,
  Building2,
  Sparkles,
  Send,
  Check,
  ChevronRight,
  Search,
} from 'lucide-react';

import { PREFECTURES } from '@/lib/prefectures';
import { recommendJuku, type JukuFormat, type JukuSituation, type JukuRecommendation } from '@/lib/juku-match';
import { readSavedGoal } from '@/lib/persistence';
import { buildParentShareMessage } from '@/lib/share';
import { EVENTS, funnel, track } from '@/lib/track';
import { APP_NAME } from '@/lib/constants';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { SaveResultCTA } from '@/components/SaveResultCTA';

const PLACEMENT = 'shindan';

type GapChoice = 'near' | 'mid' | 'far' | 'unknown';

const GAP_OPTIONS: { value: GapChoice; label: string; gap: number | null }[] = [
  { value: 'near', label: 'あと少し（目安5点以内）', gap: 5 },
  { value: 'mid', label: 'そこそこ（目安10点前後）', gap: 10 },
  { value: 'far', label: '大きい（15点以上）', gap: 20 },
  { value: 'unknown', label: 'まだ分からない', gap: null },
];

const FORMAT_OPTIONS: { value: JukuFormat; label: string; icon: typeof Monitor }[] = [
  { value: 'any', label: 'どちらでも', icon: Search },
  { value: 'online', label: 'オンライン', icon: Monitor },
  { value: 'in-person', label: '対面（通塾）', icon: Building2 },
];

const SITUATION_OPTIONS: { value: JukuSituation; label: string; sub: string }[] = [
  { value: 'normal', label: '一般的な受験対策', sub: '内申・当日点をバランスよく' },
  { value: 'top', label: '難関校を目指す', sub: '応用・記述・コーチング重視' },
  { value: 'futoukou', label: '不登校・登校が難しい', sub: '在宅・専門の伴走が必要' },
];

const GRADE_OPTIONS = [1, 2, 3];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
        active
          ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * 塾診断ファネル（Build 2）のクライアント。
 * 入力（県・学年・目標との差・希望形態・状況）→ recommendJuku（決定論）で live 在庫から1〜3件を推薦。
 * 主張は検証可能な事実のみ。結果画面で推薦オファーCTA＋保護者への共有（share.ts）＋LINE保存を出す。
 */
export function JukuShindanClient() {
  const [prefectureCode, setPrefectureCode] = React.useState('');
  const [grade, setGrade] = React.useState<number | undefined>(undefined);
  const [gapChoice, setGapChoice] = React.useState<GapChoice>('unknown');
  const [savedGap, setSavedGap] = React.useState<number | null>(null);
  const [savedPrefName, setSavedPrefName] = React.useState<string | undefined>(undefined);
  const [format, setFormat] = React.useState<JukuFormat>('any');
  const [situation, setSituation] = React.useState<JukuSituation>('normal');
  const [recs, setRecs] = React.useState<JukuRecommendation[] | null>(null);
  const [shared, setShared] = React.useState(false);

  const startedRef = React.useRef(false);
  const resultRef = React.useRef<HTMLDivElement | null>(null);

  // 保存した目標（gap-target）があれば県と差をプレフィル＝再入力の手間を省く（persistence/savedGoal再利用）。
  React.useEffect(() => {
    const g = readSavedGoal();
    if (!g) return;
    if (g.prefectureCode) setPrefectureCode(g.prefectureCode);
    if (typeof g.gap === 'number') setSavedGap(g.gap);
    if (g.prefectureName) setSavedPrefName(g.prefectureName);
  }, []);

  function onFirstTouch() {
    if (startedRef.current) return;
    startedRef.current = true;
    funnel.toolStart({ tool: 'juku-shindan', pref: prefectureCode || 'none' });
  }

  // 実際に使う gap：保存済み目標を優先し、無ければ選択肢を数値化。
  const effectiveGap = savedGap ?? GAP_OPTIONS.find((o) => o.value === gapChoice)?.gap ?? null;

  function onDiagnose() {
    const result = recommendJuku({
      prefectureCode: prefectureCode || undefined,
      grade,
      gap: effectiveGap,
      format,
      situation,
    });
    setRecs(result);
    funnel.calcComplete(
      { tool: 'juku-shindan', pref: prefectureCode || 'none', placement: PLACEMENT },
      { situation, format, count: result.length }
    );
    // 結果へスクロール（描画後）。
    window.requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  async function onShareToParent() {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://my-naishin.com';
    const url = `${origin}/juku-shindan`;
    const types = (recs ?? []).map((r) => r.formatLabel).join('・');
    const base = buildParentShareMessage({ gap: effectiveGap, label: '志望校の目標' });
    const text = types ? `${base}\n（診断で合いそうな塾のタイプ：${types}）` : base;

    const medium = typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? 'native' : 'copy';
    track(EVENTS.SHARE_TO_PARENT, { source: PLACEMENT, pref: prefectureCode || 'none', tool: 'juku-shindan', medium });

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: APP_NAME, text, url });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShared(true);
      window.setTimeout(() => setShared(false), 2200);
    } catch {
      /* クリップボード不可でもボタンは壊さない */
    }
  }

  const prefName =
    PREFECTURES.find((p) => p.code === prefectureCode)?.name ?? savedPrefName;

  return (
    <div>
      {/* 入力フォーム */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        {/* 県 */}
        <label htmlFor="juku-shindan-prefecture" className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <MapPin className="h-4 w-4 text-blue-600" />
          お住まいの都道府県
        </label>
        <select
          id="juku-shindan-prefecture"
          value={prefectureCode}
          onChange={(e) => {
            onFirstTouch();
            setPrefectureCode(e.target.value);
          }}
          className="mb-5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">選択してください（任意）</option>
          {PREFECTURES.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>

        {/* 学年 */}
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <GraduationCap className="h-4 w-4 text-blue-600" />
          学年
        </div>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {GRADE_OPTIONS.map((g) => (
            <Pill
              key={g}
              active={grade === g}
              onClick={() => {
                onFirstTouch();
                setGrade(grade === g ? undefined : g);
              }}
            >
              中{g}
            </Pill>
          ))}
        </div>

        {/* 目標との差 */}
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <Target className="h-4 w-4 text-blue-600" />
          志望校の目標との差
        </div>
        {savedGap !== null ? (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
            保存した目標を使います：
            {prefName ? `${prefName}・` : ''}
            {savedGap > 0 ? <strong>あと{savedGap}点</strong> : <strong>目標に到達</strong>}
            <button
              type="button"
              onClick={() => setSavedGap(null)}
              className="ml-2 text-xs font-semibold text-emerald-700 underline"
            >
              手動で選ぶ
            </button>
          </div>
        ) : (
          <div className="mb-5 grid grid-cols-2 gap-2">
            {GAP_OPTIONS.map((o) => (
              <Pill
                key={o.value}
                active={gapChoice === o.value}
                onClick={() => {
                  onFirstTouch();
                  setGapChoice(o.value);
                }}
              >
                {o.label}
              </Pill>
            ))}
          </div>
        )}

        {/* 希望形態 */}
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <Monitor className="h-4 w-4 text-blue-600" />
          希望する形態
        </div>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {FORMAT_OPTIONS.map((o) => {
            const Icon = o.icon;
            return (
              <Pill
                key={o.value}
                active={format === o.value}
                onClick={() => {
                  onFirstTouch();
                  setFormat(o.value);
                }}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Icon className="h-4 w-4" />
                  {o.label}
                </span>
              </Pill>
            );
          })}
        </div>

        {/* 状況 */}
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <Sparkles className="h-4 w-4 text-blue-600" />
          お子さまの状況
        </div>
        <div className="mb-6 grid gap-2 sm:grid-cols-3">
          {SITUATION_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onFirstTouch();
                setSituation(o.value);
              }}
              className={`rounded-xl border p-3 text-left transition-all ${
                situation === o.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-bold text-slate-800">{o.label}</div>
              <div className="mt-0.5 text-xs text-slate-500">{o.sub}</div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onDiagnose}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 active:scale-[0.99]"
        >
          <Search className="h-4 w-4" />
          結果に合う塾を診断する
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          提携中の塾・家庭教師の中から、条件に合うものだけを表示します（無料体験・無料相談のみ）。
        </p>
      </section>

      {/* 結果 */}
      {recs !== null && (
        <div ref={resultRef} className="mt-6 scroll-mt-6">
          {recs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              条件に合う提携中の塾が見つかりませんでした。条件を変えて再度お試しください。
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  {prefName ? `${prefName}・` : ''}あなたの条件に合う塾（{recs.length}件）
                </h2>
              </div>

              <div className="space-y-3">
                {recs.map((r, i) => (
                  <div key={r.id} className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white p-5 shadow-sm">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-600 text-xs font-black text-white">
                        {i + 1}
                      </span>
                      <span className="text-xs font-bold text-emerald-700">{r.formatLabel}</span>
                    </div>
                    <h3 className="mb-1.5 text-base font-bold text-slate-900">{r.programName}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-slate-700">{r.fact}</p>
                    <AffiliateAd
                      id={r.id}
                      hideLabel
                      ctaText="無料体験・相談を申し込む"
                      trackView
                      viewPlacement={PLACEMENT}
                      viewPref={prefectureCode || undefined}
                      placement={PLACEMENT}
                      pref={prefectureCode || undefined}
                      linkClassName="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700 active:scale-95 sm:w-auto"
                    />
                    <span className="mt-1.5 block text-[11px] text-slate-500">
                      {r.programName}の無料体験・資料請求（PR）／費用はかかりません
                    </span>
                  </div>
                ))}
              </div>

              {/* この診断結果を保護者に送る（share.ts 再利用・決裁者＝保護者へ） */}
              <button
                type="button"
                onClick={onShareToParent}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100"
              >
                {shared ? (
                  <>
                    <Check className="h-4 w-4" />
                    リンクをコピーしました
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    この診断結果を保護者に送る
                  </>
                )}
              </button>

              {/* LINE保存（保護者アカウント）＝名簿化。診断結果を受験本番まで受け取れるように。 */}
              <SaveResultCTA
                className="mt-4"
                source="juku-shindan"
                audience="parent"
                prefectureCode={prefectureCode || undefined}
                prefectureName={prefName}
                gap={savedGap ?? undefined}
                heading="診断結果と受験情報を、受け取り続けませんか？"
                body="今回おすすめした塾の無料体験の締切や、志望校の最新情報・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
              />

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                <Link href="/mendan" className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700">
                  三者面談の準備チェックリストへ
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  面談の前に「今の現在地」を整理しておくと、塾選び・進路の相談がぐっと具体的になります。
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
