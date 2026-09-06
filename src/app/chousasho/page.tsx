import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight, FileText, ListChecks, Scale, HelpCircle, PenLine, Calculator, NotebookPen } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AnswerBox } from '@/components/AnswerBox';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { ToolClusterNav } from '@/components/ToolClusterNav';
import { SITE_URL } from '@/lib/naishin-dataset';

const FAQS = [
  {
    question: '調査書と内申点の違いは何ですか？',
    answer:
      '調査書は中学校が作成して高校に提出する「書類そのもの」で、学習の記録（各教科の評定）・特別活動・行動の記録・出欠などが書かれています。そのうち「各教科の評定」を高校入試用に点数化したものが内申点（調査書点）です。つまり調査書は書類全体、内申点はその中の数値部分を指します。',
  },
  {
    question: '調査書には何が書かれますか？',
    answer:
      '主に①各教科の学習の記録（5段階の評定）②総合所見および指導上参考となる諸事項（特別活動・部活動・委員会・資格など）③行動の記録④出欠の記録、が記載されます。高校入試で点数化されるのは主に①の評定で、②〜④は参考資料として扱われることが多いです（扱いは都道府県・学校で異なります）。',
  },
  {
    question: '調査書はいつの成績が対象になりますか？',
    answer:
      '都道府県によって異なり、「中3のみ」「中2・中3」「中1〜中3の3年間」の3パターンに大きく分かれます。中1から対象になる地域では、1年生の成績から入試に影響します。お住まいの地域の対象学年は都道府県別ページで確認できます。',
  },
  {
    question: '調査書は誰がいつ書きますか？申請は必要ですか？',
    answer:
      '調査書は在籍する中学校（担任・進路指導の先生）が作成します。受験校が決まる中3の冬（出願前）に、生徒・保護者が学校へ「調査書の発行」を依頼するのが一般的です。私立の併願校ぶんも必要になるため、出願校数を早めに学校へ伝えておくとスムーズです。',
  },
  {
    question: '調査書の内容は自分で確認できますか？',
    answer:
      '評定（成績）は通知表で確認できますが、調査書そのものは原則として開封・閲覧できない形（厳封）で高校へ提出されます。気になる場合は三者面談などで先生に「今の評定」「記載される活動」を確認しておくと安心です。出欠や行動の記録も見られるため、日々の積み重ねが大切です。',
  },
];

export const metadata: Metadata = {
  title: '調査書とは？内申点との違い・記載内容・いつの成績かをわかりやすく解説 | My Naishin',
  description:
    '高校受験の「調査書」とは何かを、内申点との違い・記載内容（学習の記録/特別活動/行動の記録/出欠）・対象学年・誰がいつ書くかまで、当事者目線でわかりやすく解説。調査書の評定を点数化した「内申点（調査書点）」は、お住まいの都道府県の方式で無料計算できます。',
  keywords: ['調査書', '調査書とは', '調査書 内申点 違い', '調査書 記載内容', '調査書 高校受験', '内申書', '調査書 いつの成績', '調査書点'],
  alternates: { canonical: `${SITE_URL}/chousasho` },
  openGraph: {
    title: '調査書とは？内申点との違い・記載内容をわかりやすく解説 | My Naishin',
    description: '調査書の意味・内申点との違い・記載内容・対象学年を当事者目線で解説。内申点（調査書点）は都道府県別に無料計算。',
    url: `${SITE_URL}/chousasho`,
    type: 'website',
  },
};

const CONTENTS = [
  {
    icon: ListChecks,
    title: '調査書に書かれる4つの内容',
    items: [
      ['学習の記録（各教科の評定）', '9教科の5段階評定。入試で点数化される中心部分（＝内申点）。'],
      ['総合所見・特別活動の記録', '部活動・委員会・生徒会・ボランティア・資格・表彰など。'],
      ['行動の記録', '基本的な生活態度や責任感などの項目別の記録。'],
      ['出欠の記録', '欠席・遅刻の日数。理由が記載される場合もあります。'],
    ],
  },
];

