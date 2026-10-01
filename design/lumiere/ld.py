from common import *
import l
TX,MU,SL,TAUPE,RED,GREEN=l.TX,l.MU,l.BLUE,l.CORAL,l.RED,l.GREEN
F=l.F
def st(w,h): return l.ST.replace('.l{{width:390px;height:844px;','.l{{width:%dpx;height:%dpx;'%(w,h)).replace('{{','{').replace('}}','}')
# l.ST is an f-string already formatted? check
def aur(w,h):
    return f'''<div class="aur" style="width:{w*.6:.0f}px;height:{w*.6:.0f}px;left:-{w*.2:.0f}px;top:-{w*.25:.0f}px;background:radial-gradient(circle,#E3E2DE 0%,rgba(227,226,222,0) 68%)"></div>
<div class="aur" style="width:{w*.55:.0f}px;height:{w*.55:.0f}px;right:-{w*.2:.0f}px;bottom:-{w*.25:.0f}px;background:radial-gradient(circle,#DCDFE3 0%,rgba(220,223,227,0) 68%)"></div>'''
NAVI=[('home','Accueil'),('layers','Réalités'),('book','Bible'),('shield','Vérifier')]
def sidebar(on,full=True,h=900):
    if full:
        items=''.join(f'<a href="#" style="display:flex;align-items:center;gap:12px;height:40px;padding:0 12px;border-radius:12px;text-decoration:none;color:{TX};font:{"600" if k==on else "500"} 14px Geist;{"background:rgba(17,17,19,.07)" if k==on else ""}">{svg(P[k],19)}{lbl}{"<span style='margin-left:auto;font:600 11px Geist Mono;color:"+RED+"'>4</span>" if k=="shield" else ""}</a>' for k,lbl in NAVI)
        doms=''.join(f'<a href="#" style="display:flex;align-items:center;gap:10px;height:34px;padding:0 12px;text-decoration:none;color:{MU};font:500 13.5px Geist"><span style="width:8px;height:8px;border-radius:2px;background:{c}"></span>{n}<span class="gm" style="margin-left:auto;font-size:11.5px">{k}</span></a>' for n,k,c in [('Travail','486',SL),('Maison','212',TAUPE),('Bible & étude','341',TX),('Missions','94',TAUPE),('Apprentissage','63',SL)])
        return f'''<aside class="glass" style="position:absolute;left:16px;top:16px;bottom:16px;width:236px;border-radius:26px;padding:20px 12px;box-sizing:border-box;display:flex;flex-direction:column;gap:4px">
<span style="display:flex;align-items:center;gap:8px;font:700 18px Geist;letter-spacing:-.02em;padding:0 12px 18px">{l.FP}empreinte</span>
<span class="glass" style="display:flex;align-items:center;gap:8px;height:38px;border-radius:12px;padding:0 12px;color:{MU};font:500 13.5px Geist;margin-bottom:12px;box-shadow:none">{svg(P["search"],16)}Rechercher<span class="gm" style="margin-left:auto;font-size:11px">⌘K</span></span>
{items}
<span class="micro" style="padding:22px 12px 6px">Domaines</span>{doms}
<a href="#" style="margin-top:auto;height:46px;border-radius:23px;background:#111113;color:#FFFFFF;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;font:600 14px Geist">{svg(P["scan"],18,"#FFFFFF")}Capturer</a></aside>'''
    items=''.join(f'<a href="#" aria-label="{lbl}" style="width:48px;height:48px;border-radius:16px;display:flex;align-items:center;justify-content:center;color:{TX};{"background:rgba(17,17,19,.07)" if k==on else ""}">{svg(P[k],21)}</a>' for k,lbl in NAVI)
    return f'''<aside class="glass" style="position:absolute;left:14px;top:14px;bottom:14px;width:72px;border-radius:26px;padding:16px 0;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:8px"><span style="padding-bottom:12px">{l.FP}</span>{items}<a href="#" aria-label="Capturer" style="margin-top:auto;width:52px;height:52px;border-radius:26px;background:#111113;color:#FFFFFF;display:flex;align-items:center;justify-content:center">{svg(P["scan"],22,"#FFFFFF")}</a></aside>'''
