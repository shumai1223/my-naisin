export type AffiliateId =
  | 'zkai-banner'
  | 'zkai-text-middle'
  | 'zkai-text-advanced'
  | 'zkai-text-request'
  | 'zkai-daigaku'
  | 'shoin-banner'
  | 'sapuri-banner-468'
  | 'sapuri-banner-300'
  | 'sapuri-text'
  | 'sora-juku-text'
  | 'sora-juku-banner'
  | 'morijuku-text'
  | 'morijuku-banner'
  | 'campus-text'
  | 'campus-banner'
  | 'atama-text'
  | 'atama-banner'
  // ── 先回し枠（新ASP・塾/家庭教師の無料体験。リンク確定後に status:'live' + href/pixel を挿すだけ） ──
  | 'afb-juku-trial'
  | 'accesstrade-juku-trial'
  | 'rentracks-juku-trial'
  | 'afb-katei-kyoshi'
  // 家庭教師の先回し枠（もしも審査待ち・CPA¥11,000–13,000）。承認時に href/trackingPixel を差すだけで live。
  | 'gakken-katei-kyoshi'
  | 'ganba-katei-kyoshi'
  | 'manalink-katei-kyoshi'
  // ── 学費クラスタの最高単価帯（保護者＝決裁者・無料相談/資料請求。CPA¥8k–1.5万） ──
  | 'fp-soudan'
  | 'gakushi-hoken'
  // 承認待ちの先回し枠（FP無料相談のA/B候補・学資保険）。承認が来たら href/trackingPixel を差すだけで live。
  | 'hoken-compass'
  | 'money-doctor'
  // ── もしも 提携中（審査なし・2026-06-15 live結線） ──
  | 'moshimo-e-live'
  | 'moshimo-studycoach'
  | 'moshimo-classjapan'
  | 'moshimo-tintoru'
  | 'moshimo-rewrite'
  // ── もしも 提携中（2026-07-07 承認分を live 結線） ──
  // FP・学資（保護者＝決裁者・最高単価帯）／オンライン塾・家庭教師の無料リード。
  | 'moshimo-garden-gakushi' // ガーデン｜学資金の無料相談・面談 CPA¥11,500（審査あり）
  | 'moshimo-garden-chochiku' // ガーデン｜貯蓄の無料相談・面談 CPA¥11,500（審査あり）
  | 'moshimo-manecafe' // マネカフェ｜FP診断 CPA¥11,500（本人OK・審査あり）
  | 'moshimo-minhoken' // みんなの生命保険アドバイザー 無料保険相談 CPA¥17,000（審査あり）
  | 'moshimo-withstudy' // ウィズスタディ｜低価格オンライン塾 無料体験 CPA¥11,500〜18,000
  | 'moshimo-manabuterasu' // まなぶてらす｜オンライン家庭教師 無料体験 CPA¥8,000
  // ── 季節講習の先回し枠（冬期/夏期講習の無料体験・招待）。ASP出品は秋／夏。承認時に href/pixel を差すだけで live。 ──
  // 未approveの間は seasonal が自動で既存塾（そら塾/森塾/キャンパス）にフォールバックするのでデッドリンクは出ない。
  | 'winter-koushuu-trial'
  | 'summer-koushuu-trial'
  // ── アクセストレード 提携承認済み（2026-06-19 live・入会=paid型） ──
  | 'shinken-koukou'
  | 'eten-net';

/** 'pending' は枠だけ確保した未確定案件。AffiliateAd は描画せず（デッドリンクを出さない）、selectLeadOffer も返さない。 */
type AffiliateStatus = 'live' | 'pending';

interface BannerAffiliate {
  id: AffiliateId;
  type: 'banner';
  name: string;
  href: string;
  imgSrc: string;
  width: number;
  height: number;
  trackingPixel: string;
  /** 既定 'live'。未確定枠は 'pending'。 */
  status?: AffiliateStatus;
}

