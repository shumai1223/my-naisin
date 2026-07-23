import Link from 'next/link';
import { Heart, FileText, Shield, Mail, AlertTriangle, Sparkles, BookOpen, User, Target, MapPin, ChevronRight, Database, Twitter } from 'lucide-react';

import { APP_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/30 print:hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-100/70 to-slate-200/50" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)' }} />
      
      <div className="relative px-4 py-10 md:px-6">
        {/* Main footer content */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* About */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-600 shadow-lg shadow-indigo-300/40">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-800">{APP_NAME}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">2026 Edition</div>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              中高生の内申点計算をかんたんに。<br />
              全国47都道府県の最新入試制度に対応。<br />
              教育統計に基づいた確かな情報をお届けします。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">計算ツール</div>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/hensachi" className="hover:text-blue-600 flex items-center gap-1">
                  偏差値計算（5教科） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/hyotei-heikin" className="hover:text-blue-600 flex items-center gap-1">
                  評定平均 自動計算 <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/hiyou" className="hover:text-blue-600 flex items-center gap-1">
                  お金・費用まとめ（教育費・学費・塾代） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/kyouiku-hi" className="hover:text-blue-600 flex items-center gap-1">
                  教育費シミュレーター（中学〜高校卒業） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/koukou-hiyou" className="hover:text-blue-600 flex items-center gap-1">
                  高校の費用シミュレーター（公立/私立） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/juku-hiyou" className="hover:text-blue-600 flex items-center gap-1">
                  塾代シミュレーター（相場・総額） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/shougakukin" className="hover:text-blue-600 flex items-center gap-1">
                  高校無償化・就学支援金ガイド <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/plan" className="hover:text-blue-600 flex items-center gap-1">
                  内申点アップの学習計画ジェネレータ <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 flex items-center gap-1">
                  成績の記録ダッシュボード（推移グラフ） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/ask" className="hover:text-blue-600 flex items-center gap-1">
                  内申点クイックアンサー（質問する） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/reverse" className="hover:text-blue-600 flex items-center gap-1">
                  志望校から逆算（必要な内申・当日点） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/mendan" className="hover:text-blue-600 flex items-center gap-1">
                  三者面談の準備チェックリスト <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/tokyo/total-score" className="hover:text-blue-600 flex items-center gap-1">
                  都立高校 総合得点 計算（1020点） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/kanagawa/s-value" className="hover:text-blue-600 flex items-center gap-1">
                  神奈川県 S値 計算（1000点） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/osaka/total-score" className="hover:text-blue-600 flex items-center gap-1">
                  大阪府 総合点 計算（タイプⅠ〜Ⅴ） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/hokkaido/rank" className="hover:text-blue-600 flex items-center gap-1">
                  北海道 内申ランク判定 <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/aichi/total-score" className="hover:text-blue-600 flex items-center gap-1">
                  愛知県 総合得点 計算（評定得点×2倍） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/chiba/total-score" className="hover:text-blue-600 flex items-center gap-1">
                  千葉県 総合得点 計算（係数K対応） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/saitama/total-score" className="hover:text-blue-600 flex items-center gap-1">
                  埼玉県 総合得点 計算（学年比率対応） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/fukuoka/total-score" className="hover:text-blue-600 flex items-center gap-1">
                  福岡県 総合得点 計算（中3のみ45点満点） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/naishin-map" className="hover:text-blue-600 flex items-center gap-1">
                  内申点の日本地図（都道府県別インタラクティブ） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/report/2026" className="hover:text-blue-600 flex items-center gap-1">
                  内申点白書2026（47都道府県データ・引用自由） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/nyushi-seido-henkou" className="hover:text-blue-600 flex items-center gap-1">
                  入試制度変更点まとめ（都道府県別・随時更新） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/genten-archive" className="hover:text-blue-600 flex items-center gap-1">
                  一次ソース確認履歴アーカイブ（都道府県別・継続更新） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/hensachi/moshi/nittei" className="hover:text-blue-600 flex items-center gap-1">
                  模試日程データベース（都道府県別） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/tokyo/naishin" className="hover:text-blue-600 flex items-center gap-1">
                  東京都 内申計算 <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/kanagawa/naishin" className="hover:text-blue-600 flex items-center gap-1">
                  神奈川県 内申計算 <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/osaka/naishin" className="hover:text-blue-600 flex items-center gap-1">
                  大阪府 内申計算 <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-blue-600 flex items-center gap-1">
                  全ツール一覧（受験対策ツール集） <ChevronRight className="h-3 w-3 opacity-30" />
                </Link>
              </li>
              <li>
                <Link href="/prefectures" className="text-blue-600 font-bold flex items-center gap-1 mt-2">
                  すべての都道府県を見る <ChevronRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column Tags */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">受験攻略コラム</div>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/blog/naishin-guide" className="hover:text-blue-600">
                  内申点の仕組みを徹底解説
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-raise-naishinten" className="hover:text-blue-600">
                  内申点を上げる15の方法
                </Link>
              </li>
              <li>
                <Link href="/blog/practical-subjects-naishin-strategy" className="hover:text-blue-600">
                  副教科で「5」を取る戦略
                </Link>
              </li>
              <li>
                <Link href="/blog/tokyo-naishin-calculation-guide" className="hover:text-blue-600">
                  東京都の換算内申ガイド
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">サイト情報</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link 
                href="/about" 
                className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-all hover:bg-indigo-100"
              >
                <User className="h-3 w-3" />
                運営者プロフィール
              </Link>
              <Link 
                href="/quality" 
                className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100"
              >
                <Shield className="h-3 w-3" />
                品質保証と根拠
              </Link>
              <Link 
                href="/glossary" 
                className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition-all hover:bg-amber-100"
              >
                <BookOpen className="h-3 w-3" />
                用語辞典
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition-all hover:bg-violet-100"
              >
                <Mail className="h-3 w-3" />
                お問い合わせ
              </Link>
              <Link
                href="/press"
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-200"
              >
                <FileText className="h-3 w-3" />
                取材・プレスキット
              </Link>
              <Link
                href="/developers"
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:bg-slate-200"
              >
                <Database className="h-3 w-3" />
                データAPI / MCP
              </Link>
              <Link
                href="/hogosha"
                className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition-all hover:bg-rose-100"
              >
                <Heart className="h-3 w-3" />
                保護者の方へ
              </Link>
              <a
                href="https://x.com/My_Naishin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition-all hover:bg-sky-100"
              >
                <Twitter className="h-3 w-3" />
                公式X（開発の裏側）
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-amber-50/80 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-[11px] leading-relaxed text-amber-800">
              <strong>免責事項:</strong> 当サイトの計算結果は参考値です。実際の入試における内申点は、各中学校が作成する正式な調査書の内容に基づきます。
              正確な情報については、各都道府県教育委員会または在籍校にご確認ください。
              詳細は<Link href="/disclaimer" className="font-bold underline">免責事項</Link>をご覧ください。
            </p>
          </div>
        </div>

        {/* 広告表記（ステマ規制対応・必須） */}
        <div className="mt-3 rounded-xl border border-slate-200/60 bg-white/40 p-3 text-center">
          <p className="text-[11px] leading-relaxed text-slate-500">
            <strong className="text-slate-600">広告表記:</strong> 当サイトは、第三者配信のアフィリエイト広告サービスを利用しており、リンクから商品やサービスをお申し込みいただいた場合、運営者が広告主から成果報酬を受け取ることがあります。
            なお、紹介する商品・サービスは運営者が中立的に評価して選定しています。
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-[11px] text-slate-400">
            © 2026 {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-[11px] text-slate-400 hover:text-blue-500">利用規約</Link>
            <div className="h-3 w-px bg-slate-200" />
            <Link href="/privacy" className="text-[11px] text-slate-400 hover:text-blue-500">プライバシーポリシー</Link>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              Made with <Heart className="h-3 w-3 text-rose-400" /> for students
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="text-[11px] text-slate-400">
              v2026.4.16
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
