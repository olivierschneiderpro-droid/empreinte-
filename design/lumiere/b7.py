from lum import *
G='strong'
BG='img:route'
lex=[('G25','ἀγαπάω','agapaō','aimer'),('G26','ἀγάπη','agapē','amour'),('G5368','φιλέω','phileō','aimer d’affection'),('G2316','θεός','theos','Dieu'),('G2889','κόσμος','kosmos','monde'),('G4100','πιστεύω','pisteuō','croire')]
screen('LS01-Lexique','Lexique',shell(
top('#',chipc('Lexique'),None)+
body(f'''{seg(["Grec","Hébreu"],0)}{search("Mot, translittération, numéro…")}
{card("".join(f'<div class="row" style="padding:10px 0;gap:14px;{"" if k==0 else "border-top:1px solid "+LINE}">{dot(c,18,TX,"width:70px")}<span class="col" style="flex:1"><span style="font:500 20px Literata,serif;line-height:1.2">{g}</span><span style="font-size:12px;color:{MU}">{t} · {d}</span></span></div>' for k,(c,g,t,d) in enumerate(lex)),pad="6px 18px",gap=0)}''',top_=110,bottom=104),'book',BG),G)
screen('LS02-Mot','G25 ἀγαπάω',shell(
top('#',chipc('Strong G25'),gbtn('mark','Marque-page'))+
body(f'''<div class="col" style="gap:4px">{dot("G25",28)}<span style="font:500 50px/1.1 Literata,serif">ἀγαπάω</span><span class="sub">agapaō · a-ga-pa-o · verbe</span></div>
{card(f'{micro("Définition")}<span style="font:400 16px/1.55 Literata,serif">Aimer, chérir ; prendre plaisir en ; aimer d’un amour de choix et de volonté, qui se donne.</span><span style="font-size:12.5px;color:{MU}">Origine : peut-être de ἄγαν, beaucoup.</span>')}
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">{"".join(f'<a href="#" class="g" style="border-radius:20px;padding:12px;display:flex;flex-direction:column;gap:2px;text-decoration:none;color:{TX};box-shadow:none">{dot(v,28)}<span style="font-size:11.5px;color:{MU}">{t}</span></a>' for v,t in [('143','occurrences'),('26','livres'),('4','mots liés')])}</div>
{card("".join(item(a,b,ic("fwd",16),lead=lead(i),first=(k==0)) for k,(a,b,i) in enumerate([('Dans mes notes','3 notes · 1 étude','note'),('Dictionnaire','« Amour » · Westphal','paper')])),pad="6px 18px",gap=0)}''',top_=110,bottom=104),'book',BG),G)
conc=[('Jean 3:16','Car Dieu a tant <b>aimé</b> le monde…'),('Jean 13:34','…<b>aimez</b>-vous les uns les autres…'),('Romains 8:28','…de ceux qui <b>aiment</b> Dieu…'),('1 Jean 4:19','Nous l’<b>aimons</b>, parce qu’il nous a <b>aimés</b> le premier.')]
screen('LS03-Concordance','Concordance',shell(
top('#',chipc('G25 · concordance'),gbtn('filter','Filtrer'))+
body(f'''<div class="row" style="gap:8px">{dot("143",40)}<span class="sub">versets · traduit « aimer » (135), « chérir » (8)</span></div>
{"".join(card(f'<span class="gm" style="font-size:11.5px;color:{MU}">{r}</span><span style="font:400 16px/1.5 Literata,serif">{t}</span>',pad="12px 16px",gap=4) for r,t in conc)}''',top_=110,bottom=104),'book',BG),G)
bk=[('Jean',37),('1 Jean',31),('Luc',13),('Éphésiens',10),('Matthieu',8),('Romains',8)]
screen('LS04-ParLivre','Par livre',shell(
top('#',chipc('G25 · par livre'),None)+
body(card("".join(f'<div class="row" style="padding:10px 0;gap:12px;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="width:84px;font-weight:600;font-size:13.5px">{b}</span><span style="flex:1">{bar(int(n/37*100),TX,8)}</span>{dot(str(n),20,TX,"width:30px;text-align:right")}</div>' for k,(b,n) in enumerate(bk)),pad="6px 18px",gap=0)+card(micro("Nouveau Testament · 27 livres")+'<div style="display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:4px">'+"".join(f'<span style="height:26px;border-radius:6px;background:rgba(17,17,19,{a})"></span>' for a in [.25,.12,.4,.9,.05,.25,.2,.1,.05,.3,.15,.1,.1,.08,.1,.05,.05,.15,.1,.1,.1,.8,.1,.15,.05,.05,.1])+'</div><span style="font-size:12px;color:'+MU+'">Plus le carré est sombre, plus le mot est fréquent.</span>')+card(micro("Traductions")+'<div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill on">aimer · 135</span><span class="pill">chérir · 8</span></div>'),top_=110,bottom=104),'book',BG),G)
rel=[('G26','ἀγάπη','agapē · amour'),('G27','ἀγαπητός','agapētos · bien-aimé'),('G5368','φιλέω','phileō · aimer d’affection'),('H157','אָהַב','ahab · aimer (hébreu)')]
screen('LS05-MotsLies','Mots liés',shell(
top('#',chipc('G25 · mots liés'),None)+
body(f'''<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">{"".join(f'<a href="#" class="g" style="border-radius:22px;padding:16px;display:flex;flex-direction:column;gap:6px;text-decoration:none;color:{TX};box-shadow:none">{dot(c,18)}<span style="font:500 28px Literata,serif">{g}</span><span style="font-size:12px;color:{MU}">{t}</span></a>' for c,g,t in rel)}</div>
{card(f'{micro("ἀγαπάω et φιλέω · Jean 21:15-17")}<span style="font:400 15.5px/1.55 Literata,serif">« Simon, m’<b>aimes</b>-tu (ἀγαπᾷς) ? » — « Tu sais que je t’<b>aime</b> (φιλῶ). » La troisième fois, Jésus reprend le mot de Pierre.</span><a href="#" style="font:600 13px Geist;color:#111113">Ouvrir Jean 21 ›</a>')}''',top_=110,bottom=104),'book',BG),G)
screen('LS06-Dictionnaire','Dictionnaire',shell(
top('#',chipc('Dictionnaire · Westphal'),None)+
body(f'''{search("Chercher un mot…")}
<div class="col" style="gap:4px"><span class="micro">Article</span><h1 class="h1" style="font-size:34px">Amour</h1></div>
<p style="margin:0;font:400 17px/1.7 Literata,serif">L’amour est l’essence même de Dieu ; il se manifeste d’abord dans le don qu’il fait de lui-même. Dans le Nouveau Testament, l’<em>agapè</em> désigne un amour de choix, qui se donne…</p>
<div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill">Jean 3:16</span><span class="pill">1 Jean 4:8-10</span><span class="pill">Romains 5:8</span></div>
{card("".join(item(a,b,ic("fwd",16),first=(k==0)) for k,(a,b) in enumerate([('Charité','1 Corinthiens 13'),('Grâce','Éphésiens 2:8'),('Miséricorde','Luc 6:36')])),pad="6px 18px",gap=0)}''',top_=110,bottom=104),'book',BG),G)
screen('LS07-Nave','Thèmes Nave',shell(
top('#',chipc('Thèmes Nave'),None)+
body(f'''{search("Chercher un thème…")}
<div class="col" style="gap:4px"><span class="micro">Thème</span><h1 class="h1">Amour de Dieu</h1></div>
{card("".join(f'<div class="col" style="padding:10px 0;gap:2px;{"" if k==0 else "border-top:1px solid "+LINE}"><strong style="font-size:14px">{a}</strong><span class="gm" style="font-size:11.5px;color:{MU}">{b}</span></div>' for k,(a,b) in enumerate([('Révélé dans le don du Fils','Jean 3:16 · Romains 5:8 · 1 Jean 4:9'),('Éternel','Jérémie 31:3'),('Inséparable','Romains 8:35-39')])),pad="6px 18px",gap=0)}
{card(f'<span class="gm" style="font-size:11.5px;color:{MU}">Romains 8:38-39</span><span style="font:400 15.5px/1.55 Literata,serif">…ni la mort ni la vie, … ni aucune autre créature ne pourra nous séparer de l’amour de Dieu…</span>',pad="12px 16px",gap=4)}
<div class="row" style="gap:6px"><span class="pill">Nouvelle naissance</span><span class="pill">Foi</span><span class="pill">Grâce</span></div>''',top_=110,bottom=104),'book',BG),G)
screen('LS08-Entites','Nicodème',shell(
top('#',chipc('Personne'),None)+
body(f'''<div class="row" style="gap:16px"><span style="width:80px;height:80px;border-radius:40px;overflow:hidden;flex:none"><img src="{IMG['elie']}" alt="" style="width:100%;height:100%;object-fit:cover;filter:saturate(.15)"></span><span class="col" style="gap:4px"><h1 class="h1">Nicodème</h1><span class="sub">pharisien · membre du sanhédrin</span></span></div>
{micro("Apparitions")}
<div class="col" style="gap:0;position:relative;padding-left:24px"><span style="position:absolute;left:6px;top:8px;bottom:8px;width:2px;background:rgba(17,17,19,.12)"></span>{"".join(f'<div style="position:relative;padding:8px 0"><span style="position:absolute;left:-24px;top:13px;width:14px;height:14px;border-radius:7px;background:#FFFFFF;border:2.5px solid #111113;box-sizing:border-box"></span><strong class="gm" style="font-size:12.5px">{r}</strong><div style="font-size:13.5px">{t}</div></div>' for r,t in [('Jean 3:1-21','vient voir Jésus de nuit'),('Jean 7:50','défend Jésus devant les pharisiens'),('Jean 19:39','apporte la myrrhe')])}</div>
<div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill">Jésus · rencontre</span><span class="pill">Joseph d’Arimathée</span><span class="pill">Jérusalem · lieu</span></div>
{card(f'{micro("Dans vos réalités")}'+"".join(item(a,b,"",lead=lead(i),first=(k==0)) for k,(a,b,i) in enumerate([('Étude · Nouvelle naissance','cite Nicodème 4 fois','note'),('Carnet p. 21','« Nicodème vient de nuit »','pen')])),pad="12px 18px 6px",gap=2)}''',top_=110,bottom=104),'book',BG),G)
screen('LS09-Commentaires','Commentaires',shell(
top('#',chipc('Commentaires'),gbtn('cog','Bibliothèque'))+
body(f'''{seg(["Matthew Henry","Spurgeon","Calvin"],0)}
<div class="col" style="gap:4px"><span class="micro">Jean 3:16 · section 2</span><h1 class="h1" style="font-size:24px">L’amour de Dieu dans toute son étendue</h1></div>
<p style="margin:0;font:400 17px/1.7 Literata,serif">Il a tant aimé le monde, non pas une nation seulement… Le don de son Fils est la preuve et la mesure de cet amour.</p>
{card("".join(item(a,b,ic("fwd",16),first=(k==0)) for k,(a,b) in enumerate([('Jean 3:1-8','la nouvelle naissance'),('Jean 3:9-21','le serpent élevé')])),pad="6px 18px",gap=0)}''',top_=110,bottom=104),'book',BG),G)
per=[('p1','Patriarches','2000-1500 av. J.-C.'),('elie','Prophètes','870-430'),('p12','Ministère de Jésus','27-30 ap. J.-C.')]
screen('LS10-Chronologie','Chronologie',shell(
top('#',chipc('Chronologie'),gbtn('search','Chercher'))+
body(f'''{"".join(f'<div class="g" style="border-radius:24px;overflow:hidden;padding:0;display:flex;height:110px;box-shadow:none;{"border:2px solid #111113" if k==2 else ""}"><img src="{IMG[i]}" alt="" style="width:110px;height:110px;object-fit:cover;filter:saturate(.2)"><span class="col" style="padding:14px 16px;justify-content:center;gap:4px"><strong style="font-size:15px">{t}</strong><span class="gm" style="font-size:11.5px;color:{MU}">{d}</span></span></div>' for k,(i,t,d) in enumerate(per))}
{card(f'{micro("Événement")}<strong style="font-size:15px">Entretien avec Nicodème</strong><span style="font-size:12.5px;color:{MU}">Jérusalem · vers 27 ap. J.-C. · Jean 3</span>')}''',top_=110,bottom=104),'book',BG),G)
screen('LS11-Recherche','Recherche biblique',shell(
f'<div style="position:absolute;top:54px;left:16px;right:16px">{search("vie éternelle",True)}</div>'+
body(f'''{seg(["Bible","Strong","Dictionnaire","Notes"],0)}
<div class="row" style="gap:8px">{dot("43",30)}<span class="sub">versets · LSG · hors ligne</span></div>
{"".join(card(f'<span class="gm" style="font-size:11.5px;color:{MU}">{r}</span><span style="font:400 16px/1.5 Literata,serif">{t}</span>',pad="12px 16px",gap=4) for r,t in [('Jean 3:16','…qu’il ait la <b>vie éternelle</b>.'),('Jean 17:3','Or, la <b>vie éternelle</b>, c’est qu’ils te connaissent…'),('Romains 6:23','…le don gratuit de Dieu, c’est la <b>vie éternelle</b>…')])}''',top_=118,bottom=104),'book',BG),G)
screen('LS12-Assistant','Assistant d’étude',shell(
top('#',chipc(f'{ic("sparkle",14)}Assistant d’étude'),None)+
body(f'''<div style="align-self:flex-end;max-width:78%;background:#111113;color:#FFFFFF;border-radius:22px 22px 6px 22px;padding:12px 16px;font-size:14.5px">Pourquoi Jean utilise-t-il ἀγαπάω ici plutôt que φιλέω ?</div>
<div class="g" style="max-width:88%;border-radius:22px 22px 22px 6px;padding:14px 16px;display:flex;flex-direction:column;gap:8px"><span style="font-size:14.5px;line-height:1.55">Dans Jean 3:16, <b>ἀγαπάω (G25)</b> exprime un amour qui se donne par choix. <b>φιλέω (G5368)</b> évoque plutôt l’affection. Jean emploie les deux en Jean 21:15-17.</span><div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill">Lexique Strong</span><span class="pill">Westphal</span><span class="pill">M. Henry</span></div></div>
<span style="font-size:12px;color:{MU}">L’assistant cite ses sources et vous renvoie au texte.</span>
<div class="g" style="margin-top:auto;height:52px;border-radius:26px;display:flex;align-items:center;gap:10px;padding:0 8px 0 18px;box-shadow:none"><span style="flex:1;color:{MU};font-size:14.5px">Poser une question sur Jean 3…</span><span style="width:38px;height:38px;border-radius:19px;background:#111113;color:#FFFFFF;display:flex;align-items:center;justify-content:center">{ic("fwd",16,"#FFFFFF",2.2)}</span></div>''',top_=110,bottom=30),None,BG),G)
