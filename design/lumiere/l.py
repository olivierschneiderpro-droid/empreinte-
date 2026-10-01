from common import *
F='family=Doto:wght@400;700;900&amp;family=Geist:wght@400;500;600;700;800&amp;family=Geist+Mono:wght@400;500;600&amp;family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600&amp;family=Caveat:wght@600'
TX='#111113'; MU='#76767C'; BLUE='#3E4652'; CORAL='#8C8378'; RED='#B5432F'; GREEN='#4F7A63'
ST=f'''.l{{width:390px;height:844px;background:#F4F4F2;color:{TX};font:500 15px/1.45 'Geist',system-ui,sans-serif;position:relative;overflow:hidden;letter-spacing:-.005em}}
.aur{{position:absolute;border-radius:50%;pointer-events:none}}
.glass{{background:rgba(255,255,255,.62);backdrop-filter:blur(22px) saturate(120%);-webkit-backdrop-filter:blur(22px) saturate(120%);border:1px solid rgba(255,255,255,.9);box-shadow:inset 0 1px 0 rgba(255,255,255,.95),0 8px 24px rgba(17,17,19,.07)}}
.dot{{font-family:'Doto',monospace;font-weight:900;letter-spacing:-.02em}}
.gm{{font-family:'Geist Mono',monospace}}
.micro{{font:600 10.5px 'Geist Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:{MU}}}
.ib{{width:44px;height:44px;border-radius:22px;display:flex;align-items:center;justify-content:center;color:{TX};box-sizing:border-box}}
.tab{{position:absolute;left:16px;bottom:26px;height:62px;width:270px;border-radius:31px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:center;box-sizing:border-box;padding:0 6px}}
.tab a{{display:flex;flex-direction:column;align-items:center;gap:1px;font:600 10px 'Geist';color:#5E5E70;text-decoration:none;height:50px;justify-content:center;border-radius:25px}}
.tab a.on{{background:rgba(17,17,19,.07);color:{TX}}}
.act{{position:absolute;right:16px;bottom:26px;width:62px;height:62px;border-radius:31px;display:flex;align-items:center;justify-content:center;color:#FFFFFF;background:#111113;box-shadow:inset 0 1px 1px rgba(255,255,255,.25),0 12px 26px rgba(17,17,19,.28)}}'''
def aurora(extra=''):
    return f'''<div class="aur" style="width:420px;height:420px;left:-170px;top:-140px;background:radial-gradient(circle,#E3E2DE 0%,rgba(227,226,222,0) 68%)"></div>
<div class="aur" style="width:380px;height:380px;right:-170px;top:60px;background:radial-gradient(circle,#DCDFE3 0%,rgba(220,223,227,0) 68%)"></div>
<div class="aur" style="width:420px;height:420px;left:-120px;top:420px;background:radial-gradient(circle,#E6E2DC 0%,rgba(230,226,220,0) 66%)"></div>
<div class="aur" style="width:380px;height:380px;right:-160px;bottom:-120px;background:radial-gradient(circle,#DEE2E0 0%,rgba(222,226,224,0) 66%)"></div>{extra}'''
def tabbar(on):
    o=''.join(f'<a href="#" class="{"on" if k==on else ""}">{svg(P[k],21)}<span>{l}</span></a>' for k,l in [('home','Accueil'),('layers','Réalités'),('book','Bible'),('shield','Vérifier')])
    return f'<nav class="tab glass" aria-label="Navigation">{o}</nav><a href="#" class="act" aria-label="Capturer une réalité">{svg(P["scan"],26,"#FFFFFF",2)}</a>'
FP='<svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="#0B0B12" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 25c-2-2.6-3-5.6-3-9a11 11 0 0 1 22 0"/><path d="M12 27c-1.6-2.4-2.6-5.6-2.6-9.6a6.6 6.6 0 0 1 13.2 0c0 3-.5 5.6-1.6 8"/><path d="M16 28c-1-2.6-1.8-6.2-1.8-10.6a1.8 1.8 0 0 1 3.6 0c0 3.4-.2 6-.8 8.6"/></svg>'
def ring(p,c,size,sw,label):
    r=(size-sw)/2;C=2*3.14159*r
    return f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" aria-hidden="true"><circle cx="{size/2}" cy="{size/2}" r="{r}" fill="none" stroke="rgba(11,11,18,.08)" stroke-width="{sw}"/><circle cx="{size/2}" cy="{size/2}" r="{r}" fill="none" stroke="{c}" stroke-width="{sw}" stroke-linecap="round" stroke-dasharray="{C*p:.1f} {C:.1f}" transform="rotate(-90 {size/2} {size/2})"/></svg>'
