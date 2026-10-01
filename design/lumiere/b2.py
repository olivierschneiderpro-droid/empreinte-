from lum import *
import math
G='cycle'
CAM_BG='<div style="position:absolute;inset:0;background:radial-gradient(120% 70% at 50% 40%,#5C5A55 0%,#2A2927 60%,#1A1A1C 100%)"></div>'
def darkbtn(n,l): return f'<a href="#" aria-label="{l}" style="width:44px;height:44px;border-radius:22px;background:rgba(255,255,255,.14);color:#FFFFFF;display:flex;align-items:center;justify-content:center">{ic(n)}</a>'
# Photo
screen('LC01-Photo','Photographier',f'''<div class="l" style="background:#1A1A1C">{CAM_BG}
<div style="position:absolute;top:54px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center">{darkbtn("x","Fermer")}<span style="height:34px;border-radius:17px;padding:0 14px;background:rgba(255,255,255,.14);color:#FFFFFF;display:flex;align-items:center;gap:8px;font:600 12.5px Geist">{sw("#7FD1A6",7,4)}Bords détectés · net</span>{darkbtn("flash","Lampe")}</div>
<div style="position:absolute;left:62px;top:150px;transform:rotate(-3deg)">{paper(266,0,False,None,'0 30px 60px rgba(0,0,0,.5)')}</div>
<div style="position:absolute;left:52px;top:140px;width:286px;height:374px;border:2px solid #FFFFFF;border-radius:8px;transform:rotate(-3deg);box-shadow:0 0 0 4000px rgba(0,0,0,.25)"></div>
<div style="position:absolute;left:0;right:0;top:580px;display:flex;justify-content:center;gap:6px">{''.join(f'<span class="pill" style="background:{"#FFFFFF" if i==1 else "rgba(255,255,255,.14)"};color:{"#111113" if i==1 else "#FFFFFF"}">{t}</span>' for i,t in enumerate(['Document','Facture','Livre','Objet']))}</div>
<div style="position:absolute;left:0;right:0;bottom:60px;display:flex;align-items:center;justify-content:space-around">
<span style="width:48px;height:62px;border-radius:8px;background:#FFFEFB;opacity:.85"></span>
<a href="#" aria-label="Prendre la photo" style="width:78px;height:78px;border-radius:39px;border:4px solid #FFFFFF;display:flex;align-items:center;justify-content:center"><span style="width:62px;height:62px;border-radius:31px;background:#FFFFFF"></span></a>
<span style="font:600 13px Geist;color:#FFFFFF;width:48px;text-align:center">Recto<br><span style="opacity:.6">1 / 2</span></span></div></div>''',G)
# Lecture OCR
fields=[('Émetteur','Antiquités Martin',.92),('Numéro','F-47',.97),('Date','28/09/2026',.95),('Total TTC','1 250,00 €',.90),('TVA 20 %','208,33 €',.84),('Lignes','2 articles',.72),('Conditions','30 j · virement',.66),('Signature','détectée',.58)]
frows=''.join(f'<div style="display:grid;grid-template-columns:96px 1fr 44px;gap:10px;align-items:center;padding:9px 0;{"" if i==0 else "border-top:1px solid "+LINE}"><span style="font-size:12.5px;color:{MU}">{k}</span><strong style="font-weight:600;font-size:14.5px">{v}</strong><span style="display:flex;align-items:center;gap:5px;justify-content:flex-end">{sw(TX if c>=.8 else TP,6,3)}<span class="gm" style="font-size:11.5px;color:{TX if c>=.8 else TP}">{int(c*100)}</span></span></div>' for i,(k,v,c) in enumerate(fields))
screen('LC02-Lecture','Ce qui a été lu',shell(
top('#',chipc(f'{ic("eye",15)}Lecture hors ligne'),gbtn('image','Voir la photo'))+
f'<div style="position:absolute;left:0;right:0;top:110px;height:220px;overflow:hidden"><div style="position:absolute;left:70px;top:-40px;transform:rotate(-2deg)">{paper(250,0,False)}</div><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(244,244,242,0) 55%,#F4F4F2)"></div>'
+'<div style="position:absolute;left:60px;right:60px;top:120px;height:2px;background:linear-gradient(90deg,transparent,#111113,transparent);box-shadow:0 0 12px rgba(17,17,19,.35)"></div></div>'+
body(card(f'<div class="btw">{micro("10 champs lus")}{micro("confiance","")}</div>'+frows,pad='14px 18px',gap=2)+f'<div class="row" style="gap:10px"><a href="#" class="btn w" style="flex:1">Corriger</a><a href="#" class="btn k" style="flex:1.4">Continuer</a></div>',top_=330,bottom=30),None),G)
# Correspondance
checks=[('Existe déjà ?','aucune « F-47 » chez Antiquités Martin','non',TX),('Est-ce une copie ?','ni « copie » ni « duplicata »','non',TX),('Nouvelle version ?','aucune facture rectificative','non',TX),('Doublon possible ?','FAC-2026-0046 · même montant, même jour','à voir',TP)]
opts=[('Nouvelle réalité','créer FAC-2026-0047',True),('Copie de…','rattacher comme copie physique',False),('Nouvelle version de…','remplace sans effacer',False),('Même réalité','ajouter une manifestation',False)]
screen('LC03-Correspondance','Correspondance',shell(
top('#','',None)+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Est-ce bien<br>la F-47 ?</h1><span class="sub">Avant de créer, Empreinte vérifie ce qui existe déjà.</span></div>
{card("".join(f'<div class="btw" style="padding:9px 0;{"" if i==0 else "border-top:1px solid "+LINE}"><span class="col"><strong style="font-weight:600;font-size:14px">{a}</strong><span style="font-size:12px;color:{MU}">{b}</span></span><span class="pill" style="{"background:rgba(140,131,120,.16);color:#6B6258" if c=="à voir" else ""}">{c}</span></div>' for i,(a,b,c,_) in enumerate(checks)),pad="8px 18px",gap=0)}
{micro("Que faire ?")}
<div class="col" style="gap:8px">{''.join(f'<label class="g" style="border-radius:20px;padding:12px 16px;display:flex;align-items:center;gap:12px;box-shadow:none;{"border:1.5px solid #111113" if on else ""}"><span style="width:20px;height:20px;border-radius:10px;border:2px solid {TX if on else "rgba(17,17,19,.25)"};display:flex;align-items:center;justify-content:center">{"<i style=\'width:10px;height:10px;border-radius:5px;background:#111113\'></i>" if on else ""}</span><span class="col"><strong style="font-weight:600;font-size:14px">{a}</strong><span style="font-size:12px;color:{MU}">{b}</span></span></label>' for a,b,on in opts)}</div>''',top_=110,bottom=30),None),G)
# Identité
parts=[('FAC','genre · facture'),('2026','année'),('0047','n° de l’original')]
screen('LC04-Identite','Identité',shell(
top('#','',None)+
body(f'''<span class="micro">Identité proposée</span>
<div style="display:flex;gap:10px;align-items:flex-end">{''.join(f'<div class="col" style="gap:8px">{dot(a,42)}<span style="height:2px;background:{TX if i==2 else "rgba(17,17,19,.2)"}"></span><span style="font:500 11px Geist Mono;color:{TX if i==2 else MU}">{b}</span></div>' + ('' if i==2 else f'<span style="font:700 30px Geist;color:rgba(17,17,19,.25);padding-bottom:30px">·</span>') for i,(a,b) in enumerate(parts))}</div>
{card(f'<span style="font-size:14.5px;line-height:1.5">Le numéro <strong>47</strong> de l’original est libre : il est repris tel quel. Le papier et le système parleront la même langue.</span>')}
{card(f'{micro("Ce qui l’identifie")}'+"".join(f'<div class="btw sep" style="padding:8px 0"><span style="color:{MU};font-size:13.5px">{k}</span><strong style="font-weight:600;font-size:14px">{v}</strong></div>' for k,v in [('Genre','Document'),('Type','Facture de rachat'),('Référence d’origine','F-47 · Antiquités Martin'),('Original attendu','oui, papier')]),gap=0)}
{micro("Autres formats possibles")}
<div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill on">FAC-2026-0047</span><span class="pill">2026/AM/047</span><span class="pill">Séquentiel · FAC-2026-0213</span></div>
<a href="#" class="btn k" style="margin-top:auto">Valider l’identité</a>''',top_=110,bottom=30),None),G)
# Contexte (radial)
sat=[('user','Client','M. Dupont'),('users','Fournisseur','Antiquités Martin'),('folder','Projet','Boutique de Lyon'),('euro','Transaction','Rachat mobilier'),('cal','Période','Sept. 2026 · T3'),('flag','Événement','Salon de Lyon')]
nodes=''; lines=''
for i,(ic_,k,v) in enumerate(sat):
    a=-math.pi/2+i*math.pi/3; x=179+128*math.cos(a); y=170+128*math.sin(a)
    lines+=f'<line x1="179" y1="170" x2="{x:.0f}" y2="{y:.0f}" stroke="rgba(17,17,19,.14)" stroke-width="1.5" {"stroke-dasharray=\'4 4\'" if k=="Événement" else ""}/>'
    nodes+=f'<div class="g" style="position:absolute;left:{x-58:.0f}px;top:{y-28:.0f}px;width:116px;border-radius:18px;padding:8px 10px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;text-align:center;gap:1px"><span style="color:{MU}">{ic(ic_,16)}</span><span style="font:600 9.5px Geist Mono;letter-spacing:.06em;text-transform:uppercase;color:{MU}">{k}</span><span style="font:600 12px Geist;line-height:1.2">{v}</span></div>'
screen('LC05-Contexte','Contexte',shell(
top('#','',None)+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Dans quel contexte ?</h1><span class="sub">Chaque lien crée une relation, pas une simple étiquette.</span></div>
<div style="position:relative;height:350px"><svg width="358" height="350" style="position:absolute;inset:0" aria-hidden="true">{lines}</svg>{nodes}
<div style="position:absolute;left:129px;top:136px;width:100px;height:68px;border-radius:14px;background:#111113;color:#FFFFFF;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(17,17,19,.25)">{dot("F-47",22,"#FFFFFF")}<span style="font:500 10px Geist Mono;opacity:.7">1 250 €</span></div></div>
{note if False else ''}<div class="g" style="border-radius:20px;padding:12px 16px;display:flex;gap:10px;align-items:center;box-shadow:none">{ic("sparkle",18)}<span style="font-size:13.5px">« Salon de Lyon » est une suggestion : la facture date du jour du salon.</span></div>
<a href="#" class="btn k">Enregistrer le contexte</a>''',top_=110,bottom=30),None),G)
# Manifestations (comparaison par champ)
cols=['Original','Photo','OCR','Saisie']
rowsv=[('Numéro',['F-47','F-47','F-47','F-47']),('Date',['28/09','28/09','28/09','28/09']),('Total',['1 250','1 250','1 250','1 520']),('TVA',['208,33','208,33','208,33','208,33'])]
tbl=f'<div style="display:grid;grid-template-columns:62px repeat(4,minmax(0,1fr));gap:0;font:500 12px Geist Mono">'+'<span></span>'+''.join(f'<span style="text-align:center;padding:6px 0;font:600 10px Geist Mono;letter-spacing:.06em;text-transform:uppercase;color:{MU}">{c}</span>' for c in cols)+''.join(f'<span style="padding:9px 0;border-top:1px solid {LINE};color:{MU};font-family:Geist">{k}</span>'+''.join(f'<span style="padding:9px 0;border-top:1px solid {LINE};text-align:center;{"color:"+RED+";font-weight:700;background:rgba(181,67,47,.07)" if v=="1 520" else ""}">{v}</span>' for v in vals) for k,vals in rowsv)+'</div>'
strata=''.join(f'<div class="g" style="border-radius:18px;padding:11px 14px;display:flex;align-items:center;gap:12px;box-shadow:none;margin-left:{i*10}px;margin-right:{(3-i)*10}px"><span class="col" style="flex:1"><strong style="font-weight:600;font-size:14px">{a}</strong><span style="font-size:11.5px;color:{MU}">{b}</span></span><span style="width:70px">{bar(int(c*100),RED if r else TX,4)}</span><span class="gm" style="font-size:12px;width:30px;text-align:right;color:{RED if r else TX}">{str(c).replace(".",",")}</span></div>' for i,(a,b,c,r) in enumerate([('Original papier','physique · signé',1.0,False),('Photo F-47.jpg','sha256 9c1e…a40f',0.8,False),('Lecture OCR','Tesseract · 10 champs',0.6,False),('Saisie comptable','manuelle · 29/09',0.75,True)]))
screen('LC07-Manifestations','Manifestations',shell(
top('#',chipc('FAC-2026-0047'),gbtn('plus','Ajouter'))+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Une réalité,<br>quatre empreintes.</h1><span class="sub">Jamais confondues. Comparées champ par champ.</span></div>
<div class="col" style="gap:6px">{strata}</div>
{card(micro("Comparaison")+tbl,pad="12px 14px",gap=4)}''',top_=110,bottom=104),'layers'),G)
# Emplacement (classeur isométrique)
def binder():
    secs=''.join(f'<div style="position:absolute;left:{16+i*30}px;top:-14px;width:26px;height:18px;border-radius:5px 5px 0 0;background:{"#111113" if s=="B" else "#D9D6D0"};color:{"#FFFFFF" if s=="B" else MU};font:700 10px Geist Mono;display:flex;align-items:center;justify-content:center">{s}</div>' for i,s in enumerate('ABCDEF'))
    pockets=''.join(f'<div style="position:absolute;left:{8+k*14}px;top:22px;width:10px;height:104px;border-radius:2px;background:{"#B5432F" if k==13 else "rgba(17,17,19,.12)" if k<16 else "rgba(17,17,19,.04)"}"></div>' for k in range(18))
    return f'''<div style="position:relative;height:210px;perspective:900px"><div style="position:absolute;left:60px;top:40px;width:260px;height:150px;transform:rotateX(52deg) rotateZ(-28deg);transform-style:preserve-3d">
<div style="position:absolute;inset:0;border-radius:10px;background:#E9E6E0;border:1px solid rgba(17,17,19,.1);box-shadow:0 30px 40px rgba(17,17,19,.15)">{secs}{pockets}</div></div>
<span class="g" style="position:absolute;right:6px;top:18px;border-radius:14px;padding:6px 10px;box-shadow:none;font:600 12px Geist">Pochette <span class="dot" style="font-size:16px;color:{RED}">14</span></span>
<span style="position:absolute;left:6px;bottom:6px;font:600 10px Geist Mono;letter-spacing:.08em;color:{MU}">CLASSEUR 02 · SECTION B</span></div>'''
screen('LC08-Emplacement','Emplacement',shell(
top('#',chipc('Où est-elle ?'),gbtn('pin','Déplacer'))+
body(f'''{binder()}
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">{''.join(f'<div class="g" style="border-radius:18px;padding:12px;box-shadow:none;display:flex;flex-direction:column;gap:4px"><span style="color:{c}">{ic(i,18)}</span><strong style="font-size:13px">{t}</strong><span style="font-size:11px;color:{MU};line-height:1.3">{s}</span></div>' for i,t,s,c in [('paper','Original','02 › B › 14 · présent',TX),('copy','Copie','Cabinet Leroy',MU),('cloud','Archive','coffre local chiffré',MU)])}</div>
{card(micro("Déplacements")+"".join(f'<div class="row sep" style="padding:9px 0;gap:12px"><span class="gm" style="font-size:11.5px;color:{MU};width:38px">{d}</span><span style="flex:1;font-size:13.5px">{t}</span><span style="font-size:12px;color:{MU}">{w}</span></div>' for d,t,w in [('30/09','Rangée en Pochette 14','Olivier'),('29/09','Sur le bureau, à vérifier',''),('28/09','Reçue par courrier','')]),gap=0)}''',top_=110),'layers'),G)
# État
states=[('Reçue','28/09',True),('Vérifiée','29/09',True),('Payée','',False),('Archivée','',False)]
track=''.join(f'<div class="col" style="align-items:center;gap:6px;flex:1"><span style="width:{26 if i==1 else 18}px;height:{26 if i==1 else 18}px;border-radius:50%;background:{"#111113" if d else "#FFFFFF"};border:2px solid {"#111113" if d else "rgba(17,17,19,.2)"};box-shadow:{"0 0 0 6px rgba(17,17,19,.08)" if i==1 else "none"}"></span><span style="font:600 12.5px Geist;color:{TX if d else MU}">{n}</span><span class="gm" style="font-size:10.5px;color:{MU}">{w or "—"}</span></div>' for i,(n,w,d) in enumerate(states))
screen('LC09-Etat','État',shell(
top('#',chipc('FAC-2026-0047'),None)+
body(f'''<div class="col" style="gap:4px"><span class="micro">État actuel</span><h1 class="h1" style="font-size:40px">Vérifiée</h1><span class="sub">par Olivier · 29/09 à 10:20</span></div>
<div class="g" style="padding:22px 12px;position:relative"><span style="position:absolute;left:14%;right:14%;top:35px;height:2px;background:linear-gradient(90deg,#111113 34%,rgba(17,17,19,.15) 34%)"></span><div class="row" style="align-items:flex-start;position:relative">{track}</div></div>
{micro("Possible depuis « Vérifiée »")}
<div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill on">Payée</span><span class="pill">Contestée</span><span class="pill">Annulée</span><span class="pill">Archivée</span></div>
<div class="g" style="border-radius:20px;padding:12px 16px;display:flex;gap:10px;box-shadow:none">{ic("alert",18)}<span style="font-size:13.5px;line-height:1.45">Un passage inhabituel reste possible si le réel l’impose. Il sera signalé pour vérification.</span></div>
<a href="#" class="btn k" style="margin-top:auto">Marquer comme payée</a>''',top_=110,bottom=30),None),G)
# Preuves
pr=[('image','Photo originale','F-47.jpg',True),('eye','Lecture OCR','10 champs',True),('sig','Signature','sur l’original',True),('paper','Pièce comptable','écriture 2026-09-112',True),('bank','Relevé bancaire','aucune ligne',False),('hand','Validation humaine','Olivier · 29/09',True)]
screen('LC10-Preuves','Preuves',shell(
top('#',chipc('FAC-2026-0047'),gbtn('plus','Ajouter une preuve'))+
body(f'''<div class="btw" style="align-items:flex-end"><div class="col" style="gap:4px"><span class="micro">Preuves réunies</span><h1 class="h1">Ce qui atteste<br>la réalité.</h1></div><span>{dot("4",56)}<span class="dot" style="font-size:28px;color:rgba(17,17,19,.25)">/6</span></span></div>
<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">{''.join(f'<div class="g" style="border-radius:22px;padding:14px;box-shadow:none;display:flex;flex-direction:column;gap:10px;{"border:1.5px dashed rgba(181,67,47,.5);background:rgba(255,255,255,.4)" if not ok else ""}"><span class="btw">{lead(i,TX if ok else RED,SOFT if ok else "rgba(181,67,47,.08)")}<span style="width:22px;height:22px;border-radius:11px;background:{"#111113" if ok else "transparent"};color:#FFFFFF;display:flex;align-items:center;justify-content:center">{ic("check",13,"#FFFFFF",2.4) if ok else ""}</span></span><span class="col"><strong style="font-size:14px;font-weight:600">{t}</strong><span style="font-size:12px;color:{MU if ok else RED}">{s}</span></span></div>' for i,t,s,ok in pr)}</div>
<a href="#" class="btn k">Importer le relevé bancaire</a>''',top_=110),'layers'),G)
# Relations (graphe)
rel=[('cart','Commande','BC-2026-0019',False),('users','Fournisseur','Antiquités Martin',False),('user','Client','M. Dupont',False),('folder','Projet','Boutique de Lyon',False),('box','Stock','STK-0412',False),('bank','Paiement','à relier',True),('flag','Mission','—',None)]
nodes='';lines=''
for i,(ic_,k,v,miss) in enumerate(rel):
    a=-math.pi/2+i*2*math.pi/7; x=179+132*math.cos(a); y=175+132*math.sin(a)
    st='stroke="#B5432F" stroke-dasharray="5 5"' if miss else ('stroke="rgba(17,17,19,.1)" stroke-dasharray="2 5"' if miss is None else 'stroke="rgba(17,17,19,.22)"')
    lines+=f'<line x1="179" y1="175" x2="{x:.0f}" y2="{y:.0f}" {st} stroke-width="1.5"/>'
    nodes+=f'<div class="g" style="position:absolute;left:{x-52:.0f}px;top:{y-24:.0f}px;width:104px;border-radius:16px;padding:7px 8px;box-sizing:border-box;text-align:center;box-shadow:none;{"border:1.5px solid rgba(181,67,47,.55)" if miss else ""}{"opacity:.5" if miss is None else ""}"><span style="font:600 9.5px Geist Mono;letter-spacing:.06em;text-transform:uppercase;color:{RED if miss else MU};display:block">{k}</span><span style="font:600 12px Geist">{v}</span></div>'
screen('LC11-Relations','Relations',shell(
top('#',chipc('6 relations · 1 manque'),gbtn('plus','Relier'))+
body(f'''<div style="position:relative;height:360px;margin-top:10px"><svg width="358" height="360" style="position:absolute;inset:0" aria-hidden="true">{lines}</svg>{nodes}
<div style="position:absolute;left:129px;top:141px;width:100px;height:68px;border-radius:14px;background:#111113;color:#FFFFFF;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(17,17,19,.25)">{dot("F-47",22,"#FFFFFF")}<span style="font:500 10px Geist Mono;opacity:.7">facture</span></div></div>
<div class="g" style="border-radius:22px;padding:14px 16px;display:flex;align-items:center;gap:12px;border-color:rgba(181,67,47,.3)"><span class="col" style="flex:1"><strong style="font-size:14.5px">Paiement non relié</strong><span style="font-size:12.5px;color:{MU}">La facture est marquée payée sans paiement lié.</span></span><a href="#" class="btn k" style="height:42px;padding:0 16px;font-size:13.5px">Relier</a></div>''',top_=104),'layers'),G)
# Historique (chaîne)
ev=[('11','preuve','validation humaine · Olivier','30/09 18:02','a40f'),('10','emplacement','→ 02 › B › 14','30/09 17:55','71c2'),('9','marquage','étiquette QR collée','30/09 17:54','0be9'),('8','état','reçue → vérifiée','29/09 10:20','5d13'),('7','manifestation','saisie · 1 520 €','29/09 09:41','e88a'),('1','intégration','FAC-2026-0047 créée','28/09 16:00','3b6e')]
chain=''.join(f'<div style="position:relative;display:flex;gap:12px;align-items:stretch"><div class="col" style="align-items:center;width:30px"><span style="width:30px;height:30px;border-radius:9px;background:{"#111113" if i==0 else "#FFFFFF"};color:{"#FFFFFF" if i==0 else TX};border:1px solid rgba(17,17,19,.15);display:flex;align-items:center;justify-content:center;font:600 11px Geist Mono">{n}</span>{"" if i==len(ev)-1 else "<span style=\'flex:1;width:2px;background:repeating-linear-gradient(rgba(17,17,19,.25) 0 3px,transparent 3px 6px);min-height:14px\'></span>"}</div><div class="g" style="flex:1;border-radius:16px;padding:9px 12px;margin-bottom:8px;box-shadow:none"><div class="btw"><strong style="font-size:13.5px;font-weight:600">{t}</strong><span class="gm" style="font-size:10.5px;color:{MU}">{w}</span></div><div class="btw"><span style="font-size:12px;color:{MU}">{d}</span><span class="gm" style="font-size:10px;color:rgba(17,17,19,.35)">#{h}…</span></div></div></div>' for i,(n,t,d,w,h) in enumerate(ev))
screen('LC12-Historique','Historique',shell(
top('#',chipc(f'{sw(GRN,7,4)}Chaîne intacte'),None)+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Rien ne se réécrit<br>en silence.</h1><span class="sub">Chaque événement est scellé par l’empreinte du précédent.</span></div><div class="col" style="margin-top:6px">{chain}</div>''',top_=110,bottom=30),None),G)
# Lacunes
qs=[('Ce qui manque','la ligne du relevé bancaire',TP),('En double','possible : FAC-2026-0046',TP),('Non relié','le paiement',TP),('Mal identifié','montant 1 250 ou 1 520',RED),('Risque de perte','aucun : rangée et photographiée',GRN),('Automatisable','rapprochement bancaire',SL),('Reste humain','choisir le montant, payer',TX),('Reste physique','l’original signé, 10 ans',TX),('Numérique','identité, historique, recherche',SL),('Organisation','déjà rangée selon le plan D',GRN)]
screen('LC13-Lacunes','Lacunes',shell(
top('#',chipc('FAC-2026-0047'),None)+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Dix questions<br>pour chaque réalité.</h1></div>
<div class="row" style="gap:4px">{''.join(f'<span style="flex:1;height:6px;border-radius:3px;background:{c}"></span>' for _,_,c in qs)}</div>
{card("".join(f'<div class="row" style="padding:9px 0;gap:12px;{"" if i==0 else "border-top:1px solid "+LINE}">{sw(c,8,4)}<span class="col" style="flex:1"><strong style="font-weight:600;font-size:13.5px">{q}</strong><span style="font-size:12.5px;color:{MU}">{a}</span></span></div>' for i,(q,a,c) in enumerate(qs)),pad="6px 18px",gap=0)}''',top_=110,bottom=30),None),G)
