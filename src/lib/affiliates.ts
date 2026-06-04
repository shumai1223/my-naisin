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
  | 'atama-banner';

interface BannerAffiliate {
  id: AffiliateId;
  type: 'banner';
  name: string;
  href: string;
  imgSrc: string;
  width: number;
  height: number;
  trackingPixel: string;
}

interface TextAffiliate {
  id: AffiliateId;
  type: 'text';
  name: string;
  href: string;
  text: string;
  trackingPixel: string;
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
};