miniinv=f'''<div style="display:flex;flex-direction:column;gap:5px;font:400 8px 'Literata',serif;color:#4A4540"><strong style="font:600 9px Literata;color:#1F1A16">ANTIQUITÉS MARTIN</strong><span>Facture n° F-47 · 28/09/2026</span><span style="height:1px;background:#E2DCD2"></span><span style="display:flex;justify-content:space-between"><span>Commode Louis-Philippe</span><span>640,00</span></span><span style="display:flex;justify-content:space-between"><span>Lot de 6 chaises</span><span>401,67</span></span><span style="display:flex;justify-content:space-between;font-weight:600;color:#1F1A16"><span>Total TTC</span><span>1 250,00 €</span></span></div>'''
HOME=f'''<div class="l">{aurora()}
<div style="position:absolute;top:54px;left:20px;right:20px;display:flex;justify-content:space-between;align-items:center">
<span style="display:flex;align-items:center;gap:8px;font:700 18px Geist;letter-spacing:-.02em">{FP}empreinte</span>
<span class="ib glass" style="font:700 15px Geist">O</span></div>
<div style="position:absolute;top:108px;left:20px;right:20px">
<span class="micro">Mercredi · octobre</span>
<div class="dot" style="font-size:96px;line-height:.95;margin-top:2px">01.10</div>
<span style="display:flex;gap:8px;align-items:center;margin-top:6px;font:500 15px Geist;color:{MU}"><strong style="color:{TX};font-weight:700">4 traces</strong> aujourd’hui<span style="width:4px;height:4px;border-radius:2px;background:{MU}"></span><span style="color:{RED};font-weight:600">1 écart</span></span>
</div>
<div style="position:absolute;top:268px;left:0;right:0;height:250px;perspective:900px">
<div style="position:absolute;left:44px;right:44px;top:0;height:150px;border-radius:22px;transform:translateZ(-80px);background:#E2E0DC;box-shadow:0 10px 26px rgba(17,17,19,.10);padding:14px 18px;box-sizing:border-box;color:#111113"><span class="micro">Mission</span></div>
<div style="position:absolute;left:30px;right:30px;top:34px;height:160px;border-radius:22px;transform:translateZ(-40px);overflow:hidden;box-shadow:0 14px 34px rgba(40,40,90,.18)"><img src="{IMG['route']}" alt="" style="width:100%;height:100%;object-fit:cover;filter:saturate(.35) contrast(.95)"><span class="micro" style="position:absolute;left:18px;top:14px;color:#FFFFFF;opacity:.95">Bible · Jean 3</span></div>
<div style="position:absolute;left:16px;right:16px;top:74px;height:172px;border-radius:24px;background:#FFFEFB;box-shadow:0 1px 0 rgba(0,0,0,.04),0 22px 44px rgba(17,17,19,.16);padding:16px 18px;box-sizing:border-box;display:flex;gap:14px">
<div style="flex:1;display:flex;flex-direction:column;justify-content:space-between"><span class="micro">Facture · reçue 09:12</span><span class="dot" style="font-size:30px;line-height:1">F-47</span><span class="gm" style="font-size:12px;color:{MU}">FAC-2026-0047 · 02·B·14</span></div>
<div style="width:118px;background:#FFFFFF;border:1px solid #EFEBE4;border-radius:8px;padding:10px;transform:rotate(3deg);box-shadow:0 6px 14px rgba(0,0,0,.06)">{miniinv}</div>
<span class="glass" style="position:absolute;right:-6px;top:-16px;display:flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:16px;font:600 12.5px Geist;color:{RED}"><span style="width:7px;height:7px;border-radius:4px;background:{RED};box-shadow:0 0 0 4px rgba(181,67,47,.14)"></span>1 250 ≠ 1 520</span>
</div></div>
<div style="position:absolute;top:536px;left:16px;right:16px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">
<a href="#" class="glass" style="grid-column:span 2;border-radius:24px;padding:14px 16px;text-decoration:none;color:{TX};display:flex;gap:14px;align-items:center"><span style="flex:1;display:flex;flex-direction:column;gap:4px"><span class="micro">Verset du jour · Ps 23.1</span><span style="font:500 17px/1.35 Literata,serif">« L’Éternel est mon berger&#8239;: je ne manquerai de rien. »</span></span></a>
<a href="#" class="glass" style="border-radius:24px;padding:14px;text-decoration:none;color:{TX};display:flex;align-items:center;gap:10px;height:96px;box-sizing:border-box"><span style="position:relative;width:58px;height:58px">{ring(.64,CORAL,58,7,'')}<span class="dot" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:17px">64</span></span><span style="display:flex;flex-direction:column"><strong style="font-size:14px">1000 Bibles</strong><span style="font-size:12px;color:{MU}">640 remises</span></span></a>
<a href="#" class="glass" style="border-radius:24px;padding:14px;text-decoration:none;color:{TX};display:flex;flex-direction:column;justify-content:space-between;height:96px;box-sizing:border-box"><span class="micro">Plan de lecture</span><span style="display:flex;align-items:baseline;gap:6px"><span class="dot" style="font-size:30px;line-height:1">214</span><span style="font-size:12.5px;color:{MU}">/365 · Jean 3–4</span></span></a>
</div>
{tabbar('home')}
</div>'''
def plane(z,inner,bg,border,shadow):
    return f'<div style="position:absolute;left:0;top:0;width:200px;height:260px;border-radius:14px;transform:translateZ({z}px);background:{bg};border:{border};box-shadow:{shadow};box-sizing:border-box;overflow:hidden">{inner}</div>'
