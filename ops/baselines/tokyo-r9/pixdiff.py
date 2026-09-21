import sys, glob
from PIL import Image, ImageChops
import numpy as np
d = sys.argv[1]
A = sorted(glob.glob(d+'/a-*.png')); B = sorted(glob.glob(d+'/b-*.png'))
for i,(a,b) in enumerate(zip(A,B),1):
    ia = Image.open(a).convert('L'); ib = Image.open(b).convert('L')
    w=min(ia.size[0],ib.size[0]); h=min(ia.size[1],ib.size[1]); ia=ia.crop((0,0,w,h)); ib=ib.crop((0,0,w,h))
    diff = np.array(ImageChops.difference(ia, ib)) > 80
    n = int(diff.sum())
    ys = np.where(diff.any(axis=1))[0]
    print(i, n, (int(ys.min()), int(ys.max())) if n else '')
