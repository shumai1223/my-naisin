import json,re,unicodedata
S=json.load(open('b2-raw.json',encoding='utf8'))
def clean(body):
    i=body.find('選抜において重視する要件')
    tok=body[i:] if i>=0 else body
    tok=re.split(r'^\s*(定時制課程|通信制課程)\s*$',tok,flags=re.M)[0]
    lines=[l.strip() for l in tok.split('\n')]
    lines=[l for l in lines if l]
    out=[];buf=''
    for l in lines:
        if len(l)<=3 and not re.match(r'^[(（〔]',l):
            buf+=l
        else:
            if buf: out.append(buf); buf=''
            out.append(l)
    if buf: out.append(buf)
    return out
if __name__=='__main__':
    import sys
    for k in (2,29,14):
        print('=====',S[k]['name']); print('\n'.join(clean(S[k]['body'])))
