/**
 * 神奈川県私立高等学校の募集定員データ(Λ-5第二段・大都市圏5県)。
 * (株)育伸社「2026年度 私立高校 募集要項【神奈川県】」(2025年11月4日現在)をRead toolで
 * PDF原本を直接解析(千葉/京都で確立した手法)。参照台帳83校と規模が大きいため複数周回に
 * 分けて処理する方針(千葉/静岡/兵庫と同様)。「全コース計」「普通科計」等の記法は既存県と
 * 同一方針で1つの統合コースとして記録し、推薦・一般等の入試方式が別々の数値を明記している
 * 場合は合算する。一方「↓」は直前行と同一の値を意味し、合算しない(単一のクォータを複数の
 * 出願方法で共有している場合はこの記法になる)。1ページ目9校・2ページ目冒頭4校に続き、
 * 慶應義塾・慶應義塾湘南藤沢の2校を追加(いずれも一般募集数値が「若干」の枠は未算入)。
 * 2ページ目の光明学園相模原・相模女子大学・向上・湘南学院は校名とコース名の列対応が
 * 複雑で誤帰属リスクがあるため今回は見送り(次回再訪の価値あり)。3ページ目から星槎・
 * 聖セシリア女子・聖ヨゼフ学園・聖和学院・捜真女学校・相洋・橘学苑の7校、4ページ目から
 * 桐蔭学園・立花学園・中央大学附属横浜・鶴見大学附属・東海大学付属相模・桐光学園・
 * 藤嶺学園藤沢・日本女子大学附属・日本大学・日本大学藤沢の10校を追加。5ページ目から
 * 武相(男子校・10コース)・平塚学園・藤沢翔陵・法政大学第二を追加。**教訓**: 5ページ目は
 * 学校名と数値ブロックの対応が名前欄の見た目の並び順だけでは判断できず、各ブロックの
 * 願書受付開始日/終了日等の日付パターンが完全一致するかで学校の境目を特定する方法が
 * 有効だった(桐蔭学園/湘南工科大学附属の訂正と同じ教訓の実践)。白鵬女子・法政大学国際は
 * 日付パターンで裏取りできる数値を特定できず今回は見送り(次回、日付パターン照合を
 * 最初から徹底して再挑戦する)。6ページ目から聖園女学院・三浦学苑を追加。法政大学第二の
 * ブロック(150/150/50/50)は直後の森村学園との境界を完全には確証できておらず、次回の
 * 日付パターン照合で再検算する必要がある(該当エントリのsourceに注記済み)。続けて日付
 * パターン照合と公知のコース名照合を併用し横須賀学院・山手学院・横浜翠陵・横浜商科大学・
 * 横浜高等学校の5校を追加。横浜学園は「S選抜コース・A進学コース」という横須賀学院と
 * 酷似したコース構成のブロックが別に存在し、どちらの学校の実際の公表コース名と一致するか
 * 確信が持てなかったため今回は見送り(横須賀学院側を公知の実在コース名と照合し確度高く採用)。
 * 7ページ目から横浜清風・横浜創英・横浜創学館・横浜隼人・横浜富士見丘学園の5校を追加
 * (いずれも公知の実在コース名と一致することを確認済み)。
 * **2026-07-31訂正**: 桐蔭学園の数値を当初「湘南工科大学附属」として誤収録していたことが
 * 判明(4ページ目の桐蔭学園ブロックと3ページ目の湘南工科大学附属ブロックを取り違えた)。
 * schoolCodeを桐蔭学園の正しいコードへ修正し、湘南工科大学附属は正しい数値が別途確認できる
 * までskippedへ退避した。**教訓**: 大都市圏PDFはページをまたいだ同種コース構成(3コース制・
 * 推薦/A方式/B方式のような同一パターン)を持つ複数校が存在し、ページ番号や前後の学校名を
 * 都度再確認せずに数値ブロックだけを追うと取り違えるリスクがある。今後は学校名ラベルと
 * 数値ブロックの直近性を毎回再確認すること。
 * **2026-07-31追記**: 育伸社PDFで対応付けが困難だった学校の公式サイト個別確認へ切替え、
 * 森村学園・白鵬女子・横浜学園の3校を追加収録(51校)。続けて残存未着手校を調査したところ、
 * 浅野・聖光学院・フェリス女学院・横浜共立学園・横浜雙葉・サレジオ学院・栄光学園・
 * 清泉女学院・湘南白百合学園の9校が高校からの生徒募集を行わない完全中高一貫校と判明
 * (Wikipedia等の独立情報源で確認)。兵庫/京都で発見済みの「難関進学校ほど高校募集を廃止して
 * いる」パターンが神奈川でも再現。これらはskippedへ理由付きで記録。続けて神奈川学園・
 * 横浜女学院・関東学院・青山学院横浜英和・公文国際学園・神奈川大学附属・洗足学園・
 * カリタス女子・逗子開成の9校も同様に完全中高一貫と確認。清心女子・秀英の2校は通信制
 * 高校のため全日制と同種の県別募集定員の性質に馴染まずスキップ(合計skipped21校)。続けて
 * 鎌倉女学院・湘南学園も完全中高一貫と確認、厚木中央・鹿島山北も通信制と判明、湘南ライナス
 * 学園はWikipediaに「2012年廃校」の記載があり文科省学校コード一覧との整合性を確認できず
 * 不確実としてスキップ(合計skipped26校)。続けて向上高等学校(公式サイトPDF・4コース合計280)
 * と湘南学院高等学校(公式サイトPDF・4コース合計445が原資料の「定員445名」と完全一致検算)を
 * 収録(53校)。シュタイナー学園高等部は小中高一貫で外部転入は欠員時の若干名のみのため
 * 固定定員が無くskippedへ(合計skipped27校)。
 *
 * 【掛-2（私立×多年度）着手(2026-08-09)】大都市圏5県の2番目。Wayback CDX APIでikushin
 * 03914.pdfの2023年10月3日キャプチャ(「2024年度」版)を発掘し、1ページ目10校を再突合。
 * 旭丘・麻布大学附属・アレセイア湘南・英理女子学院・柏木学園・鎌倉学園・鎌倉国際文理
 * (当時鎌倉女子大学)・函嶺白百合学園の8校は総定員完全一致。**大西学園(120→160)・
 * 関東学院六浦(40→25)で実際の変化を検出**。
 *
 * 【掛-2続き(2026-08-09)】ページ2〜3も処理し25校へ拡大。鵠沼・慶應義塾湘南藤沢・向上・
 * 湘南学院・相模女子大学・相模原(光明学園相模原)・聖セシリア女子・聖ヨゼフ学園・聖和学院・
 * 相洋の10校は総定員完全一致(向上/湘南学院/相模女子大学/相模原/相洋はコース単位の内訳まで
 * 完全一致という強い確認が取れた)。慶應義塾は2024年版が帰国生を「若干名」として除外していた
 * ため単純比較では370→390の差が出るが、令和8年度版で帰国生が新たに20名と数値公表された
 * 可能性が高く単純な定員変化ではない(要注記)。**星槎(73→49)・捜真女学校(25→35)・
 * 橘学苑(200→204)で実際の変化を検出**。北鎌倉女子学園は2024年版のコース構成(先進・特進・
 * 音楽の3区分)が令和8年度版(先進・特進統合の1区分+音楽)と対応関係を確信できず見送り
 * (要再検証)。湘南工科大学附属は過去に桐蔭学園との取り違え事故があり現在も本体がskipped
 * 中のため、正しい令和8年度データが定まるまで2024年版の追加も見送る。
 *
 * 【掛-2続き2(2026-08-09)】ページ4〜5も処理し34校へ拡大。立花学園・鶴見大学附属・
 * 東海大学付属相模・藤嶺学園藤沢・日本女子大学附属・日本大学・日本大学藤沢・平塚学園・
 * 藤沢翔陵・法政大学第二の10校は総定員完全一致(法政大学第二は2024年版でも同一の数値
 * ブロックが独立して確認でき、令和8年度版の校名帰属の不確実性コメントを裏付け的に解消)。
 * **中央大学附属横浜(100→110)・桐蔭学園(660→720)で実際の変化を検出**。武相・白鵬女子
 * (いずれも令和8年度版で16名単位×10コースの精緻な構造)は2024年版で20名単位×9区分の
 * 粗い読み取りとなり構造が一致せず、合計だけ偶然一致した可能性が拭えないため収録を見送った
 * (要再検証)。桐光学園は「一般2回」欄が「↓」(直前と同値)か独立数値か再読で確信が持てず見送り
 * (要再検証)。
 *
 * 【掛-2完了(2026-08-09)】ページ6〜7を処理し47校で完走(56校中47校=7頁全処理済み)。
 * 三浦学苑・山手学院・横須賀学院・横浜・横浜学園・横浜商科大学・横浜創学館の7校は
 * 総定員完全一致(三浦学苑は2024年版でIBコースが独立していたが総定員394が令和8年度版と
 * 完全一致=IBコースが総合コースへ統合された可能性を示唆)。**横浜清風(337→340)・
 * 横浜創英(230→220)・横浜隼人(263→251)・横浜富士見丘学園(120→150)で実際の変化を検出**。
 * 緑ヶ丘女子(校名変更・コース全面刷新)・横浜翠陵(総定員120→320の大幅乖離で構造不一致)は
 * 収録を見送った。残る9校(神奈川歯科大学系属緑ヶ丘女子・北鎌倉女子学園・桐光学園・武相・
 * 聖園女学院・横浜翠陵・白鵬女子・森村学園・法政大学国際)はいずれも構造複雑または既知の
 * 帰属不確実性により要再検証のまま残存。これで大都市圏5県の2番目kanagawaの掛-2が完了。
 */
