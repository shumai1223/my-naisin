/**
 * 岐阜県私立高等学校の募集定員データ(Λ-5第二段)。
 * 一般社団法人岐阜県私学振興会が公表する「令和8年度岐阜県私立高等学校(全日制・通信制)生徒
 * 募集要項」PDFから、schools-private/gifu.tsの全21校を1周回で完全収録(全日制16校+通信制
 * 専業5校)。中京高等学校は全日制(普通科480名・5領域)と通信制(普通科330名)の両課程を
 * 開設しており、同一学校コードのcoursesに両課程を並記して合計810名として記録した(学校
 * 実体としては1つのため二重登録ではない)。原資料には県全体の合計欄が無いため、全校の
 * courses内訳の積み上げのみで検証している(各校の学科構成はそのまま転記・独自集計なし)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_GIFU: PrivateSchoolDetailFile = {
  prefectureCode: 'gifu',
  schools: [
    {
      schoolCode: 'D121320100016',
      schoolName: '鶯谷高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(英進I類・英進II類・英進III類)', capacity: 280 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320100025',
      schoolName: '富田高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '国際科', capacity: 30 },
        { courseName: '普通科(啓明コース)', capacity: 30 },
        { courseName: '普通科', capacity: 170 },
        { courseName: '商業科', capacity: 105 },
      ],
      totalCapacity: 335,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320100034',
      schoolName: '岐阜東高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 進学', capacity: 140 },
        { courseName: '普通科 蛍雪', capacity: 100 },
        { courseName: '普通科 特進(内部進学者のみ)', capacity: 30 },
      ],
      totalCapacity: 270,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320100043',
      schoolName: '済美高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(選抜特進・特進・総合進学)', capacity: 200 },
        { courseName: '商業科', capacity: 40 },
        { courseName: '保育科', capacity: 40 },
        { courseName: '衛生看護科(女子のみ)', capacity: 40 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320100052',
      schoolName: '岐阜聖徳学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 特進', capacity: 40 },
        { courseName: '普通科 進学I類', capacity: 60 },
        { courseName: '普通科 進学II類', capacity: 175 },
        { courseName: '商業科', capacity: 80 },
      ],
      totalCapacity: 355,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320100061',
      schoolName: '聖マリア女学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(女子) 文理', capacity: 60 },
        { courseName: '普通科(女子) 英特・特進', capacity: 60 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320100070',
      schoolName: '城南高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '調理科(通信制)', capacity: 60 },
        { courseName: '製菓科(通信制)', capacity: 40 },
      ],
      totalCapacity: 100,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320100089',
      schoolName: '啓晴高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(通信制)', capacity: 120 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320100098',
      schoolName: 'ぎふ国際高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(通信制)', capacity: 240 },
      ],
      totalCapacity: 240,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320200015',
      schoolName: '大垣日本大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 アカデミー', capacity: 70 },
        { courseName: '普通科 特別進学', capacity: 100 },
        { courseName: '普通科 総合進学', capacity: 175 },
      ],
      totalCapacity: 345,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320200024',
      schoolName: '清凌高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(通信制) 生活デザイン', capacity: 20 },
        { courseName: '普通科(通信制) 福祉保育', capacity: 20 },
        { courseName: '普通科(通信制) 総合', capacity: 90 },
      ],
      totalCapacity: 130,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320200033',
      schoolName: '西濃桃李高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(通信制)', capacity: 80 },
      ],
      totalCapacity: 80,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320300014',
      schoolName: '高山西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特進I・特進II)', capacity: 200 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320400013',
      schoolName: '多治見西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(蛍雪・特進・総合・中高一貫)', capacity: 215 },
        { courseName: '商業科', capacity: 20 },
        { courseName: '被服科(女子のみ)', capacity: 20 },
      ],
      totalCapacity: 255,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320800019',
      schoolName: '麗澤瑞浪高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(選抜クラス・進学クラス・アントレプレナーシップコース、コース別定員なし)', capacity: 110 },
      ],
      totalCapacity: 110,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121320800028',
      schoolName: '中京高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(全日制)学問探究領域(名大選抜)', capacity: 20 },
        { courseName: '普通科(全日制)学問探究領域(特進選抜)', capacity: 60 },
        { courseName: '普通科(全日制)語学力探究領域(国際選抜)', capacity: 30 },
        { courseName: '普通科(全日制)運動技能探究領域(アスリート選抜)', capacity: 160 },
        { courseName: '普通科(全日制)横断的学問探究領域(リベラルアーツ選抜)', capacity: 210 },
        { courseName: '普通科(通信制)', capacity: 330 },
      ],
      totalCapacity: 810,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121321100014',
      schoolName: '美濃加茂高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(蛍雪・アドバンス・チャレンジ)', capacity: 290 },
      ],
      totalCapacity: 290,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121321400011',
      schoolName: '帝京大学可児高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科(特進I類・特進II類・特進III類)', capacity: 185 },
      ],
      totalCapacity: 185,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121321800017',
      schoolName: '岐阜第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 カレッジ', capacity: 15 },
        { courseName: '普通科 一般', capacity: 70 },
        { courseName: '普通科 スポーツ', capacity: 70 },
        { courseName: '普通科 留学生', capacity: 5 },
        { courseName: '工業科 自動車エンジニア', capacity: 25 },
        { courseName: '工業科 生産システム', capacity: 25 },
        { courseName: '工業科 情報デザイン', capacity: 20 },
      ],
      totalCapacity: 230,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121330200014',
      schoolName: '岐阜女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科 文理科', capacity: 25 },
        { courseName: '普通科 一般', capacity: 75 },
        { courseName: '食物科', capacity: 40 },
      ],
      totalCapacity: 140,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
    {
      schoolCode: 'D121340100014',
      schoolName: '西濃学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 25 },
      ],
      totalCapacity: 25,
      source: {
        url: 'https://www.sigaku-gifu.or.jp/cms/wp-content/uploads/2025/10/ac264409b527c0e5f16ffa2092e86a23.pdf',
        docTitle: '令和8年度岐阜県私立高等学校(全日制・通信制)生徒募集要項｜一般社団法人岐阜県私学振興会(学科・コース別募集定員表)',
        fetchedAt: '2026-07-30',
      },
    },
  ],
  skipped: [],
};
