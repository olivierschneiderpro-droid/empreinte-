import json, os, html
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'project')
FONT='<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&amp;family=IBM+Plex+Sans:wght@400;500;600&amp;family=IBM+Plex+Mono:wght@500&amp;family=Literata:opsz,wght@7..72,400;7..72,600&amp;display=swap">'
PHY='#1F6B4F'; NUM='#2E46C2'; CRIT='#B42318'; WARN='#B76E00'; INFO='#5B6763'; INK='#18211F'
STYLE='''<style>
body{margin:0}
a{color:#2E46C2}a:hover{color:#1F3196}
.app{width:390px;height:844px;box-sizing:border-box;background:#F2F3EF;color:#18211F;font-family:"IBM Plex Sans",system-ui,sans-serif;font-size:15px;line-height:1.45;display:flex;flex-direction:column;overflow:hidden;position:relative}
.top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:52px 20px 10px;min-height:44px}
.toptitle{font-weight:600;font-size:16px;text-align:center;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.h1{font-family:"Bricolage Grotesque",sans-serif;font-weight:700;font-size:28px;line-height:1.1;letter-spacing:-0.01em;margin:0}
.h2{font-family:"Bricolage Grotesque",sans-serif;font-weight:700;font-size:17px;margin:0}
.eyebrow{font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5B6763}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace;font-weight:500}
.serif{font-family:"Literata",Georgia,serif}
.scroll{flex:1;overflow:hidden;padding:0 20px 16px;display:flex;flex-direction:column;gap:12px}
.card{background:#FFFFFF;border:1px solid #DDE0D9;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:8px}
.row{display:flex;align-items:center;gap:10px}
.between{display:flex;align-items:center;justify-content:space-between;gap:10px}
.col{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.muted{color:#5B6763;font-size:13px}
.small{font-size:12px}
.chip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:13px;font-size:12.5px;font-weight:600;white-space:nowrap;border:none;font-family:"IBM Plex Sans",sans-serif}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.phy{background:#E3EFE8;color:#17573F}
.num{background:#E6EAFB;color:#2438A3}
.crit{background:#FBE5E3;color:#9A1D12}
.warn{background:#FCEFD9;color:#8A5300}
.info{background:#E9ECEB;color:#3B4643}
.ink{background:#18211F;color:#FFFFFF}
.ghost{background:#FFFFFF;color:#18211F;border:1px solid #DDE0D9}
.dot{width:8px;height:8px;border-radius:4px;flex:none;display:inline-block}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:48px;padding:0 16px;border-radius:12px;font:600 15px "IBM Plex Sans",sans-serif;border:none;cursor:pointer;text-decoration:none;box-sizing:border-box}
.btn-ink{background:#18211F;color:#FFFFFF}
.btn-line{background:#FFFFFF;color:#18211F;border:1px solid #C9CEC6}
.btn-sm{height:38px;font-size:13.5px;padding:0 12px;border-radius:10px}
.icon{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
.ic16{width:16px;height:16px}
.iconbtn{width:44px;height:44px;border-radius:22px;border:1px solid #DDE0D9;background:#FFFFFF;display:flex;align-items:center;justify-content:center;color:#18211F;cursor:pointer;padding:0;flex:none;box-sizing:border-box}
.nav{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));background:#FFFFFF;border-top:1px solid #DDE0D9;padding:8px 6px 26px}
.nav a{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;font-weight:500;color:#5B6763;text-decoration:none;padding-top:4px}
.nav a.on{color:#18211F;font-weight:600}
.nav .cap{width:52px;height:52px;border-radius:26px;background:#18211F;color:#FFFFFF;display:flex;align-items:center;justify-content:center;margin-top:-22px;border:4px solid #F2F3EF}
.path{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:13.5px}
.sep{color:#8A948F}
.bar{height:6px;border-radius:3px;background:#E3E6E0;overflow:hidden;display:block}
.bar i{display:block;height:6px;border-radius:3px}
.list{display:flex;flex-direction:column}
.li{display:flex;align-items:center;gap:12px;padding:11px 0;border-top:1px solid #E6E8E3;text-decoration:none;color:inherit}
.li:first-child{border-top:none;padding-top:2px}
.li:last-child{padding-bottom:2px}
.sev{width:4px;align-self:stretch;border-radius:2px;flex:none;min-height:34px}
.tile{background:#FFFFFF;border:1px solid #DDE0D9;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:2px;text-decoration:none;color:inherit;min-width:0}
.g2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.g3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.g4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.ibox{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex:none}
.search{display:flex;align-items:center;gap:8px;height:44px;border-radius:12px;background:#FFFFFF;border:1px solid #DDE0D9;padding:0 12px;color:#5B6763;font-size:14.5px}
.seg{display:flex;background:#E6E8E3;border-radius:10px;padding:3px;gap:2px}
.seg span{flex:1;text-align:center;font-size:13px;font-weight:600;padding:6px 0;border-radius:8px;color:#5B6763}
.seg span.on{background:#FFFFFF;color:#18211F}
.verse{font-family:"Literata",Georgia,serif;font-size:17.5px;line-height:1.7;color:#1F2523;margin:0}
.vn{font-family:"IBM Plex Mono",monospace;font-size:11px;color:#5B6763;vertical-align:super;margin-right:3px}
.sheet{background:#FFFFFF;border-radius:20px 20px 0 0;border-top:1px solid #DDE0D9;padding:16px 20px 30px;display:flex;flex-direction:column;gap:12px}
.toggle{width:44px;height:26px;border-radius:13px;background:#C9CEC6;position:relative;flex:none}
.toggle.on{background:#1F6B4F}
.toggle i{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:10px;background:#FFFFFF}
.toggle.on i{left:21px}
.field{display:flex;flex-direction:column;gap:4px}
.field label{font-size:12.5px;color:#5B6763;font-weight:500}
.input{height:44px;border-radius:10px;border:1px solid #C9CEC6;background:#FFFFFF;padding:0 12px;display:flex;align-items:center;font-size:15px;box-sizing:border-box}
.hash{font-family:"IBM Plex Mono",monospace;font-size:11px;color:#8A948F}
</style>'''
I={
'home':'<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9.5 21v-6h5v6"/>',
'layers':'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
'camera':'<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>',
'book':'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
'shield':'<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
'qr':'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
'search':'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
'back':'<path d="M15 5l-7 7 7 7"/>',
'fwd':'<path d="M9 5l7 7-7 7"/>',
'pin':'<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
'link':'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
'alert':'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.01"/>',
'check':'<path d="m5 12 4.5 4.5L19 7"/>',
'x':'<path d="M6 6l12 12M18 6 6 18"/>',
'flash':'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
'print':'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
'nfc':'<path d="M6 8.5a6 6 0 0 1 0 7M9.5 6a10 10 0 0 1 0 12M13 3.5a14 14 0 0 1 0 17"/>',
'pen':'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
'more':'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
'tag':'<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
'note':'<path d="M5 3h10l4 4v14H5z"/><path d="M9 11h6M9 15h6"/>',
'mark':'<path d="M6 3h12v18l-6-4-6 4z"/>',
'grid':'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
'doc':'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/>',
'box':'<path d="m3 7 9-4 9 4v10l-9 4-9-4z"/><path d="m3 7 9 4 9-4M12 11v10"/>',
'laptop':'<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
'flag':'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
'folder':'<path d="M3 6h7l2 2h9v11H3z"/>',
'user':'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
'users':'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1.2-3.4 3.6-5 6.5-5s5.3 1.6 6.5 5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 15c1.8.6 3 2.2 3.6 5"/>',
'clock':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
'euro':'<path d="M17 6.5A6.5 6.5 0 1 0 17 17.5"/><path d="M4 10h9M4 14h9"/>',
'bank':'<path d="M3 10 12 4l9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
'sig':'<path d="M3 17c3-1 4-9 6-9s0 9 3 9 3-5 5-5 2 3 4 3"/><path d="M3 21h18"/>',
'eye':'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
'hand':'<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6 7s-5-2-6.5-5L3 13a1.5 1.5 0 0 1 2.5-1.6L8 14"/>',
'cog':'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
'cloud':'<path d="M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
'download':'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
'upload':'<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
'lock':'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
'sun':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
'globe':'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
'help':'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17v.01"/>',
'heart':'<path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20z"/>',
'play':'<path d="M7 4v16l13-8z"/>',
'pause':'<path d="M8 5v14M16 5v14"/>',
'headph':'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',
'compare':'<path d="M8 3v18M16 3v18M3 7h5M16 17h5"/>',
'share':'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
'copy':'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
'sparkle':'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
'timeline':'<path d="M3 12h18"/><circle cx="7" cy="12" r="2"/><circle cx="14" cy="12" r="2"/><path d="M7 10V5M14 14v5M20 9v6"/>',
'map':'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
'list':'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
'plus':'<path d="M12 5v14M5 12h14"/>',
'tabs':'<rect x="3" y="6" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v11"/>',
'calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
'filter':'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
'scan':'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
'barcode':'<path d="M4 5v14M7 5v14M10 5v14M14 5v14M16 5v14M20 5v14"/>',
'color':'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h9"/>',
'refresh':'<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
'wrench':'<path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8z" transform="rotate(0)"/><path d="M14 7 4 17l3 3 10-10"/>',
'truck':'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
'cart':'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 12h11L21 8H6.5"/>',
'brain':'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
'loop':'<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M20 4v5h-5M4 20v-5h5"/>',
'star':'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
'hash':'<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>',
'bell':'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
'image':'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
'trash':'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
}
def ic(n,cls='icon',style=''):
    s=f' style="{style}"' if style else ''
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true"{s}>{I[n]}</svg>'
LOGO='<svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#18211F" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M8 25c-2-2.6-3-5.6-3-9a11 11 0 0 1 22 0"/><path d="M12 27c-1.6-2.4-2.6-5.6-2.6-9.6a6.6 6.6 0 0 1 13.2 0c0 3-.5 5.6-1.6 8"/><path d="M16 28c-1-2.6-1.8-6.2-1.8-10.6a1.8 1.8 0 0 1 3.6 0c0 3.4-.2 6-.8 8.6"/></svg>'
NAVF={'home':'Main.dc.html','real':'F02-Realites.dc.html','cap':'F06-Capturer.dc.html','bible':'B01-Lecteur.dc.html','verif':'V01-Verifier.dc.html'}
def nav(on):
    items=[('home','home','Aujourd’hui'),('real','layers','Réalités'),('cap','camera','Capturer'),('bible','book','Bible'),('verif','shield','Vérifier')]
    out=['<nav class="nav" aria-label="Navigation principale">']
    for k,i,l in items:
        f=NAVF[k]
        if k=='cap': out.append(f'<a href="{f}" aria-label="{l}"><span class="cap">{ic("camera")}</span><span>{l}</span></a>')
        else:
            cl=' class="on"' if k==on else ''
            out.append(f'<a href="{f}"{cl}>{ic(i)}<span>{l}</span></a>')
    out.append('</nav>'); return ''.join(out)
