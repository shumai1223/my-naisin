import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Calculator,
  BookOpen,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  MapPin,
  LineChart,
  MessageCircleQuestion,
  Wallet,
  FileText,
  ClipboardCheck,
  PenLine,
} from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { RelatedToolsSection } from '@/components/RelatedToolsSection';

const TOOLS_FAQS = [
  {
    question: '高校受験の計算ツールは無料で使えますか？登録は必要？',
    answer: 'すべて完全無料・会員登録不要で使えます。内申点（47都道府県対応）・偏差値（5教科）・評定平均・都立1020点総合得点・神奈川S値・志望校からの逆算まで、ブラウザだけでその場で計算できます。',
  },
  {
    question: 'どのツールから使えばいいですか？',
    answer: 'まず「内申点 計算サイト」で現在の内申点を確認し、次に「偏差値計算」で学力の立ち位置を把握、「偏差値→志望校レンジ逆引き」で届く高校のレベルを見て、「志望校から逆算」で当日に必要な点数を設定する流れがおすすめです。志望校が固まってきたら、都道府県専用ツール（S値・1020点・内申ランク）で精密に判定できます。',
  },
  {
    question: '内申点と偏差値はどう使い分ける？',
    answer: '内申点は通知表の評定を入試用に点数化したもの（地域で満点・比率が違う）、偏差値は模試での学力の位置を表す指標です。合否は「内申点＋当日点の合計」で決まるため、両方を把握するのが基本。内申比率の高い地域では内申点、当日点比率の高い地域では偏差値（学力）の優先度が上がります。',
  },
  {
    question: '都道府県専用の計算ツールはどの地域に対応していますか？',
    answer: '内申点計算は47都道府県すべてに対応しています。総合得点・合否の仕組みは「都道府県別 総合得点・合否の仕組み（全47県）」のページに全県分をまとめており、満点・配点・換算式が公文書で確認できる13県（東京1020点・神奈川S値・大阪・愛知・千葉・埼玉・福岡・北海道ランク・兵庫・京都・栃木・新潟・鳥取）は自動計算ツール、相関図・相関表など足し算で出ない県は仕組みの解説を用意しています。',
  },
];

export const metadata: Metadata = {
  // 親レイアウトの title.template による二重サフィックスを避けるため absolute で完全指定
  title: { absolute: '高校受験の計算ツール一覧｜内申点・偏差値・評定平均・S値【無料】 | My Naishin' },
  description:
    '【無料】高校受験に必要な計算ツールを全部まとめました。内申点（47都道府県対応）・偏差値（5教科）・評定平均・都立1020点総合得点・神奈川S値・大阪総合点・北海道内申ランク・志望校からの逆算まで、登録不要で使えます。2026年度入試対応。',
  keywords: [
    '高校受験 ツール',
    '内申点 ツール',
    '偏差値 計算 ツール',
    '評定平均 計算',
    'S値 計算',
    '内申ランク 計算',
    '当日点 逆算',
  ],
  alternates: { canonical: 'https://my-naishin.com/tools' },
  openGraph: {
    title: '高校受験の計算ツール一覧｜内申点・偏差値・評定平均・S値・総合得点【無料】',
    description:
      '内申点・偏差値・評定平均・S値・1020点総合得点・逆算まで、高校受験の計算ツールを無料でまとめて提供。',
    url: 'https://my-naishin.com/tools',
  },
};

// Tailwind JIT が解決できるよう、色クラスは静的にマップする（bg-${color} のような動的生成は使わない）
const COLOR: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
};

type Tool = {
  title: string;
  description: string;
  features: string[];
  href: string;
  icon: typeof Calculator;
  color: keyof typeof COLOR;
};

