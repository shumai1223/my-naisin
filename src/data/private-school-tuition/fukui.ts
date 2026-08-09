/**
 * 福井県私立高等学校の学費データ（掛-3・横展開4県目）。
 * private-school-detail/fukui.tsで到達済みの8校を個別公式サイトで再調査。
 * 仁愛女子高等学校は「入学に必要な経費」「学校納入金納付額一覧」の2PDFで入学金・コース別の
 * 学納金（就学支援金相殺前の額面）を直接確認できたが、他7校は下記の理由で確度の高い
 * 額面(gross)を確認できずスキップ台帳へ計上する。
 */
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

const JINAI_NOTE_BASE =
  '「学校納入金納付額一覧（令和7年度入学生）」の「○授業料等内訳」表（就学支援金相殺前の額面＝' +
  '①本来の授業料+施設設備費+特別指導費）と「○その他の納入金」（教育振興会費1,200+生徒会費600+' +
  '後援会費3,000=4,800円/月・コース共通）を合算。就学支援金額そのもの（世帯収入により0〜46,950円/月' +
  '変動）は世帯収入依存のため収録せず額面のみを収録した。入学金5,650円は「入学に必要な経費」PDFに' +
  '全コース共通と明記（福井県立高校の入学金相当額と同額）。';

export const PRIVATE_SCHOOL_TUITION_FUKUI: PrivateSchoolTuitionFile = {
  prefectureCode: 'fukui',
  schools: [
    {
      schoolCode: 'D118310000022',
      schoolName: '仁愛女子高等学校',
      courseName: '商業／進学コース',
      fiscalYearLabel: '令和7年度（2025年度）入学生',
      fees: [
        { label: '入学金', amount: 5650, billingCycle: 'one_time' },
        { label: '授業料', amount: 33000, billingCycle: 'monthly' },
        { label: '施設設備費', amount: 10600, billingCycle: 'monthly' },
        { label: 'その他の納入金（教育振興会費+生徒会費+後援会費）', amount: 4800, billingCycle: 'monthly' },
        { label: '修学旅行積立金', amount: 10000, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: false,
      note: JINAI_NOTE_BASE + '本コースは特別指導費0円・修学旅行積立金10,000円/月（1年生4月分〜2年生6月分まで）。',
      source: {
        url: 'https://www.jin-ai-h.ed.jp/entrance-exam/nyugakugo.pdf',
        docTitle: '学校納入金納付額一覧（令和7年度入学生）｜仁愛女子高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D118310000022',
      schoolName: '仁愛女子高等学校',
      courseName: '特別進学コース',
      fiscalYearLabel: '令和7年度（2025年度）入学生',
      fees: [
        { label: '入学金', amount: 5650, billingCycle: 'one_time' },
        { label: '授業料', amount: 33000, billingCycle: 'monthly' },
        { label: '施設設備費', amount: 10600, billingCycle: 'monthly' },
        { label: '特別指導費', amount: 2250, billingCycle: 'monthly' },
        { label: 'その他の納入金（教育振興会費+生徒会費+後援会費）', amount: 4800, billingCycle: 'monthly' },
        { label: '修学旅行積立金', amount: 20000, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: false,
      note: JINAI_NOTE_BASE + '本コースは修学旅行積立金20,000円/月（1年生4月分〜2年生6月分まで）。',
      source: {
        url: 'https://www.jin-ai-h.ed.jp/entrance-exam/nyugakugo.pdf',
        docTitle: '学校納入金納付額一覧（令和7年度入学生）｜仁愛女子高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D118310000022',
      schoolName: '仁愛女子高等学校',
      courseName: '英語留学コース',
      fiscalYearLabel: '令和7年度（2025年度）入学生',
      fees: [
        { label: '入学金', amount: 5650, billingCycle: 'one_time' },
        { label: '授業料', amount: 33000, billingCycle: 'monthly' },
        { label: '施設設備費', amount: 10600, billingCycle: 'monthly' },
        { label: '特別指導費', amount: 2250, billingCycle: 'monthly' },
        { label: 'その他の納入金（教育振興会費+生徒会費+後援会費）', amount: 4800, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: false,
      note: JINAI_NOTE_BASE + '本コースは「学校納入金納付額一覧」の④欄が4,800円のみで修学旅行積立金の別建ては見当たらなかった。',
      source: {
        url: 'https://www.jin-ai-h.ed.jp/entrance-exam/nyugakugo.pdf',
        docTitle: '学校納入金納付額一覧（令和7年度入学生）｜仁愛女子高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D118310000022',
      schoolName: '仁愛女子高等学校',
      courseName: 'グローバル・サイエンスコース',
      fiscalYearLabel: '令和7年度（2025年度）入学生',
      fees: [
        { label: '入学金', amount: 5650, billingCycle: 'one_time' },
        { label: '授業料', amount: 33000, billingCycle: 'monthly' },
        { label: '施設設備費', amount: 10600, billingCycle: 'monthly' },
        { label: '特別指導費', amount: 3350, billingCycle: 'monthly' },
        { label: 'その他の納入金（教育振興会費+生徒会費+後援会費）', amount: 4800, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: false,
      note: JINAI_NOTE_BASE + '本コースも④欄が4,800円のみで修学旅行積立金の別建ては見当たらなかった。',
      source: {
        url: 'https://www.jin-ai-h.ed.jp/entrance-exam/nyugakugo.pdf',
        docTitle: '学校納入金納付額一覧（令和7年度入学生）｜仁愛女子高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D118310000013',
      schoolName: '北陸高等学校',
      reason:
        '公式サイト(hokuriku.ed.jp)にcurl/WebFetchいずれも接続できず(DNS解決不可)、専用の学費ページ' +
        '(admission/price/)へも到達できなかった。WebSearch要約の数値(入学金5,650円等)は単一ソースかつ' +
        '直接裏取りができないため不採用。',
    },
    {
      schoolCode: 'D118310000031',
      schoolName: '福井工業大学附属福井高等学校',
      reason:
        '公式の学費ページ(for-examinee/tuition/)は就学支援金相殺後の実質負担額(世帯年収帯ごとに授業料' +
        '0円+教育充実費7,500〜15,000円)のみを掲載しており、相殺前の額面(gross)の授業料そのものが' +
        'ページ内に見当たらなかったため、掛-3の設計方針(額面のみ収録)に合わず見送り。',
    },
    {
      schoolCode: 'D118310000040',
      schoolName: '啓新高等学校',
      reason:
        '公式サイトに学費専用ページへの直接リンクを特定できず、WebSearch要約も「入学金5,000〜5,650円' +
        '(福井県内私立高共通の制度説明)」という県全体の制度紹介に留まり本校固有の額面授業料を' +
        '確認できなかったため見送り。',
    },
    {
      schoolCode: 'D118310000059',
      schoolName: '敦賀国際令和高等学校',
      reason:
        'private-school-detail/fukui.tsの募集定員調査時点で「入学希望者数不足のため次年度以降の生徒' +
        '募集を停止する」旨の学校発表(2022年1月)が見つかっており、募集状況自体に不確実性があるため' +
        '学費調査も見送り。',
    },
    {
      schoolCode: 'D118310000068',
      schoolName: '敦賀気比高等学校',
      reason:
        'WebSearch要約で「入学金30,000〜202,200円・授業料5,650〜396,000円」という極端に広い金額幅が' +
        '示されたが、これはコース/学年/中学校からの内部進学等による複数制度が混在した集計と推測され、' +
        'どの数値がどの区分に対応するか単一の要約からは切り分けられず、公式の学費専用ページも' +
        '特定できなかったため見送り。',
    },
    {
      schoolCode: 'D118310000077',
      schoolName: '福井南高等学校',
      reason:
        'private-school-detail/fukui.tsの募集定員調査時点で確認できたのは令和6年度の推薦・一般募集' +
        '人数のみで学費情報ではなく、今回の学費調査でも公式サイトに学費専用ページを特定できなかった。',
    },
    {
      schoolCode: 'D118310000086',
      schoolName: 'ＡＯＩＫＥ高等学校',
      reason:
        '広域通信制高校（全国募集）であり、学費が学習センターごとに異なる可能性が高く、福井県内向けの' +
        '単一の額面を公式サイトから特定できなかったため見送り。',
    },
  ],
};
