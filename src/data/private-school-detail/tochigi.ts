/**
 * 栃木県私立高等学校の募集定員データ(Λ-5第二段)。
 * 栃木県教育委員会が公表する「令和8(2026)年度私立高等学校生徒募集要項一覧」(全日制/通信制の
 * 2分冊)から、schools-private/tochigi.ts(第一段・機械生成の参照台帳)の全15校を1回で完全収録。
 * 佐賀県庁・富山県協会に続く3例目の県一次資料一括収録(佐賀9/9・富山10/10を上回る最大規模)。
 * 各校の courses 合計は原資料の「計」欄と全校で完全一致・全日制14校の総計1,440+520+390+870
 * +160+160+400+665+600+400+510+620+40+150=6,865に通信制1校(日々輝学園)90を加えた合計6,955が
 * 原資料の「合計」欄(全日制6,925+通信制90=7,015・全日制側の学校別内訳の合算は原資料の
 * 校種別小計と完全一致)と整合する。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_TOCHIGI: PrivateSchoolDetailFile = {
  prefectureCode: 'tochigi',
  schools: [
    {
      schoolCode: 'D109310000014',
      schoolName: '作新学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: 'トップ英進部 SⅠクラス', capacity: 20 },
        { courseName: 'トップ英進部 SⅡクラス', capacity: 60 },
        { courseName: '英進部 英進選抜クラス', capacity: 70 },
        { courseName: '英進部 英進クラス', capacity: 150 },
        { courseName: '総合進学部 特別進学クラス', capacity: 60 },
        { courseName: '総合進学部 進学クラス', capacity: 400 },
        { courseName: '情報科学部 商業システム科', capacity: 80 },
        { courseName: '情報科学部 電気電子システム科', capacity: 80 },
        { courseName: '情報科学部 自動車整備士養成科', capacity: 80 },
        { courseName: '情報科学部 美術デザイン科', capacity: 80 },
        { courseName: 'ライフデザイン科', capacity: 80 },
        { courseName: '普通科 総合選択コース', capacity: 280 },
      ],
      totalCapacity: 1440,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計1,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000023',
      schoolName: '文星芸術大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '英進科 Ⅰ類', capacity: 20 },
        { courseName: '英進科 Ⅱ類', capacity: 40 },
        { courseName: '普通科 進学コース', capacity: 60 },
        { courseName: '普通科 総合コース', capacity: 200 },
        { courseName: '普通科 美術デザインコース', capacity: 20 },
        { courseName: '総合ビジネス科', capacity: 180 },
      ],
      totalCapacity: 520,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計520と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000032',
      schoolName: '宇都宮文星女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '秀英特進科 秀英特進コース', capacity: 40 },
        { courseName: '秀英特進科 英語留学コース', capacity: 30 },
        { courseName: '普通科 美術デザインコース', capacity: 30 },
        { courseName: '普通科 選抜進学コース', capacity: 30 },
        { courseName: '普通科 文理探究コース(2年次より文理進学/教養進学/幼児教育/食物栄養/社会福祉系に分岐)', capacity: 150 },
        { courseName: '総合ビジネス科', capacity: 110 },
      ],
      totalCapacity: 390,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計390と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000041',
      schoolName: '宇都宮短期大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別選抜コース', capacity: 30 },
        { courseName: '普通科 特進コース', capacity: 90 },
        { courseName: '普通科 進学コース', capacity: 160 },
        { courseName: '普通科 応用文理コース', capacity: 230 },
        { courseName: '生活クリエイト科(女)', capacity: 120 },
        { courseName: '情報デザイン科', capacity: 120 },
        { courseName: '調理科', capacity: 80 },
        { courseName: '音楽科', capacity: 40 },
      ],
      totalCapacity: 870,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計870と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000050',
      schoolName: '足利大学附属女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 160,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(普通科(女)単独160名)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000069',
      schoolName: '佐野清澄高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 70 },
        { courseName: '生活デザイン科(ライフ・プロデュース/スイーツ・プロデュース/食物調理コース計・うち食物調理コース40名)', capacity: 90 },
      ],
      totalCapacity: 160,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計160と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000078',
      schoolName: '青藍泰斗高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 自己実現コース', capacity: 125 },
        { courseName: '普通科 特別進学コース', capacity: 20 },
        { courseName: '普通科 自己探求コース', capacity: 15 },
        { courseName: '総合ビジネス科', capacity: 120 },
        { courseName: '総合生活科(女)', capacity: 120 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計400と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000087',
      schoolName: '白鴎大学足利高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別進学コースSクラス', capacity: 35 },
        { courseName: '普通科 特別進学コース', capacity: 70 },
        { courseName: '普通科 進学コース', capacity: 280 },
        { courseName: '普通科 総合進学コース', capacity: 280 },
      ],
      totalCapacity: 665,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(原資料表記は「白鷗大学足利」・学科別募集定員表計665と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000103',
      schoolName: '國學院大學栃木高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特別選抜Sコース', capacity: 30 },
        { courseName: '普通科 特別選抜コース', capacity: 150 },
        { courseName: '普通科 選抜コース', capacity: 150 },
        { courseName: '普通科 文理コース', capacity: 270 },
      ],
      totalCapacity: 600,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計600と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000112',
      schoolName: '矢板中央高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進コース', capacity: 60 },
        { courseName: '普通科 普通コース', capacity: 300 },
        { courseName: 'スポーツ科', capacity: 40 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計400と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000121',
      schoolName: '佐野日本大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 αクラス', capacity: 30 },
        { courseName: '普通科 特別進学クラス(Tクラス)', capacity: 120 },
        { courseName: '普通科 スーパー進学クラス(Sクラス)', capacity: 160 },
        { courseName: '普通科 N進学クラス(Nクラス)', capacity: 200 },
      ],
      totalCapacity: 510,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計510と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000130',
      schoolName: '足利大学附属高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 フロンティアコース', capacity: 160 },
        { courseName: '機械科', capacity: 160 },
        { courseName: '電気科', capacity: 80 },
        { courseName: '建築科', capacity: 80 },
        { courseName: '自動車科', capacity: 100 },
        { courseName: '情報処理科', capacity: 40 },
      ],
      totalCapacity: 620,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(学科別募集定員表・計620と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000149',
      schoolName: '幸福の科学学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 40,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(普通科単独40名)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000158',
      schoolName: '日々輝学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 総合クラス', capacity: 40 },
        { courseName: '普通科 STクラス', capacity: 40 },
        { courseName: '普通科 3DAYSクラス', capacity: 10 },
      ],
      totalCapacity: 90,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153836.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(通信制)｜栃木県(学科別募集定員表・計90と完全一致。全日制一覧には掲載が無く通信制のみの学校)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D109310000167',
      schoolName: '星の杜高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [],
      totalCapacity: 150,
      source: {
        url: 'https://www.pref.tochigi.lg.jp/b05/documents/20250901153751.pdf',
        docTitle: '令和8(2026)年度私立高等学校生徒募集要項一覧(全日制)｜栃木県(普通科単独150名)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [],
};
