'use client';

import * as React from 'react';
import { Calculator, Receipt, Info } from 'lucide-react';

import { funnel, EVENTS, track } from '@/lib/track';

/**
 * 高校受験の「受験料・模試代」シミュレーター（保護者＝検索者＝決裁者のお金面）。
 *
 * 学費“総額”は /kyouiku-hi・/koukou-hiyou がカバーするので、ここは受験シーズンに実際に出ていく
 * 受験料（公立の選抜手数料・私立併願校の受験料）＋模試代＋（任意で）入学時の初期費用に絞る。
 * 数値は一般に公表されている範囲（目安）を min–max で扱い、断定しない＝捏造ゼロ・信頼の堀。
 */

// 受験シーズンに出ていく費用の目安（円）。範囲で持ち、合計も範囲で出す。
const PUBLIC_EXAM_FEE = 2200; // 公立高校 全日制の入学者選抜手数料（多くの自治体で¥2,200・条例により異なる）
const PRIVATE_EXAM_FEE = { min: 15000, max: 23000 }; // 私立高校1校あたりの受験料の目安
const MOSHI_FEE = { min: 4400, max: 6000 }; // 公開模試1回あたりの目安（北辰・Vもぎ・Wもぎ等）
const PUBLIC_ENROLL = 5650; // 公立高校の入学料（代表例。自治体により異なる）
const PRIVATE_ENROLL = { min: 150000, max: 300000 }; // 私立高校の入学金の目安

function yen(n: number): string {
  return '¥' + Math.max(0, Math.round(n)).toLocaleString('ja-JP');
}
function man(n: number): string {
  return `約${Math.round(Math.max(0, n) / 10000).toLocaleString('ja-JP')}万円`;
}

type EnrollType = 'none' | 'public' | 'private';

