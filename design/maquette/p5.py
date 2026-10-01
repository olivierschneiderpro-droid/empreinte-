from base import *
P='domaines'
def hero(icon,idt,title,sub,color=PHY):
    return f'<div class="row" style="gap:14px;align-items:flex-start"><span class="ibox" style="width:64px;height:84px;border-radius:8px;background:#E3EFE8;color:{color}">{ic(icon)}</span><span class="col" style="gap:4px"><span class="mono" style="font-size:20px">{idt}</span><strong style="font-size:16px">{title}</strong><span class="muted">{sub}</span></span></div>'
screen('D01-Livre.dc.html','Livre',top('Livre','F02-Realites.dc.html',ibtn('more','Plus'))+scroll(
hero('book','LIV-2026-0047','Concordance Strong · exemplaire n° 12','Éd. Bibliothèque Biblique, 2018'),
kvs(('ISBN','<span class="mono">978-2-91343-012-4</span>'),('Exemplaire','n° 12 sur 14'),('Emplacement','Bibliothèque › Étagère 1 › rang 2'),('État','bon · coins usés'),('Propriétaire','Église de Lyon')),
lst(li('Prêté à Paul M.','depuis le 22/09 · retour le 22/10',chip('en cours','warn'),icon='hand',ic_color=WARN),li('Rendu par Claire D.','10/09 · état vérifié','',icon='check',ic_color=PHY),li('Prêté à Claire D.','14/08','',icon='hand'),title='Historique de prêt'),
btns(btn('Prêter','line','hand',style='flex:1'),btn('Photo de l’état','ink','camera',style='flex:1')),
)+nav('real'),P)
screen('D02-Equipement.dc.html','Équipement',top('Équipement','F02-Realites.dc.html',ibtn('more','Plus'))+scroll(
hero('laptop','EQP-2024-0007','Ordinateur portable ThinkPad T14','Bureau de Lyon'),
kvs(('N° d’inventaire','<span class="mono">EQP-2024-0007</span>'),('N° de série','<span class="mono">PF3K9Z2A</span>'),('Emplacement','Bureau › poste 3'),('Responsable','Marie L.'),('Facture','<a href="C06-Fiche.dc.html" class="mono">FAC-2024-0112</a>')),
card(ctitle('Garantie',chip('expire dans 12 jours','warn'))+bar(96,WARN)+'<span class="muted">Jusqu’au 13/10/2026 · Lenovo Premier</span>'),
lst(li('Remplacement batterie','03/2026 · 89 €','',icon='wrench'),li('Nettoyage + mise à jour','09/2025','',icon='wrench'),title='Maintenance'),
)+nav('real'),P)
screen('D03-BiblePhysique.dc.html','Bible physique',top('Bible physique','F02-Realites.dc.html',ibtn('more','Plus'))+scroll(
hero('book','BIB-2026-0001','Bible Segond 21 · exemplaire de mission','Couverture rigide noire · 2016'),
kvs(('Traduction','Segond 21'),('Édition','Société Biblique de Genève, 2016'),('Identifiant','<span class="mono">BIB-2026-0001</span> · marque-page QR'),('Propriétaire','Olivier'),('Emplacement','Bureau › étagère')),
lst(li('Jean 3:16','annoté au crayon · note numérique liée','',icon='note',ic_color=NUM,href='B01-Lecteur.dc.html'),li('Psaume 23','souligné · 3 lectures','',icon='pen',ic_color=NUM,href='B01-Lecteur.dc.html'),li('Romains 8:28-30','étude du 14/09','',icon='book',ic_color=NUM,href='L07-EditeurEtude.dc.html'),title='Passages étudiés dans cet exemplaire'),
note('Les annotations au crayon restent sur le papier ; leur photo devient une empreinte de la page.','phy','image'),
)+nav('real'),P)
steps=[('cart','Achat','1000 Bibles S21 · BC-2026-0011',True),('euro','Facture','FAC-2026-0031 · 4 800 €',True),('truck','Réception','400 + 600 · BL-2209, BL-2231',True),('pin','Emplacement','Dépôt › palettes 1 et 2',True),('hand','Distribution','640 remises · 23 lieux',True),('box','Restantes','360 au dépôt',False),('check','Preuves','21 sur 23 lieux',False)]
screen('D04-Mission.dc.html','Mission',top('Mission','F02-Realites.dc.html',ibtn('more','Plus'))+scroll(
'<div style="display:flex;flex-direction:column;gap:4px"><span class="mono muted">MIS-2026-0002</span><h1 class="h1">1000 Bibles pour la rentrée</h1></div>',
card('<div class="between"><span class="mono" style="font-size:28px">640 / 1000</span>'+chip('en cours','num')+'</div>'+bar(64,PHY)+'<span class="muted">Stock numérique : 360 · comptage physique du 30/09 : 358</span>'),
note('Écart de 2 Bibles entre le stock numérique et le comptage physique.','warn','alert'),
'<div class="card" style="gap:0">'+''.join(f'<div class="li"><span class="ibox" style="background:{"#E3EFE8" if d else "#FCEFD9"};color:{PHY if d else WARN}">{ic(i)}</span><span class="col"><strong style="font-weight:600">{n}</strong><span class="muted">{s}</span></span></div>' for i,n,s,d in steps)+'</div>',
btn('Enregistrer une distribution','ink','hand','D05-Distribution.dc.html'),
)+nav('real'),P)
screen('D05-Distribution.dc.html','Distribution',top('Distribution','D04-Mission.dc.html')+scroll(
field('Lieu','Lycée Ampère · Lyon 2e'),
'<div class="field"><label>Quantité</label><div class="row" style="gap:8px"><button class="iconbtn" type="button" aria-label="Moins">−</button><div class="input mono" style="flex:1;justify-content:center;font-size:20px">40</div><button class="iconbtn" type="button" aria-label="Plus">'+ic('plus')+'</button></div></div>',
field('Remis à','Mme Benali · aumônerie'),
card(ctitle('Preuves')+grid(3,*[f'<div class="tile" style="align-items:center;gap:4px;padding:14px 4px;color:{c}">{ic(i)}<span class="small" style="color:{INK};font-weight:600">{l}</span></div>' for i,l,c in [('camera','Photo',PHY),('sig','Signature',PHY),('pin','Lieu GPS',INFO)]])),
note('Le stock passera de 360 à 320 et la distribution sera reliée à la mission.','num','link'),
btn('Enregistrer','ink','check','D04-Mission.dc.html'),
),P)
screen('D06-Projet.dc.html','Projet',top('Projet','F02-Realites.dc.html',ibtn('more','Plus'))+scroll(
'<div style="display:flex;flex-direction:column;gap:4px"><span class="mono muted">PRJ-2026-0003</span><h1 class="h1">Boutique de Lyon</h1></div>',
'<div class="card" style="gap:0">'+''.join(f'<div class="li"><span class="mono" style="width:30px;height:30px;border-radius:15px;background:{c};color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:12px;flex:none">{v}</span><span class="col"><strong style="font-weight:600">{t}</strong><span class="muted">{s}</span></span>{chip(k,"phy" if k=="physique" else "num")}</div>' for v,t,s,k,c in [('v1','Maquette carton','Photo · 02/06 · Olivier','physique',PHY),('v2','Plan 3D','fichier .skp · 18/06','numérique',NUM),('v3','Maquette bois','NFC sous le socle · 10/07','physique',PHY),('v4','Plan final','PDF imprimé A3 · 12/09','numérique',NUM)])+'</div>',
lst(li('Décision : vitrine à gauche','12/07 · réunion · 3 présents','',icon='flag'),li('Test : circulation clients','v3 · 6 personnes · 2 remarques','',icon='users'),li('Fichiers','14 fichiers · 3 photos de maquette','',icon='folder'),title='Décisions, tests, fichiers'),
btn('Nouvelle version physique','ink','box','P09-NumVersPhys.dc.html'),
)+nav('real'),P)
screen('D07-Journaux.dc.html','Journaux',top('Mes deux journaux','F02-Realites.dc.html')+scroll(
grid(2,f'<div class="tile" style="gap:6px;padding:14px;background:#E3EFE8"><span style="color:{PHY}">{ic("note")}</span><strong>Carnet de terrain</strong><span class="muted small">papier · 34 pages sur 96</span><span class="mono small">JRN-P-0001</span></div>',f'<div class="tile" style="gap:6px;padding:14px;background:#E6EAFB"><span style="color:{NUM}">{ic("note")}</span><strong>Journal numérique</strong><span class="muted small">218 entrées</span><span class="mono small">JRN-N-0001</span></div>'),
f'<div class="card"><div class="between"><span class="h2">Carnet p. 34</span>{chip("numérisée hier","num")}</div><div style="height:140px;background:#FBFAF5;border:1px solid #E6E2D3;border-radius:6px;padding:12px;font-family:\'Caveat\',\'Comic Sans MS\',cursive;font-size:14px;color:#3B3A35;line-height:1.5;background-image:repeating-linear-gradient(#FBFAF5 0 22px,#E3E1D7 22px 23px)">30 sept. — distribution lycée Ampère, 40 Bibles.<br>Relire Jean 3:16 avec le groupe.<br>Facture F-47 à vérifier !</div><span class="muted">3 réalités reconnues dans cette page :</span>{chips(chip("MIS-2026-0002","phy"),chip("Jean 3:16","num"),chip("FAC-2026-0047","phy"))}</div>',
note('Le carnet reste un carnet. Sa page photographiée devient une empreinte reliée à ce qu’elle mentionne.','phy','layers'),
btn('Numériser une page','ink','camera'),
),P)
screen('D08-EntreeJournal.dc.html','Entrée de journal',top('1er octobre','D07-Journaux.dc.html',ibtn('more','Plus'))+scroll(
'<p class="serif" style="font-size:17px;line-height:1.65;margin:0">Ce matin, lecture de <a href="B01-Lecteur.dc.html">Jean 3:16</a> avec la Bible de mission. « Donner avant de recevoir. »</p>',
'<p class="serif" style="font-size:17px;line-height:1.65;margin:0">Vérifié la facture <a href="C06-Fiche.dc.html" class="mono" style="font-size:15px">FAC-2026-0047</a> : l’original indique bien 1 250 €.</p>',
card('<span class="eyebrow">Reconnu automatiquement</span>'+chips(chip('Jean 3:16','num'),chip('BIB-2026-0001','phy'),chip('FAC-2026-0047','phy'))),
chips(chip('Mission','ghost'),chip('Prière','ghost'),chip('+ étiquette','ghost')),
),P)
screen('D09-Personne.dc.html','Personne',top('Personne','F02-Realites.dc.html',ibtn('more','Plus'))+scroll(
f'<div class="row" style="gap:14px"><span class="ibox" style="width:60px;height:60px;border-radius:30px;background:#EEF0EC">{ic("user")}</span><span class="col"><strong style="font-size:18px">M. Dupont</strong><span class="mono muted small">PER-0012 · client</span></span></div>',
grid(3,tile('Factures','4'),tile('Prêts','1'),tile('Documents','7')),
lst(li('FAC-2026-0047','Facture de rachat · 1 250 €',chip('à vérifier','warn'),icon='euro',href='C06-Fiche.dc.html'),li('LIV-2026-0019','Livre prêté · retour le 05/11','',icon='book'),li('Contrat de dépôt-vente','DOC-2025-0088 · original signé','',icon='doc'),title='Réalités liées'),
),P)
screen('D10-Stock.dc.html','Stock',top('Stock','F02-Realites.dc.html',ibtn('plus','Ajouter'))+scroll(
search('Chercher un article…'),
lst(li('Bibles Segond 21','Dépôt › palettes 1-2','<span class="mono" style="font-weight:600">360</span>',icon='book',ic_color=PHY,href='D04-Mission.dc.html'),
    li('Nouveaux Testaments poche','Dépôt › étagère 3','<span class="mono" style="font-weight:600">85</span>',icon='book',ic_color=PHY),
    li('Commode Louis-Philippe','Boutique › réserve','<span class="mono" style="font-weight:600">1</span>',icon='box',ic_color=PHY,href='C06-Fiche.dc.html'),
    li('Chaises (lot de 6)','Boutique › réserve','<span class="mono" style="font-weight:600">6</span>',icon='box',ic_color=PHY),
    li('Étiquettes QR 50 × 60','Bureau › tiroir 2',chip('bas : 24','warn'),icon='qr',ic_color=WARN)),
)+nav('real'),P)
