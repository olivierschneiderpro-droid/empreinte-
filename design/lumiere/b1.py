from lum import *
G='fondations'
# Réalités
cats=[('paper','Documents','412',SL),('euro','Factures','188',TP),('book','Livres','86',SL),('book','Bibles','23',TP),('laptop','Équipements','31',SL),('box','Objets','140',TP),('flag','Missions','3',TX),('folder','Projets','7',TX)]
grid=''.join(f'<a href="#" class="g" style="padding:14px;display:flex;flex-direction:column;gap:10px;text-decoration:none;color:{TX};border-radius:22px;box-shadow:none"><span class="btw">{lead(i,c)}{dot(n,22)}</span><span style="font:600 14px Geist">{t}</span></a>' for i,t,n,c in cats)
screen('LF02-Realites','Réalités',shell(
body(f'''<div class="btw" style="align-items:flex-end"><h1 class="h1">Réalités</h1>{dot("1214",34)}</div>
<div class="row" style="gap:8px"><div style="flex:1">{search("Numéro, titre, emplacement…")}</div>{gbtn('filter','Filtrer')}</div>
<div class="row" style="gap:6px;overflow:hidden"><span class="pill on">Toutes</span><span class="pill">Physiques · 868</span><span class="pill">Numériques · 346</span><span class="pill red">À vérifier · 4</span></div>
<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">{grid}</div>
{micro("Récemment touchées")}
<div class="row" style="gap:8px">{''.join(f'<span class="g" style="flex:1;border-radius:18px;padding:10px 12px;box-shadow:none;display:flex;flex-direction:column;gap:2px"><span style="font:600 12.5px Geist">{a}</span><span style="font:500 10.5px Geist Mono;color:{MU}">{b}</span></span>' for a,b in [('F-47','09:12'),('BIB-0001','07:40'),('Carnet p.34','14:05')])}</div>''',top_=54),'layers'),G)
# Domaines
doms=[('Travail',486,72,SL),('Maison',212,88,TP),('Bible & étude',341,12,TX),('Missions',94,81,TP),('Apprentissage',63,46,SL),('Projets',18,39,TX)]
screen('LF03-Domaines','Domaines de vie',shell(
top('#','',gbtn('plus','Ajouter un domaine'))+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Six domaines,<br>une même logique.</h1><span class="sub">Chaque domaine garde ses règles et ses emplacements.</span></div>
{card("".join(f'<div class="col" style="gap:7px;padding:9px 0;{"" if i==0 else "border-top:1px solid "+LINE}"><span class="btw"><span class="row" style="gap:10px">{sw(c,10,3)}<strong style="font-weight:600">{n}</strong></span>{dot(str(k),20)}</span><span style="display:flex;height:6px;border-radius:3px;overflow:hidden;background:rgba(17,17,19,.06)"><i style="width:{p}%;background:#111113"></i><i style="width:{100-p}%;background:rgba(17,17,19,.18)"></i></span><span style="font:500 11px Geist Mono;color:{MU}">{p} % physique · {100-p} % numérique</span></div>' for i,(n,k,p,c) in enumerate(doms)),pad="10px 18px",gap=0)}''',top_=110),'layers'),G)
# Recherche
res=[('Réalités',[('FAC-2026-0047','Facture de rachat F-47 · à vérifier',lead('euro',RED,'rgba(181,67,47,.08)')),('LIV-2026-0047','Exemplaire n° 47 · Concordance Strong',lead('book'))]),('Bible & Strong',[('Jean 4:7','« Donne-moi à boire. »',lead('book',SL)),('Psaume 47','« Battez des mains, vous tous, peuples ! »',lead('book',SL)),('G47 · ἁγνεία','pureté · 2 occurrences',lead('hash',SL))]),('Lieux & carnets',[('Pochette 47','Classeur 04 › C · 8 documents',lead('pin',TP)),('Carnet p. 47','Journal de terrain · 14 mars',lead('note',TP))])]
blocks=''.join(f'<div class="col" style="gap:6px">{micro(h)}{card("".join(item(a,b,"",lead=ld,first=(j==0)) for j,(a,b,ld) in enumerate(rs)),pad="6px 16px",gap=0)}</div>' for h,rs in res)
screen('LF04-Recherche','Recherche universelle',shell(
f'<div style="position:absolute;top:54px;left:16px;right:16px;display:flex;gap:10px;align-items:center"><div class="g" style="flex:1;height:50px;border-radius:25px;display:flex;align-items:center;gap:10px;padding:0 18px;box-shadow:none">{ic("search",18)}{dot("47",22)}<span style="width:2px;height:22px;background:{TX}"></span><span style="margin-left:auto;font:500 12px Geist Mono;color:{MU}">8 résultats</span></div><span style="font:600 14px Geist">Annuler</span></div>'+
body(blocks,top_=118,gap=14),None),G)
# Scanner
corners=''.join(f'<span style="position:absolute;{v}:0;{h}:0;width:34px;height:34px;border-{v}:3px solid #FFFFFF;border-{h}:3px solid #FFFFFF;border-{v}-{h}-radius:16px"></span>' for v in ('top','bottom') for h in ('left','right'))
screen('LF05-Scanner','Scanner',f'''<div class="l" style="background:#1A1A1C">
<div style="position:absolute;inset:0;background:radial-gradient(120% 70% at 50% 40%,#5C5A55 0%,#2A2927 60%,#1A1A1C 100%)"></div>
<div style="position:absolute;left:70px;top:170px;transform:rotate(-8deg);opacity:.95">{paper(250,0,True,None,'0 30px 60px rgba(0,0,0,.5)')}</div>
<div style="position:absolute;left:218px;top:150px;width:104px;height:104px">{corners}</div>
{top(None,chipc(f'{sw(GRN,7,4)}EMPREINTE:FAC-2026-0047'),gbtn("flash","Lampe"),54).replace('<span style="width:44px"></span>',gbtn('x','Fermer'),1)}
<div style="position:absolute;left:16px;right:16px;top:540px;display:flex;justify-content:center;gap:6px">{''.join(f'<span class="pill" style="background:{"#FFFFFF" if i==0 else "rgba(255,255,255,.14)"};color:{"#111113" if i==0 else "#FFFFFF"}">{t}</span>' for i,t in enumerate(['QR','Code-barres','ISBN','NFC']))}</div>
<div class="g" style="position:absolute;left:12px;right:12px;bottom:16px;border-radius:30px;padding:18px;display:flex;flex-direction:column;gap:12px;background:rgba(255,255,255,.86)">
<div class="btw">{micro("Reconnu · 0,2 s")}<span class="pill grn">original présent</span></div>
<div class="row" style="gap:14px"><span style="width:56px;height:72px;border-radius:6px;background:#FFFEFB;border:1px solid #EFEBE4;box-shadow:0 6px 14px rgba(0,0,0,.08);flex:none;padding:7px;box-sizing:border-box;display:flex;flex-direction:column;gap:4px"><i style="display:block;height:2px;background:#DDD6CB;width:80%"></i><i style="display:block;height:2px;background:#DDD6CB;width:55%"></i><i style="display:block;height:2px;background:#DDD6CB;width:90%"></i><i style="display:block;height:2px;background:#DDD6CB;width:90%"></i><i style="display:block;height:2px;background:#DDD6CB;width:60%"></i><i style="display:block;height:2px;background:#DDD6CB;width:75%"></i></span><span class="col" style="flex:1;gap:2px">{dot("F-47",26)}<span style="font-size:13px;color:{MU}">Facture de rachat · Antiquités Martin</span><span style="font:500 12px Geist Mono;color:{MU}">Classeur 02 › B › Pochette 14</span></span></div>
<a href="#" class="btn k">Ouvrir l’empreinte</a></div></div>''',G)
# Capturer
kinds=[('paper','Document'),('euro','Facture'),('book','Livre · ISBN'),('book','Bible'),('laptop','Équipement'),('box','Objet'),('note','Page de carnet'),('truck','Lot · mission')]
screen('LF06-Capturer','Capturer',shell(
top('#','',None)+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Qu’avez-vous<br>devant vous ?</h1><span class="sub">Le physique garde son existence. Empreinte en crée la trace.</span></div>
<a href="#" class="g" style="border-radius:28px;padding:18px;display:flex;align-items:center;gap:16px;text-decoration:none;color:{TX};background:#111113;border-color:#111113"><span style="width:58px;height:58px;border-radius:29px;background:#FFFFFF;color:#111113;display:flex;align-items:center;justify-content:center">{ic("camera",26)}</span><span class="col" style="color:#FFFFFF"><strong style="font-size:17px">Photographier</strong><span style="font-size:13px;opacity:.7">Empreinte reconnaît le type tout seul</span></span></a>
<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">{''.join(f'<a href="#" class="g" style="border-radius:20px;padding:12px 4px;display:flex;flex-direction:column;align-items:center;gap:8px;text-decoration:none;color:{TX};box-shadow:none;text-align:center">{ic(i,21)}<span style="font:600 11px/1.2 Geist">{t}</span></a>' for i,t in kinds)}</div>
{items([("Créer sans original","Projet, idée : une réalité d’abord numérique","",lead("sparkle")),("Importer des fichiers","PDF, photos, relevés OFX, Factur-X","",lead("upload"))])}''',top_=110),None),G)
# Principe
steps=['Réalité','Représentation','Identification','Organisation','Relation','Action','Preuve','Expérience','Retour','Apprentissage']
import math
ring=''
for i,s in enumerate(steps):
    a=-math.pi/2+i*2*math.pi/10; x=150+118*math.cos(a); y=150+118*math.sin(a)
    ring+=f'<span style="position:absolute;left:{x-11:.0f}px;top:{y-11:.0f}px;width:22px;height:22px;border-radius:11px;background:{"#111113" if i==0 else "#FFFFFF"};color:{"#FFFFFF" if i==0 else TX};border:1px solid rgba(17,17,19,.12);display:flex;align-items:center;justify-content:center;font:600 10px Geist Mono">{i+1}</span>'
    lx=150+150*math.cos(a); ly=150+150*math.sin(a)
    ring+=f'<span style="position:absolute;left:{lx-50:.0f}px;top:{ly-8:.0f}px;width:100px;text-align:center;font:600 10.5px Geist;color:{TX if i==0 else MU}">{s}</span>'
screen('LF07-Principe','Le principe',shell(
f'<div style="position:absolute;top:60px;right:20px;font:600 14px Geist">Passer</div>'+
f'''<div style="position:absolute;top:110px;left:20px;right:20px" class="col"><span class="micro">Empreinte</span><h1 class="h1" style="font-size:34px;margin-top:6px">Le numérique aide<br>à vivre le réel.</h1><span class="sub" style="margin-top:8px">Le réel nourrit le numérique. Aucun ne remplace l’autre.</span></div>
<div style="position:absolute;left:45px;top:300px;width:300px;height:300px"><span style="position:absolute;inset:32px;border-radius:50%;border:1.5px dashed rgba(17,17,19,.15)"></span>{ring}<span style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">{l.FP.replace('width="22" height="22"','width="54" height="54"')}<span style="font:500 11px Geist Mono;color:{MU};margin-top:6px">une boucle, dix gestes</span></span></div>
<a href="#" class="btn k" style="position:absolute;left:20px;right:20px;bottom:40px">Commencer</a>''',None),G)
