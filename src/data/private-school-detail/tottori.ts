/**
 * 鳥取県私立高等学校の募集定員データ（Λ-5第二段・手動収集）。
 * schools-private/tottori.ts（第一段・機械生成の参照台帳）8校のうち、
 * 公式募集要項PDFで最新年度の定員を確度高く確認できた学校のみ収録。
 * 残りは正直にスキップ台帳へ（[[fable5-fullaccel-backlog-2026-07]]のΛ-5進捗ノート参照）。
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
