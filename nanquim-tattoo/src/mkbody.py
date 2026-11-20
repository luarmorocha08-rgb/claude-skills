import gzip, collections, numpy as np, base64, json, sys
R='../mpfb/src/mpfb/data/'
V=[];G=collections.defaultdict(list);g=None
for l in open(R+'3dobjs/base.obj'):
    if l.startswith('v '): V.append(tuple(map(float,l.split()[1:4])))
    elif l.startswith('g '): g=l.split()[1]
    elif l.startswith('f '): G[g].append([int(x.split('/')[0])-1 for x in l.split()[1:]])
V=np.array(V)
def tgt(name):
    d=np.zeros_like(V)
    for l in gzip.open(R+'targets/macrodetails/'+name+'.target.gz','rt'):
        if l.startswith('#') or not l.strip(): continue
        p=l.split(); d[int(p[0])]=list(map(float,p[1:4]))
    return d
def build(gender, muscle, weight):
    P=V.copy()
    for e in ['caucasian','african','asian']: P+=tgt(f'{e}-{gender}-young')/3
    mw=(muscle-.5)/.5; ww=(.5-weight)/.5   # >0 -> max muscle / min weight
    combos={('averagemuscle','averageweight'):(1-mw)*(1-ww),('maxmuscle','averageweight'):mw*(1-ww),
            ('averagemuscle','minweight'):(1-mw)*ww,('maxmuscle','minweight'):mw*ww}
    for (m,w),k in combos.items():
        if k and not (m=='averagemuscle' and w=='averageweight'): P+=tgt(f'universal-{gender}-young-{m}-{w}')*k
    return P
groups=['body','helper-l-eye','helper-r-eye']
used=sorted({i for gname in groups for f in G[gname] for i in f})
remap={o:n for n,o in enumerate(used)}
tris={}
for gname in groups:
    t=[]
    for f in G[gname]:
        a,b,c,d=[remap[i] for i in f]
        t+= [a,b,c,a,c,d]
    tris[gname]=t
out={'nv':len(used),'ntri':{k:len(v)//3 for k,v in tris.items()}}
idx=np.array(tris['body']+tris['helper-l-eye']+tris['helper-r-eye'],dtype=np.uint16)
out['idx']=base64.b64encode(idx.tobytes()).decode()
for gender,mus,wt in [('male',.68,.42),('female',.58,.46)]:
    P=build(gender,mus,wt)
    jn={}
    for k in ['ground','pelvis','spine-1','spine-2','spine-3','spine-4','neck','head','head-2']:
        jn[k]=P[sorted(set(sum(G['joint-'+k],[])))].mean(0)
    for s in 'lr':
        for k in ['clavicle','shoulder','elbow','hand','upper-leg','knee','ankle','scapula']:
            jn[f'{s}-{k}']=P[sorted(set(sum(G[f'joint-{s}-{k}'],[])))].mean(0)
    Q=P[used].copy()
    y0=Q[:,1].min()
    Q=(Q-[0,y0,0])*0.1
    J={k:((v-[0,y0,0])*0.1).round(4).tolist() for k,v in jn.items()}
    mn=Q.min(0); mx=Q.max(0); sc=(mx-mn)/65535
    q=np.round((Q-mn)/sc).astype(np.uint16)
    out[gender]={'pos':base64.b64encode(q.tobytes()).decode(),'mn':mn.round(6).tolist(),'sc':sc.tolist(),'J':J,
                 'eyeC':{s:((P[sorted({i for f in G[f'helper-{s}-eye'] for i in f})].mean(0)-[0,y0,0])*0.1).round(4).tolist() for s in 'lr'}}
    print(gender,'height',Q[:,1].max().round(3),'lshoulder',J['l-shoulder'],'lhand',J['l-hand'])
open('bodydata.js','w').write('window.BODYDATA='+json.dumps(out)+';')
print(len(open('bodydata.js').read())/1024,'KB')

# ---------- segmentation by nearest bone (male shape) ----------
def seg_labels():
    P=build('male',.68,.42)
    jn={}
    def J(k): return P[sorted(set(sum(G['joint-'+k],[])))].mean(0)
    bones=[]  # (label, a, b, r)
    sp=['pelvis','spine-3','spine-2','spine-1','spine-4','neck']
    sp=['pelvis','spine-4','spine-3','spine-2','spine-1','neck']
    pts=[J(k) for k in sp]
    for i in range(len(pts)-2): bones.append((1,pts[i],pts[i+1],1.25))
    bones.append((2,pts[-2],J('head'),.55))
    bones.append((3,J('head'),J('head-2'),.95))
    for s,o in (('l',0),('r',1)):
        bones+= [(1,J(f'{s}-clavicle'),J(f'{s}-shoulder'),.7),
                 (10+o,J(f'{s}-shoulder'),J(f'{s}-elbow'),.5),(12+o,J(f'{s}-elbow'),J(f'{s}-hand'),.42),
                 (14+o,J(f'{s}-hand'),J(f'{s}-hand')+(J(f'{s}-hand')-J(f'{s}-elbow'))*.55,.3),
                 (20+o,J(f'{s}-upper-leg'),J(f'{s}-knee'),.8),(22+o,J(f'{s}-knee'),J(f'{s}-ankle'),.5),
                 (24+o,J(f'{s}-ankle'),J(f'{s}-ankle')+np.array([0,-.6,1.8]),.4)]
    Q=P[used]
    best=np.full(len(Q),1e9); lab=np.zeros(len(Q),dtype=np.uint8)
    for L,a,b,r in bones:
        ab=b-a; t=np.clip(((Q-a)@ab)/(ab@ab),0,1); d=np.linalg.norm(Q-(a+t[:,None]*ab),axis=1)-r
        m=d<best; best[m]=d[m]; lab[m]=L
    return lab
lab=seg_labels()
nb=len(used)
# eyes get label 30
eyeV={remap[i] for gname in ['helper-l-eye','helper-r-eye'] for f in G[gname] for i in f}
for i in eyeV: lab[i]=30
print(collections.Counter(lab.tolist()))
out['lab']=base64.b64encode(lab.tobytes()).decode()
open('bodydata.js','w').write('window.BODYDATA='+json.dumps(out)+';')
print(len(open('bodydata.js').read())/1024,'KB')
