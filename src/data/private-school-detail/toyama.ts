/**
 * 【掛-2（私立×多年度）追加】協会の一覧PDF(bosyu_ko.pdf)は年度ごとにURLを変えず同じURLを
 * 上書き更新する方式のため、令和7年度版はWebSearchで発見できなかった。Wayback Machine CDX APIで
 * 全スナップショットを確認したところ令和7年度の時期(2024年秋〜2025年始)は一度もクロールされて
 * おらず、代わりに2023年3月のスナップショット（令和5年度＜推薦入試＞版）のみが利用可能だった。
 * 3年分遡ることになるが、これも正直な多年度データとして収録する。ほとんどの学校で「推薦含む/
 * 推薦XX%程度」という注記付きの数値が学校全体の募集定員（推薦入試はその一部という位置づけ）と
 * 確認できたため令和8年度の記録と直接比較できるが、片山学園（コース名が令和5年度は「3年制進学
 * コース」で令和8年度は単純に「普通科」と異なる）と高岡龍谷（令和5年度は調理科40名が別途存在し
 * 令和8年度は普通科のみ）は収録範囲が変わった可能性があるため比較を保留し、noteで正直に注記した。
 */

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
  sourceTier: 'primary' as const,
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
    {
      schoolCode: 'D116320156016',
      schoolName: '不二越工業高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [{ courseName: '情報機械科', capacity: 140 }],
      totalCapacity: 140,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。「推薦含む」と注記された学校全体の募集定員。令和8年度の135名から140→135で5名減少）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D116320156025',
      schoolName: '龍谷富山高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [{ courseName: '普通科', capacity: 260 }],
      totalCapacity: 260,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。「推薦60%程度」と注記された学校全体の募集定員。令和8年度の300名から260→300で40名増加）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D116320156034',
      schoolName: '富山第一高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [{ courseName: '普通科', capacity: 395 }],
      totalCapacity: 395,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。「推薦含む」と注記された学校全体の募集定員。令和8年度の400名から395→400で5名増加）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D116320156043',
      schoolName: '高朋高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [{ courseName: '普通科', capacity: 100 }],
      totalCapacity: 100,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。「推薦75%程度」と注記された学校全体の募集定員。令和8年度の90名から100→90で10名減少）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D116320156052',
      schoolName: '富山国際大学付属高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [{ courseName: '普通科', capacity: 250 }],
      totalCapacity: 250,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。「推薦約30%」と注記された学校全体の募集定員。令和8年度の250名と完全に同一）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D116320256015',
      schoolName: '学校法人高岡第一学園高岡第一高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [{ courseName: '普通科', capacity: 245 }],
      totalCapacity: 245,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。「推薦50%程度」と注記された学校全体の募集定員。令和8年度の230名から245→230で15名減少）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D116320256024',
      schoolName: '高岡向陵高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [{ courseName: '普通科', capacity: 175 }],
      totalCapacity: 175,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。「推薦50%程度」と注記された学校全体の募集定員。令和8年度の220名から175→220で45名増加）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D116320456013',
      schoolName: '新川高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [{ courseName: '普通科', capacity: 120 }],
      totalCapacity: 120,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。「推薦50%」と注記された学校全体の募集定員。令和8年度の90名から120→90で30名減少）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D116320256033',
      schoolName: '高岡龍谷高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [
        { courseName: '普通科', capacity: 145 },
        { courseName: '調理科', capacity: 40 },
      ],
      totalCapacity: 185,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。普通科145名(推薦含む)+調理科40名(推薦70%程度・専願のみ)。⚠️令和8年度レコードは普通科180名のみで調理科の記載が無く、両年度で学科構成自体が変わった可能性があるため単純な定員比較は保留する）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D116320156061',
      schoolName: '片山学園高等学校',
      fiscalYearLabel: '令和5年度',
      courses: [{ courseName: '3年制進学コース', capacity: 32 }],
      totalCapacity: 32,
      source: {
        url: 'https://web.archive.org/web/20230325172423if_/http://www.toyama-shigaku.or.jp/shigaku/pdf/bosyu_ko.pdf',
        docTitle: '令和5年度富山県私立高等学校生徒募集要項（概要）一覧＜推薦入試＞（富山県私立中学高等学校協会・Wayback Machine 2023-03-25キャプチャ。「3年制進学コース32名(推薦含む)」。⚠️令和8年度レコードは「普通科105名(中学からの連絡入学を含む)」で、コース名・収録範囲(中学からの連絡入学の扱い)が異なる可能性が高いため単純な定員比較は保留する）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [],
};
