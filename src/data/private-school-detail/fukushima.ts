/**
 * 福島県私立高等学校の募集定員データ(Λ-5第二段)。
 * 福島県庁「私立学校名簿（令和7年5月1日現在）」(一次ソース・全私立学校を1PDFで一括収録)から、
 * schools-private/fukushima.ts(第一段・機械生成の参照台帳)の全19校を収録。
 *
 * この名簿PDFは「総定員」（学則上の収容定員=入学定員×3学年相当）と「学科別入学定員」
 * （1学年あたりの募集定員）の両方を明記しており、値の性質がPDF上で判別できる
 * （他県のtochigi.ts等と同じ「学科別入学定員」列をtotalCapacityとして採用）。
 *
 * 通信制課程（大智学園高等学校・尚志高等学校/東日本国際大学附属昌平高等学校の通信制部門）は
 * 他県と同じ理由でスコープ外。全日制18校のうち、福島南高等学校（学校法人福島南学園）は
 * 名簿PDF上で総定員・学科別入学定員の記載が空欄（校長名・認可年月日のみ記載）だったため
 * skippedへ回した。よって収録17校・スキップ2校で参照台帳19校と一致する。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const SOURCE = {
  url: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/717686.pdf',
  docTitle: '私立学校名簿（高等学校・令和7年5月1日現在）｜福島県（学科別入学定員欄を1学年あたりの募集定員として採用）',
  fetchedAt: '2026-08-01',
  sourceTier: 'primary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_FUKUSHIMA: PrivateSchoolDetailFile = {
  prefectureCode: 'fukushima',
  schools: [
    {
      schoolCode: 'D107320161010',
      schoolName: '福島高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 260 }],
      totalCapacity: 260,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320161029',
      schoolName: '福島成蹊高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 360 }],
      totalCapacity: 360,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320161038',
      schoolName: '桜の聖母学院高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 120 }],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320161047',
      schoolName: '福島東稜高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科', capacity: 225 },
        { courseName: '食物文化科', capacity: 40 },
        { courseName: '看護科', capacity: 40 },
        { courseName: '看護専攻科', capacity: 40 },
      ],
      totalCapacity: 345,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320261019',
      schoolName: '会津北嶺高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科', capacity: 225 },
        { courseName: '機械科（自動車コース）', capacity: 80 },
      ],
      totalCapacity: 305,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320261028',
      schoolName: '会津若松ザベリオ学園高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320261037',
      schoolName: '仁愛高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '看護科', capacity: 80 },
        { courseName: '看護専攻科', capacity: 80 },
      ],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320361018',
      schoolName: '帝京安積高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科', capacity: 225 },
        { courseName: 'ビジネス総合科', capacity: 270 },
      ],
      totalCapacity: 495,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320361027',
      schoolName: '日本大学東北高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 480 }],
      totalCapacity: 480,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320361036',
      schoolName: '尚志高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科', capacity: 305 },
        { courseName: '情報総合科', capacity: 160 },
      ],
      totalCapacity: 465,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320361045',
      schoolName: '郡山女子大学附属高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科', capacity: 240 },
        { courseName: '食物科', capacity: 40 },
        { courseName: '美術科', capacity: 20 },
        { courseName: '音楽科', capacity: 20 },
      ],
      totalCapacity: 320,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320461017',
      schoolName: '福島県磐城第一高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320461026',
      schoolName: '磐城緑蔭高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 60 }],
      totalCapacity: 60,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320461044',
      schoolName: '東日本国際大学附属昌平高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 160 }],
      totalCapacity: 160,
      source: SOURCE,
    },
    {
      schoolCode: 'D107320461053',
      schoolName: 'いわき秀英高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 120 }],
      totalCapacity: 120,
      source: SOURCE,
    },
    {
      schoolCode: 'D107321361016',
      schoolName: '聖光学院高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [
        { courseName: '普通科', capacity: 170 },
        { courseName: '工学科', capacity: 115 },
      ],
      totalCapacity: 285,
      source: SOURCE,
    },
    {
      schoolCode: 'D107350161017',
      schoolName: '石川高等学校',
      fiscalYearLabel: '令和7年度',
      courses: [{ courseName: '普通科', capacity: 320 }],
      totalCapacity: 320,
      source: SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D107320161056',
      schoolName: '福島南高等学校',
      reason: '名簿PDF上で校長名・認可年月日のみ記載され、総定員・学科別入学定員・所在地欄が空欄だった（募集停止中の可能性があるが確度不明のため独自推定はしない）',
    },
    {
      schoolCode: 'D107354461016',
      schoolName: '大智学園高等学校',
      reason: '名簿PDFでは「通信制課程（広域）」区分のみに掲載され、全日制課程の記載が無かった（通信制のみの学校のため他県と同じ理由でスコープ外）',
    },
  ],
};
