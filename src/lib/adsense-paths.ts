/**
 * Google AdSense（adsbygoogle.js）を読み込まないパス（単一ソース）。
 *
 * 広告リクエストには「閲覧中のページのURL（?以降を含む）」が載るため、URLに資格情報や成績が載るページでは読み込まない。
 *  - /admin            : ADMIN_REPORT_TOKEN が ?token= で URL に載る（GA4も同じ理由で除外している）
 *  - /juku 以下        : 塾ダッシュボードの招待トークン（?token=&studentId=）が URL に載る
 *  - /hogosha          : 保護者への共有リンク（?from=share&…）に、共有された内申点・学年・目標との差が載る
 *  - /privacy /contact : 規約・フォームのページ（広告を出す意味がなく、問い合わせ内容を扱う）
 *  - /api              : HTML を返さない（念のため）
 *
 * 限界: 広告のスクリプトは一度読み込むと外せない。広告ありのページからクライアント遷移でこれらのページへ移った場合、
 * スクリプトは残る。この除外が守るのは「これらのURLを直接開いた（メール・ブックマーク・共有リンク）」場合。
 */
const EXCLUDED_PREFIXES = ['/admin', '/juku', '/hogosha', '/privacy', '/contact', '/api'];

/** 先頭が一致するだけでなく「その階層以下」であること（/juku は除外し、/juku-shindan は除外しない）。 */
export function isAdSenseExcludedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}
