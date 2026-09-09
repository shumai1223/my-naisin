import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 東京都 段階台帳（T-Y11F §5順序#7・7県目・「普通科」系123レコード＋「商業」7レコード＋
 * 「ビジネスコミュニケーション科」2レコード＋「工業に関する学科」16レコード＋「科学技術科」
 * 2レコード＋「農業」5レコード＋「水産」1レコード＋「家庭（単位制以外）」3レコード＋
 * 「家庭（単位制）」1レコード＋「福祉」2レコード＋「理数」2レコード＋「芸術」1レコード＋
 * 「体育」2レコード＋「併合科」3レコード＋「産業科」2レコード＋「総合学科」10レコード＋
 * 「定時制課程（単位制）」7レコード＝計189レコード）。
 *
 * 一次ソース: 東京都教育委員会「令和8年度東京都立高等学校入学者選抜合格発表」（一般募集・
 * 学力検査による選抜）のうち「普通科（コース、単位制以外の学校）」（区部57校＋多摩部44校）＋
 * 「普通科（島しょの学校）」（6校）。
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-03-02-181055-948
 * （PDF・全3頁。1〜2頁目に区部・多摩部、3頁目後半に島しょの別表）
 *
 * ⚠️既存の`competition-rates/tokyo.ts`（倍率パイプライン）は**別の一次資料**（受検状況・入試当日
 * 前の応募段階）を採用しており、本資料には志願者数列そのものが存在しない（募集人員・受検人員・
 * 合格人員のみを掲載する試験後の最終結果資料）。そのためquota・applicantsConfirmedは既存
 * パイプラインから再利用し（募集人員は試験日まで不変で全107件完全一致を確認済み）、
 * testTakersConfirmed＝「受検人員」列・finalPassers＝「合格人員」列のみを本資料から新規に
 * 転記した（ibaraki.ts/kanagawa.ts等と同型の複数資料合成設計）。PDFはテキスト層があるが
 * 学校名ラベルが罫線区切りの縦書き風レイアウトで文字化けするため`pdftoppm`ビジョン解析で
 * 転記した（数値は`pdftotext`でも抽出できるが対応する学校名の突合が困難なため）。
 *
 * quotaは107件全数が既存パイプラインと完全一致（募集人員は試験日まで不変）。区部57校・
 * 多摩部44校・島しょ6校の内訳もxlsx本文の「区部計」「多摩部計」「コース、単位制以外計」
 * 「島しょ計」の4段階の公式小計と107レコード全数の機械集計がquota/testTakersConfirmed/
 * finalPassersの3系列すべてで完全一致（applicantsConfirmedはこの資料に印字が無い参考値の
 * ため既存パイプラインの小計との一致のみ確認）。
 *
 * ⚠️**東京都に固有の異常値パターン発見**: finalPassers>quotaが107件中77件（72%）と、他県
 * （chiba/saitama/ibaraki/kanagawaでは各県数件〜十数件=既知の「合格ボーダー同点者」型）とは
 * 桁違いに高頻度で出現する。超過量の分布を見ると77件はいずれも+1〜+17の小幅（日比谷が最大の
 * +17）である一方、quota未達の学校（羽村quota204→final70等）は-100超の大幅未達になる非対称な
 * 分布を示す。東京都立高校は募集人員の一部を推薦選抜（学力検査を伴わない）に事前配分し、
 * 推薦選抜の合格者が募集人員に満たなかった場合は未消化枠が一般選抜（本資料の対象）へ繰り上げ
 * られる制度を持つため、**本資料の「募集人員」列は推薦繰り上げ前の当初一般枠を指し、
 * 「合格人員」列は繰り上げ後の実際の合格者数を指す可能性が高い**（人気校ほど推薦合格率が
 * 高く一般枠へ流入する繰り上げ量が小さく安定するため超過量が軒並み小幅、という分布とも整合）。
 * ただし公式資料にこの仕組みの明記は無いため断定はせず推測に留める（Y-0）。**この構造的な
 * 高頻度性のため、他県で採用した「既知の例外を明示列挙してfinalPassers<=quotaを主張する」
 * 設計は東京都には適用しない**（77件を個別列挙するのは非現実的かつ本質を見誤らせる）。
 * finalPassers>applicantsConfirmedは0件（東京都でもこのパターンは今回出現しなかった）。
 *
 * ⚠️注記: 立川の受検人員には同校の創造理数科（別学科）を第1志望とする者を含まない、と
 * 資料脚注に明記されている（本ファイルは対象を普通科のみとしているため直接の影響は無い）。
 *
 * 🔁**「普通科（コース制）」4レコード＋「普通科（単位制）」12レコードを追加（累計123
 * レコード）**: 同日公表の別PDF（`2026-03-02-181058-071`）1頁に2表（3［普通科（コース制の
 * 学校）］・4［普通科（単位制の学校）］）が収録されている。列位置・quota/testTakers/
 * finalPassersの対応は「普通科（コース・単位制以外）」と同一（学校名列・募集人員列・受検
 * 人員列・合格人員列、コース制のみ学科名列が学校名と募集人員の間に追加）。既存パイプラインの
 * 学科ラベルは「普通科（コース制・外国語）」「普通科（コース制・造形美術）」「普通科（単位制）」
 * というsuffix付きで、全日制の「普通科」とは別レコードとして扱われている。quotaは16件全数が
 * 既存パイプラインと完全一致。両区分とも資料本文に「コース制計」「単位制計」の公式小計があり
 * quota/testTakersConfirmed/finalPassersの3系列とも完全一致。同一の「小幅超過」パターン
 * （深川外国語56→57・新宿単位制284→288等）が両区分でも再現され、東京都全体で一貫した構造的
 * 現象であることが裏付けられた。finalPassers>applicantsConfirmedは0件。
 *
 * 🔁**「商業に関する学科」7レコード＋「ビジネスコミュニケーション科」2レコードを追加
 * （累計132レコード）**: 同日公表の「専門学科・定時制課程（単位制）」PDF（`2026-03-02-
 * 181100-462`・全8頁）の1頁目に着手。5［商業に関する学科］（芝商業/江東商業/第三商業/
 * 第一商業/第四商業/葛飾商業/第五商業の7校・いずれも「ビジネス」科名）＋6［ビジネス
 * コミュニケーション科］（大田桜台/千早の2校）。既存パイプラインの学科ラベルは「商業科」
 * 「ビジネスコミュニケーション科」でquotaは9件全数が完全一致。両区分とも資料本文の「商業計」
 * 「ビジネスコミュニケーション科計」の公式小計と3系列とも完全一致。finalPassers>quotaは
 * 第三商業（105→106）・第五商業（126→128）・千早（126→128）の3件のみで、他はquota以下
 * （普通科系と異なり本区分では超過が少数派）。finalPassers>applicantsConfirmedは0件。
 * ⚠️本PDFは全8頁と大きく2頁目以降（工業に関する学科・単位制以外/単位制の広範な区分）は
 * 未着手のため、本ファイルは全体としてcoverage.status='partial'のまま。
 *
 * 🔁**「工業に関する学科（単位制以外）」15レコード＋「工業に関する学科（単位制）」1レコード＋
 * 「科学技術科」2レコードを追加（累計150レコード）**: 同PDFの2〜3頁目（7［工業に関する学科
 * （単位制以外の学校）］・8［工業に関する学科（単位制の学校）］・9［科学技術科］）に着手。
 * 工業（単位制以外）は工芸/蔵前工科/墨田工科/総合工科/中野工科/杉並工科/荒川工科/北豊島工科/
 * 練馬工科/足立工科/葛西工科/府中工科/町田工科/多摩工科/田無工科の15校（複数学科を持つ学校は
 * sheet2/3方式と同じく資料内の学校単位「計」行を採用）。工業（単位制）は六郷工科1校。科学
 * 技術科は科学技術（江東）/多摩科学技術（小金井）の2校。既存パイプラインの学科ラベルは
 * 「工業科」「工業科（単位制）」「科学技術科」でquotaは18件全数が既存パイプラインと完全一致。
 * 資料本文の「工業計」（単位制以外）「単位制計」「工業合計」「科学技術科計」の4段階の公式
 * 小計と3系列とも完全一致。⚠️**新種の異常値パターン発見**: 江東・科学技術（quota107→
 * testTakers51→finalPassers66）は**finalPassers>testTakersConfirmedという初めてのパターン**
 * （受検者数より合格者数が多い）を示す。資料脚注に「科学技術高校の受検人員には、同校の
 * 創造理数科を第1志望とする者を含まない」と明記されており、創造理数科第1志望者の一部が
 * 第2志望で科学技術科へ合流したためと推測（立川の同型注記と同じ構造・Y-0につき断定しない）。
 * finalPassers>quotaは工芸（125→131）・多摩科学技術（147→153）の2件のみで、工業科単位制以外
 * 15校中14校はquota未達（工業系は総じて低倍率で普通科系の高頻度超過パターンとは対照的）。
 *
 * 🔁**「農業に関する学科」5レコード＋「水産に関する学科」1レコード＋「家庭に関する学科
 * （単位制以外）」3レコードを追加（累計159レコード）**: 同PDFの4頁目（10［農業に関する
 * 学科］・11［水産に関する学科］・12［家庭に関する学科（単位制以外の学校）］）に着手。農業は
 * 園芸/農芸/農産/農業（府中）/瑞穂農芸の5校、水産は大島海洋国際1校、家庭は赤羽北桜/農業
 * （府中）/瑞穂農芸の3校。⚠️**府中の「農業」という学校名の学校が農業科（quota63）と家庭科
 * （quota50）の両方に登場する**（同一校が複数専門学科を併設・schoolNameが地名でなく校名
 * 「農業」であることに注意）。既存パイプラインの学科ラベル「農業科」「水産科」「家庭科」で
 * quotaは9件全数が完全一致。3区分とも資料本文の「農業計」「水産計」「家庭計」の公式小計と
 * 3系列とも完全一致。finalPassers>quotaは9件中6件（園芸+4・農産+2・農業〈府中〉農業科+2・
 * 大島海洋国際+1・赤羽北桜+2・農業〈府中〉家庭科+2）で、工業系より普通科系に近い高頻度。
 * finalPassers>applicantsConfirmedは0件。
 *
 * 🔁**「家庭（単位制）」1レコード＋「福祉」2レコード＋「理数」2レコード＋「芸術」1レコード＋
 * 「体育」2レコードを追加（累計167レコード）**: 同PDFの5頁目（13［家庭に関する学科（単位制の
 * 学校）］・14［福祉に関する学科］・15［理数に関する学科］・16［芸術に関する学科］・17［体育
 * に関する学科］）に着手。家庭（単位制）は忍岡1校、福祉は赤羽北桜/野津田の2校、理数は科学技術
 * （江東）/立川の2校、芸術は新宿・総合芸術1校（音楽/美術/舞台表現の3コースを資料内の学校単位
 * 「計」行で集約）、体育は駒場/野津田の2校。既存パイプラインの学科ラベル「家庭科（単位制）」
 * 「福祉科」「理数科」「芸術科」「体育科」でquotaは8件全数が完全一致。5区分とも資料本文の
 * 「単位制計」（家庭）「福祉計」「理数計」「芸術計」「体育計」の公式小計と3系列とも完全一致。
 * さらに「家庭合計」（単位制以外区分＋本区分の合算・271/268/253）が資料に印字されており、
 * 既存の家庭（単位制以外）3レコードと合わせた4レコードの機械集計とも二重に一致した。
 * finalPassers>quotaは8件中4件（忍岡+1・科学技術理数+2・立川理数+2・駒場体育+2）。
 * finalPassers>applicantsConfirmedは0件。
 *
 * 🔁**「併合科」3レコード＋「産業科」2レコード＋「総合学科」10レコードを追加（累計182
 * レコード）**: 同PDFの6頁目（18［国際関係に関する学科］・19［併合科］・20［産業科］・
 * 21［総合学科］）に着手。⚠️**18［国際関係に関する学科］（目黒・国際、quota98「一般生徒
 * 対象」）は既存パイプラインの国際科（quota138）と数値が一致せず見送った**——本資料の
 * quota98は「一般生徒対象」という限定された対象区分の数値で、既存パイプラインのquota138は
 * 別の集計範囲（一般生徒＋特別枠等の合算と推測）を指しており、単純比較できないためY-0に従い
 * スコープ外とした。併合科（島しょの農林/家政系複合学科）は大島/三宅/八丈の3校、産業科は
 * 橘（墨田）/八王子桑志（八王子・4分野を学校単位「計」行で集約）の2校、総合学科は晴海総合/
 * つばさ総合/世田谷総合/杉並総合/王子総合/葛飾総合/青梅総合/町田総合/東久留米総合/若葉総合の
 * 10校。既存パイプラインの学科ラベル「併合科（農林・家政）」等・「産業科」・「総合学科」で
 * quotaは15件全数が完全一致。3区分とも資料本文の「併合科計」「産業科計」「総合学科計」の
 * 公式小計と3系列とも完全一致。finalPassers>quotaは15件中8件（八王子桑志+4・晴海総合+3・
 * つばさ総合+2・世田谷総合+1・杉並総合+2・王子総合+3・葛飾総合+2・東久留米総合+2）で、
 * 併合科3校は0件（島しょ校でいずれもquota未達）。finalPassers>applicantsConfirmedは0件。
 *
 * 🔁**「定時制課程（単位制）」7レコードを追加（累計189レコード）**: 同PDFの7頁目
 * （22［定時制課程（単位制の学校）]）に着手。一橋/新宿山吹（普通科1〜4部＋情報科2・4部の
 * 2学科構成）/浅草/荻窪/八王子拓真/砂川の6校7レコード。⚠️**この区分は既存
 * `competition-rates/tokyo.ts`ではなく既存`teiji-competition-rates/tokyo.ts`（T-P1・
 * S1-3で先行構築済み・「最終応募状況」PDFの7〜8頁目から独立に転記）が対応するパイプライン**
 * （kanagawa.tsのsheet4と同型の設計）。本資料の各校は「1部/2部/3部」×「1学年相当/2学年相当
 * 以上」の内訳行を持つが、既存パイプラインが学校（新宿山吹のみ学科）単位の「計」行を1レコード
 * として採用しているため、本ファイルも同じ粒度（内訳行はSUM対象外）で統一した。quotaは7件
 * 全数が既存パイプラインと完全一致。資料本文の「定時制課程単位制計」（1120/935/822）と7レコード
 * 全数の機械集計がquota/testTakersConfirmed/finalPassersの3系列とも完全一致。finalPassers>
 * quotaは新宿山吹・情報科2・4部（46→56・+10）の1件のみで、他6件はquota未達（定時制は総じて
 * 低倍率で普通科全日制の高頻度超過パターンとは対照的・工業系と同様の低倍率傾向）。
 * finalPassers>applicantsConfirmedは0件。
 *
 * ⚠️スコープ: 「専門学科・定時制課程（単位制）」の残り1頁（8頁目・チャレンジスクール等）＋
 * 「通信制（前期選抜）」（同日公表の別PDF）＋「国際関係に関する学科」（既存パイプラインとの
 * quota不一致のため既存データの精査待ち）は別セッションで横展開する。
 */

