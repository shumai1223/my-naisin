'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { 
  Calculator, 
  ChevronRight, 
  ExternalLink, 
  Calendar, 
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Info,
  ArrowRight
} from 'lucide-react';
import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';

// 県別の落とし穴・注意点データ
const PREFECTURE_PITFALLS: Record<string, { title: string; items: string[] }> = {
  tokyo: {
    title: '東京都の注意点',
    items: [
      '実技4教科（音楽・美術・保体・技家）は評定が2倍で計算される',
      '中3の成績のみが対象（中1・中2は含まれない）',
      '都立一般入試では内申点300点＋学力検査700点＋ESAT-J 20点＝1020点満点',
      '推薦入試では内申点の比重が高い（学校により異なる）',
      'ESAT-J（英語スピーキングテスト）の結果も加算される学校あり'
    ]
  },
  kanagawa: {
    title: '神奈川県の注意点',
    items: [
      '中2と中3の成績が対象（中1は含まれない）',
      '中3の成績は2倍で計算される',
      'S値（学力検査）・A値（内申点）・特色検査の比率は学校ごとに異なる',
      '面接が全校で実施される',
      '特色検査を実施する高校では追加の対策が必要'
    ]
  },
  saitama: {
    title: '埼玉県の注意点',
    items: [
      '中1〜中3の3年間の成績が対象',
      '学年の比率は高校によって異なる（1:1:2、1:1:3、1:2:3など）',
      '加算点（部活動・生徒会活動など）がある高校も',
      '相関表を使った選抜方式',
      '第1次選抜・第2次選抜で配点が変わる場合あり'
    ]
  },
  chiba: {
    title: '千葉県の注意点',
    items: [
      '中1〜中3の3年間の成績が対象（各学年45点×3＝135点満点）',
      'K値による換算で調査書点を算出',
      '2日間の入試（1日目：学力検査、2日目：学校設定検査）',
      '学校設定検査は高校ごとに内容が異なる',
      '前期・後期の区分はなくなり、一般入学者選抜に一本化'
    ]
  },
  osaka: {
    title: '大阪府の注意点',
    items: [
      '中1〜中3の3年間の成績が対象',
      '学年比率は1:1:3（中3が3倍）',
      '実技4教科も5教科と同じ扱い',
      'チャレンジテストの結果が評定に影響する可能性',
      '文理学科・普通科などでボーダーが大きく異なる'
    ]
  }
};

// デフォルトの注意点
const DEFAULT_PITFALLS = {
  title: 'この県の注意点',
  items: [
    '計算方法や配点は高校によって異なる場合があります',
    '最新の情報は各都道府県教育委員会の公式サイトでご確認ください',
    '特色選抜や推薦入試では別の計算方法が使われることがあります'
  ]
};

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function PrefecturePage({ params }: PageProps) {
  const { code } = use(params);
  const prefecture = getPrefectureByCode(code);

  if (!prefecture) {
    notFound();
  }

  const pitfalls = PREFECTURE_PITFALLS[code] || DEFAULT_PITFALLS;

  // 計算式の説明を生成
  const getFormulaExplanation = () => {
    const parts: string[] = [];
    
    prefecture.targetGrades.forEach(grade => {
      const multiplier = prefecture.gradeMultipliers[grade];
      if (multiplier > 0) {
        parts.push(`中${grade}${multiplier > 1 ? `×${multiplier}` : ''}`);
      }
    });

    let formula = parts.join(' ＋ ');
    
    if (prefecture.practicalMultiplier > 1) {
      formula += `（実技${prefecture.practicalMultiplier}倍）`;
    }

    return formula;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600">ホーム</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">{prefecture.name}の内申点</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                {prefecture.name}の内申点計算方法
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {prefecture.region} | 令和{prefecture.fiscalYear || '7'}年度入試対応
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {/* 概要カード */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Info className="h-5 w-5 text-blue-500" />
              計算方法の概要
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {prefecture.description}
            </p>
            
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{prefecture.maxScore}点</div>
                <div className="mt-1 text-xs text-blue-600">満点</div>
              </div>
              <div className="rounded-xl bg-indigo-50 p-4 text-center">
                <div className="text-2xl font-bold text-indigo-700">
                  中{prefecture.targetGrades.join('・')}
                </div>
                <div className="mt-1 text-xs text-indigo-600">対象学年</div>
              </div>
              <div className="rounded-xl bg-purple-50 p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {prefecture.practicalMultiplier > 1 ? `${prefecture.practicalMultiplier}倍` : '等倍'}
                </div>
                <div className="mt-1 text-xs text-purple-600">実技教科</div>
              </div>
            </div>

            {prefecture.note && (
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
                <strong>補足：</strong> {prefecture.note}
              </div>
            )}
          </section>

          {/* 計算式 */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-emerald-500" />
              計算式
            </h2>
            <div className="rounded-xl bg-slate-50 p-4">
              <code className="text-lg font-mono font-semibold text-slate-700">
                {getFormulaExplanation()} ＝ {prefecture.maxScore}点満点
              </code>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><strong>5教科：</strong>国語・数学・英語・理科・社会（各5点満点）</p>
              <p><strong>実技4教科：</strong>音楽・美術・保健体育・技術家庭（各5点満点{prefecture.practicalMultiplier > 1 ? `、${prefecture.practicalMultiplier}倍で計算` : ''}）</p>
            </div>
          </section>

          {/* 注意点・落とし穴 */}
          <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {pitfalls.title}
            </h2>
            <ul className="space-y-3">
              {pitfalls.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 公式資料リンク */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              公式資料・情報源
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {prefecture.sourceUrl ? (
                <a
                  href={prefecture.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  {prefecture.sourceTitle || `${prefecture.name}教育委員会`}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <span className="inline-flex items-center rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-500">
                  公式リンク：確認中
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
                <Calendar className="h-4 w-4" />
                最終確認: {prefecture.lastVerified || '未確認'}
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              ※ 制度は年度によって変更される場合があります。最新情報は上記公式サイトでご確認ください。
            </p>
          </section>

          {/* CTA - 計算機へ */}
          <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white shadow-lg">
            <h2 className="text-xl font-bold">
              {prefecture.name}の内申点を計算してみよう！
            </h2>
            <p className="mt-2 text-sm text-blue-100">
              9教科の成績を入力するだけで、あなたの内申点がすぐにわかります
            </p>
            <Link
              href={`/?pref=${prefecture.code}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-md transition-all hover:shadow-lg"
            >
              内申点を計算する
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* 関連リンク */}
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/blog/naishinten-calculation-by-prefecture"
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-slate-700">都道府県別の計算方法を比較</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                href="/blog/improve-grades-from-all-3"
                className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-sm font-medium text-slate-700">内申点を上げる方法15選</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
