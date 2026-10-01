from base import *
P='physique'
# P01 Méthodes
m=[('qr','Étiquette QR','Un scan ouvre l’empreinte',9,PHY),('pen','Numéro écrit à la main','Lisible sans appareil',7,PHY),('pin','Emplacement','Classeur › section › pochette',6,PHY),('color','Couleur de dossier','Bleu = Fournisseurs',4,INFO),('barcode','Code-barres','Lecture en série',4,INFO),('calendar','Classement chronologique','Par date de réception',4,INFO),('folder','Classement par projet','Boutique de Lyon',3,INFO),('users','Classement par fournisseur','Antiquités Martin',3,INFO),('nfc','Puce NFC','Mieux pour les objets',1,INFO)]
screen('P01-Methodes.dc.html','Méthodes de marquage',top('Relier l’original','C06-Fiche.dc.html')+scroll(
card('<span class="eyebrow">Recommandé pour 600 documents papier</span><strong style="font-size:17px">QR + numéro écrit + emplacement</strong><span class="muted">Le QR pour la vitesse, le numéro si le QR s’abîme, l’emplacement pour retrouver sans téléphone.</span>'),
'<div class="card" style="gap:0">'+''.join(f'<div class="li"><span style="color:{c}">{ic(i)}</span><span class="col"><strong style="font-weight:600">{n}</strong><span class="muted">{s}</span></span><span class="chip {"phy" if sc>=6 else "info"} mono">{sc}/10</span></div>' for i,n,s,sc,c in m)+'</div>',
'<span class="muted">Combiner plusieurs méthodes est souvent le plus sûr.</span>',
btn('Préparer l’étiquette','ink','print','P02-Etiquette.dc.html'),
),P)
# P02 Étiquette
screen('P02-Etiquette.dc.html','Étiquette',top('Étiquette','P01-Methodes.dc.html')+scroll(
f'<div class="card" style="align-items:center;padding:18px"><div style="width:200px;border:1.5px dashed #8A948F;border-radius:10px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:6px">{qr(128)}<strong class="mono" style="font-size:17px">FAC-2026-0047</strong><span class="muted small">Facture de rachat F-47</span><span class="muted small">Classeur 02 · B · 14</span></div></div>',
card(ctitle('Format')+seg('50 × 60 mm','Planche A4 × 24','Rouleau',on=0)),
kvs(('Contenu du QR','<span class="mono small">EMPREINTE:FAC-2026-0047</span>'),('Texte lisible','identifiant + emplacement'),('Position','en haut à droite, hors texte'),('Imprimante','Brother QL-800 · prête')),
btns(btn('Imprimer','line','print',style='flex:1'),btn('C’est collé','ink','check','P04-Emplacement.dc.html',style='flex:1')),
),P)
# P03 Inscrire à la main
screen('P03-Manuscrit.dc.html','Inscrire à la main',top('Inscrire à la main','P01-Methodes.dc.html')+scroll(
f'<div class="card" style="align-items:center;padding:18px;background:#FBFAF5"><div style="width:220px;height:290px;background:#F7F5EE;border:1px solid #DDD8C8;position:relative;padding:14px;box-sizing:border-box;font-size:9px;color:#6B6A63"><span style="position:absolute;top:8px;right:10px;font-family:\'Caveat\',\'Comic Sans MS\',cursive;font-size:15px;color:{NUM};border:2px dashed {NUM};padding:2px 6px;border-radius:4px">FAC-2026-0047</span><div style="margin-top:34px;display:flex;flex-direction:column;gap:6px"><strong style="font-size:11px;color:#30302C">FACTURE DE RACHAT</strong><span>N° F-47</span><span>……………………………</span><span>……………………………</span><span>……………………………</span></div></div></div>',
lst(li('Où écrire','En haut à droite, dans la marge, hors de tout texte','',icon='pin'),li('Avec quoi','Crayon à papier ou stylo archive (encre permanente)','',icon='pen'),li('Quoi','<span class="mono">FAC-2026-0047</span> en capitales','',icon='hash')),
note('Ne jamais écrire sur un document patrimonial ou une Bible ancienne : utiliser un marque-page ou la pochette.','warn','alert'),
btn('C’est inscrit','ink','check'),
),P)
# P04 Emplacement calculé
screen('P04-Emplacement.dc.html','Emplacement calculé',top('Où la ranger ?','P02-Etiquette.dc.html')+scroll(
card('<span class="eyebrow">Selon votre plan D · hybride</span>'+path('Fournisseurs','2026','Achats')),
grid(3,tile('Classeur','02',bg='#E3EFE8'),tile('Section','B',bg='#E3EFE8'),f'<div class="tile" style="background:#18211F;color:#FFFFFF"><span class="small" style="color:#C9D2CE">Pochette</span><strong class="mono" style="font-size:18px">14</strong></div>'),
kvs(('Occupation de la pochette','7 / 10'),('Voisins','FAC-2026-0044 · 0045 · 0046'),('Prochaine pochette','15, à ouvrir après 3 documents')),
note('Pourquoi ici ? Domaine Fournisseurs, année 2026, catégorie Achats : la section B de 2026 est déjà attribuée.','num','help'),
btns(btn('Autre endroit','line',style='flex:1'),btn('C’est rangé','ink','check','C06-Fiche.dc.html',style='flex:1')),
),P)
# P05 Plan de rangement
cells=''
for c in range(2):
  secs=''
  for s in 'ABCDEF':
    occ=[10,10,7,0,0,0] if (c==1 and s=='B') else [10,4,0,0,0,0] if s in 'AC' else [6,0,0,0,0,0] if s=='D' else [0]*6
    secs+=f'<div class="row" style="gap:4px"><span class="mono small" style="width:14px">{s}</span>'+''.join(f'<span style="flex:1;height:14px;border-radius:3px;background:{"#18211F" if (c==1 and s=="B" and k==2) else "#1F6B4F" if o>=10 else "#8CC5A8" if o>0 else "#E3E6E0"}"></span>' for k,o in enumerate(occ))+'</div>'
  cells+=f'<div class="card" style="gap:6px"><strong class="mono">Classeur 0{c+1}</strong>{secs}</div>'
