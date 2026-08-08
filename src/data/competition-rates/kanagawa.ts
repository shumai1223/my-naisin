/**
 * 神奈川県 公立高等学校 倍率パイプラインα（Y-2・先行8県の2県目）。
 *
 * 一次ソース: 神奈川県教育委員会「令和8年度神奈川県公立高等学校入学者選抜一般募集共通選抜等
 * 志願変更締切時志願状況」（別紙3・全13ページ）。
 * https://www.pref.kanagawa.jp/docs/dc4/prs/koko/r5617851.html （公表日: 2026-02-09）
 * https://www.pref.kanagawa.jp/documents/131973/bessi3.pdf
 *
 * 東京都と異なり、この資料は「1月30日（志願締切時・当初）」と「2月9日（志願変更締切時・
 * 最終）」の2段階の志願者数を併記する。本ファイルは常に2月9日（最終）列を採用する
 * （東京都の「最終応募状況」を採るのと同じ設計方針）。募集定員は志願変更で変わらない。
 *
 * ✅対象範囲=別紙3の「1 一般募集共通選抜志願変更締切時志願状況（全日制の課程）」＋
 * 「2 連携募集志願変更締切時志願状況」（連携募集は既存校への追加募集枠のため合算）。
 * 「3 一般募集共通選抜志願変更締切時志願状況（定時制の課程及び通信制の課程）」と
 * 「4 特別募集及び中途退学者募集」（海外帰国生徒特別募集・在県外国人等特別募集）は
 * 東京都の定時制/チャレンジスクール/在京外国人選抜と同じ理由でスコープ外（対象外として
 * 明示的に除外・全日制の外側の別集計）。
 *
 * 学校×学科は東京都と同じく「学校の学科別『計』行」単位で集計する（機械科/電気科等の
 * さらに細かいコース単位までは分解しない）。
 *
 * 転記の正しさは二重に検証済み: ①本ファイルの全レコード合計が quota=39,431 /
 * finalApplicants=43,821 に一致することを__tests__で機械確認 ②この39,431/43,821という
 * 数値自体は、県教育委員会の公表資料（別紙1「集計結果の概要」）を報じた複数の報道
 * （リセマム等）が伝える「一般募集共通選抜（志願変更締切時）全体の募集定員39,431人・
 * 志願者数43,821人・倍率1.11倍」と一致する（WebSearch実測で確認・2026-07-24）。
 *
 * **2026-08-07追記(掛-1・学校別×多年度・kanagawa横展開第1弾)**: R7(令和7年度)版の別紙3が
 * xlsx形式でも公開されている(pdfと同じページ・documents/118051/bessi3.xlsx)ことを発見し、
 * osakaで確立したunzip+自前XMLパース手法で直読みした。R8とは列レイアウトが異なり
 * （E列=募集定員(A)・F列=1月30日志願者数(B)・I列=2月7日最終志願者数(C)・K列=最終競争率(C/A)）、
 * 学校名には「県立」接頭辞が付く（R8のtsでは既に除去済みの命名規則と統一するためstrip）。
 * 今回は「普通科（クリエイティブスクールを除く）」の県立87校のみを収録し、印字済み
 * 「県立計」小計(25,798/31,262)と完全一致を確認(node.js機械計算)。市立普通科・
 * クリエイティブスクール・専門学科(sheet2)・単位制(sheet3)は次回以降のセッションで横展開する。
 *
 * **2026-08-07追記(掛-1第2弾)**: sheet1の残り区分「市立普通科6校」「普通科クリエイティブ
 * スクール5校」を追加。市立は横浜市立3校(桜丘/南/金沢)+川崎市立3校(橘/高津/幸)で、印字済み
 * 「市立計」1,268/1,667と完全一致（R8では横浜市立南が非掲載＝6→5校に統合された可能性）。
 * クリエイティブスクールは5校(田奈/釜利谷/横須賀南/大井/大和東)で印字済み「合計」832/732と
 * 完全一致。WebSearchで実在校を裏取りしたところ、田奈は令和8年度に麻生総合と統合し「青葉総合」
 * へ、大井は小田原城北工業と統合し「小田原北」へ改編されることが判明（R8のクリエイティブ
 * スクール一覧が田奈・大井の代わりに小田原北を含む理由と整合）。県立普通科(87)+市立(6)の
 * 合計は印字済み「合計」27,066/32,929と完全一致。sheet1(普通科・クリエイティブ)はこれで完結。
 * sheet2(専門学科)・sheet3(単位制)は次回以降のセッションで横展開する。
 *
 * **2026-08-07追記(掛-1第3弾)**: sheet2「専門学科」(農業/工業/商業/水産/家庭/福祉/理数/体育/美術/
 * 国際の10学科・33校)を追加。複数コース設置校は学校の「計」行の値をそのまま1校1レコードとして
 * 採用（tokyo/hokkaidoで確立した「計行採用方式」を踏襲）。単一コース校は該当行をそのまま採用。
 * area(所在地)はR8のkanagawa.tsに同一学校名が存在するものは値を継承し、R8に無い学校
 * （小田原城北工業＝R8では大井高校と統合し「小田原北」に改編済み）はWebSearchで所在地
 * （神奈川県小田原市栢山200）を裏取りしてarea='小田原市'とした。10学科全ての印字済み小計
 * （農業470/508・工業2198/2006・商業1030/1060・水産156/161・家庭39/49・福祉194/144・理数39/39・
 * 体育78/104・美術78/99・国際74/103）と完全一致（node.js機械計算）。これでbessi3.xlsxの
 * sheet1+sheet2が完結。sheet3(単位制)は次回以降のセッションで横展開する。
 *
 * **2026-08-07追記(掛-1第4弾・kanagawa完結)**: sheet3「単位制」（普通科16校+音楽コース1校+
 * 総合学科8校+専門学科11校+連携募集2校=計37レコード）を追加。総合学科の麻生総合は令和8年度に
 * 田奈と統合し「青葉総合」に改編されたため単独ではR8に存在しない（sheet1のクリエイティブ
 * スクール節で判明した学校再編と同根）。国際科（単位制）は横浜国際の「国際科」＋「国際科国際
 * バカロレアコース」を印字済み「計」行で1レコードに集約。全ての印字済み小計・合計
 * （普通科単位制4,067/4,578・総合学科単位制2,017/2,272・農業152/101・連携募集85/83等）が
 * 完全一致（node.js機械計算）。**これでbessi3.xlsx全体（sheet1〜3）が完結し、
 * kanagawaのR7学校粒度データが確定した。**
 *
 * **2026-08-08追記(掛-1・学校別×多年度・kanagawa R6横展開第1弾)**: R6(令和6年度)版の別紙3ページ
 * （nyusen/jisshikekka/r6shihenjishigansyasu.html）を発見し、xlsx版(documents/134290/bessi-3.xlsx)
 * を同じunzip+自前XMLパース手法で直読みした。**罠(要注意)**: セル出力を単純な正規表現
 * `<c r="...">...<\/c>`でスキャンすると、自己終了タグ`<c r="B12" s="604"\/>`（空セル）を
 * `<\/c>`検索が読み飛ばして次のセルの内容を誤って自身のものとして吸収してしまう事故が発生した
 * （学校名列が実際はD列なのにB列の値として誤表示された）。**対策**: セルを`(?:\/>|>content<\/c>)`の
 * 択一パターンで正しくマッチさせ、自己終了セルの内容は空として扱うこと。sheet1「普通科・
 * クリエイティブスクール」を取得: 県立普通科88校（10地区）・市立普通科6校（横浜市立3+川崎市立3・
 * 横浜市立南はR8で統合済みのためR6時点ではまだ存在）・クリエイティブスクール5校（田奈/釜利谷/
 * 横須賀南/大井/大和東）＝99レコード。印字済み小計「県立計26,048/32,058/1.23」「市立計
 * 1,268/1,757/1.39」「合計27,316/33,815/1.24」「クリエイティブ合計835/685/0.82」全てが機械集計と
 * 完全一致（node.jsで確認）。
 *
 * **2026-08-08追記(掛-1・kanagawa R6横展開第2弾)**: sheet2「専門学科」(農業/工業/商業/水産/家庭/看護/
 * 福祉/理数/体育/美術/国際の11学科・27校)を追加。R7は10学科(看護科なし)だったが、R6時点では
 * 二俣川看護福祉が「看護科」(quota79)と「福祉科」(quota79)の2学科制で、R7では看護科が募集停止し
 * 福祉科のみ(quota39)に再編されたとみられる(誤記ではなく実在の学科改編の可能性が高い・裏取りは
 * 今後の機会があれば行う)。複数コース設置校は学校の「計」行の値をそのまま1校1レコードとして採用
 * （tokyo/hokkaido/kanagawa R7で確立した「計行採用方式」を踏襲）。学校のarea(所在地)はR7の
 * kanagawa.tsに同一学校名が存在するものは値を継承した。11学科全ての印字済み小計（農業470/496・
 * 工業2212/1939・商業1031/1112・水産156/131・家庭39/44・看護79/69[単独校]・福祉236/129・
 * 理数39/42[単独校]・体育78/92・美術78/91・国際74/117）と完全一致（node.js機械計算）。これで
 * bessi-3.xlsxのsheet1+sheet2が完結。
 *
 * **2026-08-08追記(掛-1・kanagawa R6横展開第3弾・完結)**: sheet3「単位制」（普通科17校(戸塚一般
 * コース含む)+専門コース1校(戸塚音楽コース)+総合学科8校+専門学科11学科11校+連携募集2校=計38
 * レコード）を追加。**発見**: 単位制普通科に「横浜旭陵」（quota232/apps210）が存在するが、
 * R7/R8のkanagawa.tsには一切存在しない。WebSearchで裏取りしたところ、横浜旭陵高校は旭高校との
 * 再編統合が決定しており2025年度(=R7)以降の新規生徒募集を停止したことが判明（2027年度に統合完了
 * 予定・旧都岡高校+中沢高校が2004年合併して開校した経緯を持つ）。R6が最後の募集年度だったための
 * 実在の消失であり誤記ではない。全ての印字済み小計・合計（普通科(単位制)計4,262/5,050・総合学科
 * (単位制)計1,980/2,289・農業(単位制)合計156/109・音楽コース39/44・国際関係(単位制)計159/206・
 * 連携募集合計85/77）が完全一致（node.js機械計算）。**これでbessi-3.xlsx全体（sheet1〜3）が完結し、
 * kanagawaのR6学校粒度データが確定した（tokyo/yamaguchiに続き3県目の「学校別×多年度」深掘り
 * が進捗）。**
 *
 * **2026-08-08追記(掛-1・kanagawa R5横展開第1弾・4年度目)**: R5の一次資料ページ（prs/koko/
 * r1913978.html）は現在404で直接アクセス不可（R6/R7が使う新URL体系nyusen/jisshikekkaと異なり
 * R5以前は旧URL体系prs/kokoで、旧ページはアーカイブされず削除される模様）。**対策**:
 * WebSearchでページタイトルを発見→`http://archive.org/wayback/available?url=...`でスナップショット
 * のタイムスタンプを取得→`http://web.archive.org/web/<timestamp>if_/<元URL>`でスナップショット
 * 本文をcurlで直接取得しbessi3.xlsxの実URL(documents/95719/bessi3.xlsx)を発見→この実URLは
 * ライブサイトでは404だが、`http://web.archive.org/web/<timestamp>if_/<実URL>`のWaybackスナップ
 * ショット経由でxlsxファイル本体（PKマジックバイト確認済み）を取得できた。sheet1「普通科・
 * クリエイティブ」を県立88校(10地区)+市立6校+クリエイティブ5校=99レコード取得。県央地区に
 * 「厚木東」(R6以降は「厚木王子」に改称・R6のsheet2脚注「県立厚木王子高等学校の前年度競争率は、
 * 県立厚木東高等学校の前年度競争率です」と整合)が存在するなど、実在の学校改称を複数確認。
 * 印字済み小計「県立計26,761/32,784」「市立計1,268/1,697」「合計28,029/34,481」「クリエイティブ
 * 合計910/676」全てが機械集計と完全一致（node.jsで確認）。次回はsheet2「専門学科」・sheet3
 * 「単位制」を追加する。
 *
 * **2026-08-08追記(掛-1・kanagawa R5横展開第2弾)**: sheet2「専門学科」(農業/工業/商業/水産/家庭/看護/
 * 福祉/理数/体育/美術/国際の11学科・27校)=34レコードを追加。商業科に「厚木商業」(quota158)が
 * 存在するが、R6では同じ枠が「厚木王子」(quota159)に改称されている（R6コメント参照の脚注と整合）。
 * 全11学科の印字済み小計（農業468/461・工業2276/1990・商業1026/1069・水産156/104・家庭39/37・
 * 看護78/74[単独校]・福祉234/135・理数39/54[単独校]・体育78/90・美術78/98・国際74/94）と
 * 完全一致（node.js機械計算）。これでbessi3.xlsx(R5)のsheet1+sheet2が完結。sheet3(単位制)は
 * 次回以降のセッションで横展開する。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const KANAGAWA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kanagawa',
  sources: [
    {
      url: 'https://www.pref.kanagawa.jp/documents/131973/bessi3.pdf',
      docTitle:
        '神奈川県教育委員会 令和8年度神奈川県公立高等学校入学者選抜一般募集共通選抜等志願変更締切時志願状況（別紙3）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
    {
      url: 'https://www.pref.kanagawa.jp/documents/118051/bessi3.xlsx',
      docTitle:
        '神奈川県教育委員会 令和7年度神奈川県公立高等学校入学者選抜一般募集共通選抜等志願変更締切時志願状況（別紙3・sheet1「普通科・クリエイティブ」完全収録・掛-1・kanagawa横展開第1〜2弾）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
    {
      url: 'https://www.pref.kanagawa.jp/documents/134290/bessi-3.xlsx',
      docTitle:
        '神奈川県教育委員会 令和6年度神奈川県公立高等学校入学者選抜一般募集共通選抜等志願変更締切日集計時志願状況（別紙3・sheet1〜3完全収録・掛-1・kanagawa横展開R6第1〜3弾・完結）',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-08',
    },
    {
      url: 'https://www.pref.kanagawa.jp/documents/95719/bessi3.xlsx',
      docTitle:
        '神奈川県教育委員会 令和5年度神奈川県公立高等学校入学者選抜一般募集共通選抜等志願変更締切時志願状況（別紙3・sheet1「普通科・クリエイティブ」+sheet2「専門学科」完全収録・掛-1・kanagawa横展開R5第1〜2弾・Wayback Machine経由で取得）',
      fiscalYear: '令和5年度（2023年度）',
      fetchedAt: '2026-08-08',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '普通科（共通選抜・クリエイティブスクール含む）',
      '普通科（連携募集）',
      '専門学科（農業・工業・商業・水産・家庭・福祉・理数・体育・美術・国際の10学科）',
      '単位制（普通科・普通科専門コース・総合学科・専門学科8学科）',
    ],
    pendingDepartments: [],
    note:
      '全日制（一般募集共通選抜＋連携募集）を完了。定時制・通信制・特別募集（海外帰国/在県外国人）は全日制の外側の別集計のため対象外として明示的に除外。',
  },
  officialSubtotals: [
    { label: '普通科（共通選抜）県立計', schoolCount: 87, quota: 26045, finalApplicants: 30122, finalRate: 1.16 },
    { label: '普通科（共通選抜）市立計', schoolCount: 5, quota: 1230, finalApplicants: 1603, finalRate: 1.3 },
    { label: '普通科（共通選抜）合計', schoolCount: 92, quota: 27275, finalApplicants: 31725, finalRate: 1.16 },
    { label: '普通科（クリエイティブスクール）合計', schoolCount: 4, quota: 672, finalApplicants: 525, finalRate: 0.78 },
    { label: '専門学科（農業）合計', schoolCount: 3, quota: 460, finalApplicants: 488, finalRate: 1.06 },
    { label: '専門学科（工業）合計', schoolCount: 10, quota: 2181, finalApplicants: 1874, finalRate: 0.86 },
    { label: '専門学科（商業）合計', schoolCount: 7, quota: 1026, finalApplicants: 1078, finalRate: 1.05 },
    { label: '専門学科（水産）計', schoolCount: 1, quota: 152, finalApplicants: 141, finalRate: 0.93 },
    { label: '専門学科（福祉）合計', schoolCount: 4, quota: 193, finalApplicants: 128, finalRate: 0.66 },
    { label: '専門学科（体育）合計', schoolCount: 2, quota: 77, finalApplicants: 95, finalRate: 1.23 },
    { label: '専門学科（美術）合計', schoolCount: 2, quota: 76, finalApplicants: 82, finalRate: 1.08 },
    { label: '専門学科（国際）合計', schoolCount: 2, quota: 74, finalApplicants: 102, finalRate: 1.38 },
    { label: '単位制普通科合計', schoolCount: 16, quota: 4097, finalApplicants: 4204, finalRate: 1.03 },
    { label: '単位制総合学科（クリエイティブ除く）合計', schoolCount: 7, quota: 1859, finalApplicants: 2011, finalRate: 1.08 },
    { label: '単位制専門学科（農業）合計', schoolCount: 2, quota: 152, finalApplicants: 105, finalRate: 0.69 },
    { label: '単位制専門学科（国際関係）計', schoolCount: 1, quota: 159, finalApplicants: 190, finalRate: 1.19 },
    { label: '一般募集共通選抜（全日制）+連携募集 全体', quota: 39431, finalApplicants: 43821, finalRate: 1.11 },
  ],
  records: [
    // ===== 普通科（共通選抜）県立87校 =====
    // --- 横浜北（13校） ---
    { schoolName: '鶴見', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 381, finalRate: 1.2 },
    { schoolName: '横浜翠嵐', area: '横浜北', department: '普通科', quota: 359, finalApplicants: 736, finalRate: 2.05 },
    { schoolName: '城郷', area: '横浜北', department: '普通科', quota: 238, finalApplicants: 277, finalRate: 1.16 },
    { schoolName: '港北', area: '横浜北', department: '普通科', quota: 358, finalApplicants: 478, finalRate: 1.34 },
    { schoolName: '新羽', area: '横浜北', department: '普通科', quota: 398, finalApplicants: 450, finalRate: 1.13 },
    { schoolName: '岸根', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 427, finalRate: 1.34 },
    { schoolName: '霧が丘', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 339, finalRate: 1.07 },
    { schoolName: '白山', area: '横浜北', department: '普通科', quota: 238, finalApplicants: 224, finalRate: 0.94 },
    { schoolName: '市ケ尾', area: '横浜北', department: '普通科', quota: 398, finalApplicants: 515, finalRate: 1.29 },
    { schoolName: '元石川', area: '横浜北', department: '普通科', quota: 358, finalApplicants: 432, finalRate: 1.21 },
    { schoolName: '川和', area: '横浜北', department: '普通科', quota: 359, finalApplicants: 452, finalRate: 1.26 },
    { schoolName: '荏田', area: '横浜北', department: '普通科', quota: 398, finalApplicants: 473, finalRate: 1.19 },
    { schoolName: '新栄', area: '横浜北', department: '普通科', quota: 346, finalApplicants: 359, finalRate: 1.04 },

    // --- 横浜中（11校） ---
    { schoolName: '希望ケ丘', area: '横浜中', department: '普通科', quota: 359, finalApplicants: 527, finalRate: 1.47 },
    { schoolName: '二俣川', area: '横浜中', department: '普通科', quota: 118, finalApplicants: 94, finalRate: 0.8 },
    { schoolName: '旭', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 326, finalRate: 1.03 },
    { schoolName: '松陽', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 410, finalRate: 1.29 },
    { schoolName: '横浜瀬谷', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 378, finalRate: 1.19 },
    { schoolName: '横浜平沼', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 443, finalRate: 1.39 },
    { schoolName: '光陵', area: '横浜中', department: '普通科', quota: 279, finalApplicants: 380, finalRate: 1.36 },
    { schoolName: '保土ケ谷', area: '横浜中', department: '普通科', quota: 238, finalApplicants: 249, finalRate: 1.05 },
    { schoolName: '舞岡', area: '横浜中', department: '普通科', quota: 358, finalApplicants: 364, finalRate: 1.02 },
    { schoolName: '上矢部', area: '横浜中', department: '普通科', quota: 238, finalApplicants: 243, finalRate: 1.02 },
    { schoolName: '金井', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 358, finalRate: 1.13 },

    // --- 横浜南（5校） ---
    { schoolName: '横浜南陵', area: '横浜南', department: '普通科', quota: 238, finalApplicants: 272, finalRate: 1.14 },
    { schoolName: '柏陽', area: '横浜南', department: '普通科', quota: 319, finalApplicants: 503, finalRate: 1.58 },
    { schoolName: '横浜緑ケ丘', area: '横浜南', department: '普通科', quota: 279, finalApplicants: 433, finalRate: 1.55 },
    { schoolName: '横浜立野', area: '横浜南', department: '普通科', quota: 278, finalApplicants: 336, finalRate: 1.21 },
    { schoolName: '横浜氷取沢', area: '横浜南', department: '普通科', quota: 358, finalApplicants: 428, finalRate: 1.2 },

    // --- 川崎（9校） ---
    { schoolName: '新城', area: '川崎', department: '普通科', quota: 268, finalApplicants: 440, finalRate: 1.64 },
    { schoolName: '住吉', area: '川崎', department: '普通科', quota: 358, finalApplicants: 440, finalRate: 1.23 },
    { schoolName: '川崎北', area: '川崎', department: '普通科', quota: 278, finalApplicants: 255, finalRate: 0.92 },
    { schoolName: '多摩', area: '川崎', department: '普通科', quota: 279, finalApplicants: 491, finalRate: 1.76 },
    { schoolName: '生田', area: '川崎', department: '普通科', quota: 398, finalApplicants: 470, finalRate: 1.18 },
    { schoolName: '百合丘', area: '川崎', department: '普通科', quota: 398, finalApplicants: 384, finalRate: 0.96 },
    { schoolName: '生田東', area: '川崎', department: '普通科', quota: 318, finalApplicants: 335, finalRate: 1.05 },
    { schoolName: '菅', area: '川崎', department: '普通科', quota: 278, finalApplicants: 162, finalRate: 0.58 },
    { schoolName: '麻生', area: '川崎', department: '普通科', quota: 318, finalApplicants: 318, finalRate: 1.0 },

    // --- 横須賀・三浦（5校） ---
    { schoolName: '横須賀', area: '横須賀三浦', department: '普通科', quota: 279, finalApplicants: 348, finalRate: 1.25 },
    { schoolName: '横須賀大津', area: '横須賀三浦', department: '普通科', quota: 278, finalApplicants: 321, finalRate: 1.15 },
    { schoolName: '追浜', area: '横須賀三浦', department: '普通科', quota: 318, finalApplicants: 349, finalRate: 1.1 },
    { schoolName: '津久井浜', area: '横須賀三浦', department: '普通科', quota: 238, finalApplicants: 281, finalRate: 1.18 },
    { schoolName: '逗子葉山', area: '横須賀三浦', department: '普通科', quota: 318, finalApplicants: 364, finalRate: 1.14 },

    // --- 鎌倉・藤沢・茅ケ崎（11校） ---
    { schoolName: '鎌倉', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 359, finalApplicants: 441, finalRate: 1.23 },
    { schoolName: '七里ガ浜', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 358, finalApplicants: 529, finalRate: 1.48 },
    { schoolName: '大船', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 398, finalApplicants: 471, finalRate: 1.18 },
    { schoolName: '湘南', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 359, finalApplicants: 593, finalRate: 1.65 },
    { schoolName: '藤沢西', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 318, finalApplicants: 379, finalRate: 1.19 },
    { schoolName: '湘南台', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 238, finalApplicants: 273, finalRate: 1.15 },
    { schoolName: '茅ケ崎', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 278, finalApplicants: 337, finalRate: 1.21 },
    { schoolName: '茅ケ崎北陵', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 279, finalApplicants: 371, finalRate: 1.33 },
    { schoolName: '鶴嶺', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 383, finalApplicants: 438, finalRate: 1.14 },
    { schoolName: '茅ケ崎西浜', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 358, finalApplicants: 371, finalRate: 1.04 },
    { schoolName: '寒川', area: '鎌倉藤沢茅ケ崎', department: '普通科', quota: 238, finalApplicants: 132, finalRate: 0.55 },

    // --- 平塚・秦野・伊勢原（8校） ---
    { schoolName: '平塚江南', area: '平塚秦野伊勢原', department: '普通科', quota: 319, finalApplicants: 374, finalRate: 1.17 },
    { schoolName: '高浜', area: '平塚秦野伊勢原', department: '普通科', quota: 228, finalApplicants: 249, finalRate: 1.09 },
    { schoolName: '大磯', area: '平塚秦野伊勢原', department: '普通科', quota: 278, finalApplicants: 346, finalRate: 1.24 },
    { schoolName: '二宮', area: '平塚秦野伊勢原', department: '普通科', quota: 238, finalApplicants: 84, finalRate: 0.35 },
    { schoolName: '秦野', area: '平塚秦野伊勢原', department: '普通科', quota: 358, finalApplicants: 414, finalRate: 1.16 },
    { schoolName: '秦野曽屋', area: '平塚秦野伊勢原', department: '普通科', quota: 278, finalApplicants: 247, finalRate: 0.89 },
    { schoolName: '伊勢原', area: '平塚秦野伊勢原', department: '普通科', quota: 228, finalApplicants: 255, finalRate: 1.12 },
    { schoolName: '伊志田', area: '平塚秦野伊勢原', department: '普通科', quota: 308, finalApplicants: 331, finalRate: 1.07 },

    // --- 県西（4校） ---
    { schoolName: '小田原東', area: '県西', department: '普通科', quota: 118, finalApplicants: 67, finalRate: 0.57 },
    { schoolName: '西湘', area: '県西', department: '普通科', quota: 348, finalApplicants: 340, finalRate: 0.98 },
    { schoolName: '足柄', area: '県西', department: '普通科', quota: 238, finalApplicants: 239, finalRate: 1.0 },
    { schoolName: '山北', area: '県西', department: '普通科', quota: 198, finalApplicants: 153, finalRate: 0.77 },

    // --- 県央（13校） ---
    { schoolName: '厚木', area: '県央', department: '普通科', quota: 359, finalApplicants: 450, finalRate: 1.25 },
    { schoolName: '厚木王子', area: '県央', department: '普通科', quota: 198, finalApplicants: 214, finalRate: 1.08 },
    { schoolName: '厚木北', area: '県央', department: '普通科', quota: 238, finalApplicants: 253, finalRate: 1.06 },
    { schoolName: '厚木西', area: '県央', department: '普通科', quota: 238, finalApplicants: 204, finalRate: 0.86 },
    { schoolName: '海老名', area: '県央', department: '普通科', quota: 398, finalApplicants: 473, finalRate: 1.19 },
    { schoolName: '有馬', area: '県央', department: '普通科', quota: 318, finalApplicants: 345, finalRate: 1.08 },
    { schoolName: '愛川', area: '県央', department: '普通科', quota: 178, finalApplicants: 97, finalRate: 0.54 },
    { schoolName: '大和', area: '県央', department: '普通科', quota: 279, finalApplicants: 379, finalRate: 1.36 },
    { schoolName: '大和南', area: '県央', department: '普通科', quota: 308, finalApplicants: 307, finalRate: 1.0 },
    { schoolName: '大和西', area: '県央', department: '普通科', quota: 278, finalApplicants: 321, finalRate: 1.15 },
    { schoolName: '座間', area: '県央', department: '普通科', quota: 318, finalApplicants: 421, finalRate: 1.32 },
    { schoolName: '綾瀬', area: '県央', department: '普通科', quota: 318, finalApplicants: 324, finalRate: 1.02 },
    { schoolName: '綾瀬西', area: '県央', department: '普通科', quota: 318, finalApplicants: 288, finalRate: 0.91 },

    // --- 相模原（8校） ---
    { schoolName: '麻溝台', area: '相模原', department: '普通科', quota: 358, finalApplicants: 419, finalRate: 1.17 },
    { schoolName: '上鶴間', area: '相模原', department: '普通科', quota: 278, finalApplicants: 287, finalRate: 1.03 },
    { schoolName: '上溝', area: '相模原', department: '普通科', quota: 238, finalApplicants: 278, finalRate: 1.17 },
    { schoolName: '相模原', area: '相模原', department: '普通科', quota: 279, finalApplicants: 360, finalRate: 1.29 },
    { schoolName: '上溝南', area: '相模原', department: '普通科', quota: 358, finalApplicants: 383, finalRate: 1.07 },
    { schoolName: '橋本', area: '相模原', department: '普通科', quota: 268, finalApplicants: 314, finalRate: 1.17 },
    { schoolName: '相模田名', area: '相模原', department: '普通科', quota: 278, finalApplicants: 267, finalRate: 0.96 },
    { schoolName: '津久井', area: '相模原', department: '普通科', quota: 158, finalApplicants: 59, finalRate: 0.37 },

    // ===== 普通科（共通選抜）市立5校 =====
    { schoolName: '横浜市立桜丘', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 390, finalRate: 1.23 },
    { schoolName: '横浜市立金沢', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 413, finalRate: 1.3 },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '普通科', quota: 198, finalApplicants: 286, finalRate: 1.44 },
    { schoolName: '川崎市立高津', area: '川崎市立', department: '普通科', quota: 278, finalApplicants: 349, finalRate: 1.26 },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '普通科', quota: 118, finalApplicants: 165, finalRate: 1.4 },

    // ===== 普通科（クリエイティブスクール・4校） =====
    { schoolName: '釜利谷', area: '横浜市', department: '普通科（クリエイティブスクール）', quota: 238, finalApplicants: 113, finalRate: 0.47 },
    { schoolName: '横須賀南', area: '横須賀市', department: '普通科（クリエイティブスクール）', quota: 118, finalApplicants: 115, finalRate: 0.97 },
    { schoolName: '小田原北', area: '小田原市', department: '普通科（クリエイティブスクール）', quota: 78, finalApplicants: 73, finalRate: 0.94 },
    { schoolName: '大和東', area: '大和市', department: '普通科（クリエイティブスクール）', quota: 238, finalApplicants: 224, finalRate: 0.94 },

    // ===== 専門学科（農業・3校） =====
    { schoolName: '平塚農商', area: '平塚', department: '農業科', quota: 152, finalApplicants: 168, finalRate: 1.11 },
    { schoolName: '相原', area: '相模原', department: '農業科', quota: 114, finalApplicants: 138, finalRate: 1.21 },
    { schoolName: '中央農業', area: '海老名', department: '農業科', quota: 194, finalApplicants: 182, finalRate: 0.94 },

    // ===== 専門学科（工業・10校） =====
    { schoolName: '神奈川工業', area: '横浜市', department: '工業科', quota: 312, finalApplicants: 354, finalRate: 1.13 },
    { schoolName: '商工', area: '藤沢市', department: '工業科', quota: 118, finalApplicants: 102, finalRate: 0.86 },
    { schoolName: '磯子工業', area: '横浜市', department: '工業科', quota: 224, finalApplicants: 212, finalRate: 0.95 },
    { schoolName: '川崎工科', area: '川崎市', department: '工業科', quota: 238, finalApplicants: 248, finalRate: 1.04 },
    { schoolName: '向の岡工業', area: '川崎市', department: '工業科', quota: 234, finalApplicants: 181, finalRate: 0.77 },
    { schoolName: '横須賀工業', area: '横須賀市', department: '工業科', quota: 232, finalApplicants: 179, finalRate: 0.77 },
    { schoolName: '平塚工科', area: '平塚市', department: '工業科', quota: 238, finalApplicants: 127, finalRate: 0.53 },
    { schoolName: '藤沢工科', area: '藤沢市', department: '工業科', quota: 238, finalApplicants: 161, finalRate: 0.68 },
    { schoolName: '小田原北', area: '小田原市', department: '工業科', quota: 152, finalApplicants: 117, finalRate: 0.77 },
    { schoolName: '川崎市立川崎総合科学', area: '川崎市', department: '工業科', quota: 195, finalApplicants: 193, finalRate: 0.99 },

    // ===== 専門学科（商業・7校） =====
    { schoolName: '商工', area: '藤沢市', department: '商業科', quota: 118, finalApplicants: 106, finalRate: 0.9 },
    { schoolName: '平塚農商', area: '平塚', department: '商業科', quota: 158, finalApplicants: 164, finalRate: 1.04 },
    { schoolName: '小田原東', area: '県西', department: '商業科', quota: 118, finalApplicants: 75, finalRate: 0.64 },
    { schoolName: '相原', area: '相模原', department: '商業科', quota: 118, finalApplicants: 136, finalRate: 1.15 },
    { schoolName: '厚木王子', area: '県央', department: '商業科', quota: 158, finalApplicants: 184, finalRate: 1.16 },
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '商業科', quota: 238, finalApplicants: 274, finalRate: 1.15 },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '商業科', quota: 118, finalApplicants: 139, finalRate: 1.18 },

    // ===== 専門学科（水産・1校） =====
    { schoolName: '海洋科学', area: '横須賀市', department: '水産科', quota: 152, finalApplicants: 141, finalRate: 0.93 },

    // ===== 専門学科（家庭・1校） =====
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '家庭科', quota: 39, finalApplicants: 31, finalRate: 0.79 },

    // ===== 専門学科（福祉・4校） =====
    { schoolName: '二俣川', area: '横浜中', department: '福祉科', quota: 38, finalApplicants: 28, finalRate: 0.74 },
    { schoolName: '横須賀南', area: '横須賀市', department: '福祉科', quota: 78, finalApplicants: 48, finalRate: 0.62 },
    { schoolName: '津久井', area: '相模原', department: '福祉科', quota: 38, finalApplicants: 15, finalRate: 0.39 },
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '福祉科', quota: 39, finalApplicants: 37, finalRate: 0.95 },

    // ===== 専門学科（理数・1校） =====
    { schoolName: '川崎市立川崎総合科学', area: '川崎市立', department: '理数科', quota: 39, finalApplicants: 53, finalRate: 1.36 },

    // ===== 専門学科（体育・2校） =====
    { schoolName: '厚木北', area: '県央', department: '体育科', quota: 38, finalApplicants: 46, finalRate: 1.21 },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '体育科', quota: 39, finalApplicants: 49, finalRate: 1.26 },

    // ===== 専門学科（美術・2校） =====
    { schoolName: '白山', area: '横浜北', department: '美術科', quota: 38, finalApplicants: 35, finalRate: 0.92 },
    { schoolName: '上矢部', area: '横浜中', department: '美術科', quota: 38, finalApplicants: 47, finalRate: 1.24 },

    // ===== 専門学科（国際・2校） =====
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '国際科', quota: 35, finalApplicants: 52, finalRate: 1.49 },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '国際科', quota: 39, finalApplicants: 50, finalRate: 1.28 },

    // ===== 単位制 普通科（16校。神奈川総合は2コース・横浜市立戸塚は一般コースのみここに含む） =====
    { schoolName: '神奈川総合', area: '横浜市', department: '普通科（単位制）', quota: 208, finalApplicants: 320, finalRate: 1.54 },
    { schoolName: '横浜緑園', area: '横浜市', department: '普通科（単位制）', quota: 278, finalApplicants: 262, finalRate: 0.94 },
    { schoolName: '横浜桜陽', area: '横浜市', department: '普通科（単位制）', quota: 270, finalApplicants: 191, finalRate: 0.71 },
    { schoolName: '横浜清陵', area: '横浜市', department: '普通科（単位制）', quota: 305, finalApplicants: 332, finalRate: 1.09 },
    { schoolName: '横浜栄', area: '横浜市', department: '普通科（単位制）', quota: 318, finalApplicants: 382, finalRate: 1.2 },
    { schoolName: '川崎', area: '川崎市', department: '普通科（単位制）', quota: 222, finalApplicants: 284, finalRate: 1.28 },
    { schoolName: '大師', area: '川崎市', department: '普通科（単位制）', quota: 225, finalApplicants: 150, finalRate: 0.67 },
    { schoolName: '三浦初声', area: '三浦市', department: '普通科（単位制）', quota: 198, finalApplicants: 86, finalRate: 0.43 },
    { schoolName: '藤沢清流', area: '藤沢市', department: '普通科（単位制）', quota: 278, finalApplicants: 303, finalRate: 1.09 },
    { schoolName: '平塚湘風', area: '平塚市', department: '普通科（単位制）', quota: 238, finalApplicants: 170, finalRate: 0.71 },
    { schoolName: '小田原', area: '小田原市', department: '普通科（単位制）', quota: 319, finalApplicants: 371, finalRate: 1.16 },
    { schoolName: '厚木清南', area: '県央', department: '普通科（単位制）', quota: 230, finalApplicants: 234, finalRate: 1.02 },
    { schoolName: '相模原城山', area: '相模原', department: '普通科（単位制）', quota: 278, finalApplicants: 263, finalRate: 0.95 },
    { schoolName: '相模原弥栄', area: '相模原', department: '普通科（単位制）', quota: 183, finalApplicants: 191, finalRate: 1.04 },
    { schoolName: '横浜市立東', area: '横浜市立', department: '普通科（単位制）', quota: 268, finalApplicants: 324, finalRate: 1.21 },
    { schoolName: '横浜市立戸塚', area: '横浜市立', department: '普通科（単位制・一般コース）', quota: 279, finalApplicants: 341, finalRate: 1.22 },

    // ===== 単位制 普通科専門コース（1校） =====
    { schoolName: '横浜市立戸塚', area: '横浜市立', department: '普通科（単位制・音楽コース）', quota: 39, finalApplicants: 46, finalRate: 1.18 },

    // ===== 単位制 総合学科（クリエイティブ除く・7校） =====
    { schoolName: '鶴見総合', area: '横浜市', department: '総合学科（単位制）', quota: 259, finalApplicants: 302, finalRate: 1.17 },
    { schoolName: '金沢総合', area: '横浜市', department: '総合学科（単位制）', quota: 278, finalApplicants: 316, finalRate: 1.14 },
    { schoolName: '藤沢総合', area: '藤沢市', department: '総合学科（単位制）', quota: 268, finalApplicants: 320, finalRate: 1.19 },
    { schoolName: '秦野総合', area: '秦野市', department: '総合学科（単位制）', quota: 238, finalApplicants: 198, finalRate: 0.83 },
    { schoolName: '座間総合', area: '座間市', department: '総合学科（単位制）', quota: 264, finalApplicants: 261, finalRate: 0.99 },
    { schoolName: '横浜市立みなと総合', area: '横浜市立', department: '総合学科（単位制）', quota: 232, finalApplicants: 250, finalRate: 1.08 },
    { schoolName: '横須賀市立横須賀総合', area: '横須賀市立', department: '総合学科（単位制）', quota: 320, finalApplicants: 364, finalRate: 1.14 },

    // ===== 単位制 総合学科クリエイティブスクール（1校） =====
    { schoolName: '青葉総合', area: '横浜市', department: '総合学科（単位制・クリエイティブスクール）', quota: 158, finalApplicants: 143, finalRate: 0.91 },

    // ===== 単位制 専門学科（農業・2校） =====
    { schoolName: '三浦初声', area: '三浦市', department: '農業科（単位制）', quota: 38, finalApplicants: 26, finalRate: 0.68 },
    { schoolName: '吉田島', area: '開成町', department: '農業科（単位制）', quota: 114, finalApplicants: 79, finalRate: 0.69 },

    // ===== 単位制 専門学科（家庭・1校） =====
    { schoolName: '吉田島', area: '開成町', department: '家庭科（単位制）', quota: 38, finalApplicants: 34, finalRate: 0.89 },

    // ===== 単位制 専門学科（理数・1校） =====
    { schoolName: '横浜サイエンスフロンティア', area: '横浜市立', department: '理数科（単位制）', quota: 158, finalApplicants: 255, finalRate: 1.61 },

    // ===== 単位制 専門学科（体育・1校） =====
    { schoolName: '相模原弥栄', area: '相模原', department: '体育科（単位制）', quota: 78, finalApplicants: 85, finalRate: 1.09 },

    // ===== 単位制 専門学科（音楽・1校） =====
    { schoolName: '相模原弥栄', area: '相模原', department: '音楽科（単位制）', quota: 38, finalApplicants: 45, finalRate: 1.18 },

    // ===== 単位制 専門学科（美術・1校） =====
    { schoolName: '相模原弥栄', area: '相模原', department: '美術科（単位制）', quota: 38, finalApplicants: 55, finalRate: 1.45 },

    // ===== 単位制 専門学科（国際関係・1校） =====
    { schoolName: '横浜国際', area: '横浜市', department: '国際科（単位制）', quota: 159, finalApplicants: 190, finalRate: 1.19 },

    // ===== 単位制 専門学科（総合産業・1校） =====
    { schoolName: '神奈川総合産業', area: '横浜市', department: '総合産業科（単位制）', quota: 238, finalApplicants: 218, finalRate: 0.92 },

    // ===== 単位制 専門学科（舞台芸術・1校） =====
    { schoolName: '神奈川総合', area: '横浜市', department: '舞台芸術科（単位制）', quota: 30, finalApplicants: 37, finalRate: 1.23 },

    // ===== 連携募集（2校・既存校への追加募集枠。志願変更を行わないため1/30の値=最終値） =====
    { schoolName: '光陵', area: '横浜中', department: '普通科（連携募集）', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '愛川', area: '県央', department: '普通科（連携募集）', quota: 45, finalApplicants: 31, finalRate: 0.69 },

    // ===== 掛-1(学校別×多年度)横展開: R7(令和7年度)分・県立普通科(クリエイティブスクール除く)87校 =====
    { schoolName: '鶴見', area: '横浜北', department: '普通科', quota: 319, finalApplicants: 379, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜翠嵐', area: '横浜北', department: '普通科', quota: 359, finalApplicants: 732, finalRate: 2.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城郷', area: '横浜北', department: '普通科', quota: 239, finalApplicants: 305, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '港北', area: '横浜北', department: '普通科', quota: 359, finalApplicants: 475, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新羽', area: '横浜北', department: '普通科', quota: 399, finalApplicants: 472, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岸根', area: '横浜北', department: '普通科', quota: 319, finalApplicants: 481, finalRate: 1.51, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '霧が丘', area: '横浜北', department: '普通科', quota: 319, finalApplicants: 372, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '白山', area: '横浜北', department: '普通科', quota: 239, finalApplicants: 285, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市ケ尾', area: '横浜北', department: '普通科', quota: 399, finalApplicants: 558, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '元石川', area: '横浜北', department: '普通科', quota: 359, finalApplicants: 493, finalRate: 1.37, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川和', area: '横浜北', department: '普通科', quota: 319, finalApplicants: 449, finalRate: 1.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '荏田', area: '横浜北', department: '普通科', quota: 399, finalApplicants: 515, finalRate: 1.29, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新栄', area: '横浜北', department: '普通科', quota: 349, finalApplicants: 401, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '希望ケ丘', area: '横浜中', department: '普通科', quota: 359, finalApplicants: 511, finalRate: 1.42, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '二俣川看護福祉', area: '横浜中', department: '普通科', quota: 119, finalApplicants: 111, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 343, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松陽', area: '横浜中', department: '普通科', quota: 279, finalApplicants: 313, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜瀬谷', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 342, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜平沼', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 428, finalRate: 1.34, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '光陵', area: '横浜中', department: '普通科', quota: 279, finalApplicants: 354, finalRate: 1.27, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '保土ケ谷', area: '横浜中', department: '普通科', quota: 239, finalApplicants: 252, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '舞岡', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 362, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上矢部', area: '横浜中', department: '普通科', quota: 239, finalApplicants: 300, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '金井', area: '横浜中', department: '普通科', quota: 359, finalApplicants: 404, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜南陵', area: '横浜南', department: '普通科', quota: 239, finalApplicants: 315, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '柏陽', area: '横浜南', department: '普通科', quota: 319, finalApplicants: 490, finalRate: 1.54, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜緑ケ丘', area: '横浜南', department: '普通科', quota: 279, finalApplicants: 403, finalRate: 1.44, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜立野', area: '横浜南', department: '普通科', quota: 279, finalApplicants: 382, finalRate: 1.37, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜氷取沢', area: '横浜南', department: '普通科', quota: 359, finalApplicants: 445, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新城', area: '川崎', department: '普通科', quota: 269, finalApplicants: 495, finalRate: 1.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '住吉', area: '川崎', department: '普通科', quota: 359, finalApplicants: 522, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎北', area: '川崎', department: '普通科', quota: 279, finalApplicants: 300, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多摩', area: '川崎', department: '普通科', quota: 279, finalApplicants: 467, finalRate: 1.67, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '生田', area: '川崎', department: '普通科', quota: 359, finalApplicants: 437, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '百合丘', area: '川崎', department: '普通科', quota: 359, finalApplicants: 376, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '生田東', area: '川崎', department: '普通科', quota: 319, finalApplicants: 336, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '菅', area: '川崎', department: '普通科', quota: 279, finalApplicants: 271, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '麻生', area: '川崎', department: '普通科', quota: 319, finalApplicants: 321, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横須賀', area: '横須賀・三浦', department: '普通科', quota: 279, finalApplicants: 382, finalRate: 1.37, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横須賀大津', area: '横須賀・三浦', department: '普通科', quota: 279, finalApplicants: 307, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '追浜', area: '横須賀・三浦', department: '普通科', quota: 279, finalApplicants: 394, finalRate: 1.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津久井浜', area: '横須賀・三浦', department: '普通科', quota: 239, finalApplicants: 246, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '逗子葉山', area: '横須賀・三浦', department: '普通科', quota: 319, finalApplicants: 374, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鎌倉', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 319, finalApplicants: 422, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '七里ガ浜', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 399, finalApplicants: 526, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大船', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 399, finalApplicants: 525, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '湘南', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 359, finalApplicants: 579, finalRate: 1.61, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '藤沢西', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 279, finalApplicants: 399, finalRate: 1.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '湘南台', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 239, finalApplicants: 323, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茅ケ崎', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 279, finalApplicants: 391, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茅ケ崎北陵', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 279, finalApplicants: 339, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鶴嶺', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 384, finalApplicants: 448, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茅ケ崎西浜', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 359, finalApplicants: 410, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '寒川', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 278, finalApplicants: 160, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '平塚江南', area: '平塚・秦野・伊勢原', department: '普通科', quota: 319, finalApplicants: 439, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高浜', area: '平塚・秦野・伊勢原', department: '普通科', quota: 229, finalApplicants: 250, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大磯', area: '平塚・秦野・伊勢原', department: '普通科', quota: 279, finalApplicants: 338, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '二宮', area: '平塚・秦野・伊勢原', department: '普通科', quota: 239, finalApplicants: 205, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秦野', area: '平塚・秦野・伊勢原', department: '普通科', quota: 359, finalApplicants: 381, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秦野曽屋', area: '平塚・秦野・伊勢原', department: '普通科', quota: 279, finalApplicants: 265, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊勢原', area: '平塚・秦野・伊勢原', department: '普通科', quota: 229, finalApplicants: 295, finalRate: 1.29, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊志田', area: '平塚・秦野・伊勢原', department: '普通科', quota: 269, finalApplicants: 310, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小田原東', area: '県西', department: '普通科', quota: 118, finalApplicants: 91, finalRate: 0.77, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '西湘', area: '県西', department: '普通科', quota: 309, finalApplicants: 357, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '足柄', area: '県西', department: '普通科', quota: 239, finalApplicants: 203, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '山北', area: '県西', department: '普通科', quota: 198, finalApplicants: 180, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '厚木', area: '県央', department: '普通科', quota: 359, finalApplicants: 415, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '厚木王子', area: '県央', department: '普通科', quota: 199, finalApplicants: 216, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '厚木北', area: '県央', department: '普通科', quota: 239, finalApplicants: 248, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '厚木西', area: '県央', department: '普通科', quota: 239, finalApplicants: 269, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '海老名', area: '県央', department: '普通科', quota: 399, finalApplicants: 495, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '有馬', area: '県央', department: '普通科', quota: 319, finalApplicants: 362, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '愛川', area: '県央', department: '普通科', quota: 183, finalApplicants: 96, finalRate: 0.52, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大和', area: '県央', department: '普通科', quota: 279, finalApplicants: 436, finalRate: 1.56, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大和南', area: '県央', department: '普通科', quota: 309, finalApplicants: 328, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大和西', area: '県央', department: '普通科', quota: 279, finalApplicants: 290, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '座間', area: '県央', department: '普通科', quota: 279, finalApplicants: 368, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '綾瀬', area: '県央', department: '普通科', quota: 319, finalApplicants: 313, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '綾瀬西', area: '県央', department: '普通科', quota: 319, finalApplicants: 294, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '麻溝台', area: '相模原', department: '普通科', quota: 359, finalApplicants: 388, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上鶴間', area: '相模原', department: '普通科', quota: 279, finalApplicants: 301, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上溝', area: '相模原', department: '普通科', quota: 239, finalApplicants: 310, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '相模原', area: '相模原', department: '普通科', quota: 279, finalApplicants: 364, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上溝南', area: '相模原', department: '普通科', quota: 359, finalApplicants: 374, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '橋本', area: '相模原', department: '普通科', quota: 269, finalApplicants: 306, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '相模田名', area: '相模原', department: '普通科', quota: 279, finalApplicants: 264, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津久井', area: '相模原', department: '普通科', quota: 158, finalApplicants: 89, finalRate: 0.56, fiscalYear: '令和7年度（2025年度）' },
    // --- 普通科（共通選抜・市立6校） ---
    { schoolName: '横浜市立桜丘', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 388, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜市立南', area: '横浜市立', department: '普通科', quota: 38, finalApplicants: 48, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜市立金沢', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 433, finalRate: 1.36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '普通科', quota: 198, finalApplicants: 306, finalRate: 1.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎市立高津', area: '川崎市立', department: '普通科', quota: 278, finalApplicants: 345, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '普通科', quota: 118, finalApplicants: 147, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    // --- 普通科（クリエイティブスクール・5校） ---
    { schoolName: '田奈', area: '横浜市', department: '普通科（クリエイティブスクール）', quota: 158, finalApplicants: 99, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '釜利谷', area: '横浜市', department: '普通科（クリエイティブスクール）', quota: 238, finalApplicants: 197, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横須賀南', area: '横須賀市', department: '普通科（クリエイティブスクール）', quota: 118, finalApplicants: 134, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大井', area: '大井町', department: '普通科（クリエイティブスクール）', quota: 79, finalApplicants: 60, finalRate: 0.76, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大和東', area: '大和市', department: '普通科（クリエイティブスクール）', quota: 239, finalApplicants: 242, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },

    // ===== 掛-1(学校別×多年度)横展開: R7分・sheet2「専門学科」（学校の「計」行採用方式） =====
    // --- 専門学科（農業・3校） ---
    { schoolName: '平塚農商', area: '平塚', department: '農業科', quota: 156, finalApplicants: 169, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '相原', area: '相模原', department: '農業科', quota: 117, finalApplicants: 118, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中央農業', area: '海老名', department: '農業科', quota: 197, finalApplicants: 221, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    // --- 専門学科（工業・10校） ---
    { schoolName: '神奈川工業', area: '横浜市', department: '工業科', quota: 316, finalApplicants: 391, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '商工', area: '藤沢市', department: '工業科', quota: 119, finalApplicants: 138, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '磯子工業', area: '横浜市', department: '工業科', quota: 232, finalApplicants: 179, finalRate: 0.77, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎工科', area: '川崎市', department: '工業科', quota: 238, finalApplicants: 162, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '向の岡工業', area: '川崎市', department: '工業科', quota: 234, finalApplicants: 202, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横須賀工業', area: '横須賀市', department: '工業科', quota: 236, finalApplicants: 175, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '平塚工科', area: '平塚市', department: '工業科', quota: 238, finalApplicants: 193, finalRate: 0.81, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '藤沢工科', area: '藤沢市', department: '工業科', quota: 238, finalApplicants: 207, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小田原城北工業', area: '小田原市', department: '工業科', quota: 152, finalApplicants: 109, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎市立川崎総合科学', area: '川崎市立', department: '工業科', quota: 195, finalApplicants: 250, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    // --- 専門学科（商業・7校） ---
    { schoolName: '商工', area: '藤沢市', department: '商業科', quota: 119, finalApplicants: 144, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '平塚農商', area: '平塚', department: '商業科', quota: 159, finalApplicants: 133, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小田原東', area: '県西', department: '商業科', quota: 118, finalApplicants: 58, finalRate: 0.49, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '相原', area: '相模原', department: '商業科', quota: 119, finalApplicants: 126, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '厚木王子', area: '県央', department: '商業科', quota: 159, finalApplicants: 160, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '商業科', quota: 238, finalApplicants: 270, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '商業科', quota: 118, finalApplicants: 169, finalRate: 1.43, fiscalYear: '令和7年度（2025年度）' },
    // --- 専門学科（水産・1校） ---
    { schoolName: '海洋科学', area: '横須賀市', department: '水産科', quota: 156, finalApplicants: 161, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    // --- 専門学科（家庭・1校） ---
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '家庭科', quota: 39, finalApplicants: 49, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    // --- 専門学科（福祉・4校） ---
    { schoolName: '二俣川看護福祉', area: '横浜中', department: '福祉科', quota: 39, finalApplicants: 36, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横須賀南', area: '横須賀市', department: '福祉科', quota: 78, finalApplicants: 52, finalRate: 0.67, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津久井', area: '相模原', department: '福祉科', quota: 38, finalApplicants: 25, finalRate: 0.66, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '福祉科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    // --- 専門学科（理数・1校） ---
    { schoolName: '川崎市立川崎総合科学', area: '川崎市立', department: '理数科', quota: 39, finalApplicants: 39, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    // --- 専門学科（体育・2校） ---
    { schoolName: '厚木北', area: '県央', department: '体育科', quota: 39, finalApplicants: 49, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '体育科', quota: 39, finalApplicants: 55, finalRate: 1.41, fiscalYear: '令和7年度（2025年度）' },
    // --- 専門学科（美術・2校） ---
    { schoolName: '白山', area: '横浜北', department: '美術科', quota: 39, finalApplicants: 47, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上矢部', area: '横浜中', department: '美術科', quota: 39, finalApplicants: 52, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    // --- 専門学科（国際・2校） ---
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '国際科', quota: 35, finalApplicants: 36, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '国際科', quota: 39, finalApplicants: 67, finalRate: 1.72, fiscalYear: '令和7年度（2025年度）' },

    // ===== 掛-1(学校別×多年度)横展開: R7分・sheet3「単位制」（学校の「計」行採用方式） =====
    // --- 単位制 普通科（16校。神奈川総合は2コース・横浜市立戸塚は一般コースのみここに含む） ---
    { schoolName: '神奈川総合', area: '横浜市', department: '普通科（単位制）', quota: 208, finalApplicants: 327, finalRate: 1.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜緑園', area: '横浜市', department: '普通科（単位制）', quota: 279, finalApplicants: 301, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜桜陽', area: '横浜市', department: '普通科（単位制）', quota: 270, finalApplicants: 264, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜清陵', area: '横浜市', department: '普通科（単位制）', quota: 266, finalApplicants: 358, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜栄', area: '横浜市', department: '普通科（単位制）', quota: 319, finalApplicants: 394, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川崎', area: '川崎市', department: '普通科（単位制）', quota: 223, finalApplicants: 273, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大師', area: '川崎市', department: '普通科（単位制）', quota: 228, finalApplicants: 173, finalRate: 0.76, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三浦初声', area: '三浦市', department: '普通科（単位制）', quota: 198, finalApplicants: 145, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '藤沢清流', area: '藤沢市', department: '普通科（単位制）', quota: 279, finalApplicants: 346, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '平塚湘風', area: '平塚市', department: '普通科（単位制）', quota: 238, finalApplicants: 192, finalRate: 0.81, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小田原', area: '小田原市', department: '普通科（単位制）', quota: 319, finalApplicants: 395, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '厚木清南', area: '県央', department: '普通科（単位制）', quota: 230, finalApplicants: 205, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '相模原城山', area: '相模原', department: '普通科（単位制）', quota: 279, finalApplicants: 292, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '相模原弥栄', area: '相模原', department: '普通科（単位制）', quota: 184, finalApplicants: 254, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜市立東', area: '横浜市立', department: '普通科（単位制）', quota: 268, finalApplicants: 362, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜市立戸塚', area: '横浜市立', department: '普通科（単位制・一般コース）', quota: 279, finalApplicants: 297, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 普通科専門コース（1校） ---
    { schoolName: '横浜市立戸塚', area: '横浜市立', department: '普通科（単位制・音楽コース）', quota: 39, finalApplicants: 44, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 総合学科（8校。麻生総合はR8で田奈と統合し「青葉総合」に改編済みのため単独では消滅） ---
    { schoolName: '鶴見総合', area: '横浜市', department: '総合学科（単位制）', quota: 259, finalApplicants: 306, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '金沢総合', area: '横浜市', department: '総合学科（単位制）', quota: 279, finalApplicants: 352, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '麻生総合', area: '川崎市', department: '総合学科（単位制）', quota: 190, finalApplicants: 94, finalRate: 0.49, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '藤沢総合', area: '藤沢市', department: '総合学科（単位制）', quota: 269, finalApplicants: 320, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秦野総合', area: '秦野市', department: '総合学科（単位制）', quota: 239, finalApplicants: 230, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '座間総合', area: '座間市', department: '総合学科（単位制）', quota: 229, finalApplicants: 269, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横浜市立みなと総合', area: '横浜市立', department: '総合学科（単位制）', quota: 232, finalApplicants: 283, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '横須賀市立横須賀総合', area: '横須賀市立', department: '総合学科（単位制）', quota: 320, finalApplicants: 418, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 専門学科（農業・2校） ---
    { schoolName: '三浦初声', area: '三浦市', department: '農業科（単位制）', quota: 38, finalApplicants: 24, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉田島', area: '開成町', department: '農業科（単位制）', quota: 114, finalApplicants: 77, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 専門学科（家庭・1校） ---
    { schoolName: '吉田島', area: '開成町', department: '家庭科（単位制）', quota: 38, finalApplicants: 32, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 専門学科（理数・1校） ---
    { schoolName: '横浜サイエンスフロンティア', area: '横浜市立', department: '理数科（単位制）', quota: 158, finalApplicants: 243, finalRate: 1.54, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 専門学科（体育・1校） ---
    { schoolName: '相模原弥栄', area: '相模原', department: '体育科（単位制）', quota: 79, finalApplicants: 125, finalRate: 1.58, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 専門学科（音楽・1校） ---
    { schoolName: '相模原弥栄', area: '相模原', department: '音楽科（単位制）', quota: 39, finalApplicants: 52, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 専門学科（美術・1校） ---
    { schoolName: '相模原弥栄', area: '相模原', department: '美術科（単位制）', quota: 39, finalApplicants: 61, finalRate: 1.56, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 専門学科（国際関係・1校。国際科+国際バカロレアコースを計行で集約） ---
    { schoolName: '横浜国際', area: '横浜市', department: '国際科（単位制）', quota: 159, finalApplicants: 231, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 専門学科（総合産業・1校） ---
    { schoolName: '神奈川総合産業', area: '横浜市立', department: '総合産業科（単位制）', quota: 239, finalApplicants: 262, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    // --- 単位制 専門学科（舞台芸術・1校） ---
    { schoolName: '神奈川総合', area: '横浜市', department: '舞台芸術科（単位制）', quota: 30, finalApplicants: 57, finalRate: 1.9, fiscalYear: '令和7年度（2025年度）' },
    // --- 連携募集（2校・既存校への追加募集枠。志願変更を行わないため1/30の値=最終値） ---
    { schoolName: '光陵', area: '横浜中', department: '普通科（連携募集）', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '愛川', area: '県央', department: '普通科（連携募集）', quota: 45, finalApplicants: 43, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1横展開R6第1弾: R6分・sheet1「普通科・クリエイティブスクール」(documents/134290/bessi-3.xlsx)。
    { schoolName: '鶴見', area: '横浜北', department: '普通科', quota: 319, finalApplicants: 411, finalRate: 1.29, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜翠嵐', area: '横浜北', department: '普通科', quota: 359, finalApplicants: 770, finalRate: 2.14, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '城郷', area: '横浜北', department: '普通科', quota: 239, finalApplicants: 345, finalRate: 1.44, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '港北', area: '横浜北', department: '普通科', quota: 319, finalApplicants: 423, finalRate: 1.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新羽', area: '横浜北', department: '普通科', quota: 399, finalApplicants: 478, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '岸根', area: '横浜北', department: '普通科', quota: 319, finalApplicants: 428, finalRate: 1.34, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '霧が丘', area: '横浜北', department: '普通科', quota: 319, finalApplicants: 398, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '白山', area: '横浜北', department: '普通科', quota: 239, finalApplicants: 277, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市ケ尾', area: '横浜北', department: '普通科', quota: 399, finalApplicants: 486, finalRate: 1.22, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '元石川', area: '横浜北', department: '普通科', quota: 359, finalApplicants: 508, finalRate: 1.42, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川和', area: '横浜北', department: '普通科', quota: 319, finalApplicants: 399, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '荏田', area: '横浜北', department: '普通科', quota: 399, finalApplicants: 484, finalRate: 1.21, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新栄', area: '横浜北', department: '普通科', quota: 352, finalApplicants: 445, finalRate: 1.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '希望ケ丘', area: '横浜中', department: '普通科', quota: 359, finalApplicants: 485, finalRate: 1.35, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '旭', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 392, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松陽', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 368, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜瀬谷', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 366, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜平沼', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 433, finalRate: 1.36, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '光陵', area: '横浜中', department: '普通科', quota: 279, finalApplicants: 360, finalRate: 1.29, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '保土ケ谷', area: '横浜中', department: '普通科', quota: 239, finalApplicants: 313, finalRate: 1.31, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '舞岡', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 355, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上矢部', area: '横浜中', department: '普通科', quota: 239, finalApplicants: 270, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '金井', area: '横浜中', department: '普通科', quota: 319, finalApplicants: 369, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜南陵', area: '横浜南', department: '普通科', quota: 239, finalApplicants: 381, finalRate: 1.59, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '永谷', area: '横浜南', department: '普通科', quota: 199, finalApplicants: 91, finalRate: 0.46, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '柏陽', area: '横浜南', department: '普通科', quota: 319, finalApplicants: 444, finalRate: 1.39, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜緑ケ丘', area: '横浜南', department: '普通科', quota: 279, finalApplicants: 444, finalRate: 1.59, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜立野', area: '横浜南', department: '普通科', quota: 239, finalApplicants: 352, finalRate: 1.47, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜氷取沢', area: '横浜南', department: '普通科', quota: 359, finalApplicants: 430, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新城', area: '川崎', department: '普通科', quota: 269, finalApplicants: 389, finalRate: 1.45, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '住吉', area: '川崎', department: '普通科', quota: 359, finalApplicants: 467, finalRate: 1.3, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎北', area: '川崎', department: '普通科', quota: 279, finalApplicants: 321, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多摩', area: '川崎', department: '普通科', quota: 279, finalApplicants: 455, finalRate: 1.63, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '生田', area: '川崎', department: '普通科', quota: 359, finalApplicants: 472, finalRate: 1.31, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '百合丘', area: '川崎', department: '普通科', quota: 359, finalApplicants: 397, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '生田東', area: '川崎', department: '普通科', quota: 319, finalApplicants: 382, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '菅', area: '川崎', department: '普通科', quota: 279, finalApplicants: 305, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '麻生', area: '川崎', department: '普通科', quota: 319, finalApplicants: 345, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横須賀', area: '横須賀・三浦', department: '普通科', quota: 279, finalApplicants: 400, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横須賀大津', area: '横須賀・三浦', department: '普通科', quota: 279, finalApplicants: 329, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '追浜', area: '横須賀・三浦', department: '普通科', quota: 279, finalApplicants: 343, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '津久井浜', area: '横須賀・三浦', department: '普通科', quota: 239, finalApplicants: 268, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '逗子葉山', area: '横須賀・三浦', department: '普通科', quota: 319, finalApplicants: 417, finalRate: 1.31, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鎌倉', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 319, finalApplicants: 484, finalRate: 1.52, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '七里ガ浜', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 359, finalApplicants: 520, finalRate: 1.45, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大船', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 399, finalApplicants: 494, finalRate: 1.24, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深沢', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 199, finalApplicants: 221, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '湘南', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 359, finalApplicants: 586, finalRate: 1.63, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '藤沢西', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 319, finalApplicants: 417, finalRate: 1.31, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '湘南台', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 239, finalApplicants: 282, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '茅ケ崎', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 319, finalApplicants: 393, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '茅ケ崎北陵', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 279, finalApplicants: 368, finalRate: 1.32, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鶴嶺', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 384, finalApplicants: 470, finalRate: 1.22, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '茅ケ崎西浜', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 359, finalApplicants: 450, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '寒川', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 279, finalApplicants: 152, finalRate: 0.54, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '平塚江南', area: '平塚・秦野・伊勢原', department: '普通科', quota: 319, finalApplicants: 392, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高浜', area: '平塚・秦野・伊勢原', department: '普通科', quota: 232, finalApplicants: 253, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大磯', area: '平塚・秦野・伊勢原', department: '普通科', quota: 279, finalApplicants: 351, finalRate: 1.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '二宮', area: '平塚・秦野・伊勢原', department: '普通科', quota: 239, finalApplicants: 252, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秦野', area: '平塚・秦野・伊勢原', department: '普通科', quota: 359, finalApplicants: 385, finalRate: 1.07, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秦野曽屋', area: '平塚・秦野・伊勢原', department: '普通科', quota: 279, finalApplicants: 293, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊勢原', area: '平塚・秦野・伊勢原', department: '普通科', quota: 229, finalApplicants: 275, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊志田', area: '平塚・秦野・伊勢原', department: '普通科', quota: 269, finalApplicants: 309, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小田原東', area: '県西', department: '普通科', quota: 119, finalApplicants: 100, finalRate: 0.84, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '西湘', area: '県西', department: '普通科', quota: 309, finalApplicants: 362, finalRate: 1.17, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '足柄', area: '県西', department: '普通科', quota: 239, finalApplicants: 231, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '山北', area: '県西', department: '普通科', quota: 199, finalApplicants: 195, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '厚木', area: '県央', department: '普通科', quota: 359, finalApplicants: 506, finalRate: 1.41, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '厚木王子', area: '県央', department: '普通科', quota: 199, finalApplicants: 212, finalRate: 1.07, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '厚木北', area: '県央', department: '普通科', quota: 239, finalApplicants: 240, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '厚木西', area: '県央', department: '普通科', quota: 239, finalApplicants: 249, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '海老名', area: '県央', department: '普通科', quota: 399, finalApplicants: 489, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '有馬', area: '県央', department: '普通科', quota: 319, finalApplicants: 379, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '愛川', area: '県央', department: '普通科', quota: 184, finalApplicants: 131, finalRate: 0.71, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大和', area: '県央', department: '普通科', quota: 279, finalApplicants: 407, finalRate: 1.46, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大和南', area: '県央', department: '普通科', quota: 309, finalApplicants: 327, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大和西', area: '県央', department: '普通科', quota: 279, finalApplicants: 318, finalRate: 1.14, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '座間', area: '県央', department: '普通科', quota: 279, finalApplicants: 362, finalRate: 1.3, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '綾瀬', area: '県央', department: '普通科', quota: 319, finalApplicants: 344, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '綾瀬西', area: '県央', department: '普通科', quota: 319, finalApplicants: 331, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '麻溝台', area: '相模原', department: '普通科', quota: 359, finalApplicants: 414, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上鶴間', area: '相模原', department: '普通科', quota: 279, finalApplicants: 332, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上溝', area: '相模原', department: '普通科', quota: 239, finalApplicants: 293, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '相模原', area: '相模原', department: '普通科', quota: 279, finalApplicants: 349, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上溝南', area: '相模原', department: '普通科', quota: 359, finalApplicants: 393, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '橋本', area: '相模原', department: '普通科', quota: 269, finalApplicants: 322, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '相模田名', area: '相模原', department: '普通科', quota: 279, finalApplicants: 343, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '津久井', area: '相模原', department: '普通科', quota: 159, finalApplicants: 87, finalRate: 0.55, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜市立桜丘', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 442, finalRate: 1.39, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜市立南', area: '横浜市立', department: '普通科', quota: 38, finalApplicants: 59, finalRate: 1.55, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜市立金沢', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 412, finalRate: 1.3, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '普通科', quota: 198, finalApplicants: 237, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立高津', area: '川崎市立', department: '普通科', quota: 278, finalApplicants: 438, finalRate: 1.58, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '普通科', quota: 118, finalApplicants: 169, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '田奈', area: '横浜市', department: '普通科（クリエイティブスクール）', quota: 159, finalApplicants: 73, finalRate: 0.46, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '釜利谷', area: '横浜市', department: '普通科（クリエイティブスクール）', quota: 239, finalApplicants: 169, finalRate: 0.71, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横須賀南', area: '横須賀市', department: '普通科（クリエイティブスクール）', quota: 119, finalApplicants: 113, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大井', area: '大井町', department: '普通科（クリエイティブスクール）', quota: 79, finalApplicants: 78, finalRate: 0.99, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大和東', area: '大和市', department: '普通科（クリエイティブスクール）', quota: 239, finalApplicants: 252, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    // 掛-1横展開R6第2弾: R6分・sheet2「専門学科」(documents/134290/bessi-3.xlsx)。
    { schoolName: '平塚農商', area: '平塚', department: '農業科', quota: 156, finalApplicants: 167, finalRate: 1.07, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '相原', area: '相模原', department: '農業科', quota: 117, finalApplicants: 147, finalRate: 1.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '中央農業', area: '海老名', department: '農業科', quota: 197, finalApplicants: 182, finalRate: 0.92, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '神奈川工業', area: '横浜市', department: '工業科', quota: 316, finalApplicants: 371, finalRate: 1.17, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '商工', area: '藤沢市', department: '工業科', quota: 119, finalApplicants: 121, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '磯子工業', area: '横浜市', department: '工業科', quota: 236, finalApplicants: 171, finalRate: 0.72, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎工科', area: '川崎市', department: '工業科', quota: 239, finalApplicants: 191, finalRate: 0.8, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '向の岡工業', area: '川崎市', department: '工業科', quota: 237, finalApplicants: 194, finalRate: 0.82, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横須賀工業', area: '横須賀市', department: '工業科', quota: 236, finalApplicants: 207, finalRate: 0.88, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '平塚工科', area: '平塚市', department: '工業科', quota: 239, finalApplicants: 157, finalRate: 0.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '藤沢工科', area: '藤沢市', department: '工業科', quota: 239, finalApplicants: 193, finalRate: 0.81, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小田原城北工業', area: '小田原市', department: '工業科', quota: 156, finalApplicants: 118, finalRate: 0.76, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立川崎総合科学', area: '川崎市立', department: '工業科', quota: 195, finalApplicants: 216, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '商工', area: '藤沢市', department: '商業科', quota: 119, finalApplicants: 124, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '平塚農商', area: '平塚', department: '商業科', quota: 159, finalApplicants: 163, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小田原東', area: '県西', department: '商業科', quota: 119, finalApplicants: 66, finalRate: 0.55, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '相原', area: '相模原', department: '商業科', quota: 119, finalApplicants: 156, finalRate: 1.31, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '厚木王子', area: '県央', department: '商業科', quota: 159, finalApplicants: 174, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '商業科', quota: 238, finalApplicants: 289, finalRate: 1.21, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '商業科', quota: 118, finalApplicants: 140, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '海洋科学', area: '横須賀市', department: '水産科', quota: 156, finalApplicants: 131, finalRate: 0.84, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '家庭科', quota: 39, finalApplicants: 44, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '二俣川看護福祉', area: '横浜中', department: '看護科', quota: 79, finalApplicants: 69, finalRate: 0.87, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '二俣川看護福祉', area: '横浜中', department: '福祉科', quota: 79, finalApplicants: 45, finalRate: 0.57, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横須賀南', area: '横須賀市', department: '福祉科', quota: 79, finalApplicants: 43, finalRate: 0.54, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '津久井', area: '相模原', department: '福祉科', quota: 39, finalApplicants: 8, finalRate: 0.21, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '福祉科', quota: 39, finalApplicants: 33, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立川崎総合科学', area: '川崎市立', department: '理数科', quota: 39, finalApplicants: 42, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '厚木北', area: '県央', department: '体育科', quota: 39, finalApplicants: 36, finalRate: 0.92, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '体育科', quota: 39, finalApplicants: 56, finalRate: 1.44, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '白山', area: '横浜北', department: '美術科', quota: 39, finalApplicants: 47, finalRate: 1.21, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上矢部', area: '横浜中', department: '美術科', quota: 39, finalApplicants: 44, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '国際科', quota: 35, finalApplicants: 53, finalRate: 1.51, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '国際科', quota: 39, finalApplicants: 64, finalRate: 1.64, fiscalYear: '令和6年度（2024年度）' },
    // 掛-1横展開R6第3弾・kanagawa完結: R6分・sheet3「単位制」(documents/134290/bessi-3.xlsx)。
    { schoolName: '神奈川総合', area: '横浜市', department: '普通科（単位制）', quota: 208, finalApplicants: 308, finalRate: 1.48, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜旭陵', area: '横浜市', department: '普通科（単位制）', quota: 232, finalApplicants: 210, finalRate: 0.91, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜緑園', area: '横浜市', department: '普通科（単位制）', quota: 279, finalApplicants: 360, finalRate: 1.29, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜桜陽', area: '横浜市', department: '普通科（単位制）', quota: 270, finalApplicants: 285, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜清陵', area: '横浜市', department: '普通科（単位制）', quota: 266, finalApplicants: 400, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜栄', area: '横浜市', department: '普通科（単位制）', quota: 319, finalApplicants: 402, finalRate: 1.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '川崎', area: '川崎市', department: '普通科（単位制）', quota: 223, finalApplicants: 297, finalRate: 1.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大師', area: '川崎市', department: '普通科（単位制）', quota: 229, finalApplicants: 202, finalRate: 0.88, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三浦初声', area: '三浦市', department: '普通科（単位制）', quota: 199, finalApplicants: 130, finalRate: 0.65, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '藤沢清流', area: '藤沢市', department: '普通科（単位制）', quota: 279, finalApplicants: 329, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '平塚湘風', area: '平塚市', department: '普通科（単位制）', quota: 199, finalApplicants: 188, finalRate: 0.94, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小田原', area: '小田原市', department: '普通科（単位制）', quota: 319, finalApplicants: 421, finalRate: 1.32, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '厚木清南', area: '県央', department: '普通科（単位制）', quota: 230, finalApplicants: 274, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '相模原城山', area: '相模原', department: '普通科（単位制）', quota: 279, finalApplicants: 333, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '相模原弥栄', area: '相模原', department: '普通科（単位制）', quota: 184, finalApplicants: 218, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜市立東', area: '横浜市立', department: '普通科（単位制）', quota: 268, finalApplicants: 328, finalRate: 1.22, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜市立戸塚', area: '横浜市立', department: '普通科（単位制・一般コース）', quota: 279, finalApplicants: 365, finalRate: 1.31, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜市立戸塚', area: '横浜市立', department: '普通科（単位制・音楽コース）', quota: 39, finalApplicants: 44, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鶴見総合', area: '横浜市', department: '総合学科（単位制）', quota: 219, finalApplicants: 266, finalRate: 1.21, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '金沢総合', area: '横浜市', department: '総合学科（単位制）', quota: 279, finalApplicants: 354, finalRate: 1.27, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '麻生総合', area: '川崎市', department: '総合学科（単位制）', quota: 190, finalApplicants: 86, finalRate: 0.45, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '藤沢総合', area: '藤沢市', department: '総合学科（単位制）', quota: 272, finalApplicants: 318, finalRate: 1.17, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秦野総合', area: '秦野市', department: '総合学科（単位制）', quota: 239, finalApplicants: 239, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '座間総合', area: '座間市', department: '総合学科（単位制）', quota: 229, finalApplicants: 256, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜市立みなと総合', area: '横浜市立', department: '総合学科（単位制）', quota: 232, finalApplicants: 347, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横須賀市立横須賀総合', area: '横須賀市立', department: '総合学科（単位制）', quota: 320, finalApplicants: 423, finalRate: 1.32, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三浦初声', area: '三浦市', department: '農業科（単位制）', quota: 39, finalApplicants: 21, finalRate: 0.54, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '吉田島', area: '開成町', department: '農業科（単位制）', quota: 117, finalApplicants: 88, finalRate: 0.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '吉田島', area: '開成町', department: '家庭科（単位制）', quota: 39, finalApplicants: 38, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜サイエンスフロンティア', area: '横浜市立', department: '理数科（単位制）', quota: 158, finalApplicants: 264, finalRate: 1.67, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '相模原弥栄', area: '相模原', department: '体育科（単位制）', quota: 79, finalApplicants: 89, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '相模原弥栄', area: '相模原', department: '音楽科（単位制）', quota: 39, finalApplicants: 48, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '相模原弥栄', area: '相模原', department: '美術科（単位制）', quota: 39, finalApplicants: 48, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '横浜国際', area: '横浜市', department: '国際科（単位制）', quota: 159, finalApplicants: 206, finalRate: 1.3, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '神奈川総合産業', area: '横浜市立', department: '総合産業科（単位制）', quota: 239, finalApplicants: 261, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '神奈川総合', area: '横浜市', department: '舞台芸術科（単位制）', quota: 30, finalApplicants: 45, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '光陵', area: '横浜中', department: '普通科（連携募集）', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '愛川', area: '県央', department: '普通科（連携募集）', quota: 45, finalApplicants: 37, finalRate: 0.82, fiscalYear: '令和6年度（2024年度）' },
    // 掛-1横展開R5第1弾: R5分・sheet1「普通科・クリエイティブスクール」(documents/95719/bessi3.xlsx・Wayback Machine経由)。
    { schoolName: '鶴見', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 436, finalRate: 1.37, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜翠嵐', area: '横浜北', department: '普通科', quota: 358, finalApplicants: 708, finalRate: 1.98, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '城郷', area: '横浜北', department: '普通科', quota: 238, finalApplicants: 341, finalRate: 1.43, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '港北', area: '横浜北', department: '普通科', quota: 358, finalApplicants: 511, finalRate: 1.43, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新羽', area: '横浜北', department: '普通科', quota: 398, finalApplicants: 486, finalRate: 1.22, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '岸根', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 473, finalRate: 1.49, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '霧が丘', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 424, finalRate: 1.33, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '白山', area: '横浜北', department: '普通科', quota: 318, finalApplicants: 284, finalRate: 0.89, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市ケ尾', area: '横浜北', department: '普通科', quota: 398, finalApplicants: 513, finalRate: 1.29, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '元石川', area: '横浜北', department: '普通科', quota: 358, finalApplicants: 481, finalRate: 1.34, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川和', area: '横浜北', department: '普通科', quota: 358, finalApplicants: 431, finalRate: 1.2, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '荏田', area: '横浜北', department: '普通科', quota: 398, finalApplicants: 531, finalRate: 1.33, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新栄', area: '横浜北', department: '普通科', quota: 351, finalApplicants: 358, finalRate: 1.02, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '希望ケ丘', area: '横浜中', department: '普通科', quota: 358, finalApplicants: 550, finalRate: 1.54, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '旭', area: '横浜中', department: '普通科', quota: 358, finalApplicants: 395, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松陽', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 335, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜瀬谷', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 400, finalRate: 1.26, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜平沼', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 400, finalRate: 1.26, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '光陵', area: '横浜中', department: '普通科', quota: 278, finalApplicants: 404, finalRate: 1.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '保土ケ谷', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 348, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '舞岡', area: '横浜中', department: '普通科', quota: 358, finalApplicants: 491, finalRate: 1.37, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '上矢部', area: '横浜中', department: '普通科', quota: 238, finalApplicants: 287, finalRate: 1.21, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '金井', area: '横浜中', department: '普通科', quota: 318, finalApplicants: 436, finalRate: 1.37, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜南陵', area: '横浜南', department: '普通科', quota: 278, finalApplicants: 339, finalRate: 1.22, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '永谷', area: '横浜南', department: '普通科', quota: 199, finalApplicants: 90, finalRate: 0.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '柏陽', area: '横浜南', department: '普通科', quota: 318, finalApplicants: 458, finalRate: 1.44, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜緑ケ丘', area: '横浜南', department: '普通科', quota: 278, finalApplicants: 391, finalRate: 1.41, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜立野', area: '横浜南', department: '普通科', quota: 278, finalApplicants: 341, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜氷取沢', area: '横浜南', department: '普通科', quota: 358, finalApplicants: 487, finalRate: 1.36, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新城', area: '川崎', department: '普通科', quota: 268, finalApplicants: 423, finalRate: 1.58, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '住吉', area: '川崎', department: '普通科', quota: 358, finalApplicants: 551, finalRate: 1.54, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎北', area: '川崎', department: '普通科', quota: 278, finalApplicants: 286, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '多摩', area: '川崎', department: '普通科', quota: 278, finalApplicants: 519, finalRate: 1.87, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '生田', area: '川崎', department: '普通科', quota: 398, finalApplicants: 494, finalRate: 1.24, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '百合丘', area: '川崎', department: '普通科', quota: 398, finalApplicants: 501, finalRate: 1.26, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '生田東', area: '川崎', department: '普通科', quota: 318, finalApplicants: 340, finalRate: 1.07, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '菅', area: '川崎', department: '普通科', quota: 358, finalApplicants: 340, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '麻生', area: '川崎', department: '普通科', quota: 318, finalApplicants: 353, finalRate: 1.11, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横須賀', area: '横須賀・三浦', department: '普通科', quota: 278, finalApplicants: 335, finalRate: 1.21, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横須賀大津', area: '横須賀・三浦', department: '普通科', quota: 278, finalApplicants: 347, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '追浜', area: '横須賀・三浦', department: '普通科', quota: 318, finalApplicants: 385, finalRate: 1.21, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '津久井浜', area: '横須賀・三浦', department: '普通科', quota: 238, finalApplicants: 291, finalRate: 1.22, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '逗子葉山', area: '横須賀・三浦', department: '普通科', quota: 318, finalApplicants: 417, finalRate: 1.31, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鎌倉', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 358, finalApplicants: 449, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '七里ガ浜', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 358, finalApplicants: 516, finalRate: 1.44, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大船', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 398, finalApplicants: 488, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '深沢', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 238, finalApplicants: 270, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '湘南', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 358, finalApplicants: 572, finalRate: 1.6, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '藤沢西', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 318, finalApplicants: 414, finalRate: 1.3, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '湘南台', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 238, finalApplicants: 288, finalRate: 1.21, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '茅ケ崎', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 278, finalApplicants: 381, finalRate: 1.37, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '茅ケ崎北陵', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 278, finalApplicants: 379, finalRate: 1.36, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鶴嶺', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 383, finalApplicants: 485, finalRate: 1.27, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '茅ケ崎西浜', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 358, finalApplicants: 382, finalRate: 1.07, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '寒川', area: '鎌倉・藤沢・茅ヶ崎', department: '普通科', quota: 278, finalApplicants: 214, finalRate: 0.77, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '平塚江南', area: '平塚・秦野・伊勢原', department: '普通科', quota: 318, finalApplicants: 377, finalRate: 1.19, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高浜', area: '平塚・秦野・伊勢原', department: '普通科', quota: 231, finalApplicants: 247, finalRate: 1.07, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大磯', area: '平塚・秦野・伊勢原', department: '普通科', quota: 278, finalApplicants: 327, finalRate: 1.18, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '二宮', area: '平塚・秦野・伊勢原', department: '普通科', quota: 238, finalApplicants: 219, finalRate: 0.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秦野', area: '平塚・秦野・伊勢原', department: '普通科', quota: 358, finalApplicants: 404, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秦野曽屋', area: '平塚・秦野・伊勢原', department: '普通科', quota: 278, finalApplicants: 301, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊勢原', area: '平塚・秦野・伊勢原', department: '普通科', quota: 228, finalApplicants: 267, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊志田', area: '平塚・秦野・伊勢原', department: '普通科', quota: 308, finalApplicants: 322, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小田原東', area: '県西', department: '普通科', quota: 118, finalApplicants: 101, finalRate: 0.86, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '西湘', area: '県西', department: '普通科', quota: 308, finalApplicants: 336, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '足柄', area: '県西', department: '普通科', quota: 238, finalApplicants: 246, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '山北', area: '県西', department: '普通科', quota: 198, finalApplicants: 186, finalRate: 0.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '厚木', area: '県央', department: '普通科', quota: 358, finalApplicants: 446, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '厚木東', area: '県央', department: '普通科', quota: 198, finalApplicants: 239, finalRate: 1.21, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '厚木北', area: '県央', department: '普通科', quota: 238, finalApplicants: 258, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '厚木西', area: '県央', department: '普通科', quota: 238, finalApplicants: 267, finalRate: 1.12, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '海老名', area: '県央', department: '普通科', quota: 398, finalApplicants: 538, finalRate: 1.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '有馬', area: '県央', department: '普通科', quota: 318, finalApplicants: 355, finalRate: 1.12, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '愛川', area: '県央', department: '普通科', quota: 183, finalApplicants: 169, finalRate: 0.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大和', area: '県央', department: '普通科', quota: 278, finalApplicants: 426, finalRate: 1.53, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大和南', area: '県央', department: '普通科', quota: 308, finalApplicants: 328, finalRate: 1.06, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大和西', area: '県央', department: '普通科', quota: 278, finalApplicants: 341, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '座間', area: '県央', department: '普通科', quota: 318, finalApplicants: 350, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '綾瀬', area: '県央', department: '普通科', quota: 318, finalApplicants: 311, finalRate: 0.98, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '綾瀬西', area: '県央', department: '普通科', quota: 318, finalApplicants: 309, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '麻溝台', area: '相模原', department: '普通科', quota: 358, finalApplicants: 418, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '上鶴間', area: '相模原', department: '普通科', quota: 318, finalApplicants: 345, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '上溝', area: '相模原', department: '普通科', quota: 238, finalApplicants: 293, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '相模原', area: '相模原', department: '普通科', quota: 278, finalApplicants: 339, finalRate: 1.22, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '上溝南', area: '相模原', department: '普通科', quota: 358, finalApplicants: 446, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '橋本', area: '相模原', department: '普通科', quota: 268, finalApplicants: 275, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '相模田名', area: '相模原', department: '普通科', quota: 318, finalApplicants: 344, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '津久井', area: '相模原', department: '普通科', quota: 158, finalApplicants: 105, finalRate: 0.66, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜市立桜丘', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 403, finalRate: 1.27, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜市立南', area: '横浜市立', department: '普通科', quota: 38, finalApplicants: 52, finalRate: 1.37, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜市立金沢', area: '横浜市立', department: '普通科', quota: 318, finalApplicants: 430, finalRate: 1.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '普通科', quota: 198, finalApplicants: 280, finalRate: 1.41, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立高津', area: '川崎市立', department: '普通科', quota: 278, finalApplicants: 377, finalRate: 1.36, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '普通科', quota: 118, finalApplicants: 155, finalRate: 1.31, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '田奈', area: '横浜市', department: '普通科（クリエイティブスクール）', quota: 158, finalApplicants: 56, finalRate: 0.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '釜利谷', area: '横浜市', department: '普通科（クリエイティブスクール）', quota: 238, finalApplicants: 182, finalRate: 0.76, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横須賀南', area: '横須賀市', department: '普通科（クリエイティブスクール）', quota: 118, finalApplicants: 124, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大井', area: '大井町', department: '普通科（クリエイティブスクール）', quota: 158, finalApplicants: 79, finalRate: 0.5, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大和東', area: '大和市', department: '普通科（クリエイティブスクール）', quota: 238, finalApplicants: 235, finalRate: 0.99, fiscalYear: '令和5年度（2023年度）' },
    // 掛-1横展開R5第2弾: R5分・sheet2「専門学科」(documents/95719/bessi3.xlsx・Wayback Machine経由)。
    { schoolName: '平塚農商', area: '平塚', department: '農業科', quota: 156, finalApplicants: 159, finalRate: 1.02, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '相原', area: '相模原', department: '農業科', quota: 117, finalApplicants: 129, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '中央農業', area: '海老名', department: '農業科', quota: 195, finalApplicants: 173, finalRate: 0.89, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '神奈川工業', area: '横浜市', department: '工業科', quota: 313, finalApplicants: 399, finalRate: 1.27, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '商工', area: '藤沢市', department: '工業科', quota: 118, finalApplicants: 106, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '磯子工業', area: '横浜市', department: '工業科', quota: 234, finalApplicants: 171, finalRate: 0.73, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎工科', area: '川崎市', department: '工業科', quota: 238, finalApplicants: 161, finalRate: 0.68, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '向の岡工業', area: '川崎市', department: '工業科', quota: 234, finalApplicants: 172, finalRate: 0.74, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横須賀工業', area: '横須賀市', department: '工業科', quota: 234, finalApplicants: 182, finalRate: 0.78, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '平塚工科', area: '平塚市', department: '工業科', quota: 238, finalApplicants: 185, finalRate: 0.78, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '藤沢工科', area: '藤沢市', department: '工業科', quota: 238, finalApplicants: 219, finalRate: 0.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小田原城北工業', area: '小田原市', department: '工業科', quota: 234, finalApplicants: 160, finalRate: 0.68, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立川崎総合科学', area: '川崎市立', department: '工業科', quota: 195, finalApplicants: 235, finalRate: 1.21, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '商工', area: '藤沢市', department: '商業科', quota: 118, finalApplicants: 127, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '平塚農商', area: '平塚', department: '商業科', quota: 158, finalApplicants: 147, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小田原東', area: '県西', department: '商業科', quota: 118, finalApplicants: 84, finalRate: 0.71, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '相原', area: '相模原', department: '商業科', quota: 118, finalApplicants: 122, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '厚木商業', area: '県央', department: '商業科', quota: 158, finalApplicants: 184, finalRate: 1.16, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '商業科', quota: 238, finalApplicants: 273, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立幸', area: '川崎市立', department: '商業科', quota: 118, finalApplicants: 132, finalRate: 1.12, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '海洋科学', area: '横須賀市', department: '水産科', quota: 156, finalApplicants: 104, finalRate: 0.67, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '家庭科', quota: 39, finalApplicants: 37, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '二俣川看護福祉', area: '横浜中', department: '看護科', quota: 78, finalApplicants: 74, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '二俣川看護福祉', area: '横浜中', department: '福祉科', quota: 78, finalApplicants: 28, finalRate: 0.36, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横須賀南', area: '横須賀市', department: '福祉科', quota: 78, finalApplicants: 47, finalRate: 0.6, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '津久井', area: '相模原', department: '福祉科', quota: 39, finalApplicants: 29, finalRate: 0.74, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立川崎', area: '川崎市立', department: '福祉科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立川崎総合科学', area: '川崎市立', department: '理数科', quota: 39, finalApplicants: 54, finalRate: 1.38, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '厚木北', area: '県央', department: '体育科', quota: 39, finalApplicants: 44, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '体育科', quota: 39, finalApplicants: 46, finalRate: 1.18, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '白山', area: '横浜北', department: '美術科', quota: 39, finalApplicants: 58, finalRate: 1.49, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '上矢部', area: '横浜中', department: '美術科', quota: 39, finalApplicants: 40, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '横浜市立横浜商業', area: '横浜市立', department: '国際科', quota: 35, finalApplicants: 36, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '川崎市立橘', area: '川崎市立', department: '国際科', quota: 39, finalApplicants: 58, finalRate: 1.49, fiscalYear: '令和5年度（2023年度）' },
  ],
};
