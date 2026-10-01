from common import *
import l
TX,MU,SL,TP,RED,GRN=l.TX,l.MU,l.BLUE,l.CORAL,l.RED,l.GREEN
F=l.F
LINE='rgba(17,17,19,.07)'; SOFT='rgba(17,17,19,.05)'
R=__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)),'..','maquette','project')
SCREENS={}
EXTRA_CSS='''.g{background:rgba(255,255,255,.62);backdrop-filter:blur(22px) saturate(120%);-webkit-backdrop-filter:blur(22px) saturate(120%);border:1px solid rgba(255,255,255,.9);box-shadow:inset 0 1px 0 rgba(255,255,255,.95),0 8px 24px rgba(17,17,19,.06);border-radius:24px}
.gf{background:rgba(255,255,255,.62);border:1px solid rgba(255,255,255,.9);border-radius:20px;backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px)}
.h1{font:700 30px/1.08 'Geist',sans-serif;letter-spacing:-.03em;margin:0}
.h2{font:650 17px/1.25 'Geist',sans-serif;letter-spacing:-.015em;margin:0}
.sub{font-size:14px;color:#76767C}
.row{display:flex;align-items:center;gap:12px}
.col{display:flex;flex-direction:column;min-width:0}
.btw{display:flex;align-items:center;justify-content:space-between;gap:10px}
.sep{border-top:1px solid rgba(17,17,19,.07)}
.pill{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border-radius:15px;font:600 12.5px 'Geist';white-space:nowrap;background:rgba(17,17,19,.06);color:#111113}
.pill.on{background:#111113;color:#FFFFFF}
.pill.red{background:rgba(181,67,47,.10);color:#B5432F}
.pill.grn{background:rgba(79,122,99,.12);color:#3F6A53}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;height:52px;border-radius:26px;font:600 15px 'Geist';text-decoration:none;border:none;cursor:pointer;box-sizing:border-box}
.btn.k{background:#111113;color:#FFFFFF}
.btn.w{background:rgba(255,255,255,.7);color:#111113;border:1px solid rgba(255,255,255,.95);box-shadow:0 6px 18px rgba(17,17,19,.06)}
.sq{width:40px;height:40px;border-radius:14px;background:rgba(17,17,19,.05);display:flex;align-items:center;justify-content:center;flex:none;color:#111113}
.verse{font:400 18px/1.7 'Literata',serif;color:#1C1C26;margin:0}
.vn{font:500 10px 'Geist Mono',monospace;color:#76767C;vertical-align:super;margin-right:3px}
.tog{width:46px;height:28px;border-radius:14px;background:rgba(17,17,19,.14);position:relative;flex:none}
.tog i{position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:11px;background:#FFFFFF;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.tog.on{background:#111113}.tog.on i{left:21px}
.inp{height:50px;border-radius:16px;background:rgba(255,255,255,.7);border:1px solid rgba(17,17,19,.08);display:flex;align-items:center;padding:0 16px;font:500 15px Geist;box-sizing:border-box}
'''
STYLE=l.ST+EXTRA_CSS
def ic(n,s=20,c='currentColor',w=1.8): return svg(P.get(n,P['more']),s,c,w)
P.update({
'x':'<path d="M6 6l12 12M18 6 6 18"/>','copy':'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
'refresh':'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>','hand':'<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6 7s-5-2-6.5-5L3 13a1.5 1.5 0 0 1 2.5-1.6L8 14"/>',
'sig':'<path d="M3 17c3-1 4-9 6-9s0 9 3 9 3-5 5-5 2 3 4 3"/><path d="M3 21h18"/>','euro':'<path d="M17 6.5A6.5 6.5 0 1 0 17 17.5"/><path d="M4 10h9M4 14h9"/>',
'laptop':'<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>','folder':'<path d="M3 6h7l2 2h9v11H3z"/>','users':'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1.2-3.4 3.6-5 6.5-5s5.3 1.6 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c1.8.6 3 2.2 3.6 5"/>',
'cal':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>','tag':'<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.3"/>','mark':'<path d="M6 3h12v18l-6-4-6 4z"/>',
'pen':'<path d="M4 20h4L19 9l-4-4L4 16z"/>','nfc':'<path d="M6 8.5a6 6 0 0 1 0 7M9.5 6a10 10 0 0 1 0 12M13 3.5a14 14 0 0 1 0 17"/>','barcode':'<path d="M4 5v14M7 5v14M10 5v14M14 5v14M16 5v14M20 5v14"/>',
'color':'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h9"/>','truck':'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>','cart':'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 12h11L21 8H6.5"/>',
'wrench':'<path d="M14 7 4 17l3 3 10-10"/><path d="M14.5 6.5a4 4 0 0 0 5 5L21 13"/>','lock':'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>','cloud':'<path d="M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
'download':'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>','upload':'<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>','sun':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
'globe':'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>','help':'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17v.01"/>',
'headph':'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>','pause':'<path d="M8 5v14M16 5v14"/>','compare':'<path d="M8 3v18M16 3v18M3 7h5M16 17h5"/>',
'hash':'<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>','sparkle':'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>','timeline':'<path d="M3 12h18"/><circle cx="7" cy="12" r="2"/><circle cx="14" cy="12" r="2"/><path d="M7 10V5M14 14v5M20 9v6"/>',
'map':'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>','list':'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>','tabs':'<rect x="3" y="6" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v11"/>',
'filter':'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>','trash':'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>','bell':'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>','grid':'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
'eye':'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>','flash':'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>','cog':'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
})
def shell(body,tab=None,bg='aurora',dark=False):
    if bg=='aurora': back=l.aurora()
    elif bg=='plain': back=''
    elif bg.startswith('img:'):
        k=bg[4:]; back=f'<img src="{IMG[k]}" alt="" style="position:absolute;inset:-40px;width:470px;height:924px;object-fit:cover;filter:blur(40px) saturate(.25);opacity:.55"><div style="position:absolute;inset:0;background:rgba(244,244,242,.6)"></div>'
    else: back=''
    tb=l.tabbar(tab) if tab else ''
    return f'<div class="l">{back}{body}{tb}</div>'