inv_inner=f'<div style="padding:16px">{miniinv.replace("8px","9px")}<span style="display:block;margin-top:40px;font:600 22px Caveat;color:#2B3E8C;transform:rotate(-5deg)">J. Martin</span></div>'
photo_inner=f'<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(62,70,82,.10) 0 1px,transparent 1px 14px),repeating-linear-gradient(90deg,rgba(62,70,82,.10) 0 1px,transparent 1px 14px)"></div><div style="padding:16px;opacity:.55">{miniinv.replace("8px","9px")}</div><div style="position:absolute;left:0;right:0;top:118px;height:3px;background:linear-gradient(90deg,transparent,#3E4652,transparent);box-shadow:0 0 12px rgba(62,70,82,.6)"></div>'
data_inner=f'''<div style="padding:14px;display:flex;flex-direction:column;gap:7px">{''.join(f'<div style="display:flex;justify-content:space-between;border-bottom:1px solid rgba(11,11,18,.08);padding-bottom:5px;font:500 10.5px Geist Mono"><span style="color:{MU}">{k}</span><span style="color:{c};font-weight:600">{v}</span></div>' for k,v,c in [('numéro','F-47',TX),('date','28/09',TX),('HT','1 041,67',TX),('TVA','208,33',TX),('total','1 520,00',RED)])}</div>'''
FACT=f'''<div class="l">{aurora()}
<div style="position:absolute;top:54px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center"><a href="#" class="ib glass" aria-label="Retour">{svg(P["back"],20)}</a><span class="glass" style="height:34px;border-radius:17px;padding:0 14px;display:flex;align-items:center;gap:7px;font:600 12.5px Geist"><span style="width:7px;height:7px;border-radius:4px;background:{GREEN}"></span>Vérifiée · 29/09</span><a href="#" class="ib glass" aria-label="Plus">{svg(P["more"],20)}</a></div>
<div style="position:absolute;top:96px;left:0;right:0;height:410px;perspective:1100px">
<div style="position:absolute;left:96px;top:96px;width:200px;height:260px;transform-style:preserve-3d;transform:rotateX(58deg) rotateZ(-36deg)">
{plane(0,inv_inner,'#FFFEFB','1px solid #EFEBE4','0 30px 40px rgba(17,17,19,.18)')}
{plane(70,photo_inner,'rgba(236,237,240,.6)','1.5px solid rgba(62,70,82,.45)','0 0 0 rgba(0,0,0,0)')}
{plane(140,data_inner,'rgba(255,255,255,.7)','1.5px solid rgba(181,67,47,.6)','0 0 24px rgba(181,67,47,.10)')}
</div>
<div style="position:absolute;right:16px;top:58px;display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="micro" style="color:{RED}">Données · 0,75</span><span class="gm" style="font-size:15px;font-weight:600;color:{RED}">1 520,00 €</span></div>
<div style="position:absolute;left:16px;top:20px;display:flex;flex-direction:column;gap:2px"><span class="micro" style="color:{BLUE}">Photo · 0,80</span><span class="gm" style="font-size:12px;color:{MU}">F-47.jpg · 9c1e…</span></div>
<div style="position:absolute;right:16px;top:330px;display:flex;flex-direction:column;align-items:flex-end;gap:2px"><span class="micro" style="color:{TX}">Original papier · 1,00</span><span class="gm" style="font-size:15px;font-weight:600">1 250,00 €</span></div>
</div>
<div style="position:absolute;top:500px;left:20px;right:20px;display:flex;flex-direction:column;gap:4px">
<span class="dot" style="font-size:40px;line-height:1">FAC·2026·0047</span>
<span style="color:{MU}">Antiquités Martin → M. Dupont · rachat</span></div>
<div style="position:absolute;top:578px;left:16px;right:16px;display:flex;gap:8px">
{''.join(f'<span class="glass" style="flex:1;border-radius:18px;padding:10px 12px;display:flex;flex-direction:column;gap:1px"><span class="micro" style="font-size:9.5px">{k}</span><span style="font:600 13.5px Geist;color:{c}">{v}</span></span>' for k,v,c in [('Original','02 · B · 14',TX),('Liens','6 · 1 manque',CORAL),('Preuves','4 / 6',TX)])}
</div>
<div class="glass" style="position:absolute;top:650px;left:16px;right:16px;border-radius:24px;padding:14px 16px;display:flex;align-items:center;gap:12px;border-color:rgba(181,67,47,.30)">
<span style="flex:1;display:flex;flex-direction:column"><strong style="font-size:15px">Écart de 270 €</strong><span style="font-size:12.5px;color:{MU}">La saisie ne correspond pas à l’original</span></span>
<a href="#" style="height:42px;padding:0 16px;border-radius:21px;background:{TX};color:#FFFFFF;display:flex;align-items:center;font:600 13.5px Geist;text-decoration:none">Garder 1 250 €</a></div>
{tabbar('layers')}
</div>'''
BIB=f'''<div class="l" style="background:#FFFFFF">
<img src="{IMG['route']}" alt="" style="position:absolute;inset:-40px;width:470px;height:924px;object-fit:cover;filter:blur(40px) saturate(.25);opacity:.55">
<div style="position:absolute;inset:0;background:rgba(244,244,242,.6)"></div>
<div style="position:absolute;top:54px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center">
<span class="glass" style="height:44px;border-radius:22px;display:flex;align-items:center;padding:0 6px 0 16px;gap:10px;font:600 15px Geist">Jean<span class="dot" style="font-size:22px">3</span><span style="height:32px;padding:0 12px;border-radius:16px;background:rgba(11,11,18,.06);display:flex;align-items:center;font:600 12.5px Geist Mono">LSG</span></span>
<span style="display:flex;gap:8px"><a href="#" class="ib glass" aria-label="Écouter">{svg(P["play"],18)}</a><a href="#" class="ib glass" aria-label="Plus">{svg(P["more"],20)}</a></span></div>
<div class="glass" style="position:absolute;top:114px;left:12px;right:12px;bottom:112px;border-radius:30px;padding:22px 20px;display:flex;flex-direction:column;gap:12px;overflow:hidden">
<span class="micro">Entretien de Jésus avec Nicodème</span>
<p style="margin:0;font:400 18px/1.7 Literata,serif;color:#1C1C26"><sup class="gm" style="font-size:10px;color:{MU}">15</sup> afin que quiconque croit en lui ait la vie éternelle.</p>
<p style="margin:0 -10px;padding:6px 10px;border-radius:14px;font:400 18px/1.7 Literata,serif;color:#1C1C26;background:rgba(17,17,19,.06)"><sup class="gm" style="font-size:10px;color:{MU}">16</sup> Car Dieu a tant <span style="border-bottom:2px solid {TX};font-weight:600">aimé</span> le monde qu’il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu’il ait la vie éternelle.</p>
<div class="glass" style="margin:-4px 0 0 30px;border-radius:20px;padding:12px 14px;display:flex;flex-direction:column;gap:4px;background:rgba(255,255,255,.82)">
<span style="display:flex;justify-content:space-between;align-items:center"><span class="dot" style="font-size:20px">G25</span><span class="gm" style="font-size:11px;color:{MU}">143 occurrences</span></span>
<span style="font:500 24px Literata,serif;line-height:1.1">ἀγαπάω <span style="font:500 13px Geist;color:{MU}">agapaō · aimer</span></span>
<span style="font-size:12.5px;color:{MU}">Un amour de choix, qui se donne.</span></div>
<p style="margin:0;font:400 18px/1.7 Literata,serif;color:#1C1C26"><sup class="gm" style="font-size:10px;color:{MU}">17</sup> Dieu, en effet, n’a pas envoyé son Fils dans le monde pour qu’il juge le monde, mais pour que le monde soit sauvé par lui.</p>
</div>
<div style="position:absolute;left:16px;right:16px;bottom:120px;display:flex;gap:8px;justify-content:center">
<span class="glass" style="height:38px;border-radius:19px;padding:0 14px;display:flex;align-items:center;gap:8px;font:600 12.5px Geist"><span style="width:8px;height:8px;border-radius:2px;background:{CORAL}"></span>BIB-2026-0001 · exemplaire</span>
<span class="glass" style="height:38px;border-radius:19px;padding:0 14px;display:flex;align-items:center;gap:8px;font:600 12.5px Geist"><span style="width:8px;height:8px;border-radius:2px;background:{BLUE}"></span>1 note</span></div>
{tabbar('book')}
</div>'''
def build(R):
    open(R+'/DL1-Lumiere-Accueil.dc.html','w').write(page('Lumière · Accueil',F,ST,HOME))
    open(R+'/DL2-Lumiere-Facture.dc.html','w').write(page('Lumière · Facture F-47',F,ST,FACT))
    open(R+'/DL3-Lumiere-Bible.dc.html','w').write(page('Lumière · Bible',F,ST,BIB))
