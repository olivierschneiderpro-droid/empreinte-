#!/usr/bin/env bash
# Empreinte · Compile l'app Android (Trusted Web Activity) sur le VPS, sans GitHub Actions.
#
#   sudo bash /home/empreinte/empreinte-/scripts/compiler-android.sh 1.0.0
#
# La première fois, le script installe Java et les outils Android (quelques minutes), puis
# demande la clé d'envoi : collez le contenu du fichier « empreinte-upload.keystore.base64 »
# et son mot de passe. Ils sont gardés dans /root/empreinte-cle (lisible par root seulement).
# Les fichiers produits (.aab pour le Play Store, .apk pour essayer) se téléchargent ensuite
# depuis https://lavérité.tech/telechargements/.
#
# Ajouter l'empreinte SHA-256 de la clé de Google (Play Console → Intégrité de l'application),
# pour que l'app s'ouvre en plein écran :
#   sudo bash /home/empreinte/empreinte-/scripts/compiler-android.sh --cle-google AA:BB:…
set -euo pipefail

ICI=$(cd "$(dirname "$0")/.." && pwd)
CLES=/root/empreinte-cle
SDK=/opt/android-sdk
MAISON=$(getent passwd empreinte | cut -d: -f6)
SORTIE=$MAISON/empreinte-telechargements
OUTILS=commandlinetools-linux-11076708_latest.zip
dire() { printf '\n\033[1m▸ %s\033[0m\n' "$*"; }

[ "$(id -u)" = 0 ] || { echo "Lancez ce script avec sudo."; exit 1; }
mkdir -p "$CLES" && chmod 700 "$CLES"

# --- Empreinte de la clé de Google : le lien de confiance app ↔ domaine -------------------
if [ "${1:-}" = "--cle-google" ]; then
  GOOGLE=${2:?"Indiquez l'empreinte SHA-256, par exemple AA:BB:CC:…"}
  python3 - "$ICI/deploiement/pwa/assetlinks.json" "$GOOGLE" "$MAISON/empreinte-assetlinks.json" <<'EOF'
import json, sys
depot, google, sortie = sys.argv[1], sys.argv[2].strip().upper(), sys.argv[3]
liens = json.load(open(depot))
empreintes = liens[0]["target"]["sha256_cert_fingerprints"]
if google not in empreintes:
    empreintes.append(google)
json.dump(liens, open(sortie, "w"), indent=2)
print("Empreintes :", ", ".join(empreintes))
EOF
  chown empreinte: "$MAISON/empreinte-assetlinks.json"
  echo "✔ https://lavérité.tech/.well-known/assetlinks.json contient maintenant la clé de Google."
  exit 0
fi

VERSION=${1:-1.0.0}

dire "Java"
if ! command -v javac >/dev/null || ! javac -version 2>&1 | grep -Eq ' (17|21)\.'; then
  apt-get update -qq
  apt-get install -y -qq openjdk-21-jdk-headless unzip >/dev/null 2>&1 ||
    apt-get install -y -qq openjdk-17-jdk-headless unzip >/dev/null
fi
JAVA=$( (ls -d /usr/lib/jvm/java-21-openjdk-* /usr/lib/jvm/java-17-openjdk-* 2>/dev/null || true) | head -1)
export JAVA_HOME=$JAVA PATH="$JAVA/bin:$PATH"
java -version 2>&1 | head -1

dire "Outils Android"
if [ ! -x "$SDK/cmdline-tools/latest/bin/sdkmanager" ]; then
  command -v unzip >/dev/null || apt-get install -y -qq unzip >/dev/null
  TMP=$(mktemp -d)
  curl -fsSL "https://dl.google.com/android/repository/$OUTILS" -o "$TMP/outils.zip"
  mkdir -p "$SDK/cmdline-tools"
  unzip -q "$TMP/outils.zip" -d "$TMP"
  rm -rf "$SDK/cmdline-tools/latest"
  mv "$TMP/cmdline-tools" "$SDK/cmdline-tools/latest"
  rm -rf "$TMP"
fi
export ANDROID_HOME=$SDK ANDROID_SDK_ROOT=$SDK
yes | "$SDK/cmdline-tools/latest/bin/sdkmanager" --licenses >/dev/null 2>&1 || true
"$SDK/cmdline-tools/latest/bin/sdkmanager" "platforms;android-36" "build-tools;35.0.0" >/dev/null

dire "Clé d'envoi"
CLE=$CLES/empreinte-upload.keystore
if [ ! -s "$CLE" ]; then
  echo "Collez le contenu du fichier empreinte-upload.keystore.base64, puis appuyez sur Entrée :"
  read -r BASE64
  printf '%s' "$BASE64" | tr -d ' \r\n' | base64 -d > "$CLE"
fi
if [ ! -s "$CLES/mot-de-passe" ]; then
  read -rsp "Mot de passe de la clé (contenu de mot-de-passe.txt) : " MDP && echo
  printf '%s' "$MDP" > "$CLES/mot-de-passe"
fi
chmod 600 "$CLE" "$CLES/mot-de-passe"
MDP=$(cat "$CLES/mot-de-passe")
if ! keytool -list -keystore "$CLE" -storepass "$MDP" >/dev/null 2>&1; then
  echo "✘ La clé ou le mot de passe ne correspond pas. Effacez $CLES et relancez le script."
  exit 1
fi
echo "✔ Clé prête."

# Chaque envoi au Play Store demande un numéro de version interne plus grand.
CODE=$(( $(cat "$CLES/version-code" 2>/dev/null || echo 0) + 1 ))

dire "Compilation de la version $VERSION ($CODE)"
CHANTIER=/root/empreinte-android
rm -rf "$CHANTIER" && cp -r "$ICI/android" "$CHANTIER"
cd "$CHANTIER"
sed -i "s/versionName \".*\"/versionName \"$VERSION\"/" app/build.gradle
chmod +x gradlew
ANDROID_KEYSTORE_PATH=$CLE ANDROID_KEYSTORE_PASSWORD=$MDP ANDROID_KEY_ALIAS=empreinte \
  ANDROID_VERSION_CODE=$CODE ./gradlew --no-daemon -q bundleRelease assembleRelease
echo "$CODE" > "$CLES/version-code"

mkdir -p "$SORTIE"
NOM=empreinte-$VERSION-$CODE
cp app/build/outputs/bundle/release/app-release.aab "$SORTIE/$NOM.aab"
cp app/build/outputs/apk/release/app-release.apk "$SORTIE/$NOM.apk"
chown -R empreinte: "$SORTIE"

cat <<EOF

✔ App Android prête : version $VERSION (numéro interne $CODE)

  Pour le Play Store : https://lavérité.tech/telechargements/$NOM.aab
  Pour essayer sur un téléphone : https://lavérité.tech/telechargements/$NOM.apk

Envoyez le .aab dans le Play Console (Tests → créer une version).
EOF
