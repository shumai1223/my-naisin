'use client';

import Link from 'next/link';
import { Heart, FileText, Shield, Mail, AlertTriangle, Sparkles, BookOpen, User, Target, MapPin, ChevronRight } from 'lucide-react';

import { APP_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/30">
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
                <Link href="/aichi/naishin" className="hover:text-blue-600 flex items-center gap-1">
                  愛知県 内申計算 <ChevronRight className="h-3 w-3 opacity-30" />
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
