from lum import *
G='verifier'
# Vérifier
screen('LV01-Verifier','Vérifier',shell(
body(f'''<div class="btw" style="align-items:flex-end"><div class="col" style="gap:4px"><span class="micro">À vérifier</span><h1 class="h1">Le système signale.<br>Vous décidez.</h1></div>{dot("4",72)}</div>
<div class="row" style="gap:3px;height:8px">{"".join(f'<span style="flex:{f};height:8px;border-radius:4px;background:{c}"></span>' for f,c in [(1,RED),(3,TP),(5,'rgba(17,17,19,.2)')])}</div>
<div class="row" style="gap:14px;font-size:12px;color:{MU}"><span class="row" style="gap:6px">{sw(RED,8,4)}1 critique</span><span class="row" style="gap:6px">{sw(TP,8,4)}3 attention</span><span class="row" style="gap:6px">{sw("rgba(17,17,19,.2)",8,4)}5 infos</span></div>
<a href="#" class="g" style="padding:16px;display:flex;flex-direction:column;gap:10px;text-decoration:none;color:{TX};border-color:rgba(181,67,47,.35)"><span class="btw"><strong style="font-size:15px">Montants différents</strong><span class="gm" style="font-size:11px;color:{MU}">FAC-2026-0047</span></span><span class="row" style="gap:10px">{dot("1250",30)}<span style="font:600 18px Geist;color:{MU}">≠</span>{dot("1520",30,RED)}<span style="margin-left:auto">{ic("fwd",18)}</span></span></a>
{card("".join(item(a,b,ic("fwd",16),lead=sw(c,8,4),first=(k==0)) for k,(a,b,c) in enumerate([('Paiement sans relevé','PAY-2026-0001 · 1 250 €',TP),('Doublon possible','FAC-2026-0046 et 0047',TP),('Original introuvable','LIV-2026-0031 · Concordance',TP),('Nouvelle réalité à intégrer','document en Pochette 12','rgba(17,17,19,.25)'),('Passage inhabituel','FAC-2026-0039','rgba(17,17,19,.25)')])),pad="6px 18px",gap=0)}''',top_=60),'shield'),G)
# Incohérence
screen('LV02-Incoherence','Montants différents',shell(
top('#',chipc(f'{sw(RED,7,4)}Critique'),None)+
body(f'''<div class="col" style="gap:4px"><span class="micro">FAC-2026-0047 · total TTC</span><h1 class="h1">Le papier dit une chose,<br>la saisie une autre.</h1></div>
<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
<div class="g" style="padding:16px;display:flex;flex-direction:column;gap:6px">{micro("Original papier")}{dot("1250",38)}<span class="gm" style="font-size:11px;color:{MU}">confiance 1,00</span></div>
<div class="g" style="padding:16px;display:flex;flex-direction:column;gap:6px;border-color:rgba(181,67,47,.4)">{micro("Saisie",RED)}{dot("1520",38,RED)}<span class="gm" style="font-size:11px;color:{MU}">confiance 0,75</span></div></div>
<div class="g" style="padding:12px;display:flex;flex-direction:column;gap:8px;box-shadow:none"><div style="background:#FFFEFB;border:1px solid #EFEBE4;border-radius:6px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;font:11px Literata;color:#4A4540"><span style="display:flex;justify-content:space-between;color:#8A8178"><span>TVA 20 %</span><span>208,33</span></span><span style="display:flex;justify-content:space-between;align-items:center;font-weight:700;color:#1F1A16;font-size:13px"><span>Total TTC</span><span style="border:2px solid #111113;border-radius:5px;padding:1px 6px">1 250,00 €</span></span></div><span class="micro">extrait de F-47.jpg</span></div>
{card("".join(f'<div class="btw" style="padding:8px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="font-size:13px;color:{MU}">{a}</span><span style="font-weight:600;font-size:13.5px">{b}</span></div>' for k,(a,b) in enumerate([('Lecture OCR','1 250 € · 0,60'),('Attributs saisis','1 250 €'),('Hypothèse','chiffres inversés 25 ↔ 52')])),pad="6px 18px",gap=0)}
<div class="row" style="gap:10px;margin-top:auto"><a href="#" class="btn k" style="flex:1.2">Garder 1 250 €</a><a href="#" class="btn w" style="flex:1">Garder 1 520 €</a></div>
<span style="text-align:center;font-size:12px;color:{MU}">L’ancienne valeur restera dans l’historique.</span>''',top_=110,bottom=26),None),G)
# Rapprochement
cand=[('VIR ANTIQUITES MARTIN F47','30/09 · −1 250,00',98),('VIR A MARTIN','26/09 · −1 520,00',41),('CB BRICO LYON','29/09 · −1 250,00',22)]
screen('LV03-Rapprochement','Rapprochement',shell(
top('#',chipc('Rapprochement'),None)+
body(f'''<div class="g" style="padding:16px;display:flex;flex-direction:column;gap:6px">{micro("Paiement sans justificatif")}<span class="btw">{dot("PAY-0001",26)}<span class="gm" style="font-size:15px;font-weight:600">1 250,00 €</span></span><span style="font-size:12.5px;color:{MU}">virement · facture FAC-2026-0047</span></div>
<span class="micro">Relevé OFX importé · 30/09 · 3 lignes candidates</span>
{"".join(f'<div class="g" style="padding:14px 16px;display:flex;flex-direction:column;gap:8px;{"border:1.5px solid #111113" if k==0 else "box-shadow:none"}"><span class="btw"><span class="col"><strong class="gm" style="font-size:12.5px">{a}</strong><span style="font-size:12px;color:{MU}">{b}</span></span>{dot(str(p),28,TX if k==0 else "rgba(17,17,19,.35)")}</span>{bar(p,TX if k==0 else "rgba(17,17,19,.3)",4)}</div>' for k,(a,b,p) in enumerate(cand))}
<a href="#" class="btn k" style="margin-top:auto">Associer la première ligne</a>''',top_=110,bottom=30),None),G)
# Doublon
def mini(n,d):
    return f'<div class="g" style="padding:12px;display:flex;flex-direction:column;gap:10px;box-shadow:none"><div style="height:130px;border-radius:6px;background:#FFFEFB;border:1px solid #EFEBE4;padding:10px;box-sizing:border-box;font:9px Literata;color:#4A4540;display:flex;flex-direction:column;gap:4px"><strong style="font-size:9.5px">ANTIQUITÉS MARTIN</strong><span>Facture n° {n}</span><span>{d}</span><span style="margin-top:auto;font-weight:600">1 250,00 €</span></div>{dot(n,22)}<span class="gm" style="font-size:10.5px;color:{MU}">Pochette 14</span></div>'
