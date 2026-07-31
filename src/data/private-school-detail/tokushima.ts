/**
 * 徳島県私立高等学校の募集定員データ（Λ-5第二段）。
 * schools-private/tokushima.ts（第一段・機械生成の参照台帳）5校のうち、確度高く確認できた
 * 3校を収録。徳島県には佐賀県のような県庁/連合会の一覧PDFが見当たらず、学校ごとの個別調査に
 * 戻っている。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_TOKUSHIMA: PrivateSchoolDetailFile = {
  prefectureCode: 'tokushima',
  schools: [
    {
      schoolCode: 'D136320100028',
      schoolName: '徳島文理高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 300,
      source: {
        url: 'http://www.bunri.ed.jp/admission/senior/',
        docTitle: '入試要項（生徒募集人員）｜徳島文理中学校・高等学校（「男女300名（徳島文理中学校出身者を含む）」・コース別内訳は非公表）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D136320100037',
      schoolName: '学校法人生光学園生光学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 200,
      source: {
        url: 'https://www.seikogakuen.ac.jp/seikogakuen/wp-content/uploads/2025/08/%E7%94%9F%E5%85%89%E5%AD%A6%E5%9C%92%E9%AB%98%E7%AD%89%E5%AD%A6%E6%A0%A1-%E4%BB%A4%E5%92%8C8%E5%B9%B4%E5%BA%A6-%E5%85%A5%E5%AD%A6%E8%A9%A6%E9%A8%93%E8%A6%81%E9%A0%85.pdf',
        docTitle: '令和8年度入学試験要項｜生光学園高等学校（前期入試: 推薦10名+専願60名+一般130名=200名。後期入試は「若干名」と不確定数のため合計に含めず。R7年度版と数値完全一致）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D136320800049',
      schoolName: 'みのり高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 20,
      source: {
        url: 'https://www.minori-hs.ed.jp/guide/',
        docTitle: 'みのり高等学校（通信制）募集要項（「本校は20名」と明記。各学習センター(サテライト施設)の定員は別途公表されており本データには含めない）',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D136320100019',
      schoolName: '香蘭高等学校',
      reason: '公式サイトの入試情報ページに募集定員の記載が無く「詳細は事務局まで」とのみ案内されており、確度の高い数値が見つからないため見送り。',
    },
    {
      schoolCode: 'D136320100046',
      schoolName: 'マーキュリー国際高等学校',
      reason: '2026年4月開校予定・認可申請中の新設校(徳島芸術学部校)であり、令和8年度時点でまだ開校・認可前のため募集定員が公表されていない。',
    },
  ],
};
