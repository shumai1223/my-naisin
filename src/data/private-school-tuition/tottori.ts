/**
 * 鳥取県私立高等学校の学費データ（掛-3第一段・手動収集・パイロット県）。
 *
 * private-school-detail/tottori.ts（Λ-5第二段・募集定員）で募集要項に到達済みの4校を対象に
 * 学費情報を調査。鳥取城北高等学校は学校公式サイトの専用ページで入学金・月額納付金の内訳が
 * 確認でき内部整合性（内訳合計=月額納付金）も一致したため収録。残り3校は下記の理由で
 * 確度の高い金額を確認できずスキップ台帳へ計上する。
 *
 * 【掛-3の設計方針・初回確立】就学支援金による相殺後の実質負担額は世帯収入依存のため収録せず、
 * 相殺前の額面（gross）のみを収録する。研修旅行費等の金額非公表の別途徴収項目は
 * hasUnspecifiedAdditionalFeesで正直に明示し、合計値の独自計算はしない。
 */
import type { PrivateSchoolTuitionFile } from '@/lib/private-school-tuition';

export const PRIVATE_SCHOOL_TUITION_TOTTORI: PrivateSchoolTuitionFile = {
  prefectureCode: 'tottori',
  schools: [
    {
      schoolCode: 'D131310000025',
      schoolName: '鳥取城北高等学校',
      fiscalYearLabel: 'ページ内に年度表記なし（確認日時点）',
      fees: [
        { label: '入学金', amount: 100000, billingCycle: 'one_time' },
        { label: '授業料', amount: 38000, billingCycle: 'monthly' },
        { label: '教育振興費', amount: 9000, billingCycle: 'monthly' },
        { label: 'PTA会費', amount: 500, billingCycle: 'monthly' },
        { label: '生徒会費', amount: 1500, billingCycle: 'monthly' },
        { label: 'クラブ強化費', amount: 1000, billingCycle: 'monthly' },
      ],
      hasUnspecifiedAdditionalFees: true,
      note:
        '「月額納付金内訳」（授業料38,000円+教育振興費9,000円+PTA会費500円+生徒会費1,500円+' +
        'クラブ強化費1,000円=50,000円）がページに明記された「月額納付金50,000円」と完全一致した。' +
        '研修旅行費・教材費・模試・検定費等は「別途徴収」と明記されるが金額は非公表。授業料は' +
        '国の就学支援金制度・鳥取県の総合支援制度により所得に応じて全額/一部免除の場合がある' +
        '（本レコードは相殺前の額面）。',
      source: {
        url: 'https://www.tottori-johoku.ed.jp/prospectus/money',
        docTitle: '学費等について（鳥取城北高等学校）',
        fetchedAt: '2026-08-09',
        sourceTier: 'primary',
      },
    },
  ],
  skipped: [
    {
      schoolCode: 'D131310000052',
      schoolName: '米子松蔭高等学校',
      reason:
        '公式サイトの「学費・奨学制度」ページ(yonagoshoin.ed.jp/shoin/seido/index.html)は月額納付金の' +
        '内訳（授業料38,000円等）は確認できたが、就学支援金相殺後の実質額(3,500円)のみの掲載で' +
        '入学金の記載が無く、ページ内検索でも「入学金」「入学時」の語が見つからなかったため、' +
        '初年度費用の全体像を確度高く確認できず見送り。',
    },
    {
      schoolCode: 'D131310000070',
      schoolName: '湯梨浜学園高等学校',
      reason:
        '公式サイトのQ&Aページ(yurihamagakuen.ac.jp/qa/)に学費の具体的金額の記載が無く、' +
        '兄弟減免制度の説明（施設設備拡充費が月額10,000円である旨の言及）はあるものの' +
        '入学金・授業料本体の金額を直接確認できるページを特定できなかったため見送り。',
    },
    {
      schoolCode: 'D131310000016',
      schoolName: '鳥取敬愛高等学校',
      reason:
        'WebSearch要約では入学金60,000円・月額納付金41,600円等の数値が示されたが、公式サイト' +
        '(t-ki.jp)内の入試情報ページ(pages/21等)を直接WebFetchでは学費の記載を確認できなかった。' +
        'WebSearch要約は実在しない数値を作話することがあると判明済み（fable5-loop-protocol既知の罠）' +
        'のため、直接WebFetchで裏取りできない数値は採用せず見送り。',
    },
  ],
};
