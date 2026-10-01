from base import *
P='strong'
lex=[('G25','ἀγαπάω','agapaō','aimer'),('G26','ἀγάπη','agapē','amour'),('G5368','φιλέω','phileō','aimer d’affection'),('G2316','θεός','theos','Dieu'),('G2889','κόσμος','kosmos','monde'),('G4100','πιστεύω','pisteuō','croire')]
screen('S01-Lexique.dc.html','Lexique',top('Lexique','B09-Ressources.dc.html')+scroll(
seg('Grec','Hébreu',on=0),search('Mot, translittération ou numéro…'),
'<div class="card" style="gap:0">'+''.join(li(f'<span class="serif" style="font-size:18px">{g}</span> <span class="muted" style="font-weight:400">{t}</span>',d,f'<span class="mono small" style="color:{NUM}">{c}</span>',href='S02-Mot.dc.html') for c,g,t,d in lex)+'</div>',
),P)
screen('S02-Mot.dc.html','G25 ἀγαπάω',top('Strong G25','S01-Lexique.dc.html',ibtn('mark','Marque-page'))+scroll(
'<div style="display:flex;flex-direction:column;gap:4px"><span class="serif" style="font-size:40px">ἀγαπάω</span><span class="muted">agapaō · a-ga-pa-o · verbe</span></div>',
card('<span class="eyebrow">Définition</span><span>Aimer, chérir ; prendre plaisir en ; aimer d’un amour de choix et de volonté.</span><span class="muted">Origine : peut-être de ἄγαν (beaucoup).</span>'),
grid(3,tile('Occurrences','143',href='S03-Concordance.dc.html'),tile('Livres','26',href='S04-ParLivre.dc.html'),tile('Mots liés','4',href='S05-MotsLies.dc.html')),
lst(li('Concordance','143 versets','',icon='list',ic_color=NUM,href='S03-Concordance.dc.html'),li('Dictionnaire','« Amour » · Westphal','',icon='doc',ic_color=NUM,href='S06-Dictionnaire.dc.html'),li('Dans mes notes','3 notes · 1 étude','',icon='note',ic_color=NUM,href='L04-Notes.dc.html')),
),P)
screen('S03-Concordance.dc.html','Concordance',top('G25 · concordance','S02-Mot.dc.html',ibtn('filter','Filtrer'))+scroll(
'<span class="muted">143 versets · traduit « aimer » (135), « chérir » (8)</span>',
'<div class="card" style="gap:0">'+''.join(f'<a href="B01-Lecteur.dc.html" class="li" style="flex-direction:column;align-items:flex-start;gap:3px"><span class="mono small" style="color:{NUM}">{r}</span><span class="serif" style="font-size:15px">{t}</span></a>' for r,t in [('Jean 3:16','Car Dieu a tant <b>aimé</b> le monde…'),('Jean 13:34','…<b>aimez</b>-vous les uns les autres…'),('Jean 14:21','Celui qui a mes commandements et qui les garde, c’est celui qui m’<b>aime</b>…'),('Romains 8:28','…toutes choses concourent au bien de ceux qui <b>aiment</b> Dieu…'),('1 Jean 4:19','Pour nous, nous l’<b>aimons</b>, parce qu’il nous a <b>aimés</b> le premier.')])+'</div>',
),P)
bk=[('1 Jean',31),('Jean',37),('Matthieu',8),('Romains',8),('Luc',13),('Éphésiens',10)]
screen('S04-ParLivre.dc.html','Concordance par livre',top('G25 · par livre','S02-Mot.dc.html')+scroll(
'<div class="card" style="gap:10px">'+''.join(f'<div style="display:flex;flex-direction:column;gap:4px"><span class="between"><span>{b}</span><span class="mono small">{n}</span></span>{bar(int(n/37*100),NUM)}</div>' for b,n in sorted(bk,key=lambda x:-x[1]))+'</div>',
),P)
screen('S05-MotsLies.dc.html','Mots liés',top('G25 · mots liés','S02-Mot.dc.html')+scroll(
'<div class="card" style="gap:0">'+''.join(li(f'<span class="serif" style="font-size:18px">{g}</span> <span class="muted" style="font-weight:400">{t}</span>',d,f'<span class="mono small" style="color:{NUM}">{c}</span>',href='S02-Mot.dc.html') for c,g,t,d in [('G26','ἀγάπη','agapē','amour · nom'),('G27','ἀγαπητός','agapētos','bien-aimé'),('G5368','φιλέω','phileō','aimer d’affection'),('H157','אָהַב','ahab','aimer · hébreu')])+'</div>',
),P)
screen('S06-Dictionnaire.dc.html','Dictionnaire',top('Dictionnaire','B09-Ressources.dc.html')+scroll(
search('Chercher un mot…'),
card('<span class="eyebrow">Westphal · Amour</span><span class="serif" style="font-size:16px;line-height:1.6">L’amour est l’essence même de Dieu ; il se manifeste d’abord dans le don qu’il fait de lui-même. Dans le Nouveau Testament, l’<span style="color:#2E46C2">agapè</span> désigne un amour de choix, qui se donne…</span><a href="B01-Lecteur.dc.html" class="small">Jean 3:16 · 1 Jean 4:8-10 · Romains 5:8</a>'),
lst(li('Nicodème','pharisien, chef des Juifs','',icon='doc'),li('Serpent d’airain','Nombres 21:4-9','',icon='doc'),title='Autres articles du passage'),
),P)
screen('S07-Nave.dc.html','Thèmes Nave',top('Thèmes Nave','B09-Ressources.dc.html')+scroll(
search('Chercher un thème…'),
card('<span class="eyebrow">Thème</span><strong style="font-size:18px">Amour de Dieu</strong><div class="list">'+''.join(f'<a href="B01-Lecteur.dc.html" class="li"><span class="col"><strong style="font-weight:600">{a}</strong><span class="muted mono small">{b}</span></span></a>' for a,b in [('Révélé dans le don du Fils','Jean 3:16 · Romains 5:8 · 1 Jean 4:9'),('Éternel','Jérémie 31:3'),('Inséparable','Romains 8:35-39')])+'</div>'),
lst(li('Nouvelle naissance','Jean 3:3-8','',icon='list',ic_color=NUM),li('Foi','Jean 3:15-18','',icon='list',ic_color=NUM),title='Autres thèmes du passage'),
),P)
screen('S08-Entites.dc.html','Personnes et lieux',top('Nicodème','B09-Ressources.dc.html')+scroll(
f'<div class="row" style="gap:14px"><span class="ibox" style="width:56px;height:56px;border-radius:28px;background:#E6EAFB;color:{NUM}">{ic("user")}</span><span class="col"><strong style="font-size:18px">Nicodème</strong><span class="muted">Personne · pharisien · membre du sanhédrin</span></span></div>',
lst(li('Jean 3:1-21','vient voir Jésus de nuit','',icon='book',ic_color=NUM),li('Jean 7:50','défend Jésus devant les pharisiens','',icon='book',ic_color=NUM),li('Jean 19:39','apporte la myrrhe pour l’ensevelissement','',icon='book',ic_color=NUM),title='Apparitions'),
lst(li('Jésus','rencontre','',icon='user'),li('Joseph d’Arimathée','ensevelissement','',icon='user'),li('Jérusalem','lieu','',icon='map'),title='Relations'),
),P)
screen('S09-Commentaires.dc.html','Commentaires',top('Commentaires','B09-Ressources.dc.html',ibtn('cog','Bibliothèque de commentaires'))+scroll(
seg('Matthew Henry','Spurgeon','Calvin',on=0),
card('<span class="eyebrow">Jean 3:16 · section 2</span><span class="serif" style="font-size:16px;line-height:1.6">Voici l’amour de Dieu dans toute son étendue : il a tant aimé le monde, non pas une nation seulement… Le don de son Fils est la preuve et la mesure de cet amour.</span>'),
lst(li('Jean 3:1-8','La nouvelle naissance','',icon='doc'),li('Jean 3:9-21','Le serpent élevé, l’amour de Dieu','',icon='doc'),title='Sections du chapitre'),
),P)
per=[('Patriarches','2000-1500 av. J.-C.'),('Exode et conquête','1500-1050'),('Royaume uni','1050-930'),('Exil','586-538'),('Ministère de Jésus','27-30 ap. J.-C.'),('Église primitive','30-100')]
screen('S10-Chronologie.dc.html','Chronologie',top('Chronologie','B09-Ressources.dc.html',ibtn('search','Chercher un événement'))+scroll(
'<div style="position:relative;padding-left:22px;display:flex;flex-direction:column;gap:10px"><span style="position:absolute;left:7px;top:6px;bottom:6px;width:2px;background:#C9CEC6"></span>'+''.join(f'<div class="card" style="position:relative;padding:10px 12px;{"border-color:#2E46C2;background:#E6EAFB" if n.startswith("Min") else ""}"><span style="position:absolute;left:-21px;top:16px;width:12px;height:12px;border-radius:6px;background:{NUM if n.startswith("Min") else "#FFFFFF"};border:2px solid {NUM if n.startswith("Min") else "#8A948F"}"></span><strong style="font-weight:600">{n}</strong><span class="muted mono small">{d}</span></div>' for n,d in per)+'</div>',
card('<span class="eyebrow">Événement</span><strong>Entretien avec Nicodème</strong><span class="muted">Jérusalem · vers 27 ap. J.-C. · Jean 3</span>'),
),P)
screen('S11-Recherche.dc.html','Recherche biblique',top('',None,None,chip=f'<div class="search" style="flex:1;color:#18211F">{ic("search")}<span>vie éternelle</span></div>')+scroll(
seg('Bible','Strong','Dictionnaire','Notes',on=0),
'<span class="muted">43 versets · LSG · recherche hors ligne</span>',
'<div class="card" style="gap:0">'+''.join(f'<a href="B01-Lecteur.dc.html" class="li" style="flex-direction:column;align-items:flex-start;gap:3px"><span class="mono small" style="color:{NUM}">{r}</span><span class="serif" style="font-size:15px">{t}</span></a>' for r,t in [('Jean 3:16','…mais qu’il ait la <b>vie éternelle</b>.'),('Jean 17:3','Or, la <b>vie éternelle</b>, c’est qu’ils te connaissent…'),('Romains 6:23','…le don gratuit de Dieu, c’est la <b>vie éternelle</b>…'),('1 Jean 5:11','…Dieu nous a donné la <b>vie éternelle</b>…')])+'</div>',
),P)
screen('S12-Assistant.dc.html','Assistant d’étude',top('Assistant d’étude','B01-Lecteur.dc.html')+scroll(
f'<div class="card" style="align-self:flex-end;max-width:80%;background:#18211F;color:#FFFFFF">Pourquoi Jean utilise-t-il ἀγαπάω ici plutôt que φιλέω ?</div>',
card(f'<span class="row" style="gap:6px;color:{NUM}">{ic("sparkle","icon ic16")}<span class="small" style="font-weight:600">Assistant</span></span><span>Dans Jean 3:16, <a href="S02-Mot.dc.html">ἀγαπάω (G25)</a> exprime un amour qui se donne par choix. <a href="S05-MotsLies.dc.html">φιλέω (G5368)</a> évoque plutôt l’affection… Jean emploie les deux en Jean 21:15-17.</span><span class="muted small">Sources : Lexique Strong · Westphal · Matthew Henry</span>'),
note('L’assistant cite ses sources et ne remplace pas la lecture : il vous renvoie au texte.','num','book'),
f'<div class="search" style="margin-top:auto">{ic("sparkle")}<span>Poser une question sur Jean 3…</span></div>',
),P)
