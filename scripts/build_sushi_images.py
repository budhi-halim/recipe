#!/usr/bin/env python3
"""Deterministic sushi artwork, exported in all five progressive WebP sizes."""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib, json, math, random

ROOT=Path(__file__).resolve().parents[1]
WIDTHS=(24,320,640,960,1440)
C={'salmon':'#e87b54','shrimp':'#eaa281','crab_sticks':'#da7b7c','tuna_canned':'#c7a68b','eggs':'#e9c550','shiitake':'#81543f','avocado':'#a6c974','cucumber':'#7fb577','carrots':'#d98c52','cream_cheese':'#f6e8cb','tobiko':'#e98540','panko':'#ddb461','lettuce':'#81ad6b'}

def oval(d,x,y,rx,ry,col):
 d.ellipse((int(x-rx),int(y-ry),int(x+rx),int(y+ry)),fill=col)

def grains(d,x,y,rx,ry,r,n):
 for _ in range(n):
  a=r.random()*math.tau;b=math.sqrt(r.random())
  px=x+rx*b*math.cos(a);py=y+ry*b*math.sin(a)
  d.ellipse((px-5,py-3,px+5,py+3),fill=r.choice(['#fffef3','#eee5d4','#f5eddb','#ded9c8']))

def sushi_piece(d,x,y,r,form,fill):
 if form=='nigiri':
  oval(d,x,y+16,107,67,'#e8decd');grains(d,x,y+18,95,56,r,95)
  col=C.get(fill[0],'#e87b54')
  d.rounded_rectangle((x-99,y-66,x+99,y+38),radius=36,fill=col)
  if fill[0]=='eggs':d.rounded_rectangle((x-14,y-69,x+14,y+70),radius=7,fill='#20352b')
  else:
   for k in range(4):d.arc((x-90+k*23,y-55,x+4+k*23,y+28),200,310,fill='#f6c6a5',width=4)
  return
 if form=='temaki':
  pts=[(x-104,y-99),(x+103,y-99),(x+14,y+118)]
  d.polygon(pts,fill='#1f3829');d.line(pts+[pts[0]],fill='#142b20',width=6)
  d.ellipse((x-89,y-108,x+88,y+15),fill='#f1e8d8')
  for j,v in enumerate(fill[:4]):
   xx=x-65+j*42;yy=y-45-r.randrange(0,22)
   d.rounded_rectangle((xx-18,yy-32,xx+20,yy+14),radius=12,fill=C.get(v,'#cba88c'))
  return
 if form=='gunkan':
  oval(d,x+6,y+12,105,94,'#b5ae9b')
  oval(d,x,y,101,88,'#20392a');oval(d,x,y-3,82,65,'#ede5d5')
  for j in range(20):
   xx=x+r.randint(-64,64);yy=y+r.randint(-49,49)
   oval(d,xx,yy,13,8,C.get(fill[j%len(fill)],'#e58d63'))
  return
 oval(d,x+5,y+16,103,97,'#b7ae96')
 if form=='uramaki':
  oval(d,x,y,94,89,'#f0e7d7');grains(d,x,y,90,82,r,110)
  oval(d,x,y,69,65,'#203b2d');oval(d,x,y,56,52,'#ebdfcb')
 else:
  oval(d,x,y,95,88,'#20382a')
  oval(d,x,y,80,73,'#f0e9dd');grains(d,x,y,75,66,r,105)
  oval(d,x,y,58,51,'#31543a')
 for j,v in enumerate(fill[:4]):
  xx=x+((j%2)-.5)*66;yy=y+((j//2)-.5)*55
  d.rounded_rectangle((xx-29,yy-24,xx+29,yy+24),radius=14,fill=C.get(v,'#c7a78b'))
  if v in ('salmon','shrimp','crab_sticks'):
   for k in range(2):d.arc((xx-22+k*12,yy-19,xx+15+k*12,yy+18),-65,50,fill='#ffd3ac',width=3)
 for _ in range(9):
  xx=x+r.randint(-70,70);yy=y+r.randint(-65,65)
  if (xx-x)**2/94**2+(yy-y)**2/88**2<.84:oval(d,xx,yy,3,2,'#d6bf8d')

def build(recipe):
 slug=recipe['slug'];v=recipe['visual'];r=random.Random(int(hashlib.sha256(slug.encode()).hexdigest()[:14],16))
 w,h=1440,1020
 im=Image.new('RGB',(w,h));p=im.load()
 for y in range(h):
  for x in range(w):
   edge=((x-720)/720)**2+((y-510)/510)**2
   n=r.randint(-3,3)+math.sin(x*.011+y*.009)*3
   p[x,y]=(int(38-edge*12+n),int(64-edge*11+n),int(48-edge*10+n))
 d=ImageDraw.Draw(im)
 for _ in range(35):
  y=r.randrange(h)
  d.arc((-700,y-40,2100,y+100),0,180,fill='#35513f',width=1)
 d.ellipse((137,97,1310,958),fill='#1b3226')
 d.ellipse((127,82,1294,942),fill='#c0b8a5')
 d.ellipse((153,100,1268,919),fill='#e3dac9')
 d.ellipse((193,141,1222,872),fill='#f7f0e0')
 d.ellipse((214,163,1200,849),fill='#eee6d6')
 for _ in range(900):
  x=r.randrange(200,1210);y=r.randrange(165,855)
  if ((x-710)/507)**2+((y-510)/358)**2<1:oval(d,x,y,1,1,r.choice(['#d6cbb9','#e4d9c7','#f5eddf']))
 if v['form']=='rice':
  oval(d,710,518,315,232,'#c7bba8')
  oval(d,710,510,280,199,'#faf5e8')
  oval(d,710,505,248,155,'#e8dfd0')
  grains(d,710,500,225,142,r,1900)
 else:
  pos=[(422,350),(710,326),(986,362),(420,633),(709,618),(986,636)]
  for x,y in pos:
   sushi_piece(d,x+r.randrange(-13,14),y+r.randrange(-13,14),r,v['form'],v.get('fillings',[]) or ['salmon'])
 for _ in range(40):
  x=r.randrange(250,1160);y=r.choice([r.randrange(185,290),r.randrange(748,818)])
  oval(d,x,y,3,2,r.choice(['#bba071','#ba8f54','#50784e']))
 return im

def main():
 dest=ROOT/'assets'/'responsive';dest.mkdir(parents=True,exist_ok=True)
 for path in sorted((ROOT/'data'/'recipes').glob('*.json')):
  recipe=json.loads(path.read_text(encoding='utf-8'))
  if 'visual' not in recipe:continue
  picture=build(recipe)
  for width in WIDTHS:
   output=dest/f"{recipe['slug']}-{width}.webp"
   img=picture if width==1440 else picture.resize((width,round(picture.height*width/1440)),Image.Resampling.LANCZOS)
   img.save(output,format='WEBP',quality=32 if width==24 else 78,method=5)
  print('Generated',recipe['slug'])

if __name__=='__main__':main()
