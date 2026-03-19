import Link from 'next/link';

import HomeClient from './HomeClient';

const PREFECTURE_LINKS = [
  { code: 'tokyo', name: '東京都' },
  { code: 'kanagawa', name: '神奈川県' },
  { code: 'osaka', name: '大阪府' },
  { code: 'aichi', name: '愛知県' },
  { code: 'saitama', name: '埼玉県' },
  { code: 'chiba', name: '千葉県' },
  { code: 'hokkaido', name: '北海道' },
  { code: 'fukuoka', name: '福岡県' },
  { code: 'hyogo', name: '兵庫県' },
  { code: 'kyoto', name: '京都府' },
  { code: 'shizuoka', name: '静岡県' },
  { code: 'hiroshima', name: '広島県' },
];

export default function Page() {
  return (
    <>
      <HomeClient />

      {/* SSR静的コンテンツ - Googlebotが初回HTMLで読めるテキスト */}
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            内申点シミュレーター My Naishin とは
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 mb-4">
            My Naishinは、全国47都道府県の内申点計算方式に対応した無料シミュレーターです。
            9教科の成績（5段階評価）を入力するだけで、お住まいの地域の計算方式に合わせた内申点を自動計算します。
            2026年度（令和8年度）入試の最新情報に対応しています。
          </p>

          <h3 className="text-base font-bold text-slate-800 mb-3">主な機能</h3>
          <ul className="text-sm text-slate-600 space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
              <span><strong>内申点計算</strong>：都道府県ごとの実技倍率・学年比率に対応した正確な計算</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
              <span><strong>志望校逆算</strong>：目標校に必要な内申点を逆算して確認</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
              <span><strong>成績推移グラフ</strong>：過去の計算結果を時系列で比較・管理</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
              <span><strong>教科別アドバイス</strong>：弱点教科の改善優先度を分析</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
              <span><strong>都道府県比較</strong>：異なる地域の計算方式を横断比較</span>
            </li>
          </ul>

          <h3 className="text-base font-bold text-slate-800 mb-3">内申点の基本知識</h3>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            内申点（調査書点）とは、中学校での各教科の成績を点数化したもので、
            高校入試の合否判定に使用されます。計算方法は都道府県によって大きく異なり、
            満点も45点から450点以上まで様々です。
          </p>
          <p className="text-sm leading-relaxed text-slate-600 mb-3">
            例えば東京都では実技4教科が2倍で計算される「換算内申」方式を採用し、
            神奈川県では中学2年・3年の成績が使用されます。
            大阪府では450点満点、愛知県では中学3年間の成績が対象となるなど、
            地域ごとに制度が異なります。
          </p>
          <p className="text-sm leading-relaxed text-slate-600 mb-6">
            内申点を上げるには、定期テストでの高得点だけでなく、
            提出物の期限内提出や授業への積極的な参加も重要です。
            特に「主体的に学習に取り組む態度」の評価は、テストの点数に関わらず改善できるポイントです。
          </p>

          <h3 className="text-base font-bold text-slate-800 mb-3">都道府県別の内申点計算</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {PREFECTURE_LINKS.map(({ code, name }) => (
              <Link
                key={code}
                href={`/${code}/naishin`}
                className="flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {name}の内申点計算
              </Link>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">
            上記以外にも全47都道府県に対応しています。
            <Link href="/guide" className="text-blue-500 hover:text-blue-600 ml-1">
              都道府県別ガイドを見る
            </Link>
          </p>

          <div className="mt-6 border-t border-slate-100 pt-6">
            <h3 className="text-base font-bold text-slate-800 mb-3">関連コンテンツ</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/guide"
                className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                内申点ガイド - 都道府県別の計算方法・対策
              </Link>
              <Link
                href="/tools"
                className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                ツール一覧 - 計算・逆算・比較ツール
              </Link>
              <Link
                href="/comparison"
                className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                都道府県比較 - 計算方式の違いを一覧で確認
              </Link>
              <Link
                href="/blog"
                className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                コラム - 内申点の基礎知識・受験対策記事
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
