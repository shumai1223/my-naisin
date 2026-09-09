import type { PrefectureStageLedgerFile } from '@/lib/stage-ledger';

/**
 * 千葉県 段階台帳（T-Y11F §5順序#7・パイロット1県目・**全9頁を完全収録**）。
 *
 * 一次ソース: 千葉県教育委員会「令和8年度 公立高等学校 一般入学者選抜等 入学許可候補者数
 * 一覧＜その１〉〜＜その８＞」（特別入学者選抜及び地域連携アクティブスクールの入学者選抜を
 * 含む・全9頁）のうち1〜6頁目「1．県立全日制」（学校番号1〜121・176レコード）＋7頁目
 * 「2．市立全日制」（学校番号市1〜市7・12レコード）＋8頁目「3．県立定時制」（学校番号定1〜
 * 定16・22レコード）。9頁目は脚注のみで学校別データを含まないため実質的に全学校を収録済み。
 * https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2025/documents/r8kyokaippan.pdf
 *
 * ⚠️pdftotextは数値は抽出できたが学校名・学科名のラベルが欠落（他県で頻出のフォント欠落と
 * 同型）のため、pdftoppm 200〜300dpiのビジョン解析で全176レコードを転記した（PIL crop
 * による部分拡大で複数回クロス確認済み）。3頁目は東葛飾のように募集定員(320)と募集人員(240)
 * が異なる校があり、既存`competition-rates/chiba.ts`と同じ規律で募集人員をquotaに採用した。
 * 東金国際教養科（4頁目）・茂原樟陽環境化学科・木更津東普通科（5頁目）のように、志願者数・
 * 受検者数を上回る合格者数レコードが複数校で確認されている（欠員補充等の推測は本文コメントに
 * 留め、独自の補正はしない＝Y-0）。
 *
 * 既存の`src/data/competition-rates/chiba.ts`（倍率パイプライン）とquota・
 * applicantsConfirmed（同ファイルのfinalApplicantsに相当）が独立した情報源から取得したにも
 * かかわらず完全一致することを確認済み（例: 千葉普通科quota240/applicants331・
 * 千葉女子普通科quota240/applicants234・検見川普通科quota320/applicants514・
 * 船橋普通科quota320/applicants618・薬園台普通科quota280/applicants480）——これは
 * 段階台帳が既存データと矛盾しない独立した裏取りになっている。
 *
 * ⚠️新規フィールドfinalPassers（入学許可候補者数）は既存のどのデータセットにも無い情報。
 * 千葉工業工業化学科・市川工業建築科のようにtestTakersConfirmed<finalPassersとなる逆転
 * レコードが複数存在するが、これは資料の印字値をそのまま転記した結果であり（欠員補充等で
 * quotaまで合格者を充足する運用と推測されるが、推測は本文コメントに留め独自の補正はしない
 * ＝Y-0）、数値自体は原資料どおり正確に転記している。
 *
 * 6頁目末尾の「県立全日制 合計」（quota26,960/applicants29,594/testTakers29,359/
 * finalPassers25,085）、7頁目末尾の「市立全日制 合計」（quota1,920/applicants2,414/
 * testTakers2,402/finalPassers1,920）、8頁目末尾の「県立定時制 合計」＝「公立定時制 合計」
 * （quota1,237/applicants821/testTakers809/finalPassers744、千葉県には市立定時制が無いため
 * 両者は同値）、そして資料全体の「総合計」（quota30,117/applicants32,829/testTakers32,570/
 * finalPassers27,749）まで**4段階すべて**で、210レコード全数の機械集計が完全一致した
 * （初回転記で一致・再修正なし）——**資料全体（全日制＋定時制・県立＋市立）についてcoverage=
 * 'complete'に格上げ**。9頁目は脚注のみで学校別データを含まないことを確認済み。
 *
 * ⚠️掛-1（令和7年度・パイロット）: R7の一次資料「令和7年度公立高等学校一般入学者選抜等
 * 入学許可候補者数一覧＜その1＞」（`r07kyoka01.pdf`・全9頁・県教委発表の全日制合計27,964人・
 * 定時制699人・通信制175人と整合する年度）の1頁目（学校番号1〜25・35レコード）のみ収録した
 * （coverage='partial'扱い・R7全体はまだ1/9頁）。R8と学校・学科構成が完全一致しており
 * （学校再編0件）、quota/applicantsConfirmedは既存`competition-rates/chiba.ts`のR7エントリ
 * （fiscalYear指定）と35/35件で完全一致を確認済み。段階台帳で初めて`fiscalYear`フィールドを
 * 使った多年度収録の実例——スキーマが最初から多年度対応で設計されていたため、コード変更は
 * 一切不要でデータ追加のみで対応できた。
 *
 * 🔁訂正（2026-09-09）: 「千葉 普通科」（quota240・finalPassers241）が1名だけquotaを超過する
 * ことが判明した。R8では210レコード全数が`finalPassers≤quota`を満たしており、以前のコメント
 * （saitama.ts参照）で「chibaでは常に成立していた」と記録していたが、これはR7データを
 * 見ていなかった時点の誤った一般化だった。saitamaの上尾（quota238→244）と同型の合格ボーダー
 * 同点者運用と推測されるが、同一県内でも年度によって起こったり起こらなかったりする——
 * 「finalPassers≤quota」はどの県・どの年度でも普遍的な制約ではないと最終的に確定した。
 *
 * 🔁掛-1続き（2頁目・学校番号26〜53・35レコード追加）: `r07kyoka01.pdf`はExcel由来PDFで
 * pdftotextは数値のみ抽出しラベル欠落（-layout有無とも列がずれる）のためpdftoppm 200dpi
 * ビジョン解析を使用したが、画質・文字とも明瞭で拡大クロップ不要だった。列構成は
 * [学校番号/学校名/学科名/募集定員/募集人員/志願者確定数/受検者確定数/志願取消者数/
 * 入学許可候補者数(一般等+海外+外国人+中国+成蓮の内訳)/合計]で、quota=募集人員・
 * applicantsConfirmed=志願者確定数・testTakersConfirmed=受検者確定数・finalPassers=
 * 合計列をそのまま採用。R8ページ2と学校・学科構成が完全一致（船橋〜松戸馬橋の28校35レコード・
 * 学校再編0件）。quota/applicantsConfirmedは既存`competition-rates/chiba.ts`のR7エントリと
 * 35/35件で完全一致を確認済み（この資料には区分ごとの頁末尾小計が無いためofficialSubtotals
 * との突合は資料全体の総合計でのみ行う）。累計70レコード（R7）。
 *
 * 🔁掛-1続き（3頁目・学校番号54〜77・35レコード追加）: R8ページ3と同じ学校番号範囲・
 * 学校構成（東葛飾〜富里の27校35レコード・学校再編0件）。既存`competition-rates/chiba.ts`
 * のR7エントリと35/35件で完全一致を確認済み。**新種の逆転パターンを発見**: 流山（園芸科）
 * はapplicantsConfirmed108・testTakersConfirmed108に対しfinalPassers115、成田西陵
 * （土木造園科）もapplicantsConfirmed31・testTakersConfirmed31に対しfinalPassers36と、
 * 従来の「finalPassers>testTakersConfirmed」型の逆転（欠員補充等と推測）とは異なり、
 * **finalPassers>applicantsConfirmedそのもの**（志願者確定数自体を最終合格者数が上回る）
 * という一段強い逆転が確認された（特別入学者選抜等、志願者確定数に含まれない別枠の合格者が
 * 合計列に合算されている可能性と推測されるが、推測に留め独自の補正はしない＝Y-0）。累計
 * 105レコード（R7）。
 *
 * 🔁掛-1続き（4頁目・学校番号78〜98・81は欠番・35レコード追加）: R8ページ4と同じ欠番
 * パターン（佐倉〜大網の27校35レコード・学校再編0件）。既存`competition-rates/chiba.ts`の
 * R7エントリと35/35件で完全一致を確認済み。**「finalPassers>applicantsConfirmed」の逆転
 * パターンがこの頁だけで3件**（佐原理数科17→25・東総工業電気科31→36・東総工業情報技術科
 * 23→26）とさらに多数発見され、3頁目の2件と合わせ計5件に達した——単発の例外ではなく
 * **一定の頻度で起こる構造的な現象**（特別入学者選抜等の別枠合算と推測）と認識を改める。
 * 累計140レコード（R7）。
 *
 * 🔁掛-1続き（5頁目・学校番号99〜120・35レコード追加）: R8ページ5と同じ学校構成（九十九里
 * 〜姉崎の22校35レコード・学校再編0件）。既存`competition-rates/chiba.ts`のR7エントリと
 * 35/35件で完全一致を確認済み。この頁は逆転パターン（finalPassers>applicantsConfirmed）
 * 0件・quota超過0件で、5頁のうち初めて異常値の無い頁だった。累計175レコード（R7）。
 *
 * 🔁掛-1続き（6頁目・学校番号121・1レコード追加＝「1．県立全日制」区分が完結）: 市原八幡
 * 1校を追加し累計176レコード（R7）に到達。既存`competition-rates/chiba.ts`のR7エントリと
 * 完全一致。**6頁目末尾に「県立全日制 合計」（R7版・募集人員27,800/志願者確定数31,437/
 * 受検者確定数31,183/合計26,044）が印字されており、176レコード全数の機械集計が4系列
 * （quota=27,800・applicantsConfirmed=31,437・testTakersConfirmed=31,183・
 * finalPassers=26,044）すべてと一発で完全一致した**（R8の官報subtotalはapplicantsConfirmed
 * が印字されず参考値扱いだったのに対し、R7のこの資料は志願者確定数そのものが印字されている
 * ため4系列とも真の一次資料突合になる）。R8で確立した「区分の総合計との
 * 完全突合」検証をR7（掛-1）でも初めて再現でき、1〜6頁目（県立全日制）の収録漏れ・重複が
 * 無いことを機械的に証明できた。
 *
 * 🔁掛-1続き（7頁目「2．市立全日制」・学校番号市1〜市7・12レコード追加＝累計188レコード）:
 * 市立千葉〜市立銚子の7校12レコードを追加。既存`competition-rates/chiba.ts`のR7エントリと
 * 12/12件で完全一致。7頁目末尾には「市立全日制 合計」（R7版・quota1,920/applicants2,417/
 * testTakers2,400/final1,920）と、県立＋市立を合わせた「公立全日制 合計」（R7版・
 * quota29,720/applicants33,854/testTakers33,583/final27,964）の2段階が印字されており、
 * 188レコード全数の機械集計が両方とも4系列すべてで完全一致した——県立全日制176件との
 * 二重の検算（区分単独＋県立市立合算）が揃って外れなく成立し、R7（掛-1）でも「全日制」
 * 区分全体（県立＋市立）の収録漏れ・重複が無いことを証明できた。残るは定時制（8〜9頁目）。
 */

