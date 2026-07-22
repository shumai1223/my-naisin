import Link from 'next/link';
import { notFound } from 'next/navigation';
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
import { PrintButton } from '@/components/PrintButton';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

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
  },
  aichi: {
    title: '愛知県の注意点',
    items: [
      '中3の成績のみが対象（中1・中2は含まれない）',
      '評定合計（45点満点）を2倍した評定得点（90点満点）で計算',
      '評定得点と学力検査点の合算比率は「評価方法Ⅰ〜Ⅴ」から高校が選択（等倍〜2倍）',
      '同じ評定得点でも志望校の評価方法によって総合得点への反映度が変わる',
      '実技4教科も主要5教科と同じ倍率で扱われる（傾斜なし）'
    ]
  },
  fukuoka: {
    title: '福岡県の注意点',
    items: [
      '中3の成績のみが対象（45点満点）で中1・中2は合否判定に反映されない',
      '内申点45点＋学力検査300点＝345点満点',
      '学力・内申の両方の順位が合格圏内の受験生を先に選ぶ「A群」がある',
      'A群で決まらなかった枠は総合判断の「B群」で選抜される',
      '単純な合計点の高い順に合否が決まる一律の方式ではない'
    ]
  },
  hokkaido: {
    title: '北海道の注意点',
    items: [
      '中1・中2は2倍、中3は3倍で計算（315点満点）',
      '内申点は素点のまま使わず、20点刻みでA〜M全13段階の「内申ランク」に変換される',
      '同じランク内であれば内申点の細かい差は合否判定上ほぼ同じ扱いになる',
      '学力検査（300点満点）とランクを組み合わせて総合的に判定',
      '内申点を伸ばす際は次のランクの境界（20点刻み）を意識する必要がある'
    ]
  },
  kochi: {
    title: '高知県の注意点',
    items: [
      '中3の評定は47都道府県で唯一「10段階評価」で記録される',
      '本ツールの195点満点は他県と比較しやすい5段階換算の簡易値',
      '実際の選抜では10段階評価に基づく260点満点が使われる',
      '生徒・保護者に説明する際は「195点」と「260点」のどちらの文脈か明示する',
      '実技4教科は主要5教科の2倍で計算される'
    ]
  },
  nara: {
    title: '奈良県の注意点',
    items: [
      '2026年3月17日発表の制度改定で令和8年度入試から計算方法が変わった（要説明）',
      '中1・中2は9教科の評定でなく「主体的に学習に取り組む態度」9教科×3段階で評価',
      '中3は従来通り9教科評定×2倍（90点）',
      '標準は144点満点だが、学校により234点・198点・180点の計4パターンがある',
      '志望校がどのパターンかは必ず募集要項で確認する必要がある'
    ]
  },
  okayama: {
    title: '岡山県の注意点',
    items: [
      '本ツールの195点満点は簡易計算（実際は複雑な配分のため）',
      '実際の選抜では中1・中2が各45点、中3が110点の合計200点満点が一般的',
      'この配分は単純な倍率の掛け算では表現できない構造',
      '生徒・保護者への説明では200点満点（実選抜換算）を優先する',
      '実技4教科は主要5教科の2倍で計算される'
    ]
  },
  hyogo: {
    title: '兵庫県の注意点',
    items: [
      '中3の成績のみが対象（中1・中2は含まれない）',
      '主要5教科の評定合計は4倍、実技4教科の評定合計は7.5倍で計算',
      '内申点250点満点のうち実技教科が150点（6割）を占める設計',
      '第1志望の受験生には学区ごとの「第1志望加算点」が上乗せされる',
      '内申（250点）と学力検査（250点）は1:1の等分で合算される'
    ]
  },
  tochigi: {
    title: '栃木県の注意点',
    items: [
      '内申（135点満点）と学力検査（500点満点）の比率は高校ごとに9:1〜5:5の5段階',
      '進学校ほど学力重視（5:5に近い比率）の傾向がある',
      '総合得点の上位約80%は原則としてそのまま合格',
      '残り約20%は調査書の記載事項・面接等で総合的に判定される',
      '総合得点はあくまで第1次審査の目安であり点数だけで合否は語れない'
    ]
  },
  shimane: {
    title: '島根県の注意点',
    items: [
      '本ツールの180点満点（学年比1:1:2）はあくまで計算モデル上の値',
      '実際の選抜ではこの180点をさらに51点満点へ圧縮換算する',
      '特別活動（部活動・生徒会活動等）の実績で最大9点が加算される',
      '最終的な内申点は51点＋加算点9点＝60点満点として扱われる',
      '生徒・保護者への説明では「どの段階の数字か」を明確にする必要がある'
    ]
  },
  miyazaki: {
    title: '宮崎県の注意点',
    items: [
      '内申点（135点満点）自体は9教科×5段階×3学年の標準的な設計',
      '学力検査・面接との合算比率は県として統一公表されていない',
      '高校ごとに傾斜配点が行われるとだけ案内されている',
      '実際の重みは志望校の募集要項で個別に確認する必要がある',
      '内申点の正確な把握自体は志望校選びの判断材料として引き続き重要'
    ]
  },
  aomori: {
    title: '青森県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（学年差なし均等評価）',
      '9教科×5段階×3学年＝135点満点というオーソドックスな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1からの成績の積み重ねがそのまま内申点になる',
      '「中1・中2は関係ない」と誤解しないよう早めの周知が重要'
    ]
  },
  miyagi: {
    title: '宮城県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（均等評価）',
      '実技4教科は主要5教科の2倍で計算される',
      '内申点は195点満点',
      '実技教科の出来が内申点全体に占める割合が比較的大きい',
      '技能教科の授業態度・提出物も早い学年から重視すべき'
    ]
  },
  gifu: {
    title: '岐阜県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象',
      '中1・中2は等倍、中3のみ2倍で計算される',
      '内申点は180点満点',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中3の成績が最終学年として比重高めに反映される設計'
    ]
  },
  iwate: {
    title: '岩手県の注意点',
    items: [
      '中1〜中3すべてが対象（学年比1:2:3で中3を最も重視）',
      '主要5教科×2倍、実技4教科×1.5倍で計算（660点満点）',
      '660点満点は47都道府県の中で最大だが、これ自体は有利不利を意味しない',
      '実際の選抜では440点満点に換算される場合がある',
      '生徒・保護者への説明では660点と440点のどちらの文脈か明確にする'
    ]
  },
  kagoshima: {
    title: '鹿児島県の注意点',
    items: [
      '中3の成績のみが対象（450点満点）',
      '実技4教科の倍率が主要5教科の10倍と47都道府県で唯一のケタ違い',
      '実技教科の出来が総合得点の約9割を占める計算になる',
      '実技が苦手な場合は他県以上に注意が必要',
      '逆に実技が得意な受験生には有利に働く特異な構造'
    ]
  },
  yamagata: {
    title: '山形県の注意点',
    items: [
      '中3の成績のみが対象（中1・中2は含まれない）',
      '9教科×5段階＝45点満点というシンプルな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1・中2でどれだけ内申点が低くても入試上は関係ない（推薦等を除く）',
      '中3からの巻き返しが可能な制度である一方、油断は禁物'
    ]
  },
  fukushima: {
    title: '福島県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（均等評価）',
      '実技4教科は主要5教科の2倍で計算される',
      '内申点は195点満点',
      '実技教科の出来が内申点全体に占める割合が比較的大きい',
      '中1からの積み重ねがそのまま内申点になる'
    ]
  },
  ibaraki: {
    title: '茨城県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（学年差なし均等評価）',
      '9教科×5段階×3学年＝135点満点というオーソドックスな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1からの成績の積み重ねがそのまま内申点になる',
      '早い学年からの提出物・授業態度の指導が内申点に直結する'
    ]
  },
  gunma: {
    title: '群馬県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（学年差なし均等評価）',
      '9教科×5段階×3学年＝135点満点というオーソドックスな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1からの成績の積み重ねがそのまま内申点になる',
      '早い学年からの継続的な取り組みが重要'
    ]
  },
  nagano: {
    title: '長野県の注意点',
    items: [
      '中3の成績のみが対象（中1・中2は含まれない）',
      '9教科×5段階＝45点満点というシンプルな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1・中2でどれだけ内申点が低くても入試上は関係ない（推薦等を除く）',
      '中3からの巻き返しが可能な制度である一方、油断は禁物'
    ]
  },
  shizuoka: {
    title: '静岡県の注意点',
    items: [
      '中3の成績のみが対象（中1・中2は含まれない）',
      '9教科×5段階＝45点満点というシンプルな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1・中2でどれだけ内申点が低くても入試上は関係ない（推薦等を除く）',
      '中3の1年間の取り組みが特に重要になる'
    ]
  },
  toyama: {
    title: '富山県の注意点',
    items: [
      '中2と中3の成績が対象（中1は含まれない）',
      '中3の成績は2倍で計算される（135点満点）',
      '特別活動等の実績で15点が加算され150点満点となる場合がある',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '「中1は関係ない」という制度である一方、中2から気を抜けない'
    ]
  },
  ishikawa: {
    title: '石川県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（学年差なし均等評価）',
      '9教科×5段階×3学年＝135点満点というオーソドックスな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1からの成績の積み重ねがそのまま内申点になる',
      '早い学年からの継続的な取り組みが重要'
    ]
  },
  fukui: {
    title: '福井県の注意点',
    items: [
      '中3の成績のみが対象（中1・中2は含まれない）',
      '9教科×5段階＝45点満点というシンプルな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1・中2でどれだけ内申点が低くても入試上は関係ない（推薦等を除く）',
      '中3の1年間の取り組みが特に重要になる'
    ]
  },
  yamanashi: {
    title: '山梨県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（均等評価）',
      '主要5教科×2倍、実技4教科×3倍で計算（330点満点）',
      '実技教科への傾斜が主要教科より大きい設計',
      '特別活動等の実績で30点が加算される場合がある',
      '実技教科の授業態度・提出物も早い学年から重視すべき'
    ]
  },
  shiga: {
    title: '滋賀県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（学年差なし均等評価）',
      '9教科×5段階×3学年＝135点満点というオーソドックスな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1からの成績の積み重ねがそのまま内申点になる',
      '早い学年からの継続的な取り組みが重要'
    ]
  },
  nagasaki: {
    title: '長崎県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（学年差なし均等評価）',
      '9教科×5段階×3学年＝135点満点というオーソドックスな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1からの成績の積み重ねがそのまま内申点になる',
      '早い学年からの継続的な取り組みが重要'
    ]
  },
  akita: {
    title: '秋田県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（均等評価）',
      '実技4教科は主要5教科の2倍で計算される',
      '内申点は195点満点',
      '実技教科の出来が内申点全体に占める割合が比較的大きい',
      '中1からの積み重ねがそのまま内申点になる'
    ]
  },
  kyoto: {
    title: '京都府の注意点',
    items: [
      '前期選抜と中期選抜で内申点の満点が異なる（前期135点・中期195点）',
      '中期選抜では実技4教科が主要5教科の2倍で計算される',
      '志望校がどちらの選抜方式かで内申点の扱いが変わる',
      '生徒・保護者への説明では前期/中期のどちらの数字かを明確にする',
      '中1〜中3の3年間すべての成績が対象'
    ]
  },
  okinawa: {
    title: '沖縄県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（均等評価）',
      '実技4教科は主要5教科の1.5倍で計算される',
      '内申点は165点満点',
      '実技教科への傾斜は他県と比べてやや控えめ',
      '中1からの積み重ねがそのまま内申点になる'
    ]
  },
  niigata: {
    title: '新潟県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（学年差なし均等評価）',
      '9教科×5段階×3学年＝135点満点というオーソドックスな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1からの成績の積み重ねがそのまま内申点になる',
      '早い学年からの継続的な取り組みが重要'
    ]
  },
  mie: {
    title: '三重県の注意点',
    items: [
      '中3の成績のみが対象（中1・中2は含まれない）',
      '9教科×5段階＝45点満点というシンプルな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1・中2でどれだけ内申点が低くても入試上は関係ない（推薦等を除く）',
      '中3の1年間の取り組みが特に重要になる'
    ]
  },
  wakayama: {
    title: '和歌山県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象',
      '中1・中2は等倍、中3のみ2倍で計算される',
      '内申点は180点満点',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中3の成績が最終学年として比重高めに反映される設計'
    ]
  },
  tottori: {
    title: '鳥取県の注意点',
    items: [
      '中3の成績のみが対象（中1・中2は含まれない）',
      '実技4教科は主要5教科の2倍で計算される（本ツールでは65点満点）',
      '高校によってはこの65点をさらに2倍(130点)や3倍(195点)に換算する場合がある',
      '志望校ごとに換算倍率が異なるため単純な県内比較がしにくい',
      '生徒・保護者への説明では「どの換算段階の数字か」を明確にする必要がある'
    ]
  },
  hiroshima: {
    title: '広島県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（学年比1:1:3で中3を最も重視）',
      '内申点は225点満点',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中3の成績が最終学年として比重高めに反映される設計',
      '中1・中2から一定の水準を維持したうえで中3の伸びが鍵になる'
    ]
  },
  yamaguchi: {
    title: '山口県の注意点',
    items: [
      '中1〜中3の3年間すべての成績が対象（学年差なし均等評価）',
      '9教科×5段階×3学年＝135点満点というオーソドックスな設計',
      '実技4教科への傾斜（重み付け）はなく主要教科と同倍率',
      '中1からの成績の積み重ねがそのまま内申点になる',
      '早い学年からの継続的な取り組みが重要'
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

// 47都道府県すべてをビルド時に静的生成（SSG）。毎リクエストSSRを止め Worker CPU超過（Error 1102）を防ぐ。
// dynamicParams は既定（true）のまま：プリレンダ漏れがあってもオンデマンド描画にフォールバックし、ハード404にしない（安全策）。
export function generateStaticParams() {
  return PREFECTURES.map((p) => ({ code: p.code }));
}

export default async function PrefecturePage({ params }: PageProps) {
  const { code } = await params;
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
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: `${prefecture.name}の内申点`, url: `https://my-naishin.com/pref/${prefecture.code}` },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500 print:hidden">
          <Link href="/" className="hover:text-blue-600">ホーム</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">{prefecture.name}の内申点</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg print:hidden">
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
            <PrintButton />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 print:hidden">
            このページはA4印刷を想定したレイアウトです。学級通信・進路指導資料としてそのまま配布いただけます（
            <Link href="/for-teachers" className="font-bold text-blue-600 hover:underline">先生・進路指導のご担当者様へ</Link>）。
          </p>
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
          <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white shadow-lg print:hidden">
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
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 print:hidden">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/blog/naishin-guide"
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

          {/* 印刷時のみ表示する出典（ヘッダー/フッターが print:hidden のため、紙面に出典を残す） */}
          <p className="hidden text-xs text-slate-500 print:block">
            出典: My Naishin（https://my-naishin.com/pref/{prefecture.code}）
          </p>
        </div>
      </div>
    </div>
  );
}
