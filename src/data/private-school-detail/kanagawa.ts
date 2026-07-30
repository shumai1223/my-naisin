/**
 * 神奈川県私立高等学校の募集定員データ(Λ-5第二段・大都市圏5県)。
 * (株)育伸社「2026年度 私立高校 募集要項【神奈川県】」(2025年11月4日現在)をRead toolで
 * PDF原本を直接解析(千葉/京都で確立した手法)。参照台帳83校と規模が大きいため複数周回に
 * 分けて処理する方針(千葉/静岡/兵庫と同様)。今回はPDF1ページ目(所在地=小田原市〜川崎市)の
 * 9校を収録。「全コース計」「普通科計」等の記法は既存県と同一方針で1つの統合コースとして
 * 記録し、推薦+一般が同一コースの入試方式別数値の場合は合算する。
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
  ],
  skipped: [],
};