screen('P05-PlanRangement.dc.html','Plan de rangement',top('Rangement physique','P06-Organisation.dc.html')+scroll(
'<span class="muted" style="font-size:14px">Chaque case est une pochette. La noire est celle de FAC-2026-0047.</span>',
cells,
chips(chip('<span class="dot" style="background:#1F6B4F"></span>pleine','ghost'),chip('<span class="dot" style="background:#8CC5A8"></span>entamée','ghost'),chip('<span class="dot" style="background:#E3E6E0"></span>libre','ghost')),
kvs(('Sections attribuées','Fournisseurs 2026 → 02-B · Clients 2026 → 01-A · Maison → 01-C')),
),P)
# P06 Organisation
def opt(l,n,s,t,best=False):
    bg=INK if best else '#FFFFFF'; fg='#FFFFFF' if best else INK; mu='#C9D2CE' if best else '#5B6763'
    return f'<div class="card" style="background:{bg};color:{fg};gap:6px"><div class="between"><span class="row"><span class="mono" style="width:28px;height:28px;border-radius:14px;border:1.5px solid {fg};display:flex;align-items:center;justify-content:center;font-size:13px">{l}</span><strong>{n}</strong></span><span class="mono">{s:.2f}</span></div><span class="bar" style="background:{"#3A4440" if best else "#E3E6E0"}"><i style="width:{int(s/5*100)}%;background:{"#6FCF97" if best else PHY}"></i></span><span style="font-size:13px;color:{mu}">~{t} s pour retrouver un document</span></div>'
