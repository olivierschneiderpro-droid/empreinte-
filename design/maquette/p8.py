from base import *
P='bibliotheque'
items=[('pen','Surbrillances','124','L02-Surbrillances.dc.html'),('mark','Marque-pages','18','L03-MarquePages.dc.html'),('note','Notes','86','L04-Notes.dc.html'),('link','Liens','23','L05-Liens.dc.html'),('book','Études','12','L06-Etudes.dc.html'),('tag','Étiquettes','31','L08-Etiquettes.dc.html'),('calendar','Plans','3','L09-Plans.dc.html'),('heart','Méditations','40','L12-Meditation.dc.html')]
screen('L01-Bibliotheque.dc.html','Ma bibliothèque',f'<div class="top"><h1 class="h1">Ma bibliothèque</h1>{ibtn("search","Chercher dans ma bibliothèque")}</div>'+scroll(
grid(2,*[f'<a href="{h}" class="tile" style="gap:6px;padding:14px"><span style="color:{NUM}">{ic(i)}</span><span class="between"><strong>{n}</strong><span class="mono">{c}</span></span></a>' for i,n,c,h in items]),
lst(li('Note · Jean 3:16','« Donner avant de recevoir. »','<span class="muted small">auj.</span>',icon='note',ic_color=NUM,href='L04-Notes.dc.html'),li('Étude · L’amour dans Jean','modifiée hier','',icon='book',ic_color=NUM,href='L07-EditeurEtude.dc.html'),title='Récents'),
note('Vos notes et études peuvent pointer vers des réalités physiques : un exemplaire, une page de carnet, une mission.','num','link'),
)+nav('bible'),P)
hlc={'jaune':'#FFF2C9','vert':'#DDF3E4','bleu':'#DCE6FF','rose':'#FBE1EC'}
screen('L02-Surbrillances.dc.html','Surbrillances',top('Surbrillances','L01-Bibliotheque.dc.html',ibtn('filter','Filtrer'))+scroll(
chips(*[f'<span class="chip ghost"><span class="dot" style="background:{c};border:1px solid #C9CEC6"></span>{n}</span>' for n,c in hlc.items()]),
*[f'<a href="B01-Lecteur.dc.html" class="card" style="text-decoration:none;color:inherit;gap:6px"><span class="between"><span class="mono small" style="color:{NUM}">{r}</span><span class="muted small">{d}</span></span><span class="serif" style="background:{c};border-radius:6px;padding:4px 8px;font-size:15px">{t}</span></a>' for r,d,c,t in [('Jean 3:16','auj.','#FFF2C9','Car Dieu a tant aimé le monde…'),('Psaume 23:1','hier','#DDF3E4','L’Éternel est mon berger…'),('Romains 8:28','14/09','#DCE6FF','Nous savons que toutes choses concourent…')]],
),P)
screen('L03-MarquePages.dc.html','Marque-pages',top('Marque-pages','L01-Bibliotheque.dc.html')+scroll(
'<div class="card" style="gap:0">'+''.join(li(r,s,'',icon='mark',ic_color=NUM,href='B01-Lecteur.dc.html') for r,s in [('Jean 3','lecture en cours'),('Psaume 23','prière du soir'),('Romains 8','étude de groupe')])+'</div>',
card(f'<span class="row" style="gap:8px;color:{PHY}">{ic("mark")}<strong style="color:{INK}">Marque-pages physiques</strong></span><span class="muted">2 marque-pages QR glissés dans BIB-2026-0001 : Jean 3 et Psaume 23</span>'),
),P)
screen('L04-Notes.dc.html','Notes',top('Notes','L01-Bibliotheque.dc.html',ibtn('plus','Nouvelle note'))+scroll(
search('Chercher dans les notes…'),
*[card(f'<span class="between"><span class="mono small" style="color:{NUM}">{r}</span><span class="muted small">{d}</span></span><strong>{t}</strong><span class="muted">{b}</span>'+(chips(*[chip(x,'phy' if x[:3] in ('BIB','MIS','FAC') else 'ghost') for x in tg]) if tg else '')) for r,d,t,b,tg in [('Jean 3:16','01/10','Donner avant de recevoir','Lu avec le groupe ; parler de la mission de rentrée.',['BIB-2026-0001','MIS-2026-0002']),('Psaume 23','30/09','Le berger','Prière pour les familles du lycée Ampère.',['Prière']),('Romains 8:28','14/09','Toutes choses','Relier à l’étude « Providence ».',[])]],
),P)
screen('L05-Liens.dc.html','Liens',top('Liens','L01-Bibliotheque.dc.html',ibtn('plus','Nouveau lien'))+scroll(
*[card(f'<span class="mono small" style="color:{NUM}">{r}</span><strong>{t}</strong><span class="muted small">{u}</span>') for r,t,u in [('Jean 3:16','Vidéo : l’amour de Dieu','youtube.com · BibleProject'),('Jean 3','Article : la nouvelle naissance','topchretien.com'),('Psaume 23','Chant : Le Seigneur est mon berger','partition PDF')]],
),P)
screen('L06-Etudes.dc.html','Études',top('Études','L01-Bibliotheque.dc.html',ibtn('plus','Nouvelle étude','L07-EditeurEtude.dc.html'))+scroll(
'<div class="card" style="gap:0">'+''.join(li(t,s,chip(c,'num') if c else '',icon='book',ic_color=NUM,href='L07-EditeurEtude.dc.html') for t,s,c in [('L’amour dans Jean','12 versets · modifiée hier','groupe'),('Providence','Romains 8 · 14/09',''),('Les psaumes du berger','4 psaumes · 02/09',''),('Préparer la mission','6 versets · 3 réalités liées','mission')])+'</div>',
),P)
screen('L07-EditeurEtude.dc.html','Étude',top('L’amour dans Jean','L06-Etudes.dc.html',ibtn('share','Partager'))+scroll(
'<div class="row" style="gap:6px;flex-wrap:wrap">'+''.join(f'<span class="chip ghost" style="font-weight:700">{x}</span>' for x in ['B','I','H1','•','“ ”'])+chip('+ verset','num')+chip('+ Strong','num')+chip('+ réalité','phy')+'</div>',
'<h2 class="h2" style="font-size:22px">1. Un amour qui se donne</h2>',
card('<span class="mono small" style="color:#2438A3">Jean 3:16 · LSG</span><span class="serif" style="font-size:15px">Car Dieu a tant aimé le monde qu’il a donné son Fils unique…</span>','background:#E6EAFB;border-color:#C8D0F5'),
'<p style="margin:0">Le verbe <a href="S02-Mot.dc.html">ἀγαπάω (G25)</a> désigne un amour de choix. Dans la mission de rentrée, ce verset sera imprimé sur le marque-page offert avec chaque Bible.</p>',
card(f'<span class="row" style="gap:8px;color:{PHY}">{ic("layers","icon ic16")}<span class="small" style="font-weight:600">Réalité liée</span></span><strong class="mono">MIS-2026-0002 · 1000 Bibles</strong>','background:#E3EFE8;border-color:#C2DDCD'),
),P)
screen('L08-Etiquettes.dc.html','Étiquettes',top('Étiquettes','L01-Bibliotheque.dc.html',ibtn('plus','Nouvelle étiquette'))+scroll(
chips(*[chip(t,'ink' if t=='Mission · 14' else 'ghost') for t in ['Mission · 14','Prière · 22','Famille · 9','Étude · 31','Lycée · 6']]),
card('<span class="eyebrow">Étiquette « Mission »</span><span class="muted">Une étiquette relie tout, Bible et réel confondus :</span><div class="list">'+li('Jean 3:16','verset surligné','',icon='book',ic_color=NUM)+li('Note : Donner avant de recevoir','01/10','',icon='note',ic_color=NUM)+li('MIS-2026-0002','mission · 1000 Bibles','',icon='flag',ic_color=PHY)+li('DOC-2026-0213','bon de livraison','',icon='doc',ic_color=PHY)+'</div>'),
),P)
screen('L09-Plans.dc.html','Plans de lecture',top('Plans de lecture','L01-Bibliotheque.dc.html')+scroll(
seg('Mes plans','Découvrir',on=0),
*[card(f'<div class="between"><strong>{n}</strong>{chip(c,"num")}</div>{bar(p,NUM)}<span class="muted">{s}</span>') for n,c,p,s in [('BibleProject · la Bible en 1 an','J 214',58,'Aujourd’hui : Jean 3 – 4'),('Calendrier de Spurgeon','matin et soir',75,'Aujourd’hui : Psaume 23'),('Les Évangiles en 90 jours','J 12',13,'Aujourd’hui : Marc 4')]],
btn('Découvrir d’autres plans','line','plus'),
),P)
screen('L10-Plan.dc.html','Plan du jour',top('BibleProject · J 214','L09-Plans.dc.html')+scroll(
card('<span class="eyebrow">Aujourd’hui</span>'+''.join(f'<div class="li"><span style="width:24px;height:24px;border-radius:12px;border:2px solid {PHY if d else "#C9CEC6"};background:{PHY if d else "#FFFFFF"};color:#FFFFFF;display:flex;align-items:center;justify-content:center">{ic("check","icon ic16") if d else ""}</span><span class="col"><strong style="font-weight:600">{t}</strong><span class="muted">{s}</span></span></div>' for t,s,d in [('Jean 3','lu · 07:40',True),('Jean 4','5 min',False),('Vidéo : Jean 1-12','8 min',False)])),
card('<span class="eyebrow">Semaine</span><div class="g4" style="grid-template-columns:repeat(7,minmax(0,1fr))">'+''.join(f'<span class="chip {"phy" if i<3 else "ink" if i==3 else "ghost"}" style="justify-content:center;height:36px">{d}</span>' for i,d in enumerate('LMMJVSD'))+'</div>'),
),P)
screen('L12-Meditation.dc.html','Méditation',top('Méditation','B11-JourMeditation.dc.html',ibtn('list','Collection'))+scroll(
f'<div class="card" style="background:#1F2E2A;color:#FFFFFF;padding:28px 22px;gap:12px"><span class="eyebrow" style="color:#A9C4B8">Le berger · 2 / 6</span><p class="serif" style="font-size:21px;line-height:1.5;margin:0">« Il me fait reposer dans de verts pâturages. »</p><span style="color:#C9D2CE;font-size:14px">Respirez. Où sont, aujourd’hui, vos « verts pâturages » ?</span></div>',
'<div class="field"><label>Ce que je retiens</label><div class="input" style="height:96px;align-items:flex-start;padding-top:10px;color:#8A948F">Écrire…</div></div>',
btns(btn('Précédent','line',style='flex:1'),btn('Suivant','ink',style='flex:1')),
),P)
