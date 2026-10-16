import Link from 'next/link';
import { Calculator, BookOpen, Target, TrendingUp, BarChart3, ClipboardList, ChevronRight, ArrowLeftRight, Undo2 } from '@/components/icons';

/**
 * 偏差値クラスタのハブ＆スポーク内部リンク（情報設計 §7）。
 *
 * 72倍市場の稼ぎ頭 /hensachi を中心に、教科別・志望校レンジ・上げ方の各スポークを相互リンクし、
 * リンクジュースをクラスタ内に循環させる。`current` で現在地を強調（自己リンクは無効化）。
 */
export type HensachiClusterKey = 'hub' | 'shindan' | 'kyoka-betsu' | 'shiboukou' | 'agekata' | 'moshi' | 'mantenkan' | 'gyakusan';

interface ClusterPage {
  key: HensachiClusterKey;
  href: string;
  title: string;
  desc: string;
  icon: typeof Calculator;
}

const CLUSTER_PAGES: ClusterPage[] = [
  { key: 'hub', href: '/hensachi', title: '偏差値計算サイト（5教科）', desc: '点数・平均点から偏差値を30秒で算出。早見表・順位換算つき', icon: Calculator },
  { key: 'shindan', href: '/hensachi/shindan', title: '偏差値診断（点数不要）', desc: '点数が分からなくても5つの質問で偏差値の目安を診断', icon: ClipboardList },
  { key: 'kyoka-betsu', href: '/hensachi/kyoka-betsu', title: '教科別の偏差値を出す', desc: '国語・数学・英語・理科・社会／5教科・3教科を個別に計算', icon: BookOpen },
  { key: 'shiboukou', href: '/hensachi/shiboukou', title: '偏差値→志望校レンジ逆引き', desc: '偏差値から届く高校レベルと、内申点との並置を確認', icon: Target },
  { key: 'agekata', href: '/hensachi/agekata', title: '偏差値の出し方・上げ方', desc: '計算式の使い方と、1か月で偏差値を上げる具体策', icon: TrendingUp },
  { key: 'moshi', href: '/hensachi/moshi', title: '模試の偏差値の見方', desc: '模試で偏差値が違う理由・回次別・推移の正しい見方', icon: BarChart3 },
  { key: 'mantenkan', href: '/hensachi/mantenkan', title: '満点変換つき偏差値計算', desc: '500点・1000点満点など100点満点以外のテスト・模試に対応', icon: ArrowLeftRight },
  { key: 'gyakusan', href: '/hensachi/gyakusan', title: '目標偏差値まであと何点？逆算', desc: '過去問・模試の得点から、目標偏差値に必要な点数を逆算', icon: Undo2 },
];

export function HensachiClusterNav({ current }: { current: HensachiClusterKey }) {
  const others = CLUSTER_PAGES.filter((p) => p.key !== current);
  return (
    <nav aria-label="偏差値ツール一覧" className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <h2 className="mb-1 text-xl font-bold text-slate-900">
        偏差値ツール・ガイド
      </h2>
      <p className="mb-2 text-sm leading-[1.8] text-slate-600">
        偏差値は<strong className="text-slate-900">計算式だけで確定する</strong>ので、当サイトの偏差値ツールはすべて無料・登録不要・その場で結果が出ます。
      </p>
      <ul className="grid gap-x-6 sm:grid-cols-2">
        {others.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.key}>
              <Link
                href={p.href}
                className="group flex min-h-[44px] items-start gap-3 border-b border-slate-200 py-3"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                <span className="flex-1">
                  <span className="flex items-center gap-1 text-base font-bold text-slate-900 group-hover:text-brand-700">
                    {p.title}
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">{p.desc}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