export function JukenRyouCalculator() {
  const [takesPublic, setTakesPublic] = React.useState(true);
  const [privateCount, setPrivateCount] = React.useState(1);
  const [moshiCount, setMoshiCount] = React.useState(4);
  const [enroll, setEnroll] = React.useState<EnrollType>('public');
  const startedRef = React.useRef(false);

  const onInteract = React.useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    funnel.toolStart({ tool: 'juken-ryou', placement: 'hiyou' });
  }, []);

  const result = React.useMemo(() => {
    const publicExam = takesPublic ? PUBLIC_EXAM_FEE : 0;
    const privateMin = privateCount * PRIVATE_EXAM_FEE.min;
    const privateMax = privateCount * PRIVATE_EXAM_FEE.max;
    const moshiMin = moshiCount * MOSHI_FEE.min;
    const moshiMax = moshiCount * MOSHI_FEE.max;
    let enrollMin = 0;
    let enrollMax = 0;
    if (enroll === 'public') {
      enrollMin = enrollMax = PUBLIC_ENROLL;
    } else if (enroll === 'private') {
      enrollMin = PRIVATE_ENROLL.min;
      enrollMax = PRIVATE_ENROLL.max;
    }
    const min = publicExam + privateMin + moshiMin + enrollMin;
    const max = publicExam + privateMax + moshiMax + enrollMax;
    return { publicExam, privateMin, privateMax, moshiMin, moshiMax, enrollMin, enrollMax, min, max };
  }, [takesPublic, privateCount, moshiCount, enroll]);

  React.useEffect(() => {
    if (!startedRef.current) return;
    funnel.calcComplete({ tool: 'juken-ryou', placement: 'hiyou' }, { min: result.min, max: result.max });
    track(EVENTS.RESULT_VIEW, { tool: 'juken-ryou', placement: 'hiyou' });
  }, [result.min, result.max]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
        <Calculator className="h-5 w-5 text-emerald-600" />
        受験料・模試代シミュレーター
      </h2>

      <div className="space-y-5">
        {/* 公立受験 */}
        <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
          <span className="text-sm font-medium text-slate-700">公立高校を受験する（選抜手数料 {yen(PUBLIC_EXAM_FEE)} 前後）</span>
          <input
            type="checkbox"
            checked={takesPublic}
            onChange={(e) => {
              onInteract();
              setTakesPublic(e.target.checked);
            }}
            className="h-5 w-5 accent-emerald-600"
          />
        </label>

        {/* 私立併願校数 */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">私立高校の受験校数（併願含む）</label>
            <span className="text-sm font-bold text-emerald-700">{privateCount}校</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            value={privateCount}
            onChange={(e) => {
              onInteract();
              setPrivateCount(Number(e.target.value));
            }}
            className="w-full accent-emerald-600"
          />
          <p className="mt-1 text-xs text-slate-500">1校あたりの受験料の目安：{yen(PRIVATE_EXAM_FEE.min)}〜{yen(PRIVATE_EXAM_FEE.max)}</p>
        </div>

        {/* 模試回数 */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">受ける模試の回数（中3の年間）</label>
            <span className="text-sm font-bold text-emerald-700">{moshiCount}回</span>
          </div>
          <input
            type="range"
            min={0}
            max={12}
            value={moshiCount}
            onChange={(e) => {
              onInteract();
              setMoshiCount(Number(e.target.value));
            }}
            className="w-full accent-emerald-600"
          />
          <p className="mt-1 text-xs text-slate-500">1回あたりの目安：{yen(MOSHI_FEE.min)}〜{yen(MOSHI_FEE.max)}</p>
        </div>

        {/* 入学する高校 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">入学時の初期費用も含める</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              { v: 'none', label: '含めない' },
              { v: 'public', label: '公立に入学' },
              { v: 'private', label: '私立に入学' },
            ] as { v: EnrollType; label: string }[]).map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => {
                  onInteract();
                  setEnroll(opt.v);
                }}
                className={`rounded-xl border-2 px-3 py-2 text-sm font-bold transition-colors ${
                  enroll === opt.v
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {enroll === 'public' && (
            <p className="mt-1 text-xs text-slate-500">公立の入学料の目安：{yen(PUBLIC_ENROLL)} 前後（自治体による）</p>
          )}
          {enroll === 'private' && (
            <p className="mt-1 text-xs text-slate-500">私立の入学金の目安：{yen(PRIVATE_ENROLL.min)}〜{yen(PRIVATE_ENROLL.max)}（施設費等は別途）</p>
          )}
        </div>
      </div>

      {/* 結果 */}
      <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
          <Receipt className="h-4 w-4" />
          受験シーズンにかかるお金の目安
        </div>
        <div className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          {yen(result.min)} 〜 {yen(result.max)}
        </div>
        <div className="text-sm font-bold text-emerald-700">（{man(result.min)} 〜 {man(result.max)}）</div>

        <dl className="mt-4 space-y-1.5 text-sm text-slate-700">
          {result.publicExam > 0 && (
            <div className="flex justify-between">
              <dt>公立の選抜手数料</dt>
              <dd className="font-mono">{yen(result.publicExam)}</dd>
            </div>
          )}
          {privateCount > 0 && (
            <div className="flex justify-between">
              <dt>私立の受験料（{privateCount}校）</dt>
              <dd className="font-mono">{yen(result.privateMin)}〜{yen(result.privateMax)}</dd>
            </div>
          )}
          {moshiCount > 0 && (
            <div className="flex justify-between">
              <dt>模試代（{moshiCount}回）</dt>
              <dd className="font-mono">{yen(result.moshiMin)}〜{yen(result.moshiMax)}</dd>
            </div>
          )}
          {enroll !== 'none' && (
            <div className="flex justify-between">
              <dt>入学時の初期費用（{enroll === 'public' ? '公立' : '私立'}）</dt>
              <dd className="font-mono">{result.enrollMin === result.enrollMax ? yen(result.enrollMin) : `${yen(result.enrollMin)}〜${yen(result.enrollMax)}`}</dd>
            </div>
          )}
        </dl>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        金額はいずれも一般に公表されている範囲の<strong>目安</strong>です。公立の手数料・入学料は自治体の条例、私立の受験料・入学金は各校で異なります。交通費・宿泊費（遠方受験）・併願校の延納手続き等は含みません。正確な額は受験校の募集要項をご確認ください。
      </p>
    </section>
  );
}
