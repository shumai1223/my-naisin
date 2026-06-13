import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calculator, 
  ChevronRight, 
  GraduationCap,
  BookOpen,
  Info,
  Sparkles,
  ExternalLink,
  Target,
  FileText,
  AlertCircle,
  Shield,
} from 'lucide-react';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import { getTotalScoreSystem } from '@/lib/total-score/registry';
import { getExplainer } from '@/lib/total-score/explainers';
import { getPrefectureGuide, generateDynamicFAQ } from '@/lib/prefecture-guides';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { HowToSchema } from '@/components/StructuredData/HowToSchema';
import { ErrorReportForm } from '@/components/ErrorReportForm';
import { PrefectureMinimumContent } from '@/components/PrefectureMinimumContent';
import { BlogRelatedArticles } from '@/components/BlogRelatedArticles';
import InteractiveCalculator from '@/components/Calculator/InteractiveCalculatorWrapper';
import { HighSchoolBorderlineTable } from '@/components/HighSchoolBorderlineTable';
import { TrustInfo } from '@/components/TrustInfo';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { SaveResultCTA } from '@/components/SaveResultCTA';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';

interface PageProps {
  params: Promise<{ prefecture: string }>;
}

/**
 * 県専用の上位計算ツールへの内部リンク設定。
 * GSC実データ上、神奈川/大阪/北海道の /[code]/naishin ページは月数千impを集める強いページだが、
 * 各県専用ツール（S値・総合点・内申ランク）は検索2ページ目に沈んでいた。
 * 強い内申ページから専用ツールへ文脈リンクを通し、評価（権威）を流して順位を引き上げる。
 */
const SIBLING_TOOLS: Record<
  string,
  { href: string; badge: string; title: string; description: string; cta: string }
