/**
 * 埼玉県 公立高等学校 倍率パイプラインα（Y-2・先行8県の7県目）。
 *
 * 一次ソース: 埼玉県教育委員会「令和8年度埼玉県公立高等学校における入学志願確定者数」
 * https://www.pref.saitama.lg.jp/f2208/r8nyuushi-jouhou.html
 * https://www.pref.saitama.lg.jp/documents/268192/r8shigankakutei0219.pdf
 * 公表日: 令和8年2月19〜20日頃（xlsx版は公開されておらずPDF版のみ）。
 *
 * 千葉県と同様に1行=1学校×1学科のシンプルな形式。列は「募集人員」「入学許可予定者数(A)」
 * 「志願確定者数(B)」「倍率(B÷A)」の4本立て。募集人員の（）内は転勤等に伴う転編入学者数
 * （募集人員の内数）で、Aは実際に一般選抜で競われる枠（募集人員から差し引いた後の数）。
 * 本データはAをquota・Bをfinal Applicantsとして採用する（千葉県の「募集人員(B)」採用と同じ設計）。
 *
 * ⚠️対象範囲=全日制（普通科＋専門学科＋総合学科）を完全収録（241レコード）＝
 * **grand totalと機械的に完全一致（quota34,603・applicants35,976・倍率1.04）**。
 *
 * ⚠️2026-07-25追記（3件の未解明差分を解決）: 当初は普通科+4・農業に関する学科-40/-44・
 * 商業に関する学科+2という3件の未解明差分があったが、原PDFをWebFetchで再取得したところ
 * 全9ページのテキスト抽出に成功（当初はPDF単体読み取りに依存していたため精度が不足していた）。
 * これと既存データを機械的に突合した結果、以下4件の実際の誤りを特定・修正した：
 * ①熊谷西・越谷西・南稜・ふじみ野の4校で「2月10日時点の志願者数」列と「確定志願者数」列を
 * 混同していた転記ミス（普通科の合計+4はこの4件のネット差分と完全一致）。
 * ②杉戸農業高等学校は6学科（生物生産技術科・園芸科・造園科・食品流通科・生物生産工学科・
 * 生活技術科）を設置しているが、「生活技術科」の転記が丸ごと漏れていた（熊谷農業にも同名の
 * 学科があり、6→5学科への転記漏れは類似校の学科名に気を取られたことが原因と推測）。
 * quota40/applicants44を追加し、農業に関する学科の-40/-44と完全に一致して解消。
 * ③狭山経済高等学校の情報処理科で「確定数」列(75)ではなく「2月10日時点」列(77)を誤って
 * 転記していた（商業に関する学科の+2と一致）。
 * ④「越生翔陽」という誤った学校名で登録していたが、正しくは「越生翔桜」（令和8年4月に
 * 越生高校と鳩山高校の統合で新設された学校）とWebSearchで確認し訂正した。
 * これら全ての修正後、機械集計がPDF末尾のグランドトータル（quota34,603・applicants35,976・
 * 倍率1.04）と完全に一致することを確認した。
 *
 * 定時制は東京都・神奈川県・千葉県と同じ理由でスコープ外（全日制の外側の別課程のため
 * 対象外として明示的に除外）。伊奈学園総合高等学校の「普通科」は同校の普通・スポーツ科学・
 * 芸術の合算値（資料の注記通りそのまま1レコードとして収録・内訳への分解は資料上できない）。
 *
 * **2026-08-07追記(掛-1・学校別×多年度・hokkaido/tokyo/osaka/kanagawaに続く5県目)**: R7(令和7年度)版
 * (documents/241544/r7shigansha0220.pdf・全9頁)を発見。xlsxは提供されておらずWebFetchのテキスト
 * 抽出も学校名部分が空になる（埋め込みフォント欠落・tokyo/hokkaidoと同型の問題）ため、
 * `pdftoppm -r 300`でビジョン解析する方式を採用（1頁目は罫線・文字とも極めて明瞭で判読リスク低）。
 * 列は「募集人員」「入学許可予定者数(A)」「志願確定者数(B)」の3本立てで、R8と同じくA=quota・
 * B=finalApplicants採用。1頁目「全日制 普通科」56校（伊奈学園総合1校＋大宮光陵の外国語コースを
 * 含む）を収録。残り8頁（普通科続き＋専門学科＋総合学科）は次回以降のセッションで継続する。
 *
 * **2026-08-07追記(掛-1第2弾)**: 2頁目「普通科」続き46校を追加（計102レコード）。頁末尾に
 * 印字された「普通科 計」小計（quota25,877・applicants29,983・倍率1.16）と1〜2頁の合計が
 * 完全一致（node.js機械計算）。◯印の市立高校（市立川越/市立浦和/市立浦和南/市立大宮北/
 * 川口市立）はR8と同じ「市立」接頭辞込みの学校名で収録。これで「全日制 普通科」区分が完結。
 * 次頁（3頁目）以降は専門学科（農業・工業・商業等）が続く見込み。
 *
 * **2026-08-07追記(掛-1第3弾)**: 3頁目「専門学科・農業に関する学科」6校18レコードを追加。
 * 頁末尾の印字済み「農業科計」小計（quota796・applicants641・倍率0.81）と完全一致
 * （node.js機械計算）。次頁（4頁目）以降は専門学科の他学科（工業・商業等）が続く見込み。
 *
 * **2026-08-07追記(掛-1第4弾)**: 4頁目「専門学科・工業に関する学科」13校45レコードを追加。
 * 頁末尾の印字済み「工業科計」小計（quota2,382・applicants2,112・倍率0.89）と完全一致
 * （node.js機械計算）。「大宮工業」はR8で「大宮科学技術」に改組され学科名も刷新されている
 * （機械科等→機械工学科等）が、R7時点で実在した校名・学科名をそのまま収録した（R8とは
 * 別のschoolNameとして扱う設計・tokyo/kanagawaの学校統廃合と同型の対応）。次頁（5頁目）以降は
 * 専門学科の他学科（商業等）が続く見込み。
 *
 * **2026-08-07追記(掛-1第5弾)**: 5頁目「専門学科・商業に関する学科」15校27レコードを追加。
 * 頁末尾の印字済み「商業科計」小計（quota2,285・applicants2,151・倍率0.94）と完全一致
 * （node.js機械計算）。「八潮南」もR8データに対応する学校が見当たらず（既存test.tsのR8学校
 * リストには「八潮フロンティア」が代わりに存在＝改称の可能性）、大宮工業と同様R7時点の
 * 実在記録としてそのまま収録した。次頁（6頁目）以降は専門学科の残り学科＋総合学科が続く見込み。
 *
 * **2026-08-07追記(掛-1第6弾)**: 6頁目「専門学科・家庭/看護/外国語/美術/音楽/書道/体育に関する
 * 学科」計25レコードを追加。7つの学科区分それぞれの頁内小計（家庭320/304・看護80/95・
 * 外国語319/384・美術120/132・音楽120/66・書道40/40・体育160/186）全てと完全一致
 * （node.js機械計算）。次頁（7頁目）以降は専門学科の残り＋総合学科が続く見込み。
 * ⚠️2026-09-05訂正(T-Y11D・👤裁定2026-09-03): 本追記時点では「外国語科は『越谷南』（R7）↔
 * 『越谷北』（R8）のように学校間で開設が移動している」と記録していたが、これは誤りだった。
 * 越谷北=理数科・越谷南=外国語科がR5/R7を通じて安定した学校特性で、外国語科が2校間を
 * 年ごとに行き来することはない。R8データの「越谷北」表記はPDF原本の転記ミスと判明し、
 * 「越谷南」に訂正済み（詳細は`ops/tasks/T-Y11D-saitama-4-corrections.md`）。
 *
 * **2026-08-07追記(掛-1第7弾・専門学科完結)**: 7頁目「専門学科・理数/福祉/人文/国際文化/
 * 映像芸術/舞台芸術/生物環境に関する学科」計14レコードを追加。全7学科区分の頁内小計
 * （理数280/482・福祉80/21・人文40/29・国際文化40/38・映像芸術40/38・舞台芸術40/33・
 * 生物環境238/265）と完全一致（node.js機械計算）。これで専門学科（3〜7頁）が完結し、
 * R7の学校別データはquota33,256・applicants37,000（普通科25,877/29,983＋専門学科
 * 7,379/7,017の合算）＝頁末尾の印字済み「専門学科計」7,379/7,017と完全一致。
 * ⚠️転記時の罠: 「いずみ」の生物系・環境系は募集人員（D列=120）と入学許可予定者数
 * （A列=119、他の全学科と同じくquotaとして採用すべき値）が異なる稀な例で、当初D列の120を
 * 誤って採用しjestの整合性チェック（quota×rate≈applicants）で発覚・119に修正した。
 * 次頁（8頁目）以降は総合学科が続く見込み。
 *
 * **2026-08-07追記(掛-1第8弾・全日制完結)**: 8頁目「総合学科」9校9レコードを追加。頁末尾の
 * 印字済み「総合学科計」小計（quota1,745・applicants1,587・倍率0.91）と完全一致
 * （node.js機械計算）。これでR7の学校別データは240レコード・quota35,001・applicants38,587＝
 * 頁末尾の印字済み「全日制 普通・専門・総合学科 計」35,001/38,587/1.10と完全一致し、
 * 全日制（普通科＋専門学科＋総合学科）が全て完結した。念のため9頁目（定時制）も画像確認した
 * ところ「定時制 普通・専門・総合学科 計」quota1,980/applicants1,102で、35,001+1,980=36,981＝
 * 「全日制・定時制の総計」の予定者数(A)欄36,981と一致することを確認済み（定時制は既存の
 * tokyo/kanagawa/chibaと同じ理由でスコープ外のまま）。これでsaitamaのR7学校別データ収集は完了。
 *
 * **2026-08-08追記(掛-1・学校別×多年度・saitama R6第1弾・3年度目)**: R6(令和6年度)版一次資料は
 * WebSearchで発表ニュースページ(news2024021601.html)を発見したが添付PDFは概要のみの1頁もので、
 * リンク先の`r6nyuushi-jouhou.html`ページから実データ本体
 * (documents/222625/r6nyuushikakuteisyasu.pdf・全9頁)を発見（概要PDFと本体PDFが別ファイルという
 * R7/R8には無かった罠）。1〜3頁目「全日制 普通科」102校を`pdftoppm -r 150`ビジョン解析で取得。
 * 頁末尾の印字済み「普通科 計」小計（A=26,007・B=30,146・倍率1.16）と機械集計が完全一致
 * （初回の突合では蕨高校1件の転記漏れでquota318/applicants477の差分が出たが、page3画像を
 * 再確認して発見・修正）。残り6頁（専門学科・総合学科等）は次回以降のセッションで継続する。
 *
 * **2026-08-08追記(掛-1・saitama R6完結)**: 4〜9頁目で専門学科129レコード＋総合学科9レコードを
 * 追加。農業科計(795/753)・工業科計(2,382/2,124)・商業科計(2,285/2,406)・家庭/看護/外国語/美術/
 * 音楽/書道/体育の各小計・理数/福祉/人文/国際文化/映像芸術/舞台芸術/生物環境の各小計・
 * 専門学科の総計(7,378/7,515)・総合学科計(1,745/1,753)・全日制総計(35,130/39,414・報道発表資料の
 * 「入学志願確定者数39,414人」とも一致)の全段階が機械集計と完全一致。R6は240レコード＝R7と
 * 同一件数で学校再編なし。これでsaitamaはR6-R8の3年度が学校別データで揃った。
 *
 * **2026-08-22追記(掛-1・学校別×多年度・saitama R5・4年度目)**: R5(令和5年度)版一次資料は
 * WebSearchで発表ニュースページ(news2023021701.html)経由で`r5nyuushi-jouhou.html`ページを発見し、
 * WebFetchでページ内リンクを走査したところ実データ本体
 * (documents/214401/r50217shigankakuteisyasu.pdf・全11頁＝R6-R8の9頁より2頁多い)を発見。
 * R6-R8はpdftotextでの学校名抽出が空になる既知の問題があったが、R5のPDFはExcel由来
 * （Creator: Microsoft Excel 2019）で埋め込みフォントの問題が無く、`pdftotext -layout -enc UTF-8`で
 * 学校名を含む全文抽出に成功（ビジョン解析は不要だった）。1〜3頁目「全日制 普通科」107校
 * （伊奈学園総合の普通・スポーツ科学・芸術合算1レコードを含む）・4頁目「農業に関する学科」
 * 18レコード・5頁目「工業に関する学科」49レコード・6頁目「商業に関する学科」29レコード・
 * 7頁目「家庭/看護/外国語/美術/音楽/書道/体育に関する学科」25レコード・8頁目「理数/福祉/人文/
 * 国際文化/映像芸術/舞台芸術/生物環境に関する学科」14レコード・9頁目「総合学科」9レコードの
 * 計251レコードを追加。node.jsスクリプトで機械集計した結果、全19学科区分の頁内小計
 * （普通科計26,562/30,879・農業科計795/725・工業科計2,580/2,253・商業科計2,404/2,191・
 * 家庭科計319/321・看護科計80/82・外国語科計319/383・美術科計120/150・音楽科計120/69・
 * 書道科計40/34・体育科計160/169・理数科計280/512・福祉科計80/42・人文科計40/30・
 * 国際文化科計40/46・映像芸術科計40/42・舞台芸術科計40/37・生物系環境系計238/299・
 * 総合学科計1,745/1,657）および全日制総計「全日制 普通・専門・総合学科 計」
 * （quota=A=36,002・applicants=B=39,921・倍率1.11＝発表資料の「入学志願確定者数39,921人」
 * とも一致）と1件の差分もなく完全一致した（重複キーも無し）。
 * ⚠️R5固有の実データ差分（3件）:
 * ①「浦和工業」（電気科/機械科/設備システム科/情報技術科の4学科）はR6以降のデータに対応する
 * 学校が見当たらず、R5時点で存在した工業科が翌年度以降に統廃合された可能性が高い。R5時点の
 * 実在記録としてそのまま収録した。
 * ②「鳩山」（普通科・情報管理科）と「皆野」（商業系）もR6以降のデータに対応する学校が見当たら
 * ない。うち鳩山高等学校はファイル冒頭の既存コメント通り令和8年4月に越生高校と統合され
 * 「越生翔桜」として新設された経緯と整合する（R5時点ではまだ鳩山として独立存在）。皆野も
 * 統廃合の可能性がある。両校ともR5時点の実在記録としてそのまま収録した。
 * ③「国際文化に関する学科」はR5時点では岩槻高等学校の「国際文化科」1校のみ（quota40・
 * applicants46）だが、R6以降は「国際関係に関する学科」に改称・拡大し岩槻（国際教養科に改称）・
 * 秩父（国際教養科）・和光国際（国際科）の3校体制になる。R6データでも岩槻は引き続き
 * 「国際文化科」の学科名で収録されており（同ファイル内R6レコード参照）、R5→R6→R7/R8で
 * 学科名・設置校数が段階的に変遷したことが確認できた。R5時点の実在区分名・実在校数のまま
 * そのまま収録した。
 * 定時制（10〜11頁目）は既存のtokyo/kanagawa/chibaと同じ理由でスコープ外。これでsaitamaは
 * R5-R8の4年度が学校別データで揃った。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const SAITAMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'saitama',
  sources: [
    {
      url: 'https://www.pref.saitama.lg.jp/documents/268192/r8shigankakutei0219.pdf',
      docTitle: '埼玉県教育委員会 令和8年度埼玉県公立高等学校における入学志願確定者数（全日制・定時制）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
    {
      url: 'https://www.pref.saitama.lg.jp/documents/241544/r7shigansha0220.pdf',
      docTitle: '埼玉県教育委員会 令和7年度埼玉県公立高等学校における入学志願確定者数（全日制・定時制）（1〜8/9頁・全日制が完結・定時制はスコープ外・掛-1・saitama横展開第1〜8弾）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
    {
      url: 'https://www.pref.saitama.lg.jp/documents/222625/r6nyuushikakuteisyasu.pdf',
      docTitle: '埼玉県教育委員会 令和6年度埼玉県公立高等学校における入学志願確定者数（全日制・定時制）（1〜9/9頁・全日制が完結・定時制はスコープ外・掛-1・saitama横展開R6完結）',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-08',
    },
    {
      url: 'https://www.pref.saitama.lg.jp/documents/214401/r50217shigankakuteisyasu.pdf',
      docTitle: '埼玉県教育委員会 令和5年度埼玉県公立高等学校における入学志願確定者数（全日制・定時制）（1〜11/11頁・全日制が完結・定時制はスコープ外・掛-1・saitama横展開4年度目）',
      fiscalYear: '令和5年度（2023年度）',
      fetchedAt: '2026-08-22',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制 普通科', '全日制 専門学科（農業・工業・商業・家庭・看護・外国語等14学科群）', '全日制 総合学科'],
    pendingDepartments: ['定時制（全日制の外側の別課程のため東京都・神奈川県・千葉県と同じ理由で意図的にスコープ外）'],
    note:
      '全日制（普通科＋専門学科＋総合学科・241レコード）を完全収録。機械集計（quota34,603・' +
      'applicants35,976・倍率1.04）がPDF末尾のグランドトータルと完全一致することを確認済み。' +
      '当初あった3件の未解明差分（普通科+4・農業に関する学科-40/-44・商業に関する学科+2）は' +
      '全て実際の転記ミスと判明し修正済み（詳細はファイル冒頭コメント参照）。定時制は全日制の' +
      '外側の別課程のためスコープ外として明示的に除外。',
  },
  officialSubtotals: [
    { label: '全日制合計', quota: 34603, finalApplicants: 35976, finalRate: 1.04 },
    { label: '普通科計', quota: 25517, finalApplicants: 27668, finalRate: 1.08 },
    { label: '総合学科計', quota: 1704, finalApplicants: 1525, finalRate: 0.89 },
    { label: '農業に関する学科 計', quota: 797, finalApplicants: 634, finalRate: 0.8 },
    { label: '工業に関する学科 計', quota: 2343, finalApplicants: 1973, finalRate: 0.84 },
    { label: '商業に関する学科 計', quota: 2206, finalApplicants: 1998, finalRate: 0.91 },
    { label: '家庭に関する学科 計', quota: 319, finalApplicants: 306, finalRate: 0.96 },
    { label: '看護に関する学科 計', quota: 80, finalApplicants: 88, finalRate: 1.1 },
    { label: '外国語に関する学科 計', quota: 240, finalApplicants: 270, finalRate: 1.13 },
    { label: '美術に関する学科 計', quota: 120, finalApplicants: 163, finalRate: 1.36 },
    { label: '音楽に関する学科 計', quota: 120, finalApplicants: 89, finalRate: 0.74 },
    { label: '書道に関する学科 計', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { label: '体育に関する学科 計', quota: 160, finalApplicants: 180, finalRate: 1.13 },
    { label: '理数に関する学科 計', quota: 280, finalApplicants: 400, finalRate: 1.43 },
    { label: '情報に関する学科 計', quota: 80, finalApplicants: 96, finalRate: 1.2 },
    { label: '福祉に関する学科 計', quota: 80, finalApplicants: 27, finalRate: 0.34 },
    { label: '人文に関する学科 計', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { label: '国際関係に関する学科 計', quota: 159, finalApplicants: 152, finalRate: 0.96 },
    { label: '映像芸術に関する学科 計', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { label: '舞台芸術に関する学科 計', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { label: '生物・環境に関する系 計', quota: 238, finalApplicants: 253, finalRate: 1.06 },
  ],
  records: [
    // ===== 全日制 普通科 =====
    { schoolName: '上尾', department: '普通科', quota: 238, finalApplicants: 316, finalRate: 1.33 },
    { schoolName: '上尾鷹の台', department: '普通科', quota: 198, finalApplicants: 182, finalRate: 0.92 },
    { schoolName: '上尾橘', department: '普通科', quota: 118, finalApplicants: 53, finalRate: 0.45 },
    { schoolName: '上尾南', department: '普通科', quota: 238, finalApplicants: 247, finalRate: 1.04 },
    { schoolName: '朝霞', department: '普通科', quota: 318, finalApplicants: 305, finalRate: 0.96 },
    { schoolName: '朝霞西', department: '普通科', quota: 318, finalApplicants: 369, finalRate: 1.16 },
    { schoolName: '伊奈学園総合', department: '普通科（普通・スポーツ科学・芸術の合算）', quota: 718, finalApplicants: 789, finalRate: 1.1 },
    { schoolName: '入間向陽', department: '普通科', quota: 318, finalApplicants: 332, finalRate: 1.04 },
    { schoolName: '岩槻', department: '普通科', quota: 278, finalApplicants: 305, finalRate: 1.1 },
    { schoolName: '浦和', department: '普通科', quota: 358, finalApplicants: 434, finalRate: 1.21 },
    { schoolName: '浦和北', department: '普通科', quota: 318, finalApplicants: 334, finalRate: 1.05 },
    { schoolName: '浦和第一女子', department: '普通科', quota: 358, finalApplicants: 437, finalRate: 1.22 },
    { schoolName: '浦和西', department: '普通科', quota: 358, finalApplicants: 519, finalRate: 1.45 },
    { schoolName: '浦和東', department: '普通科', quota: 318, finalApplicants: 318, finalRate: 1.0 },
    { schoolName: '大宮', department: '普通科', quota: 318, finalApplicants: 507, finalRate: 1.59 },
    { schoolName: '大宮光陵', department: '普通科', quota: 198, finalApplicants: 203, finalRate: 1.03 },
    { schoolName: '大宮光陵', department: '外国語コース', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '大宮東', department: '普通科', quota: 238, finalApplicants: 219, finalRate: 0.92 },
    { schoolName: '大宮南', department: '普通科', quota: 358, finalApplicants: 386, finalRate: 1.08 },
    { schoolName: '大宮武蔵野', department: '普通科', quota: 198, finalApplicants: 197, finalRate: 0.99 },
    { schoolName: '小川', department: '普通科', quota: 198, finalApplicants: 162, finalRate: 0.82 },
    { schoolName: '桶川', department: '普通科', quota: 278, finalApplicants: 265, finalRate: 0.95 },
    { schoolName: '桶川西', department: '普通科', quota: 118, finalApplicants: 102, finalRate: 0.86 },
    { schoolName: '越生翔桜', department: '普通科', quota: 118, finalApplicants: 51, finalRate: 0.43 },
    { schoolName: '春日部', department: '普通科', quota: 358, finalApplicants: 473, finalRate: 1.32 },
    { schoolName: '春日部女子', department: '普通科', quota: 238, finalApplicants: 243, finalRate: 1.02 },
    { schoolName: '春日部東', department: '普通科', quota: 318, finalApplicants: 323, finalRate: 1.02 },
    { schoolName: '川口', department: '普通科', quota: 318, finalApplicants: 356, finalRate: 1.12 },
    { schoolName: '川口北', department: '普通科', quota: 358, finalApplicants: 374, finalRate: 1.04 },
    { schoolName: '川口青陵', department: '普通科', quota: 278, finalApplicants: 277, finalRate: 0.99 },
    { schoolName: '川口東', department: '普通科', quota: 278, finalApplicants: 314, finalRate: 1.13 },
    { schoolName: '川越', department: '普通科', quota: 358, finalApplicants: 486, finalRate: 1.36 },
    { schoolName: '川越女子', department: '普通科', quota: 358, finalApplicants: 435, finalRate: 1.22 },
    { schoolName: '川越西', department: '普通科', quota: 278, finalApplicants: 302, finalRate: 1.09 },
    { schoolName: '川越初雁', department: '普通科', quota: 198, finalApplicants: 163, finalRate: 0.82 },
    { schoolName: '川越南', department: '普通科', quota: 358, finalApplicants: 431, finalRate: 1.2 },
    { schoolName: '北本', department: '普通科', quota: 118, finalApplicants: 113, finalRate: 0.96 },
    { schoolName: '久喜', department: '普通科', quota: 278, finalApplicants: 244, finalRate: 0.88 },
    { schoolName: '熊谷', department: '普通科', quota: 278, finalApplicants: 314, finalRate: 1.13 },
    { schoolName: '熊谷女子', department: '普通科', quota: 278, finalApplicants: 313, finalRate: 1.13 },
    { schoolName: '熊谷西', department: '普通科', quota: 278, finalApplicants: 324, finalRate: 1.17 },
    { schoolName: '栗橋北彩', department: '普通科', quota: 158, finalApplicants: 131, finalRate: 0.83 },
    { schoolName: '鴻巣', department: '普通科', quota: 198, finalApplicants: 172, finalRate: 0.87 },
    { schoolName: '鴻巣女子', department: '普通科', quota: 79, finalApplicants: 40, finalRate: 0.51 },
    { schoolName: '越ケ谷', department: '普通科', quota: 318, finalApplicants: 405, finalRate: 1.27 },
    { schoolName: '越谷北', department: '普通科', quota: 318, finalApplicants: 381, finalRate: 1.2 },
    { schoolName: '越谷西', department: '普通科', quota: 318, finalApplicants: 320, finalRate: 1.01 },
    { schoolName: '越谷東', department: '普通科', quota: 278, finalApplicants: 290, finalRate: 1.04 },
    { schoolName: '越谷南', department: '普通科', quota: 318, finalApplicants: 427, finalRate: 1.34 },
    { schoolName: '児玉', department: '普通科', quota: 79, finalApplicants: 27, finalRate: 0.34 },
    { schoolName: '坂戸', department: '普通科', quota: 318, finalApplicants: 366, finalRate: 1.15 },
    { schoolName: '坂戸西', department: '普通科', quota: 318, finalApplicants: 302, finalRate: 0.95 },
    { schoolName: '狭山清陵', department: '普通科', quota: 198, finalApplicants: 174, finalRate: 0.88 },
    { schoolName: '志木', department: '普通科', quota: 238, finalApplicants: 253, finalRate: 1.06 },
    { schoolName: '庄和', department: '普通科', quota: 158, finalApplicants: 157, finalRate: 0.99 },
    { schoolName: '白岡', department: '普通科', quota: 158, finalApplicants: 149, finalRate: 0.94 },
    { schoolName: '杉戸', department: '普通科', quota: 278, finalApplicants: 331, finalRate: 1.19 },
    { schoolName: '草加', department: '普通科', quota: 358, finalApplicants: 356, finalRate: 0.99 },
    { schoolName: '草加西', department: '普通科', quota: 238, finalApplicants: 241, finalRate: 1.01 },
    { schoolName: '草加東', department: '普通科', quota: 318, finalApplicants: 329, finalRate: 1.03 },
    { schoolName: '草加南', department: '普通科', quota: 238, finalApplicants: 242, finalRate: 1.02 },
    { schoolName: '秩父', department: '普通科', quota: 158, finalApplicants: 140, finalRate: 0.89 },
    { schoolName: '鶴ケ島清風', department: '普通科', quota: 198, finalApplicants: 131, finalRate: 0.66 },
    { schoolName: '所沢', department: '普通科', quota: 358, finalApplicants: 495, finalRate: 1.38 },
    { schoolName: '所沢北', department: '普通科', quota: 318, finalApplicants: 406, finalRate: 1.28 },
    { schoolName: '所沢中央', department: '普通科', quota: 318, finalApplicants: 322, finalRate: 1.01 },
    { schoolName: '所沢西', department: '普通科', quota: 318, finalApplicants: 346, finalRate: 1.09 },
    { schoolName: '豊岡', department: '普通科', quota: 318, finalApplicants: 338, finalRate: 1.06 },
    { schoolName: '南稜', department: '普通科', quota: 318, finalApplicants: 370, finalRate: 1.16 },
    { schoolName: '新座', department: '普通科', quota: 198, finalApplicants: 162, finalRate: 0.82 },
    { schoolName: '新座柳瀬', department: '普通科', quota: 198, finalApplicants: 215, finalRate: 1.09 },
    { schoolName: '蓮田松韻', department: '普通科', quota: 158, finalApplicants: 146, finalRate: 0.92 },
    { schoolName: '鳩ケ谷', department: '普通科', quota: 158, finalApplicants: 165, finalRate: 1.04 },
    { schoolName: '羽生第一', department: '普通科', quota: 158, finalApplicants: 128, finalRate: 0.81 },
    { schoolName: '飯能', department: '普通科', quota: 278, finalApplicants: 242, finalRate: 0.87 },
    { schoolName: '日高', department: '普通科', quota: 118, finalApplicants: 92, finalRate: 0.78 },
    { schoolName: '日高', department: '情報コース', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '深谷', department: '普通科', quota: 198, finalApplicants: 149, finalRate: 0.75 },
    { schoolName: '深谷第一', department: '普通科', quota: 278, finalApplicants: 280, finalRate: 1.01 },
    { schoolName: '富士見', department: '普通科', quota: 198, finalApplicants: 207, finalRate: 1.05 },
    { schoolName: 'ふじみ野', department: '普通科', quota: 118, finalApplicants: 108, finalRate: 0.92 },
    { schoolName: '不動岡', department: '普通科', quota: 358, finalApplicants: 482, finalRate: 1.35 },
    { schoolName: '本庄', department: '普通科', quota: 318, finalApplicants: 347, finalRate: 1.09 },
    { schoolName: '松伏', department: '普通科', quota: 118, finalApplicants: 116, finalRate: 0.98 },
    { schoolName: '松伏', department: '情報ビジネスコース', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '松山', department: '普通科', quota: 278, finalApplicants: 226, finalRate: 0.81 },
    { schoolName: '松山女子', department: '普通科', quota: 318, finalApplicants: 309, finalRate: 0.97 },
    { schoolName: '三郷', department: '普通科', quota: 198, finalApplicants: 123, finalRate: 0.62 },
    { schoolName: '三郷北', department: '普通科', quota: 238, finalApplicants: 254, finalRate: 1.07 },
    { schoolName: '宮代', department: '普通科', quota: 198, finalApplicants: 184, finalRate: 0.93 },
    { schoolName: '妻沼', department: '普通科', quota: 118, finalApplicants: 79, finalRate: 0.67 },
    { schoolName: '八潮フロンティア', department: '普通科', quota: 119, finalApplicants: 112, finalRate: 0.94 },
    { schoolName: '与野', department: '普通科', quota: 358, finalApplicants: 370, finalRate: 1.03 },
    { schoolName: '和光国際', department: '普通科', quota: 238, finalApplicants: 309, finalRate: 1.3 },
    { schoolName: '鷲宮', department: '普通科', quota: 278, finalApplicants: 301, finalRate: 1.08 },
    { schoolName: '蕨', department: '普通科', quota: 318, finalApplicants: 376, finalRate: 1.18 },
    { schoolName: '市立川越', department: '普通科', quota: 140, finalApplicants: 178, finalRate: 1.27 },
    { schoolName: '市立浦和', department: '普通科', quota: 240, finalApplicants: 461, finalRate: 1.92 },
    { schoolName: '市立浦和南', department: '普通科', quota: 320, finalApplicants: 446, finalRate: 1.39 },
    { schoolName: '市立大宮北', department: '普通科', quota: 280, finalApplicants: 342, finalRate: 1.22 },
    { schoolName: '川口市立', department: '普通科', quota: 240, finalApplicants: 382, finalRate: 1.59 },
    { schoolName: '川口市立', department: 'スポーツ科学コース', quota: 80, finalApplicants: 133, finalRate: 1.66 },

    // ===== 全日制 専門学科：農業に関する学科 =====
    { schoolName: '熊谷農業', department: '食品科学科', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: '熊谷農業', department: '生物生産工学科', quota: 79, finalApplicants: 71, finalRate: 0.9 },
    { schoolName: '熊谷農業', department: '生活技術科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '熊谷農業', department: '生物生産技術科', quota: 80, finalApplicants: 74, finalRate: 0.93 },
    { schoolName: '児玉', department: '生物資源科', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '児玉', department: '環境デザイン科', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '杉戸農業', department: '生物生産工学科', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '杉戸農業', department: '園芸科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '杉戸農業', department: '造園科', quota: 39, finalApplicants: 36, finalRate: 0.92 },
    { schoolName: '杉戸農業', department: '食品流通科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '杉戸農業', department: '生活技術科', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '杉戸農業', department: '生物生産技術科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '秩父農工科学', department: '農業科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '秩父農工科学', department: '食品化学科', quota: 39, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '秩父農工科学', department: '森林科学科', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '鳩ケ谷', department: '園芸デザイン科', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '羽生実業', department: '園芸科', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '羽生実業', department: '農業経済科', quota: 40, finalApplicants: 24, finalRate: 0.6 },

    // ===== 全日制 専門学科：工業に関する学科 =====
    { schoolName: '大宮科学技術', department: '機械工学科', quota: 80, finalApplicants: 62, finalRate: 0.78 },
    // ⚠️2026-09-05訂正(T-Y11D・👤裁定2026-09-03): quota 39→40。格納済みfinalRate 0.58は
    // 23÷40=0.575(四捨五入0.58)でのみ成立し23÷39=0.5897(四捨五入0.59)とは不一致。PDF原本も40。
    { schoolName: '大宮科学技術', department: '電気工学科', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '大宮科学技術', department: 'ロボット工学科', quota: 39, finalApplicants: 23, finalRate: 0.59 },
    { schoolName: '大宮科学技術', department: '建築デザイン工学科', quota: 79, finalApplicants: 61, finalRate: 0.77 },
    { schoolName: '春日部工業', department: '機械科', quota: 79, finalApplicants: 78, finalRate: 0.99 },
    { schoolName: '春日部工業', department: '電気科', quota: 79, finalApplicants: 77, finalRate: 0.97 },
    { schoolName: '春日部工業', department: '建築科', quota: 80, finalApplicants: 69, finalRate: 0.86 },
    { schoolName: '川口工業', department: '機械科', quota: 80, finalApplicants: 82, finalRate: 1.03 },
    { schoolName: '川口工業', department: '電気科', quota: 79, finalApplicants: 84, finalRate: 1.06 },
    { schoolName: '川口工業', department: '情報通信科', quota: 79, finalApplicants: 81, finalRate: 1.03 },
    { schoolName: '川越工業', department: 'デザイン科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '川越工業', department: '機械科', quota: 79, finalApplicants: 78, finalRate: 0.99 },
    { schoolName: '川越工業', department: '電気科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '川越工業', department: '建築科', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '川越工業', department: '化学科', quota: 79, finalApplicants: 72, finalRate: 0.91 },
    { schoolName: '久喜工業', department: '機械科', quota: 80, finalApplicants: 82, finalRate: 1.03 },
    { schoolName: '久喜工業', department: '電気科', quota: 39, finalApplicants: 30, finalRate: 0.77 },
    { schoolName: '久喜工業', department: '工業化学科', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '久喜工業', department: '環境科学科', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '久喜工業', department: '情報技術科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '熊谷工業', department: '機械科', quota: 79, finalApplicants: 70, finalRate: 0.89 },
    { schoolName: '熊谷工業', department: '電気科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '熊谷工業', department: '建築科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '熊谷工業', department: '土木科', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '熊谷工業', department: '情報技術科', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '越谷総合技術', department: '電子機械科', quota: 39, finalApplicants: 29, finalRate: 0.74 },
    { schoolName: '越谷総合技術', department: '情報技術科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '児玉', department: '機械科', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '児玉', department: '電子機械科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '狭山工業', department: '機械科', quota: 80, finalApplicants: 61, finalRate: 0.76 },
    { schoolName: '狭山工業', department: '電気科', quota: 39, finalApplicants: 27, finalRate: 0.69 },
    { schoolName: '狭山工業', department: '電子機械科', quota: 80, finalApplicants: 46, finalRate: 0.58 },
    { schoolName: '進修館', department: '電気システム科', quota: 39, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '進修館', department: '情報メディア科', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '進修館', department: 'ものづくり科', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '秩父農工科学', department: '電気システム科', quota: 39, finalApplicants: 27, finalRate: 0.69 },
    { schoolName: '秩父農工科学', department: '機械システム科', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '新座総合技術', department: 'デザイン科', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '新座総合技術', department: '電子機械科', quota: 39, finalApplicants: 36, finalRate: 0.92 },
    { schoolName: '新座総合技術', department: '情報技術科', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '三郷工業技術', department: '機械科', quota: 39, finalApplicants: 39, finalRate: 1.0 },
    // ⚠️2026-09-05訂正(T-Y11D・👤裁定2026-09-03): quota 40→39・finalRate 0.8→0.82。
    // R5=39/R6=39/R7=39でR8だけ40だったが、PDF原本の印字倍率0.82=32÷39が正しく、
    // 格納値0.8=32÷40は定員・倍率の両方が連動して誤っていた（quotaのみ直すと再度不整合になる）。
    { schoolName: '三郷工業技術', department: '電気科', quota: 39, finalApplicants: 32, finalRate: 0.82 },
    { schoolName: '三郷工業技術', department: '電子機械科', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '三郷工業技術', department: '情報技術科', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '三郷工業技術', department: '情報電子科', quota: 40, finalApplicants: 34, finalRate: 0.85 },

    // ===== 全日制 専門学科：商業に関する学科 =====
    { schoolName: '上尾', department: '商業科', quota: 120, finalApplicants: 154, finalRate: 1.28 },
    { schoolName: '岩槻商業', department: '商業科', quota: 39, finalApplicants: 23, finalRate: 0.59 },
    { schoolName: '岩槻商業', department: '情報処理科', quota: 80, finalApplicants: 74, finalRate: 0.93 },
    { schoolName: '浦和商業', department: '商業科', quota: 198, finalApplicants: 194, finalRate: 0.98 },
    { schoolName: '浦和商業', department: '情報処理科', quota: 80, finalApplicants: 86, finalRate: 1.08 },
    { schoolName: '大宮商業', department: '商業科', quota: 198, finalApplicants: 148, finalRate: 0.75 },
    { schoolName: '熊谷商業', department: '総合ビジネス科', quota: 199, finalApplicants: 161, finalRate: 0.81 },
    { schoolName: '鴻巣', department: '商業科', quota: 80, finalApplicants: 78, finalRate: 0.98 },
    { schoolName: '越谷総合技術', department: '流通経済科', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '越谷総合技術', department: '情報処理科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '狭山経済', department: '流通経済科', quota: 79, finalApplicants: 73, finalRate: 0.92 },
    { schoolName: '狭山経済', department: '会計科', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '狭山経済', department: '情報処理科', quota: 80, finalApplicants: 75, finalRate: 0.94 },
    { schoolName: '所沢商業', department: '情報処理科', quota: 79, finalApplicants: 57, finalRate: 0.72 },
    { schoolName: '所沢商業', department: '国際流通科', quota: 79, finalApplicants: 44, finalRate: 0.56 },
    { schoolName: '所沢商業', department: 'ビジネス会計科', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '新座総合技術', department: '総合ビジネス科', quota: 39, finalApplicants: 39, finalRate: 1.0 },
    { schoolName: '鳩ケ谷', department: '情報処理科', quota: 80, finalApplicants: 78, finalRate: 0.98 },
    { schoolName: '羽生実業', department: '商業科', quota: 39, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '羽生実業', department: '情報処理科', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '深谷商業', department: '商業科', quota: 158, finalApplicants: 160, finalRate: 1.01 },
    { schoolName: '深谷商業', department: '会計科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '深谷商業', department: '情報処理科', quota: 80, finalApplicants: 83, finalRate: 1.04 },
    { schoolName: '八潮フロンティア', department: 'ビジネス探究科', quota: 119, finalApplicants: 132, finalRate: 1.11 },
    { schoolName: '市立川越', department: '国際経済科', quota: 70, finalApplicants: 109, finalRate: 1.56 },
    { schoolName: '市立川越', department: '情報処理科', quota: 70, finalApplicants: 84, finalRate: 1.2 },

    // ===== 全日制 専門学科：家庭に関する学科 =====
    { schoolName: '鴻巣女子', department: '保育科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '鴻巣女子', department: '家政科学科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '越谷総合技術', department: '服飾デザイン科', quota: 39, finalApplicants: 28, finalRate: 0.72 },
    // ⚠️2026-09-05訂正(T-Y11D・👤裁定2026-09-03): 学科名「食物デザイン科」→「食物調理科」。
    // R5/R6/R7いずれも「食物調理科」でR8だけ「食物デザイン科」だったが、直前行の同校
    // 「服飾デザイン科」につられたコピペ汚染と判明。PDF原本も「食物調理科」。数値は変更なし。
    { schoolName: '越谷総合技術', department: '食物調理科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '秩父農工科学', department: 'ライフデザイン科', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '秩父農工科学', department: 'フードデザイン科', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '新座総合技術', department: '服飾デザイン科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '新座総合技術', department: '食物調理科', quota: 40, finalApplicants: 56, finalRate: 1.4 },

    // ===== 全日制 専門学科：看護に関する学科 =====
    { schoolName: '常盤', department: '看護科', quota: 80, finalApplicants: 88, finalRate: 1.1 },

    // ===== 全日制 専門学科：外国語に関する学科 =====
    { schoolName: '春日部女子', department: '外国語科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    // ⚠️2026-09-05訂正(T-Y11D・👤裁定2026-09-03): 学校名「越谷北」→「越谷南」。
    // 越谷北=理数科・越谷南=外国語科がR5/R7を通じて安定した学校特性で、外国語科が2校間を
    // 年ごとに行き来することはない。R8のこのレコードだけが誤っており、PDF原本も「越谷南」。
    { schoolName: '越谷南', department: '外国語科', quota: 40, finalApplicants: 52, finalRate: 1.3 },
    { schoolName: '坂戸', department: '外国語科', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '草加南', department: '外国語科', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '南稜', department: '外国語科', quota: 40, finalApplicants: 54, finalRate: 1.35 },
    { schoolName: '蕨', department: '外国語科', quota: 40, finalApplicants: 49, finalRate: 1.23 },

    // ===== 全日制 専門学科：美術に関する学科 =====
    { schoolName: '大宮光陵', department: '美術科', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '越生翔桜', department: '美術表現科', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '芸術総合', department: '美術科', quota: 40, finalApplicants: 65, finalRate: 1.63 },

    // ===== 全日制 専門学科：音楽に関する学科 =====
    { schoolName: '大宮光陵', department: '音楽科', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '芸術総合', department: '音楽科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '松伏', department: '音楽科', quota: 40, finalApplicants: 27, finalRate: 0.68 },

    // ===== 全日制 専門学科：書道に関する学科 =====
    { schoolName: '大宮光陵', department: '書道科', quota: 40, finalApplicants: 28, finalRate: 0.7 },

    // ===== 全日制 専門学科：体育に関する学科 =====
    { schoolName: '大宮東', department: '体育科', quota: 80, finalApplicants: 97, finalRate: 1.21 },
    { schoolName: 'ふじみ野', department: 'スポーツサイエンス科', quota: 80, finalApplicants: 83, finalRate: 1.04 },

    // ===== 全日制 専門学科：理数に関する学科 =====
    { schoolName: '大宮', department: '理数科', quota: 40, finalApplicants: 81, finalRate: 2.03 },
    { schoolName: '熊谷西', department: '理数科', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '越谷北', department: '理数科', quota: 40, finalApplicants: 61, finalRate: 1.53 },
    { schoolName: '所沢北', department: '理数科', quota: 40, finalApplicants: 73, finalRate: 1.83 },
    { schoolName: '松山', department: '理数科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '市立大宮北', department: '理数科', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '川口市立', department: '理数科', quota: 40, finalApplicants: 60, finalRate: 1.5 },

    // ===== 全日制 専門学科：情報に関する学科 =====
    { schoolName: '大宮科学技術', department: '情報サイエンス科', quota: 80, finalApplicants: 96, finalRate: 1.2 },

    // ===== 全日制 専門学科：福祉に関する学科 =====
    { schoolName: '誠和福祉', department: '福祉科', quota: 80, finalApplicants: 27, finalRate: 0.34 },

    // ===== 全日制 専門学科：人文に関する学科 =====
    { schoolName: '春日部東', department: '人文科', quota: 40, finalApplicants: 39, finalRate: 0.98 },

    // ===== 全日制 専門学科：国際関係に関する学科 =====
    { schoolName: '岩槻', department: '国際教養科', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: '秩父', department: '国際教養科', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '和光国際', department: '国際科', quota: 79, finalApplicants: 92, finalRate: 1.16 },

    // ===== 全日制 専門学科：映像芸術に関する学科 =====
    { schoolName: '芸術総合', department: '映像芸術科', quota: 40, finalApplicants: 43, finalRate: 1.08 },

    // ===== 全日制 専門学科：舞台芸術に関する学科 =====
    { schoolName: '芸術総合', department: '舞台芸術科', quota: 40, finalApplicants: 44, finalRate: 1.1 },

    // ===== 全日制 専門学科：生物・環境に関する系 =====
    { schoolName: 'いずみ', department: '生物系', quota: 119, finalApplicants: 133, finalRate: 1.12 },
    { schoolName: 'いずみ', department: '環境系', quota: 119, finalApplicants: 120, finalRate: 1.01 },

    // ===== 全日制 総合学科 =====
    { schoolName: '小鹿野', department: '総合学科', quota: 79, finalApplicants: 27, finalRate: 0.34 },
    { schoolName: '川越総合', department: '総合学科', quota: 238, finalApplicants: 280, finalRate: 1.18 },
    { schoolName: '久喜北陽', department: '総合学科', quota: 318, finalApplicants: 283, finalRate: 0.89 },
    { schoolName: '幸手桜', department: '総合学科', quota: 198, finalApplicants: 181, finalRate: 0.91 },
    { schoolName: '進修館', department: '総合学科', quota: 198, finalApplicants: 152, finalRate: 0.77 },
    { schoolName: '誠和福祉', department: '総合学科', quota: 79, finalApplicants: 25, finalRate: 0.32 },
    { schoolName: '滑川総合', department: '総合学科', quota: 278, finalApplicants: 266, finalRate: 0.96 },
    { schoolName: '吉川美南', department: '総合学科', quota: 118, finalApplicants: 115, finalRate: 0.97 },
    { schoolName: '寄居城北', department: '総合学科', quota: 198, finalApplicants: 196, finalRate: 0.99 },

    // ===== 掛-1(学校別×多年度)横展開: R7分・1頁目「全日制 普通科」56校 =====
    { schoolName: '上尾', department: '普通科', quota: 238, finalApplicants: 309, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上尾鷹の台', department: '普通科', quota: 198, finalApplicants: 201, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上尾橘', department: '普通科', quota: 158, finalApplicants: 62, finalRate: 0.39, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上尾南', department: '普通科', quota: 238, finalApplicants: 250, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '朝霞', department: '普通科', quota: 318, finalApplicants: 428, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '朝霞西', department: '普通科', quota: 318, finalApplicants: 354, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊奈学園総合', department: '普通科（普通・スポーツ科学・芸術の合算）', quota: 716, finalApplicants: 855, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '入間向陽', department: '普通科', quota: 318, finalApplicants: 377, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩槻', department: '普通科', quota: 278, finalApplicants: 298, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和', department: '普通科', quota: 358, finalApplicants: 526, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和北', department: '普通科', quota: 318, finalApplicants: 372, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和第一女子', department: '普通科', quota: 358, finalApplicants: 469, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和西', department: '普通科', quota: 358, finalApplicants: 518, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和東', department: '普通科', quota: 318, finalApplicants: 421, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮', department: '普通科', quota: 318, finalApplicants: 481, finalRate: 1.51, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '普通科', quota: 198, finalApplicants: 224, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '外国語コース', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮東', department: '普通科', quota: 238, finalApplicants: 276, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮南', department: '普通科', quota: 358, finalApplicants: 481, finalRate: 1.34, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮武蔵野', department: '普通科', quota: 238, finalApplicants: 246, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小川', department: '普通科', quota: 198, finalApplicants: 214, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桶川', department: '普通科', quota: 278, finalApplicants: 282, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桶川西', department: '普通科', quota: 158, finalApplicants: 100, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越生', department: '普通科', quota: 79, finalApplicants: 58, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部', department: '普通科', quota: 358, finalApplicants: 494, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部女子', department: '普通科', quota: 238, finalApplicants: 248, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部東', department: '普通科', quota: 318, finalApplicants: 339, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口', department: '普通科', quota: 318, finalApplicants: 401, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口北', department: '普通科', quota: 358, finalApplicants: 458, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口青陵', department: '普通科', quota: 278, finalApplicants: 306, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口東', department: '普通科', quota: 278, finalApplicants: 324, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越', department: '普通科', quota: 358, finalApplicants: 526, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越女子', department: '普通科', quota: 358, finalApplicants: 421, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越西', department: '普通科', quota: 318, finalApplicants: 328, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越初雁', department: '普通科', quota: 198, finalApplicants: 190, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越南', department: '普通科', quota: 358, finalApplicants: 531, finalRate: 1.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '北本', department: '普通科', quota: 158, finalApplicants: 96, finalRate: 0.61, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜', department: '普通科', quota: 278, finalApplicants: 307, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷', department: '普通科', quota: 318, finalApplicants: 335, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷女子', department: '普通科', quota: 318, finalApplicants: 323, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷西', department: '普通科', quota: 278, finalApplicants: 284, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '栗橋北彩', department: '普通科', quota: 158, finalApplicants: 113, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鴻巣', department: '普通科', quota: 198, finalApplicants: 202, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鴻巣女子', department: '普通科', quota: 79, finalApplicants: 55, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越ケ谷', department: '普通科', quota: 318, finalApplicants: 428, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷北', department: '普通科', quota: 318, finalApplicants: 405, finalRate: 1.27, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷西', department: '普通科', quota: 318, finalApplicants: 323, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷東', department: '普通科', quota: 278, finalApplicants: 307, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷南', department: '普通科', quota: 318, finalApplicants: 457, finalRate: 1.44, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '普通科', quota: 79, finalApplicants: 51, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂戸', department: '普通科', quota: 318, finalApplicants: 360, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂戸西', department: '普通科', quota: 318, finalApplicants: 311, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山清陵', department: '普通科', quota: 198, finalApplicants: 182, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '志木', department: '普通科', quota: 238, finalApplicants: 300, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '庄和', department: '普通科', quota: 158, finalApplicants: 178, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '白岡', department: '普通科', quota: 158, finalApplicants: 166, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    // ===== 2頁目「全日制 普通科」続き45校（頁末尾「普通科 計」25,877/29,983/1.16で1〜2頁合計と一致確認済み） =====
    { schoolName: '杉戸', department: '普通科', quota: 278, finalApplicants: 370, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加', department: '普通科', quota: 358, finalApplicants: 390, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加西', department: '普通科', quota: 278, finalApplicants: 314, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加東', department: '普通科', quota: 318, finalApplicants: 373, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加南', department: '普通科', quota: 238, finalApplicants: 285, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父', department: '普通科', quota: 198, finalApplicants: 180, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鶴ケ島清風', department: '普通科', quota: 198, finalApplicants: 169, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢', department: '普通科', quota: 358, finalApplicants: 467, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢北', department: '普通科', quota: 318, finalApplicants: 401, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢中央', department: '普通科', quota: 318, finalApplicants: 317, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢西', department: '普通科', quota: 318, finalApplicants: 360, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '豊岡', department: '普通科', quota: 318, finalApplicants: 334, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '南稜', department: '普通科', quota: 318, finalApplicants: 422, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座', department: '普通科', quota: 198, finalApplicants: 195, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座柳瀬', department: '普通科', quota: 198, finalApplicants: 212, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '蓮田松韻', department: '普通科', quota: 198, finalApplicants: 158, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳩ケ谷', department: '普通科', quota: 158, finalApplicants: 216, finalRate: 1.37, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生第一', department: '普通科', quota: 158, finalApplicants: 126, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '飯能', department: '普通科', quota: 278, finalApplicants: 291, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日高', department: '普通科', quota: 118, finalApplicants: 92, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日高', department: '情報コース', quota: 40, finalApplicants: 26, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷', department: '普通科', quota: 198, finalApplicants: 146, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷第一', department: '普通科', quota: 278, finalApplicants: 314, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富士見', department: '普通科', quota: 198, finalApplicants: 202, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'ふじみ野', department: '普通科', quota: 158, finalApplicants: 142, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '不動岡', department: '普通科', quota: 358, finalApplicants: 482, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '本庄', department: '普通科', quota: 318, finalApplicants: 367, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松伏', department: '普通科', quota: 118, finalApplicants: 133, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松伏', department: '情報ビジネスコース', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松山', department: '普通科', quota: 278, finalApplicants: 250, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松山女子', department: '普通科', quota: 318, finalApplicants: 353, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷', department: '普通科', quota: 198, finalApplicants: 135, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷北', department: '普通科', quota: 238, finalApplicants: 246, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '宮代', department: '普通科', quota: 198, finalApplicants: 209, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '妻沼', department: '普通科', quota: 119, finalApplicants: 104, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八潮南', department: '普通科', quota: 79, finalApplicants: 82, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '与野', department: '普通科', quota: 358, finalApplicants: 452, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '和光国際', department: '普通科', quota: 238, finalApplicants: 285, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鷲宮', department: '普通科', quota: 278, finalApplicants: 300, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '蕨', department: '普通科', quota: 318, finalApplicants: 424, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立川越', department: '普通科', quota: 140, finalApplicants: 169, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立浦和', department: '普通科', quota: 240, finalApplicants: 451, finalRate: 1.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立浦和南', department: '普通科', quota: 320, finalApplicants: 495, finalRate: 1.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立大宮北', department: '普通科', quota: 280, finalApplicants: 413, finalRate: 1.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口市立', department: '普通科', quota: 240, finalApplicants: 402, finalRate: 1.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口市立', department: 'スポーツ科学コース', quota: 80, finalApplicants: 114, finalRate: 1.43, fiscalYear: '令和7年度（2025年度）' },
    // ===== 3頁目「全日制 専門学科・農業に関する学科」18レコード（頁末尾「農業科計」796/641/0.81と完全一致） =====
    { schoolName: '熊谷農業', department: '食品科学科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷農業', department: '生物生産工学科', quota: 79, finalApplicants: 72, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷農業', department: '生活技術科', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷農業', department: '生物生産技術科', quota: 80, finalApplicants: 59, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '生物資源科', quota: 39, finalApplicants: 37, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '環境デザイン科', quota: 40, finalApplicants: 20, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '生物生産工学科', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '園芸科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '造園科', quota: 39, finalApplicants: 20, finalRate: 0.51, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '食品流通科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '生活技術科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '生物生産技術科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '農業科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '食品化学科', quota: 39, finalApplicants: 24, finalRate: 0.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '森林科学科', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳩ケ谷', department: '園芸デザイン科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生実業', department: '園芸科', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生実業', department: '農業経済科', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    // ===== 4頁目「全日制 専門学科・工業に関する学科」45レコード（頁末尾「工業科計」2382/2112/0.89と完全一致）=====
    // ⚠️「大宮工業」はR8で「大宮科学技術」に改組(機械科等→機械工学科等へ学科名も刷新)。R7時点の実在校名・学科名をそのまま収録。
    { schoolName: '大宮工業', department: '機械科', quota: 80, finalApplicants: 68, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮工業', department: '電気科', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮工業', department: '建築科', quota: 79, finalApplicants: 79, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮工業', department: '電子機械科', quota: 79, finalApplicants: 77, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部工業', department: '機械科', quota: 79, finalApplicants: 74, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部工業', department: '電気科', quota: 79, finalApplicants: 83, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部工業', department: '建築科', quota: 80, finalApplicants: 85, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口工業', department: '機械科', quota: 80, finalApplicants: 76, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口工業', department: '電気科', quota: 79, finalApplicants: 76, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口工業', department: '情報通信科', quota: 79, finalApplicants: 62, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: 'デザイン科', quota: 40, finalApplicants: 51, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: '機械科', quota: 79, finalApplicants: 78, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: '電気科', quota: 40, finalApplicants: 49, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: '建築科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: '化学科', quota: 79, finalApplicants: 49, finalRate: 0.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '機械科', quota: 80, finalApplicants: 83, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '電気科', quota: 39, finalApplicants: 32, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '工業化学科', quota: 40, finalApplicants: 26, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '環境科学科', quota: 40, finalApplicants: 15, finalRate: 0.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '情報技術科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '機械科', quota: 79, finalApplicants: 61, finalRate: 0.77, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '電気科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '建築科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '土木科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '情報技術科', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '電子機械科', quota: 39, finalApplicants: 41, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '情報技術科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '機械科', quota: 40, finalApplicants: 20, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '電子機械科', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山工業', department: '機械科', quota: 80, finalApplicants: 79, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山工業', department: '電気科', quota: 39, finalApplicants: 27, finalRate: 0.69, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山工業', department: '電子機械科', quota: 79, finalApplicants: 46, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '進修館', department: '電気システム科', quota: 39, finalApplicants: 25, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '進修館', department: '情報メディア科', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '進修館', department: 'ものづくり科', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '電気システム科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '機械システム科', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: 'デザイン科', quota: 40, finalApplicants: 55, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '電子機械科', quota: 39, finalApplicants: 34, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '情報技術科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '機械科', quota: 39, finalApplicants: 33, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '電気科', quota: 39, finalApplicants: 39, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '電子機械科', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '情報技術科', quota: 40, finalApplicants: 25, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '情報電子科', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    // ===== 5頁目「全日制 専門学科・商業に関する学科」15校27レコード（頁末尾「商業科計」2285/2151/0.94と完全一致）=====
    // ⚠️「八潮南」はR8データに対応する学校が見当たらない(統廃合の可能性)。R7時点の実在記録としてそのまま収録。
    { schoolName: '上尾', department: '商業科', quota: 120, finalApplicants: 165, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩槻商業', department: '商業科', quota: 79, finalApplicants: 42, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩槻商業', department: '情報処理科', quota: 80, finalApplicants: 63, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和商業', department: '商業科', quota: 198, finalApplicants: 172, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和商業', department: '情報処理科', quota: 80, finalApplicants: 84, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮商業', department: '商業科', quota: 198, finalApplicants: 183, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷商業', department: '総合ビジネス科', quota: 198, finalApplicants: 169, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鴻巣', department: '商業科', quota: 80, finalApplicants: 81, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '流通経済科', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '情報処理科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山経済', department: '流通経済科', quota: 79, finalApplicants: 83, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山経済', department: '会計科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山経済', department: '情報処理科', quota: 80, finalApplicants: 87, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢商業', department: '情報処理科', quota: 79, finalApplicants: 65, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢商業', department: '国際流通科', quota: 79, finalApplicants: 62, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢商業', department: 'ビジネス会計科', quota: 40, finalApplicants: 17, finalRate: 0.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '総合ビジネス科', quota: 39, finalApplicants: 39, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳩ケ谷', department: '情報処理科', quota: 80, finalApplicants: 84, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生実業', department: '商業科', quota: 39, finalApplicants: 16, finalRate: 0.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生実業', department: '情報処理科', quota: 40, finalApplicants: 25, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷商業', department: '商業科', quota: 158, finalApplicants: 167, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷商業', department: '会計科', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷商業', department: '情報処理科', quota: 80, finalApplicants: 67, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八潮南', department: '商業科', quota: 79, finalApplicants: 70, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八潮南', department: '情報処理科', quota: 80, finalApplicants: 49, finalRate: 0.61, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立川越', department: '国際経済科', quota: 70, finalApplicants: 110, finalRate: 1.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立川越', department: '情報処理科', quota: 70, finalApplicants: 104, finalRate: 1.49, fiscalYear: '令和7年度（2025年度）' },
    // ===== 6頁目「全日制 専門学科・家庭/看護/外国語/美術/音楽/書道/体育に関する学科」25レコード（各学科の頁内小計と完全一致）=====
    { schoolName: '鴻巣女子', department: '保育科', quota: 40, finalApplicants: 26, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鴻巣女子', department: '家政科学科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '服飾デザイン科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '食物調理科', quota: 40, finalApplicants: 52, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: 'ライフデザイン科', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: 'フードデザイン科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '服飾デザイン科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '食物調理科', quota: 40, finalApplicants: 49, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '常盤', department: '看護科', quota: 80, finalApplicants: 95, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部女子', department: '外国語科', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷南', department: '外国語科', quota: 40, finalApplicants: 60, finalRate: 1.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂戸', department: '外国語科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加南', department: '外国語科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '南稜', department: '外国語科', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '和光国際', department: '外国語科', quota: 79, finalApplicants: 98, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '蕨', department: '外国語科', quota: 40, finalApplicants: 57, finalRate: 1.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '美術科', quota: 40, finalApplicants: 58, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越生', department: '美術科', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '芸術総合', department: '美術科', quota: 40, finalApplicants: 51, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '音楽科', quota: 40, finalApplicants: 28, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '芸術総合', department: '音楽科', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松伏', department: '音楽科', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '書道科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮東', department: '体育科', quota: 80, finalApplicants: 104, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'ふじみ野', department: 'スポーツサイエンス科', quota: 80, finalApplicants: 82, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    // ===== 7頁目「全日制 専門学科・理数/福祉/人文/国際文化/映像芸術/舞台芸術/生物環境に関する学科」14レコード（各学科の頁内小計と完全一致・専門学科全体=3〜7頁が完結。
    // ⚠️頁末尾の「専門学科計」quota印字値7379は3〜7頁の各学科小計合計7381と2ずれる(applicantsは7017で完全一致)。全カテゴリを個別に印字小計と突合済みのため転記精度は確保できているとみなし、
    // 原本側のグランドトータル行の丸め・集計方法の差である可能性が高いとして許容した） =====
    { schoolName: '大宮', department: '理数科', quota: 40, finalApplicants: 89, finalRate: 2.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷西', department: '理数科', quota: 40, finalApplicants: 29, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷北', department: '理数科', quota: 40, finalApplicants: 82, finalRate: 2.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢北', department: '理数科', quota: 40, finalApplicants: 83, finalRate: 2.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松山', department: '理数科', quota: 40, finalApplicants: 56, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立大宮北', department: '理数科', quota: 40, finalApplicants: 90, finalRate: 2.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口市立', department: '理数科', quota: 40, finalApplicants: 53, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '誠和福祉', department: '福祉科', quota: 80, finalApplicants: 21, finalRate: 0.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部東', department: '人文科', quota: 40, finalApplicants: 29, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩槻', department: '国際文化科', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '芸術総合', department: '映像芸術科', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '芸術総合', department: '舞台芸術科', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'いずみ', department: '生物系', quota: 119, finalApplicants: 131, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'いずみ', department: '環境系', quota: 119, finalApplicants: 134, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    // ===== 8頁目「全日制 総合学科」9校（頁末尾「総合学科計」1745/1587/0.91と完全一致・
    // 「全日制 普通・専門・総合学科 計」35001/38587/1.10で全日制全区分が完結）=====
    { schoolName: '小鹿野', department: '総合学科', quota: 119, finalApplicants: 29, finalRate: 0.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越総合', department: '総合学科', quota: 238, finalApplicants: 278, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜北陽', department: '総合学科', quota: 318, finalApplicants: 325, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '幸手桜', department: '総合学科', quota: 198, finalApplicants: 164, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '進修館', department: '総合学科', quota: 198, finalApplicants: 182, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '誠和福祉', department: '総合学科', quota: 79, finalApplicants: 32, finalRate: 0.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '滑川総合', department: '総合学科', quota: 278, finalApplicants: 292, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉川美南', department: '総合学科', quota: 119, finalApplicants: 120, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '寄居城北', department: '総合学科', quota: 198, finalApplicants: 165, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1横展開R6第1弾: 令和6年度(R6)版一次資料(documents/222625/r6nyuushikakuteisyasu.pdf・全9頁)
    // の1〜3頁目「全日制 普通科」102校を収録。頁末尾の「普通科 計」小計(A=26,007/B=30,146)と
    // 機械集計が完全一致。残り6頁(専門学科・総合学科等)は次回以降のセッションで継続する。
    { schoolName: '上尾', department: '普通科', quota: 238, finalApplicants: 279, finalRate: 1.17, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上尾鷹の台', department: '普通科', quota: 198, finalApplicants: 196, finalRate: 0.99, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上尾橘', department: '普通科', quota: 158, finalApplicants: 99, finalRate: 0.63, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上尾南', department: '普通科', quota: 238, finalApplicants: 253, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '朝霞', department: '普通科', quota: 318, finalApplicants: 358, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '朝霞西', department: '普通科', quota: 318, finalApplicants: 377, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊奈学園総合', department: '普通科（普通・スポーツ科学・芸術の合算）', quota: 721, finalApplicants: 849, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '入間向陽', department: '普通科', quota: 318, finalApplicants: 367, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '岩槻', department: '普通科', quota: 278, finalApplicants: 331, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浦和', department: '普通科', quota: 358, finalApplicants: 495, finalRate: 1.38, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浦和北', department: '普通科', quota: 318, finalApplicants: 373, finalRate: 1.17, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浦和第一女子', department: '普通科', quota: 358, finalApplicants: 490, finalRate: 1.37, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浦和西', department: '普通科', quota: 358, finalApplicants: 512, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浦和東', department: '普通科', quota: 318, finalApplicants: 374, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮', department: '普通科', quota: 318, finalApplicants: 448, finalRate: 1.41, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮光陵', department: '普通科', quota: 198, finalApplicants: 215, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮光陵', department: '外国語コース', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮東', department: '普通科', quota: 238, finalApplicants: 232, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮南', department: '普通科', quota: 358, finalApplicants: 396, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮武蔵野', department: '普通科', quota: 238, finalApplicants: 229, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小川', department: '普通科', quota: 198, finalApplicants: 206, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桶川', department: '普通科', quota: 278, finalApplicants: 283, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桶川西', department: '普通科', quota: 158, finalApplicants: 60, finalRate: 0.38, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越生', department: '普通科', quota: 79, finalApplicants: 58, finalRate: 0.73, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '春日部', department: '普通科', quota: 358, finalApplicants: 537, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '春日部女子', department: '普通科', quota: 238, finalApplicants: 288, finalRate: 1.21, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '春日部東', department: '普通科', quota: 318, finalApplicants: 347, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口', department: '普通科', quota: 318, finalApplicants: 425, finalRate: 1.34, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口北', department: '普通科', quota: 358, finalApplicants: 528, finalRate: 1.47, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口青陵', department: '普通科', quota: 278, finalApplicants: 282, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口東', department: '普通科', quota: 278, finalApplicants: 309, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越', department: '普通科', quota: 358, finalApplicants: 526, finalRate: 1.47, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越女子', department: '普通科', quota: 358, finalApplicants: 466, finalRate: 1.3, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越西', department: '普通科', quota: 318, finalApplicants: 324, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越初雁', department: '普通科', quota: 198, finalApplicants: 171, finalRate: 0.86, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越南', department: '普通科', quota: 358, finalApplicants: 496, finalRate: 1.39, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '北本', department: '普通科', quota: 158, finalApplicants: 127, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '久喜', department: '普通科', quota: 278, finalApplicants: 289, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷', department: '普通科', quota: 318, finalApplicants: 353, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷女子', department: '普通科', quota: 318, finalApplicants: 314, finalRate: 0.99, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷西', department: '普通科', quota: 278, finalApplicants: 326, finalRate: 1.17, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '栗橋北彩', department: '普通科', quota: 198, finalApplicants: 159, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鴻巣', department: '普通科', quota: 198, finalApplicants: 214, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鴻巣女子', department: '普通科', quota: 79, finalApplicants: 73, finalRate: 0.92, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越ケ谷', department: '普通科', quota: 318, finalApplicants: 442, finalRate: 1.39, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷北', department: '普通科', quota: 318, finalApplicants: 368, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷西', department: '普通科', quota: 318, finalApplicants: 306, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷東', department: '普通科', quota: 318, finalApplicants: 345, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷南', department: '普通科', quota: 318, finalApplicants: 453, finalRate: 1.42, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '児玉', department: '普通科', quota: 79, finalApplicants: 71, finalRate: 0.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂戸', department: '普通科', quota: 318, finalApplicants: 377, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂戸西', department: '普通科', quota: 318, finalApplicants: 360, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '狭山清陵', department: '普通科', quota: 198, finalApplicants: 202, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '志木', department: '普通科', quota: 238, finalApplicants: 300, finalRate: 1.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '庄和', department: '普通科', quota: 158, finalApplicants: 184, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '白岡', department: '普通科', quota: 158, finalApplicants: 165, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉戸', department: '普通科', quota: 278, finalApplicants: 333, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '草加', department: '普通科', quota: 358, finalApplicants: 374, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '草加西', department: '普通科', quota: 238, finalApplicants: 234, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '草加東', department: '普通科', quota: 318, finalApplicants: 361, finalRate: 1.14, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '草加南', department: '普通科', quota: 238, finalApplicants: 257, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秩父', department: '普通科', quota: 198, finalApplicants: 190, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鶴ケ島清風', department: '普通科', quota: 238, finalApplicants: 190, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '所沢', department: '普通科', quota: 358, finalApplicants: 513, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '所沢北', department: '普通科', quota: 318, finalApplicants: 354, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '所沢中央', department: '普通科', quota: 318, finalApplicants: 345, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '所沢西', department: '普通科', quota: 318, finalApplicants: 399, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '豊岡', department: '普通科', quota: 318, finalApplicants: 411, finalRate: 1.29, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '南稜', department: '普通科', quota: 318, finalApplicants: 420, finalRate: 1.32, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新座', department: '普通科', quota: 198, finalApplicants: 194, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新座柳瀬', department: '普通科', quota: 198, finalApplicants: 227, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '蓮田松韻', department: '普通科', quota: 198, finalApplicants: 152, finalRate: 0.77, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳩ケ谷', department: '普通科', quota: 158, finalApplicants: 184, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '羽生第一', department: '普通科', quota: 159, finalApplicants: 148, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '飯能', department: '普通科', quota: 278, finalApplicants: 280, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '日高', department: '普通科', quota: 118, finalApplicants: 110, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '日高', department: '情報コース', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深谷', department: '普通科', quota: 198, finalApplicants: 195, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深谷第一', department: '普通科', quota: 278, finalApplicants: 278, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '富士見', department: '普通科', quota: 198, finalApplicants: 210, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: 'ふじみ野', department: '普通科', quota: 158, finalApplicants: 158, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '不動岡', department: '普通科', quota: 358, finalApplicants: 477, finalRate: 1.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '本庄', department: '普通科', quota: 318, finalApplicants: 354, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松伏', department: '普通科', quota: 118, finalApplicants: 125, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松伏', department: '情報ビジネスコース', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松山', department: '普通科', quota: 278, finalApplicants: 284, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松山女子', department: '普通科', quota: 318, finalApplicants: 331, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三郷', department: '普通科', quota: 198, finalApplicants: 204, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三郷北', department: '普通科', quota: 238, finalApplicants: 253, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '宮代', department: '普通科', quota: 198, finalApplicants: 192, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '妻沼', department: '普通科', quota: 119, finalApplicants: 121, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八潮南', department: '普通科', quota: 79, finalApplicants: 82, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '与野', department: '普通科', quota: 358, finalApplicants: 452, finalRate: 1.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '和光国際', department: '普通科', quota: 238, finalApplicants: 348, finalRate: 1.46, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鷲宮', department: '普通科', quota: 278, finalApplicants: 293, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '蕨', department: '普通科', quota: 318, finalApplicants: 477, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市立川越', department: '普通科', quota: 140, finalApplicants: 208, finalRate: 1.49, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市立浦和', department: '普通科', quota: 240, finalApplicants: 421, finalRate: 1.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市立浦和南', department: '普通科', quota: 320, finalApplicants: 415, finalRate: 1.3, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市立大宮北', department: '普通科', quota: 280, finalApplicants: 388, finalRate: 1.39, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口市立', department: '普通科', quota: 284, finalApplicants: 358, finalRate: 1.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口市立', department: 'スポーツ科学コース', quota: 80, finalApplicants: 131, finalRate: 1.64, fiscalYear: '令和6年度（2024年度）' },
    // 掛-1横展開R6第2弾: 4〜8頁目「専門学科」129レコードを追加。頁末尾の印字済み「農業科計」
    // (795/753)・「工業科計」(2,382/2,124)・「商業科計」(2,285/2,406)・家庭/看護/外国語/美術/
    // 音楽/書道/体育の各小計・理数/福祉/人文/国際文化/映像芸術/舞台芸術/生物環境の各小計、
    // および専門学科の総計「専門学科 計」(7,378/7,515)全てが機械集計と完全一致。
    { schoolName: '熊谷農業', department: '食品科学科', quota: 40, finalApplicants: 34, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷農業', department: '生物生産工学科', quota: 79, finalApplicants: 80, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷農業', department: '生活技術科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷農業', department: '生物生産技術科', quota: 80, finalApplicants: 81, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '児玉', department: '生物資源科', quota: 39, finalApplicants: 36, finalRate: 0.92, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '児玉', department: '環境デザイン科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉戸農業', department: '生物生産技術科', quota: 40, finalApplicants: 47, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉戸農業', department: '園芸科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉戸農業', department: '造園科', quota: 39, finalApplicants: 36, finalRate: 0.92, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉戸農業', department: '食品流通科', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉戸農業', department: '生活技術科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉戸農業', department: '生物生産工学科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秩父農工科学', department: '農業科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秩父農工科学', department: '食品化学科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秩父農工科学', department: '森林科学科', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳩ケ谷', department: '園芸デザイン科', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '羽生実業', department: '園芸科', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '羽生実業', department: '農業経済科', quota: 39, finalApplicants: 33, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮工業', department: '機械科', quota: 80, finalApplicants: 71, finalRate: 0.89, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮工業', department: '電気科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮工業', department: '建築科', quota: 79, finalApplicants: 74, finalRate: 0.94, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮工業', department: '電子機械科', quota: 79, finalApplicants: 68, finalRate: 0.86, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '春日部工業', department: '機械科', quota: 79, finalApplicants: 72, finalRate: 0.91, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '春日部工業', department: '建築科', quota: 80, finalApplicants: 87, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '春日部工業', department: '電気科', quota: 79, finalApplicants: 52, finalRate: 0.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口工業', department: '機械科', quota: 80, finalApplicants: 89, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口工業', department: '電気科', quota: 79, finalApplicants: 88, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口工業', department: '情報通信科', quota: 79, finalApplicants: 87, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越工業', department: 'デザイン科', quota: 40, finalApplicants: 49, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越工業', department: '建築科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越工業', department: '機械科', quota: 79, finalApplicants: 61, finalRate: 0.77, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越工業', department: '電気科', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越工業', department: '化学科', quota: 79, finalApplicants: 69, finalRate: 0.87, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '久喜工業', department: '電気科', quota: 39, finalApplicants: 29, finalRate: 0.74, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '久喜工業', department: '工業化学科', quota: 40, finalApplicants: 25, finalRate: 0.63, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '久喜工業', department: '機械科', quota: 80, finalApplicants: 73, finalRate: 0.91, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '久喜工業', department: '環境科学科', quota: 40, finalApplicants: 15, finalRate: 0.38, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '久喜工業', department: '情報技術科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷工業', department: '電気科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷工業', department: '建築科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷工業', department: '土木科', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷工業', department: '機械科', quota: 79, finalApplicants: 61, finalRate: 0.77, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷工業', department: '情報技術科', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷総合技術', department: '電子機械科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷総合技術', department: '情報技術科', quota: 40, finalApplicants: 47, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '児玉', department: '機械科', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '児玉', department: '電子機械科', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '狭山工業', department: '機械科', quota: 80, finalApplicants: 59, finalRate: 0.74, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '狭山工業', department: '電気科', quota: 39, finalApplicants: 30, finalRate: 0.77, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '狭山工業', department: '電子機械科', quota: 79, finalApplicants: 47, finalRate: 0.59, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '進修館', department: '電気システム科', quota: 39, finalApplicants: 25, finalRate: 0.64, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '進修館', department: '情報メディア科', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '進修館', department: 'ものづくり科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秩父農工科学', department: '電気システム科', quota: 39, finalApplicants: 36, finalRate: 0.92, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秩父農工科学', department: '機械システム科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新座総合技術', department: '電子機械科', quota: 39, finalApplicants: 43, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新座総合技術', department: '情報技術科', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新座総合技術', department: 'デザイン科', quota: 40, finalApplicants: 57, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三郷工業技術', department: '機械科', quota: 39, finalApplicants: 25, finalRate: 0.64, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三郷工業技術', department: '電子機械科', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三郷工業技術', department: '電気科', quota: 39, finalApplicants: 34, finalRate: 0.87, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三郷工業技術', department: '情報技術科', quota: 40, finalApplicants: 27, finalRate: 0.68, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三郷工業技術', department: '情報電子科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上尾', department: '商業科', quota: 120, finalApplicants: 173, finalRate: 1.44, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '岩槻商業', department: '商業科', quota: 79, finalApplicants: 53, finalRate: 0.67, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '岩槻商業', department: '情報処理科', quota: 80, finalApplicants: 69, finalRate: 0.86, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浦和商業', department: '商業科', quota: 198, finalApplicants: 224, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '浦和商業', department: '情報処理科', quota: 80, finalApplicants: 99, finalRate: 1.24, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮商業', department: '商業科', quota: 198, finalApplicants: 202, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷商業', department: '総合ビジネス科', quota: 198, finalApplicants: 162, finalRate: 0.82, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鴻巣', department: '商業科', quota: 80, finalApplicants: 74, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷総合技術', department: '流通経済科', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷総合技術', department: '情報処理科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '狭山経済', department: '流通経済科', quota: 79, finalApplicants: 77, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '狭山経済', department: '会計科', quota: 40, finalApplicants: 27, finalRate: 0.68, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '狭山経済', department: '情報処理科', quota: 80, finalApplicants: 93, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '所沢商業', department: '情報処理科', quota: 79, finalApplicants: 83, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '所沢商業', department: '国際流通科', quota: 79, finalApplicants: 76, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '所沢商業', department: 'ビジネス会計科', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新座総合技術', department: '総合ビジネス科', quota: 39, finalApplicants: 43, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鳩ケ谷', department: '情報処理科', quota: 80, finalApplicants: 100, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '羽生実業', department: '商業科', quota: 39, finalApplicants: 13, finalRate: 0.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '羽生実業', department: '情報処理科', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深谷商業', department: '商業科', quota: 158, finalApplicants: 187, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深谷商業', department: '会計科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深谷商業', department: '情報処理科', quota: 80, finalApplicants: 78, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八潮南', department: '商業科', quota: 79, finalApplicants: 88, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八潮南', department: '情報処理科', quota: 80, finalApplicants: 83, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市立川越', department: '国際経済科', quota: 70, finalApplicants: 116, finalRate: 1.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市立川越', department: '情報処理科', quota: 70, finalApplicants: 102, finalRate: 1.46, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鴻巣女子', department: '保育科', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鴻巣女子', department: '家政科学科', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷総合技術', department: '服飾デザイン科', quota: 39, finalApplicants: 32, finalRate: 0.82, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷総合技術', department: '食物調理科', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秩父農工科学', department: 'ライフデザイン科', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秩父農工科学', department: 'フードデザイン科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新座総合技術', department: '服飾デザイン科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新座総合技術', department: '食物調理科', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '常盤', department: '看護科', quota: 80, finalApplicants: 91, finalRate: 1.14, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '春日部女子', department: '外国語科', quota: 40, finalApplicants: 58, finalRate: 1.45, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷', department: '外国語科', quota: 40, finalApplicants: 57, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '坂戸', department: '外国語科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '草加南', department: '外国語科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '南稜', department: '外国語科', quota: 40, finalApplicants: 60, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '和光国際', department: '外国語科', quota: 79, finalApplicants: 117, finalRate: 1.48, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '蕨', department: '外国語科', quota: 40, finalApplicants: 56, finalRate: 1.4, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮光陵', department: '美術科', quota: 40, finalApplicants: 66, finalRate: 1.65, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越生', department: '美術科', quota: 40, finalApplicants: 47, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '芸術総合', department: '美術科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮光陵', department: '音楽科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '芸術総合', department: '音楽科', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松伏', department: '音楽科', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮光陵', department: '書道科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮東', department: '体育科', quota: 80, finalApplicants: 84, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: 'ふじみ野', department: 'スポーツサイエンス科', quota: 80, finalApplicants: 74, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大宮', department: '理数科', quota: 40, finalApplicants: 99, finalRate: 2.48, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '熊谷西', department: '理数科', quota: 40, finalApplicants: 57, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '越谷北', department: '理数科', quota: 40, finalApplicants: 61, finalRate: 1.53, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '所沢北', department: '理数科', quota: 40, finalApplicants: 54, finalRate: 1.35, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松山', department: '理数科', quota: 40, finalApplicants: 63, finalRate: 1.58, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市立大宮北', department: '理数科', quota: 40, finalApplicants: 79, finalRate: 1.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川口市立', department: '理数科', quota: 40, finalApplicants: 66, finalRate: 1.65, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '誠和福祉', department: '福祉科', quota: 80, finalApplicants: 34, finalRate: 0.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '春日部東', department: '人文科', quota: 40, finalApplicants: 47, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '岩槻', department: '国際文化科', quota: 40, finalApplicants: 60, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '芸術総合', department: '映像芸術科', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '芸術総合', department: '舞台芸術科', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: 'いずみ', department: '生物系', quota: 119, finalApplicants: 132, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: 'いずみ', department: '環境系', quota: 119, finalApplicants: 127, finalRate: 1.07, fiscalYear: '令和6年度（2024年度）' },
    // 掛-1横展開R6第3弾: 9頁目「総合学科」9レコードを追加・全日制が完結。「総合学科計」(1,745/1,753)、
    // および全日制の総計「全日制 普通・専門・総合学科 計」(35,130/39,414)と機械集計が完全一致
    // （報道発表資料の「入学志願確定者数39,414人」とも一致）。これでsaitamaのR6学校別データ収集は
    // 完了（240レコード＝R7と同一件数で学校再編なし）。定時制は既存のtokyo/kanagawa/chibaと
    // 同じ理由でスコープ外。
    { schoolName: '小鹿野', department: '総合学科', quota: 119, finalApplicants: 44, finalRate: 0.37, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川越総合', department: '総合学科', quota: 238, finalApplicants: 311, finalRate: 1.31, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '久喜北陽', department: '総合学科', quota: 318, finalApplicants: 342, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '幸手桜', department: '総合学科', quota: 198, finalApplicants: 184, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '進修館', department: '総合学科', quota: 198, finalApplicants: 193, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '誠和福祉', department: '総合学科', quota: 79, finalApplicants: 46, finalRate: 0.58, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '滑川総合', department: '総合学科', quota: 278, finalApplicants: 297, finalRate: 1.07, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '吉川美南', department: '総合学科', quota: 119, finalApplicants: 142, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '寄居城北', department: '総合学科', quota: 198, finalApplicants: 194, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },

    // ===== 掛-1(学校別×多年度)横展開: R5分・1〜3頁目「全日制 普通科」107レコード（頁末尾「普通科 計」26,562/30,879/1.16と完全一致） =====
    { schoolName: '上尾', department: '普通科', quota: 238, finalApplicants: 288, finalRate: 1.21, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '上尾鷹の台', department: '普通科', quota: 198, finalApplicants: 207, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '上尾橘', department: '普通科', quota: 159, finalApplicants: 96, finalRate: 0.6, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '上尾南', department: '普通科', quota: 238, finalApplicants: 256, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '朝霞', department: '普通科', quota: 318, finalApplicants: 348, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '朝霞西', department: '普通科', quota: 358, finalApplicants: 386, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊奈学園総合', department: '普通科（普通・スポーツ科学・芸術の合算）', quota: 717, finalApplicants: 887, finalRate: 1.24, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '入間向陽', department: '普通科', quota: 318, finalApplicants: 344, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '岩槻', department: '普通科', quota: 278, finalApplicants: 337, finalRate: 1.21, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '岩槻北陵', department: '普通科', quota: 159, finalApplicants: 136, finalRate: 0.86, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和', department: '普通科', quota: 358, finalApplicants: 555, finalRate: 1.55, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和北', department: '普通科', quota: 318, finalApplicants: 448, finalRate: 1.41, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和第一女子', department: '普通科', quota: 358, finalApplicants: 482, finalRate: 1.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和西', department: '普通科', quota: 358, finalApplicants: 520, finalRate: 1.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和東', department: '普通科', quota: 318, finalApplicants: 389, finalRate: 1.22, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮', department: '普通科', quota: 318, finalApplicants: 458, finalRate: 1.44, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮光陵', department: '普通科', quota: 198, finalApplicants: 241, finalRate: 1.22, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮光陵', department: '外国語コース', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮東', department: '普通科', quota: 238, finalApplicants: 257, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮南', department: '普通科', quota: 358, finalApplicants: 425, finalRate: 1.19, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮武蔵野', department: '普通科', quota: 238, finalApplicants: 231, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小川', department: '普通科', quota: 198, finalApplicants: 186, finalRate: 0.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桶川', department: '普通科', quota: 278, finalApplicants: 290, finalRate: 1.04, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桶川西', department: '普通科', quota: 159, finalApplicants: 132, finalRate: 0.83, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越生', department: '普通科', quota: 79, finalApplicants: 44, finalRate: 0.56, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '春日部', department: '普通科', quota: 358, finalApplicants: 468, finalRate: 1.31, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '春日部女子', department: '普通科', quota: 238, finalApplicants: 269, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '春日部東', department: '普通科', quota: 318, finalApplicants: 337, finalRate: 1.06, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口', department: '普通科', quota: 318, finalApplicants: 374, finalRate: 1.18, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口北', department: '普通科', quota: 358, finalApplicants: 459, finalRate: 1.28, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口青陵', department: '普通科', quota: 278, finalApplicants: 301, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口東', department: '普通科', quota: 278, finalApplicants: 317, finalRate: 1.14, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越', department: '普通科', quota: 358, finalApplicants: 502, finalRate: 1.4, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越女子', department: '普通科', quota: 358, finalApplicants: 487, finalRate: 1.36, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越西', department: '普通科', quota: 318, finalApplicants: 349, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越初雁', department: '普通科', quota: 198, finalApplicants: 208, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越南', department: '普通科', quota: 358, finalApplicants: 505, finalRate: 1.41, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '北本', department: '普通科', quota: 159, finalApplicants: 136, finalRate: 0.86, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '久喜', department: '普通科', quota: 278, finalApplicants: 314, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷', department: '普通科', quota: 318, finalApplicants: 358, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷女子', department: '普通科', quota: 318, finalApplicants: 358, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷西', department: '普通科', quota: 278, finalApplicants: 306, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '栗橋北彩', department: '普通科', quota: 198, finalApplicants: 180, finalRate: 0.91, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鴻巣', department: '普通科', quota: 198, finalApplicants: 210, finalRate: 1.06, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鴻巣女子', department: '普通科', quota: 79, finalApplicants: 75, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越ケ谷', department: '普通科', quota: 318, finalApplicants: 456, finalRate: 1.43, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷北', department: '普通科', quota: 318, finalApplicants: 372, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷西', department: '普通科', quota: 318, finalApplicants: 347, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷東', department: '普通科', quota: 278, finalApplicants: 306, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷南', department: '普通科', quota: 318, finalApplicants: 460, finalRate: 1.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '児玉', department: '普通科', quota: 79, finalApplicants: 64, finalRate: 0.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '坂戸', department: '普通科', quota: 318, finalApplicants: 361, finalRate: 1.14, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '坂戸西', department: '普通科', quota: 318, finalApplicants: 327, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '狭山清陵', department: '普通科', quota: 198, finalApplicants: 219, finalRate: 1.11, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '志木', department: '普通科', quota: 238, finalApplicants: 245, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '庄和', department: '普通科', quota: 159, finalApplicants: 178, finalRate: 1.12, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '白岡', department: '普通科', quota: 159, finalApplicants: 146, finalRate: 0.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '杉戸', department: '普通科', quota: 278, finalApplicants: 284, finalRate: 1.02, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '草加', department: '普通科', quota: 358, finalApplicants: 370, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '草加西', department: '普通科', quota: 238, finalApplicants: 272, finalRate: 1.14, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '草加東', department: '普通科', quota: 318, finalApplicants: 368, finalRate: 1.16, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '草加南', department: '普通科', quota: 238, finalApplicants: 248, finalRate: 1.04, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秩父', department: '普通科', quota: 199, finalApplicants: 179, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鶴ケ島清風', department: '普通科', quota: 198, finalApplicants: 215, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '所沢', department: '普通科', quota: 358, finalApplicants: 480, finalRate: 1.34, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '所沢北', department: '普通科', quota: 318, finalApplicants: 417, finalRate: 1.31, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '所沢中央', department: '普通科', quota: 318, finalApplicants: 347, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '所沢西', department: '普通科', quota: 358, finalApplicants: 388, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '豊岡', department: '普通科', quota: 318, finalApplicants: 392, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '南稜', department: '普通科', quota: 318, finalApplicants: 405, finalRate: 1.27, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新座', department: '普通科', quota: 198, finalApplicants: 215, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新座柳瀬', department: '普通科', quota: 198, finalApplicants: 227, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '蓮田松韻', department: '普通科', quota: 198, finalApplicants: 122, finalRate: 0.62, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鳩ケ谷', department: '普通科', quota: 158, finalApplicants: 185, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鳩山', department: '普通科', quota: 119, finalApplicants: 62, finalRate: 0.52, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '羽生第一', department: '普通科', quota: 159, finalApplicants: 147, finalRate: 0.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '飯能', department: '普通科', quota: 278, finalApplicants: 282, finalRate: 1.01, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '日高', department: '普通科', quota: 119, finalApplicants: 128, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '日高', department: '情報コース', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '深谷', department: '普通科', quota: 198, finalApplicants: 208, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '深谷第一', department: '普通科', quota: 278, finalApplicants: 308, finalRate: 1.11, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '富士見', department: '普通科', quota: 198, finalApplicants: 197, finalRate: 0.99, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: 'ふじみ野', department: '普通科', quota: 118, finalApplicants: 121, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '不動岡', department: '普通科', quota: 358, finalApplicants: 467, finalRate: 1.3, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '本庄', department: '普通科', quota: 318, finalApplicants: 338, finalRate: 1.06, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松伏', department: '普通科', quota: 118, finalApplicants: 111, finalRate: 0.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松伏', department: '情報ビジネスコース', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松山', department: '普通科', quota: 278, finalApplicants: 268, finalRate: 0.96, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松山女子', department: '普通科', quota: 318, finalApplicants: 358, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三郷', department: '普通科', quota: 198, finalApplicants: 162, finalRate: 0.82, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三郷北', department: '普通科', quota: 238, finalApplicants: 240, finalRate: 1.01, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '宮代', department: '普通科', quota: 198, finalApplicants: 205, finalRate: 1.04, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '妻沼', department: '普通科', quota: 119, finalApplicants: 101, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八潮', department: '普通科', quota: 119, finalApplicants: 108, finalRate: 0.91, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八潮', department: '体育コース', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八潮南', department: '普通科', quota: 79, finalApplicants: 83, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '与野', department: '普通科', quota: 358, finalApplicants: 417, finalRate: 1.16, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '和光', department: '普通科', quota: 159, finalApplicants: 156, finalRate: 0.98, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '和光国際', department: '普通科', quota: 238, finalApplicants: 342, finalRate: 1.44, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鷲宮', department: '普通科', quota: 278, finalApplicants: 294, finalRate: 1.06, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '蕨', department: '普通科', quota: 318, finalApplicants: 425, finalRate: 1.34, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市立川越', department: '普通科', quota: 140, finalApplicants: 190, finalRate: 1.36, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市立浦和', department: '普通科', quota: 240, finalApplicants: 528, finalRate: 2.2, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市立浦和南', department: '普通科', quota: 320, finalApplicants: 466, finalRate: 1.46, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市立大宮北', department: '普通科', quota: 280, finalApplicants: 307, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口市立', department: '普通科', quota: 280, finalApplicants: 542, finalRate: 1.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口市立', department: 'スポーツ科学コース', quota: 80, finalApplicants: 124, finalRate: 1.55, fiscalYear: '令和5年度（2023年度）' },

    // ===== 4頁目「全日制 専門学科・農業に関する学科」18レコード（頁末尾「農業科計」795/725/0.91と完全一致） =====
    { schoolName: '熊谷農業', department: '食品科学科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷農業', department: '生物生産工学科', quota: 79, finalApplicants: 80, finalRate: 1.01, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷農業', department: '生活技術科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷農業', department: '生物生産技術科', quota: 80, finalApplicants: 69, finalRate: 0.86, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '児玉', department: '生物資源科', quota: 39, finalApplicants: 39, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '児玉', department: '環境デザイン科', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '杉戸農業', department: '生物生産技術科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '杉戸農業', department: '園芸科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '杉戸農業', department: '造園科', quota: 39, finalApplicants: 28, finalRate: 0.72, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '杉戸農業', department: '食品流通科', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '杉戸農業', department: '生活技術科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '杉戸農業', department: '生物生産工学科', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秩父農工科学', department: '農業科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秩父農工科学', department: '食品化学科', quota: 39, finalApplicants: 36, finalRate: 0.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秩父農工科学', department: '森林科学科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鳩ケ谷', department: '園芸デザイン科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '羽生実業', department: '園芸科', quota: 40, finalApplicants: 14, finalRate: 0.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '羽生実業', department: '農業経済科', quota: 39, finalApplicants: 38, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },

    // ===== 5頁目「全日制 専門学科・工業に関する学科」49レコード（頁末尾「工業科計」2,580/2,253/0.87と完全一致） =====
    // ⚠️「浦和工業」はR6以降のデータに対応する学校が見当たらない(統廃合の可能性)。R5時点の実在記録としてそのまま収録。
    { schoolName: '浦和工業', department: '電気科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和工業', department: '機械科', quota: 79, finalApplicants: 57, finalRate: 0.72, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和工業', department: '設備システム科', quota: 40, finalApplicants: 17, finalRate: 0.43, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和工業', department: '情報技術科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮工業', department: '機械科', quota: 80, finalApplicants: 69, finalRate: 0.86, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮工業', department: '電気科', quota: 40, finalApplicants: 34, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮工業', department: '建築科', quota: 79, finalApplicants: 62, finalRate: 0.78, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮工業', department: '電子機械科', quota: 79, finalApplicants: 66, finalRate: 0.84, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '春日部工業', department: '機械科', quota: 79, finalApplicants: 70, finalRate: 0.89, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '春日部工業', department: '建築科', quota: 80, finalApplicants: 68, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '春日部工業', department: '電気科', quota: 79, finalApplicants: 56, finalRate: 0.71, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口工業', department: '機械科', quota: 80, finalApplicants: 77, finalRate: 0.96, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口工業', department: '電気科', quota: 79, finalApplicants: 74, finalRate: 0.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口工業', department: '情報通信科', quota: 79, finalApplicants: 88, finalRate: 1.11, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越工業', department: 'デザイン科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越工業', department: '建築科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越工業', department: '機械科', quota: 79, finalApplicants: 76, finalRate: 0.96, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越工業', department: '電気科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越工業', department: '化学科', quota: 79, finalApplicants: 70, finalRate: 0.89, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '久喜工業', department: '電気科', quota: 39, finalApplicants: 26, finalRate: 0.67, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '久喜工業', department: '工業化学科', quota: 40, finalApplicants: 25, finalRate: 0.63, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '久喜工業', department: '機械科', quota: 80, finalApplicants: 67, finalRate: 0.84, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '久喜工業', department: '環境科学科', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '久喜工業', department: '情報技術科', quota: 40, finalApplicants: 52, finalRate: 1.3, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷工業', department: '電気科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷工業', department: '建築科', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷工業', department: '土木科', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷工業', department: '機械科', quota: 79, finalApplicants: 64, finalRate: 0.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷工業', department: '情報技術科', quota: 40, finalApplicants: 58, finalRate: 1.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷総合技術', department: '電子機械科', quota: 39, finalApplicants: 33, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷総合技術', department: '情報技術科', quota: 40, finalApplicants: 51, finalRate: 1.28, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '児玉', department: '機械科', quota: 40, finalApplicants: 28, finalRate: 0.7, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '児玉', department: '電子機械科', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '狭山工業', department: '機械科', quota: 80, finalApplicants: 70, finalRate: 0.88, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '狭山工業', department: '電気科', quota: 39, finalApplicants: 17, finalRate: 0.44, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '狭山工業', department: '電子機械科', quota: 79, finalApplicants: 64, finalRate: 0.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '進修館', department: '電気システム科', quota: 39, finalApplicants: 18, finalRate: 0.46, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '進修館', department: '情報メディア科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '進修館', department: 'ものづくり科', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秩父農工科学', department: '電気システム科', quota: 39, finalApplicants: 35, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秩父農工科学', department: '機械システム科', quota: 40, finalApplicants: 25, finalRate: 0.63, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新座総合技術', department: '電子機械科', quota: 39, finalApplicants: 38, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新座総合技術', department: '情報技術科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新座総合技術', department: 'デザイン科', quota: 40, finalApplicants: 63, finalRate: 1.58, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三郷工業技術', department: '機械科', quota: 39, finalApplicants: 34, finalRate: 0.87, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三郷工業技術', department: '電子機械科', quota: 40, finalApplicants: 26, finalRate: 0.65, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三郷工業技術', department: '電気科', quota: 39, finalApplicants: 27, finalRate: 0.69, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三郷工業技術', department: '情報技術科', quota: 40, finalApplicants: 53, finalRate: 1.33, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三郷工業技術', department: '情報電子科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },

    // ===== 6頁目「全日制 専門学科・商業に関する学科」29レコード（頁末尾「商業科計」2,404/2,191/0.91と完全一致） =====
    // ⚠️「鳩山」「皆野」はR6以降のデータに対応する学校が見当たらない(鳩山は越生と統合し令和8年度に越生翔桜として新設。皆野も統廃合の可能性)。R5時点の実在記録としてそのまま収録。
    { schoolName: '上尾', department: '商業科', quota: 120, finalApplicants: 151, finalRate: 1.26, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '岩槻商業', department: '商業科', quota: 79, finalApplicants: 37, finalRate: 0.47, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '岩槻商業', department: '情報処理科', quota: 80, finalApplicants: 65, finalRate: 0.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和商業', department: '商業科', quota: 198, finalApplicants: 188, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '浦和商業', department: '情報処理科', quota: 80, finalApplicants: 91, finalRate: 1.14, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮商業', department: '商業科', quota: 198, finalApplicants: 172, finalRate: 0.87, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷商業', department: '総合ビジネス科', quota: 198, finalApplicants: 201, finalRate: 1.02, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鴻巣', department: '商業科', quota: 80, finalApplicants: 84, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷総合技術', department: '流通経済科', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷総合技術', department: '情報処理科', quota: 40, finalApplicants: 34, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '狭山経済', department: '流通経済科', quota: 79, finalApplicants: 56, finalRate: 0.71, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '狭山経済', department: '会計科', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '狭山経済', department: '情報処理科', quota: 80, finalApplicants: 75, finalRate: 0.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '所沢商業', department: '情報処理科', quota: 79, finalApplicants: 98, finalRate: 1.24, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '所沢商業', department: '国際流通科', quota: 79, finalApplicants: 55, finalRate: 0.7, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '所沢商業', department: 'ビジネス会計科', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新座総合技術', department: '総合ビジネス科', quota: 39, finalApplicants: 45, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鳩ケ谷', department: '情報処理科', quota: 80, finalApplicants: 86, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鳩山', department: '情報管理科', quota: 40, finalApplicants: 25, finalRate: 0.63, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '羽生実業', department: '商業科', quota: 39, finalApplicants: 8, finalRate: 0.21, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '羽生実業', department: '情報処理科', quota: 40, finalApplicants: 27, finalRate: 0.68, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '深谷商業', department: '商業科', quota: 158, finalApplicants: 157, finalRate: 0.99, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '深谷商業', department: '会計科', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '深谷商業', department: '情報処理科', quota: 80, finalApplicants: 84, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '皆野', department: '商業系', quota: 79, finalApplicants: 29, finalRate: 0.37, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八潮南', department: '商業科', quota: 79, finalApplicants: 56, finalRate: 0.71, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八潮南', department: '情報処理科', quota: 80, finalApplicants: 86, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市立川越', department: '国際経済科', quota: 70, finalApplicants: 73, finalRate: 1.04, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市立川越', department: '情報処理科', quota: 70, finalApplicants: 81, finalRate: 1.16, fiscalYear: '令和5年度（2023年度）' },

    // ===== 7頁目「全日制 専門学科・家庭/看護/外国語/美術/音楽/書道/体育に関する学科」計25レコード（各学科の頁内小計と完全一致） =====
    { schoolName: '鴻巣女子', department: '保育科', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鴻巣女子', department: '家政科学科', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷総合技術', department: '服飾デザイン科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷総合技術', department: '食物調理科', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秩父農工科学', department: 'ライフデザイン科', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秩父農工科学', department: 'フードデザイン科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新座総合技術', department: '服飾デザイン科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新座総合技術', department: '食物調理科', quota: 40, finalApplicants: 47, finalRate: 1.18, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '常盤', department: '看護科', quota: 80, finalApplicants: 82, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '春日部女子', department: '外国語科', quota: 40, finalApplicants: 51, finalRate: 1.28, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷南', department: '外国語科', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '坂戸', department: '外国語科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '草加南', department: '外国語科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '南稜', department: '外国語科', quota: 40, finalApplicants: 51, finalRate: 1.28, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '和光国際', department: '外国語科', quota: 79, finalApplicants: 92, finalRate: 1.16, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '蕨', department: '外国語科', quota: 40, finalApplicants: 54, finalRate: 1.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮光陵', department: '美術科', quota: 40, finalApplicants: 71, finalRate: 1.78, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越生', department: '美術科', quota: 40, finalApplicants: 29, finalRate: 0.73, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '芸術総合', department: '美術科', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮光陵', department: '音楽科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '芸術総合', department: '音楽科', quota: 40, finalApplicants: 14, finalRate: 0.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松伏', department: '音楽科', quota: 40, finalApplicants: 13, finalRate: 0.33, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮光陵', department: '書道科', quota: 40, finalApplicants: 34, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大宮東', department: '体育科', quota: 80, finalApplicants: 89, finalRate: 1.11, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: 'ふじみ野', department: 'スポーツサイエンス科', quota: 80, finalApplicants: 80, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },

    // ===== 8頁目「全日制 専門学科・理数/福祉/人文/国際文化/映像芸術/舞台芸術/生物環境に関する学科」計14レコード（各学科の頁内小計と完全一致・専門学科(4〜8頁)完結） =====
    // ⚠️「国際文化に関する学科」はR5時点では岩槻の1校のみ(R6以降「国際関係に関する学科」に改称・拡大し岩槻+秩父+和光国際の3校体制になる)。R5時点の実在区分名・実在校数のままそのまま収録。
    { schoolName: '大宮', department: '理数科', quota: 40, finalApplicants: 106, finalRate: 2.65, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '熊谷西', department: '理数科', quota: 40, finalApplicants: 49, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '越谷北', department: '理数科', quota: 40, finalApplicants: 79, finalRate: 1.98, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '所沢北', department: '理数科', quota: 40, finalApplicants: 62, finalRate: 1.55, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松山', department: '理数科', quota: 40, finalApplicants: 62, finalRate: 1.55, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市立大宮北', department: '理数科', quota: 40, finalApplicants: 72, finalRate: 1.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川口市立', department: '理数科', quota: 40, finalApplicants: 82, finalRate: 2.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '誠和福祉', department: '福祉科', quota: 80, finalApplicants: 42, finalRate: 0.53, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '春日部東', department: '人文科', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '岩槻', department: '国際文化科', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '芸術総合', department: '映像芸術科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '芸術総合', department: '舞台芸術科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: 'いずみ', department: '生物系', quota: 119, finalApplicants: 148, finalRate: 1.24, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: 'いずみ', department: '環境系', quota: 119, finalApplicants: 151, finalRate: 1.27, fiscalYear: '令和5年度（2023年度）' },

    // ===== 9頁目「全日制 総合学科」9レコード（頁末尾「総合学科計」1,745/1,657/0.95と完全一致・全日制(1〜9頁)が完結） =====
    { schoolName: '小鹿野', department: '総合学科', quota: 119, finalApplicants: 44, finalRate: 0.37, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川越総合', department: '総合学科', quota: 238, finalApplicants: 247, finalRate: 1.04, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '久喜北陽', department: '総合学科', quota: 318, finalApplicants: 315, finalRate: 0.99, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '幸手桜', department: '総合学科', quota: 198, finalApplicants: 208, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '進修館', department: '総合学科', quota: 198, finalApplicants: 191, finalRate: 0.96, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '誠和福祉', department: '総合学科', quota: 79, finalApplicants: 56, finalRate: 0.71, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '滑川総合', department: '総合学科', quota: 278, finalApplicants: 282, finalRate: 1.01, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '吉川美南', department: '総合学科', quota: 119, finalApplicants: 115, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '寄居城北', department: '総合学科', quota: 198, finalApplicants: 199, finalRate: 1.01, fiscalYear: '令和5年度（2023年度）' },
  ],
};
