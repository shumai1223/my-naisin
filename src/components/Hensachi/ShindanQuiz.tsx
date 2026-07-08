'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  BarChart3,
  BookOpen,
  HelpCircle,
  Search,
  ChevronRight,
  Check,
} from 'lucide-react';

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

type Concern = 'reach' | 'improve' | 'juku' | 'futoukou';

const GRADE_OPTIONS = [1, 2, 3];

const CONCERN_OPTIONS: { value: Concern; label: string }[] = [
  { value: 'reach', label: '志望校のレベルに届くか不安' },
  { value: 'improve', label: 'とにかく偏差値を上げたい' },
  { value: 'juku', label: '塾に通うか迷っている・塾を探したい' },
  { value: 'futoukou', label: '不登校・登校が難しい' },
];

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
        active
          ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500/20'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
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
export function ShindanQuiz() {
  const [grade, setGrade] = React.useState<number | undefined>(undefined);
  const [rankBandId, setRankBandId] = React.useState<string | undefined>(undefined);
  const [prefectureCode, setPrefectureCode] = React.useState('');
  const [naishinRefIndex, setNaishinRefIndex] = React.useState<number | undefined>(undefined);
  const [concern, setConcern] = React.useState<Concern | undefined>(undefined);
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

  return (
    <div>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        {/* Q1 学年 */}
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <GraduationCap className="h-4 w-4 text-purple-600" />
          Q1. 学年
        </div>
        <div className="mb-5 grid grid-cols-3 gap-2">
          {GRADE_OPTIONS.map((g) => (
            <Pill key={g} active={grade === g} onClick={() => { onFirstTouch(); setGrade(g); }}>
              中{g}
            </Pill>
          ))}
        </div>

        {/* Q2 順位バンド（点数を知らなくても回答できる） */}
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <BarChart3 className="h-4 w-4 text-purple-600" />
          Q2. 最近のテストの順位は、だいたいどのくらい？
        </div>
        <div className="mb-5 grid gap-2">
          {RANK_BANDS.map((b) => (
            <Pill key={b.id} active={rankBandId === b.id} onClick={() => { onFirstTouch(); setRankBandId(b.id); }}>
              <span className="block text-left">{b.label}</span>
            </Pill>
          ))}
        </div>

        {/* Q3 都道府県 */}
        <label htmlFor="shindan-prefecture" className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <MapPin className="h-4 w-4 text-purple-600" />
          Q3. お住まいの都道府県
        </label>
        <select
          id="shindan-prefecture"
          value={prefectureCode}
          onChange={(e) => { onFirstTouch(); setPrefectureCode(e.target.value); }}
          className="mb-5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        >
          <option value="">選択してください</option>
          {PREFECTURES.map((p) => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>

        {/* Q4 内申・評定平均の自己申告 */}
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <BookOpen className="h-4 w-4 text-purple-600" />
          Q4. 通知表の評定は、だいたいどのくらい？
        </div>
        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {NAISHIN_REFERENCES.map((ref, i) => (
            <Pill key={ref.naishin45} active={naishinRefIndex === i} onClick={() => { onFirstTouch(); setNaishinRefIndex(i); }}>
              {ref.label}
            </Pill>
          ))}
        </div>

        {/* Q5 気になっていること */}
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-700">
          <HelpCircle className="h-4 w-4 text-purple-600" />
          Q5. 今、一番気になっていることは？
        </div>
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
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-purple-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          <Search className="h-4 w-4" />
          診断する
        </button>
        {!canSubmit && (
          <p className="mt-2 text-center text-[11px] text-slate-400">5つすべて選ぶと診断結果が出ます</p>
        )}
      </section>

      {submitted && range && naishinRef && currentTier && reach && (
        <div ref={resultRef} className="mt-6 scroll-mt-6 space-y-4">
          <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Check className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-900">
                {prefName ? `${prefName}・中${grade}` : ''}のあなたの偏差値の目安
              </h2>
            </div>
            <div className="text-3xl font-black text-purple-700">
              {range.min !== null && range.max !== null
                ? `偏差値 ${range.min}〜${range.max}`
                : range.min !== null
                  ? `偏差値 ${range.min} 以上`
                  : `偏差値 ${range.max} 以下`}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              ※ テストの順位（自己申告）を正規分布の数式に当てはめた目安です。実際の点数・平均点・標準偏差で計算するとより正確です。
              <Link href="/hensachi" className="ml-1 font-bold text-purple-700 underline">正確な偏差値を計算する →</Link>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-bold text-slate-800">評定「{naishinRef.label}」との整合性</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              評定「{naishinRef.label}」は、一般的には偏差値<strong className="text-slate-800">{naishinRef.hensachiGuide}</strong>くらいの高校を志望する人と同じレベル帯で見られることが多い組み合わせです（換算式ではなく、あくまで並置の目安）。
              今回の偏差値の目安と比べて大きく離れていなければ、今の学力と内申のバランスは取れていると考えられます。
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-slate-800">届く高校レベルの目安</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center">
                <div className="text-xs font-bold text-emerald-700">安全圏</div>
                <div className="mt-1 text-sm font-bold text-slate-800">{reach.safe.label}</div>
              </div>
              <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-3 text-center">
                <div className="text-xs font-bold text-purple-700">実力相応</div>
                <div className="mt-1 text-sm font-bold text-slate-800">{reach.match.label}</div>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-center">
                <div className="text-xs font-bold text-amber-700">チャレンジ</div>
                <div className="mt-1 text-sm font-bold text-slate-800">{reach.challenge.label}</div>
              </div>
            </div>
          </div>

          {/* 次の一手（Q5の関心に応じて分岐） */}
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-slate-800">次の一手</h3>
            {concern === 'reach' && (
              <Link href="/hensachi/shiboukou" className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm hover:-translate-y-0.5 transition-all">
                <span className="text-sm font-bold text-blue-700">偏差値→志望校レンジを詳しく見る</span>
                <ChevronRight className="h-4 w-4 text-blue-400" />
              </Link>
            )}
            {concern === 'improve' && (
              <Link href="/hensachi/agekata" className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm hover:-translate-y-0.5 transition-all">
                <span className="text-sm font-bold text-blue-700">偏差値の上げ方・具体策を見る</span>
                <ChevronRight className="h-4 w-4 text-blue-400" />
              </Link>
            )}
            {(concern === 'juku' || concern === 'futoukou') && (
              <Link href="/juku-shindan" className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm hover:-translate-y-0.5 transition-all">
                <span className="text-sm font-bold text-blue-700">
                  {concern === 'futoukou' ? '不登校対応の塾・オンライン学習を診断する' : '結果に合う塾を診断する（無料）'}
                </span>
                <ChevronRight className="h-4 w-4 text-blue-400" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
