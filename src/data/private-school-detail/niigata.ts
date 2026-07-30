/**
 * 新潟県私立高等学校の募集定員データ(Λ-5第二段)。
 * 新潟県私立中学高等学校協会が公表する「令和8年度 新潟県私立高等学校 入試日程一覧」
 * (令和7年10月22日付)は、他県の同種「入試日程一覧」と異なり学校名の隣に「募集定員」列を
 * 直接掲載しており、参照台帳(schools-private/niigata.ts)の全20校を1件の過不足もなく
 * 完全収録できた(佐賀/富山/栃木/静岡/福岡/長野/岐阜/三重に続く完全収録パターン)。
 * 新潟青陵(普通科288+通信制200)・新潟産業大学附属(普通科160+通信制120)・
 * 加茂暁星(普通科160+看護科40)は複数課程/学科を同一学校コードのcoursesに統合。
 * 新潟英智高等学校(参照台帳名)は原資料では「長岡英智」と表記されていたが、所在地
 * (長岡市宮栄)が一致する唯一の該当校のため同一校と判断した。原資料に県合計の記載が
 * 無いため合計値の突合検算はできていない(各校の募集定員欄をそのまま転記)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://storage.googleapis.com/studio-design-asset-files/projects/xmaZ9KMAqR/s-1x1_80e93d69-f9dd-47c1-ab8f-e3f30fcd1853.pdf',
  docTitle: '令和8年度 新潟県私立高等学校 入試日程一覧（令和7年10月22日付）｜新潟県私立中学高等学校協会（学校別募集定員欄）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_NIIGATA: PrivateSchoolDetailFile = {
  prefectureCode: 'niigata',
  schools: [
    {
      schoolCode: 'D115310000016',
      schoolName: '敬和学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 190 }],
      totalCapacity: 190,
      source: SOURCE,
    },
    {
      schoolCode: 'D115310000025',
      schoolName: '北越高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 400 }],
      totalCapacity: 400,
      source: SOURCE,
    },
    {
      schoolCode: 'D115310000034',
      schoolName: '新潟青陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 288 },
        { courseName: '通信制', capacity: 200 },
      ],
      totalCapacity: 488,
      source: SOURCE,
    },
    {
      schoolCode: 'D115310000043',
      schoolName: '新潟第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 320 }],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D115310000052',
      schoolName: '東京学館新潟高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 400 }],
      totalCapacity: 400,
      source: SOURCE,
    },
    {
      schoolCode: 'D115310000061',
      schoolName: '開志学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 175 }],
      totalCapacity: 175,
      source: SOURCE,
    },
    {
      schoolCode: 'D115310000070',
      schoolName: '新潟明訓高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 240 }],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D115310000089',
      schoolName: '新潟清心女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 120 }],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D115310000098',
      schoolName: '日本文理高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 320 }],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D115310000105',
      schoolName: '開志創造高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 200 }],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D115320200013',
      schoolName: '帝京長岡高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 360 }],
      totalCapacity: 360,
      source: SOURCE,
    },
    {
      schoolCode: 'D115320200022',
      schoolName: '中越高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 320 }],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D115320200031',
      schoolName: '新潟英智高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D115320500010',
      schoolName: '新潟産業大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 160 },
        { courseName: '通信制', capacity: 120 },
      ],
      totalCapacity: 280,
      source: SOURCE,
    },
    {
      schoolCode: 'D115320600019',
      schoolName: '新発田中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 240 }],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D115320900016',
      schoolName: '加茂暁星高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 160 },
        { courseName: '看護科', capacity: 40 },
      ],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D115321100012',
      schoolName: '創進学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 100 }],
      totalCapacity: 100,
      source: SOURCE,
    },
    {
      schoolCode: 'D115322200019',
      schoolName: '上越高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 200 }],
      totalCapacity: 200,
      source: SOURCE,
    },
    {
      schoolCode: 'D115322200028',
      schoolName: '関根学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 240 }],
      totalCapacity: 240,
      source: SOURCE,
    },
    {
      schoolCode: 'D115322700014',
      schoolName: '開志国際高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
  ],
  skipped: [],
};