cmp=[('Montant','=',True),('Émetteur','=',True),('Numéro','≠',False),('Date','≠',False),('Lignes','≠',False)]
screen('LV04-Doublon','Doublon possible',shell(
top('#',chipc('Doublon possible'),None)+
body(f'''<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">{mini("F-46","27/09/2026")}{mini("F-47","28/09/2026")}</div>
{card("".join(f'<div class="btw" style="padding:8px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="font-size:13.5px">{a}</span><span class="pill" style="{"background:rgba(140,131,120,.18)" if s else ""}">{b} {"identique" if s else "différent"}</span></div>' for k,(a,b,s) in enumerate(cmp)),pad="6px 18px",gap=0)}
<div class="col" style="gap:8px">{"".join(f'<div class="g" style="border-radius:18px;padding:12px 16px;display:flex;align-items:center;gap:12px;box-shadow:none;{"border:1.5px solid #111113" if k==0 else ""}"><span style="width:18px;height:18px;border-radius:9px;border:2px solid {TX if k==0 else "rgba(17,17,19,.25)"};display:flex;align-items:center;justify-content:center">{"<i style=\'width:8px;height:8px;border-radius:4px;background:#111113\'></i>" if k==0 else ""}</span><span style="font-weight:600;font-size:13.5px">{t}</span></div>' for k,t in enumerate(["Deux réalités distinctes","L’une est la copie de l’autre","Facture rectificative","Vrai doublon : fusionner"]))}</div>''',top_=110,bottom=30),None),G)
# Introuvable
places=[('Étagère 1 › rang 3','rang voisin, même collection',62),('Bureau','dernier lieu d’étude de Paul',24),('Carton « dons »','préparé le 11/09',14)]
screen('LV05-Introuvable','Original introuvable',shell(
top('#',chipc(f'{sw(TP,7,4)}Rupture de traçabilité'),None)+
body(f'''<div class="row" style="gap:16px"><div style="width:70px;height:96px;border-radius:4px 8px 8px 4px;background:linear-gradient(90deg,#3B3530 0 10px,#57504A 10px);box-shadow:0 12px 24px rgba(17,17,19,.2);flex:none;position:relative"><span style="position:absolute;left:18px;top:14px;right:8px;height:2px;background:rgba(255,255,255,.35)"></span></div><span class="col" style="gap:4px"><span class="micro">LIV-2026-0031</span><h1 class="h1" style="font-size:24px">Concordance Strong<br>exemplaire n° 31</h1></span></div>
{card("".join(f'<div class="btw" style="padding:8px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="font-size:13px;color:{MU}">{a}</span><span style="font-weight:600;font-size:13.5px;text-align:right">{b}</span></div>' for k,(a,b) in enumerate([('Attendu','Étagère 1 › rang 2'),('Vu la dernière fois','12/09 · inventaire'),('Dernier détenteur','Paul M. · rendu le 10/09')])),pad="6px 18px",gap=0)}
{micro("Où chercher d’abord")}
{"".join(f'<div class="g" style="padding:12px 16px;display:flex;align-items:center;gap:12px;box-shadow:none"><span class="dot" style="font-size:22px;width:24px">{k+1}</span><span class="col" style="flex:1;gap:4px"><strong style="font-size:14px;font-weight:600">{a}</strong><span style="font-size:12px;color:{MU}">{b}</span>{bar(p,TX,3)}</span><span class="gm" style="font-size:12px">{p} %</span></div>' for k,(a,b,p) in enumerate(places))}
<div class="row" style="gap:10px;margin-top:auto"><a href="#" class="btn k" style="flex:1.2">Retrouvé</a><a href="#" class="btn w" style="flex:1">Déclarer perdu</a></div>''',top_=110,bottom=30),None),G)
# Nouvelle réalité
screen('LV06-NouvelleRealite','Nouvelle réalité',shell(
top('#',chipc('Trouvé en Pochette 12'),None)+
f'''<div style="position:absolute;left:70px;top:120px;transform:rotate(2deg);width:250px;height:250px;background:#FFFEFB;border-radius:3px;box-shadow:0 22px 40px rgba(17,17,19,.16);padding:18px;box-sizing:border-box;display:flex;flex-direction:column;gap:7px;font:10px/1.45 Literata;color:#3A3530"><strong style="font:700 12px Literata;color:#1F1A16">BON DE LIVRAISON</strong><span>N° BL-2209 · Imprimerie Biblique</span><span style="height:1px;background:#E2DCD2;margin:4px 0"></span><span>400 Bibles Segond 21</span><span>4 palettes · dépôt de Lyon</span><span style="margin-top:auto">Reçu le 22/09/2026</span><span style="font:600 20px Caveat;color:#2B3E8C">O. S.</span></div>'''+
body(f'''<div class="g" style="padding:16px;display:flex;flex-direction:column;gap:8px">{micro("Sans enregistrement numérique · Empreinte propose")}{dot("DOC·2026·0213",28)}<span style="font-size:13px;color:{MU}">Relier à la mission « 1000 Bibles » comme preuve de réception</span></div>
<div class="row" style="gap:6px"><span class="pill">MIS-2026-0002</span><span class="pill">preuve de réception</span></div>
<a href="#" class="btn k" style="margin-top:auto">Intégrer</a>''',top_=410,bottom=30),None),G)
# Transition forcée
screen('LV07-TransitionForcee','Passage inhabituel',shell(
top('#',chipc('FAC-2026-0039'),None)+
body(f'''<div class="col" style="gap:6px"><span class="micro">Passage inhabituel · 25/09 · Olivier</span><h1 class="h1">Une étape a été sautée.</h1></div>
<div class="g" style="padding:30px 16px 22px;position:relative">
<svg width="326" height="60" style="position:absolute;left:16px;top:6px" aria-hidden="true"><path d="M30 46 C 90 0, 150 0, 210 46" fill="none" stroke="#8C8378" stroke-width="2" stroke-dasharray="5 5"/><path d="M204 38 l6 8 -9 2" fill="none" stroke="#8C8378" stroke-width="2"/></svg>
<div class="row" style="justify-content:space-between;position:relative;margin-top:24px">{"".join(f'<span class="col" style="align-items:center;gap:6px;width:70px"><span style="width:18px;height:18px;border-radius:9px;background:{c};border:2px solid {b}"></span><span style="font:600 12px Geist;color:{t}">{n}</span></span>' for n,c,b,t in [('Reçue','#111113','#111113',TX),('Vérifiée','transparent','rgba(17,17,19,.25)',MU),('Payée','#8C8378','#8C8378',TX),('Archivée','transparent','rgba(17,17,19,.15)',MU)])}</div></div>
<div class="g" style="padding:16px;display:flex;flex-direction:column;gap:6px;box-shadow:none">{micro("Note laissée")}<span style="font:400 16px/1.5 Literata,serif">« Payée en espèces au salon, vérifiée sur place. »</span></div>
<div class="row" style="gap:10px;margin-top:auto"><a href="#" class="btn k" style="flex:1">Confirmer</a><a href="#" class="btn w" style="flex:1.2">Revenir à « Reçue »</a></div>''',top_=110,bottom=30),None),G)
# Journal altéré
blocks=[('212','5d13','ok'),('213','e88a','ok'),('214','0be9','ko'),('215','71c2','ok')]
screen('LV08-JournalAltere','Intégrité',shell(
top('#',chipc(f'{sw(RED,7,4)}Intégrité'),None)+
body(f'''<div class="col" style="gap:6px"><h1 class="h1">Le registre a été<br>modifié hors d’Empreinte.</h1><span class="sub">À partir de l’événement n° 214 · 14/09</span></div>
<div class="row" style="gap:0;justify-content:center;margin:10px 0">{"".join(f'<div class="g" style="width:66px;padding:10px 6px;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:none;{"border:1.5px solid "+RED if s=="ko" else ""}"><span class="dot" style="font-size:18px;color:{RED if s=="ko" else TX}">{n}</span><span class="gm" style="font-size:9.5px;color:{MU}">{h}</span></div>'+("" if k==3 else f'<span style="width:16px;height:2px;background:{RED if s=="ko" or blocks[k+1][2]=="ko" else "#111113"};{"background:repeating-linear-gradient(90deg,"+RED+" 0 3px,transparent 3px 6px)" if s=="ko" else ""}"></span>') for k,(n,h,s) in enumerate(blocks))}</div>
{card("".join(f'<div class="btw" style="padding:9px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="font-size:13px;color:{MU}">{a}</span><span class="gm" style="font-size:12.5px;font-weight:600;color:{c}">{b}</span></div>' for k,(a,b,c) in enumerate([('Empreinte attendue','5d13…e88a',TX),('Empreinte trouvée','0be9…71c2',RED),('Réalité touchée','FAC-2026-0021',TX),('Sauvegarde intacte','01/10 · 06:00',GRN)])),pad="6px 18px",gap=0)}
<div class="row" style="gap:10px;margin-top:auto"><a href="#" class="btn w" style="flex:1">Comparer</a><a href="#" class="btn k" style="flex:1.2">{ic("refresh",18,"#FFFFFF")}Restaurer</a></div>''',top_=110,bottom=30),None),G)
# Machine ou humain
auto=['Rapprocher paiements et relevés','Proposer un emplacement','Imprimer les étiquettes','Rappeler les garanties','Lire les montants (OCR)']
hum=['Choisir la bonne valeur','Décider d’un paiement','Signer, remettre un original','Lire, méditer, étudier']
screen('LV09-Humain','Machine ou humain',shell(
top('#',chipc('Machine ou humain ?'),None)+
body(f'''<h1 class="h1" style="font-size:27px">Le numérique ne remplace pas ce qui doit être vécu.</h1>
{card(f'<div class="btw">{micro("Peut être automatisé")}{ic("sparkle",16)}</div>'+"".join(f'<div class="btw" style="padding:8px 0;border-top:1px solid {LINE}"><span style="font-size:13.5px">{a}</span>{tog(True)}</div>' for a in auto),gap=2)}
<div class="g" style="padding:16px 18px;display:flex;flex-direction:column;gap:2px;background:#111113;border-color:#111113;color:#FFFFFF"><div class="btw"><span class="micro" style="color:rgba(255,255,255,.6)">Reste humain</span>{ic("hand",16,"#FFFFFF")}</div>{"".join(f'<div style="padding:9px 0;border-top:1px solid rgba(255,255,255,.12);font-size:13.5px">{a}</div>' for a in hum)}</div>''',top_=110,bottom=30),None),G)
# Rapport
d=[('Travail',96),('Maison',91),('Bible & étude',99),('Missions',88),('Apprentissage',94)]
screen('LV10-Rapport','Cohérence',shell(
top('#',chipc('Rapport de cohérence'),None)+
body(f'''<div class="col" style="gap:2px"><span class="micro">Ensemble des réalités</span><span>{dot("94",110)}{dot("%",44,MU)}</span><span class="sub">identifiées, reliées, prouvées et localisées</span></div>
{card("".join(f'<div class="col" style="gap:6px;padding:8px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span class="btw"><span style="font-weight:600;font-size:13.5px">{n}</span><span class="gm" style="font-size:12px">{v} %</span></span>{bar(v,TX if v>=90 else TP,4)}</div>' for k,(n,v) in enumerate(d)),pad="6px 18px",gap=0)}
<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">{"".join(f'<div class="g" style="border-radius:18px;padding:10px;display:flex;flex-direction:column;gap:4px;box-shadow:none">{dot(v,24)}<span style="font-size:10.5px;color:{MU};line-height:1.2">{t}</span></div>' for v,t in [('12','sans emplacement'),('31','sans preuve'),('8','non reliées'),('2','doublons')])}</div>''',top_=110,bottom=104),'shield'),G)