> = {
  tokyo: {
    href: '/tokyo/total-score',
    badge: '東京都の受験生向け',
    title: '都立高校の総合得点（1020点満点）も計算する',
    description:
      '内申点（調査書点300点）に学力検査700点・ESAT-J 20点を加えた1020点満点の総合得点を一括で算出できます。日比谷・西・国立など主要都立高校の合格ラインとも比較可能。',
    cta: '総合得点を計算する',
  },
  kanagawa: {
    href: '/kanagawa/s-value',
    badge: '神奈川県の受験生向け',
    title: '神奈川県のS値（S1・S2／1000点満点）も自動計算する',
    description:
      '神奈川県の公立高校入試は、内申点・学力検査・特色検査を志望校ごとの比率で合算した「S値」で合否が決まります。内申点と当日点を入れるだけで1000点満点のS値を算出し、横浜翠嵐・湘南など難関校の合格目安と比較できます。',
    cta: 'S値を計算する（1000点）',
  },
  osaka: {
    href: '/osaka/total-score',
    badge: '大阪府の受験生向け',
    title: '大阪府公立高校の総合点（タイプⅠ〜Ⅴ）も計算する',
    description:
      '大阪府の公立高校入試は、学力検査450点と調査書（内申点）450点を、志望校の選抜タイプ（Ⅰ＝7:3〜Ⅴ＝3:7）の比率で合算した総合点で合否が決まります。北野・茨木・天王寺など主要校の合格目安と比較できます。',
    cta: '総合点を計算する',
  },
  hokkaido: {
    href: '/hokkaido/rank',
    badge: '北海道の受験生向け',
    title: '北海道の内申ランク（A〜M）も判定する',
    description:
      '北海道の公立高校入試では、内申点（315点満点）をA〜Mの13ランクに分類して合否判定に使います。内申点と学力検査点を入れるだけで該当ランクを判定し、札幌南・札幌北など主要校の合格目安と比較できます。',
    cta: '内申ランクを判定する',
  },
  aichi: {
    href: '/aichi/total-score',
    badge: '愛知県の受験生向け',
    title: '愛知県の評価方法Ⅰ〜Ⅴ・総合得点も詳しく見る',
    description:
      '愛知県は内申点（評定得点・最大90）と学力検査（110点）を、志望校が選ぶ評価方法Ⅰ〜Ⅴで重み付けして校内順位を決めます。評定得点の換算早見表と評価方法別の満点・計算例を確認できます。',
    cta: '評価方法・総合得点を見る',
  },
  chiba: {
    href: '/chiba/total-score',
    badge: '千葉県の受験生向け',
    title: '千葉県の調査書点（K値）・総合得点も詳しく見る',
    description:
      '千葉県は学力検査500点に、評定135×係数K（0.5〜2）の調査書点と学校設定検査を合算します。わかりにくいK値の早見表（評定×K）と計算例で、志望校の比重を確認できます。',
    cta: 'K値・調査書点を見る',
  },
  saitama: {
    href: '/saitama/total-score',
    badge: '埼玉県の受験生向け',
    title: '埼玉県の調査書点（学年比率）も詳しく見る',
    description:
      '埼玉県は学力検査500点に、中1〜中3の評定を学年比率（1:1:2・1:1:3・1:2:3など）で重み付けした調査書点を合算します。各学年の比重（％）早見表で、どの学年が効くか確認できます。',
    cta: '学年比率・調査書点を見る',
  },
  fukuoka: {
    href: '/fukuoka/total-score',
    badge: '福岡県の受験生向け',
    title: '福岡県の内申点（中3のみ45点）・当日点の仕組みを見る',
    description:
      '福岡県は内申点（中3の9教科＝45点）と学力検査（5教科×60＝300点）の両方の順位でA群・B群を判定します。内申・当日点の早見表とA群・B群の仕組みを確認できます。',
    cta: '内申45点・当日点を見る',
  },
  hyogo: {
    href: '/hyogo/total-score',
    badge: '兵庫県の受験生向け',
    title: '兵庫県の総合得点（判定資料A・C／500点満点）も計算する',
    description:
      '兵庫県は内申250点（5教科×4＋実技4教科×7.5）＝判定資料Aと、学力500点を0.5倍した判定資料C 250点を同等に扱い、合計500点で合否を判定します。内申点と当日点から総合得点を算出できます。',
    cta: '総合得点を計算する（500点）',
  },
  kyoto: {
    href: '/kyoto/total-score',
    badge: '京都府の受験生向け',
    title: '京都府の中期選抜 総合得点（報告書195＋学力200）も計算する',
    description:
      '京都府の中期選抜は、中1〜中3の評定からなる報告書195点と学力検査200点を同等に扱って合否を判定します。内申点と当日点から総合得点を算出できます。',
    cta: '中期選抜の総合得点を計算する',
  },
  tochigi: {
    href: '/tochigi/total-score',
    badge: '栃木県の受験生向け',
    title: '栃木県の総合得点（内申500換算×学力500）も計算する',
    description:
      '栃木県は内申点135点を500点に換算し、学力検査500点と「内申:学力」9:1〜5:5の比率（高校別）で合算します。志望校の比率を選んで総合得点を算出できます。',
    cta: '総合得点を計算する（500点）',
  },
  niigata: {
    href: '/niigata/total-score',
    badge: '新潟県の受験生向け',
    title: '新潟県の総合得点（調査書1000・学力1000）も計算する',
    description:
      '新潟県は調査書135点と学力500点をそれぞれ1000点に換算し、「調査書:学力」7:3〜3:7の比率（高校別）で合算します。志望校の比率を選んで総合得点を算出できます。',
    cta: '総合得点を計算する（1000点）',
  },
  tottori: {
    href: '/tottori/total-score',
    badge: '鳥取県の受験生向け',
    title: '鳥取県の総合得点（内申×α＋学力250）も計算する',
    description:
      '鳥取県は中3の内申65点を高校別の倍率α（2〜4）で130〜260点に拡大し、学力検査250点と合算します。志望校のαを選んで総合得点を算出できます。',
    cta: '総合得点を計算する',
  },
};

/**
 * SIBLING_TOOLS に個別エントリが無い県でも、total-score の計算機（第1層）／解説（第2層）があれば
 * 自動で内部リンクを生成する（孤立防止・県を足すたびに自動で繋がる）。
 */
function buildTotalScoreSibling(code: string): (typeof SIBLING_TOOLS)[string] | undefined {
  const calc = getTotalScoreSystem(code);
  if (calc) {
    return {
      href: `/${code}/total-score`,
      badge: `${calc.name}の受験生向け`,
      title: `${calc.name}の総合得点（合否の目安）も計算する`,
      description: `${calc.name}の公立高校入試の総合得点を、内申点と当日点から自動計算できます。志望校の合格ラインまでの距離を確認しましょう。`,
      cta: '総合得点を計算する',
    };
  }
  const exp = getExplainer(code);
  if (exp) {
    return {
      href: `/${code}/total-score`,
      badge: `${exp.name}の受験生向け`,
      title: `${exp.name}の総合得点・合否の仕組みを見る`,
      description: `${exp.name}は内申点と当日点を単純に足して合否が決まらない方式です。配点と「どう合否が決まるか」を一次情報に基づいて正確に解説しています。`,
      cta: '合否の仕組みを見る',
    };
  }
  return undefined;
}