export const TOKYO_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'tokyo',
  sources: [
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-03-02-181055-948',
      docTitle: '東京都教育委員会 令和8年度東京都立高等学校入学者選抜合格発表 1［普通科（コース、単位制以外の学校）］＋2［普通科（島しょの学校）］',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-03-02-181058-071',
      docTitle: '東京都教育委員会 令和8年度東京都立高等学校入学者選抜合格発表 3［普通科（コース制の学校）］＋4［普通科（単位制の学校）］',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-03-02-181100-462',
      docTitle: '東京都教育委員会 令和8年度東京都立高等学校入学者選抜合格発表 5［商業に関する学科］＋6［ビジネスコミュニケーション科］＋7［工業に関する学科（単位制以外の学校）］＋8［工業に関する学科（単位制の学校）］＋9［科学技術科］＋10［農業に関する学科］＋11［水産に関する学科］＋12［家庭に関する学科（単位制以外の学校）］＋13［家庭に関する学科（単位制の学校）］＋14［福祉に関する学科］＋15［理数に関する学科］＋16［芸術に関する学科］＋17［体育に関する学科］＋19［併合科］＋20［産業科］＋21［総合学科］＋22［定時制課程（単位制の学校）］（全8頁のうち1〜7頁目に着手・18［国際関係に関する学科］は既存パイプラインとのquota不一致のため見送り）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '普通科（コース・単位制以外・区部57校＋多摩部44校＋島しょ6校＝107レコード）',
      '普通科（コース制・4レコード）',
      '普通科（単位制・12レコード）',
      '商業に関する学科（7レコード）',
      'ビジネスコミュニケーション科（2レコード）',
      '工業に関する学科・単位制以外（15レコード）',
      '工業に関する学科・単位制（1レコード）',
      '科学技術科（2レコード）',
      '農業に関する学科（5レコード）',
      '水産に関する学科（1レコード）',
      '家庭に関する学科・単位制以外（3レコード）',
      '家庭に関する学科・単位制（1レコード）',
      '福祉に関する学科（2レコード）',
      '理数に関する学科（2レコード）',
      '芸術に関する学科（1レコード）',
      '体育に関する学科（2レコード）',
      '併合科（3レコード）',
      '産業科（2レコード）',
      '総合学科（10レコード）',
      '定時制課程（単位制・7レコード）',
    ],
    pendingDepartments: [
      '専門学科・定時制課程（単位制）の残り1頁（8頁目・チャレンジスクール等）',
      '通信制（前期選抜）',
      '国際関係に関する学科（既存パイプラインとのquota不一致のため精査待ち）',
    ],
    note: '「普通科（コース・単位制以外）」区分（107レコード）＋「普通科（コース制）」（4レコード）＋「普通科（単位制）」（12レコード）＋「商業に関する学科」（7レコード）＋「ビジネスコミュニケーション科」（2レコード）＋「工業に関する学科・単位制以外」（15レコード）＋「工業に関する学科・単位制」（1レコード）＋「科学技術科」（2レコード）＋「農業に関する学科」（5レコード）＋「水産に関する学科」（1レコード）＋「家庭に関する学科・単位制以外」（3レコード）＋「家庭に関する学科・単位制」（1レコード）＋「福祉に関する学科」（2レコード）＋「理数に関する学科」（2レコード）＋「芸術に関する学科」（1レコード）＋「体育に関する学科」（2レコード）＋「併合科」（3レコード）＋「産業科」（2レコード）＋「総合学科」（10レコード）＋「定時制課程（単位制）」（7レコード）を完全収録し累計189レコード。quotaは既存パイプライン（普通科〜総合学科はcompetition-rates/tokyo.ts、定時制課程はteiji-competition-rates/tokyo.ts）と全189件で完全一致（募集人員は試験日まで不変であることを確認）。applicantsConfirmedも既存パイプラインをそのまま再利用（本資料には志願者数列が存在しないため）。testTakersConfirmed/finalPassersのみ本資料から新規転記。資料本文の24段階の公式小計と189レコード全数の機械集計がquota/testTakersConfirmed/finalPassersの3系列すべてで完全一致（「家庭合計」は単位制以外区分＋単位制区分の合算値としても二重に確認）。普通科系はfinalPassers>quotaが極めて高頻度（推薦選抜の未消化枠繰り上げが原因と推測）だが工業系は低倍率のため2/16件・商業系は3/9件・定時制課程は1/7件と少数派、農業/水産/家庭系は6/9件・福祉理数芸術体育系は4/8件・併合産業総合系は8/15件と普通科系に近い高頻度。江東・科学技術はfinalPassers>testTakersConfirmedという逆転パターンを示す（創造理数科第1志望者の2志望合流と推測・資料脚注に根拠あり）。府中の「農業」という学校名の学校は農業科と家庭科の両方に登場する（同一校が複数専門学科を併設）。国際関係に関する学科（目黒・国際、資料quota98）は既存パイプラインのquota138と一致せず見送り。専門学科・定時制課程（単位制）の残り1頁（チャレンジスクール等）・通信制（前期選抜）は未着手。',
  },
  officialSubtotals: [
    { label: '区部計', quota: 12088, applicantsConfirmed: 16926, testTakersConfirmed: 15539, finalPassers: 11638 },
    { label: '多摩部計', quota: 9344, applicantsConfirmed: 11630, testTakersConfirmed: 10961, finalPassers: 8791 },
    { label: 'コース、単位制以外計', quota: 21432, applicantsConfirmed: 28556, testTakersConfirmed: 26500, finalPassers: 20429 },
    { label: '島しょ計', quota: 310, applicantsConfirmed: 100, testTakersConfirmed: 100, finalPassers: 100 },
    { label: 'コース制計', quota: 224, applicantsConfirmed: 279, testTakersConfirmed: 254, finalPassers: 208 },
    { label: '単位制計', quota: 2276, applicantsConfirmed: 2948, testTakersConfirmed: 2709, finalPassers: 2146 },
    { label: '商業計', quota: 798, applicantsConfirmed: 717, testTakersConfirmed: 684, finalPassers: 642 },
    { label: 'ビジネスコミュニケーション科計', quota: 231, applicantsConfirmed: 227, testTakersConfirmed: 211, finalPassers: 208 },
    { label: '工業計', quota: 1594, applicantsConfirmed: 1147, testTakersConfirmed: 1094, finalPassers: 1018 },
    { label: '単位制計（工業）', quota: 96, applicantsConfirmed: 72, testTakersConfirmed: 64, finalPassers: 64 },
    { label: '工業合計', quota: 1690, applicantsConfirmed: 1219, testTakersConfirmed: 1158, finalPassers: 1082 },
    { label: '科学技術科計', quota: 254, applicantsConfirmed: 287, testTakersConfirmed: 204, finalPassers: 219 },
    { label: '農業計', quota: 413, applicantsConfirmed: 450, testTakersConfirmed: 431, finalPassers: 403 },
    { label: '水産計', quota: 42, applicantsConfirmed: 57, testTakersConfirmed: 54, finalPassers: 43 },
    { label: '家庭計', quota: 222, applicantsConfirmed: 222, testTakersConfirmed: 215, finalPassers: 203 },
    { label: '単位制計（家庭）', quota: 49, applicantsConfirmed: 54, testTakersConfirmed: 53, finalPassers: 50 },
    { label: '家庭合計', quota: 271, applicantsConfirmed: 276, testTakersConfirmed: 268, finalPassers: 253 },
    { label: '福祉計', quota: 54, applicantsConfirmed: 34, testTakersConfirmed: 31, finalPassers: 31 },
    { label: '理数計', quota: 71, applicantsConfirmed: 210, testTakersConfirmed: 188, finalPassers: 75 },
    { label: '芸術計', quota: 112, applicantsConfirmed: 182, testTakersConfirmed: 171, finalPassers: 111 },
    { label: '体育計', quota: 56, applicantsConfirmed: 62, testTakersConfirmed: 59, finalPassers: 57 },
    { label: '併合科計', quota: 105, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { label: '産業科計', quota: 274, applicantsConfirmed: 227, testTakersConfirmed: 218, finalPassers: 206 },
    { label: '総合学科計', quota: 1626, applicantsConfirmed: 1984, testTakersConfirmed: 1896, finalPassers: 1604 },
    { label: '定時制課程単位制計', quota: 1120, applicantsConfirmed: 987, testTakersConfirmed: 935, finalPassers: 822 },
  ],
  records: [
    { schoolName: '日比谷', department: '普通科', quota: 253, applicantsConfirmed: 520, testTakersConfirmed: 420, finalPassers: 270 },
    { schoolName: '三田', department: '普通科', quota: 236, applicantsConfirmed: 343, testTakersConfirmed: 301, finalPassers: 239 },
    { schoolName: '戸山', department: '普通科', quota: 252, applicantsConfirmed: 474, testTakersConfirmed: 396, finalPassers: 259 },
    { schoolName: '竹早', department: '普通科', quota: 177, applicantsConfirmed: 293, testTakersConfirmed: 275, finalPassers: 179 },
    { schoolName: '向丘', department: '普通科', quota: 220, applicantsConfirmed: 345, testTakersConfirmed: 324, finalPassers: 221 },
    { schoolName: '上野', department: '普通科', quota: 252, applicantsConfirmed: 471, testTakersConfirmed: 442, finalPassers: 257 },
    { schoolName: '日本橋', department: '普通科', quota: 189, applicantsConfirmed: 204, testTakersConfirmed: 194, finalPassers: 190 },
    { schoolName: '本所', department: '普通科', quota: 189, applicantsConfirmed: 273, testTakersConfirmed: 265, finalPassers: 192 },
    { schoolName: '城東', department: '普通科', quota: 252, applicantsConfirmed: 413, testTakersConfirmed: 394, finalPassers: 255 },
    { schoolName: '東', department: '普通科', quota: 189, applicantsConfirmed: 298, testTakersConfirmed: 287, finalPassers: 192 },
    { schoolName: '深川', department: '普通科', quota: 185, applicantsConfirmed: 265, testTakersConfirmed: 231, finalPassers: 194 },
    { schoolName: '大崎', department: '普通科', quota: 221, applicantsConfirmed: 349, testTakersConfirmed: 298, finalPassers: 227 },
    { schoolName: '小山台', department: '普通科', quota: 252, applicantsConfirmed: 412, testTakersConfirmed: 385, finalPassers: 256 },
    { schoolName: '八潮', department: '普通科', quota: 188, applicantsConfirmed: 131, testTakersConfirmed: 113, finalPassers: 113 },
    { schoolName: '駒場', department: '普通科', quota: 220, applicantsConfirmed: 458, testTakersConfirmed: 422, finalPassers: 224 },
    { schoolName: '目黒', department: '普通科', quota: 189, applicantsConfirmed: 395, testTakersConfirmed: 323, finalPassers: 197 },
    { schoolName: '大森', department: '普通科', quota: 127, applicantsConfirmed: 64, testTakersConfirmed: 57, finalPassers: 57 },
    { schoolName: '蒲田', department: '普通科', quota: 109, applicantsConfirmed: 99, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '田園調布', department: '普通科', quota: 188, applicantsConfirmed: 306, testTakersConfirmed: 274, finalPassers: 191 },
    { schoolName: '雪谷', department: '普通科', quota: 221, applicantsConfirmed: 359, testTakersConfirmed: 325, finalPassers: 224 },
    { schoolName: '桜町', department: '普通科', quota: 252, applicantsConfirmed: 286, testTakersConfirmed: 255, finalPassers: 254 },
    { schoolName: '千歳丘', department: '普通科', quota: 221, applicantsConfirmed: 287, testTakersConfirmed: 273, finalPassers: 223 },
    { schoolName: '松原', department: '普通科', quota: 156, applicantsConfirmed: 246, testTakersConfirmed: 229, finalPassers: 157 },
    { schoolName: '青山', department: '普通科', quota: 221, applicantsConfirmed: 455, testTakersConfirmed: 401, finalPassers: 226 },
    { schoolName: '広尾', department: '普通科', quota: 154, applicantsConfirmed: 280, testTakersConfirmed: 224, finalPassers: 155 },
    { schoolName: '鷺宮', department: '普通科', quota: 220, applicantsConfirmed: 403, testTakersConfirmed: 378, finalPassers: 222 },
    { schoolName: '武蔵丘', department: '普通科', quota: 253, applicantsConfirmed: 319, testTakersConfirmed: 286, finalPassers: 255 },
    { schoolName: '杉並', department: '普通科', quota: 253, applicantsConfirmed: 357, testTakersConfirmed: 319, finalPassers: 260 },
    { schoolName: '豊多摩', department: '普通科', quota: 252, applicantsConfirmed: 419, testTakersConfirmed: 377, finalPassers: 255 },
    { schoolName: '西', department: '普通科', quota: 252, applicantsConfirmed: 383, testTakersConfirmed: 326, finalPassers: 260 },
    { schoolName: '豊島', department: '普通科', quota: 252, applicantsConfirmed: 535, testTakersConfirmed: 501, finalPassers: 254 },
    { schoolName: '文京', department: '普通科', quota: 284, applicantsConfirmed: 381, testTakersConfirmed: 351, finalPassers: 286 },
    { schoolName: '竹台', department: '普通科', quota: 171, applicantsConfirmed: 238, testTakersConfirmed: 229, finalPassers: 173 },
    { schoolName: '板橋', department: '普通科', quota: 221, applicantsConfirmed: 346, testTakersConfirmed: 332, finalPassers: 224 },
    { schoolName: '大山', department: '普通科', quota: 157, applicantsConfirmed: 72, testTakersConfirmed: 62, finalPassers: 62 },
    { schoolName: '北園', department: '普通科', quota: 253, applicantsConfirmed: 421, testTakersConfirmed: 391, finalPassers: 256 },
    { schoolName: '高島', department: '普通科', quota: 252, applicantsConfirmed: 282, testTakersConfirmed: 264, finalPassers: 255 },
    { schoolName: '井草', department: '普通科', quota: 221, applicantsConfirmed: 274, testTakersConfirmed: 244, finalPassers: 224 },
    { schoolName: '石神井', department: '普通科', quota: 252, applicantsConfirmed: 417, testTakersConfirmed: 383, finalPassers: 256 },
    { schoolName: '田柄', department: '普通科', quota: 152, applicantsConfirmed: 74, testTakersConfirmed: 69, finalPassers: 69 },
    { schoolName: '練馬', department: '普通科', quota: 189, applicantsConfirmed: 213, testTakersConfirmed: 202, finalPassers: 191 },
    { schoolName: '光丘', department: '普通科', quota: 185, applicantsConfirmed: 137, testTakersConfirmed: 127, finalPassers: 127 },
    { schoolName: '青井', department: '普通科', quota: 164, applicantsConfirmed: 67, testTakersConfirmed: 66, finalPassers: 66 },
    { schoolName: '足立', department: '普通科', quota: 220, applicantsConfirmed: 299, testTakersConfirmed: 288, finalPassers: 223 },
    { schoolName: '足立新田', department: '普通科', quota: 222, applicantsConfirmed: 231, testTakersConfirmed: 223, finalPassers: 222 },
    { schoolName: '足立西', department: '普通科', quota: 156, applicantsConfirmed: 162, testTakersConfirmed: 161, finalPassers: 159 },
    { schoolName: '足立東', department: '普通科', quota: 138, applicantsConfirmed: 117, testTakersConfirmed: 116, finalPassers: 116 },
    { schoolName: '江北', department: '普通科', quota: 252, applicantsConfirmed: 421, testTakersConfirmed: 404, finalPassers: 255 },
    { schoolName: '淵江', department: '普通科', quota: 189, applicantsConfirmed: 177, testTakersConfirmed: 174, finalPassers: 174 },
    { schoolName: '葛飾野', department: '普通科', quota: 253, applicantsConfirmed: 285, testTakersConfirmed: 278, finalPassers: 255 },
    { schoolName: '南葛飾', department: '普通科', quota: 171, applicantsConfirmed: 216, testTakersConfirmed: 208, finalPassers: 173 },
    { schoolName: '江戸川', department: '普通科', quota: 253, applicantsConfirmed: 393, testTakersConfirmed: 378, finalPassers: 257 },
    { schoolName: '葛西南', department: '普通科', quota: 190, applicantsConfirmed: 150, testTakersConfirmed: 142, finalPassers: 142 },
    { schoolName: '小岩', department: '普通科', quota: 284, applicantsConfirmed: 390, testTakersConfirmed: 379, finalPassers: 285 },
    { schoolName: '小松川', department: '普通科', quota: 253, applicantsConfirmed: 297, testTakersConfirmed: 274, finalPassers: 257 },
    { schoolName: '篠崎', department: '普通科', quota: 222, applicantsConfirmed: 198, testTakersConfirmed: 187, finalPassers: 187 },
    { schoolName: '紅葉川', department: '普通科', quota: 189, applicantsConfirmed: 226, testTakersConfirmed: 217, finalPassers: 191 },
    { schoolName: '片倉', department: '普通科', quota: 189, applicantsConfirmed: 232, testTakersConfirmed: 222, finalPassers: 190 },
    { schoolName: '八王子北', department: '普通科', quota: 158, applicantsConfirmed: 178, testTakersConfirmed: 173, finalPassers: 160 },
    { schoolName: '八王子東', department: '普通科', quota: 252, applicantsConfirmed: 308, testTakersConfirmed: 284, finalPassers: 256 },
    { schoolName: '富士森', department: '普通科', quota: 249, applicantsConfirmed: 320, testTakersConfirmed: 310, finalPassers: 256 },
    { schoolName: '松が谷', department: '普通科', quota: 188, applicantsConfirmed: 265, testTakersConfirmed: 256, finalPassers: 189 },
    { schoolName: '立川', department: '普通科', quota: 220, applicantsConfirmed: 323, testTakersConfirmed: 301, finalPassers: 225 },
    { schoolName: '武蔵野北', department: '普通科', quota: 189, applicantsConfirmed: 281, testTakersConfirmed: 251, finalPassers: 191 },
    { schoolName: '多摩', department: '普通科', quota: 163, applicantsConfirmed: 52, testTakersConfirmed: 52, finalPassers: 52 },
    { schoolName: '府中', department: '普通科', quota: 252, applicantsConfirmed: 410, testTakersConfirmed: 384, finalPassers: 254 },
    { schoolName: '府中西', department: '普通科', quota: 235, applicantsConfirmed: 267, testTakersConfirmed: 259, finalPassers: 238 },
    { schoolName: '府中東', department: '普通科', quota: 253, applicantsConfirmed: 328, testTakersConfirmed: 311, finalPassers: 254 },
    { schoolName: '昭和', department: '普通科', quota: 252, applicantsConfirmed: 472, testTakersConfirmed: 456, finalPassers: 255 },
    { schoolName: '拝島', department: '普通科', quota: 221, applicantsConfirmed: 213, testTakersConfirmed: 204, finalPassers: 204 },
    { schoolName: '神代', department: '普通科', quota: 252, applicantsConfirmed: 424, testTakersConfirmed: 387, finalPassers: 255 },
    { schoolName: '調布北', department: '普通科', quota: 188, applicantsConfirmed: 326, testTakersConfirmed: 287, finalPassers: 189 },
    { schoolName: '調布南', department: '普通科', quota: 189, applicantsConfirmed: 281, testTakersConfirmed: 244, finalPassers: 191 },
    { schoolName: '小川', department: '普通科', quota: 252, applicantsConfirmed: 285, testTakersConfirmed: 276, finalPassers: 255 },
    { schoolName: '成瀬', department: '普通科', quota: 221, applicantsConfirmed: 269, testTakersConfirmed: 250, finalPassers: 223 },
    { schoolName: '野津田', department: '普通科', quota: 95, applicantsConfirmed: 36, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '町田', department: '普通科', quota: 253, applicantsConfirmed: 306, testTakersConfirmed: 290, finalPassers: 256 },
    { schoolName: '山崎', department: '普通科', quota: 166, applicantsConfirmed: 62, testTakersConfirmed: 58, finalPassers: 58 },
    { schoolName: '小金井北', department: '普通科', quota: 189, applicantsConfirmed: 307, testTakersConfirmed: 284, finalPassers: 192 },
    { schoolName: '小平', department: '普通科', quota: 157, applicantsConfirmed: 235, testTakersConfirmed: 222, finalPassers: 161 },
    { schoolName: '小平西', department: '普通科', quota: 222, applicantsConfirmed: 256, testTakersConfirmed: 246, finalPassers: 224 },
    { schoolName: '小平南', department: '普通科', quota: 221, applicantsConfirmed: 317, testTakersConfirmed: 304, finalPassers: 225 },
    { schoolName: '日野', department: '普通科', quota: 253, applicantsConfirmed: 459, testTakersConfirmed: 442, finalPassers: 256 },
    { schoolName: '日野台', department: '普通科', quota: 241, applicantsConfirmed: 353, testTakersConfirmed: 332, finalPassers: 244 },
    { schoolName: '南平', department: '普通科', quota: 253, applicantsConfirmed: 329, testTakersConfirmed: 306, finalPassers: 256 },
    { schoolName: '東村山', department: '普通科', quota: 136, applicantsConfirmed: 133, testTakersConfirmed: 128, finalPassers: 128 },
    { schoolName: '東村山西', department: '普通科', quota: 189, applicantsConfirmed: 130, testTakersConfirmed: 123, finalPassers: 123 },
    { schoolName: '国立', department: '普通科', quota: 252, applicantsConfirmed: 330, testTakersConfirmed: 295, finalPassers: 260 },
    { schoolName: '福生', department: '普通科', quota: 221, applicantsConfirmed: 242, testTakersConfirmed: 236, finalPassers: 223 },
    { schoolName: '狛江', department: '普通科', quota: 253, applicantsConfirmed: 425, testTakersConfirmed: 377, finalPassers: 257 },
    { schoolName: '東大和', department: '普通科', quota: 221, applicantsConfirmed: 277, testTakersConfirmed: 264, finalPassers: 222 },
    { schoolName: '東大和南', department: '普通科', quota: 220, applicantsConfirmed: 367, testTakersConfirmed: 355, finalPassers: 225 },
    { schoolName: '清瀬', department: '普通科', quota: 220, applicantsConfirmed: 264, testTakersConfirmed: 251, finalPassers: 223 },
    { schoolName: '久留米西', department: '普通科', quota: 188, applicantsConfirmed: 169, testTakersConfirmed: 163, finalPassers: 163 },
    { schoolName: '武蔵村山', department: '普通科', quota: 221, applicantsConfirmed: 227, testTakersConfirmed: 221, finalPassers: 221 },
    { schoolName: '永山', department: '普通科', quota: 246, applicantsConfirmed: 234, testTakersConfirmed: 226, finalPassers: 226 },
    { schoolName: '羽村', department: '普通科', quota: 204, applicantsConfirmed: 71, testTakersConfirmed: 70, finalPassers: 70 },
    { schoolName: '秋留台', department: '普通科', quota: 166, applicantsConfirmed: 151, testTakersConfirmed: 146, finalPassers: 146 },
    { schoolName: '五日市', department: '普通科', quota: 129, applicantsConfirmed: 53, testTakersConfirmed: 51, finalPassers: 51 },
    { schoolName: '田無', department: '普通科', quota: 252, applicantsConfirmed: 299, testTakersConfirmed: 285, finalPassers: 255 },
    { schoolName: '保谷', department: '普通科', quota: 253, applicantsConfirmed: 364, testTakersConfirmed: 346, finalPassers: 256 },
    { schoolName: '大島', department: '普通科', quota: 80, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '新島', department: '普通科', quota: 40, applicantsConfirmed: 9, testTakersConfirmed: 9, finalPassers: 9 },
    { schoolName: '神津', department: '普通科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '三宅', department: '普通科', quota: 40, applicantsConfirmed: 2, testTakersConfirmed: 2, finalPassers: 2 },
    { schoolName: '八丈', department: '普通科', quota: 80, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '小笠原', department: '普通科', quota: 30, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '深川', department: '普通科（コース制・外国語）', quota: 56, applicantsConfirmed: 79, testTakersConfirmed: 71, finalPassers: 57 },
    { schoolName: '片倉', department: '普通科（コース制・造形美術）', quota: 56, applicantsConfirmed: 37, testTakersConfirmed: 36, finalPassers: 36 },
    { schoolName: '松が谷', department: '普通科（コース制・外国語）', quota: 56, applicantsConfirmed: 82, testTakersConfirmed: 77, finalPassers: 57 },
    { schoolName: '小平', department: '普通科（コース制・外国語）', quota: 56, applicantsConfirmed: 81, testTakersConfirmed: 70, finalPassers: 58 },
    { schoolName: '新宿', department: '普通科（単位制）', quota: 284, applicantsConfirmed: 629, testTakersConfirmed: 558, finalPassers: 288 },
    { schoolName: '忍岡', department: '普通科（単位制）', quota: 124, applicantsConfirmed: 134, testTakersConfirmed: 127, finalPassers: 125 },
    { schoolName: '墨田川', department: '普通科（単位制）', quota: 252, applicantsConfirmed: 296, testTakersConfirmed: 274, finalPassers: 256 },
    { schoolName: '美原', department: '普通科（単位制）', quota: 156, applicantsConfirmed: 115, testTakersConfirmed: 106, finalPassers: 106 },
    { schoolName: '深沢', department: '普通科（単位制）', quota: 130, applicantsConfirmed: 82, testTakersConfirmed: 72, finalPassers: 72 },
    { schoolName: '芦花', department: '普通科（単位制）', quota: 220, applicantsConfirmed: 322, testTakersConfirmed: 286, finalPassers: 222 },
    { schoolName: '飛鳥', department: '普通科（単位制）', quota: 170, applicantsConfirmed: 196, testTakersConfirmed: 180, finalPassers: 173 },
    { schoolName: '板橋有徳', department: '普通科（単位制）', quota: 156, applicantsConfirmed: 155, testTakersConfirmed: 147, finalPassers: 147 },
    { schoolName: '大泉桜', department: '普通科（単位制）', quota: 156, applicantsConfirmed: 150, testTakersConfirmed: 140, finalPassers: 140 },
    { schoolName: '翔陽', department: '普通科（単位制）', quota: 188, applicantsConfirmed: 181, testTakersConfirmed: 171, finalPassers: 171 },
    { schoolName: '国分寺', department: '普通科（単位制）', quota: 252, applicantsConfirmed: 409, testTakersConfirmed: 372, finalPassers: 256 },
    { schoolName: '上水', department: '普通科（単位制）', quota: 188, applicantsConfirmed: 279, testTakersConfirmed: 276, finalPassers: 190 },
    { schoolName: '芝商業', department: '商業科', quota: 100, applicantsConfirmed: 84, testTakersConfirmed: 80, finalPassers: 80 },
    { schoolName: '江東商業', department: '商業科', quota: 105, applicantsConfirmed: 93, testTakersConfirmed: 87, finalPassers: 87 },
    { schoolName: '第三商業', department: '商業科', quota: 105, applicantsConfirmed: 115, testTakersConfirmed: 112, finalPassers: 106 },
    { schoolName: '第一商業', department: '商業科', quota: 131, applicantsConfirmed: 68, testTakersConfirmed: 54, finalPassers: 54 },
    { schoolName: '第四商業', department: '商業科', quota: 105, applicantsConfirmed: 85, testTakersConfirmed: 82, finalPassers: 82 },
    { schoolName: '葛飾商業', department: '商業科', quota: 126, applicantsConfirmed: 106, testTakersConfirmed: 105, finalPassers: 105 },
    { schoolName: '第五商業', department: '商業科', quota: 126, applicantsConfirmed: 166, testTakersConfirmed: 164, finalPassers: 128 },
    { schoolName: '大田桜台', department: 'ビジネスコミュニケーション科', quota: 105, applicantsConfirmed: 87, testTakersConfirmed: 80, finalPassers: 80 },
    { schoolName: '千早', department: 'ビジネスコミュニケーション科', quota: 126, applicantsConfirmed: 140, testTakersConfirmed: 131, finalPassers: 128 },
    { schoolName: '工芸', department: '工業科', quota: 125, applicantsConfirmed: 212, testTakersConfirmed: 200, finalPassers: 131 },
    { schoolName: '蔵前工科', department: '工業科', quota: 107, applicantsConfirmed: 71, testTakersConfirmed: 66, finalPassers: 66 },
    { schoolName: '墨田工科', department: '工業科', quota: 114, applicantsConfirmed: 65, testTakersConfirmed: 61, finalPassers: 61 },
    { schoolName: '総合工科', department: '工業科', quota: 88, applicantsConfirmed: 43, testTakersConfirmed: 41, finalPassers: 41 },
    { schoolName: '中野工科', department: '工業科', quota: 84, applicantsConfirmed: 73, testTakersConfirmed: 69, finalPassers: 69 },
    { schoolName: '杉並工科', department: '工業科', quota: 111, applicantsConfirmed: 36, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '荒川工科', department: '工業科', quota: 112, applicantsConfirmed: 30, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '北豊島工科', department: '工業科', quota: 97, applicantsConfirmed: 39, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '練馬工科', department: '工業科', quota: 105, applicantsConfirmed: 95, testTakersConfirmed: 93, finalPassers: 93 },
    { schoolName: '足立工科', department: '工業科', quota: 95, applicantsConfirmed: 55, testTakersConfirmed: 55, finalPassers: 55 },
    { schoolName: '葛西工科', department: '工業科', quota: 122, applicantsConfirmed: 88, testTakersConfirmed: 86, finalPassers: 86 },
    { schoolName: '府中工科', department: '工業科', quota: 106, applicantsConfirmed: 101, testTakersConfirmed: 98, finalPassers: 94 },
    { schoolName: '町田工科', department: '工業科', quota: 108, applicantsConfirmed: 53, testTakersConfirmed: 49, finalPassers: 49 },
    { schoolName: '多摩工科', department: '工業科', quota: 109, applicantsConfirmed: 101, testTakersConfirmed: 99, finalPassers: 96 },
    { schoolName: '田無工科', department: '工業科', quota: 111, applicantsConfirmed: 85, testTakersConfirmed: 83, finalPassers: 83 },
    { schoolName: '六郷工科', department: '工業科（単位制）', quota: 96, applicantsConfirmed: 72, testTakersConfirmed: 64, finalPassers: 64 },
    { schoolName: '科学技術', department: '科学技術科', quota: 107, applicantsConfirmed: 78, testTakersConfirmed: 51, finalPassers: 66 },
    { schoolName: '多摩科学技術', department: '科学技術科', quota: 147, applicantsConfirmed: 209, testTakersConfirmed: 153, finalPassers: 153 },
    { schoolName: '園芸', department: '農業科', quota: 99, applicantsConfirmed: 120, testTakersConfirmed: 116, finalPassers: 103 },
    { schoolName: '農芸', department: '農業科', quota: 92, applicantsConfirmed: 89, testTakersConfirmed: 82, finalPassers: 82 },
    { schoolName: '農産', department: '農業科', quota: 84, applicantsConfirmed: 92, testTakersConfirmed: 91, finalPassers: 86 },
    { schoolName: '農業', department: '農業科', quota: 63, applicantsConfirmed: 77, testTakersConfirmed: 73, finalPassers: 65 },
    { schoolName: '瑞穂農芸', department: '農業科', quota: 75, applicantsConfirmed: 72, testTakersConfirmed: 69, finalPassers: 67 },
    { schoolName: '大島海洋国際', department: '水産科', quota: 42, applicantsConfirmed: 57, testTakersConfirmed: 54, finalPassers: 43 },
    { schoolName: '赤羽北桜', department: '家庭科', quota: 123, applicantsConfirmed: 136, testTakersConfirmed: 130, finalPassers: 125 },
    { schoolName: '農業', department: '家庭科', quota: 50, applicantsConfirmed: 60, testTakersConfirmed: 59, finalPassers: 52 },
    { schoolName: '瑞穂農芸', department: '家庭科', quota: 49, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '忍岡', department: '家庭科（単位制）', quota: 49, applicantsConfirmed: 54, testTakersConfirmed: 53, finalPassers: 50 },
    { schoolName: '赤羽北桜', department: '福祉科', quota: 25, applicantsConfirmed: 27, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '野津田', department: '福祉科', quota: 29, applicantsConfirmed: 7, testTakersConfirmed: 6, finalPassers: 6 },
    { schoolName: '科学技術', department: '理数科', quota: 37, applicantsConfirmed: 69, testTakersConfirmed: 54, finalPassers: 39 },
    { schoolName: '立川', department: '理数科', quota: 34, applicantsConfirmed: 141, testTakersConfirmed: 134, finalPassers: 36 },
    { schoolName: '総合芸術', department: '芸術科', quota: 112, applicantsConfirmed: 182, testTakersConfirmed: 171, finalPassers: 111 },
    { schoolName: '駒場', department: '体育科', quota: 28, applicantsConfirmed: 34, testTakersConfirmed: 32, finalPassers: 30 },
    { schoolName: '野津田', department: '体育科', quota: 28, applicantsConfirmed: 28, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '大島', department: '併合科（農林・家政）', quota: 35, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '三宅', department: '併合科（農業・家政）', quota: 35, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '八丈', department: '併合科（園芸・家政）', quota: 35, applicantsConfirmed: 3, testTakersConfirmed: 3, finalPassers: 3 },
    { schoolName: '橘', department: '産業科', quota: 148, applicantsConfirmed: 78, testTakersConfirmed: 76, finalPassers: 76 },
    { schoolName: '八王子桑志', department: '産業科', quota: 126, applicantsConfirmed: 149, testTakersConfirmed: 142, finalPassers: 130 },
    { schoolName: '晴海総合', department: '総合学科', quota: 192, applicantsConfirmed: 399, testTakersConfirmed: 373, finalPassers: 195 },
    { schoolName: 'つばさ総合', department: '総合学科', quota: 164, applicantsConfirmed: 183, testTakersConfirmed: 170, finalPassers: 166 },
    { schoolName: '世田谷総合', department: '総合学科', quota: 164, applicantsConfirmed: 188, testTakersConfirmed: 174, finalPassers: 165 },
    { schoolName: '杉並総合', department: '総合学科', quota: 150, applicantsConfirmed: 213, testTakersConfirmed: 201, finalPassers: 152 },
    { schoolName: '王子総合', department: '総合学科', quota: 164, applicantsConfirmed: 175, testTakersConfirmed: 170, finalPassers: 167 },
    { schoolName: '葛飾総合', department: '総合学科', quota: 136, applicantsConfirmed: 141, testTakersConfirmed: 138, finalPassers: 138 },
    { schoolName: '青梅総合', department: '総合学科', quota: 164, applicantsConfirmed: 165, testTakersConfirmed: 160, finalPassers: 160 },
    { schoolName: '町田総合', department: '総合学科', quota: 164, applicantsConfirmed: 165, testTakersConfirmed: 164, finalPassers: 164 },
    { schoolName: '東久留米総合', department: '総合学科', quota: 164, applicantsConfirmed: 217, testTakersConfirmed: 215, finalPassers: 166 },
    { schoolName: '若葉総合', department: '総合学科', quota: 164, applicantsConfirmed: 138, testTakersConfirmed: 131, finalPassers: 131 },
    { schoolName: '一橋', department: '普通科', quota: 187, applicantsConfirmed: 144, testTakersConfirmed: 137, finalPassers: 136 },
    { schoolName: '新宿山吹', department: '普通科1〜4部', quota: 150, applicantsConfirmed: 199, testTakersConfirmed: 176, finalPassers: 114 },
    { schoolName: '新宿山吹', department: '情報科2・4部', quota: 46, applicantsConfirmed: 72, testTakersConfirmed: 67, finalPassers: 56 },
    { schoolName: '浅草', department: '普通科', quota: 188, applicantsConfirmed: 135, testTakersConfirmed: 133, finalPassers: 133 },
    { schoolName: '荻窪', department: '普通科', quota: 197, applicantsConfirmed: 80, testTakersConfirmed: 75, finalPassers: 75 },
    { schoolName: '八王子拓真', department: '普通科', quota: 207, applicantsConfirmed: 198, testTakersConfirmed: 191, finalPassers: 178 },
    { schoolName: '砂川', department: '普通科1〜3部', quota: 145, applicantsConfirmed: 159, testTakersConfirmed: 156, finalPassers: 130 },
  ],
};
