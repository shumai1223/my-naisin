import fitz,re,json,unicodedata
d=fitz.open('b001264582.pdf')
txt=''
for i in range(len(d)):
    t=d[i].get_text()
    t=t.replace('資料４','')
    txt+=t+'\n'
# course markers
parts=re.split(r'(《[^》]+》)',txt)
schools=[];course='全日制'
# find course marker positions in preface
pre=parts[0]
i=1
while i<len(parts):
    head=parts[i]; body=parts[i+1] if i+1<len(parts) else ''
    name=head.strip('《》').strip()
    # course change marker inside previous body tail
    schools.append(dict(name=name,body=body))
    i+=2
print(len(schools))
for s in schools[:3]+schools[-3:]: print(s['name'],len(s['body']))
names=[s['name'] for s in schools]; print(names)
for s in schools:
    if '定時制課程' in s['body'] or '通信制' in s['body']: print('COURSE MARK in',s['name'])
json.dump(schools,open('b2-raw.json','w',encoding='utf8'),ensure_ascii=False)
