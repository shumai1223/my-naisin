/**
 * 富山県私立高等学校の学費データ（掛-3・横展開7県目）。
 * private-school-detail/toyama.tsで到達済みの10校を個別公式サイトで再調査。
 * 富山第一高等学校・高岡第一高等学校は学費専用ページ/募集情報で入学金等の一部額面を
 * 確認できたが、他8校は下記の理由で確度の高い額面(gross)を確認できずスキップ台帳へ計上する。
 *
 * 【重要な限界】富山県内の複数校（富山第一・富山国際大学付属等）は令和8年度の国の
 * 就学支援金拡充により授業料が「実質無償」と広報するのみで、相殺前の額面授業料そのものを
 * ページに明記しない傾向が強い。額面が明記されている費目のみを収録し、授業料額面が不明な
 * 学校は無理に推定しない（掛-3の設計方針を継続）。
 */
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

export const PRIVATE_SCHOOL_TUITION_TOYAMA: PrivateSchoolTuitionFile = {
  prefectureCode: 'toyama',
  schools: [
    {
      schoolCode: 'D116320156034',
      schoolName: '富山第一高等学校',
      fiscalYearLabel: '2026年度',
      fees: [
        { label: '入学金', amount: 130000, billingCycle: 'one_time' },
        { label: '生徒会費', amount: 500, billingCycle: 'monthly' },
        { label: '後援会費', amount: 1200, billingCycle: 'monthly' },
        { label: '施設設備費', amount: 1000, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note:
        '公式サイト「学納金・奨学金」ページより。入学金は通常額130,000円（対象世帯は減免後5,650円）。' +
        '2026年度より国の高等学校等就学支援金制度拡充により授業料が実質無償化されたと明記されるが、' +
        '相殺前の額面授業料そのものはページに記載が無いため収録していない（掛-3の設計方針=推定禁止）。' +
        '実習教材費（副教材費・模試受験料・研修旅行積立金・タブレット端末費を含み月額12,000〜14,000円・' +
        '学年/コースにより変動し卒業時精算）も固定額でないためfeesに含めず、hasUnspecifiedAdditionalFees' +
        '=trueで存在のみ明示した。',
      source: {
        url: 'https://www.tomiichi.ed.jp/admission/fees',
        docTitle: '学納金・奨学金｜富山第一高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
    {
      schoolCode: 'D116320256015',
      schoolName: '学校法人高岡第一学園高岡第一高等学校',
      fiscalYearLabel: 'ページ内に年度表記なし（確認日時点）',
      fees: [{ label: '入学金', amount: 130000, billingCycle: 'one_time' }],
      hasUnspecifiedAdditionalFees: true,
      note:
        '公式サイトの入学手続き案内より、入学金は1次手続50,000円+2次手続80,000円=130,000円の分割納入' +
        '（推薦Ⅰ・一般Ａは一括納入）。県立高校合格発表前に40,000円を先行納入する制度もある。月額授業料' +
        'その他の校納金は「就学支援金を差し引いた額」としか案内されておらず相殺前の額面が確認できな' +
        'かったため、入学金のみの収録に留めた。',
      source: {
        url: 'https://www.takaoka1-h.ed.jp/2025/03/14/%E5%85%A5%E5%AD%A6%E9%87%91%E3%81%AE%E6%B1%BA%E6%B8%88%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/',
        docTitle: '入学金の決済・入学手続きについて｜高岡第一高等学校',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D116320156016',
      schoolName: '不二越工業高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D116320156025',
      schoolName: '龍谷富山高等学校',
      reason: '公式サイト(ryukokutoyama.jp)に学費専用ページへの直接リンクが見当たらず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D116320156043',
      schoolName: '高朋高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D116320156052',
      schoolName: '富山国際大学付属高等学校',
      reason:
        'WebSearch要約では授業料33,000円/月・入学金130,000円等の具体的数値が示されたが、公式サイトの' +
        '入学案内ページを直接WebFetchで2回確認しても学費の金額は掲載されておらず裏取りができなかった' +
        'ため、既知のWebSearchハルシネーションの罠を踏まえ不採用とした。',
    },
    {
      schoolCode: 'D116320156061',
      schoolName: '片山学園高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D116320256024',
      schoolName: '高岡向陵高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D116320256033',
      schoolName: '高岡龍谷高等学校',
      reason: '公式サイトに学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
    {
      schoolCode: 'D116320456013',
      schoolName: '新川高等学校',
      reason: '公式サイト(niikawa.ed.jp)に学費専用ページへの直接リンクを特定できず、確度の高い額面を確認できなかった。',
    },
  ],
};
