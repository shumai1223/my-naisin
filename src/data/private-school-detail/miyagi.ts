/**
 * 宮城県私立高等学校の募集定員データ(Λ-5第二段)。
 * 宮城県私立中学高等学校連合会サイトには入試日程一覧PDFのみで募集定員の記載が無く、
 * 一括収録は見送り。個別学校の公式サイトから募集要項PDFを確認する方式で着手し、
 * 仙台育英学園高等学校(令和8年度・宮城野校舎+多賀城校舎の7コース合計1,000名)と
 * 東北学院高等学校(令和8年度・普通科(コース制)募集定員360名)の2校を確度高く収録。
 * 尚絅学院高等学校など残り18校は今回未着手のまま。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_MIYAGI: PrivateSchoolDetailFile = {
  prefectureCode: 'miyagi',
  schools: [
    {
      schoolCode: 'D104391020024',
      schoolName: '仙台育英学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '秀光コース(宮城野校舎)', capacity: 70 },
        { courseName: '特別進学コース(宮城野校舎)', capacity: 240 },
        { courseName: '情報科学コース(宮城野校舎)', capacity: 90 },
        { courseName: '外国語コース(多賀城校舎・女子)', capacity: 70 },
        { courseName: '英進進学コース(多賀城校舎)', capacity: 210 },
        { courseName: 'フレックスコース(多賀城校舎)', capacity: 160 },
        { courseName: '技能開発コース(多賀城校舎)', capacity: 160 },
      ],
      totalCapacity: 1000,
      source: {
        url: 'https://www.sendaiikuei.ed.jp/media/files/hs/admission/summary/26nyushi.pdf',
        docTitle: '令和8年度 仙台育英学園高等学校募集概要（コース別定員予定表）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D104391020015',
      schoolName: '東北学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(コース制)', capacity: 360 }],
      totalCapacity: 360,
      source: {
        url: 'https://www.jhs.tohoku-gakuin.ac.jp/admission/hs/files/guide/admissions.pdf',
        docTitle: '2026年度（令和8年度）東北学院高等学校生徒募集要項（募集定員男女360名）',
        fetchedAt: '2026-07-31',
      },
    },
  ],
  skipped: [],
};
