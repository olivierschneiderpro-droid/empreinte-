from base import *
P='bible-lecture'
V={14:"Et comme Moïse éleva le serpent dans le désert, il faut de même que le Fils de l’homme soit élevé,",15:"afin que quiconque croit en lui ait la vie éternelle.",16:"Car Dieu a tant aimé le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.",17:"Dieu, en effet, n’a pas envoyé son Fils dans le monde pour qu’il juge le monde, mais pour que le monde soit sauvé par lui.",18:"Celui qui croit en lui n’est point jugé ; mais celui qui ne croit pas est déjà jugé, parce qu’il n’a pas cru au nom du Fils unique de Dieu."}
def vtext(n,hl=None,sel=False):
    t=V[n]
    if n==16: t=t.replace('aimé','<span style="border-bottom:2px solid #2E46C2">aimé</span>')
    st=''
    if hl: st=f'background:{hl};border-radius:6px;padding:2px 6px;margin:0 -6px;'
    if sel: st+='outline:2px solid #18211F;outline-offset:2px;'
    return f'<p class="verse" style="{st}"><span class="vn">{n}</span>{t}</p>'
def btop(back=None,ref='Jean 3',ver='LSG'):
    b=f'<a class="iconbtn" href="{back}" aria-label="Retour">{ic("back")}</a>' if back else ''
    return f'<div class="top" style="padding-bottom:6px">{b}<div class="row" style="gap:6px;flex:1"><a href="B02-Selecteur.dc.html" class="chip ghost" style="height:36px;font-size:14px;text-decoration:none">{ref}</a><a href="B03-Versions.dc.html" class="chip ghost" style="height:36px;font-size:14px;text-decoration:none">{ver}</a></div><div class="row" style="gap:8px">{ibtn("tabs","Onglets","B10-Onglets.dc.html")}{ibtn("more","Options du lecteur","B06-Interlineaire.dc.html")}</div></div>'