def deck(w):
    # horizontal 3D deck of three cards
    return f'''<div style="position:relative;height:250px;perspective:1100px">
<div style="position:absolute;left:{w*.12:.0f}px;right:{w*.12:.0f}px;top:0;height:150px;border-radius:22px;transform:translateZ(-80px);background:#E2E0DC;box-shadow:0 10px 26px rgba(17,17,19,.10);padding:14px 18px;box-sizing:border-box"><span class="micro">Mission · 1000 Bibles</span></div>
<div style="position:absolute;left:{w*.06:.0f}px;right:{w*.06:.0f}px;top:34px;height:160px;border-radius:22px;transform:translateZ(-40px);overflow:hidden;box-shadow:0 14px 34px rgba(17,17,19,.14)"><img src="{IMG['route']}" alt="" style="width:100%;height:100%;object-fit:cover;filter:saturate(.35) contrast(.95)"><span class="micro" style="position:absolute;left:18px;top:14px;color:#FFFFFF">Bible · Jean 3</span></div>
<div style="position:absolute;left:0;right:0;top:74px;height:172px;border-radius:24px;background:#FFFEFB;box-shadow:0 1px 0 rgba(0,0,0,.04),0 22px 44px rgba(17,17,19,.16);padding:16px 18px;box-sizing:border-box;display:flex;gap:14px">
<div style="flex:1;display:flex;flex-direction:column;justify-content:space-between"><span class="micro">Facture · reçue 09:12</span><span class="dot" style="font-size:34px;line-height:1">F-47</span><span class="gm" style="font-size:12px;color:{MU}">FAC-2026-0047 · 02·B·14</span></div>
<div style="width:130px;background:#FFFFFF;border:1px solid #EFEBE4;border-radius:8px;padding:10px;transform:rotate(3deg);box-shadow:0 6px 14px rgba(0,0,0,.06)">{l.miniinv}</div>
<span class="glass" style="position:absolute;right:-6px;top:-16px;display:flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:16px;font:600 12.5px Geist;color:{RED}"><span style="width:7px;height:7px;border-radius:4px;background:{RED}"></span>1 250 ≠ 1 520</span></div></div>'''
def widgets():
    return f'''<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">
<a href="#" class="glass" style="grid-column:span 2;border-radius:24px;padding:16px 18px;text-decoration:none;color:{TX};display:flex;flex-direction:column;gap:4px"><span class="micro">Verset du jour · Ps 23.1</span><span style="font:500 18px/1.35 Literata,serif">« L’Éternel est mon berger&#8239;: je ne manquerai de rien. »</span></a>
<a href="#" class="glass" style="border-radius:24px;padding:14px;text-decoration:none;color:{TX};display:flex;align-items:center;gap:12px;height:96px;box-sizing:border-box"><span style="position:relative;width:58px;height:58px">{l.ring(.64,TAUPE,58,7,'')}<span class="dot" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:17px">64</span></span><span style="display:flex;flex-direction:column"><strong style="font-size:14px">1000 Bibles</strong><span style="font-size:12px;color:{MU}">640 remises</span></span></a>
<a href="#" class="glass" style="border-radius:24px;padding:14px;text-decoration:none;color:{TX};display:flex;flex-direction:column;justify-content:space-between;height:96px;box-sizing:border-box"><span class="micro">Plan de lecture</span><span style="display:flex;align-items:baseline;gap:6px"><span class="dot" style="font-size:30px;line-height:1">214</span><span style="font-size:12.5px;color:{MU}">/365 · Jean 3–4</span></span></a></div>'''
def timeline(n=5):
    rows=[('07:40','Étude · Jean 3:16','Note liée à BIB-2026-0001',TX),('09:12','Facture F-47 reçue','Rangée · Classeur 02 › B › 14',TAUPE),('11:30','Lycée Ampère','40 Bibles remises · photo + signature',TAUPE),('14:05','Carnet p. 34 numérisé','3 réalités reconnues',SL),('16:20','Concordance Strong','prêtée à Paul M.',TAUPE)][:n]
    return f'''<div class="glass" style="border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:14px"><div style="display:flex;justify-content:space-between"><span class="micro">Fil du jour</span><span class="micro" style="color:{TX}">Journal ›</span></div>
<div style="position:relative;padding-left:22px;display:flex;flex-direction:column;gap:14px"><span style="position:absolute;left:5px;top:6px;bottom:6px;width:1.5px;background:rgba(17,17,19,.12)"></span>
{''.join(f'<div style="position:relative;display:flex;flex-direction:column"><span style="position:absolute;left:-22px;top:5px;width:12px;height:12px;border-radius:50%;background:#F4F4F2;border:2.5px solid {c};box-sizing:border-box"></span><span style="display:flex;justify-content:space-between"><strong style="font-size:14px;font-weight:600">{t}</strong><span class="gm" style="font-size:11.5px;color:{MU}">{h}</span></span><span style="font-size:12.5px;color:{MU}">{s}</span></div>' for h,t,s,c in rows)}</div></div>'''
def checks():
    return f'''<div class="glass" style="border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:10px"><div style="display:flex;justify-content:space-between"><span class="micro">À vérifier</span><span class="dot" style="font-size:18px;color:{RED}">4</span></div>
{''.join(f'<div style="display:flex;gap:10px;align-items:flex-start;padding-top:10px;border-top:1px solid rgba(17,17,19,.07)"><span style="width:7px;height:7px;border-radius:4px;background:{c};margin-top:6px;flex:none"></span><span style="display:flex;flex-direction:column"><strong style="font-size:13.5px;font-weight:600">{t}</strong><span class="gm" style="font-size:11.5px;color:{MU}">{s}</span></span></div>' for t,s,c in [('Montants différents','FAC-2026-0047',RED),('Paiement sans relevé','PAY-2026-0001',TAUPE),('Original introuvable','LIV-2026-0031',TAUPE),('Garantie bientôt expirée','EQP-2024-0007',MU)])}</div>'''
def header(size):
    return f'''<div><span class="micro">Mercredi 1er octobre</span><div class="dot" style="font-size:{size}px;line-height:.95;margin-top:2px">01.10</div><span style="display:flex;gap:8px;align-items:center;margin-top:8px;font:500 15px Geist;color:{MU}"><strong style="color:{TX};font-weight:700">4 traces</strong> aujourd’hui<span style="width:4px;height:4px;border-radius:2px;background:{MU}"></span><span style="color:{RED};font-weight:600">1 écart</span></span></div>'''