def top(title='',back=None,right=None,chip=None):
    b=f'<a class="iconbtn" href="{back}" aria-label="Retour">{ic("back")}</a>' if back else '<span style="width:44px;flex:none"></span>'
    mid=chip if chip else f'<span class="toptitle">{title}</span>'
    r=right if right is not None else '<span style="width:44px;flex:none"></span>'
    return f'<div class="top">{b}{mid}{r}</div>'
def ibtn(n,label,href=None):
    return f'<a class="iconbtn" href="{href}" aria-label="{label}">{ic(n)}</a>' if href else f'<button class="iconbtn" type="button" aria-label="{label}">{ic(n)}</button>'
def heading(t,eyebrow=None,sub=None):
    e=f'<span class="eyebrow">{eyebrow}</span>' if eyebrow else ''
    s=f'<span class="muted" style="font-size:14px">{sub}</span>' if sub else ''
    return f'<div style="display:flex;flex-direction:column;gap:4px">{e}<h1 class="h1">{t}</h1>{s}</div>'
def card(inner,style=''):
    return f'<div class="card" style="{style}">{inner}</div>'
def ctitle(t,right=''):
    return f'<div class="between"><span class="h2">{t}</span>{right}</div>'
def chip(t,c='info',style=''):
    return f'<span class="chip {c}" style="{style}">{t}</span>'
