IMG={'route':'/_blob/15aa876ea5acdd5b358ffd90f5dd0a6d','cours':'/_blob/c792ac42b95169e24b669dae52a5f92e','plan':'/_blob/78a839e39ff0176d6cfad4a604fd4d18','ecrit':'/_blob/3443d86d1c4f1ab2adfb3e7ccdc89464','lecteur':'/_blob/4110bba89ebaeb6e3f2a08efc3de901a','biblio':'/_blob/f7ec7c3bdf260b9d3a5dfef772a9c2a0','audio':'/_blob/ddf7725bd22a76dc1a10ad77b1999b1a','vide':'/_blob/fdbb749cbbb29a5bfbd12822a8bc7c38','elie':'/_blob/eb7674c4a12ea549cb4140e8cde1c65e','p12':'/_blob/006d23df69fcc9b8a671fb44fcd803af','p1':'/_blob/88bf4f7fe50773a7bd6ce55f6068651d'}
def page(title,fonts,style,body,w=390,h=844):
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{fonts}&amp;display=swap">
<style>
body{{margin:0}}
a{{color:inherit}}a:hover{{color:inherit}}
{style}
</style>
</helmet>
{body}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''
def svg(paths,size=22,stroke='currentColor',sw=1.8,extra=''):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" {extra}>{paths}</svg>'
P={'scan':'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
'home':'<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9.5 21v-6h5v6"/>','layers':'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>','camera':'<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>','book':'<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>','shield':'<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>','back':'<path d="M15 5l-7 7 7 7"/>','fwd':'<path d="M9 5l7 7-7 7"/>','more':'<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>','alert':'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.01"/>','pin':'<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>','play':'<path d="M7 4v16l13-8z"/>','check':'<path d="m5 12 4.5 4.5L19 7"/>','link':'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>','share':'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>','heart':'<path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20z"/>','qr':'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>','print':'<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>','image':'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>','data':'<path d="M4 6h16M4 12h16M4 18h10"/>','paper':'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/>','clock':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>','bank':'<path d="M3 10 12 4l9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>','user':'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>','flag':'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>','note':'<path d="M5 3h10l4 4v14H5z"/><path d="M9 11h6M9 15h6"/>','search':'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>','plus':'<path d="M12 5v14M5 12h14"/>','box':'<path d="m3 7 9-4 9 4v10l-9 4-9-4z"/><path d="m3 7 9 4 9-4M12 11v10"/>'}
QRBITS=["1111111010110111111","1000001011010100001","1011101001101101101","1011101110010101101","1011101010111101101","1000001001010100001","1111111010101011111","0000000011010000000","1101011100111011010","0110100101100100111","1011011010011011001","0101100111010110110","1100111001101001011","0000000010110101010","1111111001011010110","1000001011100110001","1011101010011011101","1000001101101000110","1111111010110110011"]
def qr(size,color='#1B1530',bg=None):
    r=''.join(f'<rect x="{x}" y="{y}" width="1" height="1"/>' for y,row in enumerate(QRBITS) for x,c in enumerate(row) if c=='1')
    b=f'<rect x="-1" y="-1" width="21" height="21" fill="{bg}"/>' if bg else ''
    return f'<svg viewBox="-1 -1 21 21" width="{size}" height="{size}" fill="{color}" shape-rendering="crispEdges" role="img" aria-label="QR code de FAC-2026-0047">{b}{r}</svg>'
def facture(w=230,rot=-3,shadow='0 18px 40px rgba(40,25,70,.25)',sticker=True,stamp=None):
    st=f'<div style="position:absolute;top:10px;right:10px;background:#FFFFFF;padding:4px;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.18);display:flex;flex-direction:column;align-items:center;gap:2px">{qr(46)}<span style="font:700 7px \'JetBrains Mono\',monospace;color:#1B1530">FAC-2026-0047</span></div>' if sticker else ''
    sp=f'<div style="position:absolute;bottom:18px;right:12px;transform:rotate(-10deg);border:2.5px solid {stamp};color:{stamp};font:700 11px \'JetBrains Mono\',monospace;padding:3px 8px;border-radius:4px;opacity:.85;letter-spacing:.05em">VÉRIFIÉE 29/09</div>' if stamp else ''
    return f'''<div style="position:relative;width:{w}px;height:{int(w*1.33)}px;background:#FFFEFA;border-radius:3px;transform:rotate({rot}deg);box-shadow:{shadow};padding:16px 16px 14px;box-sizing:border-box;display:flex;flex-direction:column;gap:6px;color:#3A3530;font:9.5px/1.45 'Literata',Georgia,serif">
<strong style="font:700 12px 'Literata',serif;color:#1F1A16;letter-spacing:.04em;padding-right:60px">ANTIQUITÉS MARTIN</strong>
<span style="color:#7A716A">12 quai Saint-Antoine · Lyon</span>
<strong style="font:700 13px 'Literata',serif;margin-top:14px;color:#1F1A16">Facture n° F-47</strong>
<span>Client : M. Dupont · 28/09/2026</span>
<div style="border-top:1px solid #DDD5C8;border-bottom:1px solid #DDD5C8;padding:6px 0;display:flex;flex-direction:column;gap:3px;margin-top:4px"><span style="display:flex;justify-content:space-between"><span>Commode Louis-Philippe</span><span>640,00</span></span><span style="display:flex;justify-content:space-between"><span>Lot de 6 chaises</span><span>401,67</span></span><span style="display:flex;justify-content:space-between;color:#7A716A"><span>TVA 20 %</span><span>208,33</span></span></div>
<span style="display:flex;justify-content:space-between;font-weight:700;color:#1F1A16;font-size:11px"><span>Total TTC</span><span>1 250,00 €</span></span>
<span style="margin-top:auto;font-family:'Caveat',cursive;font-size:20px;color:#2B3E8C;transform:rotate(-4deg);align-self:flex-start">J. Martin</span>
{st}{sp}
</div>'''
