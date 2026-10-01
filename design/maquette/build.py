import sys,json,os,glob
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from base import *
import p1,p2,p3,p4,p5,p6,p7,p8,p9
pages=[('fondations','1 · Fondations'),('cycle','2 · Cycle d’une réalité (F-47)'),('physique','3 · Lien physique ↔ numérique'),('verifier','4 · Vérifier'),('domaines','5 · Domaines de réalité'),('bible-lecture','6 · Bible · lecture (Bible Strong)'),('strong','7 · Bible · Strong et ressources'),('bibliotheque','8 · Bible · ma bibliothèque'),('compte','9 · Compte et système')]
titles={'fondations':'Fondations','cycle':'Le cycle d’une réalité : la facture F-47','physique':'Le lien physique ↔ numérique','verifier':'Vérifier : le système signale, l’humain décide','domaines':'Toute réalité : livre, équipement, Bible, mission, projet, journaux','bible-lecture':'Bible Strong · lecture, dans Empreinte','strong':'Bible Strong · Strong, dictionnaires, ressources','bibliotheque':'Bible Strong · ma bibliothèque d’étude','compte':'Compte, synchronisation, système'}
for f in glob.glob(R+'/*.dc.html'): os.remove(f)
boards={}; order=[]; notes={}
per_row=8
y=0
for pid,_ in pages:
    fs=[f for f in SCREENS if SCREENS[f]['page']==pid]
    fs.sort(key=lambda f:(0 if f=='Main.dc.html' else 1, f))
    notes['t-'+pid]={'x':0,'y':y,'text':titles[pid],'kind':'title1','maxW':per_row*470-80}
    y+=300
    x=0;i=0;rowh=0
    for f in fs:
        s=SCREENS[f]; w=s.get('w',390); h=s.get('h',844)
        body=render(f,s)
        if 'w' in s: body=body.replace('<div class="app">','<div class="app" style="width:%dpx;height:%dpx">'%(w,h)).replace('"width":390,"height":844','"width":%d,"height":%d'%(w,h))
        open(os.path.join(R,f),'w').write(body)
        if x+w>per_row*470:
            x=0;y+=rowh+160;rowh=0
        boards[f]={'x':x,'y':y,'w':w,'h':h,'title':s['title'],'radius':0 if w>390 else 36}
        order.append(f); x+=w+80; rowh=max(rowh,h)
    y+=rowh+260
notes['legende']={'x':0,'y':-260,'text':'97 écrans · 9 parcours. Vert = physique (original, objet, emplacement). Bleu = numérique (photo, données, notes, Bible). Rouge / orange = vérifications. Le papier reste papier : les documents apparaissent sur fond clair. Bouton Play sur un écran pour naviguer.','w':900,'size':'l','fill':'gray','maxH':200}
idx=json.load(open(R+'/canvas.json'))
idx.update({'title':'Empreinte — maquette','pages':[],'boards':boards,'order':order,'notes':notes,'launch':{'view':'canvas'}})
open(R+'/canvas.json','w').write(json.dumps(idx,ensure_ascii=False,indent=1))
print(len(boards),'artboards')
