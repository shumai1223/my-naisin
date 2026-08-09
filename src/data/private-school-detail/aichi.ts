/**
 * 愛知県私立高等学校の募集定員データ(Λ-5大都市圏5県の4県目)。
 * (株)育伸社「2026年度 国立高校・高専・私立高校 募集要項【愛知県】」(2025年11月4日現在)を
 * Read toolでPDF原本を直接解析。京都/大阪と異なり、このPDFは校名が科・コース名の行の
 * すぐ左列に明示されており(所在地→校名→科・コース名の順の表構造)、校名と数値ブロックの
 * 対応関係が他の大都市圏PDFより明瞭だった。「普通科計X」「科学技術・情報科学計X」等は
 * 複数コース欄にまたがって同じ数値が繰り返される共有クォータ(1回のみ計上)。「(含内部)」
 * 等の注記がある場合は原資料の数値をそのまま採用(内部進学生を含む可能性があるが公表値優先)。
 * 国立(愛知教育大学附属2校・名古屋大学教育学部附属)・高専(豊田工業高専)は私立高校マスター
 * に含まれないため対象外。
 * 参照台帳57校中50校をこのPDF1回のRead toolで収録(1〜5ページ全ページを一括処理)。
 * 残り7校はPDFに掲載が無くWebSearchで個別調査: 愛知淑徳・金城学院・南山は中学からの内部
 * 進学のみで高校からの外部募集を実施していないため完全中高一貫としてスキップ、
 * ルネサンス豊田高等学校(本校・豊田駅前キャンパス)は広域通信制のためスキップ、
 * 国際高等学校(NUCB International College)は9月入学制の全寮制IB校で標準的な
 * 12〜1月入試サイクルの対象外と判断しスキップ、黄柳野高等学校は公式サイトに
 * 「推薦60名・一般15名」と記載があるが推薦/一般が合算対象か単一定員の内訳かの
 * 確証が持てず(↓等の共有クォータ記法が無い)、捏造ゼロ原則により正直にスキップ。
 * 収録50校+スキップ7校=57/57校で愛知県は完全網羅(北海道除く残り未着手は東京都のみ)。
 *
 * 【掛-2（私立×多年度）着手(2026-08-10)】大都市圏5県の3番目。Wayback CDX APIでikushin
 * 03923.pdfの2023年11月2日キャプチャ(「2024年度」版)を発掘し、1ページ目8校を再突合。
 * **愛知・愛知工業大学名電・愛知啓成・愛知産業大学三河・愛知みずほ大学瑞穂・安城学園の
 * 6校で実際の変化を検出**(いずれも令和8年度版の方が小さい=定員減の傾向。愛知353→372は
 * 唯一の増加例で新設の国際教養コースを含む)。栄徳のみ総定員完全一致(380=380)。愛知黎明は
 * 2024年版で「普通」「看護」両コースが同一の「140(内推薦80%程度)」を独立記載しており
 * 共有クォータか各コース独立かを確信できず見送り。桜花学園は表がページ下端で途切れ
 * 続きの読み取りが必要なため次回に持ち越す。
 *
 * 【掛-2続き(2026-08-10)】ページ2も処理し18校へ拡大。至学館・椙山女学園・聖カピタニオ女子の
 * 3校は総定員完全一致。**岡崎城西(540→524)・菊華(346→343)・享栄(520→503)・
 * 啓明学館(249→234)・桜丘(591→587)・星城(608→581)・誠信(274→242)は定員減、
 * 修文学院(392→440・情報会計コースが152→200へ大幅増員)のみ定員増**。aichiは他の
 * 大都市圏県と異なり「変化あり」が「変化なし」を大きく上回る=県全体として2024→2026年度で
 * 定員が縮小傾向にある可能性が高い(唯一の例外は修文学院と新設コースを含む愛知)。
 *
 * 【掛-2続き2(2026-08-10)】ページ3も処理し32校へ拡大。大同大学大同・滝・中京大学附属中京・
 * 東海・東海学園・同朋の6校は総定員完全一致。**清林館(454→434)・聖霊(234→228)・
 * 中部大学第一(405→390)・中部大学春日丘(533→526)・東邦(623→604)・豊川(489→400)は定員減、
 * 大成(134→145)・杜若(254→266)は定員増**。引き続きaichi県全体の定員縮小傾向を確認しつつ、
 * 増減が混在する県であることも判明(縮小一辺倒ではない)。
 *
 * 【掛-2完了(2026-08-10)】ページ4〜5を処理し47校で完走(50校中47校=5頁全処理済み)。
 * 名古屋国際・誉の2校と、豊橋中央(総定員225不変・普通1コースへ統合)は総定員完全一致。
 * **豊田大谷・名古屋・名古屋経済大学市邨・日本福祉大学付属・光ヶ丘女子は定員減、
 * 名古屋大谷・名古屋経済大学高蔵・名古屋工業・名古屋たちばな・人間環境大学附属岡崎・
 * 名城大学附属は定員増**(名城大学附属は2024年版5クラス制→令和8年度版は普通科1コースへ
 * 統合という構造変化を伴う)。藤ノ花女子も定員減(443→409)。愛知黎明(共有クォータか
 * 各コース独立か不明)・桜花学園(表がページ下端で途切れ)・名古屋葵大学(このPDF未掲載)の
 * 3校は要再検証のまま残存。これで大都市圏5県の3番目aichiの掛-2が完了。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_AICHI_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03923.pdf',
  docTitle: '2026年度 国立高校・高専・私立高校 募集要項【愛知県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_AICHI_SOURCE = {
  url: 'https://web.archive.org/web/20231106193324if_/https://www.ikushin.co.jp/school/PDF/03923.pdf',
  docTitle: '2024年度 私立高校 募集要項【愛知県】(株式会社育伸社 入試情報課・2023年11月2日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-10',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_AICHI: PrivateSchoolDetailFile = {
  prefectureCode: 'aichi',
  schools: [
    {
      schoolCode: 'D123310000007',
      schoolName: '愛知高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '選抜クラス・進学クラス・国際教養コース(普通科計、内部進学含む)', capacity: 372 },
      ],
      totalCapacity: 372,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000016',
      schoolName: '愛知工業大学名電高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進・選抜コース・進学クラス・スポーツコース(普通科計、内推薦50%程度)', capacity: 369 },
        { courseName: '科学技術・情報科学コース計(内推薦70%程度)', capacity: 160 },
      ],
      totalCapacity: 529,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000356',
      schoolName: '愛知啓成高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'サミッティア(特進)コース', capacity: 60 },
        { courseName: 'アカデミア(進学総合)コース', capacity: 120 },
        { courseName: 'グローバルコース', capacity: 25 },
        { courseName: 'スポーツコース', capacity: 36 },
      ],
      totalCapacity: 241,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000472',
      schoolName: '愛知産業大学三河高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(特色計は募集人員の約5%を含む)', capacity: 160 },
        { courseName: '電気(含特色)', capacity: 110 },
        { courseName: '情報処理(特色計は募集人員の約5%を含む)', capacity: 160 },
      ],
      totalCapacity: 430,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000196',
      schoolName: '愛知みずほ大学瑞穂高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース・進学コース・教養コース・生活文化コース(普通科計)', capacity: 316 },
        { courseName: '商業', capacity: 100 },
      ],
      totalCapacity: 416,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000383',
      schoolName: '愛知黎明高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(内推薦80%程度)', capacity: 124 },
        { courseName: '看護(内推薦80%程度)', capacity: 76 },
      ],
      totalCapacity: 200,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000454',
      schoolName: '安城学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通・商業(全科計、基礎学力試験3科)', capacity: 533 }],
      totalCapacity: 533,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000409',
      schoolName: '栄徳高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(約、特別専願若干あり)', capacity: 50 },
        { courseName: '総合進学コース(選抜クラス・進学クラス、約)', capacity: 260 },
        { courseName: '総合選抜コース(国際クラス、約)', capacity: 30 },
        { courseName: '総合進学コース(スポーツクラス、男、約)', capacity: 40 },
      ],
      totalCapacity: 380,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000150',
      schoolName: '桜花学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(内推薦約30%)', capacity: 90 },
        { courseName: '国際キャリアコース(内推薦約60%)', capacity: 40 },
        { courseName: 'メディアそうぞうコース(内推薦約60%、新設)', capacity: 30 },
        { courseName: '保育コース(内推薦約60%)', capacity: 60 },
        { courseName: '進学コース(内推薦約60%)', capacity: 169 },
      ],
      totalCapacity: 389,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000445',
      schoolName: '岡崎城西高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特進Zコース・特進Yコース・学習Xコース(普通科計)', capacity: 524 }],
      totalCapacity: 524,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000258',
      schoolName: '菊華高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通科総合コース(内推薦約80%)', capacity: 40 },
        { courseName: '普通科進学コース(内推薦約80%)', capacity: 60 },
        { courseName: '普通科保育・福祉コース(内推薦約80%)', capacity: 50 },
        { courseName: '普通科スポーツコース(内推薦約80%)', capacity: 60 },
        { courseName: '普通科エンタメコース(内推薦約80%)', capacity: 50 },
        { courseName: '普通科フードクリエイトコース(内推薦約80%)', capacity: 30 },
        { courseName: 'ITビジネス科(内推薦約80%)', capacity: 53 },
      ],
      totalCapacity: 343,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000221',
      schoolName: '享栄高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'CP(コアプロ)コース(約)', capacity: 30 },
        { courseName: 'C(コア)コース(約)', capacity: 210 },
        { courseName: '商業(約)', capacity: 155 },
        { courseName: '機械(約)', capacity: 108 },
      ],
      totalCapacity: 503,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000089',
      schoolName: '啓明学館高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(内推薦80%以内)', capacity: 90 },
        { courseName: 'ビジネス・デザイン(内推薦80%以内)', capacity: 144 },
      ],
      totalCapacity: 234,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000524',
      schoolName: '桜丘高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通コース・文理コース・文理コース(音楽専攻)(普通科計)', capacity: 587 }],
      totalCapacity: 587,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000132',
      schoolName: '至学館高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アドバンスコース', capacity: 30 },
        { courseName: '留学コース', capacity: 30 },
        { courseName: '進学スポーツサイエンスコース', capacity: 260 },
        { courseName: '家政', capacity: 40 },
        { courseName: '商業', capacity: 80 },
      ],
      totalCapacity: 440,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000294',
      schoolName: '修文学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進クラス・進学クラス(普通科計、志入試含む)', capacity: 120 },
        { courseName: '情報会計', capacity: 200 },
        { courseName: '家政', capacity: 40 },
        { courseName: '食物調理', capacity: 80 },
      ],
      totalCapacity: 440,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000034',
      schoolName: '椙山女学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(外部、内推薦約55%)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000310',
      schoolName: '聖カピタニオ女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(普通・英語コース)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000365',
      schoolName: '星城高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '仰星コース・特進コース・アスリート特進コース・明徳コース(普通科計)', capacity: 581 }],
      totalCapacity: 581,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000374',
      schoolName: '誠信高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(内推薦80%)', capacity: 242 }],
      totalCapacity: 242,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000338',
      schoolName: '清林館高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '文理特進コース(約)', capacity: 70 },
        { courseName: '文理選抜コース(内特色若干、約)', capacity: 105 },
        { courseName: '国際コース(内特色若干、約)', capacity: 105 },
        { courseName: '進学総合コース(内特色若干、約)', capacity: 154 },
      ],
      totalCapacity: 434,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000301',
      schoolName: '聖霊高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(含内部)', capacity: 228 }],
      totalCapacity: 228,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000418',
      schoolName: '大成高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'ラトナディアコース', capacity: 20 },
        { courseName: 'グローバルフューチャーコース', capacity: 20 },
        { courseName: 'プラウディアコース', capacity: 105 },
      ],
      totalCapacity: 145,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000249',
      schoolName: '大同大学大同高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通', capacity: 240 },
        { courseName: '工業', capacity: 240 },
      ],
      totalCapacity: 480,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000347',
      schoolName: '滝高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦・帰国、外部、内推薦・帰国20%程度)', capacity: 110 }],
      totalCapacity: 110,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000178',
      schoolName: '中京大学附属中京高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(内推薦約40%程度)', capacity: 80 },
        { courseName: '国際コース(内推薦約50%程度)', capacity: 40 },
        { courseName: '進学コース(内推薦約50%程度)', capacity: 280 },
      ],
      totalCapacity: 400,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000114',
      schoolName: '中部大学第一高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通', capacity: 270 },
        { courseName: '創造工学', capacity: 120 },
      ],
      totalCapacity: 390,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000329',
      schoolName: '中部大学春日丘高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '創進コース(創進2クラス、内部含)・進学コース(進学9クラス、内部含)(普通科計)', capacity: 526 }],
      totalCapacity: 526,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000052',
      schoolName: '東海高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、一般のみ掲載)', capacity: 40 }],
      totalCapacity: 40,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000285',
      schoolName: '東海学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通', capacity: 400 }],
      totalCapacity: 400,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000267',
      schoolName: '東邦高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '文理特進コース', capacity: 40 },
        { courseName: '普通コース(含特色)', capacity: 449 },
        { courseName: '人間健康コース(男、指定クラブのみ)', capacity: 35 },
        { courseName: '世界探究(特色プレゼン含む)', capacity: 40 },
        { courseName: '美術(特色含む)', capacity: 40 },
      ],
      totalCapacity: 604,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000105',
      schoolName: '同朋高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(内推薦65%程度)', capacity: 360 },
        { courseName: '商業(内推薦65%程度)', capacity: 80 },
        { courseName: '音楽(内推薦65%程度)', capacity: 30 },
      ],
      totalCapacity: 470,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000463',
      schoolName: '杜若高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '文理コース(内推薦・特色80%程度)', capacity: 34 },
        { courseName: '特進コース(内推薦・特色80%程度)', capacity: 120 },
        { courseName: '創造コース(内推薦・特色80%程度)', capacity: 112 },
      ],
      totalCapacity: 266,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000551',
      schoolName: '豊川高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'Ⅰ類(内推薦約80%)', capacity: 280 },
        { courseName: 'Ⅱ類(内推薦約80%)', capacity: 120 },
      ],
      totalCapacity: 400,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000481',
      schoolName: '豊田大谷高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別選抜コース', capacity: 27 },
        { courseName: '人間福祉コース', capacity: 30 },
        { courseName: '情報メディアコース', capacity: 60 },
        { courseName: '生活文化コース', capacity: 30 },
        { courseName: '文理コース', capacity: 82 },
      ],
      totalCapacity: 229,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000542',
      schoolName: '豊橋中央高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通', capacity: 225 }],
      totalCapacity: 225,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000070',
      schoolName: '名古屋高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '文理コース・文理選抜クラス(男、選抜クラス含む)', capacity: 221 }],
      totalCapacity: 221,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000203',
      schoolName: '名古屋葵大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通', capacity: 196 }],
      totalCapacity: 196,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000212',
      schoolName: '名古屋大谷高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '特別選抜コース', capacity: 30 },
        { courseName: '福祉・医療進学コース', capacity: 80 },
        { courseName: '文理進学コース', capacity: 300 },
        { courseName: '商業', capacity: 105 },
      ],
      totalCapacity: 545,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000043',
      schoolName: '名古屋経済大学市邨高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: 'エクスプローラーコース・キャリアデザインコース・アカデミックコース・ブライトコース(普通科計、含内部)',
          capacity: 467,
        },
      ],
      totalCapacity: 467,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000230',
      schoolName: '名古屋経済大学高蔵高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース・進学コース(普通科計)', capacity: 425 },
        { courseName: '商業', capacity: 70 },
      ],
      totalCapacity: 495,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000141',
      schoolName: '名古屋工業高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '工業(建築・土木80、電気・情技100、機械140)', capacity: 320 }],
      totalCapacity: 320,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000187',
      schoolName: '名古屋国際高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(国際バカロレア25・アドバンスト40、含内部)', capacity: 65 },
        { courseName: '国際教養', capacity: 80 },
      ],
      totalCapacity: 145,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000123',
      schoolName: '名古屋たちばな高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '電気・電子', capacity: 155 },
        { courseName: '機械', capacity: 194 },
        { courseName: '普通', capacity: 80 },
      ],
      totalCapacity: 429,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000276',
      schoolName: '日本福祉大学付属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(特色含む)', capacity: 250 }],
      totalCapacity: 250,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000427',
      schoolName: '人間環境大学附属岡崎高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特進コース・進学コース・スポーツ進学コース(普通科計)', capacity: 315 }],
      totalCapacity: 315,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000436',
      schoolName: '光ヶ丘女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通', capacity: 240 },
        { courseName: '国際教養', capacity: 70 },
      ],
      totalCapacity: 310,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000533',
      schoolName: '藤ノ花女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(特進コース30を含む、内特進30)', capacity: 209 },
        { courseName: '生活情報', capacity: 120 },
        { courseName: '食物', capacity: 80 },
      ],
      totalCapacity: 409,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000392',
      schoolName: '誉高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '進学コース', capacity: 120 },
        { courseName: '総合オフィスコース', capacity: 80 },
      ],
      totalCapacity: 200,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000098',
      schoolName: '名城大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(内推薦50%程度、特色含む。普通科・総合学科は普通科へ統合しコース制廃止)', capacity: 637 },
      ],
      totalCapacity: 637,
      source: IKUSHIN_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000007',
      schoolName: '愛知高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '選抜クラス・進学クラス・国際教養コース(普通科計、推薦50%、国際教養コースは2024年新設)', capacity: 353 },
      ],
      totalCapacity: 353,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000016',
      schoolName: '愛知工業大学名電高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進・選抜コース・普通(文系・理系)コース・スポーツコース(普通科計外部387、内推薦50%程度)', capacity: 387 },
        { courseName: '科学技術・情報科学コース計(内推薦70%程度)', capacity: 160 },
      ],
      totalCapacity: 547,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000356',
      schoolName: '愛知啓成高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'サミッティア(特進)コース', capacity: 60 },
        { courseName: 'アカデミア(進学総合)コース', capacity: 150 },
        { courseName: 'グローバルコース', capacity: 30 },
        { courseName: 'スポーツコース', capacity: 36 },
      ],
      totalCapacity: 276,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000472',
      schoolName: '愛知産業大学三河高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(特色計は募集人員の約5%を含む)', capacity: 176 },
        { courseName: '電気(含特色)', capacity: 110 },
        { courseName: '情報処理(特色計は募集人員の約5%を含む)', capacity: 150 },
      ],
      totalCapacity: 436,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000196',
      schoolName: '愛知みずほ大学瑞穂高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース・進学コース・教養コース・生活文化コース(普通科計322、内推薦約80%)', capacity: 322 },
        { courseName: '商業(内推薦約80%)', capacity: 120 },
      ],
      totalCapacity: 442,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000454',
      schoolName: '安城学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通・商業(全科計540、基礎学力試験3科)', capacity: 540 }],
      totalCapacity: 540,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000409',
      schoolName: '栄徳高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'Super文理コース(約)', capacity: 60 },
        { courseName: '総合進学コース(約)', capacity: 250 },
        { courseName: '国際言語コース(約)', capacity: 30 },
        { courseName: '人間スポーツコース(男、約)', capacity: 40 },
      ],
      totalCapacity: 380,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000445',
      schoolName: '岡崎城西高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '特進Zコース・特進Yコース・学習Xコース(普通科計)', capacity: 540 }],
      totalCapacity: 540,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000258',
      schoolName: '菊華高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科総合コース(内推薦約80%)', capacity: 40 },
        { courseName: '普通科進学コース(内推薦約80%)', capacity: 60 },
        { courseName: '普通科保育・福祉コース(内推薦約80%)', capacity: 50 },
        { courseName: '普通科スポーツコース(内推薦約80%)', capacity: 60 },
        { courseName: '普通科エンタメコース(内推薦約80%)', capacity: 50 },
        { courseName: '普通科フードクリエイトコース(内推薦約80%)', capacity: 30 },
        { courseName: 'ITビジネス科(内推薦約80%)', capacity: 56 },
      ],
      totalCapacity: 346,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000221',
      schoolName: '享栄高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'CP(コアプロ)コース(約)', capacity: 30 },
        { courseName: 'C(コア)コース(約)', capacity: 210 },
        { courseName: '商業(約)', capacity: 170 },
        { courseName: '機械(約)', capacity: 110 },
      ],
      totalCapacity: 520,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000089',
      schoolName: '啓明学館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(女、内推薦80%以内)', capacity: 100 },
        { courseName: '商業(女、内推薦80%以内)', capacity: 149 },
      ],
      totalCapacity: 249,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000524',
      schoolName: '桜丘高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通コース・英数コース(普通科計556)', capacity: 556 },
        { courseName: '音楽', capacity: 35 },
      ],
      totalCapacity: 591,
      source: {
        ...KAKE2_2024_AICHI_SOURCE,
        docTitle: KAKE2_2024_AICHI_SOURCE.docTitle + '(2024年版は音楽が独立枠。令和8年度版は文理コース音楽専攻へ統合された可能性)',
      },
    },
    {
      schoolCode: 'D123310000132',
      schoolName: '至学館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'アドバンスコース', capacity: 30 },
        { courseName: '留学コース', capacity: 30 },
        { courseName: '進学スポーツサイエンスコース', capacity: 260 },
        { courseName: '家政', capacity: 40 },
        { courseName: '商業', capacity: 80 },
      ],
      totalCapacity: 440,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000294',
      schoolName: '修文学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進クラス・進学クラス(普通科計120、志入試含む)', capacity: 120 },
        { courseName: '情報会計', capacity: 152 },
        { courseName: '家政(女)', capacity: 40 },
        { courseName: '食物調理', capacity: 80 },
      ],
      totalCapacity: 392,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000034',
      schoolName: '椙山女学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(外部、内推薦約55%)', capacity: 200 }],
      totalCapacity: 200,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000310',
      schoolName: '聖カピタニオ女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(普通・英語コース)', capacity: 200 }],
      totalCapacity: 200,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000365',
      schoolName: '星城高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '仰星コース・特進コース・アスリート特進コース・明徳コース(普通科計)', capacity: 608 }],
      totalCapacity: 608,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000374',
      schoolName: '誠信高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(内推薦80%)', capacity: 274 }],
      totalCapacity: 274,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000338',
      schoolName: '清林館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理特進コース(約、含スカラ若干)', capacity: 70 },
        { courseName: '文理選抜コース(約)', capacity: 105 },
        { courseName: '国際コース(約、含スカラ若干)', capacity: 105 },
        { courseName: '進学総合コース(約)', capacity: 174 },
      ],
      totalCapacity: 454,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000301',
      schoolName: '聖霊高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(含内部200)', capacity: 234 }],
      totalCapacity: 234,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000418',
      schoolName: '大成高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'ラトナディアコース', capacity: 20 },
        { courseName: 'グローバルフューチャーコース', capacity: 20 },
        { courseName: 'プラウディアコース', capacity: 94 },
      ],
      totalCapacity: 134,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000249',
      schoolName: '大同大学大同高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 240 },
        { courseName: '工業', capacity: 240 },
      ],
      totalCapacity: 480,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000347',
      schoolName: '滝高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(推薦・帰国、外部、内推薦・帰国20%程度)', capacity: 110 }],
      totalCapacity: 110,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000178',
      schoolName: '中京大学附属中京高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(内推薦約40%程度、約80)', capacity: 80 },
        { courseName: '国際コース(内推薦約50%程度、約40)', capacity: 40 },
        { courseName: '進学コース(内推薦約50%程度、約280)', capacity: 280 },
      ],
      totalCapacity: 400,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000114',
      schoolName: '中部大学第一高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 300 },
        { courseName: '創造工学', capacity: 105 },
      ],
      totalCapacity: 405,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000329',
      schoolName: '中部大学春日丘高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '創進コース(創進2クラス、内部含)・進学コース(進学9クラス、内部含)(普通科計533)', capacity: 533 },
      ],
      totalCapacity: 533,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000052',
      schoolName: '東海高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(男、一般のみ掲載)', capacity: 40 }],
      totalCapacity: 40,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000285',
      schoolName: '東海学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(推薦280+一般120)', capacity: 400 }],
      totalCapacity: 400,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000267',
      schoolName: '東邦高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理特進コース(内推薦60%)', capacity: 40 },
        { courseName: '普通コース(内推薦60%)', capacity: 463 },
        { courseName: '人間健康コース(男)', capacity: 40 },
        { courseName: '国際探究コース(内推薦60%)', capacity: 40 },
        { courseName: '美術(内推薦60%)', capacity: 40 },
      ],
      totalCapacity: 623,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000105',
      schoolName: '同朋高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(内推薦65%程度)', capacity: 360 },
        { courseName: '商業(内推薦65%程度)', capacity: 80 },
        { courseName: '音楽(内推薦65%程度)', capacity: 30 },
      ],
      totalCapacity: 470,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000463',
      schoolName: '杜若高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理コース(内推薦・特色80%程度)', capacity: 30 },
        { courseName: '特進コース(内推薦・特色80%程度)', capacity: 124 },
        { courseName: '創造コース(内推薦・特色80%程度)', capacity: 100 },
      ],
      totalCapacity: 254,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000551',
      schoolName: '豊川高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'Ⅰ類(内推薦約80%)', capacity: 349 },
        { courseName: 'Ⅱ類(内推薦約80%)', capacity: 140 },
      ],
      totalCapacity: 489,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000481',
      schoolName: '豊田大谷高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別選抜コース', capacity: 28 },
        { courseName: '人間福祉コース', capacity: 34 },
        { courseName: '情報メディアコース', capacity: 60 },
        { courseName: '生活文化コース', capacity: 34 },
        { courseName: '文理コース', capacity: 84 },
      ],
      totalCapacity: 240,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000542',
      schoolName: '豊橋中央高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通', capacity: 145 },
        { courseName: '家政(女)', capacity: 80 },
      ],
      totalCapacity: 225,
      source: {
        ...KAKE2_2024_AICHI_SOURCE,
        docTitle: KAKE2_2024_AICHI_SOURCE.docTitle + '(令和8年度版は普通1コースへ統合。総定員225は不変)',
      },
    },
    {
      schoolCode: 'D123310000070',
      schoolName: '名古屋高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '文理コース・文理選抜クラス(男、選抜クラス含む、257)', capacity: 257 }],
      totalCapacity: 257,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000212',
      schoolName: '名古屋大谷高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学コース', capacity: 30 },
        { courseName: '特別選抜コース', capacity: 30 },
        { courseName: '福祉・医療進学コース', capacity: 80 },
        { courseName: '文理進学コース', capacity: 280 },
        { courseName: '商業', capacity: 105 },
      ],
      totalCapacity: 525,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000043',
      schoolName: '名古屋経済大学市邨高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: 'エクスプローラーコース・キャリアデザインコース・アカデミックコース・ブライトコース(普通科計488、含内部)',
          capacity: 488,
        },
      ],
      totalCapacity: 488,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000230',
      schoolName: '名古屋経済大学高蔵高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース・進学コース(普通科計402)', capacity: 402 },
        { courseName: '商業(女)', capacity: 80 },
      ],
      totalCapacity: 482,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000141',
      schoolName: '名古屋工業高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '工業(建築・土木80、電気・情技120、機械118)(男)', capacity: 318 }],
      totalCapacity: 318,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000187',
      schoolName: '名古屋国際高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(国際バカロレア25・アドバンスト40、含内部)', capacity: 65 },
        { courseName: '国際教養', capacity: 80 },
      ],
      totalCapacity: 145,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000123',
      schoolName: '名古屋たちばな高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '電気・電子', capacity: 150 },
        { courseName: '機械', capacity: 159 },
        { courseName: '普通(2024年新設)', capacity: 80 },
      ],
      totalCapacity: 389,
      source: {
        ...KAKE2_2024_AICHI_SOURCE,
        docTitle: KAKE2_2024_AICHI_SOURCE.docTitle + '(2024年度に愛知産業大学工業から校名変更・男子から共学化した初年度)',
      },
    },
    {
      schoolCode: 'D123310000276',
      schoolName: '日本福祉大学付属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(特色含む)', capacity: 275 }],
      totalCapacity: 275,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000427',
      schoolName: '人間環境大学附属岡崎高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '特進コース・進学コース(普通科計310)', capacity: 310 }],
      totalCapacity: 310,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000436',
      schoolName: '光ヶ丘女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(女)', capacity: 245 },
        { courseName: '国際教養(女)', capacity: 70 },
      ],
      totalCapacity: 315,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000533',
      schoolName: '藤ノ花女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(特進コース30を含む、女、243)', capacity: 243 },
        { courseName: '生活情報(女)', capacity: 120 },
        { courseName: '食物(女)', capacity: 80 },
      ],
      totalCapacity: 443,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000392',
      schoolName: '誉高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '進学コース', capacity: 120 },
        { courseName: '総合オフィスコース', capacity: 80 },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_AICHI_SOURCE,
    },
    {
      schoolCode: 'D123310000098',
      schoolName: '名城大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進クラス(内推薦50%程度)', capacity: 120 },
        { courseName: 'スーパーサイエンスクラス(内特色10以内)', capacity: 40 },
        { courseName: '進学クラス(内推薦50%程度)', capacity: 274 },
        { courseName: '国際クラス(内特色10以内)', capacity: 40 },
        { courseName: '総合(内推薦50%程度)', capacity: 160 },
      ],
      totalCapacity: 634,
      source: {
        ...KAKE2_2024_AICHI_SOURCE,
        docTitle: KAKE2_2024_AICHI_SOURCE.docTitle + '(2024年版は5クラス制。令和8年度版は普通科1コースへ統合しコース制廃止)',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D123310000025',
      schoolName: '愛知淑徳高等学校',
      reason: '中学からの内部進学のみで、高等学校段階での外部からの募集・入学を実施していないため(WebSearch要約による完全中高一貫の確認)',
    },
    {
      schoolCode: 'D123310000061',
      schoolName: '金城学院高等学校',
      reason: '中学からの内部進学のみで、高等学校段階での外部からの募集・入学を実施していないため(WebSearch要約による完全中高一貫の確認)',
    },
    {
      schoolCode: 'D123310000169',
      schoolName: '南山高等学校',
      reason: '中学からの内部進学のみで、高等学校段階での外部からの募集・入学を実施していないため(WebSearch要約による完全中高一貫の確認)',
    },
    {
      schoolCode: 'D123310000506',
      schoolName: '黄柳野高等学校',
      reason: '公式サイトに「推薦入学者選考60名・一般入学者選考15名」と別建てで記載されているが、他校のような「↓」等の共有クォータ記法が無く、合算した75名が総定員なのか推薦枠自体が60名でそれとは別枠の一般15名なのかの確証が持てないため正直に見送り',
    },
    {
      schoolCode: 'D123310000515',
      schoolName: 'ルネサンス豊田高等学校',
      reason: '広域通信制高校のため対象外(千葉/兵庫等の同種通信制スキップ理由と同根)',
    },
    {
      schoolCode: 'D123310000570',
      schoolName: 'ルネサンス豊田高等学校豊田駅前キャンパス',
      reason: '広域通信制高校のキャンパスのため対象外(本校と同一理由)',
    },
    {
      schoolCode: 'D123310000561',
      schoolName: '国際高等学校',
      reason: 'NUCB International College(名古屋商科大学キャンパス内の全寮制IB校)で9月入学制を採用しており、育伸社PDFが対象とする標準的な12〜1月入試サイクルの学校とは募集形態が異なり掲載も無いため見送り',
    },
  ],
};