def top(back=None,center='',right=None,y=54):
    b=f'<a href="{back}" class="ib g" aria-label="Retour" style="border-radius:22px">{ic("back")}</a>' if back else '<span style="width:44px"></span>'
    r=right if right is not None else '<span style="width:44px"></span>'
    return f'<div style="position:absolute;top:{y}px;left:16px;right:16px;display:flex;justify-content:space-between;align-items:center;gap:10px;z-index:5">{b}<span style="flex:1;display:flex;justify-content:center">{center}</span>{r}</div>'
def gbtn(n,label,href='#'): return f'<a href="{href}" class="ib g" aria-label="{label}" style="border-radius:22px">{ic(n)}</a>'
def chipc(t): return f'<span class="g" style="height:34px;border-radius:17px;padding:0 14px;display:flex;align-items:center;gap:7px;font:600 12.5px Geist;box-shadow:none">{t}</span>'
def micro(t,c=None,s=''): return f'<span class="micro" style="{"color:"+c+";" if c else ""}{s}">{t}</span>'
def dot(t,s=40,c=TX,extra=''): return f'<span class="dot" style="font-size:{s}px;line-height:1;color:{c};{extra}">{t}</span>'
def body(inner,top_=110,gap=12,bottom=104,pad=16):
    return f'<div style="position:absolute;top:{top_}px;left:{pad}px;right:{pad}px;bottom:{bottom}px;display:flex;flex-direction:column;gap:{gap}px;overflow:hidden">{inner}</div>'
def card(inner,pad='16px 18px',gap=10,extra=''): return f'<div class="g" style="padding:{pad};display:flex;flex-direction:column;gap:{gap}px;{extra}">{inner}</div>'
def item(title,sub='',right='',lead='',href=None,first=False,pad='11px 0'):
    tag='a' if href else 'div'; h=f' href="{href}"' if href else ''
    s=f'<span style="font-size:12.5px;color:{MU}">{sub}</span>' if sub else ''
    return f'<{tag}{h} style="display:flex;align-items:center;gap:12px;padding:{pad};{"" if first else "border-top:1px solid "+LINE+";"}text-decoration:none;color:{TX}">{lead}<span class="col" style="flex:1"><span style="font-weight:600;font-size:14.5px">{title}</span>{s}</span>{right}</{tag}>'
def items(rows,head=None):
    out=''.join(item(*r[:3],lead=(r[3] if len(r)>3 else ''),href=(r[4] if len(r)>4 else None),first=(i==0)) for i,r in enumerate(rows))
    h=f'<div class="btw" style="padding-bottom:4px">{head}</div>' if head else ''
    return card(h+'<div class="col">'+out+'</div>',pad='14px 18px 8px',gap=4)
def lead(n,c=TX,bg=SOFT): return f'<span class="sq" style="background:{bg};color:{c}">{ic(n,19)}</span>'
def sw(c,s=8,r=2): return f'<span style="width:{s}px;height:{s}px;border-radius:{r}px;background:{c};flex:none;display:inline-block"></span>'
def bar(p,c=TX,h=5): return f'<span style="display:block;height:{h}px;border-radius:{h}px;background:rgba(17,17,19,.08)"><i style="display:block;width:{p}%;height:{h}px;border-radius:{h}px;background:{c}"></i></span>'
def tog(on=True): return f'<span class="tog{" on" if on else ""}" role="img" aria-label="{"activé" if on else "désactivé"}"><i></i></span>'
def seg(opts,on=0): return '<div style="display:flex;gap:4px;padding:4px;border-radius:18px;background:rgba(17,17,19,.05)">'+''.join(f'<span style="flex:1;text-align:center;height:32px;line-height:32px;border-radius:14px;font:600 13px Geist;{"background:#FFFFFF;box-shadow:0 1px 4px rgba(0,0,0,.08);color:"+TX if i==on else "color:"+MU}">{o}</span>' for i,o in enumerate(opts))+'</div>'
def search(t,active=False): return f'<div class="g" style="height:50px;border-radius:25px;display:flex;align-items:center;gap:10px;padding:0 18px;color:{TX if active else MU};font:500 15px Geist;box-shadow:none">{ic("search",18)}{t}</div>'
def paper(w=200,rot=0,sticker=True,stamp=None,shadow='0 18px 36px rgba(17,17,19,.16)'): return facture(w,rot,shadow,sticker,stamp)
def screen(name,title,html,group): SCREENS[name]=dict(title=title,html=html,group=group)
def write_all():
    for n,s in SCREENS.items():
        open(R+'/'+n+'.dc.html','w').write(page(s['title'],F,STYLE,s['html']))
