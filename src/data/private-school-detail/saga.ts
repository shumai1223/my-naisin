/**
 * 佐賀県私立高等学校の募集定員データ（Λ-5第二段）。
 * schools-private/saga.ts（第一段・機械生成の参照台帳）9校全てを、佐賀県庁法務私学課が
 * 公表する「令和8年度佐賀県私立高等学校生徒募集関係一覧」PDF（学校ごとの募集定員を一枚に
 * まとめた一次資料）から収録できた。県内私立9校が漏れなく1枚のPDFに収録されている点が
 * 高知県の連合会リーフレットと同型で、私立校detail収集としては初めて1県まるごと収録できた
 * ケース（鳥取4/8・福井0/8・山梨1/11・高知4/9は部分収録止まり）。
 *
 * 【重要な発見】民間団体（佐賀県私立中学高等学校協会）の公式サイトが同種の一覧を掲載して
 * いたが、佐賀学園（協会サイト265名 vs 県庁PDF令和8年度260名）・北陵（協会サイト220名 vs
 * 県庁PDF令和8年度215名、ただし令和7年度は220名で一致）で数値の齟齬を検知した。協会サイトは
 * 表記上「令和9年度」を謳いつつ実際には旧年度の数値が混在している可能性があり、県庁が発行する
 * 一次資料（年度を明記し前年度比較列も併記）を優先して採用する。
 *
 * 佐賀清和・佐賀女子・佐賀学園・北陵はコース別内訳が原資料で複数列にまたがり視覚解析で厳密な
 * 対応付けが困難だったため、内訳を無理に分解せず総定員のみを収録する（courses=[]で正直に記録）。
 * 龍谷・敬徳・弘学館・東明館・早稲田佐賀はコース構成が明瞭なため内訳も収録した。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.pref.saga.lg.jp/kiji003114984/3_114984_362628_up_08o4sh8m.pdf',
  docTitle: '令和8年度佐賀県私立高等学校生徒募集関係一覧（佐賀県庁法務私学課私立中高・専修学校支援室）',
  fetchedAt: '2026-07-30',
  sourceTier: 'primary' as const,
};

/**
 * 【掛-2（私立×多年度）追加】県庁法務私学課が公表する「令和7年度佐賀県私立高等学校 志願状況」
 * （様式1・令和7年1月28日現在）は志願者数と並べて募集定員も掲載しており、9校全てを1回で
 * 多年度化できた。footnoteに「募集定員は、佐賀清和・弘学館・早稲田佐賀は併設中学校以外から
 * 募集する数であり、龍谷・佐賀学園・東明館は併設中学校から募集する数を含む」と明記されており、
 * 令和8年度側の既存レコードも同じ内部/外部区分でtotalCapacityを記録している学校が複数あるため、
 * 各レコードのnoteで区分を明示した。**佐賀清和・佐賀学園・北陵の3校は令和7→令和8年度で実際に
 * 定員が変化していた**（掛-2で初めて発見した「変更あり」の実例）。
 */
