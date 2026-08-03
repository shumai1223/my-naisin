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
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_OSAKA_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03927.pdf',
  docTitle: '2026年度 国立高校・高専・私立高校 募集要項【大阪府】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
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
  ],
  skipped: [
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
  ],
};
