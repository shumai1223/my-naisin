/**
 * T-S13A A-1: 47都道府県の利用条件台帳。
 *
 * 各県のcompetition-ratesデータについて「再配布してよいか」を一次ソース（各県の利用規約・
 * 著作権表示・問い合わせ回答）で確認し記録する。**⚠️A-1が緑になるまでA-2（配布API）以降を
 * 1行も出さない**（`ops/tasks/T-S13A-databank-product.md`の「⛔実装順序」）。
 *
 * 判断できない県は`unknown`にして商品から外す（C8 fail-closed）。47県揃わなくてよい。
 * kill_criteria: `redistribution: 'ok'`が10県未満なら商品として成立しないため中止し👤に報告。
 */

export type RedistributionStatus = 'ok' | 'ng' | 'unknown';

export interface DataLicenseLedgerEntry {
  prefecture: string;
  /** 引用元URLのホスト分類。`.lg.jp`/`.go.jp`/`.ed.jp`/商用/その他。 */
  sourceHost: string;
  redistribution: RedistributionStatus;
  /** そう判断した根拠（利用規約の該当文言・問い合わせ回答の要旨）。unknownの場合は「未確認」等。 */
  evidence: string;
  /** 確認日（YYYY-MM-DD、月までしか判明していない場合はYYYY-MM）。unknownはnull。 */
  verifiedAt: string | null;
}

const UNKNOWN = (evidence = '未確認（A-1未着手・次に着手するセッションが一次ソースを確認する）'): Omit<DataLicenseLedgerEntry, 'prefecture' | 'sourceHost'> => ({
  redistribution: 'unknown',
  evidence,
  verifiedAt: null,
});

/**
 * 47都道府県の台帳。**デフォルトは全県`unknown`**（C8 fail-closed）。
 * 一次ソースで確認できた県のみ個別に上書きする（確認した順に追記していく想定・T-C1と同型の
 * 1県ずつの調査労働）。
 */
