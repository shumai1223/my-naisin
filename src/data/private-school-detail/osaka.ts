/**
 * 大阪府私立高等学校の募集定員データ(Λ-5第二段・大都市圏5県の3県目)。
 * (株)育伸社「2026年度 国立高校・高専・私立高校 募集要項【大阪府】」(2025年11月4日現在)を
 * Read toolでPDF原本を直接解析。神奈川/京都と異なり、このPDFは「専願X／併願↓」という
 * 記法が基本形で、↓は直前行と同一の値(単一のクォータを専願・併願で共有)を意味する
 * (合算しない)。「全コース計X」「普通科計X」等は複数コース欄にまたがって同じ数値が
 * 繰り返される場合の共有クォータ(1回のみ計上)。国立(大阪教育大学附属3校)・高専
 * (大阪公立大学工業高専)は私立高校マスターに含まれないため対象外。
 * 1ページ目から着手し、対応関係が明瞭な11校を今回収録(参照台帳107校)。大阪府は参照台帳の規模が
 * 大きいため複数周回に分けて処理する方針(千葉/静岡/神奈川と同様)。
 * **2026-07-31追記**: 2ページ目は校名と数値ブロックの対応が極めて複雑で、かつ「大阪商業大学
 * 高等学校」「大阪商業大学堺高等学校」「大商学園高等学校」のように酷似した校名の別法人校が
 * 複数存在し誤帰属リスクが高いため、育伸社PDFのブロック読解ではなく公式サイト個別確認に
 * 切り替えて大阪商業大学堺高等学校を追加(神奈川終盤で確立した手法)。
 * **2026-07-31further**: 中高一貫の名門校3校(大阪星光学院・大阪女学院・帝塚山学院)を個別確認した
 * ところ、いずれも「約X名」の概数表記のみで正確な定員が非公表、または実質的に外部募集を
 * 停止しており、Y-0憲法(公表値のみ・捏造ゼロ)に基づき3校ともスキップとして記録。
 * **2026-07-31さらに続き**: 帝塚山学院泉ケ丘高等学校を公式PDF(1次入試「Ｓ特進コース・特進コース計
 * 約120名」)から収録。出願時にコース選択せず1本の定員枠として運用されており、履正社等の
 * 既存precedent(単一の約数字は高確度の一次情報として受容)と整合するため収録可とした。
 * 大阪信愛学院高等学校は令和9年度(次サイクル)の概数のみで正確な定員が確認できずスキップ。
 * **2026-08-10追記(掛-2私立×多年度・大都市圏5県の4つ目)**: ikushin 03927.pdfのWayback CDX APIで
 * 2023年11月6日キャプチャ(「2024年度」版)を発掘し、1〜2ページ目16校を再突合。うち14校
 * (アサンプション国際・アナン学園・あべの翔学・上宮太子・上宮・英真学園・追手門学院・
 * 追手門学院大手前・大阪・大阪偕星学園・大阪学院大学・大阪薫英女学院・大阪暁光・大阪学芸)は
 * 総定員完全一致(変化なし)。大阪産業大学附属は560→680(+120、特進コースSと国際情報
 * コミュニケーションコースが新設)、大阪国際は305→295(-10、Ⅱ類総合探究/幼児保育進学コースが
 * 未来探究/幼児保育進学コースへ再編)を検出。大阪女学院(概数のみでスキップ中)は2024年度版でも
 * 同じ約115名という概数のみで、既存のスキップ判断が引き続き妥当と確認。
 * **2026-08-10further(3ページ目8校)**: 大阪成蹊女子・大谷・開明・大阪体育大学浪商(本校分)・
 * 大阪電気通信大学の6校は総定員完全一致(大阪青凌も280=280で一致・現行レコードの「年度別裏付け未確認」
 * 注記を裏付ける傍証となった)。大阪桐蔭は2024年度版(外部募集Ⅱ類80名を含む合計450)と2026年度版
 * (内部進学生を除く公式サイト値・Ⅱ類無しの合計400)で前提が異なり単純比較不可のため要注記付きで収録。
 * 大阪夕陽丘学園は360→380(+20)でコース再編(英語国際→PBLへ改称等)を検出。
 * **2026-08-10further(4ページ目11校中10校を収録・1校は前提不一致で見送り)**: 金蘭会・関西大学高等部・
 * 関西福祉科学大学・関西大倉・賢明学院・建国・香ヶ丘リベルテの7校は総定員完全一致。近畿大学泉州は
 * 240→210(-30、本校分のみ・3コース均等減)、近畿大学附属は640→650(+10)を検出。関西大学北陽は
 * 280→385(+105)だが2026年度公式サイト値が「内部進学予定者を含む」と明記される一方2024年度版の
 * 内部進学生の扱いが不明確なため要注記付きで収録。関西大学第一は2024年度版が専願A/B/C(109/40/19以内)
 * +併願「若干」という測定基盤自体が異なる概数構成で、2026年度版(内部進学予定者を含む合計400・
 * courses未分解)と単純比較不可のため今回は見送り。
 * **2026-08-10further(5ページ目11校)**: 樟蔭・四天王寺・興國・金光藤蔭・堺リベラル・四天王寺東・
 * 金光大阪・香里ヌヴェール学院の8校は総定員完全一致。四條畷学園は総定員480完全一致だが発展キャリア
 * (140→160)と特別シンガク(60→40)の間でコース間の再配分が起きている可能性を検出。好文学園女子は
 * 300→270(-30、8コース計→9コース計への再編)、金光八尾は205→220(+15、美術コース新設)を検出。
 * **2026-08-10further(6ページ目10校)**: 常翔学園・常翔啓光学園・城南学園・昇陽・精華・清教学園・
 * 清風・清風南海・清明学院の9校は総定員完全一致(常翔学園はコース名「特進/文理」→「アカデミックⅠ/Ⅱ」
 * への改称を検出したが定員は不変)。星翔のみ300→335(+35、普通科総合キャリアコースの増員)を検出。
 * **2026-08-10further(7ページ目10校中8校を収録・2校は見送り)**: 大商学園・相愛・太成学院大学・
 * 羽衣学園・宣真・梅花の6校は総定員完全一致。同志社香里は60→40(-20、男女各30→各20)、東海大学付属
 * 大阪仰星は200→235(+35)を検出。浪速は2024年度版640(4類計・含内部)に対し2026年度版が960という
 * 説明のつかない大幅な乖離(+50%)があり、内訳が非公表のため単純比較すると誤りを広める危険が高いと
 * 判断し見送り(要再検証)。帝塚山学院泉ヶ丘は2024年度版がS特進約70/特進約70という2行表記で共有枠か
 * 独立枠か確定できず、2026年度版の「Ｓ特進・特進計約120」と単純に対応付けられないため見送り。
 * **2026-08-10further(8ページ目11校中9校を収録・2校は見送り)**: ピーエル学園(PL学園)・阪南大学・
 * 東大阪大学柏原(2027年度以降募集停止発表済み・2024年度から300で不変だったことを裏付け)・東大谷・
 * 箕面自由学園の5校は総定員完全一致(東大谷はコース名は同じだが国際/進学間で40名の再配分を検出)。
 * 利晶学園大阪立命館は360→400(+40、スーペリアコースの増員)、東大阪大学敬愛は300→360(+60、
 * こども教育/ファッション創造の2コースが廃止されステップアップ/スーパーアスリートへ再編)、
 * プール学院は260→210(-50、ただし現行2026年度レコード自体がPDF直読み不可のためWebSearch要約に
 * 依拠するsecondary/低確度データである点に留意)、明浄学院は300→320(+20、総合キャリア減・看護
 * メディカル増の再配分を伴う)を検出。利晶学園(初芝富田林)は2024年度版が4コースとも「約70」表記で
 * 共有か独立か確定できず、ヴェリタス城星学園は現行レコード自体が2025年度分(2026年度分は未確認)かつ
 * 2024年度版との差が75→140と大きすぎるため、いずれも見送り。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_OSAKA_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03927.pdf',
  docTitle: '2026年度 国立高校・高専・私立高校 募集要項【大阪府】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_OSAKA_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/PDF/03927.pdf',
  docTitle: '2024年度 私立高校 募集要項【大阪府】(株式会社育伸社 入試情報課・2023年9月28日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-10',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_OSAKA: PrivateSchoolDetailFile = {
  prefectureCode: 'osaka',
  schools: [
    {
      schoolCode: 'D127310000478',
      schoolName: 'アサンプション国際高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: 'スーペリアコース・イングリッシュコース・アカデミックⅠ類/Ⅱ類コース(全コース計、含内部・帰国)',
          capacity: 120,
        },
      ],
      totalCapacity: 120,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000566',
      schoolName: 'アナン学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '看護(専願)', capacity: 40 },
        { courseName: '調理(専願)', capacity: 30 },
      ],
      totalCapacity: 70,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000833',
      schoolName: 'あべの翔学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進Ⅰ類コース(専願・併願共通枠)', capacity: 25 },
        { courseName: '特進Ⅱ類コース(専願・併願共通枠)', capacity: 35 },
        { courseName: '普通進学コース(専願・併願共通枠)', capacity: 240 },
      ],
      totalCapacity: 300,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000717',
      schoolName: '上宮太子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進Ⅰ類(国公立大学)コース(専願・併願共通枠、約)', capacity: 35 },
        { courseName: '特進Ⅱ類(難関私立大学)コース(専願・併願共通枠、約)', capacity: 35 },
        { courseName: '総合選進(有名私立大学)コース(専願・併願共通枠、約)', capacity: 105 },
      ],
      totalCapacity: 175,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000094',
      schoolName: '上宮高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'パワーコース(専願・併願共通枠)', capacity: 40 },
        { courseName: '英数コース(専願・併願共通枠)', capacity: 120 },
        { courseName: 'プレップコース(専願・併願共通枠)', capacity: 320 },
      ],
      totalCapacity: 480,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000780',
      schoolName: '英真学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特進コース・総合コース・マンガ/イラストコース(普通科計、専願・併願共通枠)', capacity: 300 }],
      totalCapacity: 300,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000619',
      schoolName: '追手門学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '創造コース(専願・併願共通枠、含内部)', capacity: 35 },
        { courseName: '特選SSコース(専願・併願共通枠、含内部)', capacity: 40 },
        { courseName: 'Ⅰ類コース(専願・併願共通枠、含内部)', capacity: 120 },
        { courseName: 'Ⅱ類コース(専願・併願共通枠、含内部・スポーツ35)', capacity: 155 },
      ],
      totalCapacity: 350,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000389',
      schoolName: '追手門学院大手前高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: 'スーパー選抜コース・グローバルアカデミー/グローバルサイエンスコース・特進コース(普通科計・外部募集、約)',
          capacity: 145,
        },
      ],
      totalCapacity: 145,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000156',
      schoolName: '大阪高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '文理特進コース(専願・併願共通枠)', capacity: 120 },
        { courseName: '総合進学コース(専願・併願共通枠)', capacity: 360 },
        { courseName: '探究コース(専願・併願共通枠)', capacity: 70 },
      ],
      totalCapacity: 550,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000806',
      schoolName: '大阪偕星学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(専願・併願共通枠)', capacity: 50 },
        { courseName: '文理進学コース(専願・併願共通枠)', capacity: 50 },
        { courseName: '進路探究コース(専願・併願共通枠)', capacity: 130 },
        { courseName: 'スポーツコース(専願のみ)', capacity: 90 },
      ],
      totalCapacity: 320,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000334',
      schoolName: '大阪学院大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        {
          courseName: '普通コース・特進コース・国際コース・スポーツ科学コース(普通科計、専願・併願共通枠)',
          capacity: 400,
        },
      ],
      totalCapacity: 400,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000860',
      schoolName: '大阪商業大学堺高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進エキスパートコース', capacity: 30 },
        { courseName: '特進アドバンスコース', capacity: 70 },
        { courseName: '進学グローバルコース', capacity: 175 },
        { courseName: 'スポーツコース(スポーツ推薦・専願のみ)', capacity: 100 },
      ],
      totalCapacity: 375,
      source: {
        url: 'https://www.shodaisakai.ac.jp/entrance',
        docTitle: '大阪商業大学堺高等学校 令和8年度(2026年度)入試 募集要項ページ(合計375名は原資料の「普通科合計」表記と一致)',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000888',
      schoolName: '大阪商業大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'グローバル商大コース(含内部)', capacity: 160 },
        { courseName: '文理進学コース', capacity: 60 },
        { courseName: 'スポーツ専修コース(指定クラブあり)', capacity: 70 },
        { courseName: 'デザイン美術コース', capacity: 35 },
      ],
      totalCapacity: 325,
      source: {
        url: 'https://www.daishodai-h.ed.jp/examination/admission/',
        docTitle:
          '大阪商業大学高等学校(本校・東大阪市) 入試情報ページ' +
          '(育伸社PDF令和8年度分と同一数値160/60/70/35を公式サイト側でも確認・大阪商業大学堺高等学校とは別法人の別校)',
        fetchedAt: '2026-07-31',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000879',
      schoolName: '大商学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通科(特進Ⅰ類・特進Ⅱ類・情報クリエイティブ・進学の4コース計、コース別内訳非公表)', capacity: 320 },
        { courseName: '商業科', capacity: 40 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.daisho.ac.jp/admission/examination/',
        docTitle: '大商学園高等学校(豊中市) 令和8年度入試 募集人員ページ',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000502',
      schoolName: '大阪薫英女学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '国際科(国際特進コース・国際進学コース、コース別内訳非公表)', capacity: 80 },
        { courseName: '普通科(文理特進・英語進学・文理進学・総合進学・スポーツ特技の5コース計、コース別内訳非公表)', capacity: 120 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.kun-ei.jp/wp/wp-content/uploads/2025/09/bf63555017727e2e7287863dda20a87c.pdf',
        docTitle: '大阪薫英女学院高等学校 令和8年度生徒募集要項(募集定員表に国際科80名・普通科120名と明記)',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000922',
      schoolName: '大阪産業大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コースS(専願・併願共通枠)', capacity: 40 },
        { courseName: '特進コースⅠ(専願・併願共通枠)', capacity: 80 },
        { courseName: '特進コースⅡ(専願・併願共通枠)', capacity: 80 },
        { courseName: '進学コース(専願・併願共通枠)', capacity: 240 },
        { courseName: 'スポーツコース(男子専願のみ)', capacity: 80 },
        { courseName: '国際(グローバルコース)(専願・併願共通枠)', capacity: 80 },
        { courseName: '国際(情報コミュニケーションコース)(専願・併願共通枠)', capacity: 80 },
      ],
      totalCapacity: 680,
      source: {
        ...IKUSHIN_OSAKA_SOURCE,
        docTitle:
          IKUSHIN_OSAKA_SOURCE.docTitle +
          '(普通科520+国際科160=総募集人員680名。公式サイト(osaka-sandai.ed.jp)由来の第三者要約とも独立に数値一致確認)',
      },
    },
    {
      schoolCode: 'D127310000432',
      schoolName: '大阪暁光高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通科(教育探究コース、専願・併願共通枠)', capacity: 35 },
        { courseName: '普通科(幼児教育コース、専願・併願共通枠)', capacity: 70 },
        { courseName: '普通科(進学総合コース、専願・併願共通枠)', capacity: 105 },
        { courseName: '看護科(専願のみ)', capacity: 70 },
      ],
      totalCapacity: 280,
      source: {
        ...IKUSHIN_OSAKA_SOURCE,
        docTitle: IKUSHIN_OSAKA_SOURCE.docTitle + '(第三者要約とも独立に数値一致確認)',
      },
    },
    {
      schoolCode: 'D127310000600',
      schoolName: '大阪国際高等学校',
      fiscalYearLabel: '2027年度',
      courses: [
        { courseName: 'スーパー文理探究コース(プログラムα)', capacity: 70 },
        { courseName: 'スーパー文理探究コース(プログラムβ)', capacity: 140 },
        { courseName: '国際バカロレアコース', capacity: 15 },
        { courseName: '未来探究コース(大阪国際大学内部進学コース)・幼児保育進学コース(大阪国際大学短期大学部内部進学コース)、2コース計', capacity: 70 },
      ],
      totalCapacity: 295,
      source: {
        url: 'https://www.kokusai-h.oiu.ed.jp/high/admission/2027_high_youkou.pdf',
        docTitle:
          '大阪国際高等学校(守口市) 2027年度生徒募集要項' +
          '(公式サイトが既に2027年度サイクルへ移行済みのため最新公表値として収録。未来探究/幼児保育進学の2コースは内訳非公表)',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000218',
      schoolName: '桃山学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'S英数コース', capacity: 80 },
        { courseName: '英数コース', capacity: 80 },
        { courseName: '文理コース(文理クラス120+アスリートクラス40、アスリートクラスは男子専願)', capacity: 160 },
        { courseName: '国際コース(短期留学・長期留学)', capacity: 80 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.momoyamagakuin-h.ed.jp/senior/admissions/application.html',
        docTitle: '桃山学院高等学校 2026年度入試 募集要項ページ(合計400名は原資料の記載と一致・中高一貫コース生120名は別枠のため対象外)',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000799',
      schoolName: '履正社高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '学藝コースS類・学藝コースⅠ類・学藝コースⅡ類(学藝コース計、専願・併願共通枠、約)', capacity: 440 },
        { courseName: '競技コースⅢ類(強化クラブ生のみの募集、専願)', capacity: 120 },
      ],
      totalCapacity: 560,
      source: {
        ...IKUSHIN_OSAKA_SOURCE,
        docTitle:
          IKUSHIN_OSAKA_SOURCE.docTitle +
          '(合計約560名はWebSearch経由で確認できた公式サイト由来の第三者要約「男女計約560名」と独立一致)',
      },
    },
    {
      schoolCode: 'D127310000085',
      schoolName: '明星高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '文理選択コース(男、専願・併願共通枠、約)', capacity: 80 },
        { courseName: '文理コース(男、専願・併願共通枠、約)', capacity: 40 },
      ],
      totalCapacity: 120,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000405',
      schoolName: 'ピーエル学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通科(国公立コース・理文選修コースの2コース計、内部進学者を含む)', capacity: 120 }],
      totalCapacity: 120,
      source: {
        url: 'https://www.pl-gakuen.ac.jp/school/wp-content/uploads/boshu-youkou.pdf',
        docTitle:
          'PL学園高等学校(登録名:ピーエル学園高等学校) 2026年度募集要項' +
          '(パーフェクトリバティー教団会員子弟のみが出願資格という特殊な募集制度だが募集人数自体は他校と同様に記録)',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000557',
      schoolName: '樟蔭高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '国際教養コース(女、専願・併願共通枠)', capacity: 30 },
        { courseName: '身体表現コース(女、専願・併願共通枠)', capacity: 30 },
        { courseName: '総合コース(女、専願・併願共通枠)', capacity: 150 },
      ],
      totalCapacity: 210,
      source: {
        ...IKUSHIN_OSAKA_SOURCE,
        docTitle:
          IKUSHIN_OSAKA_SOURCE.docTitle +
          '(30+30+150=210は公式サイト(osaka-shoin.ac.jp)由来のWebSearch要約と独立に数値一致確認)',
      },
    },
    {
      schoolCode: 'D127310000664',
      schoolName: '精華高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'ニュースタンダードコース(専願・併願共通枠)', capacity: 120 },
        { courseName: 'スーパーグローカルコース(専願・併願共通枠)', capacity: 20 },
        { courseName: 'スポーツ&アートコース(専願のみ、強化クラブのみ)', capacity: 80 },
        { courseName: 'i-Techコース(専願・併願共通枠)', capacity: 40 },
        { courseName: '環境福祉コース(専願のみ)', capacity: 30 },
        { courseName: 'フリーアカデミーコース(専願のみ)', capacity: 30 },
      ],
      totalCapacity: 320,
      source: {
        ...IKUSHIN_OSAKA_SOURCE,
        docTitle:
          IKUSHIN_OSAKA_SOURCE.docTitle +
          '(普通科320名の6コース内訳は公式サイト(seika-h.ed.jp)由来のWebSearch要約と独立に完全一致確認)',
      },
    },
    {
      schoolCode: 'D127310000101',
      schoolName: '清風高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [
        { courseName: '普通科 理Ⅲ6か年編入コース（男子）', capacity: 80 },
        { courseName: '普通科 理数コース（男子）', capacity: 80 },
        { courseName: '普通科 文理コース（男子・特技コース50名を含む）', capacity: 90 },
      ],
      totalCapacity: 250,
      source: {
        url: 'https://www.seifu.ac.jp/2025/wp-content/themes/seifu/assets/pdf/studentrecruitment2026_high.pdf',
        docTitle: '2026年度（令和8年度）入学試験 生徒募集要項「1.募集人員」（清風高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000110',
      schoolName: '四天王寺高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        { courseName: '文理選抜コース(女子・内部進学を除く・約)', capacity: 35 },
        { courseName: '文理コース(女子・約)', capacity: 90 },
        { courseName: '文化・スポーツコース(女子・約)', capacity: 30 },
      ],
      totalCapacity: 155,
      source: {
        url: 'https://www.edu-news.info/page-c-shitennoji-a.html',
        docTitle:
          '四天王寺高等学校・四天王寺中学校 2026年度入試要項まとめ(「約」表記は学校公式資料の一貫した表記で、平成30年度〜令和7年度まで同水準の数値(理数35/英数90/スポーツ・芸術30→コース名改編後も同数)が継続していることをWebSearchで複数年度分クロスチェック済み)',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000058',
      schoolName: '相愛高等学校',
      fiscalYearLabel: '（年度非表記の学校公式PDF）',
      courses: [
        { courseName: '普通科（専願・併願可）', capacity: 120 },
        { courseName: '音楽科（専願・併願可・内部進学者約10名を含む）', capacity: 30 },
      ],
      totalCapacity: 150,
      source: {
        url: 'https://www.soai.ed.jp/examinee/pdf/guidelines_h_2026.pdf',
        docTitle: '入学試験募集要項（相愛高等学校）「普通科120名〈専願・併願可〉」「音楽科30名〈専願・併願可〉」',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000147',
      schoolName: '金蘭会高等学校',
      fiscalYearLabel: '2027年（令和9年度）',
      courses: [{ courseName: '全日制普通科（女子・内部進学生約25人含む）', capacity: 210 }],
      totalCapacity: 210,
      source: {
        url: 'https://kinran.ed.jp/wp-content/uploads/2026/07/4fd671e62bf35ca29cc84359ff5340d4.pdf',
        docTitle: '2027(令和9)年度入試 金蘭会高等学校 生徒募集要項「1.募集人員」',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000165',
      schoolName: '大阪成蹊女子高等学校',
      fiscalYearLabel: '2027年度（令和9年度・2025年度〈令和7年度〉と同数値をWebSearchでクロスチェック済み）',
      courses: [
        { courseName: '普通科 特進コース', capacity: 30 },
        { courseName: '普通科 看護医療進学コース', capacity: 30 },
        { courseName: '普通科 英語コース', capacity: 30 },
        { courseName: '普通科 総合キャリアコース', capacity: 130 },
        { courseName: '普通科 スポーツコース', capacity: 30 },
        { courseName: '普通科 幼児教育コース', capacity: 60 },
        { courseName: '普通科 音楽コース', capacity: 30 },
        { courseName: '美術科 アート・イラスト・アニメーションコース', capacity: 60 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://high.osaka-seikei.jp/ex_info/bosyu.html',
        docTitle: '募集要項・特待生制度（大阪成蹊女子高等学校）コース別定員表',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000174',
      schoolName: 'プール学院高等学校',
      fiscalYearLabel: '（年度非特定・複数回のWebSearchで一貫して同数値を確認）',
      courses: [],
      totalCapacity: 210,
      source: {
        url: 'https://poole.ed.jp/wp/wp-content/themes/poole/assets/img/exam/hs2027.pdf',
        docTitle:
          'プール学院高等学校生徒募集要項（公式PDFは空白レンダリング不良で直読み不可のためWebSearch要約2回で「スーパー特進・特進・国際・総合芸術の4コース合計210名(女子・内部進学者含む)」を確認）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000192',
      schoolName: '大谷高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [
        { courseName: '全日制普通科 プレミアム文理コース（女子・内部進学者を除く）', capacity: 40 },
        { courseName: '全日制普通科 アドバンス文理コース（女子・内部進学者を除く）', capacity: 40 },
      ],
      totalCapacity: 80,
      source: {
        url: 'https://www.osk-ohtani.ed.jp/web/wp-content/themes/202311ohtani/images/common/High-school-recruitment-guideline_2027.pdf',
        docTitle:
          '令和9年度(2027年度)入試 大谷高等学校 生徒募集要項「1.募集人員」（学校法人大谷学園。京都市の別法人校「大谷高等学校」(otani.ed.jp)との混同に注意し住所照合済み）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000209',
      schoolName: '東大谷高等学校',
      fiscalYearLabel: '（年度非特定・公式サイトはR9未公開のためWebSearch2回で確認した直近実績値）',
      courses: [
        { courseName: '普通科 特進コース（男女）', capacity: 80 },
        { courseName: '普通科 国際コース（男女）', capacity: 40 },
        { courseName: '普通科 進学コース（男女）', capacity: 160 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://higashiohtani.ac.jp/admissions/examination',
        docTitle:
          '東大谷高等学校 入試情報（公式サイトは令和9年度分が作成中で未公開。特進80名/国際40名/進学160名をWebSearch2回で独立確認）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000245',
      schoolName: '清明学院高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [
        { courseName: '普通科 特進コース（文系・理系・看護・医療系合計）', capacity: 120 },
        { courseName: '普通科 進学コース', capacity: 120 },
        { courseName: '普通科 総合コース', capacity: 120 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.seimei.ed.jp/admissions/',
        docTitle: '入試情報［生徒募集要項］（清明学院高等学校）コース別定員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000021',
      schoolName: '大阪つくば開成高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [],
      totalCapacity: 500,
      source: {
        url: 'https://otk.ed.jp/wp-content/themes/tsukuba-osaka2019/assets/files/boshuu2025_7-2.pdf',
        docTitle: '2026年度 募集要項（大阪つくば開成高等学校）定員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000691',
      schoolName: '金光八尾高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（約・内部進学者を含む）',
      courses: [
        { courseName: '普通科 S特進コース（約）', capacity: 35 },
        { courseName: '普通科 特進コース（約）', capacity: 80 },
        { courseName: '普通科 総合進学コース（約）', capacity: 80 },
        { courseName: '美術コース（約）', capacity: 25 },
      ],
      totalCapacity: 220,
      source: {
        url: 'https://www.osaka-shigaku.gr.jp/news/images/R8_h_bosyu2.pdf',
        docTitle:
          '令和8年度 大阪私立高等学校生徒募集状況一覧（大阪私立中学校高等学校連合会）金光八尾高等学校（公式サイトの令和9年度版〈コース名は「未来創造コース」に改称の可能性〉でも同一人数構成を確認しクロスチェック済み）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000682',
      schoolName: '利晶学園高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（約・内部進学予定約67名+外部募集123名の合計）',
      courses: [
        { courseName: '普通科 文理Ⅲ（約）', capacity: 80 },
        { courseName: '普通科 文理Ⅱ（約）', capacity: 70 },
        { courseName: '普通科 文理Ⅰ（約）', capacity: 40 },
      ],
      totalCapacity: 190,
      source: {
        url: 'https://www.osaka-shigaku.gr.jp/news/images/R8_h_bosyu2.pdf',
        docTitle:
          '令和8年度 大阪私立高等学校生徒募集状況一覧（大阪私立中学校高等学校連合会）利晶学園（現：初芝富田林）（学校公式サイトは「情報が確定次第、掲載」で未公開のため業界団体調べを採用。系列校「利晶学園大阪立命館高等学校」とは別行で明確に区別）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000673',
      schoolName: '大阪桐蔭高等学校',
      fiscalYearLabel: '2026年度（令和8年度）（内部進学生を除く）',
      courses: [
        { courseName: 'Ⅰ類エクシードコース', capacity: 40 },
        { courseName: 'Ⅰ類特進コース', capacity: 160 },
        { courseName: 'Ⅲ類体育芸術コース', capacity: 200 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.osakatoin.ed.jp/examination/indexsr.php',
        docTitle:
          '入試結果ページ（大阪桐蔭高等学校）2026年度募集定員（school.js88.comと同一内訳で一致確認済み）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000655',
      schoolName: '大阪青凌高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（内部進学者を含む）',
      courses: [
        { courseName: '普通科 特進Sコース', capacity: 40 },
        { courseName: '普通科 特進コース', capacity: 80 },
        { courseName: '普通科 進学コース', capacity: 160 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://osakaseiryo.jp/hs/application/',
        docTitle:
          '2027年度 生徒募集要項（大阪青凌高等学校）募集定員（大阪府私立中高連調べの外部募集実績は2025年度267名/2026年度257名で近似・コース別内訳の年度別裏付けは未確認）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000646',
      schoolName: '東海大学付属大阪仰星高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（内部進学予定約105名を除く一般募集分）',
      courses: [
        { courseName: '英数特進コース', capacity: 45 },
        { courseName: '総合進学コース', capacity: 190 },
      ],
      totalCapacity: 235,
      source: {
        url: 'https://www.tokai-gyosei.ed.jp/exam/h-school/',
        docTitle: '令和8年度 高校入学試験要項（東海大学付属大阪仰星高等学校）募集定員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000753',
      schoolName: '興國高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（男子校）',
      courses: [
        { courseName: '普通科 アドバンスコース スーパーアドバンス', capacity: 110 },
        { courseName: '普通科 アドバンスコース プレミアムアドバンス', capacity: 80 },
        { courseName: '普通科 アスリートアドバンスコース', capacity: 120 },
        { courseName: '普通科 アカデミアコース', capacity: 120 },
        { courseName: '普通科 キャリアトライコース', capacity: 40 },
        { courseName: 'ITビジネス科', capacity: 120 },
      ],
      totalCapacity: 590,
      source: {
        url: 'https://kokoku.ed.jp/examination/',
        docTitle: '令和8年度 入学試験要項（興國高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000771',
      schoolName: '関西大学北陽高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（関西大学北陽中学校からの内部進学予定者を含む）',
      courses: [
        { courseName: '普通科 特進アドバンスコース(専願・併願)', capacity: 40 },
        { courseName: '普通科 文理コース(専願・併願)', capacity: 265 },
        { courseName: '普通科 進学アスリートコース(専願のみ・2クラス)', capacity: 80 },
      ],
      totalCapacity: 385,
      source: {
        url: 'https://www.kansai-u.ac.jp/hokuyo/admission/capacity.html',
        docTitle: '2027年度 関西大学北陽高等学校 入学試験募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000824',
      schoolName: '開明高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（中高一貫校の高校外部募集枠のみ）',
      courses: [{ courseName: '普通科 6年文理編入コース(外部募集)', capacity: 80 }],
      totalCapacity: 80,
      source: {
        url: 'https://kaimei.ed.jp/pdf/r9koukou_3.pdf',
        docTitle: '開明高等学校 令和9年度 生徒募集要項',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000842',
      schoolName: '大阪学芸高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（附属中学校からの内部進学者を含む）',
      courses: [
        { courseName: '普通科 選抜特進コース', capacity: 60 },
        { courseName: '普通科 特進コース(Ⅰ類・Ⅱ類)', capacity: 200 },
        { courseName: '普通科 特進看護コース', capacity: 40 },
        { courseName: '普通科 進学コース', capacity: 160 },
        { courseName: '普通科 特技コース(専願のみ)', capacity: 60 },
        { courseName: '国際科 ダブルディプロマコース', capacity: 20 },
        { courseName: '国際科 1年留学コース・グローバルコース(2コース計)', capacity: 60 },
      ],
      totalCapacity: 600,
      source: {
        url: 'https://www.osakagakugei.ac.jp/uploads/senior/sites/3/2024/10/2024_jinin_01.jpg',
        docTitle: '大阪学芸高等学校 2027年度入試 募集要項 募集人員表',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000851',
      schoolName: '利晶学園大阪立命館高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（内部進学を含む）',
      courses: [
        { courseName: '普通科 アドバンストSPコース(α・β計・専願/併願)', capacity: 120 },
        { courseName: '普通科 スーペリアコース(α・β計・専願/併願)', capacity: 120 },
        {
          courseName: '普通科 立命館コース(理系クラス/RSSクラス含む・専願/併願)',
          capacity: 120,
        },
        { courseName: '体育科(特別専願のみ)', capacity: 40 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.rishogakuen.ed.jp/ritsumeikan/nyushi/pdf/2026_h-information.pdf',
        docTitle: '2026年度入試 大阪立命館高等学校 生徒募集要項',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000897',
      schoolName: '大阪体育大学浪商高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        { courseName: '進学アドバンスコース', capacity: 25 },
        { courseName: '進学グローバルコース', capacity: 30 },
        { courseName: '探究キャリアコース', capacity: 70 },
        { courseName: '進学スポーツコース', capacity: 70 },
        { courseName: '探究スポーツコース(スポーツ推薦生・専願のみ)', capacity: 70 },
      ],
      totalCapacity: 265,
      source: {
        url: 'https://www.ouhs-school.jp/namisho/examination/',
        docTitle: '入試情報（大阪体育大学浪商高等学校）2026年度募集定員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000913',
      schoolName: '常翔学園高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [
        { courseName: '普通科 スーパーコース', capacity: 40 },
        { courseName: '普通科 アカデミックコースⅠ', capacity: 200 },
        { courseName: '普通科 アカデミックコースⅡ(アスリートコース1クラス含む)', capacity: 240 },
      ],
      totalCapacity: 480,
      source: {
        url: 'https://www.highs.josho.ac.jp/josho_info/wp-content/uploads/2026/06/sh_requirements_2027.pdf',
        docTitle: '2027年度 帰国生徒入試 募集要項（常翔学園高等学校）募集コースおよび外部募集人数表',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000931',
      schoolName: '大阪電気通信大学高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [
        {
          courseName: '普通科(アドバンスコース・進学探究コース・健康スポーツコース(専願のみ)の3コース計)',
          capacity: 160,
        },
        { courseName: '工学科(工学特進コース・工学連携コースの2コース計)', capacity: 160 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.dentsu.ed.jp/examination/outline/',
        docTitle: '入学試験概要（大阪電気通信大学高等学校）2027年度',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000940',
      schoolName: '阪南大学高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [
        { courseName: '普通科 特進コースS', capacity: 40 },
        { courseName: '普通科 特進コースA', capacity: 80 },
        { courseName: '普通科 総合進学コース', capacity: 320 },
      ],
      totalCapacity: 440,
      source: {
        url: 'https://www.hdk.ed.jp/entrance/',
        docTitle: '入試情報（阪南大学高等学校）2027年度募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000959',
      schoolName: '太成学院大学高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        {
          courseName: '普通科(特進セレクト・ライフデザイン・製菓パティスリーの3コース計)',
          capacity: 240,
        },
        { courseName: 'スポーツ科(スポーツ進学・アスリートの2コース計)', capacity: 80 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.taisei-hs.ac.jp/hs/examinfo/',
        docTitle: '2026年度 募集要項（太成学院大学高等学校）募集人員表',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000977',
      schoolName: '星翔高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        {
          courseName: '工業技術系(機械工学科・電子機械工学科・電気工学科・コミュニケーションシステム工学科の一括募集)',
          capacity: 140,
        },
        { courseName: '普通科 特進アドバンスコース', capacity: 20 },
        { courseName: '普通科 総合キャリアコース', capacity: 105 },
        { courseName: '普通科 アスリートコース(専願のみ)', capacity: 70 },
      ],
      totalCapacity: 335,
      source: {
        url: 'https://www.osaka-seisho.ed.jp/_file/ja/article/27/pdf/2/令和8年度生徒募集要項.pdf',
        docTitle: '令和8年度 生徒募集要項（星翔高等学校）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310001048',
      schoolName: 'ＹＭＣＡ学院高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（新入学・通信制課程）',
      courses: [
        {
          courseName: '全コース計(Yチャレンジ/マイスペース朝・昼/スタンダード/Yリンク/トランスリンガルの各コースへ概数配分)',
          capacity: 200,
        },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.ymcagakuin.ac.jp/newer/',
        docTitle: '募集要項・学費（YMCA学院高等学校）新入学の方へ',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000968',
      schoolName: '早稲田大阪高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        { courseName: '早稲田コース(本校専願/併願・大宮/所沢外部会場含む)', capacity: 74 },
        { courseName: '文理コース', capacity: 70 },
        { courseName: '総合コース', capacity: 105 },
        { courseName: '総合コース(吹奏楽クラス・女子)', capacity: 35 },
      ],
      totalCapacity: 284,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310001093',
      schoolName: '近畿大阪高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（通信制課程）',
      courses: [{ courseName: '通信制課程 普通科', capacity: 145 }],
      totalCapacity: 145,
      source: {
        url: 'https://koutoku.ac.jp/kinkiosaka/guide/admission/',
        docTitle: '入学者選抜案内（近畿大阪高等学校）定員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310001084',
      schoolName: '明浄学院高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        { courseName: '総合キャリアコース', capacity: 120 },
        { courseName: '看護メディカルコース', capacity: 80 },
        { courseName: '衛生看護コース', capacity: 120 },
      ],
      totalCapacity: 320,
      source: IKUSHIN_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310001075',
      schoolName: '神須学園高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（通信制課程）',
      courses: [
        { courseName: 'アシストコース', capacity: 100 },
        { courseName: 'スタンダードコース', capacity: 100 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.kozu-gakuen.ed.jp/guidance/',
        docTitle: '入学案内（神須学園高等学校）定員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310001002',
      schoolName: '向陽台高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（新卒生用・通信制課程）',
      courses: [
        { courseName: '普通科 ステップアップコース(専願のみ)', capacity: 60 },
        { courseName: '普通科 ベーシックコース(併願可)', capacity: 250 },
      ],
      totalCapacity: 310,
      source: {
        url: 'https://www.koyodai.ed.jp/upload/files/24.pdf',
        docTitle: '2027（令和9）年度 新卒生用 向陽台高等学校 生徒募集要項',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000904',
      schoolName: '東大阪大学敬愛高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [
        { courseName: '普通科 総合キャリアコース', capacity: 150 },
        { courseName: '普通科 調理・製菓コース', capacity: 90 },
        { courseName: '普通科 ステップアップコース(専願生のみ)', capacity: 60 },
        { courseName: '普通科 スーパーアスリートコース(専願生のみ)', capacity: 60 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.higashiosaka-hs.ac.jp/keiai/requirements',
        docTitle: '募集要項（東大阪大学敬愛高等学校）2027年度',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000815',
      schoolName: '金光藤蔭高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [
        {
          courseName: '普通科(スタンダード・エンカレッジ・アートアニメミュージック・トップアスリートの4コース計)',
          capacity: 280,
        },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://konkoutouin.ed.jp/examwp/',
        docTitle: '募集要項（金光藤蔭高等学校）2027年度',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000762',
      schoolName: '好文学園女子高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（女子校）',
      courses: [
        {
          courseName: '普通科(総合進学エリア・キャリア進学エリア・メディア芸術エリアの9コース計)',
          capacity: 270,
        },
      ],
      totalCapacity: 270,
      source: {
        url: 'https://koubun.ed.jp/exp/examination.html',
        docTitle: '募集要項（好文学園女子高等学校）令和9年度入試',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000744',
      schoolName: '堺リベラル高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [{ courseName: '表現教育科（専願のみ）', capacity: 74 }],
      totalCapacity: 74,
      source: {
        url: 'https://www.liberal.ed.jp/s-highschool/admissions/',
        docTitle: '入試要項（堺リベラル高等学校）募集定員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000735',
      schoolName: '四天王寺東高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（内部進学生は除く）',
      courses: [],
      totalCapacity: 175,
      source: {
        url: 'https://www.shitennojigakuen.ed.jp/higashi/e_examination/e_briefing/images/highs_guidelines_2026.pdf',
        docTitle:
          '令和8年度 生徒募集要項（四天王寺東高等学校）募集人員（edu-news.infoと同一数値で一致確認済み）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000726',
      schoolName: '関西大学高等部',
      fiscalYearLabel: '令和8年度(2026年度)（約・専願併願合計）',
      courses: [{ courseName: '全日制課程 普通科（専願・併願）', capacity: 50 }],
      totalCapacity: 50,
      source: {
        url: 'https://www.kansai-u.ac.jp/senior/admission/index.html',
        docTitle: '令和8年度 入学試験要項（関西大学高等部）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000708',
      schoolName: '大阪金剛インターナショナル高等学校',
      fiscalYearLabel: '2027年度(令和9年度)',
      courses: [],
      totalCapacity: 40,
      source: {
        url: 'https://www.kongogakuen.ed.jp/wp-content/uploads/2026/06/2027-年度生徒募集要項【高校】.pdf',
        docTitle: '2027年度 生徒募集要項【高校】（大阪金剛インターナショナル高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000628',
      schoolName: '金光大阪高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（内部進学生を含む・2027年度版と同一数値でクロスチェック済み）',
      courses: [
        { courseName: '普通科 特進Ⅰコース', capacity: 80 },
        { courseName: '普通科 特進Ⅱコース', capacity: 80 },
        { courseName: '普通科 進学コース', capacity: 200 },
      ],
      totalCapacity: 360,
      source: {
        url: 'https://www.kohs.ed.jp/wp-content/themes/konko-osaka_2025/pdf/application-guidelines-sh_2027.pdf',
        docTitle:
          '2027年度入試 生徒募集要項（金光大阪高等学校）募集人員（令和8年度版は非掲載のためjs88.comの2026年度入試結果ページで同数値をクロスチェック）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000584',
      schoolName: '近畿大学泉州高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        { courseName: '普通科 英数特進', capacity: 70 },
        { courseName: '普通科 進学Ⅰ類', capacity: 70 },
        { courseName: '普通科 進学Ⅱ類', capacity: 70 },
      ],
      totalCapacity: 210,
      source: {
        url: 'https://www.osaka-shigaku.gr.jp/news/images/R8_h_bosyu2.pdf',
        docTitle:
          '令和8年度 大阪私立高等学校生徒募集状況一覧（大阪私立中学校高等学校連合会）近畿大学泉州高等学校（学校公式サイトは令和6年度版のみ現存のため業界団体調べを採用・複数の受験情報サイトの令和7年度分スニペットとも一致確認）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000575',
      schoolName: '賢明学院高等学校',
      fiscalYearLabel: '2026年度（令和8年度）（内部進学者約60名を含む）',
      courses: [
        { courseName: '関西学院大学特進サイエンスコース', capacity: 70 },
        { courseName: '特進エグゼコース', capacity: 50 },
        { courseName: '特進コース', capacity: 100 },
      ],
      totalCapacity: 220,
      source: {
        url: 'https://kenmei.jp/highschool/admission/high_entry/',
        docTitle: '2026年度 賢明学院高等学校生徒募集要項 募集定員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000548',
      schoolName: '近畿大学附属高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（内部進学約270名を除く外部募集分）',
      courses: [
        { courseName: '普通科 Super文理コース', capacity: 70 },
        { courseName: '普通科 特進文理コースⅠ', capacity: 35 },
        { courseName: '普通科 特進文理コースⅡ', capacity: 70 },
        { courseName: '普通科 英語特化コース', capacity: 35 },
        { courseName: '普通科 進学コース', capacity: 440 },
      ],
      totalCapacity: 650,
      source: {
        url: 'https://www.jsh.kindai.ac.jp/hs/eco/2026_erl_hs.pdf',
        docTitle: '令和8年度 入学試験要項（近畿大学附属高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000520',
      schoolName: '清風南海高等学校',
      fiscalYearLabel: '2026年度（令和8年度）（約・外部募集は「3か年特進コース」のみ）',
      courses: [{ courseName: '普通科 3か年特進コース（男女・外部募集）', capacity: 40 }],
      totalCapacity: 40,
      source: {
        url: 'https://www.seifunankai.ac.jp/jukensei/high/',
        docTitle:
          '2026年度 生徒募集要項（清風南海高等学校）募集定員（js88.com掲載の在籍数統計〈男20+女17=37名〉と概ね整合）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000511',
      schoolName: '羽衣学園高等学校',
      fiscalYearLabel: '2026年度（令和8年度）（約・2024年度入試も同水準を確認済み）',
      courses: [
        { courseName: '普通科 文理特進Ⅰ類・Ⅱ類コース（合計・約）', capacity: 170 },
        { courseName: '普通科 進学コース（約）', capacity: 170 },
      ],
      totalCapacity: 340,
      source: {
        url: 'https://hagoromogakuen.ed.jp/cms/wp-content/uploads/2025/07/2026_oosaka_sd.pdf',
        docTitle: '生徒募集要項＆出願情報登録の手引き 2026年度入試 大阪入試（羽衣学園高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000496',
      schoolName: '東大阪大学柏原高等学校',
      fiscalYearLabel: '2026年度（令和8年度）（2027年度以降は生徒募集停止発表済み）',
      courses: [],
      totalCapacity: 300,
      source: {
        url: 'https://kashiwara.ed.jp/wp/wp-content/themes/kashiwara2022/pdf/R7bosyu.pdf',
        docTitle: '2026年度 生徒募集要項（東大阪大学柏原高等学校）募集定員（普通科全日制男子）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000487',
      schoolName: '関西福祉科学大学高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [
        { courseName: '普通科 特別進学Ⅰコース（男女共学）', capacity: 30 },
        { courseName: '普通科 特別進学Ⅱコース（男女共学）', capacity: 70 },
        { courseName: '普通科 進学コース（男女共学）', capacity: 140 },
        { courseName: '普通科 保育進学コース（女子のみ）', capacity: 30 },
      ],
      totalCapacity: 270,
      source: {
        url: 'https://www.hs.fuksi-kagk-u.ac.jp/wp/wp-content/themes/fuksi-kagk-u/images/nyuushi/requirements2027.pdf',
        docTitle: '生徒募集要項（2027年度入試）（関西福祉科学大学高等学校）募集人数',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000450',
      schoolName: '四條畷学園高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（外部約450名+内部進学約30名で全体約480名）',
      courses: [
        { courseName: '普通科 総合キャリアコース', capacity: 280 },
        { courseName: '普通科 発展キャリアコース', capacity: 160 },
        { courseName: '普通科 特別シンガクコース', capacity: 40 },
      ],
      totalCapacity: 480,
      source: {
        url: 'https://hs.shijonawate-gakuen.ac.jp/entrance/guidelines/',
        docTitle:
          '生徒募集要項（四條畷学園高等学校）募集人員（検索キャッシュで令和8年度値を確認・school.js88.comと概ね一致・studyh.jpは不整合のため不採用）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000441',
      schoolName: '清教学園高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [
        { courseName: '普通科 S特進コース 理系（3年コース・外部募集）', capacity: 80 },
        { courseName: '普通科 S特進コース 文系（3年コース・外部募集）', capacity: 120 },
      ],
      totalCapacity: 200,
      source: {
        url: 'https://www.seikyo.ed.jp/wp/wp-content/uploads/2026/01/2026-3youkou.pdf',
        docTitle: '2026年度 高等学校入学試験要項（清教学園高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000423',
      schoolName: '同志社香里高等学校',
      fiscalYearLabel: '令和8年度(2026年度)（約）',
      courses: [{ courseName: '全日制課程 普通科（男子約20名・女子約20名）', capacity: 40 }],
      totalCapacity: 40,
      source: {
        url: 'https://www.kori.doshisha.ac.jp/wp-content/uploads/2025/08/6a67e0bcb465c5a5ca38083cb148d1e8.pdf',
        docTitle:
          '2026年度入試 説明会資料（同志社香里高等学校）募集人員（「約」表記・edu-news.info/studyh.jpと一致確認済み）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000414',
      schoolName: '香里ヌヴェール学院高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [
        {
          courseName: '全日制普通科（スーパーアカデミーコース・グローバルサイエンスコース合計）',
          capacity: 180,
        },
      ],
      totalCapacity: 180,
      source: {
        url: 'https://www.seibo.ed.jp/nevers-hs/img/2025/09/hyoukou_26.pdf',
        docTitle: '2026年度 募集要項（香里ヌヴェール学院高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000398',
      schoolName: '関西大倉高等学校',
      fiscalYearLabel: '2026年度（令和8年度）（約）',
      courses: [
        { courseName: '特進Ｓコース（男女・約）', capacity: 35 },
        { courseName: '特進コース（男女・約）', capacity: 280 },
      ],
      totalCapacity: 315,
      source: {
        url: 'https://www.kankura.jp/exam/boshu-h/',
        docTitle:
          '2026年度高校募集要項（関西大倉高等学校）募集人員（「約」表記・公式サイト+edu-news.info+studyh.jpの3系統で同一数値をクロスチェック済み）',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D127310000370',
      schoolName: '常翔啓光学園高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [
        { courseName: '特進コースⅠ類〔選抜〕', capacity: 40 },
        { courseName: '特進コースⅡ類', capacity: 120 },
        { courseName: '進学コース', capacity: 160 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.keiko.josho.ac.jp/_sys/wp-content/uploads/2025/11/2026seniornyushiyoko.pdf',
        docTitle: '2026年度 高等学校 生徒募集要項（常翔啓光学園高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000325',
      schoolName: '関西大学第一高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（内部進学予定者を含む）',
      courses: [],
      totalCapacity: 400,
      source: {
        url: 'https://www.kansai-u.ac.jp/dai-ichi/high/exam/index.html',
        docTitle: '入試情報（関西大学第一高等学校）生徒募集概要',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000316',
      schoolName: '宣真高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [],
      totalCapacity: 280,
      source: {
        url: 'https://senshin-gakuen.jp/requirements/',
        docTitle: '生徒募集要項（宣真高等学校）募集人員（普通科女子）',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000307',
      schoolName: '箕面自由学園高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [
        { courseName: 'SS特進コース', capacity: 80 },
        { courseName: 'S特進コース', capacity: 120 },
        { courseName: '特進コース', capacity: 160 },
        { courseName: '文理探究コース', capacity: 120 },
        { courseName: 'クラブ探究コース（専願のみ）', capacity: 80 },
      ],
      totalCapacity: 560,
      source: {
        url: 'https://mino-jiyu.ed.jp/hs/entry/guideline.html',
        docTitle: '2026年度 生徒募集要項（箕面自由学園高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000290',
      schoolName: '梅花高等学校',
      fiscalYearLabel: '令和9年度(2027年度)（学内進学者約90名を含む）',
      courses: [],
      totalCapacity: 280,
      source: {
        url: 'http://www.baika-jh.ed.jp/high-school/exam/points/',
        docTitle: '入学試験実施要項（梅花高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000281',
      schoolName: '香ヶ丘リベルテ高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [
        { courseName: 'ファッションビジネス／フィジカル Ⅰ類・Ⅱ類（専願のみ）', capacity: 70 },
        {
          courseName: '美容芸術／幼児教育／ライフデザイン／クッキングエキスパート／アンダンテ（専願・併願）',
          capacity: 152,
        },
      ],
      totalCapacity: 222,
      source: {
        url: 'https://liberte.ed.jp/wp/wp-content/uploads/2025/10/25_web_tebiki.pdf',
        docTitle: '2026年度（令和8年度）入試 生徒募集要項（香ヶ丘リベルテ高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000272',
      schoolName: '城南学園高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [{ courseName: '普通科（内部進学者含む）', capacity: 230 }],
      totalCapacity: 230,
      source: {
        url: 'https://www.jonan.ac.jp/senior/exam/guideline/',
        docTitle: '令和8年度生徒募集要項（城南学園高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000263',
      schoolName: '建国高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [
        { courseName: '普通科 特別進学コース', capacity: 30 },
        { courseName: '普通科 総合コース（韓国文化専攻・英米文化専攻・日本文化専攻）', capacity: 50 },
      ],
      totalCapacity: 80,
      source: {
        url: 'https://keonguk.ac.jp/high_school/candidates/',
        docTitle: '入試情報（建国高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000254',
      schoolName: '浪速高等学校',
      fiscalYearLabel: '令和9年度(2027年度)',
      courses: [],
      totalCapacity: 960,
      source: {
        url: 'https://www.naniwa.ed.jp/high/wp-content/uploads/sites/3/2027koukouboshuuyoukou.pdf',
        docTitle: '令和9年度 生徒募集要項（浪速高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000129',
      schoolName: '大阪夕陽丘学園高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        { courseName: '普通科 特進コース', capacity: 80 },
        { courseName: '普通科 PBL（旧英語国際）コース', capacity: 80 },
        { courseName: '普通科 進学コース', capacity: 160 },
        { courseName: '普通科 音楽・美術コース', capacity: 60 },
      ],
      totalCapacity: 380,
      source: {
        url: 'https://www.oyg.ed.jp/_assets/exam/descriptio/requirements.pdf',
        docTitle: '令和8年度 入試要項（大阪夕陽丘学園高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000076',
      schoolName: 'ヴェリタス城星学園高等学校',
      fiscalYearLabel: '令和7年度(2025年度)',
      courses: [],
      totalCapacity: 140,
      source: {
        url: 'https://www.veritas.josei.ed.jp/wp-content/uploads/description2025-1.pdf',
        docTitle: '2025年度入試 募集要項（ヴェリタス城星学園高等学校）募集人数',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000049',
      schoolName: '昇陽高等学校',
      fiscalYearLabel: '令和9年度（2027年度）',
      courses: [
        {
          courseName: '普通科（特進/進学[標準進学・看護医療進学・幼児教育進学・アスリート進学]/ITフロンティア/ビジネス・公務員/パティシエ 合計）',
          capacity: 270,
        },
        { courseName: '福祉科（福祉コース）', capacity: 30 },
      ],
      totalCapacity: 300,
      source: {
        url: 'https://www.oskshoyo.ed.jp/wp/wp-content/uploads/2026/07/a17b19793bb235fde629c1e02bf8bbaa.pdf',
        docTitle: '令和9年(2027年)度 生徒募集要項（昇陽高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000030',
      schoolName: '英風高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [{ courseName: '通信制課程 普通科', capacity: 160 }],
      totalCapacity: 160,
      source: {
        url: 'https://www.eifu.ed.jp/boshu-yoko/',
        docTitle: '募集要項（英風高等学校）募集人数',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000012',
      schoolName: '東朋学園高等学校',
      fiscalYearLabel: '2026年度（令和8年度）',
      courses: [{ courseName: '通信制課程 普通科', capacity: 80 }],
      totalCapacity: 80,
      source: {
        url: 'https://www.okazakitoho.ed.jp/admission/',
        docTitle: '前期新入学案内（東朋学園高等学校）募集人員',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000637',
      schoolName: '帝塚山学院泉ケ丘高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        {
          courseName: 'Ｓ特進コース・特進コース(計、出願時にコース選択せず判定点でコース決定)',
          capacity: 120,
        },
      ],
      totalCapacity: 120,
      source: {
        url: 'https://www.tezuka-i-h.jp/izumi-admin/wp-content/uploads/2025/09/2026kou_bosyuyoukou.pdf',
        docTitle:
          '帝塚山学院泉ヶ丘高等学校 令和8年度生徒募集要項(1次入試の募集人数「Ｓ特進コース・特進コース計 約120名」。帰国生入試分は同枠に含む)',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D127310000478',
      schoolName: 'アサンプション国際高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: 'スーペリアコース・イングリッシュコース・アカデミックⅠ類/Ⅱ類コース(全コース計)',
          capacity: 120,
        },
      ],
      totalCapacity: 120,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000566',
      schoolName: 'アナン学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '看護(専願)', capacity: 40 },
        { courseName: '調理(専願)', capacity: 30 },
      ],
      totalCapacity: 70,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000833',
      schoolName: 'あべの翔学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進Ⅰ類コース', capacity: 25 },
        { courseName: '特進Ⅱ類コース', capacity: 35 },
        { courseName: '普通進学コース', capacity: 240 },
      ],
      totalCapacity: 300,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000717',
      schoolName: '上宮太子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進Ⅰ類(国公立大学)コース(約)', capacity: 35 },
        { courseName: '特進Ⅱ類(難関私立大学)コース(約)', capacity: 35 },
        { courseName: '総合進学(有名私立大学)コース(約)', capacity: 105 },
      ],
      totalCapacity: 175,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000094',
      schoolName: '上宮高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'パワーコース', capacity: 40 },
        { courseName: '英数コース', capacity: 120 },
        { courseName: 'プレップコース', capacity: 320 },
      ],
      totalCapacity: 480,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000780',
      schoolName: '英真学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理特進コース', capacity: 50 },
        { courseName: '情報進学コース', capacity: 60 },
        { courseName: '総合進学コース', capacity: 190 },
      ],
      totalCapacity: 300,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000619',
      schoolName: '追手門学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '創造コース(含内部)', capacity: 35 },
        { courseName: '特選SSコース(含内部)', capacity: 40 },
        { courseName: 'Ⅰ類コース(含内部)', capacity: 120 },
        { courseName: 'Ⅱ類コース(含内部・スポーツ35)', capacity: 155 },
      ],
      totalCapacity: 350,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000389',
      schoolName: '追手門学院大手前高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: 'スーパー選抜コース・グローバルアカデミー/グローバルサイエンスコース・特進コース(普通科計・外部募集、約)',
          capacity: 145,
        },
      ],
      totalCapacity: 145,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000156',
      schoolName: '大阪高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理特進コース', capacity: 120 },
        { courseName: '総合進学コース', capacity: 360 },
        { courseName: '探究コース', capacity: 70 },
      ],
      totalCapacity: 550,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000806',
      schoolName: '大阪偕星学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース', capacity: 50 },
        { courseName: '文理進学コース', capacity: 50 },
        { courseName: '進路探究コース', capacity: 130 },
        { courseName: 'スポーツコース(専願のみ)', capacity: 90 },
      ],
      totalCapacity: 320,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000334',
      schoolName: '大阪学院大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通コース・特進コース・国際コース・スポーツ科学コース(普通科計)',
          capacity: 400,
        },
      ],
      totalCapacity: 400,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000502',
      schoolName: '大阪薫英女学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '国際科(国際特進コース・国際進学コース、国際科計、コース別内訳非公表)', capacity: 80 },
        {
          courseName: '普通科(文理特進・英語進学・文理進学・総合進学(2024年版は保育進学も含む)・スポーツ特技の5コース計、コース別内訳非公表)',
          capacity: 120,
        },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000922',
      schoolName: '大阪産業大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コースⅠ', capacity: 80 },
        { courseName: '特進コースⅡ', capacity: 80 },
        { courseName: '進学コース', capacity: 240 },
        { courseName: 'スポーツコース(男子専願のみ)', capacity: 80 },
        { courseName: '国際(グローバルコース)', capacity: 80 },
      ],
      totalCapacity: 560,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000432',
      schoolName: '大阪暁光高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科(教育探究コース)', capacity: 35 },
        { courseName: '普通科(幼児教育コース)', capacity: 70 },
        { courseName: '普通科(進学総合コース)', capacity: 105 },
        { courseName: '看護科(専願のみ)', capacity: 70 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000600',
      schoolName: '大阪国際高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'Ⅰ類国際バカロレアコース', capacity: 25 },
        { courseName: 'Ⅰ類スーパー文理探究コース(プログラムα・β計)', capacity: 140 },
        { courseName: 'Ⅱ類総合探究コース・Ⅱ類幼児保育進学コース(Ⅱ類計)', capacity: 140 },
      ],
      totalCapacity: 305,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000842',
      schoolName: '大阪学芸高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '国際科(DD20、グローバル・留学60、国際計)', capacity: 80 },
        { courseName: '普通科選抜特進コース', capacity: 60 },
        { courseName: '普通科特進コース(Ⅰ類・Ⅱ類、特進計)', capacity: 200 },
        { courseName: '普通科特進看護コース', capacity: 40 },
        { courseName: '普通科進学コース', capacity: 160 },
        { courseName: '普通科特技コース(専願のみ)', capacity: 60 },
      ],
      totalCapacity: 600,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000165',
      schoolName: '大阪成蹊女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科特進コース', capacity: 30 },
        { courseName: '普通科看護医療進学コース', capacity: 30 },
        { courseName: '普通科英語コース(2024年新設)', capacity: 30 },
        { courseName: '普通科総合キャリアコース', capacity: 130 },
        { courseName: '普通科幼児教育コース', capacity: 60 },
        { courseName: '普通科スポーツコース', capacity: 30 },
        { courseName: '普通科音楽コース', capacity: 30 },
        { courseName: '美術科(アート・イラスト・アニメーションコース)', capacity: 60 },
      ],
      totalCapacity: 400,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000192',
      schoolName: '大谷高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'プレミアム文理コース(女子)', capacity: 40 },
        { courseName: 'アドバンス文理コース(女子)', capacity: 40 },
      ],
      totalCapacity: 80,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000673',
      schoolName: '大阪桐蔭高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'Ⅰ類(エクシード30名を含む)', capacity: 190 },
        { courseName: 'Ⅱ類(2026年度公式サイト値には対応コースなし・要注記)', capacity: 80 },
        { courseName: 'Ⅲ類(体育・芸術コース)', capacity: 180 },
      ],
      totalCapacity: 450,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000655',
      schoolName: '大阪青凌高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科特進Sコース(含内部)', capacity: 40 },
        { courseName: '普通科特進コース(含内部)', capacity: 80 },
        { courseName: '普通科進学コース(含内部)', capacity: 160 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000824',
      schoolName: '開明高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '6年文理編入コース(外部募集)', capacity: 80 }],
      totalCapacity: 80,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000897',
      schoolName: '大阪体育大学浪商高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '進学アドバンスコース(含内部・本校分のみ)', capacity: 25 },
        { courseName: '進学グローバルコース(含内部)', capacity: 30 },
        { courseName: '探究キャリアコース(含内部)', capacity: 70 },
        { courseName: '進学スポーツコース(含内部)', capacity: 70 },
        { courseName: '探究スポーツコース(スポーツ推薦・専願のみ)', capacity: 70 },
      ],
      totalCapacity: 265,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000931',
      schoolName: '大阪電気通信大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '工学(工学理数コース)', capacity: 40 },
        { courseName: '工学(工学連携コース)', capacity: 120 },
        { courseName: '普通(進学総合コース)', capacity: 120 },
        { courseName: '普通(健康スポーツコース)', capacity: 40 },
      ],
      totalCapacity: 320,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000129',
      schoolName: '大阪夕陽丘学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進Ⅰ類コース(2026年度版はコース再編後で単純な1:1対応ではない可能性)', capacity: 36 },
        { courseName: '特進Ⅱ類コース', capacity: 72 },
        { courseName: '文理進学コース', capacity: 108 },
        { courseName: '英語国際コース(2026年度版でPBLコースへ改称)', capacity: 72 },
        { courseName: '音楽コース', capacity: 36 },
        { courseName: '美術コース', capacity: 36 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000147',
      schoolName: '金蘭会高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '文理進学／看護・医療／こども教育／国際教養(グローバルスタンダード)／アスリート(全コース計、含内部)',
          capacity: 210,
        },
      ],
      totalCapacity: 210,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000726',
      schoolName: '関西大学高等部',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通科', capacity: 50 }],
      totalCapacity: 50,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000487',
      schoolName: '関西福祉科学大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特別進学Ⅰコース', capacity: 30 },
        { courseName: '特別進学Ⅱコース', capacity: 70 },
        { courseName: '進学コース', capacity: 140 },
        { courseName: '保育進学コース(女子のみ)', capacity: 30 },
      ],
      totalCapacity: 270,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000398',
      schoolName: '関西大倉高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進Sコース(約)', capacity: 35 },
        { courseName: '特進コース(約・総合コースは2024年度時点で既に募集停止)', capacity: 280 },
      ],
      totalCapacity: 315,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000575',
      schoolName: '賢明学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '関西学院大学特進サイエンスコース(含内部)', capacity: 70 },
        { courseName: '特進エグゼコース(含内部)', capacity: 50 },
        { courseName: '特進コース(含内部)', capacity: 100 },
      ],
      totalCapacity: 220,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000263',
      schoolName: '建国高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(特進30・総合50)', capacity: 80 }],
      totalCapacity: 80,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000281',
      schoolName: '香ヶ丘リベルテ高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'ファッションビジネス／フィジカル計(専願)', capacity: 70 },
        {
          courseName: '美容芸術／幼児教育／クッキングエキスパート／ライフデザイン／アンダンテ(計)',
          capacity: 152,
        },
      ],
      totalCapacity: 222,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000584',
      schoolName: '近畿大学泉州高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '英数特進コース(本校分のみ)', capacity: 80 },
        { courseName: '進学Ⅰ類コース(本校分のみ)', capacity: 80 },
        { courseName: '進学Ⅱ類コース(本校分のみ)', capacity: 80 },
      ],
      totalCapacity: 240,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000548',
      schoolName: '近畿大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'Super文理コース', capacity: 80 },
        { courseName: '特進文理コースⅠ', capacity: 40 },
        { courseName: '特進文理コースⅡ', capacity: 80 },
        { courseName: '英語特化コース', capacity: 40 },
        { courseName: '進学コース', capacity: 400 },
      ],
      totalCapacity: 640,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000771',
      schoolName: '関西大学北陽高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進アドバンスコース(2026年度公式サイト値は内部進学予定者を含む旨明記・本レコードの内部進学生の扱いは不明確なため差の一部は前提差異の可能性)', capacity: 30 },
        { courseName: '文理コース', capacity: 180 },
        { courseName: '進学アスリートコース(専願のみ)', capacity: 70 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000557',
      schoolName: '樟蔭高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '国際教養コース', capacity: 30 },
        { courseName: '身体表現コース', capacity: 30 },
        { courseName: '総合コース', capacity: 150 },
      ],
      totalCapacity: 210,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000110',
      schoolName: '四天王寺高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理選抜コース(外部・約)', capacity: 35 },
        { courseName: '文理コース(外部・約)', capacity: 90 },
        { courseName: '文化・スポーツコース(約)', capacity: 30 },
      ],
      totalCapacity: 155,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000753',
      schoolName: '興國高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科アドバンスコース スーパーアドバンス', capacity: 110 },
        { courseName: '普通科アドバンスコース プレミアムアドバンス', capacity: 80 },
        { courseName: '普通科アスリートアドバンスコース', capacity: 120 },
        { courseName: '普通科アカデミアコース', capacity: 120 },
        { courseName: '普通科キャリアトライコース', capacity: 40 },
        { courseName: 'ITビジネス科', capacity: 120 },
      ],
      totalCapacity: 590,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000815',
      schoolName: '金光藤蔭高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(スタンダード・エンカレッジ・アートアニメーション・トップアスリートの4コース計)',
          capacity: 280,
        },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000744',
      schoolName: '堺リベラル高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '表現教育科(専願)', capacity: 74 }],
      totalCapacity: 74,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000735',
      schoolName: '四天王寺東高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'Ⅰ・Ⅱ・Ⅲコース(普通科計)', capacity: 175 },
      ],
      totalCapacity: 175,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000628',
      schoolName: '金光大阪高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科特進Ⅰコース', capacity: 80 },
        { courseName: '普通科特進Ⅱコース', capacity: 80 },
        { courseName: '普通科進学コース', capacity: 200 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000414',
      schoolName: '香里ヌヴェール学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: 'スーパーアカデミー(SAC)・スーパーイングリッシュ(SEC)・グローバルサイエンス(GSC)(全コース計)',
          capacity: 180,
        },
      ],
      totalCapacity: 180,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000762',
      schoolName: '好文学園女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(特別進学・進学アドバンス・進学フロンティア・看護医療系進学・幼児教育・ITライセンス・メディアクリエイター・デザイン美術・マンガアニメーションの8コース計、2026年度版は9コース計への再編後)',
          capacity: 300,
        },
      ],
      totalCapacity: 300,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000691',
      schoolName: '金光八尾高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科S特進コース(約)', capacity: 40 },
        { courseName: '普通科特進コース(約)', capacity: 80 },
        { courseName: '普通科総合進学コース(約、2026年度版では美術コース25名が新設され4コース構成に)', capacity: 85 },
      ],
      totalCapacity: 205,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000450',
      schoolName: '四條畷学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科総合キャリアコース(内共学1クラス)', capacity: 280 },
        { courseName: '普通科発展キャリアコース(2026年度版は160へ増、総合キャリア/特別シンガクとの間で再配分の可能性)', capacity: 140 },
        { courseName: '普通科特別シンガクコース(2026年度版は40へ減)', capacity: 60 },
      ],
      totalCapacity: 480,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000913',
      schoolName: '常翔学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'スーパーコース', capacity: 40 },
        { courseName: '特進コース(2026年度版でアカデミックコースⅠへ改称)', capacity: 200 },
        { courseName: '文理コース(部活動選抜入試あり・2026年度版でアカデミックコースⅡへ改称)', capacity: 240 },
      ],
      totalCapacity: 480,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000370',
      schoolName: '常翔啓光学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コースⅠ類(選抜)', capacity: 40 },
        { courseName: '特進コースⅡ類', capacity: 120 },
        { courseName: '進学コース', capacity: 160 },
      ],
      totalCapacity: 320,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000272',
      schoolName: '城南学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(特進∞・特進+・特進3・特進看護・幼児教育・進学スタンダードの6コース計、含内部)',
          capacity: 230,
        },
      ],
      totalCapacity: 230,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000049',
      schoolName: '昇陽高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(特進・進学Ⅰ/Ⅱ/Ⅲ・看護医療系進学・保育教育・ITフロンティア・ビジネス公務員チャレンジ・パティシエの8コース計)',
          capacity: 270,
        },
        { courseName: '福祉科', capacity: 30 },
      ],
      totalCapacity: 300,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000664',
      schoolName: '精華高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'ニュースタンダードコース', capacity: 120 },
        { courseName: 'スーパーグローカルコース', capacity: 20 },
        { courseName: 'スポーツ&アートコース(専願のみ・強化クラブのみ)', capacity: 80 },
        { courseName: 'i-Techコース', capacity: 40 },
        { courseName: '環境福祉コース(専願のみ)', capacity: 30 },
        { courseName: 'フリーアカデミーコース(専願のみ)', capacity: 30 },
      ],
      totalCapacity: 320,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000441',
      schoolName: '清教学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'S特進コース理系(3年コース・外部募集)', capacity: 80 },
        { courseName: 'S特進コース文系(3年コース・外部募集)', capacity: 120 },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000101',
      schoolName: '清風高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '理Ⅲ6か年編入コース(男子)', capacity: 80 },
        { courseName: '理数コース(男子)', capacity: 80 },
        { courseName: '文理コース(男子・特技コース50名を含む)', capacity: 90 },
      ],
      totalCapacity: 250,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000520',
      schoolName: '清風南海高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '3か年特進コース(男女・外部募集)', capacity: 40 }],
      totalCapacity: 40,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000245',
      schoolName: '清明学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(文系・理系・看護医療系合計)', capacity: 120 },
        { courseName: '進学コース', capacity: 120 },
        { courseName: '総合コース', capacity: 120 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000977',
      schoolName: '星翔高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '工業技術系(機械工学科・電子機械工学科・電気工学科・コミュニケーションシステム工学科の一括募集)',
          capacity: 140,
        },
        { courseName: '普通科特進アドバンスコース', capacity: 20 },
        { courseName: '普通科総合キャリアコース', capacity: 70 },
        { courseName: '普通科アスリートコース(専願のみ・国際科スポーツコースから改称)', capacity: 70 },
      ],
      totalCapacity: 300,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000879',
      schoolName: '大商学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(特進Ⅰ類・特進Ⅱ類・情報クリエイティブ・進学の4コース計)',
          capacity: 320,
        },
        { courseName: '商業科', capacity: 40 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000058',
      schoolName: '相愛高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(含内部約10)', capacity: 30 },
        { courseName: '専攻選択コース(含内部約30)', capacity: 90 },
        { courseName: '音楽(含内部約10)', capacity: 30 },
      ],
      totalCapacity: 150,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000959',
      schoolName: '太成学院大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進セレクトコース', capacity: 80 },
        { courseName: 'ライフデザインコース', capacity: 120 },
        { courseName: '製菓パティスリーコース', capacity: 40 },
        { courseName: 'スポーツ(進学40・アスリート40)', capacity: 80 },
      ],
      totalCapacity: 320,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000511',
      schoolName: '羽衣学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科文理特進Ⅰ類・Ⅱ類コース(約)', capacity: 170 },
        { courseName: '普通科進学コース(約)', capacity: 170 },
      ],
      totalCapacity: 340,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000316',
      schoolName: '宣真高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(総合・アニメアート・保育系進学・看護医療特進の4コース計)',
          capacity: 280,
        },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000290',
      schoolName: '梅花高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: 'リベラルアーツコース(6専攻)・アドバンスコース(特進S/医療看護の2専攻)、全コース計',
          capacity: 280,
        },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000423',
      schoolName: '同志社香里高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '全日制課程 普通科(男子約30名)', capacity: 30 },
        { courseName: '全日制課程 普通科(女子約30名)', capacity: 30 },
      ],
      totalCapacity: 60,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000646',
      schoolName: '東海大学付属大阪仰星高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '英数特進コース', capacity: 40 },
        { courseName: '総合進学コース', capacity: 160 },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000405',
      schoolName: 'ピーエル学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '普通科(国公立コース・理文選修コースの2コース計、含内部)',
          capacity: 120,
        },
      ],
      totalCapacity: 120,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000940',
      schoolName: '阪南大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '探究特進コースS', capacity: 40 },
        { courseName: '探究特進コースA', capacity: 80 },
        { courseName: '総合進学コース', capacity: 320 },
      ],
      totalCapacity: 440,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000496',
      schoolName: '東大阪大学柏原高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: 'キャリアスポーツ・キャリアアップ・キャリアアシスト・アドバンスト・アスリートの5コース計',
          capacity: 300,
        },
      ],
      totalCapacity: 300,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000209',
      schoolName: '東大谷高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通科特進コース', capacity: 80 },
        { courseName: '普通科国際コース(2026年度公式値は40へ減)', capacity: 80 },
        { courseName: '普通科進学コース(2026年度公式値は160へ増、国際とのコース間再配分の可能性)', capacity: 120 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000307',
      schoolName: '箕面自由学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'SS特進コース(含内部)', capacity: 80 },
        { courseName: 'スーパー特進コース(含内部・2026年度版でS特進コースへ改称)', capacity: 120 },
        { courseName: '特進コース(含内部)', capacity: 160 },
        { courseName: '文理探究コース(含内部)', capacity: 120 },
        { courseName: 'クラブ選抜コース(専願のみ・含内部・2026年度版でクラブ探究コースへ改称)', capacity: 80 },
      ],
      totalCapacity: 560,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000851',
      schoolName: '利晶学園大阪立命館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'アドバンストSPコースα(2024年度版はアドバンスト英数コースαから改称直後)', capacity: 40 },
        { courseName: 'アドバンストSPコースβ', capacity: 80 },
        { courseName: '立命館コース(含理系クラス)', capacity: 120 },
        {
          courseName: 'スーペリアコース(2024年度版はグローバル特進コースα・βから改称直後・2026年度版で120へ増)',
          capacity: 80,
        },
        { courseName: '体育(特別専願)', capacity: 40 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000904',
      schoolName: '東大阪大学敬愛高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '総合進学コース(2026年度版は総合キャリアコース150名へ再編)', capacity: 120 },
        { courseName: 'こども教育コース(2026年度版では対応コースなし)', capacity: 60 },
        { courseName: '調理・製菓コース(2026年度版は90名へ増員)', capacity: 60 },
        { courseName: 'ファッション創造コース(2026年度版では対応コースなし、代わりにステップアップ/スーパーアスリートの2コース新設)', capacity: 60 },
      ],
      totalCapacity: 300,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310000174',
      schoolName: 'プール学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'スーパー特進・特進コース計(含内部)', capacity: 210 },
        { courseName: '国際コース', capacity: 30 },
        { courseName: '総合芸術コース', capacity: 20 },
      ],
      totalCapacity: 260,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
    {
      schoolCode: 'D127310001084',
      schoolName: '明浄学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '総合キャリアコース', capacity: 144 },
        { courseName: '看護メディカルコース', capacity: 36 },
        { courseName: '衛生看護コース(2024年新設)', capacity: 120 },
      ],
      totalCapacity: 300,
      source: KAKE2_2024_OSAKA_SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D127310001100',
      schoolName: '甲英高等学校',
      reason: '通信制高校(西宮本校・複数サポートキャンパス)で公式サイトに学年定員に相当する募集人員の記載が無く見送り',
    },
    {
      schoolCode: 'D127310001066',
      schoolName: 'ルネサンス大阪高等学校',
      reason: '通信制高校(株式会社立)で公式サイトの募集要項ページに学年定員に相当する募集人員の記載が無く見送り',
    },
    {
      schoolCode: 'D127310001057',
      schoolName: '秋桜高等学校',
      reason: '通信制高校で公式サイト募集要項ページに「募集人員 約90名」とのみ記載があり、概数表記のみで正確な定員数が公表されていないため見送り',
    },
    {
      schoolCode: 'D127310001039',
      schoolName: '天王寺学館高等学校',
      reason: '通信制・単位制高校で公式サイトに学年定員に相当する募集人員の記載が無く見送り',
    },
    {
      schoolCode: 'D127310001020',
      schoolName: '長尾谷高等学校',
      reason: '通信制・単位制高校で公式サイトの入学案内ページに学年定員に相当する募集人員の記載が無く見送り',
    },
    {
      schoolCode: 'D127310001011',
      schoolName: '八洲学園高等学校',
      reason: '広域通信制・単位制高校で毎月出願を受け付ける通年募集方式のため、公式サイトの募集要項ページに学年定員に相当する募集人員の記載が無く見送り',
    },
    {
      schoolCode: 'D127310000986',
      schoolName: '関西学院千里国際高等部',
      reason: '高等部は帰国生のみを対象とし(一般生・国際生の高等部募集は無し)、公式サイトおよび育伸社入試結果PDFいずれも帰国生入試の募集人員を「定員を定めない」としており、数値化された定員が存在しないため見送り',
    },
    {
      schoolCode: 'D127310000138',
      schoolName: '大阪星光学院高等学校',
      reason: '完全中高一貫化により高校からの外部募集を停止(2015年度以降)、または実施していても若干名のみで公式な定員数が確認できないため見送り(WebSearch要約による)',
    },
    {
      schoolCode: 'D127310000067',
      schoolName: '大阪女学院高等学校',
      reason: '公式サイトの募集要項ページに「約115名(普通科文系約40名/理系約30名、英語科英語コース約30名/国際バカロレアコース約15名)」とあり、いずれも概数表記のみで正確な定員数が公表されていないため見送り',
    },
    {
      schoolCode: 'D127310000236',
      schoolName: '帝塚山学院高等学校',
      reason: '公式サイトに「約40人」とのみ記載があり、コース別内訳を含め正確な定員数が公表されていないため見送り',
    },
    {
      schoolCode: 'D127310000183',
      schoolName: '大阪信愛学院高等学校',
      reason: '公式サイトに令和9年度(2027年度)募集要項として「普通科(特進コース約60名+総合進学コース・看護医療コース約180名)合計約240名」との記載があるのみで、いずれも概数表記かつ次年度サイクルの情報のため正確な定員数として採用せず見送り',
    },
    {
      schoolCode: 'D127310000343',
      schoolName: '金蘭千里高等学校',
      reason: '高等学校において生徒を募集しない完全中高一貫校(Wikipediaでも同旨記載・募集要項PDFの応募資格に「金蘭千里高等学校に進学を希望する者」と明記=完全内部進学前提)のため、高校段階の外部募集定員自体が存在せず見送り',
    },
    {
      schoolCode: 'D127310000352',
      schoolName: '高槻高等学校',
      reason: '2004年に高校からの生徒募集を停止し完全中高一貫校化(Wikipedia・複数の受験情報サイトで独立に一致確認・公式サイトも高校入試情報を掲載せず)のため、高校段階の外部募集定員自体が存在せず見送り',
    },
    {
      schoolCode: 'D127310000469',
      schoolName: '箕面学園高等学校',
      reason: '公式サイトの受験案内ページに「詳細は決まり次第、掲載いたします」とのみ記載され定員未掲載(特進/総合/アスリートの各コースページにも記載なし)。二次情報源(ksf-site.com)に「合計210名」との記述はあるがコース別内訳なく一次資料での裏付けが取れないため見送り',
    },
    {
      schoolCode: 'D127310000539',
      schoolName: '大阪緑涼高等学校',
      reason: '公式入試要項ページで普通科特別進学30名・総合進学150名・調理製菓科調理師35名(専願)・製菓衛生師25名(専願)は確定数値を確認できたが、同じ普通科の「保育系進学コース」のみ公式サイト・第三者サイトいずれにも定員記載がなく非公表。学校全体の総定員を確定できないため一部数値のみの掲載は避け見送り',
    },
    {
      schoolCode: 'D127310000593',
      schoolName: '関西創価高等学校',
      reason: '公式サイトの令和9年度(2027年度)募集要項は全数値が「約30名」「約70名」等の概数表記のみ。二次情報源(studyh.jp)の令和7年度分は一般枠110名(公式の約70名と大きく乖離)と記載され、年度差を考慮しても整合が取れず正確な定員を確定できないため見送り',
    },
  ],
};
