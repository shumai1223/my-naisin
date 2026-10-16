import Link from 'next/link';

import { APP_NAME } from '@/lib/constants';
import { FISCAL_YEAR_PROVISIONAL_NOTE } from '@/lib/fiscal-year';
import { SUPPORT_URL } from '@/lib/support-link';

const TOOL_LINKS: { href: string; label: string }[] = [
  { href: '/hensachi', label: '偏差値計算（5教科）' },
  { href: '/hyotei-heikin', label: '評定平均 自動計算' },
  { href: '/hiyou', label: 'お金・費用まとめ（教育費・学費・塾代）' },
  { href: '/kyouiku-hi', label: '教育費シミュレーター（中学〜高校卒業）' },
  { href: '/koukou-hiyou', label: '高校の費用シミュレーター（公立/私立）' },
  { href: '/juku-hiyou', label: '塾代シミュレーター（相場・総額）' },
  { href: '/shougakukin', label: '高校無償化・就学支援金ガイド' },
  { href: '/plan', label: '内申点アップの学習計画ジェネレータ' },
  { href: '/dashboard', label: '成績の記録ダッシュボード（推移グラフ）' },
  { href: '/ask', label: '内申点クイックアンサー（質問する）' },
  { href: '/reverse', label: '志望校から逆算（必要な内申・当日点）' },
  { href: '/mendan', label: '三者面談の準備チェックリスト' },
  { href: '/tokyo/total-score', label: '都立高校 総合得点 計算（1020点）' },
  { href: '/kanagawa/s-value', label: '神奈川県 S値 計算（1000点）' },
  { href: '/osaka/total-score', label: '大阪府 総合点 計算（タイプⅠ〜Ⅴ）' },
  { href: '/hokkaido/rank', label: '北海道 内申ランク判定' },
  { href: '/aichi/total-score', label: '愛知県 総合得点 計算（評定得点×2倍）' },
  { href: '/chiba/total-score', label: '千葉県 総合得点 計算（係数K対応）' },
  { href: '/saitama/total-score', label: '埼玉県 総合得点 計算（学年比率対応）' },
  { href: '/fukuoka/total-score', label: '福岡県 総合得点 計算（中3のみ45点満点）' },
  { href: '/naishin-map', label: '内申点の日本地図（都道府県別インタラクティブ）' },
  { href: '/report/2026', label: '内申点白書2026（47都道府県データ・引用自由）' },
  { href: '/nyushi-seido-henkou', label: '入試制度変更点まとめ（都道府県別・随時更新）' },
  { href: '/genten-archive', label: '一次ソース確認履歴アーカイブ（都道府県別・継続更新）' },
  { href: '/hensachi/moshi/nittei', label: '模試日程データベース（都道府県別）' },
  { href: '/tokyo/naishin', label: '東京都 内申計算' },
  { href: '/kanagawa/naishin', label: '神奈川県 内申計算' },
  { href: '/osaka/naishin', label: '大阪府 内申計算' },
  { href: '/tools', label: '全ツール一覧（受験対策ツール集）' },
];

const COLUMN_LINKS: { href: string; label: string }[] = [
  { href: '/blog/naishin-guide', label: '内申点の仕組みを徹底解説' },
  { href: '/blog/how-to-raise-naishinten', label: '内申点を上げる15の方法' },
  { href: '/blog/practical-subjects-naishin-strategy', label: '副教科で「5」を取る戦略' },
  { href: '/blog/tokyo-naishin-calculation-guide', label: '東京都の換算内申ガイド' },
];

const SITE_LINKS: { href: string; label: string }[] = [
  { href: '/about', label: '運営者プロフィール' },
  { href: '/quality', label: '品質保証と根拠' },
  { href: '/glossary', label: '用語辞典' },
  { href: '/contact', label: 'お問い合わせ' },
  { href: '/press', label: '取材・プレスキット' },
  { href: '/developers', label: 'データAPI / MCP' },
  { href: '/hogosha', label: '保護者の方へ' },
];

const linkClass = 'text-sm text-slate-700 underline-offset-2 hover:text-brand-800 hover:underline';
const headingClass = 'text-sm font-bold text-slate-900';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white print:hidden">
      {/* 下の余白は、画面下に固定されるLINEバー（最大65px）が最後の行を隠さないための分 */}
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* サイトについて */}
          <div>
            <div className="text-base font-bold text-slate-900">{APP_NAME}</div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              中高生の内申点計算をかんたんに。<br />
              全国47都道府県の最新入試制度に対応。<br />
              教育統計に基づいた確かな情報をお届けします。
            </p>
          </div>

          {/* 計算ツール */}
          <div className="md:col-span-2">
            <h2 className={headingClass}>計算ツール</h2>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {TOOL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="sm:col-span-2">
                <Link href="/prefectures" className={`${linkClass} font-bold text-brand-700`}>
                  すべての都道府県を見る
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-10 border-t border-slate-200 pt-8 md:grid-cols-3">
          {/* 受験攻略コラム */}
          <div>
            <h2 className={headingClass}>受験攻略コラム</h2>
            <ul className="mt-3 space-y-1.5">
              {COLUMN_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* サイト情報 */}
          <div className="md:col-span-2">
            <h2 className={headingClass}>サイト情報</h2>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://x.com/My_Naishin" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  公式X（開発の裏側）
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 免責事項 */}
        <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-relaxed text-amber-900">
            <strong>免責事項:</strong> 当サイトの計算結果は参考値です。実際の入試における内申点は、各中学校が作成する正式な調査書の内容に基づきます。
            正確な情報については、各都道府県教育委員会または在籍校にご確認ください。
            詳細は<Link href="/disclaimer" className="font-bold underline">免責事項</Link>をご覧ください。
            <br />
            {FISCAL_YEAR_PROVISIONAL_NOTE}
          </p>
        </div>

        {/* 広告表記（ステマ規制対応・必須） */}
        <div className="mt-3 rounded-lg border border-slate-200 p-4">
          <p className="text-xs leading-relaxed text-slate-600">
            <strong className="text-slate-900">広告表記:</strong> 当サイトは、第三者配信のアフィリエイト広告サービスとGoogle AdSenseを利用しています。アフィリエイトのリンクから商品やサービスをお申し込みいただいた場合、運営者が広告主から成果報酬を受け取ることがあります。
            Google AdSenseの広告は、表示やクリックに応じて運営者に収益が入るもので、内容は運営者が選んだものではなく、運営者が推奨するものでもありません。
            なお、アフィリエイトで紹介する商品・サービスは運営者が中立的に評価して選定しています。
          </p>
        </div>

        {/* 最下段 */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-600">© 2026 {APP_NAME}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/terms" className="inline-flex min-h-11 items-center text-xs text-slate-600 underline-offset-2 hover:text-brand-800 hover:underline">利用規約</Link>
            <Link href="/privacy" className="inline-flex min-h-11 items-center text-xs text-slate-600 underline-offset-2 hover:text-brand-800 hover:underline">プライバシーポリシー</Link>
            {SUPPORT_URL && (
              /* 応援リンク（T-REV2 R5）: 小さく1つだけ・見返りは約束しない。URL未設定の間は描画しない */
              <a
                href={SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex min-h-11 items-center text-xs text-slate-600 underline-offset-2 hover:text-brand-800 hover:underline"
                title="いただいた応援は運営費にあてます（見返りはありません）"
              >
                このサイトを応援する
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