import type { PrivateSchoolDetailFile } from '@/lib/private-school-detail';

const IKUSHIN_KANAGAWA_SOURCE = {
  url: 'https://www.ikushin.co.jp/school/pdf/03914.pdf',
  docTitle: '2026年度 私立高校 募集要項【神奈川県】（(株)育伸社 入試情報課・2025年11月4日現在）',
  fetchedAt: '2026-07-31',
  sourceTier: 'secondary' as const,
};

const KAKE2_2024_KANAGAWA_SOURCE = {
  url: 'https://web.archive.org/web/20231106155753if_/https://www.ikushin.co.jp/school/PDF/03914.pdf',
  docTitle: '2024年度 私立高校 募集要項【神奈川県】(株式会社育伸社 入試情報課・2023年10月3日現在・Web Archive経由で取得)',
  fetchedAt: '2026-08-09',
  sourceTier: 'secondary' as const,
};

export const PRIVATE_SCHOOL_DETAIL_KANAGAWA: PrivateSchoolDetailFile = {
  prefectureCode: 'kanagawa',
  schools: [
    {
      schoolCode: 'D114320600010',
      schoolName: '旭丘高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦120+一般120)', capacity: 240 },
        { courseName: '総合(推薦116+一般117)', capacity: 233 },
      ],
      totalCapacity: 473,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114315000025',
      schoolName: '麻布大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: 'S特進クラス・特進クラス・進学クラス(全コース計、推薦55+一般200)', capacity: 255 }],
      totalCapacity: 255,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320700019',
      schoolName: 'アレセイア湘南高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特進コース・探求コース(普通科計、推薦70+一般110+オープン20)', capacity: 200 }],
      totalCapacity: 200,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000231',
      schoolName: '英理女子学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'iグローバルコース(女、推薦30+一般80)', capacity: 80 },
        { courseName: '進学教養コース(女、推薦40+一般40)', capacity: 80 },
        { courseName: 'ビジネスデザインコース(女、推薦20+一般20)', capacity: 40 },
        { courseName: '情報デザインコース(女、推薦40+一般40)', capacity: 80 },
        { courseName: 'ライフデザインコース(女、推薦40+一般40)', capacity: 80 },
      ],
      totalCapacity: 360,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000011',
      schoolName: '大西学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦40+併願一般70)', capacity: 110 },
        { courseName: '家庭(女、推薦20+併願一般30)', capacity: 50 },
      ],
      totalCapacity: 160,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114321300020',
      schoolName: '柏木学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'アドバンスコース(推薦30+一般30)', capacity: 60 },
        { courseName: 'スタンダードコース(推薦70+一般70)', capacity: 140 },
        { courseName: '情報コース(推薦20+一般15)', capacity: 35 },
        { courseName: '全コース共通オープン枠', capacity: 5 },
      ],
      totalCapacity: 240,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320100033',
      schoolName: '神奈川歯科大学系属緑ヶ丘女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'Sクラス(女、推薦10+書類選考15+一般専願5)', capacity: 30 },
        { courseName: 'Aクラス(女、推薦35+書類選考50+一般専願15+総合型・スポーツ優遇20)', capacity: 120 },
      ],
      totalCapacity: 150,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(2026年度より緑ヶ丘女子から校名変更)',
      },
    },
    {
      schoolCode: 'D114320400021',
      schoolName: '鎌倉学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、一般A方式90+一般B方式20)', capacity: 110 }],
      totalCapacity: 110,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320400058',
      schoolName: '鎌倉国際文理高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '国際教養コース(推薦35含内部+一般併願35+オープン5)', capacity: 75 },
        { courseName: '総合文理コース(推薦75含内部+一般専願25+一般併願50+オープン10)', capacity: 160 },
      ],
      totalCapacity: 235,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(2026年度より鎌倉女子大学から校名変更・女子から共学化)',
      },
    },
    {
      schoolCode: 'D114310000197',
      schoolName: '関東学院六浦高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(一般・GLEクラス、推薦10+一般書類選考15)', capacity: 25 }],
      totalCapacity: 25,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114338200016',
      schoolName: '函嶺白百合学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女、推薦20+一般30)', capacity: 50 }],
      totalCapacity: 50,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320400049',
      schoolName: '北鎌倉女子学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '先進コース・特進コース・国際コース(女、普通科計、推薦50+一般書類選考100)', capacity: 150 },
        { courseName: '音楽(女、推薦5+一般20)', capacity: 25 },
      ],
      totalCapacity: 175,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320500011',
      schoolName: '鵠沼高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '英語コース', capacity: 30 },
        { courseName: '理数コース', capacity: 30 },
        { courseName: '文理コース', capacity: 190 },
      ],
      totalCapacity: 250,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(各コースとも推薦・一般専願・一般併願・一般オープンで同一の募集人員が記載)',
      },
    },
    {
      schoolCode: 'D114310000222',
      schoolName: '慶應義塾高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(男、推薦1次約40)', capacity: 40 },
        { courseName: '普通(男、一般、含帰国)', capacity: 330 },
        { courseName: '普通(男、帰国生)', capacity: 20 },
      ],
      totalCapacity: 390,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(帰国は若干名、全国枠(神奈川・東京・千葉・埼玉以外の居住者対象)は若干名のため数値化できず未算入)',
      },
    },
    {
      schoolCode: 'D114320500093',
      schoolName: '慶應義塾湘南藤沢高等部',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(帰国生)', capacity: 20 }],
      totalCapacity: 20,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(帰国生約20名のみ数値記載。全国枠は若干名のため未算入。一般募集の記載はこのPDFに無い)',
      },
    },
    {
      schoolCode: 'D114310000295',
      schoolName: '星槎高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦25+一般24)', capacity: 49 }],
      totalCapacity: 49,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114321300011',
      schoolName: '聖セシリア女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女、推薦15+一般専併15)', capacity: 30 }],
      totalCapacity: 30,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000026',
      schoolName: '聖ヨゼフ学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '総合進学コース・AEコース・ILコース(推薦20+一般書類選考20)', capacity: 40 }],
      totalCapacity: 40,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320800018',
      schoolName: '聖和学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '英語(グローバルコース)(女、推薦10+1回書類選考30+オープン5)', capacity: 45 },
        { courseName: '普通(リベラルコース)(女、推薦10+1回書類選考30+オープン5)', capacity: 45 },
      ],
      totalCapacity: 90,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000099',
      schoolName: '捜真女学校高等学部',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女、推薦15+一般20)', capacity: 35 }],
      totalCapacity: 35,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320600029',
      schoolName: '相洋高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(選抜クラス、推薦5+一般筆記20+チャレンジ二次5)', capacity: 30 },
        { courseName: '特進コース(特進クラス、推薦25+一般筆記55+チャレンジ二次5)', capacity: 85 },
        { courseName: '文理コース(理科クラス、推薦30+一般筆記60+チャレンジ二次5)', capacity: 95 },
        { courseName: '文理コース(文科クラス、推薦60+一般筆記120+チャレンジ二次5)', capacity: 185 },
        { courseName: '進学コース(推薦60+一般筆記125+チャレンジ二次5)', capacity: 190 },
      ],
      totalCapacity: 585,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000035',
      schoolName: '橘学苑高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進選抜コース(推薦15+一般書類選考15)', capacity: 30 },
        { courseName: '文理総合コース(推薦72+一般書類選考72)', capacity: 144 },
        { courseName: 'デザイン美術コース(推薦15+一般書類選考15)', capacity: 30 },
      ],
      totalCapacity: 204,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000357',
      schoolName: '桐蔭学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'プログレスコース(推薦30+A方式オープン30+B方式書類選考150)', capacity: 210 },
        { courseName: 'アドバンスコース(推薦80+A方式オープン30+B方式書類選考190)', capacity: 300 },
        { courseName: 'スタンダードコース(推薦90+A方式オープン20+B方式書類選考100)', capacity: 210 },
      ],
      totalCapacity: 720,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114336300019',
      schoolName: '立花学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(推薦20+1次専願筆記60)', capacity: 80 },
        { courseName: '進学コース(推薦100+1次専願筆記140)', capacity: 240 },
        { courseName: '総進コース(推薦60+1次専願筆記100)', capacity: 160 },
      ],
      totalCapacity: 480,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000375',
      schoolName: '中央大学附属横浜高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦35+一般A書類選考35+一般B40)', capacity: 110 }],
      totalCapacity: 110,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000044',
      schoolName: '鶴見大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '総合進学コース・特進コース(全コース計、推薦20+一般書類選考40+一般A併願オープン30+一般Bオープン10)', capacity: 100 }],
      totalCapacity: 100,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114315000052',
      schoolName: '東海大学付属相模高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦200+一般240)', capacity: 440 }],
      totalCapacity: 440,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000066',
      schoolName: '桐光学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '男子部SAコース(推薦40+一般1回60+一般2回40)', capacity: 140 },
        { courseName: '女子部SAコース(一般1回20+一般2回20)', capacity: 40 },
      ],
      totalCapacity: 180,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(女子部SAコースの推薦は若干名のため未算入。帰国は両部門とも若干名のため未算入)',
      },
    },
    {
      schoolCode: 'D114320500066',
      schoolName: '藤嶺学園藤沢高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(男、推薦15+Ⅰ期A書類80+Ⅰ期B10)', capacity: 105 }],
      totalCapacity: 105,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000057',
      schoolName: '日本女子大学附属高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女、推薦約65+一般専願約65)', capacity: 130 }],
      totalCapacity: 130,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000240',
      schoolName: '日本大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特別進学コース・総合進学コース・総合進学コーススーパーグローバルクラス(普通科計、推薦100+A日程一般併願160)', capacity: 260 }],
      totalCapacity: 260,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320500057',
      schoolName: '日本大学藤沢高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(推薦160+一般200)', capacity: 360 }],
      totalCapacity: 360,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000259',
      schoolName: '武相高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '進学クラス(男、推薦16+一般書類選考16)', capacity: 32 },
        { courseName: 'グローバルスタンダードコース(男、推薦16+一般書類選考16)', capacity: 32 },
        { courseName: '進学アドバンスコース(男、推薦16+一般書類選考16)', capacity: 32 },
        { courseName: 'グローバルアドバンスコース(男、推薦16+一般書類選考16)', capacity: 32 },
        { courseName: 'グローバルJSLコース(男、推薦15+一般書類選考15、新設)', capacity: 30 },
        { courseName: 'ダンスアート表現コース(男、推薦16+一般書類選考16)', capacity: 32 },
        { courseName: 'スポーツコース(男、推薦30+一般書類選考30)', capacity: 60 },
        { courseName: 'メディアアート表現コース(男、推薦30+一般書類選考30)', capacity: 60 },
        { courseName: '保育・フードコーディネートコース(男、推薦15+一般書類選考15)', capacity: 30 },
        { courseName: '総合コース(男、推薦30+一般書類選考30)', capacity: 60 },
      ],
      totalCapacity: 400,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320300013',
      schoolName: '平塚学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進選抜コース(推薦35+一般専願35)', capacity: 70 },
        { courseName: '特進コース(推薦35+一般専願35)', capacity: 70 },
        { courseName: '進学コース(推薦180+一般専願180)', capacity: 360 },
      ],
      totalCapacity: 500,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320500075',
      schoolName: '藤沢翔陵高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '文理融合探究コース(男、推薦5+一般1回20+書類選考5+オープン5)', capacity: 35 },
        { courseName: '得意分野探究コース(男、推薦60+一般1回110+オープン5)', capacity: 175 },
        { courseName: '商業(男、推薦25+一般1回45)', capacity: 70 },
      ],
      totalCapacity: 280,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000020',
      schoolName: '法政大学第二高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(書類選考男子150+書類選考女子150+学科試験男子50+学科試験女子50)', capacity: 400 },
      ],
      totalCapacity: 400,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle:
          IKUSHIN_KANAGAWA_SOURCE.docTitle +
          '(⚠️2026-07-31時点でこの数値ブロックの帰属校を6ページ目の校名欄位置から特定したが、直後の森村学園との境界を完全には確証できていない。次回、日付パターン照合法で再検算すること)',
      },
    },
    {
      schoolCode: 'D114320500084',
      schoolName: '聖園女学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(女、推薦15+一般15)', capacity: 30 }],
      totalCapacity: 30,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320100024',
      schoolName: '三浦学苑高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(推薦10+一般書類選考10)', capacity: 20 },
        { courseName: '進学コース(推薦83+一般書類選考83)', capacity: 166 },
        { courseName: '総合コース(推薦83+一般書類選考83)', capacity: 166 },
        { courseName: '工業技術(推薦・一般書類選考ともものづくり系21+デザイン系21)', capacity: 42 },
      ],
      totalCapacity: 394,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320100042',
      schoolName: '横須賀学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: 'S選抜コース・A進学コース(A進学・S選抜計、推薦80+書類選考120+オープンⅡ10)', capacity: 210 }],
      totalCapacity: 210,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000277',
      schoolName: '山手学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '進学コース・特別進学コース(普通科計、A日程併願80+A日程オープン40+B日程併願30+B日程オープン20)', capacity: 170 }],
      totalCapacity: 170,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000339',
      schoolName: '横浜翠陵高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進フロンティアコース(推薦30+一般書類20)', capacity: 50 },
        { courseName: '国際語(推薦130+一般書類140)', capacity: 270 },
      ],
      totalCapacity: 320,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000286',
      schoolName: '横浜商科大学高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(推薦10+一般書類選考10+学科試験15+オープン5)', capacity: 40 },
        { courseName: '進学コース(推薦140+一般書類選考60+学科試験140+オープン10)', capacity: 350 },
        { courseName: '総合ビジネス(旧商業科、推薦40+一般書類選考40+学科試験100+オープン10)', capacity: 190 },
      ],
      totalCapacity: 580,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000204',
      schoolName: '横浜高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'プレミアコース(推薦100)', capacity: 100 },
        { courseName: 'アドバンスコース(推薦350)', capacity: 350 },
        { courseName: 'アクティブコース(推薦160)', capacity: 160 },
      ],
      totalCapacity: 610,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(推薦以降の一般各方式は全て↓で同一数値を継承)',
      },
    },
    {
      schoolCode: 'D114310000179',
      schoolName: '横浜清風高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '特進コース(推薦25+一般筆記30+オープン5)', capacity: 60 },
        { courseName: '総合進学コース(推薦140+一般筆記130+オープン10)', capacity: 280 },
      ],
      totalCapacity: 340,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000080',
      schoolName: '横浜創英高等学校',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '特進フロンティアコース(推薦110+オープン110)', capacity: 220 }],
      totalCapacity: 220,
      source: {
        ...IKUSHIN_KANAGAWA_SOURCE,
        docTitle: IKUSHIN_KANAGAWA_SOURCE.docTitle + '(中高一貫のサイエンスコース・グローバルコースで別途若干名募集ありと注記されるが数値未公表のため未算入)',
      },
    },
    {
      schoolCode: 'D114310000213',
      schoolName: '横浜創学館高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(特別進学)(推薦20+一般20)', capacity: 40 },
        { courseName: '普通(文理選抜)(推薦90+一般90)', capacity: 180 },
        { courseName: '普通(総合進学)(推薦60+一般60)', capacity: 120 },
      ],
      totalCapacity: 340,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000348',
      schoolName: '横浜隼人高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '普通(推薦60含帰国+一般専願120+オープン8)', capacity: 188 },
        { courseName: '国際語(推薦20含帰国+一般専願40+オープン3)', capacity: 63 },
      ],
      totalCapacity: 251,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000302',
      schoolName: '横浜富士見丘学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '進学クラス(推薦35+一般30+オープン10)', capacity: 75 },
        { courseName: '特進クラス(推薦35+一般30+オープン10)', capacity: 75 },
      ],
      totalCapacity: 150,
      source: IKUSHIN_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000017',
      schoolName: '白鵬女子高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: '進学アドバンスコース(女、推薦16+一般16)', capacity: 32 },
        { courseName: '進学スタンダードコース(女、推薦16+一般16)', capacity: 32 },
        { courseName: 'グローバルアドバンスコース(女、推薦16+一般16)', capacity: 32 },
        { courseName: 'グローバルスタンダードコース(女、推薦16+一般16)', capacity: 32 },
        { courseName: 'グローバルＪＳＬコース(女、推薦15+一般15)', capacity: 30 },
        { courseName: 'ダンスアート表現コース(女、推薦16+一般16)', capacity: 32 },
        { courseName: 'メディアアート表現コース(女、推薦30+一般30)', capacity: 60 },
        { courseName: 'スポーツコース(女、推薦30+一般30)', capacity: 60 },
        { courseName: '保育・フードコーディネートコース(女、推薦15+一般15)', capacity: 30 },
        { courseName: '総合コース(女、推薦30+一般30)', capacity: 60 },
      ],
      totalCapacity: 400,
      source: {
        url: 'https://www.hakuhojoshi-h.ed.jp/prospective/guideline/',
        docTitle: '白鵬女子高等学校 令和8年度(2026年度)入試 募集要項ページ(推薦入試・一般入試の募集人員表・オープン入試は各コースとも若干名のため未算入)',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D114310000188',
      schoolName: '横浜学園高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'クリエイティブコース(推薦30+一般20)', capacity: 50 },
        { courseName: 'アカデミーコース(推薦130+一般140)', capacity: 270 },
      ],
      totalCapacity: 320,
      source: {
        url: 'https://www.yokogaku.ed.jp/entry/pdf/2025/2026yoko.pdf',
        docTitle:
          '横浜学園高等学校 令和8年度(2026年度)生徒募集要項' +
          '(第二次入学試験は両コースとも若干名で数値非公表のため未算入。育伸社PDFでは横須賀学院と酷似したS選抜/A進学構成のブロックがあり確信が持てず見送っていたため本校公式サイトの一次資料を優先採用)',
        fetchedAt: '2026-07-31',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D114310000311',
      schoolName: '森村学園高等部',
      fiscalYearLabel: '2026年度',
      courses: [{ courseName: '普通(一般入試・書類選考)', capacity: 10 }],
      totalCapacity: 10,
      source: {
        url: 'https://www.morimura.ac.jp/jsh/admission/senior/_pdf/senior_guidance_2026.pdf',
        docTitle:
          '令和8年度(2026年度)森村学園高等部 一般入学試験・帰国生入学試験 募集要項' +
          '(帰国生入試A型・B型はいずれも男女若干名で数値非公表のため未算入。育伸社PDFの森村学園ブロックは法政大学第二との境界が確証できず見送り記録があるため本校公式サイトの一次資料を優先採用)',
        fetchedAt: '2026-07-31',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D114321400010',
      schoolName: '向上高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'S特進コース(推薦10+一般10)', capacity: 20 },
        { courseName: '特進コース(推薦15+一般15)', capacity: 30 },
        { courseName: '選抜コース(推薦35+一般55)', capacity: 90 },
        { courseName: '文理コース(推薦60+一般80)', capacity: 140 },
      ],
      totalCapacity: 280,
      source: {
        url: 'https://www.kj.kojo.ed.jp/wp-content/themes/kojo2025/images/pdf/app.pdf',
        docTitle: '向上高等学校 令和8年度生徒募集要項(二次入試は全コース若干名で数値非公表のため未算入)',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D114320100015',
      schoolName: '湘南学院高等学校',
      fiscalYearLabel: '2026年度',
      courses: [
        { courseName: 'サイエンス(特進理数)コース(推薦10+一般10)', capacity: 20 },
        { courseName: 'アドバンス(特進)コース(推薦30+一般70)', capacity: 100 },
        { courseName: 'アビリティ(進学)コース(推薦60+一般80)', capacity: 140 },
        { courseName: 'リベラルアーツ(総合)コース(推薦100+一般85)', capacity: 185 },
      ],
      totalCapacity: 445,
      source: {
        url: 'https://shonangakuin.ed.jp/files/pdf/entrance-examination/R08_requirements.pdf',
        docTitle: '湘南学院高等学校 2026年度入試生徒募集要項(コース合計445名は原資料の「定員 全日制/普通科/445名」と完全一致検算済み)',
        fetchedAt: '2026-07-31',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D114310000053',
      schoolName: '法政大学国際高等学校',
      fiscalYearLabel: '令和8年度(2026年度)',
      courses: [
        { courseName: 'グローバル探究コース A書類選考', capacity: 210 },
        { courseName: 'グローバル探究コース B学科試験', capacity: 50 },
        { courseName: 'グローバル探究コース C思考力入試(概数)', capacity: 10 },
        {
          courseName: 'グローバル探究コース D帰国生・海外生入試(Ⅰ期/Ⅱ期/同時審査計・概数)',
          capacity: 10,
        },
        {
          courseName: 'IBコース D帰国生・海外生入試(IB)・E IB入試の合計(概数)',
          capacity: 20,
        },
      ],
      totalCapacity: 300,
      source: {
        url: 'https://kokusai-high.ws.hosei.ac.jp/admission/result',
        docTitle: '入試情報(過去の入試結果)（法政大学国際高等学校）2026(令和8)年度募集人数表',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D114315000034',
      schoolName: '相模女子大学高等部',
      fiscalYearLabel: '2026年度（女子・オープン入試分は定員非公表のため含まず）',
      courses: [
        { courseName: '特進コース(推薦入試)', capacity: 25 },
        { courseName: '特進コース(一般入試・書類選考)', capacity: 35 },
        { courseName: '進学コース(推薦入試)', capacity: 100 },
        { courseName: '進学コース(一般入試・書類選考)', capacity: 100 },
      ],
      totalCapacity: 260,
      source: {
        url: 'https://www.sagami-wu.ac.jp/chukou/wp/wp-content/uploads/2025/09/0f3f7520143a6dd17081ce2ba2bfe78c.pdf',
        docTitle: '2026年度 生徒募集要項（相模女子大学高等部）入学試験概要',
        fetchedAt: '2026-08-04',
        sourceTier: 'primary' as const,
      },
    },
    {
      schoolCode: 'D114315000043',
      schoolName: '相模原高等学校',
      fiscalYearLabel: '2026年度（正式名称：光明学園相模原高等学校。県立相模原高等学校とは別法人の私立校のため住所照合済み）',
      courses: [
        { courseName: '総合コース(推薦入試)', capacity: 155 },
        { courseName: '総合コース(一般入試・一次書類選考含む)', capacity: 150 },
        { courseName: '総合コース(オープン入試)', capacity: 5 },
        { courseName: '体育科学コース(推薦入試)', capacity: 35 },
        { courseName: '体育科学コース(一般入試)', capacity: 35 },
        { courseName: '文理コース(推薦入試)', capacity: 30 },
        { courseName: '文理コース(一般入試・一次書類選考含む)', capacity: 25 },
        { courseName: '文理コース(オープン入試)', capacity: 5 },
      ],
      totalCapacity: 440,
      source: {
        url: 'https://school.js88.com/scl_h/22042700?page=9',
        docTitle: 'JS日本の学校（光明学園相模原高等学校）2026年度募集人員。公式PDF(komyo.ed.jp)はフォント埋め込み異常(Adobe-Japan1文字コレクション不明)によりpdftotext/WebFetch/Read全手法でテキスト抽出不能のため二次情報源で代替',
        fetchedAt: '2026-08-04',
        sourceTier: 'secondary' as const,
      },
    },
    {
      schoolCode: 'D114320600010',
      schoolName: '旭丘高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(推薦120+一般120)', capacity: 240 },
        { courseName: '総合(推薦116+一般117)', capacity: 233 },
      ],
      totalCapacity: 473,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114315000025',
      schoolName: '麻布大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: 'S特進クラス・特進クラス・進学クラス(全コース計、推薦55+一般200)', capacity: 255 }],
      totalCapacity: 255,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320700019',
      schoolName: 'アレセイア湘南高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '特進コース・探求コース(普通科計、推薦70+一般110+オープン20)', capacity: 200 }],
      totalCapacity: 200,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000231',
      schoolName: '英理女子学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'iグローバル部(女、推薦30+一般併願50)', capacity: 80 },
        { courseName: 'キャリア部進学教養コース(女、推薦40+一般併願40)', capacity: 80 },
        { courseName: 'キャリア部ビジネスデザインコース(女、推薦20+一般併願20)', capacity: 40 },
        { courseName: 'キャリア部情報デザインコース(女、推薦40+一般併願40)', capacity: 80 },
        { courseName: 'キャリア部ライフデザインコース(女、推薦40+一般併願40)', capacity: 80 },
      ],
      totalCapacity: 360,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000011',
      schoolName: '大西学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(推薦30+併願一般50)', capacity: 80 },
        { courseName: '家庭(女、推薦20+併願一般20)', capacity: 40 },
      ],
      totalCapacity: 120,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114321300020',
      schoolName: '柏木学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'アドバンスコース(推薦30+一般30)', capacity: 60 },
        { courseName: 'スタンダードコース(推薦70+一般70)', capacity: 140 },
        { courseName: '情報コース(推薦20+一般15)', capacity: 35 },
        { courseName: '全コース共通オープン枠', capacity: 5 },
      ],
      totalCapacity: 240,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320400021',
      schoolName: '鎌倉学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(男、一般A方式90+一般B方式20)', capacity: 110 }],
      totalCapacity: 110,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320400058',
      schoolName: '鎌倉国際文理高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '国際教養コース(推薦35含内部+一般併願35+オープン5)', capacity: 75 },
        { courseName: 'プログレスコース(推薦75含内部+一般専願25+一般併願50+オープン10)', capacity: 160 },
      ],
      totalCapacity: 235,
      source: {
        ...KAKE2_2024_KANAGAWA_SOURCE,
        docTitle: KAKE2_2024_KANAGAWA_SOURCE.docTitle + '(当時の校名は鎌倉女子大学高等部)',
      },
    },
    {
      schoolCode: 'D114310000197',
      schoolName: '関東学院六浦高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(一般・GLEクラス、推薦10+一般書類選考30)', capacity: 40 }],
      totalCapacity: 40,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114338200016',
      schoolName: '函嶺白百合学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(女、推薦20+一般30)', capacity: 50 }],
      totalCapacity: 50,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320500011',
      schoolName: '鵠沼高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '英語コース', capacity: 30 },
        { courseName: '理数コース', capacity: 30 },
        { courseName: '文理コース', capacity: 190 },
      ],
      totalCapacity: 250,
      source: {
        ...KAKE2_2024_KANAGAWA_SOURCE,
        docTitle: KAKE2_2024_KANAGAWA_SOURCE.docTitle + '(各コースとも推薦・一般専願・一般併願・一般オープンで同一の募集人員が記載)',
      },
    },
    {
      schoolCode: 'D114310000222',
      schoolName: '慶應義塾高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(男、推薦1次約40)', capacity: 40 },
        { courseName: '普通(男、一般、含帰国)', capacity: 330 },
      ],
      totalCapacity: 370,
      source: {
        ...KAKE2_2024_KANAGAWA_SOURCE,
        docTitle:
          KAKE2_2024_KANAGAWA_SOURCE.docTitle +
          '(帰国生は若干名で数値非公表のため未算入。令和8年度版の「帰国生20」は別枠として新たに数値公表された可能性がある)',
      },
    },
    {
      schoolCode: 'D114320500093',
      schoolName: '慶應義塾湘南藤沢高等部',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(帰国生)', capacity: 20 }],
      totalCapacity: 20,
      source: {
        ...KAKE2_2024_KANAGAWA_SOURCE,
        docTitle: KAKE2_2024_KANAGAWA_SOURCE.docTitle + '(全国枠は若干名のため未算入。一般募集の記載はこのPDFに無い)',
      },
    },
    {
      schoolCode: 'D114321400010',
      schoolName: '向上高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'S特進コース(推薦10+一般10、2024年新設)', capacity: 20 },
        { courseName: '特進コース(推薦15+一般15)', capacity: 30 },
        { courseName: '選抜コース(推薦35+一般55)', capacity: 90 },
        { courseName: '文理コース(推薦60+一般80)', capacity: 140 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320100015',
      schoolName: '湘南学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'サイエンス(特進理数)コース(推薦10+一般10)', capacity: 20 },
        { courseName: 'アドバンス(特進)コース(推薦30+一般70)', capacity: 100 },
        { courseName: 'アビリティ(進学)コース(推薦60+一般80)', capacity: 140 },
        { courseName: 'リベラルアーツ(総合)コース(推薦100+一般85)', capacity: 185 },
      ],
      totalCapacity: 445,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114315000034',
      schoolName: '相模女子大学高等部',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(推薦入試)', capacity: 25 },
        { courseName: '特進コース(一般入試・書類選考)', capacity: 35 },
        { courseName: '進学コース(推薦入試)', capacity: 100 },
        { courseName: '進学コース(一般入試・書類選考)', capacity: 100 },
      ],
      totalCapacity: 260,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114315000043',
      schoolName: '相模原高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '総合コース(推薦入試)', capacity: 155 },
        { courseName: '総合コース(一般入試・一次書類選考含む)', capacity: 150 },
        { courseName: '総合コース(オープン入試)', capacity: 5 },
        { courseName: '体育科学コース(推薦入試)', capacity: 35 },
        { courseName: '体育科学コース(一般入試)', capacity: 35 },
        { courseName: '文理コース(推薦入試)', capacity: 30 },
        { courseName: '文理コース(一般入試・一次書類選考含む)', capacity: 25 },
        { courseName: '文理コース(オープン入試)', capacity: 5 },
      ],
      totalCapacity: 440,
      source: {
        ...KAKE2_2024_KANAGAWA_SOURCE,
        docTitle: KAKE2_2024_KANAGAWA_SOURCE.docTitle + '(正式名称：光明学園相模原高等学校)',
      },
    },
    {
      schoolCode: 'D114310000295',
      schoolName: '星槎高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(推薦37+一般36)', capacity: 73 }],
      totalCapacity: 73,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114321300011',
      schoolName: '聖セシリア女子高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(女、推薦15+一般書類選考15)', capacity: 30 }],
      totalCapacity: 30,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000026',
      schoolName: '聖ヨゼフ学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '総合進学コース・AEコース・ILコース(推薦20+一般書類選考15+オープン5)', capacity: 40 }],
      totalCapacity: 40,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320800018',
      schoolName: '聖和学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '英語(女、推薦10+1回書類選考30+オープン5)', capacity: 45 },
        { courseName: '普通(女、推薦10+1回書類選考30+オープン5)', capacity: 45 },
      ],
      totalCapacity: 90,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000099',
      schoolName: '捜真女学校高等学部',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(女、推薦10+一般15)', capacity: 25 }],
      totalCapacity: 25,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320600029',
      schoolName: '相洋高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(選抜クラス、推薦5+一般筆記20+チャレンジ二次5)', capacity: 30 },
        { courseName: '特進コース(特進クラス、推薦25+一般筆記55+チャレンジ二次5)', capacity: 85 },
        { courseName: '文理コース(理科クラス、推薦30+一般筆記60+チャレンジ二次5)', capacity: 95 },
        { courseName: '文理コース(文科クラス、推薦60+一般筆記120+チャレンジ二次5)', capacity: 185 },
        { courseName: '進学コース(推薦60+一般筆記125+チャレンジ二次5)', capacity: 190 },
      ],
      totalCapacity: 585,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000035',
      schoolName: '橘学苑高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理コース(特別進学、推薦10+一般10)', capacity: 20 },
        { courseName: '文理コース(総合進学、推薦75+一般75)', capacity: 150 },
        { courseName: 'デザイン美術コース(推薦15+一般15)', capacity: 30 },
      ],
      totalCapacity: 200,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114336300019',
      schoolName: '立花学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(推薦20+1次専願筆記60)', capacity: 80 },
        { courseName: '進学コース(推薦100+1次専願筆記140)', capacity: 240 },
        { courseName: '総進コース(推薦60+1次専願筆記100)', capacity: 160 },
      ],
      totalCapacity: 480,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000375',
      schoolName: '中央大学附属横浜高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(推薦30+一般A書類選考30+一般B40)', capacity: 100 }],
      totalCapacity: 100,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000044',
      schoolName: '鶴見大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '総合進学コース・特進コース(全コース計、推薦20+一般書類選考40+一般A併願オープン30+一般Bオープン10)',
          capacity: 100,
        },
      ],
      totalCapacity: 100,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114315000052',
      schoolName: '東海大学付属相模高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(推薦200+一般240)', capacity: 440 }],
      totalCapacity: 440,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320500066',
      schoolName: '藤嶺学園藤沢高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(男、推薦15+Ⅰ期A書類80+Ⅰ期B10)', capacity: 105 }],
      totalCapacity: 105,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000057',
      schoolName: '日本女子大学附属高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(女、推薦約65+一般専願約65)', capacity: 130 }],
      totalCapacity: 130,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000240',
      schoolName: '日本大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '特別進学コース・総合進学コース・スーパーグローバルクラス(普通科計、推薦100+A日程一般併願160)',
          capacity: 260,
        },
      ],
      totalCapacity: 260,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320500057',
      schoolName: '日本大学藤沢高等学校',
      fiscalYearLabel: '2024年度',
      courses: [{ courseName: '普通(推薦160+一般200)', capacity: 360 }],
      totalCapacity: 360,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000357',
      schoolName: '桐蔭学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'プログレスコース(推薦30+A方式オープン30+B方式書類選考130)', capacity: 190 },
        { courseName: 'アドバンスコース(推薦80+A方式オープン40+B方式書類選考160)', capacity: 280 },
        { courseName: 'スタンダードコース(推薦90+A方式オープン20+B方式書類選考80)', capacity: 190 },
      ],
      totalCapacity: 660,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320300013',
      schoolName: '平塚学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進選抜コース(推薦35+一般35)', capacity: 70 },
        { courseName: '特進コース(推薦35+一般35)', capacity: 70 },
        { courseName: '進学コース(推薦180+一般180)', capacity: 360 },
      ],
      totalCapacity: 500,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320500075',
      schoolName: '藤沢翔陵高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '文理融合探究コース(男、推薦5+一般1回20+書類選考5+オープン5)', capacity: 35 },
        { courseName: '得意分野探究コース(男、推薦60+一般1回110+オープン5)', capacity: 175 },
        { courseName: '商業(男、推薦25+一般1回45)', capacity: 70 },
      ],
      totalCapacity: 280,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114313000020',
      schoolName: '法政大学第二高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(書類選考男子150+書類選考女子150+学科試験男子50+学科試験女子50)', capacity: 400 },
      ],
      totalCapacity: 400,
      source: {
        ...KAKE2_2024_KANAGAWA_SOURCE,
        docTitle:
          KAKE2_2024_KANAGAWA_SOURCE.docTitle +
          '(2024年版でも同一の数値ブロックが独立して確認でき、令和8年度版の校名帰属の不確実性を裏付け的に解消)',
      },
    },
    {
      schoolCode: 'D114320100024',
      schoolName: '三浦学苑高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(推薦10+一般書類選考10)', capacity: 20 },
        { courseName: '進学コース(推薦83+一般書類選考83)', capacity: 166 },
        { courseName: '総合コース(推薦78+一般書類選考78)', capacity: 156 },
        { courseName: 'IBコース(推薦5+一般チャレンジ5)', capacity: 10 },
        { courseName: '工業技術(推薦・一般書類選考ともものづくり系21+デザイン系21)', capacity: 42 },
      ],
      totalCapacity: 394,
      source: {
        ...KAKE2_2024_KANAGAWA_SOURCE,
        docTitle:
          KAKE2_2024_KANAGAWA_SOURCE.docTitle +
          '(2024年版はIBコースが独立していたが総定員394は令和8年度版と完全一致。IBコースが総合コースへ統合された可能性を示唆)',
      },
    },
    {
      schoolCode: 'D114310000277',
      schoolName: '山手学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        {
          courseName: '進学コース・特別進学コース(普通科計、A日程併願80+A日程オープン40+B日程併願30+B日程オープン20)',
          capacity: 170,
        },
      ],
      totalCapacity: 170,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114320100042',
      schoolName: '横須賀学院高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'S選抜コース・A進学コース(A進学・S選抜計、推薦80+書類選考120+オープンⅡ10)', capacity: 210 },
      ],
      totalCapacity: 210,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000204',
      schoolName: '横浜高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'プレミアコース(推薦100)', capacity: 100 },
        { courseName: 'アドバンスコース(推薦350)', capacity: 350 },
        { courseName: 'アクティブコース(推薦160)', capacity: 160 },
      ],
      totalCapacity: 610,
      source: {
        ...KAKE2_2024_KANAGAWA_SOURCE,
        docTitle: KAKE2_2024_KANAGAWA_SOURCE.docTitle + '(推薦以降の一般各方式は全て↓で同一数値を継承)',
      },
    },
    {
      schoolCode: 'D114310000188',
      schoolName: '横浜学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: 'クリエイティブコース(推薦15+一般専願5併願10)', capacity: 30 },
        { courseName: 'アカデミーコース(推薦100+一般専願90併願100)', capacity: 290 },
      ],
      totalCapacity: 320,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000286',
      schoolName: '横浜商科大学高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(推薦10+一般書類選考10+学科試験15+オープン5)', capacity: 40 },
        { courseName: '進学コース(推薦140+一般書類選考60+学科試験140+オープン10)', capacity: 350 },
        { courseName: '商業(国際観光コース・会計情報コース、推薦40+一般書類選考40+学科試験100+オープン10)', capacity: 190 },
      ],
      totalCapacity: 580,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000179',
      schoolName: '横浜清風高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(推薦25+一般筆記32+オープン計3共有)', capacity: 60 },
        { courseName: '総合進学コース(推薦140+一般筆記137)', capacity: 277 },
      ],
      totalCapacity: 337,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000080',
      schoolName: '横浜創英高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '特進コース(推薦35+オープン35)', capacity: 70 },
        { courseName: '文理コース(推薦80+オープン80)', capacity: 160 },
      ],
      totalCapacity: 230,
      source: {
        ...KAKE2_2024_KANAGAWA_SOURCE,
        docTitle: KAKE2_2024_KANAGAWA_SOURCE.docTitle + '(令和8年度版は特進フロンティアコース1本化・特進+文理から統合された可能性)',
      },
    },
    {
      schoolCode: 'D114310000213',
      schoolName: '横浜創学館高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(特別進学)(推薦20+一般20)', capacity: 40 },
        { courseName: '普通(文理選抜)(推薦90+一般90)', capacity: 180 },
        { courseName: '普通(総合進学)(推薦60+一般60)', capacity: 120 },
      ],
      totalCapacity: 340,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000348',
      schoolName: '横浜隼人高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '普通(推薦60含帰国+一般125+オープン10)', capacity: 195 },
        { courseName: '国際語(推薦20含帰国+一般45+オープン3)', capacity: 68 },
      ],
      totalCapacity: 263,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
    {
      schoolCode: 'D114310000302',
      schoolName: '横浜富士見丘学園高等学校',
      fiscalYearLabel: '2024年度',
      courses: [
        { courseName: '進学クラス(女、推薦20+一般15)', capacity: 35 },
        { courseName: '特進クラス(推薦40+一般40)', capacity: 80 },
        { courseName: '全クラス共通オープン枠', capacity: 5 },
      ],
      totalCapacity: 120,
      source: KAKE2_2024_KANAGAWA_SOURCE,
    },
  ],
  skipped: [
    {
      schoolCode: 'D114320500020',
      schoolName: '湘南工科大学附属高等学校',
      reason: '当初「プログレス/アドバンス/スタンダードコース」として誤収録していたが、その数値は実際には桐蔭学園のものと判明(2026-07-31訂正)。湘南工科大学附属の正しい募集人員(技術コース/アドバンスコース/進学特化コース)はPDF内の列対応を確信できず未確認のため正直にスキップ台帳へ',
    },
    {
      schoolCode: 'D114310000062',
      schoolName: '浅野高等学校',
      reason: '1995年度を最後に高校からの生徒募集を停止し完全中高一貫校化(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114310000106',
      schoolName: '聖光学院高等学校',
      reason: '高等学校において生徒を募集しない完全中高一貫校(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114310000115',
      schoolName: 'フェリス女学院高等学校',
      reason: '高等学校において生徒を募集しない完全中高一貫校(Wikipediaで確認・神奈川女子御三家の1校)',
    },
    {
      schoolCode: 'D114310000124',
      schoolName: '横浜共立学園高等学校',
      reason: '高等学校において生徒を募集しない完全中高一貫校(公式サイトで「生徒募集をいたしません」と明記・神奈川女子御三家の1校)',
    },
    {
      schoolCode: 'D114310000142',
      schoolName: '横浜雙葉高等学校',
      reason: '高等学校において生徒を募集しない完全中高一貫校(Wikipediaで確認・神奈川女子御三家の1校)',
    },
    {
      schoolCode: 'D114310000366',
      schoolName: 'サレジオ学院高等学校',
      reason: '高等学校からの外部生募集を行わない完全中高一貫校(Wikipedia関連情報で確認)',
    },
    {
      schoolCode: 'D114320400012',
      schoolName: '栄光学園高等学校',
      reason: '高等学校において生徒を募集しない完全中高一貫校(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114320400067',
      schoolName: '清泉女学院高等学校',
      reason: '中高完全一貫制のため高校からの外部募集なし(公式サイト関連情報で確認)',
    },
    {
      schoolCode: 'D114320500048',
      schoolName: '湘南白百合学園高等学校',
      reason: '中高完全一貫制のため高校からの外部募集なし(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114310000071',
      schoolName: '神奈川学園高等学校',
      reason: '2008年に高校募集を停止し完全中高一貫校化(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114310000133',
      schoolName: '横浜女学院高等学校',
      reason: 'Wikipediaで「完全一貫制」と明記・公式サイトにも帰国生入試要項のみで一般の高校入試要項PDFが見当たらない',
    },
    {
      schoolCode: 'D114310000151',
      schoolName: '関東学院高等学校',
      reason: '1990年度を最後に高校からの一般募集を停止した完全中高一貫校(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114310000160',
      schoolName: '青山学院横浜英和高等学校',
      reason: '高等学校において生徒を募集しない完全中高一貫校(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114310000268',
      schoolName: '公文国際学園高等部',
      reason: '高等学校において生徒を募集しない完全中高一貫校(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114310000320',
      schoolName: '神奈川大学附属高等学校',
      reason: '高等学校において生徒を募集しない(転入学を除き)完全中高一貫校(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114310000384',
      schoolName: '清心女子高等学校',
      reason: '通信制高校のため全日制と同種の県別募集定員の性質に馴染まずスキップ',
    },
    {
      schoolCode: 'D114310000393',
      schoolName: '秀英高等学校',
      reason: '通信制高校のため全日制と同種の県別募集定員の性質に馴染まずスキップ',
    },
    {
      schoolCode: 'D114313000039',
      schoolName: '洗足学園高等学校',
      reason: '高等学校において生徒を募集しない完全中高一貫校(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114313000048',
      schoolName: 'カリタス女子高等学校',
      reason: '高校からの入学は募集しておらず中学からしか入学できない完全中高一貫校(公式関連情報で確認)',
    },
    {
      schoolCode: 'D114320800027',
      schoolName: '逗子開成高等学校',
      reason: '高校からの募集を行わない完全中高一貫校(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114320400030',
      schoolName: '鎌倉女学院高等学校',
      reason: '高校からの生徒募集を行わない完全中高一貫校(Wikipediaで確認)',
    },
    {
      schoolCode: 'D114320500039',
      schoolName: '湘南学園高等学校',
      reason: '1997年より高校募集を廃止し6か年一貫教育化(公式関連情報で確認)',
    },
    {
      schoolCode: 'D114321200012',
      schoolName: '厚木中央高等学校',
      reason: '通信制高校のため全日制と同種の県別募集定員の性質に馴染まずスキップ',
    },
    {
      schoolCode: 'D114336400018',
      schoolName: '鹿島山北高等学校',
      reason: '2017年設置の広域通信制(単位制)高校のため全日制と同種の県別募集定員の性質に馴染まずスキップ',
    },
    {
      schoolCode: 'D114320600038',
      schoolName: '湘南ライナス学園高等部',
      reason: 'Wikipediaに「2012年3月31日に廃校」との記載があり、文科省学校コード一覧(令和8年5月時点)に現存する記載との整合性を確認できなかったため、実在・募集状況とも不確実として正直にスキップ',
    },
    {
      schoolCode: 'D114315000016',
      schoolName: 'シュタイナー学園高等部',
      reason: '小中高一貫校で大半の生徒はシュタイナー学園中等部から進学。外部からの転入・編入は欠員がある場合のみ若干名を受け入れる方式のため、固定の県別募集定員数が公表されていない',
    },
  ],
};