/**
 * 高imp×低CTR県のタイトル/ディスクリプション個別最適化（GSC 2026-06-04 実測）。
 * 汎用テンプレ（"{県名}の内申点 自動計算ツール｜{満点}点満点…"）は順位pos6前後でもCTRが伸びない県があった：
 *   兵庫 2,036imp/CTR1.8%・福岡 608imp/1.5%・北海道 531imp/1.9%・熊本 300imp/1.0%。
 * 各県の「方式の特殊性」をcuriosity-gap＋具体数値でSERPに出して差別化する。
 * 数値は src/lib/prefectures.ts の確定データに一致（捏造なし）。掲載のない県は従来テンプレへフォールバック。
 */
const PREFECTURE_META_OVERRIDES: Record<string, { title: string; description: string }> = {
  hyogo: {
    title: '兵庫県の内申点 計算｜なぜ250点満点？5教科4倍・実技7.5倍を30秒で自動計算【2026】 | My Naishin',
    description:
      '【無料】兵庫県の内申点は5教科×4倍＋実技4教科×7.5倍の250点満点と全国屈指の特殊方式。手計算でミスしやすい換算を、9教科の評定を入れるだけで30秒で正確に算出。志望校ボーダー比較も対応。2026年度入試対応。',
  },
  fukuoka: {
    title: '福岡県の内申点 計算｜中3の成績だけで45点満点・実技も同等評価【2026】30秒で自動計算 | My Naishin',
    description:
      '【無料】福岡県の内申点は中3の9教科のみで45点満点。主要5教科と実技4教科が同じ重みで効くのがポイント。評定を入れるだけで30秒で算出し、志望校ボーダー比較・当日点の逆算にも対応。2026年度入試対応。',
  },
  hokkaido: {
    title: '北海道の内申点 計算｜中1から加点・315点満点とA〜Mランクを30秒で自動判定【2026】 | My Naishin',
    description:
      '【無料】北海道の内申点は中1・中2が2倍、中3が3倍の315点満点。さらにA〜Mの内申ランクで合否を判定します。評定を入れるだけで内申点とランクを30秒で自動算出。札幌南・北など主要校の目安と比較。2026年度入試対応。',
  },
  kumamoto: {
    title: '熊本県の内申点 計算｜中1から加算・中3は2倍の180点満点を30秒で自動計算【2026】 | My Naishin',
    description:
      '【無料】熊本県の内申点は中1・中2＋中3×2倍の180点満点。中1の成績から加算されるため早めの対策が重要です。評定を入れるだけで30秒で正確に算出し、志望校ボーダー比較にも対応。2026年度入試対応。',
  },
  kanagawa: {
    title: '神奈川県の内申点 計算｜中1は入らない！中2＋中3×2の135点満点を30秒で自動計算【2026】 | My Naishin',
    description:
      '【無料】神奈川県の内申点は中1を除き、中2＋中3×2倍の135点満点。中3の比重が2倍になるのが特徴です。9教科の評定を入れるだけで30秒で正確に算出し、S値や志望校ボーダー比較にも対応。2026年度入試対応。',
  },
  osaka: {
    title: '大阪府の内申点 計算｜中3だけ6倍の450点満点を30秒で自動計算【2026・タイプⅠ〜Ⅴ対応】 | My Naishin',
    description:
      '【無料】大阪府の内申点は中1・中2が2倍、中3が6倍の450点満点。中3の成績が圧倒的に重いのが特徴です。9教科の評定を入れるだけで30秒で算出し、選抜タイプⅠ〜Ⅴや志望校ボーダー比較にも対応。2026年度入試対応。',
  },
  ibaraki: {
    title: '茨城県の内申点 計算｜中1〜中3を等倍合計する135点満点を30秒で自動計算【2026】 | My Naishin',
    description:
      '【無料】茨城県の内申点は中1〜中3の9教科×5段階を等倍で合計した135点満点。中1から同じ重みで効くため早めの対策が重要です。評定を入れるだけで30秒で算出し、志望校ボーダー比較にも対応。2026年度入試対応。',
  },
  chiba: {
    title: '千葉県の内申点 計算｜素点135＋高校別K値（0.5〜2倍）を30秒で自動計算【2026】 | My Naishin',
    description:
      '【無料】千葉県の内申点は中1〜中3の9教科で素点135点。さらに高校ごとにK値（0.5〜2倍）で換算されるのが特徴です。9教科の評定を入れるだけで30秒で素内申を算出し、志望校ボーダー比較にも対応。2026年度入試対応。',
  },
};

