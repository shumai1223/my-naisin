/**
 * 島根県私立高等学校の学費データ（掛-3・横展開8県目）。
 * schools-private/shimane.tsの10校を個別公式サイトで調査（private-school-detail.tsは
 * 全10校が募集定員自体を確認できずスキップ済みの県だが、掛-3は独立した学費調査として
 * 別途10校全てにあたった）。開星高等学校は入学一時金のみ額面(gross)を確認できたが、
 * 他9校は下記の理由で確度の高い額面を確認できずスキップ台帳へ計上する。
 */
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

export const PRIVATE_SCHOOL_TUITION_SHIMANE: PrivateSchoolTuitionFile = {
  prefectureCode: 'shimane',
  schools: [
    {
      schoolCode: 'D132320100380',
      schoolName: '開星高等学校',
      fiscalYearLabel: '令和8年度入学生',
      fees: [
        { label: '入学金', amount: 50000, billingCycle: 'one_time' },
        { label: '特別施設金', amount: 100000, billingCycle: 'one_time' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note:
        '公式サイト「納入金について」ページより、入学一時金150,000円(入学金50,000円+特別施設金' +
        '100,000円)を額面として収録。同ページの「年間授業料及び諸経費」表は「表中の金額は国の' +
        '就学支援金を差し引いたものです」と明記されており、4月納入分の授業料が0円と表示される等' +
        '相殺後の実質額であることが確認できたため、掛-3の設計方針(額面のみ収録)に基づき当該項目は' +
        '収録しなかった（就学支援金は授業料のみに適用され保護者会費等の他費目は影響を受けないはずだが、' +
        '同ページの記載が「表中の金額は」と表全体を指す書き方のため、他費目も含め安全側でfeesに含めず' +
        'hasUnspecifiedAdditionalFees=trueとした）。',
      source: {
        url: 'https://shimane-kaisei.ed.jp/admission/payment',
        docTitle: '納入金について｜学校法人大多和学園 開星中学校・高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D132320100399',
      schoolName: '立正大学淞南高等学校',
      reason:
        '公式サイト(shonangakuen-h.ed.jp)に「高等学校等就学支援金制度」ページは見つかったが学費本体の' +
        '専用ページを特定できず、WebSearch要約にも具体的な金額の記載が無かった。',
    },
    {
      schoolCode: 'D132320100406',
      schoolName: '松徳学院高等学校',
      reason:
        'WebSearch要約で「初年度納入金約510,000円・2年目以降約450,000円」という概算数値が示されたが、' +
        '入学金/授業料等の内訳が示されず単一ソースかつ直接WebFetch裏取りができないため不採用。',
    },
    {
      schoolCode: 'D132320100415',
      schoolName: '松江西高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D132320300422',
      schoolName: '出雲北陵高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D132320300431',
      schoolName: '出雲西高等学校',
      reason:
        '公式サイトに「学費と就学支援金制度について」ページ(izumonishikou.jp/choice/729および' +
        'admission/tuition/)は存在すると確認できたが、直接WebFetchで2回試みても金額を含む本文が取得' +
        'できなかった（JavaScriptによる動的レンダリングの可能性）。WebSearch要約の入学金140,000円・' +
        '年間総額408,000円等の数値は単一ソースかつ裏取りができないため不採用。',
    },
    {
      schoolCode: 'D132320400467',
      schoolName: '明誠高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D132320400476',
      schoolName: '益田東高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D132320700446',
      schoolName: '石見智翠館高等学校',
      reason:
        'WebSearch要約で入学金70,000円・授業料402,000円(年額)という数値が示されたが、公式サイト' +
        '(iwamichisuikan.ed.jp)に学費専用ページへの直接リンクを特定できず直接WebFetchでの裏取りが' +
        'できなかったため不採用。',
    },
    {
      schoolCode: 'D132320700455',
      schoolName: 'キリスト教愛真高等学校',
      reason:
        '小規模な全寮制学校で、private-school-detail.tsの募集定員調査時点でも定員自体が非公表と判明' +
        'している学校であり、今回の学費調査でも公式サイトに学費専用ページを特定できなかった。',
    },
  ],
};
