/**
 * 神奈川県私立高等学校の募集定員データ(Λ-5第二段・大都市圏5県)。
 * (株)育伸社「2026年度 私立高校 募集要項【神奈川県】」(2025年11月4日現在)をRead toolで
 * PDF原本を直接解析(千葉/京都で確立した手法)。参照台帳83校と規模が大きいため複数周回に
 * 分けて処理する方針(千葉/静岡/兵庫と同様)。「全コース計」「普通科計」等の記法は既存県と
 * 同一方針で1つの統合コースとして記録し、推薦・一般等の入試方式が別々の数値を明記している
 * 場合は合算する。一方「↓」は直前行と同一の値を意味し、合算しない(単一のクォータを複数の
 * 出願方法で共有している場合はこの記法になる)。1ページ目9校・2ページ目冒頭4校に続き、
 * 慶應義塾・慶應義塾湘南藤沢の2校を追加(いずれも一般募集数値が「若干」の枠は未算入)。
 * 2ページ目の光明学園相模原・相模女子大学・向上・湘南学院は校名とコース名の列対応が
 * 複雑で誤帰属リスクがあるため今回は見送り(次回再訪の価値あり)。3ページ目から星槎・
 * 聖セシリア女子・聖ヨゼフ学園・聖和学院・捜真女学校・相洋・橘学苑の7校、4ページ目から
 * 桐蔭学園・立花学園・中央大学附属横浜・鶴見大学附属・東海大学付属相模・桐光学園・
 * 藤嶺学園藤沢・日本女子大学附属・日本大学・日本大学藤沢の10校を追加。
 * **2026-07-31訂正**: 桐蔭学園の数値を当初「湘南工科大学附属」として誤収録していたことが
 * 判明(4ページ目の桐蔭学園ブロックと3ページ目の湘南工科大学附属ブロックを取り違えた)。
 * schoolCodeを桐蔭学園の正しいコードへ修正し、湘南工科大学附属は正しい数値が別途確認できる
 * までskippedへ退避した。**教訓**: 大都市圏PDFはページをまたいだ同種コース構成(3コース制・
 * 推薦/A方式/B方式のような同一パターン)を持つ複数校が存在し、ページ番号や前後の学校名を
 * 都度再確認せずに数値ブロックだけを追うと取り違えるリスクがある。今後は学校名ラベルと
 * 数値ブロックの直近性を毎回再確認すること。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_KANAGAWA_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03914.pdf',
  docTitle: '2026年度 私立高校 募集要項【神奈川県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_KANAGAWA: PrivateSchoolDetailFile = {
  prefectureCode: 'kanagawa',
  schools: [
    {
      schoolCode: 'D114320600010',
      schoolName: '旭丘高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦120+一般120)', capacity: 240 },
        { courseName: '総合(推薦116+一般117)', capacity: 233 },
      ],
      totalCapacity: 473,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114315000025',
      schoolName: '麻布大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: 'S特進クラス・特進クラス・進学クラス(全コース計、推薦55+一般200)', capacity: 255 }],
      totalCapacity: 255,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320700019',
      schoolName: 'アレセイア湘南高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特進コース・探求コース(普通科計、推薦70+一般110+オープン20)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000231',
      schoolName: '英理女子学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'iグローバルコース(女、推薦30+一般80)', capacity: 80 },
        { courseName: '進学教養コース(女、推薦40+一般40)', capacity: 80 },
        { courseName: 'ビジネスデザインコース(女、推薦20+一般20)', capacity: 40 },
        { courseName: '情報デザインコース(女、推薦40+一般40)', capacity: 80 },
        { courseName: 'ライフデザインコース(女、推薦40+一般40)', capacity: 80 },
      ],
      totalCapacity: 360,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000011',
      schoolName: '大西学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦40+併願一般70)', capacity: 110 },
        { courseName: '家庭(女、推薦20+併願一般30)', capacity: 50 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114321300020',
      schoolName: '柏木学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アドバンスコース(推薦30+一般30)', capacity: 60 },
        { courseName: 'スタンダードコース(推薦70+一般70)', capacity: 140 },
        { courseName: '情報コース(推薦20+一般15)', capacity: 35 },
        { courseName: '全コース共通オープン枠', capacity: 5 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320100033',
      schoolName: '神奈川歯科大学系属緑ヶ丘女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'Sクラス(女、推薦10+書類選考15+一般専願5)', capacity: 30 },
        { courseName: 'Aクラス(女、推薦35+書類選考50+一般専願15+総合型・スポーツ優遇20)', capacity: 120 },
      ],
      totalCapacity: 150,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(2026年度より緑ヶ丘女子から校名変更)',
      },
    },
    {
      schoolCode: 'D114320400021',
      schoolName: '鎌倉学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、一般A方式90+一般B方式20)', capacity: 110 }],
      totalCapacity: 110,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320400058',
      schoolName: '鎌倉国際文理高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '国際教養コース(推薦35含内部+一般併願35+オープン5)', capacity: 75 },
        { courseName: '総合文理コース(推薦75含内部+一般専願25+一般併願50+オープン10)', capacity: 160 },
      ],
      totalCapacity: 235,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(2026年度より鎌倉女子大学から校名変更・女子から共学化)',
      },
    },
    {
      schoolCode: 'D114310000197',
      schoolName: '関東学院六浦高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(一般・GLEクラス、推薦10+一般書類選考15)', capacity: 25 }],
      totalCapacity: 25,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114338200016',
      schoolName: '函嶺白百合学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女、推薦20+一般30)', capacity: 50 }],
      totalCapacity: 50,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320400049',
      schoolName: '北鎌倉女子学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '先進コース・特進コース・国際コース(女、普通科計、推薦50+一般書類選考100)', capacity: 150 },
        { courseName: '音楽(女、推薦5+一般20)', capacity: 25 },
      ],
      totalCapacity: 175,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320500011',
      schoolName: '鵠沼高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '英語コース', capacity: 30 },
        { courseName: '理数コース', capacity: 30 },
        { courseName: '文理コース', capacity: 190 },
      ],
      totalCapacity: 250,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(各コースとも推薦・一般専願・一般併願・一般オープンで同一の募集人員が記載)',
      },
    },
    {
      schoolCode: 'D114310000222',
      schoolName: '慶應義塾高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(男、推薦1次約40)', capacity: 40 },
        { courseName: '普通(男、一般、含帰国)', capacity: 330 },
        { courseName: '普通(男、帰国生)', capacity: 20 },
      ],
      totalCapacity: 390,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(帰国は若干名、全国枠(神奈川・東京・千葉・埼玉以外の居住者対象)は若干名のため数値化できず未算入)',
      },
    },
    {
      schoolCode: 'D114320500093',
      schoolName: '慶應義塾湘南藤沢高等部',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(帰国生)', capacity: 20 }],
      totalCapacity: 20,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(帰国生約20名のみ数値記載。全国枠は若干名のため未算入。一般募集の記載はこのPDFに無い)',
      },
    },
    {
      schoolCode: 'D114310000295',
      schoolName: '星槎高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦25+一般24)', capacity: 49 }],
      totalCapacity: 49,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114321300011',
      schoolName: '聖セシリア女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女、推薦15+一般専併15)', capacity: 30 }],
      totalCapacity: 30,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000026',
      schoolName: '聖ヨゼフ学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '総合進学コース・AEコース・ILコース(推薦20+一般書類選考20)', capacity: 40 }],
      totalCapacity: 40,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320800018',
      schoolName: '聖和学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '英語(グローバルコース)(女、推薦10+1回書類選考30+オープン5)', capacity: 45 },
        { courseName: '普通(リベラルコース)(女、推薦10+1回書類選考30+オープン5)', capacity: 45 },
      ],
      totalCapacity: 90,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000099',
      schoolName: '捜真女学校高等学部',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女、推薦15+一般20)', capacity: 35 }],
      totalCapacity: 35,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320600029',
      schoolName: '相洋高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(選抜クラス、推薦5+一般筆記20+チャレンジ二次5)', capacity: 30 },
        { courseName: '特進コース(特進クラス、推薦25+一般筆記55+チャレンジ二次5)', capacity: 85 },
        { courseName: '文理コース(理科クラス、推薦30+一般筆記60+チャレンジ二次5)', capacity: 95 },
        { courseName: '文理コース(文科クラス、推薦60+一般筆記120+チャレンジ二次5)', capacity: 185 },
        { courseName: '進学コース(推薦60+一般筆記125+チャレンジ二次5)', capacity: 190 },
      ],
      totalCapacity: 585,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000035',
      schoolName: '橘学苑高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進選抜コース(推薦15+一般書類選考15)', capacity: 30 },
        { courseName: '文理総合コース(推薦72+一般書類選考72)', capacity: 144 },
        { courseName: 'デザイン美術コース(推薦15+一般書類選考15)', capacity: 30 },
      ],
      totalCapacity: 204,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000357',
      schoolName: '桐蔭学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'プログレスコース(推薦30+A方式オープン30+B方式書類選考150)', capacity: 210 },
        { courseName: 'アドバンスコース(推薦80+A方式オープン30+B方式書類選考190)', capacity: 300 },
        { courseName: 'スタンダードコース(推薦90+A方式オープン20+B方式書類選考100)', capacity: 210 },
      ],
      totalCapacity: 720,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114336300019',
      schoolName: '立花学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(推薦20+1次専願筆記60)', capacity: 80 },
        { courseName: '進学コース(推薦100+1次専願筆記140)', capacity: 240 },
        { courseName: '総進コース(推薦60+1次専願筆記100)', capacity: 160 },
      ],
      totalCapacity: 480,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000375',
      schoolName: '中央大学附属横浜高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦35+一般A書類選考35+一般B40)', capacity: 110 }],
      totalCapacity: 110,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000044',
      schoolName: '鶴見大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '総合進学コース・特進コース(全コース計、推薦20+一般書類選考40+一般A併願オープン30+一般Bオープン10)', capacity: 100 }],
      totalCapacity: 100,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114315000052',
      schoolName: '東海大学付属相模高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦200+一般240)', capacity: 440 }],
      totalCapacity: 440,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000066',
      schoolName: '桐光学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '男子部SAコース(推薦40+一般1回60+一般2回40)', capacity: 140 },
        { courseName: '女子部SAコース(一般1回20+一般2回20)', capacity: 40 },
      ],
      totalCapacity: 180,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(女子部SAコースの推薦は若干名のため未算入。帰国は両部門とも若干名のため未算入)',
      },
    },
    {
      schoolCode: 'D114320500066',
      schoolName: '藤嶺学園藤沢高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、推薦15+Ⅰ期A書類80+Ⅰ期B10)', capacity: 105 }],
      totalCapacity: 105,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000057',
      schoolName: '日本女子大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女、推薦約65+一般専願約65)', capacity: 130 }],
      totalCapacity: 130,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000240',
      schoolName: '日本大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特別進学コース・総合進学コース・総合進学コーススーパーグローバルクラス(普通科計、推薦100+A日程一般併願160)', capacity: 260 }],
      totalCapacity: 260,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320500057',
      schoolName: '日本大学藤沢高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦160+一般200)', capacity: 360 }],
      totalCapacity: 360,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D114320500020',
      schoolName: '湘南工科大学附属高等学校',
      reason: '当初「プログレス/アドバンス/スタンダードコース」として誤収録していたが、その数値は実際には桐蔭学園のものと判明(2026-07-31訂正)。湘南工科大学附属の正しい募集人員(技術コース/アドバンスコース/進学特化コース)はPDF内の列対応を確信できず未確認のため正直にスキップ台帳へ',
    },
  ],
};