export async function generateMetadata({ params }: PageProps) {
  const { prefecture: prefectureCode } = await params;
  const prefecture = getPrefectureByCode(prefectureCode);
  if (!prefecture) return {};

  // モバイルSERPの先頭に「{県名}の内申点 自動計算ツール」を front-load し、「内申点 計算」「内申点 自動計算」「{県名} 内申点」の主要クエリを冒頭で満たす。
  // 末尾ブランドは1回のみ（root layout の title.template は廃止済。二重「| My Naishin」防止）。descriptionは「無料」「30秒」「2026最新」を120字以内に圧縮。
  // 高imp×低CTR県は PREFECTURE_META_OVERRIDES で個別最適化（curiosity-gap）、それ以外は汎用テンプレ。
  const override = PREFECTURE_META_OVERRIDES[prefectureCode];
  const title =
    override?.title ??
    `${prefecture.name}の内申点 自動計算ツール｜${prefecture.maxScore}点満点・無料【2026年度入試対応】 | My Naishin`;
  const description =
    override?.description ??
    `【無料】${prefecture.name}の内申点を30秒で自動計算。9教科の評定を入れるだけで${prefecture.maxScore}点満点で瞬時に算出。実技倍率・対象学年・志望校ボーダー比較も対応。2026年最新版。`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://my-naishin.com/${prefectureCode}/naishin`,
    },
    openGraph: {
      title,
      description,
      url: `https://my-naishin.com/${prefectureCode}/naishin`,
    }
  };
}

function getFormulaExplanation(prefecture: { targetGrades: number[]; gradeMultipliers: Record<number, number>; practicalMultiplier: number; maxScore: number; coreMultiplier: number }) {
  const parts: string[] = [];
  prefecture.targetGrades.forEach(grade => {
    const multiplier = prefecture.gradeMultipliers[grade];
    if (multiplier > 0) {
      parts.push(`中${grade}${multiplier > 1 ? `×${multiplier}` : ''}`);
    }
  });
  let formula = parts.join(' ＋ ');
  if (prefecture.practicalMultiplier > prefecture.coreMultiplier) {
    formula += `（実技${prefecture.practicalMultiplier}倍）`;
  }
  return formula;
}

