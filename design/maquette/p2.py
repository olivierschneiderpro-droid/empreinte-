from base import *
P='cycle'
# C01 Photo
screen('C01-Photo.dc.html','Photographier l’original',f'''
<div style="flex:1;background:#141A18;color:#FFFFFF;display:flex;flex-direction:column;padding:52px 20px 0;gap:14px">
<div class="between"><a class="iconbtn" href="F06-Capturer.dc.html" aria-label="Retour" style="background:#262E2B;border-color:#3A4440;color:#FFFFFF">{ic("back")}</a><span style="font-weight:600">Facture · photo 1/2</span><button class="iconbtn" type="button" aria-label="Flash" style="background:#262E2B;border-color:#3A4440;color:#FFFFFF">{ic("flash")}</button></div>
<div style="position:relative;height:420px;border-radius:16px;background:#2A322F;display:flex;align-items:center;justify-content:center">
<div style="width:236px;height:320px;background:#F7F5EE;border-radius:4px;transform:rotate(-2deg);padding:18px;box-sizing:border-box;display:flex;flex-direction:column;gap:8px;color:#30302C;font-size:10px;outline:2px solid #6FCF97;outline-offset:6px">
<div class="between"><strong style="font-size:13px">FACTURE DE RACHAT</strong><span>N° F-47</span></div>
<span>Antiquités Martin · SIRET 812 345 678</span><span>Client : M. Dupont · 28/09/2026</span>
<div style="border-top:1px solid #CFCBBE;border-bottom:1px solid #CFCBBE;padding:6px 0;display:flex;flex-direction:column;gap:3px"><span>Commode Louis-Philippe …… 640,00</span><span>Lot de 6 chaises …… 401,67</span><span>TVA 20 % …… 208,33</span></div>
<div class="between"><span>Total TTC</span><strong style="font-size:12px">1 250,00 €</strong></div>
<span>Paiement à 30 jours · virement</span><span style="margin-top:auto;font-style:italic">Signature : ✓</span>
</div>
{chip(ic("check","icon ic16")+"Bords détectés · net","phy","position:absolute;top:12px;left:12px;background:#1F6B4F;color:#FFFFFF")}
</div>
<div class="between" style="padding:0 24px"><span class="muted" style="color:#C9D2CE">Recto</span><a href="C02-Lecture.dc.html" aria-label="Prendre la photo" style="width:72px;height:72px;border-radius:36px;border:4px solid #FFFFFF;display:flex;align-items:center;justify-content:center"><span style="width:56px;height:56px;border-radius:28px;background:#FFFFFF"></span></a><span class="muted" style="color:#C9D2CE">Verso</span></div>
</div>''',P)
# C02 Lecture OCR
f=[('Émetteur','Antiquités Martin',0.92),('Client','M. Dupont',0.88),('Numéro','F-47',0.97),('Date','28/09/2026',0.95),('Montant HT','1 041,67 €',0.81),('TVA 20 %','208,33 €',0.84),('Total TTC','1 250,00 €',0.90),('Lignes','2 articles',0.72),('Conditions','30 jours · virement',0.66),('Signature','détectée',0.58)]
rows=''.join(f'<div class="between" style="padding:7px 0;border-top:1px solid #EEF0EC"><span class="muted" style="width:96px;flex:none">{k}</span><strong style="flex:1">{v}</strong><span style="width:62px;display:flex;flex-direction:column;gap:3px;align-items:flex-end"><span class="mono small" style="color:{PHY if c>=.8 else WARN}">{int(c*100)} %</span>{bar(int(c*100),PHY if c>=.8 else WARN)}</span></div>' for k,v,c in f)
screen('C02-Lecture.dc.html','Lecture de la facture',top('Ce qui a été lu','C01-Photo.dc.html',ibtn('image','Voir la photo'))+scroll(
note('Lu par OCR (Tesseract, hors ligne). Les champs en orange demandent votre œil.','num','eye'),
f'<div class="card" style="gap:0">{rows}</div>',
btns(btn('Corriger','line',style='flex:1'),btn('Continuer','ink',href='C03-Correspondance.dc.html',style='flex:1')),
),P)
# C03 Correspondance
screen('C03-Correspondance.dc.html','Correspondance',top('Est-ce bien la F-47 ?','C02-Lecture.dc.html')+scroll(
heading('Correspondance',sub='Avant de créer, Empreinte vérifie ce qui existe déjà.'),
lst(li('Existe-t-elle déjà ?','Aucune réalité « F-47 » chez Antiquités Martin',chip('non','phy'),icon='search',ic_color=PHY),
    li('Est-ce une copie ?','Pas de mention « copie » ni « duplicata »',chip('non','phy'),icon='copy',ic_color=PHY),
    li('Nouvelle version ?','Aucune facture rectificative liée',chip('non','phy'),icon='refresh',ic_color=PHY),
    li('Doublon possible ?','Même montant le 28/09 : <span class="mono">FAC-2026-0046</span> (1 250 €)',chip('à voir','warn'),icon='alert',ic_color=WARN,href='V04-Doublon.dc.html')),
card(ctitle('Que faire ?')+'<div class="list">'+''.join(f'<label class="li" style="cursor:pointer"><input type="radio" name="corr" {"checked" if i==0 else ""} style="width:20px;height:20px;accent-color:#18211F"><span class="col"><strong style="font-weight:600">{a}</strong><span class="muted">{b}</span></span></label>' for i,(a,b) in enumerate([('Nouvelle réalité','Créer FAC-2026-0047'),('Copie de…','Rattacher comme copie physique'),('Nouvelle version de…','Remplace sans effacer l’ancienne'),('Même réalité','Ajouter une manifestation')]))+'</div>'),
btn('Continuer','ink',href='C04-Identite.dc.html'),
),P)
# C04 Identité
screen('C04-Identite.dc.html','Identité',top('Identité','C03-Correspondance.dc.html')+scroll(
card(f'<span class="eyebrow">Identifiant système proposé</span><span class="mono" style="font-size:32px">FAC-2026-0047</span><span class="muted">FAC = facture · 2026 = année · 0047 = n° repris de l’original, car il est libre</span>'),
card(ctitle('Ce qui l’identifie')+'<div class="list">'+kv('Genre','Document')+kv('Type','Facture de rachat')+kv('Référence d’origine','F-47 · Antiquités Martin')+kv('Sens','Achat')+kv('Original attendu','Oui, papier')+'</div>'),
card(ctitle('Autres formats possibles')+chips(chip('FAC-2026-0047','ink'),chip('2026/AM/047','ghost'),chip('A-047','ghost'),chip('Séquentiel : FAC-2026-0213','ghost'))),
note('L’identifiant est la langue commune du papier et du système : il sera inscrit sur l’original.','phy','link'),
btn('Valider l’identité','ink',href='C05-Contexte.dc.html'),
),P)
# C05 Contexte
screen('C05-Contexte.dc.html','Contexte',top('Contexte','C04-Identite.dc.html')+scroll(
heading('Dans quel contexte ?',sub='Chaque champ crée une relation, pas seulement une étiquette.'),
'<div class="card">'+''.join(f'<div class="li"><span class="ibox" style="background:#EEF0EC">{ic(i)}</span><span class="col"><span class="muted small">{k}</span><strong style="font-weight:600">{v}</strong></span>{x}</div>' for i,k,v,x in [('user','Client','M. Dupont · PER-0012',chip('existant','phy')),('users','Fournisseur','Antiquités Martin · PER-0031',chip('existant','phy')),('folder','Projet','Boutique de Lyon · PRJ-2026-0003',''),('euro','Transaction','Rachat de mobilier',''),('calendar','Période','Septembre 2026 · T3',''),('flag','Événement','Salon des antiquaires de Lyon',chip('suggéré','num'))])+'</div>',
btn('Enregistrer le contexte','ink',href='C06-Fiche.dc.html'),
),P)
# C06 Fiche réalité
screen('C06-Fiche.dc.html','FAC-2026-0047',top('',"F02-Realites.dc.html",ibtn('more','Plus d’actions'),chip=chip('Facture de rachat','info'))+scroll(
'<div style="display:flex;flex-direction:column;gap:4px"><span class="mono" style="font-size:30px">FAC-2026-0047</span><span style="font-size:15.5px">F-47 · Antiquités Martin → M. Dupont · 1 250,00 €</span></div>',
f'<div class="row" style="gap:6px;flex-wrap:wrap">{chip("Reçu","phy")}<span class="muted">→</span>{chip("Vérifié","ink")}<span class="muted">→</span>{chip("Payé")}<span class="muted">→</span>{chip("Archivé")}</div>',
grid(2,*[f'<a href="{h}" class="tile" style="gap:4px"><span class="row" style="gap:8px;color:{c}">{ic(i,"icon ic16")}<span class="muted small" style="color:inherit">{l}</span></span><strong>{v}</strong><span class="muted small">{s}</span></a>' for i,l,v,s,c,h in [
 ('layers','Manifestations','3 empreintes','1 incohérence',CRIT,'C07-Manifestations.dc.html'),
 ('pin','Emplacement','Classeur 02 › B › 14','original présent',PHY,'C08-Emplacement.dc.html'),
 ('check','Preuves','4 sur 6','relevé manquant',WARN,'C10-Preuves.dc.html'),
 ('link','Relations','6 liens','paiement manquant',WARN,'C11-Relations.dc.html'),
 ('flag','État','Vérifié','par Olivier · 29/09',INK,'C09-Etat.dc.html'),
 ('clock','Historique','11 événements','chaîne intacte',PHY,'C12-Historique.dc.html')]]),
f'<a href="C13-Lacunes.dc.html" class="card" style="text-decoration:none;color:inherit;flex-direction:row;align-items:center;gap:12px"><span class="ibox" style="background:#FCEFD9;color:#8A5300">{ic("search")}</span><span class="col"><strong>Ce qui manque à cette réalité</strong><span class="muted">2 manques · 3 automatisations possibles</span></span>{ic("fwd")}</a>',
btns(btn('Étiquette','line','qr','P02-Etiquette.dc.html',style='flex:1'),btn('Vérifier','ink','shield','V02-Incoherence.dc.html',style='flex:1')),
)+nav('real'),P)
# C07 Manifestations
layer=lambda t,s,c,conf,val,col: f'<div class="card" style="flex-direction:row;gap:12px;align-items:stretch"><span class="sev" style="background:{c}"></span><span class="col" style="gap:5px"><span class="between"><strong>{t}</strong><span class="mono" style="color:{col}">{val}</span></span><span class="muted">{s}</span>{bar(int(conf*100),c)}<span class="muted small">confiance {str(conf).replace(".",",")}</span></span></div>'
screen('C07-Manifestations.dc.html','Manifestations',top('Manifestations','C06-Fiche.dc.html',ibtn('plus','Ajouter une manifestation'))+scroll(
'<span class="muted" style="font-size:14px">Une seule réalité. Plusieurs empreintes, jamais confondues.</span>',
layer('Original papier','Physique · signé · reçu le 28/09',PHY,1,'1 250 €',INK),
'<div style="text-align:center;color:#8A948F">↕</div>',
layer('Photo recto F-47.jpg','Numérique · sha256 9c1e…a40f · 2,1 Mo',NUM,0.8,'',INK),
'<div style="text-align:center;color:#8A948F">↕</div>',
layer('Lecture OCR','Données · Tesseract 5 · 10 champs',NUM,0.6,'1 250 €',INK),
'<div style="text-align:center;color:#8A948F">↕</div>',
layer('Saisie comptable','Données · saisie manuelle 29/09',CRIT,0.75,'1 520 €','#9A1D12'),
),P)
# C08 Emplacement
screen('C08-Emplacement.dc.html','Emplacement',top('Où est-elle ?','C06-Fiche.dc.html')+scroll(
card(f'<span class="row" style="color:{PHY};gap:8px">{ic("pin")}<span class="h2" style="color:{INK}">Original</span></span>'+path('Fournisseurs','2026','Achats')+path('Classeur 02','Section B','Pochette 14',mono=True)+'<span class="muted">Détenu par : bureau · vérifié présent le 30/09</span>'),
card(f'<span class="row" style="gap:8px">{ic("copy")}<span class="h2">Copie</span></span><span>Photocopie remise au comptable</span><span class="muted">Détenue par : Cabinet Leroy · depuis le 30/09</span>'),
card(f'<span class="row" style="gap:8px">{ic("cloud")}<span class="h2">Archive</span></span><span>Photo + PDF archivés</span><span class="muted">Coffre local chiffré · sauvegarde du 01/10</span>'),
lst(li('Rangée en Pochette 14','par Olivier','<span class="muted mono small">30/09</span>',sev=PHY),li('Sur le bureau, à vérifier','','<span class="muted mono small">29/09</span>',sev=INFO),li('Reçue par courrier','','<span class="muted mono small">28/09</span>',sev=INFO),title='Déplacements'),
btns(btn('Déplacer','line','pin',style='flex:1'),btn('Confier à…','line','hand','P10-Detenteur.dc.html',style='flex:1')),
),P)
# C09 État
states=[('Reçu','28/09 · courrier',True),('Vérifié','29/09 · Olivier',True),('Payé','',False),('Archivé','',False)]
screen('C09-Etat.dc.html','État',top('État','C06-Fiche.dc.html')+scroll(
card(ctitle('Cycle de vie')+''.join(f'<div class="row" style="padding:6px 0"><span style="width:24px;height:24px;border-radius:12px;background:{PHY if d else "#FFFFFF"};border:2px solid {PHY if d else "#C9CEC6"};color:#FFFFFF;display:flex;align-items:center;justify-content:center;flex:none">{ic("check","icon ic16") if d else ""}</span><span class="col"><strong style="font-weight:600">{n}</strong><span class="muted">{w}</span></span></div>' for n,w,d in states)),
card(ctitle('États possibles depuis « Vérifié »')+chips(chip('Payé','ink'),chip('Contesté','warn'),chip('Annulé','crit'),chip('Archivé','ghost'))+'<span class="muted">Et plus tard : Remboursé.</span>'),
note('Un passage inhabituel (ex. Reçu → Payé) reste possible si le réel l’impose, mais il est signalé pour vérification.','warn','alert'),
btn('Marquer comme payée','ink'),
),P)
# C10 Preuves
pr=[('image','Photo originale','F-47.jpg · 28/09',True),('scan','OCR','10 champs lus',True),('sig','Signature','détectée sur l’original',True),('doc','Pièce comptable','écriture 2026-09-112',True),('bank','Transaction bancaire','aucune ligne de relevé',False),('hand','Validation humaine','par Olivier · 29/09',True)]
screen('C10-Preuves.dc.html','Preuves',top('Preuves','C06-Fiche.dc.html',ibtn('plus','Ajouter une preuve'))+scroll(
'<span class="muted" style="font-size:14px">Ce qui atteste que la réalité est bien ce qu’elle prétend être.</span>',
'<div class="card">'+''.join(li(n,s,chip('ok','phy') if ok else chip('manque','warn'),icon=i,ic_color=PHY if ok else WARN) for i,n,s,ok in pr)+'</div>',
btn('Importer le relevé bancaire','ink','bank','V03-RelationManquante.dc.html'),
),P)
# C11 Relations
rel=[('cart','commande','BC-2026-0019 · bon de commande',PHY),('bank','paiement','aucun',WARN),('users','fournisseur','Antiquités Martin',INK),('user','client','M. Dupont',INK),('folder','projet','Boutique de Lyon',NUM),('box','stock','2 articles entrés · STK-0412',PHY),('flag','mission','—','#8A948F')]
graph=f'''<div style="position:relative;height:250px;background:#FFFFFF;border:1px solid #DDE0D9;border-radius:14px;overflow:hidden">
<svg viewBox="0 0 350 250" width="350" height="250" style="position:absolute;inset:0" aria-hidden="true"><g stroke="#C9CEC6" stroke-width="1.5" fill="none"><path d="M175 125 70 45M175 125 280 45M175 125 40 125M175 125 310 125M175 125 70 205M175 125 280 205"/></g><path d="M175 125 280 205" stroke="{WARN}" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/></svg>
<span class="chip ink mono" style="position:absolute;left:115px;top:111px">FAC-2026-0047</span>
<span class="chip phy" style="position:absolute;left:30px;top:32px">Commande</span><span class="chip info" style="position:absolute;left:236px;top:32px">Fournisseur</span>
<span class="chip info" style="position:absolute;left:8px;top:140px">Client</span><span class="chip num" style="position:absolute;left:268px;top:140px">Projet</span>
<span class="chip phy" style="position:absolute;left:40px;top:192px">Stock</span><span class="chip warn" style="position:absolute;left:232px;top:192px">Paiement ?</span></div>'''
screen('C11-Relations.dc.html','Relations',top('Relations','C06-Fiche.dc.html',ibtn('plus','Ajouter une relation'))+scroll(
graph,
'<div class="card">'+''.join(li(k.capitalize(),v,chip('relier','warn') if c==WARN else '',icon=i,ic_color=c) for i,k,v,c in rel)+'</div>',
),P)
# C12 Historique
ev=[(11,'preuve','validation humaine · Olivier','30/09 18:02','a40f'),(10,'emplacement','→ Classeur 02 › B › 14','30/09 17:55','71c2'),(9,'marquage','étiquette QR collée','30/09 17:54','0be9'),(8,'état','reçu → vérifié','29/09 10:20','5d13'),(7,'manifestation','saisie comptable · 1 520 €','29/09 09:41','e88a'),(6,'manifestation','OCR · 10 champs','28/09 16:03','2f70'),(5,'manifestation','photo F-47.jpg','28/09 16:02','c931'),(4,'relation','fournisseur Antiquités Martin','28/09 16:01','9a04'),(1,'intégration','FAC-2026-0047 créée','28/09 16:00','3b6e')]
screen('C12-Historique.dc.html','Historique',top('Historique','C06-Fiche.dc.html')+scroll(
note('Chaîne intacte : chaque événement est scellé par l’empreinte SHA-256 du précédent. Rien ne peut être réécrit en silence.','phy','lock'),
'<div class="card" style="gap:0">'+''.join(f'<div class="row" style="align-items:flex-start;padding:8px 0;border-top:{"none" if j==0 else "1px solid #EEF0EC"}"><span class="mono muted small" style="width:24px">#{n}</span><span class="col"><strong style="font-weight:600">{t}</strong><span class="muted">{d}</span><span class="hash">{h}…</span></span><span class="muted mono small">{w}</span></div>' for j,(n,t,d,w,h) in enumerate(ev))+'</div>',
),P)
# C13 Lacunes
qs=[('Qu’est-ce qui manque ?','La ligne de relevé bancaire du paiement',WARN),('Qu’est-ce qui est en double ?','Possible : FAC-2026-0046, même montant',WARN),('Qu’est-ce qui n’est pas relié ?','Le paiement',WARN),('Qu’est-ce qui est mal identifié ?','Montant : 1 250 € ou 1 520 €',CRIT),('Qu’est-ce qui risque d’être perdu ?','Rien : original rangé et photographié',PHY),('Qu’est-ce qui peut être automatisé ?','Rapprochement bancaire · rappel d’archivage',NUM),('Qu’est-ce qui doit rester humain ?','Choisir le bon montant · décider du paiement',INK),('Qu’est-ce qui doit rester physique ?','L’original signé, 10 ans',PHY),('Qu’est-ce qui doit être numérique ?','Identité, historique, recherche',NUM),('Quelle organisation serait plus cohérente ?','Aucune : déjà rangée selon le plan D',PHY)]
screen('C13-Lacunes.dc.html','Lacunes',top('Lacunes','C06-Fiche.dc.html')+scroll(
'<div class="card" style="gap:0">'+''.join(f'<div class="row" style="align-items:flex-start;padding:9px 0;border-top:{"none" if j==0 else "1px solid #EEF0EC"}"><span class="sev" style="background:{c};min-height:30px"></span><span class="col"><strong style="font-weight:600">{q}</strong><span class="muted">{a}</span></span></div>' for j,(q,a,c) in enumerate(qs))+'</div>',
),P)
