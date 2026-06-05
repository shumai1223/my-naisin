'use client';

import * as React from 'react';
import Link from 'next/link';
import { Target, Send, ChevronRight, TrendingUp, PartyPopper, Wallet, Info } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { PREFECTURE_HIGH_SCHOOL_DATA } from '@/lib/prefecture-high-school-data';
import { track } from '@/lib/track';
import type { ResultData } from '@/lib/types';

interface GapToTargetProps {
  result: ResultData;
  prefectureCode: string;
  prefectureName?: string;
  /** 結果ページのシェアモーダルを開く（= 保護者へのバトン） */
  onShareOpen: () => void;
}

type GapState = 'met' | 'close' | 'far';

/**
 * 橋①の発火点：計算結果ページを「広告を貼る場所」から「取引の発火点」に作り替えるコア。
 *
 * 設計の核：
 *  - ピークインテントは percent ではなく「目標内申とのギャップ」が出た瞬間に生まれる。
 *  - ギャップの起点は “家族が設定する目標内申”。表示スコアと必ず同スケール＝常に正確で、
 *    “自分の目標” なのでインテントも高い。主要校チップは「目安のプリフィル」として、
 *    当県満点内に収まる（スケール整合する）校だけに限定（不整合データの誤提示を防ぎ信頼の堀を守る）。
 *  - ギャップ3状態（未達/拮抗/超え）で保護者向け成果報酬CTA（資料請求・体験）を出し分ける。
 *  - 「保護者に送る」= 橋②バトン。権限ズレ（集客=生徒 / 決裁=保護者）を物理的に越える唯一の動線。
 *    そのクリック率は橋②の最大の未知数の先行指標なので track() で計装する。
 *
 * 評価軸の注意：このブロックの観客は生徒。保護者CTAは設計上 “必ず” 低CVになる（仕様であって失敗ではない）。
 * 採点は保護者CVではなく ①ギャップ提示後のエンゲージ ②シェア（保護者バトン）クリック率で行う。
 */

const HEDGE_NOTE =
  '※高校の目安内申は各塾の追跡調査等をもとにした集約推定値です。合格を保証するものではなく、あくまで目安としてご利用ください。';

