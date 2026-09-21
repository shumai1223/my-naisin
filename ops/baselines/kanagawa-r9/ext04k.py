# 04_tokubetsuboshuu.pdf の『評価の観点』列(観点帯)を行帯ごとに抽出し tokubetsu04.json と同順・同数で kanten として保存する(→tokubetsu04-kanten.json)。ext04b.dump の行帯と列境界(sc[4]..sc[5])を流用し、帯内のテキストを clip で取る。
import sys, json, re
sys.argv = ['x']
from ext04b import *
rows = json.load(open('tokubetsu04.json', encoding='utf8'))
def fw(s):
    return ''.join(chr(ord(c) - 0xFEE0) if 0xFF01 <= ord(c) <= 0xFF5E else (' ' if c == '　' else c) for c in s)
res = []
sec = None
school = None
SEC = {1: '連携募集', 4: 'インクルーシブ教育実践推進校特別募集'}
i = 0
for pi in range(1, 6):
    p = d[pi - 1]
    sc, out = dump(pi - 1)
    for a, b, c in out:
        dept = c.get('dept', ''); sch = c.get('school', '')
        if dept.startswith('【'): continue
        if sch == '【別科': continue
        if sch == '学校名': continue
        clip = fitz.Rect(sc[4] + 1, a + 0.5, sc[5] - 0.5, b - 0.5)
        lines = [l.strip() for l in p.get_text('text', clip=clip).split('\n') if l.strip()]
        res.append({'page': pi, 'lines': lines})
        i += 1
print(i, len(rows))
assert i == len(rows)
json.dump(res, open('tokubetsu04-kanten-raw.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
# 構造化: 『…の評価の観点』見出しごとに項目('・'始まり。折返し行は前項目へ連結)をまとめる
def struct(lines):
    groups = []
    for l in lines:
        l = fw(l).strip()
        if l.endswith('の評価の観点') or l == '面接の評価の観点':
            groups.append([l, []])
        elif groups:
            if l.startswith('・'): groups[-1][1].append(l[1:].strip())
            elif groups[-1][1]: groups[-1][1][-1] += l
            else: groups[-1].append(l)
        else:
            groups.append(['(見出しなし)', [l]])
    return groups
for r, k in zip(rows, res):
    k['school'] = r['school']; k['dept'] = r['dept']; k['groups'] = struct(k['lines'])
json.dump(res, open('tokubetsu04-kanten.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
empty = [(k['school'], k['dept']) for k in res if not k['groups']]
print('empty', len(empty)); print(empty[:20])
for k in res[:4] + res[24:28]: print(k['school'], k['dept'], k['groups'])
