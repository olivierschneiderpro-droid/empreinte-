from lum import *
G='bible-lecture'
BG='img:route'
V={14:"Et comme Moïse éleva le serpent dans le désert, il faut de même que le Fils de l’homme soit élevé,",15:"afin que quiconque croit en lui ait la vie éternelle.",16:"Car Dieu a tant aimé le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.",17:"Dieu, en effet, n’a pas envoyé son Fils dans le monde pour qu’il juge le monde, mais pour que le monde soit sauvé par lui."}
def vs(n,hl=False,sel=False,fs=18):
    st='margin:0 -10px;padding:6px 10px;border-radius:14px;background:rgba(17,17,19,.06);' if hl else ''
    if sel: st='margin:0 -10px;padding:6px 10px;border-radius:14px;background:rgba(255,255,255,.9);box-shadow:0 0 0 2px #111113;'
    return f'<p class="verse" style="{st}font-size:{fs}px"><span class="vn">{n}</span>{V[n]}</p>'
def rtop(ref='Jean',ch='3',ver='LSG',back=None):
    b=gbtn('back','Retour',back) if back else ''
    return f'<div style="position:absolute;top:54px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center;gap:8px">{b}<span class="g" style="height:44px;border-radius:22px;display:flex;align-items:center;padding:0 6px 0 16px;gap:10px;font:600 15px Geist;box-shadow:none">{ref}<span class="dot" style="font-size:22px">{ch}</span><span style="height:32px;padding:0 12px;border-radius:16px;background:rgba(17,17,19,.06);display:flex;align-items:center;font:600 12.5px Geist Mono">{ver}</span></span><span style="flex:1"></span><span class="row" style="gap:8px">{gbtn("tabs","Onglets")}{gbtn("more","Plus")}</span></div>'
