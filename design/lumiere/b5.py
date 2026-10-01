from lum import *
G='domaines'
def book3d(c1='#3B3530',c2='#57504A',title='',w=90,h=124):
    return f'<div style="width:{w}px;height:{h}px;border-radius:4px 10px 10px 4px;background:linear-gradient(90deg,{c1} 0 12px,{c2} 12px);box-shadow:0 18px 30px rgba(17,17,19,.25),inset -2px 0 0 rgba(255,255,255,.08);flex:none;position:relative;transform:rotate(-3deg)"><span style="position:absolute;left:22px;right:10px;top:18px;font:600 9px/1.3 Literata;color:rgba(255,255,255,.75);letter-spacing:.05em">{title}</span><span style="position:absolute;left:22px;right:10px;bottom:18px;height:1px;background:rgba(255,255,255,.3)"></span></div>'
def kvcard(rows): return card("".join(f'<div class="btw" style="padding:8px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="font-size:13px;color:{MU}">{a}</span><span style="font-weight:600;font-size:13.5px;text-align:right">{b}</span></div>' for k,(a,b) in enumerate(rows)),pad="6px 18px",gap=0)
# Livre
screen('LD01-Livre','Livre',shell(
top('#',chipc('Livre'),gbtn('more','Plus'))+
body(f'''<div class="row" style="gap:18px;align-items:flex-end">{book3d('#2E2B27','#4A4540','CONCORDANCE STRONG')}<span class="col" style="gap:4px"><span class="micro">LIV-2026-0047</span><h1 class="h1" style="font-size:24px">Concordance Strong</h1><span class="sub">exemplaire n° 12 sur 14</span></span></div>
{kvcard([('ISBN','978-2-91343-012-4'),('Emplacement','Étagère 1 › rang 2'),('État','bon · coins usés'),('Propriétaire','Église de Lyon')])}
{micro("Prêts")}
<div class="g" style="padding:16px 18px;display:flex;flex-direction:column;gap:12px"><div class="row" style="gap:3px">{"".join(f'<span style="flex:{f};height:10px;border-radius:5px;background:{c}"></span>' for f,c in [(3,'rgba(17,17,19,.15)'),(2,'#8C8378'),(3,'rgba(17,17,19,.15)'),(2,'#111113')])}</div>
<div class="btw"><span class="col"><strong style="font-size:14px">Prêté à Paul M.</strong><span style="font-size:12px;color:{MU}">depuis le 22/09 · retour le 22/10</span></span><span class="pill">en cours</span></div></div>
<div class="row" style="gap:10px;margin-top:auto"><a href="#" class="btn w" style="flex:1">{ic("hand",18)}Prêter</a><a href="#" class="btn k" style="flex:1">{ic("camera",18,"#FFFFFF")}Photo de l’état</a></div>''',top_=110,bottom=104),'layers'),G)
# Équipement
screen('LD02-Equipement','Équipement',shell(
top('#',chipc('Équipement'),gbtn('more','Plus'))+
body(f'''<div style="height:150px;position:relative;perspective:700px"><div style="position:absolute;left:80px;top:10px;width:200px;height:126px;border-radius:10px;background:#2B2B2E;transform:rotateX(14deg);box-shadow:0 20px 30px rgba(17,17,19,.25);padding:8px;box-sizing:border-box"><div style="width:100%;height:100%;border-radius:4px;background:linear-gradient(135deg,#EDEDEA,#D6D5D0)"></div></div><div style="position:absolute;left:60px;top:134px;width:240px;height:12px;border-radius:0 0 12px 12px;background:#3A3A3D"></div></div>
<div class="col" style="gap:4px"><span class="micro">EQP-2024-0007</span><h1 class="h1" style="font-size:24px">ThinkPad T14</h1></div>
{kvcard([('N° de série','PF3K9Z2A'),('Emplacement','Bureau › poste 3'),('Responsable','Marie L.'),('Facture','FAC-2024-0112')])}
<div class="g" style="padding:16px 18px;display:flex;flex-direction:column;gap:8px;border-color:rgba(140,131,120,.4)"><div class="btw">{micro("Garantie")}<span>{dot("12",22)}<span style="font-size:12px;color:{MU}"> jours</span></span></div>{bar(96,TP,5)}<span style="font-size:12px;color:{MU}">jusqu’au 13/10/2026 · Lenovo Premier</span></div>''',top_=110,bottom=104),'layers'),G)
# Bible physique
pas=[('Jean 3:16','annoté au crayon · note liée'),('Psaume 23','souligné · 3 lectures'),('Romains 8:28-30','étude du 14/09')]
screen('LD03-BiblePhysique','Bible physique',shell(
top('#',chipc('Bible physique'),gbtn('more','Plus'))+
body(f'''<div class="row" style="gap:18px;align-items:flex-end">{book3d('#151517','#232326','SAINTE BIBLE · SEGOND 21',96,132)}<span class="col" style="gap:4px"><span class="micro">BIB-2026-0001</span><h1 class="h1" style="font-size:24px">Bible Segond 21</h1><span class="sub">exemplaire de mission · 2016</span></span></div>
{kvcard([('Édition','Société Biblique de Genève'),('Marquage','marque-page QR'),('Emplacement','Bureau › étagère')])}
{micro("Passages étudiés dans cet exemplaire")}
{card("".join(item(a,b,ic("fwd",16),lead=lead("book"),first=(k==0)) for k,(a,b) in enumerate(pas)),pad="6px 18px",gap=0)}
<div class="g" style="padding:12px 14px;display:flex;gap:10px;box-shadow:none">{ic("image",17)}<span style="font-size:12.5px;line-height:1.45">Les annotations au crayon restent sur le papier. Leur photo devient une empreinte de la page.</span></div>''',top_=110,bottom=104),'layers'),G)
# Mission
steps=[('cart','Achat','BC-2026-0011'),('euro','Facture','FAC-2026-0031 · 4 800 €'),('truck','Réception','BL-2209 · BL-2231'),('pin','Dépôt','palettes 1 et 2'),('hand','Distribution','23 lieux'),('check','Preuves','21 / 23')]
screen('LD04-Mission','Mission',shell(
top('#',chipc('MIS-2026-0002'),gbtn('more','Plus'))+
body(f'''<div class="col" style="gap:4px"><span class="micro">Mission · rentrée 2026</span><h1 class="h1">1000 Bibles</h1></div>
<div class="row" style="align-items:baseline;gap:6px">{dot("640",72)}<span class="dot" style="font-size:30px;color:rgba(17,17,19,.25)">/1000</span></div>
<div class="row" style="gap:3px;height:12px">{"".join(f'<span style="flex:{f};border-radius:6px;background:{c}"></span>' for f,c in [(640,'#111113'),(358,'rgba(17,17,19,.2)'),(10,RED)])}</div>
<div class="row" style="gap:14px;font-size:12px;color:{MU}"><span class="row" style="gap:6px">{sw(TX,8,4)}640 remises</span><span class="row" style="gap:6px">{sw("rgba(17,17,19,.25)",8,4)}358 comptées</span><span class="row" style="gap:6px">{sw(RED,8,4)}écart de 2</span></div>
{card("".join(f'<div class="row" style="padding:8px 0;gap:12px;{"" if k==0 else "border-top:1px solid "+LINE}">{lead(i)}<span class="col" style="flex:1"><strong style="font-weight:600;font-size:13.5px">{t}</strong><span style="font-size:12px;color:{MU}">{s}</span></span>{ic("check",16,GRN if k<5 else TP,2.2)}</div>' for k,(i,t,s) in enumerate(steps)),pad="6px 18px",gap=0)}''',top_=110,bottom=104),'layers'),G)
# Distribution
screen('LD05-Distribution','Distribution',shell(
top('#',chipc('Nouvelle distribution'),None)+
body(f'''<div class="col" style="gap:6px"><span class="micro">Lieu</span><div class="inp">Lycée Ampère · Lyon 2e</div></div>
<div class="g" style="padding:18px;display:flex;align-items:center;justify-content:space-between"><a href="#" class="ib" aria-label="Moins" style="background:{SOFT};border-radius:22px;font:600 24px Geist">−</a><span class="col" style="align-items:center">{dot("40",72)}<span style="font-size:12px;color:{MU}">Bibles remises</span></span><a href="#" class="ib" aria-label="Plus" style="background:#111113;color:#FFFFFF;border-radius:22px">{ic("plus",20,"#FFFFFF")}</a></div>
<div class="col" style="gap:6px"><span class="micro">Remis à</span><div class="inp">Mme Benali · aumônerie</div></div>
{micro("Preuves")}
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">{"".join(f'<div class="g" style="border-radius:18px;padding:14px 6px;display:flex;flex-direction:column;align-items:center;gap:8px;box-shadow:none;{"border:1.5px solid #111113" if k<2 else ""}">{ic(i,20)}<span style="font:600 12px Geist">{t}</span></div>' for k,(i,t) in enumerate([('camera','Photo'),('sig','Signature'),('pin','Lieu')]))}</div>
<span style="font-size:12.5px;color:{MU}">Le stock passera de 360 à 320. La distribution sera reliée à la mission.</span>
<a href="#" class="btn k" style="margin-top:auto">Enregistrer</a>''',top_=110,bottom=30),None),G)
# Projet
vers=[('v1','Maquette carton','photo · 02/06','physique'),('v2','Plan 3D','fichier .skp · 18/06','numérique'),('v3','Maquette bois','NFC sous le socle · 10/07','physique'),('v4','Plan final','PDF imprimé A3 · 12/09','numérique')]
screen('LD06-Projet','Projet',shell(
top('#',chipc('PRJ-2026-0003'),gbtn('more','Plus'))+
body(f'''<div class="col" style="gap:4px"><span class="micro">Projet</span><h1 class="h1">Boutique de Lyon</h1></div>
<div class="col" style="gap:0;position:relative;padding-left:4px">{"".join(f'<div class="row" style="gap:14px;align-items:stretch"><div class="col" style="align-items:center;width:40px"><span style="width:40px;height:40px;border-radius:{"8px" if k=="physique" else "20px"};background:{"#111113" if k=="physique" else "#FFFFFF"};color:{"#FFFFFF" if k=="physique" else TX};border:1px solid rgba(17,17,19,.15);display:flex;align-items:center;justify-content:center;font:600 12px Geist Mono">{v}</span>{"" if j==3 else "<span style=\'flex:1;width:2px;background:rgba(17,17,19,.12);min-height:14px\'></span>"}</div><div class="g" style="flex:1;padding:10px 14px;margin-bottom:10px;box-shadow:none"><div class="btw"><strong style="font-size:14px">{t}</strong><span style="font:600 10px Geist Mono;letter-spacing:.06em;text-transform:uppercase;color:{MU}">{k}</span></div><span style="font-size:12px;color:{MU}">{s}</span></div></div>' for j,(v,t,s,k) in enumerate(vers))}</div>
{card("".join(item(a,b,"",lead=lead(i),first=(k==0)) for k,(a,b,i) in enumerate([('Décision : vitrine à gauche','12/07 · 3 présents','flag'),('Test : circulation','v3 · 6 personnes','users')])),pad="6px 18px",gap=0)}''',top_=110,bottom=104),'layers'),G)
# Journaux
screen('LD07-Journaux','Mes deux journaux',shell(
top('#',chipc('Mes deux journaux'),None)+
body(f'''<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
<div class="g" style="padding:14px;display:flex;flex-direction:column;gap:10px"><div style="height:80px;border-radius:4px 8px 8px 4px;background:linear-gradient(90deg,#2E2B27 0 8px,#4A4540 8px);box-shadow:0 10px 18px rgba(17,17,19,.2)"></div><strong style="font-size:14px">Carnet de terrain</strong><span style="font-size:12px;color:{MU}">papier · 34 / 96 pages</span></div>
<div class="g" style="padding:14px;display:flex;flex-direction:column;gap:10px"><div style="height:80px;border-radius:10px;background:#FFFFFF;border:1px solid rgba(17,17,19,.08);padding:10px;box-sizing:border-box;display:flex;flex-direction:column;gap:6px">{"".join(f'<i style="display:block;height:3px;border-radius:2px;background:rgba(17,17,19,.12);width:{w}%"></i>' for w in (90,70,85,50))}</div><strong style="font-size:14px">Journal numérique</strong><span style="font-size:12px;color:{MU}">218 entrées</span></div></div>
<div class="g" style="padding:14px;display:flex;flex-direction:column;gap:10px"><div class="btw"><strong style="font-size:15px">Carnet · page 34</strong><span class="pill">numérisée hier</span></div>
<div style="border-radius:6px;padding:12px 14px;background:#FBFAF6;background-image:repeating-linear-gradient(#FBFAF6 0 25px,#E5E2D8 25px 26px);font:600 19px/26px Caveat;color:#2B3530">30 sept. — distribution lycée Ampère, <span style="background:rgba(17,17,19,.08);border-radius:4px">40 Bibles</span>.<br>Relire <span style="background:rgba(17,17,19,.08);border-radius:4px">Jean 3:16</span> avec le groupe.<br>Facture <span style="background:rgba(181,67,47,.12);border-radius:4px">F-47</span> à vérifier !</div>
<div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill">MIS-2026-0002</span><span class="pill">Jean 3:16</span><span class="pill red">FAC-2026-0047</span></div></div>
<a href="#" class="btn k">{ic("camera",18,"#FFFFFF")}Numériser une page</a>''',top_=110,bottom=104),'layers'),G)
# Entrée de journal
def ent(t,c=TX,bg='rgba(17,17,19,.07)'): return f'<span style="display:inline-flex;align-items:center;height:26px;padding:0 9px;border-radius:13px;background:{bg};color:{c};font:600 13px Geist;vertical-align:1px">{t}</span>'
screen('LD08-EntreeJournal','Entrée de journal',shell(
top('#',chipc('Mercredi 1er octobre'),gbtn('more','Plus'))+
body(f'''<p style="margin:0;font:400 19px/1.75 Literata,serif">Ce matin, lecture de {ent("Jean 3:16")} avec la {ent("Bible de mission")}. « Donner avant de recevoir. »</p>
<p style="margin:0;font:400 19px/1.75 Literata,serif">Vérifié la facture {ent("FAC-2026-0047",RED,"rgba(181,67,47,.1)")} : l’original indique bien 1 250 €.</p>
<p style="margin:0;font:400 19px/1.75 Literata,serif">Prochaine étape : 40 Bibles pour le lycée Ampère.</p>
<div class="g" style="padding:14px 16px;display:flex;flex-direction:column;gap:8px;margin-top:auto;box-shadow:none"><span class="micro">Reconnu automatiquement · 3 réalités</span><div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill">Jean 3:16</span><span class="pill">BIB-2026-0001</span><span class="pill red">FAC-2026-0047</span></div></div>
<div class="row" style="gap:6px"><span class="pill">Mission</span><span class="pill">Prière</span><span class="pill" style="background:transparent;border:1px dashed rgba(17,17,19,.25)">+ étiquette</span></div>''',top_=110,bottom=30),None),G)
# Personne
screen('LD09-Personne','Personne',shell(
top('#',chipc('PER-0012'),gbtn('more','Plus'))+
body(f'''<div class="col" style="align-items:center;gap:10px;margin-top:10px"><span style="width:96px;height:96px;border-radius:48px;background:#111113;color:#FFFFFF;display:flex;align-items:center;justify-content:center">{dot("MD",34,"#FFFFFF")}</span><h1 class="h1">M. Dupont</h1><span class="sub">client · depuis 2024</span></div>
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">{"".join(f'<div class="g" style="border-radius:20px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:none">{dot(v,28)}<span style="font-size:11.5px;color:{MU}">{t}</span></div>' for v,t in [('4','factures'),('1','prêt'),('7','documents')])}</div>
{card("".join(item(a,b,r,lead=lead(i,c),first=(k==0)) for k,(a,b,r,i,c) in enumerate([('FAC-2026-0047','facture de rachat · 1 250 €','<span class="pill red">écart</span>','euro',RED),('LIV-2026-0019','livre prêté · retour 05/11','','book',TX),('Contrat de dépôt-vente','DOC-2025-0088 · original signé','','paper',TX)])),pad="6px 18px",gap=0)}''',top_=110,bottom=104),'layers'),G)
# Stock
st=[('Bibles Segond 21','Dépôt › palettes 1-2',358,False),('Nouveaux Testaments','Dépôt › étagère 3',85,False),('Chaises (lot)','Boutique › réserve',6,False),('Commode L.-Philippe','Boutique › réserve',1,False),('Étiquettes QR 50×60','Bureau › tiroir 2',24,True)]
screen('LD10-Stock','Stock',shell(
top('#',chipc('Stock'),gbtn('plus','Ajouter'))+
body(f'''{search("Chercher un article…")}
{"".join(f'<div class="g" style="padding:12px 16px;display:flex;align-items:center;gap:14px;box-shadow:none;{"border-color:rgba(140,131,120,.5)" if low else ""}"><span class="col" style="flex:1"><strong style="font-size:14px">{n}</strong><span style="font-size:12px;color:{MU}">{w}</span></span>{"<span class=\'pill\' style=\'background:rgba(140,131,120,.18)\'>bas</span>" if low else ""}{dot(str(q),30)}</div>' for n,w,q,low in st)}''',top_=110,bottom=104),'layers'),G)