def chips(*cs): return '<div class="chips">'+''.join(cs)+'</div>'
def li(title,sub='',right='',icon=None,ic_color=None,ic_bg=None,sev=None,href=None):
    lead=''
    if sev: lead=f'<span class="sev" style="background:{sev}"></span>'
    elif icon: lead=f'<span class="ibox" style="background:{ic_bg or "#EEF0EC"};color:{ic_color or INK}">{ic(icon)}</span>'
    s=f'<span class="muted">{sub}</span>' if sub else ''
    tag='a' if href else 'div'; h=f' href="{href}"' if href else ''
    return f'<{tag} class="li"{h}>{lead}<span class="col"><strong style="font-weight:600">{title}</strong>{s}</span>{right}</{tag}>'
def lst(*items,title=None,right=''):
    t=ctitle(title,right) if title else ''
    return f'<div class="card">{t}<div class="list">{"".join(items)}</div></div>'
def tile(label,value,sub='',bg='#FFFFFF',fg=INK,href=None,mono=True):
    tag='a' if href else 'div'; h=f' href="{href}"' if href else ''
    v=f'<strong class="{"mono" if mono else ""}" style="font-size:18px">{value}</strong>'
    s=f'<span class="muted small">{sub}</span>' if sub else ''
    return f'<{tag} class="tile"{h} style="background:{bg};color:{fg}"><span class="muted small">{label}</span>{v}{s}</{tag}>'