def resources():
    return f'''<div class="glass" style="border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:2px;box-shadow:none"><span class="micro" style="padding-bottom:6px">Ressources du passage</span>{''.join(f'<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid rgba(17,17,19,.07)"><span style="color:{MU}">{svg(P[i],17)}</span><span style="flex:1;font-size:13.5px;font-weight:600">{t}</span><span style="font-size:12px;color:{MU}">{d}</span></div>' for i,t,d in [('note','Commentaires','Matthew Henry · 3'),('data','Thèmes Nave','Amour de Dieu'),('paper','Dictionnaire','Nicodème'),('clock','Chronologie','vers 27 ap. J.-C.')])}
<div style="display:flex;align-items:center;gap:12px;margin-top:10px;padding:10px;border-radius:16px;background:rgba(17,17,19,.05)"><span style="width:36px;height:36px;border-radius:18px;background:#111113;color:#FFFFFF;display:flex;align-items:center;justify-content:center">{svg(P["play"],15,"#FFFFFF")}</span><span style="flex:1;display:flex;flex-direction:column;gap:5px"><span style="font-size:13px;font-weight:600">Écouter Jean 3</span><span style="height:4px;border-radius:2px;background:rgba(17,17,19,.1);display:block"><i style="display:block;width:38%;height:4px;border-radius:2px;background:#111113"></i></span></span><span class="gm" style="font-size:11.5px;color:{MU}">1:52</span></div></div>'''
def continuer():
    return f'''<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">{''.join(f'<a href="#" class="glass" style="border-radius:24px;padding:8px;display:flex;gap:12px;align-items:center;text-decoration:none;color:{TX};box-shadow:none"><img src="{IMG[k]}" alt="" style="width:84px;height:64px;border-radius:16px;object-fit:cover;filter:saturate(.15)"><span style="display:flex;flex-direction:column"><span class="micro" style="font-size:9.5px">{a}</span><strong style="font-size:14px;font-weight:600">{b}</strong></span></a>' for k,a,b in [('plan','Plan · jour 214','Jean 3 – 4'),('cours','Cours & vidéos','L’Évangile de Jean')])}</div>'''