export function GapToTarget({ result, prefectureCode, prefectureName, onShareOpen }: GapToTargetProps) {
  const data = PREFECTURE_HIGH_SCHOOL_DATA[prefectureCode];

  // スケール整合の取れた主要校のみ（avgNaishin が当県満点内）。
  // 例：神奈川 横浜翠嵐 avgNaishin 138 > 満点135 のような不整合データは自動除外し、誤った「あと◯点」を出さない。
  const schools = React.useMemo(
    () =>
      (data?.topHighSchools ?? [])
        .filter(
          (s): s is typeof s & { avgNaishin: number } =>
            typeof s.avgNaishin === 'number' && s.avgNaishin > 0 && s.avgNaishin <= result.max
        )
        .slice(0, 6),
    [data, result.max]
  );

  const [target, setTarget] = React.useState<number | null>(null);
  const [targetLabel, setTargetLabel] = React.useState<string>('');

  // gap = 目標までに必要な点（正＝不足 / 0以下＝到達・超え）
  const gap = target == null ? null : target - result.total;
  const state: GapState | null = gap == null ? null : gap <= 0 ? 'met' : gap <= 3 ? 'close' : 'far';

  function pickSchool(s: { name: string; avgNaishin: number }) {
    setTarget(s.avgNaishin);
    setTargetLabel(`${s.name}の目安`);
    track('gap_target_set', {
      pref: prefectureCode,
      source: 'school',
      target: s.avgNaishin,
      gap: s.avgNaishin - result.total,
    });
  }

  function setManual(raw: number) {
    if (Number.isNaN(raw)) return;
    const clamped = Math.max(0, Math.min(result.max, Math.round(raw)));
    setTarget(clamped);
    setTargetLabel('あなたの目標');
    track('gap_target_set', {
      pref: prefectureCode,
      source: 'manual',
      target: clamped,
      gap: clamped - result.total,
    });
  }

  function shareToParent() {
    track('share_to_parent', {
      pref: prefectureCode,
      state: state ?? 'none',
      gap: gap ?? 0,
    });
    onShareOpen();
  }

  return (
    <Card className="overflow-hidden" variant="elevated">
      <div className="border-b border-slate-100/80 bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-sky-50/80 px-6 py-5">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-600" />
          <div className="text-base font-bold text-slate-800">志望校・目標までの距離</div>
        </div>
        <div className="mt-1 text-xs text-slate-500">
          あなたの内申 <span className="font-bold text-slate-700">{result.total}</span>
          <span className="text-slate-400">/{result.max}</span>。目標を決めると「あと何点」が分かります。
        </div>
      </div>

      <div className="space-y-4 p-6">
        {/* 目標の設定：主要校チップ（プリフィル）＋ 手入力 */}
        {schools.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-bold text-slate-600">主要校の目安から選ぶ</div>
            <div className="flex flex-wrap gap-2">
              {schools.map((s) => {
                const active = targetLabel === `${s.name}の目安`;
                return (
                  <button
                    key={`${s.name}-${s.department}`}
                    type="button"
                    onClick={() => pickSchool(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {s.name}
                    <span className={`ml-1 ${active ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {s.avgNaishin}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label htmlFor="gap-target" className="text-xs font-bold text-slate-600">
              目標の内申点を直接入れる（0〜{result.max}）
            </label>
            <input
              id="gap-target"
              type="number"
              inputMode="numeric"
              min={0}
              max={result.max}
              value={targetLabel === 'あなたの目標' && target != null ? target : ''}
              onChange={(e) => setManual(Number(e.target.value))}
              placeholder={`例：${Math.min(result.max, Math.round(result.max * 0.85))}`}
              className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="text-[11px] text-slate-400 sm:pb-3">志望校の目標内申がわかる方はこちら</div>
        </div>

        {/* ギャップ提示 ＋ 状態別の取引 */}
        {state && gap != null && (
          <div className="space-y-4 pt-1">
            {/* ギャップの数字（発火力のある一行・語尾でヘッジ） */}
            <div
              className={`rounded-2xl border-2 p-4 text-center ${
                state === 'far'
                  ? 'border-rose-200 bg-rose-50/70'
                  : state === 'close'
                    ? 'border-amber-200 bg-amber-50/70'
                    : 'border-emerald-200 bg-emerald-50/70'
              }`}
            >
              {state === 'met' ? (
                <div className="flex items-center justify-center gap-2 text-emerald-800">
                  <PartyPopper className="h-5 w-5" />
                  <span className="text-base font-black">
                    {targetLabel}（{target}）を {Math.abs(gap)}点 上回っています
                  </span>
                </div>
              ) : (
                <div className={state === 'far' ? 'text-rose-800' : 'text-amber-800'}>
                  <div className="text-xs font-bold opacity-80">{targetLabel}（{target}）まで</div>
                  <div className="text-2xl font-black tracking-tight">
                    目安まであと <span className="text-3xl">{gap}</span> 点
                  </div>
                </div>
              )}
            </div>

            {/* 状態別ブロック */}
            {state === 'far' && (
              <>
                <div className="text-sm font-bold text-slate-800">
                  合格圏まで、目安であと{gap}点。今からでも巻き返せます。
                </div>
                <ParentLeadCTA
                  heading="お子さまの「あと数点」を、今からどう積むか"
                  body="内申点は残りの定期テストと提出物の取り組みで十分に動きます。AI個別指導の無料体験で、お子さまにいま必要な対策を具体的に確認できます（費用はかかりません）。"
                  affiliateId="atama-text"
                  note="【atama＋ オンライン塾】の資料請求・無料体験（PR）"
                />
              </>
            )}

            {state === 'close' && (
              <>
                <div className="text-sm font-bold text-slate-800">
                  目安まであと{gap}点。合否を分けるゾーンです。
                </div>
                <ParentLeadCTA
                  heading="あと数点で、選べる高校が変わります"
                  body="この時期のあと数点は合否を直接左右します。今から何を積めば届くのか、ご家庭でできる対策を無料の資料で確認しておきませんか。"
                  affiliateId="zkai-text-request"
                  note="Z会の通信教育の資料請求（PR）／無料"
                />
              </>
            )}

            {state === 'met' && (
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white p-5">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                  <Wallet className="h-3.5 w-3.5" />
                  合格圏が見えたら、次の備え
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">高校3年間でいくらかかる？</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-700">
                  目標に届いたら、次に気になるのが進学後の費用です。公立・私立それぞれの3年間の学費を、いまのうちに把握しておきましょう。
                </p>
                <Link
                  href="/koukou-hiyou"
                  onClick={() => track('met_bridge_click', { pref: prefectureCode, to: 'koukou-hiyou' })}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                  高校の費用をシミュレーションする
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* 橋②バトン：生徒→保護者。CTR を橋②の先行指標として計装 */}
            <button
              type="button"
              onClick={shareToParent}
              className="group flex w-full items-center justify-between rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 text-left transition-all hover:border-blue-400 hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                  <Send className="h-4 w-4" />
                  この結果を保護者に送る
                </div>
                <div className="mt-0.5 text-xs text-blue-700">
                  「あと{state === 'met' ? '0' : gap}点」を画像にして共有。進路の相談がはじめやすくなります。
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition-all group-hover:bg-blue-700">
                共有
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>

            {/* ヘッジ（信頼の堀を守る語尾） */}
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-[11px] leading-relaxed text-slate-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                {HEDGE_NOTE}
                {prefectureName ? `（${prefectureName}の` : '（'}
                <Link href={`/${prefectureCode}/naishin`} className="font-semibold text-slate-600 underline">
                  計算根拠・出典ページ
                </Link>
                でご確認ください）
              </span>
            </div>
          </div>
        )}

        {!state && (
          <div className="flex items-center gap-2 rounded-xl bg-indigo-50/60 px-4 py-3 text-xs text-indigo-700">
            <TrendingUp className="h-4 w-4 shrink-0" />
            目標を選ぶ／入れると、合格目安まで「あと何点」かが表示されます。
          </div>
        )}
      </div>
    </Card>
  );
}