export const DATA_LICENSE_LEDGER: Record<string, DataLicenseLedgerEntry> = {
  tokyo: {
    prefecture: 'tokyo',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 東京都教育委員会(kyoiku.metro.tokyo.lg.jp)は/inquiryページがLiferayの' +
        '構造化問い合わせフォーム(部署選択式)のみでmailtoが本文中に一切無く、saitamaと同型のフォーム' +
        '経由。loopはフォーム送信不可のためCowork委任が必要（未着手・優先度は他県より低い）'
    ),
  },
  kanagawa: {
    prefecture: 'kanagawa',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-29調査: 教育局指導部高校教育課の所管ページ(pref.kanagawa.jp/docs/dc4/...)を' +
        'WebFetchで確認したところ、mailtoは無くJavaScript構造化フォーム' +
        '(dshinsei.e-kanagawa.lg.jp/140007-u/offer/offerList_detail.action?tempString=SF4025)のみ。' +
        'loopはフォーム送信不可のためCowork委任が必要(ops/cowork/COWORK-TASK-t-c9-form-prefectures.md' +
        'に追加済み)'
    ),
  },
  osaka: {
    prefecture: 'osaka',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 高等学校課学事グループの複数ページ(kotogakko/gakuji-g3配下・' +
        'soshikikarasagasu配下)を生HTMLで確認したが、いずれもメールアドレス・実質的な問い合わせ' +
        'フォームは無く電話番号(06-6944-6887等)のみ掲載。ページ末尾のfeedback.cgiは「情報は役に' +
        '立ったか」の満足度アンケート用で問い合わせ経路ではない。miyagiと同型の接触ルート無しのため' +
        '初回接触は保留し優先度を下げる'
    ),
  },
  chiba: {
    prefecture: 'chiba',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 出典を所管する学習指導課 学力向上推進室に部署直通メール・' +
        'フォームは無く(電話0120-23-1008のみ)、教育委員会全体の「ご意見・ご提案」フォーム/宛先' +
        'kyouiku@mz.pref.chiba.lg.jp(mailtoリンク+平文表記で2回のraw HTML確認により実在確認済み・' +
        '難読化なし)のみ確認できた。学習指導課への取次ぎを依頼する初回メール下書きを設置' +
        '(draftId r-3220498342067744872・送信は👤)'
    ),
  },
  saitama: {
    prefecture: 'saitama',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 高校教育指導課(入学者選抜担当・所管確認済み)は生HTML全文grepで' +
        'mailto:/cfemail等ゼロ件・メールアドレスが一切存在しない。連絡手段は専用フォームのみ' +
        '(https://www.pref.saitama.lg.jp/soshiki/f2208/index.html の「お問い合わせフォーム」' +
        'ボタン・当課宛てにdeptコードで事前タグ付け済み)。loopはフォーム送信不可のためCowork委任が' +
        '必要(T-C9-license-outreach.mdのフォーム経由バッチに追加予定)。WebSearch要約が提示した' +
        'a6760-03@pref.saitama.lg.jpは生HTML内に存在せず架空と確認・不使用'
    ),
  },
  fukuoka: {
    prefecture: 'fukuoka',
    sourceHost: '.lg.jp（令和6年度分のみ商用第三者ソース）',
    ...UNKNOWN(
      '未確認。加えてsourceIndexバックフィル(2026-08-12)により判明: 令和6年度分191件' +
        '(98校)は県教委原本が取得不能だったため育伸社(ikushin.co.jp)の代替PDFを唯一の' +
        'ソースとして採用しており商用第三者由来。令和7年度分170件は公式PDF(Wayback経由)。' +
        '令和8年度分191件は48校99件が英進館記事を学科別内訳の主典拠とし、残り42校+市組合立' +
        '8校92件は公式PDFが主典拠(英進館は裏取りのみ)。A-2実装時は最低限、令和6年度分191件を' +
        'fiscalYearで除外すること(sourceIndex:8が該当)'
    ),
  },
  hyogo: {
    prefecture: 'hyogo',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 出典ページ(hyogo-c.ed.jp)の「お問合せ先」欄にE-mail表記の平文で' +
        'koukoukyouikuka@pref.hyogo.lg.jp(高校教育課の課内共通アドレス)を発見・生HTML(Shift_JIS)を' +
        '直接ダウンロードして該当行を確認済み(mailtoリンクでなく平文・難読化なし)。応募状況データの' +
        '出典明記のうえでの掲載可否を尋ねる初回メール下書きを設置(draftId ' +
        'r-8693386759128892238・送信は👤)'
    ),
  },
  shizuoka: {
    prefecture: 'shizuoka',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・返信待ち。2026-08-23付でkyoui_koko@pref.shizuoka.lg.jp宛の既存スレッド(2026-08-6が' +
        '初回)へ「応募状況」データの出典明記のうえでの掲載可否を尋ねる絞り込み再質問を送信済み' +
        '(2026-08-28再調査で重複送信ではないと確認)。新規下書きは不要・返信待ち'
    ),
  },
  hiroshima: {
    prefecture: 'hiroshima',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-29調査: 高校教育指導課ページ(pref.hiroshima.lg.jp/site/kyouiku13/)をWebFetchで' +
        '確認したところメールアドレス記載は無く、お問い合わせフォーム' +
        '(pref.hiroshima.lg.jp/form/detail.php?sec_sec1=120&inq=12&lif_id=574273)のみ。' +
        'loopはフォーム送信不可のためCowork委任が必要(ops/cowork/COWORK-TASK-t-c9-form-prefectures.md' +
        'に追加済み)'
    ),
  },
  kumamoto: {
    prefecture: 'kumamoto',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-29調査: 高校教育課ページ(pref.kumamoto.jp/site/kyouiku/list166-541.html)を' +
        'WebFetchで確認したところメールアドレス記載は無く、汎用お問い合わせフォーム' +
        '(pref.kumamoto.jp/form/detail.php?sec_sec1=123)のみ(WebSearch要約は「メールでも問い合わせ' +
        '可」としたが実ページ確認で誤りと判明・既知の罠と同型)。loopはフォーム送信不可のため' +
        'Cowork委任が必要(ops/cowork/COWORK-TASK-t-c9-form-prefectures.mdに追加済み)'
    ),
  },
  miyagi: {
    prefecture: 'miyagi',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 高校教育課ページ(pref.miyagi.jp/soshiki/koukyou/)の生HTMLを確認したが' +
        'メールアドレス・問い合わせフォームへのリンクとも見当たらず、電話番号(022-211-3621等)のみ掲載。' +
        'yamagataと同型の接触ルート無し(loop電話不可)のため初回接触は保留し優先度を下げる'
    ),
  },
  gifu: {
    prefecture: 'gifu',
    sourceHost: '.lg.jp',
    redistribution: 'ok',
    evidence:
      '岐阜県教育委員会高校教育課からGmail回答（2026-08-07）: 「当課の高校入試関連ページに、貴サイトの' +
      'リンク等を掲載することはいたしかねます」＝被リンクは不可（mie/ishikawa等と同型）。' +
      '【2026-08-17追記・OK確定】👤が2026-08-13に「応募状況（募集人員・応募者数・応募倍率）データを' +
      '出典明記のうえ掲載してよいか」と再質問メールを送信、2026-08-17に「当課にて公表している資料を' +
      '使用される場合は、直下リンク先で公表しております資料をお使いください' +
      '（https://www.pref.gifu.lg.jp/site/edu/491657.html）。出典等の表記については、ご提示いただいた' +
      '内容で差し支えございません」と明確な許諾回答を得た（Gmailスレッド19fda9a1168afd76）。' +
      '被リンクは不可だが応募状況データの再配布は明示的に許諾されたため、A-2実装時はこの県のレコードに' +
      '出典URL（上記リンク）を必ず付与する条件で志願状況・募集人員・応募倍率を収録してよい',
    verifiedAt: '2026-08-17',
  },
  okayama: {
    prefecture: 'okayama',
    sourceHost: '.lg.jp（実質公的・県立高校共同サイト）',
    ...UNKNOWN(
      '未確認。2026-08-29調査: 高校教育課ページ(pref.okayama.jp/soshiki/321/)をWebFetchで確認したところ' +
        'メールアドレス記載は無く、お問い合わせフォーム(pref.okayama.jp/form/detail.php?sec_sec1=321)' +
        'のみ。loopはフォーム送信不可のためCowork委任が必要' +
        '(ops/cowork/COWORK-TASK-t-c9-form-prefectures.mdに追加済み)'
    ),
  },
  tochigi: {
    prefecture: 'tochigi',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '⚠️2026-08-28夜に判明: 同日04:48作成のdraftId r2112922851031670398' +
        '(kokokyoiku@pref.tochigi.lg.jp宛)は、実は2026-08-23 22:13:15に全く同じアドレスへ' +
        '既に送信済みだった「応募状況」データの絞り込み再質問(2026-08-06初回の返信)と完全重複。' +
        'T-C9-license-outreach.mdの「未接触39県」表がこの8/23一括送信を反映しておらず未接触と' +
        '誤認したため二重に下書きしてしまった。**このdraftId r2112922851031670398は送信しないこと**' +
        '(送信済み再質問の返信待ちのまま・新規下書きは不要)'
    ),
  },
  gunma: {
    prefecture: 'gunma',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-29調査: 高校教育課ページ(pref.gunma.jp/soshiki/226/)をWebFetchで確認したところ' +
        'メールアドレス記載は無く、お問い合わせフォーム(pref.gunma.jp/form/detail.php?sec_sec1=226)' +
        'のみ。loopはフォーム送信不可のためCowork委任が必要' +
        '(ops/cowork/COWORK-TASK-t-c9-form-prefectures.mdに追加済み)'
    ),
  },
  nagano: {
    prefecture: 'nagano',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・初回問い合わせ送信下書き設置済み(2026-08-28)。令和8年度公立高等学校入学者選抜情報' +
        'ページ(r8konyushi.html・prefectures.tsのsourceUrlと同一ページ)内のmailtoリンクを直接確認し' +
        '（HTML実体参照&#64;をデコード）koko@pref.nagano.lg.jpを実在確認。「貴課公表資料の引用利用に' +
        '関するご報告および参照可否のご相談」として初回メール(draftId r8954071584066946884)を設置。' +
        '応募状況データの再配布許諾は返信後の絞り込み再質問で確認する（gifu/mie/akita型）'
    ),
  },
  ibaraki: {
    prefecture: 'ibaraki',
    sourceHost: '.lg.jp',
    redistribution: 'ok',
    evidence:
      '茨城県教育庁高校教育課からGmail回答（2026-08-26 15:45・スレッド1a01fb938697db53）: ' +
      '「茨城県立高等学校入学者選抜の『応募状況』（募集人員、志願者数、倍率等）につきましては、' +
      '茨城県教育委員会が公表している資料の内容をそのまま掲載するものであれば、出典を明記の上で' +
      '掲載していただくことは差し支えありません」。提示した出典表記形式（出典：茨城県教育委員会' +
      '「（資料名）」（URL））もそのまま承認された。「最新の公表資料をご確認いただき、掲載内容に' +
      'ついて誤解が生じないよう御配慮いただければ」という留保あり＝A-2実装時は出典URLの定期疎通' +
      '確認が必要（他のok県と同様）。被リンク可否には言及なし（今回の質問自体がデータ掲載のみに' +
      '絞った内容だったため）。A-2実装時はこの県のレコードに出典URLを必ず付与する条件で応募状況' +
      'データ（募集人員・志願者数・倍率等）を収録してよい',
    verifiedAt: '2026-08-26',
  },
  mie: {
    prefecture: 'mie',
    sourceHost: '.lg.jp',
    redistribution: 'ok',
    evidence:
      '三重県教育委員会高校教育課からGmail回答（2026-08-06）: 「出典を明記のうえ紹介いただくことは' +
      '差し支えございません。ただし個人が運営するホームページへのリンクを掲載することはできません」。' +
      '被リンクは不可だが、出典明記のうえでの引用・紹介は明示的に許諾されている。' +
      '【2026-08-17追記・確度が上がった】👤が2026-08-13に「応募状況（募集人員・応募者数・応募倍率）の' +
      'データを出典明記のうえ掲載してよいか」と再質問メールを送信、2026-08-17に「県立高等学校入学者選抜の' +
      '志願状況、募集人数、合格者数等のデータにつきましては、本課ホームページで公開していますので、' +
      '出典を明示の上、貴ホームページに掲載していただいて差し支えございません」と明確な追加回答を得た' +
      '（Gmailスレッド19fe9131ed975d6d）。当初の「紹介」の曖昧さが解消され、具体的なデータ項目名を' +
      '挙げたうえでの掲載許諾となったため、A-2実装時はこの県のレコードに出典URLを必ず付与する条件で' +
      '志願状況・募集人数・合格者数を収録してよい',
    verifiedAt: '2026-08-17',
  },
  toyama: {
    prefecture: 'toyama',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 教育みらい室県立高校課のページ(3003/kensei/...)を生HTMLで確認したが' +
        'メールアドレスは見当たらず電話番号(076-444-3448等)のみ掲載。県全体の「県政参加」フォーム' +
        '(/1021/kensei/kenseisanka/kenseisanka/form.html)はあるが部署専用ではない一般窓口。' +
        'miyagi/osakaと同型の接触ルート無しのため初回接触は保留し優先度を下げる'
    ),
  },
  ishikawa: {
    prefecture: 'ishikawa',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '石川県教育委員会学校指導課からGmail回答あり（2026-08-07）だが内容は「学校指導課の関連' +
        'ページからサイト「My Naishin」への参照についてですが、課内で協議して不可となりました」' +
        '＝mie/wakayamaと同型の被リンク可否の回答のみで、再配布（引用・データ商品への収録）' +
        '可否には言及していない。再配布の可否は別途確認が必要（要再確認）。' +
        '【2026-08-28追記・T-C9】gifu/mie/akitaと同型の「応募状況データの出典明記のうえでの掲載可否' +
        'のみ」を尋ねる再質問の返信下書きを設置済み（draftId r1644566739000759853・送信は👤・返信待ち）'
    ),
  },
  fukui: {
    prefecture: 'fukui',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・返信待ち。2026-08-23付でkoukou@pref.fukui.lg.jp宛の既存スレッド(2026-08-6が初回)へ' +
        '「応募状況」データの出典明記のうえでの掲載可否を尋ねる絞り込み再質問を送信済み' +
        '(2026-08-28再調査で重複送信ではないと確認)。新規下書きは不要・返信待ち'
    ),
  },
  ehime: { prefecture: 'ehime', sourceHost: '.lg.jp', ...UNKNOWN() },
  tokushima: {
    prefecture: 'tokushima',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 高校教育課の公式ページ(pref.tokushima.lg.jp/kenseijoho/soshiki/' +
        'kyouiku/koukoukyouikuka/)は電話番号(088-621-3139等)のみ掲載でmailto無し。全県共通の' +
        '「お問い合わせ」ページ(/otoiawase/)も「各担当課に直接メールを」という案内のみで実際の' +
        'アドレスは無く、実質的にフォーム誘導のみ。yamagata/miyagi/osakaと同型の接触ルート無し' +
        '（架空アドレスは作らない）'
    ),
  },
  kagawa: {
    prefecture: 'kagawa',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '⚠️2026-08-28夜に判明: 同日作成のdraftId r3803487085097089300(kokokyoiku@pref.kagawa.lg.jp宛)は、' +
        '実は2026-08-23 22:13:19に全く同じアドレスへ既に送信済みだった「応募状況」データの絞り込み' +
        '再質問(2026-08-06初回の返信)と完全重複。T-C9-license-outreach.mdの「未接触39県」表がこの' +
        '8/23一括送信を反映しておらず未接触と誤認したため二重に下書きしてしまった。' +
        '**このdraftId r3803487085097089300は送信しないこと**(送信済み再質問の返信待ちのまま・' +
        '新規下書きは不要)'
    ),
  },
  saga: {
    prefecture: 'saga',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・返信待ち。2026-08-28夜に判明: 2026-08-23 20:53:59付でgakkoukyouiku@pref.saga.lg.jp宛の' +
        '既存スレッド(2026-08-06が初回)へ「応募状況」データの出典明記のうえでの掲載可否を尋ねる' +
        '絞り込み再質問を送信済み。新規下書きは不要・返信待ち'
    ),
  },
  nagasaki: { prefecture: 'nagasaki', sourceHost: '.lg.jp', ...UNKNOWN() },
  oita: {
    prefecture: 'oita',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・初回問い合わせ送信下書き設置済み(2026-08-28)。高校教育課の公式ページ' +
        '(pref.oita.jp/soshiki/31210/)で高校改革推進班（高校入試担当）直後のmailtoリンクから' +
        'a31210@pref.oita.lg.jpを実在確認。「貴課公表資料の引用利用に関するご報告および参照可否の' +
        'ご相談」として初回メール(draftId r6782234245672548169)を設置。応募状況データの再配布許諾は' +
        '返信後の絞り込み再質問で確認する（gifu/mie/akita型）'
    ),
  },
  tottori: {
    prefecture: 'tottori',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '⚠️2026-08-28夜に判明: 同日作成のdraftId r-8120971795787063897' +
        '(koutougakkou@pref.tottori.lg.jp宛)は、実は2026-08-23 20:53:59に全く同じアドレスへ' +
        '既に送信済みだった「応募状況」データの絞り込み再質問(2026-08-06初回の返信)と完全重複。' +
        'T-C9-license-outreach.mdの「未接触39県」表がこの8/23一括送信を反映しておらず未接触と' +
        '誤認したため二重に下書きしてしまった。**このdraftId r-8120971795787063897は送信しないこと**' +
        '(送信済み再質問の返信待ちのまま・新規下書きは不要)'
    ),
  },
  kochi: {
    prefecture: 'kochi',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・返信待ち。2026-08-28夜に判明: 2026-08-23 22:13:16付で311701@ken.pref.kochi.lg.jp宛の' +
        '既存スレッド(2026-08-06が初回)へ「応募状況」データの出典明記のうえでの掲載可否を尋ねる' +
        '絞り込み再質問を送信済み。新規下書きは不要・返信待ち'
    ),
  },
  miyazaki: {
    prefecture: 'miyazaki',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・返信待ち。2026-08-28夜に判明: 2026-08-23 22:13:17付でkokokyoiku@pref.miyazaki.lg.jp宛の' +
        '既存スレッド(2026-08-06が初回)へ「応募状況」データの出典明記のうえでの掲載可否を尋ねる' +
        '絞り込み再質問を送信済み。新規下書きは不要・返信待ち'
    ),
  },
  yamaguchi: { prefecture: 'yamaguchi', sourceHost: '.lg.jp', ...UNKNOWN() },
  kagoshima: {
    prefecture: 'kagoshima',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・返信待ち。2026-08-28夜に判明: 2026-08-23 20:54:04付でkou-kyoiku@pref.kagoshima.lg.jp宛の' +
        '既存スレッド(2026-08-06が初回)へ「応募状況」データの出典明記のうえでの掲載可否を尋ねる' +
        '絞り込み再質問を送信済み。新規下書きは不要・返信待ち'
    ),
  },
  niigata: { prefecture: 'niigata', sourceHost: '.lg.jp', ...UNKNOWN() },
  okinawa: {
    prefecture: 'okinawa',
    sourceHost: '.lg.jp',
    redistribution: 'ok',
    evidence:
      '沖縄県教育委員会県立学校教育課からGmail回答（2026-08-24 09:22・スレッド1a03126277ffefe6）: ' +
      '「公表データの転載および当課ウェブサイトへのリンク設定につきましては、差し支えございません。' +
      'ご提示いただいた通り、出典（資料名およびURL）を明記のうえ、ご活用いただけますと幸いです」。' +
      '「応募状況」（募集人員・志願者数・倍率等）データの再配布・引用を出典明記条件で明確に許諾。' +
      'gifu/mieと異なり被リンクも明示的にOKだった（唯一の完全許諾県）。「公表データの更新やURLの' +
      '変更等が予告なく行われる場合がある」旨の留保あり＝A-2実装時は出典URLの定期疎通確認が必要。' +
      'A-2実装時はこの県のレコードに出典URLを必ず付与する条件で応募状況データを収録してよい',
    verifiedAt: '2026-08-24',
  },
  yamanashi: { prefecture: 'yamanashi', sourceHost: '.lg.jp', ...UNKNOWN() },
  nara: {
    prefecture: 'nara',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 高校教育課本体は問い合わせフォームのみで直メール無しだったが、' +
        '同課所管のキャリアサポートセンターのページ(生HTML確認・実体参照デコード済み)で' +
        'k6_career@e-net.nara.jpを発見・実在確認済み。担当違いの可能性を明記しつつ応募状況データの' +
        '出典明記のうえでの掲載可否を尋ねる初回メール下書きを設置(draftId ' +
        'r3298031575527760230・送信は👤)'
    ),
  },
  akita: {
    prefecture: 'akita',
    sourceHost: '.lg.jp',
    redistribution: 'ok',
    evidence:
      '秋田県教育庁高校教育課の当初回答（2026-08-17 11:46・スレッド1a00d9d5bfb6b04e）は' +
      '「当課公式サイトでは個人サイトへの参照を認めておりません」＝被リンク不可のみで再配布可否には' +
      '未言及だった。2026-08-23に「応募状況」データの出典明記掲載可否のみを尋ねる追撃返信' +
      '（draftId r6726729720611278416）を送信、2026-08-26 16:25に別スレッド（1a03cf5e1c98e827）で' +
      '回答: 「秋田県公立高等学校入学者選抜の『応募状況』（募集人員・志願者数・倍率等）の数値に' +
      'つきまして、公表データをそのまま掲載し、出典を明記していただけるのであれば、貴サイトへの' +
      '掲載につきましては差し支えございません」と明確な許諾。gifu/mieと同型（被リンクは不可・' +
      '再配布のみ許諾）。A-2実装時はこの県のレコードに出典URLを必ず付与する条件で応募状況データ' +
      '（募集人員・志願者数・倍率等）を収録してよい',
    verifiedAt: '2026-08-26',
  },
  aomori: {
    prefecture: 'aomori',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 学校教育課高等学校指導グループのページを生HTMLで確認したが電話・FAX' +
        'のみでメール記載無し。県全体の「ご意見・ご提案」フォーム(外部s-kantan.jp)はあるが教育政策課' +
        '情報広報グループ宛の一般窓口であり高校教育課専用ではない。専用の直接連絡手段が無いため' +
        '初回接触は保留し優先度を下げる'
    ),
  },
  iwate: {
    prefecture: 'iwate',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・返信待ち。2026-08-23付でDB0003@pref.iwate.jp宛の既存スレッド(2026-08-17に一度' +
        'リンク不可の回答あり)へ「応募状況」データの出典明記のうえでの掲載可否を尋ねる絞り込み' +
        '再質問を送信済み(2026-08-28再調査で重複送信ではないと確認)。新規下書きは不要・返信待ち'
    ),
  },
  kyoto: {
    prefecture: 'kyoto',
    sourceHost: '.lg.jp（実質公的）',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 高校教育課の部署直通メールは公式サイト上に見当たらず、電話番号のみ' +
        '掲載（loopは電話不可）。京都府教育委員会の全体窓口「ご意見箱」(goikenbako@kyoto-be.ne.jp)' +
        'へ、高校教育課への取次ぎを依頼する初回問い合わせメールの下書きを設置（draftId ' +
        'r5483203572825509665・送信は👤）'
    ),
  },
  yamagata: {
    prefecture: 'yamagata',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認。2026-08-28調査: 高校教育課(所管確認済み)の公式サイト・R8入学者選抜情報ページ・' +
        '教育相談窓口ページのいずれにもメールアドレス・問い合わせフォームが一切掲載されておらず' +
        '(電話023-630-3287/FAXのみ)、教育委員会全体の「ご意見箱」的な代替窓口も見つからなかった。' +
        'loopは電話・郵送に対応できないため、メールでの初回接触ルートが無い(架空アドレスは作らない)。' +
        '次に手を付けるなら👤による電話または郵送が必要（優先度は他県より低い）'
    ),
  },
  aichi: {
    prefecture: 'aichi',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '愛知県教育委員会高等学校教育課からGmail回答あり（2026-08-13）だが内容は「外部サイト等を' +
        '紹介することはしておりません」＝gifuと同型の被リンク可否の回答のみで、再配布（引用・' +
        'データ商品への収録）可否には言及していない。再配布の可否は別途確認が必要（要再確認）。' +
        '【2026-08-28追記・T-C9】gifu/mie/akitaと同型の「応募状況データの出典明記のうえでの掲載可否' +
        'のみ」を尋ねる再質問の返信下書きを設置済み（draftId r-6612380911013100538・送信は👤・返信待ち）'
    ),
  },
  wakayama: {
    prefecture: 'wakayama',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '和歌山県教育庁県立学校教育課からGmail回答あり（2026-08-12 16:49）だが内容は「本県においては' +
        '公的団体のページ以外へのリンクは原則として行っておらず...個人が運営されているホームページ' +
        '等へのリンクを挿入することは、公平性や中立性の観点から困難」＝mie/ishikawaと同型の被リンク' +
        '可否の回答のみで、再配布（引用・データ商品への収録）可否には言及していない。' +
        '再配布の可否は別途確認が必要（要再確認）。' +
        '【2026-08-28追記・T-C9】gifu/mie/akitaと同型の「応募状況データの出典明記のうえでの掲載可否' +
        'のみ」を尋ねる再質問の返信下書きを設置済み（draftId r-4191017784548390043・送信は👤・返信待ち）'
    ),
  },
  shimane: {
    prefecture: 'shimane',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '未確認・返信待ち。2026-08-28調査: 学校教育課ページの生HTMLでmailtoリンクのhref属性' +
        '(shidou@pref.shimane.lg.jp)と表示テキスト(gakkoukyouiku@pref.shimane.lg.jp)が食い違って' +
        'いたため一時保留としたが、同日夜にGmail送信履歴を確認したところ2026-08-23 22:12:55付で' +
        'gakkoukyouiku@pref.shimane.lg.jp宛(表示テキスト側)に既に「応募状況」データの絞り込み' +
        '再質問を送信済み(2026-08-06初回の返信)と判明。このアドレスは既に使われ実在が裏付けられた' +
        'ため要検証状態は解消・新規下書きは不要で返信待ち'
    ),
  },
  shiga: {
    prefecture: 'shiga',
    sourceHost: '.lg.jp',
    ...UNKNOWN(
      '⚠️2026-08-28夜に判明: 同日04:19作成のdraftId r-8409111603568947518' +
        '(ma0902@pref.shiga.lg.jp宛)を送信済みの初回メールと誤認して作成したが、実際には' +
        '2026-08-23 20:53:58に既に別アドレス(ma09@pref.shiga.lg.jp)へ同内容の「応募状況」データ' +
        '絞り込み再質問を送信済みだった(2026-08-06初回の返信)。アドレスは異なるが同じ高校教育課への' +
        '実質重複の問い合わせとなるため、**draftId r-8409111603568947518は送信を見合わせ、' +
        '2026-08-23送信分の返信を待つことを優先すべき**。T-C9-license-outreach.mdの「未接触39県」' +
        '表がこの8/23一括送信を反映しておらず未接触と誤認したことが原因'
    ),
  },
  fukushima: { prefecture: 'fukushima', sourceHost: '.lg.jp', ...UNKNOWN() },
  hokkaido: { prefecture: 'hokkaido', sourceHost: '.lg.jp', ...UNKNOWN() },
};

/** `redistribution: 'ok'`の県コード一覧。A-2（配布API）はこれ以外を出さない。 */
export function redistributableOkPrefectures(): string[] {
  return Object.values(DATA_LICENSE_LEDGER)
    .filter((e) => e.redistribution === 'ok')
    .map((e) => e.prefecture);
}
