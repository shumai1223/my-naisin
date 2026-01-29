'use client';

import Link from 'next/link';
import { Heart, FileText, Shield, Mail, AlertTriangle, Sparkles, Twitter, Github, BookOpen } from 'lucide-react';

import { APP_NAME } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200/30">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-100/70 to-slate-200/50" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)' }} />
      
      <div className="relative px-4 py-10 md:px-6">
        {/* Main footer content */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* About */}
          <div>
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
              目標設定・教科分析・達成バッジで<br />
              あなたの勉強をサポートします。
            </p>
            {/* Social links placeholder */}
            <div className="mt-4 flex items-center gap-2">
              <a 
                href="#" 
                className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-400 transition-all hover:bg-blue-100 hover:text-blue-500"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">機能</div>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-blue-500" />
                内申点の自動計算
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                レーダーチャートで可視化
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-amber-500" />
                達成バッジシステム
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-violet-500" />
                SNSシェア機能
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-rose-500" />
                勉強アドバイス
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">リンク</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link 
                href="/blog" 
                className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all hover:bg-blue-200"
              >
                <BookOpen className="h-3 w-3" />
                内申点コラム
              </Link>
              <Link 
                href="/terms" 
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition-all hover:bg-blue-100 hover:text-blue-700"
              >
                <FileText className="h-3 w-3" />
                利用規約
              </Link>
              <Link 
                href="/privacy" 
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition-all hover:bg-emerald-100 hover:text-emerald-700"
              >
                <Shield className="h-3 w-3" />
                プライバシー
              </Link>
              <Link 
                href="/disclaimer" 
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition-all hover:bg-amber-100 hover:text-amber-700"
              >
                <AlertTriangle className="h-3 w-3" />
                免責事項
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition-all hover:bg-violet-100 hover:text-violet-700"
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
              <strong>ご注意:</strong> 内申点の計算方法は地域・学校によって異なる場合があります。
              このアプリは目安としてお楽しみください。
              実際の進路相談は学校の先生にご確認ください。
              詳しくは<Link href="/disclaimer" className="font-medium text-amber-700 underline hover:text-amber-900">免責事項</Link>をご覧ください。
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-[11px] text-slate-400">
            © 2026 {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              Made with <Heart className="h-3 w-3 text-rose-400" /> for students
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="text-[11px] text-slate-400">
              v2026.1
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