def originaux():
    return f'''<div class="glass" style="border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:10px;box-shadow:none"><span class="micro">Où sont les originaux</span>{''.join(f'<div style="display:flex;flex-direction:column;gap:5px"><span style="display:flex;justify-content:space-between;font-size:13px"><strong style="font-weight:600">{n}</strong><span class="gm" style="font-size:11.5px;color:{MU}">{t}</span></span><span style="display:flex;gap:3px">{"".join(f"<i style='flex:1;height:10px;border-radius:2px;background:{c}'></i>" for c in cells)}</span></div>' for n,t,cells in [('Classeur 01','128 documents',['#111113']*7+['rgba(17,17,19,.25)']*2+['rgba(17,17,19,.08)']*3),('Classeur 02','52 documents',['#111113']*3+['#B5432F']+['rgba(17,17,19,.25)']+['rgba(17,17,19,.08)']*7),('Dépôt','360 Bibles',['#8C8378']*5+['rgba(17,17,19,.08)']*7)])}</div>'''
def relations():
    return f'''<div class="glass" style="border-radius:24px;padding:16px 18px;display:flex;flex-direction:column;gap:10px;box-shadow:none"><span class="micro">Relations</span><div style="display:flex;flex-wrap:wrap;gap:6px">{''.join(f'<span style="height:30px;padding:0 12px;border-radius:15px;background:{bg};color:{c};display:flex;align-items:center;gap:6px;font:600 12px Geist"><span style="font:500 10px Geist Mono;opacity:.7">{k}</span>{v}</span>' for k,v,bg,c in [('commande','BC-2026-0019','rgba(17,17,19,.06)',TX),('fournisseur','Antiquités Martin','rgba(17,17,19,.06)',TX),('client','M. Dupont','rgba(17,17,19,.06)',TX),('projet','Boutique de Lyon','rgba(17,17,19,.06)',TX),('stock','STK-0412','rgba(17,17,19,.06)',TX),('paiement','à relier','rgba(181,67,47,.10)',RED)])}</div></div>'''
# exploded stage (scalable)
def stage(scale=1.0,labels=True):
    s=f'''<div style="position:relative;width:{380*scale:.0f}px;height:{400*scale:.0f}px;perspective:1100px;margin:0 auto">
<div style="position:absolute;left:{90*scale:.0f}px;top:{90*scale:.0f}px;width:200px;height:260px;transform-style:preserve-3d;transform:scale({scale}) rotateX(58deg) rotateZ(-36deg);transform-origin:center">
{l.plane(0,l.inv_inner,'#FFFEFB','1px solid #EFEBE4','0 30px 40px rgba(17,17,19,.18)')}
{l.plane(70,l.photo_inner,'rgba(236,237,240,.6)','1.5px solid rgba(62,70,82,.45)','none')}
{l.plane(140,l.data_inner,'rgba(255,255,255,.7)','1.5px solid rgba(181,67,47,.6)','0 0 24px rgba(181,67,47,.10)')}
</div>'''
    if labels:
        s+=f'''<div style="position:absolute;right:0;top:{40*scale:.0f}px;text-align:right"><span class="micro" style="color:{RED};display:block">Données · 0,75</span><span class="gm" style="font-size:16px;font-weight:600;color:{RED}">1 520,00 €</span></div>
<div style="position:absolute;left:0;top:0"><span class="micro" style="color:{SL};display:block">Photo · 0,80</span><span class="gm" style="font-size:12px;color:{MU}">F-47.jpg · 9c1e…</span></div>
<div style="position:absolute;right:0;bottom:{20*scale:.0f}px;text-align:right"><span class="micro" style="display:block">Original papier · 1,00</span><span class="gm" style="font-size:16px;font-weight:600">1 250,00 €</span></div>'''
    return s+'</div>'
def chipsrow():
    return '<div style="display:flex;gap:8px">'+''.join(f'<span class="glass" style="flex:1;border-radius:18px;padding:10px 12px;display:flex;flex-direction:column;gap:1px;box-shadow:none"><span class="micro" style="font-size:9.5px">{k}</span><span style="font:600 13.5px Geist;color:{c}">{v}</span></span>' for k,v,c in [('Original','02 · B · 14',TX),('Liens','6 · 1 manque',TAUPE),('Preuves','4 / 6',TX),('État','Vérifiée',GREEN)])+'</div>'
