/**
 * 高知県私立高等学校の学費データ（掛-3・横展開5県目）。
 * private-school-detail/kochi.tsで到達済みの9校を個別公式サイトで再調査。
 * 土佐塾高等学校・高知学芸高等学校は学校公式サイトの学費専用ページで入学時納入金・
 * 月額納入金を直接確認できたが、他7校は下記の理由で確度の高い額面(gross)を
 * 確認できずスキップ台帳へ計上する。
 */
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

export const PRIVATE_SCHOOL_TUITION_KOCHI: PrivateSchoolTuitionFile = {
  prefectureCode: 'kochi',
  schools: [
    {
      schoolCode: 'D139310000081',
      schoolName: '土佐塾高等学校',
      courseName: '普通科',
      fiscalYearLabel: 'ページ内に年度表記なし（確認日時点）',
      fees: [
        { label: '入学金', amount: 150000, billingCycle: 'one_time' },
        { label: '施設協力金', amount: 200000, billingCycle: 'one_time' },
        { label: '授業料（施設協力金込み月額）', amount: 40000, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note:
        '公式サイト「入学金・授業料・寮費・減免制度」ページより。入学時納入金は入学金150,000円+' +
        '施設協力金200,000円=350,000円、月額は授業料+施設協力金で40,000円（ページの記載どおり' +
        '単一の月額として掲載され内訳の按分は示されていないため単一費目として収録）。制服・体操服・' +
        '教材費等（概算10万円程度）やタブレット利用料は別途で金額詳細を本レコードに含めていない。',
      source: {
        url: 'https://www.tosajuku.ed.jp/money.html',
        docTitle: '入学金・授業料・寮費・減免制度｜入学案内｜土佐塾中学・高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D139310000081',
      schoolName: '土佐塾高等学校',
      courseName: 'まなび創造コース',
      fiscalYearLabel: 'ページ内に年度表記なし（確認日時点）',
      fees: [
        { label: '入学金', amount: 150000, billingCycle: 'one_time' },
        { label: '施設協力金', amount: 200000, billingCycle: 'one_time' },
        { label: '授業料（施設協力金込み月額）', amount: 40000, billingCycle: 'monthly' },
        { label: 'まなび創造費', amount: 10000, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note: '普通科の月額に加えて「まなび創造費」10,000円/月が別途加算される。入学時納入金・その他の但し書きは普通科レコードと同じ。',
      source: {
        url: 'https://www.tosajuku.ed.jp/money.html',
        docTitle: '入学金・授業料・寮費・減免制度｜入学案内｜土佐塾中学・高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D139310000054',
      schoolName: '高知学芸高等学校',
      fiscalYearLabel: 'ページ内に年度表記なし（確認日時点。中学校側は「令和4年4月入学者より」の表記あり）',
      fees: [
        { label: '入学金', amount: 160000, billingCycle: 'one_time' },
        { label: '施設協力金', amount: 50000, billingCycle: 'one_time' },
        { label: '後援会入会金', amount: 1000, billingCycle: 'one_time' },
        { label: '生徒会入会金', amount: 300, billingCycle: 'one_time' },
        { label: '授業料', amount: 37500, billingCycle: 'monthly' },
        { label: '後援会費', amount: 700, billingCycle: 'monthly' },
        { label: '生徒会費', amount: 350, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: false,
      note:
        '公式サイト「入学金・授業料について」ページより。入学時費用の内訳合計(160,000+50,000+1,000+' +
        '300=211,300円)、月額費用の内訳合計(37,500+700+350=38,550円)とも原資料の合計表記と完全一致。' +
        'WebSearch要約では授業料32,500円と誤って要約されたが、直接WebFetchで37,500円と確認し訂正した' +
        '（既知の罠=WebSearch要約の数値誤りパターン）。',
      source: {
        url: 'https://www.kochi-gakugei.ed.jp/page.html?id=47',
        docTitle: '入学金・授業料について｜入学案内｜高知学芸中学高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D139310000090',
      schoolName: '太平洋学園高等学校',
      reason:
        '通信制・単位制（1単位8,000〜9,000円程度）で履修単位数により総額が変動するため固定額として' +
        '収録できず、公式サイト(taiheiyo.ed.jp)にも学費専用ページへの直接リンクが見当たらなかった。' +
        'WebSearch要約の数値は複数の異なる金額(425,000円・99,200円・475,000円等)が並記され' +
        'どの区分に対応するか単一の要約からは切り分けられないため不採用。',
    },
    {
      schoolCode: 'D139310000018',
      schoolName: '土佐高等学校',
      reason:
        '公式サイト(tosa.ed.jp)に学費専用ページへの直接リンクが見当たらず、WebSearchで見つかった' +
        'PDF(tosa.ed.jp/information/2/2.pdf)も学校周辺の交通安全マップであり学費とは無関係だった。' +
        'WebSearch要約の納入金645,900円等の数値は単一ソースかつ直接WebFetch裏取りができないため不採用。',
    },
    {
      schoolCode: 'D139310000036',
      schoolName: '高知高等学校',
      reason:
        '公式サイト(kochi-h.ed.jp)の学費専用ページを特定できず、WebSearch要約も具体的な金額を示せて' +
        'いなかった（項目名の列挙のみ）ため見送り。',
    },
    {
      schoolCode: 'D139310000045',
      schoolName: '清和女子高等学校',
      reason: 'private-school-detail.tsの募集定員調査時点で高知県私立中学高等学校連合会の一覧に学校名が見当たらなかった学校であり、今回の学費調査でも公式サイトの学費ページを特定できなかった。',
    },
    {
      schoolCode: 'D139310000063',
      schoolName: '高知中央高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D139310000072',
      schoolName: '明徳義塾高等学校',
      reason:
        '県内推薦枠/一般入試(県外)枠/一般入試(一般)枠という複数の地域別募集区分を持つ学校であり、' +
        '学費も区分により異なる可能性が高いが、公式サイトに学費専用ページへの直接リンクを特定できず' +
        '見送り。',
    },
    {
      schoolCode: 'D139310000027',
      schoolName: '土佐女子高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
  ],
};
