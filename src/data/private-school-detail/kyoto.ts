/**
 * 京都府私立高等学校の募集定員データ(Λ-5第二段・大都市圏5県の初回着手)。
 * (株)育伸社「2026年度 国立高校・高専・私立高校 募集要項【京都府】」(2026年2月17日現在)を
 * Read toolでPDF原本を直接解析(WebFetch要約でなく本文をそのまま読み取る方式=千葉県で確立した
 * 手法)。国立(京都教育大学附属)・高専(舞鶴工業高専)は私立高校マスターに含まれないため対象外。
 * 複数コースが「普通科計X」等の記法で共有クォータを持つ場合は1つの統合コースとして記録
 * (これまでの県と同一方針)。参照台帳44校中、校名と数値の対応を高い確度で確認できた34校を
 * 今回収録(洛南含む35校)。京都女子・京都共栄学園はPDF内の列レイアウトが複雑で校名と数値の
 * 対応関係を確信できず今回は見送り(次回再訪の価値あり)。洛星は2013年に高校募集を停止し
 * 完全中高一貫校化(Wikipediaで確認)。一燈園・京都つくば開成・京都美山・京都長尾谷・
 * 京都芸術大学附属・京都文教大学附属宇治の6校はこのPDFに掲載が無い。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_KYOTO_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03926.pdf',
  docTitle: '2026年度 国立高校・高専・私立高校 募集要項【京都府】（(株)育伸社 入試情報課・2026年2月17日現在）',
  fetchedAt: '2026-07-31',
};

export const PRIVATE_SCHOOL_DETAIL_KYOTO: PrivateSchoolDetailFile = {
  prefectureCode: 'kyoto',
  schools: [
    {
      schoolCode: 'D126310000139',
      schoolName: '大谷高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: 'バタビアコース(マスター/グローバル/コア)・インテグラルコース(全コース計)', capacity: 400 }],
      totalCapacity: 400,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000022',
      schoolName: '同志社女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(LAコース)', capacity: 25 }],
      totalCapacity: 25,
      source: {
        ...IKUSHIN_KYOTO_SOURCE,
        docTitle: IKUSHIN_KYOTO_SOURCE.docTitle + '(LAコースのみ掲載。他コースの記載は無い)',
      },
    },
    {
      schoolCode: 'D126310000031',
      schoolName: '京都産業大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: 'S特進クラス・特進クラス・進学コース(全コース計)', capacity: 280 }],
      totalCapacity: 280,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000040',
      schoolName: '平安女学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アグネス進学(AS)コース(女)', capacity: 30 },
        { courseName: '幼児教育進学(CS)コース(女)', capacity: 30 },
        { courseName: '立命館進学(RS)コース(女)', capacity: 30 },
      ],
      totalCapacity: 90,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000059',
      schoolName: '京都橘高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '選抜類型', capacity: 60 },
        { courseName: '総合類型', capacity: 200 },
      ],
      totalCapacity: 260,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000068',
      schoolName: '同志社高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '推薦', capacity: 30 },
        { courseName: '一般', capacity: 50 },
      ],
      totalCapacity: 80,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000077',
      schoolName: '東山高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'パスカルコース(男)', capacity: 30 },
        { courseName: 'クレセントコース(男)', capacity: 160 },
        { courseName: 'トップアスリートコース(男)', capacity: 40 },
      ],
      totalCapacity: 230,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000086',
      schoolName: '京都精華学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '進学Aコース・進学Bコース・遊学コース(普通科計)', capacity: 170 },
        { courseName: '美術', capacity: 30 },
      ],
      totalCapacity: 200,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000095',
      schoolName: '京都文教高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コースA(文系・理系)・特進コースB(文理専攻/国際英語専攻)(特進A・B計)', capacity: 40 },
        { courseName: '進学コース', capacity: 130 },
        { courseName: '体育コース', capacity: 30 },
      ],
      totalCapacity: 200,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000111',
      schoolName: '京都両洋高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'K特進コース', capacity: 15 },
        { courseName: 'J進学コース・Jキャリアコース・S探究コース(進学・キャリア・探究計)', capacity: 420 },
      ],
      totalCapacity: 435,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000120',
      schoolName: '洛陽総合高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '総合', capacity: 280 }],
      totalCapacity: 280,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000157',
      schoolName: '華頂女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女)', capacity: 120 }],
      totalCapacity: 120,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000326',
      schoolName: '京都西山高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特進コース・総合進学コース(普通科計)', capacity: 250 }],
      totalCapacity: 250,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000200',
      schoolName: '京都先端科学大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '国際コース・特進ADVANCEDコース・特進BASICコース・進学コース(普通科計)', capacity: 320 }],
      totalCapacity: 320,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000255',
      schoolName: '京都成章高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: 'アカデミーコース(TS/AS)・アカデミークラス・メディカルスポーツコース(普通科計)', capacity: 400 }],
      totalCapacity: 400,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000246',
      schoolName: '京都聖母学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: 'Ⅲ類(最難関特進)・Ⅱ類(特進)・Ⅰ類GSC・Ⅰ類(大学連携)(女・普通科計)', capacity: 180 }],
      totalCapacity: 180,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000371',
      schoolName: '京都翔英高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(単位制)', capacity: 220 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 260,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000335',
      schoolName: '京都聖カタリナ高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '看護', capacity: 40 },
        { courseName: '普通', capacity: 40 },
      ],
      totalCapacity: 80,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000353',
      schoolName: '京都廣学館高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アドバンスコース', capacity: 60 },
        { courseName: 'ジェネラルコース', capacity: 180 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000399',
      schoolName: '京都国際高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '進学コース', capacity: 15 },
        { courseName: '総合コース(国際系列20・スポーツ系列(男)15)', capacity: 35 },
      ],
      totalCapacity: 50,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000451',
      schoolName: '洛星ノートルダム女学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: 'STE@M探究コース・グローバル英語コース・プレップ総合コース(女・全コース計)', capacity: 70 }],
      totalCapacity: 70,
      source: {
        ...IKUSHIN_KYOTO_SOURCE,
        docTitle: IKUSHIN_KYOTO_SOURCE.docTitle + '(2026年度よりノートルダム女学院から校名変更)',
      },
    },
    {
      schoolCode: 'D126310000264',
      schoolName: '福知山成美高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アカデミーコース', capacity: 35 },
        { courseName: '国際コース', capacity: 35 },
        { courseName: '進学コース(文理進学60・進学60)', capacity: 120 },
        { courseName: '普通コース', capacity: 125 },
        { courseName: '商業(情報コース)', capacity: 35 },
      ],
      totalCapacity: 350,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000273',
      schoolName: '福知山淑徳高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '総合', capacity: 195 }],
      totalCapacity: 195,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000415',
      schoolName: '立命館高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'MSコース(文理特進、含内部・MS専願10)', capacity: 70 },
        { courseName: 'コアコースGJクラス(国際、含内部)', capacity: 80 },
        { courseName: 'コアコース(文理総合、含内部)', capacity: 200 },
      ],
      totalCapacity: 350,
      source: {
        ...IKUSHIN_KYOTO_SOURCE,
        docTitle: IKUSHIN_KYOTO_SOURCE.docTitle + '(いずれも中学からの内部進学者を含む数値)',
      },
    },
    {
      schoolCode: 'D126310000219',
      schoolName: '花園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進Aコース', capacity: 70 },
        { courseName: '特進Bコース', capacity: 110 },
        { courseName: '進学カルティベートコース', capacity: 80 },
      ],
      totalCapacity: 260,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000344',
      schoolName: '同志社国際高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '帰国生(特別推薦・12月/2月選考、含編入)', capacity: 90 },
        { courseName: '国内一般生(推薦・G選考)', capacity: 45 },
      ],
      totalCapacity: 135,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000291',
      schoolName: '日星高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '総合コース', capacity: 100 },
        { courseName: '特進コース', capacity: 20 },
        { courseName: '看護', capacity: 40 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000184',
      schoolName: '京都明徳高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: 'みらい社会EL(特進)・JL(文理)・PL(総合)・CL(商業資格)・SL(スポーツマネジメント)(全コース計)', capacity: 350 }],
      totalCapacity: 350,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000308',
      schoolName: '立命館宇治高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'IGコース・IMコース・IBコース(普通科計・外部募集分)', capacity: 185 },
        { courseName: '国際入試(11月・2月、IG/IM/IB共通枠)', capacity: 40 },
      ],
      totalCapacity: 225,
      source: {
        ...IKUSHIN_KYOTO_SOURCE,
        docTitle: IKUSHIN_KYOTO_SOURCE.docTitle + '(普通科計185は「外部」と明記=中学からの内部進学者を除く外部募集枠)',
      },
    },
    {
      schoolCode: 'D126310000175',
      schoolName: '龍谷大学付属平安高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'IGコース', capacity: 40 },
        { courseName: 'プログレスコース(龍谷大学連携)', capacity: 260 },
        { courseName: 'アスリートコース(硬式野球部・男)', capacity: 30 },
      ],
      totalCapacity: 330,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000317',
      schoolName: '京都暁星高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通', capacity: 70 }],
      totalCapacity: 70,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000237',
      schoolName: '京都外大西高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'グローバル特進コース(選抜文系・躍進文理計)', capacity: 105 },
        { courseName: '総合進学コース', capacity: 70 },
        { courseName: '国際文化コースA・B', capacity: 70 },
        { courseName: '体育コース(男)', capacity: 35 },
      ],
      totalCapacity: 280,
      source: IKUSHIN_KYOTO_SOURCE,
    },
    {
      schoolCode: 'D126310000228',
      schoolName: '京都光華高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '看護医療コース・未来創造コース・特進アドバンストコース・国際挑戦(全科計、含内部)', capacity: 150 }],
      totalCapacity: 150,
      source: {
        ...IKUSHIN_KYOTO_SOURCE,
        docTitle: IKUSHIN_KYOTO_SOURCE.docTitle + '(2026年度より女子校から共学化)',
      },
    },
    {
      schoolCode: 'D126310000380',
      schoolName: '京都芸術高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '美術', capacity: 175 }],
      totalCapacity: 175,
      source: {
        ...IKUSHIN_KYOTO_SOURCE,
        docTitle: IKUSHIN_KYOTO_SOURCE.docTitle + '(宇治市。左京区の京都芸術大学附属高等学校とは別の学校)',
      },
    },
    {
      schoolCode: 'D126310000193',
      schoolName: '洛南高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '空パラダイム(男女別選考)', capacity: 48 },
        { courseName: '海パラダイム(男女別選考)', capacity: 96 },
      ],
      totalCapacity: 144,
      source: IKUSHIN_KYOTO_SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D126310000013',
      schoolName: '洛星高等学校',
      reason: '2013年に高校からの生徒募集を停止し完全中高一貫校化(Wikipediaで確認)',
    },
    {
      schoolCode: 'D126310000148',
      schoolName: '一燈園高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D126310000166',
      schoolName: '京都女子高等学校',
      reason: '育伸社募集要項PDF内の列レイアウトが複雑で校名とコース別数値の対応関係を確信できず今回は見送り(次回再訪の価値あり)',
    },
    {
      schoolCode: 'D126310000282',
      schoolName: '京都共栄学園高等学校',
      reason: '育伸社募集要項PDF内の列レイアウトが複雑で校名とコース別数値の対応関係を確信できず今回は見送り(次回再訪の価値あり)',
    },
    {
      schoolCode: 'D126310000362',
      schoolName: '京都美山高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D126310000406',
      schoolName: '京都つくば開成高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D126310000424',
      schoolName: '京都芸術大学附属高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(同名に近い「京都芸術高等学校」(宇治市)は別の学校で掲載あり)',
    },
    {
      schoolCode: 'D126310000433',
      schoolName: '京都長尾谷高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった',
    },
    {
      schoolCode: 'D126310000442',
      schoolName: '京都文教大学附属宇治高等学校',
      reason: '育伸社募集要項PDFに掲載が無く募集定員を確認できなかった(同名に近い「京都文教高等学校」は別の学校で掲載あり)',
    },
  ],
};