const KAKE2_R7_SOURCE = {
  url: 'https://www.pref.saga.lg.jp/kiji003111567/3_111567_342278_up_3bbdku6z.pdf',
  docTitle: '令和7年度佐賀県私立高等学校 志願状況（様式1・佐賀県庁法務私学課私立中高・専修学校支援室・令和7年1月28日現在）',
  fetchedAt: '2026-08-09',
  sourceTier: 'primary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_SAGA: PrivateSchoolDetailFile = {
  prefectureCode: 'saga',
  schools: [
    {
      schoolCode: 'D141390000016',
      schoolName: '龍谷高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文理進学コース', capacity: 70 },
        { courseName: '総合コース', capacity: 130 },
        { courseName: '保育コース', capacity: 30 },
        { courseName: '特別進学コース', capacity: 40 },
      ],
      totalCapacity: 270,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '（270名程度・うち龍谷中学校以外からの募集は250名程度。学校公式サイトのコース別内訳(40+70+130+30=270)とも一致確認済み）',
      },
    },
    {
      schoolCode: 'D141390000025',
      schoolName: '佐賀清和高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '文化教養科', capacity: 70 },
        { courseName: '探究文理科', capacity: 105 },
        { courseName: '特別進学科S', capacity: 20 },
        { courseName: '特別進学科A', capacity: 60 },
        { courseName: '中高一貫', capacity: 40 },
        { courseName: '情報ビジネス科', capacity: 70 },
      ],
      totalCapacity: 365,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '（365名程度・うち佐賀清和中学校以外からの募集は325名程度）',
      },
    },
    {
      schoolCode: 'D141390000034',
      schoolName: '佐賀女子短期大学付属佐賀女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 295,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '（普通科複数コース(トータルビューティ/進学/美術/保育/メディカルケア/ファッション/ビジネス/カフェクリエイト等)+食物+衛生看護の合計295名。コース別内訳は原資料の列が入り組み厳密な対応付けが困難なため総定員のみ収録）',
      },
    },
    {
      schoolCode: 'D141390000043',
      schoolName: '佐賀学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 260,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '（特別進学科+普通科複数コース(進学/情報処理/商業等)の合計260名。コース別内訳は列が入り組み厳密な対応付けが困難なため総定員のみ収録。佐賀県私立中学高等学校協会サイトの「265名」は令和8年度の実際の値と不一致のため不採用）',
      },
    },
    {
      schoolCode: 'D141390000052',
      schoolName: '北陵高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 215,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '（電気情報/交通サービス/生活教養/ITの複数コース合計215名。コース別内訳は列が入り組み厳密な対応付けが困難なため総定員のみ収録。佐賀県私立中学高等学校協会サイトの「220名」は令和7年度の値と一致し令和8年度としては古い数値だったため不採用）',
      },
    },
    {
      schoolCode: 'D141390000061',
      schoolName: '敬徳高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 180 }],
      totalCapacity: 180,
      source: SOURCE,
    },
    {
      schoolCode: 'D141390000070',
      schoolName: '弘学館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 225 }],
      totalCapacity: 225,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '（うち弘学館中学校以外からの募集は90名程度）',
      },
    },
    {
      schoolCode: 'D141390000089',
      schoolName: '東明館高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 180 }],
      totalCapacity: 180,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '（うち東明館中学校からの進学者を含む）',
      },
    },
    {
      schoolCode: 'D141390000098',
      schoolName: '早稲田佐賀高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 240 }],
      totalCapacity: 240,
      source: {
        ...SOURCE,
        docTitle: SOURCE.docTitle + '（うち早稲田佐賀中学校以外からの募集は120名程度）',
      },
    },
    {
      schoolCode: 'D141390000016',
      schoolName: '龍谷高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '文理進学コース', capacity: 70 },
        { courseName: '総合コース', capacity: 130 },
        { courseName: '保育コース', capacity: 30 },
        { courseName: '特別進学コース', capacity: 40 },
      ],
      totalCapacity: 270,
      source: { ...KAKE2_R7_SOURCE, docTitle: KAKE2_R7_SOURCE.docTitle + '（計270・令和8年度と完全に同一）' },
    },
    {
      schoolCode: 'D141390000025',
      schoolName: '佐賀清和高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [],
      totalCapacity: 315,
      source: {
        ...KAKE2_R7_SOURCE,
        docTitle:
          KAKE2_R7_SOURCE.docTitle +
          '（計315・footnoteにより併設中学校以外からの募集数。令和8年度の365名(併設中学校以外は325名程度)と' +
          '比較すると325→315で外部募集数が10名減少しており、掛-2で発見した実際の定員変化の1例）',
      },
    },
    {
      schoolCode: 'D141390000034',
      schoolName: '佐賀女子短期大学付属佐賀女子高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [],
      totalCapacity: 295,
      source: { ...KAKE2_R7_SOURCE, docTitle: KAKE2_R7_SOURCE.docTitle + '（計295・令和8年度と完全に同一）' },
    },
    {
      schoolCode: 'D141390000043',
      schoolName: '佐賀学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [],
      totalCapacity: 255,
      source: {
        ...KAKE2_R7_SOURCE,
        docTitle:
          KAKE2_R7_SOURCE.docTitle +
          '（計255・footnoteにより併設中学校からの募集数を含む。令和8年度の260名と比較すると' +
          '255→260で5名増加しており、掛-2で発見した実際の定員変化の1例）',
      },
    },
    {
      schoolCode: 'D141390000052',
      schoolName: '北陵高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [],
      totalCapacity: 220,
      source: {
        ...KAKE2_R7_SOURCE,
        docTitle:
          KAKE2_R7_SOURCE.docTitle +
          '（計220・令和8年度の215名と比較すると220→215で5名減少しており、掛-2で発見した実際の定員変化の1例）',
      },
    },
    {
      schoolCode: 'D141390000061',
      schoolName: '敬徳高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 180 }],
      totalCapacity: 180,
      source: { ...KAKE2_R7_SOURCE, docTitle: KAKE2_R7_SOURCE.docTitle + '（普通科130+自動車整備科50=計180・令和8年度と完全に同一）' },
    },
    {
      schoolCode: 'D141390000070',
      schoolName: '弘学館高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 90 }],
      totalCapacity: 90,
      source: {
        ...KAKE2_R7_SOURCE,
        docTitle:
          KAKE2_R7_SOURCE.docTitle +
          '（90・footnoteにより併設中学校以外からの募集数のみ。令和8年度レコードのtotalCapacity(225)は' +
          '併設中学校からの募集を含む全体数のため直接比較できないが、外部募集数の副記(90名程度)とは一致）',
      },
    },
    {
      schoolCode: 'D141390000089',
      schoolName: '東明館高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 180 }],
      totalCapacity: 180,
      source: { ...KAKE2_R7_SOURCE, docTitle: KAKE2_R7_SOURCE.docTitle + '（計180・footnoteにより併設中学校からの募集を含む。令和8年度と完全に同一）' },
    },
    {
      schoolCode: 'D141390000098',
      schoolName: '早稲田佐賀高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 120 }],
      totalCapacity: 120,
      source: {
        ...KAKE2_R7_SOURCE,
        docTitle:
          KAKE2_R7_SOURCE.docTitle +
          '（120・footnoteにより併設中学校以外からの募集数のみ。令和8年度レコードのtotalCapacity(240)は' +
          '併設中学校からの募集を含む全体数のため直接比較できないが、外部募集数の副記(120名程度)とは一致）',
      },
    },
  ],
  skipped: [],
};
