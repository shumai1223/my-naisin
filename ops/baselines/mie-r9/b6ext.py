# 別表6(資料8・001264586.pdf・全18頁): スポーツ特別枠選抜の学校別「応募資格」「実技検査(検査の実施概要)」「選抜方法」。
# fitzのテキスト層(UTF-8で正常)を学校見出し《…高等学校》で切り、節見出しで分割して空白を正規化する。→b6-recs.json
import fitz, re, json
d = fitz.open('b001264586.pdf')
pages = [p.get_text() for p in d]
blocks = []
for i, t in enumerate(pages):
    m = re.search(r'《(.+?)高等学校》', t)
    if m and blocks and blocks[-1]['school'] == m.group(1):
        blocks[-1]['text'] += '\n' + t; blocks[-1]['page2'] = i + 1
    elif m:
        blocks.append({'school': m.group(1), 'page': i + 1, 'text': t})
    else:
        blocks[-1]['text'] += '\n' + t; blocks[-1]['page2'] = i + 1
def sp(x): return r'\s*'.join(x.replace(' ', ''))
def squash(s):
    lines = [re.sub(r'\s+', ' ', l.replace('　', ' ')).strip() for l in s.split('\n')]
    return [l for l in lines if l]
recs = []
for b in blocks:
    t = re.sub(r'資料８', '', b['text'])
    t = re.sub(r'《.+?高等学校》', '', t)
    if b['page'] == 1:
        t = re.sub(r'〈別表６〉.*?一覧', '', t, flags=re.S)
    def sect(start, ends):
        m0 = re.search(sp(start), t)
        if not m0: return ''
        rest = t[m0.end():]
        js = [m.start() for e in ends for m in [re.search(sp(e), rest)] if m]
        return rest[:min(js)] if js else rest
    bosyu = [l for l in squash(sect('募集競技', ['応募資格'])) if not l.startswith('（募集学科')]
    shikaku = squash(sect('応募資格', ['検査', '実施概要']))
    kensa = squash(sect('実施概要', ['選抜方法']))
    senbatsu = squash(sect('選抜方法', ['\x01']))
    recs.append({'school': b['school'], 'page': b['page'], 'page2': b.get('page2'), 'bosyu': bosyu, 'shikaku': shikaku, 'kensa': kensa, 'senbatsu': senbatsu})
json.dump(recs, open('b6-recs.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(recs))
for r in recs: print(r['school'], r['page'], r['page2'], len(r['bosyu']), len(r['shikaku']), len(r['kensa']), len(r['senbatsu']))

# --- 文字列化: 折り返し行(前行が約32字以上・文末でない・次行が項目記号で始まらない)は連結、それ以外は' / 'で区切る ---
BUL = re.compile(r'^([(（〔・※①-⑩]|\d+\s|[ＡＢＣ]|[１２３]\s)')
def join(lines):
    out = ''
    prev = None
    for l in lines:
        if prev is None: out = l
        elif len(prev) >= 38 and not prev.endswith(('。', '）', '点満点')) and not BUL.match(l): out += l
        else: out += ' / ' + l
        prev = l
    return out
for r in recs:
    r['kensa'] = [l for l in r['kensa'] if l not in ('学科・', 'コース名')]
    if r['school'] == '稲生':
        s = r['senbatsu']
        k = s.index('体')
        futsu = s[3:k]; taiiku = s[k + 3:]
        assert s[k + 2].startswith('科１')
        taiiku = ['１ 選抜資料の取扱い'] + s[k + 3:]
        r['senbatsu_txt'] = '普通科: ' + join(futsu) + ' 【体育科】 ' + join(taiiku)
    else:
        r['senbatsu_txt'] = join(r['senbatsu'])
    r['bosyu_txt'] = ' / '.join(r['bosyu']) if r['school'] in ('四日市工業', '四日市中央工業') else join(r['bosyu'])
    r['shikaku_txt'] = join(r['shikaku'])
    r['kensa_txt'] = join(r['kensa'])
json.dump(recs, open('b6-recs.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