def grid(n,*cells): return f'<div class="g{n}">'+''.join(cells)+'</div>'
def path(*parts,mono=False):
    seps='<span class="sep">›</span>'.join(f'<span>{p}</span>' for p in parts)
    return f'<div class="path{" mono" if mono else ""}">{seps}</div>'
def bar(pct,color=PHY): return f'<span class="bar"><i style="width:{pct}%;background:{color}"></i></span>'
def btn(t,kind='ink',icon=None,href=None,style=''):
    i=ic(icon) if icon else ''
    if href: return f'<a class="btn btn-{kind}" href="{href}" style="{style}">{i}{t}</a>'
    return f'<button class="btn btn-{kind}" type="button" style="{style}">{i}{t}</button>'
def btns(*b): return '<div class="row" style="gap:8px">'+''.join(b)+'</div>'
def search(ph): return f'<div class="search">{ic("search")}<span>{ph}</span></div>'
def seg(*opts,on=0): return '<div class="seg">'+''.join(f'<span class="{"on" if i==on else ""}">{o}</span>' for i,o in enumerate(opts))+'</div>'
def toggle(on=True): return f'<span class="toggle{" on" if on else ""}" role="img" aria-label="{"activé" if on else "désactivé"}"><i></i></span>'
def kv(k,v): return f'<div class="between" style="padding:6px 0;border-top:1px solid #EEF0EC"><span class="muted">{k}</span><span style="font-weight:600;text-align:right">{v}</span></div>'
def kvs(*pairs,title=None):
    t=ctitle(title) if title else ''
    inner=''.join(kv(k,v) for k,v in pairs)
    return f'<div class="card" style="gap:2px">{t}{inner}</div>'
def field(l,v,mono=False): return f'<div class="field"><label>{l}</label><div class="input{" mono" if mono else ""}">{v}</div></div>'
def scroll(*blocks,gap=12): return f'<div class="scroll" style="gap:{gap}px">'+''.join(blocks)+'</div>'
def note(t,c='info',icon='alert'): 
    colors={'info':('#EEF0EC','#3B4643'),'crit':('#FBE5E3','#9A1D12'),'warn':('#FCEFD9','#8A5300'),'phy':('#E3EFE8','#17573F'),'num':('#E6EAFB','#2438A3')}
    bg,fg=colors[c]
    return f'<div class="row" style="background:{bg};color:{fg};border-radius:12px;padding:10px 12px;align-items:flex-start;font-size:13.5px">{ic(icon,"icon ic16","margin-top:2px")}<span>{t}</span></div>'
SCREENS={}
def screen(fname,title,body,page,lang='fr'):
    SCREENS[fname]=dict(title=title,body=body,page=page)
def render(fname,s):
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{s['title']}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONT}
{STYLE}
</helmet>
<div class="app">
{s['body']}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":390,"height":844}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''
QRBITS=["1111111010110111111","1000001011010100001","1011101001101101101","1011101110010101101","1011101010111101101","1000001001010100001","1111111010101011111","0000000011010000000","1101011100111011010","0110100101100100111","1011011010011011001","0101100111010110110","1100111001101001011","0000000010110101010","1111111001011010110","1000001011100110001","1011101010011011101","1000001101101000110","1111111010110110011"]
def qr(size=120,color=INK):
    r=''.join(f'<rect x="{x}" y="{y}" width="1" height="1"/>' for y,row in enumerate(QRBITS) for x,c in enumerate(row) if c=='1')
    return f'<svg viewBox="-1 -1 21 21" width="{size}" height="{size}" fill="{color}" shape-rendering="crispEdges" role="img" aria-label="QR code">{r}</svg>'
