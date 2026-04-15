import Link from 'next/link';
import { PREFECTURES, REGIONS, getPrefecturesByRegion } from '@/lib/prefectures';
import HomeClient from './HomeClient';
import { Calculator, BookOpen, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

export default function Page() {
  return (
    <>
      <HomeClient />

      {/* SEO Optimized Content Section */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calculator className="text-blue-600" />
                2026年度（令和8年度）入試対応の内申点計算
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p>
                  My Naishinは、現役の中学生とその保護者のために開発された、<strong>全国47都道府県の最新計算方式に完全対応</strong>した内申点シミュレーターです。
                  高校受験において、内申点（調査書点）は当日の学力検査と同様に、あるいはそれ以上に合否を分ける重要な要素です。
                </p>
                <p>
                  しかし、その計算方法は都道府県ごとに驚くほど異なります。「中3の成績だけを見る県」「実技教科が2倍、3倍になる県」「1年生からの積み重ねが評価される県」など、
                  自分の地域のルールを正確に把握していなければ、効率的な受験戦略を立てることはできません。
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="text-emerald-600" />
                都道府県別の計算ルールを確認
              </h3>
              <div className="grid gap-6">
                {REGIONS.map(region => (
                  <div key={region} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                    <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">{region}</h4>
                    <div className="flex flex-wrap gap-2">
                      {getPrefecturesByRegion(region).map(pref => (
                        <Link
                          key={pref.code}
                          href={`/${pref.code}/naishin`}
                          className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-300"
                        >
                          {pref.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles />
                内申点を1点でも上げるための3つの鉄則
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">1</div>
                  <p><strong>実技教科（副教科）を捨てない：</strong> 多くの県で実技教科は1.5倍〜2倍の配点になります。主要5教科で「5」を取るより、実技で「3」を「4」に上げる方が遥かに効率的です。</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">2</div>
                  <p><strong>「主体的な態度」を軽視しない：</strong> 2021年度の学習指導要領改訂以降、テストの点数以上に授業への参加姿勢や振り返りシートの記述が評価に直結します。</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">3</div>
                  <p><strong>志望校の「計算比率」を知る：</strong> 内申と当日点の比率が3:7の学校と7:3の学校では、対策が全く異なります。自分の持ち点に合わせた学校選びが逆転合格の鍵です。</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar/Right Column */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-amber-600" />
                情報の正確性について
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed mb-4">
                当サイトの情報は、全国47都道府県の教育委員会が発表した2026年度（令和8年度）入学者選抜の最新実施要綱を元に作成されています。
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                常に最新の情報を反映するよう努めておりますが、学校独自の傾斜配点や制度変更があるため、最終的な判断は必ず公式の募集要綱をご確認ください。
              </p>
              <div className="mt-4 pt-4 border-t border-amber-200">
                <Link href="/quality" className="text-sm font-bold text-amber-900 hover:underline flex items-center gap-1">
                  情報の信頼性への取り組み <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="text-blue-500" />
                人気の受験コラム
              </h3>
              <div className="space-y-4">
                <Link href="/blog/naishin-guide" className="block group">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">【完全版】内申点とは？計算方法と評価を上げるコツ</p>
                  <p className="text-xs text-slate-500 mt-1">2026/04/10更新</p>
                </Link>
                <Link href="/blog/practical-subjects-tips" className="block group">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">実技4教科で「オール5」を取るための提出物ハック</p>
                  <p className="text-xs text-slate-500 mt-1">2026/04/12更新</p>
                </Link>
                <Link href="/blog/tokyo-naishin-calculation-guide" className="block group">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">東京都立入試の換算内申シミュレーション</p>
                  <p className="text-xs text-slate-500 mt-1">2026/04/15更新</p>
                </Link>
              </div>
              <Link href="/blog" className="mt-6 block text-center text-sm font-bold text-blue-600 hover:text-blue-700">
                記事一覧を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