const TOOL_GROUPS: { id: string; heading: string; tools: Tool[] }[] = [
  {
    id: 'calculation',
    heading: '内申点・成績の計算ツール',
    tools: [
      {
        title: '内申点 計算サイト（全国47都道府県）',
        description: '9教科の評定を入れるだけで、お住まいの都道府県の方式で内申点を自動計算',
        features: ['47都道府県対応', '実技倍率・学年比対応', '志望校ボーダー比較', '計算結果の保存'],
        href: '/',
        icon: Calculator,
        color: 'blue',
      },
      {
        title: '偏差値計算サイト（5教科）',
        description: '点数・平均点・標準偏差から、中学生・高校生の偏差値を瞬時に算出',
        features: ['5教科対応', '教科別偏差値', '簡易/詳細モード', '高校レベル目安'],
        href: '/hensachi',
        icon: TrendingUp,
        color: 'purple',
      },
      {
        title: '偏差値診断（点数不要・5問）',
        description: '点数・平均点が分からなくても、5つの質問に答えるだけで偏差値の目安と届く高校レベルを診断',
        features: ['点数不要・5問だけ', '正規分布の数式で算出', '内申との整合性チェック', '次の一手へ直結'],
        href: '/hensachi/shindan',
        icon: TrendingUp,
        color: 'purple',
      },
      {
        title: '教科別の偏差値 計算（国数英理社）',
        description: '教科ごとの点数と平均点から、国語・数学・英語・理科・社会の偏差値を個別に算出',
        features: ['教科別に算出', '5教科／3教科', '苦手教科を特定', '教科別の上げ方'],
        href: '/hensachi/kyoka-betsu',
        icon: TrendingUp,
        color: 'purple',
      },
      {
        title: '評定平均 自動計算',
        description: '通知表の評定から評定平均（4.2など）と素内申を同時に算出',
        features: ['9教科対応', 'クリック入力', '評定平均＋内申点を同時表示', '推薦入試の出願目安'],
        href: '/hyotei-heikin',
        icon: Calculator,
        color: 'green',
      },
      {
        title: '成績の記録ダッシュボード（推移グラフ）',
        description: '計算した内申点を保存して、中1→中3の伸びを推移グラフで見える化',
        features: ['中1→中3トラッキング', '学期ごとの記録', '目標ラインまでの差', '三者面談用PDF'],
        href: '/dashboard',
        icon: LineChart,
        color: 'orange',
      },
      {
        title: '高校入試 倍率計算（志願倍率・実質倍率）',
        description: '募集人員・志願者数（または受験者数・合格者数）から、志願倍率・実質倍率を計算',
        features: ['志願倍率＝志願者数÷募集人員', '実質倍率＝受験者数÷合格者数', '違いの解説つき'],
        href: '/koukou-bairitsu',
        icon: Calculator,
        color: 'blue',
      },
    ],
  },
  {
    id: 'prefecture',
    heading: '都道府県専用の合否判定ツール',
    tools: [
      {
        title: '都道府県別 総合得点・合否の仕組み（全47県）',
        description: '47都道府県の総合得点の計算方法・合否の決まり方を一覧から確認。計算できる県は自動計算ツール付き',
        features: ['全47都道府県', '計算機13県＋解説34県', '相関図・相関表も解説', '令和8年度対応'],
        href: '/total-score',
        icon: MapPin,
        color: 'blue',
      },
      {
        title: '都立高校 総合得点 計算（1020点満点）',
        description: '学力検査700点＋調査書点300点＋ESAT-J 20点の総合得点を一括算出',
        features: ['1020点満点対応', 'ESAT-J対応', '主要都立の合格目安', '2026年度対応'],
        href: '/tokyo/total-score',
        icon: Target,
        color: 'blue',
      },
      {
        title: '神奈川県 S値 自動計算（S1・S2／1000点）',
        description: '内申・学力検査・特色検査を志望校比率で合算したS値を算出',
        features: ['S1値・S2値対応', '志望校比率（4:6〜2:8）', '特色検査対応', '横浜翠嵐・湘南の目安'],
        href: '/kanagawa/s-value',
        icon: Target,
        color: 'rose',
      },
      {
        title: '大阪府 公立高校 総合点（タイプⅠ〜Ⅴ）',
        description: '学力検査450点・調査書450点を選抜タイプ比率で合算した総合点を算出',
        features: ['タイプⅠ〜Ⅴ対応', '7:3〜3:7比率', '北野・茨木・天王寺の目安', '2026年度対応'],
        href: '/osaka/total-score',
        icon: Target,
        color: 'rose',
      },
      {
        title: '北海道 内申ランク（A〜M）判定',
        description: '内申点315点・学力検査300点からA〜M 13ランクのどこに該当するか判定',
        features: ['A〜M 13ランク', '内申315点満点', '札幌南・札幌北の目安', '2026年度対応'],
        href: '/hokkaido/rank',
        icon: MapPin,
        color: 'rose',
      },
      {
        title: '愛知県 評価方法Ⅰ〜Ⅴ・総合得点',
        description: '内申点（評定得点90）＋学力検査（110）を評価方法Ⅰ〜Ⅴで重み付けする校内順位を解説',
        features: ['評価方法Ⅰ〜Ⅴ', '内申90＋当日110', '評定得点 換算表', '計算例つき'],
        href: '/aichi/total-score',
        icon: Target,
        color: 'rose',
      },
      {
        title: '千葉県 調査書点・K値 計算',
        description: '学力500＋評定135×係数K（0.5〜2）＋学校設定検査。K値早見表で調査書点を確認',
        features: ['K値0.5〜2対応', '評定×K 早見表', '学校設定検査', '計算例つき'],
        href: '/chiba/total-score',
        icon: Target,
        color: 'green',
      },
      {
        title: '埼玉県 調査書点・学年比率 計算',
        description: '学力500＋中1〜3の評定を学年比率（1:1:2など）で重み付けする調査書点を解説',
        features: ['学年比率対応', '各学年の比重（%）', '第1次/第2次選抜', '計算例つき'],
        href: '/saitama/total-score',
        icon: Target,
        color: 'purple',
      },
      {
        title: '福岡県 内申点（中3のみ45）・当日点',
        description: '内申（中3の9教科45点）＋学力検査（5教科×60＝300点）のA群・B群判定を解説',
        features: ['内申45点（中3のみ）', '学力300点', 'A群・B群', '早見表つき'],
        href: '/fukuoka/total-score',
        icon: Target,
        color: 'blue',
      },
    ],
  },
  {
    id: 'planning',
    heading: '逆算・比較で受験戦略を立てる',
    tools: [
      {
        title: '偏差値→志望校レンジ逆引き',
        description: '偏差値を入れるだけで、届く高校レベルを安全圏・実力相応・チャレンジの3段階で表示',
        features: ['偏差値から逆引き', '3段階レンジ', '偏差値↔内申の並置', '高校レベル目安'],
        href: '/hensachi/shiboukou',
        icon: Target,
        color: 'purple',
      },
      {
        title: '志望校から逆算ツール',
        description: '志望校の合格基準点と内申点から、当日に必要な学力検査の点数を逆算',
        features: ['志望校対応', '配点比率対応', '当日点を逆算', '学習計画立案'],
        href: '/reverse',
        icon: Target,
        color: 'purple',
      },
      {
        title: '都道府県の内申制度 比較',
        description: '満点・対象学年・実技倍率など、都道府県ごとの内申制度を比較・検討',
        features: ['複数県比較', '制度の違いを可視化', '転居・進路検討に', '一次情報ベース'],
        href: '/comparison',
        icon: TrendingUp,
        color: 'green',
      },
      {
        title: '塾診断（結果に合う塾を無料診断）',
        description: '県・学年・目標との差・希望形態・状況から、お子さまに合う塾・家庭教師を診断',
        features: ['提携中の塾から診断', 'オンライン/対面で選ぶ', '難関・不登校にも対応', '無料体験・無料相談のみ'],
        href: '/juku-shindan',
        icon: Target,
        color: 'orange',
      },
      {
        title: '内申点の日本地図（都道府県別データマップ）',
        description: '実技傾斜・中3の重み・満点を、色分けされた日本地図で47都道府県一目比較',
        features: ['3指標を切替表示', 'タップで県別解説へ', '都道府県境の形で表示', '全件を表でも確認可'],
        href: '/naishin-map',
        icon: MapPin,
        color: 'purple',
      },
    ],
  },
  {
    id: 'money',
    heading: '費用・お金の計算（保護者向け）',
    tools: [
      {
        title: '教育費シミュレーター（中学〜高校卒業）',
        description: '現在の学年・進路・塾の形態から、高校卒業までの教育費総額を内訳つきで概算',
        features: ['中学残り＋高校3年＋塾代', '公立・私立で比較', '文科省データ準拠', '大学費用の目安も'],
        href: '/kyouiku-hi',
        icon: Wallet,
        color: 'green',
      },
      {
        title: '高校〜大学の教育費（進路別シミュレーター）',
        description: '高校・世帯年収・大学（国公立/私立）・自宅か下宿かから、卒業までの総額を就学支援金込みで概算',
        features: ['高校3年＋大学4年の総額', '自宅/下宿の差を反映', '就学支援金で実質負担', '日本政策金融公庫データ'],
        href: '/shinro-hiyou',
        icon: Wallet,
        color: 'blue',
      },
      {
        title: '高校の費用シミュレーター',
        description: '公立・私立の高校3年間にかかる学費・教材費・通学費の総額を試算',
        features: ['公立 約165万円', '私立 約340万円', '入学準備費も調整', '就学支援金考慮'],
        href: '/koukou-hiyou',
        icon: Wallet,
        color: 'blue',
      },
      {
        title: '塾代シミュレーター（相場・総額）',
        description: '集団塾・個別指導・家庭教師の月謝相場と、受験までの総額の目安を試算',
        features: ['形態別の月謝相場', '季節講習費込み', '3年間の総額', '抑えるコツ'],
        href: '/juku-hiyou',
        icon: Wallet,
        color: 'orange',
      },
      {
        title: '家庭教師の比較（訪問・オンライン・個別指導塾）',
        description: '訪問型・オンライン家庭教師・個別指導塾の違いと料金相場、選び方を比較',
        features: ['訪問/オンラインの違い', '料金相場を形態別に', '個別指導塾との比較', '選び方のポイント'],
        href: '/katei-kyoshi',
        icon: Wallet,
        color: 'rose',
      },
      {
        title: '高校無償化・就学支援金ガイド',
        description: '公立・私立別の支援額、世帯年収の目安、奨学給付金・大学の奨学金まで解説',
        features: ['年収区分で支援額', '私立 上限39.6万円', '奨学給付金', '大学の奨学金'],
        href: '/shougakukin',
        icon: Wallet,
        color: 'green',
      },
    ],
  },
  {
    id: 'guide',
    heading: '基礎から学ぶガイド',
    tools: [
      {
        title: '内申点クイックアンサー（質問する）',
        description: '「兵庫県は何点満点？」などの疑問に、47都道府県の検証済みデータで即回答',
        features: ['47都道府県対応', 'オール3/4/5の確定値', '満点・対象学年・倍率', '出典つき'],
        href: '/ask',
        icon: MessageCircleQuestion,
        color: 'green',
      },
      {
        title: '内申点の上げ方（4軸＋学年別）',
        description: '定期テスト・提出物・授業態度・実技の4軸で内申点を上げる方法。中1/中2/中3の学年別にやることも',
        features: ['3観点に基づく4軸', '今日からの行動リスト', '中1/中2/中3で分岐', '実技の倍率に注意'],
        href: '/naishin-age-kata',
        icon: TrendingUp,
        color: 'blue',
      },
      {
        title: 'オール3・4・5の内申点は何点？',
        description: '9教科すべてが同じ評定だった場合の内申点を、47都道府県の計算方式で実際に計算した例を一覧で確認',
        features: ['オール3/4/5の3パターン', '47都道府県すべて掲載', '主要都道府県は優先表示', '自分の内申点計算へ直結'],
        href: '/naishin-oru',
        icon: Calculator,
        color: 'blue',
      },
      {
        title: '観点別評価の仕組み（3観点）',
        description: '知識・技能／思考・判断・表現／主体的に取り組む態度の3観点で、評定がどう決まるかを文科省の一次情報で解説',
        features: ['3観点で何が評価されるか', '評定への総括', '主体的態度の評価', '実技が響く理由'],
        href: '/hyouka-kijun',
        icon: BookOpen,
        color: 'green',
      },
      {
        title: '実技4教科の内申点対策',
        description: '音楽・美術・保健体育・技術家庭で評定を上げる方法。多くの地域で実技は加重され合否への影響大',
        features: ['教科別の上げ方', '加重（倍率）に注意', '技能が苦手でも評定UP', '提出物・作品の質'],
        href: '/jitsugika',
        icon: BookOpen,
        color: 'rose',
      },
      {
        title: '推薦入試とは（指定校・総合型の違い）',
        description: '指定校推薦・公募推薦・総合型選抜の違い、必要な評定平均、調査書の準備までを一気に整理',
        features: ['3種類の違い', '必要な評定平均', '調査書の準備', '高校・大学とも対応'],
        href: '/suisen-nyuushi',
        icon: BookOpen,
        color: 'orange',
      },
      {
        title: '不登校と内申点（高校受験はできる？）',
        description: '不登校でも高校受験はできる。内申点・欠席日数・調査書への影響と、当日点で届く道・通信制という選択肢',
        features: ['内申点はどうなるか', '欠席日数と調査書', '当日点重視の区分', '通信制・出席扱い'],
        href: '/futoukou',
        icon: BookOpen,
        color: 'rose',
      },
      {
        title: '偏差値の出し方・上げ方・見方',
        description: '偏差値の計算方法、偏差値50＝上位何%という見方、1か月で効率よく上げるコツを解説',
        features: ['計算式の使い方', '上位%・順位の早見表', '苦手教科から上げる', '1か月の上げ方'],
        href: '/hensachi/agekata',
        icon: TrendingUp,
        color: 'purple',
      },
      {
        title: '推薦に必要な評定平均 早見表',
        description: '高校推薦・私立併願優遇・大学の指定校/総合型選抜で必要な評定平均の目安を一覧化',
        features: ['高校・大学の基準', '併願優遇の最低基準', '指定校の目安', '出し方・上げ方'],
        href: '/hyotei-heikin/suisen-kijun',
        icon: BookOpen,
        color: 'green',
      },
      {
        title: '評定平均の逆算計算機',
        description: '目標の評定平均に届かせるには、残りの学期・教科で平均いくつ取ればよいかを逆算',
        features: ['現在の平均から逆算', '残り回数を入力', 'プリセット目標(3.5〜5.0)', '推薦・総合型選抜に'],
        href: '/hyotei-heikin/gyakusan',
        icon: Target,
        color: 'purple',
      },
      {
        title: '内申点ガイド（完全解説）',
        description: '内申点の仕組み・計算方法・上げ方までまとめて解説',
        features: ['基礎解説', '都道府県別の違い', 'よくある質問', '対策方法'],
        href: '/blog/naishin-guide',
        icon: BookOpen,
        color: 'orange',
      },
      {
        title: '高校受験の年間スケジュール（中3）',
        description: '4月〜3月に「いつ何をするか」を月別に解説。内申確定・三者面談・出願の流れが分かる',
        features: ['月別やること', '内申が決まる時期', '三者面談 7月/12月', '出願・入試の流れ'],
        href: '/juken-schedule',
        icon: BookOpen,
        color: 'blue',
      },
      {
        title: '出願倍率の読み方',
        description: '中間発表と確定倍率の違い、志願変更の一般的な仕組み、倍率をどう受け止めればいいかを解説',
        features: ['中間発表と確定倍率の違い', '志願変更の一般的な仕組み', '倍率だけで判断しない考え方', 'よくある質問'],
        href: '/koukou-bairitsu/yomikata',
        icon: LineChart,
        color: 'blue',
      },
      {
        title: '受験当日の持ち物・タイムライン',
        description: '当日の持ち物チェックリスト、前日から試験終了までの一般的な流れ、遅刻・忘れ物への対応',
        features: ['持ち物チェックリスト', '当日のタイムライン', 'トラブル対応', '一般選抜向け'],
        href: '/juken-toujitsu',
        icon: ClipboardCheck,
        color: 'blue',
      },
      {
        title: '自己採点のやり方',
        description: '学力検査後の自己採点を5ステップで解説。自己採点した得点から総合得点の目安を確認する方法まで',
        features: ['自己採点の5ステップ', '記述式の部分点の考え方', '総合得点ツールへ直結', '一般選抜向け'],
        href: '/jikosaiten',
        icon: PenLine,
        color: 'blue',
      },
      {
        title: '合格発表後の手続き',
        description: '合格発表後にやることを一般的な流れで解説。入学手続き・私立辞退の流れ・入学準備のチェックリスト',
        features: ['入学手続きの一般的な流れ', '私立併願校の辞退手続き', '二次募集の考え方', '入学準備チェック'],
        href: '/goukaku-happyo',
        icon: ClipboardCheck,
        color: 'blue',
      },
      {
        title: '学校推薦型・総合型選抜の出願準備チェックリスト',
        description: '出願までの一般的な準備タイムラインと必要書類の一覧。大学個別の基準は書かず制度の一般論のみ',
        features: ['高1からのタイムライン', '必要書類チェックリスト', '調査書・志望理由書', '推薦/総合型 両対応'],
        href: '/shutsugan-junbi',
        icon: BookOpen,
        color: 'purple',
      },
      {
        title: '志望理由書の書き方・構成',
        description: '志望理由書の一般的な構成5要素と、テーマ決めから清書までの書き方の手順を解説',
        features: ['構成5要素', 'テーマの決め方', '5STEPの書き方', 'よくある失敗パターン'],
        href: '/shutsugan-junbi/shibou-riyuusho',
        icon: FileText,
        color: 'rose',
      },
      {
        title: '47都道府県の入試制度ページ',
        description: '各都道府県の内申点方式・専用計算ツールへの入口',
        features: ['47都道府県', '県別の計算式', '高校ボーダー', '出典リンク付き'],
        href: '/prefectures',
        icon: MapPin,
        color: 'blue',
      },
    ],
  },
];

