/**
 * 愛媛県私立高等学校の募集定員データ（Λ-5第二段・手動収集）。
 * schools-private/ehime.ts（第一段・機械生成の参照台帳）14校のうち、
 * 公式募集要項PDFで最新年度の定員を確度高く確認できた学校のみ収録。
 * 残りは正直にスキップ台帳へ（[[fable5-fullaccel-backlog-2026-07]]のΛ-5進捗ノート参照）。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_EHIME: PrivateSchoolDetailFile = {
  prefectureCode: 'ehime',
  schools: [
    {
      schoolCode: 'D138320100062',
      schoolName: '愛光高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [{ courseName: '募集人員（内進生含め・コース分けなし）', capacity: 250 }],
      totalCapacity: 250,
      source: {
        url: 'https://www.aiko.ed.jp/admission/ar_high/youkou2026.pdf',
        docTitle: '令和8年度（2026年度）愛光高等学校 入学試験要項',
        fetchedAt: '2026-08-03',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320100026',
      schoolName: '聖カタリナ学園高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        {
          courseName: '普通科（文理特進・国際特進・スポーツ・総合の4コース合算）',
          capacity: 400,
        },
        { courseName: '看護科', capacity: 80 },
      ],
      totalCapacity: 480,
      source: {
        url: 'https://catalina.ed.jp/wp-content/themes/catalina-hs/pdf/bosyuyoukou202510.pdf',
        docTitle: '令和8年度 募集要項（聖カタリナ学園高等学校）',
        fetchedAt: '2026-08-03',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D138320700011',
      schoolName: '帝京第五高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        { courseName: '普通科', capacity: 40 },
        { courseName: '看護科', capacity: 40 },
        { courseName: '総合学科', capacity: 120 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://teikyo5-h.ed.jp/wp-content/uploads/2026/05/yoko2026.pdf',
        docTitle: '2026(令和8)年度 入学試験要項（Web出願）（帝京第五高等学校）',
        fetchedAt: '2026-08-03',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D138320100017',
      schoolName: '済美高等学校',
      reason:
        '公式サイトの受験案内ページ(saibi.ac.jp/entrance/exam-info/)に募集人員の記載はあるが画像(SVG)形式で埋め込まれておりテキスト抽出できず、募集要項の直接PDFも特定できなかったため見送り。',
    },
    {
      schoolCode: 'D138320100053',
      schoolName: '新田高等学校',
      reason:
        '公式サイトの募集予定人数表(nitta.ac.jp/admission/examination/#cont_03)がHTML→テキスト変換で推薦/一般の数値が矛盾して抽出され確度高く読み取れず、募集要項の直接PDFリンクも特定できなかったため見送り。',
    },
  ],
};
