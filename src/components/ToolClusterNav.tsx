import Link from 'next/link';
import { Calculator, TrendingUp, Percent, Target, MapPin, Users, ChevronRight, Wrench, Sigma, Wallet, ClipboardCheck } from 'lucide-react';

/**
 * サイト横断のツールクラスタ・ハブ&スポーク内部リンク（情報設計 §7）。
 *
 * 偏差値クラスタ（HensachiClusterNav）の上位版で、稼ぎ頭・換金面・低順位ハブを相互接続する：
 *   内申点計算 ⇄ 偏差値 ⇄ 評定平均 ⇄ 志望校逆算 ⇄ 都道府県別 ⇄ 三者面談。
 * 目的：①回遊（PV/滞在）UP ②低順位ページ（/reverse pos12 /tools pos20 /prefectures pos15）へ
 * 評価（リンクジュース）を集中 ③新設面（/mendan）の発見性。
 * `current` で現在地を強調（自己リンクは出さない）。追加コンテンツ無しでPVと評価を底上げする。
 */
export type ToolClusterKey =
  | 'naishin'
  | 'hensachi'
  | 'hyotei-heikin'
  | 'reverse'
  | 'prefectures'
  | 'total-score'
  | 'jikosaiten'
  | 'hiyou'
  | 'mendan';

interface ClusterPage {
  key: ToolClusterKey;
  href: string;
  title: string;
  desc: string;
  icon: typeof Calculator;
}

const CLUSTER_PAGES: ClusterPage[] = [
  { key: 'naishin', href: '/', title: '内申点を計算する', desc: '全国47都道府県の最新方式で9教科の内申点を自動計算', icon: Calculator },
  { key: 'hensachi', href: '/hensachi', title: '偏差値を計算する（5教科）', desc: '点数と平均点から偏差値を30秒で算出。上位何%かも分かる', icon: TrendingUp },
  { key: 'hyotei-heikin', href: '/hyotei-heikin', title: '評定平均を計算する', desc: '通知表から評定平均を計算。推薦・併願優遇の基準早見表つき', icon: Percent },
  { key: 'reverse', href: '/reverse', title: '志望校から逆算する', desc: '目標校から必要な内申点・当日点を逆算。あと何点が分かる', icon: Target },
  { key: 'total-score', href: '/total-score', title: '総合得点を計算する（県別）', desc: '内申×当日点の県別の合否計算。S値・換算内申にも対応', icon: Sigma },
  { key: 'jikosaiten', href: '/jikosaiten', title: '当日点を自己採点する', desc: '入試当日の自己採点から合否ラインとの差を確認。合格発表・倍率の読み方も', icon: ClipboardCheck },
  { key: 'prefectures', href: '/prefectures', title: '都道府県別の入試制度', desc: 'お住まいの地域の内申比率・配点方式・総合得点の計算', icon: MapPin },
  { key: 'hiyou', href: '/hiyou', title: 'お金・費用まとめ（保護者向け）', desc: '高校学費・教育費総額・塾代・高校無償化を一括で把握', icon: Wallet },
  { key: 'mendan', href: '/mendan', title: '三者面談の準備', desc: '先生に聞くことリスト・持ち物・面談前に確認する数値', icon: Users },
];

export function ToolClusterNav({ current, className = '' }: { current?: ToolClusterKey; className?: string }) {
  const others = CLUSTER_PAGES.filter((p) => p.key !== current);
  return (
    <nav aria-label="受験対策ツール一覧" className={`rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white p-5 shadow-sm md:p-6 ${className}`}>
      <h2 className="mb-1 flex items-center gap-2 text-base font-bold text-slate-800">
        <Wrench className="h-5 w-5 text-indigo-500" />
        受験対策ツール（無料・登録不要）
      </h2>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        内申点・偏差値・評定平均・志望校逆算をまとめて。すべて<strong className="text-slate-700">その場で結果が出る無料ツール</strong>です。
      </p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {others.map((p) => {
          const Icon = p.icon;
          return (
            <li key={p.key}>
              <Link
                href={p.href}
                className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 transition-all hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-800 group-hover:text-indigo-700">
                    {p.title}
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-400" />
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
