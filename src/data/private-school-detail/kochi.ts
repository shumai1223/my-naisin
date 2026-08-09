/**
 * 高知県私立高等学校の募集定員データ（Λ-5第二段）。
 * schools-private/kochi.ts（第一段・機械生成の参照台帳）9校のうち、
 * 高知県私立中学高等学校連合会が公表する令和8年度募集要項一覧（一般入試/推薦入試の2枚組・
 * 令和7年10月14日現在）から、総定員が確度高く確認できた学校のみ収録。
 *
 * 【設計上の注意】このリーフレットは学校によって「推薦・一般入試合計◯名」と明記する場合と、
 * 推薦枠/一般枠を別々の数字で示す場合が混在する。後者は2つの数字を独自に合算すると誤りうる
 * ため（推薦枠が一般枠の内数である可能性を排除できない）、以下の場合のみ収録する。
 * ①「推薦・一般入試合計」と原資料が明記している学校（太平洋学園・土佐塾の該当学科）
 * ②推薦入試リーフレットに学校名が一切登場せず、一般入試枠のみが公表されている学校
 * 　（推薦ルートが存在しないと合理的に推定できるため、一般入試の定員がそのまま総定員となる。
 * 　高知学芸・土佐高等学校が該当）
 * それ以外（推薦枠・一般枠が別々の数字で併記され合計の明記が無い学校）は正直にスキップする。
 *
 * 【掛-2（私立×多年度）追加】同じ連合会が公表する令和7年度版の同種リーフレット
 * （kochishiritsu_r07_entranceexamination_03.pdf）を発見。既存4校（太平洋学園・土佐塾・
 * 高知学芸・土佐高等学校）全てについて、令和8年度と定員が完全に同一だった（PyMuPDFで
 * ビジョン解析・pdftoppmはCJKフォント埋め込み欠損で空白画像を返したためPyMuPDF
 * フォールバックを使用）。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const KAKE2_R7_SOURCE = {
  url: 'https://kochi-shiritsuchuko.com/pdf/kochishiritsu_r07_entranceexamination_03.pdf',
  docTitle: '令和7年度 高知県私立高等学校 募集要項一覧［一般入試］（高知県私立中学高等学校連合会・令和6年10月1日現在）',
  fetchedAt: '2026-08-09',
  sourceTier: 'primary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_KOCHI: PrivateSchoolDetailFile = {
  prefectureCode: 'kochi',
  schools: [
    {
      schoolCode: 'D139310000090',
      schoolName: '太平洋学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '総合学科（定時制）', capacity: 80 },
        { courseName: '総合学科（通信制）', capacity: 90 },
      ],
      totalCapacity: 170,
      source: {
        url: 'https://kochi-shiritsuchuko.com/pdf/kochishiritsu_r08_entranceexamination_03.pdf',
        docTitle: '令和8年度 高知県私立高等学校 募集要項一覧［一般入試］（高知県私立中学高等学校連合会・令和7年10月14日現在、各学科とも「推薦・一般入試合計」と明記）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D139310000081',
      schoolName: '土佐塾高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 45 },
        { courseName: 'まなび創造コース', capacity: 10 },
      ],
      totalCapacity: 55,
      source: {
        url: 'https://kochi-shiritsuchuko.com/pdf/kochishiritsu_r08_entranceexamination_03.pdf',
        docTitle: '令和8年度 高知県私立高等学校 募集要項一覧［一般入試］（高知県私立中学高等学校連合会・令和7年10月14日現在。普通科は「推薦・一般入試合計45名」と明記、まなび創造コースは推薦入試リーフレットに登場せず一般入試枠のみのため定員10名程度がそのまま総定員）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D139310000054',
      schoolName: '高知学芸高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 30 }],
      totalCapacity: 30,
      source: {
        url: 'https://kochi-shiritsuchuko.com/pdf/kochishiritsu_r08_entranceexamination_03.pdf',
        docTitle: '令和8年度 高知県私立高等学校 募集要項一覧［一般入試］（高知県私立中学高等学校連合会・令和7年10月14日現在。「約30名」・推薦入試リーフレットに高知学芸高等学校の記載が無く推薦ルートが存在しないと推定されるため一般入試枠がそのまま総定員）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D139310000018',
      schoolName: '土佐高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科（S方式・H方式合計）', capacity: 50 }],
      totalCapacity: 50,
      source: {
        url: 'https://kochi-shiritsuchuko.com/pdf/kochishiritsu_r08_entranceexamination_03.pdf',
        docTitle: '令和8年度 高知県私立高等学校 募集要項一覧［一般入試］（高知県私立中学高等学校連合会・令和7年10月14日現在。「約50名(S方式・H方式合計)」・推薦入試リーフレットに土佐高等学校の記載が無く推薦ルートが存在しないと推定されるため一般入試枠がそのまま総定員）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D139310000090',
      schoolName: '太平洋学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '総合学科（定時制）', capacity: 80 },
        { courseName: '総合学科（通信制）', capacity: 90 },
      ],
      totalCapacity: 170,
      source: { ...KAKE2_R7_SOURCE, docTitle: KAKE2_R7_SOURCE.docTitle + '（各学科とも「推薦・一般入試合計」と明記・令和8年度と完全に同一）' },
    },
    {
      schoolCode: 'D139310000081',
      schoolName: '土佐塾高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科', capacity: 45 },
        { courseName: 'まなび創造コース', capacity: 10 },
      ],
      totalCapacity: 55,
      source: { ...KAKE2_R7_SOURCE, docTitle: KAKE2_R7_SOURCE.docTitle + '（普通科は「推薦・一般入試合計45名」と明記、まなび創造コースは「10名程度」・令和8年度と完全に同一）' },
    },
    {
      schoolCode: 'D139310000054',
      schoolName: '高知学芸高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 30 }],
      totalCapacity: 30,
      source: { ...KAKE2_R7_SOURCE, docTitle: KAKE2_R7_SOURCE.docTitle + '（「約30名」・令和8年度と完全に同一）' },
    },
    {
      schoolCode: 'D139310000018',
      schoolName: '土佐高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科（S方式・H方式合計）', capacity: 50 }],
      totalCapacity: 50,
      source: { ...KAKE2_R7_SOURCE, docTitle: KAKE2_R7_SOURCE.docTitle + '（「約50名(S方式・H方式合計)」・令和8年度と完全に同一）' },
    },
  ],
  skipped: [
    {
      schoolCode: 'D139310000036',
      schoolName: '高知高等学校',
      reason:
        '普通科について一般入試枠(30名程度)・推薦枠(70名程度)・高知キャリア特色入試枠(30名程度)が別々に公表され、「推薦・一般入試合計」のような総定員の明記が原資料に無いため、独自に合算せず見送り。',
    },
    {
      schoolCode: 'D139310000045',
      schoolName: '清和女子高等学校',
      reason:
        '高知県私立中学高等学校連合会の令和8年度募集要項一覧（一般入試・推薦入試とも）に学校名の記載が見当たらず、個別の公式サイト調査が必要なため見送り。',
    },
    {
      schoolCode: 'D139310000063',
      schoolName: '高知中央高等学校',
      reason:
        '普通科(推薦120名・一般40名)、看護学科(推薦20名・一般20名)がそれぞれ別々の数字で公表され、「推薦・一般入試合計」のような総定員の明記が原資料に無いため、独自に合算せず見送り。',
    },
    {
      schoolCode: 'D139310000072',
      schoolName: '明徳義塾高等学校',
      reason:
        '普通科について県内推薦枠(20名)・一般入試(県外)枠(60名)・一般入試(一般)枠(70名)という複数の地域別募集枠が別々に公表され、総定員の明記が原資料に無いため、独自に合算せず見送り。',
    },
    {
      schoolCode: 'D139310000027',
      schoolName: '土佐女子高等学校',
      reason:
        '普通科について一般入試枠(約25名)・推薦枠(約20名・専願)が別々に公表され、「推薦・一般入試合計」のような総定員の明記が原資料に無いため、独自に合算せず見送り。',
    },
  ],
};