export default async function PrefectureNaishinPage({ params }: PageProps) {
  const { prefecture: prefectureCode } = await params;
  const prefecture = getPrefectureByCode(prefectureCode);

  if (!prefecture) {
    notFound();
  }

  const guide = getPrefectureGuide(prefectureCode);
  const formulaText = getFormulaExplanation(prefecture);
  const siblingTool = SIBLING_TOOLS[prefectureCode] ?? buildTotalScoreSibling(prefectureCode);

  // 構造化データのFAQ：PrefectureMinimumContent内で可視表示されているFAQと完全一致させる
  // （Googleは構造化データと可視テキストの一致を要求）
  const faqItems = generateDynamicFAQ(prefectureCode, prefecture);

  // 計算手順のHowTo構造化データ
  const howToSteps = [
    {
      name: '都道府県を選ぶ',
      text: `${prefecture.name}を選択して、${prefecture.name}専用の計算式に切り替えます。`
    },
    {
      name: '9教科の評定を入力',
      text: `中${prefecture.targetGrades.join('・')}の主要5教科と実技4教科の評定（1〜5）をスライダーで入力します。`
    },
    {
      name: '計算ボタンを押す',
      text: `${prefecture.name}方式の倍率（5教科×${prefecture.coreMultiplier}倍／実技×${prefecture.practicalMultiplier}倍）が自動適用され、${prefecture.maxScore}点満点で内申点が表示されます。`
    },
    {
      name: '志望校ボーダーと比較',
      text: '同ページの高校別ボーダーライン一覧と照らし合わせて、目標との差を確認します。'
    }
  ];

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '都道府県一覧', url: 'https://my-naishin.com/prefectures' },
          { name: `${prefecture.name}の内申点計算`, url: `https://my-naishin.com/${prefectureCode}/naishin` }
        ]}
      />
      <FAQPageSchema faqItems={faqItems} />
      <HowToSchema
        name={`${prefecture.name}の内申点を計算する方法`}
        description={`${prefecture.name}の公立高校入試で使われる${prefecture.maxScore}点満点の内申点を、9教科の評定から計算する手順。`}
        steps={howToSteps}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/prefectures" className="hover:text-blue-600">都道府県一覧</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">{prefecture.name}の内申点 計算サイト</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 md:text-3xl tracking-tight">
                  {prefecture.name}の内申点 計算サイト【2026年最新・無料】
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500 flex items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-600">{prefecture.region}</span>
                  <span>令和8年度（2026年度）入試対応済</span>
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="space-y-8">
            {/* 概要カード（E-E-A-T: 信頼の強調） */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                 <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                   <Shield className="h-3 w-3" />
                   公式PDF検証済
                 </div>
              </div>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
                <Info className="h-5 w-5 text-blue-500" />
                {prefecture.name}公立高校入試の内申制度
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {prefecture.name}の公立高校入試では、学力検査（当日点）とあわせて、中学校での成績を点数化した「内申点（調査書点）」が合否判定に大きく関わります。本ページは、{prefecture.name}に対応した<strong>内申点 計算 サイト</strong>として、{prefecture.name}教育委員会が発表する最新の選抜基準に基づき、9教科の評定からあなたの内申点を瞬時に算出します。会員登録・ダウンロード不要、スマホ・PCどちらでも30秒で完了します。
              </p>
              
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-4 text-center">
                  <div className="text-2xl font-black text-blue-700">{prefecture.maxScore}点</div>
                  <div className="mt-1 text-xs font-bold text-blue-600 uppercase tracking-wider">合計満点</div>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 text-center">
                  <div className="text-2xl font-black text-indigo-700">
                    中{prefecture.targetGrades.join('・')}
                  </div>
                  <div className="mt-1 text-xs font-bold text-indigo-600 uppercase tracking-wider">対象学年</div>
                </div>
                <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-4 text-center">
                  <div className="text-2xl font-black text-purple-700">
                    {prefecture.practicalMultiplier > prefecture.coreMultiplier ? `${prefecture.practicalMultiplier}倍` : '等倍'}
                  </div>
                  <div className="mt-1 text-xs font-bold text-purple-600 uppercase tracking-wider">実技教科</div>
                </div>
              </div>
            </section>

            {/* 埋め込み計算ツール */}
            <section id="calculator-section" className="scroll-mt-6">
              <InteractiveCalculator
                prefectureCode={prefectureCode}
                prefectureName={prefecture.name}
                maxScore={prefecture.maxScore}
              />
            </section>

            {/* 結果保存・名簿化（堀A）：47都道府県の内申ページ共通の名簿受け皿 */}
            <SaveResultCTA
              source="prefecture"
              prefectureCode={prefectureCode}
              prefectureName={prefecture.name}
              heading={`${prefecture.name}の内申点と「あと何点」を、忘れないうちに受け取りませんか？`}
              body="内申点アップのコツ・志望校の最新ボーダー・出願スケジュールを、受験本番まで無料でお届けします。LINEかメールで、いつでも解除できます。"
            />

            {/* 計算後・最高エンゲージ位置の Z会 CTA */}
            <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
              <div className="text-center">
                <div className="mb-2 text-sm font-bold text-slate-700">
                  内申点アップに通信教育という選択肢
                </div>
                <div className="mb-4 text-xs text-slate-500">
                  {prefecture.name}の高校入試に向けて、定期テスト対策と受験対策を両立
                </div>
                {/* Desktop: 728×90 */}
                <div className="hidden md:block">
                  <AffiliateAd id="zkai-banner" />
                </div>
                {/* Mobile: フルワイドCTAボタン */}
                <div className="md:hidden">
                  <div className="rounded-xl bg-white border border-blue-100 p-4 text-left">
                    <div className="mb-2 text-sm font-bold text-blue-900">
                      中学生のためのＺ会の通信教育
                    </div>
                    <div className="mb-3 text-xs text-blue-700 leading-relaxed">
                      テキスト＋添削で内申＋偏差値を伸ばす定番教材。
                    </div>
                    <AffiliateAd
                      id="zkai-text-request"
                      hideLabel
                      linkClassName="block w-full rounded-xl bg-blue-600 px-5 py-3.5 text-center text-base font-bold text-white shadow-md shadow-blue-500/30 active:bg-blue-700"
                    />
                    <div className="mt-2 text-center text-[10px] text-slate-400">[PR]</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 県専用の上位ツールへの誘導（高impの内申ページから page2 のS値/総合点/ランク判定ページへ評価を流す内部リンク） */}
            {siblingTool && (
              <section className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                  <Sparkles className="h-3 w-3" />
                  {siblingTool.badge}
                </div>
                <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
                    <Calculator className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-blue-900">{siblingTool.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-blue-800">{siblingTool.description}</p>
                  </div>
                  <Link
                    href={siblingTool.href}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                  >
                    {siblingTool.cta}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            )}

            {/* 高校別ボーダーライン一覧 */}
            <HighSchoolBorderlineTable prefectureCode={prefectureCode} prefectureName={prefecture.name} />

            {/* 志望校検討モードのユーザーへ：スタサプ */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    志望校レベルに合わせた学習を始める
                  </div>
                  <div className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {prefecture.name}の高校別ボーダーラインを見て志望校が見えてきたら、いまの学力との差を埋める準備を。スタディサプリ中学講座なら全教科のプロ講師の映像授業を月額料金で受けられます。
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  <AffiliateAd id="sapuri-banner-300" auditHide />
                </div>
              </div>
            </section>

            {/* 都道府県別詳細解説（SSRでGooglebotに情報を与える） */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800">
                <Target className="h-6 w-6 text-red-500" />
                {prefecture.name}入試を攻略する「内申」のポイント
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {/* 3行要約 */}
                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-5 border border-slate-100 shadow-inner">
                  <h3 className="mb-4 font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    この県の重要指標
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-100 text-[10px] font-black text-blue-600 grid place-items-center">1</div>
                      <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: guide.summary3lines.target }} />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-100 text-[10px] font-black text-blue-600 grid place-items-center">2</div>
                      <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: guide.summary3lines.practical }} />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-blue-100 text-[10px] font-black text-blue-600 grid place-items-center">3</div>
                      <p className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: guide.summary3lines.maxScore }} />
                    </div>
                  </div>
                </div>

                {/* 具体的な点数目安 */}
                <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg">
                  <h3 className="mb-4 font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-blue-100">
                    <FileText className="h-4 w-4" />
                    内申点（合計）の目安
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs text-blue-100">オール3の場合</span>
                      <span className="font-bold">{guide.examples.all3}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs text-blue-100">オール4の場合</span>
                      <span className="font-bold">{guide.examples.all4}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-100">実技を1つ上げると</span>
                      <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded text-white">{guide.examples.practicalPlus1}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-[10px] text-blue-200 leading-tight">
                    ※志望校のレベル（偏差値）により必要点数は大きく異なります。詳細は逆算ツールをご活用ください。
                  </p>
                </div>
              </div>

              {/* 注意点と罠 */}
              <div className="mt-8">
                <div className="mb-4 flex items-center gap-2">
                   <AlertCircle className="h-5 w-5 text-red-500" />
                   <h3 className="font-bold text-slate-800">{guide.pitfalls.title}</h3>
                </div>
                <div className="space-y-4">
                  {guide.pitfalls.items.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-red-50/30 border border-red-100/50">
                      <div className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 最低ライン・注意点・FAQを統合した詳細コンテンツ */}
            <PrefectureMinimumContent prefectureCode={prefectureCode} />

            {/* 根拠情報（一次情報へのリンクを強調） */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <BookOpen className="h-5 w-5 text-slate-500" />
                データの信頼性と算出根拠
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    当ツールの計算アルゴリズムは、{prefecture.name}教育委員会が公開する「令和8年度入学者選抜実施要綱」を当サイトの運営チーム（現役中学生エンジニア）が直接解析し、プログラム化したものです。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {prefecture.sourceUrl && (
                      <a 
                        href={prefecture.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        公式発表資料(1)を見る
                      </a>
                    )}
                    {prefecture.sourceUrl2 && (
                      <a 
                        href={prefecture.sourceUrl2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        公式発表資料(2)を見る
                      </a>
                    )}
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                    <Calculator className="h-3.5 w-3.5 text-blue-500" />
                    計算式
                  </div>
                  <code className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded block overflow-x-auto whitespace-nowrap">
                    {formulaText} ＝ {prefecture.maxScore}点満点
                  </code>
                  <p className="mt-2 text-[10px] text-slate-500">
                    ※端数処理や特別活動の加点等、学校独自の選抜基準については各校の募集要項を必ずご確認ください。
                  </p>
                </div>
              </div>
            </section>

            <TrustInfo />

            {/* 回遊性アップ：関連ブログ・地域リンク */}
            <div className="grid gap-6 md:grid-cols-2">
              <BlogRelatedArticles prefectureCode={prefectureCode} limit={4} />

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col">
                <h3 className="mb-4 text-lg font-bold text-slate-800">近隣都道府県の計算ツール</h3>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  {PREFECTURES
                    .filter(p => p.region === prefecture.region && p.code !== prefectureCode)
                    .slice(0, 6)
                    .map(p => (
                      <Link
                        key={p.code}
                        href={`/${p.code}/naishin`}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100"
                      >
                        {p.name}
                        <ChevronRight className="h-3 w-3 opacity-50" />
                      </Link>
                    ))}
                </div>
              </section>
            </div>

            {/* 次の一手・関連ツール（評価を稼ぎ頭の偏差値クラスタ／逆算へ循環） */}
            <RelatedToolsSection
              heading="次の一手・関連ツール"
              links={[
                { href: '/hensachi', title: '偏差値を計算する（5教科）', desc: '内申点とあわせて学力の立ち位置も把握' },
                { href: '/hensachi/shiboukou', title: '偏差値から行ける高校を見る', desc: '届く高校レベルを安全圏・実力相応・チャレンジで' },
                { href: '/reverse', title: '志望校から必要な当日点を逆算', desc: `${prefecture.name}の配点比率で「あと何点」を算出` },
                { href: '/hyotei-heikin', title: '評定平均を計算する', desc: '推薦・私立併願優遇で使う評定平均を確認' },
              ]}
            />

            {/* 学習方法の提案：通信教育・個別指導の選択肢 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-slate-800">学習方法を選ぶ</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                  <div className="mb-2 text-sm font-bold text-blue-900">難関校を狙うなら</div>
                  <p className="mb-3 text-xs text-blue-700 leading-relaxed">
                    トップ校を志望する場合、内申点だけでなく当日点の実力も鍵。Z会の通信教育は難関校受験対策で実績ある教材です。
                  </p>
                  <div className="text-sm">
                    <AffiliateAd id="zkai-text-advanced" hideLabel auditHide />（PR）
                  </div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <div className="mb-2 text-sm font-bold text-emerald-900">個別指導で内申を底上げ</div>
                  <p className="mb-3 text-xs text-emerald-700 leading-relaxed">
                    自宅でマンツーマンの個別指導を受けたいなら、ネット松陰塾の自立学習スタイルが選択肢になります。
                  </p>
                  <div className="flex justify-start">
                    <AffiliateAd id="shoin-banner" centered={false} auditHide />
                  </div>
                </div>
                <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
                  <div className="mb-2 text-sm font-bold text-sky-900">送迎不要のオンライン個別指導</div>
                  <p className="mb-3 text-xs text-sky-700 leading-relaxed">
                    先生1人に生徒2人まで。{prefecture.name}全域から受講できるオンライン個別指導塾です。
                  </p>
                  <AffiliateAd id="sora-juku-banner" auditHide />
                </div>
                {['tokyo', 'kanagawa', 'saitama', 'chiba', 'osaka'].includes(prefectureCode) && (
                  <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-4">
                    <div className="mb-2 text-sm font-bold text-orange-900">教室で学ぶ個別指導</div>
                    <p className="mb-3 text-xs text-orange-700 leading-relaxed">
                      {prefecture.name}内に教室がある<AffiliateAd id="morijuku-text" hideLabel />（PR）。先生1人に生徒2人までの個別指導で定期テスト対策。
                    </p>
                    <AffiliateAd id="morijuku-banner" auditHide />
                  </div>
                )}
              </div>
            </section>

            {/* 誤り報告フォーム */}
            <ErrorReportForm 
              prefectureCode={prefectureCode}
              prefectureName={prefecture.name}
            />
          </div>
        </div>
      </div>
    </>
  );
}
