# Empreinte

> Le réel laisse une empreinte. L'empreinte retrouve le réel.

Empreinte relie une réalité physique (une facture papier, un livre, une Bible,
un équipement, une mission…) à ses représentations numériques, **sans que l'une
remplace l'autre**. Chaque réalité reçoit une identité, un emplacement, un état,
des preuves et des relations, et tout reste traçable.

```
Document physique original
   ↕
Représentation numérique (photo, scan)
   ↕
Données structurées (OCR, saisie)
   ↕
Relations avec les autres réalités (paiement, client, projet, stock…)
```

Photo ≠ facture physique. OCR ≠ facture physique. Données ≠ facture physique.
Ce sont des **manifestations** différentes d'une même réalité, avec des niveaux de
confiance différents (original 1, scan 0,9, photo 0,8, saisie 0,75, OCR 0,6).

## Démarrer

```sh
./scripts/telecharger-sources.sh   # Bible Strong + dépendances
npm run demo                       # scénario complet de la facture F-47
npm test
```

## L'exemple de la facture n° 47

```sh
alias empreinte=./apps/cli/bin/empreinte.js

empreinte integrer document --sous-type facture-rachat --titre "Facture de rachat F-47" \
  --ref "numero-facture=F-47@Client Dupont" --attr montant=1250 --attr sens=achat
# ✔ FAC-2026-0047 intégré. À inscrire sur l'original : FAC-2026-0047

empreinte manifester FAC-2026-0047 physique-original --donnee "montant=1 250 €"
empreinte manifester FAC-2026-0047 photo --fichier photos/F-47.jpg   # empreinte SHA-256 calculée
empreinte manifester FAC-2026-0047 donnees-structurees --donnee montant=1520

empreinte proposer-marquage FAC-2026-0047   # QR + numéro lisible + emplacement
empreinte placer FAC-2026-0047 --auto       # Fournisseurs → 2026 → Achats / Classeur 01 → Section A → Pochette 01
empreinte etiquette FAC-2026-0047           # FAC-2026-0047.svg à imprimer
empreinte verifier
# ✖ [incoherence-valeur] « montant » diffère : 1250 (physique-original) / 1520 (donnees-structurees)…
#   Anomalie détectée — vérification nécessaire.
empreinte corriger FAC-2026-0047/M3 --donnee montant=1250 --par Olivier
empreinte scan EMPREINTE:FAC-2026-0047      # ce que donne le QR collé sur l'original
empreinte lacunes FAC-2026-0047
empreinte organiser --nombre 600 --recherches 10 --domaines 5 --projets 3
```

`empreinte aide` liste toutes les commandes.

## Ce que le système calcule

| Question | Où |
|---|---|
| **Identité** : quel identifiant ? existe-t-il déjà ? Le n° 47 devient `FAC-2026-0047` s'il est libre | `packages/core/src/identifiants.ts` |
| **Correspondance** : copie, nouvelle version, doublon ? | `anomalies.ts` (`doublon-potentiel`) |
| **Emplacement** : où est l'original, qui l'a ? | `registre.ts` (`placer`, `signalerIntrouvable`), `organisation.ts` |
| **État** : reçu → vérifié → payé → archivé, contesté, remboursé… | `etats.ts` |
| **Preuve** : photo, OCR, signature, relevé bancaire, validation humaine | `registre.ts` (`ajouterPreuve`) |
| **Relations** : facture → paiement, commande, projet, stock… | `registre.ts` (`relier`) |
| **Incohérences** : 1 250 € contre 1 520 €, paiement sans justificatif, original introuvable, papier sans enregistrement | `anomalies.ts` |
| **Marquage physique** : numéro, QR, code-barres, NFC, emplacement, couleur, selon le contexte | `marquage.ts` |
| **Organisation physique** : chronologique, par domaine, par projet, hybride + identifiant, comparés sur 11 critères | `organisation.ts` |
| **Lacunes** : ce qui manque, est en double, non relié, mal identifié, à risque, automatisable, doit rester humain ou physique | `lacunes.ts` |
| **Traçabilité** : journal chaîné SHA-256, toute modification hors système est détectée | `journal.ts` |
| **Bible** : relier un exemplaire, une note ou une mission aux passages étudiés | `bible.ts` |

Le système ne conclut jamais « erreur » : il signale *« Anomalie détectée — vérification
nécessaire »* et laisse l'humain trancher. Une transition d'état inhabituelle est refusée,
sauf si on la force, et elle reste alors signalée.

## Structure

```
packages/core             modèle et calculs d'Empreinte (TypeScript, sans dépendance lourde)
packages/bible-references analyseur de références bibliques FR/EN (MIT, issu de Bible Strong)
apps/cli                  outil en ligne de commande, étiquettes QR (bibliothèque qrcode, MIT)
app/                      application Empreinte : fork complet de Bible Strong (GPL-3.0)
docs/VISION.md            la vision d'origine
```

## Sources open source

- **[Bible Strong](https://github.com/smontlouis/bible-strong)** (GPL-3.0) : application
  d'étude biblique React Native/Expo (concordance Strong, lexiques, interlinéaire, hors ligne).
  Forké en entier dans `app/` : c’est la base de l’application Empreinte.
- **Analyseur de références bibliques** (MIT, Stephen Smith / Bible Strong) : copié dans
  `packages/bible-references`.
- **[node-qrcode](https://github.com/soldair/node-qrcode)** (MIT) : génération des QR codes.

Empreinte est distribué sous **GPL-3.0-or-later**, compatible avec Bible Strong.

## Déployer sur le serveur HP

Sur le serveur (Linux, Node 20 ou plus), dans une copie de ce dépôt :

```bash
./scripts/deployer-hp.sh archive empreinte-web.tar.gz   # depuis l'archive prête
./scripts/deployer-hp.sh source                         # ou en compilant depuis le code
```

L'app est alors servie sur `http://<adresse-du-hp>:8080` (variable `PORT` pour changer).
Avec `sudo` et systemd, un service `empreinte` est installé et redémarre avec le serveur.
