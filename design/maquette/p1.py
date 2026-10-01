from base import *
P='fondations'
# F01 Aujourd'hui (Main)
screen('Main.dc.html','Aujourd’hui',f'''
<div class="top"><div class="row">{LOGO}<span class="h2" style="font-size:20px">Empreinte</span></div><div class="row" style="gap:8px">{ibtn("qr","Scanner un QR code","F05-Scanner.dc.html")}{ibtn("search","Rechercher partout","F04-Recherche.dc.html")}</div></div>
'''+scroll(
heading('Le réel laisse une empreinte.','Mercredi 1er octobre'),
f'<a href="V01-Verifier.dc.html" class="card" style="text-decoration:none;color:inherit;border-color:#F0C9C4;background:#FFF8F7;flex-direction:row;align-items:center;gap:12px"><span class="ibox" style="background:#FBE5E3;color:#9A1D12;border-radius:18px">{ic("alert")}</span><span class="col"><strong>4 vérifications à faire</strong><span class="muted">F-47 : 1 250 € sur l’original, 1 520 € en saisie</span></span>{ic("fwd","icon","color:#9A1D12")}</a>',
f'<a href="B11-JourMeditation.dc.html" class="card" style="text-decoration:none;color:inherit;gap:6px"><span class="between"><span class="eyebrow">Verset du jour</span><span class="muted mono small">Ps 23.1</span></span><span class="serif" style="font-size:17px;line-height:1.5">« L’Éternel est mon berger : je ne manquerai de rien. »</span></a>',
grid(3,tile('Réalités','1 214','dont 868 physiques',href='F02-Realites.dc.html'),tile('Sans empreinte','12','à photographier',href='V06-NouvelleRealite.dc.html'),tile('Plan de lecture','J 214','sur 365',href='L10-Plan.dc.html')),
lst(li('Étude · Jean 3:16','Note liée à <span class="mono">BIB-2026-0001</span> · Strong G25',f'<span class="muted mono small">07:40</span>',sev=NUM,href='B01-Lecteur.dc.html'),
    li('Facture F-47 reçue','Original rangé · Classeur 02 › B › Pochette 14','<span class="muted mono small">09:12</span>',sev=PHY,href='C06-Fiche.dc.html'),
    li('Mission · 1000 Bibles','640 distribuées · 360 au dépôt','<span class="muted mono small">hier</span>',sev=PHY,href='D04-Mission.dc.html'),
    li('Carnet papier p. 34 numérisé','Journal de terrain · relié à 3 réalités','<span class="muted mono small">hier</span>',sev=NUM,href='D07-Journaux.dc.html'),
    title='Fil du jour',right='<a href="F02-Realites.dc.html" style="font-size:13.5px;font-weight:600">Tout voir</a>'),
grid(4,*[f'<a href="{h}" class="tile" style="align-items:center;text-align:center;font-size:12px;font-weight:600;gap:6px;padding:12px 4px">{ic(i)}{l}</a>' for i,l,h in [('camera','Capturer','F06-Capturer.dc.html'),('qr','Scanner','F05-Scanner.dc.html'),('note','Noter','D08-EntreeJournal.dc.html'),('grid','Ranger','P06-Organisation.dc.html')]]),
)+nav('home'),P)
# F02 Réalités index
cats=[('doc','Documents','412','P12 originaux non rangés',PHY),('euro','Factures & paiements','188','3 à vérifier',WARN),('book','Livres','86','4 prêtés',PHY),('book','Bibles physiques','23','1 000 en mission',PHY),('laptop','Équipements','31','2 garanties expirent',WARN),('box','Objets & stock','140','',PHY),('flag','Missions','3','1 en cours',NUM),('folder','Projets','7','',NUM),('note','Journaux','2','papier + numérique',NUM),('users','Personnes','54','',INFO)]
screen('F02-Realites.dc.html','Réalités',top('Réalités','Main.dc.html',ibtn('filter','Filtrer'))+scroll(
search('Chercher une réalité, un numéro, un emplacement…'),
chips(chip('Toutes','ink'),chip('Physiques','phy'),chip('Numériques','num'),chip('À vérifier','crit'),chip('Prêtées','warn')),
'<div class="card" style="gap:0;padding:6px 14px"><div class="list">'+''.join(li(n,s,f'<span class="mono" style="font-weight:600">{c}</span>',icon=i,ic_color=col,ic_bg='#EEF0EC',href=('C06-Fiche.dc.html' if n.startswith('Fact') else 'D01-Livre.dc.html' if n=='Livres' else 'D03-BiblePhysique.dc.html' if n.startswith('Bibles') else 'D02-Equipement.dc.html' if n.startswith('Équ') else 'D04-Mission.dc.html' if n=='Missions' else 'D06-Projet.dc.html' if n=='Projets' else 'D07-Journaux.dc.html' if n=='Journaux' else 'D09-Personne.dc.html' if n=='Personnes' else 'D10-Stock.dc.html' if n.startswith('Obj') else 'C06-Fiche.dc.html')) for i,n,c,s,col in cats)+'</div></div>',
)+nav('real'),P)
# F03 Domaines de vie
doms=[('Travail','Factures, clients, dossiers','486',PHY),('Maison','Objets, garanties, papiers','212',PHY),('Bible & étude','Bibles, notes, études, plans','341',NUM),('Missions','Stock, distributions, preuves','94',PHY),('Apprentissage','Livres, cours, carnets','63',NUM),('Projets','Maquettes, versions, décisions','18',NUM)]
screen('F03-Domaines.dc.html','Domaines de vie',top('Domaines de vie','Main.dc.html',ibtn('plus','Ajouter un domaine'))+scroll(
heading('Tout entre dans la même logique, sans devenir la même chose.',sub='Chaque domaine garde ses règles, ses emplacements et ses méthodes.'),
grid(2,*[f'<a href="F02-Realites.dc.html" class="tile" style="gap:6px;padding:14px"><span class="dot" style="background:{c};width:10px;height:10px;border-radius:5px"></span><strong style="font-size:16px">{n}</strong><span class="muted small">{s}</span><span class="mono" style="font-size:20px;margin-top:4px">{k}</span></a>' for n,s,k,c in doms]),
note('Une même réalité peut appartenir à plusieurs domaines : la Bible de mission est à la fois « Bible & étude » et « Missions ».','num','link'),
)+nav('real'),P)
# F04 Recherche universelle
screen('F04-Recherche.dc.html','Recherche universelle',top('',None,None,chip=f'<div class="search" style="flex:1;color:#18211F">{ic("search")}<span class="mono">47</span></div>')+scroll(
seg('Tout','Réalités','Bible','Lieux',on=0),
lst(li('FAC-2026-0047','Facture de rachat F-47 · Client Dupont','<span class="chip warn">à vérifier</span>',icon='euro',ic_color=PHY,href='C06-Fiche.dc.html'),
    li('LIV-2026-0047','Exemplaire n° 47 · Concordance Strong',chip('prêté','warn'),icon='book',ic_color=PHY,href='D01-Livre.dc.html'),title='Réalités'),
lst(li('Pochette 47','Classeur 04 › Section C · 8 documents','',icon='pin',ic_color=PHY,href='P05-PlanRangement.dc.html'),title='Emplacements'),
lst(li('Jean 4:7','« Donne-moi à boire. »','<span class="muted mono small">LSG</span>',icon='book',ic_color=NUM,href='B01-Lecteur.dc.html'),
    li('Psaume 47','Battez des mains, vous tous, peuples !','',icon='book',ic_color=NUM,href='B01-Lecteur.dc.html'),
    li('Strong G47 · hagneia','pureté · 2 occurrences','',icon='hash',ic_color=NUM,href='S02-Mot.dc.html'),title='Bible & Strong'),
lst(li('Carnet p. 47','Journal de terrain · 14 mars','',icon='note',ic_color=NUM,href='D08-EntreeJournal.dc.html'),title='Notes & journaux'),
),'fondations')
# F05 Scanner
screen('F05-Scanner.dc.html','Scanner un code',f'''
<div style="flex:1;background:#141A18;color:#FFFFFF;display:flex;flex-direction:column;padding:52px 20px 0;gap:14px">
<div class="between"><a class="iconbtn" href="Main.dc.html" aria-label="Fermer" style="background:#262E2B;border-color:#3A4440;color:#FFFFFF">{ic("x")}</a><span style="font-weight:600">Scanner</span><button class="iconbtn" type="button" aria-label="Flash" style="background:#262E2B;border-color:#3A4440;color:#FFFFFF">{ic("flash")}</button></div>
<div style="display:flex;justify-content:center;gap:6px">{chip("QR","ink","background:#FFFFFF;color:#141A18")}{chip("Code-barres","info","background:#262E2B;color:#C9D2CE")}{chip("ISBN","info","background:#262E2B;color:#C9D2CE")}{chip("NFC","info","background:#262E2B;color:#C9D2CE")}</div>
<div style="height:340px;border-radius:16px;background:#2A322F;display:flex;align-items:center;justify-content:center;position:relative">
<div style="width:220px;height:220px;border-radius:18px;border:3px solid #6FCF97;display:flex;align-items:center;justify-content:center;background:#F7F5EE">{qr(150)}</div>
</div>
<span style="text-align:center;color:#C9D2CE;font-size:13.5px">Visez l’étiquette collée sur l’original</span>
</div>
<div class="sheet" style="margin-top:-18px">
<div class="between"><span class="eyebrow">Reconnu</span><span class="mono muted small">EMPREINTE:FAC-2026-0047</span></div>
<a href="C06-Fiche.dc.html" class="row" style="text-decoration:none;color:inherit"><span class="ibox" style="background:#E3EFE8;color:{PHY}">{ic("euro")}</span><span class="col"><strong class="mono">FAC-2026-0047</strong><span class="muted">Facture de rachat F-47 · Classeur 02 › B › 14</span></span>{ic("fwd")}</a>
{note("Un code inconnu ? Empreinte propose d’intégrer cette nouvelle réalité.","info","help")}
</div>''','fondations')
# F06 Capturer
kinds=[('doc','Document','Photo, scan, PDF'),('euro','Facture','OCR des montants'),('book','Livre','Scanner l’ISBN'),('book','Bible','Exemplaire, édition'),('laptop','Équipement','N° de série'),('box','Objet','Photo + emplacement'),('note','Page de carnet','Journal papier'),('truck','Lot / mission','Quantités')]
screen('F06-Capturer.dc.html','Capturer une réalité',top('Capturer','Main.dc.html')+scroll(
heading('Qu’avez-vous devant vous ?',sub='Le physique garde son existence ; Empreinte en crée la trace.'),
grid(2,*[f'<a href="{"C01-Photo.dc.html" if n in ("Facture","Document") else "D01-Livre.dc.html" if n=="Livre" else "D03-BiblePhysique.dc.html" if n=="Bible" else "D02-Equipement.dc.html" if n=="Équipement" else "D07-Journaux.dc.html" if n.startswith("Page") else "D05-Distribution.dc.html" if n.startswith("Lot") else "D10-Stock.dc.html"}" class="tile" style="gap:6px;padding:14px"><span style="color:{PHY}">{ic(i)}</span><strong>{n}</strong><span class="muted small">{s}</span></a>' for i,n,s in kinds]),
lst(li('Créer sans original','Projet, idée, réalité d’abord numérique','',icon='sparkle',ic_color=NUM,href='P09-NumVersPhys.dc.html'),
    li('Importer des fichiers','PDF, photos, relevés bancaires OFX','',icon='upload',ic_color=NUM,href='A05-ImportExport.dc.html')),
)+nav('cap'),P)
# F07 Boucle
steps=['Réalité','Représentation','Identification','Organisation','Relation','Action','Preuve','Expérience','Retour','Apprentissage']
screen('F07-Principe.dc.html','Le principe',top('',None,'<a href="Main.dc.html" style="font-weight:600;font-size:14px;padding:12px 0">Passer</a>')+scroll(
heading('Le numérique aide à vivre le réel.',sub='Le réel nourrit le numérique. Aucun ne remplace l’autre.'),
'<div class="card" style="gap:0;padding:8px 14px">'+''.join(f'<div class="row" style="padding:7px 0;border-top:{"none" if i==0 else "1px solid #EEF0EC"}"><span class="mono" style="width:26px;height:26px;border-radius:13px;background:{PHY if i<3 else NUM if i<7 else INK};color:#FFFFFF;display:flex;align-items:center;justify-content:center;font-size:12px;flex:none">{i+1}</span><strong style="font-weight:600">{s}</strong></div>' for i,s in enumerate(steps))+'</div>',
note('Photo ≠ facture physique. OCR ≠ facture physique. Données ≠ facture physique. Ce sont des empreintes d’une même réalité.','phy','layers'),
btn('Commencer','ink',href='Main.dc.html'),
),P)