# Sélecteur
books=['Matthieu','Marc','Luc','Jean','Actes','Romains','1 Cor.','2 Cor.','Galates','Éphésiens','Philippiens','Colossiens']
screen('LB02-Selecteur','Choisir un passage',shell(
top('#',chipc('Choisir un passage'),None)+
body(f'''{seg(["Ancien Testament","Nouveau Testament"],1)}
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">{"".join(f'<span class="g" style="border-radius:16px;height:44px;display:flex;align-items:center;justify-content:center;font:600 13.5px Geist;box-shadow:none;{"background:#111113;color:#FFFFFF;border-color:#111113" if b=="Jean" else ""}">{b}</span>' for b in books)}</div>
<div class="btw" style="margin-top:6px">{micro("Jean · chapitres")}{micro("21")}</div>
<div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px">{"".join(f'<span style="height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;{"background:#111113;color:#FFFFFF" if i==3 else "background:rgba(255,255,255,.6)"}">{dot(str(i),18,"#FFFFFF" if i==3 else TX)}</span>' for i in range(1,22))}</div>''',top_=110,bottom=30),None,BG),G)
# Versions
vers=[('LSG','Louis Segond 1910','français',True,True),('DBY','Darby','français',True,False),('OST','Ostervald','français',True,False),('MAR','Martin','français',False,False),('KJV','King James','anglais',True,False),('INT','Interlinéaire grec / hébreu','Strong',True,False)]
screen('LB03-Versions','Versions',shell(
top('#',chipc('Versions'),None)+
body(f'''{search("Chercher une version…")}
{card("".join(f'<div class="row" style="padding:10px 0;gap:12px;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="width:48px;height:48px;border-radius:14px;background:{"#111113" if on else SOFT};color:{"#FFFFFF" if on else TX};display:flex;align-items:center;justify-content:center;font:700 12px Geist Mono">{c}</span><span class="col" style="flex:1"><strong style="font-size:14px">{n}</strong><span style="font-size:12px;color:{MU}">{l}</span></span>{ic("check",17,GRN,2.2) if d else ic("download",18)}</div>' for k,(c,n,l,d,on) in enumerate(vers)),pad="6px 18px",gap=0)}
<span style="font-size:12.5px;color:{MU}">Les versions téléchargées restent lisibles hors ligne.</span>''',top_=110,bottom=30),None,BG),G)
# Sélection verset
acts=[('pen','Surligner'),('note','Note'),('link','Lien'),('tag','Étiquette'),('mark','Marque-page'),('compare','Comparer'),('hash','Strong'),('share','Partager'),('copy','Copier'),('layers','Empreinte')]
hls=['#F1E7C6','#DCE7DC','#DCE2EC','#EAD9DE','#E9E1D6']
screen('LB04-SelectionVerset','Verset sélectionné',shell(
rtop()+f'<div style="position:absolute;top:116px;left:20px;right:20px;display:flex;flex-direction:column;gap:12px">{vs(15)}{vs(16,sel=True)}{vs(17)}</div>'+
f'''<div class="g" style="position:absolute;left:10px;right:10px;bottom:12px;border-radius:32px;padding:18px;display:flex;flex-direction:column;gap:14px;background:rgba(255,255,255,.85)">
<div class="btw"><strong style="font-size:15px">Jean 3:16</strong><span class="row" style="gap:8px">{"".join(f'<span style="width:28px;height:28px;border-radius:14px;background:{c};border:1px solid rgba(17,17,19,.08)"></span>' for c in hls)}</span></div>
<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px">{"".join(f'<span style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 0;border-radius:16px;{"background:#111113;color:#FFFFFF" if l=="Empreinte" else "background:"+SOFT}">{ic(i,19,"#FFFFFF" if l=="Empreinte" else TX)}<span style="font:600 10.5px Geist">{l}</span></span>' for i,l in acts)}</div>
<span style="font-size:12px;color:{MU}">« Empreinte » relie ce verset à une réalité : un exemplaire, une page de carnet, une mission.</span></div>''',None,BG),G)
# Comparer
cmpv=[('LSG',V[16]),('DBY','Car Dieu a tant aimé le monde, qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse pas, mais qu’il ait la vie éternelle.'),('KJV','For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.')]
screen('LB05-Comparer','Comparer',shell(
top('#',chipc('Jean 3:16 · comparer'),gbtn('cog','Versions'))+
body("".join(card(f'<span class="btw"><span style="height:26px;padding:0 10px;border-radius:13px;background:{"#111113" if k==0 else SOFT};color:{"#FFFFFF" if k==0 else TX};font:700 11.5px Geist Mono;display:flex;align-items:center">{c}</span></span><p class="verse" style="font-size:16.5px">{t}</p>',pad="14px 18px",gap=8) for k,(c,t) in enumerate(cmpv)),top_=110,bottom=104),'book',BG),G)
# Interlinéaire
words=[('οὕτως','houtōs','ainsi','G3779'),('γὰρ','gar','car','G1063'),('ἠγάπησεν','ēgapēsen','aima','G25'),('ὁ θεὸς','ho theos','Dieu','G2316'),('τὸν κόσμον','ton kosmon','le monde','G2889')]
screen('LB06-Interlineaire','Interlinéaire',shell(
rtop('Jean','3','INT','#')+
body(f'''{seg(["Texte","Strong","Interlinéaire"],2)}
<div style="display:flex;flex-wrap:wrap;gap:8px">{"".join(f'<div class="g" style="border-radius:18px;padding:10px 12px;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:none;{"background:#111113;color:#FFFFFF;border-color:#111113" if c=="G25" else ""}"><span style="font:500 22px Literata,serif">{g}</span><span style="font-size:11px;opacity:.6">{t}</span><strong style="font-size:13.5px">{f}</strong><span class="gm" style="font-size:10.5px;opacity:.7">{c}</span></div>' for g,t,f,c in words)}</div>
{card(f'{micro("Analyse · ἠγάπησεν")}<span style="font-size:14.5px">Verbe · aoriste · actif · indicatif · 3ᵉ pers. sing.</span><span style="font-size:13px;color:{MU}">de ἀγαπάω (G25), aimer</span>')}
<div class="g" style="padding:12px 14px;display:flex;gap:10px;box-shadow:none">{ic("pen",17)}<span style="font-size:12.5px">Touchez un mot pour y attacher une annotation qui lui est propre.</span></div>''',top_=116,bottom=104),'book',BG),G)
# Péricopes
per=[('Jean 3:1-21','Entretien de Jésus avec Nicodème',True),('Jean 3:22-36','Dernier témoignage de Jean-Baptiste',False),('Jean 4:1-42','Jésus et la Samaritaine',False),('Jean 4:43-54','Guérison du fils d’un officier',False),('Jean 5:1-18','Guérison à Béthesda',False)]
screen('LB07-Pericopes','Péricopes',shell(
top('#',chipc('Sections · Jean'),None)+
body("".join(f'<div class="g" style="padding:14px 16px;display:flex;align-items:center;gap:14px;box-shadow:none;{"background:#111113;color:#FFFFFF;border-color:#111113" if on else ""}"><span class="col" style="flex:1"><strong style="font:500 16px Literata,serif">{t}</strong><span class="gm" style="font-size:11.5px;opacity:.6">{r}</span></span>{ic("fwd",16,"#FFFFFF" if on else TX)}</div>' for r,t,on in per),top_=110,bottom=104),'book',BG),G)
# Audio
screen('LB08-Audio','Écouter',shell(
top('#',chipc('Écouter'),gbtn('more','Plus'))+
f'''<div style="position:absolute;left:40px;right:40px;top:130px;height:310px;border-radius:32px;overflow:hidden;box-shadow:0 26px 50px rgba(17,17,19,.22)"><img src="{IMG['audio']}" alt="Lectrice écoutant la Bible" style="width:100%;height:100%;object-fit:cover;object-position:70% 50%;filter:saturate(.2) contrast(1.05)"></div>'''+
body(f'''<div class="col" style="align-items:center;gap:2px"><h1 class="h1">Jean 3</h1><span class="sub">Lecture audio · LSG</span></div>
<div class="col" style="gap:6px">{bar(38,TX,4)}<div class="btw"><span class="gm" style="font-size:11.5px">1:52</span><span class="gm" style="font-size:11.5px;color:{MU}">4:51</span></div></div>
<div class="row" style="justify-content:center;gap:24px">{gbtn("back","Reculer")}<a href="#" aria-label="Pause" style="width:72px;height:72px;border-radius:36px;background:#111113;color:#FFFFFF;display:flex;align-items:center;justify-content:center">{ic("pause",26,"#FFFFFF",2.4)}</a>{gbtn("fwd","Avancer")}</div>
<div class="row" style="gap:6px;justify-content:center"><span class="pill">0,8×</span><span class="pill on">1×</span><span class="pill">1,25×</span><span class="pill">minuterie</span></div>''',top_=468,bottom=30),None,BG),G)
# Ressources
res=[('note','Commentaires','Matthew Henry · 3 sections'),('hash','Mots Strong','14 mots dans le passage'),('list','Thèmes Nave','Amour de Dieu · Nouvelle naissance'),('paper','Dictionnaire','Nicodème · serpent d’airain'),('users','Personnes et lieux','Nicodème · Moïse · Jérusalem'),('timeline','Chronologie','ministère de Jésus · 27-30'),('link','Références croisées','Nombres 21:9 · 1 Jean 4:9'),('play','Médias','1 audio · 1 vidéo')]
screen('LB09-Ressources','Ressources du passage',shell(
top('#',chipc('Jean 3:16 · ressources'),None)+
body(f'''<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">{"".join(f'<a href="#" class="g" style="border-radius:22px;padding:14px;display:flex;flex-direction:column;gap:10px;text-decoration:none;color:{TX};box-shadow:none">{lead(i)}<span class="col"><strong style="font-size:14px">{t}</strong><span style="font-size:11.5px;color:{MU};line-height:1.35">{s}</span></span></a>' for i,t,s in res)}</div>''',top_=110,bottom=104),'book',BG),G)
# Onglets
tabs=[('book','Jean 3','LSG',True),('hash','G25 ἀγαπάω','Strong',False),('note','L’amour dans Jean','étude',False),('layers','BIB-2026-0001','Bible physique',False)]
screen('LB10-Onglets','Onglets',shell(
top('#',chipc('Onglets'),gbtn('plus','Nouvel onglet'))+
body(f'''{micro("Groupe · Étude de Jean")}
<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">{"".join(f'<div class="g" style="border-radius:22px;height:150px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:none;{"border:2px solid #111113" if on else ""}"><span class="btw">{lead(i)}{ic("x",15)}</span><span class="col"><strong style="font-size:14px">{t}</strong><span style="font-size:11.5px;color:{MU}">{s}</span></span></div>' for i,t,s,on in tabs)}</div>
{micro("Groupe · Bureau")}
<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">{"".join(f'<div class="g" style="border-radius:22px;padding:14px;display:flex;align-items:center;gap:10px;box-shadow:none">{lead(i)}<span class="col"><strong style="font-size:13.5px">{t}</strong><span style="font-size:11px;color:{MU}">{s}</span></span></div>' for i,t,s in [('euro','FAC-0047','facture'),('flag','1000 Bibles','mission')])}</div>''',top_=110,bottom=104),'book',BG),G)
# Verset du jour
screen('LB11-VersetDuJour','Verset du jour',shell(
top('#',chipc('Aujourd’hui'),None)+
f'''<div style="position:absolute;left:16px;right:16px;top:110px;height:380px;border-radius:32px;overflow:hidden;box-shadow:0 26px 50px rgba(17,17,19,.2)"><img src="{IMG['p12']}" alt="" style="width:100%;height:100%;object-fit:cover;filter:saturate(.15) brightness(.85)"><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(17,17,19,0) 30%,rgba(17,17,19,.75))"></div>
<div style="position:absolute;left:22px;right:22px;bottom:22px;color:#FFFFFF;display:flex;flex-direction:column;gap:10px"><span class="micro" style="color:rgba(255,255,255,.7)">Verset du jour · Psaume 23.1</span><span style="font:500 26px/1.3 Literata,serif">« L’Éternel est mon berger&#8239;: je ne manquerai de rien. »</span></div></div>'''+
body(f'''<div class="row" style="gap:10px"><a href="#" class="btn w" style="flex:1">{ic("share",18)}Partager</a><a href="#" class="btn k" style="flex:1">{ic("heart",18,"#FFFFFF")}Méditer</a></div>
{card(f'<div class="btw">{micro("Lecture du jour · BibleProject")}<span>{dot("214",20)}<span style="font-size:11px;color:{MU}">/365</span></span></div><strong style="font-size:16px">Jean 3 – 4</strong>{bar(58,TX,4)}')}''',top_=510,bottom=104),'home','plain'),G)
# Partage
screen('LB12-Partage','Partager',shell(
top('#',chipc('Partager Jean 3:16'),None)+
f'''<div style="position:absolute;left:40px;right:40px;top:120px;height:330px;border-radius:28px;background:#111113;color:#FFFFFF;padding:28px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 26px 50px rgba(17,17,19,.25)">{l.FP.replace('stroke="#0B0B12"','stroke="#FFFFFF"')}<span style="font:500 23px/1.4 Literata,serif">« Car Dieu a tant aimé le monde qu’il a donné son Fils unique… »</span><span class="gm" style="font-size:12px;opacity:.6">Jean 3:16 · LSG</span></div>'''+
body(card("".join(f'<div class="btw" style="padding:10px 0;{"" if k==0 else "border-top:1px solid "+LINE}"><span style="font-size:14px">{a}</span>{tog(b)}</div>' for k,(a,b) in enumerate([('Inclure la référence',True),('Inclure la version',True),('Lien de partage',False)])),pad="6px 18px",gap=0)+'<div class="row" style="gap:10px"><a href="#" class="btn w" style="flex:1">Copier</a><a href="#" class="btn k" style="flex:1.2">Partager l’image</a></div>',top_=476,bottom=30),None,'plain'),G)
# Historique
screen('LB13-Historique','Historique',shell(
top('#',chipc('Historique'),gbtn('trash','Effacer'))+
body(f'''{micro("Aujourd’hui")}
{card("".join(item(a,b,f'<span class="gm" style="font-size:11px;color:{MU}">{t}</span>',lead=lead(i),first=(k==0)) for k,(a,b,t,i) in enumerate([('Jean 3','LSG','07:40','book'),('G25 ἀγαπάω','Strong','07:46','hash'),('Amour','Dictionnaire','07:52','paper')])),pad="6px 18px",gap=0)}
{micro("Hier")}
{card("".join(item(a,b,f'<span class="gm" style="font-size:11px;color:{MU}">{t}</span>',lead=lead(i),first=(k==0)) for k,(a,b,t,i) in enumerate([('Psaume 23','LSG','21:10','book'),('Nicodème','personne','21:18','user')])),pad="6px 18px",gap=0)}''',top_=110,bottom=104),'book',BG),G)