export default function ChousashoPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: `${SITE_URL}/` },
          { name: '調査書とは', url: `${SITE_URL}/chousasho` },
        ]}
      />
      <FAQPageSchema faqItems={FAQS} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">調査書とは</span>
          </nav>

          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">調査書とは？</h1>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
              高校受験で中学校が作成・提出する「調査書」について、<strong>内申点との違い</strong>・<strong>記載内容</strong>・
              <strong>いつの成績が対象か</strong>を、当事者目線でわかりやすく整理しました。
            </p>
          </header>

          <AnswerBox question="調査書とは？内申点とどう違う？">
            <p>
              <strong>調査書</strong>は、中学校が作成して高校へ提出する書類そのものです。各教科の評定（5段階）・特別活動・行動の記録・出欠などが書かれています。
              このうち「各教科の評定」を高校入試用に点数化したものが<strong>内申点（調査書点）</strong>です。
              つまり<strong>調査書＝書類全体／内申点＝その中の数値部分</strong>。点数化の方法（満点・実技の倍率・対象学年）は都道府県で大きく異なります。
            </p>
          </AnswerBox>

          {/* 大学受験(学習成績の状況)との混同を避ける導線 */}
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            このページは<strong>高校受験（中学生）向け</strong>の調査書の解説です。
            大学受験の調査書（学習成績の状況）をシミュレーションしたい場合は
            <Link href="/hyotei-heikin/gakushu-seiseki/chousasho" className="font-bold underline">
              大学受験用の調査書シミュレーター
            </Link>
            をご利用ください。
          </div>

          {/* 記載内容 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <ListChecks className="h-5 w-5 text-blue-600" />
              調査書に書かれる内容
            </h2>
            <div className="space-y-3">
              {CONTENTS[0].items.map(([t, d]) => (
                <div key={t} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-sm font-bold text-slate-800">{t}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              ※ 入試で点数化される中心は「学習の記録（評定）」です。特別活動・行動・出欠の扱いは都道府県・学校で異なります。
            </p>
          </section>

          {/* 都道府県による記載事項の違い（一次ソース確認済みの実例のみ） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <NotebookPen className="h-5 w-5 text-blue-600" />
              調査書の記載事項は都道府県によって変わることがある
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-700">
              上記の4項目は全国共通の基本形（文部科学省 別紙様式1）ですが、実際の様式は教育委員会ごとに
              項目名や構成が異なることがあります。<strong>教育委員会が公式に公表している資料で確認できた
              実例</strong>のみ、以下に記載します（未確認の都道府県については記載しません）。
            </p>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">愛知県（令和9年度入試〜）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  「性別」「行動の記録」「出欠の記録」の3項目を削除。学習の記録（評定）の欄・内申点の
                  計算方法自体には変更なし。
                </p>
                <a href="https://www.pref.aichi.jp/soshiki/kotogakko/0000027366.html" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 愛知県教育委員会「調査書情報の変更点」（令和8年4月発行）
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">埼玉県（令和9年度入試〜）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  「特別活動等の記録」「出欠の記録」等を除き、学習の記録（9教科5段階の評定）を基本とする
                  形に整理。あわせて全受検生対象の面接と「自己評価資料」（採点はせず面接資料として使用）
                  を新設。学習の記録自体の項目・学年比率の仕組みには変更なし。
                </p>
                <a href="https://www.pref.saitama.lg.jp/documents/258788/news2024092601.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 埼玉県教育委員会「令和9年度埼玉県公立高等学校入学者選抜実施基本方針」（令和6年9月26日）
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">千葉県（令和8年度入試〜・既に実施済み）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  「総合的な学習の時間の記録」「出欠の記録」「行動の記録（第3学年）」「総合所見」の
                  4項目を削除。学習の記録（評定）・調査書点の算出方法自体には変更なし。
                </p>
                <a href="https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2024/koukou/r8kaizenten.html" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 千葉県教育委員会「千葉県公立高等学校入学者選抜の改善点について」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">東京都（様式10・令和8年度入試）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  「1 成績一覧表の番号・提出の有無」「2 学籍の記録」「3 各教科の学習の記録」
                  「4 総合的な学習の時間の内容及び評価」「5 諸活動の記録（特別活動等・ESAT-J結果）」
                  「6 海外帰国生徒対象等との併願」の6項目で構成。「行動の記録」「出欠の記録」
                  「総合所見」という項目名は単独では使われておらず、特別活動等の記録は
                  「諸活動の記録」に統合されています。
                </p>
                <a href="https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/20251201_tyousasho_sakusei" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 東京都教育委員会「令和8年度東京都立高等学校入学者選抜の調査書の作成について」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">大阪府（オンライン出願・令和8年度入試）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  紙の様式ではなく、中学校長が府教育委員会指定の「調査書作成ソフト」でデータを作成し
                  オンライン出願システムに登録する方式。「活動/行動の記録」欄は他県のような固定区分では
                  なく単一の自由記述欄で、「項目の立て方及び数については、特に定めていません」と
                  明記されています（学校ごとに項目を自由に設定）。
                </p>
                <a href="https://www.pref.osaka.lg.jp/documents/118149/40_r08_tebiki_tyousasyotou.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 大阪府教育委員会「調査書情報、成績一覧表及び推薦書情報（手引き）」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">神奈川県</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  学籍の記録・各教科の学習の記録・総合的な学習の時間の記録に加えて、「総合所見及び
                  諸活動の記録欄」の中に特別活動等の記録（学級活動・生徒会活動・学校行事等・部活動）と
                  「行動の記録及び所見欄」を持つ構成。東京都・大阪府とは異なり、「行動の記録」を
                  （所見と一体化した形で）独立した項目として保持しています。
                </p>
                <a href="https://www.pref.kanagawa.jp/documents/63604/14_chuui1.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 神奈川県教育委員会「調査書作成上の注意」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">福岡県（様式5）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  学籍の記録・各教科の学習の記録に加えて、特別活動の記録（生徒会活動等）、
                  「自主・自律」「創意工夫」「勤労・奉仕」「公共心・公徳心」「基本的な生活習慣」
                  といった行動面の評価区分、総合所見、そして「欠席日数」を明示的に持つ様式です。
                </p>
                <a href="https://www.pref.fukuoka.lg.jp/uploaded/attachment/268335.xls" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 福岡県教育委員会「調査書（様式５）」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">愛媛県（国の標準形にほぼ忠実）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  出欠の記録・各教科の学習の記録・総合的な学習の時間の記録・特別活動の記録
                  （学級活動/生徒会活動/学校行事）・行動の記録（基本的な生活習慣など10項目）・
                  総合所見という構成で、他県のような項目の削減・統合・自由記述化は見られず、
                  国の基本4区分をほぼそのまま保持しています。
                </p>
                <a href="https://ehime-kyoiku.esnet.ed.jp/file/2088" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 愛媛県教育委員会「県立高等学校入学志願者調査書」様式
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">北海道（個人調査書・別記様式3）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  学籍の記録・各教科の学習の記録・総合的な学習の時間の記録・特別活動の記録に加え、
                  「行動の記録」（基本的な生活習慣など10項目）は<strong>第3学年のみ</strong>を対象に
                  記載。出欠の記録は学年別の欠席日数だけでなく「欠席の主な理由」まで記載する欄を
                  持ち、確認した中で最も詳細な様式でした。
                </p>
                <a href="https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/2/5/1/0/0/9/0/_/01-3_R8%E3%80%90%E8%A8%98%E5%85%A5%E4%BE%8B%E3%80%91%E5%88%A5%E8%A8%98%E6%A7%98%E5%BC%8F3%20%E5%80%8B%E4%BA%BA%E8%AA%BF%E6%9F%BB%E6%9B%B8.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 北海道教育委員会「個人調査書（別記様式３）記入例」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">兵庫県（個人の調査書様式は非公開）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  公表されている様式集には、個人の調査書そのものの様式は含まれていません。
                  公開されているのは学校単位の評定人数分布表（様式1）と、評定判定が困難な
                  例外ケース用の書類（様式2）のみで、個人の調査書はオンラインシステムへの
                  直接入力で作成されるとみられます（大阪府と同系統の方式）。
                </p>
                <a href="https://www2.hyogo-c.ed.jp/hpe/koko/nyuushi/senbatsuyoukou_r8/" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 兵庫県教育委員会「入学者選抜要綱・様式集」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">長野県（最も簡素な構成）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  「各教科の学習の記録／総合的な学習の時間の記録／特別活動の記録（学級活動・
                  生徒会活動・学校行事）／総合所見及び特記事項」の構成で、「行動の記録」
                  「出欠の記録」に相当する独立項目は確認できませんでした。確認した中で
                  最も簡素な基本形です。
                </p>
                <a href="https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/r8_tyosasho_tebiki.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 長野県教育委員会「調査書作成の手引」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">京都府（「報告書」という呼び方）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  「調査書」ではなく「報告書」という名称を使います。特別活動の記録は独立項目に
                  せず総合所見に統合。特筆すべき点として、様式の注記に「授業日数、出席日数の
                  記載があっても入学者選抜には用いません」と明記されており、出欠情報は記録
                  されるものの選考には使わないと公式に宣言しています。
                </p>
                <a href="https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2025/12/01-R8yousiki1-1.xlsx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 京都府教育委員会「入学者選抜に関する諸様式（報告書等）」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">茨城県（部活動を独立項目に）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  各教科の学習の記録・総合的な学習の時間の記録・特別活動に関する事実及び所見・
                  欠席日数・その他の事項に加えて、<strong>「部活動・特技等の記録」を特別活動とは
                  別の独立項目</strong>としています。これまで確認した県の中では初めての区分方法です。
                </p>
                <a href="https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2025/11/b945a5295b800e8d45f790a23bf6eda9.xlsx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 茨城県教育委員会「調査書、成績及び諸活動等の記録通知書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">滋賀県（「個人調査報告書」＋独自項目）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  「各教科の学習の記録／総合的な学習の時間の記録／総合所見および特別活動等
                  （行動の記録は独立項目ではなく、特筆すべき点があれば総合所見内に任意で
                  記入する扱い）／卒業後の進路状況」という構成。「卒業後の進路状況」は
                  他県では確認できなかった滋賀県独自の項目です。
                </p>
                <a href="https://www.pref.shiga.lg.jp/file/attachment/5571771.xlsx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 滋賀県教育委員会「個人調査報告書（４号の１）」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">岐阜県（「学校内外における諸活動の記録」）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  A4縦1ページの構成で「学籍の記録／各教科の学習の記録／特別活動の記録（学級活動・
                  生徒会活動・学校行事）／学校内外における諸活動の記録／特記事項」となっています。
                  <strong>「学校内外における諸活動の記録」</strong>は他県では確認できなかった呼称で、
                  校内の部活動だけでなく校外活動もまとめて記載する設計とみられます。
                </p>
                <a href="https://www.pref.gifu.lg.jp/uploaded/attachment/504000.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 岐阜県教育委員会「調査書（別記第1号様式）」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">三重県（「健康の状況」欄・行動の記録は第3学年のみ）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  各教科の学習の記録・総合的な学習の時間の記録・特別活動の記録及び行動の記録
                  （基本的な生活習慣等10項目・十分満足できる項目に○印）に加えて、
                  「出欠・健康の記録」欄に欠席日数・欠席理由と並んで<strong>「健康の状況」</strong>
                  という欄が独立して存在します。<strong>行動の記録は第3学年のみが対象</strong>です。
                </p>
                <a href="https://www.pref.mie.lg.jp/common/content/001220075.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 三重県教育委員会「様式4　調査書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">奈良県（「行動の記録」が単独の項目）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  各教科の学習成績の表に続き、「学習活動の記録／特別活動の記録／行動の記録／
                  スポーツ・文化活動等の記録」という4段の欄が縦に並ぶ構成です。
                  <strong>「行動の記録」が総合所見や特別活動に統合されず単独の項目として存在する点</strong>、
                  部活動等に相当する項目が「スポーツ・文化活動等の記録」という名称である点が特徴的です。
                </p>
                <a href="https://www.pref.nara.lg.jp/documents/18782/b01_r8_tyosasyo.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 奈良県教育委員会「様式1（令和8年度入学志願者調査書）」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">和歌山県（「校内外の活動」を3欄に細分化）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  各教科等の学習の記録・総合的な学習の時間の記録・欠席等の状況・健康の状況に
                  関する特記事項・総合所見・特別活動に関する特記事項に加え、
                  <strong>「校内外の活動等に関する特記事項」を「部活動等」「ボランティア活動等」
                  「資格・特技等」の3つの独立した欄に細分化</strong>しています。これまで確認した
                  県の中では初めての区分方法です。
                </p>
                <a href="https://www.pref.wakayama.lg.jp/prefg/500200/d00220765_d/fil/tyousasyo_7gou.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 和歌山県教育委員会「別記第7号様式　調査書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">鳥取県（部分確認：旧形式ファイルのため詳細な配置は未確定）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  様式は旧形式のExcelファイル（.xls）で配布されており、記載項目に関する文字列として
                  「総合的な学習の時間の記録」「特別活動等の記録（学級活動・生徒会活動を含む）」
                  「体育・文化・奉仕活動等」に加え、国の指導要録標準10区分の一部と一致する
                  「思いやり・協力」「勤労・奉仕」等の文字列が確認できました。ただし正式な見出し名や
                  厳密な配置までは復元できていません。
                </p>
                <a href="https://www.pref.tottori.lg.jp/secure/1405973/R08_01_chousasyo_R04_03_ikousotsugyou.xls" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 鳥取県教育委員会「様式第１号　調査書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">島根県（「個人調査報告書」・オンライン入力方式）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  個人の調査書そのものの様式は公開されておらず、オンラインシステムへの直接入力で
                  作成されるとみられます（大阪府・兵庫県と同系統）。例外時に使う「校長副申書」の
                  文面から、島根県では個人の調査書を<strong>「個人調査報告書」</strong>と呼称し
                  （滋賀県と同じ呼称）、「学習の記録」「総合的な学習の時間の記録」「特別活動の記録」
                  の3種で構成されることが確認できました。
                </p>
                <a href="https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/index.data/yousiki_R8-16.docx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 島根県教育委員会「様式第16号　校長副申書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">岡山県（国の標準4区分＋「卒業後の動向」を併記）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  「学習の記録／総合的な学習の時間の記録／行動の記録（国の指導要録標準10区分）／
                  特別活動の記録」という国の標準4区分をすべて独立した見出しのまま保持しつつ、
                  「欠席日数・主な欠席理由」に加えて<strong>「卒業後の動向」</strong>まで併記する
                  構成です。これまで確認した県の中で最も国の標準形に近く、かつ充実した項目数です。
                </p>
                <a href="https://www.pref.okayama.jp/uploaded/attachment/398006.xlsx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 岡山県教育委員会「様式５　調査書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">広島県（部分確認：秋季入学選抜用の様式のみ）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  実施要項ページで「調査書」の語を含む独立様式として見つかったのは秋季入学のため
                  の選抜専用の様式（様式第15号）のみで、内容は「学習の記録」（各教科の評定表・
                  合計225点満点）のみで構成されていました。通常の一般選抜（春季入学）用の調査書が
                  同一様式かどうかは確認できていないため、この様式について確認できた事実のみを
                  記載しています。
                </p>
                <a href="https://www.pref.hiroshima.lg.jp/uploaded/attachment/597722.xlsx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 広島県教育委員会「様式第15号　調査書（秋季入学のための選抜）」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">山口県（「学習及び行動の記録集計表」を別文書化）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  個人の調査書そのものの様式は公開されていませんが、実施大綱に「選抜の資料」として
                  「調査書」とは別に<strong>「学習及び行動の記録集計表」</strong>という独立した書類が
                  明記されています。これまで確認した県の中では初めての二文書構成です。また、
                  「調査書の『学習の記録』と学力検査の成績は同等に取り扱う」との明記もありました。
                </p>
                <a href="https://www.pref.yamaguchi.lg.jp/uploaded/life/310448_591730_misc.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 山口県教育委員会「令和8年度山口県公立高等学校入学者選抜〈実施大綱〉」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">徳島県（国の標準区分＋出欠の記録を全て保持）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  「志願者・保護者の欄／出欠の記録／行動の記録／観点別学習状況／各教科の学習の
                  記録／特別活動の記録／総合的な学習の時間の記録／特記事項の欄」という8項目が
                  明記されており、国の指導要録標準4区分に加えて出欠の記録・特記事項の欄まで
                  全て独立項目のまま保持する構成です。評定が記載できない場合は校長が副申書
                  （様式第13号）を提出する規定もあります。
                </p>
                <a href="https://www.pref.tokushima.lg.jp/file/attachment/937096.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 徳島県教育委員会「公立高等学校生徒募集選抜要項」別記１
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">高知県（出欠の記録に「遅刻・早退を含む」と明記）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  各教科の学習の記録・特別活動の記録・行動の記録（国の指導要録標準10区分）・
                  総合的な学習の時間の記録・出欠の記録・総合所見という構成で、国の標準区分を
                  全て独立項目のまま保持しています。特に出欠の記録の特記事項欄に
                  <strong>「遅刻・早退を含む」</strong>と明記されている点は、これまで確認した
                  県の中で最も粒度の細かい記載でした。
                </p>
                <a href="https://www.pref.kochi.lg.jp/doc/r8_youshiki/file_contents/r8_youshiki_6-1-1.xlsx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 高知県教育委員会「様式第６号の１－１　調査書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">佐賀県（A4判1枚両面・「受検上配慮すべき事項」）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  A4判1枚の両面印刷という構成で、表面に出欠の記録・行動の記録（国の指導要録
                  標準10区分）・特別活動の記録・受検上配慮すべき事項・学校内外での活動等の記録、
                  裏面に各教科の学習の記録・総合的な学習の時間に関する記録を配置しています。
                  <strong>「受検上配慮すべき事項」という項目が独立して存在する点</strong>は、
                  これまで確認した県の中では初めてです。
                </p>
                <a href="https://www.pref.saga.lg.jp/kyouiku/kiji003115881/3_115881_367477_up_3yi7gn60.xlsx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 佐賀県教育委員会「様式３　調査書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">長崎県（各観点の「Aの数」を集計する欄）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  各教科の記録・総合的な学習の時間の記録・特別活動の記録・行動の記録（国の指導
                  要録標準10区分）・出欠の記録（欠席日数・欠席の主な理由・健康の状況）・参考と
                  なる諸事項という構成です。特に、各教科の観点別学習状況について
                  <strong>「知識・技能のAの数」「思考・判断・表現のAの数」「主体的に学習に
                  取り組む態度のAの数」</strong>という、3観点それぞれのA評価の個数を集計する
                  欄が設けられている点は、これまで確認した県の中では初めてです。
                </p>
                <a href="https://www.pref.nagasaki.jp/shared/uploads/2025/09/1757561092.xlsx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 長崎県教育委員会「（様式６－１）調査書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">熊本県（「健康の記録」を出欠と別欄に独立）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  総合的な学習の時間の記録・特別活動の記録・行動の記録・総合所見及び指導上参考と
                  なる諸事項に加えて、<strong>「健康の記録」が「出欠の記録」から完全に独立した
                  別の欄</strong>として存在します。これまで確認した県の多くは出欠と健康を1つの
                  欄にまとめており、区分方法としては初めてです。「編入学、転入学、転学・退学等の
                  記録」という項目も独立して存在します。
                </p>
                <a href="https://www.pref.kumamoto.jp/uploaded/life/244675_716277_misc.pdf" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 熊本県教育委員会「様式6　調査書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">大分県（A3判・健康の状況が独立項目）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  <strong>「日本産業規格A3」判という指定</strong>があり、これまで確認した25県で
                  A4判が主流だった中でA3判は初めてです。各教科等の学習の記録・特別活動の記録・
                  行動の記録（国の指導要録標準10区分）に加えて「健康の状況」が「出欠の記録」から
                  独立した項目である点は熊本県に次いで2例目の確認でした。
                </p>
                <a href="https://www.pref.oita.jp/uploaded/attachment/2254513.xlsx" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 大分県教育委員会「（様式９号）調査書」
                </a>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="font-bold text-slate-800">宮崎県（部分確認：遅刻・早退「年3回以上」の閾値）</div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  様式は旧形式のExcelファイル（.xls）で配布されており、記載項目に関する文字列
                  として「各教科の学習の記録」「行動の記録」「出欠の記録」「健康診断の記録」に
                  加えて、出欠の記録の注記に<strong>「遅刻・早退がそれぞれ年間3回以上ある場合は
                  その回数と理由を記入」</strong>という具体的な回数の閾値が確認できました。
                  ただし正式な見出し名や厳密な配置までは復元できていません。
                </p>
                <a href="https://www.pref.miyazaki.lg.jp/documents/99874/99874_20250930113553-1.zip" target="_blank" rel="noopener noreferrer nofollow" className="mt-1 inline-block text-xs text-blue-600 underline">
                  出典: 宮崎県教育委員会「様式２　調査書」
                </a>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              ※ いずれも記載事項（様式）の整理であり、入試の合否判定に使う内申点（調査書点）の
              計算方法自体は変更されていません。他の都道府県の最新の制度変更は
              <Link href="/nyushi-seido-henkou" className="font-bold underline">入試制度の変更点まとめ</Link>
              で確認できます。
            </p>
          </section>

          {/* 調査書 vs 内申点 vs 通知表 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Scale className="h-5 w-5 text-blue-600" />
              「調査書」「内申点」「通知表」の関係
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 text-left">
                    <th className="border border-slate-200 px-3 py-2 font-bold">用語</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold">何を指すか</th>
                    <th className="border border-slate-200 px-3 py-2 font-bold">誰が見る／使う</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">通知表</td>
                    <td className="border border-slate-200 px-3 py-2">学期ごとの成績表（評定・所見）。家庭で受け取る。</td>
                    <td className="border border-slate-200 px-3 py-2">生徒・保護者</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">調査書</td>
                    <td className="border border-slate-200 px-3 py-2">入試用に学校が作る書類（評定＋活動＋出欠など）。厳封で高校へ。</td>
                    <td className="border border-slate-200 px-3 py-2">高校（出願先）</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 px-3 py-2 font-bold">内申点（調査書点）</td>
                    <td className="border border-slate-200 px-3 py-2">調査書の評定を都道府県方式で点数化した数値。</td>
                    <td className="border border-slate-200 px-3 py-2">合否判定（学力検査と合算）</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              同じ「評定」が、家庭では通知表、入試では調査書という形になり、点数化されると内申点になります。素内申と換算内申の違いは
              <Link href="/blog/kansan-naishin-vs-su-naishin" className="font-bold text-blue-600 hover:underline">こちらの記事</Link>で図解しています。
            </p>
          </section>

          {/* 子ページ導線 */}
          <section className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/chousasho/kakikata" className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                <PenLine className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-bold text-slate-800 group-hover:text-blue-700">調査書の書き方・発行の流れ<ChevronRight className="h-4 w-4 text-slate-400" /></span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">いつ・誰に・どう依頼するか。出願校数の伝え方と注意点。</span>
              </span>
            </Link>
            <Link href="/chousasho/hyoutei" className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <Calculator className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-bold text-slate-800 group-hover:text-blue-700">調査書と内申点・評定平均の連動<ChevronRight className="h-4 w-4 text-slate-400" /></span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">評定→内申点→調査書点へ。総合得点での合否の仕組み。</span>
              </span>
            </Link>
            <Link href="/chousasho/reibun" className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md">
                <NotebookPen className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-bold text-slate-800 group-hover:text-blue-700">活動報告書の書き方例文・依頼マナー<ChevronRight className="h-4 w-4 text-slate-400" /></span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">部活動・検定・委員会別の例文と、先生への依頼マナー・期限チェックリスト。</span>
              </span>
            </Link>
          </section>

          {/* ツール導線 */}
          <section className="mt-8 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-slate-800">調査書の評定を「内申点」に換算してみる</h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              調査書の中心は各教科の評定です。お住まいの都道府県の方式で、評定を内申点（調査書点）に無料で換算できます。
            </p>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center">
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700">
                <Calculator className="h-4 w-4" />
                内申点を計算する（47都道府県対応）
              </Link>
              <Link href="/total-score" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 ring-1 ring-blue-200 transition-colors hover:bg-blue-50">
                総合得点（内申＋当日点）で合否を見る
              </Link>
            </div>
          </section>

          {/* 保護者リード（調査書＝三者面談・出願の文脈。家庭教師の無料体験＝live） */}
          <div className="mt-8">
            <ParentLeadCTA
              placement="mendan"
              heading="調査書（評定）で志望校に届くか、早めに見極めを"
              body="調査書の中心は日々の評定です。出願前に「今の成績で何が足りないか」を把握しておくと、三者面談や志望校選びが具体的になります。小中高対応のオンライン家庭教師の無料体験で、弱点を見える化できます（保護者の方向け・費用はかかりません）。"
            />
          </div>

          {/* FAQ */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              調査書 よくある質問
            </h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.question} className="group rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                  <summary className="cursor-pointer list-none text-sm font-bold text-slate-800">
                    <span className="flex items-center justify-between gap-3">
                      {f.question}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {/* 調査書の「次のステップ」（推薦＝調査書で勝負／不登校＝出欠の文脈） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">調査書の次のステップ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/suisen-nyuushi', title: '推薦入試とは？（調査書で勝負する入試）', desc: '指定校・公募・総合型の違いと、調査書・評定の準備' },
                { href: '/hyouka-kijun', title: '観点別評価の仕組み（評定がどう決まる）', desc: '3観点で何が評価され、調査書の評定になるか' },
                { href: '/futoukou', title: '不登校と内申点（出欠の記録と受験）', desc: '欠席日数は調査書にどう書かれ、合否にどう影響するか' },
                { href: '/mendan', title: '三者面談で調査書・評定を確認する', desc: '面談で聞くこと・今の評定の把握' },
              ].map((c) => (
                <Link key={c.href} href={c.href} className="group flex items-start justify-between gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md">
                  <span>
                    <span className="block text-sm font-bold text-slate-800 group-hover:text-blue-700">{c.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{c.desc}</span>
                  </span>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          </section>

          <ToolClusterNav current="naishin" className="mt-8" />
        </div>
      </div>
    </>
  );
}
