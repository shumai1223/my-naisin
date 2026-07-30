/**
 * 富山県私立高等学校の募集定員データ（Λ-5第二段）。
 * 富山県私立中学高等学校協会が公表する「令和8年度富山県私立高等学校生徒募集要項
 * （概要）一覧＜全日制・推薦入試＞」PDFに、県内私立10校全ての学科別募集人員が
 * 1枚の一覧表にまとめられていた（佐賀県の県庁一覧・長崎県の協会一覧と同型の
 * 高効率パターン・10校全てを1回のダウンロードで完全収録できた初のケース）。
 *
 * 【注意】高岡龍谷高等学校は同協会の別表(＜通信制＞)で普通科80名の通信制課程も
 * 公表しているが、これは全日制本体(D116320256033・普通科180名)とは別課程のため
 * 対象外とする(全日制のみ収録)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
  docTitle: '令和8年度富山県私立高等学校生徒募集要項（概要）一覧＜全日制＞（富山県私立中学高等学校協会）',
  fetchedAt: '2026-07-30',
};

export const PRIVATE_SCHOOL_DETAIL_TOYAMA: PrivateSchoolDetailFile = {
  prefectureCode: 'toyama',
  schools: [
    {
      schoolCode: 'D116320156016',
      schoolName: '不二越工業高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '情報機械科', capacity: 135 }],
      totalCapacity: 135,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '（推薦入試分を含む）' },
    },
    {
      schoolCode: 'D116320156025',
      schoolName: '龍谷富山高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 300 }],
      totalCapacity: 300,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '（推薦入試分を含む）' },
    },
    {
      schoolCode: 'D116320156034',
      schoolName: '富山第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 400 }],
      totalCapacity: 400,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '（推薦入試分を含む）' },
    },
    {
      schoolCode: 'D116320156043',
      schoolName: '高朋高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 90 }],
      totalCapacity: 90,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '（推薦約75%程度を含む）' },
    },
    {
      schoolCode: 'D116320156052',
      schoolName: '富山国際大学付属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 250 }],
      totalCapacity: 250,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '（推薦約30%程度を含む）' },
    },
    {
      schoolCode: 'D116320156061',
      schoolName: '片山学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 105 }],
      totalCapacity: 105,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '（中学からの連絡入学を含む）' },
    },
    {
      schoolCode: 'D116320256015',
      schoolName: '学校法人高岡第一学園高岡第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 230 }],
      totalCapacity: 230,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '（推薦約70%程度を含む）' },
    },
    {
      schoolCode: 'D116320256024',
      schoolName: '高岡向陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 220 }],
      totalCapacity: 220,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '（推薦約50%程度を含む）' },
    },
    {
      schoolCode: 'D116320256033',
      schoolName: '高岡龍谷高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 180 }],
      totalCapacity: 180,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '（推薦入試分を含む・全日制のみ。別途通信制課程普通科80名は別課程のため対象外）',
      },
    },
    {
      schoolCode: 'D116320456013',
      schoolName: '新川高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 90 }],
      totalCapacity: 90,
      source: { ...SOURCE, docTitle: SOURCE.docTitle + '（推薦約50%程度を含む）' },
    },
  ],
  skipped: [],
};
