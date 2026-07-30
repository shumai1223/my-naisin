/**
 * 青森県私立高等学校の募集定員データ(Λ-5第二段)。
 * 青森県には栃木/佐賀/富山のような県庁・私学協会一括PDFが見当たらず(私立中学高等学校協会
 * 「宮城」のような連合会サイトも入試日程一覧のみで定員記載なし)、個別学校の公式サイトから
 * 募集要項PDFを1校ずつ確認する方式で着手。青森山田高等学校(令和8年度・普通科280+ITビジネス科
 * 40+調理科40=合計360)と弘前学院聖愛高等学校(令和8年度・推薦入試と一般入試あわせて216名)の
 * 2校を確度高く収録。残り15校は今回未着手のまま(スキップ台帳への計上は個別確認後に行う)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_AOMORI: PrivateSchoolDetailFile = {
  prefectureCode: 'aomori',
  schools: [
    {
      schoolCode: 'D102310000057',
      schoolName: '青森山田高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 280 },
        { courseName: 'ITビジネス科', capacity: 40 },
        { courseName: '調理科', capacity: 40 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.aomoriyamada-hs.jp/wp/wp-content/uploads/2025/10/2026-生徒募集要項.pdf',
        docTitle: '令和8年度 生徒募集要項｜青森山田高等学校（学科・コース及び募集人数表）',
        fetchedAt: '2026-07-31',
      },
    },
    {
      schoolCode: 'D102310000011',
      schoolName: '弘前学院聖愛高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '総合進学コース・特別進学コース(合算)', capacity: 216 }],
      totalCapacity: 216,
      source: {
        url: 'https://seiai.hirogaku.ac.jp/wp-content/uploads/2025/09/7a0065b59fd4bf8c38db35fcb343063a.pdf',
        docTitle: '2026（令和8）年度 生徒募集要項｜弘前学院聖愛高等学校（募集人員216名＝推薦入試と一般入試あわせて）',
        fetchedAt: '2026-07-31',
      },
    },
  ],
  skipped: [],
};
