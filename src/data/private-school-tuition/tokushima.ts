/**
 * 徳島県私立高等学校の学費データ（掛-3・横展開2県目）。
 * private-school-detail/tokushima.tsで到達済みの3校を中心に個別公式サイトを再調査。
 * 徳島文理・生光学園は学費ページを直接確認できたが、香蘭高等学校は学費の記載を確認できず、
 * マーキュリー国際高等学校は令和8年度時点で開校・認可前のためいずれもスキップ台帳へ計上する。
 */
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

export const PRIVATE_SCHOOL_TUITION_TOKUSHIMA: PrivateSchoolTuitionFile = {
  prefectureCode: 'tokushima',
  schools: [
    {
      schoolCode: 'D136320100028',
      schoolName: '徳島文理高等学校',
      fiscalYearLabel: '令和9年度（2027年度）入学者向け（学校公式サイトの入試日程記載より）',
      fees: [
        { label: '入学金', amount: 200000, billingCycle: 'one_time' },
        { label: '保護者会入会金', amount: 3000, billingCycle: 'one_time' },
        { label: '授業料', amount: 40000, billingCycle: 'monthly' },
        { label: '施設設備費', amount: 17000, billingCycle: 'monthly' },
        { label: '図書費', amount: 400, billingCycle: 'monthly' },
        { label: '校友会費', amount: 200, billingCycle: 'monthly' },
        { label: '体育後援会費', amount: 200, billingCycle: 'monthly' },
        { label: '保護者会費', amount: 200, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: false,
      note:
        '月額費目の内訳合計（40,000+17,000+400+200+200+200=58,000円）が学校公式サイトの' +
        '「合計58,000円」表記と完全一致。私立高校授業料無償化補助金により実質19,900円/月になる' +
        '旨の記載があるが、これは補助金相殺後の実質額のため収録せず額面のみを収録した。教材費・' +
        '検定料等の別途徴収項目への言及はページ内に見当たらなかった（皆無とは断定できない）。',
      source: {
        url: 'http://www.bunri.ed.jp/admission/senior/',
        docTitle: '入試要項（生徒募集人員・学費）｜徳島文理中学校・高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D136320100037',
      schoolName: '学校法人生光学園生光学園高等学校',
      courseName: '前期入試合格者',
      fiscalYearLabel: '令和4年度（ページに明記の年度。以後改定されている可能性に留意）',
      fees: [
        { label: '入学金', amount: 250000, billingCycle: 'one_time' },
        { label: '授業料', amount: 33000, billingCycle: 'monthly' },
        { label: '施設充実費', amount: 14500, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: false,
      note:
        'ページ本文に「令和4年度の生光学園高等学校の入学金、授業料等は以下の通りです」と明記されており、' +
        '取得日(2026-08-09)時点でも最新表記のまま更新されていない可能性がある（公表値をそのまま転記）。' +
        '入学金は前期/後期入試の合格区分で異なるため2レコードに分けて収録した。特待生制度・兄弟姉妹割引・' +
        '授業料軽減補助制度等の減免制度への言及はあるが具体的金額は非公表。',
      source: {
        url: 'https://www.seikogakuen.ac.jp/senior/examination_guide/school_fees.html',
        docTitle: '授業料｜生光学園高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D136320100037',
      schoolName: '学校法人生光学園生光学園高等学校',
      courseName: '後期入試合格者',
      fiscalYearLabel: '令和4年度（ページに明記の年度。以後改定されている可能性に留意）',
      fees: [
        { label: '入学金', amount: 350000, billingCycle: 'one_time' },
        { label: '授業料', amount: 33000, billingCycle: 'monthly' },
        { label: '施設充実費', amount: 14500, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: false,
      note: '入学金以外は前期入試合格者と同額（授業料33,000円/月+施設充実費14,500円/月）。他の注記は前期入試合格者レコードと同じ。',
      source: {
        url: 'https://www.seikogakuen.ac.jp/senior/examination_guide/school_fees.html',
        docTitle: '授業料｜生光学園高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D136320800049',
      schoolName: 'みのり高等学校',
      fiscalYearLabel: 'ページ内に年度表記なし（確認日時点）',
      fees: [
        { label: '入学検定料', amount: 10000, billingCycle: 'one_time' },
        { label: '施設設備費', amount: 36000, billingCycle: 'annual' },
        { label: '教育運営費', amount: 50000, billingCycle: 'annual' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note:
        '通信制・単位制のため入学金は不要（0円、ページに明記）。授業料は「1単位12,000円×履修単位数' +
        '（年間8単位以上）」という単位従量制で、3年卒業を目指す新入学者の目安は年間24〜25単位程度と' +
        '案内されているが、履修単位数は生徒により変動するため固定額として収録できず、fees配列には含めず' +
        'このnoteに記述するに留めた（hasUnspecifiedAdditionalFees=trueは主にこの授業料の未確定性を指す）。' +
        '教育充実費は「地域により変更あり」として具体額が非公表。',
      source: {
        url: 'https://www.minori-hs.ed.jp/guide/',
        docTitle: '入学案内｜通信制高等学校 学校法人明里学園「みのり高等学校」',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D136320100019',
      schoolName: '香蘭高等学校',
      reason:
        '公式サイト(kouran-kou.jp)のナビゲーションに学費・入学金・授業料関連のページへのリンクが' +
        '見当たらず、WebSearch要約で入学金5,650円という断片的な数値が出たが単一の信頼できない情報源' +
        '(直接WebFetchで裏取りできず)のため採用せず見送り。',
    },
    {
      schoolCode: 'D136320100046',
      schoolName: 'マーキュリー国際高等学校',
      reason: '2026年4月開校予定・認可申請中の新設校であり、令和8年度時点でまだ開校・認可前のため学費が公表されていない（private-school-detail/tokushima.tsの募集定員調査時と同じ理由）。',
    },
  ],
};
