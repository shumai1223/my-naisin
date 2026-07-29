/**
 * 山梨県私立高等学校の募集定員データ（Λ-5第二段・手動収集）。
 * schools-private/yamanashi.ts（第一段・機械生成の参照台帳）11校のうち、
 * 公式募集要項PDFで最新年度の定員を確度高く確認できた学校のみ収録。
 * 残りは正直にスキップ台帳へ。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_YAMANASHI: PrivateSchoolDetailFile = {
  prefectureCode: 'yamanashi',
  schools: [
    {
      schoolCode: 'D119310000030',
      schoolName: '駿台甲府高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科（コア・スーパーコース・アスリートコース）', capacity: 270 }],
      totalCapacity: 270,
      source: {
        url: 'https://www.sundai-kofu.ed.jp/high/info/pdf/2025/R8_enrty-guidline_high.pdf',
        docTitle: '令和8年度 生徒募集要項（駿台甲府高等学校・全日制課程普通科）',
        fetchedAt: '2026-07-30',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D119310000012',
      schoolName: '山梨英和高等学校',
      reason:
        'WebSearch要約は令和7年度(120名・女子)の情報のみで、令和8年度版の確証が取れなかったため見送り。',
    },
    {
      schoolCode: 'D119310000021',
      schoolName: '甲斐清和高等学校',
      reason: '公式サイト(入試案内)に学科構成(普通科進学・総合コース/音楽科)は確認できたが、具体的な定員数が見当たらなかったため見送り。',
    },
    {
      schoolCode: 'D119310000049',
      schoolName: '山梨学院高等学校',
      reason:
        '学校公式サイトが既に令和9年度(2027年4月入学)の募集情報に切り替わっており、「普通科430名(推薦入試・内部進学生を含む)」という総定員は確認できたが令和8年度分ではなく年度が一致しないため見送り。',
    },
    {
      schoolCode: 'D119310000058',
      schoolName: '東海大学付属甲府高等学校',
      reason: '募集要項PDFの直接URLを特定できず、公式サイトにも具体的な定員数の記載が見当たらなかったため見送り。',
    },
    {
      schoolCode: 'D119310000067',
      schoolName: '日本航空高等学校',
      reason: '全国募集を行う広域通信制・多学科の大規模校で公式サイトの定員記載が複雑なため今回は見送り。',
    },
    {
      schoolCode: 'D119310000085',
      schoolName: '身延山高等学校',
      reason: '募集要項PDFの直接URLを特定できず、公式サイトにも具体的な定員数の記載が見当たらなかったため見送り。',
    },
    {
      schoolCode: 'D119310000094',
      schoolName: '日本大学明誠高等学校',
      reason: '募集要項PDFの直接URLを特定できず、公式サイトにも具体的な定員数の記載が見当たらなかったため見送り。',
    },
    {
      schoolCode: 'D119310000101',
      schoolName: '富士学苑高等学校',
      reason: '募集要項PDFの直接URLを特定できず、公式サイトにも具体的な定員数の記載が見当たらなかったため見送り。',
    },
    {
      schoolCode: 'D119310000110',
      schoolName: '自然学園高等学校',
      reason: '募集要項PDFの直接URLを特定できず、公式サイトにも具体的な定員数の記載が見当たらなかったため見送り。',
    },
    {
      schoolCode: 'D119310000129',
      schoolName: '帝京第三高等学校',
      reason: '募集要項PDFの直接URLを特定できず、公式サイトにも具体的な定員数の記載が見当たらなかったため見送り。',
    },
  ],
};
