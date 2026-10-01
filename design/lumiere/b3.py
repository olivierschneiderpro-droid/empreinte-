from lum import *
G='physique'
# Méthodes
m=[('qr','Étiquette QR','un scan ouvre l’empreinte',9),('pen','Numéro écrit','lisible sans appareil',7),('pin','Emplacement','classeur › section › pochette',6),('color','Couleur de dossier','bleu = Fournisseurs',4),('barcode','Code-barres','lecture en série',4),('cal','Classement par date','par réception',4),('nfc','Puce NFC','mieux pour les objets',1)]
screen('LP01-Methodes','Méthodes de marquage',shell(
top('#',chipc('FAC-2026-0047'),None)+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Relier l’original<br>au système.</h1><span class="sub">Pour 600 documents papier, Empreinte recommande :</span></div>
<div class="g" style="padding:16px;display:flex;gap:10px;background:#111113;border-color:#111113;color:#FFFFFF">{''.join(f'<div class="col" style="flex:1;align-items:center;gap:6px;text-align:center"><span style="width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center">{ic(i,22,"#FFFFFF")}</span><span style="font:600 12px Geist">{t}</span></div>' + ('' if k==2 else '<span style="align-self:center;font:600 18px Geist;opacity:.4">+</span>') for k,(i,t) in enumerate([('qr','QR'),('pen','Numéro'),('pin','Emplacement')]))}</div>
{card("".join(f'<div class="row" style="padding:9px 0;gap:12px;{"" if k==0 else "border-top:1px solid "+LINE}">{lead(i)}<span class="col" style="flex:1"><strong style="font-weight:600;font-size:14px">{t}</strong><span style="font-size:12px;color:{MU}">{s}</span></span>{dot(str(sc),24,TX if sc>=6 else "rgba(17,17,19,.3)")}<span class="gm" style="font-size:11px;color:{MU}">/10</span></div>' for k,(i,t,s,sc) in enumerate(m)),pad="6px 18px",gap=0)}''',top_=110,bottom=30),None),G)
# Étiquette
screen('LP02-Etiquette','Étiquette',shell(
top('#',chipc('Étiquette'),None)+
f'''<div style="position:absolute;left:0;right:0;top:120px;height:330px;perspective:900px;display:flex;justify-content:center">
<div style="margin-top:20px;width:220px;height:264px;border-radius:14px;background:#FFFFFF;transform:rotateX(18deg) rotateZ(-6deg);box-shadow:0 30px 50px rgba(17,17,19,.18),0 2px 0 rgba(0,0,0,.04);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;position:relative">
{qr(140,'#111113')}{dot("FAC·2026·0047",17)}<span class="gm" style="font-size:10.5px;color:{MU}">02 · B · 14 — Fournisseurs</span>
<span style="position:absolute;right:0;bottom:0;width:38px;height:38px;background:linear-gradient(135deg,#FFFFFF 50%,#E5E3DF 50%);border-radius:0 0 14px 0;box-shadow:-2px -2px 6px rgba(0,0,0,.06)"></span></div></div>'''+
body(f'''{seg(["50 × 60 mm","Planche A4","Rouleau"],0)}
{card("".join(f'<div class="btw" style="padding:8px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="font-size:13px;color:{MU}">{a}</span><span style="font-weight:600;font-size:13.5px">{b}</span></div>' for k,(a,b) in enumerate([('Contenu du QR','EMPREINTE:FAC-2026-0047'),('Position','en haut à droite'),('Imprimante','Brother QL-800 · prête')])),pad="8px 18px",gap=0)}
<div class="row" style="gap:10px"><a href="#" class="btn w" style="flex:1">{ic("print",18)}Imprimer</a><a href="#" class="btn k" style="flex:1.2">C’est collé</a></div>''',top_=470,bottom=30),None),G)
# Manuscrit
screen('LP03-Manuscrit','Inscrire à la main',shell(
top('#',chipc('Inscrire à la main'),None)+
f'''<div style="position:absolute;left:80px;top:120px;transform:rotate(-1.5deg)">{paper(230,0,False,None,'0 24px 44px rgba(17,17,19,.16)')}</div>
<div style="position:absolute;left:196px;top:122px;width:124px;height:40px;border:2px dashed #111113;border-radius:10px;transform:rotate(-1.5deg);display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.75)"><span style="font:600 19px Caveat;color:#2B3E8C;white-space:nowrap">FAC-2026-0047</span></div>
<span class="g" style="position:absolute;left:200px;top:168px;height:28px;border-radius:14px;padding:0 10px;display:flex;align-items:center;font:600 11px Geist;box-shadow:none">ici, dans la marge</span>'''+
body(card("".join(f'<div class="row" style="padding:9px 0;gap:12px;{"" if k==0 else "border-top:1px solid "+LINE}"><span class="dot" style="font-size:22px;width:24px">{k+1}</span><span class="col"><strong style="font-weight:600;font-size:14px">{a}</strong><span style="font-size:12.5px;color:{MU}">{b}</span></span></div>' for k,(a,b) in enumerate([('Où','en haut à droite, hors de tout texte'),('Avec quoi','crayon ou stylo encre d’archive'),('Quoi','FAC-2026-0047 en capitales')])),pad="6px 18px",gap=0)+f'<div class="g" style="border-radius:18px;padding:11px 14px;display:flex;gap:10px;box-shadow:none">{ic("alert",17)}<span style="font-size:12.5px">Jamais sur un document ancien ou une Bible : utiliser un marque-page.</span></div><a href="#" class="btn k">C’est inscrit</a>',top_=448,bottom=30),None),G)
# Emplacement calculé
screen('LP04-EmplacementCalcule','Emplacement calculé',shell(
top('#',chipc('Où la ranger ?'),None)+
body(f'''<span class="micro">Selon votre plan D · hybride</span>
<div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill">Fournisseurs</span><span style="color:{MU}">›</span><span class="pill">2026</span><span style="color:{MU}">›</span><span class="pill">Achats</span></div>
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:6px">{''.join(f'<div class="g" style="border-radius:24px;padding:16px 14px;display:flex;flex-direction:column;gap:8px;{"background:#111113;border-color:#111113;color:#FFFFFF" if k==2 else ""}"><span class="micro" style="{"color:rgba(255,255,255,.6)" if k==2 else ""}">{a}</span>{dot(b,54,"#FFFFFF" if k==2 else TX)}</div>' for k,(a,b) in enumerate([('Classeur','02'),('Section','B'),('Pochette','14')]))}</div>
{card(f'<div class="btw"><span class="micro">Occupation de la pochette 14</span><span class="gm" style="font-size:12px">7 / 10</span></div><div class="row" style="gap:4px">'+''.join(f'<span style="flex:1;height:34px;border-radius:6px;background:{"#111113" if i==6 else "rgba(17,17,19,.2)" if i<6 else "rgba(17,17,19,.05)"}"></span>' for i in range(10))+f'</div><span style="font-size:12.5px;color:{MU}">Voisines : FAC-2026-0044 · 0045 · 0046</span>')}
<div class="g" style="border-radius:18px;padding:12px 14px;display:flex;gap:10px;box-shadow:none">{ic("help",17)}<span style="font-size:13px;line-height:1.45">Domaine Fournisseurs, année 2026, catégorie Achats : la section B de 2026 est déjà attribuée.</span></div>
<div class="row" style="gap:10px;margin-top:auto"><a href="#" class="btn w" style="flex:1">Autre endroit</a><a href="#" class="btn k" style="flex:1.2">C’est rangé</a></div>''',top_=110,bottom=30),None),G)
# Plan de rangement
def classeur(n,occ,hl=None):
    rows=''
    for s,o in zip('ABCDEF',occ):
        rows+=f'<div class="row" style="gap:4px"><span class="gm" style="font-size:10.5px;width:12px;color:{MU}">{s}</span>'+''.join(f'<span style="flex:1;height:16px;border-radius:4px;background:{"#B5432F" if hl==(s,k) else "#111113" if v>=10 else "rgba(17,17,19,.3)" if v>0 else "rgba(17,17,19,.06)"}"></span>' for k,v in enumerate(o))+'</div>'
    return card(f'<div class="btw"><strong style="font-size:14px">Classeur {n}</strong>{dot(n,20)}</div>'+rows,gap=6)
screen('LP05-PlanRangement','Plan de rangement',shell(
top('#',chipc('Rangement physique'),gbtn('grid','Vue'))+
body(f'''{classeur("01",[[10,10,4,0,0,0],[10,6,0,0,0,0],[10,4,0,0,0,0],[6,0,0,0,0,0],[0]*6,[0]*6])}
{classeur("02",[[10,4,0,0,0,0],[10,10,7,0,0,0],[10,6,0,0,0,0],[6,0,0,0,0,0],[0]*6,[0]*6],("B",2))}
<div class="row" style="gap:14px">{''.join(f'<span class="row" style="gap:6px;font-size:12px;color:{MU}">{sw(c,10,3)}{t}</span>' for c,t in [('#111113','pleine'),('rgba(17,17,19,.3)','entamée'),('rgba(17,17,19,.08)','libre'),('#B5432F','F-47')])}</div>''',top_=110),'layers'),G)
# Organisation
opts=[('D','Hybride + identifiant',4.45,20),('B','Par domaine',3.60,27),('A','Chronologique',3.45,35),('C','Par projet',2.95,35)]
screen('LP06-Organisation','Organiser',shell(
top('#',chipc('600 documents'),gbtn('cog','Critères'))+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Quelle organisation<br>physique ?</h1><span class="sub">10 recherches / semaine · 5 domaines · 10 ans</span></div>
{''.join(f'<div class="g" style="padding:14px 16px;display:flex;align-items:center;gap:14px;{"background:#111113;border-color:#111113;color:#FFFFFF" if k==0 else "box-shadow:none"}">{dot(l_,40,"#FFFFFF" if k==0 else TX)}<span class="col" style="flex:1;gap:6px"><span class="btw"><strong style="font-size:14.5px">{n}</strong><span class="gm" style="font-size:13px">{s:.2f}</span></span><span style="display:block;height:5px;border-radius:3px;background:{"rgba(255,255,255,.2)" if k==0 else "rgba(17,17,19,.08)"}"><i style="display:block;height:5px;border-radius:3px;width:{int(s/5*100)}%;background:{"#FFFFFF" if k==0 else TX}"></i></span><span style="font-size:12px;opacity:.65">~{t} s pour retrouver un document</span></span></div>' for k,(l_,n,s,t) in enumerate(opts))}
<div class="row" style="gap:10px;margin-top:auto"><a href="#" class="btn w" style="flex:1">Voir le plan</a><a href="#" class="btn k" style="flex:1.2">Appliquer D</a></div>''',top_=110,bottom=30),None),G)
# Critères
cr=[('Temps de recherche',90),('Fréquence d’usage',80),('Volume',70),('Risque de perte',75),('Coût',30),('Espace',40),('Accès',60),('Confidentialité',35),('Durabilité',80),('Partage',30),('Synchronisation',65)]
screen('LP07-Criteres','Critères',shell(
top('#',chipc('Ce qui compte pour vous'),None)+
body(card("".join(f'<div class="col" style="gap:8px;padding:8px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span class="btw"><span style="font-weight:600;font-size:13.5px">{n}</span><span class="gm" style="font-size:12px">{v}</span></span><span style="position:relative;height:4px;border-radius:2px;background:rgba(17,17,19,.1)"><i style="position:absolute;left:0;top:0;height:4px;border-radius:2px;width:{v}%;background:#111113"></i><i style="position:absolute;top:-8px;left:calc({v}% - 10px);width:20px;height:20px;border-radius:10px;background:#FFFFFF;box-shadow:0 1px 5px rgba(0,0,0,.25)"></i></span></div>' for k,(n,v) in enumerate(cr)),pad="8px 18px",gap=0)+'<a href="#" class="btn k">Recalculer</a>',top_=110,bottom=30),None),G)
# Inventaire
r=48; C=2*3.14159*r
screen('LP08-Inventaire','Contrôle de présence',shell(
top('#',chipc(f'{sw(TX,7,4)}En cours · Classeur 02'),None)+
body(f'''<div class="row" style="gap:18px"><span style="position:relative;width:120px;height:120px"><svg width="120" height="120" aria-hidden="true"><circle cx="60" cy="60" r="{r}" fill="none" stroke="rgba(17,17,19,.08)" stroke-width="10"/><circle cx="60" cy="60" r="{r}" fill="none" stroke="#111113" stroke-width="10" stroke-linecap="round" stroke-dasharray="{C*46/52:.1f} {C:.1f}" transform="rotate(-90 60 60)"/></svg><span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">{dot("46",34)}</span></span><span class="col" style="gap:4px"><span class="micro">sur 52 attendus</span><h1 class="h1" style="font-size:26px">6 pas encore vus</h1><span class="sub">Scannez chaque étiquette.</span></span></div>
{card("".join(item(a,b,f'<span class="pill {c}">{t}</span>',lead=lead(i,TX if c!="red" else RED),first=(k==0)) for k,(a,b,t,c,i) in enumerate([('FAC-2026-0047','Pochette 14','vu','grn','check'),('FAC-2026-0046','Pochette 14','vu','grn','check'),('FAC-2026-0031','attendue en Pochette 11','non vue','red','alert'),('Document sans étiquette','trouvé en Pochette 12','à intégrer','','plus')])),pad="6px 18px",gap=0)}
<div class="row" style="gap:10px;margin-top:auto"><a href="#" class="btn k" style="flex:1.3">{ic("scan",18,"#FFFFFF")}Scanner</a><a href="#" class="btn w" style="flex:1">Terminer</a></div>''',top_=110,bottom=30),None),G)
# Num -> Phys
screen('LP09-NumVersPhys','Du numérique au physique',shell(
top('#',chipc('PRJ-2026-0003 · v4'),None)+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Le numérique laisse<br>aussi une empreinte.</h1><span class="sub">Donner une forme physique au projet « Boutique de Lyon ».</span></div>
<div style="position:relative;height:200px;perspective:900px"><div style="position:absolute;left:70px;top:10px;width:200px;height:170px;transform:rotateX(50deg) rotateZ(-30deg);transform-style:preserve-3d">{''.join(f'<div style="position:absolute;inset:0;border-radius:6px;background:#FFFFFF;border:1px solid rgba(17,17,19,.08);transform:translateZ({z}px);box-shadow:0 2px 4px rgba(0,0,0,.05)"></div>' for z in range(0,24,3))}<div style="position:absolute;inset:0;border-radius:6px;background:#FFFFFF;transform:translateZ(24px);padding:14px;box-sizing:border-box;display:flex;flex-direction:column;gap:6px"><strong style="font:700 13px Geist">Boutique de Lyon</strong><span style="height:3px;width:80%;background:#E5E3DF"></span><span style="height:3px;width:60%;background:#E5E3DF"></span><span style="margin-top:auto;align-self:flex-end">{qr(34)}</span></div></div><span class="g" style="position:absolute;right:4px;top:20px;border-radius:14px;padding:6px 10px;font:600 11.5px Geist;box-shadow:none">12 pages · QR de retour</span></div>
<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">{''.join(f'<a href="#" class="g" style="border-radius:20px;padding:14px;display:flex;flex-direction:column;gap:8px;text-decoration:none;color:{TX};box-shadow:none;{"border:1.5px solid #111113" if k==0 else ""}">{lead(i)}<strong style="font-size:13.5px">{t}</strong><span style="font-size:11.5px;color:{MU};line-height:1.3">{s}</span></a>' for k,(i,t,s) in enumerate([('print','Dossier imprimé','PDF + QR en pied de page'),('note','Carnet de projet','pages numérotées'),('box','Maquette','étiquette NFC sous le socle'),('cal','Affiche planning','A3 avec QR')]))}</div>''',top_=110,bottom=30),None),G)
# Détenteur
screen('LP10-Detenteur','Confier un original',shell(
top('#',chipc('Confier un original'),None)+
body(f'''<div class="g" style="padding:14px 16px;display:flex;gap:14px;align-items:center"><span style="width:44px;height:56px;border-radius:5px;background:#FFFEFB;border:1px solid #EFEBE4;flex:none"></span><span class="col">{dot("F-47",24)}<span style="font:500 12px Geist Mono;color:{MU}">sort de 02 › B › 14</span></span></div>
<div class="col" style="gap:6px"><span class="micro">À qui</span><div class="inp">Cabinet Leroy · comptable</div></div>
<div class="col" style="gap:6px"><span class="micro">Pourquoi</span><div class="inp">Révision des comptes T3</div></div>
<div class="col" style="gap:6px"><span class="micro">Retour prévu</span><div class="inp" style="justify-content:space-between">15 octobre 2026{ic("cal",18)}</div></div>
<div class="col" style="gap:6px"><span class="micro">Signature de remise</span><div class="g" style="height:120px;border-radius:20px;display:flex;align-items:center;justify-content:center;box-shadow:none"><span style="font:600 38px Caveat;color:#2B3E8C;transform:rotate(-4deg)">C. Leroy</span></div></div>
<a href="#" class="btn k" style="margin-top:auto">Enregistrer la remise</a>''',top_=110,bottom=30),None),G)