const ALL_TOOLS = TOOL_GROUPS.flatMap((g) => g.tools);

export default function ToolsPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '高校受験の計算ツール一覧（My Naishin）',
    numberOfItems: ALL_TOOLS.length,
    itemListElement: ALL_TOOLS.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tool.title,
      url: `https://my-naishin.com${tool.href === '/' ? '' : tool.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: 'ツール一覧', url: 'https://my-naishin.com/tools' },
        ]}
      />
      <FAQPageSchema faqItems={TOOLS_FAQS} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          {/* ヒーローセクション */}
          <section className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-bold text-slate-800 md:text-4xl">
              高校受験の計算ツール一覧【無料】
            </h1>
            <p className="mx-auto max-w-2xl text-base text-slate-600 md:text-lg">
              内申点・偏差値・評定平均・S値・1020点総合得点・志望校からの逆算まで。
              高校入試で必要な計算を、会員登録なし・すべて無料で行えます。
            </p>
          </section>

          {/* ツール一覧（カテゴリ別セクション＝内部リンクハブ） */}
          {TOOL_GROUPS.map((group) => (
            <section key={group.id} className="mb-10">
              <h2 className="mb-4 border-l-4 border-blue-500 pl-3 text-xl font-bold text-slate-800">
                {group.heading}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {group.tools.map((tool) => {
                  const Icon = tool.icon;
                  const c = COLOR[tool.color];
                  return (
                    <div
                      key={tool.href + tool.title}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className={`rounded-xl ${c.bg} p-3`}>
                          <Icon className={`h-6 w-6 ${c.text}`} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-800">{tool.title}</h3>
                          <p className="mt-0.5 text-sm text-slate-600">{tool.description}</p>
                        </div>
                      </div>

                      <div className="mb-5 grid grid-cols-2 gap-1.5">
                        {tool.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={tool.href}
                        className="mt-auto inline-flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                      >
                        ツールを使う
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* ツール後の次の一歩：2026-07 AdSense撤退＝アフィリ一本化に伴い、EV最小のスタサプ/e点の
              表示バナー（推定EV ¥5〜9/click）を撤去し、EVの高い全国オンライン個別の無料体験へ一本化。 */}
          <section className="mb-10 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white px-6 py-6 text-center shadow-sm">
            <div className="mb-1 text-sm font-bold text-slate-800">
              ツールを使ったあとの「次の一歩」
            </div>
            <div className="mb-4 text-xs leading-relaxed text-slate-600">
              現状把握ができたら、次は「足りない分をどう埋めるか」。全国オンライン対応のAI個別指導の無料体験で、お子さまにいま必要な対策を具体的に確認できます（費用はかかりません）。
            </div>
            <AffiliateAd
              id="atama-text"
              hideLabel
              ctaText="無料体験で弱点と対策を確認する"
              trackView
              viewPlacement="tools"
              linkClassName="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700 sm:w-auto"
            />
            <div className="mt-2 text-[11px] text-slate-500">【atama＋ オンライン塾】の無料体験（PR）</div>
          </section>

          {/* 使い方ガイド */}
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-8">
            <h2 className="mb-4 text-2xl font-bold text-blue-800">ツールの使い方ガイド</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-blue-700">はじめての方へ</h3>
                <ol className="space-y-2 text-sm text-blue-700">
                  <li>1. まず「内申点ガイド」で基本を学ぶ</li>
                  <li>2. 「内申点 計算サイト」で現在の内申点を確認</li>
                  <li>3. 「偏差値計算」で学力の立ち位置を把握</li>
                  <li>4. 「逆算ツール」で目標と当日点を設定</li>
                </ol>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-blue-700">志望校が決まってきたら</h3>
                <ol className="space-y-2 text-sm text-blue-700">
                  <li>1. 都道府県専用ツール（S値・1020点・ランク）で精密に判定</li>
                  <li>2. 学年ごとの目標評定を設定</li>
                  <li>3. 実技と主要教科のバランスを最適化</li>
                  <li>4. 志望校の入試方式に合わせて対策</li>
                </ol>
              </div>
            </div>
          </section>

          {/* FAQ（検索意図の網羅で順位を底上げ＋AI引用資産） */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-800">よくある質問</h2>
            <div className="space-y-4">
              {TOOLS_FAQS.map((f) => (
                <div key={f.question} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="mb-1 text-sm font-bold text-slate-800">Q. {f.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A. {f.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* サイト運営者向け：埋め込みウィジェット導線 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-800">ブログ・サイト運営者の方へ</h2>
                <p className="mt-1 text-sm text-slate-600">
                  内申点・評定平均の計算ツールを、あなたのサイトに無料で埋め込めます（コピペで設置）。
                </p>
              </div>
              <Link
                href="/embed"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
              >
                埋め込みコードを取得
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* 次の一手・関連 */}
          <RelatedToolsSection
            className="mt-8"
            links={[
              { href: '/hogosha', title: '保護者の方へ', desc: '塾はいつから・費用の目安・内申の上げ方を保護者向けに解説' },
              { href: '/guide', title: '高校受験の進め方ガイド', desc: '内申点・偏差値・出願までの全体像' },
              { href: '/prefectures', title: '47都道府県の内申点ページ', desc: 'お住まいの地域の方式で正確に計算' },
              { href: '/developers', title: 'データAPI / MCP（開発者・AI向け）', desc: '内申点の一次データを機械可読で提供' },
              { href: '/for-teachers', title: '先生・進路指導のご担当者様へ', desc: '三者面談・授業配布・学校サイトへの埋め込みでの活用方法' },
              { href: 'https://my-shingaku.com', title: '大学進学の費用（姉妹サイト）', desc: '一人暮らし・学費・奨学金の目安（My Shingaku）', external: true },
            ]}
          />
        </div>
      </div>
    </>
  );
}
