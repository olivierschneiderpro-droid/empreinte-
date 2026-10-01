from lum import *
G='compte'
screen('LA01-Plus','Plus',shell(
body(f'''<div class="row" style="gap:14px"><span style="width:60px;height:60px;border-radius:30px;background:#111113;display:flex;align-items:center;justify-content:center">{dot("O",26,"#FFFFFF")}</span><span class="col"><h1 class="h1" style="font-size:24px">Olivier S.</h1><span class="sub">3 appareils · synchronisé</span></span></div>
{card("".join(item(a,b,ic("fwd",15),lead=lead(i),first=(k==0)) for k,(a,b,i) in enumerate([('Ma bibliothèque','surbrillances, notes, études','book'),('Domaines de vie','6 domaines','grid'),('Organisation physique','plan D · 2 classeurs','folder')])),pad="6px 18px",gap=0)}
{card("".join(item(a,b,ic("fwd",15),lead=lead(i),first=(k==0)) for k,(a,b,i) in enumerate([('Sauvegarde et synchronisation','à jour','cloud'),('Importer, exporter','PDF, OFX, Factur-X','upload'),('Hors ligne','1,2 Go','download'),('Confidentialité','chiffrement local','lock'),('Aide et soutien','','help')])),pad="6px 18px",gap=0)}''',top_=60),'home'),G)
screen('LA02-Connexion','Connexion',shell(
body(f'''<div class="col" style="align-items:center;gap:12px;margin:30px 0 20px">{l.FP.replace('width="22" height="22"','width="64" height="64"')}<h1 class="h1" style="font-size:34px">empreinte</h1><span class="sub" style="text-align:center">Vos réalités, sur tous vos appareils.<br>Sans compte, tout reste sur ce téléphone.</span></div>
<div class="inp">olivier@exemple.fr</div><div class="inp" style="justify-content:space-between">••••••••••{ic("eye",18)}</div>
<a href="#" style="align-self:flex-end;font:600 13px Geist;color:{TX}">Mot de passe oublié ?</a>
<a href="#" class="btn k">Se connecter</a><a href="#" class="btn w">Créer un compte</a>
<a href="#" style="text-align:center;font:600 14px Geist;color:{TX};margin-top:6px">Continuer sans compte</a>''',top_=60,bottom=30),None),G)
screen('LA03-Profil','Profil',shell(
top('#',chipc('Profil'),None)+
body(f'''<div class="col" style="align-items:center;gap:8px"><span style="width:96px;height:96px;border-radius:48px;background:#111113;display:flex;align-items:center;justify-content:center">{dot("O",40,"#FFFFFF")}</span><h1 class="h1">Olivier S.</h1><span class="sub">membre depuis 2019</span></div>
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">{"".join(f'<div class="g" style="border-radius:20px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:none">{dot(v,24)}<span style="font-size:11px;color:{MU}">{t}</span></div>' for v,t in [('1214','réalités'),('86','notes'),('214','jours lus')])}</div>
{card("".join(f'<div class="btw" style="padding:9px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="font-size:13px;color:{MU}">{a}</span><span style="font-weight:600;font-size:13.5px">{b}</span></div>' for k,(a,b) in enumerate([('E-mail','olivier@exemple.fr'),('Préfixes','FAC, LIV, BIB…'),('Appareils','iPhone · iPad · Web')])),pad="6px 18px",gap=0)}
<a href="#" class="btn w" style="margin-top:auto">Se déconnecter</a>''',top_=110,bottom=30),None),G)
screen('LA04-Sauvegarde','Sauvegarde',shell(
top('#',chipc(f'{sw(GRN,7,4)}À jour · il y a 2 min'),None)+
body(f'''<h1 class="h1">Partout, la même<br>empreinte.</h1>
<div class="row" style="gap:10px;justify-content:center;height:120px;align-items:flex-end;margin-top:14px">{"".join(f'<div class="col" style="align-items:center;gap:6px"><span style="width:{w}px;height:{h}px;border-radius:{r}px;border:2.5px solid #111113;background:rgba(255,255,255,.7)"></span><span style="font:600 11px Geist">{n}</span></div>' for w,h,r,n in [(46,90,12,'iPhone'),(74,100,10,'iPad'),(120,78,6,'Web')])}</div>
{card("".join(f'<div class="btw" style="padding:10px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span class="col"><span style="font-size:14px;font-weight:600">{a}</span><span style="font-size:12px;color:{MU}">{b}</span></span>{tog(c)}</div>' for k,(a,b,c) in enumerate([('Sauvegardes automatiques','chaque jour à 6 h · 30 conservées',True),('Inclure les photos','2,4 Go',True),('Réseau mobile','',False)])),pad="6px 18px",gap=0)}
<div class="row" style="gap:10px;margin-top:auto"><a href="#" class="btn k" style="flex:1">Sauvegarder</a><a href="#" class="btn w" style="flex:1">Restaurer</a></div>''',top_=110,bottom=30),None),G)
screen('LA05-ImportExport','Importer, exporter',shell(
top('#',chipc('Importer, exporter'),None)+
body(f'''{micro("Importer")}
<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">{"".join(f'<a href="#" class="g" style="border-radius:22px;padding:14px;display:flex;flex-direction:column;gap:8px;text-decoration:none;color:{TX};box-shadow:none">{lead(i)}<strong style="font-size:14px">{t}</strong><span style="font-size:11.5px;color:{MU}">{s}</span></a>' for i,t,s in [('bank','Relevé bancaire','OFX, CSV'),('euro','Factures','Factur-X, PDF'),('image','Photos et scans','galerie'),('book','Bible Strong','notes, études')])}</div>
{micro("Exporter")}
{card("".join(item(a,b,ic("download",17),first=(k==0)) for k,(a,b) in enumerate([('Registre complet','JSON · avec le journal scellé'),('Inventaire','CSV · emplacements'),('Étude','PDF · Markdown')])),pad="6px 18px",gap=0)}''',top_=110,bottom=30),None),G)
dl=[('Bible LSG','4 Mo',True),('Lexique Strong','38 Mo',True),('Dictionnaire Westphal','22 Mo',True),('Thèmes Nave','12 Mo',True),('Commentaire M. Henry','64 Mo',False),('Moteur OCR français','15 Mo',True)]
screen('LA06-Telechargements','Hors ligne',shell(
top('#',chipc('Hors ligne'),None)+
body(f'''<div class="row" style="align-items:baseline;gap:6px">{dot("1,2",64)}<span class="dot" style="font-size:24px;color:rgba(17,17,19,.3)">Go</span></div>
{bar(30,TX,6)}
{card("".join(f'<div class="btw" style="padding:10px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span class="col"><strong style="font-size:14px">{a}</strong><span class="gm" style="font-size:11px;color:{MU}">{b}</span></span>{ic("check",17,GRN,2.2) if d else "<span class=\'pill on\'>Télécharger</span>"}</div>' for k,(a,b,d) in enumerate(dl)),pad="6px 18px",gap=0)}''',top_=110,bottom=30),None),G)
screen('LA07-Apparence','Apparence',shell(
top('#',chipc('Apparence'),None)+
body(f'''{seg(["Clair","Sombre","Système"],2)}
{card(f'{micro("Taille du texte biblique")}<p class="verse">Car Dieu a tant aimé le monde…</p><div class="row" style="gap:12px"><span style="font-size:13px">A</span><span style="flex:1;position:relative;height:4px;border-radius:2px;background:rgba(17,17,19,.1)"><i style="position:absolute;left:0;top:0;height:4px;width:55%;border-radius:2px;background:#111113"></i><i style="position:absolute;top:-8px;left:calc(55% - 10px);width:20px;height:20px;border-radius:10px;background:#FFFFFF;box-shadow:0 1px 5px rgba(0,0,0,.25)"></i></span><span style="font-size:22px">A</span></div>')}
{card("".join(f'<div class="btw" style="padding:10px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="font-size:14px">{a}</span>{tog(b)}</div>' for k,(a,b) in enumerate([('Numéros de versets',True),('Titres de sections',True),('Chiffres en points',True),('Réduire les effets de verre',False)])),pad="6px 18px",gap=0)}''',top_=110,bottom=30),None),G)
screen('LA08-Langue','Langue',shell(
top('#',chipc('Langue des ressources'),None)+
body("".join(f'<div class="g" style="border-radius:22px;padding:16px;display:flex;align-items:center;gap:14px;box-shadow:none;{"border:2px solid #111113" if k==0 else ""}">{dot(c,26)}<span class="col" style="flex:1"><strong style="font-size:15px">{a}</strong><span style="font-size:12px;color:{MU}">{b}</span></span>{ic("check",18,TX,2.2) if k==0 else ""}</div>' for k,(c,a,b) in enumerate([('FR','Français','Bible, Strong, dictionnaire, commentaires'),('EN','English','Bible, Strong, Nave, commentaries')]))+micro("Version biblique par défaut")+card("".join(f'<div class="btw" style="padding:10px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span class="row" style="gap:12px"><span style="width:44px;height:30px;border-radius:9px;background:{"#111113" if k==0 else SOFT};color:{"#FFFFFF" if k==0 else TX};display:flex;align-items:center;justify-content:center;font:700 11px Geist Mono">{c}</span><span style="font-size:14px">{n}</span></span>{ic("check",17,TX,2.2) if k==0 else ""}</div>' for k,(c,n) in enumerate([('LSG','Louis Segond 1910'),('DBY','Darby'),('OST','Ostervald')])),pad="6px 18px",gap=0),top_=110,bottom=30),None),G)
screen('LA09-Confidentialite','Confidentialité',shell(
top('#',chipc('Confidentialité'),None)+
body(f'''<div class="col" style="align-items:center;gap:10px;margin:6px 0"><span style="width:76px;height:76px;border-radius:24px;background:#111113;display:flex;align-items:center;justify-content:center">{ic("lock",32,"#FFFFFF",2)}</span><h1 class="h1" style="text-align:center">Vos réalités restent<br>chez vous.</h1></div>
{card("".join(f'<div class="btw" style="padding:10px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span class="col"><span style="font-size:14px;font-weight:600">{a}</span><span style="font-size:12px;color:{MU}">{b}</span></span>{tog(c)}</div>' for k,(a,b,c) in enumerate([('Chiffrement du registre','AES-256 · clé sur l’appareil',True),('Face ID','à l’ouverture',True),('Domaine « Travail » privé','masqué des appareils partagés',True),('Équipe Mission','14 réalités partagées',True),('Statistiques anonymes','',False)])),pad="6px 18px",gap=0)}''',top_=110,bottom=30),None),G)
screen('LA10-Aide','Aide',shell(
top('#',chipc('Aide et soutien'),None)+
body(f'''{search("Chercher dans l’aide…")}
{card("".join(item(a,"",ic("fwd",15),lead=lead("help"),first=(k==0)) for k,a in enumerate(['Numéroter mes factures papier','Que faire face à une anomalie ?','Importer mes données Bible Strong','Imprimer des étiquettes QR'])),pad="6px 18px",gap=0)}
{card("".join(item(a,b,ic("fwd",15),lead=lead(i),first=(k==0)) for k,(a,b,i) in enumerate([('Écrire au support','réponse sous 48 h','note'),('Code source','GPL-3.0 · ouvert','globe'),('Soutenir le projet','','heart')])),pad="6px 18px",gap=0)}''',top_=110,bottom=30),None),G)
