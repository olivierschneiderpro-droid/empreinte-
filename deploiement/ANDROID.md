# Empreinte sur Android (Google Play)

L'app Android est une **Trusted Web Activity** : elle ouvre `https://lavérité.tech/app/` en plein
écran, sans barre de navigateur, avec son icône. Elle marche sur téléphone, tablette et
Chromebook, et chaque mise à jour du site arrive dans l'app sans republier.

| Élément | Où |
|---|---|
| Projet Android (généré avec Bubblewrap) | `android/` |
| Identifiant de l'app | `tech.laverite.empreinte` |
| Compilation (.aab et .apk) | sur le VPS : `scripts/compiler-android.sh` (ou GitHub Actions) |
| Manifeste, icônes, service worker | `deploiement/pwa/` (servis sous `/app/` par le serveur) |
| Lien de confiance app ↔ domaine | `/.well-known/assetlinks.json` (`deploiement/pwa/assetlinks.json`) |
| Textes et images de la fiche | `deploiement/play-store/` |
| Confidentialité / suppression de compte | `presentation/confidentialite.html`, `presentation/suppression-compte.html` |

Android Auto n'est pas possible avec ce type d'app : il faudra une app native (Bible audio et
chants dans la voiture), à faire plus tard.

## 1. Compiler l'app sur le VPS

En SSH sur le VPS :

```bash
sudo bash /home/empreinte/empreinte-/scripts/compiler-android.sh 1.0.0
```

- La première fois, le script installe Java et les outils Android (quelques minutes).
- Il demande ensuite la **clé d'envoi** : collez le contenu du fichier
  `empreinte-upload.keystore.base64`, puis son mot de passe (`mot-de-passe.txt`). Ils restent
  dans `/root/empreinte-cle`, lisible par root seulement. Gardez aussi les fichiers d'origine en
  lieu sûr : sans eux, il faut demander à Google de changer de clé.
- À la fin, il affiche deux liens de téléchargement : le `.aab` pour le Play Store et le `.apk`
  pour essayer sur un téléphone (`https://lavérité.tech/telechargements/…`).
- Le numéro de version interne (versionCode) augmente tout seul à chaque compilation.

Le workflow GitHub « App Android (Play Store) » fait la même chose quand GitHub Actions
fonctionne (secrets `ANDROID_KEYSTORE_BASE64` et `ANDROID_KEYSTORE_PASSWORD`).

## 2. La clé de Google (une seule fois)

Après le premier envoi, le Play Console signe l'app avec sa propre clé. Dans **Intégrité de
l'application → Signature d'application**, copiez l'empreinte **SHA-256 du certificat de la clé
de signature d'application**, puis sur le VPS :

```bash
sudo bash /home/empreinte/empreinte-/scripts/compiler-android.sh --cle-google AA:BB:CC:…
```

Sans elle, l'app installée depuis le Play Store affiche une barre d'adresse au lieu d'être en
plein écran. Vérification : https://developers.google.com/digital-asset-links/tools/generator

## 3. Le Play Console

1. **Créer l'application** : nom « Empreinte », langue par défaut Français, Application, Gratuite.
2. **Tests → Test fermé** (ou Test interne pour commencer) : créer une version, envoyer le `.aab`.
3. **Intégrité de l'application → Signature d'application** : ajoutez l'empreinte de la clé
   de Google (voir l'étape 2).
4. **Fiche principale** : textes de `deploiement/play-store/fiche.md`, icône
   `icone-512.png`, bannière `banniere-1024x500.png`, captures d'écran (au moins 2 pour le
   téléphone ; 7 et 10 pouces pour la tablette).
5. **Contenu de l'application** :
   - Politique de confidentialité : `https://xn--lavrit-dvad.tech/confidentialite.html`
   - Accès à l'application : toutes les fonctions sont accessibles sans identifiants
     (le compte est facultatif).
   - Annonces : non.
   - Classification du contenu : questionnaire IARC (référence / éducation ; contenu religieux).
   - Public cible : 13 ans et plus.
   - **Sécurité des données** :
     - Données collectées : nom et adresse e-mail (gestion du compte, facultatif) ; contenu
       créé par l'utilisateur (notes, surlignages, études : fonctionnalités de l'app,
       facultatif) ; activité dans l'app et identifiants (statistiques : Google Analytics for
       Firebase) ; journaux de plantage et diagnostics (Sentry).
     - Partagées avec des tiers : non (prestataires techniques seulement).
     - Chiffrées en transit : oui. Suppression possible : oui,
       `https://xn--lavrit-dvad.tech/suppression-compte.html` (et dans l'app : Profil →
       Supprimer mon compte).
6. **Publication** : un compte personnel récent doit faire tourner un test fermé (12 testeurs
   pendant 14 jours) avant de demander l'accès à la production.

## Mettre à jour l'app

Le contenu se met à jour avec le site. Il ne faut recompiler l'app que si l'icône, le nom, les
couleurs ou les réglages Android changent : relancez le script avec une version plus haute.
