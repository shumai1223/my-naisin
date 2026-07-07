import Link from 'next/link';
import { Calculator, BookOpen, Target, TrendingUp, BarChart3, Sparkles, ChevronRight, ArrowLeftRight } from 'lucide-react';

/**
 * 偏差値クラスタのハブ＆スポーク内部リンク（情報設計 §7）。
 *
 * 72倍市場の稼ぎ頭 /hensachi を中心に、教科別・志望校レンジ・上げ方の各スポークを相互リンクし、
 * リンクジュースをクラスタ内に循環させる。`current` で現在地を強調（自己リンクは無効化）。
 */
export type HensachiClusterKey = 'hub' | 'shindan' | 'kyoka-betsu' | 'shiboukou' | 'agekata' | 'moshi' | 'mantenkan';

interface ClusterPage {
  key: HensachiClusterKey;
  href: string;
  title: string;
  desc: string;
  icon: typeof Calculator;
}

const CLUSTER_PAGES: ClusterPage[] = [
  { key: 'hub', href: '/hensachi', title: '偏差値計算サイト（5教科）', desc: '点数・平均点から偏差値を30秒で算出。早見表・順位換算つき', icon: Calculator },
  { key: 'shindan', href: '/hensachi/shindan', title: '偏差値診断（点数不要）', desc: '点数が分からなくても5つの質問で偏差値の目安を診断', icon: Sparkles },
  { key: 'kyoka-betsu', href: '/hensachi/kyoka-betsu', title: '教科別の偏差値を出す', desc: '国語・数学・英語・理科・社会／5教科・3教科を個別に計算', icon: BookOpen },
  { key: 'shiboukou', href: '/hensachi/shiboukou', title: '偏差値→志望校レンジ逆引き', desc: '偏差値から届く高校レベルと、内申点との並置を確認', icon: Target },
  { key: 'agekata', href: '/hensachi/agekata', title: '偏差値の出し方・上げ方', desc: '計算式の使い方と、1か月で偏差値を上げる具体策', icon: TrendingUp },
  { key: 'moshi', href: '/hensachi/moshi', title: '模試の偏差値の見方', desc: '模試で偏差値が違う理由・回次別・推移の正しい見方', icon: BarChart3 },
  { key: 'mantenkan', href: '/hensachi/mantenkan', title: '満点変換つき偏差値計算', desc: '500点・1000点満点など100点満点以外のテスト・模試に対応', icon: ArrowLeftRight },
];

export function HensachiClusterNav({ current }: { current: HensachiClusterKey }) {
  const others = CLUSTER_PAGES.filter((p) => p.key !== current);
  return (
    <nav aria-label="偏差値ツール一覧" className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/60 to-white p-5 shadow-sm md:p-6">
      <h2 className="mb-1 flex items-center gap-2 text-base font-bold text-slate-800">
        <TrendingUp className="h-5 w-5 text-purple-500" />
        偏差値ツール・ガイド
      </h2>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        偏差値は<strong className="text-slate-700">計算式だけで確定する</strong>ので、当サイトの偏差値ツールはすべて無料・登録不要・その場で結果が出ます。
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {others.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.key}>
              <Link
                href={p.href}
                className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 transition-all hover:border-purple-200 hover:bg-purple-50/50"
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-800 group-hover:text-purple-700">
                    {p.title}
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-purple-400" />
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{p.desc}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