interface TextAffiliate {
  id: AffiliateId;
  type: 'text';
  name: string;
  href: string;
  text: string;
  trackingPixel: string;
  /** 既定 'live'。未確定枠は 'pending'。 */
  status?: AffiliateStatus;
}

export type AffiliateConfig = BannerAffiliate | TextAffiliate;

// 高単価プログラム（個別塾の資料請求/体験 など）の追加手順は MONETIZATION.md を参照。
// 追加は2手: (1) 上の AffiliateId union に型を足す (2) 下の Record にエントリを足す。
// 送客先は <ParentLeadCTA affiliateId="new-id" /> で差し替え可能。
export const AFFILIATES: Record<AffiliateId, AffiliateConfig> = {
  'zkai-banner': {
    id: 'zkai-banner',
    type: 'banner',
    name: 'Z会',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+9TNI42+E0Q+CFJ41',
    imgSrc: 'https://www20.a8.net/svt/bgt?aid=260517571594&wid=001&eno=01&mid=s00000001817002088000&mc=1',
    width: 728,
    height: 90,
    trackingPixel: 'https://www14.a8.net/0.gif?a8mat=4B3SN7+9TNI42+E0Q+CFJ41',
  },
  'zkai-text-middle': {
    id: 'zkai-text-middle',
    type: 'text',
    name: 'Z会',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+9TNI42+E0Q+C9BCI',
    text: '中学生のためのＺ会',
    trackingPixel: 'https://www17.a8.net/0.gif?a8mat=4B3SN7+9TNI42+E0Q+C9BCI',
  },
  'zkai-text-advanced': {
    id: 'zkai-text-advanced',
    type: 'text',
    name: 'Z会',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+9TNI42+E0Q+C0QPE',
    text: '難関校の受験対策なら Ｚ会の通信教育',
    trackingPixel: 'https://www19.a8.net/0.gif?a8mat=4B3SN7+9TNI42+E0Q+C0QPE',
  },
  'zkai-text-request': {
    id: 'zkai-text-request',
    type: 'text',
    name: 'Z会 資料請求',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+9TNI42+E0Q+CUQYA',
    text: '無料で資料をもらう',
    trackingPixel: 'https://www15.a8.net/0.gif?a8mat=4B3SN7+9TNI42+E0Q+CUQYA',
  },
  'shoin-banner': {
    id: 'shoin-banner',
    type: 'banner',
    name: 'ネット松陰塾',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+E0VLRM+3WGO+BXQOH',
    imgSrc: 'https://www20.a8.net/svt/bgt?aid=260517571848&wid=001&eno=01&mid=s00000018204002005000&mc=1',
    width: 120,
    height: 60,
    trackingPixel: 'https://www13.a8.net/0.gif?a8mat=4B3SN7+E0VLRM+3WGO+BXQOH',
  },
  'sapuri-banner-468': {
    id: 'sapuri-banner-468',
    type: 'banner',
    name: 'スタディサプリ',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+CIP5PU+36T2+TTDZ5',
    imgSrc: 'https://www23.a8.net/svt/bgt?aid=260517571757&wid=001&eno=01&mid=s00000014879005008000&mc=1',
    width: 468,
    height: 60,
    trackingPixel: 'https://www16.a8.net/0.gif?a8mat=4B3SN7+CIP5PU+36T2+TTDZ5',
  },
  'sapuri-banner-300': {
    id: 'sapuri-banner-300',
    type: 'banner',
    name: 'スタディサプリ',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+CIP5PU+36T2+TV3PD',
    imgSrc: 'https://www29.a8.net/svt/bgt?aid=260517571757&wid=001&eno=01&mid=s00000014879005016000&mc=1',
    width: 300,
    height: 250,
    trackingPixel: 'https://www12.a8.net/0.gif?a8mat=4B3SN7+CIP5PU+36T2+TV3PD',
  },
  'sapuri-text': {
    id: 'sapuri-text',
    type: 'text',
    name: 'スタディサプリ中学講座',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+CIP5PU+36T2+TSJ42',
    text: '中学講座',
    trackingPixel: 'https://www19.a8.net/0.gif?a8mat=4B3SN7+CIP5PU+36T2+TSJ42',
  },
  'zkai-daigaku': {
    id: 'zkai-daigaku',
    type: 'text',
    name: 'Z会 高校生・大学受験生向け',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+9TNI42+E0Q+C0B9U',
    text: 'Ｚ会 高校生・大学受験生向け',
    trackingPixel: 'https://www16.a8.net/0.gif?a8mat=4B3SN7+9TNI42+E0Q+C0B9U',
  },
  'sora-juku-text': {
    id: 'sora-juku-text',
    type: 'text',
    name: 'そら塾',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+EDZ52Q+4YWU+5YJRM',
    text: '【そら塾】',
    trackingPixel: 'https://www15.a8.net/0.gif?a8mat=4B3SN7+EDZ52Q+4YWU+5YJRM',
  },
  'sora-juku-banner': {
    id: 'sora-juku-banner',
    type: 'banner',
    name: 'そら塾',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+EDZ52Q+4YWU+5ZMCH',
    imgSrc: 'https://www21.a8.net/svt/bgt?aid=260517571870&wid=001&eno=01&mid=s00000023187001006000&mc=1',
    width: 300,
    height: 250,
    trackingPixel: 'https://www10.a8.net/0.gif?a8mat=4B3SN7+EDZ52Q+4YWU+5ZMCH',
  },
  'morijuku-text': {
    id: 'morijuku-text',
    type: 'text',
    name: '森塾',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+EDDPGY+4YWU+NTJWY',
    text: '【森塾】',
    trackingPixel: 'https://www10.a8.net/0.gif?a8mat=4B3SN7+EDDPGY+4YWU+NTJWY',
  },
  'morijuku-banner': {
    id: 'morijuku-banner',
    type: 'banner',
    name: '森塾',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+EDDPGY+4YWU+NUU7L',
    imgSrc: 'https://www23.a8.net/svt/bgt?aid=260517571869&wid=001&eno=01&mid=s00000023187004007000&mc=1',
    width: 300,
    height: 250,
    trackingPixel: 'https://www12.a8.net/0.gif?a8mat=4B3SN7+EDDPGY+4YWU+NUU7L',
  },
  'campus-text': {
    id: 'campus-text',
    type: 'text',
    name: '個別指導キャンパス',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+BZ1UR6+5VB8+5YJRM',
    text: '個別指導キャンパス',
    trackingPixel: 'https://www11.a8.net/0.gif?a8mat=4B3SN7+BZ1UR6+5VB8+5YJRM',
  },
  'campus-banner': {
    id: 'campus-banner',
    type: 'banner',
    name: '個別指導キャンパス',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+BZ1UR6+5VB8+5YZ75',
    imgSrc: 'https://www27.a8.net/svt/bgt?aid=260517571724&wid=001&eno=01&mid=s00000027386001003000&mc=1',
    width: 300,
    height: 250,
    trackingPixel: 'https://www11.a8.net/0.gif?a8mat=4B3SN7+BZ1UR6+5VB8+5YZ75',
  },
  'atama-text': {
    id: 'atama-text',
    type: 'text',
    name: 'atama+ オンライン塾',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+BKRG8I+5K0K+5YJRM',
    text: '【atama＋ オンライン塾】',
    trackingPixel: 'https://www19.a8.net/0.gif?a8mat=4B3SN7+BKRG8I+5K0K+5YJRM',
  },
  'atama-banner': {
    id: 'atama-banner',
    type: 'banner',
    name: 'atama+ オンライン塾',
    href: 'https://px.a8.net/svt/ejp?a8mat=4B3SN7+BKRG8I+5K0K+5YZ75',
    imgSrc: 'https://www26.a8.net/svt/bgt?aid=260517571700&wid=001&eno=01&mid=s00000025922001003000&mc=1',
    width: 300,
    height: 250,
    trackingPixel: 'https://www12.a8.net/0.gif?a8mat=4B3SN7+BKRG8I+5K0K+5YZ75',
  },

  // ── 先回し枠（未確定 / status:'pending'） ─────────────────────────────────
  // メモリの本線：最大レバー＝塾/個別/家庭教師の「無料体験」CPA¥3000–1万を
  // afb / アクセストレード / レントラックス 等で発掘して ParentLeadCTA に張替える。
  // リンク確定後：status を 'live' に変え、href / text(or imgSrc等) / trackingPixel を実値に差し替えるだけ。
  // pending の間は AffiliateAd が何も描画しない＝デッドリンクは出ない。
  'afb-juku-trial': {
    id: 'afb-juku-trial',
    type: 'text',
    name: '塾の無料体験（afb）',
    href: '#',
    text: '無料体験を申し込む',
    trackingPixel: '',
    status: 'pending',
  },
  'accesstrade-juku-trial': {
    id: 'accesstrade-juku-trial',
    type: 'text',
    name: '塾の無料体験（アクセストレード）',
    href: '#',
    text: '無料体験を申し込む',
    trackingPixel: '',
    status: 'pending',
  },
  'rentracks-juku-trial': {
    id: 'rentracks-juku-trial',
    type: 'text',
    name: '塾の無料体験（レントラックス）',
    href: '#',
    text: '無料体験を申し込む',
    trackingPixel: '',
    status: 'pending',
  },
  'afb-katei-kyoshi': {
    id: 'afb-katei-kyoshi',
    type: 'text',
    name: '家庭教師の無料体験（afb）',
    href: '#',
    text: '無料体験・資料請求をする',
    trackingPixel: '',
    status: 'pending',
  },
  // 家庭教師の先回し枠（もしも審査待ち・CPA¥11,000–13,000）。承認時の差し替えは2箇所（href / trackingPixel）＋status行を削除。
  'gakken-katei-kyoshi': {
    id: 'gakken-katei-kyoshi',
    type: 'text',
    name: '学研の家庭教師（無料体験・資料請求）',
    href: '#',
    text: '無料体験・資料請求をする',
    trackingPixel: '',
    status: 'pending',
  },
  'ganba-katei-kyoshi': {
    id: 'ganba-katei-kyoshi',
    type: 'text',
    name: '家庭教師のガンバ（無料体験・資料請求）',
    href: '#',
    text: '無料体験・資料請求をする',
    trackingPixel: '',
    status: 'pending',
  },
  'manalink-katei-kyoshi': {
    id: 'manalink-katei-kyoshi',
    type: 'text',
    name: 'マナリンク（オンライン家庭教師・無料相談）',
    href: '#',
    text: '無料体験・相談をする',
    trackingPixel: '',
    status: 'pending',
  },
  // ── 学費クラスタの最高単価帯（先回し枠／元栓が開いたら status:'live' + href/pixel を差すだけ） ──
  // 保護者の最大関心=お金。教育資金FPの無料相談・学資保険の一括資料請求は CPA¥8,000–15,000 で最高単価帯。
  // lead-config の 'hiyou' 面（/koukou-hiyou・/juku-hiyou）の送客先をここに張り替える想定。
  // 2026-06-15 もしも「保険のトータルプロフェッショナル」(専門家FP無料相談 CPA¥13,800・審査なし提携中)で live化。
  'fp-soudan': {
    id: 'fp-soudan',
    type: 'text',
    name: '専門家FPの無料保険・教育資金相談',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638594&p_id=1831&pc_id=3531&pl_id=25541',
    text: '教育資金を専門家FPに無料で相談',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638594&p_id=1831&pc_id=3531&pl_id=25541',
  },
  // ★承認時の差し替えは1案件あたり2箇所だけ：(1) href を実リンクに (2) trackingPixel を実値に → status 行を削除。
  //   例) gakushi-hoken（ガーデン学資保険の一括資料請求・A8/ASP承認後）:
  //       href: 'https://px.a8.net/svt/ejp?a8mat=＜実値＞',
  //       trackingPixel: 'https://www＜n＞.a8.net/0.gif?a8mat=＜実値＞',
  //       （status:'pending' の行を消すと AffiliateAd が描画＝即 live）
  'gakushi-hoken': {
    id: 'gakushi-hoken',
    type: 'text',
    name: '学資保険の一括資料請求（ガーデン学資保険）',
    href: '#',
    text: '学資保険の資料を無料で取り寄せる',
    trackingPixel: '',
    status: 'pending',
  },
  // FP無料相談の A/B 候補（live の もしも「保険トータルプロフェッショナル」＝fp-soudan と比較するための先回し枠）。
  // 承認後、lead-config の hiyou 面オファーをこの id に差し替えれば送客先を切替できる。
  'hoken-compass': {
    id: 'hoken-compass',
    type: 'text',
    name: '保険コンパス（教育資金FPの無料相談）',
    href: '#',
    text: '教育資金を専門家FPに無料で相談',
    trackingPixel: '',
    status: 'pending',
  },
  'money-doctor': {
    id: 'money-doctor',
    type: 'text',
    name: 'マネードクター（教育資金FPの無料相談）',
    href: '#',
    text: '教育資金を専門家FPに無料で相談',
    trackingPixel: '',
    status: 'pending',
  },

  // ── もしも 提携中（審査なし・2026-06-15 live。テキストリンク1本/プログラム＝形式で選定） ──
  'moshimo-e-live': {
    id: 'moshimo-e-live',
    type: 'text',
    name: 'e-Live（小中高オンライン家庭教師）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638580&p_id=4328&pc_id=11085&pl_id=58609',
    text: '小中高オンライン家庭教師の無料体験',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638580&p_id=4328&pc_id=11085&pl_id=58609',
  },
  'moshimo-studycoach': {
    id: 'moshimo-studycoach',
    type: 'text',
    name: 'スタディコーチ（東大式オンライン塾）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638581&p_id=3243&pc_id=7650&pl_id=42307',
    text: '東大式コーチングの無料体験',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638581&p_id=3243&pc_id=7650&pl_id=42307',
  },
  'moshimo-classjapan': {
    id: 'moshimo-classjapan',
    type: 'text',
    name: 'クラスジャパン小中学園（不登校オンラインフリースクール）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638587&p_id=4781&pc_id=12631&pl_id=62984',
    text: '不登校生のオンラインフリースクール（無料で資料請求）',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638587&p_id=4781&pc_id=12631&pl_id=62984',
  },
  'moshimo-tintoru': {
    id: 'moshimo-tintoru',
    type: 'text',
    name: 'ティントル（不登校専門オンライン個別指導）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638588&p_id=4342&pc_id=11154&pl_id=58815',
    text: '不登校専門オンライン個別指導の無料体験',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638588&p_id=4342&pc_id=11154&pl_id=58815',
  },
  'moshimo-rewrite': {
    id: 'moshimo-rewrite',
    type: 'text',
    name: 'Re-Write（受験英語専門ゼミ）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638547&p_id=3991&pc_id=10043&pl_id=55079',
    text: '受験英語専門ゼミの無料相談',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638547&p_id=3991&pc_id=10043&pl_id=55079',
  },

  // ── もしも 提携中（2026-07-07 承認分・live）。テキストリンク1本/プログラム＝形式で選定。 ──
  'moshimo-garden-gakushi': {
    id: 'moshimo-garden-gakushi',
    type: 'text',
    name: 'ガーデン（学資金の無料相談・FP面談）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638593&p_id=5006&pc_id=13414&pl_id=65626',
    text: '学資・教育資金を専門家FPに無料で相談',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638593&p_id=5006&pc_id=13414&pl_id=65626',
  },
  'moshimo-garden-chochiku': {
    id: 'moshimo-garden-chochiku',
    type: 'text',
    name: 'ガーデン（貯蓄・家計の無料相談・FP面談）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638598&p_id=4952&pc_id=13229&pl_id=65173',
    text: '教育資金・家計を専門家FPに無料で相談',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638598&p_id=4952&pc_id=13229&pl_id=65173',
  },
  'moshimo-manecafe': {
    id: 'moshimo-manecafe',
    type: 'text',
    name: 'マネカフェ（気軽なFP診断・無料相談）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638600&p_id=7333&pc_id=21072&pl_id=92242',
    text: '教育資金の悩みをFPに無料で相談',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638600&p_id=7333&pc_id=21072&pl_id=92242',
  },
  'moshimo-minhoken': {
    id: 'moshimo-minhoken',
    type: 'text',
    name: 'みんなの生命保険アドバイザー（無料保険相談）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638596&p_id=7059&pc_id=20203&pl_id=89248',
    text: '教育資金・保険を専門家に無料で相談',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638596&p_id=7059&pc_id=20203&pl_id=89248',
  },
  'moshimo-withstudy': {
    id: 'moshimo-withstudy',
    type: 'text',
    name: 'ウィズスタディ（低価格オンライン塾）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638541&p_id=6942&pc_id=19853&pl_id=87808',
    text: '低価格オンライン塾の無料体験',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638541&p_id=6942&pc_id=19853&pl_id=87808',
  },
  'moshimo-manabuterasu': {
    id: 'moshimo-manabuterasu',
    type: 'text',
    name: 'まなぶてらす（オンライン家庭教師）',
    href: 'https://af.moshimo.com/af/c/click?a_id=5638546&p_id=4590&pc_id=12001&pl_id=61374',
    text: 'オンライン家庭教師の無料体験レッスン',
    trackingPixel: 'https://i.moshimo.com/af/i/impression?a_id=5638546&p_id=4590&pc_id=12001&pl_id=61374',
  },

  // ── 季節講習の先回し枠（pending）。承認時の差し替えは2箇所：(1) href を実リンクに (2) trackingPixel を実値に → status 行を削除。 ──
  // 秋（10〜11月）にASP出品される「冬期講習 無料招待/無料体験」案件を申請→ここに挿すと、seasonal が冬の高インテント面へ自動適用。
  'winter-koushuu-trial': {
    id: 'winter-koushuu-trial',
    type: 'text',
    name: '冬期講習の無料体験・招待',
    href: '#',
    text: '冬期講習の無料体験を申し込む',
    trackingPixel: '',
    status: 'pending',
  },
  'summer-koushuu-trial': {
    id: 'summer-koushuu-trial',
    type: 'text',
    name: '夏期講習の無料体験・招待',
    href: '#',
    text: '夏期講習の無料体験を申し込む',
    trackingPixel: '',
    status: 'pending',
  },

  // ── アクセストレード 提携承認済み（2026-06-19 live）。入会=paid型＝無料リードより優先度は下。 ──
  'shinken-koukou': {
    id: 'shinken-koukou',
    type: 'text',
    name: '進研ゼミ高校講座',
    href: 'https://h.accesstrade.net/sp/cc?rk=0100q3i600ot1k',
    text: '進研ゼミ 高校講座',
    trackingPixel: 'https://h.accesstrade.net/sp/rr?rk=0100q3i600ot1k',
  },
  'eten-net': {
    id: 'eten-net',
    type: 'text',
    name: 'e点ネット塾（インターネット自宅学習）',
    href: 'https://h.accesstrade.net/sp/cc?rk=0100c4te00ot1k',
    text: 'インターネット自宅学習 e点ネット塾',
    trackingPixel: 'https://h.accesstrade.net/sp/rr?rk=0100c4te00ot1k',
  },
};

/** live（描画可能）な案件か。pending の先回し枠を弾く。 */
export function isLiveAffiliate(id: AffiliateId): boolean {
  return (AFFILIATES[id]?.status ?? 'live') === 'live';
}
