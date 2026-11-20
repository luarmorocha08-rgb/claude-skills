import sys
live=sys.argv[1] if len(sys.argv)>1 else ''
h=open('index.src.html').read()
b=open('body3d.js').read().replace('export function createBody3D','function createBody3D')
h=h.replace('/*BODY3D*/',b).replace('/*BODYDATA*/',open('bodydata.js').read()).replace('/*LIVE_URL*/',live)
h=h.replace("    const endFade = clamp((-r.bottom+vh*1.0)/(vh*.6)+1,0,1);\n","")
open('index.html','w').write(h); print(len(h)/1024,'KB')
