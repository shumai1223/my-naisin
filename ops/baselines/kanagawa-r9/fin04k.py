# tokubetsu04-kanten.json の観点を文字列化して tokubetsu04-final.json の各レコードへ kanten として追加する(同順・同数を検査)。
import json
fin = json.load(open('tokubetsu04-final.json', encoding='utf8'))
kan = json.load(open('tokubetsu04-kanten.json', encoding='utf8'))
assert len(fin) == len(kan)
def render(groups):
    parts = []
    for g in groups:
        head = g[0]
        if g[1]: parts.append(head + '(' + ' / '.join(g[1]) + ')')
        elif len(g) > 2: parts.append(head + ': ' + g[2])
        else: parts.append(head)
    return '、'.join(parts)
for f, k in zip(fin, kan):
    assert f['school'].replace('(定時制)', '') == k['school'].replace('(定時制)', '') and f['page'] == k['page'], (f['school'], k['school'])
    f['kanten'] = render(k['groups'])
json.dump(fin, open('tokubetsu04-final.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
print(len(fin)); print(fin[0]['kanten']); print(fin[6]['kanten'])
