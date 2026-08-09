/**
 * 佐賀県私立高等学校の学費データ（掛-3・横展開6県目）。
 * private-school-detail/saga.tsで到達済みの9校を個別公式サイトで再調査。
 * 龍谷・弘学館・早稲田佐賀の3校は学費専用ページで額面(就学支援金相殺前)を直接確認できたが、
 * 他6校は下記の理由で確度の高い額面を確認できずスキップ台帳へ計上する。
 */
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

export const PRIVATE_SCHOOL_TUITION_SAGA: PrivateSchoolTuitionFile = {
  prefectureCode: 'saga',
  schools: [
    {
      schoolCode: 'D141390000016',
      schoolName: '龍谷高等学校',
      courseName: '文理進学・総合・保育コース',
      fiscalYearLabel: '令和8年度',
      fees: [
        { label: '授業料', amount: 38000, billingCycle: 'monthly' },
        { label: '教育充実費', amount: 9300, billingCycle: 'monthly' },
        { label: '保護者会費', amount: 900, billingCycle: 'monthly' },
        { label: '勝友会費', amount: 2500, billingCycle: 'monthly' },
        { label: '生徒会費', amount: 200, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note:
        '公式サイト「校納金について」ページより額面(就学支援金相殺前)を収録。就学支援金対象者は' +
        '授業料38,000円が減額され実納額12,900円/月になる旨の記載があるが世帯収入依存のため収録せず' +
        '額面のみ収録した。年間諸経費70,000〜110,000円・研修旅行費(令和6年度例136,000円)は変動額の' +
        'ため別途扱い（hasUnspecifiedAdditionalFees=trueはこれらを指す）。',
      source: {
        url: 'https://www.sagaryukoku.ed.jp/hsc/entrance_exam/cost_payment.php',
        docTitle: '校納金について｜必要な費用｜入試情報｜龍谷高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D141390000016',
      schoolName: '龍谷高等学校',
      courseName: '特別進学コース',
      fiscalYearLabel: '令和8年度',
      fees: [
        { label: '授業料', amount: 38000, billingCycle: 'monthly' },
        { label: '教育充実費', amount: 13800, billingCycle: 'monthly' },
        { label: '保護者会費', amount: 900, billingCycle: 'monthly' },
        { label: '勝友会費', amount: 2500, billingCycle: 'monthly' },
        { label: '生徒会費', amount: 200, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note: '教育充実費が他コースより高い(13,800円/月)ことを除き他の但し書きは文理進学・総合・保育コースと同じ。原資料の「特進進学コース」を参照台帳のコース名に合わせて「特別進学コース」と表記。',
      source: {
        url: 'https://www.sagaryukoku.ed.jp/hsc/entrance_exam/cost_payment.php',
        docTitle: '校納金について｜必要な費用｜入試情報｜龍谷高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D141390000070',
      schoolName: '弘学館高等学校',
      fiscalYearLabel: '令和7年度',
      fees: [
        { label: '入学金', amount: 150000, billingCycle: 'one_time' },
        { label: '入寮準備金', amount: 100000, billingCycle: 'one_time' },
        { label: '施設拡充費', amount: 110000, billingCycle: 'annual' },
        { label: '授業料', amount: 37000, billingCycle: 'monthly' },
        { label: '学校協力金', amount: 10000, billingCycle: 'monthly' },
        { label: '施設維持費', amount: 10000, billingCycle: 'monthly' },
        { label: '進学指導費', amount: 5500, billingCycle: 'monthly' },
        { label: '機器管理費', amount: 3700, billingCycle: 'monthly' },
        { label: '図書費', amount: 500, billingCycle: 'monthly' },
        { label: '生徒会費', amount: 700, billingCycle: 'monthly' },
        { label: '後援会費', amount: 700, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note:
        '学校月納金の内訳合計(37,000+10,000+10,000+5,500+3,700+500+700+700=68,100円)が公式サイトの' +
        '「学校月納金（合計68,100円）」と完全一致。全寮制のため入寮準備金・寮月納金(男子93,300円/月・' +
        '女子97,300円/月＝月寮費+食費+諸経費)が別途発生するが、性別で金額が分かれ「学校の学費」という' +
        '本レコードの主旨と性質が異なるため寮月納金自体は収録せず、高校研修旅行積立金(150,000円・' +
        '高1時実施)とあわせてhasUnspecifiedAdditionalFees=trueで存在のみ明示した。',
      source: {
        url: 'https://www.kogakukan.ac.jp/high_school_admissions_information/tuition/',
        docTitle: '高校学費・奨学金制度｜弘学館中学校高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D141390000098',
      schoolName: '早稲田佐賀高等学校',
      fiscalYearLabel: '2026年度',
      fees: [
        { label: '入学金', amount: 110000, billingCycle: 'one_time' },
        { label: '授業料', amount: 524400, billingCycle: 'annual' },
        { label: '施設設備費等', amount: 306000, billingCycle: 'annual' },
        { label: '教育充実費', amount: 55000, billingCycle: 'annual' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note:
        '公式サイト「本校の概要」ページの前期/後期別表より年間計を収録(授業料262,200×2=524,400円・' +
        '施設設備費等153,000×2=306,000円・教育充実費は前期のみ55,000円)。合計885,400円が原資料の' +
        '「合計」欄と一致。制服・体操服代等(約50,000円)・研修費等実費(約100,000円)・生徒会費/部活振興費/' +
        '後援会費は別途必要と明記されるが金額詳細が本レコードには含まれないためhasUnspecifiedAdditionalFees=true。',
      source: {
        url: 'https://www.wasedasaga.jp/about/gaiyou/',
        docTitle: '本校の概要｜学校案内｜早稲田大学系属 早稲田佐賀中学校/早稲田佐賀高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D141390000025',
      schoolName: '佐賀清和高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D141390000034',
      schoolName: '佐賀女子短期大学付属佐賀女子高等学校',
      reason:
        'private-school-detail.tsの募集定員調査時点で複数コース(トータルビューティ/進学/美術/保育/' +
        'メディカルケア/ファッション/ビジネス/カフェクリエイト等)を持つと判明しており、コースにより学費が' +
        '異なる可能性が高いが、公式サイトに学費専用ページへの直接リンクを特定できなかった。',
    },
    {
      schoolCode: 'D141390000043',
      schoolName: '佐賀学園高等学校',
      reason:
        '公式サイトに「学費・諸経費・奨学金」ページ(entrance-exam/expenses.html)が存在することは確認' +
        'できたが、今回のWebSearch要約には金額の詳細が含まれず、時間の都合で直接WebFetch確認まで' +
        '至らなかったため次回以降の優先候補として見送り。',
    },
    {
      schoolCode: 'D141390000052',
      schoolName: '北陵高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D141390000061',
      schoolName: '敬徳高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、WebSearch要約にも金額の記載が無かった。',
    },
    {
      schoolCode: 'D141390000089',
      schoolName: '東明館高等学校',
      reason:
        'WebSearch要約で得られた数値(月額58,300円)は「平成26年度(2014年度)」の情報と明記されており' +
        '10年以上前の古いデータで現在の額面として採用できないため見送り。公式サイト' +
        '(tomeikan.ed.jp)への学費専用ページも今回は特定できなかった。',
    },
  ],
};
