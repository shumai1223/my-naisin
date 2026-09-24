/**
 * T-TD1: SPEC.md / TERMS.md を印刷用HTMLの本文にする最小のMarkdown変換
 * （見出し・引用・表・箇条書き・太字・インラインコードだけを扱う）。scripts/td1-build-kit.ts が使う。
 */
export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(t: string): string {
  return escapeHtml(t)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export function mdToHtml(md: string): string {
  const out: string[] = [];
  const lines = md.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^#{1,3} /.test(l)) {
      const lv = (l.match(/^#+/) as RegExpMatchArray)[0].length;
      out.push(`<h${lv}>${inline(l.replace(/^#+ /, ''))}</h${lv}>`);
      i++;
    } else if (l.startsWith('> ')) {
      out.push(`<blockquote>${inline(l.slice(2))}</blockquote>`);
      i++;
    } else if (l.trim().startsWith('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(
          lines[i]
            .trim()
            .replace(/^\||\|$/g, '')
            .split('|')
            .map((c) => c.trim())
        );
        i++;
      }
      const [head, , ...body] = rows;
      out.push(
        '<table><tr>' +
          head.map((c) => `<th>${inline(c)}</th>`).join('') +
          '</tr>' +
          body.map((r) => '<tr>' + r.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') +
          '</table>'
      );
    } else if (/^\s*- /.test(l)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*- /.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*- /, ''))}</li>`);
        i++;
      }
      out.push('<ul>' + items.join('') + '</ul>');
    } else if (l.trim() === '') {
      i++;
    } else {
      out.push(`<p>${inline(l)}</p>`);
      i++;
    }
  }
  return out.join('\n');
}