def ecart():
    return f'''<div class="glass" style="border-radius:24px;padding:16px 18px;display:flex;align-items:center;gap:12px;border-color:rgba(181,67,47,.30)"><span style="flex:1;display:flex;flex-direction:column"><strong style="font-size:15px">Écart de 270 €</strong><span style="font-size:12.5px;color:{MU}">La saisie ne correspond pas à l’original</span></span><a href="#" style="height:42px;padding:0 16px;border-radius:21px;background:#111113;color:#FFFFFF;display:flex;align-items:center;font:600 13.5px Geist;text-decoration:none">Garder 1 250 €</a></div>'''
def mantable():
    rows=[('Original papier','physique · signé','1 250 €','1,00',TX),('Photo F-47.jpg','numérique · sha256 9c1e…','—','0,80',MU),('Lecture OCR','données · 10 champs','1 250 €','0,60',MU),('Saisie comptable','données · 29/09','1 520 €','0,75',RED)]
    return f'''<div class="glass" style="border-radius:24px;padding:16px 18px;display:flex;flex-direction:column;box-shadow:none"><span class="micro" style="padding-bottom:8px">Manifestations</span>{''.join(f'<div style="display:grid;grid-template-columns:1.3fr 1fr 60px 40px;gap:8px;align-items:center;padding:9px 0;border-top:1px solid rgba(17,17,19,.07)"><span style="display:flex;flex-direction:column"><strong style="font-size:13.5px;font-weight:600">{a}</strong><span style="font-size:11.5px;color:{MU}">{b}</span></span><span></span><span class="gm" style="font-size:13px;font-weight:600;color:{c};text-align:right">{v}</span><span class="gm" style="font-size:11.5px;color:{MU};text-align:right">{k}</span></div>' for a,b,v,k,c in rows)}</div>'''
def history(n=5):
    ev=[('#11','preuve · validation humaine','30/09 18:02'),('#10','emplacement → 02 › B › 14','30/09 17:55'),('#8','état · reçue → vérifiée','29/09 10:20'),('#7','saisie comptable · 1 520 €','29/09 09:41'),('#1','intégration FAC-2026-0047','28/09 16:00')]
    return f'''<div class="glass" style="border-radius:24px;padding:16px 18px;display:flex;flex-direction:column;gap:2px;box-shadow:none"><div style="display:flex;justify-content:space-between;padding-bottom:6px"><span class="micro">Historique scellé</span><span class="micro" style="color:{GREEN}">chaîne intacte</span></div>{''.join(f'<div style="display:flex;gap:10px;padding:6px 0;border-top:1px solid rgba(17,17,19,.07);font-size:13px"><span class="gm" style="color:{MU};width:28px">{a}</span><span style="flex:1">{b}</span><span class="gm" style="font-size:11.5px;color:{MU}">{c}</span></div>' for a,b,c in ev[:n])}</div>'''
def verses(fs=19,n=8):
    v=lambda n,t,hl=False: f'<p style="margin:0;{"margin:0 -12px;padding:8px 12px;border-radius:14px;background:rgba(17,17,19,.06);" if hl else ""}font:400 {fs}px/1.75 Literata,serif;color:#1C1C26"><sup class="gm" style="font-size:10px;color:{MU}">{n}</sup> {t}</p>'
    return ''.join([v(14,'Et comme Moïse éleva le serpent dans le désert, il faut de même que le Fils de l’homme soit élevé,'),v(15,'afin que quiconque croit en lui ait la vie éternelle.'),v(16,'Car Dieu a tant <span style="border-bottom:2px solid #111113;font-weight:600">aimé</span> le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.',True),v(17,'Dieu, en effet, n’a pas envoyé son Fils dans le monde pour qu’il juge le monde, mais pour que le monde soit sauvé par lui.'),v(18,'Celui qui croit en lui n’est point jugé ; mais celui qui ne croit pas est déjà jugé, parce qu’il n’a pas cru au nom du Fils unique de Dieu.'),v(19,'Et ce jugement c’est que, la lumière étant venue dans le monde, les hommes ont préféré les ténèbres à la lumière, parce que leurs œuvres étaient mauvaises.'),v(20,'Car quiconque fait le mal hait la lumière, et ne vient point à la lumière, de peur que ses œuvres ne soient dévoilées ;'),v(21,'mais celui qui agit selon la vérité vient à la lumière, afin que ses œuvres soient manifestées, parce qu’elles sont faites en Dieu.')][:n])
