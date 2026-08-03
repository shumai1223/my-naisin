/**
 * 長野県私立高等学校の募集定員データ(Λ-5第二段)。
 * 長野県(県民文化部)が公表する「令和8年度私立高等学校(全日制)の募集定員をお知らせします」
 * プレスリリースPDFから、全日制16校を1周回で完全収録。栃木県庁PDFと同型の学科別内訳+
 * 合計欄付きの明瞭な表形式で、16校のcourses合計を積み上げた結果が原資料の合計欄
 * 「3,440」と完全一致することを検算済み。schools-private/nagano.tsの残り10校
 * (長野女子/ステップ/信濃むつみ/さくら国際/コードアカデミー/地球環境/ID学園/つくば開成学園/
 * 天龍興譲/緑誠蘭)は本プレスリリース(全日制向け)に掲載が無く、通信制・広域通信制の
 * 学校だったため1校ずつ個別に公式サイトで在籍状況・募集定員の公表有無を確認済み。
 * 結果: 長野女子=2026年3月閉校で対象外、天龍興譲/地球環境/コードアカデミーは通信制でも
 * 公式サイトに具体的な定員数の記載がありcourses収録、ステップ/信濃むつみ/さくら国際/
 * 緑誠蘭/つくば開成学園/ＩＤ学園は「若干名」表記や項目自体の不在で定員非公開のためスキップ。
 * これで参照台帳26校全ての在籍状況・データ収集可否を確認完了(schools=19, skipped=7)。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

export const PRIVATE_SCHOOL_DETAIL_NAGANO: PrivateSchoolDetailFile = {
  prefectureCode: 'nagano',
  schools: [
    {
      schoolCode: 'D120320100017',
      schoolName: '長野清泉女学院高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 175 }],
      totalCapacity: 175,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320100035',
      schoolName: '文化学園長野高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 210 }],
      totalCapacity: 210,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320100044',
      schoolName: '長野日本大学高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 270 },
        { courseName: '探究創造科', capacity: 30 },
      ],
      totalCapacity: 300,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320100053',
      schoolName: '長野俊英高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 215 }],
      totalCapacity: 215,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320300015',
      schoolName: '上田西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 290 }],
      totalCapacity: 290,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120321700019',
      schoolName: '佐久長聖高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 315 }],
      totalCapacity: 315,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120321400012',
      schoolName: '東海大学付属諏訪高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 265 },
        { courseName: '理数科', capacity: 40 },
      ],
      totalCapacity: 305,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320900019',
      schoolName: '伊那西高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 170 }],
      totalCapacity: 170,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320500013',
      schoolName: '飯田女子高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 210 }],
      totalCapacity: 210,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120321500011',
      schoolName: '東京都市大学塩尻高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 255 }],
      totalCapacity: 255,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320200016',
      schoolName: '松商学園高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 340 },
        { courseName: '商業科', capacity: 80 },
      ],
      totalCapacity: 420,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320200025',
      schoolName: '松本国際高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 190 }],
      totalCapacity: 190,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致・注記に併設中学校からの入学予定者15名を含むと明記)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320200052',
      schoolName: '松本第一高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 120 },
        { courseName: '家庭科(食物)', capacity: 75 },
      ],
      totalCapacity: 195,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320200034',
      schoolName: 'エクセラン高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [
        { courseName: '普通科', capacity: 90 },
        { courseName: '美術科', capacity: 15 },
        { courseName: '福祉科', capacity: 15 },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120345200013',
      schoolName: '日本ウェルネス長野高等学校',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科(県内生対象の総合コースのみ・全体定員80名の内数)', capacity: 30 }],
      totalCapacity: 30,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(注記「募集定員80名のうち、県内生徒を対象とする総合コースの定員を記載」・原資料の30がそのままcoursesと一致)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120341300011',
      schoolName: '天龍興譲高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [{ courseName: '普通科（広域通信制単位制）', capacity: 50 }],
      totalCapacity: 50,
      source: {
        url: 'https://www.donguri-gakuen.jp/entry-2/',
        docTitle: '天龍興譲高等学校募集要項（学校法人どんぐり向方学園）「募集定員50名」',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120321700028',
      schoolName: '地球環境高等学校',
      fiscalYearLabel: '令和8年度（2026年度）',
      courses: [
        {
          courseName: '普通科（広域通信制単位制）週1日型・集中型 新入生・編入生・転入生（総定員480名の内数）',
          capacity: 160,
        },
        { courseName: '普通科（広域通信制単位制）週3日型（佐久本校・令和8年度は4月生のみ募集）', capacity: 30 },
      ],
      totalCapacity: 190,
      source: {
        url: 'https://earth.ac.jp/pages/34/',
        docTitle: '募集要項（地球環境高等学校）「設置学科・募集定員」表',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120320300033',
      schoolName: 'コードアカデミー高等学校',
      fiscalYearLabel: '（学年定員として通年公表・年度表記なし）',
      courses: [{ courseName: '普通科（通信制・各学年定員相当・全学年合計定員240人の1/3）', capacity: 80 }],
      totalCapacity: 80,
      source: {
        url: 'https://www.code.ac.jp/what-we-do',
        docTitle: '特色・入学案内（コードアカデミー高等学校）「定員240人 各学年80人相当の少人数教育」',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D120332100012',
      schoolName: 'ユナイテッド・ワールド・カレッジＩＳＡＫジャパン',
      fiscalYearLabel: '令和8年度',
      courses: [{ courseName: '普通科', capacity: 40 }],
      totalCapacity: 40,
      source: {
        url: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r8/documents/boshu2026.pdf',
        docTitle: '令和8年度私立高等学校(全日制)の募集定員をお知らせします｜長野県県民文化部(学科別募集定員表・合計3,440と完全一致・入学は8月1日と注記)',
        fetchedAt: '2026-07-30',
        sourceTier: 'primary' as const,
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D120320100026',
      schoolName: '長野女子高等学校',
      reason:
        'Wikipediaで2026年3月31日付の閉校(学校法人長野家政学園→2023年に学校法人長聖へ変更後、閉校)が確認された。閉校前の最終学年が2025年度(令和7年度)在籍者のみで令和8年度入学生の募集自体が存在しないため、長野県のR8全日制私立高校募集定員プレスリリースにも掲載が無いのは整合的。データなしとして正直にスキップ。',
    },
    {
      schoolCode: 'D120320100062',
      schoolName: 'ステップ高等学校',
      reason:
        '学校法人信州長野学園が運営する広域通信制単位制高校(2022年4月開校)であり、公式サイト(naganogakuen.ac.jp)に募集定員・募集人員の記載自体が無いため見送り(全日制と異なり広域通信制は募集定員の概念を公表しない設計が多い)。',
    },
    {
      schoolCode: 'D120320200043',
      schoolName: '信濃むつみ高等学校',
      reason:
        '通信制・単位制の普通科（学校法人外語学園）。公式サイト(terra.ed.jp)の2026年度生徒募集要項PDFを直読みしたが、目次(エントリー/オープンキャンパス/インタビュー/コンファームの4ステップを経て随時入学決定する年間ローリング入学制度)に「募集定員」の項目自体が存在せず、固定の定員数を公表していないと判断し見送り。',
    },
    {
      schoolCode: 'D120320300024',
      schoolName: 'さくら国際高等学校',
      reason:
        '通信制高校。公式サイト(sakura-kokusai.ed.jp)の募集要項ページでは「今年度の新入学入試は終了」・転入学については「通学型普通コース若干名」「集中スクーリング型コース若干名」と表記されるのみで、固定の募集定員数は非公表と判断し見送り。',
    },
    {
      schoolCode: 'D120342300019',
      schoolName: '緑誠蘭高等学校',
      reason:
        '学校法人山本学園が運営する広域通信制・単位制課程普通科高校。公式サイト(ryokuseiran.cfc.ac.jp)の2027年度生徒募集要項PDFを直読みしたが、目次・出願区分表のいずれにも「募集定員」の項目・数値が無く(新卒生/既卒生/転入学/編入学いずれも随時受け入れのローリング入学制度)、固定の定員数は非公表と判断し見送り。',
    },
    {
      schoolCode: 'D120338200018',
      schoolName: 'つくば開成学園高等学校',
      reason:
        '長野県・新潟県を対象とする通信制高校（辰野本校）。公式サイト(t-kaisei.com)のトップページ・入学案内ページ(admission_top)を確認したが、いずれにも募集定員・募集人員の具体的な数値の記載が無く、固定の定員数は非公表と判断し見送り。',
    },
    {
      schoolCode: 'D120321900017',
      schoolName: 'ＩＤ学園高等学校',
      reason:
        '学校法人郁文館夢学園が運営する通信制高校（1都2府11県が募集対象エリア）。公式サイト(id.ikubunkan.ed.jp)のトップページ・募集要項ページ・募集要項PDFのいずれにも具体的な募集定員数値の記載が無く(「キャンパス・コースの定員に達し次第、受付を終了」との記載のみで数値は非公表)、固定の定員数は非公表と判断し見送り。',
    },
  ],
};
