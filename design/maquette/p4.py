from base import *
P='verifier'
screen('V01-Verifier.dc.html','Vérifier',f'<div class="top"><h1 class="h1">Vérifier</h1>{chip("4 ouvertes","crit")}</div>'+scroll(
'<span class="muted" style="font-size:14px">Le système signale. Vous décidez.</span>',
chips(chip('Toutes','ink'),chip('1 critique','crit'),chip('3 attention','warn'),chip('5 infos','info')),
lst(li('Montants différents','FAC-2026-0047 · 1 250 € / 1 520 €',chip('critique','crit'),sev=CRIT,href='V02-Incoherence.dc.html'),
    li('Paiement sans justificatif','PAY-2026-0001 · 1 250 €',chip('attention','warn'),sev=WARN,href='V03-RelationManquante.dc.html'),
    li('Doublon possible','FAC-2026-0046 et 0047',chip('attention','warn'),sev=WARN,href='V04-Doublon.dc.html'),
    li('Original introuvable','LIV-2026-0031 · Concordance Strong',chip('attention','warn'),sev=WARN,href='V05-Introuvable.dc.html'),
    li('Nouvelle réalité à intégrer','Document trouvé en Pochette 12',chip('info'),sev=INFO,href='V06-NouvelleRealite.dc.html'),
    li('Passage d’état inhabituel','FAC-2026-0039 · reçu → payé',chip('info'),sev=INFO,href='V07-TransitionForcee.dc.html'),
    li('Garantie bientôt expirée','EQP-2024-0007 · 12 jours',chip('info'),sev=INFO,href='D02-Equipement.dc.html')),
grid(2,tile('Cohérence globale','94 %',href='V10-Rapport.dc.html'),tile('Décisions humaines','3 en attente',href='V09-Humain.dc.html',mono=False)),
)+nav('verif'),P)
screen('V02-Incoherence.dc.html','Montants différents',top('Montants différents','V01-Verifier.dc.html')+scroll(
note('Anomalie détectée — vérification nécessaire.','crit','alert'),
grid(2,f'<div class="tile" style="background:#E3EFE8"><span class="muted small">Original papier · conf. 1</span><strong class="mono" style="font-size:20px">1 250 €</strong></div>',f'<div class="tile" style="background:#FBE5E3"><span class="muted small">Saisie · conf. 0,75</span><strong class="mono" style="font-size:20px;color:#9A1D12">1 520 €</strong></div>'),
f'<div class="card" style="padding:10px"><div style="background:#F7F5EE;border-radius:6px;padding:14px;font-size:12px;color:#30302C;display:flex;justify-content:space-between"><span>Total TTC</span><strong style="background:#FCEFDA;outline:2px solid #E7A83A;padding:1px 4px;border-radius:3px">1 250,00 €</strong></div><span class="muted small">Extrait de la photo F-47.jpg</span></div>',
kvs(('OCR','1 250 € · conf. 0,6'),('Attributs saisis','1 250 €'),('Hypothèse','chiffres inversés (25 ↔ 52)')),
btns(btn('Garder 1 250 €','ink',style='flex:1'),btn('Garder 1 520 €','line',style='flex:1')),
'<span class="muted small" style="text-align:center">L’ancienne valeur restera dans l’historique.</span>',
),P)
screen('V03-RelationManquante.dc.html','Paiement sans justificatif',top('Rapprochement','V01-Verifier.dc.html')+scroll(
card('<span class="eyebrow">Paiement</span><strong class="mono">PAY-2026-0001 · 1 250,00 €</strong><span class="muted">Virement · facture FAC-2026-0047</span>'),
'<span class="muted" style="font-size:14px">Lignes du relevé importé (OFX, 30/09) qui pourraient correspondre :</span>',
lst(li('VIR ANTIQUITES MARTIN F47','30/09 · −1 250,00 €',chip('98 %','phy'),icon='bank',ic_color=PHY),li('VIR A MARTIN','26/09 · −1 520,00 €',chip('41 %','info'),icon='bank'),li('CB BRICO LYON','29/09 · −1 250,00 €',chip('22 %','info'),icon='bank')),
btn('Associer la première ligne','ink','link'),
),P)
screen('V04-Doublon.dc.html','Doublon possible',top('Doublon possible','V01-Verifier.dc.html')+scroll(
grid(2,*[f'<div class="tile" style="gap:6px"><div style="height:120px;background:#F7F5EE;border-radius:6px;padding:8px;font-size:9px;color:#30302C;display:flex;flex-direction:column;gap:3px"><strong>FACTURE</strong><span>N° {n}</span><span>{d}</span><span style="margin-top:auto">{m}</span></div><strong class="mono small">{i}</strong><span class="muted small">{l}</span></div>' for n,d,m,i,l in [('F-46','27/09/2026','1 250,00 €','FAC-2026-0046','Pochette 14'),('F-47','28/09/2026','1 250,00 €','FAC-2026-0047','Pochette 14')]]),
kvs(('Même montant','oui'),('Même émetteur','oui'),('Numéro','différent'),('Date','différente'),('Lignes','différentes')),
'<div class="card">'+''.join(f'<label class="li" style="cursor:pointer"><input type="radio" name="dbl" {"checked" if j==0 else ""} style="width:20px;height:20px;accent-color:#18211F"><span class="col"><strong style="font-weight:600">{a}</strong></span></label>' for j,a in enumerate(['Deux réalités distinctes','L’une est la copie de l’autre','Nouvelle version (facture rectificative)','Vrai doublon : fusionner']))+'</div>',
btn('Confirmer','ink'),
),P)
screen('V05-Introuvable.dc.html','Original introuvable',top('Original introuvable','V01-Verifier.dc.html')+scroll(
card('<span class="eyebrow">Rupture de traçabilité</span><strong>Concordance Strong · exemplaire n° 31</strong><span class="mono muted small">LIV-2026-0031</span>'),
kvs(('Emplacement attendu','Bibliothèque › Étagère 1 › rang 2'),('Dernière fois vu','12/09 · inventaire'),('Dernier détenteur','Paul M. · prêt rendu le 10/09')),
lst(li('Étagère 1 › rang 3','Rang voisin, même collection','',icon='pin',ic_color=PHY),li('Bureau','Dernier lieu d’étude de Paul','',icon='pin',ic_color=PHY),li('Carton « dons »','Préparé le 11/09','',icon='box',ic_color=PHY),title='Où chercher en priorité'),
btns(btn('Retrouvé','ink','check',style='flex:1'),btn('Déclarer perdu','line',style='flex:1')),
),P)
screen('V06-NouvelleRealite.dc.html','Nouvelle réalité',top('Nouvelle réalité','V01-Verifier.dc.html')+scroll(
note('Document physique trouvé sans enregistrement numérique : nouvelle réalité à intégrer.','num','plus'),
f'<div class="card" style="padding:10px"><div style="height:180px;background:#F7F5EE;border-radius:6px;padding:14px;font-size:11px;color:#30302C;display:flex;flex-direction:column;gap:5px"><strong>BON DE LIVRAISON</strong><span>N° BL-2209 · Imprimerie Biblique</span><span>Livraison de 400 Bibles Segond 21</span><span style="margin-top:auto">Reçu le 22/09</span></div><span class="muted small">Trouvé en Pochette 12 pendant l’inventaire</span></div>',
card(ctitle('Empreinte propose')+'<span class="mono" style="font-size:20px">DOC-2026-0213</span><span class="muted">Relier à la mission « 1000 Bibles » · preuve de réception</span>'),
btn('Intégrer','ink','plus','C02-Lecture.dc.html'),
),P)
screen('V07-TransitionForcee.dc.html','Passage inhabituel',top('Passage inhabituel','V01-Verifier.dc.html')+scroll(
card('<strong class="mono">FAC-2026-0039</strong><div class="row" style="gap:8px">'+chip('Reçu','phy')+'<span class="muted">→</span>'+chip('Payé','warn')+'</div><span class="muted">Le 25/09 par Olivier · étape « Vérifié » sautée</span>'),
card('<span class="muted small">Note laissée</span><span>« Payée en espèces au salon, vérifiée sur place. »</span>'),
btns(btn('Confirmer','ink','check',style='flex:1'),btn('Revenir à « Reçu »','line',style='flex:1')),
),P)
screen('V08-JournalAltere.dc.html','Journal altéré',top('Intégrité','V01-Verifier.dc.html')+scroll(
note('Le registre a été modifié hors d’Empreinte à partir de l’événement n° 214.','crit','lock'),
kvs(('Événement','#214 · 14/09 · FAC-2026-0021'),('Empreinte attendue','<span class="hash">5d13…e88a</span>'),('Empreinte trouvée','<span class="hash">0be9…71c2</span>'),('Sauvegarde intacte','01/10 · 06:00')),
btns(btn('Comparer','line',style='flex:1'),btn('Restaurer','ink','refresh',style='flex:1')),
),P)
auto=[('Rapprocher paiements et relevés','auto'),('Proposer un emplacement','auto'),('Imprimer les étiquettes','auto'),('Rappeler les garanties','auto'),('Lire les montants (OCR)','auto + vérif.')]
hum=[('Choisir la bonne valeur en cas d’écart','humain'),('Décider d’un paiement','humain'),('Signer, remettre un original','humain'),('Lire, méditer, étudier','humain')]
screen('V09-Humain.dc.html','Ce qui reste humain',top('Machine ou humain ?','V01-Verifier.dc.html')+scroll(
lst(*[li(a,'',chip(b,'num'),icon='sparkle',ic_color=NUM) for a,b in auto],title='Peut être automatisé'),
lst(*[li(a,'',chip(b,'ink'),icon='hand') for a,b in hum],title='Doit rester humain'),
note('Le numérique ne doit pas remplacer ce que l’humain doit continuer à vivre et exercer.','phy','heart'),
),P)
d=[('Travail',96),('Maison',91),('Bible & étude',99),('Missions',88),('Apprentissage',94)]
screen('V10-Rapport.dc.html','Rapport de cohérence',top('Cohérence','V01-Verifier.dc.html')+scroll(
card('<span class="eyebrow">Ensemble</span><span class="mono" style="font-size:40px">94 %</span><span class="muted">des réalités sont identifiées, reliées, prouvées et localisées</span>'),
'<div class="card" style="gap:10px">'+''.join(f'<div style="display:flex;flex-direction:column;gap:4px"><span class="between"><span>{n}</span><span class="mono small">{v} %</span></span>{bar(v,PHY if v>=90 else WARN)}</div>' for n,v in d)+'</div>',
grid(2,tile('Sans emplacement','12'),tile('Sans preuve','31'),tile('Non reliées','8'),tile('Doublons','2')),
),P)
