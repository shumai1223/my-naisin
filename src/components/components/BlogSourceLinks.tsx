'use client';

import Link from 'next/link';
import { ExternalLink, FileText, GraduationCap, Shield } from 'lucide-react';

interface BlogSourceLinksProps {
  prefectureCode?: string;
  hasEvaluationPoints?: boolean;
  hasCalculationMethod?: boolean;
}

export function BlogSourceLinks({ 
  prefectureCode, 
  hasEvaluationPoints = false, 
  hasCalculationMethod = false 
}: BlogSourceLinksProps) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-blue-800">
        <Shield className="h-5 w-5" />
        根拠リンク（一次情報）
      </h3>
      
      <div className="space-y-4">
        {/* 教育委員会の公式資料 */}
        {prefectureCode && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
              <FileText className="h-4 w-4" />
              教育委員会の公式資料
            </h4>
            <div className="space-y-2">
              <SourceLink
                href={getPrefectureOfficialUrl(prefectureCode)}
                title={`${getPrefectureName(prefectureCode)}教育委員会 - 入学者選抜要綱`}
                description="令和8年度入学者選抜の公式要綱（一次情報）"
              />
              <SourceLink
                href={getPrefectureOfficialUrl(prefectureCode)}
                title={`${getPrefectureName(prefectureCode)}教育委員会 - 内申点・調査書点の解説`}
                description="内申点計算方法の公式説明（一次情報）"
              />
            </div>
          </div>
        )}

        {/* 文部科学省の学習指導要領 */}
        {hasEvaluationPoints && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
              <GraduationCap className="h-4 w-4" />
              文部科学省の学習指導要領
            </h4>
            <div className="space-y-2">
              <SourceLink
                href="https://www.mext.go.jp/a_menu/shotou/new-cs/1384661.htm"
                title="文部科学省 - 中学校学習指導要領（平成29年告示）"
                description="評価の3観点（知識・技能、思考・判断・表現、主体的に学習に取り組む態度）の公式解説（一次情報）"
              />
              <SourceLink
                href="https://www.mext.go.jp/a_menu/shotou/youryou/chousa.html"
                title="文部科学省 - 調査書の記入要領について"
                description="調査書の評定と記入方法の公式ガイドライン（一次情報）"
              />
            </div>
          </div>
        )}

        {/* 計算方法の根拠 */}
        {hasCalculationMethod && (
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
              <FileText className="h-4 w-4" />
              計算方法の根拠資料
            </h4>
            <div className="space-y-2">
              <SourceLink
                href="https://www.mext.go.jp/a_menu/shotou/youryou/sinro.html"
                title="文部科学省 - 内申点と調査書点の関係"
                description="内申点から調査書点への換算方法の公式解説（一次情報）"
              />
              <SourceLink
                href="https://www.mext.go.jp/a_menu/shotou/youryou/koukou.html"
                title="文部科学省 - 高校入試における調査書の活用"
                description="高校入試での調査書点の取り扱いに関する公式指針（一次情報）"
              />
            </div>
          </div>
        )}

        {/* 一般的な根拠 */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
            <FileText className="h-4 w-4" />
            一般的な根拠資料
          </h4>
          <div className="space-y-2">
            <SourceLink
              href="https://www.mext.go.jp/a_menu/shotou/youryou/index.html"
              title="文部科学省 - 学習指導要領ポータル"
              description="学習指導要領に関する全情報（一次情報）"
            />
            <SourceLink
              href="https://www.mext.go.jp/b_menu/shingi/chukyo/chukyo3/001/attach/1293749.htm"
              title="文部科学省 - 評価の観点に関する資料"
              description="評価の観点と評価基準の詳細解説（一次情報）"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-blue-300 bg-blue-100 p-3">
        <p className="text-xs text-blue-700">
          <strong>注記：</strong>これらのリンクは国や教育委員会の公式資料（一次情報）です。
          制度は年度によって変更される場合があるため、最新情報は各公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}

function SourceLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-blue-200 bg-white p-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
    >
      <div className="flex items-start gap-2">
        <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <h5 className="text-sm font-medium text-blue-800 hover:text-blue-900">{title}</h5>
          <p className="mt-1 text-xs text-blue-600">{description}</p>
        </div>
      </div>
    </a>
  );
}

function getPrefectureName(code: string): string {
  const names: Record<string, string> = {
    tokyo: '東京都',
    kanagawa: '神奈川県',
    osaka: '大阪府',
    aichi: '愛知県',
    fukuoka: '福岡県',
    hokkaido: '北海道',
  };
  return names[code] || code;
}

function getPrefectureOfficialUrl(code: string): string {
  const urls: Record<string, string> = {
    tokyo: 'https://www.kyoiku.metro.tokyo.lg.jp/',
    kanagawa: 'https://www.pref.kanagawa.jp/',
    osaka: 'https://www.pref.osaka.lg.jp/',
    aichi: 'https://www.pref.aichi.jp/',
    fukuoka: 'https://www.pref.fukuoka.lg.jp/',
    hokkaido: 'https://www.pref.hokkaido.lg.jp/',
  };
  return urls[code] || 'https://www.mext.go.jp/';
}
