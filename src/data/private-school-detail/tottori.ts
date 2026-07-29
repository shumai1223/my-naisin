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
  ],
  skipped: [
    {
      schoolCode: 'D131310000016',
      schoolName: '鳥取敬愛高等学校',
      reason:
        '公式サイト(t-ki.jp)に募集要項PDFへの直接リンクが見当たらず、WebSearch要約は令和6年度(200名)の古い情報のみで最新年度の確証が取れなかったため見送り。',
    },
    {
      schoolCode: 'D131310000034',
      schoolName: '倉吉北高等学校',
      reason:
        'WebSearch要約は令和6年度(特別進学35名・総合コース105名・調理科25名)の情報のみで、令和8年度版の確証が取れなかったため見送り。',
    },
    {
      schoolCode: 'D131310000043',
      schoolName: '米子北高等学校',
      reason:
        '公式サイトに「令和8年度 生徒募集要項」PDFへのリンクは確認できたが、WebFetchがPDFバイナリを解析できずページ本文にも定員の記載が無かったため見送り(次回はPDFを直接Read toolで開く方法を推奨)。',
    },
    {
      schoolCode: 'D131310000061',
      schoolName: '米子北斗高等学校',
      reason: '公式サイトの入試案内ページに定員の記載が無く、募集要項PDFの直接URLも特定できなかったため見送り。',
    },
    {
      schoolCode: 'D131310000070',
      schoolName: '湯梨浜学園高等学校',
      reason:
        '全日制・通信制それぞれの募集要項ページへのリンクは確認したが、定員の具体的な記載がページ本文になく問い合わせ推奨とされていたため見送り。',
    },
    {
      schoolCode: 'D131310000089',
      schoolName: '青翔開智高等学校',
      reason:
        '検索結果に令和9年度(次年度)入試の情報が混在しており、令和8年度の募集定員を正確に切り分けて確認できなかったため見送り。',
    },
  ],
};
