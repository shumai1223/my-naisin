/**
 * 大阪府私立高等学校の募集定員データ(Λ-5第二段・大都市圏5県の3県目)。
 * (株)育伸社「2026年度 国立高校・高専・私立高校 募集要項【大阪府】」(2025年11月4日現在)を
 * Read toolでPDF原本を直接解析。神奈川/京都と異なり、このPDFは「専願X／併願↓」という
 * 記法が基本形で、↓は直前行と同一の値(単一のクォータを専願・併願で共有)を意味する
 * (合算しない)。「全コース計X」「普通科計X」等は複数コース欄にまたがって同じ数値が
 * 繰り返される場合の共有クォータ(1回のみ計上)。国立(大阪教育大学附属3校)・高専
 * (大阪公立大学工業高専)は私立高校マスターに含まれないため対象外。
 * 1ページ目から着手し、対応関係が明瞭な11校を今回収録(参照台帳107校)。大阪府は参照台帳の規模が
 * 大きいため複数周回に分けて処理する方針(千葉/静岡/神奈川と同様)。
 * **2026-07-31追記**: 2ページ目は校名と数値ブロックの対応が極めて複雑で、かつ「大阪商業大学
 * 高等学校」「大阪商業大学堺高等学校」「大商学園高等学校」のように酷似した校名の別法人校が
 * 複数存在し誤帰属リスクが高いため、育伸社PDFのブロック読解ではなく公式サイト個別確認に
 * 切り替えて大阪商業大学堺高等学校を追加(神奈川終盤で確立した手法)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_OSAKA_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03927.pdf',
  docTitle: '2026年度 国立高校・高専・私立高校 募集要項【大阪府】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_OSAKA: PrivateSchoolDetailFile = {
  prefectureCode: 'osaka',
  schools: [
    {
      schoolCode: 'D127310000478',
      schoolName: 'アサンプション国際高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: 'スーペリアコース・イングリッシュコース・アカデミックⅠ類/Ⅱ類コース(全コース計、含内部・帰国)',
          capacity: 120,
        },
      ],
      totalCapacity: 120,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000566',
      schoolName: 'アナン学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '看護(専願)', capacity: 40 },
        { courseName: '調理(専願)', capacity: 30 },
      ],
      totalCapacity: 70,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000833',
      schoolName: 'あべの翔学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進Ⅰ類コース(専願・併願共通枠)', capacity: 25 },
        { courseName: '特進Ⅱ類コース(専願・併願共通枠)', capacity: 35 },
        { courseName: '普通進学コース(専願・併願共通枠)', capacity: 240 },
      ],
      totalCapacity: 300,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000717',
      schoolName: '上宮太子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進Ⅰ類(国公立大学)コース(専願・併願共通枠、約)', capacity: 35 },
        { courseName: '特進Ⅱ類(難関私立大学)コース(専願・併願共通枠、約)', capacity: 35 },
        { courseName: '総合選進(有名私立大学)コース(専願・併願共通枠、約)', capacity: 105 },
      ],
      totalCapacity: 175,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000094',
      schoolName: '上宮高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'パワーコース(専願・併願共通枠)', capacity: 40 },
        { courseName: '英数コース(専願・併願共通枠)', capacity: 120 },
        { courseName: 'プレップコース(専願・併願共通枠)', capacity: 320 },
      ],
      totalCapacity: 480,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000780',
      schoolName: '英真学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特進コース・総合コース・マンガ/イラストコース(普通科計、専願・併願共通枠)', capacity: 300 }],
      totalCapacity: 300,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000619',
      schoolName: '追手門学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '創造コース(専願・併願共通枠、含内部)', capacity: 35 },
        { courseName: '特選SSコース(専願・併願共通枠、含内部)', capacity: 40 },
        { courseName: 'Ⅰ類コース(専願・併願共通枠、含内部)', capacity: 120 },
        { courseName: 'Ⅱ類コース(専願・併願共通枠、含内部・スポーツ35)', capacity: 155 },
      ],
      totalCapacity: 350,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000389',
      schoolName: '追手門学院大手前高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: 'スーパー選抜コース・グローバルアカデミー/グローバルサイエンスコース・特進コース(普通科計・外部募集、約)',
          capacity: 145,
        },
      ],
      totalCapacity: 145,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000156',
      schoolName: '大阪高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '文理特進コース(専願・併願共通枠)', capacity: 120 },
        { courseName: '総合進学コース(専願・併願共通枠)', capacity: 360 },
        { courseName: '探究コース(専願・併願共通枠)', capacity: 70 },
      ],
      totalCapacity: 550,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000806',
      schoolName: '大阪偕星学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(専願・併願共通枠)', capacity: 50 },
        { courseName: '文理進学コース(専願・併願共通枠)', capacity: 50 },
        { courseName: '進路探究コース(専願・併願共通枠)', capacity: 130 },
        { courseName: 'スポーツコース(専願のみ)', capacity: 90 },
      ],
      totalCapacity: 320,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000334',
      schoolName: '大阪学院大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '普通コース・特進コース・国際コース・スポーツ科学コース(普通科計、専願・併願共通枠)',
          capacity: 400,
        },
      ],
      totalCapacity: 400,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000860',
      schoolName: '大阪商業大学堺高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進エキスパートコース', capacity: 30 },
        { courseName: '特進アドバンスコース', capacity: 70 },
        { courseName: '進学グローバルコース', capacity: 175 },
        { courseName: 'スポーツコース(スポーツ推薦・専願のみ)', capacity: 100 },
      ],
      totalCapacity: 375,
      source: {
        url: 'https://www.shodaisakai.ac.jp/entrance',
        docTitle: '大阪商業大学堺高等学校 令和8年度(2026年度)入試 募集要項ページ(合計375名は原資料の「普通科合計」表記と一致)',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D127310000888',
      schoolName: '大阪商業大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'グローバル商大コース(含内部)', capacity: 160 },
        { courseName: '文理進学コース', capacity: 60 },
        { courseName: 'スポーツ専修コース(指定クラブあり)', capacity: 70 },
        { courseName: 'デザイン美術コース', capacity: 35 },
      ],
      totalCapacity: 325,
      source: {
        url: 'https://www.daishodai-h.ed.jp/examination/admission/',
        docTitle:
          '大阪商業大学高等学校(本校・東大阪市) 入試情報ページ' +
          '(育伸社PDF令和8年度分と同一数値160/60/70/35を公式サイト側でも確認・大阪商業大学堺高等学校とは別法人の別校)',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D127310000879',
      schoolName: '大商学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通科(特進Ⅰ類・特進Ⅱ類・情報クリエイティブ・進学の4コース計、コース別内訳非公表)', capacity: 320 },
        { courseName: '商業科', capacity: 40 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.daisho.ac.jp/admission/examination/',
        docTitle: '大商学園高等学校(豊中市) 令和8年度入試 募集人員ページ',
        fetchedAt: '2026-07-31',
      },
    },
  ],
  skipped: [],
};
