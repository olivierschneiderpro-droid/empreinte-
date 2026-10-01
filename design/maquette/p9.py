from base import *
P='compte'
screen('A01-Plus.dc.html','Plus',f'<div class="top"><h1 class="h1">Plus</h1>{ibtn("user","Profil","A03-Profil.dc.html")}</div>'+scroll(
lst(li('Ma bibliothèque','surbrillances, notes, études…','',icon='book',ic_color=NUM,href='L01-Bibliotheque.dc.html'),li('Plans de lecture','3 en cours','',icon='calendar',ic_color=NUM,href='L09-Plans.dc.html'),li('Domaines de vie','6 domaines','',icon='grid',ic_color=PHY,href='F03-Domaines.dc.html'),li('Organisation physique','plan D · 2 classeurs','',icon='folder',ic_color=PHY,href='P06-Organisation.dc.html'),li('Contrôle de présence','dernier : 30/09','',icon='scan',ic_color=PHY,href='P08-Inventaire.dc.html')),
lst(li('Sauvegarde et synchronisation','3 appareils · à jour','',icon='cloud',href='A04-Sauvegarde.dc.html'),li('Importer / exporter','PDF, OFX, JSON','',icon='upload',href='A05-ImportExport.dc.html'),li('Téléchargements hors ligne','1,2 Go','',icon='download',href='A06-Telechargements.dc.html'),li('Confidentialité','chiffrement local','',icon='lock',href='A09-Confidentialite.dc.html'),li('Apparence','clair · texte 17 px','',icon='sun',href='A07-Theme.dc.html'),li('Langue des ressources','français','',icon='globe',href='A08-Langue.dc.html'),li('Aide et soutien','','',icon='help',href='A10-Aide.dc.html')),
)+nav('home'),P)
screen('A02-Connexion.dc.html','Connexion',top('',None)+scroll(
f'<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 0">{LOGO.replace("28","56")}<h1 class="h1">Empreinte</h1><span class="muted" style="text-align:center">Vos réalités, sur tous vos appareils.<br>Sans compte, tout reste sur ce téléphone.</span></div>',
field('E-mail','olivier@exemple.fr'),field('Mot de passe','••••••••••'),
'<a href="#" style="font-size:13.5px;font-weight:600;align-self:flex-end">Mot de passe oublié ?</a>',
btn('Se connecter','ink',href='Main.dc.html'),btn('Créer un compte','line'),
'<a href="Main.dc.html" style="text-align:center;font-weight:600;font-size:14px">Continuer sans compte</a>',
),P)
screen('A03-Profil.dc.html','Profil',top('Profil','A01-Plus.dc.html')+scroll(
f'<div class="row" style="gap:14px"><span class="ibox" style="width:64px;height:64px;border-radius:32px;background:#EEF0EC">{ic("user")}</span><span class="col"><strong style="font-size:18px">Olivier S.</strong><span class="muted">membre depuis 2019</span></span></div>',
grid(3,tile('Réalités','1 214'),tile('Notes','86'),tile('Jours de lecture','214')),
kvs(('E-mail','olivier@exemple.fr'),('Préfixe des identifiants','FAC, LIV, BIB…'),('Appareils','iPhone · iPad · Web')),
btn('Se déconnecter','line'),
),P)
screen('A04-Sauvegarde.dc.html','Sauvegarde',top('Sauvegarde et synchronisation','A01-Plus.dc.html')+scroll(
note('Tout est à jour · dernière synchronisation il y a 2 min.','phy','check'),
lst(li('iPhone d’Olivier','cet appareil','',icon='laptop',ic_color=PHY),li('iPad','il y a 1 h','',icon='laptop'),li('Navigateur','hier','',icon='globe'),title='Appareils'),
card('<div class="list">'+''.join(f'<div class="li"><span class="col"><strong style="font-weight:600">{a}</strong><span class="muted">{b}</span></span>{toggle(c)}</div>' for a,b,c in [('Sauvegardes automatiques','chaque jour à 6 h · 30 conservées',True),('Inclure les photos','2,4 Go',True),('Synchroniser sur réseau mobile','',False)])+'</div>'),
btns(btn('Sauvegarder','ink','cloud',style='flex:1'),btn('Restaurer','line','refresh',style='flex:1')),
),P)
screen('A05-ImportExport.dc.html','Importer / exporter',top('Importer et exporter','A01-Plus.dc.html')+scroll(
lst(li('Relevé bancaire','OFX, CSV · rapprochement automatique','',icon='bank',ic_color=PHY),li('Factures électroniques','Factur-X, PDF','',icon='euro',ic_color=PHY),li('Photos et scans','depuis la galerie','',icon='image',ic_color=PHY),li('Données Bible Strong','notes, surbrillances, études','',icon='book',ic_color=NUM),title='Importer'),
lst(li('Registre complet','JSON · avec le journal chaîné','',icon='download'),li('Inventaire','CSV · emplacements','',icon='download'),li('Étude','PDF · Markdown','',icon='download'),title='Exporter'),
),P)
screen('A06-Telechargements.dc.html','Téléchargements',top('Hors ligne','A01-Plus.dc.html')+scroll(
card('<div class="between"><strong>Espace utilisé</strong><span class="mono">1,2 Go</span></div>'+bar(30,NUM)),
'<div class="card" style="gap:0">'+''.join(li(n,s,chip('installé','phy') if d else btn('Télécharger','line','download',style='height:34px;font-size:13px;padding:0 10px'),icon=i,ic_color=NUM) for i,n,s,d in [('book','Bible LSG','4 Mo',True),('hash','Lexique Strong grec & hébreu','38 Mo',True),('doc','Dictionnaire Westphal','22 Mo',True),('list','Thèmes Nave','12 Mo',True),('book','Commentaire Matthew Henry','64 Mo',False),('timeline','Chronologie','18 Mo',True),('scan','Moteur OCR français','15 Mo',True)])+'</div>',
),P)
screen('A07-Theme.dc.html','Apparence',top('Apparence','A01-Plus.dc.html')+scroll(
card(ctitle('Thème')+seg('Clair','Sombre','Système',on=2)),
card(ctitle('Taille du texte biblique')+'<p class="verse">Car Dieu a tant aimé le monde…</p>'+'<span class="between"><span class="small">A</span><span style="flex:1;margin:0 10px;height:6px;border-radius:3px;background:#E3E6E0;position:relative"><i style="position:absolute;left:0;top:0;height:6px;width:55%;border-radius:3px;background:#18211F"></i></span><span style="font-size:20px">A</span></span>'),
card('<div class="list">'+''.join(f'<div class="li"><span class="col"><strong style="font-weight:600">{a}</strong></span>{toggle(b)}</div>' for a,b in [('Numéros de versets',True),('Titres de péricopes',True),('Couleur physique / numérique',True)])+'</div>'),
),P)
screen('A08-Langue.dc.html','Langue',top('Langue des ressources','A01-Plus.dc.html')+scroll(
'<div class="card">'+''.join(f'<label class="li" style="cursor:pointer"><input type="radio" name="lg" {"checked" if j==0 else ""} style="width:20px;height:20px;accent-color:#18211F"><span class="col"><strong style="font-weight:600">{a}</strong><span class="muted">{b}</span></span></label>' for j,(a,b) in enumerate([('Français','Bible, Strong, dictionnaire, commentaires'),('English','Bible, Strong, Nave, commentaries')]))+'</div>',
),P)
screen('A09-Confidentialite.dc.html','Confidentialité',top('Confidentialité','A01-Plus.dc.html')+scroll(
note('Vos réalités restent sur vos appareils. Rien n’est partagé sans votre accord.','phy','lock'),
card('<div class="list">'+''.join(f'<div class="li"><span class="col"><strong style="font-weight:600">{a}</strong><span class="muted">{b}</span></span>{toggle(c)}</div>' for a,b,c in [('Chiffrement du registre','AES-256 · clé sur l’appareil',True),('Verrouillage par Face ID','à l’ouverture',True),('Domaine « Travail » privé','masqué des appareils partagés',True),('Partage avec l’équipe Mission','14 réalités visibles',True),('Statistiques anonymes','',False)])+'</div>'),
),P)
screen('A10-Aide.dc.html','Aide',top('Aide et soutien','A01-Plus.dc.html')+scroll(
search('Chercher dans l’aide…'),
lst(li('Comment numéroter mes factures papier ?','','',icon='help'),li('Que faire quand une anomalie apparaît ?','','',icon='help'),li('Importer mes données Bible Strong','','',icon='help'),li('Imprimer des étiquettes QR','','',icon='help'),title='Questions fréquentes'),
lst(li('Écrire au support','réponse sous 48 h','',icon='note'),li('Code source','GPL-3.0 · github.com/…/empreinte-','',icon='globe'),li('Soutenir le projet','','',icon='heart'),title='Contact'),
),P)
# Desktop
side=''.join(f'<a href="{h}" class="row" style="gap:10px;padding:8px 10px;border-radius:8px;text-decoration:none;color:{INK};{"background:#FFFFFF;font-weight:600" if j==0 else ""}">{ic(i,"icon ic16")}<span style="font-size:14px">{t}</span></a>' for j,(i,t,h) in enumerate([('home','Aujourd’hui','Main.dc.html'),('layers','Réalités','F02-Realites.dc.html'),('book','Bible · Jean 3','B01-Lecteur.dc.html'),('hash','G25 ἀγαπάω','S02-Mot.dc.html'),('euro','FAC-2026-0047','C06-Fiche.dc.html'),('flag','1000 Bibles','D04-Mission.dc.html'),('shield','Vérifier · 4','V01-Verifier.dc.html')]))
SCREENS['F08-Bureau.dc.html']=dict(title='Empreinte sur ordinateur',page='fondations',w=1280,h=820,body=f'''<div style="display:flex;width:1280px;height:820px;background:#F2F3EF">
<aside style="width:250px;background:#E9EBE6;border-right:1px solid #DDE0D9;padding:20px 14px;display:flex;flex-direction:column;gap:4px"><div class="row" style="padding:0 6px 14px">{LOGO}<span class="h2" style="font-size:19px">Empreinte</span></div>{side}<div style="margin-top:auto" class="row">{chip("+ Onglet","ghost")}{chip("Groupe","ghost")}</div></aside>
<main style="flex:1;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:20px;padding:28px">
<section style="display:flex;flex-direction:column;gap:14px"><div class="row" style="gap:6px">{chip("Jean 3","ghost","height:34px;font-size:14px")}{chip("LSG","ghost","height:34px;font-size:14px")}</div>
<p class="verse"><span class="vn">15</span>afin que quiconque croit en lui ait la vie éternelle.</p><p class="verse" style="background:#FFF2C9;border-radius:6px;padding:2px 8px;margin:0 -8px"><span class="vn">16</span>Car Dieu a tant aimé le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.</p><p class="verse"><span class="vn">17</span>Dieu, en effet, n’a pas envoyé son Fils dans le monde pour qu’il juge le monde, mais pour que le monde soit sauvé par lui.</p>
<div class="card"><span class="eyebrow">Empreintes de ce verset</span><div class="list">{li("BIB-2026-0001","Bible Segond 21 · exemplaire de mission · Étagère 1","",icon="book",ic_color=PHY)}{li("Carnet p. 34","« Relire Jean 3:16 avec le groupe »","",icon="note",ic_color=NUM)}{li("MIS-2026-0002","Marque-page Jean 3:16 offert avec chaque Bible","",icon="flag",ic_color=PHY)}</div></div></section>
<section style="display:flex;flex-direction:column;gap:14px"><div class="card"><div class="between"><span class="mono" style="font-size:22px">FAC-2026-0047</span>{chip("à vérifier","crit")}</div><span class="muted">Facture de rachat F-47 · Antiquités Martin</span>{path("Classeur 02","Section B","Pochette 14",mono=True)}</div>
<div class="card"><span class="h2">Vérifications</span><div class="list">{li("Montants différents","1 250 € / 1 520 €",chip("critique","crit"),sev=CRIT)}{li("Paiement sans justificatif","PAY-2026-0001",chip("attention","warn"),sev=WARN)}{li("Original introuvable","LIV-2026-0031",chip("attention","warn"),sev=WARN)}</div></div>
<div class="card"><span class="h2">Mission · 1000 Bibles</span><span class="mono" style="font-size:24px">640 / 1000</span>{bar(64)}</div></section>
</main></div>''')
