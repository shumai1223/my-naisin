import { ArrowRight, Check, ChevronRight, Github, Home } from '@/components/icons';
import Link from 'next/link';
import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { PREFECTURES } from '@/lib/prefectures';
import { CURRENT_FISCAL_YEAR, REIWA_YEAR_LABEL } from '@/lib/fiscal-year';

export const metadata: Metadata = {
  title: '編集長・開発者プロフィール | My Naishin',
  description: 'My Naishin（マイ内申）の開発者・ないしんパンダのプロフィール。2026年度受験を控える現役中学生エンジニアが、47都道府県の教育委員会資料を自ら解析し、正確な内申点計算ツールを開発・運営しています。',
};

export default function EditorProfilePage() {
  // 運営者「ないしんパンダ」の Person を ProfilePage として機械可読化。
  // @id は SiteSchema(founder) / BlogPostingSchema(author) と共有し、Googleに同一人物として統合させる。
  // これがサイト最大の差別化点「現役中学生エンジニアが執筆・開発」のE-E-A-T構造化の中核。
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      '@id': 'https://my-naishin.com/#person-shumai',
      name: 'ないしんパンダ',
      url: 'https://my-naishin.com/about/editor-profile',
      jobTitle: 'My Naishin 開発責任者 / 現役中学生エンジニア（2026年度受験生）',
      description:
        '2026年度高校受験を控える現役中学生のフルスタックエンジニア。全国47都道府県の教育委員会が発行する入学者選抜要綱（一次資料）を自ら解析し、内申点・評定平均・偏差値・志望校逆算の計算ツールを開発・運営している。当事者目線での正確性とわかりやすさを重視。',
      knowsAbout: [
        '高校受験',
        '内申点',
        '調査書点',
        '評定平均',
        '偏差値',
        '都道府県別 入試制度',
        'TypeScript',
        'Next.js',
      ],
      sameAs: ['https://github.com/shumai1223'],
      worksFor: {
        '@type': 'Organization',
        '@id': 'https://my-naishin.com/#organization',
        name: 'My Naishin',
        url: 'https://my-naishin.com',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '運営者情報', url: 'https://my-naishin.com/about' },
          { name: '開発者プロフィール', url: 'https://my-naishin.com/about/editor-profile' }
        ]}
      />

      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* パンくず */}
          <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/about" className="inline-flex min-h-[44px] items-center hover:text-brand-700 hover:underline">
              運営者情報
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900">開発者プロフィール</span>
          </nav>

          {/* ページの頭 */}
          <header>
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">ないしんパンダ</h1>
            <p className="mt-2 text-base text-slate-600">My Naishin 開発責任者 / 現役中学生エンジニア (2026年度受験生)</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                TypeScript / Next.js
              </span>
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                資料解析
              </span>
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                2026年度入試対応済
              </span>
            </div>

            <a
              href="https://github.com/shumai1223"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50"
            >
              <Github className="h-4 w-4" />
              @shumai1223
            </a>

            <dl className="mt-6 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
              <div className="px-3 py-4">
                <dt className="text-xs text-slate-600">都道府県解析</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{PREFECTURES.length}</dd>
              </div>
              <div className="px-3 py-4">
                <dt className="text-xs text-slate-600">一次資料準拠</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">100%</dd>
              </div>
              <div className="px-3 py-4">
                <dt className="text-xs text-slate-600">最新対応年度</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{CURRENT_FISCAL_YEAR}</dd>
              </div>
            </dl>
          </header>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">開発への想い</h2>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              「自分の本当の内申点は何点なんだろう？」<br />
              中学生にとって、高校受験のシステムはあまりにも複雑です。教育委員会のサイトを開いても、難解な言葉と巨大なPDFが並び、結局自分の立ち位置がわからないまま不安だけが募る。私自身がそうでした。
            </p>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              「それなら、自分が正確なツールを作ればいい」<br />
              そう考えて、{PREFECTURES.length}都道府県すべての入試要綱（{REIWA_YEAR_LABEL}最新版）を読み解き、1点1点の計算ロジックをプログラムに落とし込みました。
            </p>
            <div className="mt-6 rounded-lg border border-slate-200 bg-brand-50 p-4 md:p-5">
              <h3 className="text-[17px] font-bold text-slate-900">My Naishinの使命</h3>
              <p className="mt-2 text-base leading-[1.8] text-slate-900">
                単なる計算機ではなく、受験生が「あと何点取ればいいか」を正確に把握し、前向きに学習に取り組める環境を作ること。同じ受験生だからこそわかる「使いやすさ」と「情報の正確さ」を大切にしています。
              </p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">実績と信頼への取り組み</h2>
            <ul className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white px-5">
              <li className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">47都道府県の資料を解析</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  各教育委員会の一次情報を毎月巡回。制度変更や微細な計算ルールの変更（端数処理の桁数など）まで、すべてコードに反映させています。
                </p>
              </li>
              <li className="py-4">
                <h3 className="text-[17px] font-bold text-slate-900">継続的な改善</h3>
                <p className="mt-1 text-base leading-[1.8] text-slate-900">
                  公開から数ヶ月で多くの受験生・保護者・学校関係者にご利用いただいています。日々のフィードバックを元に、毎週のアップデートを継続しています。
                </p>
              </li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">検証プロセス</h2>
            <ul className="mt-4 space-y-1">
              <li className="flex items-center gap-2 text-base text-slate-900">
                <Check className="h-4 w-4 shrink-0 text-brand-700" /> 公式PDF直接ダウンロード
              </li>
              <li className="flex items-center gap-2 text-base text-slate-900">
                <Check className="h-4 w-4 shrink-0 text-brand-700" /> 数値アルゴリズムの自動テスト
              </li>
              <li className="flex items-center gap-2 text-base text-slate-900">
                <Check className="h-4 w-4 shrink-0 text-brand-700" /> 塾講師へのヒアリング
              </li>
            </ul>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              「My Naishin」のデータは、各教育委員会が発行するPDF（1県あたり平均50ページ超）を全て読み込み、計算ルールを抽出しています。
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-bold text-slate-900">経歴・資格</h2>
            <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              <div className="py-3">
                <dt className="text-base font-bold text-slate-900">フルスタック開発</dt>
                <dd className="text-sm text-slate-600">Next.js / Cloudflare Workers等</dd>
              </div>
            </dl>
          </section>

          {/* 姉妹サイト（R-7：2サイト共通化・運営者の一貫したブランドストーリー） */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">姉妹サイトについて</h2>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">
              高校受験の内申点・偏差値を扱うMy Naishinに加え、大学受験・進学費用を扱う姉妹サイト
              <a
                href="https://my-shingaku.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                My Shingaku
              </a>
              も同じ方針（公的な一次情報のみを根拠にした決定論的な計算エンジン）で運営しています。
            </p>
          </section>

          {/* Action */}
          <section className="mt-10 rounded-lg border border-slate-200 bg-brand-50 p-5 md:p-6">
            <h2 className="text-xl font-bold text-slate-900">正確な内申点を知ることから始めましょう</h2>
            <p className="mt-2 text-base leading-[1.8] text-slate-900">私が作成したアルゴリズムで、あなたの都道府県の正確な内申点を算出します。</p>
            <Link
              href="/prefectures"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
            >
              計算ツール一覧へ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