screen('P06-Organisation.dc.html','Organiser',top('Organiser le physique','Main.dc.html',ibtn('cog','Critères','P07-Criteres.dc.html'))+scroll(
card('<span class="eyebrow">Votre situation</span><span><strong class="mono">600</strong> documents · <strong class="mono">10</strong> recherches/semaine · 5 domaines · 10 ans</span>'),
opt('D','Hybride + identifiant unique',4.45,20,True),opt('B','Par domaine',3.60,27),opt('A','Chronologique',3.45,35),opt('C','Par projet',2.95,35),
btns(btn('Voir le plan','line',href='P05-PlanRangement.dc.html',style='flex:1'),btn('Appliquer D','ink',style='flex:1')),
),P)
# P07 Critères
cr=[('Temps de recherche',90),('Fréquence d’utilisation',80),('Volume',70),('Risque de perte',75),('Coût',30),('Espace physique',40),('Facilité d’accès',60),('Confidentialité',35),('Durabilité',80),('Besoin de partage',30),('Synchronisation numérique',65)]
screen('P07-Criteres.dc.html','Critères',top('Ce qui compte pour vous','P06-Organisation.dc.html')+scroll(
'<div class="card" style="gap:10px">'+''.join(f'<div style="display:flex;flex-direction:column;gap:5px"><span class="between"><span style="font-weight:500">{n}</span><span class="mono small">{v} %</span></span><span style="position:relative;height:6px;border-radius:3px;background:#E3E6E0"><i style="position:absolute;left:0;top:0;height:6px;border-radius:3px;width:{v}%;background:{INK}"></i><i style="position:absolute;top:-6px;left:calc({v}% - 9px);width:18px;height:18px;border-radius:9px;background:#FFFFFF;border:2px solid {INK}"></i></span></div>' for n,v in cr)+'</div>',
btn('Recalculer','ink',href='P06-Organisation.dc.html'),
),P)
# P08 Inventaire / récolement
screen('P08-Inventaire.dc.html','Inventaire physique',top('Contrôle de présence','Main.dc.html')+scroll(
card('<span class="eyebrow">Classeur 02 · en cours</span><div class="between"><span class="mono" style="font-size:30px">46 / 52</span>'+chip('6 non vus','warn')+'</div>'+bar(88)),
'<span class="muted" style="font-size:14px">Scannez chaque étiquette. Empreinte compare au registre.</span>',
lst(li('FAC-2026-0047','Pochette 14',chip('vu','phy'),icon='check',ic_color=PHY),li('FAC-2026-0046','Pochette 14',chip('vu','phy'),icon='check',ic_color=PHY),li('FAC-2026-0031','Attendue en Pochette 11',chip('non vue','warn'),icon='alert',ic_color=WARN,href='V05-Introuvable.dc.html'),li('Document sans étiquette','Trouvé en Pochette 12',chip('à intégrer','num'),icon='plus',ic_color=NUM,href='V06-NouvelleRealite.dc.html'),title='Derniers scans'),
btns(btn('Scanner','ink','qr','F05-Scanner.dc.html',style='flex:1'),btn('Terminer','line',style='flex:1')),
),P)
# P09 Numérique → physique
screen('P09-NumVersPhys.dc.html','Du numérique au physique',top('Donner une forme physique','F06-Capturer.dc.html')+scroll(
heading('Le numérique laisse aussi une empreinte physique.',sub='Projet « Boutique de Lyon » · version 4'),
lst(li('Imprimer le dossier','PDF de 12 pages avec QR de retour en pied de page','',icon='print',ic_color=PHY),li('Carnet de projet','Pages pré-numérotées PRJ-0003-p01 à p40','',icon='note',ic_color=PHY),li('Maquette physique','Étiquette NFC collée sous le socle','',icon='box',ic_color=PHY),li('Affiche du planning','A3 avec QR vers les décisions','',icon='calendar',ic_color=PHY),title='Formes proposées'),
note('Chaque tirage devient une manifestation « impression » reliée au projet, avec sa version.','num','link'),
btn('Créer l’impression','ink','print'),
),P)
# P10 Détenteur
screen('P10-Detenteur.dc.html','Confier un original',top('Confier à quelqu’un','C08-Emplacement.dc.html')+scroll(
card('<span class="eyebrow">Original</span><strong class="mono">FAC-2026-0047</strong><span class="muted">Classeur 02 › B › Pochette 14</span>'),
field('À qui','Cabinet Leroy · comptable'),field('Pourquoi','Révision des comptes T3'),field('Retour prévu','15 octobre 2026'),
card('<span class="muted small">Signature de remise</span><div style="height:90px;border:1px dashed #C9CEC6;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#8A948F">'+ic('sig')+'</div>'),
btn('Enregistrer la remise','ink','hand'),
),P)
