/**
 * 三重県私立高等学校の募集定員データ(Λ-5第二段)。
 * 三重県私学協会が公表する「令和9年度(2027年度)私立高等学校生徒募集定員」PDF(全日制表・通信制表が
 * 同一ページの左右に併記された1枚)から、全日制13校を1周回で完全収録。令和8年度分の一覧は協会サイト
 * から既に削除されており(令和8年度入試は既に終了済み)、現在公表されている最新版である令和9年度
 * (2027年度入学)の値をfiscalYearLabelにそのまま記録する。13校のcourses合計を積み上げた総計が原資料
 * の合計欄「3,760(13校)」と完全一致することを検算済み(佐賀/富山/栃木/静岡/福岡/長野/岐阜に続く完全
 * 収録パターン)。
 * **2026-08-04追記**: 当初WebFetchのテキスト要約では見落としていたが、同一PDFページの右側に通信制表
 * (合計855・6校)が併記されていることをReadツールでの直接読み取りで発見し、大橋学園/徳風/一志学園/
 * 英心(伊勢本校)/英心桔梗が丘校の5校を追加収録(四日市メリノール学院と皇學館は通信制表にも登場するが
 * 既に全日制枠で収録済みの同一校のため二重登録せず据え置き)。代々木/神村学園高等部伊賀分校/みえ大台
 * おおぞら高等学校(広域通信制)の3校は私学協会の通信制表に掲載が無く(県私学協会に加盟していない広域
 * 通信制校の可能性)、今回は対象外とし未着手のまま残す。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_MIE: PrivateSchoolDetailFile = {
  prefectureCode: 'mie',
  schools: [
    {
      schoolCode: 'D124310055019',
      schoolName: '津田学園高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 320 }],
      totalCapacity: 320,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055028',
      schoolName: '暁高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 430 }],
      totalCapacity: 430,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055046',
      schoolName: '四日市メリノール学院高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 140 }],
      totalCapacity: 140,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055037',
      schoolName: '海星高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科(ダブルディプロマコース含む)', capacity: 290 }],
      totalCapacity: 290,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055055',
      schoolName: '鈴鹿高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科(中等教育学校後期課程含む)', capacity: 470 }],
      totalCapacity: 470,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055064',
      schoolName: '高田高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 560 }],
      totalCapacity: 560,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055073',
      schoolName: 'セントヨゼフ女子学園高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 125 }],
      totalCapacity: 125,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055091',
      schoolName: '三重高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 530 }],
      totalCapacity: 530,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055108',
      schoolName: '皇學館高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 315 }],
      totalCapacity: 315,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055117',
      schoolName: '伊勢学園高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 230 }],
      totalCapacity: 230,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055126',
      schoolName: '愛農学園農業高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '農業科', capacity: 25 }],
      totalCapacity: 25,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055135',
      schoolName: '桜丘高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 155 }],
      totalCapacity: 155,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310055082',
      schoolName: '青山高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通科', capacity: 170 }],
      totalCapacity: 170,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(全日制)｜三重県私学協会(学校別募集定員表・合計3,760(13校)と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310059015',
      schoolName: '大橋学園高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [
        { courseName: '普通(狭域)一般通信生', capacity: 175 },
        { courseName: '普通(狭域)技能連携生', capacity: 80 },
      ],
      totalCapacity: 255,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(通信制)｜三重県私学協会(全日制と同一PDFの右側表・合計855(6校)の内訳)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310059024',
      schoolName: '徳風高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [
        { courseName: '普通(広域)一般通信生', capacity: 20 },
        { courseName: '普通(広域)高専併修生', capacity: 220 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(通信制)｜三重県私学協会(全日制と同一PDFの右側表・合計855(6校)の内訳)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310059033',
      schoolName: '一志学園高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通(狭域)一般通信生', capacity: 40 }],
      totalCapacity: 40,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(通信制)｜三重県私学協会(全日制と同一PDFの右側表・合計855(6校)の内訳)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310059042',
      schoolName: '英心高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（表記は「英心(伊勢本校)」）',
      courses: [{ courseName: '普通(狭域)一般通信生(伊勢本校)', capacity: 110 }],
      totalCapacity: 110,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(通信制)｜三重県私学協会(全日制と同一PDFの右側表・合計855(6校)の内訳)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D124310059079',
      schoolName: '英心高等学校桔梗が丘校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '普通(狭域)一般通信生(桔梗が丘校)', capacity: 60 }],
      totalCapacity: 60,
      source: {
        url: 'https://www.mie-shigaku.jp/files/libs/1003/202607271318471425.pdf',
        docTitle: '令和9年度(2027年度)私立高等学校生徒募集定員(通信制)｜三重県私学協会(全日制と同一PDFの右側表・合計855(6校)の内訳)',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [],
};
