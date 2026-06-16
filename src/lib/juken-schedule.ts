/**
 * 高校受験の年間スケジュール（中3・4月〜3月の一般的な流れ）＝/juken-schedule とICS生成の単一ソース。
 *
 * 重要（捏造ゼロ）：県別・学校別の「具体的な入試日程」は持たない（年度・地域で異なり検証不能）。
 * ここにあるのは全国共通の“準備の目安（月レベル）”だけ。ICSも「準備リマインダー」として配るので、
 * 公式日程の断定にはならない（各イベントは月初の終日・タイトルに【受験準備】を明示）。
 *
 * 名簿（堀A）に与える“商品”：このカレンダーをICSで配ると、LINE/メール登録の継続接点になる（#16）。
 */

export type JukenMonth = {
  /** '4月' のような月ラベル。 */
  month: string;
  phase: string;
  todo: string;
  /** 関連する内部リンク（任意）。 */
  link?: { href: string; label: string };
};

export const JUKEN_SCHEDULE: JukenMonth[] = [
  { month: '4月', phase: '新学期・基礎固め', todo: '中3の内申は多くの地域で最重視。1学期の最初の提出物・授業態度から評価が始まる。生活リズムと学習習慣を立て直す。', link: { href: '/blog/april-naishin-recovery-plan', label: '4月の内申リカバリープラン' } },
  { month: '5月', phase: '中間テスト', todo: '1学期中間テストで好スタートを切る。内申点・偏差値の「現在地」を計算して把握しておく。', link: { href: '/', label: '内申点を計算する' } },
  { month: '6月', phase: '志望校の情報収集', todo: '学校説明会・文化祭の日程を確認し始める。志望校の偏差値・内申の目安と自分の差を見える化。', link: { href: '/hensachi/shiboukou', label: '偏差値から行ける高校レンジを見る' } },
  { month: '7月', phase: '期末テスト・三者面談', todo: '1学期期末テスト。三者面談で先生に「今の評定・志望校との差・あと何が必要か」を具体的に確認する。', link: { href: '/mendan', label: '三者面談の準備チェックリスト' } },
  { month: '8月', phase: '夏休み（天王山）', todo: '中1・中2の総復習を一気に進める好機。夏期講習を使うなら費用とコマ数を先に把握する。', link: { href: '/blog/summer-vacation-review-preview-golden-ratio', label: '夏休みの復習・予習の黄金比' } },
  { month: '9月', phase: '2学期・実力テスト', todo: '2学期は内申に直結する重要学期。実力テスト・模試で偏差値の推移を確認し、弱点教科を特定する。', link: { href: '/hensachi', label: '5教科の偏差値を計算する' } },
  { month: '10月', phase: '志望校の絞り込み', todo: '説明会に参加し、志望校を実力相応・チャレンジ・安全圏で整理。私立併願校の検討も始める。', link: { href: '/blog/how-to-choose-high-school-2026', label: '志望校の選び方（2026年版）' } },
  { month: '11月', phase: '2学期中間〜過去問', todo: '内申が固まる時期。過去問演習を開始し、志望校の合格ラインから必要な当日点を逆算する。', link: { href: '/reverse', label: '志望校から必要な当日点を逆算する' } },
  { month: '12月', phase: '2学期末・最終面談', todo: '2学期の評定で多くの地域の内申がほぼ確定。三者面談で受験校（私立併願・公立第一志望）を最終決定する。', link: { href: '/mendan', label: '三者面談で受験校を決める準備' } },
  { month: '1月', phase: '私立出願・入試開始', todo: '私立高校の出願・入試が始まる（地域差あり）。願書・調査書など出願書類を期限内にそろえる。', link: { href: '/hiyou', label: '受験・進学にかかるお金を確認' } },
  { month: '2月', phase: '私立入試・公立出願', todo: '私立入試の本番、公立高校の出願。体調管理を最優先に、過去問の総仕上げを行う。', link: { href: '/blog/toritsu-nyushi-2026-kanzen-guide', label: '公立入試の完全ガイド' } },
  { month: '3月', phase: '公立入試・合格発表', todo: '公立高校の学力検査・合格発表（地域差あり）。最後まで当日点で内申の差は取り返せる。', link: { href: '/total-score', label: '都道府県別の総合得点の仕組み' } },
];

/** 月ラベル（'4月'）→ 数値（4）。 */
function monthNumber(label: string): number {
  return parseInt(label, 10);
}

/** ICSの文字エスケープ（順序重要：バックスラッシュ→特殊文字）。 */
function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/**
 * 受験準備カレンダーのICS（VCALENDAR）を生成する純関数。
 * @param academicStartYear 学年度の開始年（4月の年）。4〜12月はこの年、1〜3月は翌年。
 *
 * 各イベントは「月初の終日イベント」＝公式の入試日ではなく“その月にやる準備”のリマインダー。
 * タイトルに【受験準備】を付け、説明に月レベルのToDoを入れる（県別の確定日程は断定しない＝捏造ゼロ）。
 */
export function buildJukenIcs(academicStartYear: number): string {
  const stamp = `${academicStartYear}0401T000000Z`;
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//My Naishin//Juken Schedule//JA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:高校受験 準備カレンダー（My Naishin）',
    'X-WR-TIMEZONE:Asia/Tokyo',
  ];
  for (const m of JUKEN_SCHEDULE) {
    const mm = monthNumber(m.month);
    const year = mm >= 4 ? academicStartYear : academicStartYear + 1;
    const start = `${year}${pad2(mm)}01`;
    // 終日イベントのDTENDは翌日（排他）。月初+1日 = その月の2日。
    const endD = new Date(Date.UTC(year, mm - 1, 2));
    const end = `${endD.getUTCFullYear()}${pad2(endD.getUTCMonth() + 1)}${pad2(endD.getUTCDate())}`;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:juken-${year}-${pad2(mm)}@my-naishin.com`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART;VALUE=DATE:${start}`);
    lines.push(`DTEND;VALUE=DATE:${end}`);
    lines.push(`SUMMARY:【受験準備】${escapeIcs(`${m.month} ${m.phase}`)}`);
    lines.push(`DESCRIPTION:${escapeIcs(m.todo)}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/** 現在日から学年度の開始年を求める（4月以降＝今年、1〜3月＝前年）。 */
export function currentAcademicStartYear(now: Date = new Date()): number {
  const y = now.getFullYear();
  return now.getMonth() + 1 >= 4 ? y : y - 1;
}
