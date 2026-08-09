/**
 * 鳥取県私立高等学校の募集定員データ（Λ-5第二段・手動収集）。
 * schools-private/tottori.ts（第一段・機械生成の参照台帳）8校のうち、
 * 公式募集要項PDFで最新年度の定員を確度高く確認できた学校のみ収録。
 * 残りは正直にスキップ台帳へ（[[fable5-fullaccel-backlog-2026-07]]のΛ-5進捗ノート参照）。
 *
 * 【掛-2（私立×多年度）追加】既存4校のうち米子松蔭・鳥取城北について過去年度の募集要項も
 * 発見できたため、fiscalYearLabelを変えた追加レコードとしてschools配列に収録した（同一
 * schoolCodeが複数回出現する設計・掛-1/掛-3の多年度拡張と同型）。米子松蔭R7(2025年度)は
 * コース構成・定員ともR8と完全に同一（4コース合計255名）、鳥取城北R6(令和6年度)も
 * R8と完全に同一（普通科400名・コース別内訳非公開）だった。「定員に変更が無かった」という
 * 事実自体も掛-4的な意味で資産になるため、変更の有無にかかわらず正直に記録する。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_TOTTORI: PrivateSchoolDetailFile = {
  prefectureCode: 'tottori',
  schools: [
    {
      schoolCode: 'D131310000025',
      schoolName: '鳥取城北高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科（研志コース・志学コース・スポーツ科学コース）', capacity: 400 }],
      totalCapacity: 400,
      source: {
        url: 'https://www.tottori-johoku.ed.jp/data/wyg/files/令和8年度募集要項.pdf',
        docTitle: '令和8年度 募集要項（鳥取城北高等学校）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D131310000052',
      schoolName: '米子松蔭高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特別進学コースα', capacity: 30 },
        { courseName: '特別進学コースβ', capacity: 30 },
        { courseName: '進学コース', capacity: 35 },
        { courseName: '総合選択コース', capacity: 160 },
      ],
      totalCapacity: 255,
      source: {
        url: 'https://www.yonagoshoin.ed.jp/wp-content/uploads/2025/10/c923376d670203920894703c345cb93c.pdf',
        docTitle: '2026年度 生徒募集要項（米子松蔭高等学校）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D131310000070',
      schoolName: '湯梨浜学園高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [{ courseName: '特別進学コース（全日制）', capacity: 10 }],
      totalCapacity: 10,
      source: {
        url: 'https://www.yurihamagakuen.ac.jp/admission/high/',
        docTitle: '高等学校（全日制）募集要項（湯梨浜学園中学校・高等学校）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D131310000016',
      schoolName: '鳥取敬愛高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別進学コース', capacity: 80 },
        { courseName: '普通科 特別進学II類グローバルコース', capacity: 60 },
        { courseName: '普通科 進学キャリアコース', capacity: 120 },
        { courseName: '普通科 総合コース', capacity: 40 },
      ],
      totalCapacity: 300,
      source: {
        url: 'https://t-ki.jp/pages/20/',
        docTitle: '入試情報（鳥取敬愛高等学校）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D131310000052',
      schoolName: '米子松蔭高等学校',
      fiscalYearLabel: '2025年度',
      courses: [
        { courseName: '特別進学コースα', capacity: 30 },
        { courseName: '特別進学コースβ', capacity: 30 },
        { courseName: '進学コース', capacity: 35 },
        { courseName: '総合選択コース', capacity: 160 },
      ],
      totalCapacity: 255,
      source: {
        url: 'https://www.yonagoshoin.ed.jp/wp-content/uploads/2024/10/2ede262fadf3fe07cf15c00134ecec68.pdf',
        docTitle: '米子松蔭高等学校 2025年度生徒募集要項「1 学科・コースと募集定員およびコースの特徴」（掛-2・2026年度版と完全に同一の4コース構成・定員）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D131310000025',
      schoolName: '鳥取城北高等学校',
      fiscalYearLabel: '令和6年度',
      courses: [{ courseName: '普通科（研志コース・志学コース・スポーツ科学コース）', capacity: 400 }],
      totalCapacity: 400,
      source: {
        url: 'https://www.tottori-johoku.ed.jp/data/wyg/files/R6%E5%8B%9F%E9%9B%86%E8%A6%81%E9%A0%85%E4%BF%AE%E6%AD%A3%E7%89%88(%E6%8A%9C%E7%B2%8B).pdf',
        docTitle: '鳥取城北高等学校 令和6年度募集要項「1 募集学科（コース）・入学定員」（掛-2・令和8年度版と完全に同一の普通科400名・コース別内訳非公開）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D131310000034',
      schoolName: '倉吉北高等学校',
      reason:
        '公式サイトの入試情報ページ(kurayoshikita-h.ed.jp/exam/)は「生徒募集要項をご確認ください」と案内するのみでPDFへの直接リンクがページ本文に見当たらず、WebSearchでも令和8年度版の直接URLを特定できなかったため見送り。',
    },
    {
      schoolCode: 'D131310000043',
      schoolName: '米子北高等学校',
      reason:
        '「令和8年度 生徒募集要項」PDF(https://www.yonagokita.ed.jp/wp-content/uploads/2025/11/5ee48b95cef1bd31afb6b405f39053bc-1.pdf)への直接URLは特定できたが、全40頁でこの環境はpoppler未導入のためpages指定読み取りが機能せず内容確認に至らなかった(WebFetchも10MB超で拒否)。定員記載ページの位置が分からない限りこの環境では読了不可能なため見送り。',
    },
    {
      schoolCode: 'D131310000061',
      schoolName: '米子北斗高等学校',
      reason: '公式サイトの入試案内ページに定員の記載が無く、募集要項PDFの直接URLも特定できなかったため見送り。',
    },
    {
      schoolCode: 'D131310000089',
      schoolName: '青翔開智高等学校',
      reason:
        '検索結果に令和9年度(次年度)入試の情報が混在しており、令和8年度の募集定員を正確に切り分けて確認できなかったため見送り。',
    },
  ],
};
