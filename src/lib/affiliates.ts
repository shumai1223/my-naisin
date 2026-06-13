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
  // ── 学費クラスタの最高単価帯（保護者＝決裁者・無料相談/資料請求。CPA¥8k–1.5万） ──
  | 'fp-soudan'
  | 'gakushi-hoken';

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
  // ── 学費クラスタの最高単価帯（先回し枠／元栓が開いたら status:'live' + href/pixel を差すだけ） ──
  // 保護者の最大関心=お金。教育資金FPの無料相談・学資保険の一括資料請求は CPA¥8,000–15,000 で最高単価帯。
  // lead-config の 'hiyou' 面（/koukou-hiyou・/juku-hiyou）の送客先をここに張り替える想定。
  'fp-soudan': {
    id: 'fp-soudan',
    type: 'text',
    name: '教育資金の無料FP相談',
    href: '#',
    text: '教育資金の無料相談をする',
    trackingPixel: '',
    status: 'pending',
  },
  'gakushi-hoken': {
    id: 'gakushi-hoken',
    type: 'text',
    name: '学資保険の一括資料請求',
    href: '#',
    text: '学資保険の資料を無料で取り寄せる',
    trackingPixel: '',
    status: 'pending',
  },
};

/** live（描画可能）な案件か。pending の先回し枠を弾く。 */
export function isLiveAffiliate(id: AffiliateId): boolean {
  return (AFFILIATES[id]?.status ?? 'live') === 'live';
}