screen('B01-Lecteur.dc.html','Bible · Jean 3',btop()+scroll(
'<span class="eyebrow" style="font-family:\'Literata\',serif;text-transform:none;letter-spacing:0;font-size:14px;color:#18211F;font-weight:600">Entretien de Jésus avec Nicodème</span>',
vtext(14),vtext(15),vtext(16,'#FFF2C9'),vtext(17),vtext(18),
f'<a href="L04-Notes.dc.html" class="card" style="text-decoration:none;color:inherit;flex-direction:row;gap:10px;align-items:center;padding:10px 12px"><span style="color:{NUM}">{ic("note")}</span><span class="col"><strong style="font-weight:600;font-size:14px">1 note · 1 exemplaire physique</strong><span class="muted small">« Donner avant de recevoir. » · BIB-2026-0001</span></span>{ic("fwd")}</a>',
f'<div class="between"><button class="iconbtn" type="button" aria-label="Chapitre précédent">{ic("back")}</button><a href="B08-Audio.dc.html" class="iconbtn" aria-label="Écouter">{ic("headph")}</a><button class="iconbtn" type="button" aria-label="Chapitre suivant">{ic("fwd")}</button></div>',
)+nav('bible'),P)
books=['Matthieu','Marc','Luc','Jean','Actes','Romains','1 Corinthiens','2 Corinthiens','Galates','Éphésiens','Philippiens','Colossiens']
screen('B02-Selecteur.dc.html','Choisir un passage',top('Choisir un passage','B01-Lecteur.dc.html')+scroll(
seg('Livre','Chapitre','Verset',on=1),seg('Ancien Testament','Nouveau Testament',on=1),
'<div class="g3">'+''.join(f'<span class="chip {"ink" if b=="Jean" else "ghost"}" style="height:38px;justify-content:center">{b}</span>' for b in books)+'</div>',
card('<span class="eyebrow">Jean · 21 chapitres</span><div class="g4" style="grid-template-columns:repeat(6,minmax(0,1fr))">'+''.join(f'<span class="chip {"ink" if i==3 else "ghost"} mono" style="justify-content:center;height:40px">{i}</span>' for i in range(1,22))+'</div>'),
),P)
vers=[('LSG','Louis Segond 1910','français',True),('DBY','Darby','français',True),('OST','Ostervald','français',True),('MAR','Martin','français',False),('KJV','King James','anglais',True),('INT','Interlinéaire grec / hébreu','Strong',True)]
screen('B03-Versions.dc.html','Versions',top('Versions','B01-Lecteur.dc.html')+scroll(
search('Chercher une version…'),
'<div class="card" style="gap:0">'+''.join(li(f'<span class="mono">{c}</span> · {n}',l,chip('téléchargée','phy') if d else btn('Télécharger','line','download',style='height:34px;font-size:13px;padding:0 10px'),icon='book',ic_color=NUM if c=='LSG' else INK) for c,n,l,d in vers)+'</div>',
note('Les versions téléchargées restent lisibles hors ligne.','num','download'),
),P)
hl=['#FFF2C9','#DDF3E4','#DCE6FF','#FBE1EC','#FFE4CC']
acts=[('pen','Surligner'),('note','Note'),('link','Lien'),('tag','Étiquette'),('mark','Marque-page'),('compare','Comparer'),('hash','Strong'),('share','Partager'),('copy','Copier'),('layers','Empreinte')]
screen('B04-SelectionVerset.dc.html','Verset sélectionné',btop()+f'<div class="scroll">{vtext(15)}{vtext(16,None,True)}{vtext(17)}</div>'+f'''<div class="sheet">
<div class="between"><strong>Jean 3:16</strong><span class="muted small">1 verset sélectionné</span></div>
<div class="row" style="gap:10px">{''.join(f'<span style="width:34px;height:34px;border-radius:17px;background:{c};border:1px solid #DDE0D9"></span>' for c in hl)}</div>
<div class="g5" style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px">{''.join(f'<button type="button" class="tile" style="align-items:center;gap:4px;padding:8px 2px;font:600 11px \'IBM Plex Sans\',sans-serif;color:{NUM if l=="Empreinte" else INK};cursor:pointer">{ic(i)}{l}</button>' for i,l in acts)}</div>
<span class="muted small">« Empreinte » relie ce verset à une réalité : un exemplaire, une page de carnet, une mission.</span>
</div>''',P)
screen('B05-Comparer.dc.html','Comparer les versions',top('Jean 3:16 · comparer','B04-SelectionVerset.dc.html',ibtn('cog','Choisir les versions'))+scroll(
*[card(f'<span class="chip ghost mono" style="align-self:flex-start">{c}</span><p class="verse" style="font-size:16px">{t}</p>') for c,t in [('LSG',V[16]),('DBY','Car Dieu a tant aimé le monde, qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse pas, mais qu’il ait la vie éternelle.'),('OST','Car Dieu a tant aimé le monde, qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.'),('KJV','For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.')]],
),P)
words=[('οὕτως','houtōs','ainsi','G3779'),('γὰρ','gar','car','G1063'),('ἠγάπησεν','ēgapēsen','aima','G25'),('ὁ θεὸς','ho theos','Dieu','G2316'),('τὸν κόσμον','ton kosmon','le monde','G2889')]
screen('B06-Interlineaire.dc.html','Interlinéaire',btop('B01-Lecteur.dc.html','Jean 3:16','INT')+scroll(
seg('Texte','Strong','Interlinéaire',on=2),
'<div style="display:flex;flex-wrap:wrap;gap:10px">'+''.join(f'<a href="S02-Mot.dc.html" class="tile" style="align-items:center;gap:2px;padding:10px;{"border-color:#2E46C2;background:#E6EAFB" if c=="G25" else ""}"><span class="serif" style="font-size:20px">{g}</span><span class="muted small">{t}</span><strong style="font-size:14px">{f}</strong><span class="mono small" style="color:{NUM}">{c}</span></a>' for g,t,f,c in words)+'</div>',
card('<span class="eyebrow">Analyse · ἠγάπησεν</span><span>Verbe · aoriste · actif · indicatif · 3ᵉ pers. sing.</span><span class="muted">de ἀγαπάω, aimer</span>'),
note('Annotations de mots : touchez un mot pour ajouter une note qui lui est propre.','num','pen'),
),P)
per=[('Jean 3:1-21','Entretien de Jésus avec Nicodème'),('Jean 3:22-36','Dernier témoignage de Jean-Baptiste'),('Jean 4:1-42','Jésus et la Samaritaine'),('Jean 4:43-54','Guérison du fils d’un officier')]
screen('B07-Pericopes.dc.html','Péricopes',top('Sections du livre','B01-Lecteur.dc.html')+scroll(
seg('Jean','Tous les livres',on=0),
'<div class="card" style="gap:0">'+''.join(li(t,f'<span class="mono">{r}</span>','',sev=NUM if j==0 else '#C9CEC6',href='B01-Lecteur.dc.html') for j,(r,t) in enumerate(per))+'</div>',
),P)
screen('B08-Audio.dc.html','Écouter',top('Écouter','B01-Lecteur.dc.html')+scroll(
f'<div class="card" style="align-items:center;padding:24px;gap:12px"><span class="ibox" style="width:120px;height:120px;border-radius:24px;background:#E6EAFB;color:{NUM}">{ic("headph")}</span><strong style="font-size:18px">Jean 3</strong><span class="muted">Lecture audio · LSG</span>{bar(38,NUM)}<div class="between" style="width:100%"><span class="mono small">1:52</span><span class="mono small">4:51</span></div><div class="row" style="gap:18px"><button class="iconbtn" type="button" aria-label="Reculer">{ic("back")}</button><button class="iconbtn" type="button" aria-label="Pause" style="width:64px;height:64px;border-radius:32px;background:#18211F;color:#FFFFFF">{ic("pause")}</button><button class="iconbtn" type="button" aria-label="Avancer">{ic("fwd")}</button></div></div>',
lst(li('Vidéo · L’Évangile de Jean','BibleProject · 8 min','',icon='play',ic_color=NUM),li('Lecture lente','vitesse 0,8×','',icon='headph'),title='Médias du passage'),
),P)
res=[('book','Commentaires','Matthew Henry · 3 sections','S09-Commentaires.dc.html'),('hash','Mots Strong','14 mots dans ce passage','S01-Lexique.dc.html'),('list','Thèmes Nave','Amour de Dieu · Nouvelle naissance','S07-Nave.dc.html'),('doc','Dictionnaire','Nicodème · Serpent d’airain','S06-Dictionnaire.dc.html'),('users','Personnes & lieux','Nicodème · Moïse · Jérusalem','S08-Entites.dc.html'),('timeline','Chronologie','Ministère de Jésus · 27-30','S10-Chronologie.dc.html'),('link','Références croisées','Nombres 21:9 · 1 Jean 4:9','B01-Lecteur.dc.html'),('play','Médias','1 audio · 1 vidéo','B08-Audio.dc.html')]
screen('B09-Ressources.dc.html','Ressources du passage',top('Jean 3:16 · ressources','B01-Lecteur.dc.html')+scroll(
'<div class="card" style="gap:0">'+''.join(li(n,s,'',icon=i,ic_color=NUM,href=h) for i,n,s,h in res)+'</div>',
),P)
screen('B10-Onglets.dc.html','Onglets',top('Onglets','B01-Lecteur.dc.html',ibtn('plus','Nouvel onglet'))+scroll(
'<span class="eyebrow">Groupe · Étude de Jean</span>',
grid(2,*[f'<a href="{h}" class="tile" style="gap:6px;padding:12px;{"border:2px solid #18211F" if j==0 else ""}"><span style="color:{c}">{ic(i)}</span><strong style="font-size:14px">{t}</strong><span class="muted small">{s}</span></a>' for j,(i,t,s,c,h) in enumerate([('book','Jean 3','LSG',NUM,'B01-Lecteur.dc.html'),('hash','G25 ἀγαπάω','Strong',NUM,'S02-Mot.dc.html'),('note','Étude : l’amour','12 versets',NUM,'L07-EditeurEtude.dc.html'),('layers','BIB-2026-0001','Bible physique',PHY,'D03-BiblePhysique.dc.html')])]),
'<span class="eyebrow">Groupe · Bureau</span>',
grid(2,f'<a href="C06-Fiche.dc.html" class="tile" style="gap:6px;padding:12px"><span style="color:{PHY}">{ic("euro")}</span><strong style="font-size:14px">FAC-2026-0047</strong><span class="muted small">Facture</span></a>',f'<a href="D04-Mission.dc.html" class="tile" style="gap:6px;padding:12px"><span style="color:{PHY}">{ic("flag")}</span><strong style="font-size:14px">1000 Bibles</strong><span class="muted small">Mission</span></a>'),
note('Les onglets mêlent passages bibliques et réalités : chaque groupe est un espace de travail.','num','tabs'),
),P)
screen('B11-JourMeditation.dc.html','Verset du jour',top('Aujourd’hui','Main.dc.html')+scroll(
card('<span class="eyebrow">Verset du jour</span><p class="verse" style="font-size:20px">« L’Éternel est mon berger : je ne manquerai de rien. »</p><span class="muted mono small">Psaume 23:1 · LSG</span>'+btns(btn('Partager','line','share',style='flex:1;height:40px'),btn('Méditer','ink','heart','L12-Meditation.dc.html',style='flex:1;height:40px'))),
card('<span class="eyebrow">Lecture du jour · plan BibleProject</span><strong>Jean 3 – 4</strong>'+bar(58,NUM)+'<span class="muted">Jour 214 sur 365 · 2 chapitres</span>'),
lst(li('Méditation guidée','« Le berger » · 6 min','',icon='heart',ic_color=NUM,href='L12-Meditation.dc.html'),li('Cours & vidéos','Comprendre l’Évangile de Jean','',icon='play',ic_color=NUM),li('Chronologie','Où se situe Jean 3 ?','',icon='timeline',ic_color=NUM,href='S10-Chronologie.dc.html')),
),P)
screen('B12-Partage.dc.html','Partager un verset',top('Partager Jean 3:16','B04-SelectionVerset.dc.html')+scroll(
f'<div class="card" style="background:#18211F;color:#FFFFFF;padding:28px 22px;gap:14px"><p class="serif" style="font-size:20px;line-height:1.5;margin:0">« Car Dieu a tant aimé le monde qu’il a donné son Fils unique… »</p><span class="mono small" style="color:#C9D2CE">Jean 3:16 · LSG</span></div>',
card(ctitle('Options')+'<div class="list">'+''.join(f'<div class="li"><span class="col"><strong style="font-weight:600">{a}</strong></span>{toggle(b)}</div>' for a,b in [('Inclure la référence',True),('Inclure la version',True),('Ajouter le lien de partage',False),('Texte seul (sans image)',False)])+'</div>'),
btns(btn('Copier','line','copy',style='flex:1'),btn('Partager','ink','share',style='flex:1')),
),P)
screen('B13-Historique.dc.html','Historique',top('Historique','B01-Lecteur.dc.html',ibtn('trash','Effacer'))+scroll(
'<span class="eyebrow">Aujourd’hui</span>',
lst(li('Jean 3','LSG · 07:40','',icon='book',ic_color=NUM,href='B01-Lecteur.dc.html'),li('G25 ἀγαπάω','Strong · 07:46','',icon='hash',ic_color=NUM,href='S02-Mot.dc.html'),li('Amour','Dictionnaire · 07:52','',icon='doc',ic_color=NUM)),
'<span class="eyebrow">Hier</span>',
lst(li('Psaume 23','LSG · 21:10','',icon='book',ic_color=NUM),li('Nicodème','Personne · 21:18','',icon='user',ic_color=NUM,href='S08-Entites.dc.html')),
),P)
