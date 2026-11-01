import cv2, numpy as np, glob, json, sys
D=sys.argv[1]; TH=int(sys.argv[2])
fs=sorted(glob.glob(D+'/fr/*.jpg'))
H,W=1920,1080
def inter(l1,l2):
    (vx1,vy1,x1,y1),(vx2,vy2,x2,y2)=l1,l2
    A=np.array([[vx1,-vx2],[vy1,-vy2]]); b=np.array([x2-x1,y2-y1])
    s=np.linalg.solve(A,b); return [x1+s[0]*vx1,y1+s[0]*vy1]
out=[]
for i,f in enumerate(fs):
    g=cv2.cvtColor(cv2.imread(f),cv2.COLOR_BGR2GRAY); g=cv2.GaussianBlur(g,(7,7),0)
    m=(g>TH).astype(np.uint8)*255
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((25,25),np.uint8))
    n,lab,st,cen=cv2.connectedComponentsWithStats(m)
    best=None
    for k in range(1,n):
        if st[k][4]<50000: continue
        if 550<cen[k][1]<1450 and (best is None or st[k][4]>st[best][4]): best=k
    mk=(lab==best).astype(np.uint8)*255
    mk=cv2.morphologyEx(mk,cv2.MORPH_CLOSE,np.ones((41,41),np.uint8))
    cs,_=cv2.findContours(mk,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    c=max(cs,key=cv2.contourArea).reshape(-1,2)
    hull=cv2.convexHull(c.reshape(-1,1,2)); peri=cv2.arcLength(hull,True)
    q=None
    for e in [0.01,0.015,0.02,0.03,0.04,0.06]:
        ap=cv2.approxPolyDP(hull,e*peri,True)
        if len(ap)==4: q=ap.reshape(4,2).astype(float); break
    rec={'i':i,'q':None}
    if q is not None:
        s=q.sum(1); d=(q[:,1]-q[:,0])
        q=np.array([q[np.argmin(s)],q[np.argmin(d)],q[np.argmax(s)],q[np.argmax(d)]])
        # pontos do contorno longe das bordas do quadro, atribuídos ao lado mais próximo
        lines=[]; okside=[]
        for a in range(4):
            p0,p1=q[a],q[(a+1)%4]; v=p1-p0; L=np.linalg.norm(v); u=v/L; nrm=np.array([-u[1],u[0]])
            rel=c-p0; t=rel@u; dist=np.abs(rel@nrm)
            sel=(t>0.12*L)&(t<0.88*L)&(dist<12)&(c[:,0]>4)&(c[:,0]<W-5)&(c[:,1]>4)&(c[:,1]<H-5)
            pts=c[sel]
            okside.append(bool(len(pts)>0.3*0.76*L))
            if len(pts)>20: lines.append(cv2.fitLine(pts.astype(np.float32),cv2.DIST_HUBER,0,0.01,0.01).ravel())
            else: lines.append(np.array([u[0],u[1],p0[0],p0[1]]))
        Q=[inter(lines[3],lines[0]),inter(lines[0],lines[1]),inter(lines[1],lines[2]),inter(lines[2],lines[3])]
        rec['q']=[[float(x),float(y)] for x,y in Q]; rec['lados']=okside
    out.append(rec)
json.dump(out,open(D+'/track3.json','w'))
print('com 4 lados vistos:', sum(1 for o in out if o.get('lados') and all(o['lados'])), 'de', len(out))
print('último quadro com 4 lados:', max(o['i'] for o in out if o.get('lados') and all(o['lados'])))