export const CHIBA_STAGE_LEDGER: PrefectureStageLedgerFile = {
  prefectureCode: 'chiba',
  sources: [
    {
      url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2025/documents/r8kyokaippan.pdf',
      docTitle: '千葉県教育委員会 令和8年度公立高等学校一般入学者選抜等入学許可候補者数一覧＜その1＞〜＜その8＞（全9頁中1〜8頁目・9頁目は脚注のみ）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
    {
      url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2024/koukou/documents/r07kyoka01.pdf',
      docTitle: '千葉県教育委員会 令和7年度公立高等学校一般入学者選抜等入学許可候補者数一覧＜その1＞（1頁目のみ）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '県立全日制R8（1〜6頁目・学校番号1〜121・176レコード）',
      '市立全日制R8（7頁目・学校番号市1〜市7・12レコード）',
      '県立定時制R8（8頁目・学校番号定1〜定16・22レコード）',
      '県立全日制R7（1〜6頁目・学校番号1〜121・176レコード・掛-1・区分完結）',
      '市立全日制R7（7頁目・学校番号市1〜市7・12レコード・掛-1・「全日制」区分完結）',
    ],
    pendingDepartments: ['R7の残り（定時制＝8〜9頁目）'],
    note: 'R8は資料全体（一般入学者選抜等・全日制＋定時制・県立＋市立）を完全収録し4段階の公表計と完全一致。R7は1〜7頁目で「全日制」区分（県立＋市立）が完結（掛-1・累計188レコード）し、「県立全日制 合計（R7）」「市立全日制 合計（R7）」「公立全日制 合計（R7）」の3段階全てで4系列完全一致も確認済み。',
  },
  records: [
    { schoolName: '千葉', department: '普通科', quota: 240, applicantsConfirmed: 331, testTakersConfirmed: 321, finalPassers: 240 },
    { schoolName: '千葉女子', department: '普通科', quota: 240, applicantsConfirmed: 234, testTakersConfirmed: 230, finalPassers: 229 },
    { schoolName: '千葉女子', department: '家政科', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '千葉東', department: '普通科', quota: 320, applicantsConfirmed: 448, testTakersConfirmed: 448, finalPassers: 320 },
    { schoolName: '千葉商業', department: '商業科・情報処理科', quota: 320, applicantsConfirmed: 359, testTakersConfirmed: 357, finalPassers: 320 },
    { schoolName: '京葉工業', department: '機械科', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '京葉工業', department: '電子工業科', quota: 80, applicantsConfirmed: 60, testTakersConfirmed: 60, finalPassers: 60 },
    { schoolName: '京葉工業', department: '設備システム科', quota: 40, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 29 },
    { schoolName: '京葉工業', department: '建設科', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '千葉工業', department: '電子機械科', quota: 40, applicantsConfirmed: 55, testTakersConfirmed: 54, finalPassers: 40 },
    { schoolName: '千葉工業', department: '電気科', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 40 },
    { schoolName: '千葉工業', department: '情報技術科', quota: 40, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '千葉工業', department: '工業化学科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 38, finalPassers: 40 },
    { schoolName: '千葉工業', department: '理数工学科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 30, finalPassers: 32 },
    { schoolName: '千葉南', department: '普通科', quota: 320, applicantsConfirmed: 340, testTakersConfirmed: 338, finalPassers: 320 },
    { schoolName: '検見川', department: '普通科', quota: 320, applicantsConfirmed: 514, testTakersConfirmed: 508, finalPassers: 320 },
    { schoolName: '千葉北', department: '普通科', quota: 280, applicantsConfirmed: 278, testTakersConfirmed: 278, finalPassers: 278 },
    { schoolName: '若松', department: '普通科', quota: 320, applicantsConfirmed: 324, testTakersConfirmed: 324, finalPassers: 320 },
    { schoolName: '千城台', department: '普通科', quota: 280, applicantsConfirmed: 283, testTakersConfirmed: 282, finalPassers: 280 },
    { schoolName: '生浜', department: '普通科', quota: 80, applicantsConfirmed: 88, testTakersConfirmed: 87, finalPassers: 80 },
    { schoolName: '磯辺', department: '普通科', quota: 320, applicantsConfirmed: 447, testTakersConfirmed: 447, finalPassers: 320 },
    { schoolName: '泉', department: '普通科', quota: 120, applicantsConfirmed: 91, testTakersConfirmed: 91, finalPassers: 90 },
    { schoolName: '幕張総合', department: '総合学科', quota: 640, applicantsConfirmed: 910, testTakersConfirmed: 903, finalPassers: 640 },
    { schoolName: '幕張総合', department: '看護科', quota: 40, applicantsConfirmed: 58, testTakersConfirmed: 58, finalPassers: 40 },
    { schoolName: '柏井', department: '普通科', quota: 200, applicantsConfirmed: 240, testTakersConfirmed: 239, finalPassers: 200 },
    { schoolName: '土気', department: '普通科', quota: 240, applicantsConfirmed: 279, testTakersConfirmed: 277, finalPassers: 240 },
    { schoolName: '千葉西', department: '普通科', quota: 320, applicantsConfirmed: 356, testTakersConfirmed: 348, finalPassers: 320 },
    { schoolName: '犢橋', department: '普通科', quota: 200, applicantsConfirmed: 193, testTakersConfirmed: 191, finalPassers: 190 },
    { schoolName: '八千代', department: '普通科', quota: 240, applicantsConfirmed: 338, testTakersConfirmed: 336, finalPassers: 240 },
    { schoolName: '八千代', department: '家政科', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 34, finalPassers: 35 },
    { schoolName: '八千代', department: '体育科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '八千代東', department: '普通科', quota: 200, applicantsConfirmed: 184, testTakersConfirmed: 182, finalPassers: 175 },
    { schoolName: '八千代西', department: '普通科', quota: 80, applicantsConfirmed: 61, testTakersConfirmed: 60, finalPassers: 60 },
    { schoolName: '津田沼', department: '普通科', quota: 320, applicantsConfirmed: 393, testTakersConfirmed: 388, finalPassers: 320 },
    { schoolName: '実籾', department: '普通科', quota: 320, applicantsConfirmed: 364, testTakersConfirmed: 361, finalPassers: 320 },
    // --- 2頁目（学校番号26〜53） ---
    { schoolName: '船橋', department: '普通科', quota: 320, applicantsConfirmed: 618, testTakersConfirmed: 597, finalPassers: 320 },
    { schoolName: '船橋', department: '理数科', quota: 40, applicantsConfirmed: 88, testTakersConfirmed: 82, finalPassers: 40 },
    { schoolName: '薬園台', department: '普通科', quota: 280, applicantsConfirmed: 480, testTakersConfirmed: 475, finalPassers: 280 },
    { schoolName: '薬園台', department: '園芸科', quota: 40, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '船橋東', department: '普通科', quota: 320, applicantsConfirmed: 451, testTakersConfirmed: 448, finalPassers: 320 },
    { schoolName: '船橋啓明', department: '普通科', quota: 320, applicantsConfirmed: 333, testTakersConfirmed: 328, finalPassers: 320 },
    { schoolName: '船橋芝山', department: '普通科', quota: 320, applicantsConfirmed: 446, testTakersConfirmed: 445, finalPassers: 320 },
    { schoolName: '船橋二和', department: '普通科', quota: 280, applicantsConfirmed: 296, testTakersConfirmed: 296, finalPassers: 280 },
    { schoolName: '船橋古和釜', department: '普通科', quota: 200, applicantsConfirmed: 193, testTakersConfirmed: 191, finalPassers: 188 },
    { schoolName: '船橋法典', department: '普通科', quota: 200, applicantsConfirmed: 201, testTakersConfirmed: 201, finalPassers: 200 },
    { schoolName: '船橋豊富', department: '普通科', quota: 80, applicantsConfirmed: 81, testTakersConfirmed: 78, finalPassers: 78 },
    { schoolName: '船橋北', department: '普通科', quota: 160, applicantsConfirmed: 94, testTakersConfirmed: 94, finalPassers: 94 },
    { schoolName: '市川工業', department: '機械科', quota: 80, applicantsConfirmed: 79, testTakersConfirmed: 78, finalPassers: 78 },
    { schoolName: '市川工業', department: '電気科', quota: 80, applicantsConfirmed: 82, testTakersConfirmed: 82, finalPassers: 80 },
    { schoolName: '市川工業', department: '建築科', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 33 },
    { schoolName: '市川工業', department: 'インテリア科', quota: 40, applicantsConfirmed: 47, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '国府台', department: '普通科', quota: 320, applicantsConfirmed: 373, testTakersConfirmed: 370, finalPassers: 320 },
    { schoolName: '国分', department: '普通科', quota: 320, applicantsConfirmed: 420, testTakersConfirmed: 415, finalPassers: 320 },
    { schoolName: '行徳', department: '普通科', quota: 120, applicantsConfirmed: 103, testTakersConfirmed: 101, finalPassers: 100 },
    { schoolName: '市川東', department: '普通科', quota: 320, applicantsConfirmed: 328, testTakersConfirmed: 326, finalPassers: 320 },
    { schoolName: '市川昴', department: '普通科', quota: 320, applicantsConfirmed: 320, testTakersConfirmed: 319, finalPassers: 319 },
    { schoolName: '市川南', department: '普通科', quota: 280, applicantsConfirmed: 281, testTakersConfirmed: 281, finalPassers: 280 },
    { schoolName: '浦安', department: '普通科', quota: 200, applicantsConfirmed: 170, testTakersConfirmed: 166, finalPassers: 165 },
    { schoolName: '浦安南', department: '普通科', quota: 120, applicantsConfirmed: 62, testTakersConfirmed: 62, finalPassers: 61 },
    { schoolName: '鎌ヶ谷', department: '普通科', quota: 320, applicantsConfirmed: 435, testTakersConfirmed: 435, finalPassers: 320 },
    { schoolName: '鎌ヶ谷西', department: '普通科', quota: 160, applicantsConfirmed: 172, testTakersConfirmed: 172, finalPassers: 160 },
    { schoolName: '松戸', department: '普通科', quota: 200, applicantsConfirmed: 223, testTakersConfirmed: 221, finalPassers: 200 },
    { schoolName: '松戸', department: '芸術科', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 40 },
    { schoolName: '小金', department: '総合学科', quota: 320, applicantsConfirmed: 598, testTakersConfirmed: 595, finalPassers: 320 },
    { schoolName: '松戸国際', department: '普通科', quota: 200, applicantsConfirmed: 219, testTakersConfirmed: 218, finalPassers: 200 },
    { schoolName: '松戸国際', department: '国際教養科', quota: 120, applicantsConfirmed: 113, testTakersConfirmed: 112, finalPassers: 119 },
    { schoolName: '松戸六実', department: '普通科', quota: 320, applicantsConfirmed: 444, testTakersConfirmed: 442, finalPassers: 320 },
    { schoolName: '松戸向陽', department: '普通科', quota: 160, applicantsConfirmed: 182, testTakersConfirmed: 181, finalPassers: 160 },
    { schoolName: '松戸向陽', department: '福祉教養科', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '松戸馬橋', department: '普通科', quota: 320, applicantsConfirmed: 361, testTakersConfirmed: 360, finalPassers: 320 },
    // --- 3頁目（学校番号54〜77） ---
    { schoolName: '東葛飾', department: '普通科', quota: 240, applicantsConfirmed: 437, testTakersConfirmed: 420, finalPassers: 240 },
    { schoolName: '柏', department: '普通科', quota: 280, applicantsConfirmed: 337, testTakersConfirmed: 331, finalPassers: 280 },
    { schoolName: '柏', department: '理数科', quota: 40, applicantsConfirmed: 53, testTakersConfirmed: 53, finalPassers: 40 },
    { schoolName: '柏南', department: '普通科', quota: 360, applicantsConfirmed: 531, testTakersConfirmed: 529, finalPassers: 360 },
    { schoolName: '柏陵', department: '普通科', quota: 320, applicantsConfirmed: 362, testTakersConfirmed: 362, finalPassers: 320 },
    { schoolName: '柏の葉', department: '普通科', quota: 280, applicantsConfirmed: 370, testTakersConfirmed: 369, finalPassers: 280 },
    { schoolName: '柏の葉', department: '情報理数科', quota: 40, applicantsConfirmed: 49, testTakersConfirmed: 47, finalPassers: 40 },
    { schoolName: '柏中央', department: '普通科', quota: 320, applicantsConfirmed: 351, testTakersConfirmed: 348, finalPassers: 320 },
    { schoolName: '沼南', department: '普通科', quota: 80, applicantsConfirmed: 33, testTakersConfirmed: 32, finalPassers: 32 },
    { schoolName: '沼南高柳', department: '普通科', quota: 160, applicantsConfirmed: 141, testTakersConfirmed: 141, finalPassers: 141 },
    { schoolName: '流山', department: '園芸科', quota: 120, applicantsConfirmed: 139, testTakersConfirmed: 138, finalPassers: 120 },
    { schoolName: '流山', department: '商業科・情報処理科', quota: 80, applicantsConfirmed: 81, testTakersConfirmed: 81, finalPassers: 80 },
    { schoolName: '流山おおたかの森', department: '普通科', quota: 320, applicantsConfirmed: 381, testTakersConfirmed: 376, finalPassers: 320 },
    { schoolName: '流山おおたかの森', department: '国際コミュニケーション科', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 43, finalPassers: 40 },
    { schoolName: '流山南', department: '普通科', quota: 280, applicantsConfirmed: 282, testTakersConfirmed: 278, finalPassers: 277 },
    { schoolName: '流山北', department: '普通科', quota: 200, applicantsConfirmed: 127, testTakersConfirmed: 127, finalPassers: 127 },
    { schoolName: '野田中央', department: '普通科', quota: 280, applicantsConfirmed: 232, testTakersConfirmed: 231, finalPassers: 231 },
    { schoolName: '清水', department: '食品科学科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '清水', department: '機械科・電気科・環境化学科', quota: 120, applicantsConfirmed: 115, testTakersConfirmed: 114, finalPassers: 114 },
    { schoolName: '関宿', department: '普通科', quota: 80, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26 },
    { schoolName: '我孫子', department: '普通科', quota: 320, applicantsConfirmed: 357, testTakersConfirmed: 356, finalPassers: 320 },
    { schoolName: '我孫子東', department: '普通科', quota: 200, applicantsConfirmed: 132, testTakersConfirmed: 131, finalPassers: 131 },
    { schoolName: '白井', department: '普通科', quota: 240, applicantsConfirmed: 281, testTakersConfirmed: 278, finalPassers: 240 },
    { schoolName: '印旛明誠', department: '普通科', quota: 200, applicantsConfirmed: 239, testTakersConfirmed: 239, finalPassers: 200 },
    { schoolName: '成田西陵', department: '園芸科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '成田西陵', department: '土木造園科', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '成田西陵', department: '食品科学科', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '成田西陵', department: '情報処理科', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '成田国際', department: '普通科', quota: 200, applicantsConfirmed: 264, testTakersConfirmed: 261, finalPassers: 200 },
    { schoolName: '成田国際', department: '国際科', quota: 120, applicantsConfirmed: 142, testTakersConfirmed: 140, finalPassers: 120 },
    { schoolName: '成田北', department: '普通科', quota: 280, applicantsConfirmed: 310, testTakersConfirmed: 309, finalPassers: 280 },
    { schoolName: '下総', department: '園芸科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '下総', department: '自動車科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31 },
    { schoolName: '下総', department: '情報処理科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '富里', department: '普通科', quota: 160, applicantsConfirmed: 173, testTakersConfirmed: 173, finalPassers: 160 },
    // --- 4頁目（学校番号78〜98・81は欠番） ---
    { schoolName: '佐倉', department: '普通科', quota: 280, applicantsConfirmed: 424, testTakersConfirmed: 419, finalPassers: 280 },
    { schoolName: '佐倉', department: '理数科', quota: 40, applicantsConfirmed: 65, testTakersConfirmed: 65, finalPassers: 40 },
    { schoolName: '佐倉東', department: '普通科', quota: 120, applicantsConfirmed: 135, testTakersConfirmed: 135, finalPassers: 120 },
    { schoolName: '佐倉東', department: '調理国際科', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 40 },
    { schoolName: '佐倉東', department: '服飾デザイン科', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40 },
    { schoolName: '佐倉西', department: '普通科', quota: 160, applicantsConfirmed: 150, testTakersConfirmed: 149, finalPassers: 149 },
    { schoolName: '八街', department: '総合学科', quota: 120, applicantsConfirmed: 116, testTakersConfirmed: 116, finalPassers: 116 },
    { schoolName: '四街道', department: '普通科', quota: 320, applicantsConfirmed: 379, testTakersConfirmed: 377, finalPassers: 320 },
    { schoolName: '四街道北', department: '普通科', quota: 240, applicantsConfirmed: 269, testTakersConfirmed: 269, finalPassers: 240 },
    { schoolName: '佐原', department: '普通科', quota: 240, applicantsConfirmed: 223, testTakersConfirmed: 222, finalPassers: 222 },
    { schoolName: '佐原', department: '理数科', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '佐原白楊', department: '普通科', quota: 200, applicantsConfirmed: 204, testTakersConfirmed: 204, finalPassers: 200 },
    { schoolName: '小見川', department: '普通科', quota: 160, applicantsConfirmed: 147, testTakersConfirmed: 146, finalPassers: 146 },
    { schoolName: '多古', department: '普通科', quota: 80, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '多古', department: '園芸科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '銚子', department: '普通科', quota: 120, applicantsConfirmed: 132, testTakersConfirmed: 132, finalPassers: 120 },
    { schoolName: '銚子商業', department: '商業科・情報処理科', quota: 160, applicantsConfirmed: 151, testTakersConfirmed: 151, finalPassers: 151 },
    { schoolName: '銚子商業', department: '海洋科', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12 },
    { schoolName: '旭農業', department: '畜産科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16 },
    { schoolName: '旭農業', department: '園芸科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 17 },
    { schoolName: '旭農業', department: '食品科学科', quota: 40, applicantsConfirmed: 30, testTakersConfirmed: 30, finalPassers: 30 },
    { schoolName: '東総工業', department: '電子機械科', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 35 },
    { schoolName: '東総工業', department: '電気科', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 25, finalPassers: 25 },
    { schoolName: '東総工業', department: '情報技術科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '東総工業', department: '建設科', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 33, finalPassers: 33 },
    { schoolName: '匝瑳', department: '総合学科', quota: 240, applicantsConfirmed: 207, testTakersConfirmed: 207, finalPassers: 207 },
    { schoolName: '松尾', department: '普通科', quota: 120, applicantsConfirmed: 106, testTakersConfirmed: 106, finalPassers: 106 },
    { schoolName: '成東', department: '普通科・理数科', quota: 240, applicantsConfirmed: 238, testTakersConfirmed: 236, finalPassers: 236 },
    { schoolName: '東金', department: '普通科', quota: 160, applicantsConfirmed: 182, testTakersConfirmed: 181, finalPassers: 160 },
    { schoolName: '東金', department: '国際教養科', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 40 },
    { schoolName: '東金商業', department: '商業科・情報処理科', quota: 120, applicantsConfirmed: 99, testTakersConfirmed: 99, finalPassers: 98 },
    { schoolName: '大網', department: '普通科', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    { schoolName: '大網', department: '農業科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 39, finalPassers: 39 },
    { schoolName: '大網', department: '食品科学科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 37 },
    { schoolName: '大網', department: '生物工学科', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27 },
    // --- 5頁目（学校番号99〜120） ---
    { schoolName: '九十九里', department: '普通科', quota: 80, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19 },
    { schoolName: '長生', department: '普通科・理数科', quota: 280, applicantsConfirmed: 357, testTakersConfirmed: 356, finalPassers: 280 },
    { schoolName: '茂原', department: '普通科', quota: 160, applicantsConfirmed: 161, testTakersConfirmed: 160, finalPassers: 160 },
    { schoolName: '茂原樟陽', department: '農業科', quota: 40, applicantsConfirmed: 39, testTakersConfirmed: 38, finalPassers: 38 },
    { schoolName: '茂原樟陽', department: '食品科学科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 41, finalPassers: 40 },
    { schoolName: '茂原樟陽', department: '土木造園科', quota: 40, applicantsConfirmed: 20, testTakersConfirmed: 20, finalPassers: 20 },
    { schoolName: '茂原樟陽', department: '電子機械科', quota: 40, applicantsConfirmed: 28, testTakersConfirmed: 28, finalPassers: 28 },
    { schoolName: '茂原樟陽', department: '電気科', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '茂原樟陽', department: '環境化学科', quota: 40, applicantsConfirmed: 6, testTakersConfirmed: 6, finalPassers: 7 },
    { schoolName: '一宮商業', department: '商業科・情報処理科', quota: 120, applicantsConfirmed: 107, testTakersConfirmed: 107, finalPassers: 107 },
    { schoolName: '大多喜', department: '普通科', quota: 160, applicantsConfirmed: 147, testTakersConfirmed: 147, finalPassers: 147 },
    { schoolName: '大原', department: '総合学科', quota: 160, applicantsConfirmed: 94, testTakersConfirmed: 94, finalPassers: 93 },
    { schoolName: '長狭', department: '普通科', quota: 160, applicantsConfirmed: 95, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '安房拓心', department: '総合学科', quota: 120, applicantsConfirmed: 96, testTakersConfirmed: 95, finalPassers: 95 },
    { schoolName: '安房', department: '普通科', quota: 240, applicantsConfirmed: 216, testTakersConfirmed: 214, finalPassers: 214 },
    { schoolName: '館山総合', department: '工業科', quota: 40, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '館山総合', department: '商業科', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15 },
    { schoolName: '館山総合', department: '海洋科', quota: 40, applicantsConfirmed: 21, testTakersConfirmed: 21, finalPassers: 21 },
    { schoolName: '館山総合', department: '家政科', quota: 40, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 6 },
    { schoolName: '天羽', department: '普通科', quota: 120, applicantsConfirmed: 56, testTakersConfirmed: 55, finalPassers: 54 },
    { schoolName: '君津商業', department: '商業科・情報処理科', quota: 160, applicantsConfirmed: 138, testTakersConfirmed: 138, finalPassers: 138 },
    { schoolName: '木更津', department: '普通科', quota: 280, applicantsConfirmed: 385, testTakersConfirmed: 375, finalPassers: 280 },
    { schoolName: '木更津', department: '理数科', quota: 40, applicantsConfirmed: 55, testTakersConfirmed: 51, finalPassers: 40 },
    { schoolName: '木更津東', department: '普通科', quota: 120, applicantsConfirmed: 111, testTakersConfirmed: 111, finalPassers: 113 },
    { schoolName: '木更津東', department: '家政科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '君津', department: '普通科', quota: 240, applicantsConfirmed: 250, testTakersConfirmed: 246, finalPassers: 240 },
    { schoolName: '君津', department: '園芸科', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37 },
    { schoolName: '君津青葉', department: '総合学科', quota: 120, applicantsConfirmed: 72, testTakersConfirmed: 72, finalPassers: 72 },
    { schoolName: '袖ヶ浦', department: '普通科', quota: 240, applicantsConfirmed: 293, testTakersConfirmed: 292, finalPassers: 240 },
    { schoolName: '袖ヶ浦', department: '情報コミュニケーション科', quota: 40, applicantsConfirmed: 56, testTakersConfirmed: 56, finalPassers: 40 },
    { schoolName: '市原', department: '普通科', quota: 80, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 42 },
    { schoolName: '市原', department: '園芸科', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '京葉', department: '普通科', quota: 120, applicantsConfirmed: 121, testTakersConfirmed: 121, finalPassers: 120 },
    { schoolName: '市原緑', department: '普通科', quota: 120, applicantsConfirmed: 97, testTakersConfirmed: 97, finalPassers: 97 },
    { schoolName: '姉崎', department: '普通科', quota: 120, applicantsConfirmed: 115, testTakersConfirmed: 115, finalPassers: 115 },
    // --- 6頁目（学校番号121・「1．県立全日制」区分の最終校） ---
    { schoolName: '市原八幡', department: '普通科', quota: 200, applicantsConfirmed: 199, testTakersConfirmed: 199, finalPassers: 195 },
    // --- 7頁目「2．市立全日制」（学校番号市1〜市7） ---
    { schoolName: '市立千葉', department: '普通科', quota: 280, applicantsConfirmed: 433, testTakersConfirmed: 430, finalPassers: 280 },
    { schoolName: '市立千葉', department: '理数科', quota: 40, applicantsConfirmed: 70, testTakersConfirmed: 69, finalPassers: 40 },
    { schoolName: '市立習志野', department: '普通科', quota: 240, applicantsConfirmed: 241, testTakersConfirmed: 238, finalPassers: 240 },
    { schoolName: '市立習志野', department: '商業科', quota: 80, applicantsConfirmed: 93, testTakersConfirmed: 93, finalPassers: 80 },
    { schoolName: '市立船橋', department: '普通科', quota: 240, applicantsConfirmed: 294, testTakersConfirmed: 291, finalPassers: 240 },
    { schoolName: '市立船橋', department: '商業科', quota: 80, applicantsConfirmed: 122, testTakersConfirmed: 122, finalPassers: 80 },
    { schoolName: '市立船橋', department: '体育科', quota: 80, applicantsConfirmed: 82, testTakersConfirmed: 82, finalPassers: 80 },
    { schoolName: '市立松戸', department: '普通科', quota: 280, applicantsConfirmed: 390, testTakersConfirmed: 389, finalPassers: 280 },
    { schoolName: '市立松戸', department: '国際人文科', quota: 40, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 40 },
    { schoolName: '市立柏', department: '普通科', quota: 280, applicantsConfirmed: 343, testTakersConfirmed: 342, finalPassers: 280 },
    { schoolName: '市立柏', department: 'スポーツ科学科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40 },
    { schoolName: '市立銚子', department: '普通科・理数科', quota: 240, applicantsConfirmed: 247, testTakersConfirmed: 247, finalPassers: 240 },
    // --- 8頁目「3．県立定時制」（学校番号定1〜定16） ---
    { schoolName: '千葉商業', department: '商業科（定時制）', quota: 40, applicantsConfirmed: 25, testTakersConfirmed: 24, finalPassers: 24 },
    { schoolName: '千葉工業', department: '工業科（定時制）', quota: 40, applicantsConfirmed: 10, testTakersConfirmed: 10, finalPassers: 10 },
    { schoolName: '生浜', department: '普通科（定時制・午前部）', quota: 66, applicantsConfirmed: 67, testTakersConfirmed: 65, finalPassers: 65 },
    { schoolName: '生浜', department: '普通科（定時制・午後部）', quota: 66, applicantsConfirmed: 51, testTakersConfirmed: 51, finalPassers: 50 },
    { schoolName: '生浜', department: '普通科（定時制・夜間部）', quota: 66, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13 },
    { schoolName: '船橋', department: '総合学科（定時制）', quota: 80, applicantsConfirmed: 47, testTakersConfirmed: 46, finalPassers: 46 },
    { schoolName: '市川工業', department: '工業科（定時制）', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14 },
    { schoolName: '松戸南', department: '普通科（定時制・午前部）', quota: 104, applicantsConfirmed: 126, testTakersConfirmed: 125, finalPassers: 104 },
    { schoolName: '松戸南', department: '普通科（定時制・午後部）', quota: 104, applicantsConfirmed: 135, testTakersConfirmed: 134, finalPassers: 104 },
    { schoolName: '松戸南', department: '普通科（定時制・夜間部）', quota: 66, applicantsConfirmed: 70, testTakersConfirmed: 69, finalPassers: 66 },
    { schoolName: '東葛飾', department: '普通科（定時制）', quota: 80, applicantsConfirmed: 27, testTakersConfirmed: 25, finalPassers: 24 },
    { schoolName: '佐倉南', department: '普通科（定時制・午前部）', quota: 66, applicantsConfirmed: 71, testTakersConfirmed: 69, finalPassers: 66 },
    { schoolName: '佐倉南', department: '普通科（定時制・午後部）', quota: 66, applicantsConfirmed: 72, testTakersConfirmed: 72, finalPassers: 66 },
    { schoolName: '佐倉南', department: '普通科（定時制・夜間部）', quota: 33, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23 },
    { schoolName: '佐原', department: '普通科（定時制）', quota: 40, applicantsConfirmed: 8, testTakersConfirmed: 8, finalPassers: 8 },
    { schoolName: '銚子商業', department: '商業科（定時制）', quota: 40, applicantsConfirmed: 1, testTakersConfirmed: 1, finalPassers: 1 },
    { schoolName: '匝瑳', department: '普通科（定時制）', quota: 40, applicantsConfirmed: 7, testTakersConfirmed: 7, finalPassers: 7 },
    { schoolName: '東金', department: '普通科（定時制）', quota: 40, applicantsConfirmed: 4, testTakersConfirmed: 4, finalPassers: 4 },
    { schoolName: '長生', department: '普通科（定時制）', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '長狭', department: '普通科（定時制）', quota: 40, applicantsConfirmed: 5, testTakersConfirmed: 5, finalPassers: 5 },
    { schoolName: '館山総合', department: '普通科（定時制）', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11 },
    { schoolName: '木更津東', department: '普通科（定時制）', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22 },
    // --- 掛-1（令和7年度・R7一次資料r07kyoka01.pdf 1頁目・学校番号1〜25） ---
    { schoolName: '千葉', department: '普通科', quota: 240, applicantsConfirmed: 323, testTakersConfirmed: 303, finalPassers: 241, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉女子', department: '普通科', quota: 240, applicantsConfirmed: 271, testTakersConfirmed: 270, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉女子', department: '家政科', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉東', department: '普通科', quota: 320, applicantsConfirmed: 420, testTakersConfirmed: 417, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉商業', department: '商業科・情報処理科', quota: 320, applicantsConfirmed: 383, testTakersConfirmed: 382, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '京葉工業', department: '機械科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '京葉工業', department: '電子工業科', quota: 80, applicantsConfirmed: 74, testTakersConfirmed: 73, finalPassers: 75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '京葉工業', department: '設備システム科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '京葉工業', department: '建設科', quota: 40, applicantsConfirmed: 50, testTakersConfirmed: 50, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉工業', department: '電子機械科', quota: 80, applicantsConfirmed: 69, testTakersConfirmed: 69, finalPassers: 69, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉工業', department: '電気科', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉工業', department: '情報技術科', quota: 40, applicantsConfirmed: 27, testTakersConfirmed: 27, finalPassers: 27, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉工業', department: '工業化学科', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉工業', department: '理数工学科', quota: 40, applicantsConfirmed: 24, testTakersConfirmed: 23, finalPassers: 23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉南', department: '普通科', quota: 320, applicantsConfirmed: 360, testTakersConfirmed: 357, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '検見川', department: '普通科', quota: 320, applicantsConfirmed: 403, testTakersConfirmed: 393, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉北', department: '普通科', quota: 280, applicantsConfirmed: 278, testTakersConfirmed: 276, finalPassers: 275, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '若松', department: '普通科', quota: 320, applicantsConfirmed: 373, testTakersConfirmed: 372, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千城台', department: '普通科', quota: 320, applicantsConfirmed: 352, testTakersConfirmed: 351, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '生浜', department: '普通科', quota: 80, applicantsConfirmed: 81, testTakersConfirmed: 81, finalPassers: 80, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '磯辺', department: '普通科', quota: 320, applicantsConfirmed: 349, testTakersConfirmed: 346, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '泉', department: '普通科', quota: 120, applicantsConfirmed: 106, testTakersConfirmed: 105, finalPassers: 104, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '幕張総合', department: '総合学科', quota: 640, applicantsConfirmed: 1058, testTakersConfirmed: 1052, finalPassers: 640, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '幕張総合', department: '看護科', quota: 40, applicantsConfirmed: 57, testTakersConfirmed: 56, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '柏井', department: '普通科', quota: 200, applicantsConfirmed: 233, testTakersConfirmed: 233, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '土気', department: '普通科', quota: 240, applicantsConfirmed: 263, testTakersConfirmed: 262, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千葉西', department: '普通科', quota: 320, applicantsConfirmed: 368, testTakersConfirmed: 359, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '犢橋', department: '普通科', quota: 200, applicantsConfirmed: 238, testTakersConfirmed: 237, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八千代', department: '普通科', quota: 240, applicantsConfirmed: 370, testTakersConfirmed: 368, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八千代', department: '家政科', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 45, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八千代', department: '体育科', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八千代東', department: '普通科', quota: 280, applicantsConfirmed: 287, testTakersConfirmed: 286, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八千代西', department: '普通科', quota: 160, applicantsConfirmed: 66, testTakersConfirmed: 65, finalPassers: 65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '津田沼', department: '普通科', quota: 320, applicantsConfirmed: 439, testTakersConfirmed: 437, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '実籾', department: '普通科', quota: 320, applicantsConfirmed: 403, testTakersConfirmed: 402, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    // --- 2頁目（学校番号26〜53） ---
    { schoolName: '船橋', department: '普通科', quota: 320, applicantsConfirmed: 587, testTakersConfirmed: 551, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '船橋', department: '理数科', quota: 40, applicantsConfirmed: 66, testTakersConfirmed: 63, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '薬園台', department: '普通科', quota: 280, applicantsConfirmed: 466, testTakersConfirmed: 464, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '薬園台', department: '園芸科', quota: 40, applicantsConfirmed: 48, testTakersConfirmed: 47, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '船橋東', department: '普通科', quota: 320, applicantsConfirmed: 507, testTakersConfirmed: 506, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '船橋啓明', department: '普通科', quota: 320, applicantsConfirmed: 416, testTakersConfirmed: 416, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '船橋芝山', department: '普通科', quota: 320, applicantsConfirmed: 439, testTakersConfirmed: 437, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '船橋二和', department: '普通科', quota: 280, applicantsConfirmed: 347, testTakersConfirmed: 346, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '船橋古和釜', department: '普通科', quota: 240, applicantsConfirmed: 257, testTakersConfirmed: 255, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '船橋法典', department: '普通科', quota: 240, applicantsConfirmed: 223, testTakersConfirmed: 221, finalPassers: 221, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '船橋豊富', department: '普通科', quota: 120, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '船橋北', department: '普通科', quota: 200, applicantsConfirmed: 166, testTakersConfirmed: 164, finalPassers: 164, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市川工業', department: '機械科', quota: 80, applicantsConfirmed: 84, testTakersConfirmed: 83, finalPassers: 80, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市川工業', department: '電気科', quota: 80, applicantsConfirmed: 98, testTakersConfirmed: 98, finalPassers: 80, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市川工業', department: '建築科', quota: 40, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市川工業', department: 'インテリア科', quota: 40, applicantsConfirmed: 53, testTakersConfirmed: 52, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '国府台', department: '普通科', quota: 320, applicantsConfirmed: 390, testTakersConfirmed: 385, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '国分', department: '普通科', quota: 320, applicantsConfirmed: 468, testTakersConfirmed: 466, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '行徳', department: '普通科', quota: 160, applicantsConfirmed: 104, testTakersConfirmed: 102, finalPassers: 102, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市川東', department: '普通科', quota: 320, applicantsConfirmed: 348, testTakersConfirmed: 346, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市川昴', department: '普通科', quota: 320, applicantsConfirmed: 394, testTakersConfirmed: 392, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市川南', department: '普通科', quota: 280, applicantsConfirmed: 276, testTakersConfirmed: 275, finalPassers: 274, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦安', department: '普通科', quota: 200, applicantsConfirmed: 207, testTakersConfirmed: 202, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦安南', department: '普通科', quota: 120, applicantsConfirmed: 87, testTakersConfirmed: 86, finalPassers: 85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鎌ヶ谷', department: '普通科', quota: 320, applicantsConfirmed: 490, testTakersConfirmed: 488, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鎌ヶ谷西', department: '普通科', quota: 200, applicantsConfirmed: 165, testTakersConfirmed: 162, finalPassers: 162, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松戸', department: '普通科', quota: 200, applicantsConfirmed: 224, testTakersConfirmed: 222, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松戸', department: '芸術科', quota: 40, applicantsConfirmed: 68, testTakersConfirmed: 68, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小金', department: '総合学科', quota: 320, applicantsConfirmed: 508, testTakersConfirmed: 504, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松戸国際', department: '普通科', quota: 200, applicantsConfirmed: 249, testTakersConfirmed: 248, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松戸国際', department: '国際教養科', quota: 120, applicantsConfirmed: 169, testTakersConfirmed: 168, finalPassers: 120, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松戸六実', department: '普通科', quota: 320, applicantsConfirmed: 471, testTakersConfirmed: 470, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松戸向陽', department: '普通科', quota: 200, applicantsConfirmed: 227, testTakersConfirmed: 226, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松戸向陽', department: '福祉教養科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松戸馬橋', department: '普通科', quota: 320, applicantsConfirmed: 391, testTakersConfirmed: 390, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    // --- 3頁目（学校番号54〜77） ---
    { schoolName: '東葛飾', department: '普通科', quota: 240, applicantsConfirmed: 492, testTakersConfirmed: 471, finalPassers: 243, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '柏', department: '普通科', quota: 280, applicantsConfirmed: 355, testTakersConfirmed: 353, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '柏', department: '理数科', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '柏南', department: '普通科', quota: 360, applicantsConfirmed: 554, testTakersConfirmed: 553, finalPassers: 360, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '柏陵', department: '普通科', quota: 320, applicantsConfirmed: 373, testTakersConfirmed: 373, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '柏の葉', department: '普通科', quota: 280, applicantsConfirmed: 396, testTakersConfirmed: 393, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '柏の葉', department: '情報理数科', quota: 40, applicantsConfirmed: 58, testTakersConfirmed: 52, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '柏中央', department: '普通科', quota: 320, applicantsConfirmed: 432, testTakersConfirmed: 431, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '沼南', department: '普通科', quota: 160, applicantsConfirmed: 54, testTakersConfirmed: 54, finalPassers: 53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '沼南高柳', department: '普通科', quota: 200, applicantsConfirmed: 211, testTakersConfirmed: 207, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '流山', department: '園芸科', quota: 120, applicantsConfirmed: 108, testTakersConfirmed: 108, finalPassers: 115, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '流山', department: '商業科・情報処理科', quota: 80, applicantsConfirmed: 95, testTakersConfirmed: 95, finalPassers: 80, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '流山おおたかの森', department: '普通科', quota: 320, applicantsConfirmed: 429, testTakersConfirmed: 428, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '流山おおたかの森', department: '国際コミュニケーション科', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '流山南', department: '普通科', quota: 280, applicantsConfirmed: 271, testTakersConfirmed: 270, finalPassers: 270, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '流山北', department: '普通科', quota: 200, applicantsConfirmed: 163, testTakersConfirmed: 161, finalPassers: 161, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '野田中央', department: '普通科', quota: 320, applicantsConfirmed: 320, testTakersConfirmed: 319, finalPassers: 319, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '清水', department: '食品科学科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '清水', department: '機械科・電気科・環境化学科', quota: 120, applicantsConfirmed: 94, testTakersConfirmed: 94, finalPassers: 93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '関宿', department: '普通科', quota: 120, applicantsConfirmed: 29, testTakersConfirmed: 29, finalPassers: 29, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '我孫子', department: '普通科', quota: 320, applicantsConfirmed: 342, testTakersConfirmed: 340, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '我孫子東', department: '普通科', quota: 200, applicantsConfirmed: 166, testTakersConfirmed: 166, finalPassers: 166, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '白井', department: '普通科', quota: 240, applicantsConfirmed: 244, testTakersConfirmed: 243, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '印旛明誠', department: '普通科', quota: 200, applicantsConfirmed: 229, testTakersConfirmed: 228, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '成田西陵', department: '園芸科', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '成田西陵', department: '土木造園科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '成田西陵', department: '食品科学科', quota: 40, applicantsConfirmed: 44, testTakersConfirmed: 44, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '成田西陵', department: '情報処理科', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '成田国際', department: '普通科', quota: 200, applicantsConfirmed: 275, testTakersConfirmed: 271, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '成田国際', department: '国際科', quota: 120, applicantsConfirmed: 158, testTakersConfirmed: 158, finalPassers: 120, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '成田北', department: '普通科', quota: 280, applicantsConfirmed: 259, testTakersConfirmed: 259, finalPassers: 259, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '下総', department: '園芸科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '下総', department: '自動車科', quota: 40, applicantsConfirmed: 15, testTakersConfirmed: 15, finalPassers: 15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '下総', department: '情報処理科', quota: 40, applicantsConfirmed: 11, testTakersConfirmed: 11, finalPassers: 11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富里', department: '普通科', quota: 160, applicantsConfirmed: 167, testTakersConfirmed: 167, finalPassers: 160, fiscalYear: '令和7年度（2025年度）' },
    // --- 4頁目（学校番号78〜98・81は欠番） ---
    { schoolName: '佐倉', department: '普通科', quota: 280, applicantsConfirmed: 361, testTakersConfirmed: 358, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐倉', department: '理数科', quota: 40, applicantsConfirmed: 57, testTakersConfirmed: 57, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐倉東', department: '普通科', quota: 160, applicantsConfirmed: 185, testTakersConfirmed: 185, finalPassers: 160, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐倉東', department: '調理国際科', quota: 40, applicantsConfirmed: 48, testTakersConfirmed: 48, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐倉東', department: '服飾デザイン科', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐倉西', department: '普通科', quota: 160, applicantsConfirmed: 168, testTakersConfirmed: 168, finalPassers: 160, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八街', department: '総合学科', quota: 120, applicantsConfirmed: 123, testTakersConfirmed: 122, finalPassers: 120, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '四街道', department: '普通科', quota: 320, applicantsConfirmed: 403, testTakersConfirmed: 403, finalPassers: 320, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '四街道北', department: '普通科', quota: 240, applicantsConfirmed: 297, testTakersConfirmed: 296, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐原', department: '普通科', quota: 240, applicantsConfirmed: 249, testTakersConfirmed: 248, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐原', department: '理数科', quota: 40, applicantsConfirmed: 17, testTakersConfirmed: 17, finalPassers: 25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '佐原白楊', department: '普通科', quota: 200, applicantsConfirmed: 208, testTakersConfirmed: 207, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小見川', department: '普通科', quota: 160, applicantsConfirmed: 131, testTakersConfirmed: 130, finalPassers: 130, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多古', department: '普通科', quota: 80, applicantsConfirmed: 47, testTakersConfirmed: 46, finalPassers: 46, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多古', department: '園芸科', quota: 40, applicantsConfirmed: 22, testTakersConfirmed: 22, finalPassers: 22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '銚子', department: '普通科', quota: 120, applicantsConfirmed: 114, testTakersConfirmed: 114, finalPassers: 114, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '銚子商業', department: '商業科・情報処理科', quota: 200, applicantsConfirmed: 184, testTakersConfirmed: 184, finalPassers: 184, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '銚子商業', department: '海洋科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭農業', department: '畜産科', quota: 40, applicantsConfirmed: 16, testTakersConfirmed: 16, finalPassers: 16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭農業', department: '園芸科', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭農業', department: '食品科学科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東総工業', department: '電子機械科', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 45, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東総工業', department: '電気科', quota: 40, applicantsConfirmed: 31, testTakersConfirmed: 31, finalPassers: 36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東総工業', department: '情報技術科', quota: 40, applicantsConfirmed: 23, testTakersConfirmed: 23, finalPassers: 26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東総工業', department: '建設科', quota: 40, applicantsConfirmed: 45, testTakersConfirmed: 44, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '匝瑳', department: '総合学科', quota: 240, applicantsConfirmed: 210, testTakersConfirmed: 210, finalPassers: 209, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松尾', department: '普通科', quota: 120, applicantsConfirmed: 114, testTakersConfirmed: 114, finalPassers: 114, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '成東', department: '普通科・理数科', quota: 240, applicantsConfirmed: 263, testTakersConfirmed: 262, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東金', department: '普通科', quota: 160, applicantsConfirmed: 169, testTakersConfirmed: 169, finalPassers: 160, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東金', department: '国際教養科', quota: 40, applicantsConfirmed: 41, testTakersConfirmed: 41, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東金商業', department: '商業科・情報処理科', quota: 120, applicantsConfirmed: 106, testTakersConfirmed: 106, finalPassers: 106, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大網', department: '普通科', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大網', department: '農業科', quota: 40, applicantsConfirmed: 34, testTakersConfirmed: 34, finalPassers: 33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大網', department: '食品科学科', quota: 40, applicantsConfirmed: 38, testTakersConfirmed: 38, finalPassers: 38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大網', department: '生物工学科', quota: 40, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26, fiscalYear: '令和7年度（2025年度）' },
    // --- 5頁目（学校番号99〜120） ---
    { schoolName: '九十九里', department: '普通科', quota: 120, applicantsConfirmed: 26, testTakersConfirmed: 26, finalPassers: 26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長生', department: '普通科・理数科', quota: 280, applicantsConfirmed: 345, testTakersConfirmed: 342, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茂原', department: '普通科', quota: 160, applicantsConfirmed: 187, testTakersConfirmed: 187, finalPassers: 160, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茂原樟陽', department: '農業科', quota: 40, applicantsConfirmed: 37, testTakersConfirmed: 37, finalPassers: 37, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茂原樟陽', department: '食品科学科', quota: 40, applicantsConfirmed: 36, testTakersConfirmed: 36, finalPassers: 36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茂原樟陽', department: '土木造園科', quota: 40, applicantsConfirmed: 35, testTakersConfirmed: 35, finalPassers: 35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茂原樟陽', department: '電子機械科', quota: 40, applicantsConfirmed: 32, testTakersConfirmed: 32, finalPassers: 32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茂原樟陽', department: '電気科', quota: 40, applicantsConfirmed: 18, testTakersConfirmed: 18, finalPassers: 18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '茂原樟陽', department: '環境化学科', quota: 40, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '一宮商業', department: '商業科・情報処理科', quota: 120, applicantsConfirmed: 122, testTakersConfirmed: 122, finalPassers: 120, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大多喜', department: '普通科', quota: 160, applicantsConfirmed: 133, testTakersConfirmed: 133, finalPassers: 133, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大原', department: '総合学科', quota: 160, applicantsConfirmed: 103, testTakersConfirmed: 102, finalPassers: 102, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長狭', department: '普通科', quota: 160, applicantsConfirmed: 113, testTakersConfirmed: 113, finalPassers: 113, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '安房拓心', department: '総合学科', quota: 120, applicantsConfirmed: 101, testTakersConfirmed: 101, finalPassers: 101, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '安房', department: '普通科', quota: 240, applicantsConfirmed: 253, testTakersConfirmed: 251, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '館山総合', department: '工業科', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '館山総合', department: '商業科', quota: 40, applicantsConfirmed: 13, testTakersConfirmed: 13, finalPassers: 13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '館山総合', department: '海洋科', quota: 40, applicantsConfirmed: 12, testTakersConfirmed: 12, finalPassers: 12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '館山総合', department: '家政科', quota: 40, applicantsConfirmed: 14, testTakersConfirmed: 14, finalPassers: 14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '天羽', department: '普通科', quota: 120, applicantsConfirmed: 48, testTakersConfirmed: 47, finalPassers: 47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '君津商業', department: '商業科・情報処理科', quota: 160, applicantsConfirmed: 151, testTakersConfirmed: 151, finalPassers: 151, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '木更津', department: '普通科', quota: 280, applicantsConfirmed: 356, testTakersConfirmed: 355, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '木更津', department: '理数科', quota: 40, applicantsConfirmed: 62, testTakersConfirmed: 56, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '木更津東', department: '普通科', quota: 120, applicantsConfirmed: 139, testTakersConfirmed: 137, finalPassers: 120, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '木更津東', department: '家政科', quota: 40, applicantsConfirmed: 46, testTakersConfirmed: 46, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '君津', department: '普通科', quota: 240, applicantsConfirmed: 245, testTakersConfirmed: 239, finalPassers: 239, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '君津', department: '園芸科', quota: 40, applicantsConfirmed: 42, testTakersConfirmed: 42, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '君津青葉', department: '総合学科', quota: 120, applicantsConfirmed: 77, testTakersConfirmed: 76, finalPassers: 76, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '袖ヶ浦', department: '普通科', quota: 240, applicantsConfirmed: 262, testTakersConfirmed: 259, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '袖ヶ浦', department: '情報コミュニケーション科', quota: 40, applicantsConfirmed: 33, testTakersConfirmed: 32, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市原', department: '普通科', quota: 80, applicantsConfirmed: 48, testTakersConfirmed: 47, finalPassers: 46, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市原', department: '園芸科', quota: 40, applicantsConfirmed: 19, testTakersConfirmed: 19, finalPassers: 18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '京葉', department: '普通科', quota: 120, applicantsConfirmed: 131, testTakersConfirmed: 131, finalPassers: 120, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市原緑', department: '普通科', quota: 120, applicantsConfirmed: 107, testTakersConfirmed: 107, finalPassers: 107, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '姉崎', department: '普通科', quota: 120, applicantsConfirmed: 165, testTakersConfirmed: 165, finalPassers: 120, fiscalYear: '令和7年度（2025年度）' },
    // --- 6頁目（学校番号121・「1．県立全日制」区分の最終校） ---
    { schoolName: '市原八幡', department: '普通科', quota: 200, applicantsConfirmed: 222, testTakersConfirmed: 222, finalPassers: 200, fiscalYear: '令和7年度（2025年度）' },
    // --- 7頁目「2．市立全日制」（学校番号市1〜市7） ---
    { schoolName: '市立千葉', department: '普通科', quota: 280, applicantsConfirmed: 420, testTakersConfirmed: 417, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立千葉', department: '理数科', quota: 40, applicantsConfirmed: 74, testTakersConfirmed: 72, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立習志野', department: '普通科', quota: 240, applicantsConfirmed: 253, testTakersConfirmed: 252, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立習志野', department: '商業科', quota: 80, applicantsConfirmed: 89, testTakersConfirmed: 88, finalPassers: 80, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立船橋', department: '普通科', quota: 240, applicantsConfirmed: 346, testTakersConfirmed: 343, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立船橋', department: '商業科', quota: 80, applicantsConfirmed: 112, testTakersConfirmed: 112, finalPassers: 80, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立船橋', department: '体育科', quota: 80, applicantsConfirmed: 82, testTakersConfirmed: 82, finalPassers: 80, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立松戸', department: '普通科', quota: 280, applicantsConfirmed: 422, testTakersConfirmed: 419, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立松戸', department: '国際人文科', quota: 40, applicantsConfirmed: 43, testTakersConfirmed: 42, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立柏', department: '普通科', quota: 280, applicantsConfirmed: 285, testTakersConfirmed: 284, finalPassers: 280, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立柏', department: 'スポーツ科学科', quota: 40, applicantsConfirmed: 40, testTakersConfirmed: 40, finalPassers: 40, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立銚子', department: '普通科・理数科', quota: 240, applicantsConfirmed: 251, testTakersConfirmed: 249, finalPassers: 240, fiscalYear: '令和7年度（2025年度）' },
  ],
  officialSubtotals: [
    { label: '県立全日制 合計', quota: 26_960, applicantsConfirmed: 29_594, testTakersConfirmed: 29_359, finalPassers: 25_085 },
    { label: '市立全日制 合計', quota: 1_920, applicantsConfirmed: 2_414, testTakersConfirmed: 2_402, finalPassers: 1_920 },
    { label: '公立全日制 合計', quota: 28_880, applicantsConfirmed: 32_008, testTakersConfirmed: 31_761, finalPassers: 27_005 },
    { label: '県立定時制 合計', quota: 1_237, applicantsConfirmed: 821, testTakersConfirmed: 809, finalPassers: 744 },
    { label: '総合計', quota: 30_117, applicantsConfirmed: 32_829, testTakersConfirmed: 32_570, finalPassers: 27_749 },
    // R7（掛-1）6頁目末尾の「県立全日制 合計」（募集人員27,800/志願者確定数31,437/
    // 受検者確定数31,183/合計26,044）。R8と区別するため専用ラベルを付す。
    { label: '県立全日制 合計（R7）', quota: 27_800, applicantsConfirmed: 31_437, testTakersConfirmed: 31_183, finalPassers: 26_044 },
    // R7（掛-1）7頁目末尾の「市立全日制 合計」「公立全日制 合計」。
    { label: '市立全日制 合計（R7）', quota: 1_920, applicantsConfirmed: 2_417, testTakersConfirmed: 2_400, finalPassers: 1_920 },
    { label: '公立全日制 合計（R7）', quota: 29_720, applicantsConfirmed: 33_854, testTakersConfirmed: 33_583, finalPassers: 27_964 },
  ],
};
