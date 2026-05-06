import Link from 'next/link';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export function TrustInfo() {
  return (
    <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
          <img 
            src="/favicon.svg" 
            alt="内申点シミュレーター 運営チーム" 
            className="h-full w-full object-cover bg-blue-600 p-2"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-800">内申点シミュレーター 開発・運営チーム</h3>
            <ShieldCheck className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            現役のエンジニアと受験指導経験者によって運営されています。各都道府県の教育委員会が発表する最新の「入学者選抜実施要綱」を1点1点プログラムに落とし込み、常に最新の計算ロジックを提供できるよう保守管理を行っています。
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
            <Link 
              href="/about/editor-profile"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              運営者プロフィール
              <ExternalLink className="h-3 w-3" />
            </Link>
            <Link 
              href="/quality"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              情報の正確性への取り組み
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