def strongcard():
    return f'''<div class="glass" style="border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:6px;background:rgba(255,255,255,.8)"><span style="display:flex;justify-content:space-between"><span class="dot" style="font-size:24px">G25</span><span class="gm" style="font-size:11.5px;color:{MU}">143 occurrences</span></span><span style="font:500 30px Literata,serif;line-height:1.1">ἀγαπάω</span><span style="font-size:13px;color:{MU}">agapaō · verbe · aimer</span><span style="font-size:14px">Aimer d’un amour de choix et de volonté, qui se donne.</span>
<div style="display:flex;gap:6px;margin-top:6px">{''.join(f'<span style="height:30px;padding:0 12px;border-radius:15px;background:rgba(17,17,19,.06);display:flex;align-items:center;font:600 12px Geist">{x}</span>' for x in ['Concordance','Mots liés','Dictionnaire'])}</div></div>'''
def verseprints():
    return f'''<div class="glass" style="border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:10px;box-shadow:none"><span class="micro">Empreintes de ce verset</span>{''.join(f'<div style="display:flex;gap:12px;align-items:center;padding-top:10px;border-top:1px solid rgba(17,17,19,.07)"><span style="width:8px;height:8px;border-radius:2px;background:{c};flex:none"></span><span style="display:flex;flex-direction:column"><strong style="font-size:13.5px;font-weight:600">{t}</strong><span style="font-size:12px;color:{MU}">{s}</span></span></div>' for t,s,c in [('BIB-2026-0001','Bible Segond 21 · exemplaire de mission · Étagère 1',TAUPE),('Carnet p. 34','« Relire Jean 3:16 avec le groupe »',SL),('Note du 1er octobre','« Donner avant de recevoir. »',SL),('MIS-2026-0002','marque-page Jean 3:16 offert avec chaque Bible',TAUPE)])}</div>'''
def readerhead():
    return f'''<div style="display:flex;justify-content:space-between;align-items:center"><span class="glass" style="height:44px;border-radius:22px;display:flex;align-items:center;padding:0 6px 0 16px;gap:10px;font:600 15px Geist;box-shadow:none">Jean<span class="dot" style="font-size:22px">3</span><span style="height:32px;padding:0 12px;border-radius:16px;background:rgba(17,17,19,.06);display:flex;align-items:center;font:600 12.5px Geist Mono">LSG</span></span><span style="display:flex;gap:8px">{''.join(f'<a href="#" class="ib glass" aria-label="{a}" style="box-shadow:none">{svg(P[i],18)}</a>' for i,a in [('play','Écouter'),('layers','Comparer'),('more','Plus')])}</span></div>'''
def bg_bible(w,h):
    return f'<img src="{IMG["route"]}" alt="" style="position:absolute;left:-60px;top:-60px;width:{w+120}px;height:{h+120}px;object-fit:cover;filter:blur(50px) saturate(.25);opacity:.5"><div style="position:absolute;inset:0;background:rgba(244,244,242,.62)"></div>'
