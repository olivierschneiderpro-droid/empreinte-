import json,sys,os
sys.path.insert(0,__import__('os').path.dirname(__import__('os').path.abspath(__file__)))
import lum
R=lum.R
GROUPS=[('fondations','Fondations',['DL1-Lumiere-Accueil']),('cycle','Le cycle d’une réalité : la facture F-47',['DL2-Lumiere-Facture']),('physique','Le lien physique ↔ numérique',[]),('verifier','Vérifier',[]),('domaines','Domaines de réalité',[]),('bible-lecture','Bible · lecture',['DL3-Lumiere-Bible']),('strong','Bible · Strong et ressources',[]),('bibliotheque','Bible · ma bibliothèque',[]),('compte','Compte et système',[])]
def run(mods):
    import importlib
    for m in mods: importlib.import_module(m)
    lum.write_all()
    i=json.load(open(R+'/canvas.json'))
    new={k:v for k,v in i['boards'].items() if k.startswith(('DD','DT'))}
    notes={k:v for k,v in i['notes'].items() if k in ('t-desktop','t-tablet')}
    order=[]
    # row 0: key phone screens
    notes['t-key']={'x':0,'y':0,'text':'Lumière · les 3 écrans clés','kind':'title1','maxW':3000}
    for j,f in enumerate(['DL1-Lumiere-Accueil','DL2-Lumiere-Facture','DL3-Lumiere-Bible']):
        new[f+'.dc.html']={'x':j*470,'y':300,'w':390,'h':844,'title':['Accueil','Facture F-47','Bible · Jean 3'][j],'radius':44}
    y=3900
    done=[]
    for gid,gname,extra in GROUPS:
        fs=sorted([n for n,s in lum.SCREENS.items() if s['group']==gid])
        if not fs: continue
        notes['t-'+gid]={'x':0,'y':y,'text':'Téléphone · '+gname,'kind':'title1','maxW':8*470-80}
        y+=300; x=0
        for k,f in enumerate(fs):
            if k and k%8==0: x=0; y+=844+160
            key=f+'.dc.html'
            if f.startswith('DL'): key2=f+'-copie'
            new[key if not f.startswith('DL') else f+'.dc.html'] = new.get(f+'.dc.html') if f.startswith('DL') else {'x':x,'y':y,'w':390,'h':844,'title':lum.SCREENS[f]['title'],'radius':44}
            if f.startswith('DL'):
                pass
            x+=470
        y+=844+260
        done.append(gid)
    # place DL copies inside groups visually by note only (DL already in key row)
    # old version below
    old={k:v for k,v in i['boards'].items() if not k.startswith(('DD','DT','DL','LF','LC','LP','LV','LD','LB','LS','LL','LA'))}
    if False:
        miny=min(v['y'] for v in old.values())
        notes['t-old']={'x':0,'y':y+400,'text':'Ancienne version (sera supprimée)','kind':'title1','maxW':3000}
        for k,v in old.items(): v['y']=v['y']-miny+y+700; new[k]=v
    i['boards']=new; i['notes']=notes
    i['order']=[k for k in new]
    json.dump(i,open(R+'/canvas.json','w'),ensure_ascii=False,indent=1)
    print(len(new),'boards; groups',done)
if __name__=='__main__': run(sys.argv[1:])
