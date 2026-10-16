'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from '@/components/icons';

import { PREFECTURES } from '@/lib/prefectures';
import {
  RANK_BANDS,
  bandToHensachiRange,
  NAISHIN_REFERENCES,
  reachBandsForHensachi,
  tierForHensachi,
  roundHensachi,
} from '@/lib/hensachi';
import { funnel } from '@/lib/track';
import { HensachiGapToTarget } from '@/components/Hensachi/HensachiGapToTarget';

export type Concern = 'reach' | 'improve' | 'juku' | 'futoukou';

const GRADE_OPTIONS = [1, 2, 3];

const CONCERN_OPTIONS: { value: Concern; label: string }[] = [
  { value: 'reach', label: '志望校のレベルに届くか不安' },
  { value: 'improve', label: 'とにかく偏差値を上げたい' },
  { value: 'juku', label: '塾に通うか迷っている・塾を探したい' },
  { value: 'futoukou', label: '不登校・登校が難しい' },
];

/** 「次の一手」の行リンク（全て同じ見た目。強調は文字の太さと色で付ける）。 */
const NEXT_LINK_CLASS =
  'flex min-h-[44px] items-center justify-between gap-3 rounded border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-brand-50';

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[44px] rounded border px-3 py-2.5 text-sm font-bold transition-colors ${
        active
          ? 'border-brand-700 bg-brand-50 text-brand-800'
          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * 偏差値診断（5問クイズ）：点数・平均点を知らなくても答えられる自己申告バンドから
 * 偏差値“帯”を推定する。使う数式はhensachi.tsの正規分布ユーティリティと完全に同一
 * （精度を偽装しない＝上位/下位バンドは片側だけの目安を表示）。
 * 対象クエリ：偏差値診断・診断 中学生・高校偏差値診断（合計約3,600imp/28dがpos7-9に滞留）。
 */
export interface ShindanResult {
  /** 代表偏差値（自己申告バンドの中央値・目安）。 */
  hensachi: number;
  grade: number;
  prefectureCode: string;
  prefectureName?: string;
  concern: Concern;
}

interface ShindanQuizProps {
  /** 学年別ページ（/hensachi/shindan/[grade]）から渡された既定の学年。Q1をあらかじめ選択済みにする。 */
  defaultGrade?: number;
  /** 目的別ページ（/hensachi/shindan/mokuteki/[purpose]）から渡された既定の関心。Q5をあらかじめ選択済みにする。 */
  defaultConcern?: Concern;
  /** 診断確定後、親へ結果を通知（結果連動の名簿/送客導線・匿名統計送信用・S-2④）。 */
  onResult?: (r: ShindanResult | null) => void;
}

export function ShindanQuiz({ defaultGrade, defaultConcern, onResult }: ShindanQuizProps = {}) {
  const [grade, setGrade] = React.useState<number | undefined>(defaultGrade);
  const [rankBandId, setRankBandId] = React.useState<string | undefined>(undefined);
  const [prefectureCode, setPrefectureCode] = React.useState('');
  const [naishinRefIndex, setNaishinRefIndex] = React.useState<number | undefined>(undefined);
  const [concern, setConcern] = React.useState<Concern | undefined>(defaultConcern);
  const [submitted, setSubmitted] = React.useState(false);
  const startedRef = React.useRef(false);
  const resultRef = React.useRef<HTMLDivElement | null>(null);

  function onFirstTouch() {
    if (startedRef.current) return;
    startedRef.current = true;
    funnel.toolStart({ tool: 'hensachi-shindan' });
  }

  const rankBand = RANK_BANDS.find((b) => b.id === rankBandId);
  const canSubmit = Boolean(grade && rankBand && prefectureCode && naishinRefIndex !== undefined && concern);

  function onDiagnose() {
    if (!canSubmit) return;
    setSubmitted(true);
    funnel.calcComplete(
      { tool: 'hensachi-shindan', pref: prefectureCode, placement: 'shindan' },
      { rankBand: rankBandId, concern }
    );
    window.requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  const prefName = PREFECTURES.find((p) => p.code === prefectureCode)?.name;
  const naishinRef = naishinRefIndex !== undefined ? NAISHIN_REFERENCES[naishinRefIndex] : undefined;
  const range = rankBand ? bandToHensachiRange(rankBand) : null;
  // 代表値（中央値。片側のみのバンドはその境界値を代表値に使う＝表示上の目安であり断定ではない）。
  const representativeHensachi =
    range?.min !== null && range?.min !== undefined && range?.max !== null && range?.max !== undefined
      ? roundHensachi((range.min + range.max) / 2)
      : (range?.min ?? range?.max ?? null);

  const reach = representativeHensachi !== null ? reachBandsForHensachi(representativeHensachi) : null;
  const currentTier = representativeHensachi !== null ? tierForHensachi(representativeHensachi) : null;

  React.useEffect(() => {
    if (submitted && representativeHensachi !== null && grade && prefectureCode && concern) {
      onResult?.({ hensachi: representativeHensachi, grade, prefectureCode, prefectureName: prefName, concern });
    } else {
      onResult?.(null);
    }
  }, [submitted, representativeHensachi, grade, prefectureCode, prefName, concern, onResult]);

  return (
    <div>
      <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
        {/* Q1 学年 */}
        <div className="mb-2 text-base font-bold text-slate-900">Q1. 学年</div>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {GRADE_OPTIONS.map((g) => (
            <Pill key={g} active={grade === g} onClick={() => { onFirstTouch(); setGrade(g); }}>
              中{g}
            </Pill>
          ))}
        </div>

        {/* Q2 順位バンド（点数を知らなくても回答できる） */}
        <div className="mb-2 text-base font-bold text-slate-900">Q2. 最近のテストの順位は、だいたいどのくらい？</div>
        <div className="mb-5 grid gap-2">
          {RANK_BANDS.map((b) => (
            <Pill key={b.id} active={rankBandId === b.id} onClick={() => { onFirstTouch(); setRankBandId(b.id); }}>
              <span className="block text-left">{b.label}</span>
            </Pill>
          ))}
        </div>

        {/* Q3 都道府県 */}
        <label htmlFor="shindan-prefecture" className="mb-2 block text-base font-bold text-slate-900">
          Q3. お住まいの都道府県
        </label>
        <select
          id="shindan-prefecture"
          value={prefectureCode}
          onChange={(e) => { onFirstTouch(); setPrefectureCode(e.target.value); }}
          className="mb-5 h-11 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-700"
        >
          <option value="">選択してください</option>
          {PREFECTURES.map((p) => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>

        {/* Q4 内申・評定平均の自己申告 */}
        <div className="mb-2 text-base font-bold text-slate-900">Q4. 通知表の評定は、だいたいどのくらい？</div>
        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {NAISHIN_REFERENCES.map((ref, i) => (
            <Pill key={ref.naishin45} active={naishinRefIndex === i} onClick={() => { onFirstTouch(); setNaishinRefIndex(i); }}>
              {ref.label}
            </Pill>
          ))}
        </div>

        {/* Q5 気になっていること */}
        <div className="mb-2 text-base font-bold text-slate-900">Q5. 今、一番気になっていることは？</div>
        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          {CONCERN_OPTIONS.map((o) => (
            <Pill key={o.value} active={concern === o.value} onClick={() => { onFirstTouch(); setConcern(o.value); }}>
              {o.label}
            </Pill>
          ))}
        </div>

        <button
          type="button"
          onClick={onDiagnose}
          disabled={!canSubmit}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-brand-700"
        >
          <Search className="h-4 w-4" />
          診断する
        </button>
        {!canSubmit && (
          <p className="mt-2 text-center text-sm text-slate-600">5つすべて選ぶと診断結果が出ます</p>
        )}
      </section>

      {submitted && range && naishinRef && currentTier && reach && (
        <div ref={resultRef} className="mt-6 scroll-mt-6 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              {prefName ? `${prefName}・中${grade}` : ''}のあなたの偏差値の目安
            </h2>
            <div className="text-3xl font-bold tabular-nums text-brand-700">
              {range.min !== null && range.max !== null
                ? `偏差値 ${range.min}〜${range.max}`
                : range.min !== null
                  ? `偏差値 ${range.min} 以上`
                  : `偏差値 ${range.max} 以下`}
            </div>
            <p className="mt-2 text-sm leading-[1.8] text-slate-600">
              ※ テストの順位（自己申告）を正規分布の数式に当てはめた目安です。実際の点数・平均点・標準偏差で計算するとより正確です。
              <Link href="/hensachi" className="ml-1 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">正確な偏差値を計算する →</Link>
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-2 text-[17px] font-bold text-slate-900">評定「{naishinRef.label}」との整合性</h3>
            <p className="text-base leading-[1.8] text-slate-900">
              評定「{naishinRef.label}」は、一般的には偏差値<strong>{naishinRef.hensachiGuide}</strong>くらいの高校を志望する人と同じレベル帯で見られることが多い組み合わせです（換算式ではなく、あくまで並置の目安）。
              今回の偏差値の目安と比べて大きく離れていなければ、今の学力と内申のバランスは取れていると考えられます。
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-[17px] font-bold text-slate-900">届く高校レベルの目安</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                <div className="text-sm text-slate-600">安全圏</div>
                <div className="mt-1 text-base font-bold text-slate-900">{reach.safe.label}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-brand-50 p-3 text-center">
                <div className="text-sm text-slate-600">実力相応</div>
                <div className="mt-1 text-base font-bold text-slate-900">{reach.match.label}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                <div className="text-sm text-slate-600">チャレンジ</div>
                <div className="mt-1 text-base font-bold text-slate-900">{reach.challenge.label}</div>
              </div>
            </div>
          </div>

          {/* 次の一手（Q5の関心に応じて分岐・S-2③） */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-[17px] font-bold text-slate-900">次の一手</h3>
            {concern === 'reach' && (
              <div className="space-y-2">
                <Link href="/hensachi/shiboukou" className={NEXT_LINK_CLASS}>
                  <span className="text-sm font-bold text-brand-700">偏差値→志望校レンジを詳しく見る</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-700" />
                </Link>
                <Link href="/hogosha" className={NEXT_LINK_CLASS}>
                  <span className="text-sm font-bold text-slate-700">
                    保護者の方へ：志望校が見えたら学費・塾代の目安を確認する
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-700" />
                </Link>
              </div>
            )}
            {concern === 'improve' && (
              <div className="space-y-3">
                <Link href="/hensachi/agekata" className={NEXT_LINK_CLASS}>
                  <span className="text-sm font-bold text-brand-700">偏差値の上げ方・具体策を見る</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-700" />
                </Link>
                {representativeHensachi !== null && <HensachiGapToTarget value={representativeHensachi} />}
              </div>
            )}
            {concern === 'juku' && (
              <div className="space-y-2">
                <Link href="/juku-shindan" className={NEXT_LINK_CLASS}>
                  <span className="text-sm font-bold text-brand-700">結果に合う塾を診断する（無料）</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-700" />
                </Link>
                <Link href="/hogosha" className={NEXT_LINK_CLASS}>
                  <span className="text-sm font-bold text-slate-700">
                    保護者の方へ：塾・費用の選び方を確認する
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-700" />
                </Link>
              </div>
            )}
            {concern === 'futoukou' && (
              <div className="space-y-2">
                <Link href="/futoukou" className={NEXT_LINK_CLASS}>
                  <span className="text-sm font-bold text-brand-700">不登校でも高校受験はできる（内申点・出席の扱いを見る）</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-700" />
                </Link>
                <Link href="/juku-shindan" className={NEXT_LINK_CLASS}>
                  <span className="text-sm font-bold text-slate-700">不登校対応の塾・オンライン学習を診断する</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-700" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