# ---------- DESKTOP 1440x900 ----------
W,H=1440,900
DH=f'''<div class="l">{aur(W,H)}{sidebar('home',True)}
<main style="position:absolute;left:276px;right:24px;top:24px;bottom:24px;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:24px">
<section style="display:flex;flex-direction:column;gap:22px;padding-top:12px">
<div style="display:flex;justify-content:space-between;align-items:flex-end">{header(120)}<span class="ib glass" style="font:700 15px Geist">O</span></div>
{deck(560)}{widgets()}{continuer()}</section>
<section style="display:flex;flex-direction:column;gap:16px;padding-top:12px">{checks()}{timeline(5)}{originaux()}</section>
</main></div>'''
DF=f'''<div class="l">{aur(W,H)}{sidebar('layers',True)}
<main style="position:absolute;left:276px;right:24px;top:24px;bottom:24px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:28px">
<section style="display:flex;flex-direction:column;gap:14px">
<div style="display:flex;gap:10px;align-items:center"><a href="#" class="ib glass" aria-label="Retour">{svg(P["back"],20)}</a><span class="micro">Réalités › Travail › Factures</span></div>
<div style="flex:1;display:flex;align-items:center;justify-content:center">{stage(1.35)}</div>
<div><span class="dot" style="font-size:54px;line-height:1">FAC·2026·0047</span><div style="color:{MU};margin-top:6px">Facture de rachat · Antiquités Martin → M. Dupont · 28/09/2026</div></div>
</section>
<section style="display:flex;flex-direction:column;gap:14px;padding-top:4px">
<div style="display:flex;justify-content:flex-end;gap:8px"><span class="glass" style="height:38px;border-radius:19px;padding:0 14px;display:flex;align-items:center;gap:7px;font:600 12.5px Geist;box-shadow:none"><span style="width:7px;height:7px;border-radius:4px;background:{GREEN}"></span>Vérifiée · 29/09</span><a href="#" class="glass" style="height:38px;border-radius:19px;padding:0 14px;display:flex;align-items:center;gap:7px;font:600 12.5px Geist;text-decoration:none;color:{TX};box-shadow:none">{svg(P["print"],16)}Étiquette</a></div>
{ecart()}{chipsrow()}{mantable()}{relations()}{history(3)}</section>
</main></div>'''
DB=f'''<div class="l" style="background:#FFFFFF">{bg_bible(W,H)}{sidebar('book',True)}
<main style="position:absolute;left:276px;right:24px;top:24px;bottom:24px;display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:24px">
<section class="glass" style="border-radius:30px;padding:24px 56px 24px 56px;display:flex;flex-direction:column;gap:16px;overflow:hidden">{readerhead()}<span class="micro" style="margin-top:8px">Entretien de Jésus avec Nicodème</span>{verses(19,7)}</section>
<section style="display:flex;flex-direction:column;gap:16px">{strongcard()}{verseprints()}{resources()}</section>
</main></div>'''
# ---------- TABLET 1194x834 ----------
TW,TH=1194,834
TH_=f'''<div class="l">{aur(TW,TH)}{sidebar('home',False)}
<main style="position:absolute;left:104px;right:20px;top:22px;bottom:20px;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:20px">
<section style="display:flex;flex-direction:column;gap:18px;padding-top:8px">{header(100)}{deck(520)}{widgets()}{continuer()}</section>
<section style="display:flex;flex-direction:column;gap:14px;padding-top:8px">{checks()}{timeline(4)}{originaux()}</section>
</main></div>'''
TF=f'''<div class="l">{aur(TW,TH)}{sidebar('layers',False)}
<main style="position:absolute;left:104px;right:20px;top:22px;bottom:20px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px">
<section style="display:flex;flex-direction:column;gap:10px">
<div style="display:flex;gap:10px;align-items:center"><a href="#" class="ib glass" aria-label="Retour">{svg(P["back"],20)}</a><span class="micro">Travail › Factures</span></div>
<div style="flex:1;display:flex;align-items:center;justify-content:center">{stage(1.15)}</div>
<div><span class="dot" style="font-size:44px;line-height:1">FAC·2026·0047</span><div style="color:{MU};margin-top:4px">Antiquités Martin → M. Dupont · rachat</div></div>
</section>
<section style="display:flex;flex-direction:column;gap:12px;padding-top:4px">{ecart()}{chipsrow()}{mantable()}{relations()}</section>
</main></div>'''
TB=f'''<div class="l" style="background:#FFFFFF">{bg_bible(TW,TH)}{sidebar('book',False)}
<main style="position:absolute;left:104px;right:20px;top:22px;bottom:20px;display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);gap:20px">
<section class="glass" style="border-radius:30px;padding:22px 36px;display:flex;flex-direction:column;gap:14px;overflow:hidden">{readerhead()}<span class="micro" style="margin-top:6px">Entretien de Jésus avec Nicodème</span>{verses(18,7)}</section>
<section style="display:flex;flex-direction:column;gap:14px">{strongcard()}{verseprints()}{resources()}</section>
</main></div>'''
def build(R):
    for n,t,b,w,h in [('DD1-Bureau-Accueil','Ordinateur · Accueil',DH,W,H),('DD2-Bureau-Facture','Ordinateur · Facture F-47',DF,W,H),('DD3-Bureau-Bible','Ordinateur · Bible',DB,W,H),('DT1-Tablette-Accueil','Tablette · Accueil',TH_,TW,TH),('DT2-Tablette-Facture','Tablette · Facture F-47',TF,TW,TH),('DT3-Tablette-Bible','Tablette · Bible',TB,TW,TH)]:
        style=l.ST.replace('.l{width:390px;height:844px;','.l{width:%dpx;height:%dpx;'%(w,h))
        open(R+'/'+n+'.dc.html','w').write(page(t,F,style,b,w,h))
