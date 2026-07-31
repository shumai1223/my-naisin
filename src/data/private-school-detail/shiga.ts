/**
 * 滋賀県私立高等学校の募集定員データ(Λ-5第二段)。
 * 滋賀県子ども若者部子ども若者政策・私学振興課が公表する「令和8年度私立学校生徒募集概要」
 * PDF(全7頁)に、県内私立高校・中等教育学校の学科別募集定員が1枚にまとまっていた
 * (佐賀県の県庁一覧・富山県の協会一覧と同型の高効率パターン)。
 *
 * 【注意】このPDFは高等学校(1~4頁)と中学校/中等教育学校(5~7頁)の両方を収録するが、
 * Y-0憲法の対象は高等学校のみのため中学校側は対象外。
 * 【注意】光泉カトリック高等学校・綾羽高等学校は全日制のほかに定時制/通信制課程も
 * 公表しているが、富山県の高岡龍谷高等学校と同様に別課程として対象外とし、
 * 全日制のみを収録する。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://shiga-shigaku.com/wp2024/wp-content/uploads/2026/03/R8seitoboshugaiyou.pdf',
  docTitle: '令和8年度私立学校生徒募集概要(滋賀県子ども若者部子ども若者政策・私学振興課)',
  fetchedAt: '2026-07-30',
  sourceTier: 'primary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_SHIGA: PrivateSchoolDetailFile = {
  prefectureCode: 'shiga',
  schools: [
    {
      schoolCode: 'D125320100012',
      schoolName: '比叡山高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 400 }],
      totalCapacity: 400,
      source: {
        ...SOURCE,
        docTitle:
          SOURCE.docTitle + '(全日制・普通科をAct/Bright/Crestの3コースに分けて募集するが各コースは「140名程度」の目安表記のため合計のみ収録)',
      },
    },
    {
      schoolCode: 'D125320100021',
      schoolName: '滋賀短期大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科Ⅰ類', capacity: 160 },
        { courseName: '普通科Ⅱ類', capacity: 90 },
      ],
      totalCapacity: 250,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '(全日制・Ⅰ類は2年次からコース選択制)' },
    },
    {
      schoolCode: 'D125320100030',
      schoolName: '幸福の科学学園関西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 100 }],
      totalCapacity: 100,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '(全日制)' },
    },
    {
      schoolCode: 'D125320200011',
      schoolName: '近江高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 280 },
        { courseName: 'グローバル探究科', capacity: 80 },
      ],
      totalCapacity: 360,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '(全日制)' },
    },
    {
      schoolCode: 'D125320200020',
      schoolName: '彦根総合高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合学科', capacity: 210 },
        { courseName: 'フードクリエイト科', capacity: 35 },
      ],
      totalCapacity: 245,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '(全日制・フードクリエイト科は専願のみ)' },
    },
    {
      schoolCode: 'D125320400019',
      schoolName: '近江兄弟社高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 320 },
        { courseName: '国際コミュニケーション科', capacity: 70 },
      ],
      totalCapacity: 390,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '(全日制・普通科の内訳は学年制課程240名+単位制課程80名)',
      },
    },
    {
      schoolCode: 'D125320600017',
      schoolName: '光泉カトリック高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 350 }],
      totalCapacity: 350,
      source: {
        ...SOURCE,
        docTitle:
          SOURCE.docTitle + '(全日制のみ。別途通信制課程普通科80名は令和8年度新設の別課程のため対象外)',
      },
    },
    {
      schoolCode: 'D125320600026',
      schoolName: '綾羽高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 185 }],
      totalCapacity: 185,
      source: {
        ...SOURCE,
        docTitle:
          SOURCE.docTitle + '(全日制のみ。別途定時制課程(普通40+食物調理40=80名)・通信制課程(普通105名)は別課程のため対象外)',
      },
    },
    {
      schoolCode: 'D125320700016',
      schoolName: '立命館守山高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 160 }],
      totalCapacity: 160,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '(全日制・アカデメイア/グローバル/フロンティアの3コース制だがコース別定員は非公表)',
      },
    },
    {
      schoolCode: 'D125321300018',
      schoolName: '滋賀学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 200 },
        { courseName: '看護科', capacity: 40 },
      ],
      totalCapacity: 240,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '(全日制)' },
    },
  ],
  skipped: [
    {
      schoolCode: 'D125321200028',
      schoolName: 'ＥＣＣ学園高等学校',
      reason:
        '全日制課程を持たない広域通信制・単位制専門校のため、県の「私立学校生徒募集概要」PDF(全日制対象)に掲載が無く募集定員を確認できず。',
    },
    {
      schoolCode: 'D125321300027',
      schoolName: '司学館高等学校',
      reason:
        '全日制課程を持たない通信制・単位制専門校のため、県の「私立学校生徒募集概要」PDF(全日制対象)に掲載が無く募集定員を確認できず。',
    },
  ],
};
