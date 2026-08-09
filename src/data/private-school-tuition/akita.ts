/**
 * 秋田県私立高等学校の学費データ（掛-3・横展開3県目）。
 * private-school-detail/akita.tsで到達済みの5校を個別公式サイトで再調査。
 * 秋田令和高等学校は入学手続き金の内訳PDFを直接確認できたが、他4校は下記の理由で
 * 確度の高い金額を確認できずスキップ台帳へ計上する。
 */
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

export const PRIVATE_SCHOOL_TUITION_AKITA: PrivateSchoolTuitionFile = {
  prefectureCode: 'akita',
  schools: [
    {
      schoolCode: 'D105320159034',
      schoolName: '秋田令和高等学校',
      fiscalYearLabel: '令和8年度入学者向け（一期・二期入試とも同額）',
      fees: [
        { label: '入学金', amount: 150000, billingCycle: 'one_time' },
        { label: '校舎改築資金', amount: 40000, billingCycle: 'one_time' },
        { label: '学園協力金', amount: 30000, billingCycle: 'one_time' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note:
        '募集要項PDF(1期・2期入試とも「入学手続き」欄)に「納付金：220,000円（内訳：入学金150,000円+' +
        '校舎改築資金40,000円+学園協力金30,000円）」と明記され両期で完全一致した。' +
        '一方、月額/年額の授業料そのものは募集要項PDF・学費専用ページのいずれにも金額の記載が' +
        '見当たらなかった（学費専用ページは制服・教科書・修学旅行費等の付随費用のみを公開しており' +
        '核心の授業料額は非公開だった）。hasUnspecifiedAdditionalFees=trueは主にこの授業料額の' +
        '未確認を指す。',
      source: {
        url: 'https://www.akitareiwa-h.ed.jp/admission/dl/2026youkou.pdf',
        docTitle: '令和8年度秋田令和高等学校生徒募集要項',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D105320159025',
      schoolName: '国学館高等学校',
      reason:
        '公式サイトに学費ページへの直接リンクが見当たらず、募集要項PDF(seitobosyu_2026.pdf・全7頁)は' +
        'pdftoppmでレンダリングしてもフォント欠損で文字が一切表示されない重症ケースだったため内容を' +
        '確認できなかった。WebSearch要約の入学金220,000円等の数値は単一ソースかつ直接WebFetch裏取りが' +
        'できないため不採用。',
    },
    {
      schoolCode: 'D105320159043',
      schoolName: 'ノースアジア大学明桜高等学校',
      reason:
        '入学試験要項PDF(全12頁・既にprivate-school-detail収録時に到達済み)をpdftotextでキーワード' +
        '検索したが学費関連の記載が見当たらず、公式サイトのトップページにも学費専用ページへのリンクが' +
        '見当たらなかった。WebSearch要約の入学金160,000円・授業料369,000円等の数値は単一ソースかつ' +
        '直接WebFetch裏取りができないため不採用。',
    },
    {
      schoolCode: 'D105320159016',
      schoolName: '聖霊女子短期大学付属高等学校',
      reason:
        '公式サイト(akita-seirei.ac.jp/highschool/)に学費専用ページへの直接リンクが見当たらず' +
        '(「奨学金制度・就学支援金」PDFはあるが学費本体ではない)、確度の高い金額を確認できなかった。' +
        'WebSearch要約の入学金150,000円・授業料月額29,000〜31,000円等の数値は単一ソースかつ直接' +
        'WebFetch裏取りができないため不採用。',
    },
    {
      schoolCode: 'D105321259068',
      schoolName: '秋田修英高等学校',
      reason:
        '公式サイト(akitashuei.net)のメニューに学費専用ページへの直接リンクが見当たらず、' +
        '「サポート制度」ページも財政支援制度の説明に留まり学費本体は非公開だった。WebSearch要約の' +
        '入学金40,000円・授業料250,000円等の数値は単一ソースかつ直接WebFetch裏取りができないため' +
        '不採用（private-school-detail.tsの募集定員調査時もWebFetch失敗で見送られている）。',
    },
  ],
};
