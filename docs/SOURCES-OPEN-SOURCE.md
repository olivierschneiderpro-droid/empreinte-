# Sources open source pour Empreinte

Recherche du 1er octobre 2026. Pour chaque réalité de la vision, les projets open source
qui peuvent y contribuer. Licences lues directement dans le fichier LICENSE de chaque
dépôt (ou sur npm pour les bibliothèques JavaScript), avec la date du dernier commit.

Ce que chaque licence permet pour Empreinte :

| Licence | Utilisation dans Empreinte |
|---|---|
| MIT, Apache-2.0, BSD, MPL-2.0 | ✅ Intégrable directement comme bibliothèque |
| GPL-3.0 | ✅ Intégrable (même licence) |
| AGPL-3.0 | ⚠️ Compatible avec la GPL-3.0, mais impose de publier le code de tout service réseau. À utiliser comme **service séparé** ou comme source d'inspiration |
| BSL, Elastic, « source available » | ❌ Pas open source : à éviter |

Légende des verdicts : **Intégrer** (bibliothèque dans l'app), **Service** (programme à côté,
relié par API), **S'inspirer** (modèle, données ou méthode), **Éviter**.

---

## 1. Bible, étude, passages — *déjà là*

| Projet | Licence | Actif | Verdict | Apport |
|---|---|---|---|---|
| [Bible Strong](https://github.com/smontlouis/bible-strong) | GPL-3.0 | 2026-10 | **Base de l'app** | Lecture, concordance Strong, lexiques, interlinéaire, notes, surbrillances, étiquettes, plans de lecture, hors ligne, iOS/Android/Web |
| [Bible-Passage-Reference-Parser](https://github.com/openbibleinfo/Bible-Passage-Reference-Parser) | MIT | 2026-07 | **Intégré** | « Jean 3:16 » → `John.3.16` (déjà dans `packages/bible-references`) |
| [STEPBible-Data](https://github.com/STEPBible/STEPBible-Data) | CC BY 4.0 | 2026-09 | S'inspirer / données | Lexiques Tyndale, morphologie, noms propres, versification |
| [morphhb](https://github.com/openscriptures/morphhb) | CC BY 4.0 | 2024-08 | Données | Bible hébraïque morphologique (Open Scriptures) |

## 2. Document physique → empreinte numérique (photo, scan, OCR)

| Projet | Licence | Actif | Verdict | Apport |
|---|---|---|---|---|
| [react-native-document-scanner-plugin](https://www.npmjs.com/package/react-native-document-scanner-plugin) | MIT | 2026-01 | **Intégrer** | Photo d'un document avec détection des bords et redressement |
| [expo-camera](https://www.npmjs.com/package/expo-camera) | MIT | 2026-09 | **Intégrer** | Appareil photo dans l'app Expo (déjà la pile de Bible Strong) |
| [Tesseract](https://github.com/tesseract-ocr/tesseract) / [tesseract.js](https://github.com/naptha/tesseract.js) | Apache-2.0 | 2026-09 / 2026-05 | **Intégrer** | OCR hors ligne, français inclus, fonctionne dans le navigateur |
| [docTR](https://github.com/mindee/doctr) | Apache-2.0 | 2026-09 | Service | OCR par apprentissage profond, plus précis sur les factures |
| [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | Apache-2.0 | 2026-09 | Service | OCR et analyse de mise en page (tableaux, lignes de facture) |
| [OCRmyPDF](https://github.com/ocrmypdf/OCRmyPDF) | MPL-2.0 | 2026-09 | Service | Transforme un scan en PDF archivable et cherchable |
| [pdf.js](https://www.npmjs.com/package/pdfjs-dist) / [pdf-lib](https://www.npmjs.com/package/pdf-lib) | Apache-2.0 / MIT | 2026-08 / 2022 | **Intégrer** | Afficher et produire des PDF (étiquettes, dossiers) |
| ML Kit (`@react-native-ml-kit/text-recognition`) | MIT pour l'enveloppe, **SDK Google fermé** | 2025-09 | Éviter | Le moteur n'est pas open source |

## 3. Factures, paiements, comptabilité

| Projet | Licence | Actif | Verdict | Apport |
|---|---|---|---|---|
| [invoice2data](https://github.com/invoice-x/invoice2data) | MIT | 2026-09 | **Intégrer** (côté service) | Extrait numéro, date, montant, TVA d'une facture via des modèles par fournisseur |
| [factur-x](https://github.com/akretion/factur-x) | BSD | 2026-09 | **Intégrer** (côté service) | Lit et produit les factures électroniques Factur-X (norme franco-allemande, obligatoire en France à partir de 2026) |
| [ofx-js](https://www.npmjs.com/package/ofx-js) | MIT | 2026-09 | **Intégrer** | Lit les relevés bancaires OFX pour rapprocher paiement ↔ facture |
| [Dolibarr](https://github.com/Dolibarr/dolibarr) | GPL-3.0 | 2026-10 | Service / S'inspirer | ERP français complet : tiers, factures, stocks, projets |
| [ERPNext](https://github.com/frappe/erpnext) | GPL-3.0 | 2026-10 | S'inspirer | Modèle de données comptable et stock très complet |
| [Firefly III](https://github.com/firefly-iii/firefly-iii) | AGPL-3.0 | 2026-09 | Service | Finances personnelles, import bancaire, règles de rapprochement |
| Akaunting | **BSL** | — | Éviter | N'est plus open source |
| Invoice Ninja | **Elastic License** | — | Éviter | N'est pas open source |

## 4. Identifiants, QR, codes-barres, NFC (le lien physique ↔ numérique)

| Projet | Licence | Actif | Verdict | Apport |
|---|---|---|---|---|
| [react-native-vision-camera](https://www.npmjs.com/package/react-native-vision-camera) | MIT | 2026-08 | **Intégrer** | Lecture QR et codes-barres en temps réel sur mobile |
| [ZXing](https://github.com/zxing/zxing) / [@zxing/library](https://www.npmjs.com/package/@zxing/library) | Apache-2.0 | 2026-09 / 2026-04 | **Intégrer** | Lecture QR / codes-barres sur le web |
| [node-qrcode](https://www.npmjs.com/package/qrcode) | MIT | 2025-11 | **Intégré** | Génère les QR des étiquettes (déjà utilisé) |
| [bwip-js](https://www.npmjs.com/package/bwip-js) | MIT | 2026-08 | **Intégrer** | Génère plus de 100 formats de codes-barres (Code 128, DataMatrix…) |
| [react-native-nfc-manager](https://www.npmjs.com/package/react-native-nfc-manager) | MIT | 2026-09 | **Intégrer** | Lire et écrire des puces NFC sur Android et iOS |

## 5. Objets, équipements, stock, emplacements

| Projet | Licence | Actif | Verdict | Apport |
|---|---|---|---|---|
| [InvenTree](https://github.com/inventree/InvenTree) | MIT | 2026-09 | **Service** / S'inspirer | Stock, emplacements hiérarchiques, numéros de série, étiquettes, API REST |
| [Grocy](https://github.com/grocy/grocy) | MIT | 2026-09 | S'inspirer | Stock de la maison, dates, consommation |
| [Homebox](https://github.com/sysadminsmedia/homebox) | AGPL-3.0 | 2026-09 | S'inspirer | Inventaire domestique : lieux, garanties, factures jointes |
| [Snipe-IT](https://github.com/snipe/snipe-it) | AGPL-3.0 | 2026-09 | S'inspirer | Équipements, attribution à des personnes, maintenance |

## 6. Livres et bibliothèque physique

| Projet | Licence | Actif | Verdict | Apport |
|---|---|---|---|---|
| [Open Library](https://openlibrary.org/developers/api) | AGPL-3.0 (code), données ouvertes | 2026-09 | **Service** (API publique) | ISBN → titre, auteur, éditeur, couverture |
| [Calibre](https://github.com/kovidgoyal/calibre) | GPL-3.0 | 2026-10 | S'inspirer | Gestion de bibliothèque, métadonnées, formats |

## 7. Archives et gestion documentaire (organisation, recherche)

| Projet | Licence | Actif | Verdict | Apport |
|---|---|---|---|---|
| [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | GPL-3.0 | 2026-09 | **Service** / S'inspirer | Le plus proche de la vision document : OCR, numéros d'archive (ASN) à imprimer sur l'original, correspondants, étiquettes, règles automatiques |
| [Papermerge](https://github.com/papermerge/papermerge-core) | Apache-2.0 | 2026-09 | S'inspirer | Archives avec arborescence de dossiers |
| [Mayan EDMS](https://github.com/mayan-edms/Mayan-EDMS) | Apache-2.0 | 2026-05 | S'inspirer | Versions de documents, flux de validation, métadonnées |
| [Teedy](https://github.com/sismics/docs) | GPL-2.0 | 2026-08 | Éviter | GPL-2.0 seule, incompatible avec la GPL-3.0 |

## 8. Journal, notes, projets, missions

| Projet | Licence | Actif | Verdict | Apport |
|---|---|---|---|---|
| [Joplin](https://github.com/laurent22/joplin) | AGPL-3.0 | 2026-10 | S'inspirer | Notes hors ligne, chiffrement, synchronisation |
| [Logseq](https://github.com/logseq/logseq) | AGPL-3.0 | 2026-10 | S'inspirer | Journal quotidien + graphe de relations entre notes |
| [Vikunja](https://github.com/go-vikunja/vikunja) | AGPL-3.0 | 2026-10 | Service | Tâches et projets |
| [Plane](https://github.com/makeplane/plane) | AGPL-3.0 | 2026-09 | S'inspirer | Gestion de projet |

## 9. Synchronisation, hors ligne, traçabilité

| Projet | Licence | Actif | Verdict | Apport |
|---|---|---|---|---|
| [expo-sqlite](https://www.npmjs.com/package/expo-sqlite) | MIT | 2026-09 | **Intégrer** | Base locale sur le téléphone (déjà dans la pile Expo) |
| [RxDB](https://www.npmjs.com/package/rxdb) | Apache-2.0 | 2026-08 | **Intégrer** | Base réactive hors ligne avec réplication |
| [PouchDB](https://www.npmjs.com/package/pouchdb) + [CouchDB](https://github.com/apache/couchdb) | Apache-2.0 | 2025-10 / 2026-09 | Intégrer + Service | Synchronisation multi-appareils éprouvée, gestion des conflits |
| [Automerge](https://www.npmjs.com/package/@automerge/automerge) / [Yjs](https://www.npmjs.com/package/yjs) | MIT | 2026-09 | **Intégrer** | Données qui fusionnent sans conflit entre appareils, historique complet |
| [MiniSearch](https://www.npmjs.com/package/minisearch) / [Orama](https://www.npmjs.com/package/@orama/orama) | MIT / Apache-2.0 | 2025-09 / 2026-07 | **Intégrer** | Recherche plein texte locale dans toutes les réalités |
| [Immich](https://github.com/immich-app/immich) | AGPL-3.0 | 2026-09 | Service | Photothèque auto-hébergée (photos des réalités) |
| Meilisearch | MIT **+ BSL** (édition entreprise) | — | Prudence | Seule la partie MIT est open source |
| immudb | **BSL** | — | Éviter | Le journal chaîné SHA-256 d'Empreinte couvre déjà ce besoin |
| [W3C PROV](https://www.w3.org/TR/prov-overview/) | Standard ouvert | — | S'inspirer | Vocabulaire standard de la provenance (entité, activité, agent) pour la traçabilité |

---

## Pile recommandée pour la première version

1. **Application** : Bible Strong (Expo / React Native), renommée et réorganisée en Empreinte.
2. **Moteur** : `@empreinte/core` (déjà écrit) dans l'app.
3. **Capturer** : expo-camera + document-scanner-plugin + tesseract.js.
4. **Relier** : vision-camera (lecture QR), node-qrcode + bwip-js (étiquettes), nfc-manager.
5. **Stocker** : expo-sqlite (local) puis RxDB ou PouchDB/CouchDB pour la synchronisation.
6. **Chercher** : MiniSearch.
7. **Services optionnels** (serveur à côté) : invoice2data + factur-x pour les factures, InvenTree pour un gros stock, Paperless-ngx pour une archive documentaire importante.
